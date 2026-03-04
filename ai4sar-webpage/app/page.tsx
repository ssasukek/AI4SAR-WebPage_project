"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page" style={{ display: "flex", flexDirection: "column" }}>
      <main className="middle-layer">
        <section className="hero-text">
          <h1 className="hero-title">AI for Search and Rescue</h1>
          <p className="hero-subtitle">
            Our goal is to improve the time and probability of locating the
            missing subject
          </p>
        </section>
      </main>

      <div className="section-header">
        <h2>Our Systems & Research Teams</h2>
      </div>

      <div className="story-container">
        {/* dashboard grid */}
        <section className="feature-row">
          <div className="feature-visual" style={{ backgroundImage: "url" }} />
          <div className="feature-text">
            <span className="feature-label">Command Center</span>
            <h2>IntelliSAR Dashboard</h2>
            <p>
              Transitioning SAR operations from paper forms to a real-time
              digital command center. We empower Incident Commanders with
              intelligent resource allocation, live tracking, and instant data
              synchronization.
            </p>
            <Link href="/public/dashboard" className="feature-link">
              View Dashboard &rarr;
            </Link>
          </div>
        </section>

        {/* Deep learning Grid Team */}
        <section className="feature-row reverse">
          <div className="feature-visual" style={{ backgroundImage: "url" }} />
          <div className="feature-text">
            <span className="feature-label">Predictive Modeling</span>
            <h2>Deep Learning</h2>
            <p> in progress... </p>
            <Link href="/teams/deep-learning" className="feature-link">
              Explore the Model &rarr;
            </Link>
          </div>
        </section>

        {/* Agentic AI Grid */}
        <section className="feature-row">
          <div className="feature-visual" style={{ backgroundImage: "url" }} />
          <div className="feature-text">
            <span className="feature-label">Automated Intelligence</span>
            <h2>Agentic AI & LLMs</h2>
            <p> in progress... </p>
            <Link href="/teams/agentic-ai" className="feature-link">
              See the AI in Action &rarr;
            </Link>
          </div>
        </section>

        {/* Visualization - Heatmaps */}
        <section className="feature-row reverse">
          <div
            className="feature-visual"
            style={{ backgroundImage: "url('/blue-gradient-bg.png')" }}
          />
          <div className="feature-text">
            <span className="feature-label">Mapping & GIS</span>
            <h2>Heatmap Visualization</h2>
            <p> in progress... </p>
            <Link href="/teams/visualization" className="feature-link">
              Explore Maps &rarr;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
