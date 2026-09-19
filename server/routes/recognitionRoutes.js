import express from "express";
import recognitionUpload from "../middleware/recognitionUpload.js";

// Existing image recognition controller
import {
  recognizeDocument,
  recognizePDFDocument, // NEW - Only for PDFRecognition.jsx
} from "../controllers/recognitionController.js";

const router = express.Router();

/* =========================================================
   FORMA AI - IMAGE & DOCUMENT RECOGNITION ROUTES
   =========================================================
   Base Route:
   /api/recognition

   Existing Routes (UNCHANGED)
   POST /api/recognition/extract-image
   POST /api/recognition/extract
   GET  /api/recognition/health

   New Route
   POST /api/recognition/extract-pdf
   ========================================================= */


/* =========================================================
   IMAGE RECOGNITION (UNCHANGED)
   ========================================================= */

router.post(
  "/extract-image",
  recognitionUpload.single("document"),
  recognizeDocument
);


/* =========================================================
   GENERAL DOCUMENT RECOGNITION (UNCHANGED)
   ========================================================= */

router.post(
  "/extract",
  recognitionUpload.single("document"),
  recognizeDocument
);


/* =========================================================
   PDF RECOGNITION (NEW ROUTE ONLY)
   =========================================================
   Used by:
   client/src/pages/PDFRecognition.jsx

   Endpoint:
   POST /api/recognition/extract-pdf

   FormData Field:
   document

   Supported Format:
   PDF
   ========================================================= */

router.post(
  "/extract-pdf",
  recognitionUpload.single("document"),
  recognizePDFDocument
);


/* =========================================================
   RECOGNITION HEALTH CHECK (UNCHANGED)
   ========================================================= */

router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,

    service: "Forma AI Recognition API",

    status: "Running",

    aiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",

    timestamp: new Date().toISOString(),

    endpoints: {
      imageRecognition: "POST /api/recognition/extract-image",

      documentRecognition: "POST /api/recognition/extract",

      pdfRecognition: "POST /api/recognition/extract-pdf",

      health: "GET /api/recognition/health",
    },

    imageFormats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    supportedFormats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "pdf",
    ],
  });
});


/* =========================================================
   EXPORT ROUTER
   ========================================================= */

export default router;