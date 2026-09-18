// ==============================================
// Forma AI - AI Parser Service
// File: server/services/aiParserService.js
// ==============================================

import model from "../config/gemini.js";

// ==============================================
// Gemini Retry Configuration
// ==============================================

const MAX_RETRIES = 3;
const RETRY_DELAY = 2500;

// ==============================================
// Wait Helper
// ==============================================

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// ==============================================
// Check if Gemini Error is Temporary
// ==============================================

const isTemporaryGeminiError = (error) => {
  const message = error?.message
    ? error.message.toLowerCase()
    : String(error).toLowerCase();

  return (
    message.includes("503") ||
    message.includes("unavailable") ||
    message.includes("high demand") ||
    message.includes("temporarily") ||
    message.includes("overloaded") ||
    message.includes("429") ||
    message.includes("rate limit") ||
    message.includes("resource exhausted")
  );
};

// ==============================================
// Generate Gemini Response With Retry
// ==============================================

const generateWithRetry = async (prompt) => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `🤖 Gemini request attempt ${attempt}/${MAX_RETRIES}...`
      );

      const result = await model.generateContent(prompt);

      return result;
    } catch (error) {
      lastError = error;

      console.error(
        `❌ Gemini request failed on attempt ${attempt}:`
      );
      console.error(error?.message || error);

      // ------------------------------------------
      // Only retry temporary Gemini errors
      // ------------------------------------------

      if (!isTemporaryGeminiError(error)) {
        throw error;
      }

      // ------------------------------------------
      // Stop if this was the final attempt
      // ------------------------------------------

      if (attempt === MAX_RETRIES) {
        break;
      }

      const delay = RETRY_DELAY * attempt;

      console.log(
        `⏳ Gemini is temporarily unavailable. Retrying in ${
          delay / 1000
        } seconds...`
      );

      await sleep(delay);
    }
  }

  throw lastError;
};

// ==============================================
// Parse Insurance Claim Description
// ==============================================

export const parseClaim = async (description) => {
  try {
    if (!description || description.trim() === "") {
      throw new Error("Description is required.");
    }

    const prompt = `
You are Forma AI, an AI-powered Insurance Claim Assistant.

Analyze the user's incident description and extract structured claim information.

Return ONLY valid JSON.

Insurance categories:
- vehicle
- health
- property
- travel
- life

Return JSON in this exact structure:

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
  "confidence": 0.95
}

Rules:

- Detect the correct insurance category automatically.
- Fill only relevant fields.
- Unknown fields must be empty strings.
- Confidence must be between 0 and 1.
- Do not include markdown.
- Do not include explanations.
- Return JSON only.

User Description:
${description}
`;

    console.log("=========================================");
    console.log("🤖 FORMA AI PARSER STARTED");
    console.log("=========================================");
    console.log("📝 Description:", description);
    console.log("🤖 Sending description to Gemini...");

    // ==========================================
    // Send request to Gemini
    // UPDATED:
    // Added retry handling for temporary 503/429
    // Gemini availability errors.
    // ==========================================

    const result = await generateWithRetry(prompt);

    const text = result.response.text();

    console.log("🤖 Gemini Raw Response:");
    console.log(text);

    // ==========================================
    // Clean Gemini Response
    // ==========================================

    const cleanJSON = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    console.log("🧹 Cleaned JSON:");
    console.log(cleanJSON);

    // ==========================================
    // Convert JSON String → JavaScript Object
    // ==========================================

    let parsed;

    try {
      parsed = JSON.parse(cleanJSON);
    } catch (error) {
      console.error("❌ Invalid JSON received from Gemini:");
      console.error(cleanJSON);

      throw new Error("Gemini returned invalid JSON.");
    }

    // ==========================================
    // Validate Category
    // ==========================================

    const allowedCategories = [
      "vehicle",
      "health",
      "property",
      "travel",
      "life",
    ];

    if (!allowedCategories.includes(parsed.category)) {
      console.warn("⚠️ Invalid category:", parsed.category);

      parsed.category = "vehicle";
    }

    // ==========================================
    // Ensure claimData Exists
    // ==========================================

    if (!parsed.claimData || typeof parsed.claimData !== "object") {
      parsed.claimData = {};
    }

    // ==========================================
    // Normalize Claim Data
    // ==========================================

    parsed.claimData = {
      applicantName: parsed.claimData.applicantName || "",
      email: parsed.claimData.email || "",
      phone: parsed.claimData.phone || "",
      policyNumber: parsed.claimData.policyNumber || "",
      incidentDate: parsed.claimData.incidentDate || "",
      location: parsed.claimData.location || "",
      description: description,

      vehicleNumber: parsed.claimData.vehicleNumber || "",
      vehicleModel: parsed.claimData.vehicleModel || "",
      damageType: parsed.claimData.damageType || "",

      hospitalName: parsed.claimData.hospitalName || "",
      patientName: parsed.claimData.patientName || "",
      injuryType: parsed.claimData.injuryType || "",

      propertyAddress: parsed.claimData.propertyAddress || "",
      propertyDamage: parsed.claimData.propertyDamage || "",

      travelDestination: parsed.claimData.travelDestination || "",
      travelIssue: parsed.claimData.travelIssue || "",

      nomineeName: parsed.claimData.nomineeName || "",
      causeOfDeath: parsed.claimData.causeOfDeath || "",
    };

    // ==========================================
    // Validate Summary
    // ==========================================

    if (!parsed.summary) {
      parsed.summary = "Insurance claim parsed successfully.";
    }

    // ==========================================
    // Validate Confidence
    // ==========================================

    if (
      typeof parsed.confidence !== "number" ||
      parsed.confidence < 0 ||
      parsed.confidence > 1
    ) {
      parsed.confidence = 0.5;
    }

    console.log("=========================================");
    console.log("✅ AI PARSER SUCCESS");
    console.log("📂 Category:", parsed.category);
    console.log("🎯 Confidence:", parsed.confidence);
    console.log("=========================================");

    return parsed;
  } catch (error) {
    console.error("=========================================");
    console.error("❌ AI PARSER ERROR");
    console.error("Message:", error.message);
    console.error("=========================================");

    throw new Error(
      error.message || "Failed to parse insurance claim."
    );
  }
};