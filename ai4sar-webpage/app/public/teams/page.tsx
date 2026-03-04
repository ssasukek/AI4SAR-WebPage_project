"use client";

export default function TeamsPage() {
  return (
    <div className="page" style={{ display: "flex", flexDirection: "column" }}>
      <main className="middle-layer">
        <section className="hero-text" style={{ marginBottom: "10px" }}>
          <h1 className="hero-title">Meet the Team</h1>
          <p className="hero-subtitle">
            The students, faculty, and researchers behind AI4SAR
          </p>
        </section>

        <section className="about">
          <h2>Our Team</h2>
          <p>
            <li>
              <strong>Dr. Franz J. Kurfess</strong> - Faculty Advisor, Cal Poly
              CSSE
            </li>
            <li>
              <strong>Gary Bloom</strong> - SAR Leader & Cal Poly Alumnus
            </li>
            <li>
              <strong>Dr. Chris Young</strong> - SAR Leader & Cal Poly Alumnus
            </li>
            <li>
              <strong>Dr. Bob Koester</strong> - Creator of the ISRID Data Set
            </li>
          </p>

          <h2>History</h2>
          <p>Started in the summer of 2021 through private funding</p>

          <h2>Student</h2>
          <p>...</p>
        </section>
      </main>
    </div>
  );
}
