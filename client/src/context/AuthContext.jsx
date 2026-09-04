import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("formaUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  // Save user in localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("formaUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("formaUser");
    }
  }, [user]);

  // Register User
  const register = async (userData) => {
    try {
      setLoading(true);

      const { data } = await API.post("/auth/register", userData);

      setUser(data);
      navigate("/dashboard");

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Registration failed.",
      };
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const login = async (credentials) => {
    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", credentials);

      setUser(data);
      navigate("/dashboard");

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Invalid email or password.",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout User
  const logout = () => {
    setUser(null);
    localStorage.removeItem("formaUser");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);