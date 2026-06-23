"use client";

import { useState, useMemo, useCallback } from "react";

function calcLTV(
  annualPrice: number,
  annualRebate: number,
  churnRate: number,
  discountRate: number,
  years = 5
): number {
  let ltv = 0;
  const arpu = annualPrice + annualRebate;
  for (let n = 1; n <= years; n++) {
    ltv += (arpu * Math.pow(1 - churnRate, n - 1)) / Math.pow(1 + discountRate, n - 0.5);
  }
  return ltv;
}

function fmt$(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

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

const TIERS = [
  { key: "core", label: "Core", price: 2400, rebate: 540 },
  { key: "growth", label: "Growth", price: 4800, rebate: 960 },
  { key: "scale", label: "Scale", price: 9600, rebate: 1800 },
];

type SaveState = "idle" | "saving" | "saved" | "error";

export default function UnitEconomicsCalc() {
  const [tierKey, setTierKey] = useState("core");
  const [churnRate, setChurnRate] = useState(0.20);
  const [discountRate, setDiscountRate] = useState(0.10);
  const [coca, setCoca] = useState(1780);
  const [includeRebate, setIncludeRebate] = useState(true);

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedId, setSavedId] = useState("");
  const [saveError, setSaveError] = useState("");

  const tier = TIERS.find((t) => t.key === tierKey)!;
  const rebate = includeRebate ? tier.rebate : 0;

  const ltv = useMemo(
    () => calcLTV(tier.price, rebate, churnRate, discountRate),
    [tier.price, rebate, churnRate, discountRate]
  );
  const ratio = useMemo(() => (coca > 0 ? ltv / coca : 0), [ltv, coca]);

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
          ltv_5yr: Math.round(ltv),
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

  return (
    <div
      style={{
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem",
        boxShadow: "var(--shadow-sm)",
        maxWidth: 600,
      }}
    >
      {/* Result display — at top of calculator, before sliders */}
      <div
        id="ltv-result-display"
        style={{
          background: ratio >= 3 ? "var(--accent-bg)" : "#fef2f2",
          border: `2px solid ${ratio >= 3 ? "var(--accent-border)" : "#fecaca"}`,
          borderRadius: "var(--radius-lg)",
          padding: "1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 120 }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>
            5-Year Discounted LTV
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.15rem" }}>
            {fmt$(ltv)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            {fmt$(tier.price)}/yr + {fmt$(rebate)} rebate · {fmtPct(churnRate)} churn · {fmt$(coca)} COCA
          </div>
          <GateChip ratio={ratio} />
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: "2.75rem", fontWeight: 900, color: ratio >= 3 ? "#166534" : "#991b1b", lineHeight: 1, marginBottom: "0.5rem" }}>
            {ratio.toFixed(2)}×
          </div>
          {/* Save-to-DB button — in result block */}
          <button
            id="save-scenario-btn"
            onClick={handleSave}
            disabled={saveState === "saving"}
            style={{
              padding: "0.5rem 1rem",
              background: saveState === "saved" ? "#166534" : "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: saveState === "saving" ? "wait" : "pointer",
              transition: "background 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "✓ Saved" : saveState === "error" ? "Retry" : "Save to DB"}
          </button>
          {saveState === "saved" && savedId && (
            <div style={{ marginTop: "0.3rem", fontSize: "0.65rem", color: "#166534" }}>
              ID: {savedId.slice(0, 8)}…
            </div>
          )}
          {saveState === "error" && saveError && (
            <div style={{ marginTop: "0.3rem", fontSize: "0.65rem", color: "var(--danger)", maxWidth: 120 }}>
              {saveError}
            </div>
          )}
        </div>
      </div>

      {/* Tier selector */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={labelStyle}>Plan Tier</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {TIERS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTierKey(t.key)}
              style={{
                flex: 1,
                padding: "0.45rem 0.5rem",
                border: `2px solid ${tierKey === t.key ? "var(--primary)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                background: tierKey === t.key ? "var(--primary-light)" : "white",
                color: tierKey === t.key ? "var(--primary)" : "var(--text-muted)",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              {t.label}
              <div style={{ fontSize: "0.68rem", fontWeight: 500, marginTop: "0.1rem" }}>
                {fmt$(t.price)}/yr
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Annual churn slider */}
      <div style={{ marginBottom: "1.1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
          <label style={labelStyle}>Annual Churn Rate</label>
          <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>{fmtPct(churnRate)}</span>
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
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-subtle)" }}>
          <span>5% (enterprise)</span><span>20% (SMB median)</span><span>50% (high)</span>
        </div>
      </div>

      {/* COCA slider */}
      <div style={{ marginBottom: "1.1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
          <label style={labelStyle}>COCA (Customer Acquisition Cost)</label>
          <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>{fmt$(coca)}</span>
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
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-subtle)" }}>
          <span>$500</span><span>$1,780 target</span><span>$4,000</span>
        </div>
      </div>

      {/* Discount rate slider */}
      <div style={{ marginBottom: "1.1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
          <label style={labelStyle}>Discount Rate (WACC)</label>
          <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>{fmtPct(discountRate)}</span>
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
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-subtle)" }}>
          <span>6%</span><span>10% (base)</span><span>20%</span>
        </div>
      </div>

      {/* Rebate toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.75rem 0.875rem",
          background: "var(--surface)",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
        }}
        onClick={() => setIncludeRebate(!includeRebate)}
      >
        <div
          style={{
            width: 38,
            height: 21,
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
              left: includeRebate ? 19 : 3,
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: "white",
              transition: "left 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Include Printify rebate margin ({fmt$(tier.rebate)}/yr)
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            ~3.6% on monthly GMV via Printify Merchant Program
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "var(--text-body)",
  marginBottom: "0.3rem",
};
