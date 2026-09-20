// ==========================================
// Forma AI - Submissions Page
// Complete CRUD + Dynamic Form Editor + PDF
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
  FaEdit,
  FaTrash,
  FaSave,
  FaExclamationTriangle,
  FaPlus,
  FaCloudUploadAlt,
  FaImage,
} from "react-icons/fa";

// ==========================================
// Backend API
// ==========================================

import {
  getClaims,
  getClaimById,
  updateClaim,
  deleteClaim,
  uploadClaimDocuments,
} from "../services/claimService";

// ==========================================
// PDF Generator
// ==========================================

import { generateClaimPDF } from "../services/pdfService";

// ==========================================
// Allowed Categories
// ==========================================

const ALLOWED_CATEGORIES = [
  "health",
  "vehicle",
  "property",
  "travel",
  "life",
];

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
// Format Type
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
  const data = claim?.claimData || {};

  return (
    data.applicantName ||
    data.patientName ||
    data.ownerName ||
    data.travelerName ||
    data.policyHolderName ||
    data.policyHolder ||
    data.driverName ||
    data.nomineeName ||
    data.customerName ||
    data.insuredName ||
    "Unknown Customer"
  );
};

// ==========================================
// AI Confidence
// ==========================================

const getConfidence = (claim) => {
  if (
    typeof claim?.aiConfidence === "number" &&
    !Number.isNaN(claim.aiConfidence)
  ) {
    if (claim.aiConfidence <= 1) {
      return Math.round(
        claim.aiConfidence * 100
      );
    }

    return Math.round(claim.aiConfidence);
  }

  return null;
};

// ==========================================
// Normalize Claim
// ==========================================

const normalizeClaim = (claim) => {
  if (!claim) {
    return null;
  }

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
// Label Formatter
// ==========================================

const formatFieldLabel = (key) => {
  if (!key) {
    return "";
  }

  return String(key)
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

// ==========================================
// Date Field Detection
// ==========================================

const isDateField = (key) => {
  const value = String(key).toLowerCase();

  return (
    value.includes("date") ||
    value.includes("dob") ||
    value.includes("birth")
  );
};

// ==========================================
// Long Text Detection
// ==========================================

const isLongTextField = (key, value) => {
  const lowerKey =
    String(key).toLowerCase();

  if (
    lowerKey.includes("description") ||
    lowerKey.includes("address") ||
    lowerKey.includes("damage") ||
    lowerKey.includes("reason") ||
    lowerKey.includes("details") ||
    lowerKey.includes("remarks") ||
    lowerKey.includes("comment") ||
    lowerKey.includes("incident")
  ) {
    return true;
  }

  return (
    typeof value === "string" &&
    value.length > 120
  );
};

// ==========================================
// Convert Value For Input
// ==========================================

const normalizeInputValue = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (
    typeof value === "object"
  ) {
    return JSON.stringify(
      value
    );
  }

  return String(value);
};

// ==========================================
// Dynamic Form Component
// ==========================================

const DynamicClaimForm = ({
  data,
  onChange,
  disabled,
}) => {
  const entries = Object.entries(
    data || {}
  );

  if (entries.length === 0) {
    return (
      <div
        style={{
          padding: "30px",
          textAlign: "center",
          border: "1px dashed #cbd5e1",
          borderRadius: "14px",
          color: "#64748b",
          background: "#f8fafc",
        }}
      >
        <FaFileAlt
          style={{
            fontSize: "30px",
            marginBottom: "10px",
          }}
        />

        <h3
          style={{
            margin: "0 0 6px",
            color: "#334155",
          }}
        >
          No claim fields found
        </h3>

        <p
          style={{
            margin: 0,
          }}
        >
          This claim does not contain
          editable form fields.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "18px",
      }}
    >
      {entries.map(
        ([key, value]) => (
          <DynamicField
            key={key}
            fieldKey={key}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        )
      )}
    </div>
  );
};

// ==========================================
// Dynamic Field
// ==========================================

