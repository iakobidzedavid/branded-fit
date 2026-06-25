"use client";

import { useState } from "react";

type FormState = { name: string; email: string; company: string };

export default function DemoPage() {
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
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError((data as { error?: string }).error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setServerError("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "4rem 1.5rem 5rem" }}>
      {submitted ? (
        <div
          style={{
            padding: "3rem 2.5rem",
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎉</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            You&apos;re on the list
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>
            Thanks, {form.name.split(" ")[0]}. We&apos;ll email you a personalized storefront walkthrough at {form.email} within 24 hours.
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.625rem" }}>
              Get a Demo
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>
              We&apos;ll show you how Branded Fit gets your team from domain to live storefront in 8 minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle()}>Full Name</label>
              <input
                type="text"
                placeholder="Alex Rivera"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle(!!errors.name)}
              />
              {errors.name && <p style={errorStyle()}>{errors.name}</p>}
            </div>

            <div>
              <label style={labelStyle()}>Work Email</label>
              <input
                type="email"
                placeholder="alex@yourcompany.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle(!!errors.email)}
              />
              {errors.email && <p style={errorStyle()}>{errors.email}</p>}
            </div>

            <div>
              <label style={labelStyle()}>Company</label>
              <input
                type="text"
                placeholder="Acme Inc."
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                style={inputStyle(!!errors.company)}
              />
              {errors.company && <p style={errorStyle()}>{errors.company}</p>}
            </div>

            {serverError && (
              <p style={{ color: "var(--danger)", fontSize: "0.875rem" }}>{serverError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: "0.5rem",
                padding: "0.875rem",
                background: submitting ? "#818cf8" : "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Sending…" : "Request an email walkthrough →"}
            </button>
          </form>
        </>
      )}
    </main>
  );
}

function labelStyle(): React.CSSProperties {
  return {
    display: "block",
    fontWeight: 600,
    fontSize: "0.875rem",
    color: "var(--text-body)",
    marginBottom: "0.375rem",
  };
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "0.625rem 0.875rem",
    fontSize: "0.95rem",
    border: `1px solid ${hasError ? "var(--danger)" : "var(--border)"}`,
    borderRadius: "var(--radius-md)",
    outline: "none",
    boxSizing: "border-box",
    color: "var(--text-primary)",
    background: "white",
  };
}

function errorStyle(): React.CSSProperties {
  return {
    marginTop: "0.375rem",
    fontSize: "0.8rem",
    color: "var(--danger)",
  };
}
