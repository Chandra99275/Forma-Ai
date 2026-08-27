import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "textarea", "select", "boolean", "date", "number"],
      required: true,
    },

    options: {
      type: [String],
      default: [],
    },

    required: {
      type: Boolean,
      default: false,
    },

    showIf: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { _id: false }
);

const formSchema = new mongoose.Schema(
  {
    formId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FormSchema", formSchema);