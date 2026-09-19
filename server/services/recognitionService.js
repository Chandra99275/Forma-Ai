// ==========================================
// Forma AI - Document Recognition Service
// Gemini Vision OCR + Structured Extraction
//
// Supports:
// 1. Image Recognition
// 2. General Document Recognition
// 3. PDF Recognition
//
// IMPORTANT:
// - Uses GEMINI_MODEL from config/gemini.js
// - No hardcoded Gemini model
// - Image and PDF use the same Gemini client
// - 404/model errors are NOT retried
// - 429 quota/rate-limit errors are NOT retried
// - Temporary 500/502/503/504 errors are retried
// ==========================================

import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { GEMINI_MODEL } from "../config/gemini.js";

dotenv.config();

// ==========================================
// Gemini API Configuration
// ==========================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "❌ GEMINI_API_KEY is missing. Please check your server/.env file."
  );
}

const genAI = new GoogleGenAI({
  apiKey,
});

// ==========================================
// Gemini Retry Configuration
// ==========================================

const MAX_GEMINI_RETRIES = 3;
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

insuranceCategory must normally be one of:

"health"
"vehicle"
"property"
"travel"
"life"
"unknown"

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
// PDF Recognition Prompt
// ==========================================

const pdfRecognitionPrompt = `
You are Forma AI, an insurance PDF OCR and
structured document extraction system.

Read and analyze EVERY PAGE of the uploaded PDF.

IMPORTANT:

- Do NOT analyze only the first page.
- Read all pages.
- Extract all readable text from all pages.
- Preserve exact values visible in the PDF.
- Do not invent missing information.
- Do not guess.
- If something is not visible, return an empty string.
- If handwriting or scanned text is unclear, mention it.
- For vehicle insurance documents, prioritize vehicle,
  policy, applicant, incident and damage information.

Return ONLY valid JSON.

Use exactly this structure:

{
  "documentType": "",
  "insuranceCategory": "",
  "policyNumber": "",
  "claimNumber": "",
  "applicant": "",
  "insurer": "",
  "vehicle": "",
  "incident": "",
  "location": "",
  "date": "",
  "confidence": 0,
  "rawText": "",
  "importantObservations": []
}

Rules:

1. documentType:
   Identify the type of document visible in the PDF.

2. insuranceCategory:
   Normally use one of:
   "health"
   "vehicle"
   "property"
   "travel"
   "life"
   "unknown"

3. policyNumber:
   Extract the exact policy number if visible.

4. claimNumber:
   Extract the exact claim number if visible.

5. applicant:
   Extract the customer/policy holder/applicant name.

6. insurer:
   Extract the insurance company name.

7. vehicle:
   For vehicle insurance, include visible vehicle
   information such as make, model, registration,
   VIN/chassis and relevant vehicle details.

8. incident:
   Extract the complete readable incident/accident
   description.

9. location:
   Extract the accident/incident location.

10. date:
    Extract the most relevant incident/document date.

11. confidence:
    Return a number between 0 and 100.

12. rawText:
    IMPORTANT:
    Return the COMPLETE OCR text that you can read
    from ALL pages of the PDF.

13. importantObservations:
    Return an array containing important notes such as:
    - unreadable text
    - unclear handwriting
    - missing pages
    - partially visible information
    - scanned areas that could not be read

Do not return Markdown.

Do not return code fences.

Return JSON only.
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
// Get Gemini Suggested Retry Delay
// ==========================================

function getGeminiRetryDelay(error, fallbackDelay) {
  /*
   * Gemini may provide a retry delay such as:
   *
   * retryDelay: "9s"
   *
   * inside RetryInfo metadata.
   */

  const details =
    error?.error?.details ||
    error?.details ||
    error?.response?.data?.error?.details ||
    [];

  if (Array.isArray(details)) {
    const retryInfo = details.find(
      (detail) =>
        detail?.["@type"] ===
        "type.googleapis.com/google.rpc.RetryInfo"
    );

    const retryDelay = retryInfo?.retryDelay;

    if (retryDelay) {
      const secondsMatch =
        String(retryDelay).match(/([\d.]+)s/);

      if (secondsMatch) {
        const seconds = Number(secondsMatch[1]);

        if (Number.isFinite(seconds)) {
          return Math.max(seconds * 1000, 1000);
        }
      }
    }
  }

  return fallbackDelay;
}

// ==========================================
// Determine Whether Gemini Error Is Retryable
// ==========================================

function isRetryableGeminiError(error) {
  if (!error) {
    return false;
  }

  const status = getGeminiErrorStatus(error);
  const message = getGeminiErrorMessage(error);

  const normalizedMessage =
    String(message).toLowerCase();

  // ==========================================
  // NEVER RETRY MODEL / REQUEST NOT FOUND
  // ==========================================

  if (status === 404) {
    return false;
  }

  if (
    normalizedMessage.includes("not found") ||
    normalizedMessage.includes(
      "not available to new users"
    ) ||
    normalizedMessage.includes(
      "model is no longer available"
    ) ||
    (
      normalizedMessage.includes("model") &&
      normalizedMessage.includes("not available")
    )
  ) {
    return false;
  }

  // ==========================================
  // NEVER RETRY DAILY FREE-TIER QUOTA ERRORS
  // ==========================================

  if (
    normalizedMessage.includes(
      "generaterequestsperdayperproject-freetier"
    ) ||
    normalizedMessage.includes(
      "generate_requests_per_day"
    ) ||
    normalizedMessage.includes(
      "requests per day"
    ) ||
    normalizedMessage.includes(
      "quota exceeded"
    ) ||
    normalizedMessage.includes(
      "daily quota"
    ) ||
    normalizedMessage.includes(
      "per day per project"
    )
  ) {
    console.error(
      "🚫 Gemini daily quota exceeded. Request will NOT be retried."
    );

    return false;
  }

  // ==========================================
  // NEVER BLINDLY RETRY HTTP 429
  // ==========================================

  if (status === 429) {
    console.error(
      "🚫 Gemini returned HTTP 429."
    );

    console.error(
      "🚫 Request will NOT be automatically retried."
    );

    return false;
  }

  // ==========================================
  // RETRY TEMPORARY SERVER ERRORS
  // ==========================================

  if (
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return true;
  }

  // ==========================================
  // RETRY TEMPORARY ERROR MESSAGES
  // ==========================================

  if (
    normalizedMessage.includes("high demand") ||
    normalizedMessage.includes(
      "temporarily unavailable"
    ) ||
    normalizedMessage.includes(
      "service unavailable"
    ) ||
    normalizedMessage.includes("overloaded") ||
    normalizedMessage.includes(
      "internal server error"
    ) ||
    normalizedMessage.includes(
      "deadline exceeded"
    )
  ) {
    return true;
  }

  return false;
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

  cleaned = cleaned.replace(
    /^```json\s*/i,
    ""
  );

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
// Extract Response Text
// ==========================================

