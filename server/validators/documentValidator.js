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
  const { claimId, documentType } = req.body;

  if (!claimId) {
    return res.status(400).json({
      success: false,
      message: "claimId is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid claim ID",
    });
  }

  // Check uploaded file
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload a document",
    });
  }

  // Validate document type if provided
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

  // Validate document type
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

  // Validate description
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

  // OCR status is required
  if (!ocrStatus) {
    return res.status(400).json({
      success: false,
      message: "ocrStatus is required",
    });
  }

  // Validate OCR status
  if (!allowedOCRStatuses.includes(ocrStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid OCR status. Allowed statuses: ${allowedOCRStatuses.join(
        ", "
      )}`,
    });
  }

  // Validate extracted text
  if (
    extractedText !== undefined &&
    typeof extractedText !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "extractedText must be a string",
    });
  }

  // Validate extracted data
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