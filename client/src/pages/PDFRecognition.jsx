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
  FaBolt,
  FaBrain,
  FaMagic,
  FaFileAlt,
  FaFileInvoice,
  FaUser,
  FaCar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaSyncAlt,
  FaChevronRight,
  FaDatabase,
  FaClipboardCheck,
  FaLayerGroup,
} from "react-icons/fa";

import "./PDFRecognition.css";

const PDFRecognition = () => {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

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

  const handleProcess = () => {
    if (!selectedFile) {
      alert("Please upload a PDF first.");
      return;
    }

    setIsProcessing(true);
    setProcessed(false);
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2);
    }, 650);

    setTimeout(() => {
      setProcessingStep(3);
    }, 1300);

    setTimeout(() => {
      setProcessingStep(4);
    }, 1950);

    setTimeout(() => {
      setProcessingStep(5);
    }, 2600);

    setTimeout(() => {
      setIsProcessing(false);
      setProcessed(true);

      setExtractedData({
        documentType: "Vehicle Insurance Claim",
        policyNumber: "POL-2026-08421",
        applicant: "Chandra Mahesh",
        vehicle: "Honda City",
        incident: "Animal Collision",
        location: "NH-44",
        date: "15 September 2026",
        confidence: "98.4%",
      });
    }, 3300);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setProcessed(false);
    setIsProcessing(false);
    setProcessingStep(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const size = bytes / 1024;

    if (size < 1024) {
      return `${size.toFixed(1)} KB`;
    }

    return `${(size / 1024).toFixed(2)} MB`;
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
              Extract structured insurance intelligence from
              complex PDF documents automatically.
            </p>

          </div>

        </div>

        <div className="pdf-engine-status">

          <span></span>

          Forma AI Engine Online

        </div>

      </header>

      {/* =====================================================
          AI FEATURE BAR
      ====================================================== */}

      <section className="pdf-feature-bar">

        <div className="pdf-feature">

          <div className="pdf-feature-icon">
            <FaFileAlt />
          </div>

          <div>
            <strong>Document OCR</strong>
            <span>Advanced text recognition</span>
          </div>

        </div>

        <div className="pdf-feature-line"></div>

        <div className="pdf-feature">

          <div className="pdf-feature-icon">
            <FaBrain />
          </div>

          <div>
            <strong>AI Extraction</strong>
            <span>Intelligent field mapping</span>
          </div>

        </div>

        <div className="pdf-feature-line"></div>

        <div className="pdf-feature">

          <div className="pdf-feature-icon">
            <FaClipboardCheck />
          </div>

          <div>
            <strong>Validation</strong>
            <span>Automatic data verification</span>
          </div>

        </div>

        <div className="pdf-feature-line"></div>

        <div className="pdf-feature">

          <div className="pdf-feature-icon">
            <FaDatabase />
          </div>

          <div>
            <strong>Structured Output</strong>
            <span>Claim-ready information</span>
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
                Let Forma AI read, understand and structure
                your insurance document.
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
                Upload policy documents, claim forms,
                invoices or reports.
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
                      <span>AI</span>
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
                  Document ready for AI recognition
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

          {/* PROCESS */}

          <button
            type="button"
            className={`pdf-process-button ${
              isProcessing
                ? "pdf-processing"
                : ""
            }`}
            disabled={!selectedFile || isProcessing}
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

          {/* PROCESSING STEPS */}

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
                  <span>01</span>
                  PDF validation
                </div>

                <div
                  className={
                    processingStep >= 2
                      ? "pdf-step active"
                      : "pdf-step"
                  }
                >
                  <span>02</span>
                  OCR extraction
                </div>

                <div
                  className={
                    processingStep >= 3
                      ? "pdf-step active"
                      : "pdf-step"
                  }
                >
                  <span>03</span>
                  AI field mapping
                </div>

                <div
                  className={
                    processingStep >= 4
                      ? "pdf-step active"
                      : "pdf-step"
                  }
                >
                  <span>04</span>
                  Entity recognition
                </div>

                <div
                  className={
                    processingStep >= 5
                      ? "pdf-step active"
                      : "pdf-step"
                  }
                >
                  <span>05</span>
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
                AI-generated structured data from your PDF.
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
                Upload an insurance PDF and run the
                Forma AI recognition engine to extract
                structured information.
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
                    Document successfully understood
                  </h3>

                  <p>
                    Forma AI identified the document type,
                    policy information and claim entities.
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
                        {extractedData.documentType}
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
                        {extractedData.policyNumber}
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
                        {extractedData.applicant}
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
                        {extractedData.vehicle}
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
                        {extractedData.incident}
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
                        {extractedData.location}
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
                        {extractedData.date}
                      </strong>
                    </div>

                  </div>

                </div>

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
                    98.4%
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
                >
                  <FaDownload />
                  Export JSON
                </button>

                <button
                  type="button"
                  className="pdf-primary-button"
                >
                  <FaClipboardCheck />
                  Create Claim
                  <FaArrowRight />
                </button>

              </div>

            </div>

          )}

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="pdf-footer">

        <div>
          <FaShieldAlt />
          Documents are processed securely by Forma AI.
        </div>

        <span>
          Forma AI Document Intelligence Engine
        </span>

      </footer>

    </div>
  );
};

export default PDFRecognition;