import axios from "axios";

// =====================================================
// AXIOS INSTANCE
// =====================================================

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// JWT TOKEN INTERCEPTOR
// =====================================================

API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("❌ Error reading token from localStorage:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

API.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error(
      "❌ API Error:",
      error.response?.status,
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

// =====================================================
// AI API
// =====================================================

export const aiApi = {
  /**
   * Send incident description to Gemini AI
   */
  prefillForm: async (description) => {
    try {
      if (!description || !description.trim()) {
        throw new Error("Incident description is required.");
      }

      console.log("🤖 Sending description to Forma AI...");

      const response = await API.post("/ai/parse-description", {
        description: description.trim(),
      });

      console.log("✅ Forma AI Response:", response.data);

      return response.data;
    } catch (error) {
      console.error(
        "❌ AI Parse Error:",
        error.response?.data || error.message
      );

      throw error;
    }
  },
};

// =====================================================
// CLAIM API
// =====================================================

/**
 * Create a new claim
 */
export const createClaim = async (claimData, category) => {
  try {
    const normalizedCategory = String(category || "")
      .trim()
      .toLowerCase();

    const allowedCategories = [
      "health",
      "vehicle",
      "property",
      "travel",
      "life",
    ];

    if (!allowedCategories.includes(normalizedCategory)) {
      throw new Error(
        `Invalid insurance category: ${normalizedCategory}`
      );
    }

    console.log("📝 Creating claim...");
    console.log("Category:", normalizedCategory);
    console.log("Claim Data:", claimData);

    const response = await API.post("/claims", {
      category: normalizedCategory,
      claimData: claimData || {},
    });

    console.log("✅ Claim Created:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Create Claim Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Get all claims
 */
export const getClaims = async () => {
  try {
    const response = await API.get("/claims");

    return response.data;
  } catch (error) {
    console.error(
      "❌ Get Claims Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Get single claim
 */
export const getClaimById = async (claimId) => {
  try {
    if (!claimId) {
      throw new Error("Claim ID is required.");
    }

    const response = await API.get(`/claims/${claimId}`);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Get Claim Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Update claim
 */
export const updateClaim = async (claimId, claimData) => {
  try {
    if (!claimId) {
      throw new Error("Claim ID is required.");
    }

    const response = await API.put(`/claims/${claimId}`, {
      claimData: claimData || {},
    });

    return response.data;
  } catch (error) {
    console.error(
      "❌ Update Claim Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Submit claim
 */
export const submitClaim = async (claimId) => {
  try {
    if (!claimId) {
      throw new Error("Claim ID is required.");
    }

    console.log("📤 Submitting claim:", claimId);

    const response = await API.post(
      `/claims/${claimId}/submit`
    );

    console.log("✅ Claim Submitted:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Submit Claim Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Delete claim
 */
export const deleteClaim = async (claimId) => {
  try {
    if (!claimId) {
      throw new Error("Claim ID is required.");
    }

    const response = await API.delete(`/claims/${claimId}`);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Delete Claim Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =====================================================
// DOCUMENT UPLOAD API
// =====================================================

/**
 * Upload claim documents
 *
 * Expected backend endpoint:
 * POST /api/documents/upload
 *
 * Form fields:
 * claimId
 * documents[]
 */
export const uploadClaimDocuments = async (
  claimId,
  files = []
) => {
  try {
    if (!claimId) {
      throw new Error(
        "Claim ID is required to upload documents."
      );
    }

    if (!files || files.length === 0) {
      console.log("ℹ️ No documents selected.");

      return null;
    }

    const formData = new FormData();

    formData.append("claimId", claimId);

    files.forEach((file) => {
      formData.append("documents", file);
    });

    console.log(
      `📎 Uploading ${files.length} document(s)...`
    );

    const response = await API.post(
      "/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(
      "✅ Documents uploaded:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Document Upload Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =====================================================
// EXPORT
// =====================================================

export default API;