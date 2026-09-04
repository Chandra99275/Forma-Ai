import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================
   Authentication Routes
========================================== */

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Get Logged-in User Profile
router.get("/profile", protect, getProfile);

export default router;