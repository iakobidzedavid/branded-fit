"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const BRANDED_FIT_HOURS_PER_CYCLE = 1;
const BEFORE_WASTE_RATE = 0.525; // SwagDrop 2026: 52.5% rarely/never use received swag
const AFTER_WASTE_RATE = 0.22;  // Curated self-select storefronts; 77% prefer self-select (SwagDrop)
const BRANDED_FIT_ANNUAL_FEE = 2400;

function fmt$(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtX(n: number): string {
  return `${n.toFixed(1)}×`;
}

export default function ROICalculatorPage() {
  const [teamSize, setTeamSize] = useState(120);
  const [swagBudget, setSwagBudget] = useState(15000);
  const [cyclesPerYear, setCyclesPerYear] = useState(4);
  const [hoursPerCycle, setHoursPerCycle] = useState(11);
  const [hourlyRate, setHourlyRate] = useState(85);

  const calc = useMemo(() => {
    const beforeHours = hoursPerCycle * cyclesPerYear;
    const afterHours = BRANDED_FIT_HOURS_PER_CYCLE * cyclesPerYear;
    const hoursSaved = Math.max(0, beforeHours - afterHours);
    const timeSavingsValue = hoursSaved * hourlyRate;

    const wasteBeforeDollars = swagBudget * BEFORE_WASTE_RATE;
    const wasteAfterDollars = swagBudget * AFTER_WASTE_RATE;
    const wasteSavings = Math.max(0, wasteBeforeDollars - wasteAfterDollars);

    const totalValue = timeSavingsValue + wasteSavings;
    const netBenefit = totalValue - BRANDED_FIT_ANNUAL_FEE;
    const roiMultiple = totalValue / BRANDED_FIT_ANNUAL_FEE;
    const paybackWeeks = totalValue > 0 ? (BRANDED_FIT_ANNUAL_FEE / totalValue) * 52 : null;

    return {
      beforeHours,
      afterHours,
      hoursSaved,
      timeSavingsValue,
      wasteBeforeDollars,
      wasteAfterDollars,
      wasteSavings,
      totalValue,
      netBenefit,
      roiMultiple,
      paybackWeeks,
    };
  }, [teamSize, swagBudget, cyclesPerYear, hoursPerCycle, hourlyRate]);

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

      {/* Hero */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{
          display: "inline-block",
          background: "var(--primary-light)",
          color: "var(--primary)",
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          padding: "0.3rem 0.75rem",
          borderRadius: "100px",
          marginBottom: "1rem",
        }}>
          Based on 2026 industry research
        </div>
        <h1 style={{
          fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginBottom: "0.75rem",
          lineHeight: 1.1,
        }}>
          Swag ROI Calculator
        </h1>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "1.05rem", maxWidth: 560 }}>
          How much is your current swag process costing you in time and wasted spend? Enter your numbers to find out — and see your payback from switching to Branded Fit.
        </p>
      </div>

      {/* Benchmark stats strip */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
        marginBottom: "2.5rem",
      }}>
        {[
          {
            stat: "10 hrs/week",
            desc: "Average swag coordination time for People Ops",
            source: "Custom Ink Survey, Feb 2026",
          },
          {
            stat: "52.5%",
            desc: "Employees who rarely or never use company swag",
            source: "SwagDrop Research, May 2026",
          },
          {
            stat: "69.5%",
            desc: "Swag recipients experienced a preference mismatch",
            source: "SwagDrop Research, May 2026",
          },
          {
            stat: "77%",
            desc: "Employees prefer self-selecting from curated options",
            source: "SwagDrop Research, May 2026",
          },
        ].map((item) => (
          <div key={item.stat} style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem",
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
              {item.stat}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-body)", marginTop: "0.4rem", lineHeight: 1.4 }}>
              {item.desc}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "0.4rem" }}>
              {item.source}
            </div>
          </div>
        ))}
      </div>

      {/* Inputs */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "2rem",
        marginBottom: "1.5rem",
      }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
          Your swag program
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
          <Field
            label="Team size (FTEs)"
            hint="Employees who receive branded swag"
            value={teamSize}
            min={10}
            max={2000}
            onChange={setTeamSize}
          />
          <Field
            label="Annual swag budget ($)"
            hint="Total yearly spend on branded merchandise"
            value={swagBudget}
            min={0}
            step={500}
            onChange={setSwagBudget}
          />
          <Field
            label="Swag cycles per year"
            hint="Onboarding kits, team gifts, holidays, events"
            value={cyclesPerYear}
            min={1}
            max={12}
            onChange={setCyclesPerYear}
          />
          <Field
            label="Hours per cycle today"
            hint="Sourcing, design rounds, approvals, logistics"
            value={hoursPerCycle}
            min={1}
            max={80}
            step={0.5}
            onChange={setHoursPerCycle}
          />
          <Field
            label="People Ops hourly rate ($)"
            hint="Your fully-loaded hourly cost estimate"
            value={hourlyRate}
            min={20}
            max={300}
            step={5}
            onChange={setHourlyRate}
          />
        </div>
      </div>

      {/* Before / After comparison */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginBottom: "1.5rem",
      }}>
        <CompareCard
          title="Without Branded Fit"
          accent="red"
          rows={[
            { label: "Annual swag coordination", value: `${calc.beforeHours} hrs/yr` },
            { label: "Swag that goes unused/discarded", value: fmt$(calc.wasteBeforeDollars) },
            { label: "Preferred-match rate", value: "30.5%" },
          ]}
        />
        <CompareCard
          title="With Branded Fit"
          accent="green"
          rows={[
            { label: "Annual swag coordination", value: `${calc.afterHours} hrs/yr` },
            { label: "Swag that goes unused/discarded", value: fmt$(calc.wasteAfterDollars) },
            { label: "Preferred-match rate", value: "~78%" },
          ]}
        />
      </div>

      {/* Results */}
      <div style={{
        background: "var(--accent-bg)",
        border: "1px solid var(--accent-border)",
        borderRadius: "var(--radius-lg)",
        padding: "2rem",
        marginBottom: "1.5rem",
      }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--accent-text)" }}>
          Your estimated annual return
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
          <ResultCard
            label="Hours reclaimed / yr"
            value={`${calc.hoursSaved} hrs`}
            sub={`${fmt$(calc.timeSavingsValue)} in People Ops time`}
          />
          <ResultCard
            label="Swag waste recovered"
            value={fmt$(calc.wasteSavings)}
            sub={`Budget used, not discarded`}
          />
          <ResultCard
            label="Total annual value"
            value={fmt$(calc.totalValue)}
            sub={`vs. ${fmt$(BRANDED_FIT_ANNUAL_FEE)}/yr Branded Fit fee`}
            highlight
          />
          <ResultCard
            label="ROI multiple"
            value={fmtX(calc.roiMultiple)}
            sub={`Net benefit: ${fmt$(calc.netBenefit)}`}
            highlight
          />
          {calc.paybackWeeks != null && (
            <ResultCard
              label="Payback period"
              value={calc.paybackWeeks < 4
                ? `${calc.paybackWeeks.toFixed(0)} weeks`
                : `${(calc.paybackWeeks / 4.33).toFixed(1)} months`}
              sub="Time to recover the subscription fee"
            />
          )}
        </div>
      </div>

      {/* Methodology note */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem 1.5rem",
        marginBottom: "2rem",
        fontSize: "0.82rem",
        color: "var(--text-muted)",
        lineHeight: 1.6,
      }}>
        <strong style={{ color: "var(--text-body)" }}>How this is calculated</strong><br />
        <strong>Time savings:</strong> Industry baseline of {hoursPerCycle} hrs/cycle × {cyclesPerYear} cycles, reduced to 1 hr/cycle with Branded Fit (domain paste → AI generation → approve). Custom Ink February 2026 survey of 500+ swag organizers found an average of ~10 hrs/week on swag coordination tasks.<br />
        <strong>Waste recovery:</strong> SwagDrop 2026 survey (2,500 North American workers) found 52.5% rarely or never use company swag. Branded Fit&apos;s on-brand curated storefront with employee self-selection targets ~22% discard rate (aligned with 77% preference for curated self-select, and 85.5% acceptance rate for $30–75 gifts per Postal 2025 data). Results are illustrative and will vary.
      </div>

      {/* CTA */}
      <div style={{
        background: "var(--primary)",
        borderRadius: "var(--radius-lg)",
        padding: "2rem",
        textAlign: "center",
        color: "white",
      }}>
        <div style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          {calc.roiMultiple >= 3
            ? `${fmtX(calc.roiMultiple)} ROI. See it live with your brand.`
            : "See your brand live in 8 minutes."}
        </div>
        <p style={{ fontSize: "0.95rem", opacity: 0.85, marginBottom: "1.5rem" }}>
          Paste your domain and get a real branded storefront — no account needed.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/try"
            style={{
              display: "inline-block",
              background: "white",
              color: "var(--primary)",
              fontWeight: 700,
              padding: "0.75rem 1.75rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.95rem",
            }}
          >
            Try It Free →
          </Link>
          <Link
            href="/demo"
            style={{
              display: "inline-block",
              background: "transparent",
              color: "white",
              fontWeight: 600,
              padding: "0.75rem 1.75rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.95rem",
              border: "1.5px solid rgba(255,255,255,0.5)",
            }}
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </main>
  );
}

