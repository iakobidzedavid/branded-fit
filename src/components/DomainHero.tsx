"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DomainHero() {
  const [domain, setDomain] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = domain.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    if (!clean) return;
    router.push(`/try?domain=${encodeURIComponent(clean)}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="yourcompany.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          style={{
            flex: "1 1 220px",
            maxWidth: 360,
            padding: "0.875rem 1rem",
            fontSize: "1rem",
            border: "2px solid var(--border)",
            borderRadius: "var(--radius-md)",
            outline: "none",
            color: "var(--text-primary)",
            background: "white",
          }}
        />
        <button
          type="submit"
          disabled={!domain.trim()}
          style={{
            padding: "0.875rem 1.5rem",
            background: domain.trim() ? "var(--primary)" : "#c7d2fe",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            fontSize: "0.975rem",
            cursor: domain.trim() ? "pointer" : "not-allowed",
            whiteSpace: "nowrap",
          }}
        >
          See My Store →
        </button>
      </div>
      <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>
        No signup required · Takes 8 seconds
      </p>
    </form>
  );
}
