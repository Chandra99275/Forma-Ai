import Submission from "../models/Submission.js";

/* ==========================================
   SAVE FORM AS DRAFT
   POST /api/submissions/draft
========================================== */
export const saveDraft = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    const submission = await Submission.create({
      formId,
      userId: req.user._id,
      answers,
      status: "draft",
      aiConfidence: 0,
    });

    res.status(201).json({
      success: true,
      message: "Draft saved successfully.",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   SUBMIT FORM
   POST /api/submissions/submit
========================================== */
export const submitForm = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    const submission = await Submission.create({
      formId,
      userId: req.user._id,
      answers,
      status: "submitted",
      aiConfidence: 97,
    });

    res.status(201).json({
      success: true,
      message: "Form submitted successfully.",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET USER SUBMISSIONS
   GET /api/submissions
========================================== */
export const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.user._id,
    }).populate("formId");

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET SINGLE SUBMISSION
   GET /api/submissions/:id
========================================== */
export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate(
      "formId userId"
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   UPDATE SUBMISSION STATUS
   PUT /api/submissions/:id
========================================== */
export const updateSubmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    submission.status = status || submission.status;

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Submission updated successfully.",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   DELETE SUBMISSION
   DELETE /api/submissions/:id
========================================== */
export const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    await Submission.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Submission deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};