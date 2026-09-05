import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

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
  FaLock,
  FaGlobe,
  FaBolt,
  FaChevronRight,
  FaPlay,
  FaStar,
  FaDatabase,
  FaLayerGroup,
  FaClipboardCheck,
  FaCogs,
} from "react-icons/fa";

const Home = () => {
  const categories = [
    {
      title: "Health Insurance",
      description:
        "Hospitalization, medical reimbursement, OPD, critical illness and family health claims.",
      icon: <FaHeartbeat />,
      fields: "20+ Dynamic Fields",
      className: "health",
    },
    {
      title: "Vehicle Insurance",
      description:
        "Accident claims, theft, windshield damage, third-party and vehicle repair claims.",
      icon: <FaCarCrash />,
      fields: "25+ AI Questions",
      className: "vehicle",
    },
    {
      title: "Property Insurance",
      description:
        "Fire, flood, theft, building damage and commercial property insurance workflows.",
      icon: <FaHome />,
      fields: "18+ Conditional Questions",
      className: "property",
    },
    {
      title: "Travel Insurance",
      description:
        "Flight cancellation, baggage loss, medical emergencies and travel claims.",
      icon: <FaPlaneDeparture />,
      fields: "15+ Smart Sections",
      className: "travel",
    },
    {
      title: "Life Insurance",
      description:
        "Death claims, nominee verification, maturity settlement and term insurance.",
      icon: <FaUserShield />,
      fields: "AI Document Validation",
      className: "life",
    },
    {
      title: "Business Insurance",
      description:
        "Employee insurance, equipment damage, business interruption and cyber insurance.",
      icon: <FaBuilding />,
      fields: "Enterprise Workflow",
      className: "business",
    },
  ];

  const features = [
    {
      icon: <FaBrain />,
      title: "AI Document Intelligence",
      description:
        "Extract policy numbers, customer details, claim information and other fields automatically.",
    },
    {
      icon: <FaLayerGroup />,
      title: "Dynamic Form Engine",
      description:
        "Build intelligent multi-step forms that adapt according to user responses.",
    },
    {
      icon: <FaClipboardCheck />,
      title: "Smart Validation",
      description:
        "Detect missing, inconsistent and invalid information before submission.",
    },
    {
      icon: <FaCogs />,
      title: "Workflow Automation",
      description:
        "Turn complex insurance workflows into fast, structured digital processes.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Processing",
      description:
        "Designed with secure document handling and privacy-focused workflows.",
    },
    {
      icon: <FaChartLine />,
      title: "Real-Time Analytics",
      description:
        "Track form completion, AI confidence, processing time and workflow performance.",
    },
  ];

  return (
    <div className="home">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav className="navbar">

        <Link to="/" className="logo">

          <div className="logo-mark">
            <FaRobot />
          </div>

          <div className="logo-text">
            Forma<span>AI</span>
            <small>INSURANCE INTELLIGENCE</small>
          </div>

        </Link>

        <ul className="nav-links">

          <li>
            <a href="#home">Home</a>
          </li>

          <li>
            <a href="#features">Features</a>
          </li>

          <li>
            <a href="#insurance">Insurance Forms</a>
          </li>

          <li>
            <Link to="/ai-parser">AI Parser</Link>
          </li>

          <li>
            <Link to="/analytics">Analytics</Link>
          </li>

          <li>
            <a href="#contact">Contact</a>
          </li>

        </ul>

        <div className="nav-buttons">

          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="signup-btn"
          >
            Get Started
            <FaArrowRight />
          </Link>

        </div>

      </nav>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-background-orb orb-one"></div>
        <div className="hero-background-orb orb-two"></div>

        {/* LEFT */}

        <div className="hero-left">

          <div className="hero-badge">
            <span className="badge-dot"></span>
            AI-Powered InsurTech Platform
            <FaChevronRight />
          </div>

          <h1>
            Transform Insurance
            <br />

            <span>
              Workflows with AI
            </span>
          </h1>

          <p>
            Forma AI intelligently reads insurance documents,
            extracts structured information, generates dynamic
            forms, validates responses and accelerates claim
            processing.
          </p>

          <div className="hero-buttons">

            <Link
              to="/signup"
              className="hero-primary"
            >
              Start Free
              <FaArrowRight />
            </Link>

            <Link
              to="/ai-parser"
              className="hero-secondary"
            >
              <span className="play-icon">
                <FaPlay />
              </span>
              Try AI Parser
            </Link>

          </div>

          <div className="hero-trust">

            <div className="trust-icons">
              <span>
                <FaUsers />
              </span>

              <span>
                <FaShieldAlt />
              </span>

              <span>
                <FaCheckCircle />
              </span>
            </div>

            <div>
              <strong>
                Trusted by 350+ organizations
              </strong>

              <p>
                Built for modern insurance workflows
              </p>
            </div>

          </div>

          <div className="hero-checks">

            <div>
              <FaCheckCircle />
              No credit card required
            </div>

            <div>
              <FaCheckCircle />
              AI-powered automation
            </div>

            <div>
              <FaCheckCircle />
              Secure processing
            </div>

          </div>

        </div>

        {/* RIGHT AI CARD */}

        <div className="hero-right">

          <div className="floating-card floating-top">

            <div className="floating-icon green">
              <FaCheckCircle />
            </div>

            <div>
              <strong>98.4%</strong>
              <span>AI Accuracy</span>
            </div>

          </div>

          <div className="ai-dashboard-card">

            <div className="ai-card-header">

              <div className="ai-brand">

                <div className="ai-brand-icon">
                  <FaRobot />
                </div>

                <div>
                  <strong>Forma AI Engine</strong>
                  <span>
                    Intelligent document processing
                  </span>
                </div>

              </div>

              <div className="live-status">
                <span></span>
                LIVE
              </div>

            </div>

            <div className="document-preview">

              <div className="document-top">

                <div className="document-file">
                  <div className="file-icon">
                    <FaFileUpload />
                  </div>

                  <div>
                    <strong>
                      VehicleClaim.pdf
                    </strong>

                    <span>
                      2.4 MB • PDF Document
                    </span>
                  </div>
                </div>

                <span className="verified">
                  <FaCheckCircle />
                  Verified
                </span>

              </div>

              <div className="processing-bar">

                <div className="processing-label">
                  <span>
                    AI extracting information
                  </span>

                  <strong>
                    97%
                  </strong>
                </div>

                <div className="processing-track">
                  <div className="processing-value"></div>
                </div>

              </div>

            </div>

            <div className="extracted-title">
              Extracted Information
              <span>6 fields</span>
            </div>

            <div className="ai-fields">

              <div className="ai-field">
                <span>Claim Type</span>
                <strong>Vehicle Accident</strong>
                <FaCheckCircle />
              </div>

              <div className="ai-field">
                <span>Policy Number</span>
                <strong>INS-458926</strong>
                <FaCheckCircle />
              </div>

              <div className="ai-field">
                <span>Claim Amount</span>
                <strong>₹48,500</strong>
                <FaCheckCircle />
              </div>

              <div className="ai-field">
                <span>Vehicle</span>
                <strong>Honda City</strong>
                <FaCheckCircle />
              </div>

            </div>

            <div className="ai-complete">

              <div className="complete-icon">
                <FaMagic />
              </div>

              <div>
                <strong>
                  Parsing Complete
                </strong>

                <span>
                  Ready to generate dynamic form
                </span>
              </div>

              <FaArrowRight />

            </div>

          </div>

          <div className="floating-card floating-bottom">

            <div className="floating-icon purple">
              <FaBolt />
            </div>

            <div>
              <strong>1.2 sec</strong>
              <span>Avg. Processing</span>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          STATS
      ====================================================== */}

      <section className="stats">

        <div className="stat-card">

          <div className="stat-number">
            25K<span>+</span>
          </div>

          <p>Forms Generated</p>

        </div>

        <div className="stat-card">

          <div className="stat-number">
            96<span>%</span>
          </div>

          <p>AI Parsing Accuracy</p>

        </div>

        <div className="stat-card">

          <div className="stat-number">
            12K<span>+</span>
          </div>

          <p>Documents Processed</p>

        </div>

        <div className="stat-card">

          <div className="stat-number">
            350<span>+</span>
          </div>

          <p>Organizations</p>

        </div>

      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section
        className="features-section"
        id="features"
      >

        <div className="section-title">

          <span className="section-badge">
            POWERFUL PLATFORM
          </span>

          <h2>
            Everything You Need to
            <span> Automate Insurance</span>
          </h2>

          <p>
            One intelligent platform for document processing,
            dynamic forms, validation and insurance workflow
            automation.
          </p>

        </div>

        <div className="features-grid">

          {features.map((feature, index) => (
            <div
              className="feature-card"
              key={index}
            >

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.description}
              </p>

              <Link to="/signup">
                Explore feature
                <FaArrowRight />
              </Link>

            </div>
          ))}

        </div>

      </section>

      {/* =====================================================
          INSURANCE CATEGORIES
      ====================================================== */}

      <section
        className="insurance-section"
        id="insurance"
      >

        <div className="section-title">

          <span className="section-badge">
            INSURANCE WORKFLOWS
          </span>

          <h2>
            One Platform.
            <span> Every Insurance Category.</span>
          </h2>

          <p>
            Build intelligent forms for different insurance
            workflows with conditional questions and AI
            assistance.
          </p>

        </div>

        <div className="category-grid">

          {categories.map((category, index) => (

            <Link
              to="/dynamic-forms"
              className={`category-card ${category.className}`}
              key={index}
            >

              <div className="category-top">

                <div className="category-icon">
                  {category.icon}
                </div>

                <div className="category-arrow">
                  <FaArrowRight />
                </div>

              </div>

              <h3>
                {category.title}
              </h3>

              <p>
                {category.description}
              </p>

              <div className="category-footer">

                <span>
                  {category.fields}
                </span>

                <FaChevronRight />

              </div>

            </Link>

          ))}

        </div>

      </section>

      {/* =====================================================
          AI WORKFLOW
      ====================================================== */}

      <section className="workflow-section">

        <div className="workflow-content">

          <div className="workflow-text">

            <span className="section-badge">
              HOW IT WORKS
            </span>

            <h2>
              From Document to
              <span> Completed Form</span>
              <br />
              in Seconds.
            </h2>

            <p>
              Forma AI combines document intelligence,
              dynamic form rendering and validation into one
              seamless workflow.
            </p>

            <div className="workflow-list">

              <div className="workflow-step">

                <div className="workflow-number">
                  01
                </div>

                <div>
                  <h3>Upload Document</h3>
                  <p>
                    Upload insurance PDFs, images or scanned
                    documents.
                  </p>
                </div>

              </div>

              <div className="workflow-step">

                <div className="workflow-number">
                  02
                </div>

                <div>
                  <h3>AI Extracts Data</h3>
                  <p>
                    AI identifies and structures important
                    insurance information.
                  </p>
                </div>

              </div>

              <div className="workflow-step">

                <div className="workflow-number">
                  03
                </div>

                <div>
                  <h3>Dynamic Form Generated</h3>
                  <p>
                    Relevant fields and conditional questions
                    are automatically prepared.
                  </p>
                </div>

              </div>

              <div className="workflow-step">

                <div className="workflow-number">
                  04
                </div>

                <div>
                  <h3>Validate & Submit</h3>
                  <p>
                    Review, validate and submit the completed
                    insurance workflow.
                  </p>
                </div>

              </div>

            </div>

            <Link
              to="/signup"
              className="workflow-button"
            >
              Start Automating
              <FaArrowRight />
            </Link>

          </div>

          <div className="workflow-visual">

            <div className="workflow-window">

              <div className="window-header">

                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <span>
                  Forma AI Workflow
                </span>

              </div>

              <div className="workflow-flow">

                <div className="flow-card">

                  <div className="flow-icon blue">
                    <FaFileUpload />
                  </div>

                  <div>
                    <strong>
                      VehicleClaim.pdf
                    </strong>
                    <span>
                      Uploaded
                    </span>
                  </div>

                  <FaCheckCircle />
                </div>

                <div className="flow-line"></div>

                <div className="flow-card active">

                  <div className="flow-icon purple">
                    <FaBrain />
                  </div>

                  <div>
                    <strong>
                      AI Processing
                    </strong>
                    <span>
                      Extracting 18 fields...
                    </span>
                  </div>

                  <div className="loading-circle"></div>

                </div>

                <div className="flow-line"></div>

                <div className="flow-card">

                  <div className="flow-icon green">
                    <FaWpformsFallback />
                  </div>

                  <div>
                    <strong>
                      Dynamic Form
                    </strong>
                    <span>
                      18 fields generated
                    </span>
                  </div>

                  <FaCheckCircle />
                </div>

                <div className="flow-line"></div>

                <div className="flow-card">

                  <div className="flow-icon orange">
                    <FaClipboardCheck />
                  </div>

                  <div>
                    <strong>
                      Validation
                    </strong>
                    <span>
                      All fields verified
                    </span>
                  </div>

                  <FaCheckCircle />
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SECURITY
      ====================================================== */}

      <section className="security-section">

        <div className="security-card">

          <div className="security-content">

            <span className="section-badge">
              ENTERPRISE READY
            </span>

            <h2>
              Built for Secure
              <span> Insurance Automation</span>
            </h2>

            <p>
              Forma AI is designed to help insurance teams
              process sensitive workflows efficiently while
              maintaining secure and structured data handling.
            </p>

            <div className="security-points">

              <div>
                <FaLock />
                <span>
                  Secure document processing
                </span>
              </div>

              <div>
                <FaShieldAlt />
                <span>
                  Validation-driven workflows
                </span>
              </div>

              <div>
                <FaGlobe />
                <span>
                  Scalable cloud architecture
                </span>
              </div>

              <div>
                <FaDatabase />
                <span>
                  Structured data management
                </span>
              </div>

            </div>

          </div>

          <div className="security-visual">

            <div className="security-circle">

              <div className="security-inner">
                <FaShieldAlt />
                <strong>
                  Secure
                </strong>
                <span>
                  AI Processing
                </span>
              </div>

            </div>

            <div className="security-mini-card one">
              <FaLock />
              Encrypted
            </div>

            <div className="security-mini-card two">
              <FaCheckCircle />
              Verified
            </div>

            <div className="security-mini-card three">
              <FaShieldAlt />
              Protected
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section
        className="cta-section"
        id="contact"
      >

        <div className="cta-glow"></div>

        <div className="cta-content">

          <span className="section-badge">
            GET STARTED TODAY
          </span>

          <h2>
            Ready to Transform
            <br />
            Your Insurance Workflow?
          </h2>

          <p>
            Start using Forma AI to automate documents,
            dynamic forms and insurance workflows.
          </p>

          <div className="cta-buttons">

            <Link
              to="/signup"
              className="cta-primary"
            >
              Create Free Account
              <FaArrowRight />
            </Link>

            <Link
              to="/login"
              className="cta-secondary"
            >
              Sign In
            </Link>

          </div>

          <div className="cta-note">
            <FaCheckCircle />
            No credit card required
          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">

        <div className="footer-main">

          <div className="footer-brand">

            <Link
              to="/"
              className="footer-logo"
            >
              <div className="footer-logo-icon">
                <FaRobot />
              </div>

              <strong>
                Forma<span>AI</span>
              </strong>
            </Link>

            <p>
              AI-Augmented Dynamic Form Engine for
              InsurTech and Workflow Automation.
            </p>

            <div className="footer-rating">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <span>
                Built for modern InsurTech
              </span>
            </div>

          </div>

          <div className="footer-column">

            <h4>Platform</h4>

            <Link to="/ai-parser">
              AI Parser
            </Link>

            <Link to="/dynamic-forms">
              Dynamic Forms
            </Link>

            <Link to="/analytics">
              Analytics
            </Link>

            <Link to="/dashboard">
              Dashboard
            </Link>

          </div>

          <div className="footer-column">

            <h4>Insurance</h4>

            <Link to="/dynamic-forms">
              Health Insurance
            </Link>

            <Link to="/dynamic-forms">
              Vehicle Insurance
            </Link>

            <Link to="/dynamic-forms">
              Property Insurance
            </Link>

            <Link to="/dynamic-forms">
              Travel Insurance
            </Link>

          </div>

          <div className="footer-column">

            <h4>Company</h4>

            <a href="#features">
              Features
            </a>

            <a href="#insurance">
              Insurance Forms
            </a>

            <a href="#contact">
              Contact
            </a>

            <Link to="/signup">
              Get Started
            </Link>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 Forma AI. All rights reserved.
          </span>

          <div>
            <span>
              Privacy Policy
            </span>

            <span>
              Terms of Service
            </span>

            <span>
              Security
            </span>
          </div>

          <span>
            Developed by Team Forma AI • MLRIT
          </span>

        </div>

      </footer>

    </div>
  );
};

/*
  Small fallback component used only for the workflow preview.
  This prevents adding another dependency just for an icon.
*/
const FaWpformsFallback = () => {
  return <FaWpformsIcon />;
};

const FaWpformsIcon = () => {
  return <FaClipboardCheck />;
};

export default Home;