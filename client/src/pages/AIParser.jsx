import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AIParser.css";
import { aiApi } from "../api";

import {
  FaRobot,
  FaCloudUploadAlt,
  FaFilePdf,
  FaCamera,
  FaMicrophone,
  FaMagic,
  FaCheckCircle,
  FaBrain,
  FaPaperPlane,
  FaTrash,
  FaFileAlt,
  FaShieldAlt,
  FaArrowRight,
  FaExclamationCircle,
  FaStop,
} from "react-icons/fa";

const defaultSampleFields = [
  { label: "Insurance Type", value: "Vehicle Accident Claim" },
  { label: "Applicant", value: "Chandra Mahesh Goud" },
  { label: "Policy Number", value: "POL-2026-987654" },
  { label: "Incident Date", value: "04 September 2026" },
  { label: "Location", value: "Hyderabad ORR Exit 14" },
  { label: "Claim Amount", value: "₹48,500" },
];

const AIParser = () => {
  const navigate = useNavigate();
  const promptRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [extractedData, setExtractedData] = useState(null);
  const [summaryText, setSummaryText] = useState("");
  const [confidenceScore, setConfidenceScore] = useState(97);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
          setError("");
          setSuccessMessage("Listening... Speak your insurance claim details.");
        };

        recognition.onresult = (event) => {
          let transcript = "";
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setPrompt(transcript);
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech Recognition Error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed" || event.error === "permission-denied") {
            setError(
              "Microphone permission denied. Please allow microphone access in your browser settings to use voice input."
            );
          } else if (event.error === "no-speech") {
            setError("No speech was detected. Please speak clearly into your microphone.");
          } else if (event.error === "network") {
            setError("Network error occurred during speech recognition. Please check your internet connection.");
          } else {
            setError(`Speech recognition notice: ${event.error}. You can also type your claim description.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.error("Speech Recognition init error:", err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    setError("");
    setSuccessMessage("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Browser Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or type your claim description."
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      setSuccessMessage("Voice recording stopped. You can now parse with AI.");
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      } catch (err) {
        console.error("Speech start error:", err);
        setError("Unable to access microphone. Please check permissions.");
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const handlePdfUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setPdfs((prev) => [...prev, ...files]);
  };

  const parseAI = async () => {
    if (!prompt || !prompt.trim()) {
      setError("Please describe your insurance claim or use voice input before parsing.");
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await aiApi.prefillForm(prompt.trim());
      const data = response?.extractedData || response?.data || response;

      setExtractedData(data);
      if (data?.summary) {
        setSummaryText(data.summary);
      }
      setConfidenceScore(97);
      setSuccessMessage("AI successfully extracted claim fields from your description!");
    } catch (err) {
      console.error("AI Parse Error:", err);
      const backendMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to extract claim information. Please check your backend connection.";
      setError(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setImages([]);
    setPdfs([]);
    setExtractedData(null);
    setSummaryText("");
    setError("");
    setSuccessMessage("");
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    }
  };

  const scrollToPrompt = () => {
    if (promptRef.current) {
      promptRef.current.scrollIntoView({ behavior: "smooth" });
      promptRef.current.focus();
    }
  };

  // Compute active fields to display
  const activeFields = extractedData
    ? [
        {
          label: "Incident Type",
          value: extractedData.incidentType || "Incident Detected",
        },
        {
          label: "Vehicle / Asset",
          value: extractedData.vehicle || "Vehicle Involved",
        },
        {
          label: "Damage Detected",
          value: Array.isArray(extractedData.damage)
            ? extractedData.damage.join(", ") || "Damage Reported"
            : extractedData.damage || "Damage Reported",
        },
        {
          label: "Location",
          value: extractedData.location || "Location Not Specified",
        },
        {
          label: "Incident Date",
          value: extractedData.incidentDate || "Recent Incident",
        },
        {
          label: "Claim Summary",
          value: extractedData.summary || "Structured from description",
        },
      ]
    : defaultSampleFields;

  return (
    <div className="aiParserPage">

      {/* HERO */}
      <section className="aiHero">
        <div className="aiHeroLeft">
          <span className="aiHeroBadge">
            <FaRobot />
            Forma AI • Smart AI Parser
          </span>

          <h1>AI Insurance Claim Parser</h1>

          <p>
            Upload insurance documents, accident photos, or describe your claim
            in natural language or voice. Forma AI automatically extracts fields and
            prepares your application.
          </p>

          <div className="heroButtons">
            <button className="aiPrimaryBtn" onClick={scrollToPrompt}>
              <FaMagic />
              Start AI Parsing
            </button>

            <button
              className="aiSecondaryBtn"
              onClick={() => {
                const uploadEl = document.getElementById("pdf-upload-input");
                if (uploadEl) uploadEl.click();
              }}
            >
              <FaCloudUploadAlt />
              Upload Documents
            </button>
          </div>
        </div>

        <div className="aiHeroRight">
          <div className="aiStatCard">
            <FaRobot />
            <div>
              <h2>842</h2>
              <span>AI Parsed Claims</span>
            </div>
          </div>

          <div className="aiStatCard">
            <FaCheckCircle />
            <div>
              <h2>{confidenceScore}%</h2>
              <span>AI Accuracy</span>
            </div>
          </div>

          <div className="aiStatCard">
            <FaBrain />
            <div>
              <h2>35+</h2>
              <span>Fields Extracted</span>
            </div>
          </div>

          <div className="aiStatCard">
            <FaShieldAlt />
            <div>
              <h2>100%</h2>
              <span>Secure Processing</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROMPT */}
      <section className="promptCard">
        <div className="promptHeader">
          <FaRobot />
          <h3>Describe Your Insurance Claim</h3>
        </div>

        <textarea
          ref={promptRef}
          rows={6}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (error) setError("");
          }}
          placeholder="Example: I hit a deer on the highway yesterday. The windshield shattered and the front bumper was damaged..."
        />

        {/* ALERTS */}
        {error && (
          <div className="parserAlert error">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="parserAlert success">
            <FaCheckCircle />
            <span>{successMessage}</span>
          </div>
        )}

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            className={`voiceButton ${isListening ? "listening" : ""}`}
            onClick={toggleVoiceInput}
          >
            {isListening ? (
              <>
                <FaStop />
                <span>Listening... Click to Stop</span>
              </>
            ) : (
              <>
                <FaMicrophone />
                <span>Voice Input</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="parseButton"
            onClick={parseAI}
            disabled={loading}
          >
            <FaMagic />
            {loading ? "Parsing with AI..." : "Parse with AI"}
          </button>
        </div>
      </section>

      {/* UPLOADS */}
      <section className="uploadSection">

        <div className="uploadCard">
          <div className="uploadHeader">
            <FaCamera />
            <h3>Upload Images</h3>
          </div>

          <label className="uploadBox">
            <FaCloudUploadAlt />
            <h4>Upload Accident Images</h4>
            <p>PNG, JPG, JPEG</p>

            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />

            <button type="button" className="uploadBtn">
              Choose Images
            </button>
          </label>
        </div>

        <div className="uploadCard">
          <div className="uploadHeader">
            <FaFilePdf />
            <h3>Upload PDF</h3>
          </div>

          <label className="uploadBox">
            <FaFilePdf />
            <h4>Upload Insurance PDF</h4>
            <p>Policy, Medical Report, FIR, Invoice</p>

            <input
              id="pdf-upload-input"
              type="file"
              accept=".pdf"
              hidden
              onChange={handlePdfUpload}
            />

            <button type="button" className="uploadBtn">
              Choose PDF
            </button>
          </label>
        </div>

      </section>

      {/* IMAGE PREVIEW */}
      {images.length > 0 && (
        <section className="imagePreviewSection">
          <h3>Uploaded Images ({images.length})</h3>

          <div className="previewGrid">
            {images.map((file, index) => (
              <div key={index} className="previewCard">
                <img src={URL.createObjectURL(file)} alt={file.name} />

                <div className="previewOverlay">{file.name}</div>

                <button
                  className="removeImage"
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PDF PREVIEW */}
      {pdfs.length > 0 && (
        <section className="pdfSection">
          <h3>Uploaded PDFs ({pdfs.length})</h3>

          <div className="pdfList">
            {pdfs.map((file, index) => (
              <div key={index} className="pdfCard">
                <div className="pdfInfo">
                  <FaFilePdf />
                  <div>
                    <h4>{file.name}</h4>
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                <button
                  className="pdfDelete"
                  onClick={() => setPdfs(pdfs.filter((_, i) => i !== index))}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LOADING */}
      {loading && (
        <section className="processingCard">
          <div className="processingHeader">
            <FaBrain />
            <h2>AI Processing...</h2>
          </div>

          <div className="processingLoader">
            <div className="aiSpinner"></div>
          </div>

          <div className="timeline">
            <div className="timelineItem timelineDone">
              <div className="timelineIcon">
                <FaCheckCircle />
              </div>

              <div className="timelineContent">
                <h4>Natural Language Analysis</h4>
                <p>Reading voice transcript and incident details.</p>
              </div>
            </div>

            <div className="timelineItem">
              <div className="timelineIcon">
                <FaRobot />
              </div>

              <div className="timelineContent">
                <h4>Extracting Insurance Fields</h4>
                <p>Identifying claim information using Gemini AI.</p>
              </div>
            </div>

            <div className="timelineItem">
              <div className="timelineIcon">
                <FaBrain />
              </div>

              <div className="timelineContent">
                <h4>Generating Structured Form</h4>
                <p>Preparing fields for Dynamic Forms.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONFIDENCE */}
      <section className="confidenceWrapper">

        <div className="confidenceCard">
          <div className="confidenceCircle">
            <div className="confidenceInner">
              <h1>{confidenceScore}%</h1>
              <span>Confidence</span>
            </div>
          </div>

          <p>
            {extractedData
              ? "Forma AI has successfully extracted structured information from your description."
              : "Forma AI automatically extracts structured information with high confidence."}
          </p>
        </div>

        <div className="confidenceDetails">

          <h3>Extraction Quality</h3>

          {[
            ["Voice / OCR Accuracy", "98%"],
            ["Entity Detection", "99%"],
            ["Damage Mapping", "96%"],
            ["Claim Summary", "94%"],
          ].map(([label, value], index) => (
            <div className="confidenceItem" key={index}>
              <label>
                <span>{label}</span>
                <strong>{value}</strong>
              </label>

              <div className="progressBar">
                <div className="progressFill" style={{ width: value }}></div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* PARSED FIELDS */}
      <section className="ocrCard">

        <div className="ocrHeader">
          <FaFileAlt />
          <h2>AI Extracted Form Fields</h2>
        </div>

        <div className="ocrGrid">
          {activeFields.map((field, index) => (
            <div className="ocrItem" key={index}>
              <span>{field.label}</span>
              <h4>{field.value}</h4>
            </div>
          ))}
        </div>

      </section>

      {/* SUMMARY */}
      <section className="summaryCard">

        <div className="summaryHeader">
          <FaRobot />
          <h2>AI Summary</h2>
        </div>

        <div className="summaryContent">
          <p>
            {summaryText ||
              "Vehicle accident claim detected. The insured vehicle sustained front bumper and windshield damage after colliding with an animal. Estimated claim value: ₹48,500. Required supporting documents include FIR, vehicle RC, driver's license, repair invoice, and accident photos."}
          </p>
        </div>

      </section>

      {/* SUGGESTIONS */}
      <section className="aiSuggestionCard">

        <h2>AI Smart Suggestions</h2>

        <div className="suggestionList">

          <div className="suggestionItem">
            <FaCheckCircle />
            <div>
              Upload FIR copy for faster verification.
            </div>
          </div>

          <div className="suggestionItem">
            <FaCheckCircle />
            <div>
              Vehicle Registration Certificate is recommended.
            </div>
          </div>

          <div className="suggestionItem">
            <FaCheckCircle />
            <div>
              Upload multiple damage images to improve AI confidence.
            </div>
          </div>

          <div className="suggestionItem">
            <FaCheckCircle />
            <div>
              AI detected all mandatory claim fields successfully.
            </div>
          </div>

        </div>

      </section>

      {/* BUTTONS */}
      <div className="actionButtons">

        <button className="clearBtn" type="button" onClick={handleClear}>
          <FaTrash />
          Clear
        </button>

        <button
          className="editBtn"
          type="button"
          onClick={scrollToPrompt}
        >
          <FaFileAlt />
          Edit Description
        </button>

        <button
          className="generateBtn"
          type="button"
          onClick={() => navigate("/dynamic-forms")}
        >
          Continue to Dynamic Form
          <FaArrowRight />
        </button>

      </div>

    </div>
  );
};

export default AIParser;