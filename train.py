"""
AI Healthcare Triage Engine — Training Pipeline
=================================================
Merges 9 medical specialty datasets (45,000 records), engineers features,
and trains a multi-output classifier that predicts:
  1. Disease (38 classes)
  2. Normal / Abnormal (derived from vitals)
  3. Risk Level (Low / Medium / High)

Saves model, preprocessor, label encoders, and evaluation metrics to model/.
"""

import os
import json
import warnings
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler, OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    classification_report,
    confusion_matrix,
)
import joblib

warnings.filterwarnings("ignore")

# ── paths ──────────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "Data")
MODEL_DIR = os.path.join(BASE_DIR, "model")
os.makedirs(MODEL_DIR, exist_ok=True)

# Disease → Specialty mapping (for predict.py)
SPECIALTY_MAP = {
    # Cardiology
    "Myocardial Infarction": "Cardiology",
    "Arrhythmia": "Cardiology",
    "Hypertension": "Cardiology",
    "Coronary Artery Disease": "Cardiology",
    "Heart Failure": "Cardiology",
    # Dermatology
    "Psoriasis": "Dermatology",
    "Acne": "Dermatology",
    "Skin Infection": "Dermatology",
    "Eczema": "Dermatology",
    # Endocrinology
    "Hypothyroidism": "Endocrinology",
    "PCOS": "Endocrinology",
    "Hyperthyroidism": "Endocrinology",
    "Diabetes": "Endocrinology",
    # ENT
    "Otitis Media": "ENT",
    "Sinusitis": "ENT",
    "Tonsillitis": "ENT",
    "Hearing Loss": "ENT",
    # Neurology
    "Multiple Sclerosis": "Neurology",
    "Parkinson's Disease": "Neurology",
    "Epilepsy": "Neurology",
    "Stroke": "Neurology",
    "Migraine": "Neurology",
    # Nutrition & Dietetics
    "Malnutrition": "Nutrition & Dietetics",
    "Eating Disorder": "Nutrition & Dietetics",
    "Obesity": "Nutrition & Dietetics",
    "Vitamin Deficiency": "Nutrition & Dietetics",
    # Oncology
    "Leukemia": "Oncology",
    "Breast Cancer": "Oncology",
    "Lymphoma": "Oncology",
    "Lung Cancer": "Oncology",
    # Pathology
    "Inflammation": "Pathology",
    "Anemia": "Pathology",
    "Clotting Disorder": "Pathology",
    "Infection": "Pathology",
    # Pulmonology
    "COPD": "Pulmonology",
    "Pneumonia": "Pulmonology",
    "Tuberculosis": "Pulmonology",
    "Asthma": "Pulmonology",
}


# ── 1. Load & merge ───────────────────────────────────────────────────────────
def load_and_merge() -> pd.DataFrame:
    """Read every CSV in Data/, tag with specialty, and concatenate."""
    frames = []
    for fname in sorted(os.listdir(DATA_DIR)):
        if not fname.endswith(".csv"):
            continue
        specialty = fname.replace("_dataset_5000.csv", "").replace("_", " ").title()
        df = pd.read_csv(os.path.join(DATA_DIR, fname))
        df["Specialty"] = specialty
        frames.append(df)
    merged = pd.concat(frames, ignore_index=True)
    print(f"[INFO] Loaded {len(merged):,} rows from {len(frames)} files")
    return merged


# ── 2. Feature engineering ─────────────────────────────────────────────────────

# Base severity for each disease
DISEASE_BASE_RISK = {
    # High Risk
    "Myocardial Infarction": "High",
    "Heart Failure": "High",
    "Stroke": "High",
    "Pneumonia": "High",
    "Leukemia": "High",
    "Lung Cancer": "High",
    "Lymphoma": "High",
    "Clotting Disorder": "High",
    # Medium Risk
    "Hypertension": "Medium",
    "Coronary Artery Disease": "Medium",
    "Arrhythmia": "Medium",
    "Diabetes": "Medium",
    "Hyperthyroidism": "Medium",
    "Hypothyroidism": "Medium",
    "Multiple Sclerosis": "Medium",
    "Parkinson's Disease": "Medium",
    "Epilepsy": "Medium",
    "COPD": "Medium",
    "Asthma": "Medium",
    "Tuberculosis": "Medium",
    "Anemia": "Medium",
    "Infection": "Medium",
    "Inflammation": "Medium",
    "Obesity": "Medium",
    "Eating Disorder": "Medium",
    "Malnutrition": "Medium",
    # Low Risk
    "Psoriasis": "Low",
    "Acne": "Low",
    "Skin Infection": "Low",
    "Eczema": "Low",
    "Otitis Media": "Low",
    "Sinusitis": "Low",
    "Tonsillitis": "Low",
    "Hearing Loss": "Low",
    "Migraine": "Low",
    "Vitamin Deficiency": "Low",
    "PCOS": "Low",
}

