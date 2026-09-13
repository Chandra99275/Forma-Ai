// ==========================================
// Forma AI - Document Controller
// ==========================================

import fs from "fs";

import Document from "../models/Document.js";
import Claim from "../models/Claim.js";

// ==========================================
// Upload Document(s)
// ==========================================

const uploadDocument = async (req, res, next) => {
  try {
    const {
      claimId,
      documentType,
      description,
    } = req.body;

    console.log("");
    console.log("==========================================");
    console.log("📤 DOCUMENT UPLOAD CONTROLLER");
    console.log("==========================================");

    console.log("Claim ID:", claimId);
    console.log("Document Type:", documentType);
    console.log("Description:", description);
    console.log(
      "Files received:",
      req.files?.length || 0
    );

    // ------------------------------------------
    // Check Claim ID
    // ------------------------------------------

    if (!claimId) {
      return res.status(400).json({
        success: false,
        message: "Claim ID is required",
      });
    }

    // ------------------------------------------
    // Check Claim
    // ------------------------------------------

    const claim = await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    console.log(
      "✅ Claim found:",
      claim.claimNumber
    );

    // ------------------------------------------
    // Check Uploaded Files
    // ------------------------------------------

    if (
      !req.files ||
      !Array.isArray(req.files) ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one document",
      });
    }

    // ------------------------------------------
    // Create Document Records
    // ------------------------------------------

    const documents = [];

    for (const file of req.files) {
      console.log("");
      console.log("📄 Processing file:");
      console.log(
        "   Original Name:",
        file.originalname
      );
      console.log(
        "   Stored Name:",
        file.filename
      );
      console.log(
        "   MIME Type:",
        file.mimetype
      );
      console.log(
        "   Size:",
        file.size
      );
      console.log(
        "   Path:",
        file.path
      );

      // ----------------------------------------
      // Generate Public File URL
      // ----------------------------------------

      const normalizedPath = file.path.replace(
        /\\/g,
        "/"
      );

      const uploadsIndex =
        normalizedPath.indexOf("/uploads/");

      let fileUrl;

      if (uploadsIndex !== -1) {
        fileUrl =
          normalizedPath.substring(
            uploadsIndex
          );
      } else {
        fileUrl =
          `/uploads/documents/${file.filename}`;
      }

      console.log(
        "   Generated URL:",
        fileUrl
      );

      // ----------------------------------------
      // Create Document Collection Record
      // ----------------------------------------

      const document =
        await Document.create({
          claimId,

          userId:
            req.user?._id || null,

          originalName:
            file.originalname,

          fileName:
            file.filename,

          filePath:
            file.path,

          fileType:
            file.mimetype,

          fileSize:
            file.size,

          documentType:
            documentType || "other",

          description:
            description || "",

          ocrStatus:
            "pending",

          verificationStatus:
            "pending",
        });

      console.log(
        "✅ Document record created:",
        document._id
      );

      // ----------------------------------------
      // Add Embedded Document to Claim
      // ----------------------------------------
      //
      // Claim.js expects:
      //
      // {
      //   name: String,
      //   url: String,
      //   type: String
      // }
      //
      // DO NOT push document._id here.
      // ----------------------------------------

      const claimDocument = {
        name: file.originalname,

        url: fileUrl,

        type:
          documentType || "document",
      };

      claim.documents.push(
        claimDocument
      );

      console.log(
        "✅ Added to claim:",
        claimDocument
      );

      documents.push(document);
    }

    // ------------------------------------------
    // Save Claim
    // ------------------------------------------

    await claim.save();

    console.log("");
    console.log(
      "✅ Claim saved successfully"
    );

    console.log(
      "Total claim documents:",
      claim.documents.length
    );

    console.log("==========================================");
    console.log(
      "✅ DOCUMENT UPLOAD SUCCESSFUL"
    );
    console.log("==========================================");
    console.log("");

    // ------------------------------------------
    // Response
    // ------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        `${documents.length} document(s) uploaded successfully`,

      count: documents.length,

      documents,
    });
  } catch (error) {
    console.error("");
    console.error(
      "❌ DOCUMENT UPLOAD ERROR"
    );
    console.error(
      "Message:",
      error.message
    );
    console.error(
      "Stack:",
      error.stack
    );
    console.error("");

    next(error);
  }
};

// ==========================================
// Get Documents for a Claim
// ==========================================

