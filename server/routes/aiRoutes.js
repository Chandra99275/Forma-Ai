import express from "express";
import { prefillForm } from "../controllers/aiController.js";

const router = express.Router();

// AI parses natural language and returns structured fields
router.post("/prefill", prefillForm);

export default router;