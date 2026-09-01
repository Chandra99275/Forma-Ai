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
  console.log("======================================");
  console.log("🚀 Forma AI Backend Started Successfully");
  console.log(`🌐 Server URL : http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("======================================");
});

// ==============================
// Graceful Shutdown
// ==============================

// Handle unexpected promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);

  server.close(() => {
    process.exit(1);
  });
});

// Handle Ctrl + C
process.on("SIGINT", () => {
  console.log("\n🛑 Forma AI Server Stopped.");
  server.close(() => process.exit(0));
});