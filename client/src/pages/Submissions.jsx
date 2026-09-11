
// ==========================================
// Forma AI - Submissions Page
// Backend + PDF Connected Version
// ==========================================

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { NavLink } from "react-router-dom";

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
  FaSpinner,
  FaFilePdf,
} from "react-icons/fa";

// ==========================================
// Backend API
// ==========================================

import {
  getClaims,
  getClaimById,
} from "../services/claimService";

// ==========================================
// PDF Generator
// ==========================================

import { generateClaimPDF } from "../services/pdfService";

// ==========================================
// Insurance Icon
// ==========================================

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

// ==========================================
// Convert Backend Category
// ==========================================

const formatType = (category) => {
  if (!category) {
    return "Unknown";
  }

  return (
    category.charAt(0).toUpperCase() +
    category.slice(1).toLowerCase()
  );
};

// ==========================================
// Form Name
// ==========================================

const getFormName = (category) => {
  switch (category) {
    case "health":
      return "Health Insurance Claim";

    case "vehicle":
      return "Vehicle Insurance Claim";

    case "property":
      return "Property Insurance Claim";

    case "travel":
      return "Travel Insurance Claim";

    case "life":
      return "Life Insurance Claim";

    default:
      return "Insurance Claim";
  }
};

// ==========================================
// Status Formatting
// ==========================================

const formatStatus = (status) => {
  if (!status) {
    return "Draft";
  }

  switch (status) {
    case "draft":
      return "Draft";

    case "submitted":
      return "Submitted";

    case "under_review":
      return "Under Review";

    case "approved":
      return "Approved";

    case "rejected":
      return "Rejected";

    default:
      return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        );
  }
};

// ==========================================
// Date Formatting
// ==========================================

const formatDate = (dateValue) => {
  if (!dateValue) {
    return {
      date: "Not available",
      time: "",
    };
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "Not available",
      time: "",
    };
  }

  return {
    date: date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),

    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

// ==========================================
// Customer Name
// ==========================================

const getCustomerName = (claim) => {
  const data = claim.claimData || {};

  return (
    data.applicantName ||
    data.patientName ||
    data.ownerName ||
    data.travelerName ||
    data.policyHolderName ||
    data.policyHolder ||
    data.driverName ||
    data.nomineeName ||
    "Unknown Customer"
  );
};

// ==========================================
// AI Confidence
// ==========================================

const getConfidence = (claim) => {
  if (
    typeof claim.aiConfidence === "number" &&
    !Number.isNaN(claim.aiConfidence)
  ) {
    if (claim.aiConfidence <= 1) {
      return Math.round(
        claim.aiConfidence * 100
      );
    }

    return Math.round(
      claim.aiConfidence
    );
  }

  return null;
};

// ==========================================
// Normalize Backend Claim
// ==========================================

const normalizeClaim = (claim) => {
  const formattedDate = formatDate(
    claim.submittedAt ||
      claim.createdAt
  );

  const type = formatType(
    claim.category
  );

  return {
    id:
      claim.claimNumber ||
      claim._id,

    databaseId:
      claim._id,

    form:
      getFormName(
        claim.category
      ),

    type,

    customer:
      getCustomerName(claim),

    status:
      formatStatus(
        claim.status
      ),

    confidence:
      getConfidence(claim),

    date:
      formattedDate.date,

    time:
      formattedDate.time,

    rawClaim:
      claim,
  };
};

// ==========================================
// Submissions Component
// ==========================================

