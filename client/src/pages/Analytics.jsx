import React from "react";
import "./Analytics.css";

import {
  FaChartLine,
  FaRobot,
  FaCheckCircle,
  FaFileAlt,
  FaArrowUp,
  FaHeartbeat,
  FaCarCrash,
  FaHome,
  FaPlaneDeparture,
  FaUserShield,
  FaClock,
  FaShieldAlt,
  FaBrain,
  FaChartPie,
} from "react-icons/fa";

const Analytics = () => {
  return (
    <div className="analytics-page">

      {/* Hero Section */}
      <section className="analytics-hero">
        <div className="hero-content">
          <span className="hero-tag">Forma AI Analytics Dashboard</span>

          <h1>AI-Powered Insurance Analytics</h1>

          <p>
            Monitor AI parsing performance, insurance claims, confidence scores,
            submission trends, and workflow automation insights in one dashboard.
          </p>

          <button className="hero-btn">
            View Reports
          </button>
        </div>

        <div className="hero-card">
          <FaRobot className="hero-icon" />

          <h2>97.8%</h2>

          <p>Overall AI Confidence Score</p>

          <span>
            <FaArrowUp /> +4.5% This Week
          </span>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="stats-grid">

        <div className="stat-card blue">
          <FaFileAlt />
          <h2>25,483</h2>
          <p>Forms Submitted</p>
          <span>+12% This Month</span>
        </div>

        <div className="stat-card purple">
          <FaRobot />
          <h2>18,920</h2>
          <p>AI Parsed Documents</p>
          <span>+18% Growth</span>
        </div>

        <div className="stat-card green">
          <FaCheckCircle />
          <h2>96%</h2>
          <p>Completion Rate</p>
          <span>Excellent</span>
        </div>

        <div className="stat-card orange">
          <FaClock />
          <h2>2.8 Sec</h2>
          <p>Average Parsing Time</p>
          <span>Faster than Manual</span>
        </div>

      </section>

      {/* AI Performance */}
      <section className="analytics-row">

        <div className="performance-card">
          <h2>AI Parsing Performance</h2>

          {[
            ["OCR Accuracy", "98%"],
            ["Health Insurance Parsing", "96%"],
            ["Vehicle Claim Detection", "95%"],
            ["Document Validation", "99%"],
            ["KYC Extraction", "97%"],
          ].map(([label, value], index) => (
            <div className="progress-item" key={index}>
              <label>
                <span>{label}</span>
                <strong>{value}</strong>
              </label>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: value }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="confidence-card">
          <FaBrain className="brain-icon" />

          <h2>AI Confidence</h2>

          <div className="confidence-circle">
            <h1>97%</h1>
          </div>

          <p>
            Gemini AI successfully extracted insurance fields with high accuracy.
          </p>
        </div>

      </section>

      {/* Insurance Categories */}
      <section className="category-section">

        <h2>Insurance Analytics by Category</h2>

        <div className="category-grid">

          <div className="category-card health">
            <FaHeartbeat />
            <h3>Health Insurance</h3>
            <h1>6,542</h1>
            <p>Claims Processed</p>
          </div>

          <div className="category-card vehicle">
            <FaCarCrash />
            <h3>Vehicle Insurance</h3>
            <h1>4,218</h1>
            <p>Claims Processed</p>
          </div>

          <div className="category-card property">
            <FaHome />
            <h3>Property Insurance</h3>
            <h1>2,910</h1>
            <p>Claims Processed</p>
          </div>

          <div className="category-card travel">
            <FaPlaneDeparture />
            <h3>Travel Insurance</h3>
            <h1>1,875</h1>
            <p>Claims Processed</p>
          </div>

          <div className="category-card life">
            <FaUserShield />
            <h3>Life Insurance</h3>
            <h1>3,340</h1>
            <p>Claims Processed</p>
          </div>

          <div className="category-card cyber">
            <FaShieldAlt />
            <h3>Cyber Insurance</h3>
            <h1>1,120</h1>
            <p>Claims Processed</p>
          </div>

        </div>

      </section>

      {/* Weekly Activity Chart (UI) */}
      <section className="chart-section">

        <div className="chart-card">

          <div className="chart-header">
            <h2>Weekly AI Parsing Activity</h2>

            <FaChartLine />
          </div>

          <div className="chart-bars">

            {[
              80,
              95,
              60,
              100,
              88,
              72,
              110,
            ].map((height, index) => (
              <div className="bar-group" key={index}>
                <div
                  className="bar"
                  style={{ height: `${height}px` }}
                ></div>

                <span>
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][index]}
                </span>
              </div>
            ))}

          </div>

        </div>

        <div className="pie-card">

          <h2>Claims Status</h2>

          <div className="pie-circle">
            <FaChartPie />
          </div>

          <div className="status-list">

            <div>
              <span className="approved"></span>
              Approved
              <strong>72%</strong>
            </div>

            <div>
              <span className="pending"></span>
              Pending
              <strong>18%</strong>
            </div>

            <div>
              <span className="rejected"></span>
              Rejected
              <strong>10%</strong>
            </div>

          </div>

        </div>

      </section>

      {/* AI Insights */}
      <section className="insights-section">

        <h2>Recent AI Insights</h2>

        <div className="insight-grid">

          {[
            {
              title: "Vehicle Claim Parsed Successfully",
              time: "2 Minutes Ago",
            },
            {
              title: "Health Policy OCR Completed",
              time: "15 Minutes Ago",
            },
            {
              title: "AI Suggested Missing Aadhaar Document",
              time: "45 Minutes Ago",
            },
            {
              title: "Travel Insurance Form Auto Completed",
              time: "Today",
            },
          ].map((item, index) => (
            <div className="insight-card" key={index}>
              <FaRobot />

              <h3>{item.title}</h3>

              <p>{item.time}</p>
            </div>
          ))}

        </div>

      </section>

      {/* Recent Reports */}
      <section className="reports-section">

        <div className="reports-header">
          <h2>Recent Analytics Reports</h2>

          <button>View All Reports</button>
        </div>

        <table>

          <thead>
            <tr>
              <th>Report</th>
              <th>Category</th>
              <th>Accuracy</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Health Insurance Claim Summary</td>
              <td>Health</td>
              <td>98%</td>
              <td>
                <span className="badge success">Completed</span>
              </td>
            </tr>

            <tr>
              <td>Vehicle Accident Parsing Report</td>
              <td>Vehicle</td>
              <td>96%</td>
              <td>
                <span className="badge pending">Processing</span>
              </td>
            </tr>

            <tr>
              <td>Life Insurance OCR Validation</td>
              <td>Life</td>
              <td>97%</td>
              <td>
                <span className="badge success">Completed</span>
              </td>
            </tr>

            <tr>
              <td>Travel Insurance AI Summary</td>
              <td>Travel</td>
              <td>91%</td>
              <td>
                <span className="badge rejected">Needs Review</span>
              </td>
            </tr>

          </tbody>

        </table>

      </section>

    </div>
  );
};

export default Analytics;