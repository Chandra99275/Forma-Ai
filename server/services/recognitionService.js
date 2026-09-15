import ai from "../config/gemini.js";
import fs from "fs/promises";

const MODEL =
  process.env.GEMINI_MODEL || "gemini-2.5-flash";

const recognitionPrompt = `
You are Forma AI, an intelligent insurance document
and image analysis system.

Analyze the uploaded PDF or image carefully.

Extract ONLY information that is actually visible
or readable in the document.

DO NOT invent information.

If a field is not available, return null.

Your task is to identify:

1. Document type
2. Insurance category
3. Insurance company
4. Policy information
5. Claim information
6. Applicant/customer information
7. Incident information
8. Vehicle information
9. Property information
10. Medical information
11. Travel information
12. Important dates
13. Monetary amounts
14. Important extracted fields
15. Missing information
16. A concise document summary

Return ONLY valid JSON.

Use this exact structure:

{
  "documentType": "",
  "insuranceCategory": "",

  "confidence": 0,

  "summary": "",

  "insurer": {
    "name": null,
    "policyNumber": null,
    "claimNumber": null
  },

  "applicant": {
    "fullName": null,
    "phone": null,
    "email": null,
    "address": null,
    "dateOfBirth": null
  },

  "dates": {
    "policyStartDate": null,
    "policyEndDate": null,
    "incidentDate": null,
    "claimDate": null,
    "documentDate": null
  },

  "claim": {
    "claimType": null,
    "description": null,
    "claimAmount": null,
    "currency": null,
    "claimStatus": null
  },

  "vehicle": {
    "make": null,
    "model": null,
    "year": null,
    "registrationNumber": null,
    "vin": null,
    "damageDescription": null
  },

  "property": {
    "propertyType": null,
    "propertyAddress": null,
    "damageDescription": null,
    "estimatedDamageAmount": null
  },

  "medical": {
    "patientName": null,
    "hospitalName": null,
    "doctorName": null,
    "diagnosis": null,
    "treatment": null,
    "medicalAmount": null
  },

  "travel": {
    "travelerName": null,
    "destination": null,
    "departureDate": null,
    "returnDate": null,
    "travelIssue": null
  },

  "extractedFields": [
    {
      "field": "",
      "value": null,
      "confidence": 0
    }
  ],

  "missingInformation": [],

  "importantObservations": []
}

Rules:

- Do not guess.
- Do not hallucinate.
- Preserve numbers accurately.
- Preserve policy numbers accurately.
- Preserve claim numbers accurately.
- Preserve names accurately.
- Preserve dates accurately.
- If handwriting is unclear, mention it in importantObservations.
- Confidence must be between 0 and 100.
- extractedFields confidence must be between 0 and 100.
- insuranceCategory must normally be one of:
  "health",
  "vehicle",
  "property",
  "travel",
  "life",
  "unknown".

Return JSON only.
`;

function cleanJsonResponse(text) {
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  let cleaned = text.trim();

  // Remove markdown code fences if Gemini returns them.
  cleaned = cleaned.replace(/^```json\s*/i, "");
  cleaned = cleaned.replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");

  return cleaned.trim();
}

export async function analyzeDocument(filePath, mimeType) {
  let uploadedFile = null;

  try {
    console.log("Uploading document to Gemini...");
    console.log("File:", filePath);
    console.log("MIME:", mimeType);

    uploadedFile = await ai.files.upload({
      file: filePath,
      config: {
        mimeType,
      },
    });

    console.log("Gemini file uploaded:", uploadedFile.uri);

    const response = await ai.models.generateContent({
      model: MODEL,

      contents: [
        {
          role: "user",
          parts: [
            {
              text: recognitionPrompt,
            },
            {
              fileData: {
                mimeType: uploadedFile.mimeType || mimeType,
                fileUri: uploadedFile.uri,
              },
            },
          ],
        },
      ],

      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;

    const cleanedJson = cleanJsonResponse(responseText);

    let extractedData;

    try {
      extractedData = JSON.parse(cleanedJson);
    } catch (jsonError) {
      console.error("Gemini returned invalid JSON:");
      console.error(responseText);

      throw new Error(
        "Gemini returned invalid JSON."
      );
    }

    return extractedData;
  } finally {
    try {
      await fs.unlink(filePath);
      console.log("Temporary file deleted.");
    } catch (error) {
      console.warn(
        "Could not delete temporary file:",
        error.message
      );
    }
  }
}