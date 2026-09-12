
// ==========================================
// Forma AI - Claim Controller
// ==========================================

import Claim from "../models/Claim.js";
import { generateClaimNumber } from "../utils/claimNumber.js";

// ==========================================
// Get User ID
// ==========================================

const getUserId = (req) => {
  return req.user?._id || req.user?.id || null;
};

// ==========================================
// Check Claim Access
// ==========================================

const canAccessClaim = (claim, req) => {
  const userId = getUserId(req);

  // Development / prototype mode
  if (!userId) {
    return true;
  }

  // Claim has no owner
  if (!claim.userId) {
    return true;
  }

  return String(claim.userId) === String(userId);
};

// ==========================================
// CREATE CLAIM
// POST /api/claims
// ==========================================

const createClaim = async (req, res) => {
  console.log("\n=========================================");
  console.log("📥 CREATE CLAIM REQUEST RECEIVED");
  console.log("=========================================");

  console.log(
    "Request Body:",
    JSON.stringify(req.body, null, 2)
  );

  console.log(
    "User:",
    req.user || "No authenticated user"
  );

  console.log("=========================================\n");

  try {
    // ------------------------------------------
    // Read request body
    // ------------------------------------------

    const {
      category,
      claimData = {},
    } = req.body || {};

    // ------------------------------------------
    // Validate category
    // ------------------------------------------

    if (!category) {
      console.error(
        "❌ CREATE CLAIM FAILED: Category missing"
      );

      return res.status(400).json({
        success: false,
        message:
          "Insurance category is required.",
      });
    }

    // ------------------------------------------
    // Normalize category
    // ------------------------------------------

    const normalizedCategory = String(category)
      .trim()
      .toLowerCase();

    const allowedCategories = [
      "health",
      "vehicle",
      "property",
      "travel",
      "life",
    ];

    if (
      !allowedCategories.includes(
        normalizedCategory
      )
    ) {
      console.error(
        "❌ CREATE CLAIM FAILED: Invalid category:",
        normalizedCategory
      );

      return res.status(400).json({
        success: false,
        message: `Invalid insurance category "${normalizedCategory}".`,
        allowedCategories,
      });
    }

    // ------------------------------------------
    // Validate claimData
    // ------------------------------------------

    if (
      typeof claimData !== "object" ||
      Array.isArray(claimData) ||
      claimData === null
    ) {
      console.error(
        "❌ CREATE CLAIM FAILED: Invalid claimData"
      );

      return res.status(400).json({
        success: false,
        message:
          "Claim data must be a valid object.",
      });
    }

    // ------------------------------------------
    // Get user ID
    // ------------------------------------------

    const userId = getUserId(req);

    console.log(
      "👤 User ID:",
      userId || "Guest / Prototype Mode"
    );

    console.log(
      "📂 Category:",
      normalizedCategory
    );

    console.log(
      "📋 Claim Data Keys:",
      Object.keys(claimData)
    );

    // ------------------------------------------
    // Generate claim number
    // ------------------------------------------

    console.log(
      "🔢 Generating claim number..."
    );

    const claimNumber =
      await generateClaimNumber();

    console.log(
      "🔢 Generated Claim Number:",
      claimNumber
    );

    // ------------------------------------------
    // Prepare claim object
    // ------------------------------------------
    //
    // IMPORTANT:
    //
    // aiAnalysis is an EMBEDDED OBJECT in the
    // current Claim model.
    //
    // Therefore DO NOT use:
    //
    // aiAnalysis: []
    //
    // ------------------------------------------

    const claimPayload = {
      claimNumber,

      category: normalizedCategory,

      status: "draft",

      claimData,

      // Embedded documents
      documents: [],

      // Embedded AI analysis object
      aiAnalysis: {
        summary: "",
        confidence: 0,
        source: "manual",
      },

      // Separate convenient AI fields
      aiSummary: "",

      aiConfidence: null,

      // Risk information
      riskScore: null,

      riskLevel: "unknown",

      // Reviewer information
      reviewerNotes: "",

      reviewedBy: null,

      reviewedAt: null,

      // Submission information
      submittedAt: null,

      // PDF
      pdfUrl: "",

      // Decision information
      decisionReason: "",

      decisionDate: null,
    };

    // ------------------------------------------
    // Only add userId when available
    // ------------------------------------------

    if (userId) {
      claimPayload.userId = userId;
    }

    console.log(
      "📦 Claim Payload:",
      JSON.stringify(
        claimPayload,
        null,
        2
      )
    );

    // ------------------------------------------
    // Create claim
    // ------------------------------------------

    console.log(
      "💾 Saving claim to MongoDB..."
    );

    const claim =
      await Claim.create(claimPayload);

    console.log(
      "========================================="
    );

    console.log(
      "✅ CLAIM CREATED SUCCESSFULLY"
    );

    console.log(
      "Claim ID:",
      claim._id
    );

    console.log(
      "Claim Number:",
      claim.claimNumber
    );

    console.log(
      "Status:",
      claim.status
    );

    console.log(
      "=========================================\n"
    );

    // ------------------------------------------
    // Response
    // ------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Claim created successfully.",

      claim,
    });
  } catch (error) {
    // ==========================================
    // Detailed Error Logging
    // ==========================================

    console.error(
      "\n========================================="
    );

    console.error(
      "❌ CREATE CLAIM ERROR"
    );

    console.error(
      "========================================="
    );

    console.error(
      "Error Name:",
      error.name
    );

    console.error(
      "Error Message:",
      error.message
    );

    console.error(
      "Error Code:",
      error.code
    );

    console.error(
      "Full Error:",
      error
    );

    if (error.errors) {
      console.error(
        "Mongoose Validation Errors:"
      );

      Object.entries(
        error.errors
      ).forEach(
        ([field, fieldError]) => {
          console.error(
            `  ${field}: ${fieldError.message}`
          );
        }
      );
    }

    console.error(
      "Stack:",
      error.stack
    );

    console.error(
      "=========================================\n"
    );

    // ==========================================
    // Duplicate Claim Number
    // ==========================================

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,

        message:
          "Claim number already exists. Please try again.",

        error: error.message,
      });
    }

    // ==========================================
    // Mongoose Validation Error
    // ==========================================

    if (
      error.name ===
      "ValidationError"
    ) {
      const validationErrors =
        Object.values(
          error.errors || {}
        ).map((item) => ({
          field: item.path,
          message: item.message,
        }));

      return res.status(400).json({
        success: false,

        message:
          "Claim validation failed.",

        errors: validationErrors,
      });
    }

    // ==========================================
    // Invalid ObjectId
    // ==========================================

    if (
      error.name ===
      "CastError"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid claim data.",

        error: error.message,
      });
    }

    // ==========================================
    // Other Errors
    // ==========================================

    return res.status(500).json({
      success: false,

      message:
        "Unable to create claim.",

      error: error.message,
    });
  }
};

