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
      required: true,
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
      required: true,
      enum: [
        "health",
        "vehicle",
        "property",
        "travel",
        "life",
      ],
    },

    // --------------------------------------
    // Claim Status
    // --------------------------------------

    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
      ],
      default: "draft",
    },

    // --------------------------------------
    // Dynamic Form Data
    // --------------------------------------

    claimData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // --------------------------------------
    // Uploaded Documents
    // --------------------------------------

    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // --------------------------------------
    // AI Analysis
    // --------------------------------------

    aiAnalysis: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AIAnalysis",
      },
    ],

    // --------------------------------------
    // AI Summary
    // --------------------------------------

    aiSummary: {
      type: String,
      default: "",
    },

    // --------------------------------------
    // AI Confidence
    // --------------------------------------

    aiConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },

    // --------------------------------------
    // Risk Score
    // --------------------------------------

    riskScore: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },

    // --------------------------------------
    // Risk Level
    // --------------------------------------

    riskLevel: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
        "unknown",
      ],
      default: "unknown",
    },

    // --------------------------------------
    // Reviewer Information
    // --------------------------------------

    reviewerNotes: {
      type: String,
      default: "",
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

claimSchema.index({
  userId: 1,
  createdAt: -1,
});

claimSchema.index({
  category: 1,
  status: 1,
});

claimSchema.index({
  claimNumber: 1,
});

// ==========================================
// Create Model
// ==========================================

const Claim = mongoose.model("Claim", claimSchema);

// ==========================================
// Export Model
// ==========================================

export default Claim;