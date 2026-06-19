"use client";

import Link from "next/link";
import { useState } from "react";

type FormState = { name: string; email: string; company: string };

export default function DemoPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", company: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: 520, margin: "0 auto" }}>
      <Link
        href="/"
        style={{ fontSize: "0.875rem", color: "#6b7280", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}
      >
        ← Back to home
      </Link>

      {submitted ? (
        <div
          style={{
            marginTop: "2rem",
            padding: "2.5rem",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎉</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
            You&apos;re on the list
          </h1>
          <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
            Thanks, {form.name.split(" ")[0]}. We&apos;ll reach out to {form.email} shortly to schedule your demo.
          </p>
        </div>
      ) : (
        <>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
            Get a Demo
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.95rem", marginBottom: "2rem" }}>
            We&apos;ll show you how Branded Fit gets your team from domain to live storefront in 8 minutes.
          </p>

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

            <button
              type="submit"
              style={{
                marginTop: "0.5rem",
                padding: "0.875rem",
                background: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Request Demo →
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
    color: "#374151",
    marginBottom: "0.375rem",
  };
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "0.625rem 0.875rem",
    fontSize: "0.95rem",
    border: `1px solid ${hasError ? "#ef4444" : "#d1d5db"}`,
    borderRadius: 6,
    outline: "none",
    boxSizing: "border-box",
    color: "#111827",
  };
}

function errorStyle(): React.CSSProperties {
  return {
    marginTop: "0.375rem",
    fontSize: "0.8rem",
    color: "#ef4444",
  };
}
