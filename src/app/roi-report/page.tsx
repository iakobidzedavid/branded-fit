"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";

// ── Brand palettes (deterministic by domain hash — matches /try) ──────────────
const BRAND_PALETTES = [
  { primary: "#4f46e5", secondary: "#818cf8", bg: "#eef2ff" },
  { primary: "#0891b2", secondary: "#67e8f9", bg: "#ecfeff" },
  { primary: "#059669", secondary: "#6ee7b7", bg: "#ecfdf5" },
  { primary: "#7c3aed", secondary: "#c4b5fd", bg: "#f5f3ff" },
  { primary: "#b45309", secondary: "#fcd34d", bg: "#fffbeb" },
  { primary: "#be185d", secondary: "#f9a8d4", bg: "#fdf2f8" },
  { primary: "#1d4ed8", secondary: "#93c5fd", bg: "#eff6ff" },
  { primary: "#047857", secondary: "#6ee7b7", bg: "#f0fdf4" },
];

function hashDomain(domain: string): number {
  let h = 0;
  for (let i = 0; i < domain.length; i++) {
    h = (h * 31 + domain.charCodeAt(i)) >>> 0;
  }
  return h;
}

function getBrandPalette(domain: string) {
  const h = hashDomain(domain);
  return BRAND_PALETTES[h % BRAND_PALETTES.length];
}

function getPaletteIndex(domain: string): number {
  return hashDomain(domain) % BRAND_PALETTES.length;
}

function getCompanyName(raw: string): string {
  const domain = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split(".")[0];
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

function cleanDomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
}

// ── ROI calculation ────────────────────────────────────────────────────────────
const BEFORE_HOURS = 11;
const AFTER_HOURS = 1;
const BEFORE_WASTE = 0.525;
const AFTER_WASTE = 0.22;
const HOURLY_RATE = 85;
const BF_ANNUAL_FEE = 2400;

function calcROI(budget: number, cycles: number) {
  const timeSavings = Math.max(0, (BEFORE_HOURS - AFTER_HOURS) * cycles * HOURLY_RATE);
  const wasteSavings = Math.max(0, budget * (BEFORE_WASTE - AFTER_WASTE));
  const total = timeSavings + wasteSavings;
  const multiple = BF_ANNUAL_FEE > 0 ? total / BF_ANNUAL_FEE : 0;
  const paybackWeeks = total > 0 ? (BF_ANNUAL_FEE / total) * 52 : null;
  return { timeSavings, wasteSavings, total, multiple, paybackWeeks };
}

