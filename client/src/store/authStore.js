import { create } from "zustand";

const useAuthStore = create((set) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Actions
  setAuth: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: Boolean(token),
      error: null,
    }),

  setUser: (user) =>
    set({
      user,
    }),

  setToken: (token) =>
    set({
      token,
      isAuthenticated: Boolean(token),
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),
}));

export { useAuthStore };
export default useAuthStore;
