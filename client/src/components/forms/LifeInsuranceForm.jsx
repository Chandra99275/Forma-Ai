import React, { useEffect, useState } from "react";

import {
  FaShieldAlt,
  FaUser,
  FaUsers,
  FaHeartbeat,
  FaFileMedical,
  FaUniversity,
  FaFileUpload,
  FaCheckCircle,
} from "react-icons/fa";

const LifeInsuranceForm = ({ onDataChange }) => {
  const [lifeData, setLifeData] = useState({
    // ==========================================
    // POLICY HOLDER DETAILS
    // ==========================================
    policyHolderName: "",
    policyNumber: "",
    insuranceCompany: "",
    dob: "",
    gender: "",
    aadhaarNumber: "",
    panNumber: "",
    policyStartDate: "",
    policyEndDate: "",

    // ==========================================
    // CLAIM DETAILS
    // ==========================================
    claimType: "",
    deathDate: "",
    causeOfDeath: "",
    incidentPlace: "",
    description: "",

    // ==========================================
    // NOMINEE DETAILS
    // ==========================================
    nomineeName: "",
    nomineeRelation: "",
    nomineePhone: "",
    nomineeAadhaar: "",

    // ==========================================
    // MEDICAL / HOSPITAL DETAILS
    // ==========================================
    hospitalName: "",
    doctorName: "",
    diagnosis: "",
    treatmentCost: "",

    // ==========================================
    // LEGAL HEIR DETAILS
    // ==========================================
    legalHeirName: "",
    legalHeirRelationship: "",
    legalHeirContact: "",
    legalHeirEmail: "",

    // ==========================================
    // BANK DETAILS
    // ==========================================
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifsc: "",
    branchName: "",
    upiId: "",

    // ==========================================
    // DECLARATIONS
    // ==========================================
    informationDeclaration: false,
    documentVerificationAuthorization: false,
    aiVerificationAuthorization: false,
  });

  // ==========================================
  // SEND DATA TO PARENT
  // ==========================================

  useEffect(() => {
    if (onDataChange) {
      onDataChange(lifeData);
    }
  }, [lifeData, onDataChange]);

  // ==========================================
  // INPUT CHANGE HANDLER
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLifeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // DECLARATION HANDLER
  // ==========================================

  const handleDeclarationChange = (e) => {
    const { name, checked } = e.target;

    setLifeData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="insuranceForm">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="formTitle lifeTitle">

        <FaShieldAlt className="titleIcon" />

        <div>

          <h2>
            Life Insurance Claim Form
          </h2>

          <p>
            Claim for Death Benefit, Critical Illness,
            Maturity, Accidental Death and Disability
            Insurance.
          </p>

        </div>

      </div>

      {/* ==========================================
          POLICY HOLDER INFORMATION
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaUser />
          Policy Holder Information
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Policy Holder Full Name *
            </label>

            <input
              name="policyHolderName"
              value={lifeData.policyHolderName}
              onChange={handleChange}
              placeholder="Enter full name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Date of Birth *
            </label>

            <input
              type="date"
              name="dob"
              value={lifeData.dob}
              onChange={handleChange}
            />

          </div>

          <div className="inputGroup">

            <label>
              Gender *
            </label>

            <select
              name="gender"
              value={lifeData.gender}
              onChange={handleChange}
            >

              <option value="">
                Select
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          <div className="inputGroup">

            <label>
              Aadhaar Number
            </label>

            <input
              name="aadhaarNumber"
              value={lifeData.aadhaarNumber}
              onChange={handleChange}
              placeholder="XXXX XXXX XXXX"
              maxLength="14"
            />

          </div>

          <div className="inputGroup">

            <label>
              PAN Number
            </label>

            <input
              name="panNumber"
              value={lifeData.panNumber}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              maxLength="10"
            />

          </div>

          <div className="inputGroup">

            <label>
              Policy Number *
            </label>

            <input
              name="policyNumber"
              value={lifeData.policyNumber}
              onChange={handleChange}
              placeholder="LIFE-2026-10021"
            />

          </div>

          <div className="inputGroup">

            <label>
              Insurance Company *
            </label>

            <input
              name="insuranceCompany"
              value={lifeData.insuranceCompany}
              onChange={handleChange}
              placeholder="LIC / SBI Life / HDFC Life"
            />

          </div>

          <div className="inputGroup">

            <label>
              Policy Start Date
            </label>

            <input
              type="date"
              name="policyStartDate"
              value={lifeData.policyStartDate}
              onChange={handleChange}
            />

          </div>

          <div className="inputGroup">

            <label>
              Policy End Date
            </label>

            <input
              type="date"
              name="policyEndDate"
              value={lifeData.policyEndDate}
              onChange={handleChange}
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          CLAIM DETAILS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaHeartbeat />
          Claim Details
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Claim Type *
            </label>

            <select
              name="claimType"
              value={lifeData.claimType}
              onChange={handleChange}
            >

              <option value="">
                Select Claim Type
              </option>

              <option value="Death Claim">
                Death Claim
              </option>

              <option value="Accidental Death Claim">
                Accidental Death Claim
              </option>

              <option value="Critical Illness Claim">
                Critical Illness Claim
              </option>

              <option value="Maturity Benefit">
                Maturity Benefit
              </option>

              <option value="Permanent Disability Claim">
                Permanent Disability Claim
              </option>

              <option value="Terminal Illness Claim">
                Terminal Illness Claim
              </option>

            </select>

          </div>

          <div className="inputGroup">

            <label>
              Date of Death / Incident *
            </label>

            <input
              type="date"
              name="deathDate"
              value={lifeData.deathDate}
              onChange={handleChange}
            />

          </div>

          <div className="inputGroup">

            <label>
              Cause of Death / Illness *
            </label>

            <input
              name="causeOfDeath"
              value={lifeData.causeOfDeath}
              onChange={handleChange}
              placeholder="Heart Attack / Accident"
            />

          </div>

          <div className="inputGroup">

            <label>
              Place of Incident
            </label>

            <input
              name="incidentPlace"
              value={lifeData.incidentPlace}
              onChange={handleChange}
              placeholder="Hyderabad"
            />

          </div>

        </div>

        <div className="inputGroup">

          <label>
            Claim Description *
          </label>

          <textarea
            rows="4"
            name="description"
            value={lifeData.description}
            onChange={handleChange}
            placeholder="Describe the insurance claim..."
          />

        </div>

      </div>

      {/* ==========================================
          NOMINEE DETAILS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaUsers />
          Nominee Details
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Nominee Full Name *
            </label>

            <input
              name="nomineeName"
              value={lifeData.nomineeName}
              onChange={handleChange}
              placeholder="Nominee Full Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Relationship *
            </label>

            <select
              name="nomineeRelation"
              value={lifeData.nomineeRelation}
              onChange={handleChange}
            >

              <option value="">
                Select
              </option>

              <option value="Father">
                Father
              </option>

              <option value="Mother">
                Mother
              </option>

              <option value="Spouse">
                Spouse
              </option>

              <option value="Son">
                Son
              </option>

              <option value="Daughter">
                Daughter
              </option>

              <option value="Brother">
                Brother
              </option>

              <option value="Sister">
                Sister
              </option>

            </select>

          </div>

          <div className="inputGroup">

            <label>
              Nominee Phone *
            </label>

            <input
              type="tel"
              name="nomineePhone"
              value={lifeData.nomineePhone}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />

          </div>

          <div className="inputGroup">

            <label>
              Nominee Aadhaar
            </label>

            <input
              name="nomineeAadhaar"
              value={lifeData.nomineeAadhaar}
              onChange={handleChange}
              placeholder="XXXX XXXX XXXX"
              maxLength="14"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          MEDICAL / HOSPITAL DETAILS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaFileMedical />
          Medical / Hospital Details
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Hospital Name
            </label>

            <input
              name="hospitalName"
              value={lifeData.hospitalName}
              onChange={handleChange}
              placeholder="Hospital Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Doctor Name
            </label>

            <input
              name="doctorName"
              value={lifeData.doctorName}
              onChange={handleChange}
              placeholder="Doctor Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Diagnosis
            </label>

            <input
              name="diagnosis"
              value={lifeData.diagnosis}
              onChange={handleChange}
              placeholder="Diagnosis"
            />

          </div>

          <div className="inputGroup">

            <label>
              Treatment Cost
            </label>

            <input
              type="number"
              name="treatmentCost"
              value={lifeData.treatmentCost}
              onChange={handleChange}
              placeholder="₹ 0"
              min="0"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          LEGAL HEIR INFORMATION
      ========================================== */}

      <div className="formSection">

        <h3>
          Legal Heir Information
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Legal Heir Name
            </label>

            <input
              name="legalHeirName"
              value={lifeData.legalHeirName}
              onChange={handleChange}
              placeholder="Legal Heir"
            />

          </div>

          <div className="inputGroup">

            <label>
              Relationship
            </label>

            <input
              name="legalHeirRelationship"
              value={lifeData.legalHeirRelationship}
              onChange={handleChange}
              placeholder="Relationship"
            />

          </div>

          <div className="inputGroup">

            <label>
              Contact Number
            </label>

            <input
              type="tel"
              name="legalHeirContact"
              value={lifeData.legalHeirContact}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />

          </div>

          <div className="inputGroup">

            <label>
              Email
            </label>

            <input
              type="email"
              name="legalHeirEmail"
              value={lifeData.legalHeirEmail}
              onChange={handleChange}
              placeholder="example@email.com"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          DOCUMENTS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaFileUpload />
          Upload Required Documents
        </h3>

        <div className="uploadGrid">

          {[
            "Life Insurance Policy PDF",
            "Death Certificate",
            "Medical Certificate",
            "Hospital Bills",
            "Aadhaar Card",
            "PAN Card",
            "Nominee Aadhaar",
            "Bank Passbook",
            "Cancelled Cheque",
            "Legal Heir Certificate",
            "Post Mortem Report",
            "Police FIR (If Accident)",
          ].map((doc) => (

            <div
              className="uploadItem"
              key={doc}
            >

              <label>
                {doc}
              </label>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
              />

            </div>

          ))}

        </div>

        <p className="uploadHint">
          Supported formats: PDF, JPG, JPEG and PNG.
        </p>

      </div>

      {/* ==========================================
          BANK DETAILS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaUniversity />
          Bank Details
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Bank Name *
            </label>

            <input
              name="bankName"
              value={lifeData.bankName}
              onChange={handleChange}
              placeholder="Bank Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Account Holder Name
            </label>

            <input
              name="accountHolderName"
              value={lifeData.accountHolderName}
              onChange={handleChange}
              placeholder="Account Holder"
            />

          </div>

          <div className="inputGroup">

            <label>
              Account Number *
            </label>

            <input
              name="accountNumber"
              value={lifeData.accountNumber}
              onChange={handleChange}
              placeholder="Account Number"
            />

          </div>

          <div className="inputGroup">

            <label>
              IFSC Code *
            </label>

            <input
              name="ifsc"
              value={lifeData.ifsc}
              onChange={handleChange}
              placeholder="IFSC Code"
            />

          </div>

          <div className="inputGroup">

            <label>
              Branch Name
            </label>

            <input
              name="branchName"
              value={lifeData.branchName}
              onChange={handleChange}
              placeholder="Branch"
            />

          </div>

          <div className="inputGroup">

            <label>
              UPI ID (Optional)
            </label>

            <input
              name="upiId"
              value={lifeData.upiId}
              onChange={handleChange}
              placeholder="example@upi"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          DECLARATION
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaCheckCircle />
          Declaration
        </h3>

        <label className="checkboxDeclaration">

          <input
            type="checkbox"
            name="informationDeclaration"
            checked={
              lifeData.informationDeclaration
            }
            onChange={handleDeclarationChange}
          />

          I certify that all the information
          provided is true.

        </label>

        <label className="checkboxDeclaration">

          <input
            type="checkbox"
            name="documentVerificationAuthorization"
            checked={
              lifeData.documentVerificationAuthorization
            }
            onChange={handleDeclarationChange}
          />

          I authorize Forma AI to verify my
          life insurance documents.

        </label>

        <label className="checkboxDeclaration">

          <input
            type="checkbox"
            name="aiVerificationAuthorization"
            checked={
              lifeData.aiVerificationAuthorization
            }
            onChange={handleDeclarationChange}
          />

          I agree to AI OCR verification of
          uploaded certificates.

        </label>

      </div>

      {/* ==========================================
          BACKEND SYNC MESSAGE
      ========================================== */}

      <div className="formInfoMessage">

        <FaCheckCircle />

        <span>
          Life insurance claim information is
          automatically synchronized with the
          Forma AI claim form.
        </span>

      </div>

    </div>
  );
};

export default LifeInsuranceForm;