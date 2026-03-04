"use client";

import { useState } from "react";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function sendInvite() {
    setMsg(null);

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      setMsg(
        res.ok ? "Invite sent!" : (data?.error ?? `Error (${res.status})`),
      );
    } catch (e) {
      setMsg("Error (request failed)");
    }
  }

  return (
    <div className="auth-page">
      <div style={{ color: "#ffffff", maxWidth: 520, margin: "0 0 8px 0" }}>
        <h1>Invite a user</h1>
        <p>Send email invite to grant access to AI4SAR platform</p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          style={{ width: "100%", padding: 12, marginTop: 12 }}
        />
        <button onClick={sendInvite} style={{ marginTop: 12, padding: 12 }}>
          Send Invite
        </button>
        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      </div>
    </div>
  );
}
