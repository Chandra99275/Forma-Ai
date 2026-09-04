import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    // Dynamic Form ID
    formId: {
      type: String,
      required: true,
    },

    // Logged-in User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // All answers stored dynamically
    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Draft / Submitted / Approved
    status: {
      type: String,
      enum: ["draft", "submitted", "review", "approved", "rejected"],
      default: "draft",
    },

    // AI confidence score
    aiConfidence: {
      type: Number,
      default: 0,
    },

    // Uploaded documents
    documents: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;