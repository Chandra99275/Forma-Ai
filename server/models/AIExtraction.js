import mongoose from "mongoose";

const aiExtractionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    formId: {
      type: String,
      required: true,
    },

    originalText: {
      type: String,
      required: true,
    },

    extractedFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    confidence: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AIExtraction", aiExtractionSchema);