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
    console.error("Error fetching claims:", error);
    throw error;
  }
};

// ============================================
// GET SINGLE CLAIM BY ID
// ============================================
export const getClaimById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching claim:", error);
    throw error;
  }
};

// ============================================
// SUBMIT CLAIM
// Used by DynamicForms.jsx
// ============================================
export const submitClaim = async (claimData) => {
  try {
    const response = await axios.post(API_URL, claimData);
    return response.data;
  } catch (error) {
    console.error("Error submitting claim:", error);
    throw error;
  }
};

// ============================================
// CREATE CLAIM
// ============================================
export const createClaim = async (claimData) => {
  try {
    const response = await axios.post(API_URL, claimData);
    return response.data;
  } catch (error) {
    console.error("Error creating claim:", error);
    throw error;
  }
};

// ============================================
// UPDATE CLAIM
// ============================================
export const updateClaim = async (id, claimData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, claimData);
    return response.data;
  } catch (error) {
    console.error("Error updating claim:", error);
    throw error;
  }
};

// ============================================
// DELETE CLAIM
// ============================================
export const deleteClaim = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting claim:", error);
    throw error;
  }
};