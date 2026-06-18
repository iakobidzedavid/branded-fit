"use client";

import { useState } from "react";
import {
  Database,
  Shield,
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  Play,
} from "lucide-react";

interface TestResult {
  label: string;
  status: "idle" | "loading" | "success" | "error";
  response: unknown;
  statusCode?: number;
}

const TABLE_COLUMNS = [
  { name: "id", type: "UUID", nullable: false, default: "gen_random_uuid()", note: "Primary key" },
  { name: "customer_id", type: "TEXT", nullable: true, default: "—", note: "Caller-supplied customer identifier" },
  { name: "event_type", type: "TEXT", nullable: true, default: "—", note: "Event name (e.g. domain_submitted)" },
  { name: "timestamp", type: "TEXT / NUMERIC", nullable: true, default: "—", note: "ISO string or Unix ms" },
  { name: "properties", type: "JSONB", nullable: true, default: "—", note: "Arbitrary event payload (GIN-indexed)" },
  { name: "event_name", type: "TEXT", nullable: false, default: "—", note: "Legacy field (kept for backwards compat)" },
  { name: "metadata", type: "JSONB", nullable: true, default: "—", note: "Legacy payload field" },
  { name: "created_at", type: "TIMESTAMPTZ", nullable: false, default: "NOW()", note: "Auto-set on insert" },
];

const INDEXES = [
  "idx_analytics_events_event_name ON (event_name)",
  "idx_analytics_events_user_id ON (user_id)",
  "idx_analytics_events_created_at ON (created_at DESC)",
  "idx_analytics_events_event_type ON (event_type)",
  "idx_analytics_events_customer_id ON (customer_id)",
  "idx_analytics_events_properties USING GIN (properties)",
];

const SAMPLE_REQUESTS = [
  {
    label: "Domain Submitted",
    body: {
      customer_id: "test-customer-001",
      event_type: "domain_submitted",
      timestamp: new Date().toISOString(),
      properties: { domain: "acme.com", source: "command_console" },
    },
  },
  {
    label: "Storefront Viewed",
    body: {
      customer_id: "test-customer-002",
      event_type: "storefront_viewed",
      timestamp: new Date().toISOString(),
      properties: { store_id: "store_abc123", referrer: "email_campaign" },
    },
  },
  {
    label: "Product Added to Cart",
    body: {
      customer_id: "test-customer-003",
      event_type: "product_added_to_cart",
      timestamp: new Date().toISOString(),
      properties: { product_id: "shirt_001", quantity: 2, price_cents: 2999 },
    },
  },
];

