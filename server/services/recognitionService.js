// ==========================================
// Forma AI - Document Recognition Service
// Gemini Vision OCR + Structured Extraction
// ==========================================

import fs from "fs/promises";
import ai, { GEMINI_MODEL } from "../config/gemini.js";

// ==========================================
// Gemini Retry Configuration
// ==========================================

const MAX_GEMINI_RETRIES = 3;

// Initial retry delay in milliseconds.
// Retry sequence:
// 3 seconds
// 6 seconds
// 12 seconds
const INITIAL_RETRY_DELAY = 3000;

// ==========================================
// Recognition Prompt
// ==========================================

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
- Extract only information visible or readable in the uploaded document.
- Preserve numbers accurately.
- Preserve policy numbers accurately.
- Preserve claim numbers accurately.
- Preserve names accurately.
- Preserve dates accurately.
- Preserve monetary values accurately.
- Preserve phone numbers accurately.
- Preserve email addresses accurately.
- Preserve vehicle registration numbers accurately.
- Preserve VIN/chassis numbers accurately.
- If handwriting is unclear, mention it in importantObservations.
- If text is partially unreadable, mention it in importantObservations.
- Confidence must be between 0 and 100.
- extractedFields confidence must be between 0 and 100.
- insuranceCategory must normally be one of:
  "health",
  "vehicle",
  "property",
  "travel",
  "life",
  "unknown".

Additional instructions:

- For health insurance documents, carefully extract policy holder,
  patient/member names, policy number, coverage amounts,
  hospital information, medical information, dates and benefits.

- For vehicle insurance documents, carefully extract vehicle make,
  model, year, registration number, VIN/chassis number,
  incident details and damage information.

- For property insurance documents, carefully extract property
  address, property type, damage information and estimated loss.

- For travel insurance documents, carefully extract traveler,
  destination, departure date, return date and travel issue.

- For life insurance documents, carefully extract policy holder,
  nominee/beneficiary information when visible, policy details,
  dates and monetary amounts.

- Do not create fields that are not supported by the document.
- If a section does not apply to the document, keep its values null.
- Return a valid JSON object only.
- Do not return Markdown.
- Do not wrap the JSON in code fences.
`;

// ==========================================
// Sleep Helper
// ==========================================

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// ==========================================
// Determine Whether Gemini Error Is Retryable
// ==========================================

function isRetryableGeminiError(error) {
  if (!error) {
    return false;
  }

  const status =
    Number(error.status) ||
    Number(error.code) ||
    Number(error?.error?.code) ||
    Number(error?.response?.status);

  const message =
    error?.message ||
    error?.error?.message ||
    "";

  const normalizedMessage =
    String(message).toLowerCase();

  // Gemini temporary service errors
  if (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return true;
  }

  // Sometimes the SDK exposes the error message
  // without a directly accessible status code.
  if (
    normalizedMessage.includes("high demand") ||
    normalizedMessage.includes("temporarily unavailable") ||
    normalizedMessage.includes("service unavailable") ||
    normalizedMessage.includes("unavailable") ||
    normalizedMessage.includes("overloaded") ||
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("too many requests") ||
    normalizedMessage.includes("internal server error")
  ) {
    return true;
  }

  return false;
}

// ==========================================
// Get Gemini Error Status
// ==========================================

function getGeminiErrorStatus(error) {
  return (
    Number(error?.status) ||
    Number(error?.code) ||
    Number(error?.error?.code) ||
    Number(error?.response?.status) ||
    null
  );
}

// ==========================================
// Get Gemini Error Message
// ==========================================

function getGeminiErrorMessage(error) {
  if (!error) {
    return "Unknown Gemini error.";
  }

  if (error?.error?.message) {
    return error.error.message;
  }

  if (error?.message) {
    return error.message;
  }

  return String(error);
}

// ==========================================
// Clean Gemini JSON Response
// ==========================================

function cleanJsonResponse(text) {
  if (!text) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  let cleaned = String(text).trim();

  // Remove ```json ... ```
  cleaned = cleaned.replace(
    /^```json\s*/i,
    ""
  );

  // Remove ``` ... ```
  cleaned = cleaned.replace(
    /^```\s*/i,
    ""
  );

  cleaned = cleaned.replace(
    /\s*```$/i,
    ""
  );

  return cleaned.trim();
}

// ==========================================
// Normalize Nested Object
// ==========================================

function normalizeObject(value, defaults) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return {
      ...defaults,
    };
  }

  return {
    ...defaults,
    ...value,
  };
}

// ==========================================
// Generate Recognition With Retry
// ==========================================

