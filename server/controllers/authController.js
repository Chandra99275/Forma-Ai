import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===============================
// Generate JWT Token
// ===============================
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ===============================
// Register User (Signup)
// ===============================
export const register = async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;

    // Check required fields
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      fullName,
      email,
      mobile,
      password: hashedPassword,
    });

    // Response
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
      message: "Server Error",
    });
  }
};

// ===============================
// Login User
// ===============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Login response
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
      message: "Server Error",
    });
  }
};