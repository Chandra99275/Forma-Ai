// ==============================================
// Forma AI - Gemini Configuration
// File: server/config/gemini.js
// Compatible with @google/genai v2.x
// ==============================================

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// ==============================================
// Validate API Key
// ==============================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "❌ GEMINI_API_KEY is missing. Please check your server/.env file."
  );
}

// ==============================================
// Gemini Client
// ==============================================

const genAI = new GoogleGenAI({
  apiKey,
});

// ==============================================
// Gemini Model
// IMPORTANT:
// Do NOT read GEMINI_MODEL from .env here.
// This prevents an old gemini-2.5-flash value
// from overriding the required model.
// ==============================================

export const GEMINI_MODEL = "gemini-3.6-flash";

// ==============================================
// Gemini Wrapper
//
// Existing services can continue using:
//
// model.generateContent(prompt)
//
// Internally this uses @google/genai v2.x.
// ==============================================

const model = {
  async generateContent(prompt) {
    try {
      console.log("=========================================");
      console.log("🤖 GEMINI REQUEST");
      console.log("=========================================");
      console.log("🧠 Model:", GEMINI_MODEL);

      if (!prompt || typeof prompt !== "string") {
        throw new Error("Gemini prompt must be a non-empty string.");
      }

      const result = await genAI.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      // ========================================
      // Extract generated text
      // ========================================

      let responseText = "";

      if (typeof result?.text === "string") {
        responseText = result.text;
      } else if (typeof result?.text === "function") {
        responseText = result.text();
      } else if (result?.candidates?.length) {
        responseText =
          result.candidates[0]?.content?.parts
            ?.map((part) => part.text || "")
            .join("") || "";
      }

      if (!responseText) {
        throw new Error("Gemini returned an empty response.");
      }

      console.log("✅ Gemini response received");
      console.log("=========================================");

      // ========================================
      // Return old-SDK-compatible structure
      // ========================================

      return {
        response: {
          text: () => responseText,
        },
      };
    } catch (error) {
      console.error("=========================================");
      console.error("❌ GEMINI API ERROR");
      console.error("=========================================");
      console.error("Model:", GEMINI_MODEL);
      console.error("Message:", error.message);
      console.error("=========================================");

      throw error;
    }
  },
};

// ==============================================
// OCR Prompt
// ==============================================

export const OCR_PROMPT = `
You are Forma AI Vision Engine for Insurance Claim Processing.

Analyze the uploaded document or image carefully.

Tasks:

1. Read all visible text exactly.
2. Detect the document type.
3. Extract insurance-related information.
4. Identify relevant claim information.
5. Summarize visible vehicle, property, health, or other damage.
6. Return ONLY valid JSON.

Return this JSON structure:

{
  "confidence": "99%",
  "documentType": "",
  "applicantName": "",
  "ownerName": "",
  "vehicleNumber": "",
  "registrationNumber": "",
  "engineNumber": "",
  "chassisNumber": "",
  "incidentDate": "",
  "location": "",
  "incidentType": "",
  "damageSummary": "",
  "policyNumber": "",
  "claimNumber": "",
  "insurerName": "",
  "address": "",
  "phoneNumber": "",
  "rawText": ""
}

Rules:

- Read text exactly as shown.
- Do not invent values.
- If a field is missing, return "".
- rawText must contain all readable text.
- Return JSON only.
- Do not use markdown.
- Do not wrap the JSON in code fences.
`;

// ==============================================
// Helper Function
// ==============================================

export const getGeminiModel = () => {
  return model;
};

// ==============================================
// Startup Logs
// ==============================================

console.log("==============================================");
console.log("🤖 FORMA AI GEMINI CONFIGURATION");
console.log("==============================================");
console.log(
  "🔑 Gemini API Key :",
  apiKey ? "FOUND ✅" : "MISSING ❌"
);
console.log("🧠 Gemini Model   :", GEMINI_MODEL);
console.log("📦 SDK            : @google/genai v2.x");
console.log("👁️ Vision OCR     : ENABLED");
console.log("📄 PDF Analysis   : ENABLED");
console.log("🖼️ Image Analysis : ENABLED");
console.log("==============================================");

// ==============================================
// Export Model
// ==============================================

export default model; 