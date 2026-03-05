"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "../dashboard.css";

type Incident = {
  id: string;
  incidentName?: string;
  incidentNumber?: string | number;
  incidentDate?: string;
  timestamp: string;

  missingPersonName: string;
  missingPersonAge: string;
  missingPersonSex: string;
  missingPersonAlert: string;
  missingPersonPls: string;
  photoURL: string;

  commandPostLocation: string;
  commandPostLatitude: string;
  commandPostLongitude: string;
  commandPostTelephone: string;

  reportingPersonName: string;
  reportingPersonPhone: string;
  sheriffName: string;
  sheriffPhoneNumber: string;

  clues?: any[];
  resources?: any[];
};

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="viewer-panel">
      <div className="viewer-panel-title">{title}</div>
      <div className="viewer-panel-body">{children}</div>
    </div>
  );
}

export default function IncidentViewer({ incidentId }: { incidentId: string }) {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/incidents/${incidentId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (alive) setIncident(data);
      } catch {
        if (alive) setIncident(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [incidentId]);

  const title = incident?.incidentName ?? "Incident";

  return (
    <div className="page">
      <main className="dash_content">
        <section className="hero" style={{ textAlign: "center" }}>
          <h1>{title}</h1>
        </section>

        {/* Tabs: Dashboard + AI Insight */}
        <div className="viewer-tabs">
          <Link
            className="viewer-tab active"
            href={`/public/dashboard/${incidentId}`}
          >
            Dashboard
          </Link>
          <Link
            className="viewer-tab"
            href={`/public/dashboard/${incidentId}/ai`}
          >
            AI Insight
          </Link>
        </div>

        {loading ? (
          <div className="viewer-loading">Loading…</div>
        ) : !incident ? (
          <div className="viewer-loading">Incident not found.</div>
        ) : (
          <div className="viewer-grid">
            <Panel title="Missing Person Information">
              <div className="viewer-subject">
                <div className="viewer-photo">
                  {incident.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={incident.photoURL}
                      alt={incident.missingPersonName}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="viewer-photo-empty">No photo provided</div>
                  )}
                </div>

                <div className="viewer-kv">
                  <div>
                    <b>Name:</b> {incident.missingPersonName ?? "not specified"}
                  </div>
                  <div>
                    <b>Age:</b> {incident.missingPersonAge ?? "not specified"}
                  </div>
                  <div>
                    <b>Sex:</b> {incident.missingPersonSex ?? "not specified"}
                  </div>
                  <div>
                    <b>Alert Type:</b>{" "}
                    {incident.missingPersonAlert ?? "not specified"}
                  </div>
                  <div>
                    <b>Last Seen:</b>{" "}
                    {incident.missingPersonPls ?? "not specified"}
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Timeline">
              <div className="viewer-box">
                <div className="viewer-row">
                  <b>Reported Missing:</b>
                  <span>
                    {incident.timestamp || incident.incidentDate || "Unknown"}
                  </span>
                </div>
                <div className="viewer-row">
                  <b>Time Since Last Seen:</b>
                  <span>Unknown</span>
                </div>
                <div className="viewer-muted" style={{ marginTop: "12px" }}>
                  <b>SAR Arrived:</b> No agencies have arrived yet.
                </div>
              </div>
            </Panel>

            <Panel title="Command Post Location">
              <div className="viewer-box">
                <div className="viewer-row">
                  <b>Location:</b>
                  <span>{incident.commandPostLocation || "TBD"}</span>
                </div>
                <div className="viewer-row">
                  <b>Latitude:</b>
                  <span>{incident.commandPostLatitude || "N/A"}</span>
                </div>
                <div className="viewer-row">
                  <b>Longitude:</b>
                  <span>{incident.commandPostLongitude || "N/A"}</span>
                </div>
                <div className="viewer-row">
                  <b>CP Phone:</b>
                  <span>{incident.commandPostTelephone || "N/A"}</span>
                </div>
              </div>
              
              {incident.commandPostLatitude && incident.commandPostLongitude ? (
                <div
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #374151",
                  }}
                >
                  <iframe
                    width="100%"
                    height="300"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${incident.commandPostLatitude},${incident.commandPostLongitude}&z=15&output=embed`}
                  ></iframe>
                </div>
              ) : (
                <div
                  className="viewer-muted"
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    border: "1px dashed #374151",
                    borderRadius: "8px",
                  }}
                >
                  No valid coordinates available to generate map.
                </div>
              )}{" "}
            </Panel>

            <Panel title="Key Contacts">
              <div className="viewer-box">
                <div
                  className="viewer-row"
                  style={{
                    borderBottom: "1px solid #374151",
                    paddingBottom: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <b>Sheriff in Charge:</b>
                  <span>
                    {incident.sheriffName || "N/A"} (
                    {incident.sheriffPhoneNumber})
                  </span>
                </div>
                <div className="viewer-row">
                  <b>Reporting Person:</b>
                  <span>
                    {incident.reportingPersonName || "N/A"} (
                    {incident.reportingPersonPhone})
                  </span>
                </div>
              </div>
            </Panel>

            <Panel title="Clues">
              {incident.clues && incident.clues.length > 0 ? (
                incident.clues.map((clue, idx) => (
                  <div
                    key={idx}
                    className="viewer-box"
                    style={{ marginBottom: "8px" }}
                  >
                    <div className="viewer-row">
                      <b>Item:</b> <span>{clue.item || "Unknown"}</span>
                    </div>
                    <div className="viewer-row">
                      <b>Found By:</b> <span>{clue.team || "Unknown"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="viewer-muted">No clues logged yet.</div>
              )}
            </Panel>

            <Panel title="Weather">
              <div className="viewer-weather">Weather unavailable</div>
            </Panel>
          </div>
        )}
      </main>
    </div>
  );
}
