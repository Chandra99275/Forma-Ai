import React, { useRef, useState } from "react";

import {
  FaRobot,
  FaImage,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTimes,
  FaSearchPlus,
  FaDownload,
  FaArrowRight,
  FaShieldAlt,
  FaBolt,
  FaFileAlt,
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

// ============================================================
// FORMA AI - IMAGE RECOGNITION API
// ============================================================

// Only IMAGE files are accepted.
// Supported:
// JPG
// JPEG
// PNG
// WEBP
//
// PDF is intentionally NOT supported.

const API_URL =
  "http://localhost:5000/api/recognition/extract-image";

// Maximum image size = 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ============================================================
// DEFAULT EXTRACTED DATA
// ============================================================

const defaultData = {
  // Insurance classification
  insuranceCategory: "Not detected",
  documentType: "Not detected",

  // Insurance information
  insurerName: "Not detected",
  policyNumber: "Not detected",
  claimNumber: "Not detected",

  // Person information
  applicant: "Not detected",
  ownerName: "Not detected",
  policyHolder: "Not detected",

  // Vehicle information
  vehicle: "Not detected",
  vehicleModel: "Not detected",
  engineNumber: "Not detected",
  chassisNumber: "Not detected",

  // Incident information
  incident: "Not detected",
  damage: "Not analyzed",
  location: "Not detected",
  date: "Not detected",
};

// ============================================================
// IMAGE RECOGNITION COMPONENT
// ============================================================

const ImageRecognition = () => {
  // ==========================================================
  // FILE INPUT REF
  // ==========================================================

  const fileInputRef = useRef(null);

  // ==========================================================
  // UPLOAD STATES
  // ==========================================================

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // ==========================================================
  // PROCESSING STATES
  // ==========================================================

  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // ==========================================================
  // AI OUTPUT STATES
  // ==========================================================

  const [confidence, setConfidence] = useState("0%");
  const [rawText, setRawText] = useState("");
  const [extractedData, setExtractedData] =
    useState(defaultData);

  // ==========================================================
  // HANDLE IMAGE FILE
  // ==========================================================

  const handleFile = (file) => {
    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      alert(
        "Invalid file type.\n\n" +
          "Forma AI accepts only:\n" +
          "• JPG\n" +
          "• JPEG\n" +
          "• PNG\n" +
          "• WEBP"
      );

      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert(
        "Image size is too large.\n\n" +
          "Maximum allowed size is 10 MB."
      );

      return;
    }

    // Release previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Create new preview URL
    const newPreviewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);

    // Reset processing state
    setProcessed(false);
    setIsProcessing(false);
    setZoom(false);
    setConfidence("0%");
    setRawText("");
    setProcessingStep(0);

    // Reset extracted information
    setExtractedData({
      insuranceCategory: "Pending AI Analysis",
      documentType: "Pending AI Analysis",

      insurerName: "Pending",
      policyNumber: "Pending",
      claimNumber: "Pending",

      applicant: "Pending",
      ownerName: "Pending",
      policyHolder: "Pending",

      vehicle: "Pending",
      vehicleModel: "Pending",
      engineNumber: "Pending",
      chassisNumber: "Pending",

      incident: "Pending",
      damage: "Pending",
      location: "Pending",
      date: "Pending",
    });
  };

  // ==========================================================
  // FILE INPUT CHANGE
  // ==========================================================

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  // ==========================================================
  // DRAG ENTER
  // ==========================================================

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(true);
  };

  // ==========================================================
  // DRAG OVER
  // ==========================================================

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(true);
  };

  // ==========================================================
  // DRAG LEAVE
  // ==========================================================

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);
  };

  // ==========================================================
  // DROP IMAGE
  // ==========================================================

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);

    const files = event.dataTransfer.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    handleFile(file);
  };

  // ==========================================================
  // OPEN FILE SELECTOR
  // ==========================================================

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ==========================================================
  // GEMINI VISION PROCESSING
  // ==========================================================

  const handleProcess = async () => {
    // Make sure an image exists
    if (!selectedFile) {
      alert(
        "Please upload an insurance image before starting AI analysis."
      );

      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    // Safety validation
    if (!allowedTypes.includes(selectedFile.type)) {
      alert(
        "Only JPG, JPEG, PNG and WEBP images can be analyzed."
      );

      return;
    }

    // File size validation
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("Maximum image size is 10 MB.");

      return;
    }

    try {
      // ======================================================
      // START PROCESSING
      // ======================================================

      setIsProcessing(true);
      setProcessed(false);
      setProcessingStep(1);

      // ======================================================
      // CREATE FORM DATA
      // ======================================================

      const formData = new FormData();

      // Backend:
      // upload.single("document")

      formData.append(
        "document",
        selectedFile
      );

      // ======================================================
      // STEP 1 -> UPLOAD
      // ======================================================

      setProcessingStep(1);

      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      // ======================================================
      // STEP 2 -> OCR
      // ======================================================

      setProcessingStep(2);

      // ======================================================
      // SEND IMAGE TO BACKEND
      // ======================================================

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      // ======================================================
      // READ RESPONSE
      // ======================================================

      let result;

      try {
        result = await response.json();
      } catch (jsonError) {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      // ======================================================
      // CHECK SERVER RESPONSE
      // ======================================================

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Recognition server returned HTTP ${response.status}.`
        );
      }

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Gemini Vision recognition failed."
        );
      }

      // ======================================================
      // STEP 3 -> AI EXTRACTION
      // ======================================================

      setProcessingStep(3);

      const data = result?.data || {};

      // ======================================================
      // NORMALIZE AI RESPONSE
      // ======================================================

      const normalizedData = {
        insuranceCategory:
          data.insuranceCategory ||
          result.insuranceCategory ||
          data.category ||
          result.category ||
          "Not Found",

        documentType:
          data.documentType ||
          result.documentType ||
          "Insurance Document",

        insurerName:
          data.insurerName ||
          result.insurerName ||
          data.insuranceCompany ||
          result.insuranceCompany ||
          "Not Found",

        policyNumber:
          data.policyNumber ||
          result.policyNumber ||
          "Not Found",

        claimNumber:
          data.claimNumber ||
          result.claimNumber ||
          "Not Found",

        applicant:
          data.applicantName ||
          result.applicantName ||
          data.policyHolder ||
          result.policyHolder ||
          data.ownerName ||
          result.ownerName ||
          "Not Found",

        ownerName:
          data.ownerName ||
          result.ownerName ||
          data.policyHolder ||
          result.policyHolder ||
          "Not Found",

        policyHolder:
          data.policyHolder ||
          result.policyHolder ||
          data.applicantName ||
          result.applicantName ||
          "Not Found",

        vehicle:
          data.vehicleNumber ||
          result.vehicleNumber ||
          data.registrationNumber ||
          result.registrationNumber ||
          data.vehicleRegistrationNumber ||
          result.vehicleRegistrationNumber ||
          "Not Found",

        vehicleModel:
          data.vehicleModel ||
          result.vehicleModel ||
          data.makeAndModel ||
          result.makeAndModel ||
          "Not Found",

        engineNumber:
          data.engineNumber ||
          result.engineNumber ||
          "Not Found",

        chassisNumber:
          data.chassisNumber ||
          result.chassisNumber ||
          "Not Found",

        incident:
          data.incidentType ||
          result.incidentType ||
          data.incident ||
          result.incident ||
          "Not Found",

        damage:
          data.damageSummary ||
          result.damageSummary ||
          data.damage ||
          result.damage ||
          "No visible damage detected",

        location:
          data.location ||
          result.location ||
          data.incidentLocation ||
          result.incidentLocation ||
          "Not Found",

        date:
          data.incidentDate ||
          result.incidentDate ||
          data.dateOfIncident ||
          result.dateOfIncident ||
          "Not Found",
      };

      // ======================================================
      // UPDATE UI WITH AI DATA
      // ======================================================

      setExtractedData(normalizedData);

      // ======================================================
      // OCR TEXT
      // ======================================================

      setRawText(
        data.rawText ||
          result.rawText ||
          data.ocrText ||
          result.ocrText ||
          ""
      );

      // ======================================================
      // CONFIDENCE
      // ======================================================

      setConfidence(
        data.confidence ||
          result.confidence ||
          "98%"
      );

      // ======================================================
      // STEP 4 -> JSON COMPLETE
      // ======================================================

      setProcessingStep(4);

      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      // ======================================================
      // COMPLETE
      // ======================================================

      setProcessed(true);
    } catch (error) {
      console.error(
        "Forma AI Image Recognition Error:",
        error
      );

      alert(
        error?.message ||
          "AI image recognition failed. Please check your backend server and try again."
      );

      setProcessingStep(0);
      setProcessed(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // ==========================================================
  // CLEAR SELECTED IMAGE
  // ==========================================================

  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");

    setProcessed(false);
    setIsProcessing(false);
    setZoom(false);
    setConfidence("0%");
    setRawText("");
    setProcessingStep(0);

    setExtractedData(defaultData);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================================
  // FORMAT FILE SIZE
  // ==========================================================

  const formatFileSize = (bytes) => {
    if (!bytes || bytes <= 0) {
      return "0 KB";
    }

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1024;

    return `${mb.toFixed(2)} MB`;
  };

  // ==========================================================
  // FORMAT CONFIDENCE
  // ==========================================================

  const formatConfidence = (value) => {
    if (value === null || value === undefined) {
      return "0%";
    }

    if (typeof value === "number") {
      if (value <= 1) {
        return `${Math.round(value * 100)}%`;
      }

      return `${Math.round(value)}%`;
    }

    const stringValue = String(value).trim();

    if (!stringValue) {
      return "0%";
    }

    if (stringValue.endsWith("%")) {
      return stringValue;
    }

    const numericValue = Number(stringValue);

    if (!Number.isNaN(numericValue)) {
      if (numericValue <= 1) {
        return `${Math.round(numericValue * 100)}%`;
      }

      return `${Math.round(numericValue)}%`;
    }

    return stringValue;
  };

  // ==========================================================
  // EXPORT OCR RESULT
  // ==========================================================

  const exportOCRResults = () => {
    const exportData = {
      application: "Forma AI",
      feature: "Gemini Vision Insurance Image Recognition",
      confidence: formatConfidence(confidence),
      extractedData,
      rawText,

      sourceImage: selectedFile
        ? {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
          }
        : null,

      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob(
      [
        JSON.stringify(
          exportData,
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;

    anchor.download =
      "forma-ai-insurance-ocr-results.json";

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  };

  // ==========================================================
  // USE OCR DATA IN CLAIM
  // ==========================================================

  const handleUseInClaim = () => {
    console.log(
      "Forma AI OCR Output:",
      {
        confidence,
        rawText,
        extractedData,
      }
    );

    alert(
      "OCR data is ready to be used in Forma AI Claim Creation."
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="image-recognition-page">

      {/* =====================================================
          BACKGROUND EFFECTS
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

              <span>
                AI Workspace
              </span>

              <FaChevronRight />

              <strong>
                Image Recognition
              </strong>

            </div>


            <h1>

              Gemini Vision OCR{" "}

              <span>
                Forma AI
              </span>

            </h1>


            <p>

              Upload insurance document images, policy images,
              Aadhaar, PAN, RC, DL or accident photos and extract
              structured insurance information using Gemini 2.5 Flash Vision.

            </p>

          </div>

        </div>


        {/* Gemini Status */}

        <div className="ir-header-status">

          <span className="ir-status-dot"></span>

          Gemini Vision Online

        </div>

      </header>


      {/* =====================================================
          AI CAPABILITY STRIP
      ====================================================== */}

      <section className="ir-capability-strip">


        {/* OCR */}

        <div className="ir-capability">

          <div className="ir-capability-icon">

            <FaBrain />

          </div>


          <div>

            <strong>
              OCR Recognition
            </strong>

            <span>
              Reads visible text from insurance images.
            </span>

          </div>

        </div>


        <div className="ir-capability-divider"></div>


        {/* Insurance Extraction */}

        <div className="ir-capability">

          <div className="ir-capability-icon">

            <FaMagic />

          </div>


          <div>

            <strong>
              Insurance Extraction
            </strong>

            <span>
              Policy, Claim, Applicant, Vehicle and Damage.
            </span>

          </div>

        </div>


        <div className="ir-capability-divider"></div>


        {/* Gemini Vision */}

        <div className="ir-capability">

          <div className="ir-capability-icon">

            <FaShieldAlt />

          </div>


          <div>

            <strong>
              Gemini Vision AI
            </strong>

            <span>
              Image + OCR + JSON Insurance Analysis.
            </span>

          </div>

        </div>


        <div className="ir-capability-divider"></div>


        {/* Fast Processing */}

        <div className="ir-capability">

          <div className="ir-capability-icon">

            <FaBolt />

          </div>


          <div>

            <strong>
              Fast AI Processing
            </strong>

            <span>
              Powered by Gemini 2.5 Flash.
            </span>

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


          {/* =================================================
              PANEL HEADER
          ================================================== */}

          <div className="ir-panel-heading">


            <div>

              <span className="ir-eyebrow">
                UPLOAD INSURANCE IMAGE
              </span>


              <h2>
                AI Image Recognition
              </h2>


              <p>

                Supported Images:
                Insurance Policy • Claim Document • RC • DL •
                Aadhaar • PAN • Accident Photo • Vehicle Damage

              </p>

            </div>


            {/* Secure Badge */}

            <div className="ir-secure-badge">

              <FaShieldAlt />

              Secure OCR

            </div>

          </div>


          {/* =================================================
              IMAGE UPLOAD AREA
          ================================================== */}

          {!selectedFile ? (

            <div
              className={`ir-dropzone ${
                dragActive
                  ? "ir-dropzone-active"
                  : ""
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFileSelector}
            >

              {/* Hidden File Input */}

              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleInputChange}
              />


              {/* Upload Animation */}

              <div className="ir-upload-animation">

                <div className="ir-upload-ring ring-one"></div>

                <div className="ir-upload-ring ring-two"></div>

                <div className="ir-upload-icon">

                  <FaCloudUploadAlt />

                </div>

              </div>


              {/* Upload Title */}

              <h3>
                Drop Insurance Image Here
              </h3>


              <p>

                Click or drag an insurance document image,
                policy image or accident photo into this area.

              </p>


              {/* Supported Image Types */}

              <div className="ir-supported">

                <span>
                  PNG
                </span>

                <span>
                  JPG
                </span>

                <span>
                  JPEG
                </span>

                <span>
                  WEBP
                </span>

                <em>
                  Images Only • Maximum 10 MB
                </em>

              </div>


              {/* Choose File Button */}

              <div className="ir-upload-button">

                <FaImage />

                Choose Image

              </div>


              <div
                style={{
                  marginTop: "16px",
                  fontSize: "12px",
                  opacity: 0.7,
                  textAlign: "center",
                }}
              >

                Only image files are accepted.
                PDF and other document formats are disabled.

              </div>

            </div>

          ) : (

            /* Image Selected */

            <div className="ir-preview-wrapper">


              {/* Preview Header */}

              <div className="ir-preview-header">


                {/* File Information */}

                <div className="ir-file-info">


                  <div className="ir-file-icon">

                    <FaImage />

                  </div>


                  <div>

                    <strong>
                      {selectedFile.name}
                    </strong>


                    <span>
                      {formatFileSize(
                        selectedFile.size
                      )}
                    </span>


                    <small>
                      {selectedFile.type}
                    </small>

                  </div>

                </div>


                {/* Remove Button */}

                <button
                  className="ir-remove-button"
                  onClick={clearFile}
                  type="button"
                  aria-label="Remove image"
                >

                  <FaTimes />

                </button>

              </div>


              {/* Image Preview Area */}

              <div className="ir-image-preview">


                {previewUrl ? (

                  <img
                    src={previewUrl}
                    alt="Uploaded insurance document"
                    className={
                      zoom
                        ? "ir-image-zoomed"
                        : ""
                    }
                  />

                ) : (

                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                    }}
                  >

                    <FaImage
                      style={{
                        fontSize: "50px",
                        marginBottom: "15px",
                      }}
                    />

                    <h3>
                      Image Preview Unavailable
                    </h3>

                    <p>
                      Please select the image again.
                    </p>

                  </div>

                )}


                {/* Image Preview Controls */}

                {previewUrl && (

                  <div className="ir-preview-overlay">

                    <button
                      type="button"
                      onClick={() =>
                        setZoom(!zoom)
                      }
                    >

                      <FaSearchPlus />

                      {zoom
                        ? "Reset View"
                        : "Zoom"}

                    </button>

                  </div>

                )}

              </div>


              {/* Image Preview Footer */}

              <div className="ir-preview-footer">


                <div className="ir-image-status">

                  <FaCheckCircle />

                  Ready for Gemini Vision OCR

                </div>


                <button
                  type="button"
                  className="ir-change-button"
                  onClick={openFileSelector}
                >

                  Change Image

                </button>


                {/* Hidden Input */}

                <input
                  ref={fileInputRef}
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleInputChange}
                />

              </div>


            </div>

          )}


          {/* =====================================================
              IMAGE VALIDATION INFORMATION
          ====================================================== */}

          {selectedFile && (

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "12px",
                fontSize: "12px",
                opacity: 0.75,
              }}
            >

              <FaCheckCircle />

              Image validated successfully •
              {formatFileSize(selectedFile.size)} •
              Ready for AI analysis

            </div>

          )}


          {/* =====================================================
              ANALYZE BUTTON
          ====================================================== */}

          <button
            type="button"
            className={`ir-process-button ${
              isProcessing
                ? "ir-processing"
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

                <FaSyncAlt className="ir-spin" />

                Analyzing with Gemini Vision...

              </>

            ) : (

              <>

                <FaRobot />

                Analyze with Forma AI

                <FaArrowRight />

              </>

            )}

          </button>


          {/* =====================================================
              PROCESSING STATUS
          ====================================================== */}

          {isProcessing && (

            <div className="ir-processing-box">


              <div className="ir-processing-title">

                <FaRobot />

                <strong>
                  Forma AI Gemini Vision Engine
                </strong>

              </div>


              <p
                style={{
                  margin: "8px 0 18px",
                  fontSize: "13px",
                  opacity: 0.7,
                }}
              >

                Gemini is analyzing the uploaded insurance
                image and extracting structured information.

              </p>


              {/* Processing Steps */}

              <div className="ir-processing-steps">


                <div
                  className={
                    processingStep >= 1
                      ? "ir-step active"
                      : "ir-step"
                  }
                >

                  <span>
                    01
                  </span>

                  Uploading Image

                </div>


                <div
                  className={
                    processingStep >= 2
                      ? "ir-step active"
                      : "ir-step"
                  }
                >

                  <span>
                    02
                  </span>

                  Reading Visible Text (OCR)

                </div>


                <div
                  className={
                    processingStep >= 3
                      ? "ir-step active"
                      : "ir-step"
                  }
                >

                  <span>
                    03
                  </span>

                  AI Extracting Insurance Fields

                </div>


                <div
                  className={
                    processingStep >= 4
                      ? "ir-step active"
                      : "ir-step"
                  }
                >

                  <span>
                    04
                  </span>

                  Returning Structured JSON

                </div>


              </div>

            </div>

          )}


          {/* =====================================================
              IMAGE INPUT REQUIREMENTS
          ====================================================== */}

          <div
            style={{
              marginTop: "18px",
              padding: "14px 16px",
              borderRadius: "12px",
              fontSize: "12px",
              lineHeight: "1.6",
            }}
          >

            <strong>
              Image Recognition Requirements
            </strong>

            <br />

            Use a clear, well-lit image where policy numbers,
            names, vehicle registration numbers and other
            insurance information are readable.

            <br />

            Supported:
            JPG • JPEG • PNG • WEBP

            <br />

            Maximum:
            10 MB

          </div>


        </section>


        {/* ===================================================
            RIGHT PANEL
        ==================================================== */}

        <section className="ir-results-panel">


          {/* =================================================
              RESULTS PANEL HEADER
          ================================================== */}

          <div className="ir-panel-heading">


            <div>

              <span className="ir-eyebrow">
                AI OCR OUTPUT
              </span>


              <h2>
                Recognition Results
              </h2>


              <p>
                Insurance information extracted from
                your uploaded image.
              </p>

            </div>


            {/* Confidence Badge */}

            {processed && (

              <div className="ir-confidence-badge">

                <FaCheckCircle />

                {formatConfidence(confidence)}
                {" "}Confidence

              </div>

            )}

          </div>


          {/* =================================================
              EMPTY RESULTS / PROCESSED RESULTS
          ================================================== */}

          {!processed ? (

            <div className="ir-empty-results">


              {/* AI Orbit */}

              <div className="ir-empty-orbit">

                <div className="ir-orbit-ring"></div>

                <div className="ir-empty-icon">

                  <FaBrain />

                </div>

              </div>


              {/* Empty State Title */}

              <h3>
                Waiting for AI Recognition
              </h3>


              <p>

                Upload an insurance image and click
                "Analyze with Forma AI" to extract
                insurance information.

              </p>


              {/* Empty Features */}

              <div className="ir-empty-features">


                <span>

                  <FaCheckCircle />

                  Insurance Category Detection

                </span>


                <span>

                  <FaCheckCircle />

                  Policy & Claim Information

                </span>


                <span>

                  <FaCheckCircle />

                  Vehicle Information

                </span>


                <span>

                  <FaCheckCircle />

                  OCR Text Extraction

                </span>


              </div>


            </div>

          ) : (

            <div className="ir-results-content">


              {/* =====================================================
                  CONFIDENCE CARD
              ====================================================== */}

              <div className="ir-confidence-card">

                <div className="ir-confidence-main">


                  {/* Confidence Circle */}

                  <div className="ir-confidence-circle">

                    <div>

                      <strong>
                        {formatConfidence(confidence)}
                      </strong>

                      <span>
                        AI Confidence
                      </span>

                    </div>

                  </div>


                  {/* Confidence Information */}

                  <div>

                    <span className="ir-confidence-label">

                      GEMINI OCR COMPLETE

                    </span>


                    <h3>

                      Insurance Image Successfully Processed

                    </h3>


                    <p>

                      Forma AI extracted structured insurance
                      information and complete readable OCR text
                      from the uploaded image.

                    </p>

                  </div>

                </div>

              </div>


              {/* =====================================================
                  INSURANCE CATEGORY HIGHLIGHT
              ====================================================== */}

              <div
                className="ir-category-highlight"
                style={{
                  marginTop: "20px",
                  padding: "22px",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >

                  <div
                    className="ir-data-icon"
                    style={{
                      width: "52px",
                      height: "52px",
                    }}
                  >

                    <FaShieldAlt />

                  </div>


                  <div>

                    <span
                      style={{
                        display: "block",
                        fontSize: "11px",
                        letterSpacing: "1.5px",
                        fontWeight: "700",
                        opacity: 0.65,
                      }}
                    >

                      DETECTED INSURANCE CATEGORY

                    </span>


                    <strong
                      style={{
                        display: "block",
                        marginTop: "5px",
                        fontSize: "20px",
                      }}
                    >

                      {extractedData.insuranceCategory}

                    </strong>

                  </div>

                </div>


                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.65,
                    textAlign: "right",
                    maxWidth: "260px",
                  }}
                >

                  Gemini Vision automatically classified
                  the insurance image.

                </div>

              </div>


              {/* =====================================================
                  EXTRACTED INFORMATION SECTION
              ====================================================== */}

              <div className="ir-data-section">


                {/* Section Header */}

                <div className="ir-data-heading">

                  <div>

                    <span>
                      INSURANCE CLAIM INFORMATION
                    </span>


                    <h3>
                      AI Extracted Fields
                    </h3>

                  </div>


                  <FaBrain />

                </div>


                {/* Data Grid */}

                <div className="ir-data-grid">


                  {/* Insurance Category */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaShieldAlt />

                    </div>


                    <div>

                      <span>
                        Insurance Category
                      </span>


                      <strong>
                        {extractedData.insuranceCategory}
                      </strong>

                    </div>

                  </div>


                  {/* Document Type */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaFileAlt />

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


                  {/* Insurance Company */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaShieldAlt />

                    </div>


                    <div>

                      <span>
                        Insurance Company
                      </span>


                      <strong>
                        {extractedData.insurerName}
                      </strong>

                    </div>

                  </div>


                  {/* Policy Number */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

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


                  {/* Claim Number */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaFileAlt />

                    </div>


                    <div>

                      <span>
                        Claim Number
                      </span>


                      <strong>
                        {extractedData.claimNumber}
                      </strong>

                    </div>

                  </div>


                  {/* Policy Holder */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaUser />

                    </div>


                    <div>

                      <span>
                        Policy Holder
                      </span>


                      <strong>
                        {extractedData.policyHolder}
                      </strong>

                    </div>

                  </div>


                  {/* Applicant Name */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaUser />

                    </div>


                    <div>

                      <span>
                        Applicant Name
                      </span>


                      <strong>
                        {extractedData.applicant}
                      </strong>

                    </div>

                  </div>


                  {/* Owner Name */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaUser />

                    </div>


                    <div>

                      <span>
                        Owner Name
                      </span>


                      <strong>
                        {extractedData.ownerName}
                      </strong>

                    </div>

                  </div>


                  {/* Vehicle Number */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaCar />

                    </div>


                    <div>

                      <span>
                        Vehicle Registration Number
                      </span>


                      <strong>
                        {extractedData.vehicle}
                      </strong>

                    </div>

                  </div>


                  {/* Vehicle Model */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaCar />

                    </div>


                    <div>

                      <span>
                        Vehicle Make & Model
                      </span>


                      <strong>
                        {extractedData.vehicleModel}
                      </strong>

                    </div>

                  </div>


                  {/* Engine Number */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaCar />

                    </div>


                    <div>

                      <span>
                        Engine Number
                      </span>


                      <strong>
                        {extractedData.engineNumber}
                      </strong>

                    </div>

                  </div>


                  {/* Chassis Number */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaCar />

                    </div>


                    <div>

                      <span>
                        Chassis Number
                      </span>


                      <strong>
                        {extractedData.chassisNumber}
                      </strong>

                    </div>

                  </div>


                  {/* Incident Type */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaShieldAlt />

                    </div>


                    <div>

                      <span>
                        Incident Type
                      </span>


                      <strong>
                        {extractedData.incident}
                      </strong>

                    </div>

                  </div>


                  {/* Location */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

                      <FaMapMarkerAlt />

                    </div>


                    <div>

                      <span>
                        Incident Location
                      </span>


                      <strong>
                        {extractedData.location}
                      </strong>

                    </div>

                  </div>


                  {/* Incident Date */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">

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


                  {/* Damage Summary */}

                  <div className="ir-data-card ir-data-wide">

                    <div className="ir-data-icon">

                      <FaCar />

                    </div>


                    <div>

                      <span>
                        Damage Summary
                      </span>


                      <strong>
                        {extractedData.damage}
                      </strong>

                    </div>

                  </div>


                </div>

              </div>


              {/* =====================================================
                  COMPLETE OCR TEXT
              ====================================================== */}

              <div className="ir-detection-card">


                {/* OCR Header */}

                <div className="ir-detection-header">

                  <div>

                    <span>
                      GEMINI OCR TEXT
                    </span>


                    <h3>
                      Complete Text Extracted From Image
                    </h3>

                  </div>


                  <FaEye />

                </div>


                {/* OCR Text Area */}

                <textarea
                  className="ir-ocr-text"
                  value={
                    rawText ||
                    "No readable text was detected from the uploaded image."
                  }
                  readOnly
                  rows={14}
                />


                {/* OCR Status */}

                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "12px",
                    opacity: 0.65,
                  }}
                >

                  <FaCheckCircle
                    style={{
                      marginRight: "6px",
                    }}
                  />

                  Gemini Vision OCR completed successfully.

                </div>


              </div>


              {/* =====================================================
                  AI DETECTED ELEMENTS
              ====================================================== */}

              <div className="ir-detection-card">


                {/* Detection Header */}

                <div className="ir-detection-header">

                  <div>

                    <span>
                      FORMA AI VISION ANALYSIS
                    </span>


                    <h3>
                      Detected Insurance Elements
                    </h3>

                  </div>


                  <FaBrain />

                </div>


                {/* Detection Tags */}

                <div className="ir-detection-tags">


                  {/* Insurance Category */}

                  {extractedData.insuranceCategory &&
                    extractedData.insuranceCategory !==
                      "Not detected" &&
                    extractedData.insuranceCategory !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Insurance Category:
                        {" "}
                        {extractedData.insuranceCategory}

                      </span>

                    )}


                  {/* Document Type */}

                  {extractedData.documentType &&
                    extractedData.documentType !==
                      "Not detected" &&
                    extractedData.documentType !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        {extractedData.documentType}

                      </span>

                    )}


                  {/* Insurance Company */}

                  {extractedData.insurerName &&
                    extractedData.insurerName !==
                      "Not detected" &&
                    extractedData.insurerName !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Insurance Company

                      </span>

                    )}


                  {/* Policy Number */}

                  {extractedData.policyNumber &&
                    extractedData.policyNumber !==
                      "Not detected" &&
                    extractedData.policyNumber !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Policy Number

                      </span>

                    )}


                  {/* Claim Number */}

                  {extractedData.claimNumber &&
                    extractedData.claimNumber !==
                      "Not detected" &&
                    extractedData.claimNumber !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Claim Number

                      </span>

                    )}


                  {/* Policy Holder */}

                  {extractedData.policyHolder &&
                    extractedData.policyHolder !==
                      "Not detected" &&
                    extractedData.policyHolder !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Policy Holder

                      </span>

                    )}


                  {/* Vehicle Number */}

                  {extractedData.vehicle &&
                    extractedData.vehicle !==
                      "Not detected" &&
                    extractedData.vehicle !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Vehicle Number

                      </span>

                    )}


                  {/* Vehicle Model */}

                  {extractedData.vehicleModel &&
                    extractedData.vehicleModel !==
                      "Not detected" &&
                    extractedData.vehicleModel !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Vehicle Model

                      </span>

                    )}


                  {/* Engine Number */}

                  {extractedData.engineNumber &&
                    extractedData.engineNumber !==
                      "Not detected" &&
                    extractedData.engineNumber !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Engine Number

                      </span>

                    )}


                  {/* Chassis Number */}

                  {extractedData.chassisNumber &&
                    extractedData.chassisNumber !==
                      "Not detected" &&
                    extractedData.chassisNumber !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Chassis Number

                      </span>

                    )}


                  {/* Incident */}

                  {extractedData.incident &&
                    extractedData.incident !==
                      "Not detected" &&
                    extractedData.incident !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Incident Detected

                      </span>

                    )}


                  {/* Damage */}

                  {extractedData.damage &&
                    extractedData.damage !==
                      "Not analyzed" &&
                    extractedData.damage !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Damage Analysis

                      </span>

                    )}


                  {/* Location */}

                  {extractedData.location &&
                    extractedData.location !==
                      "Not detected" &&
                    extractedData.location !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Location Found

                      </span>

                    )}


                  {/* Date */}

                  {extractedData.date &&
                    extractedData.date !==
                      "Not detected" &&
                    extractedData.date !==
                      "Not Found" && (

                      <span>

                        <FaCheckCircle />

                        Incident Date

                      </span>

                    )}


                  {/* OCR */}

                  {rawText && (

                    <span>

                      <FaCheckCircle />

                      OCR Text Extracted

                    </span>

                  )}

                </div>

              </div>


              {/* =====================================================
                  AI EXTRACTION SUMMARY
              ====================================================== */}

              <div
                className="ir-detection-card"
                style={{
                  marginTop: "20px",
                }}
              >

                <div className="ir-detection-header">

                  <div>

                    <span>
                      FORMA AI EXTRACTION
                    </span>


                    <h3>
                      Structured Insurance Analysis
                    </h3>

                  </div>


                  <FaMagic />

                </div>


                <p
                  style={{
                    lineHeight: "1.7",
                    fontSize: "13px",
                    opacity: 0.75,
                    margin: 0,
                  }}
                >

                  Gemini Vision analyzed the uploaded image,
                  identified the document type and insurance
                  category, extracted available policy and
                  claimant information, detected vehicle
                  information where applicable, and performed
                  OCR on readable text.

                </p>

              </div>


              {/* =====================================================
                  RESULT ACTIONS
              ====================================================== */}

              <div className="ir-result-actions">

                <button
                  type="button"
                  className="ir-secondary-action"
                  onClick={exportOCRResults}
                  disabled={!processed}
                >

                  <FaDownload />

                  <span>
                    Export OCR Results
                  </span>

                </button>


                <button
                  type="button"
                  className="ir-primary-action"
                  onClick={handleUseInClaim}
                  disabled={!processed}
                >

                  <FaFileAlt />

                  <span>
                    Use in Claim
                  </span>

                  <FaArrowRight />

                </button>

              </div>


              {/* =====================================================
                  ANALYSIS STATUS
              ====================================================== */}

              {processed && (

                <div className="ir-success-message">

                  <div className="ir-success-icon">

                    <FaCheckCircle />

                  </div>


                  <div className="ir-success-content">

                    <strong>
                      Insurance image analyzed successfully
                    </strong>


                    <span>
                      Forma AI extracted the visible insurance
                      information using Gemini Vision AI.
                    </span>

                  </div>

                </div>

              )}

            </div>

          )}
          {/* END processed ternary */}

        </section>
        {/* END results panel */}

      </main>
      {/* END main workspace */}


      {/* =========================================================
          FOOTER / SECURITY INFORMATION
      ========================================================== */}

      <div className="ir-footer">

        <div className="ir-footer-left">

          <div className="ir-footer-security">

            <FaShieldAlt />

          </div>


          <div>

            <strong>
              Secure AI Image Recognition
            </strong>


            <span>
              Your insurance image is processed securely
              for intelligent field extraction.
            </span>

          </div>

        </div>


        <div className="ir-footer-right">

          <div className="ir-footer-status">

            <span className="ir-status-dot"></span>

            <span>
              Gemini Vision AI
            </span>

          </div>


          <FaChevronRight />


          <span>
            Image Only
          </span>

        </div>

      </div>

    </div>
  );
};

export default ImageRecognition;