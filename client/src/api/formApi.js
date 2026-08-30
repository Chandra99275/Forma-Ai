import apiClient from "./apiClient.js";
import { API_ENDPOINTS } from "./endpoints.js";

const formApi = {
  getFormSchema: async (formId) => {
    const response = await apiClient.get(API_ENDPOINTS.FORMS.BY_ID(formId));
    return response.data;
  },

  getVisibleFields: async (formId, answers) => {
    const response = await apiClient.post(API_ENDPOINTS.FORMS.VISIBLE_FIELDS, {
      formId,
      answers,
    });
    return response.data;
  },
};

export default formApi;
