"use client";

import { useState } from "react";

function generateEmail({
  yourName,
  bossName,
  company,
  teamSize,
  currentTool,
}: {
  yourName: string;
  bossName: string;
  company: string;
  teamSize: string;
  currentTool: string;
}) {
  const greeting = bossName ? `Hi ${bossName},` : "Hi,";
  const fromLine = yourName ? `\n${yourName}` : "";
  const teamLine = teamSize ? ` across our ${teamSize}-person team` : "";
  const toolLine = currentTool
    ? ` We're currently using ${currentTool}, but the cost, setup time, and redemption rates aren't where we need them to be.`
    : "";

  return `${greeting}

I've been looking into ways to improve our swag program at ${company || "the company"}${teamLine}.${toolLine} I came across Branded Fit and think it's worth a serious look.

Here's the short version of why:

→ 8-minute setup: paste our domain, get a live, branded Shopify storefront. No design team or procurement needed.
→ AI-curated catalog: it matches products to our brand identity automatically — no manual browsing.
→ 85% employee redemption vs. the industry average of 38%. The difference is that employees self-select from a curated store instead of receiving company-chosen items.
→ $2,400/yr flat, zero markup on merchandise. Comparable platforms charge $6K–$12K/yr plus 15–25% on every order.

I already ran our numbers through their ROI calculator — we'd recover the subscription fee within the first swag cycle just from time savings and reduced waste.

I can forward you an email walkthrough showing exactly what our storefront would look like — no call needed, just a quick look. Let me know if you'd like me to send it over.

Best,${fromLine}`;
}

export default function BossEmailGenerator({
  defaultCompany = "",
}: {
  defaultCompany?: string;
}) {
  const [yourName, setYourName] = useState("");
  const [bossName, setBossName] = useState("");
  const [company, setCompany] = useState(defaultCompany);
  const [teamSize, setTeamSize] = useState("");
  const [currentTool, setCurrentTool] = useState("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const emailText = generateEmail({ yourName, bossName, company, teamSize, currentTool });

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenerated(true);
  }

  function handleCopy() {
    navigator.clipboard.writeText(emailText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        marginTop: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          background: "white",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-md)",
            background: "var(--primary-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          ✉️
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)" }}>
            Generate your approval email
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Fill in a few details and copy a ready-to-send email for your People Leader
          </div>
        </div>
      </div>

      <div className="boss-email-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        {/* Form */}
        <form
          onSubmit={handleGenerate}
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            borderRight: "1px solid var(--border)",
          }}
        >
          <FormField
            label="Your name"
            placeholder="Alex Rivera"
            value={yourName}
            onChange={setYourName}
          />
          <FormField
            label="Your boss's name"
            placeholder="Jordan Chen"
            value={bossName}
            onChange={setBossName}
          />
          <FormField
            label="Company name"
            placeholder="Acme Inc."
            value={company}
            onChange={setCompany}
          />
          <FormField
            label="Team size"
            placeholder="120"
            value={teamSize}
            onChange={setTeamSize}
          />
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--text-body)",
                marginBottom: "0.35rem",
              }}
            >
              Current swag tool (optional)
            </label>
            <select
              value={currentTool}
              onChange={(e) => setCurrentTool(e.target.value)}
              style={{
                width: "100%",
                padding: "0.55rem 0.75rem",
                fontSize: "0.875rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                background: "white",
                color: "var(--text-primary)",
                outline: "none",
              }}
            >
              <option value="">— none / doing it manually —</option>
              <option value="SwagUp">SwagUp</option>
              <option value="Stadium">Stadium</option>
              <option value="PerkUp">PerkUp</option>
              <option value="Sendoso">Sendoso</option>
              <option value="Printify">Printify (DIY)</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "0.25rem",
              padding: "0.75rem 1rem",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Generate email →
          </button>
        </form>

        {/* Preview */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>
              {generated ? "Your email — ready to copy" : "Preview (fill in details to personalize)"}
            </div>
            {generated && (
              <button
                onClick={handleCopy}
                style={{
                  padding: "0.4rem 0.875rem",
                  background: copied ? "var(--accent)" : "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {copied ? "✓ Copied!" : "Copy email"}
              </button>
            )}
          </div>
          <pre
            style={{
              flex: 1,
              margin: 0,
              padding: "1rem",
              background: "white",
              border: `1px solid ${generated ? "var(--primary)" : "var(--border)"}`,
              borderRadius: "var(--radius-md)",
              fontSize: "0.8rem",
              lineHeight: 1.7,
              color: "var(--text-body)",
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
              overflowY: "auto",
              maxHeight: 400,
              transition: "border-color 0.2s",
            }}
          >
            {emailText}
          </pre>
          <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", lineHeight: 1.5 }}>
            Tip: personalize the subject line as{" "}
            <em>"Swag program idea — worth a quick look?"</em>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .boss-email-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "var(--text-body)",
          marginBottom: "0.35rem",
        }}
      >
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "0.55rem 0.75rem",
          fontSize: "0.875rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          background: "white",
          color: "var(--text-primary)",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
