import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Settings.css";

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
  FaGlobe,
  FaMoon,
  FaSun,
  FaEnvelope,
  FaDesktop,
  FaMobileAlt,
  FaDatabase,
  FaKey,
  FaTrash,
  FaCheckCircle,
  FaChevronRight,
  FaSave,
  FaDownload,
} from "react-icons/fa";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    emailNotifications: true,
    submissionAlerts: true,
    aiAlerts: true,
    weeklyReports: false,
    darkMode: false,
    twoFactor: true,
    loginAlerts: true,
    autoSave: true,
    aiSuggestions: true,
    language: "English",
    timezone: "Asia/Kolkata",
  });

  const updateSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateSelect = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = () => {
    localStorage.setItem(
      "formaSettings",
      JSON.stringify(settings)
    );

    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="settings-sidebar">

        <div className="settings-logo">

          <div className="settings-logo-icon">
            <FaRobot />
          </div>

          <div>
            <h2>Forma AI</h2>
            <span>Insurance Intelligence</span>
          </div>

        </div>

        <div className="settings-menu-title">
          MAIN MENU
        </div>

        <ul className="settings-menu">

          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "settings-nav-link active"
                  : "settings-nav-link"
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
                  ? "settings-nav-link active"
                  : "settings-nav-link"
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
                  ? "settings-nav-link active"
                  : "settings-nav-link"
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
                  ? "settings-nav-link active"
                  : "settings-nav-link"
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
                  ? "settings-nav-link active"
                  : "settings-nav-link"
              }
            >
              <FaFileAlt />
              <span>Submissions</span>
            </NavLink>
          </li>

        </ul>

        <div className="settings-menu-title account-menu-title">
          ACCOUNT
        </div>

        <ul className="settings-menu">

          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "settings-nav-link active"
                  : "settings-nav-link"
              }
            >
              <FaUserCircle />
              <span>Profile</span>
            </NavLink>
          </li>

          <li>
            <a href="#" className="settings-nav-link">
              <FaBell />
              <span>Notifications</span>
              <small>3</small>
            </a>
          </li>

          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive
                  ? "settings-nav-link active"
                  : "settings-nav-link"
              }
            >
              <FaCog />
              <span>Settings</span>
            </NavLink>
          </li>

        </ul>

        {/* AI STATUS */}

        <div className="settings-ai-status">

          <div className="settings-ai-icon">
            <FaRobot />
          </div>

          <div>
            <strong>AI Engine</strong>
            <span>Operational</span>
          </div>

          <div className="settings-online-dot"></div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="settings-main">

        {/* HEADER */}

        <header className="settings-header">

          <div>

            <div className="settings-breadcrumb">
              Dashboard
              <FaChevronRight />
              Settings
            </div>

            <h1>Settings</h1>

            <p>
              Customize your Forma AI workspace and account preferences.
            </p>

          </div>

          <div className="settings-header-user">

            <button className="settings-notification">
              <FaBell />
              <span>3</span>
            </button>

            <div className="settings-user">

              <FaUserCircle />

              <div>
                <span>Welcome</span>
                <strong>User</strong>
              </div>

            </div>

          </div>

        </header>

        {/* ================= SETTINGS LAYOUT ================= */}

        <section className="settings-layout">

          {/* SETTINGS NAVIGATION */}

          <aside className="settings-tabs">

            <button
              className={activeTab === "general" ? "active" : ""}
              onClick={() => setActiveTab("general")}
            >
              <FaCog />
              <div>
                <strong>General</strong>
                <span>Workspace preferences</span>
              </div>
            </button>

            <button
              className={activeTab === "notifications" ? "active" : ""}
              onClick={() => setActiveTab("notifications")}
            >
              <FaBell />
              <div>
                <strong>Notifications</strong>
                <span>Alerts and emails</span>
              </div>
            </button>

            <button
              className={activeTab === "security" ? "active" : ""}
              onClick={() => setActiveTab("security")}
            >
              <FaShieldAlt />
              <div>
                <strong>Security</strong>
                <span>Password and protection</span>
              </div>
            </button>

            <button
              className={activeTab === "ai" ? "active" : ""}
              onClick={() => setActiveTab("ai")}
            >
              <FaRobot />
              <div>
                <strong>AI Preferences</strong>
                <span>Forma AI behavior</span>
              </div>
            </button>

            <button
              className={activeTab === "privacy" ? "active" : ""}
              onClick={() => setActiveTab("privacy")}
            >
              <FaLock />
              <div>
                <strong>Privacy</strong>
                <span>Data and permissions</span>
              </div>
            </button>

          </aside>

          {/* SETTINGS CONTENT */}

          <div className="settings-content">

            {/* ================= GENERAL ================= */}

            {activeTab === "general" && (

              <div className="settings-card">

                <div className="settings-card-heading">

                  <div className="heading-icon">
                    <FaCog />
                  </div>

                  <div>
                    <h2>General Settings</h2>
                    <p>
                      Configure your basic workspace preferences.
                    </p>
                  </div>

                </div>

                <div className="settings-section">

                  <h3>Workspace</h3>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      <FaGlobe />
                    </div>

                    <div className="setting-info">
                      <strong>Language</strong>
                      <span>
                        Select the language used throughout Forma AI.
                      </span>
                    </div>

                    <select
                      value={settings.language}
                      onChange={(e) =>
                        updateSelect("language", e.target.value)
                      }
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Telugu</option>
                    </select>

                  </div>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      <FaGlobe />
                    </div>

                    <div className="setting-info">
                      <strong>Timezone</strong>
                      <span>
                        Used for submission timestamps and reports.
                      </span>
                    </div>

                    <select
                      value={settings.timezone}
                      onChange={(e) =>
                        updateSelect("timezone", e.target.value)
                      }
                    >
                      <option value="Asia/Kolkata">
                        India Standard Time
                      </option>
                      <option value="UTC">
                        UTC
                      </option>
                      <option value="America/New_York">
                        Eastern Time
                      </option>
                    </select>

                  </div>

                </div>

                <div className="settings-section">

                  <h3>Appearance</h3>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      {settings.darkMode ? (
                        <FaMoon />
                      ) : (
                        <FaSun />
                      )}
                    </div>

                    <div className="setting-info">
                      <strong>Dark Mode</strong>
                      <span>
                        Use a darker interface for your workspace.
                      </span>
                    </div>

                    <label className="setting-toggle">
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={() =>
                          updateSetting("darkMode")
                        }
                      />
                      <span></span>
                    </label>

                  </div>

                </div>

              </div>

            )}

            {/* ================= NOTIFICATIONS ================= */}

            {activeTab === "notifications" && (

              <div className="settings-card">

                <div className="settings-card-heading">

                  <div className="heading-icon">
                    <FaBell />
                  </div>

                  <div>
                    <h2>Notification Settings</h2>
                    <p>
                      Choose which notifications you want to receive.
                    </p>
                  </div>

                </div>

                <div className="settings-section">

                  <h3>Email Notifications</h3>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      <FaEnvelope />
                    </div>

                    <div className="setting-info">
                      <strong>Email Notifications</strong>
                      <span>
                        Receive important account updates by email.
                      </span>
                    </div>

                    <label className="setting-toggle">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={() =>
                          updateSetting("emailNotifications")
                        }
                      />
                      <span></span>
                    </label>

                  </div>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      <FaFileAlt />
                    </div>

                    <div className="setting-info">
                      <strong>Submission Alerts</strong>
                      <span>
                        Get notified when forms are submitted or updated.
                      </span>
                    </div>

                    <label className="setting-toggle">
                      <input
                        type="checkbox"
                        checked={settings.submissionAlerts}
                        onChange={() =>
                          updateSetting("submissionAlerts")
                        }
                      />
                      <span></span>
                    </label>

                  </div>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      <FaRobot />
                    </div>

                    <div className="setting-info">
                      <strong>AI Processing Alerts</strong>
                      <span>
                        Receive notifications when AI processing finishes.
                      </span>
                    </div>

                    <label className="setting-toggle">
                      <input
                        type="checkbox"
                        checked={settings.aiAlerts}
                        onChange={() =>
                          updateSetting("aiAlerts")
                        }
                      />
                      <span></span>
                    </label>

                  </div>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      <FaChartLine />
                    </div>

                    <div className="setting-info">
                      <strong>Weekly Analytics Report</strong>
                      <span>
                        Receive a weekly summary of your Forma AI activity.
                      </span>
                    </div>

                    <label className="setting-toggle">
                      <input
                        type="checkbox"
                        checked={settings.weeklyReports}
                        onChange={() =>
                          updateSetting("weeklyReports")
                        }
                      />
                      <span></span>
                    </label>

                  </div>

                </div>

              </div>

            )}

            {/* ================= SECURITY ================= */}

            {activeTab === "security" && (

              <div className="settings-card">

                <div className="settings-card-heading">

                  <div className="heading-icon security">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <h2>Security Settings</h2>
                    <p>
                      Protect your account and manage login security.
                    </p>
                  </div>

                </div>

                <div className="security-summary">

                  <div className="security-score-icon">
                    <FaCheckCircle />
                  </div>

                  <div>
                    <strong>Security Status: Excellent</strong>
                    <span>
                      Your account has recommended security settings enabled.
                    </span>
                  </div>

                  <div className="security-score">
                    95%
                  </div>

                </div>

                <div className="settings-section">

                  <h3>Account Protection</h3>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      <FaKey />
                    </div>

                    <div className="setting-info">
                      <strong>Password</strong>
                      <span>
                        Last changed 30 days ago.
                      </span>
                    </div>

                    <button className="outline-action">
                      Change Password
                    </button>

                  </div>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      <FaShieldAlt />
                    </div>

                    <div className="setting-info">
                      <strong>Two-Factor Authentication</strong>
                      <span>
                        Add an extra layer of security to your account.
                      </span>
                    </div>

                    <label className="setting-toggle">
                      <input
                        type="checkbox"
                        checked={settings.twoFactor}
                        onChange={() =>
                          updateSetting("twoFactor")
                        }
                      />
                      <span></span>
                    </label>

                  </div>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      <FaBell />
                    </div>

                    <div className="setting-info">
                      <strong>Login Alerts</strong>
                      <span>
                        Notify me whenever a new login is detected.
                      </span>
                    </div>

                    <label className="setting-toggle">
                      <input
                        type="checkbox"
                        checked={settings.loginAlerts}
                        onChange={() =>
                          updateSetting("loginAlerts")
                        }
                      />
                      <span></span>
                    </label>

                  </div>

                </div>

                <div className="active-sessions">

                  <h3>Active Sessions</h3>

                  <div className="session-item">

                    <div className="session-device">
                      <FaDesktop />
                    </div>

                    <div>
                      <strong>Windows • Chrome</strong>
                      <span>
                        Current session • India
                      </span>
                    </div>

                    <span className="current-session">
                      Current
                    </span>

                  </div>

                  <div className="session-item">

                    <div className="session-device">
                      <FaMobileAlt />
                    </div>

                    <div>
                      <strong>Android • Chrome</strong>
                      <span>
                        Last active 2 hours ago
                      </span>
                    </div>

                    <button>Revoke</button>

                  </div>

                </div>

              </div>

            )}

            {/* ================= AI ================= */}

            {activeTab === "ai" && (

              <div className="settings-card">

                <div className="settings-card-heading">

                  <div className="heading-icon ai">
                    <FaRobot />
                  </div>

                  <div>
                    <h2>AI Preferences</h2>
                    <p>
                      Control how Forma AI assists with your workflows.
                    </p>
                  </div>

                </div>

                <div className="ai-preferences-banner">

                  <div className="ai-banner-icon">
                    <FaRobot />
                  </div>

                  <div>
                    <strong>Forma AI Intelligence</strong>
                    <p>
                      AI preferences affect document parsing,
                      suggestions and dynamic form assistance.
                    </p>
                  </div>

                  <span>
                    <FaCheckCircle />
                    Active
                  </span>

                </div>

                <div className="settings-section">

                  <h3>AI Assistance</h3>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      <FaRobot />
                    </div>

                    <div className="setting-info">
                      <strong>AI Suggestions</strong>
                      <span>
                        Allow AI to suggest values for form fields.
                      </span>
                    </div>

                    <label className="setting-toggle">
                      <input
                        type="checkbox"
                        checked={settings.aiSuggestions}
                        onChange={() =>
                          updateSetting("aiSuggestions")
                        }
                      />
                      <span></span>
                    </label>

                  </div>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      <FaDatabase />
                    </div>

                    <div className="setting-info">
                      <strong>Automatic Form Saving</strong>
                      <span>
                        Automatically save form progress while working.
                      </span>
                    </div>

                    <label className="setting-toggle">
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={() =>
                          updateSetting("autoSave")
                        }
                      />
                      <span></span>
                    </label>

                  </div>

                </div>

                <div className="ai-confidence">

                  <div>
                    <span>AI Processing Quality</span>
                    <strong>97%</strong>
                  </div>

                  <div className="ai-progress">
                    <div></div>
                  </div>

                  <p>
                    Forma AI is currently operating with high confidence.
                  </p>

                </div>

              </div>

            )}

            {/* ================= PRIVACY ================= */}

            {activeTab === "privacy" && (

              <div className="settings-card">

                <div className="settings-card-heading">

                  <div className="heading-icon privacy">
                    <FaLock />
                  </div>

                  <div>
                    <h2>Privacy & Data</h2>
                    <p>
                      Manage your data and account privacy.
                    </p>
                  </div>

                </div>

                <div className="privacy-banner">

                  <FaShieldAlt />

                  <div>
                    <strong>Your data is protected</strong>
                    <p>
                      Forma AI uses security controls to protect
                      your workspace information.
                    </p>
                  </div>

                </div>

                <div className="settings-section">

                  <h3>Data Management</h3>

                  <div className="setting-row">

                    <div className="setting-row-icon">
                      <FaDownload />
                    </div>

                    <div className="setting-info">
                      <strong>Download Your Data</strong>
                      <span>
                        Export your Forma AI account information.
                      </span>
                    </div>

                    <button className="outline-action">
                      Export Data
                    </button>

                  </div>

                  <div className="setting-row danger-row">

                    <div className="setting-row-icon danger">
                      <FaTrash />
                    </div>

                    <div className="setting-info">
                      <strong>Delete Account</strong>
                      <span>
                        Permanently delete your Forma AI account.
                      </span>
                    </div>

                    <button className="danger-action">
                      Delete Account
                    </button>

                  </div>

                </div>

              </div>

            )}

            {/* SAVE */}

            <div className="settings-save-bar">

              <div>
                <FaCheckCircle />
                <span>
                  Changes are saved locally until connected to your account.
                </span>
              </div>

              <button onClick={saveSettings}>
                <FaSave />
                Save Settings
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Settings;