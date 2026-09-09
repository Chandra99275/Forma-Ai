// ==========================================
// Forma AI - Claim Routes
// ==========================================

import express from "express";

// ==========================================
// Controllers
// ==========================================

import {
  createClaim,
  getClaims,
  getClaimById,
  updateClaim,
  submitClaim,
  deleteClaim,
  getClaimsByCategory,
} from "../controllers/claimController.js";

// ==========================================
// Validators
// ==========================================

import {
  validateCreateClaim,
  validateUpdateClaim,
  validateClaimId,
  validateClaimCategory,
} from "../validators/claimValidator.js";

// ==========================================
// Create Router
// ==========================================

const router = express.Router();

/* ==========================================
   CLAIM ROUTES
========================================== */

// ------------------------------------------
// Create Claim
// POST /api/claims
// ------------------------------------------

router.post(
  "/",
  validateCreateClaim,
  createClaim
);

// ------------------------------------------
// Get All Claims
// GET /api/claims
// ------------------------------------------

router.get(
  "/",
  getClaims
);

// ------------------------------------------
// Get Claims By Category
// GET /api/claims/category/:category
// ------------------------------------------

router.get(
  "/category/:category",
  validateClaimCategory,
  getClaimsByCategory
);

// ------------------------------------------
// Get Single Claim
// GET /api/claims/:id
// ------------------------------------------

router.get(
  "/:id",
  validateClaimId,
  getClaimById
);

// ------------------------------------------
// Update Claim
// PUT /api/claims/:id
// ------------------------------------------

router.put(
  "/:id",
  validateClaimId,
  validateUpdateClaim,
  updateClaim
);

// ------------------------------------------
// Submit Claim
// POST /api/claims/:id/submit
// ------------------------------------------

router.post(
  "/:id/submit",
  validateClaimId,
  submitClaim
);

// ------------------------------------------
// Delete Claim
// DELETE /api/claims/:id
// ------------------------------------------

router.delete(
  "/:id",
  validateClaimId,
  deleteClaim
);

// ==========================================
// Export Router
// ==========================================

export default router;