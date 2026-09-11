// ==========================================
// Forma AI - Claim Model
// ==========================================

import mongoose from "mongoose";

// ==========================================
// Claim Schema
// ==========================================

const claimSchema = new mongoose.Schema(
  {
    // --------------------------------------
    // Claim Number
    // --------------------------------------

    claimNumber: {
      type: String,
      required: [true, "Claim number is required."],
      unique: true,
      trim: true,
    },

    // --------------------------------------
    // User
    // --------------------------------------

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // --------------------------------------
    // Insurance Category
    // --------------------------------------

    category: {
      type: String,
      required: [true, "Insurance category is required."],
      enum: {
        values: [
          "health",
          "vehicle",
          "property",
          "travel",
          "life",
        ],
        message:
          "Invalid insurance category: {VALUE}.",
      },
      lowercase: true,
      trim: true,
    },

    // --------------------------------------
    // Claim Status
    // --------------------------------------

    status: {
      type: String,
      enum: {
        values: [
          "draft",
          "submitted",
          "under_review",
          "approved",
          "rejected",
        ],
        message:
          "Invalid claim status: {VALUE}.",
      },
      default: "draft",
    },

    // --------------------------------------
    // Dynamic Form Data
    // --------------------------------------
    //
    // This stores the complete dynamic insurance
    // form submitted by the user.
    //
    // Example:
    // {
    //   policyNumber: "POL123",
    //   vehicleNumber: "TS09AB1234",
    //   accidentDate: "...",
    //   damageType: "Windshield"
    // }
    //

    claimData: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },

    // --------------------------------------
    // Uploaded Documents
    // --------------------------------------
    //
    // Document records are stored separately
    // in the Document collection.
    //

    documents: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        },
      ],
      default: [],
    },

    // --------------------------------------
    // AI Analysis
    // --------------------------------------
    //
    // AI analysis records are stored separately
    // in the AIAnalysis collection.
    //

    aiAnalysis: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AIAnalysis",
        },
      ],
      default: [],
    },

    // --------------------------------------
    // AI Summary
    // --------------------------------------

    aiSummary: {
      type: String,
      default: "",
      trim: true,
    },

    // --------------------------------------
    // AI Confidence
    // --------------------------------------

    aiConfidence: {
      type: Number,
      min: [0, "AI confidence cannot be less than 0."],
      max: [1, "AI confidence cannot be greater than 1."],
      default: null,
    },

    // --------------------------------------
    // Risk Score
    // --------------------------------------

    riskScore: {
      type: Number,
      min: [0, "Risk score cannot be less than 0."],
      max: [1, "Risk score cannot be greater than 1."],
      default: null,
    },

    // --------------------------------------
    // Risk Level
    // --------------------------------------

    riskLevel: {
      type: String,
      enum: {
        values: [
          "low",
          "medium",
          "high",
          "unknown",
        ],
        message:
          "Invalid risk level: {VALUE}.",
      },
      default: "unknown",
    },

    // --------------------------------------
    // Reviewer Information
    // --------------------------------------

    reviewerNotes: {
      type: String,
      default: "",
      trim: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    // --------------------------------------
    // Submission Information
    // --------------------------------------

    submittedAt: {
      type: Date,
      default: null,
    },

    // --------------------------------------
    // Decision Information
    // --------------------------------------

    decisionReason: {
      type: String,
      default: "",
      trim: true,
    },

    decisionDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// Indexes
// ==========================================

// User claims
claimSchema.index({
  userId: 1,
  createdAt: -1,
});

// Category + status filtering
claimSchema.index({
  category: 1,
  status: 1,
});

// Claim number lookup
//
// NOTE:
// claimNumber already has unique: true,
// which creates a unique index.
// This explicit index is kept here because
// the existing project may already depend on it.

claimSchema.index({
  claimNumber: 1,
});

// ==========================================
// Pre-validation Logging
// ==========================================
//
// This helps us identify exactly what MongoDB
// is validating when a claim creation fails.
//

claimSchema.pre("validate", function (next) {
  console.log("\n-----------------------------------------");
  console.log("🔍 CLAIM MODEL VALIDATION");
  console.log("-----------------------------------------");
  console.log("Claim Number:", this.claimNumber);
  console.log("User ID:", this.userId || "Guest");
  console.log("Category:", this.category);
  console.log("Status:", this.status);
  console.log(
    "Claim Data:",
    this.claimData
  );
  console.log("-----------------------------------------\n");

  next();
});

// ==========================================
// Create Model
// ==========================================

const Claim = mongoose.model(
  "Claim",
  claimSchema
);

// ==========================================
// Export Model
// ==========================================

export default Claim;