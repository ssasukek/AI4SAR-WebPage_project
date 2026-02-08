"use client";

import { useState } from "react";

export default function AdminActions({ incident }: any) {
  const [loading, setLoading] = useState(false);

  async function publish() {
    setLoading(true);
    try {
      await fetch(`/api/private/incidents/${incident._id || incident.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: true }),
      });
      location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
      <button disabled={loading} onClick={publish}>
        Publish
      </button>
      <button disabled={loading} onClick={() => alert("Open edit modal next")}>
        Edit
      </button>
      <button disabled={loading} onClick={() => alert("Open add modal next")}>
        Add
      </button>
    </div>
  );
}
