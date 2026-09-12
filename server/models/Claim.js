
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

    claimData: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },

    // --------------------------------------
    // Uploaded Documents
    // --------------------------------------
    //
    // Documents are embedded directly inside
    // the claim document.
    //
    // Example:
    //
    // documents: [
    //   {
    //     name: "CLM-2026-0005.pdf",
    //     url: "/uploads/pdfs/CLM-2026-0005.pdf",
    //     type: "claim-pdf"
    //   }
    // ]
    //

    documents: {
      type: [claimDocumentSchema],
      default: [],
    },

    // --------------------------------------
    // AI Analysis
    // --------------------------------------
    //
    // AI analysis is embedded directly inside
    // the claim document.
    //
    // Example:
    //
    // aiAnalysis: {
    //   summary: "...",
    //   confidence: 0.98,
    //   source: "description"
    // }
    //

    aiAnalysis: {
      type: aiAnalysisSchema,
      default: () => ({}),
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

    // --------------------------------------
    // Risk Score
    // --------------------------------------

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
    // PDF URL
    // --------------------------------------

    pdfUrl: {
      type: String,
      default: "",
      trim: true,
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
// claimNumber already has unique: true,
// which creates a unique index.
//

claimSchema.index({
  claimNumber: 1,
});

// ==========================================
// Automatically Set Submitted Date
// ==========================================

claimSchema.pre("save", function (next) {
  if (
    this.status === "submitted" &&
    !this.submittedAt
  ) {
    this.submittedAt = new Date();
  }

  next();
});

// ==========================================
// Pre-validation Logging
// ==========================================

claimSchema.pre("validate", function (next) {
  console.log("");
  console.log("-----------------------------------------");
  console.log("🔍 CLAIM MODEL VALIDATION");
  console.log("-----------------------------------------");

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
    "AI Analysis:",
    this.aiAnalysis
  );

  console.log(
    "Documents:",
    this.documents
  );

  console.log("-----------------------------------------");
  console.log("");

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

