import FormSchema from "../models/FormSchema.js";

// Get Form Schema
export const getFormSchema = async (req, res) => {
  try {
    const { formId } = req.params;

    const schema = await FormSchema.findOne({ formId });

    if (!schema) {
      return res.status(404).json({ message: "Form not found." });
    }

    res.json(schema);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Visible Questions Based on Answers
export const getVisibleQuestions = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    const schema = await FormSchema.findOne({ formId });

    if (!schema) {
      return res.status(404).json({ message: "Form schema not found." });
    }

    const visibleQuestions = schema.questions.filter((question) => {
      if (!question.showIf) return true;

      const field = Object.keys(question.showIf)[0];
      return answers[field] === question.showIf[field];
    });

    res.json({
      formId,
      questions: visibleQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};