export default function DeepLearningPage() {
  return (
    <div className="page middle-layer">
      <div className="hero-text">
        <h1 className="hero-title">Predictive Modeling</h1>
        <p className="hero-subtitle">
          Advanced machine learning models for resource estimation and mission
          prioritization.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>
        <ModelSection
          title="Priority / Urgency Score (Model 3)"
          desc="Calculates numeric urgency scores (9-33) to determine response levels: High, Moderate, or Low[cite: 45, 48]."
          algorithm="XGBRegressor (XGBoost Pipeline) | R2: ~0.91 [cite: 43]"
          inputs="Medical status, terrain, weather, scenario, age group, and preparedness[cite: 47, 54]."
        />

        <ModelSection
          title="Status Prediction (Model 4)"
          desc="Predicts the likely outcome status: Alive Well, Ill_Injured, DOA, or Not_Found[cite: 63, 65]."
          algorithm="StackingClassifier (SVM RBF + Logistic Regression) [cite: 61]"
          inputs="Age, physical fitness, experience, environment, and total hours missing[cite: 70]."
        />

        <ModelSection
          title="Total Man Hours (Model 2)"
          desc="Estimates total man-hours required based on subject category, activity, and weather[cite: 31, 32]."
          algorithm="Random ForestRegressor (scikit-learn) [cite: 29]"
          inputs="Subject category (Minor, Medical, etc.), activity, weather, and age[cite: 36]."
        />

        <ModelSection
          title="Search Area Containment (Model 5)"
          desc="Estimates if a subject is likely to be found within the planned search area[cite: 80]."
          algorithm="RandomForestClassifier | Accuracy: 0.71 [cite: 78]"
          inputs="Last known elevation and incident situation (Lost, Overdue, etc.)[cite: 81, 88]."
        />
      </div>
    </div>
  );
}

function ModelSection({
  title,
  desc,
  algorithm,
  inputs,
}: {
  title: string;
  desc: string;
  algorithm: string;
  inputs: string;
}) {
  return (
    <div
      className="card"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "24px",
        alignItems: "center",
      }}
    >
      <div>
        <h3 style={{ color: "var(--gold)" }}>{title}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{desc}</p>
      </div>
      <div
        style={{ borderLeft: "1px solid var(--border)", paddingLeft: "24px" }}
      >
        <p style={{ fontSize: "0.85rem", marginBottom: "8px" }}>
          <strong>Algorithm:</strong> {algorithm}
        </p>
        <p style={{ fontSize: "0.85rem" }}>
          <strong>Key Inputs:</strong> {inputs}
        </p>
      </div>
    </div>
  );
}
