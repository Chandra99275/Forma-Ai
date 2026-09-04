import React, { useState } from "react";
import {
  FaPlaneDeparture,
  FaPassport,
  FaSuitcaseRolling,
  FaHotel,
  FaHospital,
  FaMapMarkerAlt,
  FaFileUpload,
  FaCamera,
  FaMoneyBillWave,
  FaCheckCircle,
  FaGlobeAsia,
} from "react-icons/fa";

const TravelInsuranceForm = () => {
  const [travelData, setTravelData] = useState({
    travelerName: "",
    passportNumber: "",
    policyNumber: "",
    insuranceCompany: "",
    destination: "",
    departureCity: "",
    departureDate: "",
    returnDate: "",
    airline: "",
    flightNumber: "",
    bookingReference: "",
    claimType: "",
    incidentDate: "",
    incidentLocation: "",
    hotelName: "",
    emergencyDescription: "",
    estimatedLoss: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });

  const handleChange = (e) => {
    setTravelData({
      ...travelData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="insuranceForm">

      {/* ===== Header ===== */}
      <div className="formTitle travelTitle">
        <FaPlaneDeparture className="titleIcon" />
        <div>
          <h2>Travel Insurance Claim Form</h2>
          <p>
            Claim for Flight Delay, Baggage Loss, Passport Loss, Medical Emergency,
            Trip Cancellation, Hotel Expenses and Visa Issues.
          </p>
        </div>
      </div>

      {/* ===== Traveler Information ===== */}
      <div className="formSection">
        <h3><FaGlobeAsia /> Traveler Information</h3>

        <div className="grid2">
          <div className="inputGroup">
            <label>Traveler Full Name *</label>
            <input
              name="travelerName"
              value={travelData.travelerName}
              onChange={handleChange}
              placeholder="Enter Traveler Name"
            />
          </div>

          <div className="inputGroup">
            <label>Passport Number *</label>
            <input
              name="passportNumber"
              value={travelData.passportNumber}
              onChange={handleChange}
              placeholder="Passport Number"
            />
          </div>

          <div className="inputGroup">
            <label>Nationality</label>
            <input placeholder="Indian" />
          </div>

          <div className="inputGroup">
            <label>Date of Birth</label>
            <input type="date" />
          </div>

          <div className="inputGroup">
            <label>Mobile Number</label>
            <input placeholder="+91 9876543210" />
          </div>

          <div className="inputGroup">
            <label>Email Address</label>
            <input type="email" placeholder="example@email.com" />
          </div>
        </div>
      </div>

      {/* ===== Insurance Details ===== */}
      <div className="formSection">
        <h3><FaPassport /> Insurance Details</h3>

        <div className="grid2">
          <div className="inputGroup">
            <label>Insurance Company *</label>
            <input
              name="insuranceCompany"
              value={travelData.insuranceCompany}
              onChange={handleChange}
              placeholder="ACKO / Tata AIG / ICICI Lombard"
            />
          </div>

          <div className="inputGroup">
            <label>Policy Number *</label>
            <input
              name="policyNumber"
              value={travelData.policyNumber}
              onChange={handleChange}
              placeholder="TRAVEL-INS-2026-001"
            />
          </div>

          <div className="inputGroup">
            <label>Policy Start Date</label>
            <input type="date" />
          </div>

          <div className="inputGroup">
            <label>Policy End Date</label>
            <input type="date" />
          </div>
        </div>
      </div>

      {/* ===== Travel Information ===== */}
      <div className="formSection">
        <h3><FaPlaneDeparture /> Journey Details</h3>

        <div className="grid2">
          <div className="inputGroup">
            <label>Departure City *</label>
            <input
              name="departureCity"
              value={travelData.departureCity}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Destination Country *</label>
            <input
              name="destination"
              value={travelData.destination}
              onChange={handleChange}
              placeholder="Singapore"
            />
          </div>

          <div className="inputGroup">
            <label>Departure Date *</label>
            <input
              type="date"
              name="departureDate"
              value={travelData.departureDate}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Return Date *</label>
            <input
              type="date"
              name="returnDate"
              value={travelData.returnDate}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Airline Name *</label>
            <input
              name="airline"
              value={travelData.airline}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Flight Number *</label>
            <input
              name="flightNumber"
              value={travelData.flightNumber}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Booking Reference / PNR</label>
            <input
              name="bookingReference"
              value={travelData.bookingReference}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* ===== Claim Type ===== */}
      <div className="formSection">
        <h3><FaSuitcaseRolling /> Claim Information</h3>

        <div className="grid2">
          <div className="inputGroup">
            <label>Claim Type *</label>
            <select
              name="claimType"
              value={travelData.claimType}
              onChange={handleChange}
            >
              <option value="">Select Claim Type</option>
              <option>Flight Delay</option>
              <option>Baggage Loss</option>
              <option>Baggage Damage</option>
              <option>Passport Loss</option>
              <option>Trip Cancellation</option>
              <option>Trip Curtailment</option>
              <option>Medical Emergency</option>
              <option>Personal Accident</option>
              <option>Visa Rejection</option>
              <option>Hotel Expense</option>
            </select>
          </div>

          <div className="inputGroup">
            <label>Incident Date *</label>
            <input
              type="date"
              name="incidentDate"
              value={travelData.incidentDate}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Incident Location *</label>
            <input
              name="incidentLocation"
              value={travelData.incidentLocation}
              onChange={handleChange}
              placeholder="Singapore Airport"
            />
          </div>

          <div className="inputGroup">
            <label>Estimated Claim Amount</label>
            <input
              type="number"
              name="estimatedLoss"
              value={travelData.estimatedLoss}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="inputGroup">
          <label>Describe the Incident *</label>
          <textarea
            rows="5"
            name="emergencyDescription"
            value={travelData.emergencyDescription}
            onChange={handleChange}
            placeholder="Explain what happened during your travel..."
          />
        </div>
      </div>

      {/* ===== Medical Emergency ===== */}
      <div className="formSection">
        <h3><FaHospital /> Medical Emergency Details</h3>

        <div className="grid2">
          <div className="inputGroup">
            <label>Hospital Name</label>
            <input placeholder="Hospital Name" />
          </div>

          <div className="inputGroup">
            <label>Hospital Country</label>
            <input placeholder="Country" />
          </div>

          <div className="inputGroup">
            <label>Doctor Name</label>
            <input placeholder="Doctor Name" />
          </div>

          <div className="inputGroup">
            <label>Treatment Cost (₹)</label>
            <input type="number" placeholder="Amount" />
          </div>
        </div>
      </div>

      {/* ===== Hotel Expenses ===== */}
      <div className="formSection">
        <h3><FaHotel /> Hotel / Accommodation Expenses</h3>

        <div className="grid2">
          <div className="inputGroup">
            <label>Hotel Name</label>
            <input
              name="hotelName"
              value={travelData.hotelName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Hotel Booking Number</label>
            <input placeholder="Booking Number" />
          </div>

          <div className="inputGroup">
            <label>Total Hotel Cost</label>
            <input type="number" placeholder="₹" />
          </div>

          <div className="inputGroup">
            <label>Additional Expenses</label>
            <input type="number" placeholder="₹" />
          </div>
        </div>
      </div>

      {/* ===== Expense Breakdown ===== */}
      <div className="formSection">
        <h3><FaMoneyBillWave /> Expense Breakdown</h3>

        <div className="grid2">
          {[
            "Flight Ticket Cost",
            "Hotel Charges",
            "Medical Expenses",
            "Food Expenses",
            "Transport Expenses",
            "Passport Renewal Cost",
            "Emergency Purchases",
            "Lost Baggage Value",
          ].map((expense) => (
            <div className="inputGroup" key={expense}>
              <label>{expense}</label>
              <input type="number" placeholder="₹" />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Upload Documents ===== */}
      <div className="formSection">
        <h3><FaFileUpload /> Upload Travel Documents</h3>

        <div className="uploadGrid">
          {[
            "Passport Copy",
            "Visa Copy",
            "Boarding Pass",
            "Flight Ticket PDF",
            "Baggage Claim Receipt",
            "Medical Bills",
            "Police Complaint (Passport Loss)",
            "Hotel Invoice",
            "Travel Insurance Policy PDF",
          ].map((doc) => (
            <div className="uploadItem" key={doc}>
              <label>{doc}</label>
              <input type="file" accept=".pdf,image/*" />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Image Upload ===== */}
      <div className="formSection">
        <h3><FaCamera /> Upload Supporting Images</h3>

        <div className="uploadGrid">
          {[
            "Lost Baggage Photos",
            "Damaged Baggage Photos",
            "Medical Prescription",
            "Medical Report",
            "Airport Incident Photos",
            "Passport Loss Proof",
          ].map((img) => (
            <div className="uploadItem" key={img}>
              <label>{img}</label>
              <input type="file" accept="image/*" />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Bank Details ===== */}
      <div className="formSection">
        <h3><FaMoneyBillWave /> Bank Details for Settlement</h3>

        <div className="grid2">
          <div className="inputGroup">
            <label>Bank Name</label>
            <input
              name="bankName"
              value={travelData.bankName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>Account Number</label>
            <input
              name="accountNumber"
              value={travelData.accountNumber}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>IFSC Code</label>
            <input
              name="ifsc"
              value={travelData.ifsc}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label>UPI ID (Optional)</label>
            <input placeholder="example@upi" />
          </div>
        </div>
      </div>

      {/* ===== Declaration ===== */}
      <div className="formSection">
        <h3><FaCheckCircle /> Declaration</h3>

        <label className="checkboxDeclaration">
          <input type="checkbox" />
          I declare that all travel information provided is true.
        </label>

        <label className="checkboxDeclaration">
          <input type="checkbox" />
          I authorize Forma AI to verify travel documents and airline records.
        </label>

        <label className="checkboxDeclaration">
          <input type="checkbox" />
          I agree to AI OCR processing for uploaded documents.
        </label>
      </div>

      {/* ===== Buttons ===== */}
      <div className="formButtons">
        <button className="draftBtn">Save Draft</button>

        <button className="submitBtn">
          Submit Travel Insurance Claim
        </button>
      </div>

    </div>
  );
};

export default TravelInsuranceForm;