function fmt$(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

// ── Mini product catalog (shown in report card) ───────────────────────────────
const REPORT_PRODUCTS = [
  { name: "Premium Hoodie", emoji: "👕", price: 42, reorder: 87 },
  { name: "Insulated Tumbler", emoji: "☕", price: 36, reorder: 94 },
  { name: "Canvas Tote", emoji: "🎒", price: 18, reorder: 83 },
  { name: "Snapback Cap", emoji: "🧢", price: 32, reorder: 82 },
];

// ── Shared ROI Report Card ────────────────────────────────────────────────────
function ROIReportCard({
  domain,
  companyName,
  palette,
  roi,
  teamSize,
  budget,
  cyclesPerYear,
}: {
  domain: string;
  companyName: string;
  palette: (typeof BRAND_PALETTES)[number];
  roi: ReturnType<typeof calcROI>;
  teamSize: number;
  budget: number;
  cyclesPerYear: number;
}) {
  return (
    <div
      style={{
        border: `2px solid ${palette.primary}30`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
        background: "white",
      }}
    >
      {/* Report header */}
      <div
        style={{
          background: palette.primary,
          padding: "1.5rem 2rem",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            opacity: 0.75,
            marginBottom: "0.5rem",
          }}
        >
          Branded Fit · Swag ROI Report
        </div>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          {companyName}
        </div>
        <div style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "0.2rem" }}>
          {domain} · {teamSize} employees · {cyclesPerYear} swag cycle{cyclesPerYear !== 1 ? "s" : ""}/yr · {fmt$(budget)}/yr budget
        </div>
      </div>

      {/* Metrics grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderBottom: `1px solid ${palette.primary}20`,
        }}
      >
        {[
          { label: "Time Savings", value: fmt$(roi.timeSavings), sub: `${(BEFORE_HOURS - AFTER_HOURS) * cyclesPerYear} hrs reclaimed/yr` },
          { label: "Waste Recovery", value: fmt$(roi.wasteSavings), sub: `${Math.round((BEFORE_WASTE - AFTER_WASTE) * 100)}% less wasted` },
          { label: "Annual Value", value: fmt$(roi.total), sub: "vs. status quo", highlight: true },
        ].map((metric, i) => (
          <div
            key={metric.label}
            style={{
              padding: "1.25rem 1.5rem",
              borderRight: i < 2 ? `1px solid ${palette.primary}20` : "none",
              background: metric.highlight ? palette.bg : "white",
            }}
          >
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.35rem" }}>
              {metric.label}
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: metric.highlight ? palette.primary : "var(--text-primary)",
                lineHeight: 1,
                marginBottom: "0.3rem",
              }}
            >
              {metric.value}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{metric.sub}</div>
          </div>
        ))}
      </div>

      {/* ROI summary row */}
      <div
        style={{
          padding: "1rem 1.5rem",
          background: palette.bg,
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
          borderBottom: `1px solid ${palette.primary}20`,
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 600 }}>ROI multiple </span>
          <span style={{ fontSize: "1.75rem", fontWeight: 800, color: palette.primary }}>{roi.multiple.toFixed(1)}×</span>
        </div>
        {roi.paybackWeeks !== null && (
          <div>
            <span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 600 }}>Payback </span>
            <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {roi.paybackWeeks < 4
                ? `${Math.round(roi.paybackWeeks)} weeks`
                : `${(roi.paybackWeeks / 4.33).toFixed(1)} months`}
            </span>
          </div>
        )}
        <div style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#9ca3af" }}>
          Branded Fit: {fmt$(BF_ANNUAL_FEE)}/yr all-in
        </div>
      </div>

      {/* Mini product grid */}
      <div style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.875rem" }}>
          AI-curated catalog sample
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.625rem" }}>
          {REPORT_PRODUCTS.map((p) => (
            <div
              key={p.name}
              style={{
                background: palette.bg,
                borderRadius: 8,
                padding: "0.75rem 0.5rem",
                textAlign: "center",
                border: `1px solid ${palette.primary}20`,
              }}
            >
              <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>{p.emoji}</div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontSize: "0.65rem", color: "#9ca3af", marginTop: "0.2rem" }}>${p.price}</div>
              <div
                style={{
                  marginTop: "0.3rem",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: palette.primary,
                }}
              >
                {p.reorder}% reorder
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "0.875rem 1.5rem",
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 600 }}>
          Branded Fit · From domain to storefront in 8 min · brandedfitco.com
        </span>
        <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
          Based on SwagDrop 2026 (n=2,500). Time at {fmt$(HOURLY_RATE)}/hr.
        </span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
type Stage = "input" | "preview" | "saving" | "saved";

const CYCLE_OPTIONS = [1, 2, 3, 4, 6, 8, 12];

