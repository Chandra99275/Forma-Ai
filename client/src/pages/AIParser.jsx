import React, { useState } from "react";
import "./AIParser.css";

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
} from "react-icons/fa";

const AIParser = () => {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);

  const parsedFields = [
    { label: "Insurance Type", value: "Vehicle Accident Claim" },
    { label: "Applicant", value: "Chandra Mahesh Goud" },
    { label: "Policy Number", value: "POL-2026-987654" },
    { label: "Incident Date", value: "04 September 2026" },
    { label: "Location", value: "Hyderabad ORR Exit 14" },
    { label: "Claim Amount", value: "₹48,500" },
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  const handlePdfUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setPdfs(files);
  };

  const parseAI = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2500);
  };

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
            in natural language. Forma AI automatically extracts fields and
            prepares your application.
          </p>

          <div className="heroButtons">
            <button className="aiPrimaryBtn">
              <FaMagic />
              Start AI Parsing
            </button>

            <button className="aiSecondaryBtn">
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
              <h2>97%</h2>
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
          rows={6}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: I hit a deer on the highway yesterday. The windshield shattered and the front bumper was damaged..."
        />

        <button className="voiceButton">
          <FaMicrophone />
          Voice Input
        </button>

        <button className="parseButton" onClick={parseAI}>
          <FaMagic />
          Parse with AI
        </button>
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
          <h3>Uploaded Images</h3>

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
          <h3>Uploaded PDFs</h3>

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
                <h4>OCR Extraction</h4>
                <p>Reading uploaded documents.</p>
              </div>
            </div>

            <div className="timelineItem">
              <div className="timelineIcon">
                <FaRobot />
              </div>

              <div className="timelineContent">
                <h4>Extracting Insurance Fields</h4>
                <p>Identifying claim information using AI.</p>
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
              <h1>97%</h1>
              <span>Confidence</span>
            </div>
          </div>

          <p>
            Forma AI has successfully extracted structured information with
            high confidence.
          </p>
        </div>

        <div className="confidenceDetails">

          <h3>Extraction Quality</h3>

          {[
            ["OCR Accuracy", "98%"],
            ["Name Detection", "99%"],
            ["Policy Detection", "96%"],
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
          {parsedFields.map((field, index) => (
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
            Vehicle accident claim detected. The insured vehicle sustained front
            bumper and windshield damage after colliding with an animal.
            Estimated claim value: ₹48,500. Required supporting documents include
            FIR, vehicle RC, driver's license, repair invoice, and accident
            photos.
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

        <button className="clearBtn">
          <FaTrash />
          Clear
        </button>

        <button className="editBtn">
          <FaFileAlt />
          Edit Fields
        </button>

        <button className="generateBtn">
          Continue to Dynamic Form
          <FaArrowRight />
        </button>

      </div>

    </div>
  );
};

export default AIParser;