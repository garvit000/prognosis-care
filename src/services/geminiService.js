/**
 * Gemini AI Service — calls Google Generative Language API
 * to produce symptom-based triage recommendations.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Build the prompt that instructs Gemini to return structured JSON.
 */
function buildPrompt(symptoms) {
  return `You are a medical AI triage assistant for Prognosis Care, a healthcare platform in India.

A patient describes the following symptoms:
"${symptoms}"

Based on the symptoms, provide:
1. A short medical summary (2-3 sentences) explaining the likely concern and why tests are needed.
2. A list of 3-5 recommended diagnostic tests (ordered by priority).

IMPORTANT: Respond ONLY with valid JSON in the exact format below — no markdown, no backticks, no extra text:
{
  "summary": "Your 2-3 sentence medical summary here.",
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
- Use realistic Indian hospital test costs in INR (₹500–₹5000 range).
- Prioritise tests that are medically relevant.
- Do NOT diagnose; only recommend tests.
- Respond with pure JSON only.`;
}

/**
 * Parse Gemini response text into a structured { summary, tests } object.
 * Attempts JSON.parse, falls back to regex extraction if the model wraps
 * the JSON in markdown code fences.
 */
function parseGeminiResponse(text) {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  try {
    const parsed = JSON.parse(cleaned);
    // Validate shape
    if (parsed.summary && Array.isArray(parsed.tests)) {
      return parsed;
    }
  } catch {
    // Attempt regex extraction as last resort
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const fallback = JSON.parse(jsonMatch[0]);
        if (fallback.summary && Array.isArray(fallback.tests)) {
          return fallback;
        }
      } catch {
        // fall through to default
      }
    }
  }

  // If nothing works, return a generic response
  return {
    summary: text.slice(0, 300),
    tests: [],
  };
}

/**
 * Call Gemini API with patient symptoms, return { summary, tests }.
 */
export async function fetchGeminiRecommendations(symptoms) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured.');
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: buildPrompt(symptoms) }],
        },
      ],
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
