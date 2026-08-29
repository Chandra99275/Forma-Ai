import apiClient from "./apiClient.js";
import { API_ENDPOINTS } from "./endpoints.js";

const aiApi = {
  prefillForm: async (description) => {
    const response = await apiClient.post(API_ENDPOINTS.AI.PREFILL, {
      description,
    });
    return response.data;
  },
};

export default aiApi;
