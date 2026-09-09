// ==========================================
// Forma AI - Document Routes
// ==========================================

import express from "express";

import {
  uploadDocument,
  getClaimDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  updateOCRStatus,
} from "../controllers/documentController.js";

import {
  validateDocumentUpload,
  validateDocumentId,
  validateDocumentClaimId,
  validateDocumentUpdate,
  validateOCRUpdate,
} from "../validators/documentValidator.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ==========================================
// Upload Document
// POST /api/documents/upload
// ==========================================

router.post(
  "/upload",
  upload.single("document"),
  validateDocumentUpload,
  uploadDocument
);

// ==========================================
// Get Documents for a Claim
// GET /api/documents/claim/:claimId
// ==========================================

router.get(
  "/claim/:claimId",
  validateDocumentClaimId,
  getClaimDocuments
);

// ==========================================
// Get Single Document
// GET /api/documents/document/:id
// ==========================================

router.get(
  "/document/:id",
  validateDocumentId,
  getDocumentById
);

// ==========================================
// Update Document
// PUT /api/documents/:id
// ==========================================

router.put(
  "/:id",
  validateDocumentId,
  validateDocumentUpdate,
  updateDocument
);

// ==========================================
// Delete Document
// DELETE /api/documents/:id
// ==========================================

router.delete(
  "/:id",
  validateDocumentId,
  deleteDocument
);

// ==========================================
// Update OCR Status
// PATCH /api/documents/:id/ocr
// ==========================================

router.patch(
  "/:id/ocr",
  validateDocumentId,
  validateOCRUpdate,
  updateOCRStatus
);

// ==========================================
// Default Export
// ==========================================

export default router;