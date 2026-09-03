import mongoose from "mongoose";

/*
 * Validation rules for each dynamic form question.
 * These rules are stored in MongoDB along with the form schema.
 */
const validationSchema = new mongoose.Schema(
  {
    minLength: {
      type: Number,
      min: 0,
    },

    maxLength: {
      type: Number,
      min: 0,
    },

    min: {
      type: Number,
    },

    max: {
      type: Number,
    },

    pattern: {
      type: String,
    },

    errorMessage: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

/*
 * Schema for every question in a dynamic form.
 */
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

    /*
     * Optional validation configuration.
     *
     * Example:
     * {
     *   min: 18,
     *   max: 100,
     *   errorMessage: "Age must be between 18 and 100."
     * }
     */
    validation: {
      type: validationSchema,
      default: () => ({}),
    },

    /*
     * Controls whether a question should be shown.
     * We will improve this branching structure later.
     */
    showIf: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    _id: false,
  }
);

/*
 * Main Forma AI form schema.
 */
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