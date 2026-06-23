"use client";

import { useState } from "react";
import Link from "next/link";

// ── Scoring helpers ──────────────────────────────────────────────────────────

const APPROACH_DATA: Record<
  string,
  { baseScore: number; wasteRate: number; hoursPerCycle: number; label: string }
> = {
  none:         { baseScore: 25, wasteRate: 0,    hoursPerCycle: 0,  label: "No swag program yet" },
  manual:       { baseScore: 38, wasteRate: 0.53, hoursPerCycle: 14, label: "Manual sourcing / design work" },
  printify_diy: { baseScore: 32, wasteRate: 0.52, hoursPerCycle: 16, label: "Printify / Printful DIY" },
  agency:       { baseScore: 52, wasteRate: 0.40, hoursPerCycle: 6,  label: "Swag agency / supplier" },
  platform:     { baseScore: 58, wasteRate: 0.45, hoursPerCycle: 4,  label: "SwagUp, Stadium, or similar" },
};

const PAIN_PENALTY: Record<string, number> = {
  too_expensive:   -12,
  low_redemption:  -18,
  too_slow:        -10,
  no_analytics:    -8,
  all_of_the_above: -22,
};

const PAIN_LABELS: Record<string, string> = {
  too_expensive:    "Too expensive / bad ROI",
  low_redemption:   "Low redemption — swag sits unused",
  too_slow:         "Takes too long to set up",
  no_analytics:     "No visibility into what actually works",
  all_of_the_above: "All of the above",
};

const HOURLY_RATE = 85;
const BF_WASTE_RATE = 0.22;
const BF_HOURS_PER_CYCLE = 1;
const BF_ANNUAL_FEE = 2400;

function calcScore(approach: string, pain: string): number {
  const base = APPROACH_DATA[approach]?.baseScore ?? 30;
  const penalty = PAIN_PENALTY[pain] ?? 0;
  return Math.max(15, Math.min(72, base + penalty));
}

function calcMetrics(approach: string, budget: number, cycles: number) {
  const { wasteRate, hoursPerCycle } = APPROACH_DATA[approach] ?? { wasteRate: 0.52, hoursPerCycle: 11 };

  const currentWasteDollars = Math.round(budget * wasteRate);
  const currentTimeHrs = hoursPerCycle * cycles;
  const currentTimeCost = currentTimeHrs * HOURLY_RATE;

  const bfWasteDollars = Math.round(budget * BF_WASTE_RATE);
  const bfTimeHrs = BF_HOURS_PER_CYCLE * cycles;
  const bfTimeCost = bfTimeHrs * HOURLY_RATE;

  const wasteSavings = Math.max(0, currentWasteDollars - bfWasteDollars);
  const timeSavings = Math.max(0, currentTimeCost - bfTimeCost);
  const totalAnnualValue = wasteSavings + timeSavings;
  const roiMultiple = BF_ANNUAL_FEE > 0 ? totalAnnualValue / BF_ANNUAL_FEE : 0;

  return {
    currentWasteDollars,
    currentTimeHrs,
    bfWasteDollars,
    bfTimeHrs,
    wasteSavings,
    timeSavings,
    totalAnnualValue,
    roiMultiple,
  };
}

function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function scoreColor(score: number) {
  if (score < 36) return { fg: "#dc2626", bg: "#fef2f2", border: "#fca5a5", label: "Needs Work" };
  if (score < 56) return { fg: "#b45309", bg: "#fffbeb", border: "#fcd34d", label: "Room to Improve" };
  return { fg: "#059669", bg: "#ecfdf5", border: "#6ee7b7", label: "Getting There" };
}

// ── Option components ────────────────────────────────────────────────────────