function Field({
  label, hint, value, min, max, step, onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.35rem" }}>
        {label}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        step={step ?? 1}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!isNaN(v)) onChange(min !== undefined ? Math.max(min, v) : v);
        }}
        style={{
          width: "100%",
          padding: "0.6rem 0.75rem",
          fontSize: "1rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          background: "white",
          color: "var(--text-primary)",
          outline: "none",
        }}
      />
      <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginTop: "0.3rem" }}>{hint}</p>
    </div>
  );
}

function CompareCard({ title, accent, rows }: {
  title: string;
  accent: "red" | "green";
  rows: { label: string; value: string }[];
}) {
  const isGreen = accent === "green";
  return (
    <div style={{
      background: isGreen ? "var(--accent-bg)" : "#fef2f2",
      border: `1px solid ${isGreen ? "var(--accent-border)" : "#fca5a5"}`,
      borderRadius: "var(--radius-lg)",
      padding: "1.25rem",
    }}>
      <div style={{
        fontSize: "0.8rem",
        fontWeight: 700,
        color: isGreen ? "var(--accent-text)" : "#991b1b",
        marginBottom: "1rem",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}>
        {title}
      </div>
      {rows.map((row) => (
        <div key={row.label} style={{ marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{row.label}</div>
          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "0.15rem" }}>
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResultCard({ label, value, sub, highlight }: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div style={{
      background: "white",
      borderRadius: "var(--radius-md)",
      padding: "1rem",
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.25rem" }}>
        {label}
      </div>
      <div style={{
        fontSize: highlight ? "1.75rem" : "1.4rem",
        fontWeight: 800,
        color: highlight ? "var(--accent)" : "var(--text-primary)",
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "0.25rem" }}>
        {sub}
      </div>
    </div>
  );
}
