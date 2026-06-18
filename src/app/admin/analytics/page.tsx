"use client";

import { useState } from "react";
import { Lock, AlertCircle, RefreshCw } from "lucide-react";

const FUNNEL_STAGES = [
  "domain_submitted",
  "brand_extraction_complete",
  "mockup_generation_complete",
  "storefront_generation_complete",
  "user_clicks_publish",
] as const;

type FunnelStageName = (typeof FUNNEL_STAGES)[number];

const STAGE_META: Record<FunnelStageName, { label: string; color: string }> = {
  domain_submitted: { label: "Domain Submitted", color: "#a855f7" },
  brand_extraction_complete: { label: "Brand Extracted", color: "#3b82f6" },
  mockup_generation_complete: { label: "Mockup Generated", color: "#10b981" },
  storefront_generation_complete: {
    label: "Storefront Created",
    color: "#f59e0b",
  },
  user_clicks_publish: { label: "Store Viewed", color: "#ec4899" },
};

interface FunnelEntry {
  stage: FunnelStageName;
  count: number;
  conversionRate: number;
}

interface TimeSeriesDay {
  date: string;
  domain_submitted: number;
  brand_extraction_complete: number;
  mockup_generation_complete: number;
  storefront_generation_complete: number;
  user_clicks_publish: number;
}

interface AnalyticsData {
  funnel: FunnelEntry[];
  timeSeries: TimeSeriesDay[];
  endToEndConversion: number;
}

export default function AdminAnalytics() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authedPassword, setAuthedPassword] = useState("");

  async function load(pwd: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${pwd}` },
      });
      if (res.status === 401) {
        setError("Invalid password");
        return;
      }
      if (!res.ok) {
        setError("Failed to load analytics");
        return;
      }
      const json: AnalyticsData = await res.json();
      setData(json);
      setAuthedPassword(pwd);
    } catch {
      setError("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) load(password);
  };

  const handleRefresh = () => {
    if (authedPassword) load(authedPassword);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-surface border border-border rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={20} className="text-accent" />
            <h1 className="text-xl font-bold">Admin Analytics</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:border-accent focus:outline-none transition"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-danger text-sm">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-accent text-white py-3 rounded-lg font-semibold disabled:opacity-50 hover:opacity-90 transition"
            >
              {loading ? "Loading..." : "Access Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const topCount = data.funnel[0]?.count ?? 0;

  return (
    <div className="min-h-screen bg-bg text-text px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-text-muted mt-1 text-sm">
              Pipeline conversion funnel · Last 7 days
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm hover:border-accent transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {data.funnel.map((entry) => (
            <MetricCard
              key={entry.stage}
              label={STAGE_META[entry.stage].label}
              value={entry.count.toLocaleString()}
              color={STAGE_META[entry.stage].color}
            />
          ))}
          <MetricCard
            label="End-to-End Rate"
            value={`${data.endToEndConversion}%`}
            color="#f59e0b"
            highlight
          />
        </div>

        {/* Funnel Chart */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-6">Conversion Funnel</h2>
          <div className="space-y-6">
            {data.funnel.map((entry, i) => (
              <FunnelBar
                key={entry.stage}
                step={i + 1}
                label={STAGE_META[entry.stage].label}
                count={entry.count}
                conversionRate={entry.conversionRate}
                color={STAGE_META[entry.stage].color}
                maxCount={topCount}
              />
            ))}
          </div>
        </div>

        {/* Time Series Chart */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">Daily Event Volume</h2>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
            {FUNNEL_STAGES.map((stage) => (
              <div key={stage} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: STAGE_META[stage].color }}
                />
                <span className="text-xs text-text-muted">
                  {STAGE_META[stage].label}
                </span>
              </div>
            ))}
          </div>
          <TimeSeriesChart data={data.timeSeries} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
  highlight = false,
}: {
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="bg-bg rounded-xl p-4 border"
      style={{
        borderColor: highlight ? `${color}66` : "#1a3a5c",
      }}
    >
      <div className="text-xs text-text-muted mb-2 leading-snug">{label}</div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function FunnelBar({
  step,
  label,
  count,
  conversionRate,
  color,
  maxCount,
}: {
  step: number;
  label: string;
  count: number;
  conversionRate: number;
  color: string;
  maxCount: number;
}) {
  const widthPct = maxCount > 0 ? (count / maxCount) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            {step}
          </span>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-4 text-sm flex-shrink-0">
          <span className="font-bold" style={{ color }}>
            {count.toLocaleString()}
          </span>
          <span className="text-text-muted w-14 text-right">
            {step === 1 ? "baseline" : `${conversionRate}%`}
          </span>
        </div>
      </div>
      <div className="h-2 bg-bg rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${count > 0 ? Math.max(widthPct, 1) : 0}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function TimeSeriesChart({ data }: { data: TimeSeriesDay[] }) {
  const W = 560;
  const H = 180;
  const PAD = { top: 16, right: 16, bottom: 28, left: 36 };

  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const n = data.length;

  const maxVal = Math.max(
    ...data.flatMap((d) => FUNNEL_STAGES.map((s) => d[s])),
    1
  );

  const xPos = (i: number) =>
    PAD.left + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);

  const yPos = (v: number) => PAD.top + (1 - v / maxVal) * chartH;

  const makePath = (stage: FunnelStageName) =>
    data
      .map((d, i) => {
        const x = xPos(i).toFixed(1);
        const y = yPos(d[stage]).toFixed(1);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  const yTicks = [0, Math.round(maxVal / 2), maxVal];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      {/* Horizontal grid lines */}
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={yPos(tick)}
            y2={yPos(tick)}
            stroke="#1a3a5c"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x={PAD.left - 6}
            y={yPos(tick) + 4}
            textAnchor="end"
            fontSize="10"
            fill="#8fa3b8"
          >
            {tick}
          </text>
        </g>
      ))}

      {/* Stage lines */}
      {FUNNEL_STAGES.map((stage) => (
        <path
          key={stage}
          d={makePath(stage)}
          fill="none"
          stroke={STAGE_META[stage].color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}

      {/* Data point dots */}
      {FUNNEL_STAGES.map((stage) =>
        data.map((d, i) => (
          <circle
            key={`${stage}-${i}`}
            cx={xPos(i)}
            cy={yPos(d[stage])}
            r="3"
            fill={STAGE_META[stage].color}
          />
        ))
      )}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text
          key={d.date}
          x={xPos(i)}
          y={H - 4}
          textAnchor="middle"
          fontSize="10"
          fill="#8fa3b8"
        >
          {d.date.slice(5)}
        </text>
      ))}
    </svg>
  );
}
