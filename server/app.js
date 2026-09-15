// ==========================================
// Forma AI - Express Application
// ==========================================

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

// ==========================================
// Routes
// ==========================================

import authRoutes from "./routes/authRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

// ==========================================
// NEW - PDF & Image Recognition Routes
// ==========================================

import recognitionRoutes from "./routes/recognitionRoutes.js";

// ==========================================
// Middleware
// ==========================================

import errorMiddleware from "./middleware/errorMiddleware.js";

// ==========================================
// Create Express Application
// ==========================================

const app = express();

/* ==========================================
   GLOBAL MIDDLEWARES
========================================== */

// ------------------------------------------
// Security Headers
// ------------------------------------------

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ------------------------------------------
// HTTP Request Logger
// ------------------------------------------

app.use(morgan("dev"));

// ------------------------------------------
// CORS Configuration
// ------------------------------------------

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // such as Postman or server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(
          `CORS policy blocked this origin: ${origin}`
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
    ],
  })
);

// ------------------------------------------
// Parse JSON Requests
// ------------------------------------------

app.use(
  express.json({
    limit: "10mb",
  })
);

// ------------------------------------------
// Parse URL Encoded Requests
// ------------------------------------------

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/* ==========================================
   STATIC FILES
========================================== */

// ------------------------------------------
// Uploaded Documents
// ------------------------------------------

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

// ------------------------------------------
// Temporary Recognition Files
// ------------------------------------------
//
// This folder is used internally by the
// PDF/Image recognition system.
//
// It is NOT recommended to expose this
// folder publicly.
//

/* ==========================================
   HEALTH CHECK ROUTES
========================================== */

// ------------------------------------------
// Root Route
// ------------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,

    project: "Forma AI Backend",

    message:
      "🚀 Forma AI Backend is Running Successfully",

    version: "1.0.0",

    environment:
      process.env.NODE_ENV || "development",

    features: {
      authentication: true,
      dynamicForms: true,
      aiParser: true,
      submissions: true,
      claims: true,
      documentUpload: true,
      pdfRecognition: true,
      imageRecognition: true,
    },
  });
});

// ------------------------------------------
// API Health Check
// ------------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,

    status: "Healthy",

    timestamp: new Date().toISOString(),

    uptime: process.uptime(),

    services: {
      express: "running",
      api: "running",
      gemini:
        process.env.GEMINI_API_KEY
          ? "configured"
          : "not configured",
      mongodb: process.env.MONGO_URI
        ? "configured"
        : "not configured",
    },
  });
});

/* ==========================================
   API ROUTES
========================================== */

// ------------------------------------------
// Authentication
// ------------------------------------------

app.use(
  "/api/auth",
  authRoutes
);

// ------------------------------------------
// Dynamic Forms
// ------------------------------------------

app.use(
  "/api/forms",
  formRoutes
);

// ------------------------------------------
// AI Parser / Gemini
// ------------------------------------------

app.use(
  "/api/ai",
  aiRoutes
);

// ------------------------------------------
// Form Submissions
// ------------------------------------------

app.use(
  "/api/submissions",
  submissionRoutes
);

// ------------------------------------------
// Insurance Claims
// ------------------------------------------

app.use(
  "/api/claims",
  claimRoutes
);

// ------------------------------------------
// Claim Documents
// ------------------------------------------

app.use(
  "/api/documents",
  documentRoutes
);

// ==========================================
// NEW - PDF & IMAGE AI RECOGNITION
// ==========================================
//
// Endpoint:
//
// POST
// /api/recognition/extract
//
// FormData:
//
// document = PDF / JPG / JPEG / PNG / WEBP
//
// Example:
//
// http://localhost:5000/api/recognition/extract
//
// ==========================================

app.use(
  "/api/recognition",
  recognitionRoutes
);

/* ==========================================
   404 ROUTE HANDLER
========================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,

    message: `❌ Route Not Found: ${req.originalUrl}`,

    availableRoutes: {
      health:
        "GET /api/health",

      authentication:
        "/api/auth",

      forms:
        "/api/forms",

      ai:
        "/api/ai",

      submissions:
        "/api/submissions",

      claims:
        "/api/claims",

      documents:
        "/api/documents",

      recognition:
        "POST /api/recognition/extract",
    },
  });
});

/* ==========================================
   GLOBAL ERROR HANDLER
========================================== */

app.use(
  errorMiddleware
);

/* ==========================================
   EXPORT APP
========================================== */

export default app;