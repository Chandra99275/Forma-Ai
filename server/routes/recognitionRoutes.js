
import express from "express";
import recognitionUpload from "../middleware/recognitionUpload.js";
import { recognizeDocument } from "../controllers/recognitionController.js";

const router = express.Router();

/* =========================================================
   FORMA AI - IMAGE & DOCUMENT RECOGNITION ROUTES
   =========================================================
   Base Route:
   /api/recognition

   Frontend ImageRecognition.jsx uses:
   POST /api/recognition/extract-image

   Legacy/general recognition endpoint:
   POST /api/recognition/extract
   ========================================================= */


/* =========================================================
   IMAGE RECOGNITION
   =========================================================

   POST /api/recognition/extract-image

   FormData field:
   document

   Supported image formats:
   - JPG
   - JPEG
   - PNG
   - WEBP

   Used by:
   client/src/pages/ImageRecognition.jsx
   ========================================================= */

router.post(
  "/extract-image",
  recognitionUpload.single("document"),
  recognizeDocument
);


/* =========================================================
   GENERAL DOCUMENT RECOGNITION
   =========================================================

   POST /api/recognition/extract

   FormData field:
   document

   This endpoint is kept for compatibility with other
   Forma AI features that may use the recognition service.

   Supported formats depend on recognitionUpload middleware.
   ========================================================= */

router.post(
  "/extract",
  recognitionUpload.single("document"),
  recognizeDocument
);


/* =========================================================
   RECOGNITION HEALTH CHECK
   =========================================================

   GET /api/recognition/health

   Used to verify that the recognition service is running.
   ========================================================= */

router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,

    service: "Forma AI Recognition API",

    status: "Running",

    aiModel:
      process.env.GEMINI_MODEL ||
      "gemini-2.5-flash",

    timestamp: new Date().toISOString(),

    endpoints: {
      imageRecognition:
        "POST /api/recognition/extract-image",

      documentRecognition:
        "POST /api/recognition/extract",

      health:
        "GET /api/recognition/health",
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