const getClaimDocuments = async (
  req,
  res,
  next
) => {
  try {
    const { claimId } = req.params;

    // ------------------------------------------
    // Check Claim
    // ------------------------------------------

    const claim =
      await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    // ------------------------------------------
    // Ownership Check
    // ------------------------------------------

    if (
      req.user?._id &&
      claim.userId &&
      claim.userId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access these documents",
      });
    }

    // ------------------------------------------
    // Get Documents
    // ------------------------------------------

    const documents =
      await Document.find({
        claimId,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      claimId,
      count: documents.length,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Single Document
// ==========================================

const getDocumentById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const document =
      await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // ------------------------------------------
    // Check Associated Claim
    // ------------------------------------------

    const claim =
      await Claim.findById(
        document.claimId
      );

    if (
      req.user?._id &&
      claim?.userId &&
      claim.userId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access this document",
      });
    }

    return res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update Document
// ==========================================

const updateDocument = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const {
      documentType,
      description,
    } = req.body;

    const document =
      await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // ------------------------------------------
    // Check Associated Claim
    // ------------------------------------------

    const claim =
      await Claim.findById(
        document.claimId
      );

    if (
      req.user?._id &&
      claim?.userId &&
      claim.userId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this document",
      });
    }

    // ------------------------------------------
    // Update Document Record
    // ------------------------------------------

    if (documentType !== undefined) {
      document.documentType =
        documentType;
    }

    if (description !== undefined) {
      document.description =
        description;
    }

    await document.save();

    // ------------------------------------------
    // Update Embedded Claim Document
    // ------------------------------------------

    if (claim) {
      const matchingDocument =
        claim.documents.find(
          (item) =>
            item.name ===
            document.originalName
        );

      if (matchingDocument) {
        if (documentType !== undefined) {
          matchingDocument.type =
            documentType;
        }
      }

      await claim.save();
    }

    return res.status(200).json({
      success: true,
      message:
        "Document updated successfully",
      document,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Delete Document
// ==========================================

const deleteDocument = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const document =
      await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // ------------------------------------------
    // Check Associated Claim
    // ------------------------------------------

    const claim =
      await Claim.findById(
        document.claimId
      );

    if (
      req.user?._id &&
      claim?.userId &&
      claim.userId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this document",
      });
    }

    // ------------------------------------------
    // Remove Embedded Document From Claim
    // ------------------------------------------

    if (claim) {
      claim.documents =
        claim.documents.filter(
          (claimDocument) =>
            claimDocument.name !==
            document.originalName
        );

      await claim.save();
    }

    // ------------------------------------------
    // Delete Physical File
    // ------------------------------------------

    if (
      document.filePath &&
      fs.existsSync(document.filePath)
    ) {
      try {
        fs.unlinkSync(
          document.filePath
        );

        console.log(
          "🗑️ Physical file deleted:",
          document.filePath
        );
      } catch (fileError) {
        console.error(
          "⚠️ Could not delete physical file:",
          fileError.message
        );
      }
    }

    // ------------------------------------------
    // Delete Document Record
    // ------------------------------------------

    await Document.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update OCR Status
// ==========================================

const updateOCRStatus = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const {
      ocrStatus,
      extractedText,
      extractedData,
    } = req.body;

    const document =
      await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // ------------------------------------------
    // Check Associated Claim
    // ------------------------------------------

    const claim =
      await Claim.findById(
        document.claimId
      );

    if (
      req.user?._id &&
      claim?.userId &&
      claim.userId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update OCR status",
      });
    }

    // ------------------------------------------
    // Validate OCR Status
    // ------------------------------------------

    const allowedStatuses = [
      "pending",
      "processing",
      "completed",
      "failed",
    ];

    if (
      !allowedStatuses.includes(
        ocrStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OCR status",
      });
    }

    // ------------------------------------------
    // Update OCR
    // ------------------------------------------

    document.ocrStatus =
      ocrStatus;

    if (
      extractedText !== undefined
    ) {
      document.extractedText =
        extractedText;
    }

    if (
      extractedData !== undefined
    ) {
      document.extractedData =
        extractedData;
    }

    if (
      ocrStatus === "completed"
    ) {
      document.processedAt =
        new Date();
    }

    await document.save();

    return res.status(200).json({
      success: true,
      message:
        "OCR status updated successfully",
      document,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Named Exports
// ==========================================

export {
  uploadDocument,
  getClaimDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  updateOCRStatus,
};