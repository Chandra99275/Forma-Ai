import { create } from "zustand";

const getInitialUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const storedToken = localStorage.getItem("token");

const useAuthStore = create((set) => ({
  // State
  user: getInitialUser(),
  token: storedToken || null,
  isAuthenticated: Boolean(storedToken),
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

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

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
