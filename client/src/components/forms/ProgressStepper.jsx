import React from "react";
import {
  FaClipboardList,
  FaRobot,
  FaWpforms,
  FaCloudUploadAlt,
  FaCheckCircle,
} from "react-icons/fa";

const ProgressStepper = ({ step }) => {
  const steps = [
    {
      id: 1,
      title: "Category",
      icon: <FaClipboardList />,
      subtitle: "Choose Insurance",
    },
    {
      id: 2,
      title: "Method",
      icon: <FaRobot />,
      subtitle: "AI / Manual",
    },
    {
      id: 3,
      title: "Form",
      icon: <FaWpforms />,
      subtitle: "Fill Details",
    },
    {
      id: 4,
      title: "Upload",
      icon: <FaCloudUploadAlt />,
      subtitle: "Images / PDF",
    },
    {
      id: 5,
      title: "Review",
      icon: <FaCheckCircle />,
      subtitle: "Submit Claim",
    },
  ];

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <section className="progressSection">

      {/* Header */}

      <div className="progressHeader">
        <div>
          <h3>Application Progress</h3>
          <p>Complete each step to submit your insurance claim.</p>
        </div>

        <span className="progressPercent">{Math.round(progress)}%</span>
      </div>

      {/* Progress Line */}

      <div className="progressLineContainer">
        <div className="progressLine"></div>

        <div
          className="progressLineActive"
          style={{ width: `${progress}%` }}
        ></div>

        {/* Step Circles */}

        {steps.map((item, index) => (
          <div
            key={item.id}
            className={`stepWrapper ${step >= item.id ? "active" : ""}`}
            style={{ left: `${(index * 100) / (steps.length - 1)}%` }}
          >
            <div className="stepCircle">
              {step > item.id ? (
                <FaCheckCircle />
              ) : (
                item.icon
              )}
            </div>

            <div className="stepLabel">
              <h4>{item.title}</h4>
              <span>{item.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Status Cards */}

      <div className="progressCards">

        <div className={`miniCard ${step >= 1 ? "done" : ""}`}>
          <FaClipboardList />
          <div>
            <h4>Category Selected</h4>
            <p>{step >= 1 ? "Completed" : "Pending"}</p>
          </div>
        </div>

        <div className={`miniCard ${step >= 2 ? "done" : ""}`}>
          <FaRobot />
          <div>
            <h4>Application Method</h4>
            <p>{step >= 2 ? "Completed" : "Pending"}</p>
          </div>
        </div>

        <div className={`miniCard ${step >= 3 ? "done" : ""}`}>
          <FaWpforms />
          <div>
            <h4>Form Details</h4>
            <p>{step >= 3 ? "Completed" : "Pending"}</p>
          </div>
        </div>

        <div className={`miniCard ${step >= 4 ? "done" : ""}`}>
          <FaCloudUploadAlt />
          <div>
            <h4>Documents Uploaded</h4>
            <p>{step >= 4 ? "Completed" : "Pending"}</p>
          </div>
        </div>

        <div className={`miniCard ${step >= 5 ? "done" : ""}`}>
          <FaCheckCircle />
          <div>
            <h4>Claim Submitted</h4>
            <p>{step >= 5 ? "Completed" : "Pending"}</p>
          </div>
        </div>

      </div>

    </section>
  );
};

export default ProgressStepper;