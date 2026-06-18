"use client";

import { useState, useEffect } from "react";
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface Metrics {
  totalSubmissions: number;
  totalMockupViews: number;
  totalStorefrontClicks: number;
  totalFaqOpens: number;
  submissionToMockupRate: number;
  submissionToStorefrontRate: number;
  utmSourceBreakdown: Array<{
    source: string;
    submissions: number;
    conversions: number;
    conversionRate: string;
  }>;
  abTestPerformance: Array<{
    variant: string;
    impressions: number;
    conversions: number;
    conversionRate: string;
  }>;
  topFaqs: Array<{
    question: string;
    opens: number;
  }>;
  dailySubmissions: Record<string, number>;
}

interface ApiResponse {
  timeframe: string;
  metrics: Metrics;
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7d");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/analytics/metrics?timeframe=${timeframe}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch metrics");
        }

        const data: ApiResponse = await response.json();
        setMetrics(data.metrics);
        setError("");
      } catch (err) {
        console.error("Error fetching metrics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-text-muted">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-bg text-text px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-danger">
            {error || "Unable to load analytics"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Analytics Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setTimeframe("7d")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                timeframe === "7d"
                  ? "bg-accent text-white"
                  : "bg-surface border border-border text-text hover:border-accent"
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeframe("30d")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                timeframe === "30d"
                  ? "bg-accent text-white"
                  : "bg-surface border border-border text-text hover:border-accent"
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <MetricCard
            label="Total Submissions"
            value={metrics.totalSubmissions}
            icon={<TrendingUp size={24} className="text-accent" />}
          />
          <MetricCard
            label="Mockup Views"
            value={metrics.totalMockupViews}
            icon={<BarChart3 size={24} className="text-accent" />}
          />
          <MetricCard
            label="Storefront Clicks"
            value={metrics.totalStorefrontClicks}
            icon={<PieChartIcon size={24} className="text-accent" />}
          />
          <MetricCard
            label="FAQ Opens"
            value={metrics.totalFaqOpens}
            icon={<TrendingUp size={24} className="text-accent" />}
          />
        </div>

        {/* Conversion Rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-surface rounded-lg border border-border p-8">
            <h2 className="text-xl font-bold mb-6">Conversion Funnel</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-muted">Submissions → Mockup Views</span>
                  <span className="font-semibold">
                    {metrics.submissionToMockupRate}%
                  </span>
                </div>
                <div className="w-full bg-surface/50 rounded-full h-2">
                  <div
                    className="bg-accent rounded-full h-2"
                    style={{
                      width: `${Math.min(
                        100,
                        parseFloat(metrics.submissionToMockupRate.toString())
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-muted">
                    Submissions → Storefront Clicks
                  </span>
                  <span className="font-semibold">
                    {metrics.submissionToStorefrontRate}%
                  </span>
                </div>
                <div className="w-full bg-surface/50 rounded-full h-2">
                  <div
                    className="bg-accent rounded-full h-2"
                    style={{
                      width: `${Math.min(
                        100,
                        parseFloat(metrics.submissionToStorefrontRate.toString())
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* A/B Test Performance */}
          <div className="bg-surface rounded-lg border border-border p-8">
            <h2 className="text-xl font-bold mb-6">A/B Test Performance</h2>
            <div className="space-y-4">
              {metrics.abTestPerformance.map((variant) => (
                <div key={variant.variant}>
                  <div className="flex justify-between mb-2">
                    <span className="text-text-muted">
                      Variant {variant.variant}
                    </span>
                    <span className="font-semibold">
                      {variant.conversionRate}% ({variant.conversions}/
                      {variant.impressions})
                    </span>
                  </div>
                  <div className="w-full bg-surface/50 rounded-full h-2">
                    <div
                      className="bg-accent rounded-full h-2"
                      style={{
                        width: `${Math.min(100, parseFloat(variant.conversionRate))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* UTM Source Breakdown */}
        <div className="bg-surface rounded-lg border border-border p-8 mb-12">
          <h2 className="text-xl font-bold mb-6">Traffic Attribution (UTM Source)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-muted font-semibold">
                    Source
                  </th>
                  <th className="text-right py-3 px-4 text-text-muted font-semibold">
                    Submissions
                  </th>
                  <th className="text-right py-3 px-4 text-text-muted font-semibold">
                    Conversions
                  </th>
                  <th className="text-right py-3 px-4 text-text-muted font-semibold">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.utmSourceBreakdown.map((source) => (
                  <tr key={source.source} className="border-b border-border/50">
                    <td className="py-3 px-4">{source.source || "direct"}</td>
                    <td className="text-right py-3 px-4">
                      {source.submissions}
                    </td>
                    <td className="text-right py-3 px-4">
                      {source.conversions}
                    </td>
                    <td className="text-right py-3 px-4 text-accent font-semibold">
                      {source.conversionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top FAQs */}
        <div className="bg-surface rounded-lg border border-border p-8">
          <h2 className="text-xl font-bold mb-6">Top FAQ Questions</h2>
          <div className="space-y-4">
            {metrics.topFaqs.length > 0 ? (
              metrics.topFaqs.map((faq, idx) => (
                <div key={idx} className="flex justify-between items-start p-4 bg-surface/50 rounded-lg">
                  <span className="text-text-muted flex-1">{faq.question}</span>
                  <span className="ml-4 font-semibold text-accent">
                    {faq.opens} opens
                  </span>
                </div>
              ))
            ) : (
              <p className="text-text-muted">No FAQ data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-text-muted text-sm font-semibold">{label}</span>
        {icon}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
