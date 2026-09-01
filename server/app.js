import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/authRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";

// Middleware
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

/* ============================
   Global Middlewares
============================ */

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // React Frontend
    credentials: true,
  })
);

// Parse JSON Data
app.use(express.json());

// Parse Form Data
app.use(express.urlencoded({ extended: true }));

/* ============================
   Health Check Route
============================ */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Forma AI Backend is Running Successfully",
    version: "1.0.0",
  });
});

/* ============================
   API Routes
============================ */

app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/submissions", submissionRoutes);

/* ============================
   404 Route Handler
============================ */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* ============================
   Global Error Middleware
============================ */

app.use(errorMiddleware);

/* ============================
   Export Express App
============================ */

export default app;