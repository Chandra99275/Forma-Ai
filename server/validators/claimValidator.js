// ==========================================
// Forma AI - Claim Validators
// ==========================================

import mongoose from "mongoose";

// ==========================================
// Allowed Categories
// ==========================================

const ALLOWED_CATEGORIES = [
  "health",
  "vehicle",
  "property",
  "travel",
  "life",
];

// ==========================================
// Validate Create Claim
// POST /api/claims
// ==========================================

const validateCreateClaim = (req, res, next) => {
  console.log("\n=========================================");
  console.log("🔎 VALIDATE CREATE CLAIM");
  console.log("=========================================");
  console.log(
    "Request Body:",
    JSON.stringify(req.body, null, 2)
  );
  console.log("=========================================");

  const { category, claimData } = req.body || {};

  // ----------------------------------------
  // Category validation
  // ----------------------------------------

  if (!category) {
    console.error(
      "❌ Validation failed: category missing"
    );

    return res.status(400).json({
      success: false,
      message: "Insurance category is required.",
    });
  }

  const normalizedCategory = String(category)
    .trim()
    .toLowerCase();

  if (
    !ALLOWED_CATEGORIES.includes(
      normalizedCategory
    )
  ) {
    console.error(
      "❌ Validation failed: invalid category:",
      normalizedCategory
    );

    return res.status(400).json({
      success: false,
      message: "Invalid insurance category.",
      received: normalizedCategory,
      allowed: ALLOWED_CATEGORIES,
    });
  }

  // ----------------------------------------
  // claimData validation
  // ----------------------------------------

  // claimData is optional when creating a draft.
  if (claimData !== undefined) {
    if (
      typeof claimData !== "object" ||
      claimData === null ||
      Array.isArray(claimData)
    ) {
      console.error(
        "❌ Validation failed: invalid claimData"
      );

      return res.status(400).json({
        success: false,
        message:
          "claimData must be a valid object.",
      });
    }
  }

  // ----------------------------------------
  // Normalize request body
  // ----------------------------------------

  req.body.category = normalizedCategory;

  if (claimData === undefined) {
    req.body.claimData = {};
  }

  console.log(
    "✅ Claim validation passed"
  );

  console.log(
    "Category:",
    req.body.category
  );

  console.log(
    "Claim data keys:",
    Object.keys(req.body.claimData)
  );

  console.log("=========================================\n");

  next();
};

// ==========================================
// Validate Update Claim
// ==========================================

const validateUpdateClaim = (req, res, next) => {
  console.log("\n🔎 VALIDATE UPDATE CLAIM");

  const { claimData } = req.body || {};

  if (
    claimData === undefined
  ) {
    req.body.claimData = {};
    return next();
  }

  if (
    typeof claimData !== "object" ||
    claimData === null ||
    Array.isArray(claimData)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "claimData must be a valid object.",
    });
  }

  next();
};

// ==========================================
// Validate Claim ID
// ==========================================

const validateClaimId = (req, res, next) => {
  const { id } = req.params;

  console.log(
    "🔎 Validating Claim ID:",
    id
  );

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Claim ID is required.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid claim ID.",
    });
  }

  next();
};

// ==========================================
// Validate Claim Category
// ==========================================

const validateClaimCategory = (
  req,
  res,
  next
) => {
  const { category } = req.params;

  console.log(
    "🔎 Validating Category:",
    category
  );

  if (!category) {
    return res.status(400).json({
      success: false,
      message:
        "Insurance category is required.",
    });
  }

  const normalizedCategory = String(category)
    .trim()
    .toLowerCase();

  if (
    !ALLOWED_CATEGORIES.includes(
      normalizedCategory
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid insurance category.",
      allowed: ALLOWED_CATEGORIES,
    });
  }

  req.params.category =
    normalizedCategory;

  next();
};

// ==========================================
// Export
// ==========================================

export {
  validateCreateClaim,
  validateUpdateClaim,
  validateClaimId,
  validateClaimCategory,
};