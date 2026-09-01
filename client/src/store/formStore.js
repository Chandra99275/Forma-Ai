import { create } from "zustand";

const useFormStore = create((set) => ({
  // State
  formSchema: null,
  answers: {},
  aiPrefillData: null,
  loading: false,
  error: null,

  // Actions
  setFormSchema: (formSchema) =>
    set({
      formSchema,
      error: null,
    }),

  setAnswers: (answers) =>
    set((state) => ({
      answers: typeof answers === "function" ? answers(state.answers) : answers,
    })),

  updateAnswer: (fieldId, value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [fieldId]: value,
      },
    })),

  setAiPrefillData: (aiPrefillData) =>
    set({
      aiPrefillData,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  resetForm: () =>
    set({
      formSchema: null,
      answers: {},
      aiPrefillData: null,
      loading: false,
      error: null,
    }),
}));

export { useFormStore };
export default useFormStore;
