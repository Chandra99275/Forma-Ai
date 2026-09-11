// ==========================================
// Forma AI - Claim Routes
// ==========================================

import express from "express";

import {
  createClaim,
  getClaims,
  getClaimById,
  updateClaim,
  submitClaim,
  deleteClaim,
  getClaimsByCategory,
} from "../controllers/claimController.js";

import {
  validateCreateClaim,
  validateUpdateClaim,
  validateClaimId,
  validateClaimCategory,
} from "../validators/claimValidator.js";

const router = express.Router();

// ==========================================
// CREATE CLAIM
// POST /api/claims
// ==========================================

router.post(
  "/",
  validateCreateClaim,
  createClaim
);

// ==========================================
// GET ALL CLAIMS
// GET /api/claims
// ==========================================

router.get(
  "/",
  getClaims
);

// ==========================================
// GET CLAIMS BY CATEGORY
// GET /api/claims/category/:category
// ==========================================

router.get(
  "/category/:category",
  validateClaimCategory,
  getClaimsByCategory
);

// ==========================================
// GET SINGLE CLAIM
// GET /api/claims/:id
// ==========================================

router.get(
  "/:id",
  validateClaimId,
  getClaimById
);

// ==========================================
// UPDATE CLAIM
// PUT /api/claims/:id
// ==========================================

router.put(
  "/:id",
  validateClaimId,
  validateUpdateClaim,
  updateClaim
);

// ==========================================
// SUBMIT CLAIM
// POST /api/claims/:id/submit
// ==========================================

router.post(
  "/:id/submit",
  validateClaimId,
  submitClaim
);

// ==========================================
// DELETE CLAIM
// DELETE /api/claims/:id
// ==========================================

router.delete(
  "/:id",
  validateClaimId,
  deleteClaim
);

export default router;
