import React, { useEffect, useState } from "react";

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

const VehicleInsuranceForm = ({ onDataChange }) => {
  const [data, setData] = useState({
    // ==============================
    // VEHICLE DETAILS
    // ==============================
    vehicleNumber: "",
    vehicleModel: "",
    manufacturer: "",
    vehicleType: "",
    manufactureYear: "",
    color: "",
    engineNumber: "",
    chassisNumber: "",

    // ==============================
    // DRIVER DETAILS
    // ==============================
    driverName: "",
    driverPhone: "",
    licenseNumber: "",
    driverAge: "",

    // ==============================
    // ACCIDENT DETAILS
    // ==============================
    accidentDate: "",
    accidentTime: "",
    accidentLocation: "",
    city: "",
    state: "",
    accidentType: "",
    weather: "",
    description: "",

    // ==============================
    // DAMAGE DETAILS
    // ==============================
    damageChecklist: [],

    // ==============================
    // POLICE DETAILS
    // ==============================
    policeStation: "",
    firNumber: "",
    firFiled: "",
    policeReportAvailable: "",

    // ==============================
    // THIRD PARTY DETAILS
    // ==============================
    thirdParty: "",
    thirdPartyVehicleNumber: "",
    thirdPartyDriverName: "",
    thirdPartyInsuranceCompany: "",

    // ==============================
    // WITNESS DETAILS
    // ==============================
    witnessName: "",
    witnessPhone: "",

    // ==============================
    // REPAIR DETAILS
    // ==============================
    repairEstimate: "",
    towingRequired: "",
    workshop: "",

    // ==============================
    // DECLARATIONS
    // ==============================
    accidentDeclaration: false,
    verificationAuthorization: false,
    aiVerificationAuthorization: false,
  });

  // ==========================================
  // SEND DATA TO PARENT
  // ==========================================

  useEffect(() => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [data, onDataChange]);

  // ==========================================
  // NORMAL INPUT HANDLER
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CHECKBOX HANDLER
  // ==========================================

  const handleDeclarationChange = (e) => {
    const { name, checked } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // ==========================================
  // DAMAGE CHECKLIST
  // ==========================================

  const handleDamageChange = (damage) => {
    setData((prev) => {
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
  ];

  return (
    <div className="insuranceForm">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="formTitle vehicleTitle">

        <FaCarCrash className="titleIcon" />

        <div>
          <h2>
            Vehicle Accident Insurance Claim
          </h2>

          <p>
            Claim for Car, Bike, Collision, Theft,
            Fire, Flood and Natural Disaster damages.
          </p>
        </div>

      </div>

      {/* ==========================================
          VEHICLE INFORMATION
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaCar />
          Vehicle Information
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Vehicle Registration Number *
            </label>

            <input
              name="vehicleNumber"
              value={data.vehicleNumber}
              onChange={handleChange}
              placeholder="TS09AB1234"
            />

          </div>

          <div className="inputGroup">

            <label>
              Vehicle Model *
            </label>

            <input
              name="vehicleModel"
              value={data.vehicleModel}
              onChange={handleChange}
              placeholder="Honda City 2025"
            />

          </div>

          <div className="inputGroup">

            <label>
              Manufacturer
            </label>

            <input
              name="manufacturer"
              value={data.manufacturer}
              onChange={handleChange}
              placeholder="Honda / Tata / Hyundai"
            />

          </div>

          <div className="inputGroup">

            <label>
              Vehicle Type
            </label>

            <select
              name="vehicleType"
              value={data.vehicleType}
              onChange={handleChange}
            >

              <option value="">
                Select
              </option>

              <option value="Car">
                Car
              </option>

              <option value="Bike">
                Bike
              </option>

              <option value="SUV">
                SUV
              </option>

              <option value="Truck">
                Truck
              </option>

              <option value="Bus">
                Bus
              </option>

            </select>

          </div>

          <div className="inputGroup">

            <label>
              Manufacturing Year
            </label>

            <input
              type="number"
              name="manufactureYear"
              value={data.manufactureYear}
              onChange={handleChange}
              placeholder="2025"
            />

          </div>

          <div className="inputGroup">

            <label>
              Vehicle Color
            </label>

            <input
              name="color"
              value={data.color}
              onChange={handleChange}
              placeholder="White"
            />

          </div>

          <div className="inputGroup">

            <label>
              Engine Number
            </label>

            <input
              name="engineNumber"
              value={data.engineNumber}
              onChange={handleChange}
            />

          </div>

          <div className="inputGroup">

            <label>
              Chassis Number
            </label>

            <input
              name="chassisNumber"
              value={data.chassisNumber}
              onChange={handleChange}
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          DRIVER INFORMATION
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaUserAlt />
          Driver Information
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Driver Full Name *
            </label>

            <input
              name="driverName"
              value={data.driverName}
              onChange={handleChange}
              placeholder="Driver Full Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Driver Phone
            </label>

            <input
              type="tel"
              name="driverPhone"
              value={data.driverPhone}
              onChange={handleChange}
              placeholder="Phone Number"
            />

          </div>

          <div className="inputGroup">

            <label>
              Driving License Number *
            </label>

            <input
              name="licenseNumber"
              value={data.licenseNumber}
              onChange={handleChange}
              placeholder="Driving License Number"
            />

          </div>

          <div className="inputGroup">

            <label>
              Driver Age
            </label>

            <input
              type="number"
              name="driverAge"
              value={data.driverAge}
              onChange={handleChange}
              placeholder="Age"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          ACCIDENT INFORMATION
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaCalendarAlt />
          Accident Information
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Accident Date *
            </label>

            <input
              type="date"
              name="accidentDate"
              value={data.accidentDate}
              onChange={handleChange}
            />

          </div>

          <div className="inputGroup">

            <label>
              Accident Time *
            </label>

            <input
              type="time"
              name="accidentTime"
              value={data.accidentTime}
              onChange={handleChange}
            />

          </div>

          <div className="inputGroup">

            <label>
              Accident Location *
            </label>

            <input
              name="accidentLocation"
              value={data.accidentLocation}
              onChange={handleChange}
              placeholder="Hyderabad ORR Exit 14"
            />

          </div>

          <div className="inputGroup">

            <label>
              City
            </label>

            <input
              name="city"
              value={data.city}
              onChange={handleChange}
              placeholder="Hyderabad"
            />

          </div>

          <div className="inputGroup">

            <label>
              State
            </label>

            <input
              name="state"
              value={data.state}
              onChange={handleChange}
              placeholder="Telangana"
            />

          </div>

          <div className="inputGroup">

            <label>
              Weather Conditions
            </label>

            <select
              name="weather"
              value={data.weather}
              onChange={handleChange}
            >

              <option value="">
                Select
              </option>

              <option value="Sunny">
                Sunny
              </option>

              <option value="Rainy">
                Rainy
              </option>

              <option value="Fog">
                Fog
              </option>

              <option value="Storm">
                Storm
              </option>

            </select>

          </div>

          <div className="inputGroup">

            <label>
              Accident Type *
            </label>

            <select
              name="accidentType"
              value={data.accidentType}
              onChange={handleChange}
            >

              <option value="">
                Select
              </option>

              <option value="Collision">
                Collision
              </option>

              <option value="Animal Collision">
                Animal Collision
              </option>

              <option value="Theft">
                Theft
              </option>

              <option value="Fire Damage">
                Fire Damage
              </option>

              <option value="Flood Damage">
                Flood Damage
              </option>

              <option value="Glass Damage">
                Glass Damage
              </option>

              <option value="Hit and Run">
                Hit and Run
              </option>

            </select>

          </div>

        </div>

        <div className="inputGroup">

          <label>
            Accident Description *
          </label>

          <textarea
            rows="5"
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Describe what happened during the accident."
          />

        </div>

      </div>

      {/* ==========================================
          DAMAGE CHECKLIST
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaTools />
          Vehicle Damage Checklist
        </h3>

        <div className="checkboxGrid">

          {damageOptions.map((damage) => (

            <label key={damage}>

              <input
                type="checkbox"
                checked={data.damageChecklist.includes(
                  damage
                )}
                onChange={() =>
                  handleDamageChange(damage)
                }
              />

              {damage}

            </label>

          ))}

        </div>

      </div>

      {/* ==========================================
          FIR & POLICE DETAILS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaShieldAlt />
          FIR & Police Details
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Police Station
            </label>

            <input
              name="policeStation"
              value={data.policeStation}
              onChange={handleChange}
              placeholder="Police Station"
            />

          </div>

          <div className="inputGroup">

            <label>
              FIR Number
            </label>

            <input
              name="firNumber"
              value={data.firNumber}
              onChange={handleChange}
              placeholder="FIR Number"
            />

          </div>

          <div className="inputGroup">

            <label>
              Was FIR Filed?
            </label>

            <select
              name="firFiled"
              value={data.firFiled}
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
              Police Report Available?
            </label>

            <select
              name="policeReportAvailable"
              value={data.policeReportAvailable}
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

        </div>

      </div>

      {/* ==========================================
          THIRD PARTY INFORMATION
      ========================================== */}

      <div className="formSection">

        <h3>
          Third Party Information
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Was Another Vehicle Involved?
            </label>

            <select
              name="thirdParty"
              value={data.thirdParty}
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
              Third Party Vehicle Number
            </label>

            <input
              name="thirdPartyVehicleNumber"
              value={
                data.thirdPartyVehicleNumber
              }
              onChange={handleChange}
              placeholder="TS10AB0000"
            />

          </div>

          <div className="inputGroup">

            <label>
              Third Party Driver Name
            </label>

            <input
              name="thirdPartyDriverName"
              value={
                data.thirdPartyDriverName
              }
              onChange={handleChange}
              placeholder="Driver Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Third Party Insurance Company
            </label>

            <input
              name="thirdPartyInsuranceCompany"
              value={
                data.thirdPartyInsuranceCompany
              }
              onChange={handleChange}
              placeholder="Insurance Provider"
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
              value={data.witnessName}
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
              value={data.witnessPhone}
              onChange={handleChange}
              placeholder="Witness Phone"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          REPAIR ESTIMATE
      ========================================== */}

      <div className="formSection">

        <h3>
          Repair Estimate
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Estimated Repair Cost (₹)
            </label>

            <input
              type="number"
              name="repairEstimate"
              value={data.repairEstimate}
              onChange={handleChange}
              placeholder="₹ 50000"
            />

          </div>

          <div className="inputGroup">

            <label>
              Towing Required?
            </label>

            <select
              name="towingRequired"
              value={data.towingRequired}
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
              Preferred Workshop / Garage
            </label>

            <input
              name="workshop"
              value={data.workshop}
              onChange={handleChange}
              placeholder="Workshop / Garage"
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
          Upload Documents
        </h3>

        <div className="uploadGrid">

          <div className="uploadItem">

            <label>
              Driving License
            </label>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
            />

          </div>

          <div className="uploadItem">

            <label>
              Vehicle RC
            </label>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
            />

          </div>

          <div className="uploadItem">

            <label>
              Insurance Policy PDF
            </label>

            <input
              type="file"
              accept=".pdf"
            />

          </div>

          <div className="uploadItem">

            <label>
              FIR Copy
            </label>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
            />

          </div>

          <div className="uploadItem">

            <label>
              Repair Estimate PDF
            </label>

            <input
              type="file"
              accept=".pdf"
            />

          </div>

          <div className="uploadItem">

            <label>
              Police Report
            </label>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
            />

          </div>

        </div>

        <p className="uploadHint">
          Supported formats: PDF, JPG, JPEG and PNG.
        </p>

      </div>

      {/* ==========================================
          ACCIDENT PHOTOS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaCamera />
          Accident Photo Upload
        </h3>

        <div className="uploadGrid">

          <div className="uploadItem">

            <label>
              Front Damage
            </label>

            <input
              type="file"
              accept="image/*"
            />

          </div>

          <div className="uploadItem">

            <label>
              Rear Damage
            </label>

            <input
              type="file"
              accept="image/*"
            />

          </div>

          <div className="uploadItem">

            <label>
              Left Side Damage
            </label>

            <input
              type="file"
              accept="image/*"
            />

          </div>

          <div className="uploadItem">

            <label>
              Right Side Damage
            </label>

            <input
              type="file"
              accept="image/*"
            />

          </div>

          <div className="uploadItem">

            <label>
              Windshield Damage
            </label>

            <input
              type="file"
              accept="image/*"
            />

          </div>

          <div className="uploadItem">

            <label>
              Accident Scene Photos
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          GPS LOCATION
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaMapMarkerAlt />
          GPS Accident Location
        </h3>

        <div className="gpsCard">

          <p>
            📍 GPS location can be captured
            during claim submission.
          </p>

          <button
            type="button"
            className="gpsBtn"
            onClick={() => {
              if (!navigator.geolocation) {
                alert(
                  "Geolocation is not supported by this browser."
                );
                return;
              }

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const latitude =
                    position.coords.latitude;

                  const longitude =
                    position.coords.longitude;

                  setData((prev) => ({
                    ...prev,
                    gpsLocation: {
                      latitude,
                      longitude,
                    },
                  }));

                  alert(
                    `Location captured:\nLatitude: ${latitude}\nLongitude: ${longitude}`
                  );
                },
                () => {
                  alert(
                    "Unable to access your current location."
                  );
                }
              );
            }}
          >
            Detect Current Location
          </button>

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
            name="accidentDeclaration"
            checked={
              data.accidentDeclaration
            }
            onChange={handleDeclarationChange}
          />

          I declare that the above accident
          details are true.

        </label>

        <label className="checkboxDeclaration">

          <input
            type="checkbox"
            name="verificationAuthorization"
            checked={
              data.verificationAuthorization
            }
            onChange={handleDeclarationChange}
          />

          I authorize Forma AI to verify FIR,
          RC and Insurance Policy.

        </label>

        <label className="checkboxDeclaration">

          <input
            type="checkbox"
            name="aiVerificationAuthorization"
            checked={
              data.aiVerificationAuthorization
            }
            onChange={handleDeclarationChange}
          />

          I agree to AI document verification
          and OCR processing.

        </label>

      </div>

      {/* ==========================================
          BACKEND SYNC MESSAGE
      ========================================== */}

      <div className="formInfoMessage">

        <FaCheckCircle />

        <span>
          Vehicle claim information is automatically
          synchronized with the Forma AI claim form.
        </span>

      </div>

    </div>
  );
};

export default VehicleInsuranceForm;