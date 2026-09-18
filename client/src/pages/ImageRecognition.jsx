import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaRobot,
  FaImage,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTimes,
  FaSearchPlus,
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
  FaFilePdf,
  FaPaperPlane,
  FaExternalLinkAlt,
} from "react-icons/fa";

import "./ImageRecognition.css";

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = "http://localhost:5000/api";

const RECOGNITION_API =
  `${API_BASE_URL}/recognition/extract-image`;

const CLAIMS_API =
  `${API_BASE_URL}/claims`;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ============================================================
// DEFAULT DATA
// ============================================================

const defaultData = {
  insuranceCategory: "Not detected",
  documentType: "Not detected",

  insurerName: "Not detected",
  policyNumber: "Not detected",
  claimNumber: "Not detected",

  applicant: "Not detected",
  ownerName: "Not detected",
  policyHolder: "Not detected",

  vehicle: "Not detected",
  vehicleModel: "Not detected",
  engineNumber: "Not detected",
  chassisNumber: "Not detected",

  incident: "Not detected",
  damage: "Not analyzed",
  location: "Not detected",
  date: "Not detected",
};

// ============================================================
// IMAGE RECOGNITION
// ============================================================

const ImageRecognition = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ==========================================================
  // FILE STATES
  // ==========================================================

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // ==========================================================
  // PROCESSING STATES
  // ==========================================================

  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [zoom, setZoom] = useState(false);

  // ==========================================================
  // EXTRACTION STATES
  // ==========================================================

  const [confidence, setConfidence] = useState("0%");
  const [rawText, setRawText] = useState("");
  const [extractedData, setExtractedData] =
    useState(defaultData);

  // ==========================================================
  // SUBMISSION STATES
  // ==========================================================

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [claimId, setClaimId] = useState("");
  const [claimNumber, setClaimNumber] = useState("");

  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================================
  // CLEANUP PREVIEW
  // ==========================================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
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
  // NORMALIZE CATEGORY
  // ==========================================================

  const normalizeCategory = (category) => {
    const value = String(category || "")
      .trim()
      .toLowerCase();

    const allowedCategories = [
      "health",
      "vehicle",
      "property",
      "travel",
      "life",
    ];

    if (allowedCategories.includes(value)) {
      return value;
    }

    // Some Gemini responses may return these names.
    if (
      value.includes("car") ||
      value.includes("auto") ||
      value.includes("motor") ||
      value.includes("vehicle")
    ) {
      return "vehicle";
    }

    if (
      value.includes("medical") ||
      value.includes("health")
    ) {
      return "health";
    }

    if (value.includes("property")) {
      return "property";
    }

    if (value.includes("travel")) {
      return "travel";
    }

    if (value.includes("life")) {
      return "life";
    }

    return "";
  };

  // ==========================================================
  // HANDLE FILE
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

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Invalid file type.\n\nForma AI accepts only:\n" +
          "• JPG\n" +
          "• JPEG\n" +
          "• PNG\n" +
          "• WEBP"
      );

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert(
        "Image size is too large.\n\n" +
          "Maximum allowed size is 10 MB."
      );

      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl =
      URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);

    setProcessed(false);
    setProcessingStep(0);
    setIsProcessing(false);
    setZoom(false);

    setConfidence("0%");
    setRawText("");

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

    setSubmitted(false);

    setClaimId("");
    setClaimNumber("");
    setPdfUrl("");
    setPdfFileName("");

    setErrorMessage("");
    setSuccessMessage("");
  };

  // ==========================================================
  // FILE INPUT
  // ==========================================================

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  // ==========================================================
  // DRAG EVENTS
  // ==========================================================

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  // ==========================================================
  // OPEN FILE SELECTOR
  // ==========================================================

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  // ==========================================================
  // PROCESS IMAGE WITH GEMINI
  // ==========================================================

  const handleProcess = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedFile) {
      setErrorMessage(
        "Please upload an insurance image first."
      );

      return;
    }

    try {
      setIsProcessing(true);
      setProcessed(false);
      setProcessingStep(1);

      const formData = new FormData();

      // IMPORTANT:
      // Backend uses upload.single("document")
      formData.append(
        "document",
        selectedFile
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      setProcessingStep(2);

      const response = await fetch(
        RECOGNITION_API,
        {
          method: "POST",
          body: formData,
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Backend returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Recognition failed with HTTP ${response.status}.`
        );
      }

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Gemini Vision recognition failed."
        );
      }

      setProcessingStep(3);

      const data = result?.data || {};
      const resultData =
        result?.result || {};

      // ========================================================
      // NORMALIZE RESPONSE
      // ========================================================

      const normalizedData = {
        insuranceCategory:
          data.insuranceCategory ||
          resultData.insuranceCategory ||
          result.insuranceCategory ||
          data.category ||
          resultData.category ||
          result.category ||
          "Not Found",

        documentType:
          data.documentType ||
          resultData.documentType ||
          result.documentType ||
          "Insurance Document",

        insurerName:
          data.insurerName ||
          resultData.insurerName ||
          result.insurerName ||
          data.insuranceCompany ||
          resultData.insuranceCompany ||
          "Not Found",

        policyNumber:
          data.policyNumber ||
          resultData.policyNumber ||
          result.policyNumber ||
          data.insurer?.policyNumber ||
          "Not Found",

        claimNumber:
          data.claimNumber ||
          resultData.claimNumber ||
          result.claimNumber ||
          data.claim?.claimNumber ||
          "Not Found",

        applicant:
          data.applicantName ||
          resultData.applicantName ||
          result.applicantName ||
          data.applicant?.fullName ||
          resultData.applicant?.fullName ||
          data.policyHolder ||
          resultData.policyHolder ||
          data.ownerName ||
          resultData.ownerName ||
          "Not Found",

        ownerName:
          data.ownerName ||
          resultData.ownerName ||
          result.ownerName ||
          data.applicant?.fullName ||
          "Not Found",

        policyHolder:
          data.policyHolder ||
          resultData.policyHolder ||
          result.policyHolder ||
          data.applicant?.fullName ||
          resultData.applicant?.fullName ||
          "Not Found",

        vehicle:
          data.vehicleNumber ||
          resultData.vehicleNumber ||
          result.vehicleNumber ||
          data.registrationNumber ||
          resultData.registrationNumber ||
          data.vehicleRegistrationNumber ||
          resultData.vehicleRegistrationNumber ||
          data.vehicle?.registrationNumber ||
          resultData.vehicle?.registrationNumber ||
          "Not Found",

        vehicleModel:
          data.vehicleModel ||
          resultData.vehicleModel ||
          result.vehicleModel ||
          data.makeAndModel ||
          resultData.makeAndModel ||
          data.vehicle?.make ||
          resultData.vehicle?.make ||
          "Not Found",

        engineNumber:
          data.engineNumber ||
          resultData.engineNumber ||
          result.engineNumber ||
          "Not Found",

        chassisNumber:
          data.chassisNumber ||
          resultData.chassisNumber ||
          result.chassisNumber ||
          data.vehicle?.vin ||
          resultData.vehicle?.vin ||
          "Not Found",

        incident:
          data.incidentType ||
          resultData.incidentType ||
          result.incidentType ||
          data.incident ||
          resultData.incident ||
          data.claim?.claimType ||
          resultData.claim?.claimType ||
          "Not Found",

        damage:
          data.damageSummary ||
          resultData.damageSummary ||
          result.damageSummary ||
          data.damage ||
          resultData.damage ||
          data.vehicle?.damageDescription ||
          resultData.vehicle?.damageDescription ||
          "No visible damage detected",

        location:
          data.location ||
          resultData.location ||
          result.location ||
          data.incidentLocation ||
          resultData.incidentLocation ||
          "Not Found",

        date:
          data.incidentDate ||
          resultData.incidentDate ||
          result.incidentDate ||
          data.dateOfIncident ||
          resultData.dateOfIncident ||
          data.dates?.incidentDate ||
          resultData.dates?.incidentDate ||
          "Not Found",
      };

      setExtractedData(normalizedData);

      // ========================================================
      // RAW OCR TEXT
      // ========================================================

      setRawText(
        data.rawText ||
          resultData.rawText ||
          result.rawText ||
          data.ocrText ||
          resultData.ocrText ||
          result.ocrText ||
          ""
      );

      // ========================================================
      // CONFIDENCE
      // ========================================================

      setConfidence(
        formatConfidence(
          data.confidence ??
            resultData.confidence ??
            result.confidence ??
            98
        )
      );

      setProcessingStep(4);

      await new Promise((resolve) =>
        setTimeout(resolve, 400)
      );

      setProcessed(true);

      setSuccessMessage(
        "Insurance document analyzed successfully. Review the extracted information and submit the claim."
      );
    } catch (error) {
      console.error(
        "Forma AI Image Recognition Error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "AI image recognition failed."
      );

      setProcessingStep(0);
      setProcessed(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // ==========================================================
  // SUBMIT CLAIM
  //
  // FLOW:
  // 1. Create draft claim
  // 2. Submit claim
  // 3. Backend generates/stores PDF
  // 4. Navigate to submissions
  // ==========================================================

  const handleSubmitClaim = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!processed) {
      setErrorMessage(
        "Please analyze the image before submitting the claim."
      );

      return;
    }

    const category =
      normalizeCategory(
        extractedData.insuranceCategory
      );

    if (!category) {
      setErrorMessage(
        "Forma AI could not determine a valid insurance category. Please upload a clearer insurance document."
      );

      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      // ======================================================
      // PREPARE CLAIM DATA
      // ======================================================

      const claimData = {
        // Original normalized fields
        insuranceCategory:
          category,

        documentType:
          extractedData.documentType,

        insurerName:
          extractedData.insurerName,

        policyNumber:
          extractedData.policyNumber,

        claimNumber:
          extractedData.claimNumber,

        applicantName:
          extractedData.applicant,

        ownerName:
          extractedData.ownerName,

        policyHolder:
          extractedData.policyHolder,

        vehicleNumber:
          extractedData.vehicle,

        vehicleModel:
          extractedData.vehicleModel,

        engineNumber:
          extractedData.engineNumber,

        chassisNumber:
          extractedData.chassisNumber,

        incidentType:
          extractedData.incident,

        damageSummary:
          extractedData.damage,

        incidentLocation:
          extractedData.location,

        incidentDate:
          extractedData.date,

        // OCR
        rawText,

        // AI information
        aiConfidence:
          confidence,

        source:
          "Gemini Vision Image Recognition",

        sourceFile:
          selectedFile
            ? {
                name: selectedFile.name,
                type: selectedFile.type,
                size: selectedFile.size,
              }
            : null,
      };

      console.log(
        "========================================"
      );

      console.log(
        "FORMA AI - CREATING CLAIM"
      );

      console.log(
        "Category:",
        category
      );

      console.log(
        "Claim Data:",
        claimData
      );

      console.log(
        "========================================"
      );

      // ======================================================
      // STEP 1 - CREATE CLAIM
      // ======================================================

      const createResponse =
        await fetch(
          CLAIMS_API,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              category,
              claimData,
            }),
          }
        );

      let createResult;

      try {
        createResult =
          await createResponse.json();
      } catch {
        throw new Error(
          "Claim creation returned an invalid server response."
        );
      }

      if (!createResponse.ok) {
        throw new Error(
          createResult?.message ||
            createResult?.error ||
            `Claim creation failed with HTTP ${createResponse.status}.`
        );
      }

      const createdClaim =
        createResult?.claim ||
        createResult?.data ||
        createResult;

      const newClaimId =
        createdClaim?._id ||
        createdClaim?.id ||
        createResult?.claimId ||
        createResult?.data?._id;

      const newClaimNumber =
        createdClaim?.claimNumber ||
        createResult?.claimNumber ||
        "";

      if (!newClaimId) {
        throw new Error(
          "Claim was created but the backend did not return a claim ID."
        );
      }

      setClaimId(newClaimId);

      if (newClaimNumber) {
        setClaimNumber(
          newClaimNumber
        );
      }

      console.log(
        "✅ Claim created:",
        newClaimId
      );

      // ======================================================
      // STEP 2 - SUBMIT CLAIM
      // ======================================================

      const submitResponse =
        await fetch(
          `${CLAIMS_API}/${newClaimId}/submit`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      let submitResult;

      try {
        submitResult =
          await submitResponse.json();
      } catch {
        throw new Error(
          "Claim submission returned an invalid server response."
        );
      }

      if (!submitResponse.ok) {
        throw new Error(
          submitResult?.message ||
            submitResult?.error ||
            `Claim submission failed with HTTP ${submitResponse.status}.`
        );
      }

      const submittedClaim =
        submitResult?.claim ||
        submitResult?.data ||
        submitResult;

      // ======================================================
      // GET PDF URL
      // ======================================================

      const returnedPdfUrl =
        submittedClaim?.pdfUrl ||
        submitResult?.pdfUrl ||
        submitResult?.data?.pdfUrl ||
        "";

      const returnedFileName =
        submittedClaim?.fileName ||
        submitResult?.fileName ||
        submitResult?.data?.fileName ||
        "";

      if (returnedPdfUrl) {
        setPdfUrl(
          returnedPdfUrl
        );
      }

      if (returnedFileName) {
        setPdfFileName(
          returnedFileName
        );
      }

      setSubmitted(true);

      setSuccessMessage(
        `Claim ${
          newClaimNumber ||
          newClaimId
        } submitted successfully. PDF generated by the backend.`
      );

      console.log(
        "========================================"
      );

      console.log(
        "✅ CLAIM SUBMITTED"
      );

      console.log(
        "Claim ID:",
        newClaimId
      );

      console.log(
        "Claim Number:",
        newClaimNumber
      );

      console.log(
        "PDF URL:",
        returnedPdfUrl
      );

      console.log(
        "========================================"
      );

      // ======================================================
      // IMPORTANT:
      // Give backend a small moment to finish writing PDF,
      // then navigate to submissions.
      // ======================================================

      setTimeout(() => {
        navigate(
          "/submissions",
          {
            state: {
              submittedClaimId:
                newClaimId,

              submittedClaimNumber:
                newClaimNumber,

              pdfUrl:
                returnedPdfUrl,

              message:
                "Claim submitted successfully.",
            },
          }
        );
      }, 700);
    } catch (error) {
      console.error(
        "Forma AI Claim Submission Error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to submit the claim."
      );

      setSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================================
  // CLEAR IMAGE
  // ==========================================================

  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");

    setProcessed(false);
    setProcessingStep(0);
    setIsProcessing(false);
    setIsSubmitting(false);

    setZoom(false);

    setConfidence("0%");
    setRawText("");

    setExtractedData(
      defaultData
    );

    setSubmitted(false);

    setClaimId("");
    setClaimNumber("");
    setPdfUrl("");
    setPdfFileName("");

    setErrorMessage("");
    setSuccessMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  // ==========================================================
  // PDF URL
  // ==========================================================

  const getFullPdfUrl = () => {
    if (!pdfUrl) {
      return "";
    }

    if (
      pdfUrl.startsWith(
        "http://"
      ) ||
      pdfUrl.startsWith(
        "https://"
      )
    ) {
      return pdfUrl;
    }

    return `http://localhost:5000${pdfUrl}`;
  };

  // ==========================================================
  // OPEN PDF
  // ==========================================================

  const openPDF = () => {
    const url =
      getFullPdfUrl();

    if (!url) {
      setErrorMessage(
        "PDF is not available."
      );

      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================================
  // DOWNLOAD PDF
  // ==========================================================

  const downloadPDF = () => {
    const url =
      getFullPdfUrl();

    if (!url) {
      setErrorMessage(
        "PDF is not available yet."
      );

      return;
    }

    const anchor =
      document.createElement(
        "a"
      );

    anchor.href = url;

    anchor.download =
      pdfFileName ||
      `forma-ai-${claimNumber || claimId}.pdf`;

    anchor.target = "_blank";

    document.body.appendChild(
      anchor
    );

    anchor.click();

    document.body.removeChild(
      anchor
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="image-recognition-page">

      {/* ====================================================
          BACKGROUND
      ===================================================== */}

      <div className="ir-background-orb ir-orb-one"></div>
      <div className="ir-background-orb ir-orb-two"></div>
      <div className="ir-background-grid"></div>

      {/* ====================================================
          HEADER
      ===================================================== */}

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
              Upload an insurance document image and
              extract structured insurance information
              using Gemini Vision AI.
            </p>

          </div>

        </div>

        <div className="ir-header-status">

          <span className="ir-status-dot"></span>

          Gemini Vision Online

        </div>

      </header>

      {/* ====================================================
          CAPABILITY STRIP
      ===================================================== */}

      <section className="ir-capability-strip">

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

        <div className="ir-capability">

          <div className="ir-capability-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>
              Gemini Vision AI
            </strong>

            <span>
              Image + OCR + structured analysis.
            </span>
          </div>

        </div>

        <div className="ir-capability-divider"></div>

        <div className="ir-capability">

          <div className="ir-capability-icon">
            <FaBolt />
          </div>

          <div>
            <strong>
              Fast Processing
            </strong>

            <span>
              AI-powered insurance recognition.
            </span>
          </div>

        </div>

      </section>

      {/* ====================================================
          ERROR MESSAGE
      ===================================================== */}

      {errorMessage && (

        <div
          style={{
            margin:
              "20px auto 0",
            maxWidth:
              "1400px",
            padding:
              "14px 18px",
            borderRadius:
              "12px",
            background:
              "rgba(220, 38, 38, 0.08)",
            border:
              "1px solid rgba(220, 38, 38, 0.2)",
            color:
              "#dc2626",
            display:
              "flex",
            alignItems:
              "center",
            gap:
              "10px",
          }}
        >

          <FaTimes />

          <span>
            {errorMessage}
          </span>

        </div>

      )}

      {/* ====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {successMessage && (

        <div
          style={{
            margin:
              "20px auto 0",
            maxWidth:
              "1400px",
            padding:
              "14px 18px",
            borderRadius:
              "12px",
            background:
              "rgba(16, 185, 129, 0.08)",
            border:
              "1px solid rgba(16, 185, 129, 0.2)",
            color:
              "#059669",
            display:
              "flex",
            alignItems:
              "center",
            gap:
              "10px",
          }}
        >

          <FaCheckCircle />

          <span>
            {successMessage}
          </span>

        </div>

      )}

      {/* ====================================================
          MAIN WORKSPACE
      ===================================================== */}

      <main className="ir-workspace">

        {/* ==================================================
            LEFT PANEL
        =================================================== */}

        <section className="ir-upload-panel">

          <div className="ir-panel-heading">

            <div>

              <span className="ir-eyebrow">
                UPLOAD INSURANCE IMAGE
              </span>

              <h2>
                AI Image Recognition
              </h2>

              <p>
                Upload an insurance policy,
                claim document, RC, DL,
                Aadhaar, PAN or accident image.
              </p>

            </div>

            <div className="ir-secure-badge">

              <FaShieldAlt />

              Secure OCR

            </div>

          </div>

          {/* ==================================================
              DROPZONE
          =================================================== */}

          {!selectedFile ? (

            <div
              className={`ir-dropzone ${
                dragActive
                  ? "ir-dropzone-active"
                  : ""
              }`}
              onDragEnter={
                handleDragEnter
              }
              onDragOver={
                handleDragOver
              }
              onDragLeave={
                handleDragLeave
              }
              onDrop={
                handleDrop
              }
              onClick={
                openFileSelector
              }
            >

              <input
                ref={
                  fileInputRef
                }
                hidden
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={
                  handleInputChange
                }
              />

              <div className="ir-upload-animation">

                <div className="ir-upload-ring ring-one"></div>
                <div className="ir-upload-ring ring-two"></div>

                <div className="ir-upload-icon">
                  <FaCloudUploadAlt />
                </div>

              </div>

              <h3>
                Drop Insurance Image Here
              </h3>

              <p>
                Click or drag an insurance document
                image or accident photo here.
              </p>

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

              {/* Preview Header */}

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
                      {formatFileSize(
                        selectedFile.size
                      )}
                    </span>

                    <small>
                      {selectedFile.type}
                    </small>

                  </div>

                </div>

                <button
                  className="ir-remove-button"
                  onClick={
                    clearFile
                  }
                  type="button"
                >
                  <FaTimes />
                </button>

              </div>

              {/* Image */}

              <div className="ir-image-preview">

                {previewUrl && (

                  <img
                    src={previewUrl}
                    alt="Uploaded insurance document"
                    className={
                      zoom
                        ? "ir-image-zoomed"
                        : ""
                    }
                  />

                )}

                {previewUrl && (

                  <div className="ir-preview-overlay">

                    <button
                      type="button"
                      onClick={() =>
                        setZoom(
                          !zoom
                        )
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

              <div className="ir-preview-footer">

                <div className="ir-image-status">

                  <FaCheckCircle />

                  Ready for Gemini Vision OCR

                </div>

                <button
                  type="button"
                  className="ir-change-button"
                  onClick={
                    openFileSelector
                  }
                >
                  Change Image
                </button>

                <input
                  ref={
                    fileInputRef
                  }
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={
                    handleInputChange
                  }
                />

              </div>

            </div>

          )}

          {/* Validation */}

          {selectedFile && (

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap:
                  "8px",
                marginTop:
                  "12px",
                fontSize:
                  "12px",
                opacity:
                  0.75,
              }}
            >

              <FaCheckCircle />

              Image validated successfully •{" "}
              {formatFileSize(
                selectedFile.size
              )}

            </div>

          )}

          {/* ==================================================
              ANALYZE BUTTON
          =================================================== */}

          <button
            type="button"
            className={`ir-process-button ${
              isProcessing
                ? "ir-processing"
                : ""
            }`}
            disabled={
              !selectedFile ||
              isProcessing ||
              isSubmitting
            }
            onClick={
              handleProcess
            }
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

          {/* ==================================================
              PROCESSING STATUS
          =================================================== */}

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
                  margin:
                    "8px 0 18px",
                  fontSize:
                    "13px",
                  opacity:
                    0.7,
                }}
              >
                Gemini is analyzing the uploaded
                insurance image and extracting
                structured information.
              </p>

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
                  Reading Visible Text
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
                  AI Extracting Fields
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
                  Extraction Complete
                </div>

              </div>

            </div>

          )}

        </section>

        {/* ==================================================
            RIGHT PANEL
        =================================================== */}

        <section className="ir-results-panel">

          <div className="ir-panel-heading">

            <div>

              <span className="ir-eyebrow">
                AI OCR OUTPUT
              </span>

              <h2>
                Recognition Results
              </h2>

              <p>
                Review the extracted insurance
                information before submitting.
              </p>

            </div>

            {processed && (

              <div className="ir-confidence-badge">

                <FaCheckCircle />

                {formatConfidence(
                  confidence
                )}

                {" "}Confidence

              </div>

            )}

          </div>

          {/* ==================================================
              EMPTY STATE
          =================================================== */}

          {!processed ? (

            <div className="ir-empty-results">

              <div className="ir-empty-orbit">

                <div className="ir-orbit-ring"></div>

                <div className="ir-empty-icon">
                  <FaBrain />
                </div>

              </div>

              <h3>
                Waiting for AI Recognition
              </h3>

              <p>
                Upload an insurance image and click
                "Analyze with Forma AI" to extract
                insurance information.
              </p>

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

              {/* ==================================================
                  CONFIDENCE
              =================================================== */}

              <div className="ir-confidence-card">

                <div className="ir-confidence-main">

                  <div className="ir-confidence-circle">

                    <div>

                      <strong>
                        {formatConfidence(
                          confidence
                        )}
                      </strong>

                      <span>
                        AI Confidence
                      </span>

                    </div>

                  </div>

                  <div>

                    <span className="ir-confidence-label">
                      GEMINI OCR COMPLETE
                    </span>

                    <h3>
                      Insurance Image Successfully Processed
                    </h3>

                    <p>
                      Forma AI extracted structured
                      insurance information from the
                      uploaded image.
                    </p>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  CATEGORY
              =================================================== */}

              <div
                className="ir-category-highlight"
                style={{
                  marginTop:
                    "20px",
                  padding:
                    "22px",
                  borderRadius:
                    "18px",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  gap:
                    "20px",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap:
                      "15px",
                  }}
                >

                  <div
                    className="ir-data-icon"
                    style={{
                      width:
                        "52px",
                      height:
                        "52px",
                    }}
                  >
                    <FaShieldAlt />
                  </div>

                  <div>

                    <span
                      style={{
                        display:
                          "block",
                        fontSize:
                          "11px",
                        letterSpacing:
                          "1.5px",
                        fontWeight:
                          "700",
                        opacity:
                          0.65,
                      }}
                    >
                      DETECTED INSURANCE CATEGORY
                    </span>

                    <strong
                      style={{
                        display:
                          "block",
                        marginTop:
                          "5px",
                        fontSize:
                          "20px",
                      }}
                    >
                      {
                        extractedData.insuranceCategory
                      }
                    </strong>

                  </div>

                </div>

                <div
                  style={{
                    fontSize:
                      "12px",
                    opacity:
                      0.65,
                    textAlign:
                      "right",
                    maxWidth:
                      "260px",
                  }}
                >
                  Gemini Vision automatically
                  classified the insurance image.
                </div>

              </div>

              {/* ==================================================
                  EXTRACTED DATA
              =================================================== */}

              <div className="ir-data-section">

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

                <div className="ir-data-grid">

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
                        {
                          extractedData.documentType
                        }
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
                        {
                          extractedData.insurerName
                        }
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
                        {
                          extractedData.policyNumber
                        }
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
                        {
                          extractedData.claimNumber
                        }
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
                        {
                          extractedData.policyHolder
                        }
                      </strong>

                    </div>

                  </div>

                  {/* Applicant */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">
                      <FaUser />
                    </div>

                    <div>

                      <span>
                        Applicant Name
                      </span>

                      <strong>
                        {
                          extractedData.applicant
                        }
                      </strong>

                    </div>

                  </div>

                  {/* Owner */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">
                      <FaUser />
                    </div>

                    <div>

                      <span>
                        Owner Name
                      </span>

                      <strong>
                        {
                          extractedData.ownerName
                        }
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
                        {
                          extractedData.vehicle
                        }
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
                        {
                          extractedData.vehicleModel
                        }
                      </strong>

                    </div>

                  </div>

                  {/* Engine */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">
                      <FaCar />
                    </div>

                    <div>

                      <span>
                        Engine Number
                      </span>

                      <strong>
                        {
                          extractedData.engineNumber
                        }
                      </strong>

                    </div>

                  </div>

                  {/* Chassis */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">
                      <FaCar />
                    </div>

                    <div>

                      <span>
                        Chassis / VIN
                      </span>

                      <strong>
                        {
                          extractedData.chassisNumber
                        }
                      </strong>

                    </div>

                  </div>

                  {/* Incident */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">
                      <FaShieldAlt />
                    </div>

                    <div>

                      <span>
                        Incident Type
                      </span>

                      <strong>
                        {
                          extractedData.incident
                        }
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
                        {
                          extractedData.location
                        }
                      </strong>

                    </div>

                  </div>

                  {/* Date */}

                  <div className="ir-data-card">

                    <div className="ir-data-icon">
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

                  {/* Damage */}

                  <div className="ir-data-card ir-data-wide">

                    <div className="ir-data-icon">
                      <FaCar />
                    </div>

                    <div>

                      <span>
                        Damage Summary
                      </span>

                      <strong>
                        {
                          extractedData.damage
                        }
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  OCR TEXT
              =================================================== */}

              <div className="ir-detection-card">

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

                <textarea
                  className="ir-ocr-text"
                  value={
                    rawText ||
                    "No readable text was detected."
                  }
                  readOnly
                  rows={14}
                />

              </div>

              {/* ==================================================
                  DETECTED ELEMENTS
              =================================================== */}

              <div className="ir-detection-card">

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

                <div className="ir-detection-tags">

                  {extractedData.insuranceCategory &&
                    extractedData.insuranceCategory !==
                      "Not Found" && (

                    <span>
                      <FaCheckCircle />
                      Insurance Category
                    </span>

                  )}

                  {extractedData.documentType &&
                    extractedData.documentType !==
                      "Not Found" && (

                    <span>
                      <FaCheckCircle />
                      Document Type
                    </span>

                  )}

                  {extractedData.insurerName &&
                    extractedData.insurerName !==
                      "Not Found" && (

                    <span>
                      <FaCheckCircle />
                      Insurance Company
                    </span>

                  )}

                  {extractedData.policyNumber &&
                    extractedData.policyNumber !==
                      "Not Found" && (

                    <span>
                      <FaCheckCircle />
                      Policy Number
                    </span>

                  )}

                  {extractedData.claimNumber &&
                    extractedData.claimNumber !==
                      "Not Found" && (

                    <span>
                      <FaCheckCircle />
                      Claim Number
                    </span>

                  )}

                  {extractedData.policyHolder &&
                    extractedData.policyHolder !==
                      "Not Found" && (

                    <span>
                      <FaCheckCircle />
                      Policy Holder
                    </span>

                  )}

                  {extractedData.vehicle &&
                    extractedData.vehicle !==
                      "Not Found" && (

                    <span>
                      <FaCheckCircle />
                      Vehicle Number
                    </span>

                  )}

                  {extractedData.vehicleModel &&
                    extractedData.vehicleModel !==
                      "Not Found" && (

                    <span>
                      <FaCheckCircle />
                      Vehicle Model
                    </span>

                  )}

                  {extractedData.incident &&
                    extractedData.incident !==
                      "Not Found" && (

                    <span>
                      <FaCheckCircle />
                      Incident Detected
                    </span>

                  )}

                  {extractedData.damage &&
                    extractedData.damage !==
                      "Not Found" && (

                    <span>
                      <FaCheckCircle />
                      Damage Analysis
                    </span>

                  )}

                  {rawText && (

                    <span>
                      <FaCheckCircle />
                      OCR Text Extracted
                    </span>

                  )}

                </div>

              </div>

              {/* ==================================================
                  SUBMIT SECTION
              =================================================== */}

              {!submitted ? (

                <div
                  className="ir-detection-card"
                  style={{
                    marginTop:
                      "20px",
                  }}
                >

                  <div className="ir-detection-header">

                    <div>

                      <span>
                        CLAIM SUBMISSION
                      </span>

                      <h3>
                        Review Complete — Submit Form
                      </h3>

                    </div>

                    <FaPaperPlane />

                  </div>

                  <p
                    style={{
                      lineHeight:
                        "1.7",
                      fontSize:
                        "13px",
                      opacity:
                        0.75,
                    }}
                  >
                    Review the extracted information above.
                    When you click Submit Form, Forma AI
                    will create the claim in MongoDB,
                    submit it, generate the claim PDF and
                    make it available in the Submissions page.
                  </p>

                  {/* IMPORTANT SUBMIT BUTTON */}

                  <button
                    type="button"
                    className="ir-primary-action"
                    onClick={
                      handleSubmitClaim
                    }
                    disabled={
                      !processed ||
                      isSubmitting
                    }
                    style={{
                      width:
                        "100%",
                      justifyContent:
                        "center",
                      marginTop:
                        "18px",
                      minHeight:
                        "54px",
                      fontSize:
                        "15px",
                    }}
                  >

                    {isSubmitting ? (

                      <>
                        <FaSyncAlt className="ir-spin" />

                        Submitting Claim & Generating PDF...

                      </>

                    ) : (

                      <>
                        <FaPaperPlane />

                        Submit Form

                        <FaArrowRight />

                      </>

                    )}

                  </button>

                </div>

              ) : (

                <div
                  className="ir-detection-card"
                  style={{
                    marginTop:
                      "20px",
                  }}
                >

                  <div className="ir-detection-header">

                    <div>

                      <span>
                        CLAIM SUBMITTED
                      </span>

                      <h3>
                        Submission Completed Successfully
                      </h3>

                    </div>

                    <FaCheckCircle />

                  </div>

                  <div
                    style={{
                      display:
                        "grid",
                      gap:
                        "10px",
                      marginTop:
                        "16px",
                    }}
                  >

                    <div>
                      <strong>
                        Claim ID:
                      </strong>{" "}
                      {claimId}
                    </div>

                    {claimNumber && (

                      <div>
                        <strong>
                          Claim Number:
                        </strong>{" "}
                        {claimNumber}
                      </div>

                    )}

                    <div>
                      <strong>
                        Status:
                      </strong>{" "}
                      Submitted
                    </div>

                    <div>
                      <strong>
                        PDF:
                      </strong>{" "}
                      {pdfUrl
                        ? "Generated successfully"
                        : "Generated by backend"}
                    </div>

                  </div>

                  {/* PDF ACTIONS */}

                  {pdfUrl && (

                    <div
                      style={{
                        display:
                          "flex",
                        gap:
                          "12px",
                        flexWrap:
                          "wrap",
                        marginTop:
                          "20px",
                      }}
                    >

                      <button
                        type="button"
                        className="ir-secondary-action"
                        onClick={
                          openPDF
                        }
                      >

                        <FaExternalLinkAlt />

                        View PDF

                      </button>

                      <button
                        type="button"
                        className="ir-secondary-action"
                        onClick={
                          downloadPDF
                        }
                      >

                        <FaFilePdf />

                        Download PDF

                      </button>

                    </div>

                  )}

                  <button
                    type="button"
                    className="ir-primary-action"
                    onClick={() =>
                      navigate(
                        "/submissions"
                      )
                    }
                    style={{
                      width:
                        "100%",
                      justifyContent:
                        "center",
                      marginTop:
                        "18px",
                    }}
                  >

                    <FaFileAlt />

                    Go to Submissions

                    <FaArrowRight />

                  </button>

                </div>

              )}

              {/* ==================================================
                  SUCCESS
              =================================================== */}

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
                      Review the extracted information and
                      use the Submit Form button to create
                      the final insurance claim.
                    </span>

                  </div>

                </div>

              )}

            </div>

          )}

        </section>

      </main>

      {/* ====================================================
          FOOTER
      ===================================================== */}

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