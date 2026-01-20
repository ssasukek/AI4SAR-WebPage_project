export default function HomePage() {
  return (
    <div className="page">
      {/* Top Navigation Bar */}
      <header className="topbar">
        <div className="logo">AI4SAR</div>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search AI4SAR..."
            className="search-input"
          />
        </div>

        {/* Menu */}
        <div className="menu">
          <div className="menu-icon">
            <span />
            <span />
            <span />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content">
        <section className="hero">
          <h1>AI for Search and Rescue</h1>
          <p className="subtitle">
            AI4SAR is a research initiative focused on supporting Search and
            Rescue operations through intelligent data analysis, visualization,
            and decision-support tools.
          </p>
        </section>

        <section className="about">
          <h2>About AI4SAR</h2>
          <p>
            The AI4SAR project explores the integration of artificial
            intelligence into search and rescue workflows. By combining
            historical incident data, geospatial information, and machine
            learning models, the system aims to enhance situational awareness
            and support human decision-making during time-critical missions.
          </p>

          <p>
            This web platform serves as a public-facing interface for the
            project, providing background information, research context, and a
            foundation for interactive dashboards and future AI-driven
            demonstrations.
          </p>
        </section>
      </main>
    </div>
  );
}
