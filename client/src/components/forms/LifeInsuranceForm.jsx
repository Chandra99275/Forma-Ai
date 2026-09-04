import React, { useState } from "react";
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

const LifeInsuranceForm = () => {
  const [lifeData, setLifeData] = useState({
    policyHolderName: "",
    policyNumber: "",
    insuranceCompany: "",
    dob: "",
    gender: "",
    nomineeName: "",
    nomineeRelation: "",
    nomineePhone: "",
    claimType: "",
    deathDate: "",
    causeOfDeath: "",
    hospitalName: "",
    diagnosis: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    description: "",
  });

  const handleChange = (e) => {
    setLifeData({
      ...lifeData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="insuranceForm">

      {/* ---------- HEADER ---------- */}

      <div className="formTitle lifeTitle">
        <FaShieldAlt className="titleIcon" />

        <div>
          <h2>Life Insurance Claim Form</h2>

          <p>
            Claim for Death Benefit, Critical Illness, Maturity,
            Accidental Death and Disability Insurance.
          </p>
        </div>
      </div>

      {/* ---------- POLICY HOLDER DETAILS ---------- */}

      <div className="formSection">

        <h3><FaUser/> Policy Holder Information</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Policy Holder Full Name *</label>

            <input
              name="policyHolderName"
              value={lifeData.policyHolderName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Date of Birth *</label>

            <input
              type="date"
              name="dob"
              value={lifeData.dob}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Gender *</label>

            <select
              name="gender"
              value={lifeData.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Aadhaar Number</label>
            <input placeholder="XXXX XXXX XXXX"/>
          </div>

          <div className="inputGroup">
            <label>PAN Number</label>
            <input placeholder="ABCDE1234F"/>
          </div>

          <div className="inputGroup">
            <label>Policy Number *</label>

            <input
              name="policyNumber"
              value={lifeData.policyNumber}
              onChange={handleChange}
              placeholder="LIFE-2026-10021"
            />
          </div>

          <div className="inputGroup">
            <label>Insurance Company *</label>

            <input
              name="insuranceCompany"
              value={lifeData.insuranceCompany}
              onChange={handleChange}
              placeholder="LIC / SBI Life / HDFC Life"
            />
          </div>

          <div className="inputGroup">
            <label>Policy Start Date</label>
            <input type="date"/>
          </div>

          <div className="inputGroup">
            <label>Policy End Date</label>
            <input type="date"/>
          </div>

        </div>

      </div>

      {/* ---------- CLAIM TYPE ---------- */}

      <div className="formSection">

        <h3><FaHeartbeat/> Claim Details</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Claim Type *</label>

            <select
              name="claimType"
              value={lifeData.claimType}
              onChange={handleChange}
            >
              <option value="">Select Claim Type</option>

              <option>Death Claim</option>
              <option>Accidental Death Claim</option>
              <option>Critical Illness Claim</option>
              <option>Maturity Benefit</option>
              <option>Permanent Disability Claim</option>
              <option>Terminal Illness Claim</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Date of Death / Incident *</label>

            <input
              type="date"
              name="deathDate"
              value={lifeData.deathDate}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Cause of Death / Illness *</label>

            <input
              name="causeOfDeath"
              value={lifeData.causeOfDeath}
              onChange={handleChange}
              placeholder="Heart Attack / Accident"
            />
          </div>

          <div className="inputGroup">
            <label>Place of Incident</label>
            <input placeholder="Hyderabad"/>
          </div>

        </div>

        <div className="inputGroup">
          <label>Claim Description *</label>

          <textarea
            rows="4"
            name="description"
            value={lifeData.description}
            onChange={handleChange}
            placeholder="Describe the insurance claim..."
          />
        </div>

      </div>

      {/* ---------- NOMINEE DETAILS ---------- */}

      <div className="formSection">

        <h3><FaUsers/> Nominee Details</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Nominee Full Name *</label>

            <input
              name="nomineeName"
              value={lifeData.nomineeName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Relationship *</label>

            <select
              name="nomineeRelation"
              value={lifeData.nomineeRelation}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Father</option>
              <option>Mother</option>
              <option>Spouse</option>
              <option>Son</option>
              <option>Daughter</option>
              <option>Brother</option>
              <option>Sister</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Nominee Phone *</label>

            <input
              name="nomineePhone"
              value={lifeData.nomineePhone}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Nominee Aadhaar</label>
            <input placeholder="XXXX XXXX XXXX"/>
          </div>

        </div>

      </div>

      {/* ---------- HOSPITAL DETAILS ---------- */}

      <div className="formSection">

        <h3><FaFileMedical/> Medical / Hospital Details</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Hospital Name</label>

            <input
              name="hospitalName"
              value={lifeData.hospitalName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Doctor Name</label>
            <input placeholder="Doctor Name"/>
          </div>

          <div className="inputGroup">
            <label>Diagnosis</label>

            <input
              name="diagnosis"
              value={lifeData.diagnosis}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Treatment Cost</label>
            <input type="number"/>
          </div>

        </div>

      </div>

      {/* ---------- LEGAL HEIR ---------- */}

      <div className="formSection">

        <h3>Legal Heir Information</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Legal Heir Name</label>
            <input placeholder="Legal Heir"/>
          </div>

          <div className="inputGroup">
            <label>Relationship</label>
            <input placeholder="Relationship"/>
          </div>

          <div className="inputGroup">
            <label>Contact Number</label>
            <input placeholder="+91 9876543210"/>
          </div>

          <div className="inputGroup">
            <label>Email</label>
            <input type="email"/>
          </div>

        </div>

      </div>

      {/* ---------- DOCUMENTS ---------- */}

      <div className="formSection">

        <h3><FaFileUpload/> Upload Required Documents</h3>

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
            <div className="uploadItem" key={doc}>
              <label>{doc}</label>
              <input type="file" accept=".pdf,image/*"/>
            </div>
          ))}

        </div>

      </div>

      {/* ---------- BANK DETAILS ---------- */}

      <div className="formSection">

        <h3><FaUniversity/> Bank Details</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Bank Name *</label>

            <input
              name="bankName"
              value={lifeData.bankName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Account Holder Name</label>
            <input placeholder="Account Holder"/>
          </div>

          <div className="inputGroup">
            <label>Account Number *</label>

            <input
              name="accountNumber"
              value={lifeData.accountNumber}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>IFSC Code *</label>

            <input
              name="ifsc"
              value={lifeData.ifsc}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Branch Name</label>
            <input placeholder="Branch"/>
          </div>

          <div className="inputGroup">
            <label>UPI ID (Optional)</label>
            <input placeholder="example@upi"/>
          </div>

        </div>

      </div>

      {/* ---------- DECLARATION ---------- */}

      <div className="formSection">

        <h3><FaCheckCircle/> Declaration</h3>

        <label className="checkboxDeclaration">
          <input type="checkbox"/>
          I certify that all the information provided is true.
        </label>

        <label className="checkboxDeclaration">
          <input type="checkbox"/>
          I authorize Forma AI to verify my life insurance documents.
        </label>

        <label className="checkboxDeclaration">
          <input type="checkbox"/>
          I agree to AI OCR verification of uploaded certificates.
        </label>

      </div>

      {/* ---------- BUTTONS ---------- */}

      <div className="formButtons">

        <button className="draftBtn">
          Save Draft
        </button>

        <button className="submitBtn">
          Submit Life Insurance Claim
        </button>

      </div>

    </div>
  );
};

export default LifeInsuranceForm;