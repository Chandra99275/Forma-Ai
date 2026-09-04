import API from "./api";

export const getForms = async () => {
  const response = await API.get("/forms");
  return response.data;
};

export const getFormById = async (id) => {
  const response = await API.get(`/forms/${id}`);
  return response.data;
};