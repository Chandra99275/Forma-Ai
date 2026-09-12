// ==============================================
// Forma AI - AI Controller
// Description → AI → Claim → PDF
// ==============================================

import { parseClaim } from "../services/aiParserService.js";
import { generateClaimPDF } from "../services/pdfService.js";
import { generateClaimNumber } from "../utils/claimNumber.js";
import Claim from "../models/Claim.js";

// ==============================================
// AI Prefill / Parse Description
// ==============================================

export const prefillForm = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Incident description is required.",
      });
    }

    console.log("=========================================");
    console.log("🤖 FORMA AI PARSER STARTED");
    console.log("=========================================");
    console.log("Description:", description);

    // ------------------------------------------
    // 1. Parse description using Gemini
    // ------------------------------------------

    const aiResult = await parseClaim(description.trim());

    console.log("✅ AI Parsing Completed");
    console.log("Category:", aiResult.category);

    // ------------------------------------------
    // 2. Generate claim number
    // ------------------------------------------

    const claimNumber = await generateClaimNumber();

    console.log("Claim Number:", claimNumber);

    // ------------------------------------------
    // 3. Generate PDF
    // ------------------------------------------

    const pdfResult = await generateClaimPDF({
      claimNumber,
      category: aiResult.category,
      claimData: aiResult.claimData,
    });

    console.log("✅ PDF Generated");
    console.log("PDF URL:", pdfResult.pdfUrl);

    // ------------------------------------------
    // 4. Save claim to MongoDB
    // ------------------------------------------

    const claim = await Claim.create({
      claimNumber,
      category: aiResult.category,
      status: "submitted",
      claimData: aiResult.claimData,
      aiAnalysis: {
        summary: aiResult.summary,
        confidence: aiResult.confidence,
        source: "description",
      },
      documents: [
        {
          name: pdfResult.fileName,
          url: pdfResult.pdfUrl,
          type: "claim-pdf",
        },
      ],
    });

    console.log("✅ Claim Saved to MongoDB");
    console.log("MongoDB Claim ID:", claim._id);

    // ------------------------------------------
    // 5. Return complete response
    // ------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Insurance claim successfully processed and submitted.",

      claimId: claim._id,

      claimNumber,

      category: aiResult.category,

      extractedData: aiResult.claimData,

      summary: aiResult.summary,

      confidence: aiResult.confidence,

      pdfUrl: pdfResult.pdfUrl,

      fileName: pdfResult.fileName,

      status: claim.status,
    });
  } catch (error) {
    console.error("❌ AI Parser Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI parsing or claim submission failed.",
      error: error.message,
    });
  }
};