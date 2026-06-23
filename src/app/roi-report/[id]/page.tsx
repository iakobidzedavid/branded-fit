import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServerSupabase } from "@/lib/supabase-server";

// ── Brand palettes (must match /try and /roi-report) ─────────────────────────
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

const REPORT_PRODUCTS = [
  { name: "Premium Hoodie", emoji: "👕", price: 42, reorder: 87 },
  { name: "Insulated Tumbler", emoji: "☕", price: 36, reorder: 94 },
  { name: "Canvas Tote", emoji: "🎒", price: 18, reorder: 83 },
  { name: "Snapback Cap", emoji: "🧢", price: 32, reorder: 82 },
];

const BEFORE_HOURS = 11;
const AFTER_HOURS = 1;
const BF_ANNUAL_FEE = 2400;
const HOURLY_RATE = 85;

function fmt$(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

interface ReportRow {
  id: string;
  domain: string;
  company_name: string;
  team_size: number | null;
  annual_budget: number | null;
  cycles_per_year: number;
  roi_multiple: number | null;
  roi_annual_value: number | null;
  time_savings: number | null;
  waste_savings: number | null;
  palette_index: number;
  created_at: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let title = "Swag ROI Report — Branded Fit";
  let description = "See the full swag program ROI analysis, powered by Branded Fit.";
  try {
    const supabase = getServerSupabase();
    const { data } = await supabase
      .from("roi_reports")
      .select("company_name, roi_multiple")
      .eq("id", id)
      .single();
    if (data) {
      title = `${data.company_name} Swag ROI Report — Branded Fit`;
      description = `${data.company_name}'s swag program ROI analysis: ${Number(data.roi_multiple ?? 0).toFixed(1)}× return on a $2,400/yr Branded Fit subscription.`;
    }
  } catch {
    // use defaults
  }
  return { title, description };
}

export default async function ROIReportSharedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let report: ReportRow | null = null;
  try {
    const supabase = getServerSupabase();
    const { data } = await supabase
      .from("roi_reports")
      .select(
        "id, domain, company_name, team_size, annual_budget, cycles_per_year, roi_multiple, roi_annual_value, time_savings, waste_savings, palette_index, created_at"
      )
      .eq("id", id)
      .single();
    report = data;
  } catch {
    // getServerSupabase throws if env vars missing
  }

  if (!report) {
    notFound();
  }

  const palette = BRAND_PALETTES[report.palette_index % BRAND_PALETTES.length] ?? BRAND_PALETTES[0];

  const timeSavings = report.time_savings ?? 0;
  const wasteSavings = report.waste_savings ?? 0;
  const totalValue = report.roi_annual_value ?? timeSavings + wasteSavings;
  const roiMultiple = report.roi_multiple ?? (BF_ANNUAL_FEE > 0 ? totalValue / BF_ANNUAL_FEE : 0);
  const paybackWeeks = totalValue > 0 ? (BF_ANNUAL_FEE / totalValue) * 52 : null;
  const cyclesPerYear = report.cycles_per_year ?? 4;
  const teamSize = report.team_size ?? 0;
  const budget = report.annual_budget ?? 0;

  const generatedDate = new Date(report.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
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
            marginBottom: "1rem",
          }}
        >
          ✦ Swag ROI Report
        </div>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
            lineHeight: 1.1,
          }}
        >
          {report.company_name}&apos;s Swag Program ROI
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Generated {generatedDate} · Powered by Branded Fit
        </p>
      </div>

      {/* Report card */}
      <div
        style={{
          border: `2px solid ${palette.primary}30`,
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-md)",
          background: "white",
          marginBottom: "2rem",
        }}
      >
        {/* Header */}
        <div style={{ background: palette.primary, padding: "1.5rem 2rem", color: "white" }}>
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
          <div style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {report.company_name}
          </div>
          <div style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "0.25rem" }}>
            {report.domain}
            {teamSize > 0 ? ` · ${teamSize} employees` : ""}
            {cyclesPerYear > 0 ? ` · ${cyclesPerYear} swag cycle${cyclesPerYear !== 1 ? "s" : ""}/yr` : ""}
            {budget > 0 ? ` · ${fmt$(budget)}/yr budget` : ""}
          </div>
        </div>

        {/* Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            borderBottom: `1px solid ${palette.primary}20`,
          }}
          className="metrics-grid"
        >
          {[
            {
              label: "Time Savings",
              value: fmt$(timeSavings),
              sub: `${(BEFORE_HOURS - AFTER_HOURS) * cyclesPerYear} hrs reclaimed/yr`,
              highlight: false,
            },
            {
              label: "Waste Recovery",
              value: fmt$(wasteSavings),
              sub: "52.5% → 22% waste",
              highlight: false,
            },
            {
              label: "Annual Value",
              value: fmt$(totalValue),
              sub: "vs. status quo",
              highlight: true,
            },
          ].map((m, i) => (
            <div
              key={m.label}
              style={{
                padding: "1.5rem 2rem",
                borderRight: i < 2 ? `1px solid ${palette.primary}20` : "none",
                background: m.highlight ? palette.bg : "white",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "0.4rem",
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: m.highlight ? palette.primary : "var(--text-primary)",
                  lineHeight: 1,
                  marginBottom: "0.35rem",
                }}
              >
                {m.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* ROI summary */}
        <div
          style={{
            padding: "1.25rem 2rem",
            background: palette.bg,
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
            flexWrap: "wrap",
            borderBottom: `1px solid ${palette.primary}20`,
          }}
        >
          <div>
            <span style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 600 }}>ROI multiple </span>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: palette.primary }}>
              {Number(roiMultiple).toFixed(1)}×
            </span>
          </div>
          {paybackWeeks !== null && (
            <div>
              <span style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 600 }}>Payback </span>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {paybackWeeks < 4
                  ? `${Math.round(paybackWeeks)} weeks`
                  : `${(paybackWeeks / 4.33).toFixed(1)} months`}
              </span>
            </div>
          )}
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>Branded Fit annual fee</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>{fmt$(BF_ANNUAL_FEE)}/yr</div>
          </div>
        </div>

        {/* Product catalog */}
        <div style={{ padding: "1.5rem 2rem" }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "1rem",
            }}
          >
            AI-curated catalog sample for {report.company_name}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem" }} className="product-grid">
            {REPORT_PRODUCTS.map((p) => (
              <div
                key={p.name}
                style={{
                  background: palette.bg,
                  borderRadius: 10,
                  padding: "1rem 0.75rem",
                  textAlign: "center",
                  border: `1px solid ${palette.primary}20`,
                }}
              >
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{p.emoji}</div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: "0.25rem" }}>{p.name}</div>
                <div style={{ fontSize: "0.72rem", color: "#9ca3af" }}>${p.price}/unit</div>
                <div
                  style={{
                    marginTop: "0.35rem",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: palette.primary,
                    background: "white",
                    borderRadius: 4,
                    padding: "0.15rem 0.35rem",
                    display: "inline-block",
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
            padding: "1rem 2rem",
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
            Time savings at {fmt$(HOURLY_RATE)}/hr. SwagDrop 2026, n=2,500.
          </span>
        </div>
      </div>

      {/* Methodology note */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          marginBottom: "2rem",
          fontSize: "0.82rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--text-primary)" }}>Methodology:</strong> Time savings based on industry average of{" "}
        {BEFORE_HOURS} hrs/swag cycle vs. Branded Fit&apos;s 1 hr/cycle, at ${HOURLY_RATE}/hr (US People Ops median, BLS 2025). Waste savings based on 52.5% vs. 22% unredeemed swag rate (SwagDrop 2026 survey, n=2,500). Branded Fit annual fee: ${BF_ANNUAL_FEE}/yr.
      </div>

      {/* CTA */}
      <div
        style={{
          padding: "2.5rem",
          background: "var(--primary)",
          borderRadius: "var(--radius-lg)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "2rem",
          alignItems: "center",
        }}
        className="cta-block"
      >
        <div>
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "white",
              marginBottom: "0.5rem",
              lineHeight: 1.2,
            }}
          >
            Want this for your company?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            Build your own ROI report in 60 seconds — brand colors, real numbers, shareable link included.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <Link
            href="/roi-report"
            style={{
              display: "inline-block",
              padding: "0.875rem 1.75rem",
              background: "white",
              color: "var(--primary)",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "0.95rem",
              whiteSpace: "nowrap",
            }}
          >
            Build my ROI report →
          </Link>
          <Link
            href="/pilot"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "var(--radius-md)",
              fontWeight: 500,
              fontSize: "0.875rem",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            Start my pilot
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .metrics-grid { grid-template-columns: 1fr !important; }
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cta-block { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
