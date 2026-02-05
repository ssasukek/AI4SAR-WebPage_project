"use client";

import { useState, useRef, useEffect } from "react";

export default function AboutPage() {
  return (
    <div className="page">
      {/* Main Content Area */}
      <main className="content">
        <section className="hero">
          <h1>About the Project</h1>
          <p className="subtitle">
            Information about the team, the collaboration, and the goals of
            AI4SAR.
          </p>
        </section>

        <section className="about">
          <h2>Our Team</h2>
          <p>[Team content placeholder...]</p>

          <h2>History</h2>
          <p>[History content placeholder...]</p>
        </section>
      </main>
    </div>
  );
}
