// ==========================================
// Forma AI - Claim Routes
// ==========================================

import express from "express";

// ==========================================
// Claim Controllers
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
// Claim Validators
// ==========================================

import {
  validateCreateClaim,
  validateUpdateClaim,
  validateClaimId,
  validateClaimCategory,
} from "../validators/claimValidator.js";

// ==========================================
// Router
// ==========================================

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
//
// Used by Submissions page to edit
// existing draft claim data.
//
// Request body:
//
// {
//   "category": "vehicle",
//   "claimData": {
//     "vehicle": "Honda",
//     "incidentType": "animal_collision"
//   }
// }
//
// ==========================================

router.put(
  "/:id",
  validateClaimId,
  validateUpdateClaim,
  (req, res, next) => {
    console.log("\n=========================================");
    console.log("✏️ CLAIM UPDATE ROUTE HIT");
    console.log("=========================================");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Claim ID:", req.params.id);
    console.log(
      "User:",
      req.user || "Guest / Prototype Mode"
    );
    console.log(
      "Request Body:",
      JSON.stringify(req.body, null, 2)
    );
    console.log("=========================================\n");

    next();
  },
  updateClaim
);

// ==========================================
// SUBMIT CLAIM
// POST /api/claims/:id/submit
// ==========================================
//
// Converts a draft claim into submitted status.
//
// ==========================================

router.post(
  "/:id/submit",
  validateClaimId,
  (req, res, next) => {
    console.log("\n=========================================");
    console.log("📤 CLAIM SUBMIT ROUTE HIT");
    console.log("=========================================");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Claim ID:", req.params.id);
    console.log(
      "User:",
      req.user || "Guest / Prototype Mode"
    );
    console.log("=========================================\n");

    next();
  },
  submitClaim
);

// ==========================================
// DELETE CLAIM
// DELETE /api/claims/:id
// ==========================================
//
// Deletes only draft claims.
//
// ==========================================

router.delete(
  "/:id",
  validateClaimId,
  (req, res, next) => {
    console.log("\n=========================================");
    console.log("🗑️ CLAIM DELETE ROUTE HIT");
    console.log("=========================================");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Claim ID:", req.params.id);
    console.log(
      "User:",
      req.user || "Guest / Prototype Mode"
    );
    console.log("=========================================\n");

    next();
  },
  deleteClaim
);

// ==========================================
// EXPORT ROUTER
// ==========================================

export default router;