// ==========================================
// Forma AI - Claim Model
// ==========================================

import mongoose from "mongoose";

// ==========================================
// Embedded Document Schema
// ==========================================

const claimDocumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "document",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// ==========================================
// Embedded AI Analysis Schema
// ==========================================

const aiAnalysisSchema = new mongoose.Schema(
  {
    summary: {
      type: String,
      default: "",
      trim: true,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },

    source: {
      type: String,
      default: "description",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// ==========================================
// Claim Schema
// ==========================================

const claimSchema = new mongoose.Schema(
  {
    // ========================================
    // Claim Number
    // ========================================

    claimNumber: {
      type: String,

      required: [
        true,
        "Claim number is required.",
      ],

      unique: true,

      trim: true,

      index: true,
    },

    // ========================================
    // User
    // ========================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,

      index: true,
    },

    // ========================================
    // Insurance Category
    // ========================================

    category: {
      type: String,

      required: [
        true,
        "Insurance category is required.",
      ],

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

      index: true,
    },

    // ========================================
    // Claim Status
    // ========================================

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

      index: true,
    },

    // ========================================
    // Dynamic Form Data
    // ========================================
    //
    // This stores all dynamic form answers.
    //
    // Example:
    //
    // claimData: {
    //   incidentType: "animal_collision",
    //   vehicle: "Honda",
    //   damage: "windshield",
    //   location: "I-95"
    // }
    //
    // ========================================

    claimData: {
      type: mongoose.Schema.Types.Mixed,

      default: () => ({}),
    },

    // ========================================
    // Uploaded Documents
    // ========================================

    documents: {
      type: [claimDocumentSchema],

      default: [],
    },

    // ========================================
    // AI Analysis
    // ========================================

    aiAnalysis: {
      type: aiAnalysisSchema,

      default: () => ({}),
    },

    // ========================================
    // AI Summary
    // ========================================

    aiSummary: {
      type: String,

      default: "",

      trim: true,
    },

    // ========================================
    // AI Confidence
    // ========================================

    aiConfidence: {
      type: Number,

      min: [
        0,
        "AI confidence cannot be less than 0.",
      ],

      max: [
        1,
        "AI confidence cannot be greater than 1.",
      ],

      default: null,
    },

    // ========================================
    // Risk Score
    // ========================================

    riskScore: {
      type: Number,

      min: [
        0,
        "Risk score cannot be less than 0.",
      ],

      max: [
        1,
        "Risk score cannot be greater than 1.",
      ],

      default: null,
    },

    // ========================================
    // Risk Level
    // ========================================

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

    // ========================================
    // Reviewer Information
    // ========================================

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

    // ========================================
    // Submission Information
    // ========================================

    submittedAt: {
      type: Date,

      default: null,
    },

    // ========================================
    // PDF URL
    // ========================================

    pdfUrl: {
      type: String,

      default: "",

      trim: true,
    },

    // ========================================
    // Decision Information
    // ========================================

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

  // ==========================================
  // Schema Options
  // ==========================================

  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

// ------------------------------------------
// User + Created Date
// ------------------------------------------

claimSchema.index({
  userId: 1,
  createdAt: -1,
});

// ------------------------------------------
// User + Status
// ------------------------------------------

claimSchema.index({
  userId: 1,
  status: 1,
});

// ------------------------------------------
// Category + Status
// ------------------------------------------

claimSchema.index({
  category: 1,
  status: 1,
});

// ------------------------------------------
// Category + Created Date
// ------------------------------------------

claimSchema.index({
  category: 1,
  createdAt: -1,
});

// ------------------------------------------
// Claim Number
// ------------------------------------------
//
// claimNumber already has:
//
// unique: true
// index: true
//
// Therefore MongoDB creates a unique index.
// No additional claimNumber index is required.
// ------------------------------------------

// ==========================================
// PRE-SAVE HOOK
// Automatically Set Submitted Date
// ==========================================

claimSchema.pre(
  "save",
  function (next) {
    // ----------------------------------------
    // When claim becomes submitted
    // ----------------------------------------

    if (
      this.status === "submitted" &&
      !this.submittedAt
    ) {
      this.submittedAt = new Date();
    }

    // ----------------------------------------
    // When claim returns to draft
    // ----------------------------------------
    //
    // Do not automatically remove submittedAt.
    // This preserves the submission history.
    //
    // ----------------------------------------

    next();
  }
);

// ==========================================
// PRE-VALIDATION LOGGING
// ==========================================

claimSchema.pre(
  "validate",
  function (next) {

    console.log("");

    console.log(
      "-----------------------------------------"
    );

    console.log(
      "🔍 CLAIM MODEL VALIDATION"
    );

    console.log(
      "-----------------------------------------"
    );

    console.log(
      "Claim ID:",
      this._id || "New Claim"
    );

    console.log(
      "Claim Number:",
      this.claimNumber
    );

    console.log(
      "User ID:",
      this.userId || "Guest"
    );

    console.log(
      "Category:",
      this.category
    );

    console.log(
      "Status:",
      this.status
    );

    console.log(
      "Claim Data:",
      this.claimData
    );

    console.log(
      "Documents:",
      this.documents
    );

    console.log(
      "AI Analysis:",
      this.aiAnalysis
    );

    console.log(
      "AI Summary:",
      this.aiSummary
    );

    console.log(
      "AI Confidence:",
      this.aiConfidence
    );

    console.log(
      "Risk Score:",
      this.riskScore
    );

    console.log(
      "Risk Level:",
      this.riskLevel
    );

    console.log(
      "Submitted At:",
      this.submittedAt
    );

    console.log(
      "-----------------------------------------"
    );

    console.log("");

    next();
  }
);

// ==========================================
// CREATE MODEL
// ==========================================

const Claim = mongoose.model(
  "Claim",
  claimSchema
);

// ==========================================
// EXPORT MODEL
// ==========================================

export default Claim;