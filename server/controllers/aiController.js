import model from "../config/gemini.js";

// AI Prefill Controller
export const prefillForm = async (req, res) => {
  try {
    const { description } = req.body;

    const prompt = `
    Extract insurance claim information from this paragraph.

    Return ONLY JSON in this format:
    {
      "incidentType":"",
      "vehicle":"",
      "damage":[],
      "location":"",
      "summary":""
    }

    Claim:
    ${description}
    `;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    // Remove markdown if Gemini returns ```json
    const cleanJSON = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const extractedData = JSON.parse(cleanJSON);

    res.json({
      message: "AI fields extracted successfully.",
      extractedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "AI parsing failed.",
      error: error.message,
    });
  }
};