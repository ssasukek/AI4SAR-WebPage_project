"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "../dashboard.css";

type Incident = {
  id: string;
  name?: string;
  incidentNumber?: string | number;
  incidentDate?: string;

  subject?: {
    name?: string;
    age?: string | number;
    sex?: string;
    height?: string;
    weight?: string;
    clothing?: string;
    photoUrl?: string;
  };

  clues?: {
    date?: string;
    time?: string;
    team?: string;
    initials?: string;
    lat?: string | number;
    long?: string | number;
  };
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

  const title = incident?.name;

  return (
    <div className="page">
      <main className="content">
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
            <Panel title="">
              <div className="viewer-subject">
                <div className="viewer-photo">
                  {incident.subject?.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={incident.subject.photoUrl} alt="Subject" />
                  ) : (
                    <div className="viewer-photo-empty">No photo</div>
                  )}
                </div>

                <div className="viewer-kv">
                  <div>
                    <b>Name:</b> {incident.subject?.name ?? "not specified"}
                  </div>
                  <div>
                    <b>Age:</b> {incident.subject?.age ?? "not specified"}
                  </div>
                  <div>
                    <b>Sex:</b> {incident.subject?.sex ?? "not specified"}
                  </div>
                  <div>
                    <b>Height:</b> {incident.subject?.height ?? "not specified"}
                  </div>
                  <div>
                    <b>Weight:</b> {incident.subject?.weight ?? "not specified"}
                  </div>
                  <div>
                    <b>Clothing Description:</b>{" "}
                    {incident.subject?.clothing ?? "not specified"}
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Clues">
              <div className="viewer-box">
                <div className="viewer-row">
                  <b>Date:</b>
                  <span>{incident.clues?.date ?? ""}</span>
                </div>
                <div className="viewer-row">
                  <b>Time:</b>
                  <span>{incident.clues?.time ?? ""}</span>
                </div>
                <div className="viewer-row">
                  <b>Lat:</b>
                  <span>{incident.clues?.lat ?? ""}</span>
                </div>
                <div className="viewer-row">
                  <b>Long:</b>
                  <span>{incident.clues?.long ?? ""}</span>
                </div>
                <div className="viewer-row">
                  <b>Team:</b>
                  <span>{incident.clues?.team ?? ""}</span>
                </div>
                <div className="viewer-row">
                  <b>Initials:</b>
                  <span>{incident.clues?.initials ?? ""}</span>
                </div>
              </div>
            </Panel>

            <Panel title="Map">
              <div className="viewer-map">No coordinates to display</div>
            </Panel>

            <Panel title="Resources">
              <div className="viewer-muted">No resources to display</div>
            </Panel>

            <Panel title="Timeline">
              <div className="viewer-box">
                <div className="viewer-row">
                  <b>Last Seen:</b>
                  <span>Unknown</span>
                </div>
                <div className="viewer-row">
                  <b>Time Since Last Seen:</b>
                  <span>Unknown</span>
                </div>
                <div className="viewer-row">
                  <b>Reported Missing:</b>
                  <span>Unknown</span>
                </div>
                <div className="viewer-muted">
                  <b>SAR Arrived:</b> No agencies have arrived yet.
                </div>
              </div>
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
