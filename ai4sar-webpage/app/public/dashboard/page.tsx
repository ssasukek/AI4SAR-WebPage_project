"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
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
  const { isSignedIn } = useAuth(); // <-- Check if user is logged in

  // Generate a generic operational name for public display
  const publicName = `SAR Operation ${incident.id.substring(0, 6).toUpperCase()}`;

  // Decide which name to show based on auth state
  const displayTitle = isSignedIn
    ? incident.incidentName || "Untitled Incident"
    : publicName;

  return (
    <button
      type="button"
      className="incident-card-btn"
      onClick={() => router.push(`/public/dashboard/${incident.id}`)}
    >
      <article className="incident-card">
        <div
          className="incident-card-top"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="incident-title" title={displayTitle}>
            {displayTitle.length > 24
              ? displayTitle.substring(0, 24) + "..."
              : displayTitle}
          </div>
          {/* Only show the lock icon if the user is NOT signed in */}
          {!isSignedIn && <Lock size={16} style={{ color: "var(--gold)" }} />}
        </div>

        <div className="incident-card-bottom">
          <div className="incident-row">
            <b>Incident Name:</b>
            <br />
            {isSignedIn ? (
              incident.incidentName
            ) : (
              <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                [REDACTED FOR PRIVACY]
              </span>
            )}
          </div>
          <div className="incident-row">
            <b>Incident Number:</b>
            <br />
            {incident.incidentNumber ?? "N/A"}
          </div>
          <div className="incident-row">
            <b>Incident Date:</b>
            <br />
            {incident.incidentDate ?? "Unknown"}
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
  const { isSignedIn } = useAuth(); // <-- Get auth state for the header

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
    return display.filter((x) => x.incidentName?.toLowerCase().includes(s));
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
      <section
        className="hero"
        style={{ textAlign: "center", marginBottom: "24px" }}
      >
        <h1>{isSignedIn ? "Incident Command Logs" : "Public Incident Logs"}</h1>

        {!isSignedIn && (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              marginTop: "8px",
            }}
          >
            Viewing structural data only. Personally Identifiable Information
            (PII) is hidden.
          </p>
        )}

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            marginTop: "12px",
            fontStyle: "italic",
          }}
        >
          Note: This is a public demonstration environment and is not used for
          live operations. For the official AI4SAR operational dashboard, please
          visit{" "}
          <a 
            href="https://intelisar-calpoly.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--gold)", textDecoration: "underline" }}
          >
            here
          </a>
          .
        </p>
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
