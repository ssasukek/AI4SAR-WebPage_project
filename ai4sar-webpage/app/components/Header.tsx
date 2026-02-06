"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Close menu when clicking outside of it
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="topbar">
      <Link className="logo" href="/">
        AI4SAR
      </Link>

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
            <Link className="dropdown-item" href="/" onClick={closeMenu}>
              Home
            </Link>
            <Link
              className="dropdown-item"
              href="/public/background"
              onClick={closeMenu}
            >
              Background
            </Link>
            <Link
              className="dropdown-item"
              href="/public/about"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              className="dropdown-item"
              href="/public/dashboard"
              onClick={closeMenu}
            >
              Dashboard
            </Link>

            <SignedIn>
              <Link
                className="dropdown-item"
                href="/private/dashboard"
                onClick={closeMenu}
              >
                Private Dashboard
              </Link>

              {isAdmin && (
                <Link
                  className="dropdown-item"
                  href="/private/admin/invite"
                  onClick={closeMenu}
                >
                  Invite Usage (Admin)
                </Link>
              )}
            </SignedIn>
          </div>
        )}
        {/* Profile icon appears next to dropdown ONLY when signed in */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
