// ==========================================
// Forma AI - Backend Server
// ==========================================

import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

// ==========================================
// Load Environment Variables
// ==========================================

dotenv.config();

// ==========================================
// Environment Variables
// ==========================================

const PORT = process.env.PORT || 5000;

// ==========================================
// Start Server
// ==========================================

const startServer = async () => {
  try {
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
      console.log("=========================================");
    });

    // ======================================
    // Handle Unhandled Promise Rejections
    // ======================================

    process.on("unhandledRejection", (error) => {
      console.error("❌ Unhandled Rejection:");
      console.error(error);

      server.close(() => {
        process.exit(1);
      });
    });

    // ======================================
    // Handle Uncaught Exceptions
    // ======================================

    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:");
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

    process.exit(1);
  }
};

// ==========================================
// Start Application
// ==========================================

startServer();