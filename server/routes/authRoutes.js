import express from "express";
import { register, login } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================
// Authentication Routes
// ===============================

// User Signup
router.post("/signup", register);

// User Login
router.post("/login", login);

// Get Logged-in User Profile (Protected Route)
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully.",
    user: req.user,
  });
});

export default router;