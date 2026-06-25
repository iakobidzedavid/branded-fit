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

export default function BrandAssetsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [domain, setDomain] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [messageId, setMessageId] = useState<string | null>(null);
  const [notifyError, setNotifyError] = useState<string | null>(null);
  const [quickDownloading, setQuickDownloading] = useState(false);

  async function handleQuickDownload() {
    setQuickDownloading(true);
    try {
      const res = await fetch("/api/brand-assets/download?storeId=demo&domain=demo");
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "brand-assets.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Quick download failed:", err);
    } finally {
      setQuickDownloading(false);
    }
  }

  async function handleDownload(e: React.FormEvent) {
    e.preventDefault();
    setDownloading(true);
    setNotifyError(null);

    const cleanDomain = domain.trim()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];

    // 1. POST to notify endpoint — saves lead + sends confirmation email
    try {
      const res = await fetch("/api/brand-assets/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          domain: cleanDomain || undefined,
        }),
      });
      const data = await res.json() as { success?: boolean; messageId?: string; message?: string; email_error?: string };
      if (data.messageId) setMessageId(data.messageId);
      if (data.email_error) setNotifyError(data.email_error);
    } catch {
      // non-fatal — proceed with download anyway
    }

    // 2. Show success state immediately (messageId already captured above)
    setDownloading(false);
    setDownloaded(true);

    // 3. Initiate ZIP download via hidden anchor (preserves React state unlike window.location.href)
    const storeId = company.trim().toLowerCase().replace(/\s+/g, "-") || "default";
    const params = new URLSearchParams({ storeId });
    if (cleanDomain) params.set("domain", cleanDomain);
    const a = document.createElement("a");
    a.href = `/api/brand-assets/download?${params.toString()}`;
    a.download = "brand-assets.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            background: `${T.accent}22`, color: T.accent,
            borderRadius: 20, fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem",
          }}>
            Brand Assets
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", color: T.text, margin: "0 0 0.5rem" }}>
            Download Brand Assets
          </h1>
          <p style={{ color: T.textMuted, fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
            Generate and download a ZIP file containing extracted logos and color palette for your brand. No personally identifiable information is included.
          </p>
        </div>

        {/* Direct download — no form required */}
        <div style={{
          padding: "1.25rem 1.5rem", background: T.surface,
          border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: "1rem",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem",
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: T.text, marginBottom: "0.2rem" }}>
              Quick Download — Sample Brand Assets
            </div>
            <div style={{ fontSize: "0.78rem", color: T.textMuted }}>
              Logos + color palette JSON — no sign-up required
            </div>
          </div>
          <button
            onClick={handleQuickDownload}
            disabled={quickDownloading}
            data-testid="download-brand-assets-btn"
            aria-label="Download Brand Assets"
            style={{
              padding: "0.6rem 1.25rem", background: quickDownloading ? `${T.accent}88` : T.accent, color: T.text,
              border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.875rem",
              textDecoration: "none", display: "inline-block", cursor: quickDownloading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {quickDownloading ? "Downloading…" : "Download Brand Assets"}
          </button>
        </div>

        {/* Form — optional: fill for personalized assets + confirmation email */}
        <form
          onSubmit={handleDownload}
          style={{
            padding: "2rem", background: T.surface,
            border: `1px solid ${T.border}`, borderRadius: 12,
          }}
        >
          <div style={{ display: "grid", gap: "1.25rem", marginBottom: "1.5rem" }}>
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
                style={{
                  width: "100%", background: T.bg, border: `1px solid ${T.border}`,
                  borderRadius: 6, color: T.text, padding: "0.6rem 0.875rem",
                  fontSize: "0.9rem", boxSizing: "border-box",
                }}
              />
            </div>

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
                style={{
                  width: "100%", background: T.bg, border: `1px solid ${T.border}`,
                  borderRadius: 6, color: T.text, padding: "0.6rem 0.875rem",
                  fontSize: "0.9rem", boxSizing: "border-box",
                }}
              />
            </div>

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
                style={{
                  width: "100%", background: T.bg, border: `1px solid ${T.border}`,
                  borderRadius: 6, color: T.text, padding: "0.6rem 0.875rem",
                  fontSize: "0.9rem", boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: T.textMuted, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Domain (optional)
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="yourcompany.com"
                style={{
                  width: "100%", background: T.bg, border: `1px solid ${T.border}`,
                  borderRadius: 6, color: T.text, padding: "0.6rem 0.875rem",
                  fontSize: "0.9rem", boxSizing: "border-box",
                }}
              />
              <div style={{ fontSize: "0.75rem", color: T.textMuted, marginTop: "0.3rem" }}>
                Used to extract brand colors from your website
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={downloading}
            style={{
              width: "100%", padding: "0.875rem 1.5rem",
              background: downloading ? `${T.accent}88` : T.accent,
              color: T.text, border: "none", borderRadius: 8,
              fontWeight: 700, fontSize: "1rem", cursor: downloading ? "not-allowed" : "pointer",
              transition: "opacity 0.15s",
            }}
          >
            {downloading ? "Preparing download…" : "Download Brand Assets"}
          </button>

          {downloaded && (
            <div style={{
              marginTop: "1rem", padding: "0.875rem 1rem",
              background: `${T.statusShipped}22`, border: `1px solid ${T.statusShipped}44`,
              borderRadius: 8, color: T.statusShipped, fontSize: "0.875rem",
            }}>
              ZIP download initiated — check your downloads folder for brand-assets.zip
              {messageId && (
                <div style={{ marginTop: "0.4rem", fontSize: "0.75rem", opacity: 0.8 }}>
                  Confirmation email sent · Message ID: {messageId}
                </div>
              )}
            </div>
          )}
          {notifyError && !downloaded && (
            <div style={{
              marginTop: "1rem", padding: "0.75rem 1rem",
              background: `${T.danger}11`, border: `1px solid ${T.danger}44`,
              borderRadius: 8, color: "#fca5a5", fontSize: "0.8rem",
            }}>
              Note: confirmation email could not be sent ({notifyError})
            </div>
          )}

          <div style={{ marginTop: "1.25rem", fontSize: "0.8rem", color: T.textMuted, lineHeight: 1.6 }}>
            <strong style={{ color: T.text }}>What&apos;s included:</strong>
            <ul style={{ margin: "0.4rem 0 0 1rem", padding: 0 }}>
              <li>SVG logo variants (primary, dark background)</li>
              <li>Brand color palette JSON (Tailwind + raw hex tokens)</li>
              <li>README with regeneration instructions</li>
            </ul>
          </div>
        </form>
      </div>
    </main>
  );
}
