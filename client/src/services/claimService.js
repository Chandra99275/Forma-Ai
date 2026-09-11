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
// Sends:
//
// POST /api/claims/:id/submit
//
// Example:
//
// submitClaim("6aa38607933eaccbcb221c69");
//
// This is different from createClaim().
//
// createClaim():
// POST /api/claims
//
// submitClaim():
// POST /api/claims/:id/submit
// ============================================
export const submitClaim = async (claimId) => {
  try {
    console.log(
      "================================="
    );
    console.log("📤 SUBMITTING EXISTING CLAIM");
    console.log(
      "================================="
    );

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
      error.response?.data || error.message || error
    );

    throw error;
  }
};

// ============================================
// CREATE CLAIM
// ============================================
// category = "vehicle" | "health" | "property"
//           | "travel" | "life"
//
// claimData = actual form information
//
// Backend receives:
//
// {
//   category: "vehicle",
//   claimData: {
//     ...
//   }
// }
// ============================================
export const createClaim = async (
  claimData,
  category
) => {
  try {
    console.log(
      "================================="
    );
    console.log("📤 CREATING CLAIM");
    console.log(
      "================================="
    );

    console.log(
      "Category:",
      category
    );

    console.log(
      "Claim Data:",
      claimData
    );

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

    const normalizedCategory =
      String(category)
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

    console.log(
      "📦 Request Body:"
    );

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
// Sends:
//
// PUT /api/claims/:id
//
// Body:
//
// {
//   claimData: {
//     ...
//   }
// }
// ============================================
export const updateClaim = async (
  id,
  claimData
) => {
  try {
    console.log(
      "================================="
    );
    console.log("📤 UPDATING CLAIM");
    console.log(
      "================================="
    );

    console.log(
      "Claim ID:",
      id
    );

    console.log(
      "Claim Data:",
      claimData
    );

    // ------------------------------------------
    // Validate ID
    // ------------------------------------------

    if (!id) {
      throw new Error(
        "Claim ID is required."
      );
    }

    // ------------------------------------------
    // Update claim
    // ------------------------------------------

    const response = await axios.put(
      `${API_URL}/${id}`,
      {
        claimData: claimData || {},
      }
    );

    console.log(
      "✅ Claim updated successfully:"
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating claim:",
      error.response?.data || error
    );

    throw error;
  }
};

// ============================================
// DELETE CLAIM
// ============================================
export const deleteClaim = async (id) => {
  try {
    console.log(
      "================================="
    );
    console.log("🗑️ DELETING CLAIM");
    console.log(
      "================================="
    );

    console.log(
      "Claim ID:",
      id
    );

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