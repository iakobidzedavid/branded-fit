"use client";

import { useEffect, useState, useCallback } from "react";

const FUNNEL_EVENTS = [
  { key: "domain_submitted", label: "Domain Submitted", color: "#4f46e5" },
  { key: "brand_extraction_started", label: "Brand Extraction Started", color: "#7c3aed" },
  { key: "brand_extraction_completed", label: "Brand Extraction Done", color: "#0891b2" },
  { key: "storefront_generation_completed", label: "Storefront Generated", color: "#059669" },
  { key: "storefront_viewed", label: "Storefront Viewed", color: "#16a34a" },
  { key: "storefront_published", label: "Email Captured", color: "#b45309" },
];

type AnalyticsEvent = {
  id: string;
  event_name: string;
  domain: string | null;
  session_id: string | null;
  properties: Record<string, unknown>;
  created_at: string;
};

function fmt(n: number) {
  return n.toLocaleString();
}

function pct(num: number, denom: number) {
  if (!denom) return "—";
  return `${Math.round((num / denom) * 100)}%`;
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

export default function AdminAnalyticsPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics?limit=1000");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as { events: AnalyticsEvent[] };
      setEvents(json.events ?? []);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Counts per event type
  const counts: Record<string, number> = {};
  for (const ev of FUNNEL_EVENTS) counts[ev.key] = 0;
  for (const e of events) {
    if (counts[e.event_name] !== undefined) counts[e.event_name]++;
  }

  // Unique sessions per funnel stage
  const sessionsByStage: Record<string, Set<string>> = {};
  for (const ev of FUNNEL_EVENTS) sessionsByStage[ev.key] = new Set();
  for (const e of events) {
    if (e.session_id && sessionsByStage[e.event_name]) {
      sessionsByStage[e.event_name].add(e.session_id);
    }
  }

  // Unique domains
  const uniqueDomains = new Set(events.filter(e => e.domain).map(e => e.domain!));

  // Top domains
  const domainCounts: Record<string, number> = {};
  for (const e of events) {
    if (e.domain) domainCounts[e.domain] = (domainCounts[e.domain] ?? 0) + 1;
  }
  const topDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const topCount = counts[FUNNEL_EVENTS[0].key];

  const recent = events.slice(0, 25);

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
            Analytics Dashboard
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Funnel instrumentation — {fmt(events.length)} events tracked · {fmt(uniqueDomains.size)} unique domains
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
          <strong>Error loading analytics:</strong> {error}
          {error.includes("relation") || error.includes("does not exist") ? (
            <span> — Run database migrations to create the analytics_events table.</span>
          ) : null}
        </div>
      )}

      {/* Funnel */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
          Conversion Funnel
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {FUNNEL_EVENTS.map((stage, i) => {
            const count = counts[stage.key];
            const prevCount = i === 0 ? count : counts[FUNNEL_EVENTS[i - 1].key];
            const barWidth = topCount ? Math.max((count / topCount) * 100, 2) : 0;
            const dropPct = i === 0 ? null : pct(count, prevCount);

            return (
              <div key={stage.key} style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "0.875rem 1.25rem",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Background bar */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${barWidth}%`,
                  background: `${stage.color}10`,
                  transition: "width 0.4s ease",
                }} />

                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: stage.color,
                      flexShrink: 0,
                    }} />
                    <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                      {stage.label}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontFamily: "monospace" }}>
                      {stage.key}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                    {dropPct !== null && (
                      <span style={{
                        fontSize: "0.78rem",
                        color: dropPct === "—" ? "var(--text-subtle)" : parseInt(dropPct) >= 70 ? "var(--accent)" : parseInt(dropPct) >= 40 ? "#b45309" : "var(--danger)",
                        fontWeight: 600,
                      }}>
                        {dropPct} from prev
                      </span>
                    )}
                    <span style={{ fontWeight: 800, fontSize: "1.1rem", color: stage.color, minWidth: 48, textAlign: "right" }}>
                      {fmt(count)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Summary metrics */}
      <section style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Domain → Storefront", value: pct(counts["storefront_viewed"], counts["domain_submitted"]) },
            { label: "Domain → Email Captured", value: pct(counts["storefront_published"], counts["domain_submitted"]) },
            { label: "Storefront → Email", value: pct(counts["storefront_published"], counts["storefront_viewed"]) },
            { label: "Unique Domains", value: fmt(uniqueDomains.size) },
          ].map((m) => (
            <div key={m.label} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem",
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>{m.label}</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>{m.value}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
        {/* Top domains */}
        <section>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.875rem" }}>Top Domains</h2>
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            {topDomains.length === 0 ? (
              <div style={{ padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center" }}>
                No events yet
              </div>
            ) : topDomains.map(([domain, count], i) => (
              <div key={domain} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 1rem",
                background: i % 2 === 0 ? "var(--surface)" : "white",
                fontSize: "0.875rem",
              }}>
                <span style={{ color: "var(--text-body)", fontWeight: 500 }}>{domain}</span>
                <span style={{ color: "var(--primary)", fontWeight: 700 }}>{count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stage unique sessions */}
        <section>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.875rem" }}>Unique Sessions / Stage</h2>
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            {FUNNEL_EVENTS.map((stage, i) => (
              <div key={stage.key} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 1rem",
                background: i % 2 === 0 ? "var(--surface)" : "white",
                fontSize: "0.875rem",
              }}>
                <span style={{ color: "var(--text-body)" }}>{stage.label}</span>
                <span style={{ color: stage.color, fontWeight: 700 }}>
                  {sessionsByStage[stage.key].size}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent events */}
      <section>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.875rem" }}>
          Recent Events <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "0.875rem" }}>(last {recent.length})</span>
        </h2>
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1.5fr 2fr 1fr",
            padding: "0.5rem 1rem",
            background: "var(--surface)",
            borderBottom: "2px solid var(--border)",
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "var(--text-muted)",
          }}>
            <span>Event</span>
            <span>Domain</span>
            <span>Session</span>
            <span>Time</span>
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: "2rem", color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center" }}>
              {loading ? "Loading events…" : "No events recorded yet. Open /try and generate a storefront preview."}
            </div>
          ) : recent.map((ev, i) => {
            const stage = FUNNEL_EVENTS.find(s => s.key === ev.event_name);
            return (
              <div key={ev.id} style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1.5fr 2fr 1fr",
                padding: "0.625rem 1rem",
                background: i % 2 === 0 ? "white" : "var(--surface)",
                borderBottom: "1px solid var(--border)",
                fontSize: "0.82rem",
                alignItems: "center",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {stage && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: stage.color, flexShrink: 0, display: "inline-block" }} />
                  )}
                  <span style={{ color: "var(--text-primary)", fontWeight: 600, fontFamily: "monospace", fontSize: "0.78rem" }}>
                    {ev.event_name}
                  </span>
                </span>
                <span style={{ color: "var(--text-body)" }}>{ev.domain ?? "—"}</span>
                <span style={{ color: "var(--text-subtle)", fontFamily: "monospace", fontSize: "0.72rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ev.session_id ?? "—"}
                </span>
                <span style={{ color: "var(--text-muted)" }}>{relTime(ev.created_at)}</span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
