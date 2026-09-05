import React, { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Submissions.css";

import {
  FaRobot,
  FaTachometerAlt,
  FaFileAlt,
  FaChartLine,
  FaUserCircle,
  FaBell,
  FaSearch,
  FaFilter,
  FaEye,
  FaDownload,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowRight,
  FaHeartbeat,
  FaCar,
  FaHome,
  FaPlane,
  FaUserShield,
  FaTimes,
} from "react-icons/fa";

const submissionsData = [
  {
    id: "FM-10248",
    form: "Health Insurance Claim",
    type: "Health",
    customer: "Rahul Sharma",
    status: "Approved",
    confidence: 98,
    date: "05 Sep 2026",
    time: "10:42 AM",
  },
  {
    id: "FM-10247",
    form: "Vehicle Insurance Claim",
    type: "Vehicle",
    customer: "Arjun Reddy",
    status: "Pending",
    confidence: 94,
    date: "05 Sep 2026",
    time: "09:18 AM",
  },
  {
    id: "FM-10246",
    form: "Life Insurance Policy",
    type: "Life",
    customer: "Priya Kumar",
    status: "Validated",
    confidence: 97,
    date: "04 Sep 2026",
    time: "04:35 PM",
  },
  {
    id: "FM-10245",
    form: "Travel Insurance",
    type: "Travel",
    customer: "Sneha Patel",
    status: "Rejected",
    confidence: 81,
    date: "04 Sep 2026",
    time: "01:22 PM",
  },
  {
    id: "FM-10244",
    form: "Property Insurance",
    type: "Property",
    customer: "Vikram Singh",
    status: "Approved",
    confidence: 96,
    date: "03 Sep 2026",
    time: "11:48 AM",
  },
  {
    id: "FM-10243",
    form: "Health Insurance Claim",
    type: "Health",
    customer: "Ananya Rao",
    status: "Pending",
    confidence: 91,
    date: "03 Sep 2026",
    time: "10:15 AM",
  },
  {
    id: "FM-10242",
    form: "Vehicle Insurance Claim",
    type: "Vehicle",
    customer: "Kiran Kumar",
    status: "Approved",
    confidence: 99,
    date: "02 Sep 2026",
    time: "03:41 PM",
  },
  {
    id: "FM-10241",
    form: "Life Insurance Policy",
    type: "Life",
    customer: "Meghana Reddy",
    status: "Validated",
    confidence: 95,
    date: "02 Sep 2026",
    time: "12:06 PM",
  },
];

const getIcon = (type) => {
  switch (type) {
    case "Health":
      return <FaHeartbeat />;
    case "Vehicle":
      return <FaCar />;
    case "Property":
      return <FaHome />;
    case "Travel":
      return <FaPlane />;
    case "Life":
      return <FaUserShield />;
    default:
      return <FaFileAlt />;
  }
};

const Submissions = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const filteredSubmissions = useMemo(() => {
    return submissionsData.filter((submission) => {
      const matchesSearch =
        submission.form.toLowerCase().includes(search.toLowerCase()) ||
        submission.customer.toLowerCase().includes(search.toLowerCase()) ||
        submission.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || submission.status === statusFilter;

      const matchesType =
        typeFilter === "All" || submission.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  return (
    <div className="submissions-page">

      {/* SIDEBAR */}
      <aside className="submission-sidebar">

        <div className="submission-logo">
          <div className="logo-icon">
            <FaRobot />
          </div>
          <div>
            <h2>Forma AI</h2>
            <span>Insurance Intelligence</span>
          </div>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <ul className="submission-menu">

          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "submission-link active" : "submission-link"
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
                isActive ? "submission-link active" : "submission-link"
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
                isActive ? "submission-link active" : "submission-link"
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
                isActive ? "submission-link active" : "submission-link"
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
                isActive ? "submission-link active" : "submission-link"
              }
            >
              <FaFileAlt />
              <span>Submissions</span>
            </NavLink>
          </li>
        </ul>

        <div className="sidebar-section-title bottom-title">
          ACCOUNT
        </div>

        <ul className="submission-menu">

          <li>
            <a href="#" className="submission-link">
              <FaUserCircle />
              <span>Profile</span>
            </a>
          </li>

          <li>
            <a href="#" className="submission-link">
              <FaBell />
              <span>Notifications</span>
              <small className="notification-count">3</small>
            </a>
          </li>

        </ul>

        <div className="sidebar-ai-card">
          <div className="ai-card-icon">
            <FaRobot />
          </div>

          <div>
            <strong>AI Engine</strong>
            <span>Operational</span>
          </div>

          <div className="online-dot"></div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="submission-main">

        {/* HEADER */}
        <header className="submission-header">

          <div>
            <div className="breadcrumb">
              Dashboard <FaArrowRight /> Submissions
            </div>

            <h1>Submissions</h1>

            <p>
              Manage, review and track all insurance form submissions.
            </p>
          </div>

          <div className="submission-header-right">

            <div className="header-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search submissions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button className="notification-button">
              <FaBell />
              <span>3</span>
            </button>

            <div className="header-user">
              <FaUserCircle />
              <div>
                <span>Welcome</span>
                <strong>User</strong>
              </div>
            </div>

          </div>

        </header>

        {/* TOP STATS */}
        <section className="submission-stats">

          <div className="submission-stat-card">
            <div className="stat-icon total">
              <FaFileAlt />
            </div>

            <div>
              <span>Total Submissions</span>
              <h2>1,248</h2>
              <small>
                <FaArrowRight /> +12.8% this month
              </small>
            </div>
          </div>

          <div className="submission-stat-card">
            <div className="stat-icon approved">
              <FaCheckCircle />
            </div>

            <div>
              <span>Approved</span>
              <h2>842</h2>
              <small>
                <FaArrowRight /> 67.5% success rate
              </small>
            </div>
          </div>

          <div className="submission-stat-card">
            <div className="stat-icon pending">
              <FaClock />
            </div>

            <div>
              <span>Pending Review</span>
              <h2>286</h2>
              <small>
                <FaArrowRight /> 22.9% of submissions
              </small>
            </div>
          </div>

          <div className="submission-stat-card">
            <div className="stat-icon rejected">
              <FaTimesCircle />
            </div>

            <div>
              <span>Rejected</span>
              <h2>120</h2>
              <small>
                <FaArrowRight /> 9.6% rejection rate
              </small>
            </div>
          </div>

        </section>

        {/* TABLE CARD */}
        <section className="submissions-card">

          <div className="submissions-card-header">

            <div>
              <h2>Recent Submissions</h2>
              <p>
                Review the latest insurance applications and claims.
              </p>
            </div>

            <button className="export-button">
              <FaDownload />
              Export
            </button>

          </div>

          {/* FILTER BAR */}
          <div className="filter-bar">

            <div className="filter-label">
              <FaFilter />
              Filters
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Validated">Validated</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Health">Health</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Property">Property</option>
              <option value="Travel">Travel</option>
              <option value="Life">Life</option>
            </select>

            <div className="results-count">
              {filteredSubmissions.length} results
            </div>

          </div>

          {/* TABLE */}
          <div className="table-wrapper">

            <table className="submissions-table">

              <thead>
                <tr>
                  <th>Submission</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>AI Confidence</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredSubmissions.map((submission) => (

                  <tr key={submission.id}>

                    <td>
                      <div className="submission-name">

                        <div className={`form-type-icon ${submission.type.toLowerCase()}`}>
                          {getIcon(submission.type)}
                        </div>

                        <div>
                          <strong>{submission.form}</strong>
                          <span>{submission.id}</span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <span className="customer-name">
                        {submission.customer}
                      </span>
                    </td>

                    <td>
                      <span className="type-badge">
                        {submission.type}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${submission.status.toLowerCase()}`}
                      >
                        {submission.status === "Approved" && <FaCheckCircle />}
                        {submission.status === "Validated" && <FaCheckCircle />}
                        {submission.status === "Pending" && <FaClock />}
                        {submission.status === "Rejected" && <FaTimesCircle />}

                        {submission.status}
                      </span>
                    </td>

                    <td>

                      <div className="confidence-wrapper">

                        <div className="confidence-bar">
                          <div
                            className="confidence-fill"
                            style={{
                              width: `${submission.confidence}%`,
                            }}
                          ></div>
                        </div>

                        <strong>
                          {submission.confidence}%
                        </strong>

                      </div>

                    </td>

                    <td>
                      <div className="date-cell">
                        <strong>{submission.date}</strong>
                        <span>{submission.time}</span>
                      </div>
                    </td>

                    <td>

                      <button
                        className="view-button"
                        onClick={() =>
                          setSelectedSubmission(submission)
                        }
                      >
                        <FaEye />
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {filteredSubmissions.length === 0 && (
              <div className="empty-state">
                <FaSearch />
                <h3>No submissions found</h3>
                <p>
                  Try changing your search or filters.
                </p>
              </div>
            )}

          </div>

          {/* PAGINATION */}
          <div className="pagination">

            <span>
              Showing 1–{filteredSubmissions.length} of 1,248 submissions
            </span>

            <div className="pagination-buttons">
              <button disabled>Previous</button>
              <button className="page-active">1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>Next</button>
            </div>

          </div>

        </section>

      </main>

      {/* VIEW MODAL */}
      {selectedSubmission && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedSubmission(null)}
        >

          <div
            className="submission-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setSelectedSubmission(null)}
            >
              <FaTimes />
            </button>

            <div className="modal-top">

              <div className="modal-icon">
                {getIcon(selectedSubmission.type)}
              </div>

              <div>
                <span>Submission ID</span>
                <h2>{selectedSubmission.id}</h2>
              </div>

            </div>

            <div className="modal-status">
              <span
                className={`status-badge ${selectedSubmission.status.toLowerCase()}`}
              >
                {selectedSubmission.status}
              </span>

              <span className="modal-confidence">
                AI Confidence: <strong>
                  {selectedSubmission.confidence}%
                </strong>
              </span>
            </div>

            <div className="modal-details">

              <div>
                <span>Form</span>
                <strong>{selectedSubmission.form}</strong>
              </div>

              <div>
                <span>Customer</span>
                <strong>{selectedSubmission.customer}</strong>
              </div>

              <div>
                <span>Insurance Type</span>
                <strong>{selectedSubmission.type}</strong>
              </div>

              <div>
                <span>Submitted</span>
                <strong>
                  {selectedSubmission.date} • {selectedSubmission.time}
                </strong>
              </div>

            </div>

            <div className="modal-ai-box">

              <FaRobot />

              <div>
                <strong>AI Verification Complete</strong>
                <p>
                  Forma AI successfully analyzed the submitted form
                  and validated the extracted information.
                </p>
              </div>

            </div>

            <div className="modal-actions">

              <button className="secondary-modal-button">
                <FaDownload />
                Download
              </button>

              <button className="primary-modal-button">
                Open Submission
                <FaArrowRight />
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Submissions;