// ==============================================
// Forma AI - AI Routes
// File: server/routes/aiRoutes.js
// ==============================================

import express from "express";
import { prefillForm } from "../controllers/aiController.js";

const router = express.Router();

// ==============================================
// AI Description Parser
// POST /api/ai/parse-description
//
// Flow:
// Frontend Description
//        ↓
// AI Route
//        ↓
// AI Controller
//        ↓
// Gemini AI
//        ↓
// Structured Insurance Claim
// ==============================================

router.post("/parse-description", prefillForm);

// ==============================================
// Export Router
// ==============================================

export default router;