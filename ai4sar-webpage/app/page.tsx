"use client";

import { useState, useRef, useEffect } from "react";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column" }}>
      <main className="middle-layer">
        <section className="hero-text">
          <h1>AI for Search and Rescue</h1>
          <p className="subtitle">subtitle</p>
        </section>

        <div className="info-grid">
          <div className="grid-card">
            <div className="card-image" />
            <div className="card-content">
              <h3>Header 1</h3>
              <p>Info</p>
            </div>
          </div>

          <div className="grid-card">
            <div className="card-image" />
            <div className="card-content">
              <h3>Header 2</h3>
              <p>Info</p>
            </div>
          </div>

          <div className="grid-card">
            <div className="card-image" />
            <div className="card-content">
              <h3>Header 3</h3>
              <p>Info</p>
            </div>
          </div>

          <div className="grid-card">
            <div className="card-image" />
            <div className="card-content">
              <h3>Header 4</h3>
              <p>Info</p>
            </div>
          </div>

          <div className="grid-card">
            <div className="card-image" />
            <div className="card-content">
              <h3>Header 5</h3>
              <p>Info</p>
            </div>
          </div>

          <div className="grid-card">
            <div className="card-image" />
            <div className="card-content">
              <h3>Header 6</h3>
              <p>Info</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
