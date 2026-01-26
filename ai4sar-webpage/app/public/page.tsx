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
    <div className="page">
      <header className="topbar">
        <div className="logo">AI4SAR</div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search AI4SAR..."
            className="search-input"
          />
        </div>

        <div className="menu" ref={menuRef}>
          <button
            className="menu-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>

          {open && (
            <div className="dropdown">
              <a className="dropdown-item" href="/">
                Home
              </a>
              <a className="dropdown-item" href="/background">
                Background
              </a>
              <a className="dropdown-item" href="/dashboard">
                Dashboard
              </a>
              <a className="dropdown-item" href="/login">
                Members
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="content">
        <section className="hero">
          <h1>AI for Search and Rescue</h1>
          <p className="subtitle">
            By using machine learning and deep learning to transform search and
            resuce from paper based operations into a data intelligent system
            that helps locate missing persons more efficiently.
          </p>
        </section>

        <section className="about">
          <h2>What is AI4SAR</h2>
          <p>
            The AI4SAR is a comprehensive research project and developed at Cal
            Poly San Luis Obispo that applies artificial intelligence techniques
            to enhance Search and Rescue (SAR) operations. It's a collaboration
            between students in the Computer Science Department and the local
            SAR community, that aimed to modernize and improve the efficiency of
            how resuce team locate missing persons.
          </p>

          <p>
            This web platform serves as a public-facing interface for the
            project, providing background information, research context, and a
            foundation for interactive dashboards and future AI-driven
            demonstrations.
          </p>

          <h2>The Problem it Solves</h2>
          <p>
            Current State of SAR: - Mostly paper based system with dozen of
            physical maps and notes and forms. -
          </p>
        </section>
      </main>
    </div>
  );
}
