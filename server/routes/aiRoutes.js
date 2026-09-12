// ==============================================
// Forma AI - AI Routes
// ==============================================

import express from "express";
import { prefillForm } from "../controllers/aiController.js";

const router = express.Router();

// ==============================================
// AI Description Parser
// Description → Gemini AI → Structured Claim → PDF
// ==============================================

router.post("/parse-description", prefillForm);

export default router;