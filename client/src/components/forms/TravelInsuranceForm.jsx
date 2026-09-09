import React, { useEffect, useState } from "react";

import {
  FaPlaneDeparture,
  FaPassport,
  FaSuitcaseRolling,
  FaHotel,
  FaHospital,
  FaFileUpload,
  FaCamera,
  FaMoneyBillWave,
  FaCheckCircle,
  FaGlobeAsia,
} from "react-icons/fa";

const TravelInsuranceForm = ({ onDataChange }) => {
  const [travelData, setTravelData] = useState({
    // ==========================================
    // TRAVELER INFORMATION
    // ==========================================
    travelerName: "",
    passportNumber: "",
    nationality: "",
    dateOfBirth: "",
    mobileNumber: "",
    email: "",

    // ==========================================
    // INSURANCE DETAILS
    // ==========================================
    policyNumber: "",
    insuranceCompany: "",
    policyStartDate: "",
    policyEndDate: "",

    // ==========================================
    // JOURNEY DETAILS
    // ==========================================
    destination: "",
    departureCity: "",
    departureDate: "",
    returnDate: "",
    airline: "",
    flightNumber: "",
    bookingReference: "",

    // ==========================================
    // CLAIM INFORMATION
    // ==========================================
    claimType: "",
    incidentDate: "",
    incidentLocation: "",
    estimatedLoss: "",
    emergencyDescription: "",

    // ==========================================
    // MEDICAL EMERGENCY
    // ==========================================
    hospitalName: "",
    hospitalCountry: "",
    doctorName: "",
    treatmentCost: "",

    // ==========================================
    // HOTEL / ACCOMMODATION
    // ==========================================
    hotelName: "",
    hotelBookingNumber: "",
    totalHotelCost: "",
    additionalExpenses: "",

    // ==========================================
    // EXPENSE BREAKDOWN
    // ==========================================
    flightTicketCost: "",
    hotelCharges: "",
    medicalExpenses: "",
    foodExpenses: "",
    transportExpenses: "",
    passportRenewalCost: "",
    emergencyPurchases: "",
    lostBaggageValue: "",

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
    informationDeclaration: false,
    documentVerificationAuthorization: false,
    aiVerificationAuthorization: false,
  });

  // ==========================================
  // SEND DATA TO PARENT
  // ==========================================

  useEffect(() => {
    if (onDataChange) {
      onDataChange(travelData);
    }
  }, [travelData, onDataChange]);

  // ==========================================
  // INPUT CHANGE HANDLER
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTravelData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // DECLARATION HANDLER
  // ==========================================

  const handleDeclarationChange = (e) => {
    const { name, checked } = e.target;

    setTravelData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // ==========================================
  // EXPENSE FIELDS
  // ==========================================

  const expenseFields = [
    {
      name: "flightTicketCost",
      label: "Flight Ticket Cost",
    },
    {
      name: "hotelCharges",
      label: "Hotel Charges",
    },
    {
      name: "medicalExpenses",
      label: "Medical Expenses",
    },
    {
      name: "foodExpenses",
      label: "Food Expenses",
    },
    {
      name: "transportExpenses",
      label: "Transport Expenses",
    },
    {
      name: "passportRenewalCost",
      label: "Passport Renewal Cost",
    },
    {
      name: "emergencyPurchases",
      label: "Emergency Purchases",
    },
    {
      name: "lostBaggageValue",
      label: "Lost Baggage Value",
    },
  ];

  return (
    <div className="insuranceForm">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="formTitle travelTitle">

        <FaPlaneDeparture className="titleIcon" />

        <div>

          <h2>
            Travel Insurance Claim Form
          </h2>

          <p>
            Claim for Flight Delay, Baggage Loss,
            Passport Loss, Medical Emergency,
            Trip Cancellation, Hotel Expenses
            and Visa Issues.
          </p>

        </div>

      </div>

      {/* ==========================================
          TRAVELER INFORMATION
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaGlobeAsia />
          Traveler Information
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Traveler Full Name *
            </label>

            <input
              name="travelerName"
              value={travelData.travelerName}
              onChange={handleChange}
              placeholder="Enter Traveler Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Passport Number *
            </label>

            <input
              name="passportNumber"
              value={travelData.passportNumber}
              onChange={handleChange}
              placeholder="Passport Number"
            />

          </div>

          <div className="inputGroup">

            <label>
              Nationality
            </label>

            <input
              name="nationality"
              value={travelData.nationality}
              onChange={handleChange}
              placeholder="Indian"
            />

          </div>

          <div className="inputGroup">

            <label>
              Date of Birth
            </label>

            <input
              type="date"
              name="dateOfBirth"
              value={travelData.dateOfBirth}
              onChange={handleChange}
            />

          </div>

          <div className="inputGroup">

            <label>
              Mobile Number
            </label>

            <input
              type="tel"
              name="mobileNumber"
              value={travelData.mobileNumber}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />

          </div>

          <div className="inputGroup">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={travelData.email}
              onChange={handleChange}
              placeholder="example@email.com"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          INSURANCE DETAILS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaPassport />
          Insurance Details
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Insurance Company *
            </label>

            <input
              name="insuranceCompany"
              value={travelData.insuranceCompany}
              onChange={handleChange}
              placeholder="ACKO / Tata AIG / ICICI Lombard"
            />

          </div>

          <div className="inputGroup">

            <label>
              Policy Number *
            </label>

            <input
              name="policyNumber"
              value={travelData.policyNumber}
              onChange={handleChange}
              placeholder="TRAVEL-INS-2026-001"
            />

          </div>

          <div className="inputGroup">

            <label>
              Policy Start Date
            </label>

            <input
              type="date"
              name="policyStartDate"
              value={travelData.policyStartDate}
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
              value={travelData.policyEndDate}
              onChange={handleChange}
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          JOURNEY DETAILS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaPlaneDeparture />
          Journey Details
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Departure City *
            </label>

            <input
              name="departureCity"
              value={travelData.departureCity}
              onChange={handleChange}
              placeholder="Hyderabad"
            />

          </div>

          <div className="inputGroup">

            <label>
              Destination Country *
            </label>

            <input
              name="destination"
              value={travelData.destination}
              onChange={handleChange}
              placeholder="Singapore"
            />

          </div>

          <div className="inputGroup">

            <label>
              Departure Date *
            </label>

            <input
              type="date"
              name="departureDate"
              value={travelData.departureDate}
              onChange={handleChange}
            />

          </div>

          <div className="inputGroup">

            <label>
              Return Date *
            </label>

            <input
              type="date"
              name="returnDate"
              value={travelData.returnDate}
              onChange={handleChange}
            />

          </div>

          <div className="inputGroup">

            <label>
              Airline Name *
            </label>

            <input
              name="airline"
              value={travelData.airline}
              onChange={handleChange}
              placeholder="Airline Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Flight Number *
            </label>

            <input
              name="flightNumber"
              value={travelData.flightNumber}
              onChange={handleChange}
              placeholder="Flight Number"
            />

          </div>

          <div className="inputGroup">

            <label>
              Booking Reference / PNR
            </label>

            <input
              name="bookingReference"
              value={travelData.bookingReference}
              onChange={handleChange}
              placeholder="PNR / Booking Reference"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          CLAIM INFORMATION
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaSuitcaseRolling />
          Claim Information
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Claim Type *
            </label>

            <select
              name="claimType"
              value={travelData.claimType}
              onChange={handleChange}
            >

              <option value="">
                Select Claim Type
              </option>

              <option value="Flight Delay">
                Flight Delay
              </option>

              <option value="Baggage Loss">
                Baggage Loss
              </option>

              <option value="Baggage Damage">
                Baggage Damage
              </option>

              <option value="Passport Loss">
                Passport Loss
              </option>

              <option value="Trip Cancellation">
                Trip Cancellation
              </option>

              <option value="Trip Curtailment">
                Trip Curtailment
              </option>

              <option value="Medical Emergency">
                Medical Emergency
              </option>

              <option value="Personal Accident">
                Personal Accident
              </option>

              <option value="Visa Rejection">
                Visa Rejection
              </option>

              <option value="Hotel Expense">
                Hotel Expense
              </option>

            </select>

          </div>

          <div className="inputGroup">

            <label>
              Incident Date *
            </label>

            <input
              type="date"
              name="incidentDate"
              value={travelData.incidentDate}
              onChange={handleChange}
            />

          </div>

          <div className="inputGroup">

            <label>
              Incident Location *
            </label>

            <input
              name="incidentLocation"
              value={travelData.incidentLocation}
              onChange={handleChange}
              placeholder="Singapore Airport"
            />

          </div>

          <div className="inputGroup">

            <label>
              Estimated Claim Amount
            </label>

            <input
              type="number"
              name="estimatedLoss"
              value={travelData.estimatedLoss}
              onChange={handleChange}
              placeholder="₹ 0"
              min="0"
            />

          </div>

        </div>

        <div className="inputGroup">

          <label>
            Describe the Incident *
          </label>

          <textarea
            rows="5"
            name="emergencyDescription"
            value={travelData.emergencyDescription}
            onChange={handleChange}
            placeholder="Explain what happened during your travel..."
          />

        </div>

      </div>

      {/* ==========================================
          MEDICAL EMERGENCY
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaHospital />
          Medical Emergency Details
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Hospital Name
            </label>

            <input
              name="hospitalName"
              value={travelData.hospitalName}
              onChange={handleChange}
              placeholder="Hospital Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Hospital Country
            </label>

            <input
              name="hospitalCountry"
              value={travelData.hospitalCountry}
              onChange={handleChange}
              placeholder="Country"
            />

          </div>

          <div className="inputGroup">

            <label>
              Doctor Name
            </label>

            <input
              name="doctorName"
              value={travelData.doctorName}
              onChange={handleChange}
              placeholder="Doctor Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Treatment Cost (₹)
            </label>

            <input
              type="number"
              name="treatmentCost"
              value={travelData.treatmentCost}
              onChange={handleChange}
              placeholder="Amount"
              min="0"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          HOTEL EXPENSES
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaHotel />
          Hotel / Accommodation Expenses
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Hotel Name
            </label>

            <input
              name="hotelName"
              value={travelData.hotelName}
              onChange={handleChange}
              placeholder="Hotel Name"
            />

          </div>

          <div className="inputGroup">

            <label>
              Hotel Booking Number
            </label>

            <input
              name="hotelBookingNumber"
              value={travelData.hotelBookingNumber}
              onChange={handleChange}
              placeholder="Booking Number"
            />

          </div>

          <div className="inputGroup">

            <label>
              Total Hotel Cost
            </label>

            <input
              type="number"
              name="totalHotelCost"
              value={travelData.totalHotelCost}
              onChange={handleChange}
              placeholder="₹ 0"
              min="0"
            />

          </div>

          <div className="inputGroup">

            <label>
              Additional Expenses
            </label>

            <input
              type="number"
              name="additionalExpenses"
              value={travelData.additionalExpenses}
              onChange={handleChange}
              placeholder="₹ 0"
              min="0"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          EXPENSE BREAKDOWN
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaMoneyBillWave />
          Expense Breakdown
        </h3>

        <div className="grid2">

          {expenseFields.map((expense) => (

            <div
              className="inputGroup"
              key={expense.name}
            >

              <label>
                {expense.label}
              </label>

              <input
                type="number"
                name={expense.name}
                value={travelData[expense.name]}
                onChange={handleChange}
                placeholder="₹"
                min="0"
              />

            </div>

          ))}

        </div>

      </div>

      {/* ==========================================
          TRAVEL DOCUMENTS
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaFileUpload />
          Upload Travel Documents
        </h3>

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
          SUPPORTING IMAGES
      ========================================== */}

      <div className="formSection">

        <h3>
          <FaCamera />
          Upload Supporting Images
        </h3>

        <div className="uploadGrid">

          {[
            "Lost Baggage Photos",
            "Damaged Baggage Photos",
            "Medical Prescription",
            "Medical Report",
            "Airport Incident Photos",
            "Passport Loss Proof",
          ].map((img) => (

            <div
              className="uploadItem"
              key={img}
            >

              <label>
                {img}
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
          Bank Details for Settlement
        </h3>

        <div className="grid2">

          <div className="inputGroup">

            <label>
              Bank Name
            </label>

            <input
              name="bankName"
              value={travelData.bankName}
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
              value={travelData.accountNumber}
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
              value={travelData.ifsc}
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
              value={travelData.upiId}
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
              travelData.informationDeclaration
            }
            onChange={handleDeclarationChange}
          />

          I declare that all travel information
          provided is true.

        </label>

        <label className="checkboxDeclaration">

          <input
            type="checkbox"
            name="documentVerificationAuthorization"
            checked={
              travelData.documentVerificationAuthorization
            }
            onChange={handleDeclarationChange}
          />

          I authorize Forma AI to verify travel
          documents and airline records.

        </label>

        <label className="checkboxDeclaration">

          <input
            type="checkbox"
            name="aiVerificationAuthorization"
            checked={
              travelData.aiVerificationAuthorization
            }
            onChange={handleDeclarationChange}
          />

          I agree to AI OCR processing for
          uploaded documents.

        </label>

      </div>

      {/* ==========================================
          BACKEND SYNC MESSAGE
      ========================================== */}

      <div className="formInfoMessage">

        <FaCheckCircle />

        <span>
          Travel claim information is automatically
          synchronized with the Forma AI claim form.
        </span>

      </div>

    </div>
  );
};

export default TravelInsuranceForm;