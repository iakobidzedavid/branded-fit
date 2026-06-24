"use client";

import { useState } from "react";

const T = {
  bg: "#0d1f33",
  surface: "#102542",
  border: "#1a3a5c",
  text: "#ecebf3",
  textMuted: "#8fa3b8",
  accent: "#4f46e5",
  statusShipped: "#10b981",
  danger: "#dc2626",
};

export default function ContactSupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [domain, setDomain] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    email_message_ids: string[];
    escalation_id: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/support-escalation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          domain: domain.trim() || company.trim(),
          error_details: errorDetails.trim(),
          contact_email: email.trim(),
        }),
      });

      const data = await res.json() as {
        success?: boolean;
        message?: string;
        email_message_ids?: string[];
        escalation?: { id: string };
        error?: string;
      };

      if (!res.ok || !data.success) {
        setError(data.error ?? `HTTP ${res.status}`);
      } else {
        setResult({
          message: data.message ?? "Support team notified.",
          email_message_ids: data.email_message_ids ?? [],
          escalation_id: data.escalation?.id ?? "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: T.bg, color: T.text, padding: "3rem 1.5rem 5rem" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          padding: "1.75rem 2rem", background: T.surface,
          border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: "2rem",
        }}>
          <div style={{
            display: "inline-block", padding: "0.25rem 0.75rem",
            background: `${T.danger}22`, color: T.danger,
            borderRadius: 20, fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem",
          }}>
            Support
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", color: T.text, margin: "0 0 0.5rem" }}>
            Contact Support
          </h1>
          <p style={{ color: T.textMuted, fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
            Submit a support request and our team will be notified immediately. You will receive a confirmation email and a follow-up within 4 business hours.
          </p>
        </div>

        {/* Form or Success */}
        {result ? (
          <div style={{
            padding: "2rem", background: T.surface,
            border: `1px solid ${T.statusShipped}44`, borderRadius: 12,
          }}>
            <div style={{
              padding: "1rem 1.25rem", background: `${T.statusShipped}22`,
              border: `1px solid ${T.statusShipped}44`, borderRadius: 8,
              color: T.statusShipped, fontSize: "0.95rem", fontWeight: 600,
              marginBottom: "1rem",
            }}>
              {result.message}
            </div>
            {result.escalation_id && (
              <div style={{ fontSize: "0.8rem", color: T.textMuted, marginBottom: "0.5rem" }}>
                Reference ID: <span style={{ fontFamily: "monospace", color: T.text }}>{result.escalation_id}</span>
              </div>
            )}
            {result.email_message_ids.length > 0 && (
              <div style={{ fontSize: "0.8rem", color: T.textMuted }}>
                Email notification IDs:{" "}
                {result.email_message_ids.map((id) => (
                  <span key={id} style={{ fontFamily: "monospace", color: T.statusShipped, marginRight: "0.5rem" }}>
                    {id}
                  </span>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                setResult(null);
                setName(""); setEmail(""); setCompany(""); setDomain(""); setErrorDetails("");
              }}
              style={{
                marginTop: "1.25rem", padding: "0.6rem 1.25rem", background: T.surface,
                color: T.text, border: `1px solid ${T.border}`, borderRadius: 8,
                fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
              }}
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "2rem", background: T.surface,
              border: `1px solid ${T.border}`, borderRadius: 12,
            }}
          >
            <div style={{ display: "grid", gap: "1.25rem", marginBottom: "1.5rem" }}>
              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: T.textMuted, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, padding: "0.6rem 0.875rem", fontSize: "0.9rem", boxSizing: "border-box" }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: T.textMuted, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, padding: "0.6rem 0.875rem", fontSize: "0.9rem", boxSizing: "border-box" }}
                />
              </div>

              {/* Company */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: T.textMuted, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Company *
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc"
                  required
                  style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, padding: "0.6rem 0.875rem", fontSize: "0.9rem", boxSizing: "border-box" }}
                />
              </div>

              {/* Domain / Store */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: T.textMuted, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Store / Domain (optional)
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="yourstore.myshopify.com"
                  style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, padding: "0.6rem 0.875rem", fontSize: "0.9rem", boxSizing: "border-box" }}
                />
              </div>

              {/* Issue description */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: T.textMuted, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Describe the issue
                </label>
                <textarea
                  value={errorDetails}
                  onChange={(e) => setErrorDetails(e.target.value)}
                  rows={4}
                  placeholder="What went wrong? Include any error messages or steps to reproduce."
                  style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, padding: "0.6rem 0.875rem", fontSize: "0.9rem", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {error && (
              <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: `${T.danger}11`, border: `1px solid ${T.danger}44`, borderRadius: 8, color: "#fca5a5", fontSize: "0.85rem" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%", padding: "0.875rem 1.5rem",
                background: submitting ? `${T.danger}88` : T.danger,
                color: T.text, border: "none", borderRadius: 8,
                fontWeight: 700, fontSize: "1rem", cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Submitting…" : "Submit Support Request"}
            </button>

            <div style={{ marginTop: "1rem", fontSize: "0.78rem", color: T.textMuted, lineHeight: 1.6 }}>
              You will receive a confirmation email and our team will follow up within 4 business hours.
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