// ==========================================
// GET ALL CLAIMS
// GET /api/claims
// ==========================================

const getClaims = async (req, res) => {
  try {
    const userId = getUserId(req);

    let query = {};

    // ------------------------------------------
    // Authenticated user
    // ------------------------------------------

    if (userId) {
      query = {
        $or: [
          {
            userId,
          },
          {
            userId: null,
          },
        ],
      };
    }

    // ------------------------------------------
    // Fetch claims
    // ------------------------------------------

    const claims =
      await Claim.find(query)
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,

      count: claims.length,

      claims,
    });
  } catch (error) {
    console.error(
      "❌ GET CLAIMS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to fetch claims.",

      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE CLAIM
// GET /api/claims/:id
// ==========================================

const getClaimById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ------------------------------------------
    // Find claim
    // ------------------------------------------

    const claim =
      await Claim.findById(id).lean();

    if (!claim) {
      return res.status(404).json({
        success: false,

        message:
          "Claim not found.",
      });
    }

    // ------------------------------------------
    // Check access
    // ------------------------------------------

    if (
      !canAccessClaim(
        claim,
        req
      )
    ) {
      return res.status(403).json({
        success: false,

        message:
          "You are not authorized to access this claim.",
      });
    }

    return res.status(200).json({
      success: true,

      claim,
    });
  } catch (error) {
    console.error(
      "❌ GET CLAIM ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to fetch claim.",

      error: error.message,
    });
  }
};

