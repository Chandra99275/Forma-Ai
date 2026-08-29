import model from "../config/gemini.js";

export const parseClaim = async (description) => {
  try {
    const prompt = `
You are an insurance claim extraction assistant.

Extract structured information from the user's claim.

Return ONLY valid JSON.

{
  "incidentType": "",
  "vehicle": "",
  "damage": [],
  "location": "",
  "incidentDate": "",
  "summary": ""
}

Claim:
${description}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    const cleanJSON = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJSON);
  } catch (error) {
    throw new Error("Failed to parse claim with AI.");
  }
};