import "./ProgressBar.css";

const ProgressBar = ({ percentage }) => {
  return (
    <div className="progressCard">
      <div className="progressTitle">
        <span>Form Completion</span>
        <span>{percentage}%</span>
      </div>

      <div className="progressOuter">
        <div
          className="progressInner"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;