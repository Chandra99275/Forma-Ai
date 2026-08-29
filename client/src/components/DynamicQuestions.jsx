function DynamicQuestions() {
  return (
    <section className="panel">
      <div className="panel-title">
        <h2>Remaining Questions</h2>
        <span>Only relevant questions appear.</span>
      </div>

      <div className="progress">
        <div className="progress-fill"></div>
      </div>

      <label>Which animal was involved?</label>
      <select>
        <option>Deer</option>
        <option>Dog</option>
        <option>Cow</option>
        <option>Other</option>
      </select>

      <label>Was the windshield completely shattered?</label>
      <select>
        <option>Yes</option>
        <option>No</option>
      </select>

      <label>Was anyone injured?</label>
      <select>
        <option>No</option>
        <option>Yes</option>
      </select>

      <button className="primary-btn full-width">
        Submit Insurance Claim
      </button>
    </section>
  );
}

export default DynamicQuestions;