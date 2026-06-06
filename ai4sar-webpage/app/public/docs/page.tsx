"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import {
  Download,
  FileText,
  Database,
  Shield,
  BookOpen,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";

interface LocalDocType {
  title: string;
  date: string;
  downloadUrl: string;
  category: string;
}

export default function DocumentsPage() {
  // Base default categories matching your project documentation framework
  const [categories, setCategories] = useState<string[]>([
    "Technical Model Specs",
    "Project Reports",
    "Field Data & Privacy",
  ]);

  // Master document list carrying default data logs
  const [documents, setDocuments] = useState<LocalDocType[]>([
    {
      title: "IntelliSAR Models Reference (Complete PDF)",
      date: "May 2026",
      downloadUrl: "/docs/intellisar_models_reference.pdf",
      category: "Technical Model Specs",
    },
    {
      title: "Model 1: Wander Predictor (k-NN)",
      date: "Feb 2026",
      downloadUrl: "/docs/model1_wander_predictor.pdf",
      category: "Technical Model Specs",
    },
    {
      title: "Model 2: Total Man Hours (Random Forest)",
      date: "Mar 2026",
      downloadUrl: "/docs/model2_total_man_hours.pdf",
      category: "Technical Model Specs",
    },
    {
      title: "Model 3: Priority / Urgency Score (XGBoost)",
      date: "Mar 2026",
      downloadUrl: "/docs/model3_priority_urgency_score.pdf",
      category: "Technical Model Specs",
    },
    {
      title: "Model 4: Status Prediction (Stacking)",
      date: "Apr 2026",
      downloadUrl: "/docs/model4_status_prediction.pdf",
      category: "Technical Model Specs",
    },
    {
      title: "Model 5: Containment Classifier (Random Forest)",
      date: "May 2026",
      downloadUrl: "/docs/model5_containment_classifier.pdf",
      category: "Technical Model Specs",
    },
    {
      title: "Model 6: Interview Helper Agent (GPT-4o)",
      date: "Apr 2026",
      downloadUrl: "/docs/model6_interview_helper_agent.pdf",
      category: "Technical Model Specs",
    },
    {
      title: "CSC 492 Final Project Report",
      date: "June 2026",
      downloadUrl: "/docs/csc_492_final_project_report.pdf",
      category: "Project Reports",
    },
    {
      title: "HCI Research Proposal",
      date: "May 2026",
      downloadUrl: "/docs/hci_research_proposal.pdf",
      category: "Project Reports",
    },
    {
      title: "BASARC Field Test Highlights",
      date: "Apr 2026",
      downloadUrl: "/docs/basarc_field_test_highlights.pdf",
      category: "Field Data & Privacy",
    },
    {
      title: "Incident Data Privacy Policy",
      date: "May 2026",
      downloadUrl: "/docs/incident_data_privacy_policy.pdf",
      category: "Field Data & Privacy",
    },
  ]);

  // Overlay control configurations
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showNewCatInput, setShowNewCatInput] = useState(false);

  // Form Field Input States
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formCategory, setFormCategory] = useState("Technical Model Specs");
  const [newCategoryName, setNewCategoryName] = useState("");

  // Logic to dynamically assign icons based on category type matches
  const renderCategoryIcon = (category: string) => {
    const lowercaseCat = category.toLowerCase();
    if (lowercaseCat.includes("model") || lowercaseCat.includes("technical")) {
      return (
        <Database size={80} style={{ color: "var(--gold)", opacity: 0.8 }} />
      );
    }
    if (lowercaseCat.includes("report") || lowercaseCat.includes("academic")) {
      return <BookOpen size={80} style={{ color: "white", opacity: 0.8 }} />;
    }
    return <Shield size={80} style={{ color: "var(--gold)", opacity: 0.8 }} />;
  };

  // Helper function to auto-generate clean url paths directly from document titles
  const generateAutomaticPath = (title: string): string => {
    const cleanString = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-_]/g, "") // Remove special characters except spaces, hyphens, and underscores
      .trim()
      .replace(/[\s-_]+/g, "_"); // Compress sequences to clean single underscores
    return `/docs/${cleanString}.pdf`;
  };

  // Add custom new destination category option
  const handleCreateCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    if (!categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
      setFormCategory(newCategoryName.trim());
    }
    setNewCategoryName("");
    setShowNewCatInput(false);
  };

  // Process item placement submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDate) return;

    // Automatically compute the download path string
    const targetGeneratedPath = generateAutomaticPath(formTitle);

    const newDoc: LocalDocType = {
      title: formTitle,
      date: formDate,
      downloadUrl: targetGeneratedPath,
      category: formCategory,
    };

    setDocuments([...documents, newDoc]);

    // Clear form layout parameters
    setFormTitle("");
    setFormDate("");
    setIsUploadOpen(false);
  };

  return (
    <>
      <SignedIn>
        <div
          className="page"
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <main className="middle-layer">
            <section className="hero-text">
              <h1 className="hero-title">Documents & Resources</h1>
              <p className="hero-subtitle">
                Technical specifications, research logs, and project
                documentation for the AI4SAR initiative.
              </p>

              <button
                onClick={() => setIsUploadOpen(true)}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "var(--gold)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Plus size={16} /> Upload New Document
              </button>
            </section>
          </main>

          <div className="section-header">
            <h2>Internal Project Repository</h2>
          </div>

          <div className="story-container">
            {/* Dynamically build blocks based on active category values */}
            {categories.map((cat, index) => {
              const categoryDocs = documents.filter(
                (doc) => doc.category === cat,
              );
              return (
                <section
                  key={cat}
                  className={`feature-row ${index % 2 !== 0 ? "reverse" : ""}`}
                >
                  <div
                    className="feature-visual"
                    style={{
                      background:
                        index % 2 !== 0
                          ? "linear-gradient(135deg, #BD8B13 0%, #0c0d0d 100%)"
                          : "linear-gradient(135deg, #154734 0%, #0c0d0d 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {renderCategoryIcon(cat)}
                  </div>
                  <div className="feature-text">
                    <span className="feature-label">Repository Section</span>
                    <h2>{cat}</h2>
                    <p>
                      Internal centralized database files matching tracking
                      segment targets.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "20px",
                        width: "100%",
                      }}
                    >
                      {categoryDocs.map((doc, idx) => (
                        <DocLink
                          key={idx}
                          title={doc.title}
                          date={doc.date}
                          downloadUrl={doc.downloadUrl}
                        />
                      ))}
                      {categoryDocs.length === 0 && (
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: "#6b7280",
                            fontStyle: "italic",
                          }}
                        >
                          No files configured under this custom route yet.
                        </span>
                      )}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          {/* Configuration Setup Overlay Modal */}
          {isUploadOpen && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "12px",
                  width: "100%",
                  maxWidth: "480px",
                  padding: "24px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{ color: "#ffffff", margin: 0, fontSize: "1.25rem" }}
                  >
                    Configure Asset Upload
                  </h3>
                  <X
                    size={20}
                    style={{
                      color: "#9ca3af",
                      cursor: "pointer",
                      marginLeft: "auto",
                    }}
                    onClick={() => setIsUploadOpen(false)}
                  />
                </div>

                <form
                  onSubmit={handleFormSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        color: "#9ca3af",
                        fontSize: "0.85rem",
                        marginBottom: "6px",
                      }}
                    >
                      Document Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g., Model 7: Target Terrain Analyzer"
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: "#1f2933",
                        border: "1px solid #4b5563",
                        borderRadius: "6px",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "#9ca3af",
                          fontSize: "0.85rem",
                          marginBottom: "6px",
                        }}
                      >
                        Release Date Text
                      </label>
                      <input
                        type="text"
                        required
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        placeholder="e.g., Jun 2026"
                        style={{
                          width: "100%",
                          padding: "10px",
                          background: "#1f2933",
                          border: "1px solid #4b5563",
                          borderRadius: "6px",
                          color: "#ffffff",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "#9ca3af",
                          fontSize: "0.85rem",
                          marginBottom: "6px",
                        }}
                      >
                        Repository Destination
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          background: "#1f2933",
                          border: "1px solid #4b5563",
                          borderRadius: "6px",
                          color: "#ffffff",
                        }}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Add New Category Custom Section Controller */}
                  {!showNewCatInput ? (
                    <button
                      type="button"
                      onClick={() => setShowNewCatInput(true)}
                      style={{
                        alignSelf: "flex-start",
                        background: "none",
                        border: "none",
                        color: "var(--gold)",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        padding: 0,
                        fontWeight: "600",
                      }}
                    >
                      + Create New Destination Category
                    </button>
                  ) : (
                    <div
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #374151",
                      }}
                    >
                      <label
                        style={{
                          display: "block",
                          color: "#9ca3af",
                          fontSize: "0.8rem",
                          marginBottom: "6px",
                        }}
                      >
                        New Category Name
                      </label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g., Deep Learning Extensions"
                          style={{
                            flex: 1,
                            padding: "6px 10px",
                            background: "#0c0d0d",
                            border: "1px solid #4b5563",
                            borderRadius: "4px",
                            color: "#ffffff",
                            fontSize: "0.85rem",
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleCreateCategory}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#374151",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    style={{
                      marginTop: "10px",
                      padding: "12px",
                      backgroundColor: "var(--gold)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Commit File to Layout View
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function DocLink({
  title,
  date,
  downloadUrl,
}: {
  title: string;
  date: string;
  downloadUrl: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "8px",
        border: "1px solid #374151",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FileText size={18} style={{ color: "var(--gold)" }} />
        <span
          style={{ fontSize: "0.95rem", fontWeight: 500, color: "#ffffff" }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{date}</span>
        <a
          href={downloadUrl}
          download
          style={{
            color: "var(--gold)",
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
          title={`Download ${title}`}
        >
          <Download size={16} style={{ cursor: "pointer" }} />
        </a>
      </div>
    </div>
  );
}
