import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Full Name
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    // Email Address
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Mobile Number
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
    },

    // Password (Hashed)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // User Role
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export User Model
const User = mongoose.model("User", userSchema);

export default User;