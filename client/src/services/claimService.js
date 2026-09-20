import axios from "axios";

const API_URL = "http://localhost:5000/api/claims";

// ============================================
// GET ALL CLAIMS
// ============================================
export const getClaims = async () => {
  try {
    const response = await axios.get(API_URL);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching claims:",
      error.response?.data || error
    );

    throw error;
  }
};

// ============================================
// GET SINGLE CLAIM BY ID
// ============================================
export const getClaimById = async (id) => {
  try {
    if (!id) {
      throw new Error("Claim ID is required.");
    }

    const response = await axios.get(
      `${API_URL}/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching claim:",
      error.response?.data || error
    );

    throw error;
  }
};

// ============================================
// SUBMIT EXISTING CLAIM
// ============================================
// POST /api/claims/:id/submit
// ============================================
export const submitClaim = async (claimId) => {
  try {
    console.log("=================================");
    console.log("📤 SUBMITTING EXISTING CLAIM");
    console.log("=================================");

    console.log("Claim ID:", claimId);

    // ------------------------------------------
    // Validate Claim ID
    // ------------------------------------------

    if (!claimId) {
      throw new Error(
        "Claim ID is required to submit the claim."
      );
    }

    // ------------------------------------------
    // Submit existing claim
    // ------------------------------------------

    const response = await axios.post(
      `${API_URL}/${claimId}/submit`
    );

    console.log(
      "✅ Claim submitted successfully:"
    );

    console.log(response.data);

    console.log(
      "================================="
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error submitting claim:",
      error.response?.data ||
        error.message ||
        error
    );

    throw error;
  }
};

// ============================================
// CREATE CLAIM
// ============================================
// category = "vehicle" | "health" | "property"
//           | "travel" | "life"
// ============================================
export const createClaim = async (
  claimData,
  category
) => {
  try {
    console.log("=================================");
    console.log("📤 CREATING CLAIM");
    console.log("=================================");

    console.log("Category:", category);
    console.log("Claim Data:", claimData);

    // ------------------------------------------
    // Validate category
    // ------------------------------------------

    if (!category) {
      console.error(
        "❌ Cannot create claim: category is missing"
      );

      throw new Error(
        "Insurance category is required."
      );
    }

    // ------------------------------------------
    // Normalize category
    // ------------------------------------------

    const normalizedCategory = String(category)
      .trim()
      .toLowerCase();

    // ------------------------------------------
    // Allowed categories
    // ------------------------------------------

    const allowedCategories = [
      "health",
      "vehicle",
      "property",
      "travel",
      "life",
    ];

    if (
      !allowedCategories.includes(
        normalizedCategory
      )
    ) {
      console.error(
        "❌ Invalid category:",
        normalizedCategory
      );

      throw new Error(
        `Invalid insurance category: ${normalizedCategory}`
      );
    }

    // ------------------------------------------
    // Prepare request body
    // ------------------------------------------

    const requestBody = {
      category: normalizedCategory,
      claimData: claimData || {},
    };

    console.log("📦 Request Body:");

    console.log(
      JSON.stringify(
        requestBody,
        null,
        2
      )
    );

    // ------------------------------------------
    // Create claim
    // ------------------------------------------

    const response = await axios.post(
      API_URL,
      requestBody
    );

    console.log(
      "✅ Claim created successfully:"
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating claim:",
      error.response?.data ||
        error.message ||
        error
    );

    throw error;
  }
};

// ============================================
// UPDATE CLAIM
// ============================================
// PUT /api/claims/:id
//
// Supports:
//
// updateClaim(id, {
//   category: "vehicle",
//   claimData: {...},
//   replaceClaimData: true
// });
//
// replaceClaimData = true tells the backend
// to completely replace the existing claimData.
// ============================================
export const updateClaim = async (
  id,
  claimData
) => {
  try {
    console.log("=================================");
    console.log("📤 UPDATING CLAIM");
    console.log("=================================");

    console.log("Claim ID:", id);
    console.log("Claim Data:", claimData);

    // ------------------------------------------
    // Validate ID
    // ------------------------------------------

    if (!id) {
      throw new Error(
        "Claim ID is required."
      );
    }

    // ------------------------------------------
    // Prepare request body
    // ------------------------------------------

    let requestBody = {};

    // ------------------------------------------
    // New format
    //
    // updateClaim(id, {
    //   category,
    //   claimData,
    //   replaceClaimData
    // })
    // ------------------------------------------

    if (
      claimData &&
      typeof claimData === "object" &&
      (
        Object.prototype.hasOwnProperty.call(
          claimData,
          "claimData"
        ) ||
        Object.prototype.hasOwnProperty.call(
          claimData,
          "category"
        ) ||
        Object.prototype.hasOwnProperty.call(
          claimData,
          "replaceClaimData"
        )
      )
    ) {
      requestBody = {
        ...claimData,
      };
    }

    // ------------------------------------------
    // Old format
    //
    // updateClaim(id, {
    //   field1: "...",
    //   field2: "..."
    // })
    // ------------------------------------------

    else {
      requestBody = {
        claimData: claimData || {},
      };
    }

    // ------------------------------------------
    // Make sure claimData exists
    // ------------------------------------------

    if (
      requestBody.claimData === undefined
    ) {
      requestBody.claimData = {};
    }

    // ------------------------------------------
    // IMPORTANT
    //
    // Completely replace claim data.
    //
    // This prevents deleted fields from
    // coming back after editing.
    // ------------------------------------------

    requestBody.replaceClaimData = true;

    // ------------------------------------------
    // Normalize category
    // ------------------------------------------

    if (
      requestBody.category !== undefined
    ) {
      requestBody.category = String(
        requestBody.category
      )
        .trim()
        .toLowerCase();
    }

    // ------------------------------------------
    // Validate category
    // ------------------------------------------

    const allowedCategories = [
      "health",
      "vehicle",
      "property",
      "travel",
      "life",
    ];

    if (
      requestBody.category !== undefined &&
      !allowedCategories.includes(
        requestBody.category
      )
    ) {
      throw new Error(
        `Invalid insurance category: ${requestBody.category}`
      );
    }

    // ------------------------------------------
    // Log final request body
    // ------------------------------------------

    console.log(
      "📦 Update Request Body:"
    );

    console.log(
      JSON.stringify(
        requestBody,
        null,
        2
      )
    );

    // ------------------------------------------
    // Update claim
    // ------------------------------------------

    const response = await axios.put(
      `${API_URL}/${id}`,
      requestBody
    );

    console.log(
      "✅ Claim updated successfully:"
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating claim:",
      error.response?.data ||
        error.message ||
        error
    );

    throw error;
  }
};

// ============================================
// UPLOAD CLAIM DOCUMENTS
// ============================================
// Supports:
//
// JPG
// JPEG
// PNG
// WEBP
// PDF
//
// Endpoint:
//
// POST /api/claims/documents/upload
//
// FormData:
//
// documents = selected files
// claimId   = existing claim ID
//
// Used by the Edit Claim modal.
// ============================================
export const uploadClaimDocuments = async (
  claimId,
  files = []
) => {
  try {
    console.log("=================================");
    console.log("📎 UPLOADING CLAIM DOCUMENTS");
    console.log("=================================");

    console.log("Claim ID:", claimId);

    // ------------------------------------------
    // Validate Claim ID
    // ------------------------------------------

    if (!claimId) {
      throw new Error(
        "Claim ID is required."
      );
    }

    // ------------------------------------------
    // Validate files
    // ------------------------------------------

    if (
      !Array.isArray(files) ||
      files.length === 0
    ) {
      throw new Error(
        "Please select at least one document."
      );
    }

    // ------------------------------------------
    // Allowed MIME types
    // ------------------------------------------

    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    // ------------------------------------------
    // Maximum size: 10 MB per file
    // ------------------------------------------

    const MAX_FILE_SIZE =
      10 * 1024 * 1024;

    // ------------------------------------------
    // Validate every file
    // ------------------------------------------

    for (const file of files) {
      if (!file) {
        throw new Error(
          "Invalid file selected."
        );
      }

      const fileType = String(
        file.type || ""
      ).toLowerCase();

      const fileName = String(
        file.name || ""
      ).toLowerCase();

      const isPdf =
        fileType ===
          "application/pdf" ||
        fileName.endsWith(".pdf");

      const isImage =
        fileType.startsWith("image/") &&
        allowedMimeTypes.includes(
          fileType
        );

      if (!isPdf && !isImage) {
        throw new Error(
          `Unsupported file type: ${file.name}. Only JPG, JPEG, PNG, WEBP and PDF files are allowed.`
        );
      }

      if (
        file.size &&
        file.size > MAX_FILE_SIZE
      ) {
        throw new Error(
          `File "${file.name}" exceeds the 10 MB size limit.`
        );
      }
    }

    // ------------------------------------------
    // Create FormData
    // ------------------------------------------

    const formData = new FormData();

    files.forEach((file) => {
      formData.append(
        "documents",
        file
      );
    });

    formData.append(
      "claimId",
      claimId
    );

    // ------------------------------------------
    // Debug information
    // ------------------------------------------

    console.log(
      "📄 Files being uploaded:"
    );

    files.forEach((file, index) => {
      console.log(
        `${index + 1}. ${file.name} (${file.type})`
      );
    });

    // ------------------------------------------
    // Upload documents
    // ------------------------------------------

    const response = await axios.post(
      `${API_URL}/documents/upload`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    console.log(
      "✅ Claim documents uploaded successfully:"
    );

    console.log(response.data);

    console.log(
      "================================="
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error uploading claim documents:",
      error.response?.data ||
        error.message ||
        error
    );

    throw error;
  }
};

// ============================================
// DELETE CLAIM
// ============================================
export const deleteClaim = async (id) => {
  try {
    console.log("=================================");
    console.log("🗑️ DELETING CLAIM");
    console.log("=================================");

    console.log("Claim ID:", id);

    // ------------------------------------------
    // Validate ID
    // ------------------------------------------

    if (!id) {
      throw new Error(
        "Claim ID is required."
      );
    }

    // ------------------------------------------
    // Delete claim
    // ------------------------------------------

    const response = await axios.delete(
      `${API_URL}/${id}`
    );

    console.log(
      "✅ Claim deleted successfully:"
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error deleting claim:",
      error.response?.data || error
    );

    throw error;
  }
};