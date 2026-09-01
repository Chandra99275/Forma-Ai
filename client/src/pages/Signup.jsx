import React, { useState } from "react";
import "./signup.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaGoogle,
  FaRobot,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  // Popup State
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    type: "error",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (popup.show) {
      setPopup({ ...popup, show: false });
    }
  };

  const closePopup = () => {
    setPopup({ ...popup, show: false });
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.mobile ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setPopup({
        show: true,
        title: "Missing Information",
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    if (formData.mobile.length !== 10) {
      setPopup({
        show: true,
        title: "Invalid Mobile Number",
        message: "Mobile number must contain exactly 10 digits.",
        type: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPopup({
        show: true,
        title: "Password Mismatch",
        message: "Password and Confirm Password do not match.",
        type: "error",
      });
      return;
    }

    if (formData.password.length < 6) {
      setPopup({
        show: true,
        title: "Weak Password",
        message: "Password must be at least 6 characters long.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
        }
      );

      // Save JWT Token
      localStorage.setItem("token", response.data.token);

      // Save User
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Success Popup
      setPopup({
        show: true,
        title: "Account Created 🎉",
        message: "Your Forma AI account has been created successfully.",
        type: "success",
      });

      // Redirect Dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      const backendMessage = err.response?.data?.message || "";

      // Email Already Exists Popup
      if (
        backendMessage.toLowerCase().includes("already") ||
        backendMessage.toLowerCase().includes("exists")
      ) {
        setPopup({
          show: true,
          title: "Email Already Exists",
          message:
            "This email is already registered with Forma AI. Please login or use a different email address.",
          type: "error",
        });
      } else {
        setPopup({
          show: true,
          title: "Signup Failed",
          message: backendMessage || "Unable to create account. Please try again.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="signup-page">

        {/* Left Section */}
        <div className="signup-left">

          <div className="brand">
            <FaRobot className="brand-icon" />
            <h1>Forma AI</h1>
          </div>

          <h2>Create Your Account 🚀</h2>

          <p>
            Join Forma AI and automate insurance workflows using AI-powered
            document parsing and dynamic forms.
          </p>

          <div className="signup-stats">

            <div className="mini-card">
              <h3>96%</h3>
              <span>AI Accuracy</span>
            </div>

            <div className="mini-card">
              <h3>25K+</h3>
              <span>Forms Generated</span>
            </div>

            <div className="mini-card">
              <h3>350+</h3>
              <span>Organizations</span>
            </div>

          </div>

        </div>

        {/* Right Section */}
        <div className="signup-right">

          <div className="signup-box">

            <h2>Sign Up</h2>
            <p>Create your Forma AI account</p>

            <form onSubmit={handleSignup}>

              {/* Full Name */}
              <div className="input-box">
                <FaUser />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="input-box">
                <FaEnvelope />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Mobile */}
              <div className="input-box">
                <FaPhone />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength="10"
                />
              </div>

              {/* Password */}
              <div className="input-box">
                <FaLock />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
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

              {/* Confirm Password */}
              <div className="input-box">
                <FaLock />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                {showConfirmPassword ? (
                  <FaEyeSlash
                    className="eye"
                    onClick={() => setShowConfirmPassword(false)}
                  />
                ) : (
                  <FaEye
                    className="eye"
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )}
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="signup-submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              {/* Google Button */}
              <button type="button" className="google-btn">
                <FaGoogle />
                Sign up with Google
              </button>

            </form>

            {/* Login Link */}
            <div className="bottom-link">
              Already have an account?
              <Link to="/login">
                <span> Login</span>
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

export default Signup;