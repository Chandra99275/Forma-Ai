import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ==========================================
   Generate JWT Token
========================================== */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/* ==========================================
   Register User (Signup)
   POST /api/auth/register
========================================== */
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;

    // Validate Input
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* ==========================================
   Login User
   POST /api/auth/login
========================================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Login Success
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* ==========================================
   Get Logged-in User Profile
   GET /api/auth/profile
========================================== */
export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        mobile: req.user.mobile,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Profile Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

/* ==========================================
   Update Logged-in User Profile
   PUT /api/auth/profile
========================================== */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.mobile = req.body.mobile || user.mobile;

    // Update Password if Provided
    if (req.body.password && req.body.password.trim() !== "") {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};