import fs from "fs/promises";
import { analyzeDocument } from "../services/recognitionService.js";

/**
 * ==========================================
 * Forma AI - Recognition Controller
 * AI OCR + Image Recognition using Gemini Vision
 * ==========================================
 */

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
      damageSummary: extractedData.damageSummary || "No Damage Detected",

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

    return res.status(500).json({
      success: false,
      message: "Failed to analyze the document with Forma AI OCR.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};