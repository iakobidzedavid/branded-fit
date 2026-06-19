"use client";

import { useState } from "react";
import { Lock, AlertCircle, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LabelList,
} from "recharts";

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

const CHART_STYLE = {
  backgroundColor: "transparent",
  fontSize: 11,
};

const TOOLTIP_STYLE = {
  backgroundColor: "#102542",
  border: "1px solid #1a3a5c",
  borderRadius: 8,
  color: "#ecebf3",
};

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

  const funnelBarData = data.funnel.map((entry, i) => ({
    name: STAGE_META[entry.stage].label,
    count: entry.count,
    rateLabel: i === 0 ? "baseline" : `${entry.conversionRate}%`,
    color: STAGE_META[entry.stage].color,
  }));

  const timeSeriesData = data.timeSeries.map((d) => ({
    ...d,
    date: d.date.slice(5),
  }));

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
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={funnelBarData}
              layout="vertical"
              margin={{ top: 0, right: 80, bottom: 0, left: 120 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#1a3a5c"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#8fa3b8", fontSize: 11 }}
                axisLine={{ stroke: "#1a3a5c" }}
                tickLine={false}
                style={CHART_STYLE}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#ecebf3", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={116}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{ color: "#ecebf3", fontWeight: 600 }}
                itemStyle={{ color: "#8fa3b8" }}
                formatter={(value, _name, props) => {
                  const rateLabel = (props as { payload?: { rateLabel?: string } }).payload?.rateLabel;
                  const count = typeof value === "number" ? value : Number(value);
                  return [
                    `${count.toLocaleString()} events${rateLabel ? ` (${rateLabel})` : ""}`,
                    "Count",
                  ];
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {funnelBarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="rateLabel"
                  position="right"
                  style={{ fill: "#8fa3b8", fontSize: 11 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Series Chart */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6">Daily Event Volume</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={timeSeriesData}
              margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#1a3a5c" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#8fa3b8", fontSize: 11 }}
                axisLine={{ stroke: "#1a3a5c" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8fa3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={28}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{ color: "#8fa3b8", fontSize: 11 }}
                itemStyle={{ fontSize: 12 }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 16, fontSize: 12, color: "#8fa3b8" }}
              />
              {FUNNEL_STAGES.map((stage) => (
                <Line
                  key={stage}
                  type="monotone"
                  dataKey={stage}
                  name={STAGE_META[stage].label}
                  stroke={STAGE_META[stage].color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: STAGE_META[stage].color }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
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
