"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "./dashboard.css";

type IncidentData = {
  incidentName: string;
  incidentNumber: number | string;
  incidentDate: string;
};

type Incident = {
  id: string;
  incidentName: string;
  incidentNumber?: string | number;
  incidentDate?: string;
};

function IncidentCard({ incident }: { incident: Incident }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="incident-card-btn"
      onClick={() => router.push(`/public/dashboard/${incident.id}`)}
    >
      <article className="incident-card">
        <div className="incident-card-top">
          <div className="incident-title" title={incident.incidentName}>
            {incident.incidentName?.length > 24
              ? incident.incidentName.substring(0, 24) + "..."
              : incident.incidentName || "Untitled Incident"}
          </div>
        </div>

        <div className="incident-card-bottom">
          <div className="incident-row">
            <b>Incident Name:</b>
            <br />
            {incident.incidentName}
          </div>
          <div className="incident-row">
            <b>Incident Number:</b>
            <br />
            {incident.incidentNumber ?? ""}
          </div>
          <div className="incident-row">
            <b>Incident Date:</b>
            <br />
            {incident.incidentDate ?? ""}
          </div>
        </div>
      </article>
    </button>
  );
}

export default function PublicDashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [display, setDisplay] = useState<Incident[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Sort by Name ASC");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/public/incidents", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch incidents");
        const data: Incident[] = await res.json();

        if (!alive) return;
        setIncidents(data);
        setDisplay(
          [...data].sort((a, b) =>
            a.incidentName.localeCompare(b.incidentName),
          ),
        );
      } catch {
        if (!alive) return;
        setIncidents([]);
        setDisplay([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return display.filter((x) =>
      x.incidentName?.toLowerCase().includes(s),
    );
  }, [display, searchTerm]);

  const sortedNamesASC = useMemo(
    () =>
      [...incidents].sort((a, b) =>
        a.incidentName.localeCompare(b.incidentName),
      ),
    [incidents],
  );
  const sortedNamesDESC = useMemo(
    () =>
      [...incidents].sort((a, b) =>
        b.incidentName.localeCompare(a.incidentName),
      ),
    [incidents],
  );
  const sortedDateOldest = useMemo(
    () =>
      [...incidents].sort((a, b) =>
        (a.incidentDate || "").localeCompare(b.incidentDate || ""),
      ),
    [incidents],
  );
  const sortedDateLatest = useMemo(
    () =>
      [...incidents].sort((a, b) =>
        (b.incidentDate || "").localeCompare(a.incidentDate || ""),
      ),
    [incidents],
  );

  return (
    <div className="page">
      <div className="dash_content">
        <section className="hero" style={{ textAlign: "center" }}>
          <h1>Incidents</h1>
        </section>

        <div className="dashboard-controls">
          <input
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search incidents..."
          />

          <select
            className="form-select"
            value={filter}
            onChange={(e) => {
              const v = e.target.value;
              setFilter(v);
              if (v === "Sort by Name ASC") setDisplay(sortedNamesASC);
              if (v === "Sort by Name DESC") setDisplay(sortedNamesDESC);
              if (v === "Sort by Oldest Date") setDisplay(sortedDateOldest);
              if (v === "Sort by Latest Date") setDisplay(sortedDateLatest);
            }}
          >
            <option>Sort by Name ASC</option>
            <option>Sort by Name DESC</option>
            <option>Sort by Oldest Date</option>
            <option>Sort by Latest Date</option>
          </select>
        </div>

        <div className="incident-grid">
          {loading ? (
            <div className="viewer-loading">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="viewer-loading">No incidents found.</div>
          ) : (
            filtered.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
