"use client";

import { useState } from "react";
import Link from "next/link";

const HOURLY_RATE = 35; // default assumed hourly value of employee time

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
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "#4f46e5", textDecoration: "none", fontSize: "0.9rem" }}>
          ← Back to Home
        </Link>
      </nav>

      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
        ROI Calculator
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem", lineHeight: 1.6 }}>
        See the real return on your branded swag investment. Adjust the inputs below
        to calculate your team&apos;s annual ROI.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>
            Number of Employees
          </label>
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
          <label style={labelStyle}>
            Annual Swag Spend ($)
          </label>
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
          <label style={labelStyle}>
            Hours Saved / Employee / Month
          </label>
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

      <div style={{
        background: roiPositive ? "#f0fdf4" : "#fef2f2",
        border: `1px solid ${roiPositive ? "#86efac" : "#fca5a5"}`,
        borderRadius: 12,
        padding: "1.5rem",
        marginBottom: "1.5rem",
      }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", marginBottom: "1.25rem" }}>
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
            sub={`Time savings minus swag spend`}
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
            sub={`Time to recoup your investment`}
          />
        </div>
      </div>

      <p style={{ fontSize: "0.8rem", color: "#9ca3af", lineHeight: 1.5 }}>
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
    highlight === "green" ? "#16a34a" :
    highlight === "red" ? "#dc2626" :
    "#111827";

  return (
    <div style={{ background: "white", borderRadius: 8, padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
      <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.25rem", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: large ? "2rem" : "1.4rem", fontWeight: 700, color: valueColor, lineHeight: 1.2 }}>
        {value}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>{sub}</div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.9rem",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "0.4rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  fontSize: "1rem",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  outline: "none",
  boxSizing: "border-box",
  color: "#111827",
};

const hintStyle: React.CSSProperties = {
  fontSize: "0.78rem",
  color: "#9ca3af",
  marginTop: "0.3rem",
};