const Submissions = () => {
  // ========================================
  // State
  // ========================================

  const [
    submissions,
    setSubmissions,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    typeFilter,
    setTypeFilter,
  ] = useState("All");

  const [
    selectedSubmission,
    setSelectedSubmission,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ========================================
  // PDF State
  // ========================================

  const [
    pdfUrl,
    setPdfUrl,
  ] = useState("");

  const [
    pdfFileName,
    setPdfFileName,
  ] = useState("");

  const [
    generatingPdf,
    setGeneratingPdf,
  ] = useState(false);

  // ========================================
  // Load Claims
  // ========================================

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const result =
        await getClaims();

      console.log(
        "📦 Claims received from backend:",
        result
      );

      const claims =
        Array.isArray(result)
          ? result
          : result?.claims ||
            result?.data ||
            [];

      const normalizedClaims =
        claims.map(
          normalizeClaim
        );

      setSubmissions(
        normalizedClaims
      );
    } catch (err) {
      console.error(
        "❌ Failed to load submissions:",
        err
      );

      setError(
        err.message ||
          "Unable to load submissions from backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Load When Page Opens
  // ========================================

  useEffect(() => {
    loadSubmissions();
  }, []);

  // ========================================
  // Search + Filters
  // ========================================

  const filteredSubmissions =
    useMemo(() => {
      return submissions.filter(
        (submission) => {
          const searchValue =
            search.toLowerCase();

          const matchesSearch =
            submission.form
              .toLowerCase()
              .includes(searchValue) ||
            submission.customer
              .toLowerCase()
              .includes(searchValue) ||
            submission.id
              .toLowerCase()
              .includes(searchValue);

          const matchesStatus =
            statusFilter === "All" ||
            submission.status ===
              statusFilter;

          const matchesType =
            typeFilter === "All" ||
            submission.type ===
              typeFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesType
          );
        }
      );
    }, [
      submissions,
      search,
      statusFilter,
      typeFilter,
    ]);

  // ========================================
  // Statistics
  // ========================================

  const totalSubmissions =
    submissions.length;

  const approvedCount =
    submissions.filter(
      (item) =>
        item.status ===
        "Approved"
    ).length;

  const pendingCount =
    submissions.filter(
      (item) =>
        item.status ===
          "Submitted" ||
        item.status ===
          "Under Review" ||
        item.status ===
          "Pending"
    ).length;

  const rejectedCount =
    submissions.filter(
      (item) =>
        item.status ===
        "Rejected"
    ).length;

  // ========================================
  // Generate PDF
  // ========================================

  const createPDFForSubmission =
    async (submission) => {
      try {
        setGeneratingPdf(true);

        // Get the most recent claim
        const result =
          await getClaimById(
            submission.databaseId
          );

        const claim =
          result?.claim ||
          result?.data ||
          result;

        if (
          !claim ||
          typeof claim !==
            "object"
        ) {
          throw new Error(
            "Claim data could not be retrieved."
          );
        }

        // Revoke old object URL
        if (pdfUrl) {
          URL.revokeObjectURL(
            pdfUrl
          );
        }

        // Generate PDF
        const generatedPDF =
          generateClaimPDF({
            claim,
            category:
              claim.category ||
              submission.type.toLowerCase(),

            claimData:
              claim.claimData ||
              {},
          });

        if (
          !generatedPDF?.url
        ) {
          throw new Error(
            "PDF generation failed."
          );
        }

        setPdfUrl(
          generatedPDF.url
        );

        setPdfFileName(
          generatedPDF.fileName ||
            `${submission.id}.pdf`
        );

        // Keep complete claim in selected submission
        setSelectedSubmission({
          ...normalizeClaim(
            claim
          ),
          rawClaim:
            claim,
          pdfReady:
            true,
        });

        return generatedPDF;

      } catch (err) {
        console.error(
          "❌ PDF generation failed:",
          err
        );

        setSelectedSubmission(
          (previous) => ({
            ...(previous ||
              submission),
            pdfError:
              err.message ||
              "Unable to generate PDF.",
          })
        );

        throw err;

      } finally {
        setGeneratingPdf(
          false
        );
      }
    };

  // ========================================
  // View Submission
  // ========================================

  const handleViewSubmission =
    async (submission) => {
      try {
        setSelectedSubmission({
          ...submission,
          loadingDetails: true,
          pdfError: "",
        });

        // Remove old PDF
        if (pdfUrl) {
          URL.revokeObjectURL(
            pdfUrl
          );

          setPdfUrl("");
        }

        setPdfFileName("");

        // Fetch full claim
        const result =
          await getClaimById(
            submission.databaseId
          );

        const claim =
          result?.claim ||
          result?.data ||
          result;

        const normalized =
          normalizeClaim(
            claim
          );

        setSelectedSubmission({
          ...normalized,
          rawClaim:
            claim,
          loadingDetails:
            false,
          pdfReady: false,
          pdfError: "",
        });

        // Automatically generate PDF
        await createPDFForSubmission({
          ...normalized,
          rawClaim:
            claim,
        });

      } catch (err) {
        console.error(
          "❌ Failed to fetch claim details:",
          err
        );

        setSelectedSubmission(
          (previous) => ({
            ...(previous || {}),
            ...submission,
            loadingDetails:
              false,
            pdfError:
              err.message ||
              "Unable to load claim details.",
          })
        );
      }
    };

  // ========================================
  // Download PDF
  // ========================================

  const handleDownloadPDF =
    async () => {
      try {
        let downloadUrl =
          pdfUrl;

        let fileName =
          pdfFileName ||
          `${selectedSubmission?.id || "forma-ai-claim"}.pdf`;

        // Generate if not available
        if (!downloadUrl) {
          const generated =
            await createPDFForSubmission(
              selectedSubmission
            );

          downloadUrl =
            generated.url;

          fileName =
            generated.fileName ||
            fileName;
        }

        if (!downloadUrl) {
          throw new Error(
            "PDF URL is not available."
          );
        }

        const link =
          document.createElement(
            "a"
          );

        link.href =
          downloadUrl;

        link.download =
          fileName;

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

      } catch (err) {
        console.error(
          "❌ PDF download failed:",
          err
        );

        setSelectedSubmission(
          (previous) => ({
            ...(previous || {}),
            pdfError:
              err.message ||
              "Unable to download PDF.",
          })
        );
      }
    };

  // ========================================
  // Open PDF
  // ========================================

  const handleOpenPDF =
    async () => {
      try {
        let url =
          pdfUrl;

        if (!url) {
          const generated =
            await createPDFForSubmission(
              selectedSubmission
            );

          url =
            generated.url;
        }

        if (!url) {
          throw new Error(
            "PDF URL is not available."
          );
        }

        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );

      } catch (err) {
        console.error(
          "❌ Failed to open PDF:",
          err
        );
      }
    };

  // ========================================
  // Close Modal
  // ========================================

  const handleCloseModal =
    () => {
      setSelectedSubmission(
        null
      );

      if (pdfUrl) {
        URL.revokeObjectURL(
          pdfUrl
        );

        setPdfUrl("");
      }

      setPdfFileName("");
      setGeneratingPdf(false);
    };

  // ========================================
  // Cleanup
  // ========================================

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(
          pdfUrl
        );
      }
    };
  }, [pdfUrl]);

  // ========================================
  // Render
  // ========================================

  return (
    <div className="submissions-page">

      {/* ====================================
          SIDEBAR
      ==================================== */}

      <aside className="submission-sidebar">

        <div className="submission-logo">

          <div className="logo-icon">
            <FaRobot />
          </div>

          <div>
            <h2>Forma AI</h2>
            <span>
              Insurance Intelligence
            </span>
          </div>

        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <ul className="submission-menu">

          <li>
            <NavLink
              to="/dashboard"
              className={({
                isActive,
              }) =>
                isActive
                  ? "submission-link active"
                  : "submission-link"
              }
            >
              <FaTachometerAlt />
              <span>
                Dashboard
              </span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/ai-parser"
              className={({
                isActive,
              }) =>
                isActive
                  ? "submission-link active"
                  : "submission-link"
              }
            >
              <FaRobot />
              <span>
                AI Parser
              </span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dynamic-forms"
              className={({
                isActive,
              }) =>
                isActive
                  ? "submission-link active"
                  : "submission-link"
              }
            >
              <FaFileAlt />
              <span>
                Dynamic Forms
              </span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/analytics"
              className={({
                isActive,
              }) =>
                isActive
                  ? "submission-link active"
                  : "submission-link"
              }
            >
              <FaChartLine />
              <span>
                Analytics
              </span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/submissions"
              className={({
                isActive,
              }) =>
                isActive
                  ? "submission-link active"
                  : "submission-link"
              }
            >
              <FaFileAlt />
              <span>
                Submissions
              </span>
            </NavLink>
          </li>

        </ul>

        <div className="sidebar-section-title bottom-title">
          ACCOUNT
        </div>

        <ul className="submission-menu">

          <li>
            <a
              href="#"
              className="submission-link"
              onClick={(e) =>
                e.preventDefault()
              }
            >
              <FaUserCircle />
              <span>
                Profile
              </span>
            </a>
          </li>

          <li>
            <a
              href="#"
              className="submission-link"
              onClick={(e) =>
                e.preventDefault()
              }
            >
              <FaBell />
              <span>
                Notifications
              </span>

              <small className="notification-count">
                3
              </small>
            </a>
          </li>

        </ul>

        <div className="sidebar-ai-card">

          <div className="ai-card-icon">
            <FaRobot />
          </div>

          <div>
            <strong>
              AI Engine
            </strong>

            <span>
              Operational
            </span>
          </div>

          <div className="online-dot"></div>

        </div>

      </aside>

      {/* ====================================
          MAIN CONTENT
      ==================================== */}

      <main className="submission-main">

        {/* HEADER */}

        <header className="submission-header">

          <div>

            <div className="breadcrumb">
              Dashboard
              <FaArrowRight />
              Submissions
            </div>

            <h1>
              Submissions
            </h1>

            <p>
              Manage, review and track
              all insurance form
              submissions.
            </p>

          </div>

          <div className="submission-header-right">

            <div className="header-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search submissions..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            <button className="notification-button">
              <FaBell />
              <span>3</span>
            </button>

            <div className="header-user">

              <FaUserCircle />

              <div>
                <span>
                  Welcome
                </span>

                <strong>
                  User
                </strong>
              </div>

            </div>

          </div>

        </header>

        {/* ====================================
            TOP STATS
        ==================================== */}

        <section className="submission-stats">

          <div className="submission-stat-card">

            <div className="stat-icon total">
              <FaFileAlt />
            </div>

            <div>
              <span>
                Total Submissions
              </span>

              <h2>
                {loading
                  ? "..."
                  : totalSubmissions}
              </h2>

              <small>
                <FaArrowRight />
                Stored in MongoDB
              </small>
            </div>

          </div>

          <div className="submission-stat-card">

            <div className="stat-icon approved">
              <FaCheckCircle />
            </div>

            <div>
              <span>
                Approved
              </span>

              <h2>
                {loading
                  ? "..."
                  : approvedCount}
              </h2>

              <small>
                <FaArrowRight />
                Approved claims
              </small>
            </div>

          </div>

          <div className="submission-stat-card">

            <div className="stat-icon pending">
              <FaClock />
            </div>

            <div>
              <span>
                Pending Review
              </span>

              <h2>
                {loading
                  ? "..."
                  : pendingCount}
              </h2>

              <small>
                <FaArrowRight />
                Awaiting review
              </small>
            </div>

          </div>

          <div className="submission-stat-card">

            <div className="stat-icon rejected">
              <FaTimesCircle />
            </div>

            <div>
              <span>
                Rejected
              </span>

              <h2>
                {loading
                  ? "..."
                  : rejectedCount}
              </h2>

              <small>
                <FaArrowRight />
                Rejected claims
              </small>
            </div>

          </div>

        </section>

        {/* ====================================
            SUBMISSIONS CARD
        ==================================== */}

        <section className="submissions-card">

          <div className="submissions-card-header">

            <div>
              <h2>
                Recent Submissions
              </h2>

              <p>
                Real insurance claims
                retrieved from the
                Forma AI backend.
              </p>
            </div>

            {/* Refresh */}

            <button
              className="export-button"
              onClick={
                loadSubmissions
              }
              disabled={loading}
            >
              <FaArrowRight />
              Refresh
            </button>

          </div>

          {/* ERROR */}

          {error && (

            <div className="empty-state">

              <FaTimesCircle />

              <h3>
                Unable to load submissions
              </h3>

              <p>
                {error}
              </p>

              <button
                className="view-button"
                onClick={
                  loadSubmissions
                }
              >
                Try Again
              </button>

            </div>
          )}

          {/* FILTER BAR */}

          {!error && (

            <div className="filter-bar">

              <div className="filter-label">
                <FaFilter />
                Filters
              </div>

              <select
                value={
                  statusFilter
                }
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Draft">
                  Draft
                </option>

                <option value="Submitted">
                  Submitted
                </option>

                <option value="Under Review">
                  Under Review
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Rejected">
                  Rejected
                </option>

              </select>

              <select
                value={
                  typeFilter
                }
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All Types
                </option>

                <option value="Health">
                  Health
                </option>

                <option value="Vehicle">
                  Vehicle
                </option>

                <option value="Property">
                  Property
                </option>

                <option value="Travel">
                  Travel
                </option>

                <option value="Life">
                  Life
                </option>

              </select>

              <div className="results-count">
                {
                  filteredSubmissions.length
                }{" "}
                results
              </div>

            </div>
          )}

          {/* LOADING */}

          {loading &&
            !error && (

              <div className="empty-state">

                <FaSpinner className="fa-spin" />

                <h3>
                  Loading submissions...
                </h3>

                <p>
                  Fetching claims from
                  the Forma AI backend.
                </p>

              </div>
            )}

          {/* TABLE */}

          {!loading &&
            !error &&
            filteredSubmissions.length >
              0 && (

              <div className="table-wrapper">

                <table className="submissions-table">

                  <thead>

                    <tr>

                      <th>
                        Submission
                      </th>

                      <th>
                        Customer
                      </th>

                      <th>
                        Type
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        AI Confidence
                      </th>

                      <th>
                        Date
                      </th>

                      <th>
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredSubmissions.map(
                      (submission) => (

                        <tr
                          key={
                            submission.databaseId
                          }
                        >

                          {/* Submission */}

                          <td>

                            <div className="submission-name">

                              <div
                                className={`form-type-icon ${submission.type.toLowerCase()}`}
                              >
                                {getIcon(
                                  submission.type
                                )}
                              </div>

                              <div>

                                <strong>
                                  {
                                    submission.form
                                  }
                                </strong>

                                <span>
                                  {
                                    submission.id
                                  }
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* Customer */}

                          <td>

                            <span className="customer-name">
                              {
                                submission.customer
                              }
                            </span>

                          </td>

                          {/* Type */}

                          <td>

                            <span className="type-badge">
                              {
                                submission.type
                              }
                            </span>

                          </td>

                          {/* Status */}

                          <td>

                            <span
                              className={`status-badge ${submission.status
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >

                              {submission.status ===
                                "Approved" && (
                                <FaCheckCircle />
                              )}

                              {submission.status ===
                                "Rejected" && (
                                <FaTimesCircle />
                              )}

                              {(submission.status ===
                                "Submitted" ||
                                submission.status ===
                                  "Under Review" ||
                                submission.status ===
                                  "Draft") && (
                                <FaClock />
                              )}

                              {
                                submission.status
                              }

                            </span>

                          </td>

                          {/* Confidence */}

                          <td>

                            {submission.confidence !==
                            null ? (

                              <div className="confidence-wrapper">

                                <div className="confidence-bar">

                                  <div
                                    className="confidence-fill"
                                    style={{
                                      width: `${submission.confidence}%`,
                                    }}
                                  />

                                </div>

                                <strong>
                                  {
                                    submission.confidence
                                  }
                                  %
                                </strong>

                              </div>

                            ) : (

                              <span>
                                Not analyzed
                              </span>

                            )}

                          </td>

                          {/* Date */}

                          <td>

                            <div className="date-cell">

                              <strong>
                                {
                                  submission.date
                                }
                              </strong>

                              <span>
                                {
                                  submission.time
                                }
                              </span>

                            </div>

                          </td>

                          {/* Action */}

                          <td>

                            <button
                              className="view-button"
                              onClick={() =>
                                handleViewSubmission(
                                  submission
                                )
                              }
                            >
                              <FaEye />
                              View
                            </button>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          {/* FILTER EMPTY */}

          {!loading &&
            !error &&
            filteredSubmissions.length ===
              0 &&
            submissions.length > 0 && (

              <div className="empty-state">

                <FaSearch />

                <h3>
                  No submissions found
                </h3>

                <p>
                  Try changing your search
                  or filters.
                </p>

              </div>
            )}

          {/* NO RECORDS */}

          {!loading &&
            !error &&
            submissions.length ===
              0 && (

              <div className="empty-state">

                <FaFileAlt />

                <h3>
                  No submissions yet
                </h3>

                <p>
                  Claims saved from Dynamic
                  Forms will appear here.
                </p>

              </div>
            )}

          {/* PAGINATION INFO */}

          {!loading &&
            !error &&
            submissions.length > 0 && (

              <div className="pagination">

                <span>
                  Showing{" "}
                  {
                    filteredSubmissions.length
                  }{" "}
                  of{" "}
                  {
                    submissions.length
                  }{" "}
                  submissions
                </span>

                <div className="pagination-buttons">

                  <button disabled>
                    Previous
                  </button>

                  <button className="page-active">
                    1
                  </button>

                  <button disabled>
                    Next
                  </button>

                </div>

              </div>
            )}

        </section>

      </main>

      {/* ======================================
          VIEW SUBMISSION MODAL
      ====================================== */}

      {selectedSubmission && (

        <div
          className="modal-overlay"
          onClick={
            handleCloseModal
          }
        >

          <div
            className="submission-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              className="modal-close"
              onClick={
                handleCloseModal
              }
            >
              <FaTimes />
            </button>

            {/* MODAL HEADER */}

            <div className="modal-top">

              <div className="modal-icon">
                {getIcon(
                  selectedSubmission.type
                )}
              </div>

              <div>

                <span>
                  Claim Number
                </span>

                <h2>
                  {
                    selectedSubmission.id
                  }
                </h2>

              </div>

            </div>

            {/* STATUS */}

            <div className="modal-status">

              <span
                className={`status-badge ${selectedSubmission.status
                  .toLowerCase()
                  .replace(
                    /\s+/g,
                    "-"
                  )}`}
              >
                {
                  selectedSubmission.status
                }
              </span>

              <span className="modal-confidence">
                AI Confidence:{" "}

                <strong>
                  {
                    selectedSubmission.confidence !==
                    null
                      ? `${selectedSubmission.confidence}%`
                      : "Not analyzed"
                  }
                </strong>
              </span>

            </div>

            {/* DETAILS */}

            <div className="modal-details">

              <div>

                <span>
                  Form
                </span>

                <strong>
                  {
                    selectedSubmission.form
                  }
                </strong>

              </div>

              <div>

                <span>
                  Customer
                </span>

                <strong>
                  {
                    selectedSubmission.customer
                  }
                </strong>

              </div>

              <div>

                <span>
                  Insurance Type
                </span>

                <strong>
                  {
                    selectedSubmission.type
                  }
                </strong>

              </div>

              <div>

                <span>
                  Submitted
                </span>

                <strong>
                  {
                    selectedSubmission.date
                  }
                  {" • "}
                  {
                    selectedSubmission.time
                  }
                </strong>

              </div>

            </div>

            {/* LOADING DETAILS */}

            {selectedSubmission.loadingDetails && (

              <div className="modal-ai-box">

                <FaSpinner className="fa-spin" />

                <div>

                  <strong>
                    Loading Claim
                  </strong>

                  <p>
                    Retrieving the complete
                    claim from MongoDB.
                  </p>

                </div>

              </div>
            )}

            {/* PDF ERROR */}

            {selectedSubmission.pdfError && (

              <div className="modal-ai-box">

                <FaTimesCircle />

                <div>

                  <strong>
                    PDF Error
                  </strong>

                  <p>
                    {
                      selectedSubmission.pdfError
                    }
                  </p>

                </div>

              </div>
            )}

            {/* PDF GENERATING */}

            {generatingPdf &&
              !selectedSubmission.loadingDetails && (

                <div className="modal-ai-box">

                  <FaSpinner className="fa-spin" />

                  <div>

                    <strong>
                      Generating Claim PDF
                    </strong>

                    <p>
                      Creating the PDF from
                      the stored claim data.
                    </p>

                  </div>

                </div>
              )}

            {/* PDF PREVIEW */}

            {!selectedSubmission.loadingDetails &&
              !generatingPdf &&
              pdfUrl && (

                <div className="submissionPdfPreview">

                  <div className="submissionPdfHeader">

                    <div>

                      <FaFilePdf />

                      <div>

                        <strong>
                          Claim PDF
                        </strong>

                        <span>
                          {
                            pdfFileName
                          }
                        </span>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleOpenPDF
                      }
                    >
                      <FaEye />
                      Open
                    </button>

                  </div>

                  <div className="submissionPdfViewer">

                    <iframe
                      src={
                        pdfUrl
                      }
                      title="Forma AI Claim PDF"
                    />

                  </div>

                </div>
              )}

            {/* AI RECORD */}

            {!selectedSubmission.loadingDetails &&
              !generatingPdf &&
              !pdfUrl &&
              !selectedSubmission.pdfError && (

                <div className="modal-ai-box">

                  <FaRobot />

                  <div>

                    <strong>
                      Forma AI Claim Record
                    </strong>

                    <p>
                      This submission was
                      retrieved directly
                      from the Forma AI
                      backend.
                    </p>

                  </div>

                </div>
              )}

            {/* MODAL ACTIONS */}

            <div className="modal-actions">

              <button
                className="secondary-modal-button"
                onClick={
                  handleDownloadPDF
                }
                disabled={
                  generatingPdf
                }
              >
                <FaDownload />
                {generatingPdf
                  ? "Generating..."
                  : "Download PDF"}
              </button>

              <button
                className="primary-modal-button"
                onClick={
                  handleOpenPDF
                }
                disabled={
                  !pdfUrl ||
                  generatingPdf
                }
              >
                <FaFilePdf />
                Open PDF
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Submissions;
