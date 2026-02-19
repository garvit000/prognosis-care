import pandas as pd
import random
from faker import Faker

fake = Faker()

genders = ["Male", "Female", "Other"]
symptoms_list = ["Fever", "Chest Pain", "Headache", "Cough", "Accident"]
conditions = ["Diabetes", "Hypertension", "None"]
arrival_modes = ["Walk-in", "Ambulance"]

data = []

# ---------- LOW RISK ----------
for i in range(1000):
    data.append([
        fake.uuid4(),
        random.randint(1, 50),
        random.choice(genders),
        random.choice(["Fever", "Cough", "Headache"]),
        random.randint(100, 120),     # BP
        random.randint(60, 90),       # HR
        round(random.uniform(97, 99), 1),
        random.randint(96, 100),      # Oxygen
        random.randint(12, 18),
        random.choice(conditions),
        random.choice(arrival_modes),
        "Low"
    ])

# ---------- MEDIUM RISK ----------
for i in range(1000):
    data.append([
        fake.uuid4(),
        random.randint(30, 70),
        random.choice(genders),
        random.choice(symptoms_list),
        random.randint(130, 150),
        random.randint(80, 110),
        round(random.uniform(99, 101), 1),
        random.randint(92, 96),
        random.randint(18, 24),
        random.choice(conditions),
        random.choice(arrival_modes),
        "Medium"
    ])

# ---------- HIGH RISK ----------
for i in range(1000):
    data.append([
        fake.uuid4(),
        random.randint(50, 90),
        random.choice(genders),
        random.choice(["Chest Pain", "Accident"]),
        random.randint(160, 180),
        random.randint(100, 130),
        round(random.uniform(100, 103), 1),
        random.randint(85, 92),
        random.randint(24, 30),
        random.choice(conditions),
        random.choice(arrival_modes),
        "High"
    ])

columns = ["Patient_ID","Age","Gender","Symptoms","Blood_Pressure",
           "Heart_Rate","Temperature","Oxygen_Saturation",
           "Respiratory_Rate","Preexisting_Conditions",
           "Arrival_Mode","Risk_Level"]

df = pd.DataFrame(data, columns=columns)

df.to_csv("synthetic_patient_triage_dataset.csv", index=False)

print("Balanced dataset created successfully!")
