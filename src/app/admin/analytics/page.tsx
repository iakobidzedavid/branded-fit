import type { Metadata } from "next";
import FunnelChart, { FunnelEntry } from "@/components/FunnelChart";
import TimeSeriesChart, {
  HourlyDataPoint,
  EventSeries,
} from "@/components/TimeSeriesChart";
import EventSummaryCards, {
  EventTypeCount,
} from "@/components/EventSummaryCards";
import EventTypeTable, { EventTypeRow } from "@/components/EventTypeTable";

export const metadata: Metadata = {
  title: "Analytics Dashboard - Branded Fit",
  description: "Pipeline conversion funnel and event analytics",
};

const FUNNEL_STAGES = [
  "domain_submission",
  "brand_extraction_complete",
  "mockup_generation_complete",
  "storefront_generation_complete",
  "product_view",
] as const;

type FunnelStageName = (typeof FUNNEL_STAGES)[number];

const STAGE_META: Record<FunnelStageName, { label: string; color: string }> = {
  domain_submission: { label: "Domain Submitted", color: "#a855f7" },
  brand_extraction_complete: { label: "Brand Extracted", color: "#3b82f6" },
  mockup_generation_complete: { label: "Mockup Generated", color: "#8b5cf6" },
  storefront_generation_complete: { label: "Storefront Ready", color: "#10b981" },
  product_view: { label: "Product Viewed", color: "#f59e0b" },
};

const DAILY_SERIES: EventSeries[] = FUNNEL_STAGES.map((stage) => ({
  key: stage,
  label: STAGE_META[stage].label,
  color: STAGE_META[stage].color,
}));

interface AnalyticsData {
  funnelEntries: FunnelEntry[];
  timeSeriesData: HourlyDataPoint[];
  summaryCards: EventTypeCount[];
  eventCountRows: EventTypeRow[];
  endToEndConversion: number;
  isLive: boolean;
}

function buildDayKeys(days: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
}

async function fetchAnalytics(customerId?: string): Promise<AnalyticsData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return buildFallback();
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const client = createClient(supabaseUrl, supabaseKey);

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 7);
    since.setUTCHours(0, 0, 0, 0);

    let query = client
      .from("analytics_events")
      .select("event_name, customer_id, created_at")
      .gte("created_at", since.toISOString());

    if (customerId) {
      query = query.eq("customer_id", customerId);
    }

    const { data: events, error } = await query;

    if (error || !events) {
      console.error("Admin analytics page query error:", error);
      return buildFallback();
    }

    const stageCounts: Record<FunnelStageName, number> = {
      domain_submission: 0,
      brand_extraction_complete: 0,
      mockup_generation_complete: 0,
      storefront_generation_complete: 0,
      product_view: 0,
    };

    events.forEach((e) => {
      if (e.event_name && e.event_name in stageCounts) {
        stageCounts[e.event_name as FunnelStageName] += 1;
      }
    });

    const topCount = stageCounts.domain_submission;

    const funnelEntries: FunnelEntry[] = FUNNEL_STAGES.map((stage, i) => {
      const prevStage = i > 0 ? FUNNEL_STAGES[i - 1] : null;
      const prevCount = prevStage ? stageCounts[prevStage] : stageCounts[stage];
      return {
        stage,
        label: STAGE_META[stage].label,
        color: STAGE_META[stage].color,
        count: stageCounts[stage],
        conversionRate:
          prevCount > 0
            ? Math.round((stageCounts[stage] / prevCount) * 100)
            : i === 0
            ? 100
            : 0,
      };
    });

    const dayKeys = buildDayKeys(7);
    const timeSeriesData: HourlyDataPoint[] = dayKeys.map((key) => {
      const dayEvents = events.filter(
        (e) => e.created_at?.slice(0, 10) === key
      );
      const row: HourlyDataPoint = { hour: key.slice(5) };
      FUNNEL_STAGES.forEach((stage) => {
        row[stage] = dayEvents.filter((e) => e.event_name === stage).length;
      });
      return row;
    });

    const summaryCards: EventTypeCount[] = FUNNEL_STAGES.map((stage) => ({
      type: stage,
      label: STAGE_META[stage].label,
      count: stageCounts[stage],
      color: STAGE_META[stage].color,
    }));

    const eventCountMap: Record<string, number> = {};
    events.forEach((e) => {
      const name = e.event_name ?? "unknown";
      eventCountMap[name] = (eventCountMap[name] ?? 0) + 1;
    });
    const eventCountRows: EventTypeRow[] = Object.entries(eventCountMap)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    const endToEndConversion =
      topCount > 0
        ? Math.round((stageCounts.storefront_generation_complete / topCount) * 100)
        : 0;

    return {
      funnelEntries,
      timeSeriesData,
      summaryCards,
      eventCountRows,
      endToEndConversion,
      isLive: true,
    };
  } catch (e) {
    console.error("Admin analytics page error:", e);
    return buildFallback();
  }
}