// ==========================================
// UPDATE CLAIM
// PUT /api/claims/:id
// ==========================================

const updateClaim = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      claimData = {},
    } = req.body || {};

    // ------------------------------------------
    // Find claim
    // ------------------------------------------

    const claim =
      await Claim.findById(id);

    if (!claim) {
      return res.status(404).json({
        success: false,

        message:
          "Claim not found.",
      });
    }

    // ------------------------------------------
    // Check access
    // ------------------------------------------

    if (
      !canAccessClaim(
        claim,
        req
      )
    ) {
      return res.status(403).json({
        success: false,

        message:
          "You are not authorized to update this claim.",
      });
    }

    // ------------------------------------------
    // Prevent editing finalized claims
    // ------------------------------------------

    if (
      [
        "approved",
        "rejected",
      ].includes(
        claim.status
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Approved or rejected claims cannot be modified.",
      });
    }

    // ------------------------------------------
    // Validate claimData
    // ------------------------------------------

    if (
      typeof claimData !==
        "object" ||
      Array.isArray(
        claimData
      ) ||
      claimData === null
    ) {
      return res.status(400).json({
        success: false,

        message:
          "claimData must be a valid object.",
      });
    }

    // ------------------------------------------
    // Merge existing data
    // ------------------------------------------

    const existingClaimData =
      claim.claimData || {};

    const existingData =
      typeof existingClaimData.toObject ===
      "function"
        ? existingClaimData.toObject()
        : existingClaimData;

    claim.claimData = {
      ...existingData,
      ...claimData,
    };

    // ------------------------------------------
    // Save
    // ------------------------------------------

    await claim.save();

    console.log(
      "✅ CLAIM UPDATED:",
      claim.claimNumber
    );

    return res.status(200).json({
      success: true,

      message:
        "Claim updated successfully.",

      claim,
    });
  } catch (error) {
    console.error(
      "❌ UPDATE CLAIM ERROR:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      const validationErrors =
        Object.values(
          error.errors || {}
        ).map((item) => ({
          field: item.path,
          message: item.message,
        }));

      return res.status(400).json({
        success: false,

        message:
          "Claim validation failed.",

        errors: validationErrors,
      });
    }

    return res.status(500).json({
      success: false,

      message:
        "Unable to update claim.",

      error: error.message,
    });
  }
};

// ==========================================
// SUBMIT CLAIM
// POST /api/claims/:id/submit
// ==========================================

