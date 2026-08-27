import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema(
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

    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    status: {
      type: String,
      enum: ["draft", "submitted"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FormSubmission", formSubmissionSchema);