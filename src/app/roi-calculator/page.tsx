"use client";

import { useState } from "react";

const HOURLY_RATE = 35;

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatPercent(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

export default function ROICalculatorPage() {
  const [employeeCount, setEmployeeCount] = useState(50);
  const [swagSpend, setSwagSpend] = useState(5000);
  const [hoursSaved, setHoursSaved] = useState(2);

  const annualTimeSavings = employeeCount * hoursSaved * 12 * HOURLY_RATE;
  const netBenefit = annualTimeSavings - swagSpend;
  const roi = swagSpend > 0 ? (netBenefit / swagSpend) * 100 : 0;
  const paybackMonths = annualTimeSavings > 0 ? (swagSpend / (annualTimeSavings / 12)) : null;

  const roiPositive = roi >= 0;

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 1.5rem 5rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
        ROI Calculator
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2.5rem", lineHeight: 1.65, fontSize: "1rem" }}>
        See the real return on your branded swag investment. Adjust the inputs below
        to calculate your team&apos;s annual ROI.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
          padding: "2rem",
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Number of Employees</label>
          <input
            type="number"
            min={1}
            value={employeeCount}
            onChange={(e) => setEmployeeCount(Math.max(1, Number(e.target.value)))}
            style={inputStyle}
          />
          <p style={hintStyle}>Employees who will use branded gear</p>
        </div>

        <div>
          <label style={labelStyle}>Annual Swag Spend ($)</label>
          <input
            type="number"
            min={0}
            step={100}
            value={swagSpend}
            onChange={(e) => setSwagSpend(Math.max(0, Number(e.target.value)))}
            style={inputStyle}
          />
          <p style={hintStyle}>Total yearly budget for branded apparel</p>
        </div>

        <div>
          <label style={labelStyle}>Hours Saved / Employee / Month</label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={hoursSaved}
            onChange={(e) => setHoursSaved(Math.max(0, Number(e.target.value)))}
            style={inputStyle}
          />
          <p style={hintStyle}>Time saved from uniform/dress-code decisions</p>
        </div>
      </div>

      <div
        style={{
          background: roiPositive ? "var(--accent-bg)" : "#fef2f2",
          border: `1px solid ${roiPositive ? "var(--accent-border)" : "#fca5a5"}`,
          borderRadius: "var(--radius-lg)",
          padding: "1.75rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.25rem" }}>
          Your Estimated ROI
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          <Metric
            label="Annual Time Savings"
            value={formatCurrency(annualTimeSavings)}
            sub={`${employeeCount} employees × ${hoursSaved} hrs/mo × $${HOURLY_RATE}/hr`}
          />
          <Metric
            label="Net Annual Benefit"
            value={formatCurrency(netBenefit)}
            sub="Time savings minus swag spend"
            highlight={roiPositive ? "green" : "red"}
          />
          <Metric
            label="Return on Investment"
            value={formatPercent(roi)}
            sub={`On ${formatCurrency(swagSpend)} spend`}
            highlight={roiPositive ? "green" : "red"}
            large
          />
          <Metric
            label="Payback Period"
            value={paybackMonths != null ? `${paybackMonths.toFixed(1)} months` : "—"}
            sub="Time to recoup your investment"
          />
        </div>
      </div>

      <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)", lineHeight: 1.6 }}>
        Calculation assumes {formatCurrency(HOURLY_RATE)}/hr average employee time value. Actual results vary
        by industry, role, and usage. This tool is for illustrative purposes.
      </p>
    </main>
  );
}

function Metric({
  label,
  value,
  sub,
  highlight,
  large,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: "green" | "red";
  large?: boolean;
}) {
  const valueColor =
    highlight === "green" ? "var(--accent)" :
    highlight === "red" ? "var(--danger)" :
    "var(--text-primary)";

  return (
    <div
      style={{
        background: "white",
        borderRadius: "var(--radius-md)",
        padding: "1rem",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem", fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ fontSize: large ? "2rem" : "1.4rem", fontWeight: 700, color: valueColor, lineHeight: 1.2 }}>
        {value}
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginTop: "0.25rem" }}>
        {sub}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "var(--text-body)",
  marginBottom: "0.4rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  fontSize: "1rem",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  outline: "none",
  boxSizing: "border-box",
  color: "var(--text-primary)",
  background: "white",
};

const hintStyle: React.CSSProperties = {
  fontSize: "0.78rem",
  color: "var(--text-subtle)",
  marginTop: "0.3rem",
};