function extractResponseText(response) {
  if (!response) {
    return "";
  }

  if (
    typeof response?.text === "string"
  ) {
    return response.text.trim();
  }

  if (
    typeof response?.text === "function"
  ) {
    return String(
      response.text() || ""
    ).trim();
  }

  if (
    response?.candidates?.length
  ) {
    return (
      response.candidates[0]
        ?.content
        ?.parts
        ?.map(
          (part) =>
            part?.text || ""
        )
        .join("")
        .trim() || ""
    );
  }

  return "";
}

// ==========================================
// Normalize General Recognition Result
// ==========================================

function normalizeRecognitionResult(
  extractedData
) {
  if (
    typeof extractedData !== "object" ||
    extractedData === null ||
    Array.isArray(extractedData)
  ) {
    throw new Error(
      "Gemini returned an invalid recognition object."
    );
  }

  // ==========================================
  // Top-Level
  // ==========================================

  extractedData.documentType =
    extractedData.documentType ??
    null;

  extractedData.insuranceCategory =
    extractedData.insuranceCategory ??
    "unknown";

  extractedData.summary =
    extractedData.summary ??
    "";

  // ==========================================
  // Insurance Category
  // ==========================================

  const allowedCategories = [
    "health",
    "vehicle",
    "property",
    "travel",
    "life",
    "unknown",
  ];

  const normalizedCategory =
    String(
      extractedData.insuranceCategory
    )
      .toLowerCase()
      .trim();

  if (
    !allowedCategories.includes(
      normalizedCategory
    )
  ) {
    extractedData.insuranceCategory =
      "unknown";
  } else {
    extractedData.insuranceCategory =
      normalizedCategory;
  }

  // ==========================================
  // Confidence
  // ==========================================

  const confidence =
    Number(
      extractedData.confidence
    );

  extractedData.confidence =
    Number.isFinite(confidence)
      ? Math.max(
          0,
          Math.min(
            100,
            confidence
          )
        )
      : 0;

  // ==========================================
  // Insurer
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

  // ==========================================
  // Applicant
  // ==========================================

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

  // ==========================================
  // Dates
  // ==========================================

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

  // ==========================================
  // Claim
  // ==========================================

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

  // ==========================================
  // Vehicle
  // ==========================================

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

  // ==========================================
  // Property
  // ==========================================

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

  // ==========================================
  // Medical
  // ==========================================

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

  // ==========================================
  // Travel
  // ==========================================

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
  // Arrays
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
  // Normalize Field Confidence
  // ==========================================

  extractedData.extractedFields =
    extractedData.extractedFields.map(
      (item) => {
        const itemConfidence =
          Number(
            item?.confidence
          );

        return {
          field:
            item?.field ?? "",

          value:
            item?.value ?? null,

          confidence:
            Number.isFinite(
              itemConfidence
            )
              ? Math.max(
                  0,
                  Math.min(
                    100,
                    itemConfidence
                  )
                )
              : 0,
        };
      }
    );

  return extractedData;
}

