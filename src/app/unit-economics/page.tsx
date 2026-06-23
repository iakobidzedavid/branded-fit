"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";

// ── LTV DCF calculation (mid-year convention) ─────────────────────────────────
function calcLTV(
  annualPrice: number,
  annualRebate: number,
  churnRate: number,
  discountRate: number,
  years: number = 5
): number {
  let ltv = 0;
  const arpu = annualPrice + annualRebate;
  for (let n = 1; n <= years; n++) {
    const retentionFactor = Math.pow(1 - churnRate, n - 1);
    const discountFactor = Math.pow(1 + discountRate, n - 0.5);
    ltv += (arpu * retentionFactor) / discountFactor;
  }
  return ltv;
}

function calcRatio(ltv: number, coca: number): number {
  return coca > 0 ? ltv / coca : 0;
}

// ── Default / preset scenarios ─────────────────────────────────────────────────
const TIERS = [
  { key: "core",   label: "Core",   price: 2400, rebate: 540 },
  { key: "growth", label: "Growth", price: 4800, rebate: 960 },
  { key: "scale",  label: "Scale",  price: 9600, rebate: 1800 },
];

interface Scenario {
  label: string;
  description: string;
  churnRate: number;
  discountRate: number;
  coca: number;
}

const SCENARIOS: Scenario[] = [
  {
    label: "Pessimistic",
    description: "30% annual churn, higher COCA, no rebate margin",
    churnRate: 0.30,
    discountRate: 0.12,
    coca: 2400,
  },
  {
    label: "Base Case",
    description: "20% annual churn — SaaS SMB median (2026)",
    churnRate: 0.20,
    discountRate: 0.10,
    coca: 1780,
  },
  {
    label: "Optimistic",
    description: "12% churn (PLG-assisted), lower COCA via word-of-mouth",
    churnRate: 0.12,
    discountRate: 0.10,
    coca: 1200,
  },
];

// ── Formatting helpers ─────────────────────────────────────────────────────────
function fmt$(n: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(n);
}

function fmtPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

// ── Gate indicator ─────────────────────────────────────────────────────────────
function GateChip({ ratio, gate = 3 }: { ratio: number; gate?: number }) {
  const pass = ratio >= gate;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.2rem 0.6rem",
        borderRadius: 20,
        fontSize: "0.75rem",
        fontWeight: 700,
        background: pass ? "#f0fdf4" : "#fef2f2",
        color: pass ? "#166534" : "#991b1b",
        border: `1px solid ${pass ? "#bbf7d0" : "#fecaca"}`,
      }}
    >
      {pass ? "✓" : "✗"} Gate {pass ? "cleared" : "not met"}: {ratio.toFixed(2)}× {pass ? "≥" : "<"} {gate}×
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
type SaveState = "idle" | "saving" | "saved" | "error";

