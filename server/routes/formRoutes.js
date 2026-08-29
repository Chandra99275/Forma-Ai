import express from "express";
import {
  getFormSchema,
  getVisibleQuestions,
} from "../controllers/formController.js";

const router = express.Router();

// Get complete form schema
router.get("/:formId", getFormSchema);

// Get only visible questions based on answers
router.post("/visible-fields", getVisibleQuestions);

export default router;