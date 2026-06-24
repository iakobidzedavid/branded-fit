"use client";

import { useState } from "react";

type FormState = { name: string; email: string; company: string };

export default function DemoRequestForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", company: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) {
      e.email = "Work email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }
    if (!form.company.trim()) e.company = "Company is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "homepage" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(
          (data as { error?: string }).error ?? "Something went wrong. Please try again."
        );
      } else {
        setSubmitted(true);
      }
    } catch {
      setServerError("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        style={{
          padding: "2rem",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
        <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "white", marginBottom: "0.4rem" }}>
          You&apos;re on the list, {form.name.split(" ")[0]}!
        </p>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem" }}>
          We&apos;ll email you a personalized storefront walkthrough at {form.email}.
        </p>
      </div>
    );
  }

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "0.625rem 0.875rem",
    fontSize: "0.9rem",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "var(--radius-md)",
    outline: "none",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.1)",
    color: "white",
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            placeholder="Alex Rivera"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ ...inputBase, borderColor: errors.name ? "#fca5a5" : "rgba(255,255,255,0.25)" }}
          />
          {errors.name && <p style={errStyle}>{errors.name}</p>}
        </div>

        <div>
          <label style={labelStyle}>Company</label>
          <input
            type="text"
            placeholder="Acme Inc."
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            style={{ ...inputBase, borderColor: errors.company ? "#fca5a5" : "rgba(255,255,255,0.25)" }}
          />
          {errors.company && <p style={errStyle}>{errors.company}</p>}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Work Email</label>
        <input
          type="email"
          placeholder="alex@yourcompany.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ ...inputBase, borderColor: errors.email ? "#fca5a5" : "rgba(255,255,255,0.25)" }}
        />
        {errors.email && <p style={errStyle}>{errors.email}</p>}
      </div>

      {serverError && (
        <p style={{ color: "#fca5a5", fontSize: "0.85rem" }}>{serverError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          marginTop: "0.25rem",
          padding: "0.875rem",
          background: submitting ? "rgba(255,255,255,0.2)" : "white",
          color: submitting ? "rgba(255,255,255,0.6)" : "var(--primary)",
          border: "none",
          borderRadius: "var(--radius-md)",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: submitting ? "not-allowed" : "pointer",
          transition: "opacity 0.15s",
        }}
      >
        {submitting ? "Sending…" : "Request a Demo →"}
      </button>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  fontSize: "0.8rem",
  color: "rgba(255,255,255,0.8)",
  marginBottom: "0.375rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const errStyle: React.CSSProperties = {
  marginTop: "0.3rem",
  fontSize: "0.78rem",
  color: "#fca5a5",
};