function OptionCard({
  value,
  selected,
  onSelect,
  children,
}: {
  value: string;
  selected: boolean;
  onSelect: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        width: "100%",
        padding: "0.875rem 1rem",
        background: selected ? "var(--primary-light)" : "white",
        border: `2px solid ${selected ? "var(--primary)" : "var(--border)"}`,
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 0.15s, background 0.15s",
        fontSize: "0.9rem",
        color: selected ? "var(--primary)" : "var(--text-body)",
        fontWeight: selected ? 600 : 400,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: `2px solid ${selected ? "var(--primary)" : "var(--border)"}`,
          background: selected ? "var(--primary)" : "white",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "white", display: "block" }} />
        )}
      </span>
      {children}
    </button>
  );
}

function NumberInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
  prefix,
  min,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  prefix?: string;
  min?: number;
}) {
  return (
    <div>
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
      </label>
      {hint && (
        <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginBottom: "0.4rem" }}>{hint}</p>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {prefix && (
          <span
            style={{
              position: "absolute",
              left: "0.875rem",
              color: "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.95rem",
              pointerEvents: "none",
            }}
          >
            {prefix}
          </span>
        )}
        <input
          type="number"
          min={min ?? 0}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: `0.65rem ${prefix ? "0.875rem 0.65rem 1.75rem" : "0.875rem"}`,
            fontSize: "0.95rem",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            outline: "none",
            color: "var(--text-primary)",
            background: "white",
          }}
        />
      </div>
    </div>
  );
}

// ── Step indicator ───────────────────────────────────────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginBottom: "2rem" }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === current - 1 ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: i < current ? "var(--primary)" : i === current - 1 ? "var(--primary)" : "var(--border)",
            transition: "width 0.2s, background 0.2s",
          }}
        />
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

type Stage = "step1" | "step2" | "step3" | "results" | "captured";

