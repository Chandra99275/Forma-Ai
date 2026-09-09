// ==========================================
// Forma AI - Claim Controller
// ==========================================

import Claim from "../models/Claim.js";
import { generateClaimNumber } from "../utils/claimNumber.js";

// ==========================================
// Create Claim
// POST /api/claims
// ==========================================

const createClaim = async (req, res, next) => {
  try {
    const {
      category,
      claimData,
      documents,
      status,
    } = req.body;

    const claimNumber = await generateClaimNumber();

    const claim = await Claim.create({
      claimNumber,
      userId: req.user?._id || null,
      category,
      claimData: claimData || {},
      documents: documents || [],
      status: status || "draft",
    });

    res.status(201).json({
      success: true,
      message: "Claim created successfully",
      claim,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get All Claims
// GET /api/claims
// ==========================================

const getClaims = async (req, res, next) => {
  try {
    const filter = {};

    // If authentication middleware is being used,
    // only return the logged-in user's claims.
    if (req.user?._id) {
      filter.userId = req.user._id;
    }

    const claims = await Claim.find(filter)
      .populate("userId", "name email")
      .populate("documents")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Claim By ID
// GET /api/claims/:id
// ==========================================

const getClaimById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const claim = await Claim.findById(id)
      .populate("userId", "name email")
      .populate("documents")
      .populate("aiAnalysis");

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    // Ownership check
    if (
      req.user?._id &&
      claim.userId &&
      claim.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this claim",
      });
    }

    res.status(200).json({
      success: true,
      claim,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update Claim
// PUT /api/claims/:id
// ==========================================

const updateClaim = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      claimData,
      documents,
      status,
    } = req.body;

    const claim = await Claim.findById(id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    // Ownership check
    if (
      req.user?._id &&
      claim.userId &&
      claim.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this claim",
      });
    }

    // Do not allow modification after final decision
    if (
      claim.status === "approved" ||
      claim.status === "rejected"
    ) {
      return res.status(400).json({
        success: false,
        message: "Approved or rejected claims cannot be modified",
      });
    }

    // Update claim data
    if (claimData !== undefined) {
      claim.claimData = {
        ...claim.claimData,
        ...claimData,
      };
    }

    // Update documents
    if (documents !== undefined) {
      claim.documents = documents;
    }

    // Update status
    if (status !== undefined) {
      claim.status = status;
    }

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim updated successfully",
      claim,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Submit Claim
// POST /api/claims/:id/submit
// ==========================================

const submitClaim = async (req, res, next) => {
  try {
    const { id } = req.params;

    const claim = await Claim.findById(id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    // Ownership check
    if (
      req.user?._id &&
      claim.userId &&
      claim.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to submit this claim",
      });
    }

    // Check current status
    if (claim.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: `Claim cannot be submitted because its current status is "${claim.status}"`,
      });
    }

    // Check claim data
    if (
      !claim.claimData ||
      Object.keys(claim.claimData).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Claim data is empty. Please complete the claim before submitting",
      });
    }

    claim.status = "submitted";
    claim.submittedAt = new Date();

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim submitted successfully",
      claim,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Delete Claim
// DELETE /api/claims/:id
// ==========================================

const deleteClaim = async (req, res, next) => {
  try {
    const { id } = req.params;

    const claim = await Claim.findById(id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    // Ownership check
    if (
      req.user?._id &&
      claim.userId &&
      claim.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this claim",
      });
    }

    // Only drafts can be deleted
    if (claim.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft claims can be deleted",
      });
    }

    await Claim.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Claim deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Claims By Category
// GET /api/claims/category/:category
// ==========================================

const getClaimsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const filter = {
      category,
    };

    // If authentication is enabled,
    // restrict results to current user.
    if (req.user?._id) {
      filter.userId = req.user._id;
    }

    const claims = await Claim.find(filter)
      .populate("documents")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      category,
      count: claims.length,
      claims,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Export Controllers
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