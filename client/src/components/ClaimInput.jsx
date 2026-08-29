function ClaimInput() {
  return (
    <section className="claim-box">
      <div className="claim-header">
        <h2>Describe Your Claim</h2>
        <span>AI will automatically pre-fill your form.</span>
      </div>

      <textarea
        rows="6"
        placeholder="Example: I hit a deer on I-95 yesterday in my Honda Civic and the windshield shattered."
      ></textarea>

      <button className="primary-btn full-width">
        ✨ Analyze Claim with AI
      </button>
    </section>
  );
}

export default ClaimInput;