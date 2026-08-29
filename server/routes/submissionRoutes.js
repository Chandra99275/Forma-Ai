import express from "express";
import {
  saveDraft,
  submitForm,
  getSubmissions,
} from "../controllers/submissionController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Save draft
router.post("/draft", authMiddleware, saveDraft);

// Submit completed form
router.post("/submit", authMiddleware, submitForm);

// Get logged-in user's submissions
router.get("/", authMiddleware, getSubmissions);

export default router;