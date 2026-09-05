import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuthStore } from "../store";

import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaRobot,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaShieldAlt,
  FaBolt,
  FaFileAlt,
  FaCheck,
  FaBrain,
  FaChartLine,
  FaUserShield,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

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
      setPopup({
        ...popup,
        show: false,
      });
    }
  };

  const closePopup = () => {
    setPopup({
      ...popup,
      show: false,
    });
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

      // Backend authentication logic remains unchanged
      const data = await authApi.login({
        email: loginData.email,
        password: loginData.password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setAuth(data.user, data.token);

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
      const backendMessage =
        err.response?.data?.message ||
        "Invalid email or password. Please check your credentials and try again.";

      setPopup({
        show: true,
        title: "Login Failed",
        message: backendMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ================= BACKGROUND ================= */}

      <div className="login-bg">
        <div className="login-orb login-orb-one"></div>
        <div className="login-orb login-orb-two"></div>
        <div className="login-orb login-orb-three"></div>

        <div className="grid-pattern"></div>
      </div>

      {/* ================= LEFT PANEL ================= */}

      <section className="login-left">

        {/* Brand */}

        <Link to="/" className="login-brand">
          <div className="brand-logo">
            <FaRobot />
          </div>

          <div className="brand-content">
            <span className="brand-name">Forma AI</span>
            <span className="brand-tagline">
              INSURANCE INTELLIGENCE
            </span>
          </div>
        </Link>

        {/* Hero Content */}

        <div className="login-left-content">

          <div className="login-badge">
            <span className="badge-pulse"></span>
            AI-Powered InsurTech Platform
          </div>

          <h1>
            Welcome
            <span> Back.</span>
          </h1>

          <p className="login-description">
            Sign in to your Forma AI workspace and continue
            transforming complex insurance workflows with
            intelligent automation.
          </p>

          {/* Features */}

          <div className="login-features">

            <div className="login-feature">
              <div className="feature-icon">
                <FaBrain />
              </div>

              <div>
                <strong>AI-Powered Processing</strong>
                <span>
                  Extract and structure information automatically.
                </span>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">
                <FaBolt />
              </div>

              <div>
                <strong>Lightning Fast</strong>
                <span>
                  Process insurance documents in seconds.
                </span>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>Secure by Design</strong>
                <span>
                  Enterprise-grade workflow security.
                </span>
              </div>
            </div>

          </div>

          {/* AI Dashboard Preview */}

          <div className="login-dashboard-preview">

            <div className="preview-header">

              <div className="preview-title">
                <div className="preview-icon">
                  <FaRobot />
                </div>

                <div>
                  <strong>Forma AI Engine</strong>
                  <span>Intelligent document processing</span>
                </div>
              </div>

              <div className="preview-status">
                <span></span>
                Online
              </div>

            </div>

            <div className="preview-document">

              <div className="document-icon">
                <FaFileAlt />
              </div>

              <div className="document-info">
                <strong>VehicleClaim.pdf</strong>
                <span>AI extraction completed</span>
              </div>

              <FaCheckCircle className="document-check" />

            </div>

            <div className="preview-progress">

              <div className="progress-heading">
                <span>AI Processing</span>
                <strong>98.4%</strong>
              </div>

              <div className="progress-track">
                <div className="progress-fill"></div>
              </div>

            </div>

            <div className="preview-fields">

              <div className="mini-field">
                <span>Claim Type</span>
                <strong>Vehicle Accident</strong>
                <FaCheck />
              </div>

              <div className="mini-field">
                <span>Vehicle</span>
                <strong>Honda City</strong>
                <FaCheck />
              </div>

            </div>

          </div>

          {/* Floating Statistics */}

          <div className="floating-stat floating-stat-one">
            <div className="floating-icon green">
              <FaChartLine />
            </div>

            <div>
              <strong>98.4%</strong>
              <span>AI Accuracy</span>
            </div>
          </div>

          <div className="floating-stat floating-stat-two">
            <div className="floating-icon purple">
              <FaBolt />
            </div>

            <div>
              <strong>1.2 sec</strong>
              <span>Avg. Processing</span>
            </div>
          </div>

        </div>

        {/* Bottom Trust */}

        <div className="login-trust">

          <div className="trust-item">
            <FaCheckCircle />
            Secure Processing
          </div>

          <div className="trust-item">
            <FaCheckCircle />
            AI Automation
          </div>

          <div className="trust-item">
            <FaCheckCircle />
            Enterprise Ready
          </div>

        </div>

      </section>


      {/* ================= RIGHT PANEL ================= */}

      <section className="login-right">

        <div className="login-box">

          {/* Mobile Brand */}

          <Link to="/" className="mobile-brand">
            <div className="brand-logo">
              <FaRobot />
            </div>

            <span>Forma AI</span>
          </Link>


          {/* Header */}

          <div className="login-header">

            <div className="welcome-icon">
              <FaUserShield />
            </div>

            <div>
              <span className="login-small-title">
                SECURE ACCESS
              </span>

              <h2>Sign in to your account</h2>

              <p>
                Enter your credentials to continue to Forma AI.
              </p>
            </div>

          </div>


          {/* Form */}

          <form onSubmit={handleLogin}>

            {/* Email */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-box">

                <FaEnvelope className="input-icon" />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

              </div>

            </div>


            {/* Password */}

            <div className="form-group">

              <div className="password-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <Link to="/">
                  Forgot Password?
                </Link>

              </div>

              <div className="input-box">

                <FaLock className="input-icon" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>


            {/* Remember */}

            <div className="remember-row">

              <label className="remember-label">

                <input type="checkbox" />

                <span className="custom-checkbox">
                  <FaCheck />
                </span>

                <span>Remember me</span>

              </label>

              <span className="session-text">
                Keep me signed in
              </span>

            </div>


            {/* Login Button */}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight />
                </>
              )}

            </button>


            {/* Divider */}

            <div className="divider">
              <span></span>
              <p>OR CONTINUE WITH</p>
              <span></span>
            </div>


            {/* Google */}

            <button
              type="button"
              className="google-btn"
            >
              <span className="google-icon">
                <FaGoogle />
              </span>

              <span>Continue with Google</span>
            </button>

          </form>


          {/* Signup */}

          <div className="bottom-link">

            <span>Don't have an account?</span>

            <Link to="/signup">
              Create an account
              <FaArrowRight />
            </Link>

          </div>


          {/* Security */}

          <div className="security-note">

            <FaShieldAlt />

            <span>
              Your information is protected with
              secure authentication.
            </span>

          </div>

        </div>

      </section>


      {/* ================= POPUP ================= */}

      {popup.show && (

        <div
          className="popup-overlay"
          onClick={closePopup}
        >

          <div
            className={`popup-card ${popup.type}`}
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="popup-close"
              onClick={closePopup}
              aria-label="Close"
            >
              ×
            </button>

            <div className="popup-icon">

              {popup.type === "success" ? (
                <FaCheckCircle />
              ) : (
                <FaTimesCircle />
              )}

            </div>

            <div className="popup-content">

              <span className="popup-label">
                {popup.type === "success"
                  ? "SUCCESS"
                  : "AUTHENTICATION ERROR"}
              </span>

              <h3>{popup.title}</h3>

              <p>{popup.message}</p>

            </div>

            <button
              className="popup-btn"
              onClick={closePopup}
            >
              Continue
              <FaArrowRight />
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Login;