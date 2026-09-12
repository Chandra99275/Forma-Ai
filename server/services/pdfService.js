// ==============================================
// Forma AI - PDF Generation Service
// ==============================================

import PDFDocument from "pdfkit";
import fs from "fs-extra";
import path from "path";

// ==============================================
// Generate Insurance Claim PDF
// ==============================================

export const generateClaimPDF = async ({
  claimNumber,
  category,
  claimData,
}) => {
  const pdfDirectory = path.join("uploads", "pdfs");

  await fs.ensureDir(pdfDirectory);

  const fileName = `${claimNumber}.pdf`;

  const filePath = path.join(pdfDirectory, fileName);

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  // ===========================================
  // HEADER
  // ===========================================

  doc
    .fillColor("#2563EB")
    .fontSize(26)
    .text("FORMA AI", {
      align: "center",
    });

  doc
    .moveDown(0.5)
    .fillColor("#111827")
    .fontSize(18)
    .text("Insurance Claim Report", {
      align: "center",
    });

  doc.moveDown();

  doc
    .fillColor("#374151")
    .fontSize(12)
    .text(`Claim Number : ${claimNumber}`);

  doc.text(`Insurance Category : ${category.toUpperCase()}`);

  doc.text(
    `Generated On : ${new Date().toLocaleString()}`
  );

  doc.moveDown();

  // ===========================================
  // APPLICANT DETAILS
  // ===========================================

  doc
    .fillColor("#2563EB")
    .fontSize(16)
    .text("Applicant Information");

  doc.moveDown(0.5);

  const applicantFields = [
    ["Applicant Name", claimData.applicantName],
    ["Email", claimData.email],
    ["Phone", claimData.phone],
    ["Policy Number", claimData.policyNumber],
  ];

  applicantFields.forEach(([label, value]) => {
    doc
      .fillColor("#111827")
      .fontSize(12)
      .text(`${label}: ${value || "Not Provided"}`);
  });

  doc.moveDown();

  // ===========================================
  // INCIDENT DETAILS
  // ===========================================

  doc
    .fillColor("#2563EB")
    .fontSize(16)
    .text("Incident Details");

  doc.moveDown(0.5);

  Object.entries(claimData).forEach(([key, value]) => {
    if (
      [
        "applicantName",
        "email",
        "phone",
        "policyNumber",
      ].includes(key)
    ) {
      return;
    }

    doc
      .fillColor("#111827")
      .fontSize(12)
      .text(`${key}: ${value}`);
  });

  doc.moveDown();

  // ===========================================
  // AI SUMMARY
  // ===========================================

  doc
    .fillColor("#2563EB")
    .fontSize(16)
    .text("AI Summary");

  doc.moveDown(0.5);

  doc
    .fillColor("#111827")
    .fontSize(12)
    .text(
      `Forma AI analyzed the incident description and automatically generated this insurance claim form for ${category.toUpperCase()} insurance.`
    );

  doc.moveDown();

  // ===========================================
  // FOOTER
  // ===========================================

  doc
    .moveDown(2)
    .fillColor("#6B7280")
    .fontSize(11)
    .text(
      "Generated securely using Forma AI InsurTech Platform.",
      {
        align: "center",
      }
    );

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      resolve({
        fileName,
        filePath,
        pdfUrl: `/uploads/pdfs/${fileName}`,
      });
    });

    stream.on("error", reject);
  });
};