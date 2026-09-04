import { FaRobot, FaMagic } from "react-icons/fa";

const AIInsightCard = () => {

  return (
    <div className="aiInsight">

      <div className="aiHeader">
        <FaRobot />
        <h3>Forma AI Suggestions</h3>
      </div>

      <div className="aiItem">
        <FaMagic />

        <p>Upload accident photos for better AI extraction.</p>
      </div>

      <div className="aiItem">
        <FaMagic />

        <p>Missing police report decreases AI confidence.</p>
      </div>

      <div className="aiItem">
        <FaMagic />

        <p>AI will automatically fill driver details after OCR.</p>
      </div>

    </div>
  );
};

export default AIInsightCard;