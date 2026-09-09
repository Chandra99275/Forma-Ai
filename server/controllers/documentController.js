// ==========================================
// Forma AI - Document Controller
// ==========================================

import Document from "../models/Document.js";
import Claim from "../models/Claim.js";

// ==========================================
// Upload Document
// ==========================================

const uploadDocument = async (req, res, next) => {
  try {
    const {
      claimId,
      documentType,
      description,
    } = req.body;

    // Check claim
    const claim = await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    // Check uploaded file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a document",
      });
    }

    // Create document
    const document = await Document.create({
      claimId,
      userId: req.user?._id || null,

      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,

      documentType: documentType || "other",
      description: description || "",

      ocrStatus: "pending",
      verificationStatus: "pending",
    });

    // Add document to claim
    claim.documents.push(document._id);

    await claim.save();

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Documents for a Claim
// ==========================================

const getClaimDocuments = async (req, res, next) => {
  try {
    const { claimId } = req.params;

    const claim = await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    // Ownership check
    if (
      req.user?._id &&
      claim.userId &&
      claim.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access these documents",
      });
    }

    const documents = await Document.find({
      claimId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
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

const getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Check associated claim
    const claim = await Claim.findById(document.claimId);

    if (
      req.user?._id &&
      claim?.userId &&
      claim.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this document",
      });
    }

    res.status(200).json({
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

const updateDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      documentType,
      description,
    } = req.body;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Check associated claim
    const claim = await Claim.findById(document.claimId);

    if (
      req.user?._id &&
      claim?.userId &&
      claim.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this document",
      });
    }

    if (documentType !== undefined) {
      document.documentType = documentType;
    }

    if (description !== undefined) {
      document.description = description;
    }

    await document.save();

    res.status(200).json({
      success: true,
      message: "Document updated successfully",
      document,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Delete Document
// ==========================================

const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Check associated claim
    const claim = await Claim.findById(document.claimId);

    if (
      req.user?._id &&
      claim?.userId &&
      claim.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this document",
      });
    }

    // Remove document ID from claim
    if (claim) {
      claim.documents = claim.documents.filter(
        (documentId) =>
          documentId.toString() !== document._id.toString()
      );

      await claim.save();
    }

    // Delete document record
    await Document.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update OCR Status
// ==========================================

const updateOCRStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      ocrStatus,
      extractedText,
      extractedData,
    } = req.body;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Check associated claim
    const claim = await Claim.findById(document.claimId);

    if (
      req.user?._id &&
      claim?.userId &&
      claim.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update OCR status",
      });
    }

    const allowedStatuses = [
      "pending",
      "processing",
      "completed",
      "failed",
    ];

    if (!allowedStatuses.includes(ocrStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OCR status",
      });
    }

    document.ocrStatus = ocrStatus;

    if (extractedText !== undefined) {
      document.extractedText = extractedText;
    }

    if (extractedData !== undefined) {
      document.extractedData = extractedData;
    }

    if (ocrStatus === "completed") {
      document.processedAt = new Date();
    }

    await document.save();

    res.status(200).json({
      success: true,
      message: "OCR status updated successfully",
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