export default function AssessmentPage() {
  const [stage, setStage] = useState<Stage>("step1");

  // Step 1
  const [approach, setApproach] = useState("");
  const [teamSize, setTeamSize] = useState("");

  // Step 2
  const [budget, setBudget] = useState("");
  const [cycles, setCycles] = useState("4");

  // Step 3
  const [pain, setPain] = useState("");

  // Results / capture
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  // Derived
  const budgetNum = Number(budget) || 0;
  const cyclesNum = Number(cycles) || 4;
  const score = approach && pain ? calcScore(approach, pain) : 0;
  const metrics = calcMetrics(approach || "manual", budgetNum || 15000, cyclesNum);
  const sc = scoreColor(score);

  async function handleSubmitResults() {
    setSubmitting(true);

    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_approach: approach || null,
          team_size: Number(teamSize) || null,
          annual_budget: budgetNum || null,
          cycles_per_year: cyclesNum,
          biggest_pain: pain || null,
          swag_score: score,
          estimated_waste_dollars: metrics.currentWasteDollars,
          estimated_time_savings: Math.round(metrics.timeSavings),
          roi_multiple: parseFloat(metrics.roiMultiple.toFixed(2)),
          email: email.trim().toLowerCase(),
        }),
      });

      if (res.ok) {
        const d = await res.json() as { assessment?: { id: string } };
        if (d.assessment?.id) setAssessmentId(d.assessment.id);
      }
    } catch {
      // non-fatal — still show captured
    }

    setStage("captured");
    setSubmitting(false);
  }

  async function handleEmailCapture(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid work email");
      return;
    }
    setEmailError("");
    await handleSubmitResults();
  }

  // ── STEP 1 ──────────────────────────────────────────────────────────────
  if (stage === "step1") {
    const canProceed = !!approach && Number(teamSize) >= 1;
    return (
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
        <StepDots current={1} total={3} />

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-block",
              padding: "0.3rem 0.875rem",
              background: "var(--primary-light)",
              color: "var(--primary)",
              borderRadius: 20,
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            ✦ Swag Health Check · Step 1 of 3
          </div>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.25rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "0.75rem",
            }}
          >
            How are you handling swag today?
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Answer 3 quick questions. We&apos;ll score your swag program and show exactly where
            you&apos;re leaving money on the table.
          </p>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem",
            marginBottom: "1.25rem",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.875rem" }}>
            Current swag approach
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {Object.entries(APPROACH_DATA).map(([key, { label }]) => (
              <OptionCard key={key} value={key} selected={approach === key} onSelect={setApproach}>
                {label}
              </OptionCard>
            ))}
          </div>

          <NumberInput
            label="Team size (FTEs receiving swag)"
            hint="How many employees would get swag?"
            value={teamSize}
            onChange={setTeamSize}
            placeholder="e.g. 120"
            min={1}
          />
        </div>

        <button
          type="button"
          disabled={!canProceed}
          onClick={() => setStage("step2")}
          style={{
            width: "100%",
            padding: "1rem",
            background: canProceed ? "var(--primary)" : "#c7d2fe",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: canProceed ? "pointer" : "not-allowed",
            transition: "background 0.15s",
          }}
        >
          Next: Budget →
        </button>
      </main>
    );
  }

  // ── STEP 2 ──────────────────────────────────────────────────────────────
  if (stage === "step2") {
    const canProceed = budgetNum > 0;
    return (
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
        <StepDots current={2} total={3} />

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-block",
              padding: "0.3rem 0.875rem",
              background: "var(--primary-light)",
              color: "var(--primary)",
              borderRadius: 20,
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            ✦ Swag Health Check · Step 2 of 3
          </div>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.25rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "0.75rem",
            }}
          >
            What does your swag program cost?
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
            These numbers power your personalized ROI estimate.
          </p>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem",
            marginBottom: "1.25rem",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }} className="two-col">
            <NumberInput
              label="Annual swag budget ($)"
              hint="Total spend on merch per year"
              value={budget}
              onChange={setBudget}
              placeholder="15000"
              prefix="$"
              min={0}
            />
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--text-body)",
                  marginBottom: "0.35rem",
                }}
              >
                Swag cycles per year
              </label>
              <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginBottom: "0.4rem" }}>
                Onboarding kits, quarterly drops, events…
              </p>
              <select
                value={cycles}
                onChange={(e) => setCycles(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.875rem",
                  fontSize: "0.95rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  background: "white",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              >
                {[1, 2, 3, 4, 6, 8, 12].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "cycle" : "cycles"} / year
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live waste preview */}
          {budgetNum > 0 && (
            <div
              style={{
                padding: "1rem",
                background: "var(--surface)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                display: "flex",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>Est. annual budget waste</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#dc2626" }}>
                  {fmt$(calcMetrics(approach || "manual", budgetNum, cyclesNum).currentWasteDollars)}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-subtle)" }}>at industry avg rates</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>With Branded Fit</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--accent)" }}>
                  {fmt$(calcMetrics(approach || "manual", budgetNum, cyclesNum).bfWasteDollars)}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-subtle)" }}>22% waste vs. industry avg</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>Potential savings</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--primary)" }}>
                  {fmt$(calcMetrics(approach || "manual", budgetNum, cyclesNum).wasteSavings)}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-subtle)" }}>budget recovered per year</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={() => setStage("step1")}
            style={{
              flex: "0 0 auto",
              padding: "1rem 1.25rem",
              background: "var(--surface)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <button
            type="button"
            disabled={!canProceed}
            onClick={() => setStage("step3")}
            style={{
              flex: 1,
              padding: "1rem",
              background: canProceed ? "var(--primary)" : "#c7d2fe",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: canProceed ? "pointer" : "not-allowed",
              transition: "background 0.15s",
            }}
          >
            Next: Pain Points →
          </button>
        </div>

        <style>{`@media (max-width: 540px) { .two-col { grid-template-columns: 1fr !important; } }`}</style>
      </main>
    );
  }

  // ── STEP 3 ──────────────────────────────────────────────────────────────
  if (stage === "step3") {
    const canProceed = !!pain;
    return (
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
        <StepDots current={3} total={3} />

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-block",
              padding: "0.3rem 0.875rem",
              background: "var(--primary-light)",
              color: "var(--primary)",
              borderRadius: 20,
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            ✦ Swag Health Check · Step 3 of 3
          </div>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.25rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "0.75rem",
            }}
          >
            What&apos;s your biggest swag frustration?
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
            This shapes your personalized score and the recommendations we&apos;ll show you.
          </p>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem",
            marginBottom: "1.25rem",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {Object.entries(PAIN_LABELS).map(([key, label]) => (
              <OptionCard key={key} value={key} selected={pain === key} onSelect={setPain}>
                {label}
              </OptionCard>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={() => setStage("step2")}
            style={{
              flex: "0 0 auto",
              padding: "1rem 1.25rem",
              background: "var(--surface)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <button
            type="button"
            disabled={!canProceed}
            onClick={() => setStage("results")}
            style={{
              flex: 1,
              padding: "1rem",
              background: canProceed ? "var(--primary)" : "#c7d2fe",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: canProceed ? "pointer" : "not-allowed",
              transition: "background 0.15s",
            }}
          >
            See My Score →
          </button>
        </div>
      </main>
    );
  }

  // ── RESULTS ──────────────────────────────────────────────────────────────
  if (stage === "results") {
    const approachInfo = APPROACH_DATA[approach] ?? APPROACH_DATA.manual;
    const { hoursPerCycle } = approachInfo;

    return (
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
        {/* Score hero */}
        <div
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            background: sc.bg,
            border: `2px solid ${sc.border}`,
            borderRadius: "var(--radius-lg)",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: sc.fg, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
            ✦ Your Swag Health Score
          </div>
          <div
            style={{
              fontSize: "clamp(4rem, 12vw, 6rem)",
              fontWeight: 800,
              color: sc.fg,
              lineHeight: 1,
              marginBottom: "0.5rem",
            }}
          >
            {score}
            <span style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", opacity: 0.6 }}>/100</span>
          </div>
          <div
            style={{
              display: "inline-block",
              padding: "0.3rem 0.875rem",
              background: "rgba(255,255,255,0.7)",
              color: sc.fg,
              borderRadius: 20,
              fontSize: "0.8rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            {sc.label}
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
            {score < 36
              ? "Your swag program has significant room for efficiency gains — especially on waste and setup time."
              : score < 56
              ? "You&apos;re investing in swag, but redemption gaps and setup overhead are eroding your ROI."
              : "You have a working swag program, but AI curation and self-select storefronts could push redemption well above industry average."}
          </p>
        </div>

        {/* Branded Fit comparison */}
        {budgetNum > 0 && (
          <div
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              marginBottom: "1.5rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                padding: "1rem 1.25rem",
                background: "var(--surface)",
                borderBottom: "1px solid var(--border)",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "var(--text-primary)",
              }}
            >
              Current approach vs. Branded Fit
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", fontSize: "0.85rem" }}>
              {/* Header */}
              <div style={thCell({ header: true })}>Metric</div>
              <div style={thCell({ header: true })}>Today</div>
              <div style={thCell({ header: true, accent: true })}>Branded Fit</div>

              {/* Annual budget waste */}
              <div style={thCell()}>Annual budget waste</div>
              <div style={thCell({ danger: true })}>{fmt$(metrics.currentWasteDollars)}</div>
              <div style={thCell({ accent: true })}>{fmt$(metrics.bfWasteDollars)}</div>

              {/* Hours per cycle */}
              {hoursPerCycle > 0 && (
                <>
                  <div style={thCell()}>Hours to run each cycle</div>
                  <div style={thCell({ danger: true })}>{hoursPerCycle} hrs</div>
                  <div style={thCell({ accent: true })}>1 hr</div>
                </>
              )}

              {/* Time cost */}
              {hoursPerCycle > 0 && (
                <>
                  <div style={thCell()}>Annual time cost (at ${HOURLY_RATE}/hr)</div>
                  <div style={thCell({ danger: true })}>{fmt$(metrics.currentTimeHrs * HOURLY_RATE)}</div>
                  <div style={thCell({ accent: true })}>{fmt$(metrics.bfTimeHrs * HOURLY_RATE)}</div>
                </>
              )}

              {/* Savings row */}
              <div style={{ ...thCell(), background: "var(--primary-light)", fontWeight: 700, color: "var(--primary)" }}>
                Estimated annual savings
              </div>
              <div style={{ ...thCell(), background: "var(--primary-light)", color: "var(--text-muted)" }}>—</div>
              <div style={{ ...thCell({ accent: true }), background: "var(--primary-light)", fontWeight: 800, fontSize: "1rem", color: "var(--primary)" }}>
                {fmt$(metrics.totalAnnualValue)}
              </div>
            </div>
          </div>
        )}

        {/* ROI summary card */}
        {budgetNum > 0 && metrics.roiMultiple > 0 && (
          <div
            style={{
              background: "var(--accent-bg)",
              border: "1px solid var(--accent-border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              { label: "Budget saved / yr", value: fmt$(metrics.wasteSavings) },
              { label: "Time value saved / yr", value: fmt$(metrics.timeSavings) },
              { label: "Total annual value", value: fmt$(metrics.totalAnnualValue) },
              { label: "ROI vs $2,400/yr fee", value: `${metrics.roiMultiple.toFixed(1)}×`, highlight: true },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>{item.label}</div>
                <div
                  style={{
                    fontSize: item.highlight ? "1.75rem" : "1.25rem",
                    fontWeight: 800,
                    color: item.highlight ? "var(--accent)" : "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Personalized insight */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "1rem" }}>
            Where Branded Fit helps most for you
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {pain === "low_redemption" && (
              <Insight icon="📈" text="Self-select storefronts fix your redemption: 77% of employees prefer picking their own swag vs. company-chosen items (SwagDrop 2026, n=2,500). Industry average is 38% — we target 85%." />
            )}
            {pain === "too_expensive" && (
              <Insight icon="💰" text={`At $2,400/yr all-in with zero merchandise markup, you'd recover ~${fmt$(metrics.wasteSavings)} in wasted budget annually — that's a ${metrics.roiMultiple.toFixed(1)}× return on your investment.`} />
            )}
            {pain === "too_slow" && (
              <Insight icon="⚡" text={`Your domain → live, orderable Shopify storefront in under 8 minutes. AI handles brand extraction, catalog curation, and product matching — you get one link to share.`} />
            )}
            {pain === "no_analytics" && (
              <Insight icon="📊" text="Per-employee redemption tracking included. See exactly what gets used vs. what sits in a drawer. After two cycles, your catalog automatically reflects what your team actually wants." />
            )}
            {pain === "all_of_the_above" && (
              <>
                <Insight icon="📈" text="Self-select storefront: 85% redemption target vs. 38% industry average." />
                <Insight icon="💰" text={`Zero markup, $2,400/yr flat — ${fmt$(metrics.wasteSavings)} in recovered waste annually.`} />
                <Insight icon="⚡" text="Domain → live Shopify storefront in under 8 minutes." />
                <Insight icon="📊" text="Per-employee redemption analytics included — catalog improves every cycle." />
              </>
            )}
            <Insight icon="🔒" text="AI curation using your brand colors, fonts, and identity — zero manual browsing through thousands of SKUs." />
          </div>
        </div>

        {/* Email capture CTA */}
        <div
          style={{
            padding: "2rem",
            background: "var(--primary)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "0.3rem 0.875rem",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              borderRadius: 20,
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Fast-track your branded merchandise
          </div>
          <h2
            style={{
              fontSize: "clamp(1.25rem, 3vw, 1.6rem)",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: "0.625rem",
            }}
          >
            Ready to start your 48-hour pilot?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem", maxWidth: 440, margin: "0 auto 1.5rem" }}>
            Enter your work email and we&apos;ll send your full assessment report — plus how to get a live
            branded Shopify storefront in under 48 hours.
          </p>

          <form onSubmit={handleEmailCapture} style={{ display: "flex", gap: "0.625rem", justifyContent: "center", flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="you@yourcompany.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              style={{
                flex: "1 1 220px",
                maxWidth: 300,
                padding: "0.75rem 1rem",
                fontSize: "0.95rem",
                border: `1px solid ${emailError ? "#fca5a5" : "rgba(255,255,255,0.3)"}`,
                borderRadius: "var(--radius-md)",
                outline: "none",
                background: "rgba(255,255,255,0.12)",
                color: "white",
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "0.75rem 1.5rem",
                background: submitting ? "rgba(255,255,255,0.3)" : "white",
                color: submitting ? "rgba(255,255,255,0.6)" : "var(--primary)",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: submitting ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
            >
              {submitting ? "Saving…" : "Get Full Report →"}
            </button>
          </form>
          {emailError && (
            <p style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: "#fca5a5" }}>{emailError}</p>
          )}
          <p style={{ marginTop: "0.875rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.6)" }}>
            No credit card · Storefront live within 48 hours · Cancel anytime
          </p>
        </div>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link
            href="/pilot"
            style={{
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              fontWeight: 500,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Skip to pilot form →
          </Link>
        </div>
      </main>
    );
  }

  // ── CAPTURED ──────────────────────────────────────────────────────────────
  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
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
        ✓
      </div>
      <h2
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginBottom: "0.75rem",
        }}
      >
        Your report is on its way!
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.975rem", lineHeight: 1.65, marginBottom: "2rem" }}>
        We&apos;ve saved your assessment
        {assessmentId && (
          <span style={{ color: "var(--text-subtle)", fontSize: "0.78rem" }}> (#{assessmentId.slice(0, 8)})</span>
        )}{" "}
        and will follow up with your personalized swag program recommendations within 24 hours.
      </p>

      {/* Score recap */}
      <div
        style={{
          padding: "1.25rem",
          background: sc.bg,
          border: `1.5px solid ${sc.border}`,
          borderRadius: "var(--radius-lg)",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: sc.fg, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
          Your Swag Health Score
        </div>
        <div style={{ fontSize: "3rem", fontWeight: 800, color: sc.fg, lineHeight: 1 }}>
          {score}<span style={{ fontSize: "1.1rem", opacity: 0.6 }}>/100</span>
        </div>
        <div style={{ fontSize: "0.8rem", color: sc.fg, fontWeight: 600, marginTop: "0.25rem" }}>{sc.label}</div>
        {budgetNum > 0 && metrics.roiMultiple > 0 && (
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.625rem" }}>
            Estimated annual value with Branded Fit:{" "}
            <strong style={{ color: "var(--text-primary)" }}>{fmt$(metrics.totalAnnualValue)}</strong>
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link
          href="/pilot"
          style={{
            display: "inline-block",
            padding: "0.875rem 1.75rem",
            background: "var(--primary)",
            color: "white",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            fontSize: "0.95rem",
          }}
        >
          Start My 48-Hour Pilot →
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
            fontSize: "0.95rem",
          }}
        >
          Preview my storefront →
        </Link>
      </div>
    </main>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Insight({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
      <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: "0.875rem", color: "var(--text-body)", lineHeight: 1.55 }}>{text}</span>
    </div>
  );
}

function thCell({
  header = false,
  accent = false,
  danger = false,
}: {
  header?: boolean;
  accent?: boolean;
  danger?: boolean;
} = {}): React.CSSProperties {
  return {
    padding: "0.75rem 1rem",
    borderBottom: "1px solid var(--border)",
    fontSize: header ? "0.72rem" : "0.85rem",
    fontWeight: header ? 700 : 400,
    textTransform: header ? "uppercase" : undefined,
    letterSpacing: header ? "0.04em" : undefined,
    color: accent ? "var(--accent)" : danger ? "#dc2626" : header ? "var(--text-muted)" : "var(--text-body)",
    background: accent ? "rgba(16, 185, 129, 0.04)" : "transparent",
  };
}
