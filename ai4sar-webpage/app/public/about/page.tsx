export default function AboutPage() {
  return (
    <div className="page middle-layer">
      <section className="hero-text">
        <h1 className="hero-title">About the Team</h1>
        <p className="hero-subtitle">
          AI4SAR is a Cal Poly research initiative digitizing workflows and
          prototyping autonomous agents to support Search and Rescue teams.
        </p>
      </section>

      <section className="story-container">
        <h2 className="section-header">Research Leadership</h2>
        <div
          className="grid-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          <div
            className="person-card"
            style={{ padding: "24px", textAlign: "center" }}
          >
            <div
              className="avatar"
              style={{
                background: "var(--green)",
                color: "white",
                borderRadius: "50%",
                width: "80px",
                height: "80px",
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              FK
            </div>
            <h3>Dr. Franz Kurfess</h3>
            <p className="feature-label" style={{ color: "var(--gold)" }}>
              Research Lead
            </p>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Professor of Computer Science directing AI and human-computer
              interaction research.
            </p>
          </div>
          {/* Add other members later */}
        </div>
      </section>

      {/* Functional Research Groups */}
      <section className="story-container" style={{ marginTop: "80px" }}>
        <h2 className="section-header">Research Teams</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          <TeamCard
            title="Agentic Design"
            desc="Develops multi-agent architecture and LLM orchestration."
          />
          <TeamCard
            title="Machine Learning"
            desc="Analyzes behavioral profiles from historical SAR cases."
          />
          <TeamCard
            title="Frontend & UX"
            desc="Builds the command post dashboard and mobile field interfaces."
          />
          {/* Add other teams in future */}
        </div>
      </section>
    </div>
  );
}

function TeamCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
      }}
    >
      <h4 style={{ color: "var(--gold)", marginBottom: "8px" }}>{title}</h4>
      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{desc}</p>
    </div>
  );
}
