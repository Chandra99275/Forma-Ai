// ==========================================
// Forma AI - Dynamic Insurance Claim Forms
// Premium UI Version
// PART 1
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
  FaCheck,
  FaStar,
  FaShieldVirus,
  FaClock,
  FaUserShield,
} from "react-icons/fa";

// ==========================================
// Components
// ==========================================

import CategoryCard from "../components/forms/CategoryCard";
import ProgressStepper from "../components/forms/ProgressStepper";
import AIUploader from "../components/forms/AIUploader";
import ManualForm from "../components/forms/ManualForm";

// ==========================================
// Backend Services
// ==========================================

import {
  createClaim,
  updateClaim,
  submitClaim,
} from "../services/claimService";

import { generateClaimPDF } from "../services/pdfService";

// ==========================================
// COMPONENT START
// ==========================================

const DynamicForms = () => {

  const navigate = useNavigate();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [selectedCategory, setSelectedCategory] =
    useState("vehicle");

  const [applicationMode, setApplicationMode] =
    useState("manual");

  const [currentStep, setCurrentStep] =
    useState(1);

  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    policyNumber: "",
    description: "",
  });

  const [categoryFormData, setCategoryFormData] =
    useState({});

  // ==========================================
  // CLAIM STATE
  // ==========================================

  const [claimId, setClaimId] =
    useState(null);

  const [claimNumber, setClaimNumber] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // ==========================================
  // PDF STATE
  // ==========================================

  const [pdfUrl, setPdfUrl] =
    useState("");

  const [pdfFileName, setPdfFileName] =
    useState("");

  const [showPdf, setShowPdf] =
    useState(false);

  // ==========================================
  // SUCCESS MODAL STATE
  // ==========================================

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [successClaimNumber, setSuccessClaimNumber] =
    useState("");

  const [submissionDate, setSubmissionDate] =
    useState("");

  const [successApplicant, setSuccessApplicant] =
    useState("");

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
  // COMMON INPUT HANDLER
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
  // RESET WHEN CATEGORY CHANGES
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

    setShowSuccessModal(false);

    setCurrentStep(1);
  };

  // ==========================================
  // COMPLETE CLAIM DATA
  // ==========================================

  const getCompleteClaimData = () => ({
    ...formData,
    ...categoryFormData,
  });

  // ==========================================
  // SAVE CLAIM (CREATE / UPDATE)
  // ==========================================

  const saveClaim = async () => {

    setLoading(true);

    setMessage("");

    setError("");

    try {

      const completeClaimData =
        getCompleteClaimData();

      let result;

      console.log("================================");
      console.log("📤 SAVE CLAIM");
      console.log("Category:", selectedCategory);
      console.log(completeClaimData);
      console.log("================================");

      // CREATE NEW CLAIM

      if (!claimId) {

        result = await createClaim(
          completeClaimData,
          selectedCategory
        );

        const newClaim =
          result?.claim || {};

        if (newClaim._id) {
          setClaimId(newClaim._id);
        }

        if (newClaim.claimNumber) {
          setClaimNumber(newClaim.claimNumber);
        }

        setMessage(
          `Draft Saved Successfully • ${newClaim.claimNumber || ""}`
        );

      }

      // UPDATE EXISTING CLAIM

      else {

        result = await updateClaim(
          claimId,
          completeClaimData,
          selectedCategory
        );

        const updated =
          result?.claim || {};

        if (updated.claimNumber) {
          setClaimNumber(updated.claimNumber);
        }

        setMessage(
          "Draft Updated Successfully."
        );
      }

      console.log("Draft Saved", result);

      return result;

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to save draft."
      );

      throw err;

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // SAVE DRAFT BUTTON
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
        setCurrentStep((prev) => prev + 1);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // PREVIOUS STEP
  // ==========================================

  const previousStep = () => {

    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // ==========================================
  // PDF FUNCTIONS
  // ==========================================

  const handleDownloadPDF = () => {

    if (!pdfUrl) return;

    const link =
      document.createElement("a");

    link.href = pdfUrl;

    link.download =
      pdfFileName || "FormaAI-Claim.pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const handleOpenPDF = () => {

    if (!pdfUrl) return;

    window.open(
      pdfUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================
  // SUBMIT CLAIM + GENERATE PDF + SUCCESS POPUP
  // ==========================================

  const handleSubmitClaim = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const completeClaimData = getCompleteClaimData();

      console.log("======================================");
      console.log("🚀 SUBMITTING CLAIM");
      console.log("Category :", selectedCategory);
      console.log("Claim Data :", completeClaimData);
      console.log("======================================");

      let currentClaimId = claimId;
      let currentClaim = {};

      // ======================================
      // CREATE CLAIM IF NOT CREATED
      // ======================================

      if (!currentClaimId) {
        const createResult = await createClaim(
          completeClaimData,
          selectedCategory
        );

        currentClaim = createResult?.claim || {};
        currentClaimId = currentClaim._id;

        if (!currentClaimId) {
          throw new Error("Failed to create claim.");
        }

        setClaimId(currentClaimId);

        if (currentClaim.claimNumber) {
          setClaimNumber(currentClaim.claimNumber);
        }
      }

      // ======================================
      // UPDATE EXISTING CLAIM
      // ======================================

      else {
        const updateResult = await updateClaim(
          currentClaimId,
          completeClaimData,
          selectedCategory
        );

        currentClaim = updateResult?.claim || currentClaim;

        if (currentClaim.claimNumber) {
          setClaimNumber(currentClaim.claimNumber);
        }
      }

      // ======================================
      // SUBMIT CLAIM TO BACKEND
      // ======================================

      const submitResult = await submitClaim(currentClaimId);

      const submittedClaim = submitResult?.claim || currentClaim;

      const finalClaimNumber =
        submittedClaim.claimNumber ||
        claimNumber ||
        `CLM-${Date.now()}`;

      const finalClaim = {
        ...submittedClaim,
        _id: currentClaimId,
        claimNumber: finalClaimNumber,
        category: selectedCategory,
        status: "submitted",
        submittedAt: new Date().toISOString(),
      };

      setClaimNumber(finalClaimNumber);

      // ======================================
      // REMOVE OLD PDF
      // ======================================

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      // ======================================
      // GENERATE PDF
      // ======================================

      const generatedPDF = generateClaimPDF({
        claim: finalClaim,
        category: selectedCategory,
        claimData: completeClaimData,
      });

      if (!generatedPDF?.url) {
        throw new Error("Unable to generate PDF.");
      }

      setPdfUrl(generatedPDF.url);

      setPdfFileName(
        generatedPDF.fileName || `${finalClaimNumber}.pdf`
      );

      setShowPdf(true);

      // ======================================
      // SUCCESS POPUP DETAILS
      // ======================================

      setSuccessClaimNumber(finalClaimNumber);

      setSuccessApplicant(
        formData.applicantName ||
          categoryFormData.patientName ||
          categoryFormData.driverName ||
          categoryFormData.ownerName ||
          categoryFormData.travelerName ||
          categoryFormData.policyHolderName ||
          "Applicant"
      );

      setSubmissionDate(
        new Date().toLocaleString("en-IN", {
          dateStyle: "full",
          timeStyle: "short",
        })
      );

      setMessage(
        `Claim Submitted Successfully • ${finalClaimNumber}`
      );

      setCurrentStep(5);

      // Open Premium Success Popup
      setShowSuccessModal(true);

      console.log("======================================");
      console.log("✅ CLAIM SUBMITTED SUCCESSFULLY");
      console.log("Claim Number :", finalClaimNumber);
      console.log("======================================");
    } catch (err) {
      console.error("Submit Claim Error :", err);

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
  // SUCCESS POPUP ACTION BUTTONS
  // ==========================================

  const handleSuccessViewPDF = () => {
    setShowSuccessModal(false);

    if (pdfUrl) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleSuccessDownloadPDF = () => {
    handleDownloadPDF();
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // ==========================================
  // AUTO CLEANUP PDF URL
  // ==========================================

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // ==========================================
  // RENDER STARTS HERE
  // ==========================================

  return (
    
    <div className="dynamicPage">

    {/* ================= HERO SECTION ================= */}

    <section className="heroBanner">

      <div className="heroLeft">

        <span className="heroBadge">
          <FaRobot />
          AI Powered Insurance Forms
        </span>

        <h1>Forma AI Dynamic Insurance Claim Portal</h1>

        <p>
          AI-Augmented Dynamic Insurance Claim Engine for Health, Vehicle,
          Property, Travel and Life Insurance. Fill claims manually or let
          AI extract information from PDFs and Images.
        </p>

        <div className="heroButtons">

          <button
            className="primaryBtn"
            onClick={() => navigate("/ai-parser")}
          >
            <FaMagic />
            AI Auto Fill
          </button>

          <button
            className="secondaryBtn"
            onClick={() => setApplicationMode("manual")}
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
            <span>Insurance Templates</span>
          </div>
        </div>

        <div className="statCard">
          <FaRobot />
          <div>
            <h2>98%</h2>
            <span>AI Accuracy</span>
          </div>
        </div>

        <div className="statCard">
          <FaBolt />
          <div>
            <h2>25K+</h2>
            <span>Claims Submitted</span>
          </div>
        </div>

        <div className="statCard">
          <FaCheckCircle />
          <div>
            <h2>95%</h2>
            <span>Success Rate</span>
          </div>
        </div>

      </div>

    </section>

    {/* ================= PROGRESS STEPPER ================= */}

    <ProgressStepper step={currentStep} />

    {/* ================= CATEGORY SECTION ================= */}

    <section className="categorySection">

      <div className="sectionTitle">

        <span className="sectionBadge">
          <FaShieldVirus />
          AI Insurance Categories
        </span>

        <h2>Choose Insurance Category</h2>

        <p>
          Select the insurance claim template that matches your incident.
          Every category is powered by AI validation and dynamic forms.
        </p>

      </div>

      <div className="categoryGrid">

        {insuranceCategories.map((category) => (

          <CategoryCard
            key={category.id}
            category={category}
            selected={selectedCategory === category.id}
            onSelect={() => handleCategoryChange(category.id)}
          />

        ))}

      </div>

    </section>

    {/* ================= APPLICATION MODE ================= */}

    <section className="modeSection">

      <div className="sectionTitle">

        <span className="sectionBadge">
          <FaMagic />
          Smart Application Methods
        </span>

        <h2>Choose Application Method</h2>

        <p>
          Submit insurance claims using AI Parser, Image OCR, PDF Upload,
          or complete the smart manual application form.
        </p>

      </div>

      <div className="modeGrid">

        {/* Manual */}

        <div
          className={
            applicationMode === "manual"
              ? "modeCard activeMode"
              : "modeCard"
          }
          onClick={() => setApplicationMode("manual")}
        >
          <FaKeyboard className="modeIcon" />

          <h3>Manual Application</h3>

          <p>
            Fill the intelligent insurance application manually with
            dynamic questions.
          </p>

          <span className="modeTag">Recommended</span>

        </div>

        {/* AI */}

        <div
          className={
            applicationMode === "ai"
              ? "modeCard activeMode"
              : "modeCard"
          }
          onClick={() => setApplicationMode("ai")}
        >
          <FaRobot className="modeIcon" />

          <h3>AI Auto Fill</h3>

          <p>
            Describe your accident or medical incident and let Gemini AI
            fill the claim automatically.
          </p>

          <span className="modeTag">Gemini AI</span>

        </div>

        {/* Image OCR */}

        <div
          className={
            applicationMode === "image"
              ? "modeCard activeMode"
              : "modeCard"
          }
          onClick={() => setApplicationMode("image")}
        >
          <FaCamera className="modeIcon" />

          <h3>Image OCR Upload</h3>

          <p>
            Upload accident photos, RC, DL, prescriptions and bills for AI
            extraction.
          </p>

          <span className="modeTag">OCR Vision</span>

        </div>

        {/* PDF */}

        <div
          className={
            applicationMode === "pdf"
              ? "modeCard activeMode"
              : "modeCard"
          }
          onClick={() => setApplicationMode("pdf")}
        >
          <FaFilePdf className="modeIcon" />

          <h3>PDF Upload</h3>

          <p>
            Upload FIR, hospital bills, invoices and insurance policy
            documents.
          </p>

          <span className="modeTag">PDF Parser</span>

        </div>

      </div>

    </section>

    {/* ================= AI / IMAGE / PDF UPLOADER ================= */}

    {(applicationMode === "ai" ||
      applicationMode === "image" ||
      applicationMode === "pdf") && (
      <AIUploader mode={applicationMode} />
    )}

    {/* ================= MANUAL FORM ================= */}

    {applicationMode === "manual" && (

      <section className="manualSection">

        <div className="manualHeader">

          <div>

            <h2>Insurance Claim Application</h2>

            <p>
              Selected Category :
              <strong> {selectedCategory.toUpperCase()}</strong>
            </p>

          </div>

          <span className="manualBadge">
            AI Smart Validation Enabled
          </span>

        </div>

        {/* Applicant Information */}

        <div className="commonCard">

          <h3>Applicant Information</h3>

          <div className="grid2">

            <div className="inputGroup">
              <label>Applicant Name</label>

              <input
                type="text"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleChange}
                placeholder="Enter Full Name"
              />
            </div>

            <div className="inputGroup">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
              />
            </div>

            <div className="inputGroup">
              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            <div className="inputGroup">
              <label>Policy Number</label>

              <input
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                placeholder="POL-2026-10021"
              />
            </div>

          </div>

          <div className="inputGroup fullWidth">

            <label>Claim Description</label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the insurance incident in detail..."
            />

          </div>

        </div>

        {/* Dynamic Category Form */}

        <ManualForm
          category={selectedCategory}
          onFormDataChange={handleCategoryFormData}
        />

        {/* Save Status */}

        {(message || error || loading) && (

          <div className="claimStatus">

            {loading && (
              <div className="statusLoading">
                <FaClock />
                Processing Claim...
              </div>
            )}

            {!loading && message && (
              <div className="statusSuccess">
                <FaCheckCircle />
                {message}
              </div>
            )}

            {!loading && error && (
              <div className="statusError">
                <FaTimes />
                {error}
              </div>
            )}

          </div>

        )}

      </section>

    )}

    {/* ======================================
        GENERATED CLAIM PDF
    ====================================== */}

    {showPdf && pdfUrl && (
      <section className="generatedPdfSection">

        <div className="generatedPdfHeader">

          <div>
            <h2>
              <FaFilePdf /> Claim PDF Generated Successfully
            </h2>

            <p>
              Your insurance claim has been submitted successfully.
              You can preview, open, or download the generated PDF.
            </p>

            {claimNumber && (
              <div className="claimNumberBadge">
                Claim Number : <strong>{claimNumber}</strong>
              </div>
            )}
          </div>

          <div className="pdfActionButtons">

            <button
              className="pdfDownloadBtn"
              onClick={handleDownloadPDF}
              type="button"
            >
              <FaDownload />
              Download PDF
            </button>

            <button
              className="pdfOpenBtn"
              onClick={handleOpenPDF}
              type="button"
            >
              <FaEye />
              Open PDF
            </button>

            <button
              className="pdfCloseBtn"
              onClick={() => setShowPdf(false)}
              type="button"
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
        REVIEW & SUBMIT
    ====================================== */}

    <section className="reviewSection">

      <div className="reviewCard">

        <div className="reviewTitle">
          <FaClipboardList />
          <div>
            <h2>Review Insurance Claim</h2>
            <p>
              Verify all information before submitting the claim to Forma AI.
            </p>
          </div>
        </div>

        <div className="reviewGrid">

          <div className="reviewItem">
            <span>Insurance Category</span>
            <strong>{selectedCategory.toUpperCase()}</strong>
          </div>

          <div className="reviewItem">
            <span>Application Mode</span>
            <strong>{applicationMode.toUpperCase()}</strong>
          </div>

          <div className="reviewItem">
            <span>Applicant</span>
            <strong>
              {formData.applicantName ||
                categoryFormData.patientName ||
                categoryFormData.driverName ||
                categoryFormData.ownerName ||
                categoryFormData.travelerName ||
                categoryFormData.policyHolderName ||
                "Not Filled"}
            </strong>
          </div>

          <div className="reviewItem">
            <span>Email</span>
            <strong>{formData.email || "Not Filled"}</strong>
          </div>

          <div className="reviewItem">
            <span>Phone Number</span>
            <strong>{formData.phone || "Not Filled"}</strong>
          </div>

          <div className="reviewItem">
            <span>Policy Number</span>
            <strong>
              {categoryFormData.policyNumber ||
                formData.policyNumber ||
                "Not Filled"}
            </strong>
          </div>

          <div className="reviewItem">
            <span>Claim Status</span>
            <strong className={claimId ? "created" : "pending"}>
              {claimId ? "Draft Created" : "Not Saved"}
            </strong>
          </div>

          {claimNumber && (
            <div className="reviewItem">
              <span>Claim Number</span>
              <strong>{claimNumber}</strong>
            </div>
          )}

          {claimId && (
            <div className="reviewItem full">
              <span>Claim Database ID</span>
              <strong>{claimId}</strong>
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
        disabled={loading || currentStep === 1}
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

        {loading ? "Saving..." : "Save Draft"}
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

        {loading ? "Submitting..." : "Submit Claim"}
      </button>

    </section>

    {/* ======================================
        AI POWERED FEATURES
    ====================================== */}

    <section className="featuresSection">

      <div className="sectionTitle">

        <span className="sectionBadge">
          <FaStar />
          Forma AI Intelligence
        </span>

        <h2>AI Powered Features</h2>

        <p>
          Every insurance claim is enhanced using AI-powered document
          parsing, OCR, validation, fraud detection, and smart workflow
          automation.
        </p>

      </div>

      <div className="featureGrid">

        <div className="featureCard">

          <FaRobot className="featureIcon" />

          <h4>AI Incident Parser</h4>

          <p>
            Convert natural language descriptions into structured insurance
            claim fields using Gemini AI.
          </p>

        </div>

        <div className="featureCard">

          <FaCamera className="featureIcon" />

          <h4>Image OCR</h4>

          <p>
            Extract text automatically from RC books, driving licenses,
            prescriptions, invoices and accident photos.
          </p>

        </div>

        <div className="featureCard">

          <FaFilePdf className="featureIcon" />

          <h4>PDF Intelligence</h4>

          <p>
            Parse FIR reports, hospital bills, insurance policies and repair
            estimates directly into claim fields.
          </p>

        </div>

        <div className="featureCard">

          <FaMagic className="featureIcon" />

          <h4>Smart Validation</h4>

          <p>
            AI validates mandatory fields and highlights missing information
            before submission.
          </p>

        </div>

        <div className="featureCard">

          <FaShieldVirus className="featureIcon" />

          <h4>Fraud Detection</h4>

          <p>
            Detect suspicious claims using document consistency and AI-powered
            anomaly detection.
          </p>

        </div>

        <div className="featureCard">

          <FaCheckCircle className="featureIcon" />

          <h4>Confidence Score</h4>

          <p>
            Every submitted claim receives an AI confidence score for review
            and analytics.
          </p>

        </div>

      </div>

    </section>

    {/* ======================================
        SMART SUGGESTIONS
    ====================================== */}

    <section className="tipsSection">

      <div className="sectionTitle">

        <span className="sectionBadge">
          <FaBolt />
          Smart Suggestions
        </span>

        <h2>Forma AI Claim Assistant</h2>

        <p>
          Improve approval chances by uploading the right supporting documents
          for your selected insurance category.
        </p>

      </div>

      <div className="tipsGrid">

        <div className="tipCard">
          <FaCarCrash />

          <div>
            <h4>Vehicle Insurance</h4>

            <p>
              Upload RC, Driving License, FIR, vehicle photos and repair
              estimate for faster processing.
            </p>
          </div>
        </div>

        <div className="tipCard">
          <FaHeartbeat />

          <div>
            <h4>Health Insurance</h4>

            <p>
              Attach hospital bills, prescriptions, discharge summary and
              medical reports.
            </p>
          </div>
        </div>

        <div className="tipCard">
          <FaHome />

          <div>
            <h4>Property Insurance</h4>

            <p>
              Upload ownership proof, damaged property images and incident
              reports.
            </p>
          </div>
        </div>

        <div className="tipCard">
          <FaPlaneDeparture />

          <div>
            <h4>Travel Insurance</h4>

            <p>
              Upload boarding pass, passport copy, baggage receipts and travel
              tickets.
            </p>
          </div>
        </div>

        <div className="tipCard">
          <FaUserShield />

          <div>
            <h4>Life Insurance</h4>

            <p>
              Attach nominee ID proof, policy certificate and required
              supporting documents.
            </p>
          </div>
        </div>

      </div>

    </section>

    {/* ======================================
        SUCCESS POPUP MODAL
    ====================================== */}

    {showSuccessModal && (
      <div className="modalOverlay">

        <div className="modalCard">

          <div className="modalHeader">

            <FaCheckCircle className="modalSuccessIcon" />

            <h2>Claim Submitted Successfully!</h2>

            <button
              className="modalCloseBtn"
              onClick={handleCloseSuccessModal}
              type="button"
            >
              <FaTimes />
            </button>

          </div>

          <div className="modalBody">

            <p>
              Your insurance claim has been processed and submitted. Summary of details:
            </p>

            <div className="modalDetails">

              <div>
                <span>Applicant:</span> <strong>{successApplicant}</strong>
              </div>

              <div>
                <span>Claim Number:</span> <strong>{successClaimNumber}</strong>
              </div>

              <div>
                <span>Submission Date:</span> <strong>{submissionDate}</strong>
              </div>

            </div>

          </div>

          <div className="modalFooter">

            <button
              className="secondaryBtn"
              onClick={handleSuccessViewPDF}
              type="button"
            >
              <FaEye /> View PDF
            </button>

            <button
              className="primaryBtn"
              onClick={handleSuccessDownloadPDF}
              type="button"
            >
              <FaDownload /> Download PDF
            </button>

          </div>

        </div>

      </div>
    )}

    </div>
  );
};

export default DynamicForms;