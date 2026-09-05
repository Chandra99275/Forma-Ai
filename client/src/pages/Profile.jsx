import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Profile.css";

import {
  FaRobot,
  FaTachometerAlt,
  FaFileAlt,
  FaChartLine,
  FaUserCircle,
  FaBell,
  FaCog,
  FaShieldAlt,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaCheckCircle,
  FaClock,
  FaSignOutAlt,
  FaCamera,
  FaKey,
  FaUserShield,
  FaChevronRight,
} from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "Forma User",
    email: "user@example.com",
    phone: "+91 98765 43210",
    location: "Hyderabad, India",
    role: "Insurance Operations Manager",
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setUser((previous) => ({
          ...previous,
          ...parsedUser,
          fullName:
            parsedUser.fullName ||
            parsedUser.name ||
            previous.fullName,
          email:
            parsedUser.email ||
            previous.email,
        }));
      } catch (error) {
        console.error("Unable to read stored user:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="profile-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="profile-sidebar">

        <div className="profile-logo">
          <div className="profile-logo-icon">
            <FaRobot />
          </div>

          <div>
            <h2>Forma AI</h2>
            <span>Insurance Intelligence</span>
          </div>
        </div>

        <div className="profile-menu-title">
          MAIN MENU
        </div>

        <ul className="profile-menu">

          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "profile-nav-link active"
                  : "profile-nav-link"
              }
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/ai-parser"
              className={({ isActive }) =>
                isActive
                  ? "profile-nav-link active"
                  : "profile-nav-link"
              }
            >
              <FaRobot />
              <span>AI Parser</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dynamic-forms"
              className={({ isActive }) =>
                isActive
                  ? "profile-nav-link active"
                  : "profile-nav-link"
              }
            >
              <FaFileAlt />
              <span>Dynamic Forms</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive
                  ? "profile-nav-link active"
                  : "profile-nav-link"
              }
            >
              <FaChartLine />
              <span>Analytics</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/submissions"
              className={({ isActive }) =>
                isActive
                  ? "profile-nav-link active"
                  : "profile-nav-link"
              }
            >
              <FaFileAlt />
              <span>Submissions</span>
            </NavLink>
          </li>

        </ul>

        <div className="profile-menu-title account-title">
          ACCOUNT
        </div>

        <ul className="profile-menu">

          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "profile-nav-link active"
                  : "profile-nav-link"
              }
            >
              <FaUserCircle />
              <span>Profile</span>
            </NavLink>
          </li>

          <li>
            <a href="#" className="profile-nav-link">
              <FaBell />
              <span>Notifications</span>
              <small>3</small>
            </a>
          </li>

          <li>
            <a href="#" className="profile-nav-link">
              <FaCog />
              <span>Settings</span>
            </a>
          </li>

        </ul>

        {/* AI STATUS */}

        <div className="profile-ai-status">

          <div className="profile-ai-icon">
            <FaRobot />
          </div>

          <div>
            <strong>AI Engine</strong>
            <span>Operational</span>
          </div>

          <div className="profile-online-dot"></div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="profile-main">

        {/* HEADER */}

        <header className="profile-header">

          <div>
            <div className="profile-breadcrumb">
              Dashboard
              <FaChevronRight />
              Profile
            </div>

            <h1>My Profile</h1>

            <p>
              Manage your personal information and account preferences.
            </p>
          </div>

          <div className="profile-header-actions">

            <button className="profile-notification">
              <FaBell />
              <span>3</span>
            </button>

            <div className="profile-mini-user">
              <FaUserCircle />

              <div>
                <span>Welcome</span>
                <strong>{user.fullName}</strong>
              </div>
            </div>

          </div>

        </header>

        {/* ================= PROFILE HERO ================= */}

        <section className="profile-hero">

          <div className="profile-avatar-section">

            <div className="profile-avatar">

              <FaUserCircle />

              <button className="camera-button">
                <FaCamera />
              </button>

            </div>

            <div className="profile-hero-info">

              <span className="profile-role-badge">
                <FaCheckCircle />
                Verified Account
              </span>

              <h2>{user.fullName}</h2>

              <p>{user.role}</p>

              <small>
                <FaEnvelope />
                {user.email}
              </small>

            </div>

          </div>

          <button
            className="edit-profile-button"
            onClick={() => setEditing(!editing)}
          >
            <FaEdit />
            {editing ? "Cancel Editing" : "Edit Profile"}
          </button>

        </section>

        {/* ================= CONTENT GRID ================= */}

        <section className="profile-content-grid">

          {/* PERSONAL INFORMATION */}

          <div className="profile-card personal-card">

            <div className="profile-card-header">

              <div>
                <h2>Personal Information</h2>
                <p>
                  Your basic account information.
                </p>
              </div>

              <div className="card-header-icon">
                <FaUserCircle />
              </div>

            </div>

            <div className="profile-form-grid">

              <div className="profile-input-group">

                <label>Full Name</label>

                <div className="profile-input">

                  <FaUserCircle />

                  <input
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleChange}
                    disabled={!editing}
                  />

                </div>

              </div>

              <div className="profile-input-group">

                <label>Email Address</label>

                <div className="profile-input">

                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    disabled={!editing}
                  />

                </div>

              </div>

              <div className="profile-input-group">

                <label>Phone Number</label>

                <div className="profile-input">

                  <FaPhone />

                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    disabled={!editing}
                  />

                </div>

              </div>

              <div className="profile-input-group">

                <label>Location</label>

                <div className="profile-input">

                  <FaMapMarkerAlt />

                  <input
                    type="text"
                    name="location"
                    value={user.location}
                    onChange={handleChange}
                    disabled={!editing}
                  />

                </div>

              </div>

            </div>

            {editing && (

              <div className="save-profile-row">

                <button
                  className="save-profile-button"
                  onClick={saveProfile}
                >
                  <FaCheckCircle />
                  Save Changes
                </button>

              </div>

            )}

          </div>

          {/* ACCOUNT STATUS */}

          <div className="profile-card account-card">

            <div className="profile-card-header">

              <div>
                <h2>Account Status</h2>
                <p>
                  Your Forma AI account overview.
                </p>
              </div>

              <div className="card-header-icon green">
                <FaShieldAlt />
              </div>

            </div>

            <div className="account-status">

              <div className="status-line">

                <div>
                  <span>Account Status</span>
                  <strong>Active</strong>
                </div>

                <FaCheckCircle className="status-success" />

              </div>

              <div className="status-line">

                <div>
                  <span>Security Level</span>
                  <strong>High</strong>
                </div>

                <FaShieldAlt className="status-success" />

              </div>

              <div className="status-line">

                <div>
                  <span>AI Access</span>
                  <strong>Enabled</strong>
                </div>

                <FaRobot className="status-success" />

              </div>

              <div className="status-line">

                <div>
                  <span>Member Since</span>
                  <strong>January 2026</strong>
                </div>

                <FaClock className="status-clock" />

              </div>

            </div>

          </div>

        </section>

        {/* ================= STATISTICS ================= */}

        <section className="profile-statistics">

          <div className="profile-stat">

            <div className="profile-stat-icon blue">
              <FaFileAlt />
            </div>

            <div>
              <span>Forms Created</span>
              <h2>132</h2>
              <small>+12% this month</small>
            </div>

          </div>

          <div className="profile-stat">

            <div className="profile-stat-icon purple">
              <FaRobot />
            </div>

            <div>
              <span>AI Documents</span>
              <h2>842</h2>
              <small>+28% this month</small>
            </div>

          </div>

          <div className="profile-stat">

            <div className="profile-stat-icon green">
              <FaCheckCircle />
            </div>

            <div>
              <span>Successful Forms</span>
              <h2>96%</h2>
              <small>Excellent performance</small>
            </div>

          </div>

          <div className="profile-stat">

            <div className="profile-stat-icon orange">
              <FaChartLine />
            </div>

            <div>
              <span>AI Confidence</span>
              <h2>97%</h2>
              <small>Verified accuracy</small>
            </div>

          </div>

        </section>

        {/* ================= SECURITY ================= */}

        <section className="profile-lower-grid">

          <div className="profile-card security-card">

            <div className="profile-card-header">

              <div>
                <h2>Security & Privacy</h2>
                <p>
                  Protect your Forma AI account.
                </p>
              </div>

              <div className="card-header-icon">
                <FaLock />
              </div>

            </div>

            <div className="security-item">

              <div className="security-icon">
                <FaKey />
              </div>

              <div>
                <strong>Password</strong>
                <span>Last changed 30 days ago</span>
              </div>

              <button>Change</button>

            </div>

            <div className="security-item">

              <div className="security-icon">
                <FaUserShield />
              </div>

              <div>
                <strong>Two-Factor Authentication</strong>
                <span>Additional account protection</span>
              </div>

              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>

            </div>

            <div className="security-item">

              <div className="security-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>Login Alerts</strong>
                <span>Receive alerts for new logins</span>
              </div>

              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>

            </div>

          </div>

          {/* RECENT ACTIVITY */}

          <div className="profile-card activity-card">

            <div className="profile-card-header">

              <div>
                <h2>Recent Activity</h2>
                <p>
                  Latest account activity.
                </p>
              </div>

              <FaClock className="activity-header-icon" />

            </div>

            <div className="activity-list">

              <div className="activity-item">

                <div className="activity-icon success">
                  <FaCheckCircle />
                </div>

                <div>
                  <strong>Form submitted successfully</strong>
                  <span>Health Insurance Claim</span>
                  <small>2 minutes ago</small>
                </div>

              </div>

              <div className="activity-item">

                <div className="activity-icon ai">
                  <FaRobot />
                </div>

                <div>
                  <strong>AI document processed</strong>
                  <span>18 fields extracted</span>
                  <small>15 minutes ago</small>
                </div>

              </div>

              <div className="activity-item">

                <div className="activity-icon upload">
                  <FaFileAlt />
                </div>

                <div>
                  <strong>New document uploaded</strong>
                  <span>Vehicle Insurance.pdf</span>
                  <small>1 hour ago</small>
                </div>

              </div>

            </div>

            <Link
              to="/submissions"
              className="view-activity-link"
            >
              View all activity
              <FaChevronRight />
            </Link>

          </div>

        </section>

        {/* ================= LOGOUT ================= */}

        <section className="logout-section">

          <div>

            <div className="logout-icon">
              <FaSignOutAlt />
            </div>

            <div>
              <h3>Sign out of Forma AI</h3>
              <p>
                You will need to sign in again to access your account.
              </p>
            </div>

          </div>

          <button onClick={handleLogout}>
            Sign Out
            <FaSignOutAlt />
          </button>

        </section>

      </main>

    </div>
  );
};

export default Profile;