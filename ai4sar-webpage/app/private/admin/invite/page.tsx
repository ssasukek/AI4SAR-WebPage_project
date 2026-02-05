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

    setMsg(res.ok ? "Invite sent!" : (data?.error ?? `Error (${res.status})`));
  } catch (e) {
    setMsg("Error (request failed)");
  }
}


  return (
    <div className="page">
      <div style={{ maxWidth: 520, margin: "40px auto" }}>
        <h1>Invite a user</h1>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          style={{ width: "100%", padding: 12, marginTop: 12 }}
        />
        <button onClick={sendInvite} style={{ marginTop: 12, padding: 12 }}>
          Send invite
        </button>
        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      </div>
    </div>
  );
}
