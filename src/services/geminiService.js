/**
 * Gemini AI Service — calls Google Generative Language API
 * to produce symptom-based triage recommendations.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Build the prompt that instructs Gemini to return structured JSON.
 */
function buildPrompt(symptoms, fileData = null) {
  let context = `You are a medical AI triage assistant for Prognosis Care, a healthcare platform in India.

A patient describes the following symptoms:
"${symptoms}"

First determine whether this input is actually health/symptom related.

Based on the symptoms, provide:
1. A short medical triage summary (1-3 sentences).
2. A list of recommended diagnostic tests ONLY if medically needed.
3. A risk assessment (Low/Medium/High) with a confidence score.
4. The most appropriate medical department for consultation.
5. Explainable AI reasoning: List 2-3 key factors explaining why you chose this risk level and department.

IMPORTANT: Respond ONLY with valid JSON in the exact format below — no markdown, no backticks, no extra text:
{
  "isHealthRelated": true,
  "summary": "Your 2-3 sentence medical summary here.",
  "riskLevel": "Low | Medium | High",
  "confidenceScore": 85,
  "recommendedDepartment": "General Medicine | Cardiology | Neurology | Orthopedics | etc.",
  "reasoning": [
    "Factor 1: e.g. Sudden onset of chest pain suggests cardiac issue.",
    "Factor 2: e.g. Age and history of hypertension increase risk."
  ],
  "tests": [
    {
      "id": "test-unique-id",
      "name": "Test Name",
      "reason": "Why this test is recommended for the given symptoms.",
      "priority": "high | medium | low",
      "cost": 1200
    }
  ]
}

Rules:
- If input is NOT health-related (for example: coding, math, random chat, jokes), return:
  - isHealthRelated: false
  - summary: "Please describe your health symptoms (for example: fever, cough, chest pain) so I can help."
  - tests: []
  - riskLevel: "Low"
  - confidenceScore: 0
  - recommendedDepartment: "General"
  - reasoning: []
- For isolated mild back pain/body pain/headache without red-flag symptoms, do not suggest blood tests/CRP/advanced panels by default.
- For mild isolated symptoms (for example only "headache" with no red flags), keep tests minimal or empty.
- Use realistic Indian hospital test costs in INR (₹500–₹5000 range) only when tests are needed.
- Prioritise tests that are clearly medically relevant.
- Do NOT diagnose; only provide triage guidance.
- Respond with pure JSON only.`;

  if (fileData) {
    context += `\n\n[Attached Medical Record/Image Analysis Required]`;
  }

  return context;
}

export function isLikelyHealthSymptomInput(input) {
  const text = (input || '').toLowerCase().trim();
  if (!text) return false;

  const genericOnlyInputs = new Set([
    'health',
    'healthy',
    'symptom',
    'symptoms',
    'medical',
    'doctor',
    'help',
    'hi',
    'hello',
  ]);

  if (genericOnlyInputs.has(text)) return false;

  const healthKeywords = [
    'pain',
    'headache',
    'fever',
    'cough',
    'cold',
    'vomit',
    'nausea',
    'dizziness',
    'breath',
    'chest',
    'bp',
    'blood pressure',
    'sugar',
    'diabetes',
    'fatigue',
    'weakness',
    'infection',
    'injury',
    'swelling',
    'rash',
    'stomach',
    'diarrhea',
    'constipation',
    'anxiety',
    'depression',
    'symptom',
  ];

  const hasHealthKeyword = healthKeywords.some((keyword) => text.includes(keyword));
  if (!hasHealthKeyword) return false;

  const meaningfulWords = text.split(/\s+/).filter(Boolean);
  return meaningfulWords.length >= 2 || text.includes('pain');
}

export function isSimpleLowRiskSymptomInput(input) {
  const text = (input || '').toLowerCase().trim();
  if (!text) return false;

  const lowRiskKeywords = [
    'back pain',
    'lower back pain',
    'body pain',
    'muscle pain',
    'neck pain',
    'headache',
    'mild pain',
    'soreness',
  ];

  const redFlagKeywords = [
    'severe',
    'unbearable',
    'chest pain',
    'shortness of breath',
    'breathing issue',
    'fainting',
    'numbness',
    'weakness in leg',
    'paralysis',
    'injury',
    'trauma',
    'accident',
    'fall',
    'fever',
    'weight loss',
    'blood in urine',
    'loss of bladder control',
    'loss of bowel control',
    'night sweats',
    'persistent vomiting',
  ];

  const hasLowRiskSymptom = lowRiskKeywords.some((keyword) => text.includes(keyword));
  const hasRedFlag = redFlagKeywords.some((keyword) => text.includes(keyword));

  return hasLowRiskSymptom && !hasRedFlag;
}

/**
 * Parse Gemini response text into a structured { summary, tests, riskLevel, ... } object.
 */
function parseGeminiResponse(text) {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const defaults = {
    isHealthRelated: true,
    summary: text.slice(0, 300),
    tests: [],
    riskLevel: 'Low',
    confidenceScore: 50,
    recommendedDepartment: 'General Medicine',
    reasoning: []
  };

  try {
    const parsed = JSON.parse(cleaned);
    // Validate shape
    if (parsed.summary && Array.isArray(parsed.tests)) {
      return { ...defaults, ...parsed };
    }
  } catch {
    // Attempt regex extraction as last resort
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const fallback = JSON.parse(jsonMatch[0]);
        if (fallback.summary && Array.isArray(fallback.tests)) {
          return { ...defaults, ...fallback };
        }
      } catch {
        // fall through to default
      }
    }
  }

  return defaults;
}

/**
 * Call Gemini API with patient symptoms (and optional file), return analysis.
 */
export async function fetchGeminiRecommendations(symptoms, fileBase64 = null, mimeType = null) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured.');
  }

  const parts = [{ text: buildPrompt(symptoms, fileBase64) }];

  if (fileBase64 && mimeType) {
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: fileBase64.split(',')[1] || fileBase64 // Ensure only raw base64 is sent
      }
    });
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Gemini API error:', response.status, errorBody);
    throw new Error(`Gemini API request failed (${response.status})`);
  }

  const json = await response.json();
  const textContent = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error('Empty response from Gemini API.');
  }

  return parseGeminiResponse(textContent);
}
