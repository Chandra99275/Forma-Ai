import fs from "fs/promises";
import {
  analyzeDocument,
  analyzePDFDocument,
} from "../services/recognitionService.js";

/**
 * ==========================================
 * Forma AI - Recognition Controller
 * AI OCR + Image Recognition + PDF Recognition
 * ==========================================
 */

/* =========================================================
   IMAGE RECOGNITION
   Used by:
   POST /api/recognition/extract-image
   POST /api/recognition/extract
   ========================================================= */

export const recognizeDocument = async (req, res) => {
  let filePath = null;

  try {
    // Validate uploaded file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No document uploaded. Please upload an image or PDF.",
      });
    }

    filePath = req.file.path;

    console.log("=========================================");
    console.log("🧠 FORMA AI DOCUMENT RECOGNITION");
    console.log("=========================================");
    console.log("📄 File Name :", req.file.originalname);
    console.log("📁 MIME Type :", req.file.mimetype);
    console.log("📦 Size      :", req.file.size, "bytes");
    console.log("=========================================");

    // Analyze document using Gemini Vision OCR
    const extractedData = await analyzeDocument(
      filePath,
      req.file.mimetype,
      req.file.originalname
    );

    // Delete temporary uploaded file
    await fs.unlink(filePath).catch(() => {});

    console.log("✅ AI OCR Extraction Completed");
    console.log("=========================================");

    return res.status(200).json({
      success: true,
      message: "Document analyzed successfully.",

      // Uploaded file details
      file: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },

      // Confidence score
      confidence: extractedData.confidence || "98%",

      // Main fields for ImageRecognition.jsx
      documentType: extractedData.documentType || "Unknown Document",
      applicantName: extractedData.applicantName || "Not Found",
      vehicleNumber: extractedData.vehicleNumber || "Not Found",
      incidentDate: extractedData.incidentDate || "Not Found",
      location: extractedData.location || "Not Found",
      incidentType: extractedData.incidentType || "Not Found",
      damageSummary:
        extractedData.damageSummary || "No Damage Detected",

      // OCR Text
      rawText: extractedData.rawText || "",

      // Additional extracted insurance fields
      policyNumber: extractedData.policyNumber || "",
      insurerName: extractedData.insurerName || "",
      claimNumber: extractedData.claimNumber || "",
      ownerName: extractedData.ownerName || "",
      registrationNumber: extractedData.registrationNumber || "",
      engineNumber: extractedData.engineNumber || "",
      chassisNumber: extractedData.chassisNumber || "",
      address: extractedData.address || "",
      phoneNumber: extractedData.phoneNumber || "",

      // Return complete JSON
      data: extractedData,
    });
  } catch (error) {
    console.error("❌ Recognition Controller Error:", error);

    // Delete uploaded file if processing fails
    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }

    /*
     * ==========================================
     * PRESERVE ORIGINAL ERROR STATUS
     * ==========================================
     *
     * Gemini rate-limit errors normally arrive
     * from recognitionService.js with status 429.
     *
     * Previously this controller converted every
     * error into HTTP 500.
     *
     * Now:
     *
     * Gemini 429 → Backend 429
     * Other errors → Original status or 500
     */

    const statusCode = error.status || error.statusCode || 500;

    // Gemini API rate-limit / quota error
    if (statusCode === 429) {
      console.error("⚠️ Gemini API rate limit reached.");

      return res.status(429).json({
        success: false,
        message:
          "Gemini API rate limit reached. Please wait and try again later.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      });
    }

    // Other errors
    return res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Failed to analyze the document with Forma AI OCR.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


/* =========================================================
   PDF RECOGNITION
   Used by:
   POST /api/recognition/extract-pdf
   PDFRecognition.jsx
   ========================================================= */

export const recognizePDFDocument = async (req, res) => {
  let filePath = null;

  try {
    // Validate uploaded PDF
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded.",
      });
    }

    filePath = req.file.path;

    console.log("=========================================");
    console.log("📄 FORMA AI PDF RECOGNITION");
    console.log("=========================================");
    console.log("📄 File Name :", req.file.originalname);
    console.log("📁 MIME Type :", req.file.mimetype);
    console.log("📦 Size      :", req.file.size, "bytes");
    console.log("=========================================");

    // Analyze PDF using Gemini OCR
    const extractedData = await analyzePDFDocument(
      filePath,
      req.file.mimetype,
      req.file.originalname
    );

    // Delete uploaded PDF
    await fs.unlink(filePath).catch(() => {});

    console.log("✅ PDF OCR Extraction Completed");
    console.log("=========================================");

    return res.status(200).json({
      success: true,
      message: "PDF analyzed successfully.",

      file: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },

      confidence: extractedData.confidence || "98%",

      rawText: extractedData.rawText || "",

      data: {
        documentType:
          extractedData.documentType ||
          "Vehicle Insurance Document",

        policyNumber:
          extractedData.policyNumber || "",

        applicant:
          extractedData.applicant || "",

        vehicle:
          extractedData.vehicle || "",

        incident:
          extractedData.incident || "",

        location:
          extractedData.location || "",

        date:
          extractedData.date || "",

        confidence:
          extractedData.confidence || "98%",
      },
    });
  } catch (error) {
    console.error("❌ PDF Recognition Error:", error);

    // Delete uploaded PDF if processing fails
    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }

    /*
     * ==========================================
     * PRESERVE ORIGINAL ERROR STATUS
     * ==========================================
     */

    const statusCode = error.status || error.statusCode || 500;

    // Gemini API rate-limit / quota error
    if (statusCode === 429) {
      console.error("⚠️ Gemini API rate limit reached.");

      return res.status(429).json({
        success: false,
        message:
          "Gemini API rate limit reached. Please wait and try again later.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      });
    }

    // Other errors
    return res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Failed to analyze PDF with Forma AI OCR.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};