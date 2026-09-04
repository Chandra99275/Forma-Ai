import React, { useState } from "react";
import {
  FaRobot,
  FaMagic,
  FaCamera,
  FaFilePdf,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTrash,
  FaImage,
  FaFileAlt,
  FaBrain,
} from "react-icons/fa";

const AIUploader = ({ mode }) => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  const [confidence] = useState(98);

  const [extractedData] = useState({
    applicant: "Chandra Mahesh Goud",
    insuranceType: "Vehicle Accident Insurance",
    vehicle: "Honda City 2025",
    location: "Hyderabad ORR Exit 14",
    date: "04 Sept 2026",
    damage: "Windshield Broken, Front Bumper Damaged",
  });

  /* =========================
        IMAGE UPLOAD
  ========================= */

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const previewImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...previewImages]);
  };

  /* =========================
        PDF UPLOAD
  ========================= */

  const handlePDFUpload = (e) => {
    const files = Array.from(e.target.files);
    setPdfs((prev) => [...prev, ...files]);
  };

  /* =========================
        REMOVE IMAGE
  ========================= */

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  /* =========================
        REMOVE PDF
  ========================= */

  const removePDF = (index) => {
    const newPDFs = [...pdfs];
    newPDFs.splice(index, 1);
    setPdfs(newPDFs);
  };

  return (
    <div className="aiUploaderContainer">

      {/* ======================================
            AI DESCRIPTION CARD
      ====================================== */}

      {(mode === "ai" || mode === "manual") && (
        <div className="aiCard">

          <div className="cardTitle">
            <FaRobot />
            <h2>AI Auto Fill Assistant</h2>
          </div>

          <p>
            Describe your insurance incident in natural language.
            Forma AI will automatically extract policy details,
            location, dates, damages, medical information,
            and claim type.
          </p>

          <textarea
            rows="8"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example:
I hit a deer yesterday while driving my Honda City on ORR Hyderabad.
The windshield shattered, front bumper was damaged and I visited Apollo Hospital for treatment..."
          />

          <button className="aiGenerateBtn">
            <FaMagic />
            Generate Smart Form
          </button>

        </div>
      )}

      {/* ======================================
            IMAGE OCR UPLOAD
      ====================================== */}

      {(mode === "image" || mode === "manual") && (
        <div className="uploadCard">

          <div className="cardTitle">
            <FaCamera />
            <h2>Upload Images (OCR Enabled)</h2>
          </div>

          <p>
            Upload accident photos, prescriptions,
            hospital bills, RC, Driving License,
            Aadhaar or damaged property images.
          </p>

          <label className="uploadBox">

            <FaCloudUploadAlt className="uploadIcon"/>

            <h3>Drag Images Here</h3>

            <p>PNG • JPG • JPEG • WEBP</p>

            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageUpload}
            />

            <button>Select Images</button>

          </label>

          {/* Preview Images */}

          {images.length > 0 && (
            <div className="previewGrid">

              {images.map((img, index) => (
                <div className="previewCard" key={index}>

                  <img src={img.preview} alt="preview"/>

                  <button onClick={() => removeImage(index)}>
                    <FaTrash />
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>
      )}

      {/* ======================================
            PDF UPLOAD
      ====================================== */}

      {(mode === "pdf" || mode === "manual") && (
        <div className="uploadCard">

          <div className="cardTitle">
            <FaFilePdf />
            <h2>Upload PDF Documents</h2>
          </div>

          <p>
            Upload FIR, Insurance Policy, Hospital Bills,
            Medical Reports, Boarding Pass, Passport,
            Death Certificate and Claim Documents.
          </p>

          <label className="uploadBox">

            <FaFilePdf className="uploadIcon"/>

            <h3>Drag PDF Files Here</h3>

            <p>Maximum 20 MB</p>

            <input
              type="file"
              accept=".pdf"
              multiple
              hidden
              onChange={handlePDFUpload}
            />

            <button>Select PDF Files</button>

          </label>

          {pdfs.length > 0 && (
            <div className="pdfList">

              {pdfs.map((pdf, index) => (

                <div className="pdfCard" key={index}>

                  <div className="pdfInfo">

                    <FaFileAlt className="pdfIcon"/>

                    <div>
                      <h4>{pdf.name}</h4>
                      <span>{(pdf.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>

                  </div>

                  <button onClick={() => removePDF(index)}>
                    <FaTrash />
                  </button>

                </div>

              ))}

            </div>
          )}

        </div>
      )}

      {/* ======================================
            AI CONFIDENCE CARD
      ====================================== */}

      <div className="confidenceCard">

        <div className="cardTitle">
          <FaBrain />
          <h2>AI Confidence Score</h2>
        </div>

        <div className="confidenceCircle">
          <h1>{confidence}%</h1>
          <span>High Confidence</span>
        </div>

        <div className="confidenceBar">
          <div
            className="confidenceFill"
            style={{ width: `${confidence}%` }}
          ></div>
        </div>

        <p>
          AI has successfully extracted most important claim
          information from your uploaded documents.
        </p>

      </div>

      {/* ======================================
            OCR PREVIEW CARD
      ====================================== */}

      <div className="ocrCard">

        <div className="cardTitle">
          <FaCheckCircle />
          <h2>Extracted Information Preview</h2>
        </div>

        <div className="ocrGrid">

          <div className="ocrItem">
            <span>Applicant</span>
            <h4>{extractedData.applicant}</h4>
          </div>

          <div className="ocrItem">
            <span>Insurance Type</span>
            <h4>{extractedData.insuranceType}</h4>
          </div>

          <div className="ocrItem">
            <span>Vehicle</span>
            <h4>{extractedData.vehicle}</h4>
          </div>

          <div className="ocrItem">
            <span>Accident Location</span>
            <h4>{extractedData.location}</h4>
          </div>

          <div className="ocrItem">
            <span>Date</span>
            <h4>{extractedData.date}</h4>
          </div>

          <div className="ocrItem">
            <span>Detected Damage</span>
            <h4>{extractedData.damage}</h4>
          </div>

        </div>

      </div>

      {/* ======================================
            DOCUMENT TYPES SUPPORTED
      ====================================== */}

      <div className="supportedDocs">

        <h2>Supported AI Documents</h2>

        <div className="docGrid">

          {[
            "Insurance Policy PDF",
            "Hospital Bills",
            "Medical Reports",
            "Prescription",
            "Driving License",
            "Vehicle RC",
            "Passport",
            "Boarding Pass",
            "FIR Copy",
            "Police Report",
            "Death Certificate",
            "Repair Estimate",
            "Property Images",
            "Accident Photos",
          ].map((doc, index) => (
            <div className="docCard" key={index}>
              <FaFileAlt />
              {doc}
            </div>
          ))}

        </div>

      </div>

      {/* ======================================
            AI SMART SUGGESTIONS
      ====================================== */}

      <div className="aiSuggestions">

        <div className="cardTitle">
          <FaRobot />
          <h2>AI Suggestions</h2>
        </div>

        <div className="suggestionList">

          <div className="suggestionItem">
            <FaCheckCircle />
            AI detected vehicle windshield damage.
          </div>

          <div className="suggestionItem">
            <FaCheckCircle />
            Hospital bill contains patient and policy number.
          </div>

          <div className="suggestionItem">
            <FaCheckCircle />
            FIR date matches accident date.
          </div>

          <div className="suggestionItem">
            <FaCheckCircle />
            Upload RC and Driving License for faster verification.
          </div>

          <div className="suggestionItem">
            <FaCheckCircle />
            Confidence score improves after uploading policy PDF.
          </div>

        </div>

      </div>

    </div>
  );
};

export default AIUploader;