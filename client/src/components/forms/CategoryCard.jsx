import React from "react";
import {
  FaHeartbeat,
  FaCarCrash,
  FaHome,
  FaPlaneDeparture,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const CategoryCard = ({ category, selected, onSelect }) => {
  const getGradient = (id) => {
    switch (id) {
      case "health":
        return "linear-gradient(135deg,#EF4444,#F87171)";
      case "vehicle":
        return "linear-gradient(135deg,#2563EB,#60A5FA)";
      case "property":
        return "linear-gradient(135deg,#059669,#34D399)";
      case "travel":
        return "linear-gradient(135deg,#EA580C,#FB923C)";
      case "life":
        return "linear-gradient(135deg,#7C3AED,#A855F7)";
      default:
        return "linear-gradient(135deg,#6366F1,#8B5CF6)";
    }
  };

  const getFeatures = (id) => {
    switch (id) {
      case "health":
        return [
          "Hospitalization",
          "Medical Bills",
          "Surgery Claims",
          "Pharmacy & ICU",
        ];

      case "vehicle":
        return [
          "Car & Bike Accidents",
          "Flood & Fire Damage",
          "Theft Claims",
          "Repair Estimates",
        ];

      case "property":
        return [
          "Fire Damage",
          "Flood Damage",
          "Burglary Claims",
          "Natural Disaster",
        ];

      case "travel":
        return [
          "Flight Delay",
          "Passport Loss",
          "Baggage Claims",
          "Medical Emergency",
        ];

      case "life":
        return [
          "Death Claim",
          "Nominee Claim",
          "Critical Illness",
          "Maturity Claim",
        ];

      default:
        return [];
    }
  };

  return (
    <div
      className={`categoryCard ${selected ? "activeCategory" : ""}`}
      onClick={onSelect}
    >
      {/* Top Banner */}

      <div
        className="categoryBanner"
        style={{ background: getGradient(category.id) }}
      >
        <div className="categoryIcon">{category.icon}</div>

        {selected && (
          <div className="selectedBadge">
            <FaCheckCircle />
          </div>
        )}
      </div>

      {/* Content */}

      <div className="categoryContent">
        <h3>{category.title}</h3>

        <p>{category.subtitle}</p>

        {/* Mini Features */}

        <div className="featureList">
          {getFeatures(category.id).map((item, index) => (
            <div className="featureItem" key={index}>
              <span className="dot"></span>
              {item}
            </div>
          ))}
        </div>

        {/* Footer */}

        <div className="cardFooter">
          <button
            className={selected ? "selectedButton" : "selectButton"}
          >
            {selected ? "Selected" : "Use Template"}

            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;