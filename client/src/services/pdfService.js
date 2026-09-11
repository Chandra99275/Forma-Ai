
// ==========================================
// Forma AI - Claim PDF Generator
// ==========================================

import jsPDF from "jspdf";

// ==========================================
// Format Field Label
// ==========================================

const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
};

// ==========================================
// Format Field Value
// ==========================================

const formatValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "None";
    }

    return value
      .map((item) => {
        if (
          item !== null &&
          typeof item === "object"
        ) {
          return Object.entries(item)
            .map(
              ([key, val]) =>
                `${formatLabel(key)}: ${formatValue(val)}`
            )
            .join(", ");
        }

        return String(item);
      })
      .join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(
        ([key, val]) =>
          `${formatLabel(key)}: ${formatValue(val)}`
      )
      .join(", ");
  }

  return String(value);
};

// ==========================================
// Generate Claim PDF
// ==========================================

export const generateClaimPDF = ({
  claim = {},
  category = "",
  claimData = {},
}) => {
  const doc = new jsPDF();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  let y = 20;

  // ==========================================
  // Claim Information
  // ==========================================

  const claimNumber =
    claim.claimNumber ||
    "FORMA-AI-CLAIM";

  const insuranceCategory =
    category ||
    claim.category ||
    "insurance";

  const claimStatus =
    claim.status ||
    "submitted";

  const submittedAt =
    claim.submittedAt ||
    new Date().toISOString();

  // ==========================================
  // Helper - Check Page Space
  // ==========================================

  const checkPageSpace = (
    requiredHeight = 10
  ) => {
    if (
      y + requiredHeight >
      pageHeight - 20
    ) {
      doc.addPage();
      y = 20;
    }
  };

  // ==========================================
  // Helper - Add Text
  // ==========================================

  const addText = (
    text,
    x,
    options = {}
  ) => {
    const {
      fontSize = 10,
      fontStyle = "normal",
      maxWidth = 170,
      lineHeight = 5,
    } = options;

    doc.setFontSize(fontSize);
    doc.setFont(
      "helvetica",
      fontStyle
    );

    const lines =
      doc.splitTextToSize(
        String(text),
        maxWidth
      );

    checkPageSpace(
      lines.length * lineHeight + 5
    );

    doc.text(
      lines,
      x,
      y
    );

    y +=
      lines.length *
        lineHeight +
      2;
  };

  // ==========================================
  // Header
  // ==========================================

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(24);

  doc.text(
    "Forma AI",
    20,
    y
  );

  y += 9;

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(11);

  doc.text(
    "AI-Powered Insurance Claim Form",
    20,
    y
  );

  y += 10;

  doc.setDrawColor(
    180,
    180,
    180
  );

  doc.setLineWidth(0.5);

  doc.line(
    20,
    y,
    pageWidth - 20,
    y
  );

  y += 12;

  // ==========================================
  // Claim Information Heading
  // ==========================================

  addText(
    "Claim Information",
    20,
    {
      fontSize: 16,
      fontStyle: "bold",
      lineHeight: 7,
    }
  );

  // ==========================================
  // Claim Summary
  // ==========================================

  const summary = [
    [
      "Claim Number",
      claimNumber,
    ],
    [
      "Insurance Category",
      formatLabel(
        insuranceCategory
      ),
    ],
    [
      "Claim Status",
      formatLabel(
        claimStatus
      ),
    ],
    [
      "Submitted At",
      new Date(
        submittedAt
      ).toLocaleString(
        "en-IN"
      ),
    ],
  ];

  summary.forEach(
    ([label, value]) => {
      checkPageSpace(10);

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        `${label}:`,
        20,
        y
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      const lines =
        doc.splitTextToSize(
          String(value),
          125
        );

      doc.text(
        lines,
        65,
        y
      );

      y += Math.max(
        6,
        lines.length * 5
      );
    }
  );

  y += 8;

  // ==========================================
  // Applicant Information
  // ==========================================

  addText(
    "Applicant Information",
    20,
    {
      fontSize: 15,
      fontStyle: "bold",
      lineHeight: 7,
    }
  );

  const applicantFields = [
    [
      "Applicant Name",
      claimData.applicantName,
    ],
    [
      "Email",
      claimData.email,
    ],
    [
      "Mobile Number",
      claimData.phone,
    ],
    [
      "Policy Number",
      claimData.policyNumber,
    ],
    [
      "Description",
      claimData.description,
    ],
  ];

  applicantFields.forEach(
    ([label, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return;
      }

      checkPageSpace(12);

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        `${label}:`,
        20,
        y
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      const lines =
        doc.splitTextToSize(
          formatValue(value),
          125
        );

      doc.text(
        lines,
        65,
        y
      );

      y += Math.max(
        6,
        lines.length * 5
      );

      doc.setDrawColor(
        225,
        225,
        225
      );

      doc.line(
        20,
        y,
        pageWidth - 20,
        y
      );

      y += 4;
    }
  );

  // ==========================================
  // Category Form Details
  // ==========================================

  y += 5;

  addText(
    `${formatLabel(
      insuranceCategory
    )} Claim Details`,
    20,
    {
      fontSize: 15,
      fontStyle: "bold",
      lineHeight: 7,
    }
  );

  const ignoredFields = new Set([
    "applicantName",
    "email",
    "phone",
    "policyNumber",
    "description",
  ]);

  const formEntries =
    Object.entries(
      claimData || {}
    ).filter(
      ([key]) =>
        !ignoredFields.has(key)
    );

  formEntries.forEach(
    ([key, value]) => {
      const label =
        formatLabel(key);

      const formattedValue =
        formatValue(value);

      checkPageSpace(14);

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        `${label}:`,
        20,
        y
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      const valueLines =
        doc.splitTextToSize(
          formattedValue,
          125
        );

      doc.text(
        valueLines,
        65,
        y
      );

      y += Math.max(
        6,
        valueLines.length * 5
      );

      doc.setDrawColor(
        225,
        225,
        225
      );

      doc.line(
        20,
        y,
        pageWidth - 20,
        y
      );

      y += 4;
    }
  );

  // ==========================================
  // AI Analysis Information
  // ==========================================

  if (
    claim.aiSummary ||
    claim.aiConfidence !== null &&
    claim.aiConfidence !== undefined ||
    claim.riskLevel
  ) {
    y += 6;

    addText(
      "AI Analysis",
      20,
      {
        fontSize: 15,
        fontStyle: "bold",
        lineHeight: 7,
      }
    );

    if (
      claim.aiConfidence !==
        null &&
      claim.aiConfidence !==
        undefined
    ) {
      let confidence =
        Number(
          claim.aiConfidence
        );

      if (
        confidence <= 1
      ) {
        confidence *= 100;
      }

      checkPageSpace(10);

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "AI Confidence:",
        20,
        y
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `${Math.round(
          confidence
        )}%`,
        65,
        y
      );

      y += 7;
    }

    if (claim.riskLevel) {
      checkPageSpace(10);

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "Risk Level:",
        20,
        y
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        formatLabel(
          claim.riskLevel
        ),
        65,
        y
      );

      y += 7;
    }

    if (claim.aiSummary) {
      checkPageSpace(15);

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "AI Summary:",
        20,
        y
      );

      y += 6;

      doc.setFont(
        "helvetica",
        "normal"
      );

      const summaryLines =
        doc.splitTextToSize(
          claim.aiSummary,
          170
        );

      checkPageSpace(
        summaryLines.length * 5
      );

      doc.text(
        summaryLines,
        20,
        y
      );

      y +=
        summaryLines.length *
          5 +
        5;
    }
  }

  // ==========================================
  // Declaration
  // ==========================================

  checkPageSpace(35);

  y += 5;

  addText(
    "Declaration",
    20,
    {
      fontSize: 15,
      fontStyle: "bold",
      lineHeight: 7,
    }
  );

  const declaration =
    "I confirm that the information provided in this insurance claim form is accurate and complete to the best of my knowledge. I authorize the relevant insurance provider to process this claim and verify the submitted information and supporting documents.";

  addText(
    declaration,
    20,
    {
      fontSize: 10,
      fontStyle: "normal",
      maxWidth: 170,
      lineHeight: 5,
    }
  );

  // ==========================================
  // Signature Area
  // ==========================================

  checkPageSpace(40);

  y += 10;

  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.line(
    20,
    y,
    85,
    y
  );

  doc.line(
    125,
    y,
    pageWidth - 20,
    y
  );

  y += 6;

  doc.text(
    "Applicant Signature",
    20,
    y
  );

  doc.text(
    "Authorized Reviewer",
    125,
    y
  );

  // ==========================================
  // Footer On Every Page
  // ==========================================

  const pageCount =
    doc.internal.getNumberOfPages();

  for (
    let page = 1;
    page <= pageCount;
    page++
  ) {
    doc.setPage(page);

    const footerY =
      pageHeight - 10;

    doc.setFontSize(8);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setDrawColor(
      200,
      200,
      200
    );

    doc.line(
      20,
      footerY - 4,
      pageWidth - 20,
      footerY - 4
    );

    doc.text(
      `Forma AI • Insurance Claim • Page ${page} of ${pageCount}`,
      20,
      footerY
    );
  }

  // ==========================================
  // Create PDF Blob
  // ==========================================

  const blob =
    doc.output("blob");

  const url =
    URL.createObjectURL(blob);

  const fileName =
    `${claimNumber}.pdf`;

  return {
    blob,
    url,
    fileName,
    doc,
  };
};

export default generateClaimPDF;


