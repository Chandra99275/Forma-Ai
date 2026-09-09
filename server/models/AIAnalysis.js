const mongoose = require("mongoose");

const aiAnalysisSchema = new mongoose.Schema(
  {
    // ==========================================
    // CLAIM REFERENCE
    // ==========================================

    claimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      required: true,
      index: true,
    },

    // ==========================================
    // DOCUMENT REFERENCE
    // Optional - analysis can come directly
    // from user text or from an uploaded document
    // ==========================================

    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      default: null,
    },

    // ==========================================
    // AI ANALYSIS TYPE
    // ==========================================

    analysisType: {
      type: String,
      enum: [
        "text_parsing",
        "document_ocr",
        "claim_validation",
        "fraud_detection",
        "field_extraction",
        "claim_summary",
      ],
      required: true,
    },

    // ==========================================
    // ORIGINAL INPUT
    // ==========================================

    inputText: {
      type: String,
      default: "",
    },

    // ==========================================
    // EXTRACTED INFORMATION
    // ==========================================

    extractedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Example:
    //
    // {
    //   patientName: "Rahul",
    //   hospitalName: "Apollo Hospital",
    //   diagnosis: "Fracture",
    //   treatmentCost: 45000
    // }

    // ==========================================
    // FIELD CONFIDENCE
    // ==========================================

    fieldConfidence: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Example:
    //
    // {
    //   patientName: 0.98,
    //   hospitalName: 0.95,
    //   diagnosis: 0.91,
    //   treatmentCost: 0.87
    // }

    overallConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },

    // ==========================================
    // VALIDATION RESULT
    // ==========================================

    validationResult: {
      type: String,
      enum: [
        "valid",
        "invalid",
        "needs_review",
        "incomplete",
      ],
      default: "incomplete",
    },

    // ==========================================
    // MISSING FIELDS
    // ==========================================

    missingFields: {
      type: [String],
      default: [],
    },

    // ==========================================
    // VALIDATION ERRORS
    // ==========================================

    validationErrors: {
      type: [String],
      default: [],
    },

    // ==========================================
    // AI FLAGS
    // ==========================================

    flags: {
      type: [String],
      default: [],
    },

    // Example:
    //
    // [
    //   "Missing hospital bill",
    //   "Treatment cost needs verification"
    // ]

    // ==========================================
    // FRAUD / RISK SCORE
    // ==========================================

    riskScore: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },

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

    // ==========================================
    // AI SUMMARY
    // ==========================================

    summary: {
      type: String,
      default: "",
    },

    // ==========================================
    // AI RECOMMENDATION
    // ==========================================

    recommendation: {
      type: String,
      default: "",
    },

    // ==========================================
    // MODEL INFORMATION
    // ==========================================

    modelName: {
      type: String,
      default: "",
    },

    modelVersion: {
      type: String,
      default: "",
    },

    // ==========================================
    // PROCESSING STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
      ],
      default: "pending",
    },

    errorMessage: {
      type: String,
      default: "",
    },

    // ==========================================
    // PROCESSING TIME
    // ==========================================

    processingTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

aiAnalysisSchema.index({
  claimId: 1,
  createdAt: -1,
});

aiAnalysisSchema.index({
  analysisType: 1,
});

// ==========================================
// MODEL
// ==========================================

const AIAnalysis = mongoose.model(
  "AIAnalysis",
  aiAnalysisSchema
);

module.exports = AIAnalysis;