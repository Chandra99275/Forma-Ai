import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaRobot,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    type: "error",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

    if (popup.show) {
      setPopup({ ...popup, show: false });
    }
  };

  const closePopup = () => {
    setPopup({ ...popup, show: false });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      setPopup({
        show: true,
        title: "Missing Details",
        message: "Please enter both email and password.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: loginData.email,
          password: loginData.password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setPopup({
        show: true,
        title: "Login Successful",
        message: "Welcome back! Redirecting to your dashboard...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      setPopup({
        show: true,
        title: "Login Failed",
        message:
          "Invalid email or password. Please check your credentials and try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">

        <div className="login-left">

          <div className="brand">
            <FaRobot className="brand-icon" />
            <h1>Forma AI</h1>
          </div>

          <h2>Welcome Back 👋</h2>

          <p>
            AI-Augmented Dynamic Form Engine for InsurTech & Workflow Automation.
            Login to access your dashboard and continue automating intelligent forms.
          </p>

          <div className="login-illustration">
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>

            <div className="ai-card">
              <FaRobot className="robot-big" />
              <h3>AI Parser Ready</h3>
              <p>12,481 Documents Processed</p>
            </div>
          </div>

        </div>

        <div className="login-right">

          <div className="login-box">

            <h2>Login</h2>
            <p>Continue your Forma AI journey.</p>

            <form onSubmit={handleLogin}>

              <div className="input-box">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={loginData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-box">
                <FaLock className="input-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleChange}
                />

                {showPassword ? (
                  <FaEyeSlash
                    className="eye"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    className="eye"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>

              <div className="remember-row">
                <label>
                  <input type="checkbox" />
                  Remember me
                </label>

                <Link to="/">Forgot Password?</Link>
              </div>

              <button
                className="login-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              <button type="button" className="google-btn">
                <FaGoogle />
                Continue with Google
              </button>

            </form>

            <div className="bottom-link">
              Don't have an account?
              <Link to="/signup">
                <span> Sign Up</span>
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* Premium Popup */}
      {popup.show && (
        <div className="popup-overlay">

          <div className={`popup-card ${popup.type}`}>

            <button className="popup-close" onClick={closePopup}>
              ×
            </button>

            <div className="popup-icon">
              {popup.type === "success" ? (
                <FaCheckCircle />
              ) : (
                <FaTimesCircle />
              )}
            </div>

            <h3>{popup.title}</h3>

            <p>{popup.message}</p>

            <button className="popup-btn" onClick={closePopup}>
              OK
            </button>

          </div>

        </div>
      )}
    </>
  );
};

export default Login;