export default function AnalyticsSetupPage() {
  const [results, setResults] = useState<TestResult[]>(
    SAMPLE_REQUESTS.map((r) => ({ label: r.label, status: "idle", response: null }))
  );
  const [customBody, setCustomBody] = useState(
    JSON.stringify(
      {
        customer_id: "my-customer-id",
        event_type: "custom_event",
        timestamp: new Date().toISOString(),
        properties: { key: "value" },
      },
      null,
      2
    )
  );
  const [customResult, setCustomResult] = useState<TestResult>({
    label: "Custom",
    status: "idle",
    response: null,
  });

  async function runTest(index: number) {
    const req = SAMPLE_REQUESTS[index];
    setResults((prev) =>
      prev.map((r, i) => (i === index ? { ...r, status: "loading", response: null } : r))
    );
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      const json = await res.json();
      setResults((prev) =>
        prev.map((r, i) =>
          i === index
            ? { ...r, status: res.ok ? "success" : "error", response: json, statusCode: res.status }
            : r
        )
      );
    } catch (err) {
      setResults((prev) =>
        prev.map((r, i) =>
          i === index
            ? { ...r, status: "error", response: String(err) }
            : r
        )
      );
    }
  }

  async function runAllTests() {
    for (let i = 0; i < SAMPLE_REQUESTS.length; i++) {
      await runTest(i);
    }
  }

  async function runCustomTest() {
    setCustomResult({ label: "Custom", status: "loading", response: null });
    let parsed: unknown;
    try {
      parsed = JSON.parse(customBody);
    } catch {
      setCustomResult({ label: "Custom", status: "error", response: "Invalid JSON body" });
      return;
    }
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const json = await res.json();
      setCustomResult({
        label: "Custom",
        status: res.ok ? "success" : "error",
        response: json,
        statusCode: res.status,
      });
    } catch (err) {
      setCustomResult({ label: "Custom", status: "error", response: String(err) });
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1f33] text-[#ecebf3] px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Infrastructure</h1>
          <p className="text-[#8fa3b8]">
            Supabase <code className="bg-[#102542] px-1 rounded text-sm">analytics_events</code> table,
            RLS policy, and live endpoint verification for{" "}
            <code className="bg-[#102542] px-1 rounded text-sm">POST /api/analytics</code>.
          </p>
        </div>

        {/* Table Schema */}
        <section className="bg-[#102542] rounded-xl border border-[#1a3a5c] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database size={22} className="text-violet-400" />
            <h2 className="text-xl font-semibold">Table: analytics_events</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a3a5c]">
                  <th className="text-left py-2 px-3 text-[#8fa3b8] font-medium">Column</th>
                  <th className="text-left py-2 px-3 text-[#8fa3b8] font-medium">Type</th>
                  <th className="text-left py-2 px-3 text-[#8fa3b8] font-medium">Nullable</th>
                  <th className="text-left py-2 px-3 text-[#8fa3b8] font-medium">Default</th>
                  <th className="text-left py-2 px-3 text-[#8fa3b8] font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_COLUMNS.map((col) => (
                  <tr key={col.name} className="border-b border-[#1a3a5c]/50 hover:bg-[#0d1f33]/40">
                    <td className="py-2 px-3 font-mono text-violet-300">{col.name}</td>
                    <td className="py-2 px-3 font-mono text-emerald-300">{col.type}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          col.nullable
                            ? "bg-amber-900/40 text-amber-300"
                            : "bg-emerald-900/40 text-emerald-300"
                        }`}
                      >
                        {col.nullable ? "NULL" : "NOT NULL"}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-[#8fa3b8] text-xs">{col.default}</td>
                    <td className="py-2 px-3 text-[#8fa3b8] text-xs">{col.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Indexes */}
          <div className="mt-6 border-t border-[#1a3a5c] pt-4">
            <h3 className="text-sm font-semibold text-[#8fa3b8] uppercase tracking-wide mb-3">
              Indexes
            </h3>
            <ul className="space-y-1">
              {INDEXES.map((idx) => (
                <li key={idx} className="font-mono text-xs text-[#8fa3b8]">
                  <span className="text-violet-400 mr-2">→</span>{idx}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* RLS Policy */}
        <section className="bg-[#102542] rounded-xl border border-[#1a3a5c] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={22} className="text-violet-400" />
            <h2 className="text-xl font-semibold">Row-Level Security Policy</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-emerald-900/20 border border-emerald-700/40 rounded-lg">
              <CheckCircle size={18} className="text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-emerald-300 text-sm">RLS Enabled</p>
                <p className="text-[#8fa3b8] text-xs mt-1">
                  <code>ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;</code> — prevents
                  direct anonymous reads.
                </p>
              </div>
            </div>
            <div className="bg-[#0d1f33] rounded-lg border border-[#1a3a5c] p-4">
              <p className="text-xs font-semibold text-[#8fa3b8] uppercase mb-2">Insert Policy</p>
              <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap">
{`CREATE POLICY "analytics_events_insert"
  ON analytics_events
  FOR INSERT
  WITH CHECK (true);`}
              </pre>
              <p className="text-[#8fa3b8] text-xs mt-3">
                Allows inserts from the Next.js API layer. SELECT / UPDATE / DELETE are restricted to
                service_role — anonymous callers cannot read event data directly.
              </p>
            </div>
          </div>
        </section>

        {/* Endpoint Spec */}
        <section className="bg-[#102542] rounded-xl border border-[#1a3a5c] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={22} className="text-violet-400" />
            <h2 className="text-xl font-semibold">
              Endpoint: <code className="text-violet-300 text-lg">POST /api/analytics</code>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-[#8fa3b8] uppercase mb-2">Request Body</p>
              <div className="bg-[#0d1f33] rounded-lg border border-[#1a3a5c] p-4 space-y-2 text-sm font-mono">
                <div>
                  <span className="text-violet-300">customer_id</span>
                  <span className="text-[#8fa3b8]"> string  (optional)</span>
                </div>
                <div>
                  <span className="text-violet-300">event_type</span>
                  <span className="text-red-400">*</span>
                  <span className="text-[#8fa3b8]"> string  (required)</span>
                </div>
                <div>
                  <span className="text-violet-300">timestamp</span>
                  <span className="text-[#8fa3b8]"> ISO string | Unix ms  (optional)</span>
                </div>
                <div>
                  <span className="text-violet-300">properties</span>
                  <span className="text-[#8fa3b8]"> object  (optional)</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#8fa3b8] uppercase mb-2">Responses</p>
              <div className="bg-[#0d1f33] rounded-lg border border-[#1a3a5c] p-4 space-y-2 text-xs font-mono">
                <div><span className="text-emerald-400">201</span> <span className="text-[#8fa3b8]">{"{ success: true, data: {...} }"}</span></div>
                <div><span className="text-amber-400">200</span> <span className="text-[#8fa3b8]">{"{ success: true, stored: false }"} (DB down)</span></div>
                <div><span className="text-red-400">400</span> <span className="text-[#8fa3b8]">{"{ error: \"...\" }"} (validation fail)</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Test Runner */}
        <section className="bg-[#102542] rounded-xl border border-[#1a3a5c] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Play size={22} className="text-violet-400" />
              <h2 className="text-xl font-semibold">Live Endpoint Tests</h2>
            </div>
            <button
              onClick={runAllTests}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-semibold transition"
            >
              <Play size={14} />
              Run All 3 Tests
            </button>
          </div>

          <div className="space-y-4">
            {SAMPLE_REQUESTS.map((req, i) => {
              const result = results[i];
              return (
                <div
                  key={req.label}
                  className="border border-[#1a3a5c] rounded-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-[#0d1f33]">
                    <div className="flex items-center gap-3">
                      <StatusIcon status={result.status} />
                      <span className="font-medium text-sm">{req.label}</span>
                      {result.statusCode && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                            result.statusCode < 300
                              ? "bg-emerald-900/40 text-emerald-300"
                              : "bg-red-900/40 text-red-300"
                          }`}
                        >
                          HTTP {result.statusCode}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => runTest(i)}
                      disabled={result.status === "loading"}
                      className="text-xs px-3 py-1.5 bg-violet-700/50 hover:bg-violet-600 text-violet-200 rounded transition disabled:opacity-50"
                    >
                      {result.status === "loading" ? "Running…" : "Run"}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1a3a5c]">
                    <div className="px-4 py-3">
                      <p className="text-xs text-[#8fa3b8] font-semibold uppercase mb-2">Request</p>
                      <pre className="text-xs font-mono text-[#ecebf3] whitespace-pre-wrap overflow-auto max-h-40">
                        {JSON.stringify(req.body, null, 2)}
                      </pre>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-xs text-[#8fa3b8] font-semibold uppercase mb-2">Response</p>
                      {result.response !== null ? (
                        <pre
                          className={`text-xs font-mono whitespace-pre-wrap overflow-auto max-h-40 ${
                            result.status === "success" ? "text-emerald-300" : "text-red-300"
                          }`}
                        >
                          {JSON.stringify(result.response, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-xs text-[#8fa3b8] italic">
                          {result.status === "loading" ? "Sending…" : "Not run yet"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Custom Request */}
        <section className="bg-[#102542] rounded-xl border border-[#1a3a5c] p-6">
          <h2 className="text-xl font-semibold mb-4">Custom Request</h2>
          <p className="text-[#8fa3b8] text-sm mb-4">
            Edit the JSON body below and send a custom event to{" "}
            <code className="bg-[#0d1f33] px-1 rounded">POST /api/analytics</code>.
          </p>
          <textarea
            className="w-full h-40 bg-[#0d1f33] border border-[#1a3a5c] rounded-lg p-4 font-mono text-sm text-[#ecebf3] resize-none focus:outline-none focus:border-violet-500"
            value={customBody}
            onChange={(e) => setCustomBody(e.target.value)}
            spellCheck={false}
          />
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={runCustomTest}
              disabled={customResult.status === "loading"}
              className="flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
            >
              <Play size={14} />
              {customResult.status === "loading" ? "Sending…" : "Send Request"}
            </button>
            {customResult.statusCode && (
              <span
                className={`text-xs px-2 py-1 rounded-full font-mono ${
                  customResult.statusCode < 300
                    ? "bg-emerald-900/40 text-emerald-300"
                    : "bg-red-900/40 text-red-300"
                }`}
              >
                HTTP {customResult.statusCode}
              </span>
            )}
          </div>
          {customResult.response !== null && (
            <div className="mt-4 bg-[#0d1f33] border border-[#1a3a5c] rounded-lg p-4">
              <p className="text-xs text-[#8fa3b8] font-semibold uppercase mb-2">Response</p>
              <pre
                className={`text-xs font-mono whitespace-pre-wrap ${
                  customResult.status === "success" ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {JSON.stringify(customResult.response, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: TestResult["status"] }) {
  if (status === "loading") return <Loader2 size={16} className="animate-spin text-violet-400" />;
  if (status === "success") return <CheckCircle size={16} className="text-emerald-400" />;
  if (status === "error") return <XCircle size={16} className="text-red-400" />;
  return <div className="w-4 h-4 rounded-full border border-[#1a3a5c]" />;
}
