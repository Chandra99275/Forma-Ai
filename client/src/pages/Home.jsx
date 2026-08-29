import Navbar from "../components/Navbar";
import ClaimInput from "../components/ClaimInput";
import PrefillFields from "../components/PrefillFields";
import DynamicQuestions from "../components/DynamicQuestions";

function Home() {
  return (
    <div className="home">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <span className="badge">AI Dynamic Form Engine</span>

          <h1>
            Fill Complex Insurance Claims
            <span> in Seconds with AI</span>
          </h1>

          <p>
            Describe your accident naturally. Forma AI extracts important
            information, pre-fills your claim, and shows only the questions that
            matter.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Start AI Claim</button>
            <button className="secondary-btn">Learn More</button>
          </div>

          <div className="stats">
            <div>
              <h2>50+</h2>
              <span>Dynamic Questions</span>
            </div>

            <div>
              <h2>95%</h2>
              <span>AI Prefill Accuracy</span>
            </div>

            <div>
              <h2>3x</h2>
              <span>Faster Form Completion</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="ai-card">
            <h3>AI Detected Claim</h3>

            <div className="chip">Animal Collision</div>
            <div className="chip">Honda</div>
            <div className="chip">Windshield Damage</div>
            <div className="chip">I-95 Highway</div>

            <p className="confidence">Confidence Score • 96%</p>
          </div>
        </div>
      </section>

      <ClaimInput />

      <div className="dashboard-grid">
        <PrefillFields />
        <DynamicQuestions />
      </div>
    </div>
  );
}

export default Home;