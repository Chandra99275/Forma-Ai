// ==============================================
// Forma AI - Gemini Configuration
// ==============================================

import { GoogleGenerativeAI } from "@google/generative-ai";

// ==============================================
// Get API Key
// ==============================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Please check server/.env"
  );
}

// ==============================================
// Initialize Gemini
// ==============================================

const genAI = new GoogleGenerativeAI(apiKey);

// ==============================================
// Gemini Model
// ==============================================

const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
});

// ==============================================
// Export
// ==============================================

export default model;