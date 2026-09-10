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

// Register / Signup User
router.post("/register", registerUser);
router.post("/signup", registerUser);

// Login User
router.post("/login", loginUser);

// Get Logged-in User Profile
router.get("/profile", protect, getProfile);

export default router;