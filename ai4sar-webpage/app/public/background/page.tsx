"use client";

export default function BackgroundPage() {
  return (
    <div className="page">
      <main className="content">
        <section className="hero" style={{ textAlign: "center" }}>
          <h1>Research Background</h1>
          <p className="subtitle">
            Deep dive into the vision, origins, technical approach, and key
            research innovations behind AI4SAR.
          </p>
        </section>

        <section className="about">
          <h2>The Vision</h2>
          <p>
            Artificial Intelligence for Search &amp; Rescue (AI4SAR) represents
            a transformative approach to one of the most critical challenges in
            emergency response: finding missing persons efficiently and
            effectively. This initiative brings together cutting-edge artificial
            intelligence with decades of search and rescue expertise to
            revolutionize how SAR operations are conducted.
          </p>

          <h2>The Team &amp; Origins</h2>
          <p>
            AI4SAR is a collaborative partnership between California Polytechnic
            State University's Computer Science and Software Engineering
            Department and experienced search and rescue leaders. Founded in the
            summer of 2021 through private funding, the project has evolved into
            a comprehensive research initiative involving undergraduate and
            graduate students working alongside SAR veterans Gary Bloom and Dr.
            Chris Young. Under the guidance of Dr. Franz J. Kurfess, the AI4SAR
            Team is advancing the field through rigorous student-led research,
            senior capstone projects, and master's thesis work.
          </p>

          <h2>The Problem We&apos;re Solving</h2>
          <p>
            Today&apos;s search and rescue operations rely heavily on
            paper-based systems—dozens of forms developed by organizations like
            the Bay Area Search and Rescue Council (BaSARC) and FEMA. While
            invaluable, this approach makes real-time analysis overwhelming and
            inefficient. Information gets siloed, patterns go undetected, and
            critical decision-making happens without the full picture.
          </p>

          <h2>Our Solution: A Data-Driven Approach</h2>
          <p>
            AI4SAR transforms search and rescue through three strategic pillars:
          </p>

          <h3>1) Digital-First Data Collection</h3>
          <p>
            We&apos;re transitioning SAR operations from paper to intelligent
            digital systems, enabling real-time data capture and seamless
            information sharing.
          </p>

          <h3>2) Intelligent Data Enrichment</h3>
          <p>
            By combining on-the-ground observations with external
            intelligence—historical datasets like Dr. Bob Koester&apos;s ISRID
            database, mapping technology, GIS systems, and environmental data—we
            create a comprehensive operational picture that human
            decision-makers can act on immediately.
          </p>

          <h3>3) AI-Powered Optimization</h3>
          <p>
            Advanced machine learning, deep learning, and generative AI
            techniques analyze multi-modal data to provide:
          </p>
          <ul>
            <li>
              Probabilistic predictions about where missing persons are most
              likely to be found
            </li>
            <li>Resource allocation recommendations</li>
            <li>Strategic planning and scheduling guidance</li>
            <li>Real-time incident dashboards for coordination</li>
          </ul>

          <h2>Advanced Technology Stack</h2>
          <p>
            Our intelligent platform—IntelliSAR—leverages state-of-the-art AI
            technologies:
          </p>
          <ul>
            <li>
              <strong>Semantic Search &amp; Web Technologies</strong> for
              flexible, intelligent queries
            </li>
            <li>
              <strong>Machine Learning &amp; Deep Learning</strong> for pattern
              recognition and prediction
            </li>
            <li>
              <strong>Generative AI &amp; Large Language Models</strong> for
              document processing and knowledge extraction
            </li>
            <li>
              <strong>Network Graph Analysis</strong> to visualize connections
              and clues
            </li>
            <li>
              <strong>Geospatial Analysis</strong> for targeted search zone
              optimization
            </li>
            <li>
              <strong>Multi-Modal Neural Networks</strong> that integrate
              weather, satellite imagery, and natural language clues
            </li>
          </ul>

          <h2>Research Innovations</h2>
          <p>The AI4SAR team has developed sophisticated tools including:</p>
          <ul>
            <li>
              <strong>Search and Rescue Ontology (SaRO)</strong> — a
              comprehensive knowledge framework for SAR operations
            </li>
            <li>
              <strong>Clue Graphs</strong> — network visualizations that reveal
              relationships between evidence and location patterns
            </li>
            <li>
              <strong>AI-Generated Knowledge Graphs</strong> — automated
              extraction of intelligence from text, emails, transcripts, and
              documents
            </li>
            <li>
              <strong>Heat Maps with Probability Distributions</strong> — visual
              representations showing the highest-probability locations for
              successful rescue
            </li>
          </ul>

          <h2>Why It Matters</h2>
          <p>
            Missing person cases demand speed and accuracy. By bringing AI into
            the search and rescue process, we&apos;re not replacing experienced
            SAR professionals—we&apos;re amplifying their expertise with
            data-driven insights they can act on immediately. This means faster
            response times, smarter resource allocation, and ultimately, better
            outcomes for the families and communities who need help most.
          </p>
        </section>
      </main>
    </div>
  );
}
