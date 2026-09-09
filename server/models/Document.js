// ==========================================
// Forma AI - Document Model
// ==========================================

import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    // ==========================================
    // Claim Reference
    // ==========================================

    claimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      required: true,
      index: true,
    },

    // ==========================================
    // User Reference
    // ==========================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ==========================================
    // File Information
    // ==========================================

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    filePath: {
      type: String,
      required: true,
      trim: true,
    },

    fileType: {
      type: String,
      required: true,
      trim: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    // ==========================================
    // Document Type
    // ==========================================

    documentType: {
      type: String,
      enum: [
        "hospital_bill",
        "medical_report",
        "prescription",
        "discharge_summary",
        "insurance_policy",
        "identity_proof",
        "fir",
        "vehicle_document",
        "travel_document",
        "death_certificate",
        "supporting_document",
        "other",
      ],
      default: "other",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // OCR Information
    // ==========================================

    ocrStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
      ],
      default: "pending",
    },

    extractedText: {
      type: String,
      default: "",
    },

    extractedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    ocrConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },

    // ==========================================
    // Verification
    // ==========================================

    verificationStatus: {
      type: String,
      enum: [
        "pending",
        "verified",
        "rejected",
      ],
      default: "pending",
    },

    verificationNotes: {
      type: String,
      default: "",
    },

    // ==========================================
    // Processing Information
    // ==========================================

    processedAt: {
      type: Date,
      default: null,
    },

    processingError: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// Indexes
// ==========================================

documentSchema.index({
  claimId: 1,
  createdAt: -1,
});

documentSchema.index({
  documentType: 1,
});

documentSchema.index({
  ocrStatus: 1,
});

// ==========================================
// Create Model
// ==========================================

const Document = mongoose.model(
  "Document",
  documentSchema
);

// ==========================================
// Default Export
// ==========================================

export default Document;