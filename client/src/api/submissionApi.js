import apiClient from "./apiClient.js";
import { API_ENDPOINTS } from "./endpoints.js";

const submissionApi = {
  saveDraft: async (formId, answers) => {
    const response = await apiClient.post(API_ENDPOINTS.SUBMISSIONS.DRAFT, {
      formId,
      answers,
    });
    return response.data;
  },

  submitForm: async (formId, answers) => {
    const response = await apiClient.post(API_ENDPOINTS.SUBMISSIONS.SUBMIT, {
      formId,
      answers,
    });
    return response.data;
  },

  getSubmissions: async () => {
    const response = await apiClient.get(API_ENDPOINTS.SUBMISSIONS.LIST);
    return response.data;
  },
};

export default submissionApi;
