import React, { useState } from "react";
import {
  FaHeartbeat,
  FaHospital,
  FaUserInjured,
  FaUserMd,
  FaAmbulance,
  FaNotesMedical,
  FaFileMedical,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaCheckCircle,
} from "react-icons/fa";

const HealthInsuranceForm = () => {
  const [healthData, setHealthData] = useState({
    patientName: "",
    age: "",
    gender: "",
    bloodGroup: "",
    dob: "",
    aadhaar: "",
    policyNumber: "",
    policyHolder: "",
    insuranceCompany: "",
    hospitalName: "",
    hospitalAddress: "",
    doctorName: "",
    diagnosis: "",
    admissionDate: "",
    dischargeDate: "",
    surgeryType: "",
    treatmentCost: "",
    roomCharges: "",
    icuCharges: "",
    pharmacyCharges: "",
    ambulanceCharges: "",
    consultationCharges: "",
    emergencyName: "",
    emergencyPhone: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    claimDescription: "",
  });

  const handleChange = (e) => {
    setHealthData({
      ...healthData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="insuranceForm">

      {/* ================= HEADER ================= */}

      <div className="formTitle healthTitle">
        <FaHeartbeat className="titleIcon" />
        <div>
          <h2>Health Insurance Claim Form</h2>
          <p>
            Submit claims for hospitalization, surgery, ICU, pharmacy,
            OPD, ambulance and reimbursement.
          </p>
        </div>
      </div>

      {/* ================= PATIENT DETAILS ================= */}

      <div className="formSection">

        <h3>
          <FaUserInjured /> Patient Information
        </h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Patient Full Name *</label>
            <input
              name="patientName"
              value={healthData.patientName}
              onChange={handleChange}
              placeholder="Enter patient name"
            />
          </div>

          <div className="inputGroup">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={healthData.dob}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Age *</label>
            <input
              type="number"
              name="age"
              value={healthData.age}
              onChange={handleChange}
              placeholder="Age"
            />
          </div>

          <div className="inputGroup">
            <label>Gender *</label>
            <select
              name="gender"
              value={healthData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Blood Group</label>
            <select
              name="bloodGroup"
              value={healthData.bloodGroup}
              onChange={handleChange}
            >
              <option value="">Select Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Aadhaar Number</label>
            <input
              name="aadhaar"
              value={healthData.aadhaar}
              onChange={handleChange}
              placeholder="XXXX XXXX XXXX"
            />
          </div>

        </div>
      </div>

      {/* ================= POLICY DETAILS ================= */}

      <div className="formSection">

        <h3>
          <FaFileMedical /> Policy Information
        </h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Insurance Company *</label>
            <input
              name="insuranceCompany"
              value={healthData.insuranceCompany}
              onChange={handleChange}
              placeholder="ICICI Lombard / Star Health"
            />
          </div>

          <div className="inputGroup">
            <label>Policy Number *</label>
            <input
              name="policyNumber"
              value={healthData.policyNumber}
              onChange={handleChange}
              placeholder="POL-INS-2026-001"
            />
          </div>

          <div className="inputGroup">
            <label>Policy Holder Name</label>
            <input
              name="policyHolder"
              value={healthData.policyHolder}
              onChange={handleChange}
              placeholder="Policy Holder Name"
            />
          </div>

          <div className="inputGroup">
            <label>Claim Type *</label>
            <select>
              <option>Select Claim Type</option>
              <option>Hospitalization</option>
              <option>Medical Reimbursement</option>
              <option>Cashless Claim</option>
              <option>Surgery Claim</option>
              <option>ICU Charges</option>
              <option>Maternity Claim</option>
              <option>Dental Treatment</option>
              <option>OPD Claim</option>
              <option>Pharmacy Bills</option>
            </select>
          </div>

        </div>
      </div>

      {/* ================= HOSPITAL DETAILS ================= */}

      <div className="formSection">

        <h3>
          <FaHospital /> Hospital Details
        </h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Hospital Name *</label>
            <input
              name="hospitalName"
              value={healthData.hospitalName}
              onChange={handleChange}
              placeholder="Apollo Hospital Hyderabad"
            />
          </div>

          <div className="inputGroup">
            <label>Hospital Address</label>
            <input
              name="hospitalAddress"
              value={healthData.hospitalAddress}
              onChange={handleChange}
              placeholder="Hospital Address"
            />
          </div>

          <div className="inputGroup">
            <label>Doctor Name *</label>
            <input
              name="doctorName"
              value={healthData.doctorName}
              onChange={handleChange}
              placeholder="Dr. Rajesh Kumar"
            />
          </div>

          <div className="inputGroup">
            <label>Doctor Registration Number</label>
            <input placeholder="Medical Registration ID" />
          </div>

          <div className="inputGroup">
            <label>Admission Date *</label>
            <input
              type="date"
              name="admissionDate"
              value={healthData.admissionDate}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Discharge Date *</label>
            <input
              type="date"
              name="dischargeDate"
              value={healthData.dischargeDate}
              onChange={handleChange}
            />
          </div>

        </div>
      </div>

      {/* ================= DIAGNOSIS ================= */}

      <div className="formSection">

        <h3>
          <FaUserMd /> Diagnosis & Treatment
        </h3>

        <div className="inputGroup">
          <label>Diagnosis / Medical Condition *</label>
          <textarea
            rows="4"
            name="diagnosis"
            value={healthData.diagnosis}
            onChange={handleChange}
            placeholder="Describe diagnosis, illness or treatment..."
          />
        </div>

        <div className="grid2">

          <div className="inputGroup">
            <label>Surgery Type</label>
            <input
              name="surgeryType"
              value={healthData.surgeryType}
              onChange={handleChange}
              placeholder="Heart Surgery / Knee Replacement"
            />
          </div>

          <div className="inputGroup">
            <label>Ward Type</label>
            <select>
              <option>Select Ward</option>
              <option>General Ward</option>
              <option>Private Room</option>
              <option>Semi Private</option>
              <option>ICU</option>
              <option>Emergency</option>
            </select>
          </div>

        </div>

      </div>

      {/* ================= EXPENSE BREAKDOWN ================= */}

      <div className="formSection">

        <h3>
          <FaMoneyBillWave /> Medical Expense Breakdown
        </h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Total Treatment Cost</label>
            <input
              type="number"
              name="treatmentCost"
              value={healthData.treatmentCost}
              onChange={handleChange}
              placeholder="₹"
            />
          </div>

          <div className="inputGroup">
            <label>Room Charges</label>
            <input
              type="number"
              name="roomCharges"
              value={healthData.roomCharges}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>ICU Charges</label>
            <input
              type="number"
              name="icuCharges"
              value={healthData.icuCharges}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Pharmacy Charges</label>
            <input
              type="number"
              name="pharmacyCharges"
              value={healthData.pharmacyCharges}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Ambulance Charges</label>
            <input
              type="number"
              name="ambulanceCharges"
              value={healthData.ambulanceCharges}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Consultation Charges</label>
            <input
              type="number"
              name="consultationCharges"
              value={healthData.consultationCharges}
              onChange={handleChange}
            />
          </div>

        </div>

      </div>

      {/* ================= CLAIM SERVICES ================= */}

      <div className="formSection">

        <h3>
          <FaNotesMedical /> Services Claimed
        </h3>

        <div className="checkboxGrid">
          {[
            "Hospitalization Charges",
            "ICU Charges",
            "Surgery Charges",
            "Doctor Consultation",
            "Diagnostic Tests",
            "Medicines",
            "Ambulance Charges",
            "Physiotherapy",
            "Dental Treatment",
            "Maternity Expenses",
            "Post Hospitalization",
            "Pre Hospitalization",
            "Medical Equipment",
            "Health Checkup",
            "Emergency Care",
          ].map((service) => (
            <label key={service}>
              <input type="checkbox" />
              {service}
            </label>
          ))}
        </div>

      </div>

      {/* ================= EMERGENCY CONTACT ================= */}

      <div className="formSection">

        <h3>
          <FaAmbulance /> Emergency Contact
        </h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Emergency Contact Name</label>
            <input
              name="emergencyName"
              value={healthData.emergencyName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Emergency Contact Number</label>
            <input
              name="emergencyPhone"
              value={healthData.emergencyPhone}
              onChange={handleChange}
            />
          </div>

        </div>

      </div>

      {/* ================= BANK DETAILS ================= */}

      <div className="formSection">

        <h3>
          <FaMoneyBillWave /> Bank Account Details
        </h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Bank Name</label>
            <input
              name="bankName"
              value={healthData.bankName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Account Number</label>
            <input
              name="accountNumber"
              value={healthData.accountNumber}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>IFSC Code</label>
            <input
              name="ifsc"
              value={healthData.ifsc}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>UPI ID (Optional)</label>
            <input placeholder="example@upi" />
          </div>

        </div>

      </div>

      {/* ================= DOCUMENT UPLOAD ================= */}

      <div className="formSection">

        <h3>
          <FaFileMedical /> Upload Medical Documents
        </h3>

        <div className="uploadGrid">

          <div className="uploadItem">
            <label>Hospital Bills</label>
            <input type="file" multiple />
          </div>

          <div className="uploadItem">
            <label>Prescription</label>
            <input type="file" multiple />
          </div>

          <div className="uploadItem">
            <label>Medical Reports</label>
            <input type="file" multiple />
          </div>

          <div className="uploadItem">
            <label>Discharge Summary</label>
            <input type="file" multiple />
          </div>

          <div className="uploadItem">
            <label>Health Insurance Policy PDF</label>
            <input type="file" accept=".pdf" />
          </div>

          <div className="uploadItem">
            <label>Identity Proof (Aadhaar/PAN)</label>
            <input type="file" multiple />
          </div>

        </div>

      </div>

      {/* ================= DECLARATION ================= */}

      <div className="formSection">

        <h3>
          <FaCheckCircle /> Declaration
        </h3>

        <div className="inputGroup">
          <textarea
            rows="5"
            name="claimDescription"
            value={healthData.claimDescription}
            onChange={handleChange}
            placeholder="Provide additional information related to your medical insurance claim..."
          />
        </div>

        <label className="checkboxDeclaration">
          <input type="checkbox" />
          I declare that all the information provided above is true and correct.
        </label>

        <label className="checkboxDeclaration">
          <input type="checkbox" />
          I authorize Forma AI to verify my medical documents for claim processing.
        </label>

      </div>

      {/* ================= BUTTONS ================= */}

      <div className="formButtons">
        <button className="draftBtn">Save Draft</button>

        <button className="submitBtn">
          Submit Health Insurance Claim
        </button>
      </div>

    </div>
  );
};

export default HealthInsuranceForm;