// ==========================================
// Forma AI - Document Validators
// ==========================================

import mongoose from "mongoose";

// ==========================================
// Allowed Document Types
// ==========================================

const allowedDocumentTypes = [
  "hospital_bill",
  "medical_report",
  "prescription",
  "discharge_summary",
  "insurance_policy",
  "identity_proof",
  "fir",
  "vehicle_document",
  "travel_document",
  "death_certificate",
  "supporting_document",
  "other",
];

// ==========================================
// Allowed OCR Statuses
// ==========================================

const allowedOCRStatuses = [
  "pending",
  "processing",
  "completed",
  "failed",
];

// ==========================================
// Validate Document Upload
// ==========================================

const validateDocumentUpload = (req, res, next) => {
  // Debug information
  console.log("==========================================");
  console.log("📥 Document Upload Validator");
  console.log("==========================================");

  console.log("📦 Request Body:", req.body);
  console.log("📎 Uploaded Files:", req.files);

  const { claimId, documentType } = req.body;

  // ==========================================
  // Validate Claim ID
  // ==========================================

  if (!claimId) {
    console.log("❌ Validation failed: claimId missing");

    return res.status(400).json({
      success: false,
      message: "claimId is required",
    });
  }

  // ==========================================
  // Validate Claim ID Format
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    console.log("❌ Validation failed: Invalid claim ID");
    console.log("Received claimId:", claimId);

    return res.status(400).json({
      success: false,
      message: "Invalid claim ID",
    });
  }

  // ==========================================
  // Validate Uploaded Files
  // ==========================================

  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    console.log("❌ Validation failed: No files received");
    console.log("req.files:", req.files);

    return res.status(400).json({
      success: false,
      message: "Please upload at least one document",
    });
  }

  console.log(`✅ ${req.files.length} file(s) received`);

  // ==========================================
  // Validate Document Type
  // ==========================================

  if (
    documentType !== undefined &&
    documentType !== "" &&
    !allowedDocumentTypes.includes(documentType)
  ) {
    console.log("❌ Validation failed: Invalid document type");
    console.log("Received documentType:", documentType);

    return res.status(400).json({
      success: false,
      message: `Invalid document type. Allowed types: ${allowedDocumentTypes.join(
        ", "
      )}`,
    });
  }

  // ==========================================
  // Validate Each Uploaded File
  // ==========================================

  for (const file of req.files) {
    if (!file) {
      console.log("❌ Validation failed: Invalid file");

      return res.status(400).json({
        success: false,
        message: "Invalid uploaded document",
      });
    }

    console.log("📄 File received:");
    console.log("   Original Name:", file.originalname);
    console.log("   File Name:", file.filename);
    console.log("   MIME Type:", file.mimetype);
    console.log("   Size:", file.size);
    console.log("   Path:", file.path);
  }

  // ==========================================
  // Validation Successful
  // ==========================================

  console.log("✅ Document upload validation successful");
  console.log("==========================================");

  next();
};

// ==========================================
// Validate Document ID
// ==========================================

const validateDocumentId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid document ID",
    });
  }

  next();
};

// ==========================================
// Validate Claim ID in URL
// ==========================================

const validateDocumentClaimId = (req, res, next) => {
  const { claimId } = req.params;

  if (!claimId || !mongoose.Types.ObjectId.isValid(claimId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid claim ID",
    });
  }

  next();
};

// ==========================================
// Validate Document Update
// ==========================================

const validateDocumentUpdate = (req, res, next) => {
  const {
    documentType,
    description,
  } = req.body;

  // At least one field required
  if (
    documentType === undefined &&
    description === undefined
  ) {
    return res.status(400).json({
      success: false,
      message:
        "At least one field is required to update the document",
    });
  }

  // ==========================================
  // Validate Document Type
  // ==========================================

  if (
    documentType !== undefined &&
    !allowedDocumentTypes.includes(documentType)
  ) {
    return res.status(400).json({
      success: false,
      message: `Invalid document type. Allowed types: ${allowedDocumentTypes.join(
        ", "
      )}`,
    });
  }

  // ==========================================
  // Validate Description
  // ==========================================

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Description must be a string",
    });
  }

  next();
};

// ==========================================
// Validate OCR Update
// ==========================================

const validateOCRUpdate = (req, res, next) => {
  const {
    ocrStatus,
    extractedText,
    extractedData,
  } = req.body;

  // ==========================================
  // OCR Status Required
  // ==========================================

  if (!ocrStatus) {
    return res.status(400).json({
      success: false,
      message: "ocrStatus is required",
    });
  }

  // ==========================================
  // Validate OCR Status
  // ==========================================

  if (!allowedOCRStatuses.includes(ocrStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid OCR status. Allowed statuses: ${allowedOCRStatuses.join(
        ", "
      )}`,
    });
  }

  // ==========================================
  // Validate Extracted Text
  // ==========================================

  if (
    extractedText !== undefined &&
    typeof extractedText !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "extractedText must be a string",
    });
  }

  // ==========================================
  // Validate Extracted Data
  // ==========================================

  if (
    extractedData !== undefined &&
    (
      typeof extractedData !== "object" ||
      Array.isArray(extractedData) ||
      extractedData === null
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "extractedData must be a valid object",
    });
  }

  next();
};

// ==========================================
// ES Module Named Exports
// ==========================================

export {
  validateDocumentUpload,
  validateDocumentId,
  validateDocumentClaimId,
  validateDocumentUpdate,
  validateOCRUpdate,
  allowedDocumentTypes,
  allowedOCRStatuses,
};