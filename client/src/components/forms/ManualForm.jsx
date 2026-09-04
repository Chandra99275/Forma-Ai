import React from "react";

import HealthInsuranceForm from "./HealthInsuranceForm";
import VehicleInsuranceForm from "./VehicleInsuranceForm";
import PropertyInsuranceForm from "./PropertyInsuranceForm";
import TravelInsuranceForm from "./TravelInsuranceForm";
import LifeInsuranceForm from "./LifeInsuranceForm";

const ManualForm = ({ category }) => {
  const renderSelectedForm = () => {
    switch (category) {
      case "health":
        return <HealthInsuranceForm />;

      case "vehicle":
        return <VehicleInsuranceForm />;

      case "property":
        return <PropertyInsuranceForm />;

      case "travel":
        return <TravelInsuranceForm />;

      case "life":
        return <LifeInsuranceForm />;

      default:
        return <VehicleInsuranceForm />;
    }
  };

  return (
    <div className="manualFormContainer">
      {/* Header */}
      <div className="manualFormHeader">
        <h2>Dynamic Insurance Claim Form</h2>

        <p>
          The form below changes automatically based on the insurance category
          selected by the user.
        </p>

        <span className="categoryBadge">
          Selected Category : {category.toUpperCase()}
        </span>
      </div>

      {/* Dynamic Form */}
      <div className="dynamicFormCard">{renderSelectedForm()}</div>

      {/* AI Suggestions */}
      <div className="manualTipsCard">
        <h3>Forma AI Smart Tips</h3>

        <ul>
          <li>Fill mandatory fields marked with *.</li>
          <li>Upload supporting documents for faster claim approval.</li>
          <li>Use AI Auto Fill if you have an incident description.</li>
          <li>Image OCR automatically extracts information from photos.</li>
          <li>PDF OCR reads medical bills, FIR copies and insurance policies.</li>
        </ul>
      </div>
    </div>
  );
};

export default ManualForm;