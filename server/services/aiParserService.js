// ==============================================
// Forma AI - AI Parser Service
// File: server/services/aiParserService.js
// ==============================================

import model from "../config/gemini.js";

// ==============================================
// Gemini Retry Configuration
// ==============================================

// Keep this low during demo/review.
// We don't want the UI waiting ~50 seconds when Gemini is overloaded.
const MAX_RETRIES = 1;
const RETRY_DELAY = 1500;

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

      if (!isTemporaryGeminiError(error)) {
        throw error;
      }

      if (attempt === MAX_RETRIES) {
        break;
      }

      const delay = RETRY_DELAY * attempt;

      console.log(
        `⏳ Gemini temporarily unavailable. Retrying in ${
          delay / 1000
        } seconds...`
      );

      await sleep(delay);
    }
  }

  throw lastError;
};

// ==============================================
// Empty Claim Data
// ==============================================

const createEmptyClaimData = (description) => ({
  applicantName: "",
  email: "",
  phone: "",
  policyNumber: "",
  incidentDate: "",
  location: "",
  description: description || "",

  vehicleNumber: "",
  vehicleModel: "",
  damageType: "",

  hospitalName: "",
  patientName: "",
  injuryType: "",

  propertyAddress: "",
  propertyDamage: "",

  travelDestination: "",
  travelIssue: "",

  nomineeName: "",
  causeOfDeath: "",
});

// ==============================================
// Local Fallback Parser
// Used only when Gemini is temporarily unavailable
// ==============================================

