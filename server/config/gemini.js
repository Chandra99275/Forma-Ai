import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gemini 1.5 Flash model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export default model;