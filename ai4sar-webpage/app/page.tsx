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
          <div
            className="feature-visual"
            style={{ backgroundImage: "url('/img/img1.png')" }}
          />
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
          <div
            className="feature-visual"
            style={{ backgroundImage: "url('/img/img2.jpg')" }}
          />
          <div className="feature-text">
            <span className="feature-label">Predictive Modeling</span>
            <h2>Deep Learning</h2>
            <p>
              Powered by historical incident data from ISRID, our predictive
              models analyze demographic and environmental factors to forecast
              missing person behavior. This suite includes k-NN wander
              prediction, resource estimation, and XGBoost urgency scoring to
              help command teams deploy resources effectively.
            </p>
            <Link href="/public/deep-learning" className="feature-link">
              Explore the Model &rarr;
            </Link>
          </div>
        </section>

        {/* Agentic AI Grid */}
        <section className="feature-row">
          <div
            className="feature-visual"
            style={{ backgroundImage: "url('/img/img3.jpg')" }}
          />
          <div className="feature-text">
            <span className="feature-label">Automated Intelligence</span>
            <h2>Agentic AI & LLMs</h2>
            <p>
              Our Multi-Agent System (MAS) orchestrates specialized Large
              Language Models to assist in real-time operational tasks. From
              acting as an Interview Helper to synthesizing field clues, these
              autonomous agents communicate seamlessly to provide actionable,
              data-driven insights.
            </p>
            <Link href="/public/agentic-research" className="feature-link">
              See the AI in Action &rarr;
            </Link>
          </div>
        </section>

        {/* Visualization - Heatmaps */}
        <section className="feature-row reverse">
          <div
            className="feature-visual"
            style={{ backgroundImage: "url('/img/img4.jpg')" }}
          />
          <div className="feature-text">
            <span className="feature-label">Mapping & GIS</span>
            <h2>Heatmap Visualization</h2>
            <p>
              Transforming complex AI probability data into intuitive visual
              search tools. This module overlays behavioral heatmaps and
              predictive containment boundaries directly onto topographical
              grids, optimizing search paths and guiding field teams to
              high-probability zones.
            </p>
            <Link href="/public/heatmaps" className="feature-link">
              Explore Maps &rarr;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
