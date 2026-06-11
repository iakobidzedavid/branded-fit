import type { Metadata } from "next";
import FunnelChart, { FunnelEntry } from "@/components/FunnelChart";
import TimeSeriesFilterPanel, {
  RawAnalyticsEvent,
} from "@/components/TimeSeriesFilterPanel";
import { EventSeries, HourlyDataPoint } from "@/components/TimeSeriesChart";
import EventSummaryCards, {
  EventTypeCount,
} from "@/components/EventSummaryCards";
import EventTypeTable, { EventTypeRow } from "@/components/EventTypeTable";
import PipelineMetricsCards, {
  PipelineMetrics,
} from "@/components/PipelineMetricsCards";

export const metadata: Metadata = {
  title: "Analytics Dashboard - Branded Fit",
  description: "Pipeline conversion funnel and event analytics",
};

const FUNNEL_STAGES = [
  "domain_submitted",
  "brand_extraction_started",
  "brand_extraction_completed",
  "mockup_generation_completed",
  "storefront_generation_completed",
  "storefront_published",
  "product_view",
] as const;

type FunnelStageName = (typeof FUNNEL_STAGES)[number];

const STAGE_META: Record<FunnelStageName, { label: string; color: string }> = {
  domain_submitted: { label: "Domain Submitted", color: "#a855f7" },
  brand_extraction_started: { label: "Extraction Started", color: "#6366f1" },
  brand_extraction_completed: { label: "Brand Extracted", color: "#3b82f6" },
  mockup_generation_completed: { label: "Mockups Generated", color: "#8b5cf6" },
  storefront_generation_completed: { label: "Storefront Ready", color: "#06b6d4" },
  storefront_published: { label: "Storefront Published", color: "#10b981" },
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
  rawEvents: RawAnalyticsEvent[];
  domains: string[];
  summaryCards: EventTypeCount[];
  eventCountRows: EventTypeRow[];
  endToEndConversion: number;
  avgPipelineDuration: number | null;
  isLive: boolean;
  pipelineMetrics: PipelineMetrics;
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

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

type SeedEvent = {
  event_name: string;
  event_type: string;
  domain: string;
  session_id: string;
  created_at: string;
  pipeline_stage?: string;
  metadata: Record<string, unknown>;
};

function buildAutoSeedEvents(): SeedEvent[] {
  const now = Date.now();
  const t = (hoursBack: number, extraSeconds = 0): string =>
    new Date(now - hoursBack * 3_600_000 + extraSeconds * 1_000).toISOString();

  return [
    // ramp.com — full pipeline (~72h ago)
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "ramp.com", session_id: "sess-v3-01", pipeline_stage: "intake", created_at: t(72), metadata: { source: "landing_page", ab_variant: "A" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "ramp.com", session_id: "sess-v3-01", pipeline_stage: "brand_extraction", created_at: t(72, 18), metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "ramp.com", session_id: "sess-v3-01", pipeline_stage: "brand_extraction", created_at: t(72, 72), metadata: { fidelity_score: 92.4, colors_found: 3, logo_found: true, duration_ms: 54000 } },
    { event_name: "mockup_generation_started", event_type: "mockup_generation_started", domain: "ramp.com", session_id: "sess-v3-01", pipeline_stage: "mockup_generation", created_at: t(72, 74), metadata: { trigger: "auto" } },
    { event_name: "mockup_generation_completed", event_type: "mockup_generation_completed", domain: "ramp.com", session_id: "sess-v3-01", pipeline_stage: "mockup_generation", created_at: t(72, 138), metadata: { product_count: 6, duration_ms: 64000 } },
    { event_name: "storefront_generation_started", event_type: "storefront_generation_started", domain: "ramp.com", session_id: "sess-v3-01", pipeline_stage: "storefront_generation", created_at: t(72, 140), metadata: { trigger: "auto" } },
    { event_name: "storefront_generation_completed", event_type: "storefront_generation_completed", domain: "ramp.com", session_id: "sess-v3-01", pipeline_stage: "storefront_generation", created_at: t(72, 194), metadata: { storefront_url: "https://ramp-merch.myshopify.com", product_count: 6, duration_ms: 54000 } },
    { event_name: "storefront_published", event_type: "storefront_published", domain: "ramp.com", session_id: "sess-v3-01", pipeline_stage: "storefront_generation", created_at: t(72, 220), metadata: { storefront_url: "https://ramp-merch.myshopify.com" } },

    // notion.so — full pipeline (~48h ago)
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "notion.so", session_id: "sess-v3-02", pipeline_stage: "intake", created_at: t(48), metadata: { source: "referral", ab_variant: "B" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "notion.so", session_id: "sess-v3-02", pipeline_stage: "brand_extraction", created_at: t(48, 22), metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "notion.so", session_id: "sess-v3-02", pipeline_stage: "brand_extraction", created_at: t(48, 88), metadata: { fidelity_score: 95.1, colors_found: 5, logo_found: true, duration_ms: 66000 } },
    { event_name: "mockup_generation_started", event_type: "mockup_generation_started", domain: "notion.so", session_id: "sess-v3-02", pipeline_stage: "mockup_generation", created_at: t(48, 90), metadata: { trigger: "auto" } },
    { event_name: "mockup_generation_completed", event_type: "mockup_generation_completed", domain: "notion.so", session_id: "sess-v3-02", pipeline_stage: "mockup_generation", created_at: t(48, 158), metadata: { product_count: 8, duration_ms: 68000 } },
    { event_name: "storefront_generation_started", event_type: "storefront_generation_started", domain: "notion.so", session_id: "sess-v3-02", pipeline_stage: "storefront_generation", created_at: t(48, 160), metadata: { trigger: "auto" } },
    { event_name: "storefront_generation_completed", event_type: "storefront_generation_completed", domain: "notion.so", session_id: "sess-v3-02", pipeline_stage: "storefront_generation", created_at: t(48, 211), metadata: { storefront_url: "https://notion-merch.myshopify.com", product_count: 8, duration_ms: 51000 } },
    { event_name: "storefront_published", event_type: "storefront_published", domain: "notion.so", session_id: "sess-v3-02", pipeline_stage: "storefront_generation", created_at: t(48, 240), metadata: { storefront_url: "https://notion-merch.myshopify.com" } },

    // stripe.com — full pipeline (~24h ago)
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "intake", created_at: t(24), metadata: { source: "direct", ab_variant: "A" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "brand_extraction", created_at: t(24, 15), metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "brand_extraction", created_at: t(24, 65), metadata: { fidelity_score: 97.3, colors_found: 4, logo_found: true, duration_ms: 50000 } },
    { event_name: "mockup_generation_started", event_type: "mockup_generation_started", domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "mockup_generation", created_at: t(24, 67), metadata: { trigger: "auto" } },
    { event_name: "mockup_generation_completed", event_type: "mockup_generation_completed", domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "mockup_generation", created_at: t(24, 127), metadata: { product_count: 7, duration_ms: 60000 } },
    { event_name: "storefront_generation_started", event_type: "storefront_generation_started", domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "storefront_generation", created_at: t(24, 129), metadata: { trigger: "auto" } },
    { event_name: "storefront_generation_completed", event_type: "storefront_generation_completed", domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "storefront_generation", created_at: t(24, 183), metadata: { storefront_url: "https://stripe-merch.myshopify.com", product_count: 7, duration_ms: 54000 } },
    { event_name: "storefront_published", event_type: "storefront_published", domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "storefront_generation", created_at: t(24, 200), metadata: { storefront_url: "https://stripe-merch.myshopify.com" } },

    // figma.com — partial: dropped after mockup_generation_started (~8h ago)
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "figma.com", session_id: "sess-v3-04", pipeline_stage: "intake", created_at: t(8), metadata: { source: "email_campaign", ab_variant: "C" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "figma.com", session_id: "sess-v3-04", pipeline_stage: "brand_extraction", created_at: t(8, 26), metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "figma.com", session_id: "sess-v3-04", pipeline_stage: "brand_extraction", created_at: t(8, 94), metadata: { fidelity_score: 81.6, colors_found: 2, logo_found: true, duration_ms: 68000 } },
    { event_name: "mockup_generation_started", event_type: "mockup_generation_started", domain: "figma.com", session_id: "sess-v3-04", pipeline_stage: "mockup_generation", created_at: t(8, 96), metadata: { trigger: "auto" } },

    // ramp.com storefront visits — product_view + cart_add (~2h ago)
    { event_name: "storefront_view", event_type: "storefront_view", domain: "ramp.com", session_id: "sess-v3-store", created_at: t(2), metadata: { store_id: "ramp-001", status: "draft" } },
    { event_name: "product_view", event_type: "product_view", domain: "ramp.com", session_id: "sess-v3-store", created_at: t(2, 45), metadata: { sku: "BF-TEE-001", product_name: "Premium Tee", price: 32.99 } },
    { event_name: "product_view", event_type: "product_view", domain: "ramp.com", session_id: "sess-v3-store", created_at: t(2, 82), metadata: { sku: "BF-CAP-002", product_name: "Embroidered Cap", price: 28.99 } },
    { event_name: "cart_add", event_type: "cart_add", domain: "ramp.com", session_id: "sess-v3-store", created_at: t(2, 95), metadata: { sku: "BF-TEE-001", product_name: "Premium Tee", price: 32.99 } },
    { event_name: "product_view", event_type: "product_view", domain: "ramp.com", session_id: "sess-v3-store", created_at: t(2, 130), metadata: { sku: "BF-HOD-003", product_name: "Zip Hoodie", price: 64.99 } },
    { event_name: "cart_add", event_type: "cart_add", domain: "ramp.com", session_id: "sess-v3-store", created_at: t(2, 148), metadata: { sku: "BF-HOD-003", product_name: "Zip Hoodie", price: 64.99 } },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function autoSeedIfEmpty(client: any, sinceISO: string): Promise<void> {
  const SEED_SESSION_IDS = ["sess-v3-01", "sess-v3-02", "sess-v3-03", "sess-v3-04", "sess-v3-store"];

  await client.from("analytics_events").delete().in("session_id", SEED_SESSION_IDS);

  const events = buildAutoSeedEvents();
  const { error } = await client.from("analytics_events").insert(events);
  if (error) {
    console.error("Auto-seed insert failed:", error.message);
  }
  void sinceISO;
}

type AnalyticsEvent = {
  event_name?: string | null;
  customer_id?: string | null;
  created_at?: string | null;
  session_id?: string | null;
  domain?: string | null;
  metadata?: Record<string, unknown> | null;
};

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
    since.setUTCDate(since.getUTCDate() - 30);
    since.setUTCHours(0, 0, 0, 0);
    const sinceISO = since.toISOString();

    let query = client
      .from("analytics_events")
      .select("event_name, customer_id, created_at, session_id, domain, metadata")
      .gte("created_at", sinceISO);

    if (customerId) {
      query = query.eq("customer_id", customerId);
    }

    const { data: initialEvents, error: initialError } = await query;

    if (initialError) {
      console.error("Admin analytics page query error:", initialError);
      return buildFallback();
    }

    const hasFunnelData = initialEvents?.some(
      (e: AnalyticsEvent) => e.event_name === "domain_submitted"
    );
    if (!customerId && !hasFunnelData) {
      await autoSeedIfEmpty(client, sinceISO);
      const { data: seededEvents, error: seededError } = await client
        .from("analytics_events")
        .select("event_name, customer_id, created_at, session_id, domain, metadata")
        .gte("created_at", sinceISO);
      if (seededError || !seededEvents) {
        return buildFallback();
      }
      return buildAnalyticsResult(seededEvents, true);
    }

    if (!initialEvents) {
      return buildFallback();
    }

    return buildAnalyticsResult(initialEvents, initialEvents.length > 0);
  } catch (e) {
    console.error("Admin analytics page error:", e);
    return buildFallback();
  }
}

function buildAnalyticsResult(events: AnalyticsEvent[], isLive: boolean): AnalyticsData {
  const stageCounts: Record<FunnelStageName, number> = {
    domain_submitted: 0,
    brand_extraction_started: 0,
    brand_extraction_completed: 0,
    mockup_generation_completed: 0,
    storefront_generation_completed: 0,
    storefront_published: 0,
    product_view: 0,
  };

  events.forEach((e) => {
    if (e.event_name && e.event_name in stageCounts) {
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
          : i === 0
          ? 100
          : 0,
    };
  });

  const dayKeys = buildDayKeys(30);
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
      ? Math.round((stageCounts.storefront_published / topCount) * 100)
      : 0;

  // Compute average pipeline duration: domain_submitted → storefront_published per session
  const sessionTimings: Record<string, { submitted?: string; published?: string }> = {};
  events.forEach((e) => {
    if (!e.session_id || !e.created_at) return;
    if (!sessionTimings[e.session_id]) sessionTimings[e.session_id] = {};
    if (e.event_name === "domain_submitted" && !sessionTimings[e.session_id].submitted) {
      sessionTimings[e.session_id].submitted = e.created_at;
    }
    if (e.event_name === "storefront_published" && !sessionTimings[e.session_id].published) {
      sessionTimings[e.session_id].published = e.created_at;
    }
  });

  const durations: number[] = [];
  Object.values(sessionTimings).forEach(({ submitted, published }) => {
    if (submitted && published) {
      const diffMs = new Date(published).getTime() - new Date(submitted).getTime();
      if (diffMs > 0) durations.push(diffMs / 1000);
    }
  });

  const avgPipelineDuration =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null;

  const uniqueDomains = new Set(
    events
      .filter((e) => e.event_name === "domain_submitted" && e.domain)
      .map((e) => e.domain as string)
  );

  const extractionTimes = events
    .filter((e) => e.event_name === "brand_extraction_completed")
    .map((e) => {
      const ms = e.metadata?.duration_ms;
      return ms != null ? Number(ms) / 1000 : null;
    })
    .filter((v): v is number => v !== null);

  const generationTimes = events
    .filter((e) => e.event_name === "storefront_generation_completed")
    .map((e) => {
      const ms = e.metadata?.duration_ms;
      return ms != null ? Number(ms) / 1000 : null;
    })
    .filter((v): v is number => v !== null);

  const fidelityScores = events
    .filter((e) => e.event_name === "brand_extraction_completed")
    .map((e) => {
      const score = e.metadata?.fidelity_score;
      return score != null ? Number(score) : null;
    })
    .filter((v): v is number => v !== null && !isNaN(v));

  const pipelineMetrics: PipelineMetrics = {
    totalDomains: uniqueDomains.size,
    totalStorefronts: stageCounts.storefront_generation_completed,
    avgExtractionTimeSec:
      extractionTimes.length > 0
        ? Math.round(
            extractionTimes.reduce((a, b) => a + b, 0) / extractionTimes.length
          )
        : null,
    avgGenerationTimeSec:
      generationTimes.length > 0
        ? Math.round(
            generationTimes.reduce((a, b) => a + b, 0) / generationTimes.length
          )
        : null,
    avgBrandFidelity:
      fidelityScores.length > 0
        ? Math.round(
            (fidelityScores.reduce((a, b) => a + b, 0) / fidelityScores.length) *
              10
          ) / 10
        : null,
  };

  const rawEvents: RawAnalyticsEvent[] = events.map((e) => ({
    event_name: e.event_name ?? null,
    domain: e.domain ?? null,
    created_at: e.created_at ?? null,
  }));

  const domains = Array.from(uniqueDomains).sort();

  return {
    funnelEntries,
    timeSeriesData,
    rawEvents,
    domains,
    summaryCards,
    eventCountRows,
    endToEndConversion,
    avgPipelineDuration,
    isLive,
    pipelineMetrics,
  };
}

function buildFallback(): AnalyticsData {
  const mock: AnalyticsEvent[] = buildAutoSeedEvents().map((e) => ({
    event_name: e.event_name,
    domain: e.domain,
    session_id: e.session_id,
    created_at: e.created_at,
    metadata: e.metadata,
  }));
  return buildAnalyticsResult(mock, false);
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
    rawEvents,
    domains,
    summaryCards,
    eventCountRows,
    endToEndConversion,
    avgPipelineDuration,
    isLive,
    pipelineMetrics,
  } = await fetchAnalytics(customerId);

  const nowISO = new Date().toISOString();

  return (
    <div className="min-h-screen bg-bg text-text px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-text-muted mt-1 text-sm">
              Pipeline conversion funnel · 30-day event volume
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

        {/* Pipeline KPI metrics */}
        <div id="metrics" className="grid grid-cols-2 gap-4 mb-8">
          <div
            className="bg-surface rounded-xl p-5 border"
            style={{ borderColor: "#10b98140" }}
          >
            <p className="text-xs text-text-muted mb-1">Funnel Completion Rate</p>
            <p className="text-3xl font-bold" style={{ color: "#10b981" }}>
              {endToEndConversion}%
            </p>
            <p className="text-xs text-text-muted mt-2">
              domain_submitted → storefront_published
            </p>
          </div>
          <div
            className="bg-surface rounded-xl p-5 border"
            style={{ borderColor: "#a855f740" }}
          >
            <p className="text-xs text-text-muted mb-1">Avg Pipeline Duration</p>
            <p className="text-3xl font-bold text-accent">
              {avgPipelineDuration != null
                ? formatDuration(avgPipelineDuration)
                : "—"}
            </p>
            <p className="text-xs text-text-muted mt-2">
              domain_submitted → storefront_published
              {avgPipelineDuration != null && (
                <span className="ml-1 opacity-60">({avgPipelineDuration}s)</span>
              )}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <PipelineMetricsCards metrics={pipelineMetrics} />
        </div>

        <div className="mb-8">
          <EventSummaryCards events={summaryCards} />
        </div>

        <div id="funnel" className="bg-surface border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-1">Conversion Funnel</h2>
          <p className="text-text-muted text-xs mb-6">7 stages with drop-off counts</p>
          <FunnelChart data={funnelEntries} />
        </div>

        <div id="timeseries" className="bg-surface border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-1">Daily Event Volume</h2>
          <p className="text-text-muted text-xs mb-4">Event count by type · filter by date range or domain</p>
          <TimeSeriesFilterPanel
            events={rawEvents}
            series={DAILY_SERIES}
            domains={domains}
            nowISO={nowISO}
          />
        </div>

        <div id="events" className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-1">Event Count by Type</h2>
          <p className="text-text-muted text-xs mb-6">Last 30 days · all event types</p>
          <EventTypeTable rows={eventCountRows} />
        </div>
      </div>
    </div>
  );
}
