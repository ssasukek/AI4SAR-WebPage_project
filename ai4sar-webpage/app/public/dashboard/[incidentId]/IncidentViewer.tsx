"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "../dashboard.css";


export default function IncidentProfilePage() {
  const params = useParams<{ incidentId: string }>();
  const incidentId = params?.incidentId;
  const { isSignedIn } = useAuth();
  const [incident, setIncident] = useState<any>(null);

  useEffect(() => {
    if (!incidentId) return;
    fetch(`/api/public/incidents/${incidentId}`)
      .then((res) => res.json())
      .then((data) => setIncident(data));
  }, [incidentId]);

  if (!incident) return <div className="page">Loading...</div>;

  const displayValue = (val: any) =>
    isSignedIn ? (
      val || "Not specified"
    ) : (
      <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
        [REDACTED]
      </span>
    );

  return (
    <div className="incident-container">
      <header className="incident-header">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          {isSignedIn
            ? incident.incidentName
            : `Operation ${incidentId?.slice(0, 6).toUpperCase()}`}
        </h1>
        {/* Removed "Create Searcher Profile" and "Edit Incident Info" buttons here */}
      </header>

      <div className="meta-bar">
        <span>
          <b>Last Seen:</b> {incident.incidentDate || "Unknown"}
        </span>
        <span>
          <b>Time Since Last Seen:</b> Unknown
        </span>
        <span>
          <b>Reported Missing:</b> {incident.timestamp || "N/A"}
        </span>
      </div>

      <nav
        className="viewer-tabs"
        style={{
          padding: "0 40px",
          background: "#0c0d0d",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <Link
          href={`/public/dashboard/${incidentId}`}
          className="viewer-tab active"
        >
          Dashboard
        </Link>
        <Link
          href={`/public/dashboard/${incidentId}/ai`}
          className="viewer-tab"
        >
          AI Insight
        </Link>
      </nav>

      <main className="profile-grid">
        <section className="case-sidebar">
          <div className="sub-tabs">
            <span className="sub-tab active">Case Info</span>
            <span className="sub-tab">Clues</span>
            <span className="sub-tab">Weather</span>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {isSignedIn && incident.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={incident.photoURL}
                alt="Subject"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  height: "300px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  background: "#1f2933",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                }}
              >
                {isSignedIn ? "No photo provided" : "Photo Protected"}
              </div>
            )}
            <h2 style={{ fontSize: "1.8rem", margin: 0 }}>
              {displayValue(incident.missingPersonName)}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <b>Age:</b> {displayValue(incident.missingPersonAge)}
              </div>
              <div>
                <b>Sex:</b> {displayValue(incident.missingPersonSex)}
              </div>
              <div>
                <b>Height:</b> Not specified
              </div>
              <div>
                <b>Weight:</b> Not specified
              </div>
            </div>
            <p>
              <b>Clothing Description:</b> Not specified
            </p>
          </div>
        </section>

        <section className="map-area" style={{ background: "#1f2933" }}>
          {!isSignedIn ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
              }}
            >
              Map data restricted in public view.
            </div>
          ) : incident.commandPostLatitude && incident.commandPostLongitude ? (
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${incident.commandPostLatitude},${incident.commandPostLongitude}&z=14&output=embed`}
            ></iframe>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
              }}
            >
              No coordinate data available for this incident.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
