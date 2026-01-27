"use client";

import "./dashboard.css";

export default function DashboardPage() {
  // Dummy data
  const incidents = [
    {
      id: 1,
      name: "3 year old missing by river",
      number: "2025-04-16",
      date: "2025-04-16",
    },
  ];

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column" }}>
      <main className="middle-layer">
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ color: "white", marginBottom: "8px" }}>Incidents</h1>
          <p
            className="subtitle"
            style={{ margin: "0", textAlign: "left", maxWidth: "100%" }}
          >
            Manage active and past search operations.
          </p>
        </div>

        <div className="incident-grid">
          {incidents.map((item) => (
            <div key={item.id} className="incident-card">
              <div className="card-top">
                <h3>{item.name}</h3>
              </div>

              <div className="card-bottom">
                <div className="card-row">
                  <span className="card-label">Incident Name:</span>
                  <span>{item.name}</span>
                </div>
                <div className="card-row">
                  <span className="card-label">Incident Number:</span>
                  <span>{item.number}</span>
                </div>
                <div className="card-row">
                  <span className="card-label">Incident Date:</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
