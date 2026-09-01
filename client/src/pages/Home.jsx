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
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="home">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <div className="logo">
          <span>Forma</span>AI
        </div>

        <ul className="nav-links">
          <li>Home</li>
          <li>Features</li>
          <li>Workflow</li>
          <li>Analytics</li>
          <li>Contact</li>
        </ul>

        <div className="nav-buttons">
  <Link to="/login" className="login-btn">
    Login
  </Link>

  <Link to="/signup" className="signup-btn">
    Sign Up
  </Link>
</div>
      </nav>

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-left">

          <div className="tag">
            AI-Augmented Dynamic Form Engine
          </div>

          <h1>
            Intelligent Insurance Forms Powered by
            <span> Artificial Intelligence</span>
          </h1>

          <p>
            Forma AI automatically extracts information from insurance
            documents, pre-fills dynamic forms, validates responses,
            and simplifies workflow automation for InsurTech companies.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              Get Started
            </button>

            <button className="secondary-btn">
              Learn More
            </button>
          </div>

          <div className="hero-users">
            <FaUsers />
            <span>Trusted by 350+ organizations</span>
          </div>

        </div>

        <div className="hero-right">

          <div className="glass-card">

            <div className="ai-header">
              <FaRobot className="robot-icon" />
              <div>
                <h3>AI Document Parser</h3>
                <p>Reading Policy.pdf</p>
              </div>
            </div>

            <div className="progress">
              <div className="progress-fill"></div>
            </div>

            <small>Confidence Score • 97%</small>

            <div className="ai-fields">

              <div className="field">
                <span>Name</span>
                <strong>John Anderson</strong>
              </div>

              <div className="field">
                <span>Policy Number</span>
                <strong>INS-458926</strong>
              </div>

              <div className="field">
                <span>Date of Birth</span>
                <strong>08 Jan 1998</strong>
              </div>

              <div className="field">
                <span>Status</span>
                <strong className="success">Validated</strong>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="stats">

        <div className="stat-card">
          <h2>25K+</h2>
          <p>Forms Generated</p>
        </div>

        <div className="stat-card">
          <h2>96%</h2>
          <p>AI Accuracy</p>
        </div>

        <div className="stat-card">
          <h2>12K+</h2>
          <p>Documents Parsed</p>
        </div>

        <div className="stat-card">
          <h2>350+</h2>
          <p>Organizations</p>
        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="features">

        <div className="section-title">
          <h2>Powerful AI Features</h2>
          <p>
            Everything you need to automate insurance form processing.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <FaFileUpload className="feature-icon" />
            <h3>Smart Upload</h3>
            <p>
              Upload PDF, PNG, JPG, scanned insurance documents securely.
            </p>
          </div>

          <div className="feature-card">
            <FaBrain className="feature-icon" />
            <h3>AI Auto Fill</h3>
            <p>
              Gemini AI extracts names, IDs, addresses, and policy details.
            </p>
          </div>

          <div className="feature-card">
            <FaShieldAlt className="feature-icon" />
            <h3>Dynamic Validation</h3>
            <p>
              Detect missing information and validate fields intelligently.
            </p>
          </div>

          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <h3>Analytics Dashboard</h3>
            <p>
              Visualize completion rates and AI parsing performance.
            </p>
          </div>

          <div className="feature-card">
            <FaClock className="feature-icon" />
            <h3>Workflow Automation</h3>
            <p>
              Reduce manual work and process forms in seconds.
            </p>
          </div>

          <div className="feature-card">
            <FaCheckCircle className="feature-icon" />
            <h3>Conditional Forms</h3>
            <p>
              Display questions dynamically based on previous answers.
            </p>
          </div>

        </div>

      </section>

      {/* ================= WORKFLOW ================= */}

      <section className="workflow">

        <div className="section-title">
          <h2>How Forma AI Works</h2>
          <p>Simple AI-powered workflow for insurance automation.</p>
        </div>

        <div className="workflow-container">

          <div className="workflow-card">
            <div className="step-number">1</div>
            <h3>Upload Document</h3>
            <p>Upload policy, claim, or customer insurance documents.</p>
          </div>

          <div className="workflow-card">
            <div className="step-number">2</div>
            <h3>AI Processing</h3>
            <p>AI extracts structured information from uploaded files.</p>
          </div>

          <div className="workflow-card">
            <div className="step-number">3</div>
            <h3>Review Dynamic Form</h3>
            <p>Review auto-filled fields and edit if required.</p>
          </div>

          <div className="workflow-card">
            <div className="step-number">4</div>
            <h3>Validate & Submit</h3>
            <p>Submit verified forms with confidence scoring.</p>
          </div>

        </div>

      </section>

      {/* ================= WHY FORMA AI ================= */}

      <section className="why-forma">

        <div className="why-left">

          <h2>Why Choose Forma AI?</h2>

          <p>
            Forma AI combines Artificial Intelligence with Dynamic Form Rendering
            to reduce paperwork and improve insurance workflows.
          </p>

          <div className="why-list">

            <div className="why-item">
              <FaCheckCircle />
              <span>AI Powered Document Parsing</span>
            </div>

            <div className="why-item">
              <FaCheckCircle />
              <span>Dynamic Multi-Step Forms</span>
            </div>

            <div className="why-item">
              <FaCheckCircle />
              <span>Real-Time Validation Engine</span>
            </div>

            <div className="why-item">
              <FaCheckCircle />
              <span>Fast & Secure Workflow Automation</span>
            </div>

          </div>

        </div>

        <div className="why-right">

          <div className="dashboard-preview">

            <h3>AI Insights</h3>

            <div className="mini-chart">
              <div className="bar one"></div>
              <div className="bar two"></div>
              <div className="bar three"></div>
              <div className="bar four"></div>
            </div>

            <div className="insight">
              <span>Completion Rate</span>
              <strong>96%</strong>
            </div>

            <div className="insight">
              <span>Documents Processed</span>
              <strong>12,481</strong>
            </div>

            <div className="insight">
              <span>AI Suggestions Accepted</span>
              <strong>89%</strong>
            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="cta">

        <h2>Experience Intelligent Form Automation</h2>

        <p>
          Join organizations using Forma AI to automate insurance document
          processing with AI-powered dynamic forms.
        </p>

        <button className="cta-btn">
          Launch Forma AI
          <FaArrowRight />
        </button>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-logo">
          <span>Forma</span>AI
        </div>

        <p>
          AI-Augmented Dynamic Form Engine for InsurTech & Workflow Automation.
        </p>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/">Features</a>
          <a href="/">Privacy</a>
          <a href="/">Support</a>
        </div>

        <small>
          © 2026 Forma AI | Developed by Team Forma AI • MLRIT
        </small>

      </footer>

    </div>
  );
};

export default Home;