export default function ROIReportPage() {
  const [stage, setStage] = useState<Stage>("input");

  // Form state
  const [domainRaw, setDomainRaw] = useState("");
  const [teamSize, setTeamSize] = useState(120);
  const [budget, setBudget] = useState(15000);
  const [cycles, setCycles] = useState(4);

  // Lead capture
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");

  // Result
  const [savedId, setSavedId] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const domain = cleanDomain(domainRaw);
  const companyName = domain ? getCompanyName(domain) : "Your Company";
  const palette = domain ? getBrandPalette(domain) : BRAND_PALETTES[0];

  const roi = useMemo(() => calcROI(budget, cycles), [budget, cycles]);

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!domain) return;
    setStage("preview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) { setFormError("Name is required"); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setFormError("Enter a valid work email");
        return;
      }
      setFormError("");
      setStage("saving");

      try {
        const res = await fetch("/api/roi-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            domain,
            company_name: companyName,
            email: email.trim().toLowerCase(),
            name: name.trim(),
            team_size: teamSize,
            annual_budget: budget,
            cycles_per_year: cycles,
            hours_per_cycle: BEFORE_HOURS,
            roi_multiple: parseFloat(roi.multiple.toFixed(2)),
            roi_annual_value: Math.round(roi.total),
            time_savings: Math.round(roi.timeSavings),
            waste_savings: Math.round(roi.wasteSavings),
            palette_index: getPaletteIndex(domain),
          }),
        });

        if (!res.ok) {
          const d = (await res.json()) as { error?: string };
          throw new Error(d.error ?? "Server error — please try again");
        }

        const d = (await res.json()) as { report?: { id: string } };
        const id = d.report?.id ?? "";
        const url = `${window.location.origin}/roi-report/${id}`;
        setSavedId(id);
        setShareUrl(url);
        setStage("saved");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setFormError((err as Error).message);
        setStage("preview");
      }
    },
    [name, email, domain, companyName, teamSize, budget, cycles, roi]
  );

  // ── STAGE: input ─────────────────────────────────────────────────────────────
  if (stage === "input") {
    const liveROI = calcROI(budget > 0 ? budget : 15000, cycles);
    const liveDomain = cleanDomain(domainRaw);
    const livePalette = liveDomain ? getBrandPalette(liveDomain) : BRAND_PALETTES[0];
    const liveCompany = liveDomain ? getCompanyName(liveDomain) : "Your Company";

    return (
      <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
        {/* Hero */}
        <div style={{ padding: "4rem 0 3rem", maxWidth: 640 }}>
          <div
            style={{
              display: "inline-block",
              padding: "0.3rem 0.875rem",
              background: "var(--primary-light)",
              color: "var(--primary)",
              borderRadius: 20,
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Free tool
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            How much is your current
            <br />swag program costing you?
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.65, maxWidth: 560 }}>
            Enter your company domain and swag program details. Get a personalized ROI report
            — with your brand colors applied — that you can save and share with your People Leader in seconds.
          </p>
        </div>

        {/* Two-column layout */}
        <div
          className="roi-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* Left: form */}
          <form onSubmit={handleGenerate}>
            <div
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
                Your swag program
              </h2>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>
                  Company domain <span style={{ color: "var(--primary)" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="yourcompany.com"
                  value={domainRaw}
                  onChange={(e) => setDomainRaw(e.target.value)}
                  autoFocus
                  required
                  style={inputStyle(false)}
                />
                <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "0.25rem" }}>
                  Used to apply your brand colors to the report
                </p>
              </div>

              <div
                className="two-col"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}
              >
                <div>
                  <label style={labelStyle}>Team size (FTEs)</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="120"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Math.max(1, Number(e.target.value) || 1))}
                    style={inputStyle(false)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Annual swag budget ($)</label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    placeholder="15000"
                    value={budget}
                    onChange={(e) => setBudget(Math.max(0, Number(e.target.value) || 0))}
                    style={inputStyle(false)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.75rem" }}>
                <label style={labelStyle}>Swag cycles per year</label>
                <select
                  value={cycles}
                  onChange={(e) => setCycles(Number(e.target.value))}
                  style={inputStyle(false)}
                >
                  {CYCLE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "cycle" : "cycles"} / year
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "0.25rem" }}>
                  Onboarding kits, quarterly drops, event gifting, etc.
                </p>
              </div>

              <button
                type="submit"
                disabled={!domain}
                style={{
                  width: "100%",
                  padding: "0.875rem 1.5rem",
                  background: domain ? "var(--primary)" : "#c7d2fe",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: domain ? "pointer" : "not-allowed",
                  transition: "background 0.15s",
                  letterSpacing: "0.01em",
                }}
              >
                Generate My ROI Report →
              </button>
              <p style={{ marginTop: "0.625rem", fontSize: "0.75rem", color: "var(--text-subtle)", textAlign: "center" }}>
                Free · No signup required · Shareable link included
              </p>
            </div>
          </form>

          {/* Right: live preview */}
          <div style={{ position: "sticky", top: 88 }}>
            <div
              style={{
                background: livePalette.bg,
                border: `2px solid ${livePalette.primary}30`,
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: livePalette.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.875rem",
                }}
              >
                ✦ {liveDomain ? `${liveCompany} preview` : "Live preview"}
              </div>

              {/* Brand color swatches */}
              {liveDomain && (
                <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1rem" }}>
                  {[livePalette.primary, livePalette.secondary, livePalette.bg].map((c) => (
                    <div
                      key={c}
                      style={{ width: 28, height: 28, borderRadius: 6, background: c, border: "1px solid rgba(0,0,0,0.08)" }}
                    />
                  ))}
                  <span style={{ alignSelf: "center", fontSize: "0.72rem", color: livePalette.primary, fontWeight: 600, marginLeft: "0.25rem" }}>
                    brand palette
                  </span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { label: "Time savings", value: fmt$(liveROI.timeSavings) },
                  { label: "Waste recovery", value: fmt$(liveROI.wasteSavings) },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{row.label}</span>
                    <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>{row.value}</span>
                  </div>
                ))}
                <div
                  style={{
                    borderTop: `1px solid ${livePalette.primary}30`,
                    paddingTop: "0.75rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Annual value</span>
                    <span style={{ fontWeight: 800, color: livePalette.primary, fontSize: "1.1rem" }}>{fmt$(liveROI.total)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "0.375rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>ROI multiple</span>
                    <span style={{ fontWeight: 800, color: livePalette.primary, fontSize: "1.4rem" }}>
                      {liveROI.multiple.toFixed(1)}×
                    </span>
                  </div>
                  {liveROI.paybackWeeks !== null && (
                    <p style={{ fontSize: "0.72rem", color: livePalette.primary, fontWeight: 600, marginTop: "0.375rem" }}>
                      Payback in{" "}
                      {liveROI.paybackWeeks < 4
                        ? `${Math.round(liveROI.paybackWeeks)} weeks`
                        : `${(liveROI.paybackWeeks / 4.33).toFixed(1)} months`}
                    </p>
                  )}
                </div>
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  paddingTop: "1rem",
                  borderTop: `1px solid ${livePalette.primary}20`,
                  fontSize: "0.72rem",
                  color: "#9ca3af",
                  lineHeight: 1.5,
                }}
              >
                Based on 11 hrs/cycle → 1 hr/cycle + 52.5% → 22% waste (SwagDrop 2026).
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .roi-grid { grid-template-columns: 1fr !important; }
            .two-col { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </main>
    );
  }

  // ── STAGE: preview ────────────────────────────────────────────────────────────
  if (stage === "preview") {
    return (
      <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
        {/* Back link */}
        <div style={{ paddingTop: "2rem", marginBottom: "1.5rem" }}>
          <button
            onClick={() => setStage("input")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontWeight: 500,
              fontSize: "0.875rem",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            ← Back to inputs
          </button>
        </div>

        <div
          className="preview-grid"
          style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "2.5rem", alignItems: "start" }}
        >
          {/* Left: full report card */}
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.3rem 0.875rem",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  borderRadius: 20,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: "0.875rem",
                }}
              >
                ✦ Your ROI report
              </div>
              <h2
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  marginBottom: "0.25rem",
                }}
              >
                {companyName}&apos;s Swag ROI Report
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                Save it to get a shareable link — or share it directly with your People Leader.
              </p>
            </div>

            <ROIReportCard
              domain={domain}
              companyName={companyName}
              palette={palette}
              roi={roi}
              teamSize={teamSize}
              budget={budget}
              cyclesPerYear={cycles}
            />
          </div>

          {/* Right: lead capture */}
          <div style={{ position: "sticky", top: 88 }}>
            <div
              style={{
                background: "white",
                border: "2px solid var(--primary)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.75rem",
                }}
              >
                ✦ Save &amp; share your report
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                  lineHeight: 1.3,
                }}
              >
                Get your shareable report link
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                We&apos;ll save your report and send you a permanent link — forward it to your People Leader or VP People in one click.
              </p>

              <form onSubmit={handleSave} noValidate>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Your name</label>
                  <input
                    type="text"
                    placeholder="Maya Chen"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFormError(""); }}
                    style={inputStyle(false)}
                  />
                </div>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Work email</label>
                  <input
                    type="email"
                    placeholder="maya@yourcompany.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFormError(""); }}
                    style={inputStyle(!!formError)}
                  />
                </div>

                {formError && (
                  <p style={{ fontSize: "0.8rem", color: "var(--danger)", marginBottom: "0.875rem" }}>
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "0.875rem 1.5rem",
                    background: "var(--primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 700,
                    fontSize: "0.975rem",
                    cursor: "pointer",
                    letterSpacing: "0.01em",
                    transition: "background 0.15s",
                  }}
                >
                  Save &amp; Get Shareable Link →
                </button>
                <p style={{ marginTop: "0.625rem", fontSize: "0.75rem", color: "var(--text-subtle)", textAlign: "center" }}>
                  No spam · No commitment · Link never expires
                </p>
              </form>

              <div
                style={{
                  marginTop: "1.25rem",
                  padding: "0.875rem",
                  background: "var(--primary-light)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.8rem",
                  color: "var(--primary)",
                  lineHeight: 1.5,
                }}
              >
                <strong>After saving:</strong> We&apos;ll send a quick email with your report link and personalized notes on your {companyName} storefront.
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .preview-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </main>
    );
  }

  // ── STAGE: saving ─────────────────────────────────────────────────────────────
  if (stage === "saving") {
    return (
      <main style={{ maxWidth: 520, margin: "0 auto", padding: "8rem 1.5rem", textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: `4px solid ${palette.bg}`,
            borderTopColor: palette.primary,
            animation: "spin 0.9s linear infinite",
            margin: "0 auto 1.5rem",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          Saving your report…
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Generating your shareable link for <strong style={{ color: palette.primary }}>{companyName}</strong>
        </p>
      </main>
    );
  }

  // ── STAGE: saved ──────────────────────────────────────────────────────────────
  return (
    <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
      <div
        style={{
          maxWidth: 680,
          margin: "3rem auto 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--accent-bg)",
            border: "2px solid var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
            margin: "0 auto 1.5rem",
          }}
        >
          🎉
        </div>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "0.75rem",
          }}
        >
          Your report is saved, {name.split(" ")[0]}!
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.65, marginBottom: "2rem", maxWidth: 500, margin: "0 auto 2rem" }}>
          Your {companyName} ROI report is live. Share the link below with your People Leader — it&apos;ll open the full report with your {roi.multiple.toFixed(1)}× ROI calculation.
        </p>

        {/* Shareable link */}
        <div
          style={{
            padding: "1.5rem",
            background: palette.bg,
            border: `1.5px solid ${palette.primary}40`,
            borderRadius: "var(--radius-lg)",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: palette.primary,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.75rem",
            }}
          >
            ✦ Your shareable report link
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              readOnly
              value={shareUrl}
              style={{
                flex: 1,
                padding: "0.625rem 0.875rem",
                fontSize: "0.82rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                background: "white",
                color: "var(--text-body)",
                fontFamily: "monospace",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              style={{
                padding: "0.625rem 1rem",
                background: copied ? "var(--accent)" : palette.primary,
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              {copied ? "✓ Copied!" : "Copy link"}
            </button>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.625rem" }}>
            Send this to your VP People or Head of HR — they can see the full {companyName} ROI breakdown.
          </p>
        </div>

        {/* Mini report card */}
        <ROIReportCard
          domain={domain}
          companyName={companyName}
          palette={palette}
          roi={roi}
          teamSize={teamSize}
          budget={budget}
          cyclesPerYear={cycles}
        />

        {/* What's next */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            textAlign: "left",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "1rem", color: "var(--text-primary)" }}>
            What happens next
          </div>
          {[
            { step: "Now", text: `Share the report link above with your People Leader` },
            { step: "24 hrs", text: `We'll email you a personalized ${companyName} storefront walkthrough` },
            { step: "48 hrs", text: `If you want to proceed, your branded Shopify store goes live` },
          ].map((item) => (
            <div key={item.step} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start", marginBottom: "0.625rem" }}>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  borderRadius: 4,
                  padding: "0.2rem 0.45rem",
                  marginTop: 2,
                  whiteSpace: "nowrap",
                }}
              >
                {item.step}
              </span>
              <span style={{ fontSize: "0.875rem", color: "var(--text-body)", lineHeight: 1.5 }}>{item.text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
          <Link
            href="/pilot"
            style={{
              display: "inline-block",
              padding: "0.875rem 1.75rem",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "0.975rem",
            }}
          >
            Start My Branded Storefront →
          </Link>
          <Link
            href="/try"
            style={{
              display: "inline-block",
              padding: "0.875rem 1.5rem",
              background: "var(--surface)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontWeight: 500,
              fontSize: "0.9rem",
            }}
          >
            Preview my storefront →
          </Link>
        </div>

        {savedId && (
          <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--text-subtle)" }}>
            Report ID: {savedId}
          </p>
        )}
      </div>
    </main>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "var(--text-body)",
  marginBottom: "0.35rem",
};

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "0.65rem 0.875rem",
    fontSize: "0.95rem",
    border: `1px solid ${hasError ? "var(--danger)" : "var(--border)"}`,
    borderRadius: "var(--radius-md)",
    background: "white",
    color: "var(--text-primary)",
    outline: "none",
    appearance: "auto",
  };
}
