"use client";

import { useState, useRef, useEffect } from "react";

export default function BackgroundPage() {
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
      <main className="content">
        <section className="hero">
          <h1>Research Background</h1>
          <p className="subtitle">
            Deep dive into the technical details, dataset sources, and
            methodology.
          </p>
        </section>

        <section className="about">
          <h2>Technical Context</h2>
          <p>[Technical details placeholder...]</p>

          <h2>Methodology</h2>
          <p>[Methodology placeholder...]</p>
        </section>
      </main>
    </div>
  );
}