async function generateRecognitionWithRetry(
  uploadedFile,
  mimeType
) {
  let lastError = null;

  for (
    let attempt = 1;
    attempt <= MAX_GEMINI_RETRIES + 1;
    attempt++
  ) {
    try {
      console.log(
        `Gemini analysis attempt ${attempt}/${MAX_GEMINI_RETRIES + 1}`
      );

      const response =
        await ai.models.generateContent({
          model: GEMINI_MODEL,

          contents: [
            {
              role: "user",

              parts: [
                {
                  text: recognitionPrompt,
                },

                {
                  fileData: {
                    mimeType:
                      uploadedFile.mimeType ||
                      mimeType,

                    fileUri:
                      uploadedFile.uri,
                  },
                },
              ],
            },
          ],

          config: {
            temperature: 0.1,

            responseMimeType:
              "application/json",
          },
        });

      console.log(
        "Gemini recognition response received."
      );

      return response;
    } catch (error) {
      lastError = error;

      const status =
        getGeminiErrorStatus(error);

      const message =
        getGeminiErrorMessage(error);

      const retryable =
        isRetryableGeminiError(error);

      console.error(
        "--------------------------------------"
      );

      console.error(
        `Gemini attempt ${attempt} failed`
      );

      console.error(
        "Status:",
        status || "Unknown"
      );

      console.error(
        "Message:",
        message
      );

      console.error(
        "Retryable:",
        retryable
      );

      console.error(
        "--------------------------------------"
      );

      // Do not retry permanent errors.
      if (!retryable) {
        throw error;
      }

      // If this was the final attempt,
      // throw the original Gemini error.
      if (
        attempt >
        MAX_GEMINI_RETRIES
      ) {
        console.error(
          "Gemini retry limit reached."
        );

        throw error;
      }

      const delay =
        INITIAL_RETRY_DELAY *
        Math.pow(2, attempt - 1);

      console.log(
        `Gemini service temporarily unavailable.`
      );

      console.log(
        `Retrying in ${delay / 1000} seconds...`
      );

      await sleep(delay);
    }
  }

  throw lastError ||
    new Error(
      "Gemini recognition failed."
    );
}

// ==========================================
// Analyze Insurance Document
// ==========================================

