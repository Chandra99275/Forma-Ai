import React, { useState } from "react";
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
} from "react-icons/fa";

// Components
import CategoryCard from "../components/forms/CategoryCard";
import ProgressStepper from "../components/forms/ProgressStepper";
import AIUploader from "../components/forms/AIUploader";
import ManualForm from "../components/forms/ManualForm";

const DynamicForms = () => {
  /* ===========================
        STATE MANAGEMENT
  =========================== */

  const [selectedCategory, setSelectedCategory] = useState("vehicle");
  const [applicationMode, setApplicationMode] = useState("manual");
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    policyNumber: "",
    description: "",
  });

  /* ===========================
        CATEGORY LIST
  =========================== */

  const insuranceCategories = [
    {
      id: "health",
      title: "Health Insurance",
      subtitle: "Hospitalization • Surgery • Pharmacy • ICU",
      icon: <FaHeartbeat />,
      color: "#EF4444",
    },
    {
      id: "vehicle",
      title: "Vehicle Accident",
      subtitle: "Car • Bike • Theft • Flood • Collision",
      icon: <FaCarCrash />,
      color: "#2563EB",
    },
    {
      id: "property",
      title: "Property Insurance",
      subtitle: "Fire • Flood • Burglary • Natural Disaster",
      icon: <FaHome />,
      color: "#059669",
    },
    {
      id: "travel",
      title: "Travel Insurance",
      subtitle: "Flight Delay • Passport Loss • Baggage",
      icon: <FaPlaneDeparture />,
      color: "#EA580C",
    },
    {
      id: "life",
      title: "Life Insurance",
      subtitle: "Death • Nominee • Critical Illness",
      icon: <FaShieldAlt />,
      color: "#7C3AED",
    },
  ];

  /* ===========================
        COMMON INPUT HANDLER
  =========================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===========================
        STEP NAVIGATION
  =========================== */

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="dynamicPage">

      {/* =====================================
            HERO SECTION
      ===================================== */}

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
            Smart AI-Augmented Dynamic Form Engine for Health,
            Vehicle, Property, Travel and Life Insurance Claims.
            Upload PDFs, Images or manually fill your insurance
            application within minutes.
          </p>

          <div className="heroButtons">

            <button className="primaryBtn">
              <FaMagic />
              AI Auto Fill
            </button>

            <button className="secondaryBtn">
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
              <h2>25,000+</h2>
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

      {/* =====================================
            PROGRESS STEPPER
      ===================================== */}

      <ProgressStepper step={currentStep} />

      {/* =====================================
            CATEGORY SECTION
      ===================================== */}

      <section className="categorySection">

        <div className="sectionTitle">
          <h2>Choose Insurance Category</h2>

          <p>
            Select the insurance claim template that matches your
            incident.
          </p>
        </div>

        <div className="categoryGrid">

          {insuranceCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              selected={selectedCategory === category.id}
              onSelect={() => setSelectedCategory(category.id)}
            />
          ))}

        </div>

      </section>

      {/* =====================================
            APPLICATION MODE
      ===================================== */}

      <section className="modeSection">

        <div className="sectionTitle">
          <h2>Choose Application Method</h2>

          <p>
            Forma AI supports AI-assisted applications, manual
            applications, image OCR and PDF extraction.
          </p>
        </div>

        <div className="modeGrid">

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
            <p>Fill insurance forms manually.</p>
          </div>

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
            <p>Paste your incident description.</p>
          </div>

          <div
            className={
              applicationMode === "image"
                ? "modeCard activeMode"
                : "modeCard"
            }
            onClick={() => setApplicationMode("image")}
          >
            <FaCamera className="modeIcon" />
            <h3>Image Upload</h3>
            <p>Upload accident photos for OCR.</p>
          </div>

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
            <p>Upload FIR, Bills, Medical Reports.</p>
          </div>

        </div>

      </section>

      {/* =====================================
            AI / IMAGE / PDF UPLOADER
      ===================================== */}

      {(applicationMode === "ai" ||
        applicationMode === "image" ||
        applicationMode === "pdf") && (
        <AIUploader mode={applicationMode} />
      )}

      {/* =====================================
            MANUAL FORM SECTION
      ===================================== */}

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

          {/* Common Applicant Information */}

          <div className="commonCard">

            <h3>Applicant Information</h3>

            <div className="grid2">

              <div className="inputGroup">
                <label>Applicant Name</label>

                <input
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
                  placeholder="mahesh@email.com"
                />
              </div>

              <div className="inputGroup">
                <label>Mobile Number</label>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="inputGroup">
                <label>Policy Number</label>

                <input
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleChange}
                  placeholder="POL-2026-10021"
                />
              </div>

            </div>

            <div className="inputGroup fullWidth">
              <label>Describe Your Claim</label>

              <textarea
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain your insurance claim in detail..."
              />
            </div>

          </div>

          {/* Selected Category Form */}

          <ManualForm category={selectedCategory} />

        </section>
      )}

      {/* =====================================
            AI SMART FEATURES
      ===================================== */}

      <section className="featuresSection">

        <div className="sectionTitle">
          <h2>AI Powered Features</h2>
        </div>

        <div className="featureGrid">

          <div className="featureCard">
            <FaRobot className="featureIcon" />
            <h4>AI Incident Parser</h4>
            <p>
              Converts natural language into structured insurance fields.
            </p>
          </div>

          <div className="featureCard">
            <FaCamera className="featureIcon" />
            <h4>Image OCR</h4>
            <p>
              Extract text from prescriptions, RC, DL and accident photos.
            </p>
          </div>

          <div className="featureCard">
            <FaFilePdf className="featureIcon" />
            <h4>PDF Extraction</h4>
            <p>
              Read FIR, Hospital Bills, Medical Reports and Insurance PDFs.
            </p>
          </div>

          <div className="featureCard">
            <FaMagic className="featureIcon" />
            <h4>Smart Validation</h4>
            <p>
              AI validates missing fields before submission.
            </p>
          </div>

          <div className="featureCard">
            <FaCheckCircle className="featureIcon" />
            <h4>Confidence Score</h4>
            <p>
              Every AI-generated claim receives a confidence score.
            </p>
          </div>

          <div className="featureCard">
            <FaClipboardList className="featureIcon" />
            <h4>Save Draft Anytime</h4>
            <p>
              Continue your insurance application later.
            </p>
          </div>

        </div>

      </section>

      {/* =====================================
            REVIEW CARD
      ===================================== */}

      <section className="reviewSection">

        <div className="reviewCard">

          <h2>Review & Submit</h2>

          <div className="reviewGrid">

            <div>
              <span>Insurance Category</span>
              <h4>{selectedCategory.toUpperCase()}</h4>
            </div>

            <div>
              <span>Application Mode</span>
              <h4>{applicationMode.toUpperCase()}</h4>
            </div>

            <div>
              <span>Applicant</span>
              <h4>{formData.applicantName || "Not Filled"}</h4>
            </div>

            <div>
              <span>Policy Number</span>
              <h4>{formData.policyNumber || "Not Filled"}</h4>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================
            ACTION BUTTONS
      ===================================== */}

      <section className="actionSection">

        <button className="outlineBtn" onClick={previousStep}>
          Previous
        </button>

        <button className="saveBtn">
          <FaSave />
          Save Draft
        </button>

        <button className="nextBtn" onClick={nextStep}>
          Continue
          <FaArrowRight />
        </button>

        <button className="submitBtn">
          <FaPaperPlane />
          Submit Claim
        </button>

      </section>

      {/* =====================================
            AI SIDEBAR
      ===================================== */}

      <section className="tipsSection">

        <h2>Forma AI Smart Suggestions</h2>

        <div className="tipsGrid">

          <div className="tipCard">
            <FaRobot />
            <p>
              Upload accident photos for AI damage detection.
            </p>
          </div>

          <div className="tipCard">
            <FaFilePdf />
            <p>
              Upload FIR or Medical Bills to auto-fill claim details.
            </p>
          </div>

          <div className="tipCard">
            <FaCheckCircle />
            <p>
              AI checks missing information before submission.
            </p>
          </div>

          <div className="tipCard">
            <FaHeartbeat />
            <p>
              Health insurance claims support OCR prescriptions and bills.
            </p>
          </div>

          <div className="tipCard">
            <FaCarCrash />
            <p>
              Vehicle claims support RC, DL, Police FIR and repair estimates.
            </p>
          </div>

          <div className="tipCard">
            <FaShieldAlt />
            <p>
              Life insurance claims support nominee verification documents.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
};

export default DynamicForms;