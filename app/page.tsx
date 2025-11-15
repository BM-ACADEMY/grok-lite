"use client"
import React, { useState } from "react";

export default function Home() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<{ you: string; me: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    if (!msg.trim()) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `API error ${res.status}`);
      }

      const txt = await res.text();
      setChat((c) => [...c, { you: msg, me: txt }]);
      setMsg("");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 800 }}>
      <h1>Grok-lite</h1>

      {chat.map((c, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div><strong>You:</strong> {c.you}</div>
          <div><strong>Me:</strong> {c.me}</div>
        </div>
      ))}

      <div style={{ marginTop: 12 }}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Ask me…"
          style={{ marginRight: 8, padding: 8, width: "60%" }}
          onKeyDown={(e) => { if (e.key === "Enter") ask(); }}
        />
        <button onClick={ask} disabled={loading}>
          {loading ? "Thinking…" : "Send"}
        </button>
      </div>

      {error && <div style={{ color: "red", marginTop: 8 }}>Error: {error}</div>}
    </div>
  );
}
