
// ==========================================
// Forma AI - Dynamic Insurance Claim Forms
// ==========================================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DynamicForms.css";

import {
  FaHeartbeat,
  FaCarCrash,
  FaHome,
  FaPlaneDeparture,
  FaShieldAlt,
  FaRobot,
  FaFilePdf,
  FaCamera,
  FaKeyboard,
  FaSave,
  FaPaperPlane,
  FaCheckCircle,
  FaMagic,
  FaBolt,
  FaClipboardList,
  FaArrowRight,
  FaDownload,
  FaEye,
  FaTimes,
} from "react-icons/fa";

// Components
import CategoryCard from "../components/forms/CategoryCard";
import ProgressStepper from "../components/forms/ProgressStepper";
import AIUploader from "../components/forms/AIUploader";
import ManualForm from "../components/forms/ManualForm";

// Backend API
import {
  createClaim,
  updateClaim,
  submitClaim,
} from "../services/claimService";

// PDF Generator
import { generateClaimPDF } from "../services/pdfService";

// ==========================================
// Component
// ==========================================

const DynamicForms = () => {
  // ==========================================
  // NAVIGATION
  // ==========================================

  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [selectedCategory, setSelectedCategory] =
    useState("vehicle");

  const [applicationMode, setApplicationMode] =
    useState("manual");

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    policyNumber: "",
    description: "",
  });

  const [categoryFormData, setCategoryFormData] =
    useState({});

  const [claimId, setClaimId] = useState(null);

  const [claimNumber, setClaimNumber] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // PDF states
  const [pdfUrl, setPdfUrl] = useState("");

  const [pdfFileName, setPdfFileName] = useState("");

  const [showPdf, setShowPdf] = useState(false);

  // ==========================================
  // INSURANCE CATEGORIES
  // ==========================================

  const insuranceCategories = [
    {
      id: "health",
      title: "Health Insurance",
      subtitle:
        "Hospitalization • Surgery • Pharmacy • ICU",
      icon: <FaHeartbeat />,
      color: "#EF4444",
    },

    {
      id: "vehicle",
      title: "Vehicle Accident",
      subtitle:
        "Car • Bike • Theft • Flood • Collision",
      icon: <FaCarCrash />,
      color: "#2563EB",
    },

    {
      id: "property",
      title: "Property Insurance",
      subtitle:
        "Fire • Flood • Burglary • Natural Disaster",
      icon: <FaHome />,
      color: "#059669",
    },

    {
      id: "travel",
      title: "Travel Insurance",
      subtitle:
        "Flight Delay • Passport Loss • Baggage",
      icon: <FaPlaneDeparture />,
      color: "#EA580C",
    },

    {
      id: "life",
      title: "Life Insurance",
      subtitle:
        "Death • Nominee • Critical Illness",
      icon: <FaShieldAlt />,
      color: "#7C3AED",
    },
  ];

  // ==========================================
  // COMMON INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CATEGORY FORM DATA
  // ==========================================

  const handleCategoryFormData = (data) => {
    setCategoryFormData(data || {});
  };

  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    setCategoryFormData({});

    setClaimId(null);

    setClaimNumber("");

    setMessage("");

    setError("");

    setPdfUrl("");

    setPdfFileName("");

    setShowPdf(false);

    setCurrentStep(1);
  };

  // ==========================================
  // COMPLETE CLAIM DATA
  // ==========================================

  const getCompleteClaimData = () => {
    return {
      ...formData,
      ...categoryFormData,
    };
  };

  // ==========================================
  // SAVE CLAIM
  // ==========================================

  const saveClaim = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const completeClaimData =
        getCompleteClaimData();

      console.log(
        "========================================="
      );
      console.log("📤 SAVE CLAIM");
      console.log(
        "========================================="
      );
      console.log(
        "Category:",
        selectedCategory
      );
      console.log(
        "Claim Data:",
        completeClaimData
      );

      let result;

      // ========================================
      // CREATE
      // ========================================

      if (!claimId) {
        result = await createClaim(
          completeClaimData,
          selectedCategory
        );

        const newClaimId =
          result?.claim?._id;

        const newClaimNumber =
          result?.claim?.claimNumber;

        if (newClaimId) {
          setClaimId(newClaimId);
        }

        if (newClaimNumber) {
          setClaimNumber(newClaimNumber);
        }

        setMessage(
          `Draft saved successfully${
            newClaimNumber
              ? ` — ${newClaimNumber}`
              : ""
          }`
        );
      }

      // ========================================
      // UPDATE
      // ========================================

      else {
        result = await updateClaim(
          claimId,
          completeClaimData
        );

        if (result?.claim?.claimNumber) {
          setClaimNumber(
            result.claim.claimNumber
          );
        }

        setMessage(
          "Claim draft updated successfully."
        );
      }

      console.log(
        "✅ Save claim successful:",
        result
      );

      return result;
    } catch (err) {
      console.error(
        "❌ Save Claim Error:",
        err
      );

      console.error(
        "Server Response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save claim. Please try again."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SAVE DRAFT
  // ==========================================

  const handleSaveDraft = async () => {
    try {
      await saveClaim();
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // NEXT STEP
  // ==========================================

  const nextStep = async () => {
    try {
      await saveClaim();

      if (currentStep < 5) {
        setCurrentStep(
          (previous) => previous + 1
        );
      }
    } catch (err) {
      console.error(
        "Continue Error:",
        err
      );
    }
  };

  // ==========================================
  // PREVIOUS STEP
  // ==========================================

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(
        (previous) => previous - 1
      );
    }
  };

  // ==========================================
  // SUBMIT CLAIM + GENERATE PDF
  // ==========================================

  const handleSubmitClaim = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const completeClaimData =
        getCompleteClaimData();

      console.log(
        "========================================="
      );
      console.log("🚀 SUBMITTING CLAIM");
      console.log(
        "========================================="
      );
      console.log(
        "Category:",
        selectedCategory
      );
      console.log(
        "Complete Claim Data:",
        completeClaimData
      );

      let currentClaimId = claimId;

      let currentClaim = {};

      // ========================================
      // CREATE CLAIM IF NEEDED
      // ========================================

      if (!currentClaimId) {
        const createResult =
          await createClaim(
            completeClaimData,
            selectedCategory
          );

        console.log(
          "✅ Create Result:",
          createResult
        );

        currentClaim =
          createResult?.claim || {};

        currentClaimId =
          currentClaim?._id;

        if (!currentClaimId) {
          throw new Error(
            "Claim was created but no claim ID was returned."
          );
        }

        setClaimId(currentClaimId);

        if (currentClaim.claimNumber) {
          setClaimNumber(
            currentClaim.claimNumber
          );
        }
      }

      // ========================================
      // UPDATE EXISTING CLAIM
      // ========================================

      else {
        const updateResult =
          await updateClaim(
            currentClaimId,
            completeClaimData
          );

        console.log(
          "✅ Update Result:",
          updateResult
        );

        currentClaim =
          updateResult?.claim || {};

        if (currentClaim.claimNumber) {
          setClaimNumber(
            currentClaim.claimNumber
          );
        }
      }

      // ========================================
      // SUBMIT CLAIM
      // ========================================

      const submitResult =
        await submitClaim(
          currentClaimId
        );

      console.log(
        "✅ Submit Result:",
        submitResult
      );

      const submittedClaim =
        submitResult?.claim ||
        currentClaim ||
        {};

      const finalClaimNumber =
        submittedClaim.claimNumber ||
        claimNumber ||
        `CLM-${Date.now()}`;

      const finalSubmittedClaim = {
        ...submittedClaim,

        _id: currentClaimId,

        claimNumber:
          finalClaimNumber,

        category:
          submittedClaim.category ||
          selectedCategory,

        status:
          submittedClaim.status ||
          "submitted",

        submittedAt:
          submittedClaim.submittedAt ||
          new Date().toISOString(),
      };

      setClaimNumber(
        finalClaimNumber
      );

      // ========================================
      // REMOVE OLD PDF URL
      // ========================================

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      // ========================================
      // GENERATE PDF
      // ========================================

      const generatedPDF =
        generateClaimPDF({
          claim:
            finalSubmittedClaim,

          category:
            selectedCategory,

          claimData:
            completeClaimData,
        });

      if (
        !generatedPDF ||
        !generatedPDF.url
      ) {
        throw new Error(
          "PDF was not generated."
        );
      }

      // ========================================
      // STORE PDF
      // ========================================

      setPdfUrl(
        generatedPDF.url
      );

      setPdfFileName(
        generatedPDF.fileName ||
          `${finalClaimNumber}.pdf`
      );

      setShowPdf(true);

      // ========================================
      // SUCCESS
      // ========================================

      setMessage(
        `Claim submitted successfully — ${finalClaimNumber}`
      );

      setCurrentStep(5);

      console.log(
        "========================================="
      );
      console.log(
        "🎉 CLAIM SUBMITTED SUCCESSFULLY"
      );
      console.log(
        "Claim Number:",
        finalClaimNumber
      );
      console.log(
        "========================================="
      );
    } catch (err) {
      console.error(
        "❌ Submit Claim Error:",
        err
      );

      console.error(
        "Server Response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to submit claim. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DOWNLOAD PDF
  // ==========================================

  const handleDownloadPDF = () => {
    if (!pdfUrl) {
      return;
    }

    const link =
      document.createElement("a");

    link.href = pdfUrl;

    link.download =
      pdfFileName ||
      "forma-ai-claim.pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // ==========================================
  // OPEN PDF IN NEW TAB
  // ==========================================

  const handleOpenPDF = () => {
    if (!pdfUrl) {
      return;
    }

    window.open(
      pdfUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================
  // CLEAN PDF URL WHEN COMPONENT UNMOUNTS
  // ==========================================

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="dynamicPage">

      {/* ======================================
          HERO
      ====================================== */}

      <section className="heroBanner">

        <div className="heroLeft">

          <span className="heroBadge">
            <FaRobot />
            AI Powered Insurance Forms
          </span>

          <h1>
            Forma AI Dynamic Insurance Claim Portal
          </h1>

          <p>
            Smart AI-Augmented Dynamic Form Engine
            for Health, Vehicle, Property, Travel
            and Life Insurance Claims. Upload PDFs,
            images or manually fill your insurance
            application within minutes.
          </p>

          <div className="heroButtons">

            <button
              className="primaryBtn"
              type="button"
              onClick={() =>
                navigate("/ai-parser")
              }
            >
              <FaMagic />
              AI Auto Fill
            </button>

            <button
              className="secondaryBtn"
              type="button"
              onClick={() =>
                setApplicationMode("manual")
              }
            >
              <FaClipboardList />
              Manual Application
            </button>

          </div>

        </div>

        <div className="heroRight">

          <div className="statCard">
            <FaClipboardList />

            <div>
              <h2>120+</h2>
              <span>
                Insurance Templates
              </span>
            </div>
          </div>

          <div className="statCard">
            <FaRobot />

            <div>
              <h2>98%</h2>
              <span>
                AI Accuracy
              </span>
            </div>
          </div>

          <div className="statCard">
            <FaBolt />

            <div>
              <h2>25,000+</h2>
              <span>
                Claims Submitted
              </span>
            </div>
          </div>

          <div className="statCard">
            <FaCheckCircle />

            <div>
              <h2>95%</h2>
              <span>
                Success Rate
              </span>
            </div>
          </div>

        </div>

      </section>

      {/* ======================================
          PROGRESS
      ====================================== */}

      <ProgressStepper
        step={currentStep}
      />

      {/* ======================================
          CATEGORY
      ====================================== */}

      <section className="categorySection">

        <div className="sectionTitle">

          <h2>
            Choose Insurance Category
          </h2>

          <p>
            Select the insurance claim template
            that matches your incident.
          </p>

        </div>

        <div className="categoryGrid">

          {insuranceCategories.map(
            (category) => (
              <CategoryCard
                key={category.id}
                category={category}
                selected={
                  selectedCategory ===
                  category.id
                }
                onSelect={() =>
                  handleCategoryChange(
                    category.id
                  )
                }
              />
            )
          )}

        </div>

      </section>

      {/* ======================================
          APPLICATION MODE
      ====================================== */}

      <section className="modeSection">

        <div className="sectionTitle">

          <h2>
            Choose Application Method
          </h2>

          <p>
            Forma AI supports AI-assisted
            applications, manual applications,
            image OCR and PDF extraction.
          </p>

        </div>

        <div className="modeGrid">

          <div
            className={
              applicationMode === "manual"
                ? "modeCard activeMode"
                : "modeCard"
            }
            onClick={() =>
              setApplicationMode(
                "manual"
              )
            }
          >
            <FaKeyboard className="modeIcon" />

            <h3>
              Manual Application
            </h3>

            <p>
              Fill insurance forms manually.
            </p>
          </div>

          <div
            className={
              applicationMode === "ai"
                ? "modeCard activeMode"
                : "modeCard"
            }
            onClick={() =>
              setApplicationMode("ai")
            }
          >
            <FaRobot className="modeIcon" />

            <h3>
              AI Auto Fill
            </h3>

            <p>
              Paste your incident description.
            </p>
          </div>

          <div
            className={
              applicationMode === "image"
                ? "modeCard activeMode"
                : "modeCard"
            }
            onClick={() =>
              setApplicationMode("image")
            }
          >
            <FaCamera className="modeIcon" />

            <h3>
              Image Upload
            </h3>

            <p>
              Upload accident photos for OCR.
            </p>
          </div>

          <div
            className={
              applicationMode === "pdf"
                ? "modeCard activeMode"
                : "modeCard"
            }
            onClick={() =>
              setApplicationMode("pdf")
            }
          >
            <FaFilePdf className="modeIcon" />

            <h3>
              PDF Upload
            </h3>

            <p>
              Upload FIR, Bills, Medical Reports.
            </p>
          </div>

        </div>

      </section>

      {/* ======================================
          AI / IMAGE / PDF UPLOADER
      ====================================== */}

      {(applicationMode === "ai" ||
        applicationMode === "image" ||
        applicationMode === "pdf") && (
        <AIUploader
          mode={applicationMode}
        />
      )}

      {/* ======================================
          MANUAL FORM
      ====================================== */}

      {applicationMode === "manual" && (

        <section className="manualSection">

          <div className="manualHeader">

            <div>

              <h2>
                Insurance Claim Application
              </h2>

              <p>
                Selected Category :
                <strong>
                  {" "}
                  {selectedCategory.toUpperCase()}
                </strong>
              </p>

            </div>

            <span className="manualBadge">
              AI Smart Validation Enabled
            </span>

          </div>

          {/* COMMON APPLICANT INFORMATION */}

          <div className="commonCard">

            <h3>
              Applicant Information
            </h3>

            <div className="grid2">

              <div className="inputGroup">

                <label>
                  Applicant Name
                </label>

                <input
                  name="applicantName"
                  value={
                    formData.applicantName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter Full Name"
                />

              </div>

              <div className="inputGroup">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="email@example.com"
                />

              </div>

              <div className="inputGroup">

                <label>
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="+91 9876543210"
                />

              </div>

              <div className="inputGroup">

                <label>
                  Policy Number
                </label>

                <input
                  name="policyNumber"
                  value={
                    formData.policyNumber
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="POL-2026-10021"
                />

              </div>

            </div>

            <div className="inputGroup fullWidth">

              <label>
                Describe Your Claim
              </label>

              <textarea
                rows="4"
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Explain your insurance claim in detail..."
              />

            </div>

          </div>

          {/* CATEGORY FORM */}

          <ManualForm
            category={selectedCategory}
            onFormDataChange={
              handleCategoryFormData
            }
          />

          {/* ====================================
              STATUS
          ==================================== */}

          {(message ||
            error ||
            loading) && (

            <div className="claimStatus">

              {loading && (
                <div className="statusLoading">
                  Processing claim...
                </div>
              )}

              {message &&
                !loading && (
                  <div className="statusSuccess">

                    <FaCheckCircle />

                    <span>
                      {message}
                    </span>

                  </div>
                )}

              {error &&
                !loading && (
                  <div className="statusError">

                    <span>
                      {error}
                    </span>

                  </div>
                )}

            </div>
          )}

        </section>
      )}

      {/* ======================================
          GENERATED PDF
      ====================================== */}

      {showPdf &&
        pdfUrl && (

          <section className="generatedPdfSection">

            <div className="generatedPdfHeader">

              <div>

                <h2>
                  Claim PDF Generated
                </h2>

                <p>
                  Your submitted insurance
                  claim has been converted
                  into a PDF document.
                </p>

                {claimNumber && (
                  <strong>
                    Claim Number:{" "}
                    {claimNumber}
                  </strong>
                )}

              </div>

              <div className="pdfActionButtons">

                <button
                  type="button"
                  className="pdfDownloadBtn"
                  onClick={
                    handleDownloadPDF
                  }
                >
                  <FaDownload />
                  Download PDF
                </button>

                <button
                  type="button"
                  className="pdfOpenBtn"
                  onClick={
                    handleOpenPDF
                  }
                >
                  <FaEye />
                  Open PDF
                </button>

                <button
                  type="button"
                  className="pdfCloseBtn"
                  onClick={() =>
                    setShowPdf(false)
                  }
                >
                  <FaTimes />
                </button>

              </div>

            </div>

            <div className="pdfViewerCard">

              <iframe
                src={pdfUrl}
                title="Forma AI Insurance Claim PDF"
                className="claimPdfViewer"
              />

            </div>

          </section>
        )}

      {/* ======================================
          FEATURES
      ====================================== */}

      <section className="featuresSection">

        <div className="sectionTitle">

          <h2>
            AI Powered Features
          </h2>

        </div>

        <div className="featureGrid">

          <div className="featureCard">

            <FaRobot className="featureIcon" />

            <h4>
              AI Incident Parser
            </h4>

            <p>
              Converts natural language
              into structured insurance fields.
            </p>

          </div>

          <div className="featureCard">

            <FaCamera className="featureIcon" />

            <h4>
              Image OCR
            </h4>

            <p>
              Extract text from prescriptions,
              RC, DL and accident photos.
            </p>

          </div>

          <div className="featureCard">

            <FaFilePdf className="featureIcon" />

            <h4>
              PDF Extraction
            </h4>

            <p>
              Read FIR, Hospital Bills,
              Medical Reports and PDFs.
            </p>

          </div>

          <div className="featureCard">

            <FaMagic className="featureIcon" />

            <h4>
              Smart Validation
            </h4>

            <p>
              AI validates missing information
              before submission.
            </p>

          </div>

          <div className="featureCard">

            <FaCheckCircle className="featureIcon" />

            <h4>
              Confidence Score
            </h4>

            <p>
              Every AI-generated claim receives
              a confidence score.
            </p>

          </div>

          <div className="featureCard">

            <FaClipboardList className="featureIcon" />

            <h4>
              Save Draft Anytime
            </h4>

            <p>
              Continue your insurance
              application later.
            </p>

          </div>

        </div>

      </section>

      {/* ======================================
          REVIEW
      ====================================== */}

      <section className="reviewSection">

        <div className="reviewCard">

          <h2>
            Review & Submit
          </h2>

          <div className="reviewGrid">

            <div>
              <span>
                Insurance Category
              </span>

              <h4>
                {selectedCategory.toUpperCase()}
              </h4>
            </div>

            <div>
              <span>
                Application Mode
              </span>

              <h4>
                {applicationMode.toUpperCase()}
              </h4>
            </div>

            <div>
              <span>
                Applicant
              </span>

              <h4>
                {formData.applicantName ||
                  categoryFormData.patientName ||
                  categoryFormData.driverName ||
                  categoryFormData.ownerName ||
                  categoryFormData.travelerName ||
                  categoryFormData.policyHolderName ||
                  "Not Filled"}
              </h4>
            </div>

            <div>
              <span>
                Policy Number
              </span>

              <h4>
                {categoryFormData.policyNumber ||
                  formData.policyNumber ||
                  "Not Filled"}
              </h4>
            </div>

            <div>
              <span>
                Claim Status
              </span>

              <h4>
                {claimId
                  ? "Claim Created"
                  : "Not Saved"}
              </h4>
            </div>

            {claimId && (
              <div>
                <span>
                  Claim ID
                </span>

                <h4>
                  {claimId}
                </h4>
              </div>
            )}

            {claimNumber && (
              <div>
                <span>
                  Claim Number
                </span>

                <h4>
                  {claimNumber}
                </h4>
              </div>
            )}

          </div>

        </div>

      </section>

      {/* ======================================
          ACTION BUTTONS
      ====================================== */}

      <section className="actionSection">

        <button
          className="outlineBtn"
          onClick={previousStep}
          disabled={
            loading ||
            currentStep === 1
          }
          type="button"
        >
          Previous
        </button>

        <button
          className="saveBtn"
          onClick={handleSaveDraft}
          disabled={loading}
          type="button"
        >
          <FaSave />

          {loading
            ? "Saving..."
            : "Save Draft"}
        </button>

        {currentStep < 5 && (
          <button
            className="nextBtn"
            onClick={nextStep}
            disabled={loading}
            type="button"
          >
            Continue
            <FaArrowRight />
          </button>
        )}

        <button
          className="submitBtn"
          onClick={handleSubmitClaim}
          disabled={loading}
          type="button"
        >
          <FaPaperPlane />

          {loading
            ? "Submitting..."
            : "Submit Claim"}
        </button>

      </section>

      {/* ======================================
          SMART SUGGESTIONS
      ====================================== */}

      <section className="tipsSection">

        <h2>
          Forma AI Smart Suggestions
        </h2>

        <div className="tipsGrid">

          <div className="tipCard">
            <FaRobot />

            <p>
              Upload accident photos for
              AI damage detection.
            </p>
          </div>

          <div className="tipCard">
            <FaFilePdf />

            <p>
              Upload FIR or Medical Bills
              to auto-fill claim details.
            </p>
          </div>

          <div className="tipCard">
            <FaCheckCircle />

            <p>
              AI checks missing information
              before submission.
            </p>
          </div>

          <div className="tipCard">
            <FaHeartbeat />

            <p>
              Health insurance claims support
              OCR prescriptions and bills.
            </p>
          </div>

          <div className="tipCard">
            <FaCarCrash />

            <p>
              Vehicle claims support RC,
              DL, Police FIR and estimates.
            </p>
          </div>

          <div className="tipCard">
            <FaShieldAlt />

            <p>
              Life insurance claims support
              nominee verification documents.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
};

export default DynamicForms;