function buildFallback(): AnalyticsData {
  const funnelEntries: FunnelEntry[] = FUNNEL_STAGES.map((stage, i) => ({
    stage,
    label: STAGE_META[stage].label,
    color: STAGE_META[stage].color,
    count: 0,
    conversionRate: i === 0 ? 100 : 0,
  }));

  const dayKeys = buildDayKeys(7);
  const timeSeriesData: HourlyDataPoint[] = dayKeys.map((key) => {
    const row: HourlyDataPoint = { hour: key.slice(5) };
    FUNNEL_STAGES.forEach((stage) => {
      row[stage] = 0;
    });
    return row;
  });

  const summaryCards: EventTypeCount[] = FUNNEL_STAGES.map((stage) => ({
    type: stage,
    label: STAGE_META[stage].label,
    count: 0,
    color: STAGE_META[stage].color,
  }));

  return {
    funnelEntries,
    timeSeriesData,
    summaryCards,
    eventCountRows: [],
    endToEndConversion: 0,
    isLive: false,
  };
}

export default async function AdminAnalytics({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const params = await searchParams;
  const customerId = params.customerId?.trim() || undefined;

  const {
    funnelEntries,
    timeSeriesData,
    summaryCards,
    eventCountRows,
    endToEndConversion,
    isLive,
  } = await fetchAnalytics(customerId);

  return (
    <div className="min-h-screen bg-bg text-text px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-text-muted mt-1 text-sm">
              Pipeline conversion funnel · 7-day event volume
            </p>
          </div>
          <span
            className={`px-3 py-1 text-xs rounded-full border ${
              isLive
                ? "border-emerald-500/40 text-emerald-400"
                : "border-border text-text-muted"
            }`}
          >
            {isLive ? "Live data" : "No data"}
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 mb-8">
          <form method="get" className="flex items-center gap-3">
            <label className="text-sm text-text-muted whitespace-nowrap">
              Filter by customer
            </label>
            <input
              type="text"
              name="customerId"
              defaultValue={customerId ?? ""}
              placeholder="customer_id (optional)"
              className="flex-1 bg-bg border border-border rounded-lg px-3 py-1.5 text-sm text-text placeholder-text-muted focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 text-sm bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
            {customerId && (
              <a
                href="/admin/analytics"
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                Clear
              </a>
            )}
          </form>
        </div>

        <div className="mb-8">
          <EventSummaryCards
            events={summaryCards}
            endToEndRate={endToEndConversion}
          />
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-6">Conversion Funnel</h2>
          <FunnelChart data={funnelEntries} />
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-1">Daily Event Volume</h2>
          <p className="text-text-muted text-xs mb-6">Last 7 days</p>
          <TimeSeriesChart data={timeSeriesData} series={DAILY_SERIES} />
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-1">Event Count by Type</h2>
          <p className="text-text-muted text-xs mb-6">Last 7 days · all event types</p>
          <EventTypeTable rows={eventCountRows} />
        </div>
      </div>
    </div>
  );
}
