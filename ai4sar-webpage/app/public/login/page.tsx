"use client";

import "./login.css";
import "../register/register.css";
import { useState, useRef, useEffect } from "react";

export default function LoginPage() {
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
    <div className="page" style={{ display: "flex", flexDirection: "column" }}>
      <main className="middle-layer">
        <section className="login-section">
          <div className="login-card">
            <h1>Welcome Back</h1>
            <p className="login-subtitle">
              Sign in to access the SAR dashboard
            </p>

            {/* This should support google login */}
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="name@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="•••••••••••"
                />
              </div>

              <button type="submit" className="login-btn">
                Sign In
              </button>

              <div className="divider">
                <span>Or continue with</span>
              </div>

              <div className="token-buttons">
                <button
                  type="button"
                  className="register-btn"
                  onClick={() => alert("Redirecting to Google")}
                >
                  <img
                    src="/google-icon.svg"
                    alt="Google"
                    className="token-icon"
                  />
                  Continue with Google
                </button>

                <button
                  type="button"
                  className="register-btn"
                  onClick={() => alert("Redirecting to Outlook")}
                >
                  <img
                    src="/outlook.svg"
                    alt="Outlook"
                    className="token-icon"
                  />
                  Continue with Outlook
                </button>
              </div>

              <div className="form-footer">
                <a href="/public/forgot-password" className="form-link">
                  Forgot password?
                </a>
                <span style={{ margin: "0 8px" }}>•</span>
                <a href="/public/register" className="form-link">
                  Request Access
                </a>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
