
// ==========================================
// Forma AI - Manual Insurance Form
// ==========================================

import React, { useEffect, useState } from "react";

import HealthInsuranceForm from "./HealthInsuranceForm";
import VehicleInsuranceForm from "./VehicleInsuranceForm";
import PropertyInsuranceForm from "./PropertyInsuranceForm";
import TravelInsuranceForm from "./TravelInsuranceForm";
import LifeInsuranceForm from "./LifeInsuranceForm";

// ==========================================
// ManualForm Component
// ==========================================

const ManualForm = ({ category, onFormDataChange }) => {
  const [categoryData, setCategoryData] = useState({});

  // ==========================================
  // Reset Form When Category Changes
  // ==========================================

  useEffect(() => {
    setCategoryData({});

    if (onFormDataChange) {
      onFormDataChange({});
    }
  }, [category]);

  // ==========================================
  // Receive Data From Selected Insurance Form
  // ==========================================

  const handleCategoryDataChange = (data) => {
    setCategoryData(data);

    if (onFormDataChange) {
      onFormDataChange(data);
    }
  };

  // ==========================================
  // Render Selected Insurance Form
  // ==========================================

  const renderSelectedForm = () => {
    switch (category) {
      case "health":
        return (
          <HealthInsuranceForm
            onDataChange={handleCategoryDataChange}
          />
        );

      case "vehicle":
        return (
          <VehicleInsuranceForm
            onDataChange={handleCategoryDataChange}
          />
        );

      case "property":
        return (
          <PropertyInsuranceForm
            onDataChange={handleCategoryDataChange}
          />
        );

      case "travel":
        return (
          <TravelInsuranceForm
            onDataChange={handleCategoryDataChange}
          />
        );

      case "life":
        return (
          <LifeInsuranceForm
            onDataChange={handleCategoryDataChange}
          />
        );

      default:
        return (
          <VehicleInsuranceForm
            onDataChange={handleCategoryDataChange}
          />
        );
    }
  };

  // ==========================================
  // Component UI
  // ==========================================

  return (
    <div className="manualFormContainer">

      {/* ======================================
          Header
      ====================================== */}

      <div className="manualFormHeader">
        <h2>Dynamic Insurance Claim Form</h2>

        <p>
          The form below changes automatically based
          on the insurance category selected.
        </p>

        <span className="categoryBadge">
          Selected Category :{" "}
          {category ? category.toUpperCase() : "VEHICLE"}
        </span>
      </div>

      {/* ======================================
          Dynamic Category Form
      ====================================== */}

      <div className="dynamicFormCard">
        {renderSelectedForm()}
      </div>

      {/* ======================================
          Smart Tips
      ====================================== */}

      <div className="manualTipsCard">
        <h3>Forma AI Smart Tips</h3>

        <ul>
          <li>
            Fill all mandatory fields marked with
            <strong> *</strong>.
          </li>

          <li>
            Upload supporting documents for faster
            claim processing.
          </li>

          <li>
            Use AI Auto Fill to enter incident
            information using natural language.
          </li>

          <li>
            Upload supported documents for OCR-based
            information extraction.
          </li>

          <li>
            Review AI-generated information carefully
            before submitting your claim.
          </li>
        </ul>
      </div>

      {/* ======================================
          Backend Sync Information
      ====================================== */}

      <div className="manualBackendInfo">
        <span className="backendStatusDot"></span>

        <div>
          <strong>Forma AI Backend Connected</strong>

          <p>
            Your form information is synchronized with
            the claim management system when you save
            or continue.
          </p>
        </div>
      </div>

    </div>
  );
};

// ==========================================
// IMPORTANT:
// DynamicForms.jsx imports this component
// as a DEFAULT import.
// ==========================================

export default ManualForm;

