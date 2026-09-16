// ==========================================
// Forma AI - Backend Server
// ==========================================

import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

// ==========================================
// Environment Variables
// ==========================================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

// ==========================================
// Environment Check
// ==========================================

console.log("=========================================");
console.log("🔧 Forma AI Environment Check");
console.log("=========================================");

console.log(
  "🔑 Gemini API Key:",
  process.env.GEMINI_API_KEY ? "FOUND ✅" : "MISSING ❌"
);

console.log(
  "🤖 Gemini Model:",
  process.env.GEMINI_MODEL || "gemini-2.5-flash"
);

console.log(
  "🗄️ MongoDB URI:",
  process.env.MONGO_URI || process.env.MONGODB_URI
    ? "FOUND ✅"
    : "MISSING ❌"
);

console.log("🌐 Client URL:", CLIENT_URL);
console.log("📦 Environment:", NODE_ENV);

console.log("=========================================");

// ==========================================
// Validate Environment Variables
// ==========================================

const validateEnvironment = () => {
  const missingVariables = [];

  if (!process.env.GEMINI_API_KEY) {
    missingVariables.push("GEMINI_API_KEY");
  }

  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    missingVariables.push("MONGO_URI / MONGODB_URI");
  }

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(
        ", "
      )}. Please check server/.env`
    );
  }
};

// ==========================================
// Server Reference
// ==========================================

let server;

// ==========================================
// Start Server
// ==========================================

const startServer = async () => {
  try {
    // --------------------------------------
    // Validate Environment
    // --------------------------------------

    console.log("🔍 Validating environment...");

    validateEnvironment();

    console.log("✅ Environment validation successful");

    // --------------------------------------
    // Connect MongoDB
    // --------------------------------------

    console.log("🔌 Connecting to MongoDB...");

    await connectDB();

    console.log("✅ MongoDB Connected Successfully");

    // --------------------------------------
    // Start Express Server
    // --------------------------------------

    server = app.listen(PORT, () => {
      console.log("");
      console.log("=========================================");
      console.log("🚀 Forma AI Backend Started Successfully");
      console.log("=========================================");

      console.log(`🌐 Server URL   : http://localhost:${PORT}`);
      console.log(`📦 Environment  : ${NODE_ENV}`);
      console.log(`📂 API Base URL : http://localhost:${PORT}/api`);

      console.log("");

      console.log("🤖 AI SERVICES");
      console.log("-----------------------------------------");
      console.log("✅ Gemini AI         : Connected");
      console.log(
        `🧠 Gemini Model      : ${
          process.env.GEMINI_MODEL || "gemini-2.5-flash"
        }`
      );
      console.log("📄 Document OCR      : Enabled");
      console.log("🖼️ Image Recognition : Enabled");
      console.log("📑 PDF Recognition   : Enabled");
      console.log("🚗 Insurance AI      : Enabled");
      console.log("📝 OCR Text Extract  : Enabled");

      console.log("");

      console.log("📡 AVAILABLE API ROUTES");
      console.log("-----------------------------------------");
      console.log(`GET  /api/health`);
      console.log(`POST /api/auth/login`);
      console.log(`POST /api/auth/register`);
      console.log(`GET  /api/forms`);
      console.log(`POST /api/forms`);
      console.log(`GET  /api/claims`);
      console.log(`POST /api/claims`);
      console.log(`POST /api/documents/upload`);
      console.log(`POST /api/recognition/extract`);
      console.log(`GET  /api/recognition/health`);

      console.log("");

      console.log("💡 RECOGNITION API");
      console.log("-----------------------------------------");
      console.log(
        `Endpoint           : http://localhost:${PORT}/api/recognition/extract`
      );
      console.log("Upload Field       : document");
      console.log(
        "Supported Formats  : JPG, JPEG, PNG, WEBP, PDF"
      );

      console.log("");

      console.log("=========================================");
      console.log("✅ Forma AI Backend Ready");
      console.log("=========================================");
      console.log("");
    });

    // ======================================
    // Handle Server Error
    // ======================================

    server.on("error", (error) => {
      console.error("=========================================");
      console.error("❌ Express Server Error");
      console.error("=========================================");

      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error("💡 Stop the existing process or use another PORT.");
      } else {
        console.error(error);
      }

      process.exit(1);
    });

    // ======================================
    // Handle Unhandled Promise Rejections
    // ======================================

    process.on("unhandledRejection", (error) => {
      console.error("=========================================");
      console.error("❌ Unhandled Promise Rejection");
      console.error("=========================================");
      console.error(error);

      gracefulShutdown("UNHANDLED_REJECTION");
    });

    // ======================================
    // Handle Uncaught Exceptions
    // ======================================

    process.on("uncaughtException", (error) => {
      console.error("=========================================");
      console.error("❌ Uncaught Exception");
      console.error("=========================================");
      console.error(error);

      gracefulShutdown("UNCAUGHT_EXCEPTION");
    });

    // ======================================
    // Graceful Shutdown - SIGINT
    // ======================================

    process.on("SIGINT", () => {
      console.log("");
      console.log("🛑 Forma AI Server Stopping...");

      gracefulShutdown("SIGINT");
    });

    // ======================================
    // Graceful Shutdown - SIGTERM
    // ======================================

    process.on("SIGTERM", () => {
      console.log("");
      console.log("🛑 Forma AI Server Terminating...");

      gracefulShutdown("SIGTERM");
    });

  } catch (error) {
    // ======================================
    // Startup Error
    // ======================================

    console.error("");
    console.error("=========================================");
    console.error("❌ Failed to Start Forma AI Backend");
    console.error("=========================================");
    console.error("Error:", error.message);
    console.error("=========================================");

    process.exit(1);
  }
};

// ==========================================
// Graceful Shutdown Function
// ==========================================

const gracefulShutdown = (signal) => {
  console.log(`📡 Shutdown signal received: ${signal}`);

  if (!server) {
    console.log("⚠️ Server was not running.");
    process.exit(0);
  }

  server.close(() => {
    console.log("✅ HTTP server closed successfully.");
    console.log("👋 Forma AI Backend stopped.");
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("⚠️ Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

// ==========================================
// Start Application
// ==========================================

startServer();