export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/signup",
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
  },
  FORMS: {
    BY_ID: (formId) => `/forms/${formId}`,
    VISIBLE_FIELDS: "/forms/visible-fields",
  },
  AI: {
    PREFILL: "/ai/prefill",
  },
  SUBMISSIONS: {
    DRAFT: "/submissions/draft",
    SUBMIT: "/submissions/submit",
    LIST: "/submissions",
  },
};
