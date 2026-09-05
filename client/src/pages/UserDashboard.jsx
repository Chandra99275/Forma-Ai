import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./dashboard.css";

import {
  FaRobot,
  FaFileUpload,
  FaWpforms,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaUserCircle,
  FaBell,
  FaSearch,
  FaArrowUp,
  FaArrowRight,
  FaHeartbeat,
  FaCarCrash,
  FaHome,
  FaPlaneDeparture,
  FaCog,
  FaClipboardList,
  FaChartPie,
  FaChevronRight,
  FaBolt,
  FaShieldAlt,
  FaDatabase,
  FaBrain,
  FaCircle,
  FaPlus,
  FaExternalLinkAlt,
} from "react-icons/fa";

const UserDashboard = () => {
  const [userName, setUserName] = useState("User");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.fullName || user.name || "User");
      } catch (error) {
        console.error("Unable to read user data:", error);
      }
    }
  }, []);

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <FaChartPie />,
    },
    {
      path: "/ai-parser",
      label: "AI Parser",
      icon: <FaRobot />,
    },
    {
      path: "/dynamic-forms",
      label: "Dynamic Forms",
      icon: <FaWpforms />,
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: <FaChartLine />,
    },
    {
      path: "/submissions",
      label: "Submissions",
      icon: <FaClipboardList />,
    },
    {
      path: "/profile",
      label: "Profile",
      icon: <FaUserCircle />,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <FaCog />,
    },
  ];

  const quickActions = [
    {
      title: "Upload Document",
      description: "Upload PDF, JPG or PNG",
      icon: <FaFileUpload />,
      path: "/ai-parser",
      className: "action-blue",
    },
    {
      title: "AI Parser",
      description: "Extract fields automatically",
      icon: <FaRobot />,
      path: "/ai-parser",
      className: "action-purple",
    },
    {
      title: "Create Form",
      description: "Build conditional forms",
      icon: <FaWpforms />,
      path: "/dynamic-forms",
      className: "action-green",
    },
    {
      title: "View Analytics",
      description: "Monitor AI performance",
      icon: <FaChartLine />,
      path: "/analytics",
      className: "action-orange",
    },
  ];

  const insuranceTypes = [
    {
      name: "Health Insurance",
      count: "428",
      icon: <FaHeartbeat />,
      color: "health",
    },
    {
      name: "Vehicle Insurance",
      count: "312",
      icon: <FaCarCrash />,
      color: "vehicle",
    },
    {
      name: "Property Insurance",
      count: "186",
      icon: <FaHome />,
      color: "property",
    },
    {
      name: "Travel Insurance",
      count: "96",
      icon: <FaPlaneDeparture />,
      color: "travel",
    },
  ];

  return (
    <div className="dashboard">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside className="sidebar">

        <div className="sidebar-top">

          {/* Logo */}
          <Link to="/dashboard" className="sidebar-logo">
            <div className="logo-icon">
              <FaRobot />
            </div>

            <div className="logo-content">
              <h2>
                Forma<span>AI</span>
              </h2>
              <small>Insurance Intelligence</small>
            </div>
          </Link>

          {/* Navigation */}
          <div className="sidebar-section-title">
            MAIN MENU
          </div>

          <ul className="sidebar-menu">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "sidebar-link active"
                      : "sidebar-link"
                  }
                >
                  <span className="sidebar-icon">
                    {item.icon}
                  </span>

                  <span className="sidebar-label">
                    {item.label}
                  </span>

                  {item.label === "AI Parser" && (
                    <span className="new-badge">
                      AI
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Workspace */}
          <div className="sidebar-section-title workspace-title">
            WORKSPACE
          </div>

          <div className="workspace-card">
            <div className="workspace-icon">
              <FaBolt />
            </div>

            <div>
              <strong>AI Processing</strong>
              <span>
                System running smoothly
              </span>
            </div>

            <FaCircle className="online-dot" />
          </div>
        </div>

        {/* Sidebar Bottom */}
        <div className="sidebar-bottom">

          <div className="storage-box">
            <div className="storage-header">
              <span>Storage</span>
              <strong>68%</strong>
            </div>

            <div className="storage-bar">
              <div className="storage-fill"></div>
            </div>

            <small>
              6.8 GB of 10 GB used
            </small>
          </div>

          <div className="sidebar-profile">
            <FaUserCircle />

            <div>
              <strong>{userName}</strong>
              <span>Administrator</span>
            </div>

            <Link to="/settings">
              <FaCog />
            </Link>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <div className="header-left">

            <div className="mobile-logo">
              <FaRobot />
              <span>
                Forma<span>AI</span>
              </span>
            </div>

            <div className="welcome-text">
              <div className="breadcrumb">
                Workspace
                <FaChevronRight />
                Dashboard
              </div>

              <h1>
                Good evening, {userName} 👋
              </h1>

              <p>
                Here's what's happening with your insurance
                workflows today.
              </p>
            </div>
          </div>

          <div className="header-actions">

            {/* Search */}
            <div className="search-box">
              <FaSearch />

              <input
                type="text"
                placeholder="Search forms, documents..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <span className="search-shortcut">
                ⌘ K
              </span>
            </div>

            {/* Notification */}
            <button className="notification-button">
              <FaBell />
              <span className="notification-dot"></span>
            </button>

            {/* Profile */}
            <Link
              to="/profile"
              className="header-profile"
            >
              <FaUserCircle className="header-avatar" />

              <div>
                <span>Welcome back</span>
                <strong>{userName}</strong>
              </div>

              <FaChevronRight />
            </Link>
          </div>
        </header>

        {/* =================================================
            AI STATUS BANNER
        ================================================== */}
        <section className="ai-status-banner">

          <div className="ai-status-left">

            <div className="ai-status-icon">
              <FaBrain />
            </div>

            <div>
              <div className="ai-status-title">
                <strong>Forma AI Engine</strong>

                <span className="status-online">
                  <FaCircle />
                  Operational
                </span>
              </div>

              <p>
                AI document processing and validation
                services are running normally.
              </p>
            </div>
          </div>

          <div className="ai-status-right">

            <div className="status-metric">
              <span>AI Response</span>
              <strong>1.2s</strong>
            </div>

            <div className="status-divider"></div>

            <div className="status-metric">
              <span>Accuracy</span>
              <strong>97.8%</strong>
            </div>

            <Link
              to="/analytics"
              className="status-link"
            >
              View Status
              <FaArrowRight />
            </Link>
          </div>
        </section>

        {/* =================================================
            STATISTICS
        ================================================== */}
        <section className="stats-grid">

          <div className="stats-card stat-purple">

            <div className="stat-card-top">
              <div className="stat-icon">
                <FaWpforms />
              </div>

              <span className="stat-growth positive">
                <FaArrowUp />
                12.4%
              </span>
            </div>

            <div className="stat-value">
              132
            </div>

            <p>Total Forms</p>

            <span className="stat-description">
              14 new forms this month
            </span>
          </div>

          <div className="stats-card stat-blue">

            <div className="stat-card-top">
              <div className="stat-icon">
                <FaRobot />
              </div>

              <span className="stat-growth positive">
                <FaArrowUp />
                28.6%
              </span>
            </div>

            <div className="stat-value">
              842
            </div>

            <p>AI Parsed Documents</p>

            <span className="stat-description">
              186 documents this week
            </span>
          </div>

          <div className="stats-card stat-green">

            <div className="stat-card-top">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>

              <span className="stat-growth excellent">
                Excellent
              </span>
            </div>

            <div className="stat-value">
              96.4%
            </div>

            <p>Completion Rate</p>

            <span className="stat-description">
              +4.2% from last month
            </span>
          </div>

          <div className="stats-card stat-orange">

            <div className="stat-card-top">
              <div className="stat-icon">
                <FaShieldAlt />
              </div>

              <span className="stat-growth verified">
                Verified
              </span>
            </div>

            <div className="stat-value">
              97.8%
            </div>

            <p>AI Confidence</p>

            <span className="stat-description">
              Above recommended threshold
            </span>
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================== */}
        <section className="section-block">

          <div className="section-heading">

            <div>
              <span className="section-eyebrow">
                PRODUCTIVITY
              </span>

              <h2>Quick Actions</h2>

              <p>
                Start your next workflow in seconds.
              </p>
            </div>

            <Link
              to="/dynamic-forms"
              className="view-link"
            >
              View all
              <FaArrowRight />
            </Link>
          </div>

          <div className="action-grid">

            {quickActions.map((action) => (
              <Link
                to={action.path}
                className={`action-card ${action.className}`}
                key={action.title}
              >
                <div className="action-icon">
                  {action.icon}
                </div>

                <div className="action-content">
                  <h3>{action.title}</h3>

                  <p>
                    {action.description}
                  </p>
                </div>

                <div className="action-arrow">
                  <FaArrowRight />
                </div>
              </Link>
            ))}

          </div>
        </section>

        {/* =================================================
            ANALYTICS ROW
        ================================================== */}
        <section className="dashboard-row">

          {/* AI Performance */}
          <div className="premium-card ai-performance-card">

            <div className="card-header">

              <div>
                <span className="card-eyebrow">
                  AI PERFORMANCE
                </span>

                <h2>Parsing Performance</h2>
              </div>

              <Link
                to="/analytics"
                className="card-action"
              >
                <FaExternalLinkAlt />
              </Link>
            </div>

            <div className="performance-score">

              <div className="score-circle">
                <div className="score-inner">
                  <strong>97%</strong>
                  <span>Accuracy</span>
                </div>
              </div>

              <div className="score-info">
                <strong>
                  Excellent performance
                </strong>

                <p>
                  Your AI engine is performing
                  above the recommended threshold.
                </p>

                <div className="score-change">
                  <FaArrowUp />
                  <span>
                    3.8% improvement
                  </span>
                  <small>
                    this month
                  </small>
                </div>
              </div>
            </div>

            <div className="progress-list">

              <div className="progress-item">
                <div>
                  <span>Insurance Claims</span>
                  <strong>92%</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-value claim-progress"
                  ></div>
                </div>
              </div>

              <div className="progress-item">
                <div>
                  <span>Health Policies</span>
                  <strong>87%</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-value health-progress"
                  ></div>
                </div>
              </div>

              <div className="progress-item">
                <div>
                  <span>Vehicle Policies</span>
                  <strong>96%</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-value vehicle-progress"
                  ></div>
                </div>
              </div>

              <div className="progress-item">
                <div>
                  <span>KYC Verification</span>
                  <strong>98%</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-value kyc-progress"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="premium-card activity-card">

            <div className="card-header">

              <div>
                <span className="card-eyebrow">
                  ACTIVITY
                </span>

                <h2>Recent Activity</h2>
              </div>

              <Link
                to="/submissions"
                className="view-link"
              >
                View all
              </Link>
            </div>

            <div className="activity-list">

              <div className="activity-item">

                <div className="activity-icon success">
                  <FaCheckCircle />
                </div>

                <div className="activity-content">
                  <strong>
                    Policy Form Submitted
                  </strong>

                  <span>
                    Health Insurance Claim
                  </span>

                  <small>
                    2 minutes ago
                  </small>
                </div>

                <FaChevronRight className="activity-arrow" />
              </div>

              <div className="activity-item">

                <div className="activity-icon purple">
                  <FaRobot />
                </div>

                <div className="activity-content">
                  <strong>
                    AI Parsing Completed
                  </strong>

                  <span>
                    18 fields extracted successfully
                  </span>

                  <small>
                    15 minutes ago
                  </small>
                </div>

                <FaChevronRight className="activity-arrow" />
              </div>

              <div className="activity-item">

                <div className="activity-icon blue">
                  <FaFileUpload />
                </div>

                <div className="activity-content">
                  <strong>
                    New Document Uploaded
                  </strong>

                  <span>
                    Vehicle Insurance.pdf
                  </span>

                  <small>
                    1 hour ago
                  </small>
                </div>

                <FaChevronRight className="activity-arrow" />
              </div>

              <div className="activity-item">

                <div className="activity-icon orange">
                  <FaShieldAlt />
                </div>

                <div className="activity-content">
                  <strong>
                    Validation Completed
                  </strong>

                  <span>
                    All required fields verified
                  </span>

                  <small>
                    Yesterday
                  </small>
                </div>

                <FaChevronRight className="activity-arrow" />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            INSURANCE CATEGORIES
        ================================================== */}
        <section className="section-block">

          <div className="section-heading">

            <div>
              <span className="section-eyebrow">
                FORM CATEGORIES
              </span>

              <h2>Insurance Workflows</h2>

              <p>
                Overview of your most active insurance categories.
              </p>
            </div>

            <Link
              to="/dynamic-forms"
              className="create-button"
            >
              <FaPlus />
              Create Form
            </Link>
          </div>

          <div className="insurance-grid">

            {insuranceTypes.map((item) => (
              <Link
                to="/dynamic-forms"
                className="insurance-card"
                key={item.name}
              >

                <div
                  className={`insurance-icon ${item.color}`}
                >
                  {item.icon}
                </div>

                <div className="insurance-info">
                  <strong>{item.name}</strong>

                  <span>
                    {item.count} active forms
                  </span>
                </div>

                <FaArrowRight className="insurance-arrow" />
              </Link>
            ))}

          </div>
        </section>

        {/* =================================================
            RECENT SUBMISSIONS
        ================================================== */}
        <section className="premium-card submissions-card">

          <div className="table-header">

            <div>
              <span className="card-eyebrow">
                WORKFLOW ACTIVITY
              </span>

              <h2>Recent Form Submissions</h2>

              <p>
                Monitor the latest insurance applications.
              </p>
            </div>

            <Link
              to="/submissions"
              className="view-all-button"
            >
              View All
              <FaArrowRight />
            </Link>
          </div>

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>FORM</th>
                  <th>CATEGORY</th>
                  <th>STATUS</th>
                  <th>AI CONFIDENCE</th>
                  <th>DATE</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>
                    <div className="form-name">
                      <div className="table-icon health">
                        <FaHeartbeat />
                      </div>

                      <div>
                        <strong>
                          Health Insurance Claim
                        </strong>

                        <span>
                          #FORM-10284
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="category-text">
                      Health
                    </span>
                  </td>

                  <td>
                    <span className="badge success">
                      <FaCheckCircle />
                      Approved
                    </span>
                  </td>

                  <td>
                    <div className="confidence">
                      <span>98%</span>
                      <div>
                        <i style={{ width: "98%" }}></i>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="date-text">
                      Today, 6:42 PM
                    </span>
                  </td>

                  <td>
                    <Link
                      to="/submissions"
                      className="table-action"
                    >
                      <FaExternalLinkAlt />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="form-name">
                      <div className="table-icon vehicle">
                        <FaCarCrash />
                      </div>

                      <div>
                        <strong>
                          Vehicle Insurance Form
                        </strong>

                        <span>
                          #FORM-10283
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="category-text">
                      Vehicle
                    </span>
                  </td>

                  <td>
                    <span className="badge pending">
                      <FaClock />
                      Pending
                    </span>
                  </td>

                  <td>
                    <div className="confidence">
                      <span>94%</span>
                      <div>
                        <i style={{ width: "94%" }}></i>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="date-text">
                      Today, 4:18 PM
                    </span>
                  </td>

                  <td>
                    <Link
                      to="/submissions"
                      className="table-action"
                    >
                      <FaExternalLinkAlt />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="form-name">
                      <div className="table-icon life">
                        <FaShieldAlt />
                      </div>

                      <div>
                        <strong>
                          Life Insurance Policy
                        </strong>

                        <span>
                          #FORM-10282
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="category-text">
                      Life
                    </span>
                  </td>

                  <td>
                    <span className="badge success">
                      <FaCheckCircle />
                      Validated
                    </span>
                  </td>

                  <td>
                    <div className="confidence">
                      <span>97%</span>
                      <div>
                        <i style={{ width: "97%" }}></i>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="date-text">
                      Yesterday
                    </span>
                  </td>

                  <td>
                    <Link
                      to="/submissions"
                      className="table-action"
                    >
                      <FaExternalLinkAlt />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="form-name">
                      <div className="table-icon travel">
                        <FaPlaneDeparture />
                      </div>

                      <div>
                        <strong>
                          Travel Insurance
                        </strong>

                        <span>
                          #FORM-10281
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="category-text">
                      Travel
                    </span>
                  </td>

                  <td>
                    <span className="badge rejected">
                      <FaClock />
                      Review Required
                    </span>
                  </td>

                  <td>
                    <div className="confidence">
                      <span>81%</span>
                      <div>
                        <i style={{ width: "81%" }}></i>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="date-text">
                      Yesterday
                    </span>
                  </td>

                  <td>
                    <Link
                      to="/submissions"
                      className="table-action"
                    >
                      <FaExternalLinkAlt />
                    </Link>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </section>

        {/* =================================================
            FOOTER
        ================================================== */}
        <footer className="dashboard-footer">

          <div>
            <strong>
              Forma<span>AI</span>
            </strong>

            <p>
              Intelligent insurance workflow automation.
            </p>
          </div>

          <div className="footer-status">
            <FaCircle />
            All systems operational
          </div>

          <span className="copyright">
            © 2026 Forma AI
          </span>
        </footer>

      </main>
    </div>
  );
};

export default UserDashboard;