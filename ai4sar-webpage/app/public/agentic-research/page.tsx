"use client";

export default function AgenticResearchPage() {
  return (
    <div className="page">
      <main className="middle-layer">
        {/* Hero Section */}
        <div className="hero-text">
          <h1 className="hero-title">Agentic AI Architecture</h1>
          <p
            className="hero-subtitle"
            style={{
              color: "#9ca3af",
              maxWidth: "700px",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            Moving beyond simple chatbots. AI4SAR utilizes a Multi-Agent System
            (MAS) where specialized, autonomous AI agents collaborate in
            real-time to solve complex Search and Rescue operations.
          </p>
        </div>

        <div className="story-container">
          {/* What is Agentic AI? */}
          <div className="feature-row">
            <div
              className="feature-visual"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
              }}
            >
              {/* Placeholder for diagram*/}
              <h3
                style={{
                  color: "#60a5fa",
                  fontSize: "2rem",
                  textAlign: "center",
                }}
              >
                Reasoning + Action
              </h3>
            </div>
            <div className="feature-text">
              <span className="feature-label">The Paradigm Shift</span>
              <h2>What is Agentic AI?</h2>
              <p>
                Traditional AI waits for a prompt and generates a single
                response. <strong>Agentic AI</strong> connects to real-world
                data and uses sophisticated reasoning to iteratively plan and
                autonomously execute multi-step tasks.
              </p>
              <p>
                In a high-stakes Search and Rescue environment, a single AI
                model gets overwhelmed. Instead, we use "Agents"—individual AI
                models equipped with specific tools (like Python, Vector
                Databases, or Computer Vision APIs) designed to handle one
                specific piece of the puzzle flawlessly.
              </p>
            </div>
          </div>

          {/* MCP & Redis Architecture */}
          <div className="feature-row reverse">
            <div
              className="feature-visual"
              style={{
                background: "linear-gradient(135deg, #065f46 0%, #0f172a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
              }}
            >
              <h3
                style={{
                  color: "#34d399",
                  fontSize: "2rem",
                  textAlign: "center",
                  lineHeight: "1.4",
                }}
              >
                Redis Message Bus
                <br />
                <span style={{ fontSize: "1.2rem", color: "#a7f3d0" }}>
                  + Model Context Protocol
                </span>
              </h3>
            </div>
            <div className="feature-text">
              <span className="feature-label">Infrastructure</span>
              <h2>Agent-to-Agent (A2A) Communication</h2>
              <p>
                Agents are only as good as their ability to communicate. Our
                system uses the emerging industry standard, the{" "}
                <strong>Model Context Protocol (MCP)</strong>, allowing agents
                to securely access data sources and share context.
              </p>
              <p>
                Instead of a tangled web of direct connections, all 7 of our
                agents publish and subscribe to a central{" "}
                <strong>Redis Message Bus</strong>. Using standardized message
                envelopes, the Weather Agent can broadcast a storm warning, and
                the Logistics Agent instantly receives it to reroute
                resources—completely asynchronously.
              </p>
            </div>
          </div>

          {/* The 7 Agents */}
          <div className="feature-row">
            <div
              className="feature-text"
              style={{
                width: "100%",
                flex: "none",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <span className="feature-label">The Task Force</span>
              <h2>Our Specialized SAR Agents</h2>
              <p style={{ maxWidth: "800px", margin: "0 auto 40px auto" }}>
                We have deployed 7 distinct agents, each armed with specialized
                models like YOLO for vision and Qdrant for Retrieval-Augmented
                Generation (RAG).
              </p>
            </div>
          </div>

          {/* Grid for the 7 Agents */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              width: "100%",
            }}
          >
            <AgentCard
              title="Weather Agent"
              desc="Continuously monitors and produces real-time weather forecasts for the search grid."
              icon="🌤️"
            />
            <AgentCard
              title="Health Agent"
              desc="Assesses medical risks and cross-references missing person health conditions with environmental factors."
              icon="⚕️"
            />
            <AgentCard
              title="History Agent"
              desc="Uses Qdrant Vector DB and RAG to analyze historical case files and suggest likely missing person behavior."
              icon="📚"
            />
            <AgentCard
              title="Logistics Agent"
              desc="Manages incoming resource requests and optimizes the allocation of search teams and equipment."
              icon="🚁"
            />
            <AgentCard
              title="Path Analysis Agent"
              desc="Calculates terrain difficulty and maps out the highest probability search areas."
              icon="🗺️"
            />
            <AgentCard
              title="Photo Analysis Agent"
              desc="Processes drone imagery and ground photos using YOLO (Ultralytics) for automated object detection."
              icon="📷"
            />
            <AgentCard
              title="Interview Agent"
              desc="Analyzes witness interviews and transcripts to extract actionable clues and timeline data."
              icon="🎙️"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// Simple helper component for the grid
function AgentCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#1f2933",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #374151",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "16px" }}>{icon}</div>
      <h4 style={{ color: "white", fontSize: "1.2rem", margin: "0 0 12px 0" }}>
        {title}
      </h4>
      <p
        style={{
          color: "#9ca3af",
          margin: 0,
          lineHeight: "1.5",
          fontSize: "0.95rem",
        }}
      >
        {desc}
      </p>
    </div>
  );
}
