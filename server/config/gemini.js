// ==============================================
// Forma AI - Gemini Configuration
// File: server/config/gemini.js
// ==============================================

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// ==============================================
// Load Environment Variables
// ==============================================

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
// Initialize Gemini Client
// ==============================================

const genAI = new GoogleGenAI({
  apiKey,
});

// ==============================================
// Gemini Model Configuration
// ==============================================
//
// Gemini 3.6 Flash supports:
// - OCR
// - Image Recognition
// - PDF Recognition
// - Insurance Document Extraction
// - Structured JSON Output
//
// ==============================================

export const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.6-flash";

// ==============================================
// OCR Prompt Template
// Used by recognitionService.js
// ==============================================

export const OCR_PROMPT = `
You are Forma AI Vision Engine for Insurance Claim Processing.

Analyze the uploaded document or image carefully.

Tasks:
1. Read ALL visible text exactly (OCR).
2. Detect the document type.
3. Extract insurance-related information.
4. Summarize any visible vehicle/property damage.
5. Return ONLY valid JSON.

Return this JSON structure:

{
  "confidence":"99%",
  "documentType":"",
  "applicantName":"",
  "ownerName":"",
  "vehicleNumber":"",
  "registrationNumber":"",
  "engineNumber":"",
  "chassisNumber":"",
  "incidentDate":"",
  "location":"",
  "incidentType":"",
  "damageSummary":"",
  "policyNumber":"",
  "claimNumber":"",
  "insurerName":"",
  "address":"",
  "phoneNumber":"",
  "rawText":""
}

Rules:
- Read text exactly as shown.
- Do not invent values.
- If a field is missing, return "".
- rawText must contain ALL readable text from the document.
- Return JSON only.
`;

// ==============================================
// Helper Function
// ==============================================

export const getGeminiModel = () => {
  return genAI.models;
};

// ==============================================
// Startup Logs
// ==============================================

console.log("==============================================");
console.log("🤖 FORMA AI GEMINI CONFIGURATION");
console.log("==============================================");
console.log("🔑 Gemini API Key :", apiKey ? "FOUND ✅" : "MISSING ❌");
console.log("🧠 Gemini Model   :", GEMINI_MODEL);
console.log("👁️ Vision OCR     : ENABLED");
console.log("📄 PDF Analysis   : ENABLED");
console.log("🖼️ Image Analysis : ENABLED");
console.log("==============================================");

// ==============================================
// Export Gemini Client
// ==============================================

export default genAI;