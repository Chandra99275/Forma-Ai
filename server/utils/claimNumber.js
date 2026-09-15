// ==========================================
// Forma AI - Claim Number Generator
// ==========================================

import Claim from "../models/Claim.js";

// ==========================================
// Generate Unique Claim Number
// ==========================================
//
// Format:
// CLM-2026-0001
// CLM-2026-0002
// CLM-2026-0003
//
// This generator:
// 1. Finds the latest claim number for the year
// 2. Calculates the next number
// 3. Checks MongoDB for an existing number
// 4. Skips numbers that already exist
// 5. Returns a guaranteed currently-unused number
//
// ==========================================

const generateClaimNumber = async () => {
  try {
    const year = new Date().getFullYear();

    const prefix = `CLM-${year}-`;

    console.log("\n=========================================");
    console.log("🔢 CLAIM NUMBER GENERATOR");
    console.log("=========================================");
    console.log("📅 Year:", year);

    // ------------------------------------------
    // Find the latest claim number for this year
    // ------------------------------------------

    const latestClaim = await Claim.findOne({
      claimNumber: {
        $regex: `^${prefix}\\d+$`,
      },
    })
      .sort({
        claimNumber: -1,
      })
      .select("claimNumber")
      .lean();

    console.log(
      "🔎 Latest claim:",
      latestClaim?.claimNumber || "None"
    );

    // ------------------------------------------
    // Determine next number
    // ------------------------------------------

    let nextNumber = 1;

    if (latestClaim?.claimNumber) {
      const match = latestClaim.claimNumber.match(
        /^CLM-\d{4}-(\d+)$/
      );

      if (match) {
        const latestNumber = parseInt(
          match[1],
          10
        );

        if (Number.isFinite(latestNumber)) {
          nextNumber = latestNumber + 1;
        }
      }
    }

    console.log(
      "🔢 Starting number:",
      nextNumber
    );

    // ------------------------------------------
    // Find an available claim number
    // ------------------------------------------

    while (true) {
      const claimNumber =
        `${prefix}${String(nextNumber).padStart(4, "0")}`;

      console.log(
        "🔍 Checking:",
        claimNumber
      );

      // ----------------------------------------
      // Check whether number already exists
      // ----------------------------------------

      const existingClaim = await Claim.exists({
        claimNumber,
      });

      // ----------------------------------------
      // Number is available
      // ----------------------------------------

      if (!existingClaim) {
        console.log(
          "✅ UNIQUE CLAIM NUMBER:",
          claimNumber
        );

        console.log(
          "=========================================\n"
        );

        return claimNumber;
      }

      // ----------------------------------------
      // Number already exists
      // ----------------------------------------

      console.warn(
        "⚠️ Claim number already exists:",
        claimNumber
      );

      nextNumber++;
    }
  } catch (error) {
    console.error(
      "\n========================================="
    );

    console.error(
      "❌ CLAIM NUMBER GENERATION ERROR"
    );

    console.error(
      "========================================="
    );

    console.error(
      "Error Name:",
      error.name
    );

    console.error(
      "Error Message:",
      error.message
    );

    console.error(
      "Stack:",
      error.stack
    );

    console.error(
      "=========================================\n"
    );

    throw new Error(
      "Unable to generate claim number"
    );
  }
};

// ==========================================
// Named Export
// ==========================================

export {
  generateClaimNumber,
};

// ==========================================
// Default Export
// ==========================================

export default generateClaimNumber;