const DynamicField = ({
  fieldKey,
  value,
  onChange,
  disabled,
}) => {
  const label =
    formatFieldLabel(fieldKey);

  // ----------------------------------------
  // Object
  // ----------------------------------------

  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return (
      <div
        style={{
          gridColumn: "1 / -1",
          padding: "18px",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "15px",
            fontSize: "15px",
          }}
        >
          {label}
        </div>

        <DynamicClaimForm
          data={value}
          onChange={(childKey, childValue) => {
            onChange(
              fieldKey,
              {
                ...value,
                [childKey]: childValue,
              }
            );
          }}
          disabled={disabled}
        />
      </div>
    );
  }

  // ----------------------------------------
  // Array
  // ----------------------------------------

  if (Array.isArray(value)) {
    return (
      <div
        style={{
          gridColumn: "1 / -1",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 700,
            color: "#334155",
          }}
        >
          {label}
        </label>

        <textarea
          value={JSON.stringify(
            value,
            null,
            2
          )}
          disabled={disabled}
          onChange={(event) => {
            try {
              const parsed =
                JSON.parse(
                  event.target.value
                );

              if (
                Array.isArray(parsed)
              ) {
                onChange(
                  fieldKey,
                  parsed
                );
              }
            } catch {
              // Keep current array when
              // JSON is temporarily invalid.
            }
          }}
          style={{
            width: "100%",
            minHeight: "110px",
            padding: "12px",
            borderRadius: "10px",
            border:
              "1px solid #cbd5e1",
            fontFamily:
              "Consolas, monospace",
            background: "#ffffff",
            color: "#0f172a",
          }}
        />
      </div>
    );
  }

  // ----------------------------------------
  // Boolean
  // ----------------------------------------

  if (
    typeof value === "boolean"
  ) {
    return (
      <div
        style={{
          padding: "15px",
          border:
            "1px solid #e2e8f0",
          borderRadius: "12px",
          background: "#ffffff",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: disabled
              ? "default"
              : "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={value}
            disabled={disabled}
            onChange={(event) =>
              onChange(
                fieldKey,
                event.target.checked
              )
            }
            style={{
              width: "18px",
              height: "18px",
            }}
          />

          <span
            style={{
              fontWeight: 700,
              color: "#334155",
            }}
          >
            {label}
          </span>
        </label>
      </div>
    );
  }

  // ----------------------------------------
  // Number
  // ----------------------------------------

  if (
    typeof value === "number"
  ) {
    return (
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 700,
            color: "#334155",
          }}
        >
          {label}
        </label>

        <input
          type="number"
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange(
              fieldKey,
              event.target.value === ""
                ? ""
                : Number(
                    event.target.value
                  )
            )
          }
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding:
              "12px 14px",
            borderRadius: "10px",
            border:
              "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#0f172a",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>
    );
  }

  // ----------------------------------------
  // String
  // ----------------------------------------

  const inputValue =
    normalizeInputValue(value);

  const longText =
    isLongTextField(
      fieldKey,
      value
    );

  const dateField =
    isDateField(fieldKey);

  if (longText) {
    return (
      <div
        style={{
          gridColumn:
            "span 2",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 700,
            color: "#334155",
          }}
        >
          {label}
        </label>

        <textarea
          value={inputValue}
          disabled={disabled}
          onChange={(event) =>
            onChange(
              fieldKey,
              event.target.value
            )
          }
          rows={4}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px",
            borderRadius: "10px",
            border:
              "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#0f172a",
            fontSize: "14px",
            resize: "vertical",
            outline: "none",
            fontFamily:
              "inherit",
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: 700,
          color: "#334155",
        }}
      >
        {label}
      </label>

      <input
        type={
          dateField
            ? "date"
            : "text"
        }
        value={inputValue}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            fieldKey,
            event.target.value
          )
        }
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding:
            "12px 14px",
          borderRadius: "10px",
          border:
            "1px solid #cbd5e1",
          background: "#ffffff",
          color: "#0f172a",
          fontSize: "14px",
          outline: "none",
        }}
      />
    </div>
  );
};

// ==========================================
// Main Component
// ==========================================

