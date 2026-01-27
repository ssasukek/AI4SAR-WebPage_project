"use client";

import { useState, useRef, useEffect } from "react";

export default function TeamsPage() {
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
      {/* Main Content */}
      <main className="content">
        <section className="hero">
          <h1>Meet the Team</h1>
          <p className="subtitle">
            The students, faculty, and researchers behind AI4SAR.
          </p>
        </section>

        <section className="about">
          <h2>Faculty Advisors</h2>
          <p>[Advisor profiles placeholder...]</p>

          <h2>Student Researchers</h2>
          <p>[Student list placeholder...]</p>

          <h2>Collaborators</h2>
          <p>[SAR Partners placeholder...]</p>
        </section>
      </main>
    </div>
  );
}
