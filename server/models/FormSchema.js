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
      validate: {
        validator: function (value) {
          return (
            this.minLength === undefined ||
            value === undefined ||
            value >= this.minLength
          );
        },
        message: "maxLength must be greater than or equal to minLength.",
      },
    },

    min: {
      type: Number,
    },

    max: {
      type: Number,
      validate: {
        validator: function (value) {
          return (
            this.min === undefined ||
            value === undefined ||
            value >= this.min
          );
        },
        message: "max must be greater than or equal to min.",
      },
    },

    pattern: {
      type: String,
      validate: {
        validator: function (value) {
          if (value === undefined || value === "") {
            return true;
          }

          try {
            new RegExp(value);
            return true;
          } catch (error) {
            return false;
          }
        },
        message: "pattern must be a valid regular expression.",
      },
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
      validate: {
        validator: function (options) {
          // Select questions must have at least one option.
          if (this.type === "select" && options.length === 0) {
            return false;
          }

          // Non-select questions should not contain options.
          if (this.type !== "select" && options.length > 0) {
            return false;
          }

          // Every option must contain meaningful text.
          if (options.some((option) => option.trim() === "")) {
            return false;
          }

          // Prevent duplicate options.
          const normalizedOptions = options.map((option) =>
            option.trim().toLowerCase()
          );

          return normalizedOptions.length === new Set(normalizedOptions).size;
        },
        message:
          "Select questions must have unique, non-empty options, and only select questions can contain options.",
      },
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
      validate: {
        validator: function (value) {
          if (value === null || value === undefined) {
            return true;
          }

          if (typeof value !== "object" || Array.isArray(value)) {
            return false;
          }

          const { questionId, operator, value: conditionValue } = value;

          const allowedOperators = [
            "equals",
            "notEquals",
            "contains",
            "greaterThan",
            "lessThan",
            "greaterThanOrEqual",
            "lessThanOrEqual",
          ];

          return (
            typeof questionId === "string" &&
            questionId.trim() !== "" &&
            typeof operator === "string" &&
            allowedOperators.includes(operator) &&
            conditionValue !== undefined
          );
        },
        message: "showIf must contain a valid questionId, operator, and value.",
      },
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
      trim: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    /*
     * Schema version number.
     *
     * Version starts from 1 and can be increased whenever
     * the structure of a form is changed.
     */
    version: {
      type: Number,
      default: 1,
      min: [1, "Version must be at least 1."],
      validate: {
        validator: Number.isInteger,
        message: "Version must be a whole number.",
      },
    },

    /*
     * Current lifecycle state of the form schema.
     *
     * draft     -> still being edited
     * published -> available for users
     * archived  -> no longer active
     */
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    /*
 * Short note describing what changed in this version.
 */
    versionNote: {
      type: String,
      trim: true,
      default: "",
    },
  
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

/*
 * Prevent duplicate question IDs inside the same form.
 *
 * Question IDs are used to map answers, validation,
 * branching logic, and AI-generated values.
 */
formSchema.pre("validate", function (next) {
  const questionIds = this.questions.map((question) => question.id);
  const uniqueQuestionIds = new Set(questionIds);

  // Prevent duplicate question IDs.
  if (questionIds.length !== uniqueQuestionIds.size) {
    this.invalidate(
      "questions",
      "Question IDs must be unique within a form."
    );
  }

  // Validate conditional visibility references.
  this.questions.forEach((question) => {
    if (!question.showIf) {
      return;
    }

    const { questionId } = question.showIf;

    // The referenced question must exist in the same form.
    if (!questionIds.includes(questionId)) {
      this.invalidate(
        "questions",
        `Question "${question.id}" references a question that does not exist.`
      );
    }

    // A question cannot depend on itself.
    if (questionId === question.id) {
      this.invalidate(
        "questions",
        `Question "${question.id}" cannot reference itself in showIf.`
      );
    }
  });

  // Prevent circular conditional dependencies.
  const dependencies = new Map();

  this.questions.forEach((question) => {
    if (question.showIf && question.showIf.questionId) {
      dependencies.set(question.id, question.showIf.questionId);
    }
  });

  this.questions.forEach((question) => {
    const visited = new Set();
    let currentQuestionId = question.id;

    while (dependencies.has(currentQuestionId)) {
      if (visited.has(currentQuestionId)) {
        this.invalidate(
          "questions",
          `Circular showIf dependency detected involving question "${question.id}".`
        );
        break;
      }

      visited.add(currentQuestionId);
      currentQuestionId = dependencies.get(currentQuestionId);
    }
  });

  next();
});

/*
 * Each form can have multiple versions,
 * but the same version number cannot exist twice.
 *
 * Example:
 * claim-form + version 1 -> allowed
 * claim-form + version 2 -> allowed
 * claim-form + version 2 -> duplicate, not allowed
 */
formSchema.index(
  { formId: 1, version: 1 },
  { unique: true }
);



export default mongoose.model("FormSchema", formSchema);