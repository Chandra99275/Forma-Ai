export const validateAnswers = (questions, answers) => {
  const errors = {};

  questions.forEach((question) => {
    const value = answers[question.id];

    // Required validation
    if (question.required) {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        errors[question.id] = `${question.label} is required.`;
        return;
      }
    }

    // Number validation
    if (question.type === "number" && value !== undefined) {
      if (isNaN(Number(value))) {
        errors[question.id] = `${question.label} must be a number.`;
      }
    }

    // Date validation
    if (question.type === "date" && value) {
      if (isNaN(Date.parse(value))) {
        errors[question.id] = `${question.label} is not a valid date.`;
      }
    }

    // Select validation
    if (
      question.type === "select" &&
      value &&
      question.options?.length
    ) {
      if (!question.options.includes(value)) {
        errors[question.id] = `Invalid value for ${question.label}.`;
      }
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};