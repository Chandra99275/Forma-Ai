import express from "express";

import recognitionUpload from "../middleware/recognitionUpload.js";

import {
  recognizeDocument,
} from "../controllers/recognitionController.js";

const router = express.Router();

/*
  POST
  /api/recognition/extract

  Supports:
  - PDF
  - JPG
  - JPEG
  - PNG
  - WEBP

  FormData field:
  document
*/

router.post(
  "/extract",
  recognitionUpload.single("document"),
  recognizeDocument
);

export default router;