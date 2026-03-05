"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

const defaultContent = `<h2>Our Team</h2>
<ul>
  <li><strong>Dr. Franz J. Kurfess</strong> - Faculty Advisor, Cal Poly CSSE</li>
  <li><strong>Gary Bloom</strong> - SAR Leader & Cal Poly Alumnus</li>
  <li><strong>Dr. Chris Young</strong> - SAR Leader & Cal Poly Alumnus</li>
  <li><strong>Dr. Bob Koester</strong> - Creator of the ISRID Data Set</li>
</ul>

<h2>History</h2>
<p>Started in the summer of 2021 through private funding</p>

<h2>Student</h2>
<p>...</p>`;

export default function TeamsPage() {
  const { isSignedIn } = useAuth();

  const [content, setContent] = useState(defaultContent);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch the content from Firebase on page load
  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch("/api/content?pageId=teams");
        const data = await res.json();
        if (data.content) {
          setContent(data.content);
        }
      } catch (error) {
        console.error("Failed to load content", error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  // Save edits to Firebase
  const handleSave = async () => {
    setIsEditing(false);
    setLoading(true);

    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: "teams", content }),
      });
    } catch (error) {
      console.error("Failed to save content", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column" }}>
      <main className="middle-layer">
        <section
          className="hero-text"
          style={{ marginBottom: "10px", position: "relative" }}
        >
          <h1 className="hero-title">Meet the Team</h1>
          <p className="hero-subtitle">
            The students, faculty, and researchers behind AI4SAR
          </p>

          {isSignedIn && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Edit Content
            </button>
          )}
        </section>

        <section className="about">
          {loading ? (
            <div className="viewer-loading">Loading content...</div>
          ) : isEditing ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "400px",
                  padding: "16px",
                  borderRadius: "8px",
                  backgroundColor: "#0c0d0d",
                  color: "#ffffff",
                  border: "1px solid #4b5563",
                  fontFamily: "monospace",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#374151",
                    color: "white",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#10b981",
                    color: "white",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </section>
      </main>
    </div>
  );
}
