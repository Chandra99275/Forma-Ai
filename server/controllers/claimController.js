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
        message: "Insurance category is required.",
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
        message: "Claim data must be a valid object.",
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

    const claimPayload = {
      claimNumber,

      category: normalizedCategory,

      status: "draft",

      claimData,

      documents: [],

      aiAnalysis: {
        summary: "",
        confidence: 0,
        source: "manual",
      },

      aiSummary: "",

      aiConfidence: null,

      riskScore: null,

      riskLevel: "unknown",

      reviewerNotes: "",

      reviewedBy: null,

      reviewedAt: null,

      submittedAt: null,

      pdfUrl: "",

      decisionReason: "",

      decisionDate: null,
    };

    // ------------------------------------------
    // Add user ID when available
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

    return res.status(201).json({
      success: true,
      message: "Claim created successfully.",
      claim,
    });

  } catch (error) {

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

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Claim number already exists. Please try again.",
        error: error.message,
      });
    }

    if (
      error.name === "ValidationError"
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
        message: "Claim validation failed.",
        errors: validationErrors,
      });
    }

    if (
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid claim data.",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create claim.",
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
      message: "Unable to fetch claims.",
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

    const claim =
      await Claim.findById(id).lean();

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found.",
      });
    }

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
      message: "Unable to fetch claim.",
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

  console.log("\n=========================================");
  console.log("✏️ UPDATE CLAIM REQUEST RECEIVED");
  console.log("=========================================");

  try {

    const { id } = req.params;

    const body = req.body || {};

    console.log(
      "🆔 Claim ID:",
      id
    );

    console.log(
      "📥 Request Body:",
      JSON.stringify(
        body,
        null,
        2
      )
    );

    // ------------------------------------------
    // Validate claim ID
    // ------------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Claim ID is required.",
      });
    }

    // ------------------------------------------
    // Find claim
    // ------------------------------------------

    const claim =
      await Claim.findById(id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found.",
      });
    }

    // ------------------------------------------
    // Check ownership / access
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
    // Validate claimData
    // ------------------------------------------

    if (
      body.claimData !== undefined &&
      (
        typeof body.claimData !== "object" ||
        Array.isArray(body.claimData) ||
        body.claimData === null
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "claimData must be a valid object.",
      });
    }

    // ------------------------------------------
    // Validate category
    // ------------------------------------------

    const allowedCategories = [
      "health",
      "vehicle",
      "property",
      "travel",
      "life",
    ];

    let normalizedCategory;

    if (
      body.category !== undefined
    ) {

      normalizedCategory =
        String(body.category)
          .trim()
          .toLowerCase();

      if (
        !allowedCategories.includes(
          normalizedCategory
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid insurance category "${normalizedCategory}".`,
          allowedCategories,
        });
      }
    }

    // ------------------------------------------
    // Check if there is something to update
    // ------------------------------------------

    const hasClaimData =
      body.claimData !== undefined &&
      Object.keys(
        body.claimData
      ).length > 0;

    const hasCategory =
      body.category !== undefined;

    if (
      !hasClaimData &&
      !hasCategory
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No editable fields were provided.",
      });
    }

    // ------------------------------------------
    // Merge claimData
    // ------------------------------------------

    if (hasClaimData) {

      const existingClaimData =
        claim.claimData || {};

      const existingData =
        typeof existingClaimData.toObject ===
        "function"
          ? existingClaimData.toObject()
          : existingClaimData;

      claim.claimData = {
        ...existingData,
        ...body.claimData,
      };
    }

    // ------------------------------------------
    // Update category
    // ------------------------------------------

    if (hasCategory) {
      claim.category =
        normalizedCategory;
    }

    // ------------------------------------------
    // Protect system fields
    // ------------------------------------------

    if (
      body.status !== undefined
    ) {
      console.warn(
        "⚠️ Ignoring direct status update:",
        body.status
      );
    }

    if (
      body.claimNumber !== undefined
    ) {
      console.warn(
        "⚠️ Ignoring claimNumber update."
      );
    }

    if (
      body.userId !== undefined
    ) {
      console.warn(
        "⚠️ Ignoring userId update."
      );
    }

    if (
      body.aiAnalysis !== undefined
    ) {
      console.warn(
        "⚠️ Ignoring direct aiAnalysis update."
      );
    }

    if (
      body.aiSummary !== undefined
    ) {
      console.warn(
        "⚠️ Ignoring direct aiSummary update."
      );
    }

    if (
      body.aiConfidence !== undefined
    ) {
      console.warn(
        "⚠️ Ignoring direct aiConfidence update."
      );
    }

    if (
      body.riskScore !== undefined
    ) {
      console.warn(
        "⚠️ Ignoring direct riskScore update."
      );
    }

    if (
      body.riskLevel !== undefined
    ) {
      console.warn(
        "⚠️ Ignoring direct riskLevel update."
      );
    }

    if (
      body.reviewedBy !== undefined
    ) {
      console.warn(
        "⚠️ Ignoring reviewedBy update."
      );
    }

    if (
      body.reviewedAt !== undefined
    ) {
      console.warn(
        "⚠️ Ignoring reviewedAt update."
      );
    }

    if (
      body.submittedAt !== undefined
    ) {
      console.warn(
        "⚠️ Ignoring submittedAt update."
      );
    }

    // ------------------------------------------
    // Save updated claim
    // ------------------------------------------

    await claim.save();

    console.log(
      "✅ CLAIM UPDATED SUCCESSFULLY"
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
      "Category:",
      claim.category
    );

    console.log(
      "Status:",
      claim.status
    );

    console.log(
      "Updated Claim Data:",
      JSON.stringify(
        claim.claimData,
        null,
        2
      )
    );

    console.log(
      "=========================================\n"
    );

    return res.status(200).json({
      success: true,
      message:
        "Claim updated successfully.",
      claim,
    });

  } catch (error) {

    console.error(
      "\n========================================="
    );

    console.error(
      "❌ UPDATE CLAIM ERROR"
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

    // ------------------------------------------
    // Mongoose validation error
    // ------------------------------------------

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
          value: item.value,
        }));

      return res.status(400).json({
        success: false,
        message:
          "Claim validation failed.",
        errors:
          validationErrors,
      });
    }

    // ------------------------------------------
    // Invalid ObjectId
    // ------------------------------------------

    if (
      error.name ===
      "CastError"
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid claim ID or claim data.",
        error:
          error.message,
      });
    }

    // ------------------------------------------
    // Duplicate key
    // ------------------------------------------

    if (
      error.code === 11000
    ) {

      return res.status(409).json({
        success: false,
        message:
          "Duplicate claim data.",
        error:
          error.message,
      });
    }

    // ------------------------------------------
    // Other errors
    // ------------------------------------------

    return res.status(500).json({
      success: false,
      message:
        "Unable to update claim.",
      error:
        error.message,
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

  console.log("\n=========================================");
  console.log("📤 SUBMIT CLAIM REQUEST RECEIVED");
  console.log("=========================================");

  try {

    const { id } = req.params;

    console.log(
      "🆔 Claim ID:",
      id
    );

    // ------------------------------------------
    // Find claim
    // ------------------------------------------

    const claim =
      await Claim.findById(id);

    if (!claim) {

      console.error(
        "❌ CLAIM NOT FOUND:",
        id
      );

      return res.status(404).json({
        success: false,
        message: "Claim not found.",
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

      console.error(
        "❌ USER DOES NOT HAVE ACCESS TO CLAIM"
      );

      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to submit this claim.",
      });
    }

    console.log(
      "✅ Claim access check passed"
    );

    // ------------------------------------------
    // Check status
    // ------------------------------------------

    if (
      claim.status !==
      "draft"
    ) {

      console.error(
        "❌ INVALID CLAIM STATUS:",
        claim.status
      );

      return res.status(400).json({
        success: false,
        message:
          `Claim cannot be submitted because its current status is "${claim.status}".`,
        currentStatus:
          claim.status,
      });
    }

    console.log(
      "✅ Status check passed: draft"
    );

    // ------------------------------------------
    // Validate claim data
    // ------------------------------------------

    if (
      !claim.claimData ||
      Object.keys(
        claim.claimData
      ).length === 0
    ) {

      console.error(
        "❌ CLAIM DATA IS EMPTY"
      );

      return res.status(400).json({
        success: false,
        message:
          "Claim data is empty. Please complete the form before submitting.",
      });
    }

    console.log(
      "✅ Claim data check passed"
    );

    // ------------------------------------------
    // Check documents
    // ------------------------------------------

    if (
      !Array.isArray(
        claim.documents
      )
    ) {

      console.error(
        "❌ CLAIM DOCUMENTS IS NOT AN ARRAY"
      );

      return res.status(400).json({
        success: false,
        message:
          "Claim documents data is invalid.",
      });
    }

    console.log(
      "📄 Document count:",
      claim.documents.length
    );

    // ------------------------------------------
    // Validate documents
    // ------------------------------------------

    const invalidDocuments =
      claim.documents.filter(
        (document) => {
          return (
            !document.name ||
            !document.url
          );
        }
      );

    if (
      invalidDocuments.length > 0
    ) {

      console.error(
        "❌ INVALID DOCUMENTS FOUND:"
      );

      return res.status(400).json({
        success: false,
        message:
          "One or more claim documents are invalid.",
        errors:
          invalidDocuments.map(
            (document) => ({
              name:
                document.name ||
                null,

              url:
                document.url ||
                null,

              type:
                document.type ||
                null,
            })
          ),
      });
    }

    console.log(
      "✅ Document validation passed"
    );

    // ------------------------------------------
    // Set submission data
    // ------------------------------------------

    claim.status =
      "submitted";

    claim.submittedAt =
      new Date();

    // ------------------------------------------
    // Save
    // ------------------------------------------

    await claim.save();

    console.log(
      "✅ CLAIM SUBMITTED SUCCESSFULLY"
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
      "Status:",
      claim.status
    );

    console.log(
      "=========================================\n"
    );

    return res.status(200).json({
      success: true,

      message:
        "Claim submitted successfully.",

      claim,
    });

  } catch (error) {

    console.error(
      "\n========================================="
    );

    console.error(
      "❌ SUBMIT CLAIM ERROR"
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

    if (error.errors) {

      console.error(
        "\n🔴 MONGOOSE VALIDATION ERRORS:"
      );

      Object.entries(
        error.errors
      ).forEach(
        ([field, fieldError]) => {

          console.error(
            `❌ ${field}: ${fieldError.message}`
          );

          console.error(
            "Value:",
            fieldError.value
          );

        }
      );
    }

    console.error(
      "Stack:",
      error.stack
    );

    // ------------------------------------------
    // Validation Error
    // ------------------------------------------

    if (
      error.name ===
      "ValidationError"
    ) {

      const validationErrors =
        Object.values(
          error.errors || {}
        ).map((item) => ({
          field:
            item.path,

          message:
            item.message,

          value:
            item.value,
        }));

      return res.status(400).json({
        success: false,

        message:
          "Claim validation failed.",

        errors:
          validationErrors,

        details:
          validationErrors,
      });
    }

    // ------------------------------------------
    // Cast Error
    // ------------------------------------------

    if (
      error.name ===
      "CastError"
    ) {

      return res.status(400).json({
        success: false,

        message:
          "Invalid claim ID.",

        error:
          error.message,
      });
    }

    // ------------------------------------------
    // Duplicate Key
    // ------------------------------------------

    if (
      error.code === 11000
    ) {

      return res.status(409).json({
        success: false,

        message:
          "Duplicate claim data.",

        error:
          error.message,
      });
    }

    // ------------------------------------------
    // Other errors
    // ------------------------------------------

    return res.status(500).json({
      success: false,

      message:
        "Unable to submit claim.",

      error:
        error.message,
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

    const claim =
      await Claim.findById(id);

    if (!claim) {

      return res.status(404).json({
        success: false,
        message: "Claim not found.",
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
    // Only draft claims can be deleted
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
    // Delete claim
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
      error:
        error.message,
    });
  }
};

// ==========================================
// GET CLAIMS BY CATEGORY
// GET /api/claims/category/:category
// ==========================================

const getClaimsByCategory =
  async (req, res) => {

    try {

      const { category } =
        req.params;

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

      const userId =
        getUserId(req);

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
        error:
          error.message,
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