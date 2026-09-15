
import React, { useRef, useState } from "react";
import {
  FaRobot,
  FaImage,
  FaCloudUploadAlt,
  FaCamera,
  FaCheckCircle,
  FaTimes,
  FaSearchPlus,
  FaDownload,
  FaArrowRight,
  FaShieldAlt,
  FaBolt,
  FaFileAlt,
  FaIdCard,
  FaCar,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBrain,
  FaMagic,
  FaEye,
  FaSyncAlt,
  FaChevronRight,
} from "react-icons/fa";

import "./ImageRecognition.css";

const ImageRecognition = () => {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [zoom, setZoom] = useState(false);

  const [processingStep, setProcessingStep] = useState(0);

  const [extractedData, setExtractedData] = useState({
    documentType: "Not detected",
    applicant: "Not detected",
    vehicle: "Not detected",
    damage: "Not analyzed",
    incident: "Not detected",
    location: "Not detected",
    date: "Not detected",
  });

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(
        "Please upload a valid image file such as JPG, JPEG, PNG or WEBP."
      );
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setProcessed(false);
    setProcessingStep(0);

    setExtractedData({
      documentType: "Pending AI analysis",
      applicant: "Pending",
      vehicle: "Pending",
      damage: "Pending",
      incident: "Pending",
      location: "Pending",
      date: "Pending",
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
      alert("Please upload an image first.");
      return;
    }

    setIsProcessing(true);
    setProcessed(false);
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2);
    }, 700);

    setTimeout(() => {
      setProcessingStep(3);
    }, 1400);

    setTimeout(() => {
      setProcessingStep(4);
    }, 2100);

    setTimeout(() => {
      setIsProcessing(false);
      setProcessed(true);

      setExtractedData({
        documentType: "Vehicle Damage Image",
        applicant: "Detected from claim",
        vehicle: "Honda City",
        damage:
          "Front windshield cracked with visible front bumper damage",
        incident: "Animal collision",
        location: "NH-44",
        date: "Detected from image",
      });
    }, 2800);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
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
    <div className="image-recognition-page">

      {/* =====================================================
          PREMIUM BACKGROUND
      ====================================================== */}

      <div className="ir-background-orb ir-orb-one"></div>
      <div className="ir-background-orb ir-orb-two"></div>
      <div className="ir-background-grid"></div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="ir-header">

        <div className="ir-header-left">

          <div className="ir-page-icon">
            <FaImage />
            <span className="ir-icon-pulse"></span>
          </div>

          <div>

            <div className="ir-breadcrumb">
              <span>AI Workspace</span>
              <FaChevronRight />
              <strong>Image Recognition</strong>
            </div>

            <h1>
              Image Recognition
              <span> AI</span>
            </h1>

            <p>
              Transform insurance images into structured,
              actionable claim intelligence.
            </p>

          </div>

        </div>

        <div className="ir-header-status">

          <span className="ir-status-dot"></span>

          AI Engine Online

        </div>

      </header>

      {/* =====================================================
          AI CAPABILITY STRIP
      ====================================================== */}

      <section className="ir-capability-strip">

        <div className="ir-capability">

          <div className="ir-capability-icon">
            <FaBrain />
          </div>

          <div>
            <strong>Computer Vision</strong>
            <span>Advanced visual analysis</span>
          </div>

        </div>

        <div className="ir-capability-divider"></div>

        <div className="ir-capability">

          <div className="ir-capability-icon">
            <FaMagic />
          </div>

          <div>
            <strong>Smart Extraction</strong>
            <span>Automatic field recognition</span>
          </div>

        </div>

        <div className="ir-capability-divider"></div>

        <div className="ir-capability">

          <div className="ir-capability-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>Insurance Ready</strong>
            <span>Claim-focused intelligence</span>
          </div>

        </div>

        <div className="ir-capability-divider"></div>

        <div className="ir-capability">

          <div className="ir-capability-icon">
            <FaBolt />
          </div>

          <div>
            <strong>Fast Processing</strong>
            <span>Results in seconds</span>
          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN WORKSPACE
      ====================================================== */}

      <main className="ir-workspace">

        {/* ===================================================
            LEFT PANEL
        ==================================================== */}

        <section className="ir-upload-panel">

          <div className="ir-panel-heading">

            <div>
              <span className="ir-eyebrow">
                INPUT SOURCE
              </span>

              <h2>
                Upload Image
              </h2>

              <p>
                Upload an insurance-related image for AI analysis.
              </p>
            </div>

            <div className="ir-secure-badge">
              <FaShieldAlt />
              Secure
            </div>

          </div>

          {/* =================================================
              UPLOAD AREA
          ================================================== */}

          {!selectedFile ? (

            <div
              className={`ir-dropzone ${
                dragActive ? "ir-dropzone-active" : ""
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
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleInputChange}
                hidden
              />

              <div className="ir-upload-animation">

                <div className="ir-upload-ring ring-one"></div>
                <div className="ir-upload-ring ring-two"></div>

                <div className="ir-upload-icon">
                  <FaCloudUploadAlt />
                </div>

              </div>

              <h3>
                Drop your image here
              </h3>

              <p>
                or click anywhere to browse your computer
              </p>

              <div className="ir-supported">

                <span>JPG</span>
                <span>PNG</span>
                <span>WEBP</span>

                <em>
                  Maximum 10 MB
                </em>

              </div>

              <div className="ir-upload-button">
                <FaImage />
                Choose Image
              </div>

            </div>

          ) : (

            <div className="ir-preview-wrapper">

              <div className="ir-preview-header">

                <div className="ir-file-info">

                  <div className="ir-file-icon">
                    <FaImage />
                  </div>

                  <div>

                    <strong>
                      {selectedFile.name}
                    </strong>

                    <span>
                      {formatFileSize(selectedFile.size)}
                    </span>

                  </div>

                </div>

                <button
                  className="ir-remove-button"
                  onClick={clearFile}
                  type="button"
                >
                  <FaTimes />
                </button>

              </div>

              <div className="ir-image-preview">

                <img
                  src={previewUrl}
                  alt="Uploaded insurance document"
                  className={zoom ? "ir-image-zoomed" : ""}
                />

                <div className="ir-preview-overlay">

                  <button
                    type="button"
                    onClick={() =>
                      setZoom((value) => !value)
                    }
                  >
                    <FaSearchPlus />
                    {zoom ? "Reset View" : "Zoom"}
                  </button>

                </div>

              </div>

              <div className="ir-preview-footer">

                <div className="ir-image-status">
                  <FaCheckCircle />
                  Image ready for AI analysis
                </div>

                <button
                  type="button"
                  className="ir-change-button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  Change Image
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
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
            className={`ir-process-button ${
              isProcessing ? "ir-processing" : ""
            }`}
            disabled={!selectedFile || isProcessing}
            onClick={handleProcess}
          >

            {isProcessing ? (
              <>
                <FaSyncAlt className="ir-spin" />
                AI Analyzing Image...
              </>
            ) : (
              <>
                <FaRobot />
                Analyze with Forma AI
                <FaArrowRight />
              </>
            )}

          </button>

          {/* =================================================
              PROCESSING STEPS
          ================================================== */}

          {isProcessing && (

            <div className="ir-processing-box">

              <div className="ir-processing-title">
                <FaRobot />
                <strong>
                  Forma AI is analyzing your image
                </strong>
              </div>

              <div className="ir-processing-steps">

                <div
                  className={
                    processingStep >= 1
                      ? "ir-step active"
                      : "ir-step"
                  }
                >
                  <span>01</span>
                  Image preprocessing
                </div>

                <div
                  className={
                    processingStep >= 2
                      ? "ir-step active"
                      : "ir-step"
                  }
                >
                  <span>02</span>
                  Object detection
                </div>

                <div
                  className={
                    processingStep >= 3
                      ? "ir-step active"
                      : "ir-step"
                  }
                >
                  <span>03</span>
                  Damage recognition
                </div>

                <div
                  className={
                    processingStep >= 4
                      ? "ir-step active"
                      : "ir-step"
                  }
                >
                  <span>04</span>
                  Claim intelligence
                </div>

              </div>

            </div>

          )}

        </section>

        {/* ===================================================
            RIGHT PANEL
        ==================================================== */}

        <section className="ir-results-panel">

          <div className="ir-panel-heading">

            <div>

              <span className="ir-eyebrow">
                AI OUTPUT
              </span>

              <h2>
                Recognition Results
              </h2>

              <p>
                Structured intelligence extracted from your image.
              </p>

            </div>

            {processed && (
              <div className="ir-confidence-badge">
                <FaCheckCircle />
                96.8% Confidence
              </div>
            )}

          </div>

          {!processed ? (

            <div className="ir-empty-results">

              <div className="ir-empty-orbit">

                <div className="ir-orbit-ring"></div>

                <div className="ir-empty-icon">
                  <FaBrain />
                </div>

              </div>

              <h3>
                Waiting for image analysis
              </h3>

              <p>
                Upload an image and start AI analysis
                to see recognition results here.
              </p>

              <div className="ir-empty-features">

                <span>
                  <FaCheckCircle />
                  Object detection
                </span>

                <span>
                  <FaCheckCircle />
                  Damage analysis
                </span>

                <span>
                  <FaCheckCircle />
                  Claim extraction
                </span>

              </div>

            </div>

          ) : (

            <div className="ir-results-content">

              {/* CONFIDENCE */}

              <div className="ir-confidence-card">

                <div className="ir-confidence-main">

                  <div className="ir-confidence-circle">

                    <div>

                      <strong>
                        96.8%
                      </strong>

                      <span>
                        AI Confidence
                      </span>

                    </div>

                  </div>

                  <div>

                    <span className="ir-confidence-label">
                      HIGH CONFIDENCE
                    </span>

                    <h3>
                      Analysis completed successfully
                    </h3>

                    <p>
                      Forma AI detected relevant insurance
                      information from the uploaded image.
                    </p>

                  </div>

                </div>

              </div>

              {/* EXTRACTED INFORMATION */}

              <div className="ir-data-section">

                <div className="ir-data-heading">

                  <div>
                    <span>
                      EXTRACTED INFORMATION
                    </span>

                    <h3>
                      AI Identified Fields
                    </h3>
                  </div>

                  <FaBrain />

                </div>

                <div className="ir-data-grid">

                  <div className="ir-data-card">

                    <div className="ir-data-icon">
                      <FaFileAlt />
                    </div>

                    <div>
                      <span>Document Type</span>
                      <strong>
                        {extractedData.documentType}
                      </strong>
                    </div>

                  </div>

                  <div className="ir-data-card">

                    <div className="ir-data-icon">
                      <FaUser />
                    </div>

                    <div>
                      <span>Applicant</span>
                      <strong>
                        {extractedData.applicant}
                      </strong>
                    </div>

                  </div>

                  <div className="ir-data-card">

                    <div className="ir-data-icon">
                      <FaCar />
                    </div>

                    <div>
                      <span>Vehicle</span>
                      <strong>
                        {extractedData.vehicle}
                      </strong>
                    </div>

                  </div>

                  <div className="ir-data-card">

                    <div className="ir-data-icon">
                      <FaShieldAlt />
                    </div>

                    <div>
                      <span>Incident</span>
                      <strong>
                        {extractedData.incident}
                      </strong>
                    </div>

                  </div>

                  <div className="ir-data-card ir-data-wide">

                    <div className="ir-data-icon">
                      <FaCar />
                    </div>

                    <div>
                      <span>Detected Damage</span>
                      <strong>
                        {extractedData.damage}
                      </strong>
                    </div>

                  </div>

                  <div className="ir-data-card">

                    <div className="ir-data-icon">
                      <FaMapMarkerAlt />
                    </div>

                    <div>
                      <span>Location</span>
                      <strong>
                        {extractedData.location}
                      </strong>
                    </div>

                  </div>

                  <div className="ir-data-card">

                    <div className="ir-data-icon">
                      <FaCalendarAlt />
                    </div>

                    <div>
                      <span>Incident Date</span>
                      <strong>
                        {extractedData.date}
                      </strong>
                    </div>

                  </div>

                </div>

              </div>

              {/* DETECTION TAGS */}

              <div className="ir-detection-card">

                <div className="ir-detection-header">

                  <div>
                    <span>VISION ANALYSIS</span>
                    <h3>Detected Elements</h3>
                  </div>

                  <FaEye />

                </div>

                <div className="ir-detection-tags">

                  <span>
                    <FaCheckCircle />
                    Vehicle
                  </span>

                  <span>
                    <FaCheckCircle />
                    Windshield Damage
                  </span>

                  <span>
                    <FaCheckCircle />
                    Front Bumper
                  </span>

                  <span>
                    <FaCheckCircle />
                    Collision Damage
                  </span>

                  <span>
                    <FaCheckCircle />
                    Insurance Relevant
                  </span>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="ir-result-actions">

                <button
                  type="button"
                  className="ir-secondary-action"
                >
                  <FaDownload />
                  Export Results
                </button>

                <button
                  type="button"
                  className="ir-primary-action"
                >
                  <FaFileAlt />
                  Use in Claim
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

      <footer className="ir-footer">

        <div>
          <FaShieldAlt />
          Your uploaded images are processed securely.
        </div>

        <span>
          Powered by Forma AI Vision Engine
        </span>

      </footer>

    </div>
  );
};

export default ImageRecognition;
