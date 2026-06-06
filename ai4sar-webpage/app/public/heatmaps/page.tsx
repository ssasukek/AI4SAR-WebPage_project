export default function HeatmapsPage() {
  return (
    <div className="page middle-layer">
      <div className="hero-text">
        <h1 className="hero-title">Behavioral Analysis & Heatmaps</h1>
        <p className="hero-subtitle">
          Mapping subject probability through movement behavior prediction[cite:
          4, 11].
        </p>
      </div>

      <div className="card" style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "var(--gold)" }}>Wander Predictor (Model 1)</h2>
        <p style={{ margin: "16px 0", lineHeight: "1.6" }}>
          Predicts whether a missing subject is likely to wander away from their
          last known position or stay near it[cite: 11]. This is critical for
          coordinators deciding whether to focus on the Point Last Seen (PLS) or
          expand the search radius[cite: 12].
        </p>
        <div style={{ display: "flex", gap: "40px", marginTop: "24px" }}>
          <div>
            <h4 style={{ color: "var(--gold)" }}>Technical Specs</h4>
            <ul
              style={{
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                paddingLeft: "20px",
              }}
            >
              <li>Algorithm: KNeighborsClassifier (k=5) [cite: 9]</li>
              <li>Accuracy: ~0.81 [cite: 9]</li>
              <li>Inputs: Subject Age, Group Size [cite: 17]</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "var(--gold)" }}>Output Meaning</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              <strong>True:</strong> Subject likely moving; expand search
              area[cite: 20].
              <br />
              <strong>False:</strong> Subject likely stayed put; focus on
              PLS[cite: 20].
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ color: "var(--gold)" }}>
          Model 1.5: Group Behavior Predictor
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            marginTop: "8px",
          }}
        >
          Complements Model 1 by predicting movement patterns specifically for
          multi-subject incidents[cite: 21, 23].
        </p>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--gold)",
            marginTop: "12px",
            fontStyle: "italic",
          }}
        >
          Future Integration: Path Finder (Currently in development) [cite: 3]
        </p>
      </div>
    </div>
  );
}
