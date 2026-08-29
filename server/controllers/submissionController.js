import FormSubmission from "../models/FormSubmission.js";

// Save Draft
export const saveDraft = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    let draft = await FormSubmission.findOne({
      user: req.user.id,
      formId,
      status: "draft",
    });

    if (draft) {
      draft.answers = answers;
      await draft.save();
    } else {
      draft = await FormSubmission.create({
        user: req.user.id,
        formId,
        answers,
        status: "draft",
      });
    }

    res.json({
      message: "Draft saved successfully.",
      draft,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit Form
export const submitForm = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    const submission = await FormSubmission.create({
      user: req.user.id,
      formId,
      answers,
      status: "submitted",
    });

    res.status(201).json({
      message: "Form submitted successfully.",
      submission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Submissions
export const getSubmissions = async (req, res) => {
  try {
    const submissions = await FormSubmission.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};