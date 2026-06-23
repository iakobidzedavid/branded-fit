"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const APPROACH_LABELS: Record<string, string> = {
  none: "No swag program",
  manual: "Manual sourcing",
  printify_diy: "Printify DIY",
  agency: "Swag agency",
  platform: "SwagUp / Stadium",
};

const PAIN_LABELS: Record<string, string> = {
  too_expensive: "Too expensive",
  low_redemption: "Low redemption",
  too_slow: "Too slow",
  no_analytics: "No analytics",
  all_of_the_above: "All of the above",
};

type Assessment = {
  id: string;
  email: string | null;
  current_approach: string | null;
  team_size: number | null;
  annual_budget: number | null;
  cycles_per_year: number | null;
  biggest_pain: string | null;
  swag_score: number | null;
  estimated_waste_dollars: number | null;
  estimated_time_savings: number | null;
  roi_multiple: number | null;
  created_at: string;
};

function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function scoreColor(score: number): string {
  if (score < 36) return "#dc2626";
  if (score < 56) return "#b45309";
  return "#059669";
}

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/assessments?limit=200");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { assessments: Assessment[] };
      setAssessments(json.assessments ?? []);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Aggregate stats
  const withBudget = assessments.filter((a) => a.annual_budget && a.annual_budget > 0);
  const withEmail = assessments.filter((a) => a.email);
  const totalBudget = withBudget.reduce((s, a) => s + (a.annual_budget ?? 0), 0);
  const avgBudget = withBudget.length > 0 ? totalBudget / withBudget.length : 0;
  const avgScore = assessments.length > 0
    ? assessments.reduce((s, a) => s + (a.swag_score ?? 0), 0) / assessments.length
    : 0;
  const avgRoi = assessments.filter((a) => a.roi_multiple).length > 0
    ? assessments.filter((a) => a.roi_multiple).reduce((s, a) => s + (a.roi_multiple ?? 0), 0) /
      assessments.filter((a) => a.roi_multiple).length
    : 0;

  // TAM signal: extrapolate from avg budget to beachhead market
  const BEACHHEAD_FIRMS = 1825;
  const impliedTAM = avgBudget > 0 ? BEACHHEAD_FIRMS * avgBudget : null;

  const cardStyle: React.CSSProperties = {
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "1.5rem",
  };

  const statLabel: React.CSSProperties = {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: "0.375rem",
  };

  const statValue: React.CSSProperties = {
    fontSize: "1.75rem",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "var(--text-heading)",
  };

  return (
    <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "inline-block", padding: "0.3rem 0.875rem", background: "var(--primary-light)", color: "var(--primary)", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Admin
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.35rem" }}>
            Swag Health Check Submissions
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            {assessments.length} assessment{assessments.length !== 1 ? "s" : ""} · {withEmail.length} with email
            {lastRefresh && ` · refreshed ${relTime(lastRefresh.toISOString())}`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/admin/analytics" style={{ padding: "0.625rem 1.25rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "0.875rem", color: "var(--text-body)", textDecoration: "none" }}>
            ← Analytics
          </Link>
          <button
            onClick={load}
            disabled={loading}
            style={{ padding: "0.625rem 1.25rem", background: loading ? "var(--surface)" : "var(--primary)", color: loading ? "var(--text-muted)" : "white", border: loading ? "1px solid var(--border)" : "none", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "0.875rem", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: "1rem", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "var(--radius-md)", color: "#dc2626", marginBottom: "2rem", fontSize: "0.875rem" }}>
          Error: {error}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={cardStyle}>
          <div style={statLabel}>Total Submissions</div>
          <div style={statValue}>{assessments.length}</div>
        </div>
        <div style={cardStyle}>
          <div style={statLabel}>With Email</div>
          <div style={statValue}>{withEmail.length}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {assessments.length > 0 ? Math.round((withEmail.length / assessments.length) * 100) : 0}% capture
          </div>
        </div>
        <div style={cardStyle}>
          <div style={statLabel}>Avg Swag Budget</div>
          <div style={statValue}>{withBudget.length > 0 ? fmt$(avgBudget) : "—"}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {withBudget.length} with data
          </div>
        </div>
        <div style={cardStyle}>
          <div style={statLabel}>Avg Health Score</div>
          <div style={{ ...statValue, color: assessments.length > 0 ? scoreColor(avgScore) : "var(--text-heading)" }}>
            {assessments.length > 0 ? Math.round(avgScore) : "—"}<span style={{ fontSize: "1rem", fontWeight: 600 }}>/100</span>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={statLabel}>Avg ROI Multiple</div>
          <div style={statValue}>{avgRoi > 0 ? `${avgRoi.toFixed(1)}×` : "—"}</div>
        </div>
      </div>

      {/* TAM Signal Box */}
      {impliedTAM && impliedTAM > 0 && (
        <div style={{ ...cardStyle, background: "var(--primary-light)", border: "1px solid var(--primary)", marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "0.5rem" }}>
            TAM Signal (DE Step 4)
          </div>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "baseline" }}>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.03em" }}>
                {fmt$(impliedTAM)}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--primary)", opacity: 0.8 }}>
                Implied beachhead TAM ({BEACHHEAD_FIRMS.toLocaleString()} firms × {fmt$(avgBudget)} avg budget)
              </div>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--primary)", opacity: 0.75, maxWidth: 320 }}>
              Based on real swag budgets entered by {withBudget.length} prospect{withBudget.length !== 1 ? "s" : ""}.
              TAM gate ≥ $20M {impliedTAM >= 20_000_000 ? "✅ cleared" : "⚠ not yet cleared"}.
            </div>
          </div>
        </div>
      )}

      {/* Submissions Table */}
      {loading && assessments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Loading assessments…</div>
      ) : assessments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          No assessments yet. Share the{" "}
          <Link href="/assessment" style={{ color: "var(--primary)" }}>/assessment</Link> link to collect data.
        </div>
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                  {["Submitted", "Email", "Approach", "Team", "Budget", "Cycles/yr", "Pain", "Score", "ROI"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.03em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assessments.map((a, i) => (
                  <tr
                    key={a.id}
                    style={{
                      borderBottom: i < assessments.length - 1 ? "1px solid var(--border)" : "none",
                      background: i % 2 === 0 ? "white" : "var(--surface)",
                    }}
                  >
                    <td style={{ padding: "0.75rem 1rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {relTime(a.created_at)}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.email ? (
                        <a href={`mailto:${a.email}`} style={{ color: "var(--primary)", textDecoration: "none" }}>
                          {a.email}
                        </a>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap" }}>
                      {a.current_approach ? (APPROACH_LABELS[a.current_approach] ?? a.current_approach) : "—"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                      {a.team_size ?? "—"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", textAlign: "right", fontWeight: 600, color: a.annual_budget ? "var(--text-heading)" : "var(--text-muted)" }}>
                      {a.annual_budget ? fmt$(a.annual_budget) : "—"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                      {a.cycles_per_year ?? "—"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.biggest_pain ? (PAIN_LABELS[a.biggest_pain] ?? a.biggest_pain) : "—"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                      {a.swag_score !== null ? (
                        <span style={{ fontWeight: 700, color: scoreColor(a.swag_score) }}>
                          {a.swag_score}
                        </span>
                      ) : "—"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                      {a.roi_multiple !== null ? `${a.roi_multiple.toFixed(1)}×` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Budget distribution */}
      {withBudget.length > 0 && (
        <div style={{ ...cardStyle, marginTop: "1.5rem" }}>
          <div style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.875rem" }}>Budget Distribution (reported by prospects)</div>
          {[
            { label: "< $5K", min: 0, max: 5000 },
            { label: "$5K – $15K", min: 5000, max: 15000 },
            { label: "$15K – $30K", min: 15000, max: 30000 },
            { label: "$30K – $60K", min: 30000, max: 60000 },
            { label: "> $60K", min: 60000, max: Infinity },
          ].map(({ label, min, max }) => {
            const count = withBudget.filter((a) => (a.annual_budget ?? 0) >= min && (a.annual_budget ?? 0) < max).length;
            const pct = withBudget.length > 0 ? (count / withBudget.length) * 100 : 0;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div style={{ width: 100, fontSize: "0.8rem", color: "var(--text-muted)", flexShrink: 0 }}>{label}</div>
                <div style={{ flex: 1, background: "var(--surface)", borderRadius: 4, height: 12, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "var(--primary)", width: `${pct}%`, transition: "width 0.3s" }} />
                </div>
                <div style={{ width: 40, textAlign: "right", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-heading)" }}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
        Source: <Link href="/assessment" style={{ color: "var(--primary)" }}>brandedfitco.com/assessment</Link> · Persisted in Supabase swag_assessments table
      </div>
    </main>
  );
}
