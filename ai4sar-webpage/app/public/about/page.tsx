"use client";

import { useState, useRef, useEffect } from "react";

export default function AboutPage() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu on click outside
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
      {/* Top Navigation Bar */}
      <header className="topbar">
        <div className="logo">AI4SAR</div>

        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
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
              <a className="dropdown-item" href="/public/background">
                Background
              </a>
              <a className="dropdown-item" href="/public/dashboard">
                Dashboard
              </a>
            </div>
          )}
        </div>
      </header>

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

      <footer className="bottom-layer">
        <div className="footer-content">
          {/* column 1 */}
          <div className="footer-col">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li>
                <a href="/public/background">Project Background</a>
              </li>
              <li>
                <a href="/public/docs">Documentation</a>
              </li>
              <li>
                <a href="/public/reserve">Reserve Page</a>
              </li>
            </ul>
          </div>
          {/* column 2 */}
          <div className="footer-col">
            <h4>Team Access</h4>
            <ul className="footer-links">
              <li>
                <a href="/public/teams">View Members</a>
              </li>
              <li>
                <a href="/public/login" className="login-link">
                  Member Login &rarr;
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="copyright">
          &copy; {new Date().getFullYear()} AI4SAR Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
