function PrefillFields() {
  return (
    <section className="panel">
      <div className="panel-title">
        <h2>AI Prefilled Information</h2>
        <span>Detected automatically</span>
      </div>

      <div className="prefill-list">
        <div className="prefill-card">
          <small>Incident Type</small>
          <h3>Animal Collision</h3>
        </div>

        <div className="prefill-card">
          <small>Vehicle</small>
          <h3>Honda Civic</h3>
        </div>

        <div className="prefill-card">
          <small>Damage</small>
          <h3>Windshield</h3>
        </div>

        <div className="prefill-card">
          <small>Location</small>
          <h3>I-95 Highway</h3>
        </div>
      </div>
    </section>
  );
}

export default PrefillFields;