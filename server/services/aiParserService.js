// ==============================================
// Forma AI - AI Parser Service
// Description → Insurance Category → Structured Claim
// ==============================================

import model from "../config/gemini.js";

// ==============================================
// Parse Insurance Claim Description
// ==============================================

export const parseClaim = async (description) => {
  try {
    const prompt = `
You are Forma AI, an AI insurance claim assistant.

Analyze the user's incident description and determine:

1. Insurance category.
2. Extract important claim details.
3. Return ONLY valid JSON.

Insurance categories:
- vehicle
- health
- property
- travel
- life

Return JSON exactly in this format:

{
  "category": "vehicle",
  "claimData": {
    "applicantName": "",
    "email": "",
    "phone": "",
    "policyNumber": "",

    "incidentDate": "",
    "location": "",
    "description": "",

    "vehicleNumber": "",
    "vehicleModel": "",
    "damageType": "",

    "hospitalName": "",
    "patientName": "",
    "injuryType": "",

    "propertyAddress": "",
    "propertyDamage": "",

    "travelDestination": "",
    "travelIssue": "",

    "nomineeName": "",
    "causeOfDeath": ""
  },
  "summary": "",
  "confidence": 0.98
}

Rules:

- Detect the insurance category automatically.
- Fill only relevant fields.
- Leave unavailable fields as empty strings.
- Confidence must be between 0 and 1.
- Return JSON only.
- Do not return markdown.
- Do not return explanations.
- Do not wrap the JSON in code fences.

Incident Description:
${description}
`;

    console.log("🤖 Sending description to Gemini...");

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    console.log("🤖 Gemini Raw Response:");
    console.log(text);

    // Remove markdown code fences if Gemini still returns them
    const cleanJSON = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanJSON);
    } catch (jsonError) {
      console.error("❌ Gemini returned invalid JSON:");
      console.error(cleanJSON);

      throw new Error("Gemini returned invalid JSON.");
    }

    // Validate category
    const allowedCategories = [
      "vehicle",
      "health",
      "property",
      "travel",
      "life",
    ];

    if (!allowedCategories.includes(parsed.category)) {
      throw new Error(
        `Invalid insurance category returned by Gemini: ${parsed.category}`
      );
    }

    // Make sure claimData exists
    if (!parsed.claimData || typeof parsed.claimData !== "object") {
      parsed.claimData = {};
    }

    // Always include original description
    parsed.claimData = {
      ...parsed.claimData,
      description,
    };

    // Make sure confidence is valid
    if (
      typeof parsed.confidence !== "number" ||
      parsed.confidence < 0 ||
      parsed.confidence > 1
    ) {
      parsed.confidence = 0.5;
    }

    console.log("✅ Gemini parsing successful");
    console.log("Category:", parsed.category);
    console.log("Confidence:", parsed.confidence);

    return parsed;
  } catch (error) {
    console.error("=========================================");
    console.error("❌ AI PARSER ERROR");
    console.error("Message:", error.message);
    console.error("=========================================");

    throw new Error(
      error.message || "Failed to parse insurance claim using Gemini AI."
    );
  }
};