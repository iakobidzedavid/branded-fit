import FunnelChart, { FunnelEntry } from "@/components/FunnelChart";
import TimeSeriesChart, {
  HourlyDataPoint,
  EventSeries,
} from "@/components/TimeSeriesChart";
import EventSummaryCards, {
  EventTypeCount,
} from "@/components/EventSummaryCards";

const FUNNEL_STAGES = [
  "domain_submitted",
  "brand_extraction_completed",
  "storefront_generated",
  "storefront_published",
] as const;

type FunnelStageName = (typeof FUNNEL_STAGES)[number];

const STAGE_META: Record<FunnelStageName, { label: string; color: string }> = {
  domain_submitted: { label: "Domain Submitted", color: "#a855f7" },
  brand_extraction_completed: { label: "Brand Extracted", color: "#3b82f6" },
  storefront_generated: { label: "Storefront Generated", color: "#10b981" },
  storefront_published: { label: "Storefront Published", color: "#f59e0b" },
};

const HOURLY_SERIES: EventSeries[] = FUNNEL_STAGES.map((stage) => ({
  key: stage,
  label: STAGE_META[stage].label,
  color: STAGE_META[stage].color,
}));

interface AnalyticsData {
  funnelEntries: FunnelEntry[];
  timeSeriesData: HourlyDataPoint[];
  summaryCards: EventTypeCount[];
  endToEndConversion: number;
  isLive: boolean;
}

function buildHourKeys(windowHours: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = windowHours - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCHours(d.getUTCHours() - i, 0, 0, 0);
    keys.push(d.toISOString().slice(0, 13));
  }
  return keys;
}

async function fetchAnalytics(): Promise<AnalyticsData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return buildFallback();
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const client = createClient(supabaseUrl, supabaseKey);

    const since = new Date();
    since.setDate(since.getDate() - 7);
    since.setHours(0, 0, 0, 0);

    const { data: events, error } = await client
      .from("analytics_events")
      .select("event_name, created_at")
      .in("event_name", FUNNEL_STAGES as unknown as string[])
      .gte("created_at", since.toISOString());

    if (error || !events) {
      console.error("Admin analytics page query error:", error);
      return buildFallback();
    }

    const stageCounts: Record<FunnelStageName, number> = {
      domain_submitted: 0,
      brand_extraction_completed: 0,
      storefront_generated: 0,
      storefront_published: 0,
    };

    events.forEach((e) => {
      if (e.event_name in stageCounts) {
        stageCounts[e.event_name as FunnelStageName] += 1;
      }
    });

    const topCount = stageCounts.domain_submitted;

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
            : i === 0 ? 100 : 0,
      };
    });

    const hourKeys = buildHourKeys(48);
    const timeSeriesData: HourlyDataPoint[] = hourKeys.map((key) => {
      const hourEvents = events.filter(
        (e) => e.created_at?.slice(0, 13) === key
      );
      const row: HourlyDataPoint = {
        hour: key.slice(5).replace("T", " ") + ":00",
      };
      FUNNEL_STAGES.forEach((stage) => {
        row[stage] = hourEvents.filter((e) => e.event_name === stage).length;
      });
      return row;
    });

    const summaryCards: EventTypeCount[] = FUNNEL_STAGES.map((stage) => ({
      type: stage,
      label: STAGE_META[stage].label,
      count: stageCounts[stage],
      color: STAGE_META[stage].color,
    }));

    const endToEndConversion =
      topCount > 0
        ? Math.round((stageCounts.storefront_published / topCount) * 100)
        : 0;

    return { funnelEntries, timeSeriesData, summaryCards, endToEndConversion, isLive: true };
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

  const hourKeys = buildHourKeys(48);
  const timeSeriesData: HourlyDataPoint[] = hourKeys.map((key) => {
    const row: HourlyDataPoint = {
      hour: key.slice(5).replace("T", " ") + ":00",
    };
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

  return { funnelEntries, timeSeriesData, summaryCards, endToEndConversion: 0, isLive: false };
}

export default async function AdminAnalytics() {
  const { funnelEntries, timeSeriesData, summaryCards, endToEndConversion, isLive } =
    await fetchAnalytics();

  return (
    <div className="min-h-screen bg-bg text-text px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-text-muted mt-1 text-sm">
              Pipeline conversion funnel · Hourly event volume
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

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6">Hourly Event Volume</h2>
          <TimeSeriesChart data={timeSeriesData} series={HOURLY_SERIES} />
        </div>
      </div>
    </div>
  );
}
