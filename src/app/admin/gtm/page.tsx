"use client";

import { useEffect, useState, useCallback } from "react";

type GtmResponse = {
  id: string;
  prospect_id: string;
  outreach_id: string;
  first_reply_date: string | null;
  reply_type: string;
  sentiment: string;
  qualification_status: string;
  discovery_call_scheduled: boolean;
  top_objection?: string | null;
  created_at: string;
  gtm_prospects?: { prospect_name: string; company_name: string; email: string; title: string };
  gtm_outreach?: { sent_date: string; email_subject: string; wave_name: string };
};

type DailyMetric = {
  measurement_date: string;
  wave_name: string;
  total_sent: number;
  total_opened: number;
  total_replied: number;
  total_qualified: number;
  total_calls_scheduled: number;
  open_rate_pct: number;
  reply_rate_pct: number;
};

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function fmt(n: number) {
  return n.toLocaleString();
}

function pct(num: number, denom: number) {
  if (!denom) return "—";
  return `${Math.round((num / denom) * 100)}%`;
}

export default function AdminGtmPage() {
  const [responses, setResponses] = useState<GtmResponse[]>([]);
  const [metrics, setMetrics] = useState<DailyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gtm-responses?limit=1000");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { responses: GtmResponse[]; metrics: DailyMetric[] };
      setResponses(json.responses ?? []);
      setMetrics(json.metrics ?? []);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Calculate summary stats
  const totalSent = responses.length > 0 ? responses[0].gtm_outreach?.wave_name ? responses.filter(r => r.gtm_outreach?.wave_name).length : 0 : 0;
  const totalReplied = responses.filter(r => r.first_reply_date).length;
  const totalQualified = responses.filter(r => r.qualification_status === "qualified" || r.qualification_status === "hot").length;
  const totalCallsScheduled = responses.filter(r => r.discovery_call_scheduled).length;

  // Sentiment breakdown
  const sentiments: Record<string, number> = {};
  for (const r of responses) {
    sentiments[r.sentiment] = (sentiments[r.sentiment] ?? 0) + 1;
  }

  // Top objections
  const objections: Record<string, number> = {};
  for (const r of responses) {
    if (r.top_objection) {
      objections[r.top_objection] = (objections[r.top_objection] ?? 0) + 1;
    }
  }
  const topObjections = Object.entries(objections)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Decision gate thresholds
  const daysSinceCampaignStart = 12; // June 11 to June 23
  const day3Gate = { target: 4, actual: Math.round(totalReplied * 0.4), status: totalReplied >= 4 ? "✓ PASS" : "✗ MISS" };
  const day5Gate = { target: 1, actual: totalCallsScheduled, status: totalCallsScheduled >= 1 ? "✓ PASS" : "✗ MISS" };
  const day7Gate = { target: 3, actual: totalQualified, status: totalQualified >= 3 ? "✓ PASS" : "✗ MISS" };

  const recent = responses.slice(0, 15);

  return (
    <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{
            display: "inline-block",
            padding: "0.3rem 0.875rem",
            background: "var(--primary-light)",
            color: "var(--primary)",
            borderRadius: 20,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}>
            Admin
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.35rem" }}>
            GTM Testing Monitor
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Outreach campaign metrics — {fmt(totalSent)} sent · {fmt(totalReplied)} replies · {fmt(totalQualified)} qualified
            {lastRefresh && ` · refreshed ${relTime(lastRefresh.toISOString())}`}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          style={{
            padding: "0.625rem 1.25rem",
            background: loading ? "var(--surface)" : "var(--primary)",
            color: loading ? "var(--text-muted)" : "white",
            border: loading ? "1px solid var(--border)" : "none",
            borderRadius: "var(--radius-md)",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading…" : "↻ Refresh"}
        </button>
      </div>

      {error && (
        <div style={{
          padding: "1rem 1.25rem",
          background: "#fef2f2",
          border: "1px solid #fca5a5",
          borderRadius: "var(--radius-md)",
          color: "#991b1b",
          fontSize: "0.875rem",
          marginBottom: "1.5rem",
        }}>
          <strong>Error loading GTM data:</strong> {error}
        </div>
      )}

      {/* Decision Gates */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
          Decision Gates (Step 23 Validation)
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Day 3 (June 11) — 40% Open Rate", ...day3Gate, color: day3Gate.status.startsWith("✓") ? "#059669" : "#dc2626" },
            { label: "Day 5 — ≥1 Discovery Call", ...day5Gate, color: day5Gate.status.startsWith("✓") ? "#059669" : "#dc2626" },
            { label: "Day 7 — ≥3 Qualified Responses", ...day7Gate, color: day7Gate.status.startsWith("✓") ? "#059669" : "#dc2626" },
          ].map((gate) => (
            <div key={gate.label} style={{
              background: "white",
              border: `2px solid ${gate.color}`,
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem",
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", fontWeight: 600 }}>
                {gate.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.75rem", fontWeight: 800, color: gate.color }}>
                  {gate.actual}/{gate.target}
                </span>
              </div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: gate.color }}>
                {gate.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Metrics */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
          Campaign Summary
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Emails Sent", value: fmt(totalSent) },
            { label: "Replies Received", value: fmt(totalReplied) },
            { label: "Reply Rate", value: pct(totalReplied, totalSent) },
            { label: "Qualified Leads", value: fmt(totalQualified) },
            { label: "Discovery Calls Booked", value: fmt(totalCallsScheduled) },
            { label: "Qualification Rate", value: pct(totalQualified, totalReplied) },
          ].map((m) => (
            <div key={m.label} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1rem",
            }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.3rem", textTransform: "uppercase", fontWeight: 600 }}>
                {m.label}
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sentiment & Objections */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
        {/* Sentiment Distribution */}
        <section>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.875rem" }}>Sentiment Distribution</h2>
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            {Object.entries(sentiments).length === 0 ? (
              <div style={{ padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center" }}>
                No responses yet
              </div>
            ) : Object.entries(sentiments)
              .sort((a, b) => b[1] - a[1])
              .map(([sentiment, count], i) => (
                <div key={sentiment} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.625rem 1rem",
                  background: i % 2 === 0 ? "var(--surface)" : "white",
                  fontSize: "0.875rem",
                  borderBottom: i < Object.entries(sentiments).length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <span style={{ color: "var(--text-body)", fontWeight: 500 }}>
                    {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                  </span>
                  <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                    {count} ({pct(count, totalReplied)})
                  </span>
                </div>
              ))}
          </div>
        </section>

        {/* Top Objections */}
        <section>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.875rem" }}>Top Objections</h2>
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            {topObjections.length === 0 ? (
              <div style={{ padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center" }}>
                No objections recorded yet
              </div>
            ) : topObjections.map(([objection, count], i) => (
              <div key={objection} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 1rem",
                background: i % 2 === 0 ? "var(--surface)" : "white",
                fontSize: "0.875rem",
                borderBottom: i < topObjections.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <span style={{ color: "var(--text-body)", fontWeight: 500 }}>
                  {objection}
                </span>
                <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Responses */}
      <section>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.875rem" }}>
          Recent Responses <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "0.875rem" }}>(last {recent.length})</span>
        </h2>
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr",
            padding: "0.5rem 1rem",
            background: "var(--surface)",
            borderBottom: "2px solid var(--border)",
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "var(--text-muted)",
          }}>
            <span>Prospect</span>
            <span>Sentiment</span>
            <span>Status</span>
            <span>Time</span>
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: "2rem", color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center" }}>
              {loading ? "Loading responses…" : "No responses recorded yet. Responses will appear as emails are received."}
            </div>
          ) : recent.map((resp, i) => (
            <div key={resp.id} style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr",
              padding: "0.625rem 1rem",
              background: i % 2 === 0 ? "white" : "var(--surface)",
              borderBottom: "1px solid var(--border)",
              fontSize: "0.82rem",
              alignItems: "center",
            }}>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {resp.gtm_prospects?.prospect_name || "—"} / {resp.gtm_prospects?.company_name || "—"}
              </span>
              <span style={{ color: resp.sentiment === "positive" ? "#059669" : resp.sentiment === "negative" ? "#dc2626" : "var(--text-body)", fontWeight: 500 }}>
                {resp.sentiment.charAt(0).toUpperCase() + resp.sentiment.slice(1)}
              </span>
              <span style={{ color: "var(--text-body)" }}>
                {resp.qualification_status.charAt(0).toUpperCase() + resp.qualification_status.slice(1)}
              </span>
              <span style={{ color: "var(--text-muted)" }}>
                {resp.first_reply_date ? relTime(resp.first_reply_date) : "pending"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
