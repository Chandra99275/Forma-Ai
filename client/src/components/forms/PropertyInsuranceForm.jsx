import React, { useState } from "react";
import {
  FaHome,
  FaFire,
  FaWater,
  FaBolt,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaFileUpload,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

const PropertyInsuranceForm = () => {
  const [propertyData, setPropertyData] = useState({
    ownerName: "",
    propertyType: "",
    policyNumber: "",
    insuranceCompany: "",
    propertyAddress: "",
    city: "",
    state: "",
    pinCode: "",
    damageDate: "",
    damageTime: "",
    damageType: "",
    estimatedLoss: "",
    policeComplaint: "",
    witnessName: "",
    witnessPhone: "",
    description: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });

  const handleChange = (e) => {
    setPropertyData({
      ...propertyData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="insuranceForm">

      {/* ---------- HEADER ---------- */}

      <div className="formTitle propertyTitle">
        <FaHome className="titleIcon" />
        <div>
          <h2>Property Insurance Claim Form</h2>
          <p>
            Submit claims for fire, flood, burglary, earthquake,
            cyclone, water leakage and natural disasters.
          </p>
        </div>
      </div>

      {/* ---------- OWNER DETAILS ---------- */}

      <div className="formSection">
        <h3><FaShieldAlt /> Property Owner Information</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Owner Full Name *</label>
            <input
              name="ownerName"
              value={propertyData.ownerName}
              onChange={handleChange}
              placeholder="Enter owner name"
            />
          </div>

          <div className="inputGroup">
            <label>Property Type *</label>
            <select
              name="propertyType"
              value={propertyData.propertyType}
              onChange={handleChange}
            >
              <option value="">Select Property</option>
              <option>Independent House</option>
              <option>Apartment</option>
              <option>Commercial Building</option>
              <option>Office</option>
              <option>Shop</option>
              <option>Warehouse</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Insurance Company *</label>
            <input
              name="insuranceCompany"
              value={propertyData.insuranceCompany}
              onChange={handleChange}
              placeholder="HDFC ERGO / ICICI Lombard"
            />
          </div>

          <div className="inputGroup">
            <label>Policy Number *</label>
            <input
              name="policyNumber"
              value={propertyData.policyNumber}
              onChange={handleChange}
              placeholder="PROP-INS-2026-1002"
            />
          </div>

        </div>
      </div>

      {/* ---------- PROPERTY LOCATION ---------- */}

      <div className="formSection">
        <h3><FaMapMarkerAlt /> Property Location</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Property Address *</label>
            <input
              name="propertyAddress"
              value={propertyData.propertyAddress}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>City *</label>
            <input
              name="city"
              value={propertyData.city}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>State *</label>
            <input
              name="state"
              value={propertyData.state}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>PIN Code *</label>
            <input
              name="pinCode"
              value={propertyData.pinCode}
              onChange={handleChange}
            />
          </div>

        </div>
      </div>

      {/* ---------- DAMAGE DETAILS ---------- */}

      <div className="formSection">
        <h3><FaFire /> Damage Information</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Damage Date *</label>
            <input
              type="date"
              name="damageDate"
              value={propertyData.damageDate}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Damage Time *</label>
            <input
              type="time"
              name="damageTime"
              value={propertyData.damageTime}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Damage Type *</label>
            <select
              name="damageType"
              value={propertyData.damageType}
              onChange={handleChange}
            >
              <option value="">Select Damage Type</option>
              <option>Fire Damage</option>
              <option>Flood Damage</option>
              <option>Earthquake</option>
              <option>Cyclone</option>
              <option>Lightning</option>
              <option>Burglary</option>
              <option>Water Leakage</option>
              <option>Building Collapse</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Estimated Property Loss (₹)</label>
            <input
              type="number"
              name="estimatedLoss"
              value={propertyData.estimatedLoss}
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="inputGroup">
          <label>Describe Property Damage *</label>

          <textarea
            rows="5"
            name="description"
            value={propertyData.description}
            onChange={handleChange}
            placeholder="Explain the damage caused to the property..."
          />
        </div>
      </div>

      {/* ---------- DAMAGE CHECKLIST ---------- */}

      <div className="formSection">
        <h3><FaBolt /> Property Damage Checklist</h3>

        <div className="checkboxGrid">
          {[
            "Roof Damage",
            "Wall Damage",
            "Floor Damage",
            "Doors Damaged",
            "Windows Broken",
            "Furniture Damaged",
            "Electrical Appliances",
            "Kitchen Damage",
            "Water Tank Damage",
            "Garden Damage",
            "Garage Damage",
            "Solar Panels Damaged",
            "Boundary Wall Damage",
            "Ceiling Damage",
            "Bathroom Damage",
            "Fire Smoke Damage",
          ].map((item) => (
            <label key={item}>
              <input type="checkbox" />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* ---------- POLICE DETAILS ---------- */}

      <div className="formSection">
        <h3>Police Complaint Details</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Police Complaint Filed?</label>
            <select
              name="policeComplaint"
              value={propertyData.policeComplaint}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Complaint Number</label>
            <input placeholder="Complaint Number" />
          </div>

          <div className="inputGroup">
            <label>Police Station</label>
            <input placeholder="Police Station Name" />
          </div>

          <div className="inputGroup">
            <label>Complaint Date</label>
            <input type="date" />
          </div>

        </div>
      </div>

      {/* ---------- WITNESS DETAILS ---------- */}

      <div className="formSection">
        <h3>Witness Details</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Witness Name</label>
            <input
              name="witnessName"
              value={propertyData.witnessName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Witness Phone</label>
            <input
              name="witnessPhone"
              value={propertyData.witnessPhone}
              onChange={handleChange}
            />
          </div>

        </div>
      </div>

      {/* ---------- LOSS BREAKDOWN ---------- */}

      <div className="formSection">
        <h3><FaMoneyBillWave /> Estimated Loss Breakdown</h3>

        <div className="grid2">

          {[
            "Building Structure",
            "Furniture",
            "Electronics",
            "Kitchen Appliances",
            "Electrical Wiring",
            "Painting & Interior",
            "Plumbing",
            "Garage Damage",
          ].map((item) => (
            <div className="inputGroup" key={item}>
              <label>{item} Cost (₹)</label>
              <input type="number" placeholder="0" />
            </div>
          ))}

        </div>
      </div>

      {/* ---------- DOCUMENTS ---------- */}

      <div className="formSection">
        <h3><FaFileUpload /> Upload Supporting Documents</h3>

        <div className="uploadGrid">

          {[
            "Insurance Policy PDF",
            "Property Ownership Proof",
            "Police Complaint Copy",
            "Repair Estimate PDF",
            "Electricity Bill",
            "Property Tax Receipt",
          ].map((doc) => (
            <div className="uploadItem" key={doc}>
              <label>{doc}</label>
              <input type="file" accept=".pdf,image/*" />
            </div>
          ))}

        </div>
      </div>

      {/* ---------- PROPERTY PHOTOS ---------- */}

      <div className="formSection">
        <h3><FaCamera /> Upload Property Damage Photos</h3>

        <div className="uploadGrid">

          {[
            "Front View",
            "Back View",
            "Roof Damage",
            "Flood Damage",
            "Fire Damage",
            "Kitchen Damage",
            "Bedroom Damage",
            "Living Room Damage",
          ].map((photo) => (
            <div className="uploadItem" key={photo}>
              <label>{photo}</label>
              <input type="file" accept="image/*" />
            </div>
          ))}

        </div>
      </div>

      {/* ---------- BANK DETAILS ---------- */}

      <div className="formSection">
        <h3><FaMoneyBillWave /> Bank Details for Claim Settlement</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Bank Name</label>
            <input
              name="bankName"
              value={propertyData.bankName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Account Number</label>
            <input
              name="accountNumber"
              value={propertyData.accountNumber}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>IFSC Code</label>
            <input
              name="ifsc"
              value={propertyData.ifsc}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>UPI ID (Optional)</label>
            <input placeholder="example@upi" />
          </div>

        </div>
      </div>

      {/* ---------- DECLARATION ---------- */}

      <div className="formSection">
        <h3><FaCheckCircle /> Declaration</h3>

        <label className="checkboxDeclaration">
          <input type="checkbox" />
          I declare that the above property damage details are true.
        </label>

        <label className="checkboxDeclaration">
          <input type="checkbox" />
          I authorize Forma AI to verify my uploaded documents.
        </label>

        <label className="checkboxDeclaration">
          <input type="checkbox" />
          I agree to AI OCR and document verification.
        </label>

      </div>

      {/* ---------- BUTTONS ---------- */}

      <div className="formButtons">
        <button className="draftBtn">Save Draft</button>

        <button className="submitBtn">
          Submit Property Insurance Claim
        </button>
      </div>

    </div>
  );
};

export default PropertyInsuranceForm;