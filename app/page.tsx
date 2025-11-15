"use client";
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
          <div>
            <strong>You:</strong> {c.you}
          </div>
          <div>
            <strong>Me:</strong> {c.me}
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: 20,
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Ask me…"
          onKeyDown={(e) => {
            if (e.key === "Enter") ask();
          }}
          style={{
            flex: 1,
            padding: "12px 15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
            outline: "none",
            transition: "0.2s",
          }}
          onFocus={(e) => {
            e.target.style.border = "1px solid #4A90E2";
            e.target.style.boxShadow = "0 0 4px rgba(74,144,226,0.4)";
          }}
          onBlur={(e) => {
            e.target.style.border = "1px solid #ccc";
            e.target.style.boxShadow = "none";
          }}
        />

        <button
          onClick={ask}
          disabled={loading}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            backgroundColor: loading ? "#bbb" : "#4A90E2",
            color: "white",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            border: "none",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#357ABD";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#4A90E2";
          }}
        >
          {loading ? "Thinking…" : "Send"}
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: 8 }}>Error: {error}</div>
      )}
    </div>
  );
}