const localFallbackParser = (description) => {
  const text = description.trim();
  const lower = text.toLowerCase();

  let category = "vehicle";

  // ------------------------------------------
  // Detect Insurance Category
  // ------------------------------------------

  if (
    lower.includes("hospital") ||
    lower.includes("medical") ||
    lower.includes("health") ||
    lower.includes("injury") ||
    lower.includes("surgery") ||
    lower.includes("doctor")
  ) {
    category = "health";
  } else if (
    lower.includes("house") ||
    lower.includes("home") ||
    lower.includes("property") ||
    lower.includes("building") ||
    lower.includes("fire damage") ||
    lower.includes("flood damage")
  ) {
    category = "property";
  } else if (
    lower.includes("flight") ||
    lower.includes("travel") ||
    lower.includes("trip") ||
    lower.includes("baggage") ||
    lower.includes("luggage")
  ) {
    category = "travel";
  } else if (
    lower.includes("life insurance") ||
    lower.includes("death") ||
    lower.includes("deceased") ||
    lower.includes("nominee")
  ) {
    category = "life";
  } else if (
    lower.includes("car") ||
    lower.includes("vehicle") ||
    lower.includes("bike") ||
    lower.includes("motorcycle") ||
    lower.includes("accident")
  ) {
    category = "vehicle";
  }

  const claimData = createEmptyClaimData(text);

  // ------------------------------------------
  // Extract Date
  // Examples:
  // 28 July 2026
  // 28/07/2026
  // 28-07-2026
  // ------------------------------------------

  const writtenDateMatch = text.match(
    /\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/i
  );

  const numericDateMatch = text.match(
    /\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b/
  );

  if (writtenDateMatch) {
    claimData.incidentDate = writtenDateMatch[0];
  } else if (numericDateMatch) {
    claimData.incidentDate = numericDateMatch[0];
  }

  // ------------------------------------------
  // Common Location Detection
  // ------------------------------------------

  const knownLocations = [
    "Hyderabad",
    "Warangal",
    "Bengaluru",
    "Bangalore",
    "Chennai",
    "Mumbai",
    "Delhi",
    "Pune",
    "Kolkata",
    "Vijayawada",
    "Visakhapatnam",
  ];

  const detectedLocation = knownLocations.find((location) =>
    lower.includes(location.toLowerCase())
  );

  if (detectedLocation) {
    claimData.location = detectedLocation;
  }

  // ------------------------------------------
  // Vehicle Claim Extraction
  // ------------------------------------------

  if (category === "vehicle") {
    const damageKeywords = [
      "headlight",
      "headlights",
      "steering",
      "bumper",
      "door",
      "doors",
      "windshield",
      "windscreen",
      "mirror",
      "mirrors",
      "tyre",
      "tire",
      "engine",
      "bonnet",
      "hood",
      "wheel",
      "wheels",
    ];

    const damages = damageKeywords.filter((item) =>
      lower.includes(item)
    );

    if (damages.length > 0) {
      claimData.damageType = damages.join(", ");
    } else if (
      lower.includes("damaged") ||
      lower.includes("damage") ||
      lower.includes("accident")
    ) {
      claimData.damageType = "Accident damage";
    }

    const vehicleNumberMatch = text.match(
      /\b[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{4}\b/i
    );

    if (vehicleNumberMatch) {
      claimData.vehicleNumber =
        vehicleNumberMatch[0].toUpperCase();
    }
  }

  // ------------------------------------------
  // Health Claim Extraction
  // ------------------------------------------

  if (category === "health") {
    if (lower.includes("accident")) {
      claimData.injuryType = "Accident-related injury";
    } else if (lower.includes("injury")) {
      claimData.injuryType = "Injury";
    } else if (lower.includes("surgery")) {
      claimData.injuryType = "Surgery / medical treatment";
    }
  }

  // ------------------------------------------
  // Property Claim Extraction
  // ------------------------------------------

  if (category === "property") {
    if (lower.includes("fire")) {
      claimData.propertyDamage = "Fire damage";
    } else if (lower.includes("flood")) {
      claimData.propertyDamage = "Flood damage";
    } else if (lower.includes("damage")) {
      claimData.propertyDamage = "Property damage";
    }
  }

  // ------------------------------------------
  // Travel Claim Extraction
  // ------------------------------------------

  if (category === "travel") {
    if (
      lower.includes("baggage") ||
      lower.includes("luggage")
    ) {
      claimData.travelIssue = "Baggage issue";
    } else if (
      lower.includes("cancelled") ||
      lower.includes("canceled")
    ) {
      claimData.travelIssue = "Trip/flight cancellation";
    } else if (lower.includes("delay")) {
      claimData.travelIssue = "Travel delay";
    }
  }

  // ------------------------------------------
  // Life Claim Extraction
  // ------------------------------------------

  if (category === "life") {
    if (
      lower.includes("accident") &&
      (lower.includes("death") ||
        lower.includes("deceased"))
    ) {
      claimData.causeOfDeath = "Accident";
    }
  }

  console.log("=========================================");
  console.log("⚠️ LOCAL FALLBACK PARSER USED");
  console.log("📂 Category:", category);
  console.log("📅 Date:", claimData.incidentDate || "Not detected");
  console.log("📍 Location:", claimData.location || "Not detected");
  console.log("=========================================");

  return {
    category,
    claimData,
    summary:
      "Claim information extracted successfully using temporary fallback processing.",
    confidence: 0.75,
  };
};

// ==============================================
// Normalize Parsed Result
// ==============================================

const normalizeParsedResult = (parsed, description) => {
  const allowedCategories = [
    "vehicle",
    "health",
    "property",
    "travel",
    "life",
  ];

  if (!allowedCategories.includes(parsed.category)) {
    parsed.category = "vehicle";
  }

  const source =
    parsed.claimData && typeof parsed.claimData === "object"
      ? parsed.claimData
      : {};

  parsed.claimData = {
    applicantName: source.applicantName || "",
    email: source.email || "",
    phone: source.phone || "",
    policyNumber: source.policyNumber || "",
    incidentDate: source.incidentDate || "",
    location: source.location || "",
    description: description,

    vehicleNumber: source.vehicleNumber || "",
    vehicleModel: source.vehicleModel || "",
    damageType: source.damageType || "",

    hospitalName: source.hospitalName || "",
    patientName: source.patientName || "",
    injuryType: source.injuryType || "",

    propertyAddress: source.propertyAddress || "",
    propertyDamage: source.propertyDamage || "",

    travelDestination: source.travelDestination || "",
    travelIssue: source.travelIssue || "",

    nomineeName: source.nomineeName || "",
    causeOfDeath: source.causeOfDeath || "",
  };

  if (!parsed.summary) {
    parsed.summary = "Insurance claim parsed successfully.";
  }

  if (
    typeof parsed.confidence !== "number" ||
    parsed.confidence < 0 ||
    parsed.confidence > 1
  ) {
    parsed.confidence = 0.5;
  }

  return parsed;
};

// ==============================================
// Parse Insurance Claim Description
// ==============================================

export const parseClaim = async (description) => {
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

  try {
    console.log("🤖 Sending description to Gemini...");

    const result = await generateWithRetry(prompt);

    const text = result.response.text();

    console.log("🤖 Gemini Raw Response:");
    console.log(text);

    const cleanJSON = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanJSON);
    } catch (error) {
      console.error("❌ Gemini returned invalid JSON.");

      throw new Error("Gemini returned invalid JSON.");
    }

    parsed = normalizeParsedResult(parsed, description);

    console.log("=========================================");
    console.log("✅ AI PARSER SUCCESS");
    console.log("📂 Category:", parsed.category);
    console.log("🎯 Confidence:", parsed.confidence);
    console.log("=========================================");

    return parsed;
  } catch (error) {
    console.error("=========================================");
    console.error("❌ GEMINI PARSER ERROR");
    console.error("Message:", error?.message || error);
    console.error("=========================================");

    // ==========================================
    // IMPORTANT:
    // Only use fallback for temporary Gemini
    // availability/quota problems.
    // ==========================================

    if (isTemporaryGeminiError(error)) {
      console.log(
        "⚠️ Gemini unavailable. Switching to local fallback..."
      );

      return localFallbackParser(description);
    }

    throw new Error(
      error?.message || "Failed to parse insurance claim."
    );
  }
};