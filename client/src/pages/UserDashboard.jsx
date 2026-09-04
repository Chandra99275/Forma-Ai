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
} from "react-icons/fa";

const UserDashboard = () => {
  // Logged-in user state
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      // Supports fullName or name from backend
      setUserName(user.fullName || user.name || "User");
    }
  }, []);

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <FaRobot />
          <h2>Forma AI</h2>
        </div>

        <ul className="sidebar-menu">
          <li className="active">Dashboard</li>
           <li><Link to="/ai-parser">AI Parser</Link></li>
          <li>
  <NavLink
    to="/dynamic-forms"
    className={({ isActive }) =>
      isActive ? "sidebar-link active" : "sidebar-link"
    }
  >
    Dynamic Forms
  </NavLink>
</li>
          <li>Analytics</li>
          <li>Submissions</li>
          <li>Profile</li>
          <li>Settings</li>
        </ul>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <div>
            <h1>Hello, {userName} 👋</h1>
            <p>Welcome back to Forma AI Dashboard</p>
          </div>

          <div className="header-actions">

            <div className="search-box">
              <FaSearch />
              <input placeholder="Search forms..." />
            </div>

            <FaBell className="header-icon" />

            <div className="user-profile">
              <FaUserCircle className="profile-icon" />

              <div className="profile-text">
                <span>Welcome</span>
                <h4>{userName}</h4>
              </div>
            </div>

          </div>

        </header>

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stats-card purple">
            <FaWpforms />
            <h2>132</h2>
            <p>Total Forms</p>
            <span><FaArrowUp /> +12%</span>
          </div>

          <div className="stats-card blue">
            <FaRobot />
            <h2>842</h2>
            <p>AI Parsed Docs</p>
            <span><FaArrowUp /> +28%</span>
          </div>

          <div className="stats-card green">
            <FaCheckCircle />
            <h2>96%</h2>
            <p>Completion Rate</p>
            <span>Excellent</span>
          </div>

          <div className="stats-card orange">
            <FaChartLine />
            <h2>97%</h2>
            <p>AI Confidence</p>
            <span>Verified</span>
          </div>

        </section>

        {/* Quick Actions */}
        <section className="quick-actions">

          <h2>Quick Actions</h2>

          <div className="action-grid">

            <div className="action-card">
              <FaFileUpload />
              <h3>Upload Document</h3>
              <p>Upload Insurance PDF / Image</p>
            </div>

            <div className="action-card">
              <FaRobot />
              <h3>AI Parser</h3>
              <p>Extract Form Fields Automatically</p>
            </div>

            <div className="action-card">
              <FaWpforms />
              <h3>Create Form</h3>
              <p>Create Dynamic Conditional Forms</p>
            </div>

            <div className="action-card">
              <FaChartLine />
              <h3>View Analytics</h3>
              <p>Submission Insights & AI Accuracy</p>
            </div>

          </div>

        </section>

        {/* AI Insights */}
        <section className="dashboard-row">

          <div className="insights-card">

            <h2>AI Parsing Progress</h2>

            <div className="progress-row">
              <span>Insurance Claims</span>
              <div className="progress-bar">
                <div className="progress-fill claim"></div>
              </div>
              <strong>92%</strong>
            </div>

            <div className="progress-row">
              <span>Health Policies</span>
              <div className="progress-bar">
                <div className="progress-fill health"></div>
              </div>
              <strong>87%</strong>
            </div>

            <div className="progress-row">
              <span>Vehicle Policies</span>
              <div className="progress-bar">
                <div className="progress-fill vehicle"></div>
              </div>
              <strong>96%</strong>
            </div>

            <div className="progress-row">
              <span>KYC Verification</span>
              <div className="progress-bar">
                <div className="progress-fill kyc"></div>
              </div>
              <strong>98%</strong>
            </div>

          </div>

          {/* Activity Timeline */}
          <div className="timeline-card">

            <h2>Recent Activity</h2>

            <div className="timeline-item">
              <FaCheckCircle />
              <div>
                <h4>Policy Form Submitted</h4>
                <span>2 minutes ago</span>
              </div>
            </div>

            <div className="timeline-item">
              <FaRobot />
              <div>
                <h4>AI Parsed 18 Fields Successfully</h4>
                <span>15 minutes ago</span>
              </div>
            </div>

            <div className="timeline-item">
              <FaFileUpload />
              <div>
                <h4>New Insurance PDF Uploaded</h4>
                <span>1 hour ago</span>
              </div>
            </div>

            <div className="timeline-item">
              <FaClock />
              <div>
                <h4>Workflow Validation Completed</h4>
                <span>Yesterday</span>
              </div>
            </div>

          </div>

        </section>

        {/* Recent Submissions */}
        <section className="table-section">

          <div className="table-header">
            <h2>Recent Form Submissions</h2>

            <button>
              View All <FaArrowRight />
            </button>
          </div>

          <table>

            <thead>
              <tr>
                <th>Form</th>
                <th>Status</th>
                <th>AI Confidence</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>Health Insurance Claim</td>
                <td><span className="badge success">Approved</span></td>
                <td>98%</td>
                <td>Today</td>
              </tr>

              <tr>
                <td>Vehicle Insurance Form</td>
                <td><span className="badge pending">Pending</span></td>
                <td>94%</td>
                <td>Today</td>
              </tr>

              <tr>
                <td>Life Insurance Policy</td>
                <td><span className="badge success">Validated</span></td>
                <td>97%</td>
                <td>Yesterday</td>
              </tr>

              <tr>
                <td>Travel Insurance</td>
                <td><span className="badge rejected">Rejected</span></td>
                <td>81%</td>
                <td>Yesterday</td>
              </tr>

            </tbody>

          </table>

        </section>

      </main>

    </div>
  );
};

export default UserDashboard;