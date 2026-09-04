import React, { useState } from "react";
import {
  FaCarCrash,
  FaCar,
  FaUserAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShieldAlt,
  FaTools,
  FaFileUpload,
  FaCamera,
  FaCheckCircle,
} from "react-icons/fa";

const VehicleInsuranceForm = () => {
  const [data, setData] = useState({
    vehicleNumber: "",
    vehicleModel: "",
    manufacturer: "",
    vehicleType: "",
    manufactureYear: "",
    color: "",
    engineNumber: "",
    chassisNumber: "",

    driverName: "",
    driverPhone: "",
    licenseNumber: "",
    driverAge: "",

    accidentDate: "",
    accidentTime: "",
    accidentLocation: "",
    city: "",
    state: "",
    accidentType: "",
    weather: "",

    policeStation: "",
    firNumber: "",

    thirdParty: "",
    witnessName: "",
    witnessPhone: "",

    repairEstimate: "",
    towingRequired: "",
    workshop: "",

    description: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="insuranceForm">

      {/* ---------- HEADER ---------- */}

      <div className="formTitle vehicleTitle">
        <FaCarCrash className="titleIcon" />

        <div>
          <h2>Vehicle Accident Insurance Claim</h2>

          <p>
            Claim for Car, Bike, Collision, Theft, Fire, Flood and
            Natural Disaster damages.
          </p>
        </div>
      </div>

      {/* ---------- VEHICLE DETAILS ---------- */}

      <div className="formSection">

        <h3><FaCar/> Vehicle Information</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Vehicle Registration Number *</label>

            <input
              name="vehicleNumber"
              value={data.vehicleNumber}
              onChange={handleChange}
              placeholder="TS09AB1234"
            />
          </div>

          <div className="inputGroup">
            <label>Vehicle Model *</label>

            <input
              name="vehicleModel"
              value={data.vehicleModel}
              onChange={handleChange}
              placeholder="Honda City 2025"
            />
          </div>

          <div className="inputGroup">
            <label>Manufacturer</label>

            <input
              name="manufacturer"
              value={data.manufacturer}
              onChange={handleChange}
              placeholder="Honda / Tata / Hyundai"
            />
          </div>

          <div className="inputGroup">
            <label>Vehicle Type</label>

            <select
              name="vehicleType"
              value={data.vehicleType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Car</option>
              <option>Bike</option>
              <option>SUV</option>
              <option>Truck</option>
              <option>Bus</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Manufacturing Year</label>

            <input
              name="manufactureYear"
              value={data.manufactureYear}
              onChange={handleChange}
              placeholder="2025"
            />
          </div>

          <div className="inputGroup">
            <label>Vehicle Color</label>

            <input
              name="color"
              value={data.color}
              onChange={handleChange}
              placeholder="White"
            />
          </div>

          <div className="inputGroup">
            <label>Engine Number</label>

            <input
              name="engineNumber"
              value={data.engineNumber}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Chassis Number</label>

            <input
              name="chassisNumber"
              value={data.chassisNumber}
              onChange={handleChange}
            />
          </div>

        </div>

      </div>

      {/* ---------- DRIVER DETAILS ---------- */}

      <div className="formSection">

        <h3><FaUserAlt/> Driver Information</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Driver Full Name *</label>

            <input
              name="driverName"
              value={data.driverName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Driver Phone</label>

            <input
              name="driverPhone"
              value={data.driverPhone}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Driving License Number *</label>

            <input
              name="licenseNumber"
              value={data.licenseNumber}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Driver Age</label>

            <input
              type="number"
              name="driverAge"
              value={data.driverAge}
              onChange={handleChange}
            />
          </div>

        </div>

      </div>

      {/* ---------- ACCIDENT DETAILS ---------- */}

      <div className="formSection">

        <h3><FaCalendarAlt/> Accident Information</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Accident Date *</label>

            <input
              type="date"
              name="accidentDate"
              value={data.accidentDate}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Accident Time *</label>

            <input
              type="time"
              name="accidentTime"
              value={data.accidentTime}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Accident Location *</label>

            <input
              name="accidentLocation"
              value={data.accidentLocation}
              onChange={handleChange}
              placeholder="Hyderabad ORR Exit 14"
            />
          </div>

          <div className="inputGroup">
            <label>City</label>

            <input
              name="city"
              value={data.city}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>State</label>

            <input
              name="state"
              value={data.state}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Weather Conditions</label>

            <select
              name="weather"
              value={data.weather}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Sunny</option>
              <option>Rainy</option>
              <option>Fog</option>
              <option>Storm</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Accident Type *</label>

            <select
              name="accidentType"
              value={data.accidentType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Collision</option>
              <option>Animal Collision</option>
              <option>Theft</option>
              <option>Fire Damage</option>
              <option>Flood Damage</option>
              <option>Glass Damage</option>
              <option>Hit and Run</option>
            </select>
          </div>

        </div>

        <div className="inputGroup">
          <label>Accident Description *</label>

          <textarea
            rows="5"
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Describe what happened during the accident."
          />
        </div>

      </div>

      {/* ---------- DAMAGE CHECKLIST ---------- */}

      <div className="formSection">

        <h3><FaTools/> Vehicle Damage Checklist</h3>

        <div className="checkboxGrid">
          {[
            "Windshield Broken",
            "Front Bumper",
            "Rear Bumper",
            "Bonnet",
            "Roof",
            "Left Door",
            "Right Door",
            "Headlights",
            "Tail Lights",
            "Tyres",
            "Side Mirrors",
            "Engine Damage",
            "Battery Damage",
            "Airbags Deployed",
            "Suspension Damage",
            "Steering Damage",
            "Dashboard Damage",
            "Front Glass",
            "Rear Glass",
            "Side Glass",
          ].map((damage) => (
            <label key={damage}>
              <input type="checkbox" />
              {damage}
            </label>
          ))}
        </div>

      </div>

      {/* ---------- POLICE DETAILS ---------- */}

      <div className="formSection">

        <h3><FaShieldAlt/> FIR & Police Details</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Police Station</label>

            <input
              name="policeStation"
              value={data.policeStation}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>FIR Number</label>

            <input
              name="firNumber"
              value={data.firNumber}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Was FIR Filed?</label>

            <select>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Police Report Available?</label>

            <select>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

        </div>

      </div>

      {/* ---------- THIRD PARTY ---------- */}

      <div className="formSection">

        <h3>Third Party Information</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Was Another Vehicle Involved?</label>

            <select
              name="thirdParty"
              value={data.thirdParty}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Third Party Vehicle Number</label>

            <input placeholder="TS10AB0000" />
          </div>

          <div className="inputGroup">
            <label>Third Party Driver Name</label>

            <input placeholder="Driver Name" />
          </div>

          <div className="inputGroup">
            <label>Third Party Insurance Company</label>

            <input placeholder="Insurance Provider" />
          </div>

        </div>

      </div>

      {/* ---------- WITNESS ---------- */}

      <div className="formSection">

        <h3>Witness Details</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Witness Name</label>

            <input
              name="witnessName"
              value={data.witnessName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Witness Phone</label>

            <input
              name="witnessPhone"
              value={data.witnessPhone}
              onChange={handleChange}
            />
          </div>

        </div>

      </div>

      {/* ---------- REPAIR ---------- */}

      <div className="formSection">

        <h3>Repair Estimate</h3>

        <div className="grid2">

          <div className="inputGroup">
            <label>Estimated Repair Cost (₹)</label>

            <input
              type="number"
              name="repairEstimate"
              value={data.repairEstimate}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Towing Required?</label>

            <select
              name="towingRequired"
              value={data.towingRequired}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Preferred Workshop / Garage</label>

            <input
              name="workshop"
              value={data.workshop}
              onChange={handleChange}
            />
          </div>

        </div>

      </div>

      {/* ---------- DOCUMENTS ---------- */}

      <div className="formSection">

        <h3><FaFileUpload/> Upload Documents</h3>

        <div className="uploadGrid">

          <div className="uploadItem">
            <label>Driving License</label>
            <input type="file" />
          </div>

          <div className="uploadItem">
            <label>Vehicle RC</label>
            <input type="file" />
          </div>

          <div className="uploadItem">
            <label>Insurance Policy PDF</label>
            <input type="file" accept=".pdf" />
          </div>

          <div className="uploadItem">
            <label>FIR Copy</label>
            <input type="file" />
          </div>

          <div className="uploadItem">
            <label>Repair Estimate PDF</label>
            <input type="file" accept=".pdf" />
          </div>

          <div className="uploadItem">
            <label>Police Report</label>
            <input type="file" />
          </div>

        </div>

      </div>

      {/* ---------- PHOTOS ---------- */}

      <div className="formSection">

        <h3><FaCamera/> Accident Photo Upload</h3>

        <div className="uploadGrid">

          <div className="uploadItem">
            <label>Front Damage</label>
            <input type="file" accept="image/*" />
          </div>

          <div className="uploadItem">
            <label>Rear Damage</label>
            <input type="file" accept="image/*" />
          </div>

          <div className="uploadItem">
            <label>Left Side Damage</label>
            <input type="file" accept="image/*" />
          </div>

          <div className="uploadItem">
            <label>Right Side Damage</label>
            <input type="file" accept="image/*" />
          </div>

          <div className="uploadItem">
            <label>Windshield Damage</label>
            <input type="file" accept="image/*" />
          </div>

          <div className="uploadItem">
            <label>Accident Scene Photos</label>
            <input type="file" accept="image/*" multiple />
          </div>

        </div>

      </div>

      {/* ---------- GPS LOCATION ---------- */}

      <div className="formSection">

        <h3><FaMapMarkerAlt/> GPS Accident Location</h3>

        <div className="gpsCard">

          <p>
            📍 AI can automatically detect accident location from uploaded
            photos (future backend integration).
          </p>

          <button className="gpsBtn">
            Detect Current Location
          </button>

        </div>

      </div>

      {/* ---------- DECLARATION ---------- */}

      <div className="formSection">

        <h3><FaCheckCircle/> Declaration</h3>

        <label className="checkboxDeclaration">
          <input type="checkbox" />
          I declare that the above accident details are true.
        </label>

        <label className="checkboxDeclaration">
          <input type="checkbox" />
          I authorize Forma AI to verify FIR, RC and Insurance Policy.
        </label>

        <label className="checkboxDeclaration">
          <input type="checkbox" />
          I agree to AI document verification and OCR processing.
        </label>

      </div>

      {/* ---------- BUTTONS ---------- */}

      <div className="formButtons">

        <button className="draftBtn">
          Save Draft
        </button>

        <button className="submitBtn">
          Submit Vehicle Claim
        </button>

      </div>

    </div>
  );
};

export default VehicleInsuranceForm;