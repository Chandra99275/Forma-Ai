import express from "express";

import {
  saveDraft,
  submitForm,
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  deleteSubmission,
} from "../controllers/submissionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================
   USER ROUTES
========================================== */

// Save Draft
// POST /api/submissions/draft
router.post("/draft", protect, saveDraft);

// Submit Completed Form
// POST /api/submissions/submit
router.post("/submit", protect, submitForm);

// Get Logged-in User Submissions
// GET /api/submissions
router.get("/", protect, getSubmissions);

// Get Single Submission
// GET /api/submissions/:id
router.get("/:id", protect, getSubmissionById);

/* ==========================================
   UPDATE & DELETE SUBMISSIONS
========================================== */

// Update Submission Status
// PUT /api/submissions/:id
router.put("/:id", protect, updateSubmissionStatus);

// Delete Submission
// DELETE /api/submissions/:id
router.delete("/:id", protect, deleteSubmission);

export default router;