def parse_blood_pressure(bp_series: pd.Series) -> pd.DataFrame:
    """Split '149/86' → BP_Systolic=149, BP_Diastolic=86."""
    split = bp_series.str.split("/", expand=True).astype(float)
    split.columns = ["BP_Systolic", "BP_Diastolic"]
    return split


def derive_normal_abnormal(df: pd.DataFrame) -> pd.Series:
    """
    Derive Normal/Abnormal from vital-sign thresholds.
    Abnormal if ANY of:
      - Systolic BP ≥ 140  or ≤ 90
      - Diastolic BP ≥ 90  or ≤ 60
      - Heart Rate > 100   or < 60
      - Temperature > 100.4 or < 96.0
    """
    abnormal = (
        (df["BP_Systolic"] >= 140)
        | (df["BP_Systolic"] <= 90)
        | (df["BP_Diastolic"] >= 90)
        | (df["BP_Diastolic"] <= 60)
        | (df["Heart Rate"] > 100)
        | (df["Heart Rate"] < 60)
        | (df["Temperature"] > 100.4)
        | (df["Temperature"] < 96.0)
    )
    return abnormal.map({True: "Abnormal", False: "Normal"})


def derive_risk_level(df: pd.DataFrame) -> pd.Series:
    """
    Derive Risk Level based on Disease Severity + Vitals.
    
    Logic:
    1. Start with base risk from DISEASE_BASE_RISK.
    2. Escalate risk if Vitals are CRITICAL:
       - Systolic > 180 or < 80
       - Diastolic > 110 or < 50
       - HR > 120 or < 50
       - Temp > 103 or < 95
       → Bump Low to Medium, Medium to High.
    """
    # 1. Base risk
    base_risk = df["Disease"].map(DISEASE_BASE_RISK).fillna("Medium")
    
    # 2. Identify critical vitals
    critical_vitals = (
        (df["BP_Systolic"] > 180) | (df["BP_Systolic"] < 80) |
        (df["BP_Diastolic"] > 110) | (df["BP_Diastolic"] < 50) |
        (df["Heart Rate"] > 120) | (df["Heart Rate"] < 50) |
        (df["Temperature"] > 103) | (df["Temperature"] < 95)
    )
    
    # 3. Apply escalation
    # Map textual risk to numeric for easy escalation: Low=0, Medium=1, High=2
    risk_map = {"Low": 0, "Medium": 1, "High": 2}
    inv_map = {0: "Low", 1: "Medium", 2: "High"}
    
    numeric_risk = base_risk.map(risk_map)
    
    # Add 1 to risk level if critical (max 2)
    escalated_risk = numeric_risk.copy()
    escalated_risk[critical_vitals] += 1
    escalated_risk = escalated_risk.clip(upper=2)
    
    return escalated_risk.map(inv_map)


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add parsed BP columns, Normal/Abnormal target, derived Risk_Level, clean symptoms."""
    bp = parse_blood_pressure(df["Blood Pressure"])
    df = pd.concat([df, bp], axis=1)
    
    df["Normal_Abnormal"] = derive_normal_abnormal(df)
    
    # IMPORTANT: Overwrite dataset's random Risk_Level with derived logic
    df["Risk_Level"] = derive_risk_level(df)
    
    # Clean symptoms: lowercase, strip whitespace
    df["Detailed_Symptoms"] = (
        df["Detailed_Symptoms"].str.strip().str.lower()
    )
    return df


# ── 3. Build preprocessing + model pipeline ───────────────────────────────────
NUMERIC_FEATURES = ["Age", "BP_Systolic", "BP_Diastolic", "Heart Rate", "Temperature"]
CATEGORICAL_FEATURES = ["Gender"]
TEXT_FEATURE = "Detailed_Symptoms"


def build_preprocessor() -> ColumnTransformer:
    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERIC_FEATURES),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_FEATURES),
            ("text", TfidfVectorizer(max_features=500, stop_words="english"), TEXT_FEATURE),
        ],
        remainder="drop",
    )


def build_model():
    return MultiOutputClassifier(
        RandomForestClassifier(
            n_estimators=200,
            max_depth=30,
            min_samples_split=5,
            n_jobs=-1,
            random_state=42,
            class_weight="balanced",
        )
    )


# ── 4. Evaluation helpers ─────────────────────────────────────────────────────
TARGET_NAMES = ["Disease", "Normal_Abnormal", "Risk_Level"]


def evaluate(model, X_test, y_test, label_encoders: dict):
    """Print metrics and return summary dict."""
    y_pred = model.predict(X_test)
    metrics = {}

    for i, target in enumerate(TARGET_NAMES):
        le = label_encoders[target]
        y_true_labels = le.inverse_transform(y_test[:, i])
        y_pred_labels = le.inverse_transform(y_pred[:, i])

        acc = accuracy_score(y_test[:, i], y_pred[:, i])
        f1 = f1_score(y_test[:, i], y_pred[:, i], average="weighted")

        metrics[target] = {"accuracy": round(acc, 4), "f1_weighted": round(f1, 4)}

        print(f"\n{'='*60}")
        print(f"  Target: {target}  |  Accuracy: {acc:.4f}  |  F1: {f1:.4f}")
        print(f"{'='*60}")
        print(classification_report(y_true_labels, y_pred_labels))

        # Confusion matrix plot
        cm = confusion_matrix(y_true_labels, y_pred_labels, labels=le.classes_)
        fig, ax = plt.subplots(figsize=(max(8, len(le.classes_) * 0.6), max(6, len(le.classes_) * 0.5)))
        sns.heatmap(
            cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=le.classes_, yticklabels=le.classes_, ax=ax,
        )
        ax.set_title(f"Confusion Matrix — {target}")
        ax.set_xlabel("Predicted")
        ax.set_ylabel("Actual")
        plt.tight_layout()
        fig.savefig(os.path.join(MODEL_DIR, f"confusion_matrix_{target}.png"), dpi=120)
        plt.close(fig)
        print(f"  → Saved confusion_matrix_{target}.png")

    return metrics


# ── 5. Main training routine ──────────────────────────────────────────────────
def main():
    # Load
    df = load_and_merge()

    # Feature engineering
    df = engineer_features(df)

    na_dist = df["Normal_Abnormal"].value_counts()
    print(f"\n[INFO] Normal/Abnormal distribution:\n{na_dist}\n")

    # Encode targets
    label_encoders = {}
    y_encoded = []
    for target in TARGET_NAMES:
        le = LabelEncoder()
        y_encoded.append(le.fit_transform(df[target]))
        label_encoders[target] = le
        print(f"[INFO] {target}: {len(le.classes_)} classes → {le.classes_.tolist()}")

    y = np.column_stack(y_encoded)

    # Build preprocessor & transform features
    preprocessor = build_preprocessor()
    X = preprocessor.fit_transform(df)
    print(f"\n[INFO] Feature matrix shape: {X.shape}")

    # Train/test split (stratify on Disease — the hardest target)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y[:, 0]
    )
    print(f"[INFO] Train: {X_train.shape[0]:,}  |  Test: {X_test.shape[0]:,}")

    # Train
    print("\n[INFO] Training multi-output RandomForest (200 trees) ...")
    model = build_model()
    model.fit(X_train, y_train)
    print("[INFO] Training complete.")

    # Evaluate
    metrics = evaluate(model, X_test, y_test, label_encoders)

    # Save everything
    joblib.dump(model, os.path.join(MODEL_DIR, "triage_model.joblib"))
    joblib.dump(preprocessor, os.path.join(MODEL_DIR, "preprocessor.joblib"))
    joblib.dump(label_encoders, os.path.join(MODEL_DIR, "label_encoders.joblib"))
    joblib.dump(SPECIALTY_MAP, os.path.join(MODEL_DIR, "specialty_map.joblib"))

    with open(os.path.join(MODEL_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"\n[INFO] All artifacts saved to {MODEL_DIR}/")
    print("[INFO] Files: triage_model.joblib, preprocessor.joblib, "
          "label_encoders.joblib, specialty_map.joblib, metrics.json")

    return metrics


if __name__ == "__main__":
    main()
