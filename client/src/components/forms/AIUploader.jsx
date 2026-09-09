
import React, { useEffect, useState } from "react";

import {
  FaHeartbeat,
  FaHospital,
  FaUserInjured,
  FaUserMd,
  FaAmbulance,
  FaNotesMedical,
  FaFileMedical,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

const HealthInsuranceForm = ({ onDataChange }) => {
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
    claimType: "",

    hospitalName: "",
    hospitalAddress: "",
    doctorName: "",
    doctorRegistrationNumber: "",
    admissionDate: "",
    dischargeDate: "",

    diagnosis: "",
    surgeryType: "",
    wardType: "",

    treatmentCost: "",
    roomCharges: "",
    icuCharges: "",
    pharmacyCharges: "",
    ambulanceCharges: "",
    consultationCharges: "",

    servicesClaimed: [],

    emergencyName: "",
    emergencyPhone: "",

    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: "",

    claimDescription: "",

    informationDeclaration: false,
    documentAuthorization: false,
  });

  // Send updated health form data to ManualForm
  useEffect(() => {
    if (onDataChange) {
      onDataChange(healthData);
    }
  }, [healthData, onDataChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setHealthData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setHealthData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleServiceChange = (service) => {
    setHealthData((prev) => {
      const alreadySelected = prev.servicesClaimed.includes(service);

      return {
        ...prev,
        servicesClaimed: alreadySelected
          ? prev.servicesClaimed.filter((item) => item !== service)
          : [...prev.servicesClaimed, service],
      };
    });
  };

  const services = [
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
  ];

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
              min="0"
              max="120"
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
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
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
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Aadhaar Number</label>

            <input
              name="aadhaar"
              value={healthData.aadhaar}
              onChange={handleChange}
              placeholder="XXXX XXXX XXXX"
              maxLength="14"
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

            <select
              name="claimType"
              value={healthData.claimType}
              onChange={handleChange}
            >
              <option value="">Select Claim Type</option>
              <option value="Hospitalization">Hospitalization</option>
              <option value="Medical Reimbursement">
                Medical Reimbursement
              </option>
              <option value="Cashless Claim">Cashless Claim</option>
              <option value="Surgery Claim">Surgery Claim</option>
              <option value="ICU Charges">ICU Charges</option>
              <option value="Maternity Claim">Maternity Claim</option>
              <option value="Dental Treatment">Dental Treatment</option>
              <option value="OPD Claim">OPD Claim</option>
              <option value="Pharmacy Bills">Pharmacy Bills</option>
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

            <input
              name="doctorRegistrationNumber"
              value={healthData.doctorRegistrationNumber}
              onChange={handleChange}
              placeholder="Medical Registration ID"
            />
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

            <select
              name="wardType"
              value={healthData.wardType}
              onChange={handleChange}
            >
              <option value="">Select Ward</option>
              <option value="General Ward">General Ward</option>
              <option value="Private Room">Private Room</option>
              <option value="Semi Private">Semi Private</option>
              <option value="ICU">ICU</option>
              <option value="Emergency">Emergency</option>
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
              min="0"
            />
          </div>

          <div className="inputGroup">
            <label>Room Charges</label>

            <input
              type="number"
              name="roomCharges"
              value={healthData.roomCharges}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="inputGroup">
            <label>ICU Charges</label>

            <input
              type="number"
              name="icuCharges"
              value={healthData.icuCharges}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="inputGroup">
            <label>Pharmacy Charges</label>

            <input
              type="number"
              name="pharmacyCharges"
              value={healthData.pharmacyCharges}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="inputGroup">
            <label>Ambulance Charges</label>

            <input
              type="number"
              name="ambulanceCharges"
              value={healthData.ambulanceCharges}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="inputGroup">
            <label>Consultation Charges</label>

            <input
              type="number"
              name="consultationCharges"
              value={healthData.consultationCharges}
              onChange={handleChange}
              min="0"
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

          {services.map((service) => (
            <label key={service}>

              <input
                type="checkbox"
                checked={healthData.servicesClaimed.includes(service)}
                onChange={() => handleServiceChange(service)}
              />

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
              type="tel"
              name="emergencyPhone"
              value={healthData.emergencyPhone}
              onChange={handleChange}
              placeholder="Enter phone number"
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
              placeholder="SBIN0001234"
            />
          </div>

          <div className="inputGroup">
            <label>UPI ID (Optional)</label>

            <input
              name="upiId"
              value={healthData.upiId}
              onChange={handleChange}
              placeholder="example@upi"
            />
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
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div className="uploadItem">
            <label>Prescription</label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div className="uploadItem">
            <label>Medical Reports</label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div className="uploadItem">
            <label>Discharge Summary</label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div className="uploadItem">
            <label>Health Insurance Policy PDF</label>

            <input
              type="file"
              accept=".pdf"
            />
          </div>

          <div className="uploadItem">
            <label>Identity Proof</label>

            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

        </div>

        <p className="formInfoMessage">
          Documents can be uploaded after saving the claim draft.
          Forma AI can then process supported documents using OCR.
        </p>

      </div>

      {/* ================= DECLARATION ================= */}

      <div className="formSection">

        <h3>
          <FaCheckCircle /> Declaration
        </h3>

        <div className="inputGroup">

          <label>Additional Claim Information</label>

          <textarea
            rows="5"
            name="claimDescription"
            value={healthData.claimDescription}
            onChange={handleChange}
            placeholder="Provide additional information related to your medical insurance claim..."
          />

        </div>

        <label className="checkboxDeclaration">

          <input
            type="checkbox"
            name="informationDeclaration"
            checked={healthData.informationDeclaration}
            onChange={handleCheckboxChange}
          />

          I declare that all the information provided above is true and
          correct.

        </label>

        <label className="checkboxDeclaration">

          <input
            type="checkbox"
            name="documentAuthorization"
            checked={healthData.documentAuthorization}
            onChange={handleCheckboxChange}
          />

          I authorize Forma AI to verify my medical documents for claim
          processing.

        </label>

      </div>

      {/* ================= BACKEND SYNC INFO ================= */}

      <div className="formSyncMessage">

        <FaCheckCircle />

        <span>
          Your health claim information is automatically synchronized with
          the Forma AI claim form.
        </span>

      </div>

    </div>
  );
};

export default HealthInsuranceForm;

