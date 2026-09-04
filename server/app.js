import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// Routes
import authRoutes from "./routes/authRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";

// Middleware
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

/* ==========================================
   GLOBAL MIDDLEWARES
========================================== */

// Security Headers
app.use(helmet());

// HTTP Request Logger
app.use(morgan("dev"));

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON Requests
app.use(express.json({ limit: "10mb" }));

// Parse URL Encoded Requests
app.use(express.urlencoded({ extended: true }));

/* ==========================================
   HEALTH CHECK ROUTES
========================================== */

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    project: "Forma AI Backend",
    message: "🚀 Forma AI Backend is Running Successfully",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// API Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/* ==========================================
   API ROUTES
========================================== */

// Authentication
app.use("/api/auth", authRoutes);

// Dynamic Forms
app.use("/api/forms", formRoutes);

// AI Parser / Gemini
app.use("/api/ai", aiRoutes);

// Form Submissions
app.use("/api/submissions", submissionRoutes);

/* ==========================================
   404 ROUTE HANDLER
========================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `❌ Route Not Found: ${req.originalUrl}`,
  });
});

/* ==========================================
   GLOBAL ERROR HANDLER
========================================== */

app.use(errorMiddleware);

/* ==========================================
   EXPORT APP
========================================== */

export default app;