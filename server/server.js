
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

// ==========================================
// Check Required Environment Variables
// ==========================================

console.log("=========================================");
console.log("🔧 Forma AI Environment Check");
console.log("=========================================");

console.log(
  "🔑 Gemini API Key:",
  process.env.GEMINI_API_KEY ? "FOUND ✅" : "MISSING ❌"
);

console.log(
  "🗄️ MongoDB URI:",
  process.env.MONGO_URI ? "FOUND ✅" : "MISSING ❌"
);

console.log(
  "🌐 Client URL:",
  process.env.CLIENT_URL || "Not configured"
);

console.log(
  "📦 Environment:",
  process.env.NODE_ENV || "development"
);

console.log("=========================================");

// ==========================================
// Start Server
// ==========================================

const startServer = async () => {
  try {
    // --------------------------------------
    // Validate Gemini API Key
    // --------------------------------------

    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is missing. Please check server/.env"
      );
    }

    // --------------------------------------
    // Validate MongoDB URI
    // --------------------------------------

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing. Please check server/.env"
      );
    }

    // --------------------------------------
    // Connect MongoDB
    // --------------------------------------

    await connectDB();

    console.log("✅ MongoDB Connected Successfully");

    // --------------------------------------
    // Start Express Server
    // --------------------------------------

    const server = app.listen(PORT, () => {
      console.log("=========================================");
      console.log("🚀 Forma AI Backend Started Successfully");
      console.log("=========================================");
      console.log(`🌐 Server URL   : http://localhost:${PORT}`);
      console.log(
        `📦 Environment  : ${process.env.NODE_ENV || "development"}`
      );
      console.log(`📂 API Base URL : http://localhost:${PORT}/api`);
      console.log("🤖 Gemini AI    : Configured ✅");
      console.log("=========================================");
    });

    // ======================================
    // Handle Unhandled Promise Rejections
    // ======================================

    process.on("unhandledRejection", (error) => {
      console.error("=========================================");
      console.error("❌ Unhandled Promise Rejection");
      console.error("=========================================");
      console.error(error);

      server.close(() => {
        process.exit(1);
      });
    });

    // ======================================
    // Handle Uncaught Exceptions
    // ======================================

    process.on("uncaughtException", (error) => {
      console.error("=========================================");
      console.error("❌ Uncaught Exception");
      console.error("=========================================");
      console.error(error);

      server.close(() => {
        process.exit(1);
      });
    });

    // ======================================
    // Graceful Shutdown - Ctrl + C
    // ======================================

    process.on("SIGINT", () => {
      console.log("\n🛑 Forma AI Server Stopping...");

      server.close(() => {
        console.log("✅ Server closed successfully.");
        process.exit(0);
      });
    });

    // ======================================
    // Graceful Shutdown - SIGTERM
    // ======================================

    process.on("SIGTERM", () => {
      console.log("\n🛑 Forma AI Server Terminating...");

      server.close(() => {
        console.log("✅ Server closed successfully.");
        process.exit(0);
      });
    });
  } catch (error) {
    // ======================================
    // Server Startup Error
    // ======================================

    console.error("=========================================");
    console.error("❌ Failed to Start Forma AI Backend");
    console.error("=========================================");
    console.error("Error:", error.message);
    console.error("=========================================");

    process.exit(1);
  }
};

// ==========================================
// Start Application
// ==========================================

startServer();

