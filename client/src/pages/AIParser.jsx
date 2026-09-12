import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AIParser.css";

import {
  aiApi,
  createClaim,
  submitClaim as submitClaimAPI,
  uploadClaimDocuments,
} from "../services/api";

import {
  FaRobot,
  FaCloudUploadAlt,
  FaFilePdf,
  FaCamera,
  FaMicrophone,
  FaMagic,
  FaCheckCircle,
  FaBrain,
  FaTrash,
  FaShieldAlt,
  FaArrowRight,
  FaExclamationCircle,
  FaStop,
  FaExternalLinkAlt,
  FaDownload,
  FaEdit,
  FaLightbulb,
  FaFileAlt,
  FaChartLine,
  FaInfoCircle,
} from "react-icons/fa";

const SAMPLE_PROMPTS = [
  "My Honda City was rear-ended at a red light on I-95 on May 12. The rear bumper and trunk are severely damaged.",
  "Water pipe burst in the upstairs bathroom, causing ceiling leakage in the living room and damaging wooden furniture.",
  "Lost my luggage during a layover at JFK airport on flight AC102. Contains laptop and personal electronics.",
];

const AIParser = () => {
  const navigate = useNavigate();

  // ===================================================
  // STATE
  // ===================================================
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [summary, setSummary] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [claimId, setClaimId] = useState("");
  const [claimNumber, setClaimNumber] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [editingField, setEditingField] = useState(null);

  // ===================================================
  // IMAGE / PDF FILES
  // ===================================================
  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // ===================================================
  // VOICE
  // ===================================================
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log("Voice cleanup:", error);
        }
      }

      imagesRef.current.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  // ===================================================
  // IMAGE & PDF HANDLERS
  // ===================================================
  const handleImageUpload = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    const validImages = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    const imageObjects = validImages.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));

    setImages((prev) => [...prev, ...imageObjects]);
    setError("");
    event.target.value = "";
  };

  const handlePdfUpload = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    const validPDFs = selectedFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    const pdfObjects = validPDFs.map((file) => ({
      file,
      id: Date.now() + Math.random(),
    }));

    setPdfs((prev) => [...prev, ...pdfObjects]);
    setError("");
    event.target.value = "";
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const image = prev.find((item) => item.id === id);
      if (image?.preview) URL.revokeObjectURL(image.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  const removePdf = (id) => {
    setPdfs((prev) => prev.filter((item) => item.id !== id));
  };

  // ===================================================
  // VOICE CONTROL
  // ===================================================
  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      setError("Unable to capture voice input.");
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log("Voice stop:", error);
      }
    }
    setIsListening(false);
  };

  // ===================================================
  // AI PARSING & DATA EDITING
  // ===================================================
  const parseAI = async () => {
    setError("");
    setSuccessMessage("");

    if (!description.trim()) {
      setError("Please describe the incident before analyzing.");
      return;
    }

    try {
      setLoading(true);
      setExtractedData(null);
      setCategory("");
      setSummary("");
      setConfidence(0);
      setSubmitted(false);
      setClaimId("");
      setClaimNumber("");
      setPdfUrl("");
      setFileName("");

      const result = await aiApi.prefillForm(description.trim());

      if (!result?.success) {
        throw new Error(result?.message || "AI failed to analyze the incident.");
      }

      setCategory(result.category || "");
      setExtractedData(result.extractedData || result.claimData || {});
      setSummary(result.summary || "");
      setConfidence(Number(result.confidence || 0));

      if (result.claimNumber) setClaimNumber(result.claimNumber);
      if (result.pdfUrl) setPdfUrl(result.pdfUrl);
      if (result.fileName) setFileName(result.fileName);

      setSuccessMessage("AI successfully analyzed your incident.");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unable to analyze the incident.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldValueChange = (key, newValue) => {
    setExtractedData((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  // ===================================================
  // SUBMISSION
  // ===================================================
  const handleSubmitClaim = async () => {
    setError("");
    setSuccessMessage("");

    if (!extractedData) {
      setError("Please analyze the incident before submitting.");
      return;
    }

    if (!category) {
      setError("Insurance category was not detected.");
      return;
    }

    try {
      setLoading(true);

      const createResponse = await createClaim(extractedData, category);
      const createdClaim =
        createResponse?.claim || createResponse?.data || createResponse;

      const newClaimId =
        createdClaim?._id ||
        createdClaim?.id ||
        createResponse?.claimId ||
        createResponse?.data?._id ||
        createResponse?.data?.id;

      const newClaimNumber =
        createdClaim?.claimNumber ||
        createResponse?.claimNumber ||
        createResponse?.data?.claimNumber ||
        "";

      if (!newClaimId) {
        throw new Error("Claim was created but no ID was returned.");
      }

      setClaimId(newClaimId);
      if (newClaimNumber) setClaimNumber(newClaimNumber);

      const imageFiles = images.map((item) => item.file);
      const pdfFiles = pdfs.map((item) => item.file);
      const allDocuments = [...imageFiles, ...pdfFiles];

      if (allDocuments.length > 0) {
        try {
          await uploadClaimDocuments(newClaimId, allDocuments);
        } catch (uploadError) {
          throw new Error("Claim was created, but document upload failed.");
        }
      }

      const submitResponse = await submitClaimAPI(newClaimId);
      const submittedClaim =
        submitResponse?.claim || submitResponse?.data || submitResponse;

      const returnedPdfUrl =
        submittedClaim?.pdfUrl ||
        submitResponse?.pdfUrl ||
        submitResponse?.data?.pdfUrl;

      const returnedFileName =
        submittedClaim?.fileName ||
        submitResponse?.fileName ||
        submitResponse?.data?.fileName;

      if (returnedPdfUrl) setPdfUrl(returnedPdfUrl);
      if (returnedFileName) setFileName(returnedFileName);

      setSubmitted(true);
      setSuccessMessage(`Claim ${newClaimNumber || newClaimId} submitted successfully.`);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unable to submit claim.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    images.forEach((image) => {
      if (image.preview) URL.revokeObjectURL(image.preview);
    });

    setDescription("");
    setCategory("");
    setExtractedData(null);
    setSummary("");
    setConfidence(0);
    setLoading(false);
    setSubmitted(false);
    setError("");
    setSuccessMessage("");
    setClaimId("");
    setClaimNumber("");
    setPdfUrl("");
    setFileName("");
    setImages([]);
    setPdfs([]);
  };

  const getFullPdfUrl = () => {
    if (!pdfUrl) return "";
    if (pdfUrl.startsWith("http://") || pdfUrl.startsWith("https://")) return pdfUrl;
    return `http://localhost:5000${pdfUrl}`;
  };

  const openPDF = () => {
    const url = getFullPdfUrl();
    if (!url) {
      setError("PDF is not available yet.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const downloadPDF = () => {
    const url = getFullPdfUrl();
    if (!url) {
      setError("PDF is not available yet.");
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "forma-ai-claim.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFieldName = (field) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const getStepClass = (stepNum) => {
    if (submitted) return "forma-step forma-step-completed";
    if (stepNum === 1) return "forma-step forma-step-active";
    if (stepNum === 2 && extractedData) return "forma-step forma-step-active";
    if (stepNum === 2 && !extractedData) return "forma-step forma-step-completed";
    if (stepNum === 3 && extractedData) return "forma-step forma-step-active";
    return "forma-step";
  };

  return (
    <div className="forma-page-container">
      {/* HEADER SECTION */}
      <div className="forma-page-header">
        <div className="forma-header-brand-icon">
          <FaRobot />
        </div>
        <div className="forma-header-brand-details">
          <div className="forma-header-tag-row">
            <h1 className="forma-brand-title">Forma AI Assistant</h1>
            <span className="forma-badge-v2">Engine v2.4</span>
          </div>
          <p className="forma-brand-subtitle">
            Next-Generation Automated Claim Extraction & Structuring Engine
          </p>
        </div>
      </div>

      {/* WORKFLOW TRACKER STEPS */}
      <div className="forma-stepper-wrapper">
        <div className={getStepClass(1)}>
          <div className="forma-step-number">1</div>
          <div className="forma-step-info">
            <span className="forma-step-title">Describe Incident</span>
            <span className="forma-step-desc">Text, Voice or Media</span>
          </div>
        </div>
        <div className="forma-step-divider" />
        <div className={getStepClass(2)}>
          <div className="forma-step-number">2</div>
          <div className="forma-step-info">
            <span className="forma-step-title">AI Processing</span>
            <span className="forma-step-desc">Extract Key Entities</span>
          </div>
        </div>
        <div className="forma-step-divider" />
        <div className={getStepClass(3)}>
          <div className="forma-step-number">3</div>
          <div className="forma-step-info">
            <span className="forma-step-title">Submit & Generate</span>
            <span className="forma-step-desc">Create Claim & PDF</span>
          </div>
        </div>
      </div>

      {/* METRICS & QUICK SUMMARY RIBBON */}
      <div className="forma-metrics-ribbon">
        <div className="forma-metric-card">
          <div className="forma-metric-icon-box">
            <FaBrain />
          </div>
          <div>
            <div className="forma-metric-label">AI Status</div>
            <div className="forma-metric-value">
              {loading ? "Analyzing..." : extractedData ? "Processed" : "Ready"}
            </div>
          </div>
        </div>

        <div className="forma-metric-card">
          <div className="forma-metric-icon-box">
            <FaChartLine />
          </div>
          <div>
            <div className="forma-metric-label">Accuracy Score</div>
            <div className="forma-metric-value">
              {confidence ? `${Math.round(confidence * 100)}%` : "0%"}
            </div>
          </div>
        </div>

        <div className="forma-metric-card">
          <div className="forma-metric-icon-box">
            <FaFileAlt />
          </div>
          <div>
            <div className="forma-metric-label">Detected Type</div>
            <div className="forma-metric-value">
              {category ? category.toUpperCase() : "None"}
            </div>
          </div>
        </div>

        <div className="forma-metric-card">
          <div className="forma-metric-icon-box">
            <FaCloudUploadAlt />
          </div>
          <div>
            <div className="forma-metric-label">Files Attached</div>
            <div className="forma-metric-value">
              {images.length + pdfs.length} Document(s)
            </div>
          </div>
        </div>
      </div>

      {/* ERROR & SUCCESS ALERTS */}
      {error && (
        <div className="forma-alert-box forma-alert-error">
          <FaExclamationCircle className="forma-alert-icon" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="forma-alert-box forma-alert-success">
          <FaCheckCircle className="forma-alert-icon" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="forma-layout-grid">
        {/* LEFT COLUMN - INPUT & UPLOAD */}
        <div className="forma-grid-left">
          <div className="forma-card">
            <div className="forma-card-header">
              <div className="forma-card-title">
                <FaBrain className="forma-card-icon" />
                <div>
                  <h2 className="forma-card-heading">1. Describe Your Incident</h2>
                  <p className="forma-card-subheading">
                    Provide detail manually, using speech, or try a quick template.
                  </p>
                </div>
              </div>
            </div>

            {/* PRESET PROMPTS */}
            <div className="forma-samples-container">
              <div className="forma-samples-title">
                <FaLightbulb /> Quick Sample Prompts:
              </div>
              <div className="forma-samples-pills">
                {SAMPLE_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="forma-sample-pill"
                    onClick={() => setDescription(prompt)}
                  >
                    Template {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* TEXTAREA INPUT */}
            <div className="forma-input-field-wrapper">
              <textarea
                className="forma-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened, including dates, locations, vehicle details, damages, or affected parties..."
                rows={7}
                disabled={loading}
              />

              <div className="forma-textarea-footer-bar">
                <span className="forma-char-counter">
                  {description.length} characters typed
                </span>
                <button
                  type="button"
                  className={
                    isListening
                      ? "forma-voice-btn forma-voice-btn-active"
                      : "forma-voice-btn"
                  }
                  onClick={
                    isListening ? stopVoiceRecognition : startVoiceRecognition
                  }
                  disabled={loading}
                >
                  {isListening ? (
                    <>
                      <FaStop /> Stop Recording
                    </>
                  ) : (
                    <>
                      <FaMicrophone /> Voice Input
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* PARSE BUTTON */}
            <button
              type="button"
              className="forma-primary-action-btn"
              onClick={parseAI}
              disabled={loading || !description.trim()}
            >
              {loading ? (
                <>
                  <span className="forma-loader-spinner" /> Analyzing Incident...
                </>
              ) : (
                <>
                  <FaMagic /> Extract Data with Forma AI <FaArrowRight />
                </>
              )}
            </button>
          </div>

          {/* DOCUMENT ATTACHMENTS */}
          <div className="forma-card">
            <div className="forma-card-header">
              <div className="forma-card-title">
                <FaCloudUploadAlt className="forma-card-icon" />
                <div>
                  <h2 className="forma-card-heading">2. Attach Proof Documents</h2>
                  <p className="forma-card-subheading">
                    Upload photos, repair estimates, or police reports.
                  </p>
                </div>
              </div>
            </div>

            <div className="forma-upload-grid">
              <div
                className="forma-dropzone-tile"
                onClick={() => imageInputRef.current?.click()}
              >
                <FaCamera className="forma-dropzone-icon" />
                <h3 className="forma-dropzone-title">Upload Images</h3>
                <p className="forma-dropzone-desc">JPG, PNG, WEBP files</p>
                <span className="forma-dropzone-badge">{images.length} added</span>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
              </div>

              <div
                className="forma-dropzone-tile"
                onClick={() => pdfInputRef.current?.click()}
              >
                <FaFilePdf className="forma-dropzone-icon" />
                <h3 className="forma-dropzone-title">Upload Documents</h3>
                <p className="forma-dropzone-desc">PDF invoices or forms</p>
                <span className="forma-dropzone-badge">{pdfs.length} added</span>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  hidden
                  onChange={handlePdfUpload}
                />
              </div>
            </div>

            {/* IMAGE PREVIEWS */}
            {images.length > 0 && (
              <div className="forma-attachments-section">
                <h3 className="forma-section-label">Attached Images</h3>
                <div className="forma-media-thumbs-grid">
                  {images.map((image) => (
                    <div className="forma-media-thumb-card" key={image.id}>
                      <img
                        src={image.preview}
                        alt={image.file.name}
                        className="forma-media-thumb-img"
                      />
                      <button
                        type="button"
                        className="forma-thumb-remove-btn"
                        onClick={() => removeImage(image.id)}
                      >
                        <FaTrash />
                      </button>
                      <p className="forma-thumb-filename">{image.file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PDF PREVIEWS */}
            {pdfs.length > 0 && (
              <div className="forma-attachments-section">
                <h3 className="forma-section-label">Attached PDFs</h3>
                <div className="forma-pdf-list-container">
                  {pdfs.map((pdf) => (
                    <div className="forma-pdf-item-row" key={pdf.id}>
                      <FaFilePdf className="forma-pdf-item-icon" />
                      <div className="forma-pdf-item-details">
                        <strong className="forma-pdf-item-name">
                          {pdf.file.name}
                        </strong>
                        <span className="forma-pdf-item-size">
                          {(pdf.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        className="forma-pdf-remove-btn"
                        onClick={() => removePdf(pdf.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - RESULTS & SUBMISSION */}
        <div className="forma-grid-right">
          {/* HELPER CARD IF NO DATA */}
          {!extractedData && (
            <div className="forma-card forma-status-card">
              <div className="forma-status-avatar">
                <FaShieldAlt />
              </div>
              <div className="forma-status-info">
                <h3 className="forma-status-heading">Automated Entity Recognition</h3>
                <p className="forma-status-text">
                  Write down your claim story or select a sample prompt. Our natural
                  language engine will parse policy details, dates, financial limits,
                  and categories instantly.
                </p>
                <div className="forma-info-notice">
                  <FaInfoCircle /> Ready for immediate claim pre-filling.
                </div>
              </div>
            </div>
          )}

          {/* EXTRACTED INFORMATION CARD */}
          {extractedData && (
            <div className="forma-card">
              <div className="forma-card-header">
                <div className="forma-card-title">
                  <FaCheckCircle className="forma-card-icon forma-card-icon-success" />
                  <div>
                    <h2 className="forma-card-heading">Extracted Claim Fields</h2>
                    <p className="forma-card-subheading">
                      Review and click any field value to adjust before submitting.
                    </p>
                  </div>
                </div>
              </div>

              {/* CATEGORY & ACCURACY METRICS */}
              <div className="forma-category-pill-row">
                <span className="forma-category-pill-label">Detected Category</span>
                <strong className="forma-category-pill-tag">
                  {category
                    ? category.charAt(0).toUpperCase() + category.slice(1)
                    : "Uncategorized"}
                </strong>
              </div>

              <div className="forma-confidence-wrapper">
                <div className="forma-confidence-metrics">
                  <span>AI Data Confidence</span>
                  <strong>{Math.round(confidence * 100)}% Match</strong>
                </div>
                <div className="forma-confidence-track">
                  <div
                    className="forma-confidence-fill-bar"
                    style={{
                      width: `${Math.min(Math.max(confidence * 100, 0), 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* SUMMARY CALLOUT */}
              {summary && (
                <div className="forma-summary-callout">
                  <h3 className="forma-summary-title">Executive AI Summary</h3>
                  <p className="forma-summary-body">{summary}</p>
                </div>
              )}

              {/* EXTRACTED FIELDS LIST WITH EDITABLE INLINE INPUTS */}
              <div className="forma-fields-list-grid">
                {Object.entries(extractedData).map(([key, value]) => {
                  if (value === "" || value === null || value === undefined) {
                    return null;
                  }

                  const isEditing = editingField === key;

                  return (
                    <div className="forma-field-item-card" key={key}>
                      <div className="forma-field-header-row">
                        <span className="forma-field-label-text">
                          {formatFieldName(key)}
                        </span>
                        <button
                          type="button"
                          className="forma-field-edit-btn"
                          onClick={() => setEditingField(isEditing ? null : key)}
                        >
                          <FaEdit /> {isEditing ? "Save" : "Edit"}
                        </button>
                      </div>

                      {isEditing ? (
                        <input
                          type="text"
                          className="forma-field-input"
                          value={String(value)}
                          onChange={(e) =>
                            handleFieldValueChange(key, e.target.value)
                          }
                        />
                      ) : (
                        <strong className="forma-field-value-text">
                          {String(value)}
                        </strong>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* SUBMIT BUTTON / FINAL STATE */}
              {!submitted ? (
                <button
                  type="button"
                  className="forma-dark-submit-btn"
                  onClick={handleSubmitClaim}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="forma-loader-spinner" /> Generating Official
                      Claim...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Confirm & Submit Claim
                    </>
                  )}
                </button>
              ) : (
                <div className="forma-submission-success-pane">
                  <FaCheckCircle className="forma-success-pane-icon" />
                  <h3 className="forma-success-pane-title">
                    Claim Registered Successfully
                  </h3>

                  {claimNumber && (
                    <p className="forma-success-pane-meta">
                      Claim Reference Number: <strong>{claimNumber}</strong>
                    </p>
                  )}

                  {claimId && (
                    <p className="forma-success-pane-meta">
                      Internal System ID: <strong>{claimId}</strong>
                    </p>
                  )}

                  <div className="forma-success-button-group">
                    {pdfUrl && (
                      <>
                        <button
                          type="button"
                          className="forma-secondary-action-btn"
                          onClick={openPDF}
                        >
                          <FaExternalLinkAlt /> View PDF
                        </button>
                        <button
                          type="button"
                          className="forma-secondary-action-btn"
                          onClick={downloadPDF}
                        >
                          <FaDownload /> Download Document
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className="forma-secondary-action-btn"
                      onClick={handleClear}
                    >
                      New File
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIParser;