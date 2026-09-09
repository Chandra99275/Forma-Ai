// ==========================================
// Forma AI - Claim Validators
// ==========================================

import mongoose from "mongoose";

// ==========================================
// Allowed Values
// ==========================================

const allowedCategories = [
  "health",
  "vehicle",
  "property",
  "travel",
  "life",
];

const allowedStatuses = [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
];

// ==========================================
// Validate Create Claim
// ==========================================

const validateCreateClaim = (req, res, next) => {
  const { category, claimData } = req.body;

  if (!category) {
    return res.status(400).json({
      success: false,
      message: "Claim category is required",
    });
  }

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Invalid claim category. Allowed categories: ${allowedCategories.join(
        ", "
      )}`,
    });
  }

  if (!claimData) {
    return res.status(400).json({
      success: false,
      message: "Claim data is required",
    });
  }

  if (
    typeof claimData !== "object" ||
    Array.isArray(claimData)
  ) {
    return res.status(400).json({
      success: false,
      message: "claimData must be a valid object",
    });
  }

  next();
};

// ==========================================
// Validate Update Claim
// ==========================================

const validateUpdateClaim = (req, res, next) => {
  const {
    claimData,
    documents,
    status,
  } = req.body;

  // At least one field must be provided
  if (
    claimData === undefined &&
    documents === undefined &&
    status === undefined
  ) {
    return res.status(400).json({
      success: false,
      message:
        "At least one field is required to update the claim",
    });
  }

  // Validate claimData
  if (
    claimData !== undefined &&
    (typeof claimData !== "object" ||
      Array.isArray(claimData))
  ) {
    return res.status(400).json({
      success: false,
      message: "claimData must be a valid object",
    });
  }

  // Validate documents
  if (documents !== undefined) {
    if (!Array.isArray(documents)) {
      return res.status(400).json({
        success: false,
        message: "documents must be an array",
      });
    }

    for (const documentId of documents) {
      if (!mongoose.Types.ObjectId.isValid(documentId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid document ID: ${documentId}`,
        });
      }
    }
  }

  // Validate status
  if (
    status !== undefined &&
    !allowedStatuses.includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed statuses: ${allowedStatuses.join(
        ", "
      )}`,
    });
  }

  next();
};

// ==========================================
// Validate Claim ID
// ==========================================

const validateClaimId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid claim ID",
    });
  }

  next();
};

// ==========================================
// Validate Claim Category
// ==========================================

const validateClaimCategory = (req, res, next) => {
  const { category } = req.params;

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Invalid claim category. Allowed categories: ${allowedCategories.join(
        ", "
      )}`,
    });
  }

  next();
};

// ==========================================
// Named Exports
// ==========================================

export {
  validateCreateClaim,
  validateUpdateClaim,
  validateClaimId,
  validateClaimCategory,
  allowedCategories,
  allowedStatuses,
};