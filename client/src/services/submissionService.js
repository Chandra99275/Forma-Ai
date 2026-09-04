import API from "./api";

export const saveDraft = async (payload) => {
  const response = await API.post("/submissions/draft", payload);
  return response.data;
};

export const submitForm = async (payload) => {
  const response = await API.post("/submissions/submit", payload);
  return response.data;
};