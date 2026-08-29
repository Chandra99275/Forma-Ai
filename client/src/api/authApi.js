import apiClient from "./apiClient.js";
import { API_ENDPOINTS } from "./endpoints.js";

const authApi = {
  register: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  login: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },
};

export default authApi;
