import fs from "fs/promises";
import {
  analyzeDocument,
} from "../services/recognitionService.js";

export const recognizeDocument = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "No document uploaded. Please upload a PDF or image.",
      });
    }

    filePath = req.file.path;

    console.log("======================================");
    console.log("FORMA AI DOCUMENT RECOGNITION");
    console.log("======================================");

    console.log("Original file:", req.file.originalname);
    console.log("MIME type:", req.file.mimetype);
    console.log("Size:", req.file.size);

    const extractedData = await analyzeDocument(
      req.file.path,
      req.file.mimetype
    );

    return res.status(200).json({
      success: true,

      message:
        "Document analyzed successfully.",

      file: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },

      data: extractedData,
    });
  } catch (error) {
    console.error(
      "Document recognition error:",
      error
    );

    // Cleanup if service failed before deleting file
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch {
        // File may already have been deleted.
      }
    }

    return res.status(500).json({
      success: false,

      message:
        "Failed to analyze the document.",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};