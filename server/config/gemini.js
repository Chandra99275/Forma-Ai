// ==============================================
// Forma AI - Gemini Configuration
// ==============================================

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// ==============================================
// Load Environment Variables
// ==============================================

dotenv.config();

// ==============================================
// Get Gemini API Key
// ==============================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Please check server/.env"
  );
}

// ==============================================
// Initialize Gemini AI
// ==============================================

const genAI = new GoogleGenAI({
  apiKey,
});

// ==============================================
// Gemini Model
// ==============================================
//
// This model will be used for:
// - PDF recognition
// - Image recognition
// - Insurance document extraction
// - Claim information extraction
// - OCR-style document understanding
// - Structured JSON generation
//
// ==============================================

export const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-2.5-flash";

// ==============================================
// Export Gemini Client
// ==============================================

export default genAI;