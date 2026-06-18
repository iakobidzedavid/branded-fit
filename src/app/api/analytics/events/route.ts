import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

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

function buildEmptyResponse(days: number) {
  const funnel = FUNNEL_STAGES.map((stage, i) => ({
    stage,
    label: STAGE_META[stage].label,
    color: STAGE_META[stage].color,
    count: 0,
    conversionRate: i === 0 ? 100 : 0,
  }));

  const dayKeys = buildDayKeys(days);
  const timeSeries = dayKeys.map((key) => {
    const row: Record<string, string | number> = { day: key.slice(5) };
    FUNNEL_STAGES.forEach((stage) => {
      row[stage] = 0;
    });
    return row;
  });

  return { funnel, timeSeries, eventCounts: [], endToEndConversion: 0 };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const customerId = searchParams.get("customer_id");
  const rawDays = parseInt(searchParams.get("days") ?? "7", 10);
  const days = Number.isFinite(rawDays) ? Math.min(Math.max(rawDays, 1), 90) : 7;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(buildEmptyResponse(days));
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const client = createClient(supabaseUrl, supabaseKey);

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - days);
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
      console.error("GET /api/analytics/events error:", error);
      return NextResponse.json(buildEmptyResponse(days));
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

    const funnel = FUNNEL_STAGES.map((stage, i) => {
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

    const dayKeys = buildDayKeys(days);
    const timeSeries = dayKeys.map((key) => {
      const dayEvents = events.filter((e) => e.created_at?.slice(0, 10) === key);
      const row: Record<string, string | number> = { day: key.slice(5) };
      FUNNEL_STAGES.forEach((stage) => {
        row[stage] = dayEvents.filter((e) => e.event_name === stage).length;
      });
      return row;
    });

    const eventCountMap: Record<string, number> = {};
    events.forEach((e) => {
      const name = e.event_name ?? "unknown";
      eventCountMap[name] = (eventCountMap[name] ?? 0) + 1;
    });
    const eventCounts = Object.entries(eventCountMap)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    const endToEndConversion =
      topCount > 0
        ? Math.round((stageCounts.storefront_generation_complete / topCount) * 100)
        : 0;

    return NextResponse.json({ funnel, timeSeries, eventCounts, endToEndConversion });
  } catch (e) {
    console.error("GET /api/analytics/events exception:", e);
    return NextResponse.json(buildEmptyResponse(days));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, eventData, storeId, utmSource, utmMedium, utmCampaign, abVariant } = body;

    if (!eventType) {
      return NextResponse.json(
        { error: "eventType is required" },
        { status: 400 }
      );
    }

    const client = getSupabase();

    const record: Record<string, unknown> = {
      event_name: eventType,
      event_data: eventData || {},
    };

    if (storeId) record.domain = String(storeId);
    if (utmSource) record.session_id = String(utmSource);

    const { data, error } = await client
      .from("analytics_events")
      .insert([record])
      .select("id, event_name, domain, session_id, created_at");

    if (error) {
      console.error("Error inserting event:", error);
      return NextResponse.json(
        { error: "Failed to log event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data?.[0] }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/analytics/events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
