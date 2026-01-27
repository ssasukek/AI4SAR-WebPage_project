"use client";

import "../login/login.css";
import "./register.css";
import { useState } from "react";

export default function RegisterPage() {
  const [token, setToken] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setToken(val);
    setIsValid(false);
    setError("");
  };

  // dummy test - change later on
  const handleVerify = () => {
    if (token.length >= 8 && token.startsWith("SAR-")) {
      setIsValid(true);
      setError("");
    } else {
      setIsValid(false);
      setError("Invalid");
    }
  };

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column" }}>
      <main className="middle-layer">
        <section className="login-section">
          <div className="login-card">
            <h1>Request Access</h1>
            <p className="login-subtitle">Enter token to unlock registration</p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label" htmlFor="token">
                  Team Access Token
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "stretch",
                  }}
                >
                  <div style={{ position: "relative", flex: 1 }}>
                    <input
                      type="text"
                      id="token"
                      className={`form-input ${isValid}`}
                      value={token}
                      onChange={handleTokenChange}
                      autoComplete="off"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleVerify();
                        }
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleVerify}
                    className="verify-btn"
                  >
                    Enter
                  </button>
                </div>

                {error && (
                  <small
                    style={{
                      color: "#ef4444",
                      marginTop: "6px",
                      display: "block",
                    }}
                  >
                    {error}
                  </small>
                )}

                {isValid && (
                  <small
                    style={{
                      color: "#10b981",
                      marginTop: "6px",
                      display: "block",
                    }}
                  >
                    Verify
                  </small>
                )}
              </div>

              <div className="divider">
                <span>Authentication Methods</span>
              </div>

              <div className="token-buttons">
                <button
                  className={`register-btn ${!isValid ? "btn-disabled" : ""}`}
                  disabled={!isValid}
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
                  className={`register-btn ${!isValid ? "btn-disabled" : ""}`}
                  disabled={!isValid}
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
                Already a member?{" "}
                <a href="/public/login" className="form-link">
                  Sign In
                </a>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
