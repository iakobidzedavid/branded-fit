"use client";

import { useState } from "react";
import Link from "next/link";

const BRANDED_FIT_FEE = 2400;
const BEFORE_HOURS = 11;
const AFTER_HOURS = 1;
const HOURLY_RATE = 85;
const BEFORE_WASTE = 0.525;
const AFTER_WASTE = 0.22;

// Default example values so ROI panel is always populated on load
const DEFAULT_BUDGET = 15000;
const DEFAULT_CYCLES = 4;

function fmt$(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function calcROI(budget: number, cycles: number) {
  const timeSavings = (BEFORE_HOURS - AFTER_HOURS) * cycles * HOURLY_RATE;
  const wasteSavings = Math.max(0, budget * (BEFORE_WASTE - AFTER_WASTE));
  const total = timeSavings + wasteSavings;
  const multiple = BRANDED_FIT_FEE > 0 ? total / BRANDED_FIT_FEE : 0;
  const paybackWeeks = total > 0 ? (BRANDED_FIT_FEE / total) * 52 : null;
  return { timeSavings, wasteSavings, total, multiple, paybackWeeks };
}

function cleanDomainStr(raw: string) {
  return raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
}

type Stage = "form" | "success";

const APPROACH_OPTIONS = [
  { value: "", label: "Select one…" },
  { value: "none", label: "We don't have a swag program yet" },
  { value: "manual", label: "Manual sourcing + design work" },
  { value: "platform", label: "SwagUp, Stadium, or similar" },
  { value: "printify_diy", label: "Printify / Printful DIY" },
  { value: "agency", label: "Swag agency / supplier" },
];

export default function PilotPage() {
  const [stage, setStage] = useState<Stage>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [domain, setDomain] = useState("");
  const [teamSize, setTeamSize] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [cycles, setCycles] = useState<string>(String(DEFAULT_CYCLES));
  const [approach, setApproach] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Use actual entered budget if > 0, otherwise show defaults so the panel is always live
  const budgetNum = Number(budget) || 0;
  const cyclesNum = Number(cycles) || DEFAULT_CYCLES;
  const roiInputBudget = budgetNum > 0 ? budgetNum : DEFAULT_BUDGET;
  const roi = calcROI(roiInputBudget, cyclesNum);
  const isUsingDefaults = budgetNum === 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Enter a valid work email";
    }
    if (!company.trim()) errs.company = "Required";
    if (!domain.trim()) errs.domain = "Required";
    if (!teamSize || Number(teamSize) < 1) errs.teamSize = "Required";
    if (!budget || Number(budget) < 0) errs.budget = "Required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/pilot-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          company: company.trim(),
          domain: cleanDomainStr(domain),
          team_size: Number(teamSize),
          annual_swag_budget: Number(budget),
          swag_cycles_per_year: cyclesNum,
          current_approach: approach || null,
          roi_multiple: parseFloat(roi.multiple.toFixed(2)),
          roi_annual_value: Math.round(roi.total),
        }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error || "Server error — please try again");
      }
      setStage("success");
    } catch (err) {
      setErrors({ submit: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  if (stage === "success") {
    const actualRoi = calcROI(budgetNum > 0 ? budgetNum : DEFAULT_BUDGET, cyclesNum);
    return (
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "5rem 1.5rem 6rem", textAlign: "center" }}>
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
          🚀
        </div>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "0.75rem",
          }}
        >
          Pilot request confirmed!
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.65, marginBottom: "2.5rem", maxWidth: 480, margin: "0 auto 2.5rem" }}>
          We&apos;ve received your request for{" "}
          <strong style={{ color: "var(--primary)" }}>{company}</strong>.
          Expect to hear from us within 24 hours — your storefront will be live in 48.
        </p>

        <div
          style={{
            padding: "1.5rem",
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
            borderRadius: "var(--radius-lg)",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--accent-text)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1rem",
            }}
          >
            ✓ Your estimated annual return
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { label: "Time savings", value: fmt$(actualRoi.timeSavings) },
              { label: "Waste recovery", value: fmt$(actualRoi.wasteSavings) },
              { label: "Total annual value", value: fmt$(actualRoi.total) },
              {
                label: "ROI multiple",
                value: `${actualRoi.multiple.toFixed(1)}×`,
                highlight: true,
              },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.15rem" }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: item.highlight ? "1.5rem" : "1.1rem",
                    fontWeight: 800,
                    color: item.highlight ? "var(--accent)" : "var(--text-primary)",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          {actualRoi.paybackWeeks !== null && (
            <p style={{ marginTop: "0.875rem", fontSize: "0.8rem", color: "var(--accent-text)", fontWeight: 500 }}>
              Payback period: {actualRoi.paybackWeeks < 4
                ? `${Math.round(actualRoi.paybackWeeks)} weeks`
                : `${(actualRoi.paybackWeeks / 4.33).toFixed(1)} months`}
            </p>
          )}
        </div>

        <div
          style={{
            padding: "1.25rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.875rem" }}>
            What happens next
          </div>
          {[
            { step: "24 hrs", text: "We send you a one-page AI brand profile for your domain" },
            { step: "48 hrs", text: "Your branded Shopify storefront is live — 8–12 curated products" },
            { step: "Day 3", text: "30-minute founder walkthrough call — see your store in action" },
            { step: "Day 14", text: "First redemption report — see how your team responded" },
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

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/try"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            Preview my storefront →
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              background: "var(--surface)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontWeight: 500,
              fontSize: "0.95rem",
            }}
          >
            ← Back to home
          </Link>
        </div>
      </main>
    );
  }

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
          Early access
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
          Start your 48-hour branded storefront pilot
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.65, maxWidth: 560 }}>
          Tell us about your team. We&apos;ll generate a brand profile, curate your product catalog,
          and have a live Shopify storefront in your colors within 48 hours. Zero manual work on your end.
        </p>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: "2.5rem",
          alignItems: "start",
        }}
        className="pilot-grid"
      >
        {/* Form column */}
        <div>
          <form onSubmit={handleSubmit} noValidate>
            {/* Contact info card */}
            <div
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem",
                marginBottom: "1rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                Your contact info
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }} className="two-col">
                <FormField label="Your name" error={errors.name} required>
                  <input
                    type="text"
                    placeholder="Maya Chen"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                    style={inputStyle(!!errors.name)}
                  />
                </FormField>
                <FormField label="Work email" error={errors.email} required>
                  <input
                    type="email"
                    placeholder="maya@yourcompany.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                    style={inputStyle(!!errors.email)}
                  />
                </FormField>
              </div>

              <FormField label="Company name" error={errors.company} required>
                <input
                  type="text"
                  placeholder="Acme Inc"
                  value={company}
                  onChange={(e) => { setCompany(e.target.value); setErrors((p) => ({ ...p, company: "" })); }}
                  style={inputStyle(!!errors.company)}
                />
              </FormField>

              <div style={{ marginTop: "1rem" }}>
                <FormField
                  label="Company domain"
                  hint="e.g. notion.so or linear.app — used to generate your brand profile"
                  error={errors.domain}
                  required
                >
                  <input
                    type="text"
                    placeholder="yourcompany.com"
                    value={domain}
                    onChange={(e) => { setDomain(e.target.value); setErrors((p) => ({ ...p, domain: "" })); }}
                    style={inputStyle(!!errors.domain)}
                  />
                </FormField>
              </div>
            </div>

            {/* Swag program card */}
            <div
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem",
                marginBottom: "1rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                Your swag program
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }} className="two-col">
                <FormField
                  label="Team size (FTEs)"
                  hint="Employees receiving branded swag"
                  error={errors.teamSize}
                  required
                >
                  <input
                    type="number"
                    min={1}
                    placeholder="120"
                    value={teamSize}
                    onChange={(e) => { setTeamSize(e.target.value); setErrors((p) => ({ ...p, teamSize: "" })); }}
                    style={inputStyle(!!errors.teamSize)}
                  />
                </FormField>
                <FormField
                  label="Annual swag budget ($)"
                  hint="Updates the ROI estimate on the right"
                  error={errors.budget}
                  required
                >
                  <input
                    type="number"
                    min={0}
                    step={500}
                    placeholder="15000"
                    value={budget}
                    onChange={(e) => { setBudget(e.target.value); setErrors((p) => ({ ...p, budget: "" })); }}
                    style={inputStyle(!!errors.budget)}
                  />
                </FormField>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="two-col">
                <FormField
                  label="Swag cycles per year"
                  hint="Onboarding kits, quarterly gifts, events…"
                >
                  <select
                    value={cycles}
                    onChange={(e) => setCycles(e.target.value)}
                    style={inputStyle(false)}
                  >
                    {[1, 2, 3, 4, 6, 8, 12].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "cycle" : "cycles"} / year</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Current approach">
                  <select
                    value={approach}
                    onChange={(e) => setApproach(e.target.value)}
                    style={inputStyle(false)}
                  >
                    {APPROACH_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>

            {errors.submit && (
              <div
                style={{
                  padding: "0.875rem 1rem",
                  background: "#fef2f2",
                  border: "1px solid #fca5a5",
                  borderRadius: "var(--radius-md)",
                  color: "#991b1b",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "1rem",
                background: submitting ? "#818cf8" : "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: submitting ? "not-allowed" : "pointer",
                letterSpacing: "0.01em",
                transition: "background 0.15s",
              }}
            >
              {submitting ? "Submitting…" : "Request My Pilot →"}
            </button>

            <p style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--text-subtle)", textAlign: "center" }}>
              No credit card · Storefront live within 48 hours · Cancel anytime
            </p>
          </form>
        </div>

        {/* Right column: what's included + live ROI panel */}
        <div style={{ position: "sticky", top: 88 }}>
          {/* What you get */}
          <div
            style={{
              background: "var(--primary)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
              marginBottom: "1rem",
              color: "white",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                opacity: 0.75,
                marginBottom: "0.75rem",
              }}
            >
              What&apos;s included
            </div>
            {[
              "AI brand profile from your domain",
              "8–12 curated products in your colors",
              "Live Shopify storefront in 48 hrs",
              "30-min founder onboarding call",
              "Day-30 redemption report",
              "Zero merchandise markup — ever",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                <span style={{ color: "#86efac", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ opacity: 0.9 }}>{item}</span>
              </div>
            ))}
            <div
              style={{
                marginTop: "1.25rem",
                paddingTop: "1.25rem",
                borderTop: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>All-in annual price</span>
              <span style={{ fontSize: "1.5rem", fontWeight: 800 }}>$2,400/yr</span>
            </div>
          </div>

          {/* Live ROI panel — always shows, uses real values or defaults */}
          <div
            style={{
              background: "var(--accent-bg)",
              border: "1px solid var(--accent-border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              transition: "all 0.3s",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--accent-text)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "1rem",
              }}
            >
              ✦ {isUsingDefaults ? "Estimated ROI (example)" : "Your live ROI estimate"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <ROIRow label="Time savings" value={fmt$(roi.timeSavings)} />
              <ROIRow label="Waste recovery" value={fmt$(roi.wasteSavings)} />
              <div style={{ borderTop: "1px solid var(--accent-border)", paddingTop: "0.875rem" }}>
                <ROIRow label="Annual value" value={fmt$(roi.total)} highlight />
                <div style={{ marginTop: "0.5rem" }}>
                  <ROIRow label="ROI multiple" value={`${roi.multiple.toFixed(1)}×`} highlight />
                </div>
                {roi.paybackWeeks !== null && (
                  <p style={{ marginTop: "0.625rem", fontSize: "0.75rem", color: "var(--accent-text)", fontWeight: 500 }}>
                    Payback in{" "}
                    {roi.paybackWeeks < 4
                      ? `${Math.round(roi.paybackWeeks)} weeks`
                      : `${(roi.paybackWeeks / 4.33).toFixed(1)} months`}
                  </p>
                )}
              </div>
              {isUsingDefaults && (
                <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", lineHeight: 1.5, borderTop: "1px solid var(--accent-border)", paddingTop: "0.75rem" }}>
                  Based on $15k/yr budget, 4 cycles. Enter your budget above to see your numbers.
                </p>
              )}
              {!isUsingDefaults && (
                <p style={{ fontSize: "0.7rem", color: "var(--text-subtle)", lineHeight: 1.5, borderTop: "1px solid var(--accent-border)", paddingTop: "0.75rem" }}>
                  Based on 11 hrs/cycle → 1 hr/cycle + 52.5% → 22% waste rate (SwagDrop 2026, n=2,500).
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div
        style={{
          marginTop: "3rem",
          padding: "1.5rem",
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          display: "flex",
          gap: "2.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { stat: "8 min", label: "Domain to live storefront" },
          { stat: "85%", label: "Employee redemption rate" },
          { stat: "$0", label: "Merchandise markup" },
        ].map((item) => (
          <div key={item.stat} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
              {item.stat}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pilot-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

function FormField({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 0 }}>
      <label
        style={{
          display: "block",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--text-body)",
          marginBottom: "0.35rem",
        }}
      >
        {label}
        {required && <span style={{ color: "var(--primary)", marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "0.25rem" }}>{hint}</p>
      )}
      {error && (
        <p style={{ fontSize: "0.72rem", color: "var(--danger)", marginTop: "0.25rem" }}>{error}</p>
      )}
    </div>
  );
}

function ROIRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{label}</span>
      <span
        style={{
          fontSize: highlight ? "1.1rem" : "0.9rem",
          fontWeight: highlight ? 800 : 600,
          color: highlight ? "var(--accent)" : "var(--text-primary)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

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
