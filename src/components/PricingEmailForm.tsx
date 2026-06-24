"use client";

import { useState, FormEvent } from "react";

type State = "idle" | "loading" | "success" | "error";

interface PricingEmailFormProps {
  tier?: string;
}

export default function PricingEmailForm({ tier = "Pricing" }: PricingEmailFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, source: `pricing-${tier.toLowerCase()}` }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong");
        setState("error");
        return;
      }
      setState("success");
    } catch {
      setErrorMsg("Network error — please try again");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Got it!
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          We&apos;ll email you within 24 hours with pricing details and a personalized demo walkthrough for the {tier} tier.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={state === "loading"}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={state === "loading"}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Company name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          disabled={state === "loading"}
          style={inputStyle}
        />
        {state === "error" && (
          <p style={{ color: "var(--danger)", fontSize: "0.85rem", margin: 0 }}>
            {errorMsg}
          </p>
        )}
        <button
          type="submit"
          disabled={state === "loading"}
          style={{
            padding: "0.75rem 1.5rem",
            background: state === "loading" ? "var(--text-subtle)" : "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: state === "loading" ? "not-allowed" : "pointer",
            letterSpacing: "0.01em",
            transition: "background 0.15s",
          }}
        >
          {state === "loading" ? "Sending…" : "Request Pricing Details →"}
        </button>
      </div>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.7rem 1rem",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  fontSize: "0.95rem",
  color: "var(--text-primary)",
  background: "white",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
