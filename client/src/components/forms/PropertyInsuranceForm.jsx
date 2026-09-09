import React, { useEffect, useState } from "react";

import {
  FaHome,
  FaFire,
  FaBolt,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaFileUpload,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

const PropertyInsuranceForm = ({ onDataChange }) => {
  const [propertyData, setPropertyData] = useState({
    // ==========================================
    // OWNER & POLICY DETAILS
    // ==========================================
    ownerName: "",
    propertyType: "",
    policyNumber: "",
    insuranceCompany: "",

    // ==========================================
    // PROPERTY LOCATION
    // ==========================================
    propertyAddress: "",
    city: "",
    state: "",
    pinCode: "",

    // ==========================================
    // DAMAGE DETAILS
    // ==========================================
    damageDate: "",
    damageTime: "",
    damageType: "",
    estimatedLoss: "",
    description: "",

    // ==========================================
    // DAMAGE CHECKLIST
    // ==========================================
    damageChecklist: [],

    // ==========================================
    // POLICE DETAILS
    // ==========================================
    policeComplaint: "",
    complaintNumber: "",
    policeStation: "",
    complaintDate: "",

    // ==========================================
    // WITNESS DETAILS
    // ==========================================
    witnessName: "",
    witnessPhone: "",

    // ==========================================
    // LOSS BREAKDOWN
    // ==========================================
    buildingStructureCost: "",
    furnitureCost: "",
    electronicsCost: "",
    kitchenAppliancesCost: "",
    electricalWiringCost: "",
    paintingInteriorCost: "",
    plumbingCost: "",
    garageDamageCost: "",

    // ==========================================
    // BANK DETAILS
    // ==========================================
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: "",

    // ==========================================
    // DECLARATIONS
    // ==========================================
    damageDeclaration: false,
    documentVerificationAuthorization: false,
    aiVerificationAuthorization: false,
  });

  // ==========================================
  // SEND DATA TO PARENT
  // ==========================================

  useEffect(() => {
    if (onDataChange) {
      onDataChange(propertyData);
    }
  }, [propertyData, onDataChange]);

  // ==========================================
  // NORMAL INPUT HANDLER
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPropertyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // DECLARATION HANDLER
  // ==========================================

  const handleDeclarationChange = (e) => {
    const { name, checked } = e.target;

    setPropertyData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // ==========================================
  // DAMAGE CHECKLIST HANDLER
  // ==========================================

  const handleDamageChange = (damage) => {
    setPropertyData((prev) => {
      const currentDamages = prev.damageChecklist;

      if (currentDamages.includes(damage)) {
        return {
          ...prev,
          damageChecklist: currentDamages.filter(
            (item) => item !== damage
          ),
        };
      }

      return {
        ...prev,
        damageChecklist: [
          ...currentDamages,
          damage,
        ],
      };
    });
  };

  // ==========================================
  // DAMAGE OPTIONS
  // ==========================================

  const damageOptions = [
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
  ];

  // ==========================================
  // LOSS BREAKDOWN
  // ==========================================

  const lossFields = [
    {
      name: "buildingStructureCost",
      label: "Building Structure",
    },
    {
      name: "furnitureCost",
      label: "Furniture",
    },
    {
      name: "electronicsCost",
      label: "Electronics",
    },
    {
      name: "kitchenAppliancesCost",
      label: "Kitchen Appliances",
    },
    {
      name: "electricalWiringCost",
      label: "Electrical Wiring",
    },
    {
      name: "paintingInteriorCost",
      label: "Painting & Interior",
    },
    {
      name: "plumbingCost",
      label: "Plumbing",
    },
    {
      name: "garageDamageCost",
      label: "Garage Damage",
    },
  ];

  return (
    <div className="insuranceForm">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="formTitle propertyTitle">

        <FaHome className="titleIcon" />

        <div>
          <h2>
            Property Insurance Claim Form
          </h2>

          <p>
            Submit claims for fire, flood,
            burglary, earthquake, cyclone,
            water leakage and natural disasters.
          </p>
        </div>

      </div>

      {/* ==========================================
          PROPERTY OWNER INFORMATION
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaShieldAlt />
          Property Owner Information
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Owner Full Name *
            </label>

            <input
              name="ownerName"
              value={propertyData.ownerName}
              onChange={handleChange}
              placeholder="Enter owner name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Property Type *
            </label>

            <select
              name="propertyType"
              value={propertyData.propertyType}
              onChange={handleChange}
            >

              <option value="">
                Select Property
              </option>

              <option value="Independent House">
                Independent House
              </option>

              <option value="Apartment">
                Apartment
              </option>

              <option value="Commercial Building">
                Commercial Building
              </option>

              <option value="Office">
                Office
              </option>

              <option value="Shop">
                Shop
              </option>

              <option value="Warehouse">
                Warehouse
              </option>

            </select>

          </div>

          <div className="inputGroup">

            <label>
              Insurance Company *
            </label>

            <input
              name="insuranceCompany"
              value={propertyData.insuranceCompany}
              onChange={handleChange}
              placeholder="HDFC ERGO / ICICI Lombard"
            />

          </div>

          <div className="inputGroup">

            <label>
              Policy Number *
            </label>

            <input
              name="policyNumber"
              value={propertyData.policyNumber}
              onChange={handleChange}
              placeholder="PROP-INS-2026-1002"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          PROPERTY LOCATION
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaMapMarkerAlt />
          Property Location
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Property Address *
            </label>

            <input
              name="propertyAddress"
              value={propertyData.propertyAddress}
              onChange={handleChange}
              placeholder="Complete property address"
            />

          </div>

          <div className="inputGroup">

            <label>
              City *
            </label>

            <input
              name="city"
              value={propertyData.city}
              onChange={handleChange}
              placeholder="City"
            />

          </div>

          <div className="inputGroup">

            <label>
              State *
            </label>

            <input
              name="state"
              value={propertyData.state}
              onChange={handleChange}
              placeholder="State"
            />

          </div>

          <div className="inputGroup">

            <label>
              PIN Code *
            </label>

            <input
              type="text"
              name="pinCode"
              value={propertyData.pinCode}
              onChange={handleChange}
              placeholder="500001"
              maxLength="6"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          DAMAGE INFORMATION
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaFire />
          Damage Information
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Damage Date *
            </label>

            <input
              type="date"
              name="damageDate"
              value={propertyData.damageDate}
              onChange={handleChange}
            />

          </div>

          <div className="inputGroup">

            <label>
              Damage Time *
            </label>

            <input
              type="time"
              name="damageTime"
              value={propertyData.damageTime}
              onChange={handleChange}
            />

          </div>

          <div className="inputGroup">

            <label>
              Damage Type *
            </label>

            <select
              name="damageType"
              value={propertyData.damageType}
              onChange={handleChange}
            >

              <option value="">
                Select Damage Type
              </option>

              <option value="Fire Damage">
                Fire Damage
              </option>

              <option value="Flood Damage">
                Flood Damage
              </option>

              <option value="Earthquake">
                Earthquake
              </option>

              <option value="Cyclone">
                Cyclone
              </option>

              <option value="Lightning">
                Lightning
              </option>

              <option value="Burglary">
                Burglary
              </option>

              <option value="Water Leakage">
                Water Leakage
              </option>

              <option value="Building Collapse">
                Building Collapse
              </option>

            </select>

          </div>

          <div className="inputGroup">

            <label>
              Estimated Property Loss (₹)
            </label>

            <input
              type="number"
              name="estimatedLoss"
              value={propertyData.estimatedLoss}
              onChange={handleChange}
              placeholder="₹ 0"
              min="0"
            />

          </div>

        </div>

        <div className="inputGroup">

          <label>
            Describe Property Damage *
          </label>

          <textarea
            rows="5"
            name="description"
            value={propertyData.description}
            onChange={handleChange}
            placeholder="Explain the damage caused to the property..."
          />

        </div>

      </div>

      {/* ==========================================
          DAMAGE CHECKLIST
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaBolt />
          Property Damage Checklist
        </h3>

        <div className="checkboxGrid">

          {damageOptions.map((item) => (

            <label key={item}>

              <input
                type="checkbox"
                checked={propertyData.damageChecklist.includes(
                  item
                )}
                onChange={() =>
                  handleDamageChange(item)
                }
              />

              {item}

            </label>

          ))}

        </div>

      </div>

      {/* ==========================================
          POLICE COMPLAINT
      ========================================== */}

      <div className="formSection">

        <h3>
          Police Complaint Details
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Police Complaint Filed?
            </label>

            <select
              name="policeComplaint"
              value={propertyData.policeComplaint}
              onChange={handleChange}
            >

              <option value="">
                Select
              </option>

              <option value="Yes">
                Yes
              </option>

              <option value="No">
                No
              </option>

            </select>

          </div>

          <div className="inputGroup">

            <label>
              Complaint Number
            </label>

            <input
              name="complaintNumber"
              value={propertyData.complaintNumber}
              onChange={handleChange}
              placeholder="Complaint Number"
            />

          </div>

          <div className="inputGroup">

            <label>
              Police Station
            </label>

            <input
              name="policeStation"
              value={propertyData.policeStation}
              onChange={handleChange}
              placeholder="Police Station Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Complaint Date
            </label>

            <input
              type="date"
              name="complaintDate"
              value={propertyData.complaintDate}
              onChange={handleChange}
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          WITNESS DETAILS
      ========================================== */}

      <div className="formSection">

        <h3>
          Witness Details
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Witness Name
            </label>

            <input
              name="witnessName"
              value={propertyData.witnessName}
              onChange={handleChange}
              placeholder="Witness Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Witness Phone
            </label>

            <input
              type="tel"
              name="witnessPhone"
              value={propertyData.witnessPhone}
              onChange={handleChange}
              placeholder="Witness Phone"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          LOSS BREAKDOWN
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaMoneyBillWave />
          Estimated Loss Breakdown
        </h3>

        <div className="grid2">

          {lossFields.map((field) => (

            <div
              className="inputGroup"
              key={field.name}
            >

              <label>
                {field.label} Cost (₹)
              </label>

              <input
                type="number"
                name={field.name}
                value={propertyData[field.name]}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />

            </div>

          ))}

        </div>

      </div>

      {/* ==========================================
          SUPPORTING DOCUMENTS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaFileUpload />
          Upload Supporting Documents
        </h3>

        <div className="uploadGrid">

          {[
            "Insurance Policy PDF",
            "Property Ownership Proof",
            "Police Complaint Copy",
            "Repair Estimate PDF",
            "Electricity Bill",
            "Property Tax Receipt",
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
          PROPERTY DAMAGE PHOTOS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaCamera />
          Upload Property Damage Photos
        </h3>

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

            <div
              className="uploadItem"
              key={photo}
            >

              <label>
                {photo}
              </label>

              <input
                type="file"
                accept="image/*"
              />

            </div>

          ))}

        </div>

      </div>

      {/* ==========================================
          BANK DETAILS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaMoneyBillWave />
          Bank Details for Claim Settlement
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Bank Name
            </label>

            <input
              name="bankName"
              value={propertyData.bankName}
              onChange={handleChange}
              placeholder="Bank Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Account Number
            </label>

            <input
              name="accountNumber"
              value={propertyData.accountNumber}
              onChange={handleChange}
              placeholder="Account Number"
            />

          </div>

          <div className="inputGroup">

            <label>
              IFSC Code
            </label>

            <input
              name="ifsc"
              value={propertyData.ifsc}
              onChange={handleChange}
              placeholder="IFSC Code"
            />

          </div>

          <div className="inputGroup">

            <label>
              UPI ID (Optional)
            </label>

            <input
              name="upiId"
              value={propertyData.upiId}
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
            name="damageDeclaration"
            checked={
              propertyData.damageDeclaration
            }
            onChange={handleDeclarationChange}
          />

          I declare that the above property
          damage details are true.

        </label>

        <label className="checkboxDeclaration">

          <input
            type="checkbox"
            name="documentVerificationAuthorization"
            checked={
              propertyData.documentVerificationAuthorization
            }
            onChange={handleDeclarationChange}
          />

          I authorize Forma AI to verify my
          uploaded documents.

        </label>

        <label className="checkboxDeclaration">

          <input
            type="checkbox"
            name="aiVerificationAuthorization"
            checked={
              propertyData.aiVerificationAuthorization
            }
            onChange={handleDeclarationChange}
          />

          I agree to AI OCR and document
          verification.

        </label>

      </div>

      {/* ==========================================
          BACKEND SYNC STATUS
      ========================================== */}

      <div className="formInfoMessage">

        <FaCheckCircle />

        <span>
          Property claim information is automatically
          synchronized with the Forma AI claim form.
        </span>

      </div>

    </div>
  );
};

export default PropertyInsuranceForm;