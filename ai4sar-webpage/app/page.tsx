"use client";

export default function HomePage() {
  return (
    <div className="page" style={{ display: "flex", flexDirection: "column" }}>
      <main className="middle-layer">
        <section className="hero-text">
          <h1>AI for Search and Rescue</h1>
          <p className="subtitle">subtitle</p>
        </section>

        <div className="info-grid">
          <div className="grid-card">
            <div className="card-image" />
            <div className="card-content">
              <h3>Header 1</h3>
              <p>Info</p>
            </div>
          </div>

          <div className="grid-card">
            <div className="card-image" />
            <div className="card-content">
              <h3>Header 2</h3>
              <p>Info</p>
            </div>
          </div>

          <div className="grid-card">
            <div className="card-image" />
            <div className="card-content">
              <h3>Header 3</h3>
              <p>Info</p>
            </div>
          </div>

          <div className="grid-card">
            <div className="card-image" />
            <div className="card-content">
              <h3>Header 4</h3>
              <p>Info</p>
            </div>
          </div>

          <div className="grid-card">
            <div className="card-image" />
            <div className="card-content">
              <h3>Header 5</h3>
              <p>Info</p>
            </div>
          </div>

          <div className="grid-card">
            <div className="card-image" />
            <div className="card-content">
              <h3>Header 6</h3>
              <p>Info</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