// ==========================================
// Generate General Recognition With Retry
//
// Used by:
// - Image Recognition
// - General Document Recognition
// - AI Parser if it uses analyzeDocument()
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
        "======================================"
      );

      console.log(
        `Gemini analysis attempt ${attempt}/${MAX_GEMINI_RETRIES + 1}`
      );

      console.log(
        "Gemini Model:",
        GEMINI_MODEL
      );

      console.log(
        "Gemini MIME:",
        uploadedFile?.mimeType ||
          mimeType
      );

      console.log(
        "Gemini File URI:",
        uploadedFile?.uri
      );

      console.log(
        "======================================"
      );

      const response =
        await genAI.models.generateContent({
          model: GEMINI_MODEL,

          contents: [
            {
              role: "user",

              parts: [
                {
                  text:
                    recognitionPrompt,
                },

                {
                  fileData: {
                    mimeType:
                      uploadedFile?.mimeType ||
                      mimeType,

                    fileUri:
                      uploadedFile?.uri,
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
        "✅ Gemini recognition response received."
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
        `❌ Gemini attempt ${attempt} failed`
      );

      console.error(
        "Model:",
        GEMINI_MODEL
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

      // ==========================================
      // Do NOT retry non-retryable errors
      // Includes 404 and 429 quota errors
      // ==========================================

      if (!retryable) {
        console.log(
          "🚫 Gemini error will not be retried."
        );

        throw error;
      }

      // ==========================================
      // Retry limit
      // ==========================================

      if (
        attempt >=
        MAX_GEMINI_RETRIES + 1
      ) {
        console.error(
          "❌ Gemini retry limit reached."
        );

        throw error;
      }

      const exponentialDelay =
        INITIAL_RETRY_DELAY *
        Math.pow(
          2,
          attempt - 1
        );

      const delay =
        getGeminiRetryDelay(
          error,
          exponentialDelay
        );

      console.log(
        `⏳ Retrying in ${delay / 1000} seconds...`
      );

      await sleep(delay);
    }
  }

  throw (
    lastError ||
    new Error(
      "Gemini recognition failed."
    )
  );
}

// ==========================================
// Analyze Insurance Document
//
// Used by:
// - Image Recognition
// - General Document Recognition
// - AI Parser integrations
// ==========================================

export async function analyzeDocument(
  filePath,
  mimeType
) {
  let uploadedFile = null;

  try {
    // ==========================================
    // Validate
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
    // Upload
    // ==========================================

    console.log(
      "📤 Uploading document to Gemini..."
    );

    uploadedFile =
      await genAI.files.upload({
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
      "✅ Gemini file uploaded:",
      uploadedFile.uri
    );

    console.log(
      "Gemini uploaded MIME:",
      uploadedFile.mimeType ||
        mimeType
    );

    // ==========================================
    // Generate Recognition
    // ==========================================

    const response =
      await generateRecognitionWithRetry(
        uploadedFile,
        mimeType
      );

    // ==========================================
    // Read Response
    // ==========================================

    const responseText =
      extractResponseText(response);

    if (!responseText) {
      throw new Error(
        "Gemini did not return any recognition result."
      );
    }

    // ==========================================
    // Clean JSON
    // ==========================================

    const cleanedJson =
      cleanJsonResponse(
        responseText
      );

    // ==========================================
    // Parse
    // ==========================================

    let extractedData;

    try {
      extractedData =
        JSON.parse(
          cleanedJson
        );
    } catch (jsonError) {
      console.error(
        "======================================"
      );

      console.error(
        "❌ GEMINI INVALID JSON RESPONSE"
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
    // Normalize
    // ==========================================

    extractedData =
      normalizeRecognitionResult(
        extractedData
      );

    // ==========================================
    // Success
    // ==========================================

    console.log(
      "======================================"
    );

    console.log(
      "✅ DOCUMENT RECOGNITION SUCCESS"
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
      "❌ FORMA AI RECOGNITION SERVICE ERROR"
    );

    console.error(
      "======================================"
    );

    const status =
      getGeminiErrorStatus(error);

    const message =
      getGeminiErrorMessage(error);

    console.error(
      "Model:",
      GEMINI_MODEL
    );

    console.error(
      "Status:",
      status || "Unknown"
    );

    console.error(
      "Message:",
      message
    );

    // ==========================================
    // Model Error
    // ==========================================

    if (status === 404) {
      const modelError =
        new Error(
          `Gemini model "${GEMINI_MODEL}" is not available for this API request.`
        );

      modelError.status = 404;

      throw modelError;
    }

    // ==========================================
    // Temporary Error
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

    // ==========================================
    // Rate Limit / Quota
    // ==========================================

    if (status === 429) {
      const rateLimitError =
        new Error(
          "Gemini API quota/rate limit reached. The current Gemini project has reached its available request limit. Please wait for the quota to reset or use a Gemini API project/model with available quota."
        );

      rateLimitError.status = 429;

      throw rateLimitError;
    }

    throw error;
  } finally {
    // ==========================================
    // Delete Temporary File
    // ==========================================

    if (filePath) {
      try {
        await fs.unlink(
          filePath
        );

        console.log(
          "🗑️ Temporary file deleted."
        );
      } catch (deleteError) {
        console.warn(
          "⚠️ Could not delete temporary file:",
          deleteError.message
        );
      }
    }
  }
}

// ==========================================
// Generate PDF Recognition With Retry
//
// IMPORTANT:
// Uses GEMINI_MODEL from config/gemini.js.
//
// No hardcoded Gemini fallback.
// ==========================================

async function generatePDFRecognitionWithRetry(
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
        "======================================"
      );

      console.log(
        `📄 PDF Gemini attempt ${attempt}/${MAX_GEMINI_RETRIES + 1}`
      );

      console.log(
        "📄 PDF Model:",
        GEMINI_MODEL
      );

      console.log(
        "📄 PDF MIME:",
        uploadedFile?.mimeType ||
          mimeType ||
          "application/pdf"
      );

      console.log(
        "📄 PDF URI:",
        uploadedFile?.uri
      );

      console.log(
        "======================================"
      );

      const response =
        await genAI.models.generateContent({
          model: GEMINI_MODEL,

          contents: [
            {
              role: "user",

              parts: [
                {
                  text:
                    pdfRecognitionPrompt,
                },

                {
                  fileData: {
                    mimeType:
                      uploadedFile?.mimeType ||
                      mimeType ||
                      "application/pdf",

                    fileUri:
                      uploadedFile?.uri,
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
        "✅ PDF Gemini response received."
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
        `❌ PDF Gemini attempt ${attempt} failed`
      );

      console.error(
        "PDF Model:",
        GEMINI_MODEL
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

      // ==========================================
      // Do NOT retry 404/model errors
      // Do NOT retry 429 quota errors
      // ==========================================

      if (!retryable) {
        console.log(
          "🚫 PDF Gemini error will not be retried."
        );

        throw error;
      }

      // ==========================================
      // Retry limit
      // ==========================================

      if (
        attempt >=
        MAX_GEMINI_RETRIES + 1
      ) {
        console.error(
          "❌ PDF Gemini retry limit reached."
        );

        throw error;
      }

      const exponentialDelay =
        INITIAL_RETRY_DELAY *
        Math.pow(
          2,
          attempt - 1
        );

      const delay =
        getGeminiRetryDelay(
          error,
          exponentialDelay
        );

      console.log(
        `⏳ PDF retrying in ${delay / 1000} seconds...`
      );

      await sleep(delay);
    }
  }

  throw (
    lastError ||
    new Error(
      "PDF Gemini recognition failed."
    )
  );
}

// ==========================================
// Analyze PDF Document
//
// Used by:
// recognitionController.js
//
// recognizePDFDocument()
// ==========================================

export async function analyzePDFDocument(
  filePath,
  mimeType = "application/pdf",
  fileName = ""
) {
  let uploadedFile = null;

  try {
    // ==========================================
    // Validate
    // ==========================================

    if (!filePath) {
      throw new Error(
        "PDF file path is missing."
      );
    }

    const pdfMimeType =
      mimeType ||
      "application/pdf";

    // ==========================================
    // Header
    // ==========================================

    console.log(
      "======================================"
    );

    console.log(
      "📄 FORMA AI PDF RECOGNITION"
    );

    console.log(
      "======================================"
    );

    console.log(
      "Configured Model:",
      GEMINI_MODEL
    );

    console.log(
      "File:",
      fileName ||
        filePath
    );

    console.log(
      "MIME:",
      pdfMimeType
    );

    // ==========================================
    // Upload PDF
    // ==========================================

    console.log(
      "📤 Uploading PDF to Gemini..."
    );

    uploadedFile =
      await genAI.files.upload({
        file: filePath,

        config: {
          mimeType:
            pdfMimeType,
        },
      });

    if (
      !uploadedFile ||
      !uploadedFile.uri
    ) {
      throw new Error(
        "Gemini PDF upload failed. No file URI was returned."
      );
    }

    console.log(
      "✅ PDF uploaded to Gemini."
    );

    console.log(
      "PDF URI:",
      uploadedFile.uri
    );

    console.log(
      "PDF MIME:",
      uploadedFile.mimeType ||
        pdfMimeType
    );

    // ==========================================
    // Generate PDF Recognition
    // ==========================================

    const response =
      await generatePDFRecognitionWithRetry(
        uploadedFile,
        pdfMimeType
      );

    // ==========================================
    // Read Response
    // ==========================================

    let responseText =
      extractResponseText(
        response
      );

    if (!responseText) {
      throw new Error(
        "Gemini returned an empty PDF response."
      );
    }

    console.log(
      "✅ PDF AI response received."
    );

    // ==========================================
    // Clean JSON
    // ==========================================

    responseText =
      cleanJsonResponse(
        responseText
      );

    // ==========================================
    // Parse JSON
    // ==========================================

    let extractedData;

    try {
      extractedData =
        JSON.parse(
          responseText
        );
    } catch (jsonError) {
      console.error(
        "======================================"
      );

      console.error(
        "❌ INVALID PDF JSON RESPONSE"
      );

      console.error(
        "======================================"
      );

      console.error(
        responseText
      );

      console.error(
        "JSON Error:",
        jsonError.message
      );

      throw new Error(
        "Gemini returned invalid JSON for the PDF."
      );
    }

    // ==========================================
    // Validate
    // ==========================================

    if (
      !extractedData ||
      typeof extractedData !==
        "object" ||
      Array.isArray(
        extractedData
      )
    ) {
      throw new Error(
        "Gemini returned an invalid PDF recognition object."
      );
    }

    // ==========================================
    // Normalize Category
    // ==========================================

    const allowedCategories = [
      "health",
      "vehicle",
      "property",
      "travel",
      "life",
      "unknown",
    ];

    const normalizedCategory =
      String(
        extractedData.insuranceCategory ||
          "unknown"
      )
        .toLowerCase()
        .trim();

    const insuranceCategory =
      allowedCategories.includes(
        normalizedCategory
      )
        ? normalizedCategory
        : "unknown";

    // ==========================================
    // Normalize Confidence
    // ==========================================

    const confidenceValue =
      Number(
        extractedData.confidence
      );

    const confidence =
      Number.isFinite(
        confidenceValue
      )
        ? Math.max(
            0,
            Math.min(
              100,
              confidenceValue
            )
          )
        : 0;

    // ==========================================
    // Normalize Observations
    // ==========================================

    const importantObservations =
      Array.isArray(
        extractedData.importantObservations
      )
        ? extractedData.importantObservations
        : [];

    // ==========================================
    // Normalize Raw Text
    // ==========================================

    const rawText =
      typeof extractedData.rawText ===
      "string"
        ? extractedData.rawText
        : "";

    // ==========================================
    // Final Result
    // ==========================================

    const result = {
      documentType:
        extractedData.documentType ||
        "Insurance Document",

      insuranceCategory,

      policyNumber:
        extractedData.policyNumber ||
        "",

      claimNumber:
        extractedData.claimNumber ||
        "",

      applicant:
        extractedData.applicant ||
        "",

      insurer:
        extractedData.insurer ||
        "",

      vehicle:
        extractedData.vehicle ||
        "",

      incident:
        extractedData.incident ||
        "",

      location:
        extractedData.location ||
        "",

      date:
        extractedData.date ||
        "",

      confidence,

      rawText,

      importantObservations,
    };

    // ==========================================
    // Success Logging
    // ==========================================

    console.log(
      "======================================"
    );

    console.log(
      "✅ PDF OCR SUCCESS"
    );

    console.log(
      "======================================"
    );

    console.log(
      "Model:",
      GEMINI_MODEL
    );

    console.log(
      "Document:",
      result.documentType
    );

    console.log(
      "Category:",
      result.insuranceCategory
    );

    console.log(
      "Policy:",
      result.policyNumber
    );

    console.log(
      "Applicant:",
      result.applicant
    );

    console.log(
      "Vehicle:",
      result.vehicle
    );

    console.log(
      "Confidence:",
      `${result.confidence}%`
    );

    console.log(
      "OCR Text Length:",
      result.rawText.length
    );

    console.log(
      "======================================"
    );

    return result;
  } catch (error) {
    console.error(
      "======================================"
    );

    console.error(
      "❌ FORMA AI PDF OCR ERROR"
    );

    console.error(
      "======================================"
    );

    const status =
      getGeminiErrorStatus(error);

    const message =
      getGeminiErrorMessage(error);

    console.error(
      "Model:",
      GEMINI_MODEL
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
      "Full Error:",
      error
    );

    // ==========================================
    // Model Not Found
    // ==========================================

    if (status === 404) {
      const modelError =
        new Error(
          `Gemini PDF recognition model "${GEMINI_MODEL}" is not available for this API request.`
        );

      modelError.status = 404;

      throw modelError;
    }

    // ==========================================
    // Temporary Error
    // ==========================================

    if (
      status === 503 ||
      String(message)
        .toLowerCase()
        .includes("high demand")
    ) {
      const temporaryError =
        new Error(
          "Gemini PDF recognition is temporarily unavailable because the AI model is experiencing high demand. Please try again in a few moments."
        );

      temporaryError.status = 503;

      throw temporaryError;
    }

    // ==========================================
    // Rate Limit / Quota
    // ==========================================

    if (status === 429) {
      const rateLimitError =
        new Error(
          "Gemini API quota/rate limit reached while processing the PDF. The current Gemini project has reached its available request limit. Please wait for the quota to reset or use a Gemini API project/model with available quota."
        );

      rateLimitError.status = 429;

      throw rateLimitError;
    }

    throw error;
  } finally {
    // ==========================================
    // Delete Temporary PDF
    // ==========================================

    if (filePath) {
      try {
        await fs.unlink(
          filePath
        );

        console.log(
          "🗑️ Temporary PDF deleted."
        );
      } catch (deleteError) {
        console.warn(
          "⚠️ Could not delete temporary PDF:",
          deleteError.message
        );
      }
    }
  }
}

// ==========================================
// Default Export
// ==========================================

export default {
  analyzeDocument,
  analyzePDFDocument,
};