const submitClaim = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ------------------------------------------
    // Find claim
    // ------------------------------------------

    const claim =
      await Claim.findById(id);

    if (!claim) {
      return res.status(404).json({
        success: false,

        message:
          "Claim not found.",
      });
    }

    // ------------------------------------------
    // Check access
    // ------------------------------------------

    if (
      !canAccessClaim(
        claim,
        req
      )
    ) {
      return res.status(403).json({
        success: false,

        message:
          "You are not authorized to submit this claim.",
      });
    }

    // ------------------------------------------
    // Check status
    // ------------------------------------------

    if (
      claim.status !==
      "draft"
    ) {
      return res.status(400).json({
        success: false,

        message:
          `Claim cannot be submitted because its current status is "${claim.status}".`,
      });
    }

    // ------------------------------------------
    // Validate claim data
    // ------------------------------------------

    if (
      !claim.claimData ||
      Object.keys(
        claim.claimData
      ).length === 0
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Claim data is empty. Please complete the form before submitting.",
      });
    }

    // ------------------------------------------
    // Submit claim
    // ------------------------------------------

    claim.status =
      "submitted";

    claim.submittedAt =
      new Date();

    await claim.save();

    console.log(
      "========================================="
    );

    console.log(
      "✅ CLAIM SUBMITTED"
    );

    console.log(
      "Claim Number:",
      claim.claimNumber
    );

    console.log(
      "Claim ID:",
      claim._id
    );

    console.log(
      "========================================="
    );

    return res.status(200).json({
      success: true,

      message:
        "Claim submitted successfully.",

      claim,
    });
  } catch (error) {
    console.error(
      "❌ SUBMIT CLAIM ERROR:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      const validationErrors =
        Object.values(
          error.errors || {}
        ).map((item) => ({
          field: item.path,
          message: item.message,
        }));

      return res.status(400).json({
        success: false,

        message:
          "Claim validation failed.",

        errors: validationErrors,
      });
    }

    return res.status(500).json({
      success: false,

      message:
        "Unable to submit claim.",

      error: error.message,
    });
  }
};

// ==========================================
// DELETE CLAIM
// DELETE /api/claims/:id
// ==========================================

const deleteClaim = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ------------------------------------------
    // Find claim
    // ------------------------------------------

    const claim =
      await Claim.findById(id);

    if (!claim) {
      return res.status(404).json({
        success: false,

        message:
          "Claim not found.",
      });
    }

    // ------------------------------------------
    // Check access
    // ------------------------------------------

    if (
      !canAccessClaim(
        claim,
        req
      )
    ) {
      return res.status(403).json({
        success: false,

        message:
          "You are not authorized to delete this claim.",
      });
    }

    // ------------------------------------------
    // Only drafts can be deleted
    // ------------------------------------------

    if (
      claim.status !==
      "draft"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Only draft claims can be deleted.",
      });
    }

    // ------------------------------------------
    // Delete
    // ------------------------------------------

    await Claim.findByIdAndDelete(
      id
    );

    console.log(
      "🗑️ CLAIM DELETED:",
      claim.claimNumber
    );

    return res.status(200).json({
      success: true,

      message:
        "Claim deleted successfully.",
    });
  } catch (error) {
    console.error(
      "❌ DELETE CLAIM ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to delete claim.",

      error: error.message,
    });
  }
};

// ==========================================
// GET CLAIMS BY CATEGORY
// GET /api/claims/category/:category
// ==========================================

const getClaimsByCategory = async (
  req,
  res
) => {
  try {
    const { category } =
      req.params;

    // ------------------------------------------
    // Normalize category
    // ------------------------------------------

    const normalizedCategory =
      String(category)
        .trim()
        .toLowerCase();

    const allowedCategories = [
      "health",
      "vehicle",
      "property",
      "travel",
      "life",
    ];

    if (
      !allowedCategories.includes(
        normalizedCategory
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          `Invalid insurance category "${normalizedCategory}".`,
      });
    }

    // ------------------------------------------
    // Get user
    // ------------------------------------------

    const userId =
      getUserId(req);

    // ------------------------------------------
    // Build query
    // ------------------------------------------

    const query = {
      category:
        normalizedCategory,
    };

    if (userId) {
      query.$or = [
        {
          userId,
        },
        {
          userId: null,
        },
      ];
    }

    // ------------------------------------------
    // Fetch claims
    // ------------------------------------------

    const claims =
      await Claim.find(query)
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,

      count:
        claims.length,

      claims,
    });
  } catch (error) {
    console.error(
      "❌ CATEGORY CLAIM ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to fetch category claims.",

      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

export {
  createClaim,
  getClaims,
  getClaimById,
  updateClaim,
  submitClaim,
  deleteClaim,
  getClaimsByCategory,
};

