import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Forma AI Backend is Running 🚀" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/submissions", submissionRoutes);

// Global Error Handler (keep last)
app.use(errorMiddleware);

// ✅ Export app
export default app;