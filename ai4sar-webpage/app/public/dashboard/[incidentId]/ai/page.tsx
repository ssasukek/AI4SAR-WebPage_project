"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import "../../dashboard.css";

export default function AIInsightPage() {
  const params = useParams<{ incidentId: string }>();
  const incidentId = params?.incidentId;
  const { isSignedIn } = useAuth();

  return (
    <div className="incident-container">
      <header className="incident-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "var(--gold)",
              borderRadius: 8,
            }}
          ></div>
          <div>
            <h1 style={{ fontSize: "1.1rem", margin: 0 }}>Clue Meister</h1>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Search and Rescue AI Assistant
            </span>
          </div>
        </div>
        <span style={{ fontSize: "0.8rem", color: "#22c55e" }}>
          ● New Session
        </span>
      </header>

      <nav
        className="viewer-tabs"
        style={{
          padding: "0 40px",
          background: "#0c0d0d",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <Link href={`/public/dashboard/${incidentId}`} className="viewer-tab">
          Dashboard
        </Link>
        <Link
          href={`/public/dashboard/${incidentId}/ai`}
          className="viewer-tab active"
        >
          AI Insight
        </Link>
      </nav>

      <main className="ai-grid">
        <section className="chat-window">
          <div className="chat-bubble bubble-bot">
            Hello! I will help you through this incident. Ask me about subject
            behavior, estimated man hours, or priority level.
          </div>
          <div
            className="chat-bubble bubble-user"
            style={{ alignSelf: "flex-end" }}
          >
            What do the current agents tell us about this group?
          </div>
          <div className="chat-bubble bubble-bot">
            <b>Wander Behavior:</b> Subject likely <b>wandered</b> from their
            last known position.
            <br />
            <br />
            <b>Priority Predictor:</b> Moderate response level. Risk is real and
            growing...
          </div>

          <div style={{ marginTop: "auto", display: "flex", gap: "12px" }}>
            <input
              placeholder="Describe a SAR Situation or ask a question..."
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-light)",
                background: "#0c0d0d",
                color: "white",
              }}
            />
            <button
              style={{
                padding: "0 24px",
                background: "var(--gold)",
                color: "white",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Send
            </button>
          </div>
        </section>

        <section className="insight-sidebar">
          <div className="model-card">
            <h3 style={{ marginTop: 0, fontSize: "1.1rem" }}>
              Wander Behavior
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Predicts whether the subject likely wandered or stayed near PLS.
            </p>
            <div
              style={{
                background: "#1f2933",
                padding: "12px",
                borderRadius: 8,
                marginTop: 12,
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Current Prediction
              </span>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--gold)",
                }}
              >
                Wandered
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <h4 style={{ fontSize: "0.9rem", marginBottom: 8 }}>
                How the model works
              </h4>
              <ul
                style={{
                  fontSize: "0.85rem",
                  paddingLeft: 16,
                  color: "var(--text-muted)",
                }}
              >
                <li>Retrieves subject records</li>
                <li>Derives group features</li>
                <li>Runs wander classifier</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
