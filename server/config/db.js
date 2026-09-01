import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Check if MongoDB URI exists
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file.");
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "formaAI", // Database name
    });

    console.log("======================================");
    console.log("✅ Forma AI MongoDB Connected");
    console.log(`📍 Host     : ${conn.connection.host}`);
    console.log(`🗄️ Database : ${conn.connection.name}`);
    console.log("======================================");

    // Connection Events
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB Disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB Reconnected");
    });

  } catch (error) {
    console.error("======================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(`Error: ${error.message}`);
    console.error("======================================");
    process.exit(1);
  }
};

export default connectDB;