export async function analyzeDocument(
  filePath,
  mimeType
) {
  let uploadedFile = null;

  try {
    // ==========================================
    // Validate Input
    // ==========================================

    if (!filePath) {
      throw new Error(
        "Document file path is missing."
      );
    }

    if (!mimeType) {
      throw new Error(
        "Document MIME type is missing."
      );
    }

    console.log(
      "======================================"
    );

    console.log(
      "FORMA AI DOCUMENT RECOGNITION"
    );

    console.log(
      "======================================"
    );

    console.log(
      "AI Model:",
      GEMINI_MODEL
    );

    console.log(
      "File:",
      filePath
    );

    console.log(
      "MIME:",
      mimeType
    );

    // ==========================================
    // Upload Document to Gemini
    // ==========================================

    console.log(
      "Uploading document to Gemini..."
    );

    uploadedFile =
      await ai.files.upload({
        file: filePath,

        config: {
          mimeType,
        },
      });

    if (
      !uploadedFile ||
      !uploadedFile.uri
    ) {
      throw new Error(
        "Gemini file upload failed. No file URI was returned."
      );
    }

    console.log(
      "Gemini file uploaded:",
      uploadedFile.uri
    );

    console.log(
      "Gemini uploaded MIME:",
      uploadedFile.mimeType ||
        mimeType
    );

    // ==========================================
    // Generate AI Recognition Result
    // With Automatic Retry
    // ==========================================

    console.log(
      "Analyzing document with Gemini..."
    );

    console.log(
      "Using model:",
      GEMINI_MODEL
    );

    const response =
      await generateRecognitionWithRetry(
        uploadedFile,
        mimeType
      );

    // ==========================================
    // Read Gemini Response
    // ==========================================

    const responseText =
      response?.text;

    if (!responseText) {
      throw new Error(
        "Gemini did not return any recognition result."
      );
    }

    console.log(
      "Gemini recognition response received."
    );

    // ==========================================
    // Clean JSON
    // ==========================================

    const cleanedJson =
      cleanJsonResponse(
        responseText
      );

    // ==========================================
    // Parse JSON
    // ==========================================

    let extractedData;

    try {
      extractedData =
        JSON.parse(cleanedJson);
    } catch (jsonError) {
      console.error(
        "======================================"
      );

      console.error(
        "GEMINI INVALID JSON RESPONSE"
      );

      console.error(
        "======================================"
      );

      console.error(
        responseText
      );

      console.error(
        "JSON Parse Error:",
        jsonError.message
      );

      throw new Error(
        "Gemini returned invalid JSON."
      );
    }

    // ==========================================
    // Basic Response Validation
    // ==========================================

    if (
      typeof extractedData !==
        "object" ||
      extractedData === null ||
      Array.isArray(extractedData)
    ) {
      throw new Error(
        "Gemini returned an invalid recognition object."
      );
    }

    // ==========================================
    // Normalize Top-Level Fields
    // ==========================================

    extractedData.documentType =
      extractedData.documentType ??
      null;

    extractedData.insuranceCategory =
      extractedData.insuranceCategory ??
      "unknown";

    // Normalize insurance category
    const allowedCategories = [
      "health",
      "vehicle",
      "property",
      "travel",
      "life",
      "unknown",
    ];

    if (
      !allowedCategories.includes(
        String(
          extractedData.insuranceCategory
        ).toLowerCase()
      )
    ) {
      extractedData.insuranceCategory =
        "unknown";
    } else {
      extractedData.insuranceCategory =
        String(
          extractedData.insuranceCategory
        ).toLowerCase();
    }

    extractedData.confidence =
      typeof extractedData.confidence ===
      "number"
        ? Math.max(
            0,
            Math.min(
              100,
              extractedData.confidence
            )
          )
        : 0;

    extractedData.summary =
      extractedData.summary ??
      "";

    // ==========================================
    // Normalize Nested Objects
    // ==========================================

    extractedData.insurer =
      normalizeObject(
        extractedData.insurer,
        {
          name: null,
          policyNumber: null,
          claimNumber: null,
        }
      );

    extractedData.applicant =
      normalizeObject(
        extractedData.applicant,
        {
          fullName: null,
          phone: null,
          email: null,
          address: null,
          dateOfBirth: null,
        }
      );

    extractedData.dates =
      normalizeObject(
        extractedData.dates,
        {
          policyStartDate: null,
          policyEndDate: null,
          incidentDate: null,
          claimDate: null,
          documentDate: null,
        }
      );

    extractedData.claim =
      normalizeObject(
        extractedData.claim,
        {
          claimType: null,
          description: null,
          claimAmount: null,
          currency: null,
          claimStatus: null,
        }
      );

    extractedData.vehicle =
      normalizeObject(
        extractedData.vehicle,
        {
          make: null,
          model: null,
          year: null,
          registrationNumber: null,
          vin: null,
          damageDescription: null,
        }
      );

    extractedData.property =
      normalizeObject(
        extractedData.property,
        {
          propertyType: null,
          propertyAddress: null,
          damageDescription: null,
          estimatedDamageAmount: null,
        }
      );

    extractedData.medical =
      normalizeObject(
        extractedData.medical,
        {
          patientName: null,
          hospitalName: null,
          doctorName: null,
          diagnosis: null,
          treatment: null,
          medicalAmount: null,
        }
      );

    extractedData.travel =
      normalizeObject(
        extractedData.travel,
        {
          travelerName: null,
          destination: null,
          departureDate: null,
          returnDate: null,
          travelIssue: null,
        }
      );

    // ==========================================
    // Normalize Arrays
    // ==========================================

    extractedData.extractedFields =
      Array.isArray(
        extractedData.extractedFields
      )
        ? extractedData.extractedFields
        : [];

    extractedData.missingInformation =
      Array.isArray(
        extractedData.missingInformation
      )
        ? extractedData.missingInformation
        : [];

    extractedData.importantObservations =
      Array.isArray(
        extractedData.importantObservations
      )
        ? extractedData.importantObservations
        : [];

    // ==========================================
    // Normalize Extracted Field Confidence
    // ==========================================

    extractedData.extractedFields =
      extractedData.extractedFields.map(
        (item) => ({
          field:
            item?.field ?? "",

          value:
            item?.value ?? null,

          confidence:
            typeof item?.confidence ===
            "number"
              ? Math.max(
                  0,
                  Math.min(
                    100,
                    item.confidence
                  )
                )
              : 0,
        })
      );

    // ==========================================
    // Final Logging
    // ==========================================

    console.log(
      "======================================"
    );

    console.log(
      "DOCUMENT RECOGNITION SUCCESS"
    );

    console.log(
      "======================================"
    );

    console.log(
      "Document Type:",
      extractedData.documentType
    );

    console.log(
      "Insurance Category:",
      extractedData.insuranceCategory
    );

    console.log(
      "Confidence:",
      `${extractedData.confidence}%`
    );

    console.log(
      "======================================"
    );

    return extractedData;
  } catch (error) {
    console.error(
      "======================================"
    );

    console.error(
      "FORMA AI RECOGNITION SERVICE ERROR"
    );

    console.error(
      "======================================"
    );

    const status =
      getGeminiErrorStatus(error);

    const message =
      getGeminiErrorMessage(error);

    console.error(
      "Status:",
      status || "Unknown"
    );

    console.error(
      "Message:",
      message
    );

    console.error(
      "Full error:",
      error
    );

    // ==========================================
    // Provide a clearer application error
    // ==========================================

    if (
      status === 503 ||
      String(message)
        .toLowerCase()
        .includes("high demand")
    ) {
      const temporaryError =
        new Error(
          "Gemini AI is temporarily unavailable due to high demand. Please try again in a few moments."
        );

      temporaryError.status = 503;

      throw temporaryError;
    }

    if (status === 429) {
      const rateLimitError =
        new Error(
          "Gemini API rate limit reached. Please wait a moment and try again."
        );

      rateLimitError.status = 429;

      throw rateLimitError;
    }

    throw error;
  } finally {
    // ==========================================
    // Delete Temporary Local File
    // ==========================================

    if (filePath) {
      try {
        await fs.unlink(
          filePath
        );

        console.log(
          "Temporary file deleted."
        );
      } catch (error) {
        console.warn(
          "Could not delete temporary file:",
          error.message
        );
      }
    }
  }
}