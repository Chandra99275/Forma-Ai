// middleware/validationMiddleware.js

// ==========================================
// REQUIRED FIELD VALIDATION
// ==========================================

const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingFields = [];

    fields.forEach((field) => {
      const value = req.body[field];

      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
        missingFields,
      });
    }

    next();
  };
};

// ==========================================
// CLAIM VALIDATION
// ==========================================

const validateClaim = (req, res, next) => {
  const { category, claimData } = req.body;

  const allowedCategories = [
    "health",
    "vehicle",
    "property",
    "travel",
    "life",
  ];

  // Check category
  if (!category) {
    return res.status(400).json({
      success: false,
      message: "Insurance category is required",
    });
  }

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid category. Allowed categories are health, vehicle, property, travel and life",
    });
  }

  // Check claim data
  if (
    claimData !== undefined &&
    (typeof claimData !== "object" || Array.isArray(claimData))
  ) {
    return res.status(400).json({
      success: false,
      message: "claimData must be a valid object",
    });
  }

  next();
};

// ==========================================
// UPDATE CLAIM VALIDATION
// ==========================================

const validateClaimUpdate = (req, res, next) => {
  const { claimData, documents, status } = req.body;

  // At least one field must be provided
  if (
    claimData === undefined &&
    documents === undefined &&
    status === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required for updating the claim",
    });
  }

  // Validate claimData
  if (
    claimData !== undefined &&
    (typeof claimData !== "object" || Array.isArray(claimData))
  ) {
    return res.status(400).json({
      success: false,
      message: "claimData must be an object",
    });
  }

  // Validate documents
  if (
    documents !== undefined &&
    !Array.isArray(documents)
  ) {
    return res.status(400).json({
      success: false,
      message: "documents must be an array",
    });
  }

  // Validate status
  if (status !== undefined) {
    const allowedStatuses = [
      "draft",
      "submitted",
      "under_review",
      "approved",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid claim status",
        allowedStatuses,
      });
    }
  }

  next();
};

// ==========================================
// REGISTER VALIDATION
// ==========================================

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = {};

  // Name
  if (!name || name.trim() === "") {
    errors.name = "Name is required";
  }

  // Email
  if (!email || email.trim() === "") {
    errors.email = "Email is required";
  } else {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      errors.email = "Please provide a valid email address";
    }
  }

  // Password
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password =
      "Password must contain at least 6 characters";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// ==========================================
// LOGIN VALIDATION
// ==========================================

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = {};

  if (!email || email.trim() === "") {
    errors.email = "Email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// ==========================================
// DOCUMENT VALIDATION
// ==========================================

const validateDocument = (req, res, next) => {
  const { claimId } = req.body;

  if (!claimId || claimId.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Claim ID is required",
    });
  }

  // File validation is handled by Multer
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Document file is required",
    });
  }

  next();
};

// ==========================================
// AI PARSER VALIDATION
// ==========================================

const validateAIParser = (req, res, next) => {
  const { text, category } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Text is required for AI parsing",
    });
  }

  if (!category) {
    return res.status(400).json({
      success: false,
      message: "Insurance category is required",
    });
  }

  const allowedCategories = [
    "health",
    "vehicle",
    "property",
    "travel",
    "life",
  ];

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: "Invalid insurance category",
    });
  }

  next();
};

// ==========================================
// ID VALIDATION
// ==========================================

const mongoose = require("mongoose");

const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName}`,
      });
    }

    next();
  };
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  validateRequired,
  validateClaim,
  validateClaimUpdate,
  validateRegister,
  validateLogin,
  validateDocument,
  validateAIParser,
  validateObjectId,
};