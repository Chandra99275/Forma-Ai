import FormSchema from "../models/FormSchema.js";

/* =====================================================
   GET ALL FORMS
   GET /api/forms
===================================================== */
export const getAllForms = async (req, res) => {
  try {
    const forms = await FormSchema.find().select(
      "formId title category description createdAt"
    );

    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GET SINGLE FORM SCHEMA
   GET /api/forms/:formId
===================================================== */
export const getFormSchema = async (req, res) => {
  try {
    const { formId } = req.params;

    const schema = await FormSchema.findOne({ formId });

    if (!schema) {
      return res.status(404).json({
        success: false,
        message: "Form schema not found.",
      });
    }

    res.status(200).json(schema);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   CREATE NEW FORM
   POST /api/forms
===================================================== */
export const createFormSchema = async (req, res) => {
  try {
    const {
      formId,
      title,
      description,
      category,
      questions,
    } = req.body;

    const exists = await FormSchema.findOne({ formId });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Form already exists.",
      });
    }

    const newForm = await FormSchema.create({
      formId,
      title,
      description,
      category,
      questions,
    });

    res.status(201).json({
      success: true,
      message: "Form created successfully.",
      data: newForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   UPDATE FORM SCHEMA
   PUT /api/forms/:formId
===================================================== */
export const updateFormSchema = async (req, res) => {
  try {
    const { formId } = req.params;

    const updated = await FormSchema.findOneAndUpdate(
      { formId },
      req.body,
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form updated successfully.",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   DELETE FORM
   DELETE /api/forms/:formId
===================================================== */
export const deleteFormSchema = async (req, res) => {
  try {
    const { formId } = req.params;

    const deleted = await FormSchema.findOneAndDelete({ formId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GET VISIBLE QUESTIONS (Conditional Logic)
   POST /api/forms/visible
===================================================== */
export const getVisibleQuestions = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    const schema = await FormSchema.findOne({ formId });

    if (!schema) {
      return res.status(404).json({
        success: false,
        message: "Form schema not found.",
      });
    }

    const visibleQuestions = schema.questions.filter((question) => {
      // Always show if there is no condition
      if (!question.showIf) return true;

      const conditionField = Object.keys(question.showIf)[0];
      const conditionValue = question.showIf[conditionField];

      return answers?.[conditionField] === conditionValue;
    });

    res.status(200).json({
      success: true,
      formId,
      totalQuestions: visibleQuestions.length,
      questions: visibleQuestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};