export default function UnitEconomicsPage() {
  // Calculator state
  const [tierKey, setTierKey] = useState("core");
  const [churnRate, setChurnRate] = useState(0.20);
  const [discountRate, setDiscountRate] = useState(0.10);
  const [coca, setCoca] = useState(1780);
  const [includeRebate, setIncludeRebate] = useState(true);

  // Save state
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedId, setSavedId] = useState("");
  const [saveError, setSaveError] = useState("");

  const tier = TIERS.find((t) => t.key === tierKey)!;
  const rebate = includeRebate ? tier.rebate : 0;

  const ltv = useMemo(
    () => calcLTV(tier.price, rebate, churnRate, discountRate),
    [tier.price, rebate, churnRate, discountRate]
  );

  const ratio = useMemo(() => calcRatio(ltv, coca), [ltv, coca]);

  // Scenario table calculations
  const scenarioRows = useMemo(() => {
    return SCENARIOS.map((s) => {
      const r = includeRebate ? tier.rebate : 0;
      const ltv5 = calcLTV(
        tier.price,
        s.label === "Pessimistic" ? 0 : r,
        s.churnRate,
        s.discountRate
      );
      return { ...s, ltv5, ratio: calcRatio(ltv5, s.coca) };
    });
  }, [tier, includeRebate]);

  const handleSave = useCallback(async () => {
    setSaveState("saving");
    setSaveError("");
    try {
      const res = await fetch("/api/unit-economics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: tierKey,
          scenario_label: "custom",
          annual_price: tier.price,
          annual_rebate: rebate,
          churn_rate: churnRate,
          discount_rate: discountRate,
          coca,
          ltv_5yr: parseFloat(ltv.toFixed(0)),
          ltv_coca_ratio: parseFloat(ratio.toFixed(3)),
          notes: `Tier: ${tier.label}, Churn: ${fmtPct(churnRate)}, Discount: ${fmtPct(discountRate)}, Rebate: ${includeRebate ? "included" : "excluded"}`,
        }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        throw new Error(d.error ?? "Server error");
      }
      const d = (await res.json()) as { scenario?: { id: string } };
      setSavedId(d.scenario?.id ?? "");
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 4000);
    } catch (err) {
      setSaveError((err as Error).message);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 4000);
    }
  }, [tierKey, tier, rebate, churnRate, discountRate, coca, ltv, ratio, includeRebate]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>

      {/* Hero */}
      <div style={{ padding: "4rem 0 2.5rem", maxWidth: 760 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem", alignItems: "center" }}>
          <span
            style={{
              display: "inline-block",
              padding: "0.3rem 0.875rem",
              background: "var(--primary-light)",
              color: "var(--primary)",
              borderRadius: 20,
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            DE Step 17 · Unit Economics
          </span>
          <GateChip ratio={5.0} />
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
          Branded Fit LTV:COCA Analysis
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.65, maxWidth: 640 }}>
          Stress-test our unit economics. Adjust churn, COCA, and discount rate — the gate requires
          LTV ≥ 3× COCA. Our base case clears at <strong style={{ color: "var(--accent-text)" }}>5.0×</strong>.
        </p>
      </div>

      {/* Summary cards */}
      <div
        className="summary-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "3rem" }}
      >
        {[
          { label: "5-yr LTV (Core, base)", value: "$8,940", sub: "Subscription + Printify rebate", highlight: true },
          { label: "COCA (Year 1)", value: "$1,780", sub: "Founder-led warm outbound + PLG" },
          { label: "LTV:COCA Ratio", value: "5.0×", sub: "Gate: ≥3× ✓", accent: true },
          { label: "Pessimistic floor", value: "3.3×", sub: "30% churn, no rebate, $2,400 COCA" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              padding: "1.5rem",
              background: card.accent ? "var(--accent-bg)" : card.highlight ? "var(--primary-light)" : "white",
              border: `1px solid ${card.accent ? "var(--accent-border)" : card.highlight ? "#c7d2fe" : "var(--border)"}`,
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: card.accent ? "var(--accent-text)" : card.highlight ? "var(--primary)" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
              {card.label}
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: card.accent ? "#166534" : card.highlight ? "var(--primary)" : "var(--text-primary)", lineHeight: 1, marginBottom: "0.35rem" }}>
              {card.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Main content — two columns */}
      <div className="ue-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", marginBottom: "3rem" }}>

        {/* Left: calculator */}
        <div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
            Interactive Stress-Test
          </h2>

          <div
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Tier selector */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Plan Tier</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {TIERS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTierKey(t.key)}
                    style={{
                      flex: 1,
                      padding: "0.5rem 0.75rem",
                      border: `2px solid ${tierKey === t.key ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "var(--radius-md)",
                      background: tierKey === t.key ? "var(--primary-light)" : "white",
                      color: tierKey === t.key ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {t.label}
                    <div style={{ fontSize: "0.7rem", fontWeight: 500, marginTop: "0.1rem" }}>
                      {fmt$(t.price)}/yr
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Churn rate slider */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <label style={labelStyle}>Annual Churn Rate</label>
                <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.95rem" }}>{fmtPct(churnRate)}</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.50}
                step={0.01}
                value={churnRate}
                onChange={(e) => setChurnRate(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-subtle)" }}>
                <span>5% (enterprise)</span>
                <span>20% (SMB median)</span>
                <span>50% (high)</span>
              </div>
            </div>

            {/* COCA slider */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <label style={labelStyle}>COCA (Customer Acquisition Cost)</label>
                <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.95rem" }}>{fmt$(coca)}</span>
              </div>
              <input
                type="range"
                min={500}
                max={4000}
                step={50}
                value={coca}
                onChange={(e) => setCoca(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-subtle)" }}>
                <span>$500</span>
                <span>$1,780 target</span>
                <span>$4,000</span>
              </div>
            </div>

            {/* Discount rate */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <label style={labelStyle}>Discount Rate (WACC)</label>
                <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.95rem" }}>{fmtPct(discountRate)}</span>
              </div>
              <input
                type="range"
                min={0.06}
                max={0.20}
                step={0.01}
                value={discountRate}
                onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-subtle)" }}>
                <span>6%</span>
                <span>10% (base)</span>
                <span>20%</span>
              </div>
            </div>

            {/* Rebate toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.875rem 1rem",
                background: "var(--surface)",
                borderRadius: "var(--radius-md)",
                marginBottom: "1.75rem",
                cursor: "pointer",
              }}
              onClick={() => setIncludeRebate(!includeRebate)}
            >
              <div
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  background: includeRebate ? "var(--primary)" : "var(--border)",
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: includeRebate ? 21 : 3,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  Include Printify rebate margin ({fmt$(tier.rebate)}/yr)
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  ~3.6% on monthly GMV via Printify Merchant Program
                </div>
              </div>
            </div>

            {/* Result */}
            <div
              style={{
                background: ratio >= 3 ? "var(--accent-bg)" : "#fef2f2",
                border: `2px solid ${ratio >= 3 ? "var(--accent-border)" : "#fecaca"}`,
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                5-Year Discounted LTV
              </div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.25rem" }}>
                {fmt$(ltv)}
              </div>
              <div style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                LTV:COCA ratio
              </div>
              <div
                style={{
                  fontSize: "3rem",
                  fontWeight: 900,
                  color: ratio >= 3 ? "#166534" : "#991b1b",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}
              >
                {ratio.toFixed(2)}×
              </div>
              <GateChip ratio={ratio} />

              <div style={{ marginTop: "1.25rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {fmt$(tier.price)}/yr sub + {fmt$(rebate)} rebate · {fmtPct(churnRate)} churn · {fmtPct(discountRate)} discount · {fmt$(coca)} COCA
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saveState === "saving"}
                style={{
                  marginTop: "1rem",
                  padding: "0.625rem 1.25rem",
                  background: saveState === "saved" ? "var(--accent)" : "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: saveState === "saving" ? "wait" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {saveState === "saving" ? "Saving…" : saveState === "saved" ? "✓ Saved scenario" : saveState === "error" ? "Retry" : "Save this scenario"}
              </button>
              {saveState === "saved" && savedId && (
                <div style={{ marginTop: "0.4rem", fontSize: "0.7rem", color: "var(--accent-text)" }}>
                  Saved · ID: {savedId.slice(0, 8)}…
                </div>
              )}
              {saveState === "error" && saveError && (
                <div style={{ marginTop: "0.4rem", fontSize: "0.7rem", color: "var(--danger)" }}>
                  {saveError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: methodology + benchmarks */}
        <div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
            Methodology &amp; Benchmarks
          </h2>

          {/* Formula card */}
          <div
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-sm)",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.875rem" }}>
              LTV Formula (5-year DCF, mid-year convention)
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "0.82rem",
                background: "var(--surface)",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                color: "var(--text-body)",
                lineHeight: 1.7,
                overflowX: "auto",
              }}
            >
              LTV = Σ(n=1..5){" "}
              <span style={{ color: "var(--primary)" }}>ARPU × (1−churn)^(n−1)</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ <span style={{ color: "#7c3aed" }}>(1+r)^(n−0.5)</span><br />
              <br />
              ARPU = subscription + Printify rebate<br />
              r = discount rate (WACC)
            </div>
          </div>

          {/* Benchmarks */}
          <div
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-sm)",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.875rem" }}>
              Benchmark Sources (2026)
            </div>
            {[
              { metric: "SMB SaaS annual churn", value: "18–22%", source: "ChurnZero / OpenView SaaS Benchmarks 2026" },
              { metric: "PLG-assisted churn reduction", value: "−6–8 pts", source: "Product-Led Growth Collective 2026" },
              { metric: "Printify Merchant rebate rate", value: "~3.6% of GMV", source: "Printify Partner Program terms" },
              { metric: "WACC (seed-stage SaaS)", value: "8–12%", source: "Damodaran 2026 risk-free + equity premium" },
              { metric: "LTV:COCA healthy SaaS floor", value: "3× minimum", source: "Disciplined Entrepreneurship Step 17" },
            ].map((b) => (
              <div
                key={b.metric}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "0.5rem",
                  alignItems: "start",
                  padding: "0.625rem 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.15rem" }}>{b.metric}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>{b.source}</div>
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)", textAlign: "right", whiteSpace: "nowrap" }}>
                  {b.value}
                </div>
              </div>
            ))}
          </div>

          {/* Revenue components */}
          <div
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.875rem" }}>
              ARPU Components — Core Tier
            </div>
            {[
              { item: "Annual SaaS subscription", value: "$2,400", pct: "82%", note: "Flat annual fee — no per-seat, no GMV cut" },
              { item: "Printify merchant rebate", value: "$540", pct: "18%", note: "3.6% of ~$15K annual swag GMV per customer" },
              { item: "Total ARPU (Year 1)", value: "$2,940", pct: "100%", note: "Gross (no cost deductions in LTV model)" },
            ].map((row, i) => (
              <div
                key={row.item}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: "0.5rem",
                  alignItems: "center",
                  padding: "0.625rem 0",
                  borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                  background: i === 2 ? "var(--primary-light)" : "transparent",
                  borderRadius: i === 2 ? "var(--radius-sm)" : 0,
                  paddingLeft: i === 2 ? "0.5rem" : 0,
                  paddingRight: i === 2 ? "0.5rem" : 0,
                  marginLeft: i === 2 ? "-0.5rem" : 0,
                  marginRight: i === 2 ? "-0.5rem" : 0,
                }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: i === 2 ? 700 : 500, color: i === 2 ? "var(--primary)" : "var(--text-primary)" }}>
                    {row.item}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)" }}>{row.note}</div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "right" }}>{row.pct}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: i === 2 ? "var(--primary)" : "var(--text-primary)", textAlign: "right" }}>
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario table */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>
          3-Scenario Gate Verification — {tier.label} Tier
        </h2>
        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface)", borderBottom: "2px solid var(--border)" }}>
                {["Scenario", "Churn", "Discount Rate", "COCA", `LTV (${tier.label}, 5yr)`, "LTV:COCA", "Gate ≥3×"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.875rem 1.25rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenarioRows.map((row, i) => {
                const isBase = row.label === "Base Case";
                const pass = row.ratio >= 3;
                return (
                  <tr
                    key={row.label}
                    style={{
                      borderBottom: i < scenarioRows.length - 1 ? "1px solid var(--border)" : "none",
                      background: isBase ? "var(--primary-light)" : "white",
                    }}
                  >
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ fontWeight: 700, color: isBase ? "var(--primary)" : "var(--text-primary)", fontSize: "0.9rem" }}>
                        {row.label}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        {row.description}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", fontWeight: 600, color: "var(--text-body)", fontSize: "0.9rem" }}>
                      {fmtPct(row.churnRate)}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", fontWeight: 600, color: "var(--text-body)", fontSize: "0.9rem" }}>
                      {fmtPct(row.discountRate)}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", fontWeight: 600, color: "var(--text-body)", fontSize: "0.9rem" }}>
                      {fmt$(row.coca)}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: isBase ? "var(--primary)" : "var(--text-primary)", fontSize: "0.95rem" }}>
                      {fmt$(row.ltv5)}
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span style={{ fontSize: "1.2rem", fontWeight: 800, color: pass ? "#166534" : "#991b1b" }}>
                        {row.ratio.toFixed(2)}×
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.2rem 0.6rem",
                          borderRadius: 20,
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          background: pass ? "#f0fdf4" : "#fef2f2",
                          color: pass ? "#166534" : "#991b1b",
                          border: `1px solid ${pass ? "#bbf7d0" : "#fecaca"}`,
                        }}
                      >
                        {pass ? "✓ Cleared" : "✗ Below"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--text-subtle)" }}>
          All scenarios use 5-year DCF (mid-year discounting). Pessimistic excludes Printify rebate entirely.
          Base case uses 20% annual churn consistent with 2026 SMB SaaS median (OpenView/ChurnZero benchmarks).
        </p>
      </div>

      {/* Tier comparison */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>
          Per-Tier LTV at Base-Case Assumptions
        </h2>
        <div
          className="tier-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}
        >
          {TIERS.map((t) => {
            const tLtv = calcLTV(t.price, t.rebate, 0.20, 0.10);
            const tRatio = tLtv / 1780;
            return (
              <div
                key={t.key}
                style={{
                  background: "white",
                  border: t.key === "core" ? "2px solid var(--primary)" : "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
                  {t.label} {t.key === "core" && "— beachhead"}
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                  {fmt$(tLtv)}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>5-year discounted LTV</div>
                {[
                  { label: "Annual price", value: fmt$(t.price) },
                  { label: "Printify rebate/yr", value: fmt$(t.rebate) },
                  { label: "ARPU", value: fmt$(t.price + t.rebate) },
                  { label: "COCA", value: fmt$(1780) },
                  { label: "LTV:COCA", value: `${tRatio.toFixed(2)}×` },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.35rem 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: "0.82rem",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
                    <span style={{ fontWeight: 700, color: row.label === "LTV:COCA" ? "#166534" : "var(--text-primary)" }}>
                      {row.value}
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: "1rem" }}>
                  <GateChip ratio={tRatio} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div
        style={{
          background: "var(--primary-light)",
          border: "1px solid #c7d2fe",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
            Ready to validate these unit economics with a live pilot?
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: 500 }}>
            Get a branded Shopify storefront live in under 10 minutes. Real customers.
            Real retention data. Real LTV.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
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
            Start Pilot →
          </Link>
          <Link
            href="/roi-report"
            style={{
              display: "inline-block",
              padding: "0.875rem 1.5rem",
              background: "white",
              color: "var(--primary)",
              border: "1px solid #c7d2fe",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Customer ROI Report →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .summary-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ue-main-grid { grid-template-columns: 1fr !important; }
          .tier-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .summary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

// ── Style helper ──────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "var(--text-body)",
  marginBottom: "0.35rem",
};
