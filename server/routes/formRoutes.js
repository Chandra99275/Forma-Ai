import express from "express";
import {
  getAllForms,
  getFormSchema,
  createFormSchema,
  updateFormSchema,
  deleteFormSchema,
  getVisibleQuestions,
} from "../controllers/formController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================
   PUBLIC ROUTES
========================================== */

// Get all available form templates
// GET /api/forms
router.get("/", getAllForms);

// Get a complete form schema by formId
// GET /api/forms/:formId
router.get("/:formId", getFormSchema);

// Get visible questions based on user's answers
// POST /api/forms/visible-fields
router.post("/visible-fields", getVisibleQuestions);

/* ==========================================
   PROTECTED ROUTES (Admin)
========================================== */

// Create a new dynamic form
// POST /api/forms
router.post("/", protect, createFormSchema);

// Update an existing form
// PUT /api/forms/:formId
router.put("/:formId", protect, updateFormSchema);

// Delete a form
// DELETE /api/forms/:formId
router.delete("/:formId", protect, deleteFormSchema);

export default router;