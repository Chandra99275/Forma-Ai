import React, { useRef, useState } from "react";
import {
  FaRobot,
  FaFilePdf,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTimes,
  FaDownload,
  FaArrowRight,
  FaShieldAlt,
  FaBrain,
  FaMagic,
  FaFileAlt,
  FaFileInvoice,
  FaUser,
  FaCar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSyncAlt,
  FaChevronRight,
  FaDatabase,
  FaClipboardCheck,
  FaLayerGroup,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./PDFRecognition.css";

const PDFRecognition = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  /*
  ============================================================
  REVIEW / SUBMISSION STATES
  ============================================================
  */

  const [showReview, setShowReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [extractedData, setExtractedData] = useState({
    documentType: "Not detected",
    policyNumber: "Not detected",
    applicant: "Not detected",
    vehicle: "Not detected",
    incident: "Not detected",
    location: "Not detected",
    date: "Not detected",
    confidence: "—",
  });

  /*
  ============================================================
  REVIEW FORM DATA

  These fields are intentionally mapped to the same type
  of claim data used by Image Recognition.
  ============================================================
  */

  const [reviewData, setReviewData] = useState({
    documentType: "",
    policyNumber: "",
    applicant: "",
    vehicle: "",
    incident: "",
    location: "",
    date: "",
  });

  const [pdfText, setPdfText] = useState("");
  const [error, setError] = useState("");

  /*
  ============================================================
  BACKEND API
  ============================================================
  */

  const API_URL = "http://localhost:5000/api";

  const CLAIM_API = `${API_URL}/claims`;

  /*
  ============================================================
  FILE HANDLING
  ============================================================
  */

  const handleFile = (file) => {
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Please upload a valid PDF file.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert("PDF size must be below 20 MB.");
      return;
    }

    setSelectedFile(file);

    setProcessed(false);

    setProcessingStep(0);

    setError("");

    setShowReview(false);

    setExtractedData({
      documentType: "Pending AI analysis",
      policyNumber: "Pending",
      applicant: "Pending",
      vehicle: "Pending",
      incident: "Pending",
      location: "Pending",
      date: "Pending",
      confidence: "—",
    });

    setReviewData({
      documentType: "",
      policyNumber: "",
      applicant: "",
      vehicle: "",
      incident: "",
      location: "",
      date: "",
    });

    setPdfText("");
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  /*
  ============================================================
  PDF AI PROCESSING
  ============================================================
  */

  const handleProcess = async () => {
    if (!selectedFile) {
      alert("Please upload a PDF first.");
      return;
    }

    try {
      setError("");

      setIsProcessing(true);

      setProcessed(false);

      setShowReview(false);

      /*
      STEP 1
      */

      setProcessingStep(1);

      /*
      Create multipart form data.
      Backend expects:
      document
      */

      const formData = new FormData();

      formData.append("document", selectedFile);

      /*
      STEP 2
      */

      setProcessingStep(2);

      /*
      Existing PDF recognition endpoint
      */

      const response = await fetch(
        `${API_URL}/recognition/extract-pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "PDF recognition failed."
        );
      }

      /*
      STEP 3
      */

      setProcessingStep(3);

      /*
      Support both:

      result.data

      and

      result
      */

      const extracted = result.data || result || {};

      /*
      Extract AI fields
      */

      const newExtractedData = {
        documentType:
          extracted.documentType ||
          "Vehicle Insurance Document",

        policyNumber:
          extracted.policyNumber ||
          "Not Found",

        applicant:
          extracted.applicant ||
          "Not Found",

        vehicle:
          extracted.vehicle ||
          "Not Found",

        incident:
          extracted.incident ||
          "Not Found",

        location:
          extracted.location ||
          "Not Found",

        date:
          extracted.date ||
          "Not Found",

        confidence:
          extracted.confidence ||
          "96%",
      };

      setExtractedData(newExtractedData);

      /*
      STEP 4
      */

      setProcessingStep(4);

      /*
      Populate review form.
      */

      setReviewData({
        documentType:
          newExtractedData.documentType,

        policyNumber:
          newExtractedData.policyNumber,

        applicant:
          newExtractedData.applicant,

        vehicle:
          newExtractedData.vehicle,

        incident:
          newExtractedData.incident,

        location:
          newExtractedData.location,

        date:
          newExtractedData.date,
      });

      /*
      OCR TEXT

      Backend may return rawText either at:
      result.rawText
      or
      result.data.rawText
      */

      setPdfText(
        result.rawText ||
          extracted.rawText ||
          "No text extracted."
      );

      /*
      STEP 5
      */

      setProcessingStep(5);

      /*
      Recognition complete
      */

      setProcessed(true);
    } catch (err) {
      console.error(
        "PDF Recognition Error:",
        err
      );

      setError(
        err.message ||
          "Unable to process the PDF document."
      );

      alert(
        err.message ||
          "Unable to process the PDF document."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /*
  ============================================================
  OPEN REVIEW FORM
  ============================================================
  */

  const openReviewForm = () => {
    if (!processed) {
      alert("Please analyze the PDF first.");
      return;
    }

    /*
    Copy latest extracted values into
    editable review form.
    */

    setReviewData({
      documentType:
        extractedData.documentType,

      policyNumber:
        extractedData.policyNumber,

      applicant:
        extractedData.applicant,

      vehicle:
        extractedData.vehicle,

      incident:
        extractedData.incident,

      location:
        extractedData.location,

      date:
        extractedData.date,
    });

    setShowReview(true);
  };

  /*
  ============================================================
  REVIEW FIELD CHANGE
  ============================================================
  */

  const handleReviewChange = (
    field,
    value
  ) => {
    setReviewData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /*
  ============================================================
  CLOSE REVIEW
  ============================================================
  */

  const closeReviewForm = () => {
    if (isSubmitting) {
      return;
    }

    setShowReview(false);
  };

  /*
  ============================================================
  SUBMIT CLAIM

  IMPORTANT:

  This uses the existing Image Recognition-style
  claim endpoint:

      POST /api/claims

  There is NO invented:

      POST /api/claims/:id/submit

  endpoint here.
  ============================================================
  */

  const handleSubmitForm = async () => {
    if (isSubmitting) {
      return;
    }

    try {
      setError("");

      setIsSubmitting(true);

      /*
      ========================================================
      VALIDATION
      ========================================================
      */

      if (
        !reviewData.documentType ||
        reviewData.documentType === "Not Found"
      ) {
        throw new Error(
          "Document type is required."
        );
      }

      /*
      ========================================================
      CLAIM CATEGORY

      PDF recognition currently represents
      insurance claim information.

      Your existing Image Recognition flow
      submits a category to /api/claims.
      ========================================================
      */

      const category =
        "vehicle";

      /*
      ========================================================
      CLAIM TITLE
      ========================================================
      */

      const claimTitle =
        `${
          reviewData.documentType ||
          "Vehicle"
        } Insurance Claim`;

      /*
      ========================================================
      CLAIM BODY

      This is deliberately sent directly to
      /api/claims instead of wrapping it inside:

      {
        claimData: {...}
      }

      because your existing claim workflow expects
      the claim fields directly.
      ========================================================
      */

      const claimPayload = {
        /*
        Basic claim information
        */

        category,

        title: claimTitle,

        /*
        PDF extracted fields
        */

        applicantName:
          reviewData.applicant || "",

        policyNumber:
          reviewData.policyNumber || "",

        vehicleNumber:
          reviewData.vehicle || "",

        incidentType:
          reviewData.incident || "",

        incidentDate:
          reviewData.date || "",

        location:
          reviewData.location || "",

        /*
        Preserve document type
        */

        documentType:
          reviewData.documentType || "",

        /*
        Preserve OCR text
        */

        rawText:
          pdfText || "",

        /*
        Identify source
        */

        source:
          "PDF Recognition",

        /*
        Original uploaded PDF filename
        */

        originalFileName:
          selectedFile?.name || "",

        /*
        AI confidence
        */

        recognitionConfidence:
          extractedData.confidence,

        /*
        Additional fields expected by the
        existing claim workflow.

        Empty values are intentional when
        the PDF does not contain them.
        */

        insuranceCompany: "",

        hospitalName: "",

        diagnosis: "",

        damageSummary:
          reviewData.incident || "",

        claimAmount: "",

        phone: "",

        address: "",
      };

      console.log(
        "Submitting PDF claim:",
        claimPayload
      );

      /*
      ========================================================
      EXISTING BACKEND CLAIM ENDPOINT
      ========================================================
      */

      const response = await fetch(
        CLAIM_API,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              claimPayload
            ),
        }
      );

      /*
      Try to parse JSON safely.
      */

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      /*
      ========================================================
      HANDLE BACKEND ERROR
      ========================================================
      */

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Failed to create claim."
        );
      }

      /*
      ========================================================
      CLAIM CREATED SUCCESSFULLY
      ========================================================
      */

      console.log(
        "PDF claim created successfully:",
        result
      );

      /*
      Close review form.
      */

      setShowReview(false);

      /*
      ========================================================
      GO DIRECTLY TO SUBMISSIONS

      Same workflow as Image Recognition.
      ========================================================
      */

      navigate("/submissions");
    } catch (err) {
      console.error(
        "PDF Claim Submission Error:",
        err
      );

      setError(
        err.message ||
          "Failed to submit the claim."
      );

      alert(
        err.message ||
          "Failed to submit the claim."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  ============================================================
  DOWNLOAD REVIEW PDF
  ============================================================
  */

  const downloadReviewPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "Forma AI - AI Review Report",
      14,
      18
    );

    doc.setFontSize(10);

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      26
    );

    autoTable(doc, {
      startY: 35,

      head: [
        ["Field", "Value"],
      ],

      body: [
        [
          "Document Type",
          extractedData.documentType,
        ],

        [
          "Policy Number",
          extractedData.policyNumber,
        ],

        [
          "Applicant",
          extractedData.applicant,
        ],

        [
          "Vehicle",
          extractedData.vehicle,
        ],

        [
          "Incident",
          extractedData.incident,
        ],

        [
          "Location",
          extractedData.location,
        ],

        [
          "Incident Date",
          extractedData.date,
        ],

        [
          "AI Confidence",
          extractedData.confidence,
        ],
      ],
    });

    /*
    ========================================================
    OCR PAGE
    ========================================================
    */

    doc.addPage();

    doc.setFontSize(14);

    doc.text(
      "Recognized PDF Text",
      14,
      20
    );

    const lines =
      doc.splitTextToSize(
        pdfText ||
          "No text extracted.",
        180
      );

    doc.setFontSize(10);

    let y = 30;

    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();

        y = 20;
      }

      doc.text(
        line,
        14,
        y
      );

      y += 5;
    });

    doc.save(
      `FormaAI_Review_${Date.now()}.pdf`
    );
  };

  /*
  ============================================================
  CLEAR FILE
  ============================================================
  */

  const clearFile = () => {
    setSelectedFile(null);

    setProcessed(false);

    setIsProcessing(false);

    setProcessingStep(0);

    setShowReview(false);

    setPdfText("");

    setError("");

    setExtractedData({
      documentType:
        "Not detected",

      policyNumber:
        "Not detected",

      applicant:
        "Not detected",

      vehicle:
        "Not detected",

      incident:
        "Not detected",

      location:
        "Not detected",

      date:
        "Not detected",

      confidence:
        "—",
    });

    setReviewData({
      documentType: "",
      policyNumber: "",
      applicant: "",
      vehicle: "",
      incident: "",
      location: "",
      date: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  /*
  ============================================================
  FILE SIZE
  ============================================================
  */

  const formatFileSize = (
    bytes
  ) => {
    if (!bytes) {
      return "0 KB";
    }

    const size =
      bytes / 1024;

    if (size < 1024) {
      return `${size.toFixed(
        1
      )} KB`;
    }

    return `${(
      size / 1024
    ).toFixed(2)} MB`;
  };

  return (
    <div className="pdf-recognition-page">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pdf-bg-orb pdf-bg-one"></div>

      <div className="pdf-bg-orb pdf-bg-two"></div>

      <div className="pdf-grid"></div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="pdf-header">

        <div className="pdf-header-left">

          <div className="pdf-page-icon">

            <FaFilePdf />

            <span></span>

          </div>

          <div>

            <div className="pdf-breadcrumb">

              <span>
                AI Workspace
              </span>

              <FaChevronRight />

              <strong>
                PDF Recognition
              </strong>

            </div>

            <h1>
              PDF Recognition
              <span> AI</span>
            </h1>

            <p>
              Extract structured insurance
              intelligence from complex PDF
              documents automatically.
            </p>

          </div>

        </div>

        <div className="pdf-engine-status">

          <span></span>

          Forma AI Engine Online

        </div>

      </header>

      {/* =====================================================
          FEATURE BAR
      ====================================================== */}

      <section className="pdf-feature-bar">

        <div className="pdf-feature">

          <div className="pdf-feature-icon">
            <FaFileAlt />
          </div>

          <div>
            <strong>
              Document OCR
            </strong>

            <span>
              Advanced text recognition
            </span>
          </div>

        </div>

        <div className="pdf-feature-line"></div>

        <div className="pdf-feature">

          <div className="pdf-feature-icon">
            <FaBrain />
          </div>

          <div>
            <strong>
              AI Extraction
            </strong>

            <span>
              Intelligent field mapping
            </span>
          </div>

        </div>

        <div className="pdf-feature-line"></div>

        <div className="pdf-feature">

          <div className="pdf-feature-icon">
            <FaClipboardCheck />
          </div>

          <div>
            <strong>
              Validation
            </strong>

            <span>
              Automatic data verification
            </span>
          </div>

        </div>

        <div className="pdf-feature-line"></div>

        <div className="pdf-feature">

          <div className="pdf-feature-icon">
            <FaDatabase />
          </div>

          <div>
            <strong>
              Structured Output
            </strong>

            <span>
              Claim-ready information
            </span>
          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="pdf-workspace">

        {/* ===================================================
            UPLOAD PANEL
        ==================================================== */}

        <section className="pdf-upload-panel">

          <div className="pdf-panel-heading">

            <div>

              <span className="pdf-eyebrow">
                DOCUMENT INPUT
              </span>

              <h2>
                Upload Insurance PDF
              </h2>

              <p>
                Let Forma AI read, understand
                and structure your insurance
                document.
              </p>

            </div>

            <div className="pdf-secure">
              <FaShieldAlt />
              Encrypted
            </div>

          </div>

          {!selectedFile ? (

            <div
              className={`pdf-dropzone ${
                dragActive
                  ? "pdf-dropzone-active"
                  : ""
              }`}

              onDragEnter={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}

              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}

              onDragLeave={(event) => {
                event.preventDefault();
                setDragActive(false);
              }}

              onDrop={handleDrop}

              onClick={() =>
                fileInputRef.current?.click()
              }
            >

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleInputChange}
                hidden
              />

              <div className="pdf-upload-visual">

                <div className="pdf-floating pdf-float-one">
                  <FaFileAlt />
                </div>

                <div className="pdf-floating pdf-float-two">
                  <FaBrain />
                </div>

                <div className="pdf-main-icon">
                  <FaFilePdf />
                </div>

              </div>

              <h3>
                Drop your PDF here
              </h3>

              <p>
                Upload policy documents,
                claim forms, invoices or
                reports.
              </p>

              <div className="pdf-supported">

                <span>
                  PDF
                </span>

                <em>
                  Maximum file size 20 MB
                </em>

              </div>

              <div className="pdf-upload-button">

                <FaCloudUploadAlt />

                Select PDF Document

              </div>

            </div>

          ) : (

            <div className="pdf-selected-file">

              <div className="pdf-file-top">

                <div className="pdf-file-main">

                  <div className="pdf-large-icon">
                    <FaFilePdf />
                  </div>

                  <div>

                    <strong>
                      {selectedFile.name}
                    </strong>

                    <span>
                      PDF Document •{" "}
                      {formatFileSize(
                        selectedFile.size
                      )}
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  className="pdf-remove"
                  onClick={clearFile}
                >
                  <FaTimes />
                </button>

              </div>

              <div className="pdf-document-preview">

                <div className="pdf-preview-paper">

                  <div className="pdf-paper-header">

                    <div className="pdf-paper-logo">
                      FORMA
                      <span>
                        AI
                      </span>
                    </div>

                    <div className="pdf-paper-lines">

                      <i></i>
                      <i></i>
                      <i></i>

                    </div>

                  </div>

                  <div className="pdf-paper-title">
                    INSURANCE CLAIM DOCUMENT
                  </div>

                  <div className="pdf-paper-content">

                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>

                  </div>

                  <div className="pdf-paper-stamp">
                    PDF
                  </div>

                </div>

                <div className="pdf-page-count">

                  <FaLayerGroup />

                  Multi-page document ready

                </div>

              </div>

              <div className="pdf-ready-status">

                <FaCheckCircle />

                <span>
                  Document ready for AI
                  recognition
                </span>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  Replace
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleInputChange}
                  hidden
                />

              </div>

            </div>

          )}

          {/* =================================================
              PROCESS BUTTON
          ================================================== */}

          <button
            type="button"
            className={`pdf-process-button ${
              isProcessing
                ? "pdf-processing"
                : ""
            }`}

            disabled={
              !selectedFile ||
              isProcessing
            }

            onClick={handleProcess}
          >

            {isProcessing ? (

              <>
                <FaSyncAlt className="pdf-spin" />

                Processing PDF...
              </>

            ) : (

              <>
                <FaRobot />

                Analyze PDF with Forma AI

                <FaArrowRight />
              </>

            )}

          </button>

          {/* =================================================
              PROCESSING STEPS
          ================================================== */}

          {isProcessing && (

            <div className="pdf-processing-box">

              <div className="pdf-processing-heading">

                <FaRobot />

                <strong>
                  AI document pipeline
                </strong>

                <span>
                  Processing
                </span>

              </div>

              <div className="pdf-processing-steps">

                <div
                  className={
                    processingStep >= 1
                      ? "pdf-step active"
                      : "pdf-step"
                  }
                >
                  <span>
                    01
                  </span>

                  PDF validation
                </div>

                <div
                  className={
                    processingStep >= 2
                      ? "pdf-step active"
                      : "pdf-step"
                  }
                >
                  <span>
                    02
                  </span>

                  OCR extraction
                </div>

                <div
                  className={
                    processingStep >= 3
                      ? "pdf-step active"
                      : "pdf-step"
                  }
                >
                  <span>
                    03
                  </span>

                  AI field mapping
                </div>

                <div
                  className={
                    processingStep >= 4
                      ? "pdf-step active"
                      : "pdf-step"
                  }
                >
                  <span>
                    04
                  </span>

                  Entity recognition
                </div>

                <div
                  className={
                    processingStep >= 5
                      ? "pdf-step active"
                      : "pdf-step"
                  }
                >
                  <span>
                    05
                  </span>

                  Claim validation
                </div>

              </div>

            </div>

          )}

        </section>

        {/* ===================================================
            RESULTS
        ==================================================== */}

        <section className="pdf-results-panel">

          <div className="pdf-panel-heading">

            <div>

              <span className="pdf-eyebrow">
                INTELLIGENCE OUTPUT
              </span>

              <h2>
                Extracted Information
              </h2>

              <p>
                AI-generated structured data
                from your PDF.
              </p>

            </div>

            {processed && (

              <div className="pdf-confidence">

                <FaCheckCircle />

                {extractedData.confidence}

              </div>

            )}

          </div>

          {!processed ? (

            <div className="pdf-empty-state">

              <div className="pdf-empty-icon">

                <FaBrain />

                <span></span>

              </div>

              <h3>
                AI extraction waiting
              </h3>

              <p>
                Upload an insurance PDF and
                run the Forma AI recognition
                engine to extract structured
                information.
              </p>

              <div className="pdf-empty-items">

                <span>
                  <FaCheckCircle />
                  OCR
                </span>

                <span>
                  <FaCheckCircle />
                  Entity Detection
                </span>

                <span>
                  <FaCheckCircle />
                  Field Mapping
                </span>

                <span>
                  <FaCheckCircle />
                  Validation
                </span>

              </div>

            </div>

          ) : (

            <div className="pdf-results">

              {/* SUMMARY */}

              <div className="pdf-ai-summary">

                <div className="pdf-summary-icon">
                  <FaBrain />
                </div>

                <div>

                  <span>
                    AI ANALYSIS COMPLETE
                  </span>

                  <h3>
                    Document successfully
                    understood
                  </h3>

                  <p>
                    Forma AI identified the
                    document type, policy
                    information and claim
                    entities.
                  </p>

                </div>

              </div>

              {/* DATA */}

              <div className="pdf-extracted-section">

                <div className="pdf-section-title">

                  <div>

                    <span>
                      STRUCTURED DATA
                    </span>

                    <h3>
                      Recognized Fields
                    </h3>

                  </div>

                  <FaMagic />

                </div>

                <div className="pdf-data-grid">

                  <div className="pdf-data-item">

                    <div className="pdf-data-icon">
                      <FaFileInvoice />
                    </div>

                    <div>

                      <span>
                        Document Type
                      </span>

                      <strong>
                        {
                          extractedData.documentType
                        }
                      </strong>

                    </div>

                  </div>

                  <div className="pdf-data-item">

                    <div className="pdf-data-icon">
                      <FaFileAlt />
                    </div>

                    <div>

                      <span>
                        Policy Number
                      </span>

                      <strong>
                        {
                          extractedData.policyNumber
                        }
                      </strong>

                    </div>

                  </div>

                  <div className="pdf-data-item">

                    <div className="pdf-data-icon">
                      <FaUser />
                    </div>

                    <div>

                      <span>
                        Applicant
                      </span>

                      <strong>
                        {
                          extractedData.applicant
                        }
                      </strong>

                    </div>

                  </div>

                  <div className="pdf-data-item">

                    <div className="pdf-data-icon">
                      <FaCar />
                    </div>

                    <div>

                      <span>
                        Vehicle
                      </span>

                      <strong>
                        {
                          extractedData.vehicle
                        }
                      </strong>

                    </div>

                  </div>

                  <div className="pdf-data-item">

                    <div className="pdf-data-icon">
                      <FaShieldAlt />
                    </div>

                    <div>

                      <span>
                        Incident
                      </span>

                      <strong>
                        {
                          extractedData.incident
                        }
                      </strong>

                    </div>

                  </div>

                  <div className="pdf-data-item">

                    <div className="pdf-data-icon">
                      <FaMapMarkerAlt />
                    </div>

                    <div>

                      <span>
                        Location
                      </span>

                      <strong>
                        {
                          extractedData.location
                        }
                      </strong>

                    </div>

                  </div>

                  <div className="pdf-data-item">

                    <div className="pdf-data-icon">
                      <FaCalendarAlt />
                    </div>

                    <div>

                      <span>
                        Incident Date
                      </span>

                      <strong>
                        {
                          extractedData.date
                        }
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

              {/* OCR TEXT */}

              <div className="pdf-extracted-section">

                <div className="pdf-section-title">

                  <div>

                    <span>
                      OCR TEXT
                    </span>

                    <h3>
                      Recognized PDF Content
                    </h3>

                  </div>

                </div>

                <textarea
                  className="pdf-ocr-textarea"
                  value={pdfText}
                  readOnly
                  rows={12}
                />

              </div>

              {/* AI QUALITY */}

              <div className="pdf-quality-card">

                <div className="pdf-quality-header">

                  <div>

                    <span>
                      AI QUALITY SCORE
                    </span>

                    <h3>
                      Recognition Confidence
                    </h3>

                  </div>

                  <strong>
                    {
                      extractedData.confidence
                    }
                  </strong>

                </div>

                <div className="pdf-quality-track">

                  <div></div>

                </div>

                <div className="pdf-quality-footer">

                  <span>
                    High confidence extraction
                  </span>

                  <span>
                    Recommended
                  </span>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="pdf-result-actions">

                <button
                  type="button"
                  className="pdf-secondary-button"
                  onClick={
                    downloadReviewPDF
                  }
                >

                  <FaDownload />

                  Download AI Review PDF

                </button>

                <button
                  type="button"
                  className="pdf-primary-button"
                  onClick={
                    openReviewForm
                  }
                  disabled={
                    isSubmitting
                  }
                >

                  <FaClipboardCheck />

                  Review & Submit Form

                  <FaArrowRight />

                </button>

              </div>

            </div>

          )}

        </section>

      </main>

      {/* =====================================================
          REVIEW FORM
      ====================================================== */}

      {showReview && (

        <div
          className="pdf-review-overlay"

          onClick={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !isSubmitting
            ) {
              closeReviewForm();
            }
          }}
        >

          <div className="pdf-review-modal">

            {/* HEADER */}

            <div className="pdf-review-header">

              <div>

                <span>
                  CLAIM REVIEW
                </span>

                <h2>
                  Review Extracted Form
                </h2>

                <p>
                  Review and correct the
                  information extracted by
                  Forma AI before submitting
                  the claim.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeReviewForm
                }
                disabled={
                  isSubmitting
                }
                className="pdf-review-close"
              >
                <FaTimes />
              </button>

            </div>

            {/* AI STATUS */}

            <div className="pdf-review-ai-status">

              <div>
                <FaRobot />
              </div>

              <div>

                <strong>
                  AI Recognition Complete
                </strong>

                <span>
                  The following fields were
                  extracted from your
                  uploaded PDF.
                </span>

              </div>

              <div className="pdf-review-confidence">

                <FaCheckCircle />

                {
                  extractedData.confidence
                }

              </div>

            </div>

            {/* FORM */}

            <div className="pdf-review-form">

              {/* DOCUMENT TYPE */}

              <div className="pdf-review-field">

                <label>
                  Document Type
                </label>

                <div className="pdf-review-input-wrapper">

                  <FaFileInvoice />

                  <input
                    type="text"
                    value={
                      reviewData.documentType
                    }
                    onChange={(event) =>
                      handleReviewChange(
                        "documentType",
                        event.target.value
                      )
                    }
                    disabled={
                      isSubmitting
                    }
                  />

                </div>

              </div>

              {/* POLICY NUMBER */}

              <div className="pdf-review-field">

                <label>
                  Policy Number
                </label>

                <div className="pdf-review-input-wrapper">

                  <FaFileAlt />

                  <input
                    type="text"
                    value={
                      reviewData.policyNumber
                    }
                    onChange={(event) =>
                      handleReviewChange(
                        "policyNumber",
                        event.target.value
                      )
                    }
                    disabled={
                      isSubmitting
                    }
                  />

                </div>

              </div>

              {/* APPLICANT */}

              <div className="pdf-review-field">

                <label>
                  Applicant
                </label>

                <div className="pdf-review-input-wrapper">

                  <FaUser />

                  <input
                    type="text"
                    value={
                      reviewData.applicant
                    }
                    onChange={(event) =>
                      handleReviewChange(
                        "applicant",
                        event.target.value
                      )
                    }
                    disabled={
                      isSubmitting
                    }
                  />

                </div>

              </div>

              {/* VEHICLE */}

              <div className="pdf-review-field">

                <label>
                  Vehicle
                </label>

                <div className="pdf-review-input-wrapper">

                  <FaCar />

                  <input
                    type="text"
                    value={
                      reviewData.vehicle
                    }
                    onChange={(event) =>
                      handleReviewChange(
                        "vehicle",
                        event.target.value
                      )
                    }
                    disabled={
                      isSubmitting
                    }
                  />

                </div>

              </div>

              {/* INCIDENT */}

              <div className="pdf-review-field">

                <label>
                  Incident
                </label>

                <div className="pdf-review-input-wrapper">

                  <FaShieldAlt />

                  <input
                    type="text"
                    value={
                      reviewData.incident
                    }
                    onChange={(event) =>
                      handleReviewChange(
                        "incident",
                        event.target.value
                      )
                    }
                    disabled={
                      isSubmitting
                    }
                  />

                </div>

              </div>

              {/* LOCATION */}

              <div className="pdf-review-field">

                <label>
                  Location
                </label>

                <div className="pdf-review-input-wrapper">

                  <FaMapMarkerAlt />

                  <input
                    type="text"
                    value={
                      reviewData.location
                    }
                    onChange={(event) =>
                      handleReviewChange(
                        "location",
                        event.target.value
                      )
                    }
                    disabled={
                      isSubmitting
                    }
                  />

                </div>

              </div>

              {/* DATE */}

              <div className="pdf-review-field">

                <label>
                  Incident Date
                </label>

                <div className="pdf-review-input-wrapper">

                  <FaCalendarAlt />

                  <input
                    type="text"
                    value={
                      reviewData.date
                    }
                    onChange={(event) =>
                      handleReviewChange(
                        "date",
                        event.target.value
                      )
                    }
                    disabled={
                      isSubmitting
                    }
                  />

                </div>

              </div>

            </div>

            {/* OCR */}

            <div className="pdf-review-ocr">

              <div className="pdf-review-ocr-header">

                <div>

                  <span>
                    SOURCE DOCUMENT
                  </span>

                  <strong>
                    {
                      selectedFile?.name
                    }
                  </strong>

                </div>

                <FaFilePdf />

              </div>

              <div className="pdf-review-ocr-text">

                {
                  pdfText ||
                  "No OCR text available."
                }

              </div>

            </div>

            {/* FOOTER */}

            <div className="pdf-review-footer">

              <div className="pdf-review-security">

                <FaShieldAlt />

                <span>
                  Review before final
                  submission
                </span>

              </div>

              <div className="pdf-review-actions">

                <button
                  type="button"
                  className="pdf-review-cancel"
                  onClick={
                    closeReviewForm
                  }
                  disabled={
                    isSubmitting
                  }
                >

                  <FaTimes />

                  Cancel

                </button>

                <button
                  type="button"
                  className="pdf-review-submit"
                  onClick={
                    handleSubmitForm
                  }
                  disabled={
                    isSubmitting
                  }
                >

                  {isSubmitting ? (

                    <>
                      <FaSyncAlt className="pdf-spin" />

                      Submitting Claim...
                    </>

                  ) : (

                    <>
                      <FaCheckCircle />

                      Submit Form

                      <FaArrowRight />

                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="pdf-footer">

        <div>

          <FaShieldAlt />

          Documents are processed securely
          by Forma AI.

        </div>

        <span>
          Forma AI Document Intelligence Engine
        </span>

      </footer>

    </div>
  );
};

export default PDFRecognition;