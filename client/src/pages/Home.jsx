import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

import {
  FaRobot,
  FaFileUpload,
  FaShieldAlt,
  FaChartLine,
  FaArrowRight,
  FaBrain,
  FaCheckCircle,
  FaUsers,
  FaClock,
  FaHeartbeat,
  FaCarCrash,
  FaHome,
  FaPlaneDeparture,
  FaUserShield,
  FaBuilding,
  FaMagic,
  FaFileMedical,
  FaLock,
  FaGlobe,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="home">

      {/* ================= PREMIUM NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          <FaRobot className="logo-icon" />
          <span>Forma</span>AI
        </div>

        <ul className="nav-links">
          <li>Home</li>
          <li>Features</li>
          <li>Insurance Forms</li>
          <li>AI Parser</li>
          <li>Analytics</li>
          <li>Contact</li>
        </ul>

        <div className="nav-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/signup" className="signup-btn">
            Get Started
          </Link>
        </div>

      </nav>

      {/* ================= HERO SECTION ================= */}

      <section className="hero">

        {/* Left Content */}

        <div className="hero-left">

          <div className="tag">
            ✨ AI-Augmented Dynamic Form Engine
          </div>

          <h1>
            Automate Insurance Claims with
            <span> Artificial Intelligence</span>
          </h1>

          <p>
            Forma AI is a next-generation InsurTech platform that reads insurance
            documents, extracts policy information using AI, generates dynamic
            forms, validates responses, and submits claims faster than ever.
          </p>

          <div className="hero-buttons">

            <Link to="/signup" className="primary-btn">
              Start Free
            </Link>

            <Link to="/ai-parser" className="secondary-btn">
              Try AI Parser
            </Link>

          </div>

          <div className="hero-users">

            <FaUsers />

            <span>Trusted by 350+ Insurance Agencies & Organizations</span>

          </div>

          <div className="hero-features">

            <div>
              <FaCheckCircle />
              AI OCR Extraction
            </div>

            <div>
              <FaCheckCircle />
              Dynamic Smart Forms
            </div>

            <div>
              <FaCheckCircle />
              Secure Claim Processing
            </div>

          </div>

        </div>

        {/* Right AI Preview */}

        <div className="hero-right">

          <div className="glass-card">

            <div className="ai-header">

              <FaRobot className="robot-icon" />

              <div>
                <h3>AI Insurance Parser</h3>
                <p>Reading VehicleClaim.pdf</p>
              </div>

            </div>

            <div className="progress">
              <div className="progress-fill"></div>
            </div>

            <small>AI Confidence • 97%</small>

            <div className="ai-fields">

              <div className="field">
                <span>Claim Type</span>
                <strong>Vehicle Accident</strong>
              </div>

              <div className="field">
                <span>Policy Number</span>
                <strong>INS-458926</strong>
              </div>

              <div className="field">
                <span>Claim Amount</span>
                <strong>₹48,500</strong>
              </div>

              <div className="field">
                <span>Status</span>
                <strong className="success">Verified</strong>
              </div>

            </div>

            <button className="parse-btn">
              <FaMagic />
              Parse Complete
            </button>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="stats">

        <div className="stat-card">
          <h2>25K+</h2>
          <p>Insurance Forms Generated</p>
        </div>

        <div className="stat-card">
          <h2>96%</h2>
          <p>AI Parsing Accuracy</p>
        </div>

        <div className="stat-card">
          <h2>12K+</h2>
          <p>Documents Parsed</p>
        </div>

        <div className="stat-card">
          <h2>350+</h2>
          <p>Insurance Organizations</p>
        </div>

      </section>

      {/* ================= INSURANCE CATEGORIES ================= */}

      <section className="insurance-categories">

        <div className="section-title">
          <h2>Insurance Forms Supported</h2>

          <p>
            AI-powered dynamic forms for multiple insurance categories.
          </p>
        </div>

        <div className="category-grid">

          <Link to="/dynamic-forms" className="category-card health">

            <FaHeartbeat className="category-icon" />

            <h3>Health Insurance</h3>

            <p>
              Medical reimbursement, hospitalization claims, OPD claims, critical
              illness, family health insurance.
            </p>

            <span>20+ Dynamic Fields →</span>

          </Link>

          <Link to="/dynamic-forms" className="category-card vehicle">

            <FaCarCrash className="category-icon" />

            <h3>Vehicle Insurance</h3>

            <p>
              Car accident claims, bike insurance, windshield damage, theft,
              third-party claims.
            </p>

            <span>25+ AI Questions →</span>

          </Link>

          <Link to="/dynamic-forms" className="category-card property">

            <FaHome className="category-icon" />

            <h3>Property Insurance</h3>

            <p>
              Fire damage, flood claims, home theft, building insurance,
              commercial property.
            </p>

            <span>18+ Conditional Questions →</span>

          </Link>

          <Link to="/dynamic-forms" className="category-card travel">

            <FaPlaneDeparture className="category-icon" />

            <h3>Travel Insurance</h3>

            <p>
              Flight cancellation, baggage loss, medical emergencies, visa claim
              insurance.
            </p>

            <span>15+ Smart Sections →</span>

          </Link>

          <Link to="/dynamic-forms" className="category-card life">

            <FaUserShield className="category-icon" />

            <h3>Life Insurance</h3>

            <p>
              Death claims, nominee verification, maturity settlement, term
              insurance.
            </p>

            <span>AI Document Validation →</span>

          </Link>

          <Link to="/dynamic-forms" className="category-card business">

            <FaBuilding className="category-icon" />

            <h3>Business Insurance</h3>

            <p>
              Employee insurance, equipment damage, business interruption, cyber
              insurance.
            </p>

            <span>Enterprise Workflow →</span>

          </Link>

        </div>

      </section>

      {/* Continue in Part 2 */}
    </div>
  );
};

export default Home;