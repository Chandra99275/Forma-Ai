// ==========================================
// Forma AI - Claim Number Generator
// ==========================================

import Claim from "../models/Claim.js";

// ==========================================
// Generate Claim Number
// ==========================================

const generateClaimNumber = async () => {
  try {
    const year = new Date().getFullYear();

    // Count existing claims
    const count = await Claim.countDocuments();

    // Generate 4-digit number
    const number = String(count + 1).padStart(4, "0");

    // Example: CLM-2026-0001
    return `CLM-${year}-${number}`;
  } catch (error) {
    console.error(
      "❌ Claim Number Generation Error:",
      error.message
    );

    throw new Error("Unable to generate claim number");
  }
};

// ==========================================
// Named Export
// ==========================================

export {
  generateClaimNumber,
};