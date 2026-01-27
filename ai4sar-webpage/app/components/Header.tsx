"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside of it
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
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
            <Link className="dropdown-item" href="/">
              Home
            </Link>
            <Link className="dropdown-item" href="/public/background">
              Background
            </Link>
            <Link className="dropdown-item" href="/public/dashboard">
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
