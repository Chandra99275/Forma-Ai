import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

// ==============================
// Load Environment Variables
// ==============================
dotenv.config();

// ==============================
// Connect MongoDB
// ==============================
connectDB();

// ==============================
// Start Express Server
// ==============================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("=========================================");
  console.log("🚀 Forma AI Backend Started Successfully");
  console.log(`🌐 Server URL : http://localhost:${PORT}`);
  console.log(`📦 Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(`📂 API Base URL : http://localhost:${PORT}/api`);
  console.log("=========================================");
});

// ==============================
// Handle MongoDB Connection Errors
// ==============================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);

  server.close(() => process.exit(1));
});

// ==============================
// Handle Uncaught Exceptions
// ==============================
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);

  server.close(() => process.exit(1));
});

// ==============================
// Graceful Shutdown (Ctrl + C)
// ==============================
process.on("SIGINT", () => {
  console.log("\n🛑 Forma AI Server Stopped.");
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Forma AI Server Terminated.");
  server.close(() => process.exit(0));
});