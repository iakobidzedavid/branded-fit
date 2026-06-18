export interface PipelineMetrics {
  totalDomains: number;
  totalStorefronts: number;
  avgExtractionTimeSec: number | null;
  avgGenerationTimeSec: number | null;
  avgBrandFidelity: number | null;
}

function formatSec(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export default function PipelineMetricsCards({
  metrics,
}: {
  metrics: PipelineMetrics;
}) {
  const cards = [
    {
      label: "Total Domains",
      value: metrics.totalDomains.toLocaleString(),
      sub: "submitted",
      color: "#a855f7",
      borderColor: "#a855f740",
    },
    {
      label: "Storefronts Generated",
      value: metrics.totalStorefronts.toLocaleString(),
      sub: "completed",
      color: "#10b981",
      borderColor: "#10b98140",
    },
    {
      label: "Avg Extraction Time",
      value:
        metrics.avgExtractionTimeSec != null
          ? formatSec(metrics.avgExtractionTimeSec)
          : "—",
      sub: "brand extraction",
      color: "#3b82f6",
      borderColor: "#3b82f640",
    },
    {
      label: "Avg Generation Time",
      value:
        metrics.avgGenerationTimeSec != null
          ? formatSec(metrics.avgGenerationTimeSec)
          : "—",
      sub: "storefront creation",
      color: "#6366f1",
      borderColor: "#6366f140",
    },
    {
      label: "Avg Brand Fidelity",
      value:
        metrics.avgBrandFidelity != null ? `${metrics.avgBrandFidelity}%` : "—",
      sub: "fidelity score",
      color: "#f59e0b",
      borderColor: "#f59e0b40",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-surface rounded-xl p-5 border"
          style={{ borderColor: card.borderColor }}
        >
          <p className="text-xs text-text-muted mb-2 leading-snug">
            {card.label}
          </p>
          <p className="text-2xl font-bold" style={{ color: card.color }}>
            {card.value}
          </p>
          <p className="text-xs text-text-muted mt-1 opacity-70">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