const Submissions = () => {
  // ========================================
  // Main State
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
  // Edit State
  // ========================================

  const [
    editingSubmission,
    setEditingSubmission,
  ] = useState(null);

  const [
    editCategory,
    setEditCategory,
  ] = useState("");

  const [
    editClaimData,
    setEditClaimData,
  ] = useState({});

  const [
    editError,
    setEditError,
  ] = useState("");

  const [
    savingEdit,
    setSavingEdit,
  ] = useState(false);

  // ========================================
  // Edit Document Upload State
  // ========================================

  const [editDocuments, setEditDocuments] = useState([]);
  const [uploadingEditDocuments, setUploadingEditDocuments] = useState(false);
  const [editDocumentError, setEditDocumentError] = useState("");

  // ========================================
  // Delete State
  // ========================================

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  // ========================================
  // Success
  // ========================================

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  // ========================================
  // Load Submissions
  // ========================================

  const loadSubmissions =
    async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getClaims();

        console.log(
          "📦 Claims:",
          result
        );

        const claims =
          Array.isArray(result)
            ? result
            : result?.claims ||
              result?.data ||
              [];

        const normalized =
          claims
            .map(normalizeClaim)
            .filter(Boolean);

        setSubmissions(
          normalized
        );
      } catch (err) {
        console.error(
          "❌ Failed to load claims:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            err?.message ||
            "Unable to load submissions."
        );
      } finally {
        setLoading(false);
      }
    };

  // ========================================
  // Initial Load
  // ========================================

  useEffect(() => {
    loadSubmissions();
  }, []);

  // ========================================
  // Filters
  // ========================================

  const filteredSubmissions =
    useMemo(() => {
      return submissions.filter(
        (submission) => {
          const searchValue =
            search
              .toLowerCase()
              .trim();

          const matchesSearch =
            !searchValue ||
            submission.form
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            submission.customer
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            submission.id
              .toLowerCase()
              .includes(
                searchValue
              );

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
  // Success Message
  // ========================================

  const showSuccess =
    (message) => {
      setSuccessMessage(
        message
      );

      window.setTimeout(
        () => {
          setSuccessMessage(
            ""
          );
        },
        3500
      );
    };

  // ========================================
  // PDF Generation
  // ========================================

  const createPDFForSubmission =
    async (
      submission
    ) => {
      try {
        setGeneratingPdf(
          true
        );

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

        if (pdfUrl) {
          URL.revokeObjectURL(
            pdfUrl
          );
        }

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

        setSelectedSubmission(
          (previous) => ({
            ...(previous ||
              normalizeClaim(
                claim
              )),

            rawClaim:
              claim,

            pdfReady: true,

            loadingDetails:
              false,

            pdfError: "",
          })
        );

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
              err?.message ||
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
    async (
      submission
    ) => {
      try {
        setSelectedSubmission({
          ...submission,
          loadingDetails: true,
          pdfError: "",
        });

        if (pdfUrl) {
          URL.revokeObjectURL(
            pdfUrl
          );
          setPdfUrl("");
        }

        setPdfFileName("");

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

          pdfReady:
            false,

          pdfError: "",
        });

        try {
          await createPDFForSubmission(
            {
              ...normalized,
              rawClaim: claim,
            }
          );
        } catch (
          pdfError
        ) {
          console.warn(
            "PDF generation failed:",
            pdfError
          );
        }
      } catch (err) {
        console.error(
          "❌ Failed to fetch claim:",
          err
        );

        setSelectedSubmission(
          (previous) => ({
            ...(previous || {}),
            ...submission,

            loadingDetails:
              false,

            pdfError:
              err?.response?.data
                ?.message ||
              err?.message ||
              "Unable to load claim details.",
          })
        );
      }
    };

  // ========================================
  // Open Edit
  // ========================================

  const handleOpenEdit =
    async (
      submission
    ) => {
      try {
        setEditError("");

        let claim =
          submission.rawClaim;

        if (
          !claim ||
          !claim._id
        ) {
          const result =
            await getClaimById(
              submission.databaseId
            );

          claim =
            result?.claim ||
            result?.data ||
            result;
        }

        if (!claim) {
          throw new Error(
            "Claim could not be found."
          );
        }

        if (
          claim.status ===
            "approved" ||
          claim.status ===
            "rejected"
        ) {
          setEditError(
            "Approved or rejected claims cannot be edited."
          );

          return;
        }

        setEditingSubmission(
          claim
        );

        setEditCategory(
          claim.category ||
            "vehicle"
        );

        // IMPORTANT:
        // Store actual object instead
        // of JSON string.
        setEditDocuments([]);
        setEditDocumentError("");

        setEditClaimData(
          claim.claimData &&
            typeof claim.claimData ===
              "object"
            ? {
                ...claim.claimData,
              }
            : {}
        );

        // Close view modal
        setSelectedSubmission(
          null
        );

        if (pdfUrl) {
          URL.revokeObjectURL(
            pdfUrl
          );

          setPdfUrl("");
          setPdfFileName("");
        }
      } catch (err) {
        console.error(
          "❌ Unable to open edit:",
          err
        );

        setEditError(
          err?.response?.data
            ?.message ||
            err?.message ||
            "Unable to open claim for editing."
        );
      }
    };

  // ========================================
  // Edit Field
  // ========================================

  const handleEditField =
    (
      key,
      value
    ) => {
      setEditClaimData(
        (previous) => ({
          ...previous,
          [key]: value,
        })
      );
    };

  // ========================================
  // Add New Field
  // ========================================

  const handleAddField =
    () => {
      let fieldName =
        window.prompt(
          "Enter the new field name:"
        );

      if (!fieldName) {
        return;
      }

      fieldName =
        fieldName.trim();

      if (!fieldName) {
        return;
      }

      if (
        Object.prototype.hasOwnProperty.call(
          editClaimData,
          fieldName
        )
      ) {
        window.alert(
          "This field already exists."
        );

        return;
      }

      setEditClaimData(
        (previous) => ({
          ...previous,
          [fieldName]: "",
        })
      );
    };

  // ========================================
  // Remove Field
  // ========================================

  const handleRemoveField =
    (fieldKey) => {
      const confirmed =
        window.confirm(
          `Remove "${formatFieldLabel(
            fieldKey
          )}" from this claim?`
        );

      if (!confirmed) {
        return;
      }

      setEditClaimData(
        (previous) => {
          const copy = {
            ...previous,
          };

          delete copy[
            fieldKey
          ];

          return copy;
        }
      );
    };

  // ========================================
  // Edit Document Selection
  // ========================================

  const handleEditDocumentChange = (event) => {
    const selected = Array.from(event.target.files || []);
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    const isAllowedFile = (file) => {
      const name = String(file?.name || "").toLowerCase();
      return (
        file?.type === "application/pdf" ||
        file?.type?.startsWith("image/") ||
        /\.(pdf|jpg|jpeg|png|webp)$/.test(name)
      );
    };

    const invalid = selected.filter((file) => !isAllowedFile(file));
    const oversized = selected.filter((file) => file.size > MAX_FILE_SIZE);

    if (invalid.length > 0) {
      setEditDocumentError("Only JPG, JPEG, PNG, WEBP images and PDF files are allowed.");
    } else if (oversized.length > 0) {
      setEditDocumentError("Each file must be 10 MB or smaller.");
    } else {
      setEditDocumentError("");
    }

    const validFiles = selected.filter(
      (file) => isAllowedFile(file) && file.size <= MAX_FILE_SIZE
    );

    setEditDocuments((previous) => {
      const combined = [...previous, ...validFiles];
      const unique = [];
      const seen = new Set();

      combined.forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(file);
        }
      });

      return unique;
    });

    event.target.value = "";
  };

  const removeEditDocument = (index) => {
    setEditDocuments((previous) => previous.filter((_, i) => i !== index));
  };

  // ========================================
  // Close Edit
  // ========================================

  const handleCloseEdit =
    () => {
      if (savingEdit) {
        return;
      }

      setEditingSubmission(
        null
      );

      setEditCategory("");

      setEditClaimData({});
      setEditDocuments([]);
      setEditDocumentError("");

      setEditError("");
    };

  // ========================================
  // Save Edit
  // ========================================

  const handleSaveEdit =
    async () => {
      try {
        setEditError("");
        setEditDocumentError("");

        if (!editingSubmission?._id) {
          throw new Error("Claim ID is missing.");
        }

        if (!ALLOWED_CATEGORIES.includes(editCategory)) {
          throw new Error("Please select a valid insurance category.");
        }

        if (!editClaimData || typeof editClaimData !== "object" || Array.isArray(editClaimData)) {
          throw new Error("Claim data must be a valid object.");
        }

        setSavingEdit(true);

        // IMPORTANT: send the complete edited object and tell the backend
        // to replace the old claimData. This makes removed/changed fields persist.
        const result = await updateClaim(
          editingSubmission._id,
          {
            category: editCategory,
            claimData: editClaimData,
            replaceClaimData: true,
          }
        );

        console.log("✅ Claim fields updated:", result);

        // Upload newly selected photos/PDFs only after the claim data is saved.
        if (editDocuments.length > 0) {
          setUploadingEditDocuments(true);

          try {
            const uploadResult = await uploadClaimDocuments(
              editingSubmission._id,
              editDocuments
            );

            console.log("✅ Supporting documents uploaded:", uploadResult);
          } catch (uploadError) {
            console.error("❌ Document upload failed:", uploadError);
            throw new Error(
              uploadError?.response?.data?.message ||
              uploadError?.response?.data?.error ||
              uploadError?.message ||
              "Claim changes were saved, but the supporting documents could not be uploaded."
            );
          } finally {
            setUploadingEditDocuments(false);
          }
        }

        // Fetch the final claim from MongoDB so the UI displays exactly what was saved.
        const latestResult = await getClaimById(editingSubmission._id);
        const latestClaim =
          latestResult?.claim ||
          latestResult?.data ||
          latestResult;

        if (latestClaim?._id) {
          const normalized = normalizeClaim(latestClaim);

          setSubmissions((previous) =>
            previous.map((item) =>
              item.databaseId === latestClaim._id
                ? normalized
                : item
            )
          );
        }

        setEditingSubmission(null);
        setEditCategory("");
        setEditClaimData({});
        setEditDocuments([]);
        setEditDocumentError("");

        showSuccess(
          editDocuments.length > 0
            ? "Claim changes and supporting documents saved successfully."
            : "Claim changes saved successfully."
        );

        await loadSubmissions();
      } catch (err) {
        console.error("❌ Failed to save claim changes:", err);

        setEditError(
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to save claim changes."
        );
      } finally {
        setUploadingEditDocuments(false);
        setSavingEdit(false);
      }
    };

  // ========================================
  // Delete Claim
  // ========================================

  const handleDeleteClaim =
    async (
      submission
    ) => {
      try {
        if (
          !submission?.databaseId
        ) {
          throw new Error(
            "Claim ID is missing."
          );
        }

        const confirmed =
          window.confirm(
            `Are you sure you want to delete claim "${submission.id}"?\n\nThis will permanently remove the claim from the database.`
          );

        if (!confirmed) {
          return;
        }

        setDeletingId(
          submission.databaseId
        );

        console.log(
          "🗑️ Deleting:",
          submission.databaseId
        );

        await deleteClaim(
          submission.databaseId
        );

        setSubmissions(
          (previous) =>
            previous.filter(
              (item) =>
                item.databaseId !==
                submission.databaseId
            )
        );

        if (
          selectedSubmission?.databaseId ===
          submission.databaseId
        ) {
          handleCloseModal();
        }

        showSuccess(
          "Claim deleted successfully."
        );
      } catch (err) {
        console.error(
          "❌ Delete failed:",
          err
        );

        window.alert(
          err?.response?.data
            ?.message ||
            err?.response?.data
              ?.error ||
            err?.message ||
            "Unable to delete claim."
        );
      } finally {
        setDeletingId(
          null
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
          `${
            selectedSubmission?.id ||
            "forma-ai-claim"
          }.pdf`;

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

        window.alert(
          err?.message ||
            "Unable to download PDF."
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
  // Close View Modal
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
      }

      setPdfUrl("");

      setPdfFileName("");

      setGeneratingPdf(
        false
      );
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
              className={({ isActive }) =>
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
              className={({ isActive }) =>
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
              className={({ isActive }) =>
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
              className={({ isActive }) =>
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
              className={({ isActive }) =>
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

          <div className="online-dot" />

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

            <button
              type="button"
              className="notification-button"
            >
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

        {/* SUCCESS */}

        {successMessage && (
          <div
            style={{
              marginBottom: "20px",
              padding:
                "14px 18px",
              borderRadius: "12px",
              background:
                "#ecfdf3",
              border:
                "1px solid #a7f3d0",
              color:
                "#047857",
              display: "flex",
              alignItems:
                "center",
              gap: "10px",
              fontWeight: 600,
            }}
          >
            <FaCheckCircle />
            {successMessage}
          </div>
        )}

        {/* ====================================
            STATS
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
            SUBMISSIONS
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

            <button
              type="button"
              className="export-button"
              onClick={
                loadSubmissions
              }
              disabled={loading}
            >
              <FaArrowRight />

              {loading
                ? "Refreshing..."
                : "Refresh"}
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
                type="button"
                className="view-button"
                onClick={
                  loadSubmissions
                }
              >
                Try Again
              </button>

            </div>
          )}

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
                      (
                        submission
                      ) => {

                        const canEdit =
                          submission.rawClaim
                            ?.status !==
                            "approved" &&
                          submission.rawClaim
                            ?.status !==
                            "rejected";

                        return (
                          <tr
                            key={
                              submission.databaseId
                            }
                          >

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

                            <td>

                              <span className="customer-name">
                                {
                                  submission.customer
                                }
                              </span>

                            </td>

                            <td>

                              <span className="type-badge">
                                {
                                  submission.type
                                }
                              </span>

                            </td>

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

                            {/* ACTIONS */}

                            <td>

                              <div
                                style={{
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  gap:
                                    "7px",
                                  flexWrap:
                                    "wrap",
                                }}
                              >

                                {/* VIEW */}

                                <button
                                  type="button"
                                  className="view-button"
                                  onClick={() =>
                                    handleViewSubmission(
                                      submission
                                    )
                                  }
                                  title="View claim"
                                >
                                  <FaEye />
                                  View
                                </button>

                                {/* EDIT */}

                                {canEdit && (
                                  <button
                                    type="button"
                                    className="view-button"
                                    onClick={() =>
                                      handleOpenEdit(
                                        submission
                                      )
                                    }
                                    title="Edit claim"
                                  >
                                    <FaEdit />
                                    Edit
                                  </button>
                                )}

                                {/* DELETE - ALL CLAIMS */}

                                <button
                                  type="button"
                                  className="view-button"
                                  onClick={() =>
                                    handleDeleteClaim(
                                      submission
                                    )
                                  }
                                  disabled={
                                    deletingId ===
                                    submission.databaseId
                                  }
                                  title="Delete claim"
                                >

                                  {deletingId ===
                                  submission.databaseId ? (
                                    <FaSpinner className="fa-spin" />
                                  ) : (
                                    <FaTrash />
                                  )}

                                  {deletingId ===
                                  submission.databaseId
                                    ? "Deleting..."
                                    : "Delete"}

                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
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

          {/* PAGINATION */}

          {!loading &&
            !error &&
            submissions.length >
              0 && (

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

                  <button
                    type="button"
                    disabled
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    className="page-active"
                  >
                    1
                  </button>

                  <button
                    type="button"
                    disabled
                  >
                    Next
                  </button>

                </div>

              </div>
            )}

        </section>

      </main>

      {/* ======================================
          VIEW MODAL
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

            <button
              type="button"
              className="modal-close"
              onClick={
                handleCloseModal
              }
            >
              <FaTimes />
            </button>

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
                      src={pdfUrl}
                      title="Forma AI Claim PDF"
                    />

                  </div>

                </div>
              )}

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

            <div
              className="modal-actions"
              style={{
                display:
                  "flex",
                flexWrap:
                  "wrap",
                gap:
                  "10px",
              }}
            >

              {/* EDIT */}

              {selectedSubmission.rawClaim
                ?.status !==
                "approved" &&
                selectedSubmission.rawClaim
                  ?.status !==
                  "rejected" && (

                  <button
                    type="button"
                    className="secondary-modal-button"
                    onClick={() =>
                      handleOpenEdit(
                        selectedSubmission
                      )
                    }
                  >
                    <FaEdit />
                    Edit Claim
                  </button>
                )}

              {/* DELETE ALL */}

              <button
                type="button"
                className="secondary-modal-button"
                onClick={() =>
                  handleDeleteClaim(
                    selectedSubmission
                  )
                }
                disabled={
                  deletingId ===
                  selectedSubmission.databaseId
                }
              >

                {deletingId ===
                selectedSubmission.databaseId ? (
                  <FaSpinner className="fa-spin" />
                ) : (
                  <FaTrash />
                )}

                {deletingId ===
                selectedSubmission.databaseId
                  ? "Deleting..."
                  : "Delete Claim"}

              </button>

              {/* DOWNLOAD */}

              <button
                type="button"
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

              {/* OPEN PDF */}

              <button
                type="button"
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

      {/* ======================================
          DYNAMIC FORM EDIT MODAL
      ====================================== */}

      {editingSubmission && (

        <div
          className="modal-overlay"
          onClick={
            handleCloseEdit
          }
        >

          <div
            className="submission-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              maxWidth:
                "1050px",
              width:
                "calc(100% - 30px)",
              maxHeight:
                "90vh",
              overflowY:
                "auto",
            }}
          >

            {/* CLOSE */}

            <button
              type="button"
              className="modal-close"
              onClick={
                handleCloseEdit
              }
              disabled={
                savingEdit
              }
            >
              <FaTimes />
            </button>

            {/* HEADER */}

            <div className="modal-top">

              <div className="modal-icon">
                <FaEdit />
              </div>

              <div>

                <span>
                  Edit Insurance Claim
                </span>

                <h2>
                  {
                    editingSubmission.claimNumber ||
                    editingSubmission._id
                  }
                </h2>

              </div>

            </div>

            {/* INFORMATION */}

            <div
              className="modal-ai-box"
              style={{
                marginBottom:
                  "20px",
              }}
            >

              <FaEdit />

              <div>

                <strong>
                  Dynamic Claim Form
                </strong>

                <p>
                  Edit the claim using
                  the same structured
                  form-style interface.
                  Changes will be saved
                  directly to MongoDB.
                </p>

              </div>

            </div>

            {/* ERROR */}

            {editError && (

              <div
                className="modal-ai-box"
                style={{
                  marginBottom:
                    "20px",
                }}
              >

                <FaTimesCircle />

                <div>

                  <strong>
                    Update Failed
                  </strong>

                  <p>
                    {editError}
                  </p>

                </div>

              </div>
            )}

            {/* CATEGORY */}

            <div
              style={{
                marginBottom:
                  "24px",
              }}
            >

              <label
                htmlFor="edit-category"
                style={{
                  display:
                    "block",
                  marginBottom:
                    "8px",
                  fontWeight:
                    "700",
                  color:
                    "#334155",
                }}
              >
                Insurance Category
              </label>

              <select
                id="edit-category"
                value={
                  editCategory
                }
                onChange={(e) =>
                  setEditCategory(
                    e.target.value
                  )
                }
                disabled={
                  savingEdit
                }
                style={{
                  width:
                    "100%",
                  padding:
                    "13px 15px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #cbd5e1",
                  background:
                    "#ffffff",
                  color:
                    "#0f172a",
                  fontSize:
                    "15px",
                }}
              >

                <option value="">
                  Select category
                </option>

                <option value="health">
                  Health Insurance
                </option>

                <option value="vehicle">
                  Vehicle Insurance
                </option>

                <option value="property">
                  Property Insurance
                </option>

                <option value="travel">
                  Travel Insurance
                </option>

                <option value="life">
                  Life Insurance
                </option>

              </select>

            </div>

            {/* SUPPORTING DOCUMENTS */}

            <div
              style={{
                marginBottom: "25px",
                padding: "20px",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                background: "#ffffff",
              }}
            >
              <div style={{ marginBottom: "14px" }}>
                <h3 style={{ margin: "0 0 5px", color: "#0f172a" }}>
                  Supporting Documents
                </h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                  Add accident photos, scanned documents, or PDF files to this claim.
                </p>
              </div>

              <label
                htmlFor="edit-claim-documents"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  minHeight: "100px",
                  padding: "20px",
                  border: "2px dashed #bfdbfe",
                  borderRadius: "12px",
                  background: "#eff6ff",
                  color: "#2563eb",
                  cursor: savingEdit || uploadingEditDocuments ? "not-allowed" : "pointer",
                  textAlign: "center",
                }}
              >
                <FaCloudUploadAlt style={{ fontSize: "28px" }} />
                <span>
                  <strong>Click to add photos or PDFs</strong><br />
                  JPG, JPEG, PNG, WEBP or PDF • Max 10 MB each
                </span>
                <input
                  id="edit-claim-documents"
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf,.pdf"
                  hidden
                  disabled={savingEdit || uploadingEditDocuments}
                  onChange={handleEditDocumentChange}
                />
              </label>

              {editDocumentError && (
                <div style={{ marginTop: "12px", color: "#dc2626", fontSize: "13px", fontWeight: 600 }}>
                  <FaExclamationTriangle style={{ marginRight: "6px" }} />
                  {editDocumentError}
                </div>
              )}

              {editDocuments.length > 0 && (
                <div style={{ display: "grid", gap: "10px", marginTop: "15px" }}>
                  {editDocuments.map((file, index) => (
                    <div key={`${file.name}-${index}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "11px 13px", border: "1px solid #e2e8f0", borderRadius: "10px", background: "#f8fafc" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        {file.type === "application/pdf" ? <FaFilePdf style={{ color: "#dc2626", flexShrink: 0 }} /> : <FaImage style={{ color: "#2563eb", flexShrink: 0 }} />}
                        <div style={{ minWidth: 0 }}>
                          <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</strong>
                          <span style={{ color: "#64748b", fontSize: "12px" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeEditDocument(index)} disabled={savingEdit || uploadingEditDocuments} style={{ border: "none", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", padding: "8px 10px", cursor: "pointer" }}>
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadingEditDocuments && (
                <div style={{ marginTop: "12px", color: "#2563eb", fontWeight: 600 }}>
                  <FaSpinner className="fa-spin" style={{ marginRight: "7px" }} />
                  Uploading documents...
                </div>
              )}
            </div>

            {/* FORM HEADER */}

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                gap:
                  "15px",
                marginBottom:
                  "15px",
              }}
            >

              <div>

                <h3
                  style={{
                    margin:
                      "0 0 5px",
                    color:
                      "#0f172a",
                  }}
                >
                  Claim Information
                </h3>

                <p
                  style={{
                    margin: 0,
                    color:
                      "#64748b",
                    fontSize:
                      "14px",
                  }}
                >
                  Update the values
                  below without
                  editing raw JSON.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  handleAddField
                }
                disabled={
                  savingEdit
                }
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap:
                    "7px",
                  padding:
                    "10px 14px",
                  borderRadius:
                    "9px",
                  border:
                    "1px solid #cbd5e1",
                  background:
                    "#ffffff",
                  cursor:
                    "pointer",
                  fontWeight:
                    "700",
                  color:
                    "#334155",
                }}
              >
                <FaPlus />
                Add Field
              </button>

            </div>

            {/* DYNAMIC FORM */}

            <div
              style={{
                padding:
                  "20px",
                border:
                  "1px solid #e2e8f0",
                borderRadius:
                  "16px",
                background:
                  "#f8fafc",
                marginBottom:
                  "25px",
              }}
            >

              <DynamicClaimForm
                data={
                  editClaimData
                }
                onChange={
                  handleEditField
                }
                disabled={
                  savingEdit
                }
              />

            </div>

            {/* FIELD REMOVE INFORMATION */}

            {Object.keys(
              editClaimData || {}
            ).length > 0 && (

              <div
                style={{
                  marginBottom:
                    "20px",
                  padding:
                    "12px 15px",
                  borderRadius:
                    "10px",
                  background:
                    "#f1f5f9",
                  color:
                    "#64748b",
                  fontSize:
                    "13px",
                }}
              >
                <FaExclamationTriangle
                  style={{
                    marginRight:
                      "7px",
                  }}
                />

                To remove a field,
                use the field manager
                below.
              </div>
            )}

            {/* FIELD MANAGER */}

            <div
              style={{
                marginBottom:
                  "25px",
              }}
            >

              <h4
                style={{
                  margin:
                    "0 0 12px",
                  color:
                    "#334155",
                }}
              >
                Field Manager
              </h4>

              <div
                style={{
                  display:
                    "flex",
                  flexWrap:
                    "wrap",
                  gap:
                    "8px",
                }}
              >

                {Object.keys(
                  editClaimData || {}
                ).map(
                  (fieldKey) => (

                    <button
                      key={
                        fieldKey
                      }
                      type="button"
                      disabled={
                        savingEdit
                      }
                      onClick={() =>
                        handleRemoveField(
                          fieldKey
                        )
                      }
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap:
                          "6px",
                        padding:
                          "7px 10px",
                        borderRadius:
                          "8px",
                        border:
                          "1px solid #fecaca",
                        background:
                          "#fff1f2",
                        color:
                          "#be123c",
                        cursor:
                          "pointer",
                        fontSize:
                          "12px",
                      }}
                      title={`Remove ${formatFieldLabel(
                        fieldKey
                      )}`}
                    >

                      <FaTimes />

                      {
                        formatFieldLabel(
                          fieldKey
                        )
                      }

                    </button>

                  )
                )}

              </div>

            </div>

            {/* ACTIONS */}

            <div
              className="modal-actions"
              style={{
                display:
                  "flex",
                gap:
                  "10px",
                justifyContent:
                  "flex-end",
                flexWrap:
                  "wrap",
              }}
            >

              <button
                type="button"
                className="secondary-modal-button"
                onClick={
                  handleCloseEdit
                }
                disabled={
                  savingEdit
                }
              >
                <FaTimes />
                Cancel
              </button>

              <button
                type="button"
                className="primary-modal-button"
                onClick={
                  handleSaveEdit
                }
                disabled={
                  savingEdit
                }
              >

                {savingEdit ? (
                  <>
                    <FaSpinner className="fa-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Submissions;