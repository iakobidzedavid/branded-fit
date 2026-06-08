import { NextRequest, NextResponse } from "next/server";

const FUNNEL_STAGES = [
  "domain_submitted",
  "brand_extraction_completed",
  "storefront_generated",
  "storefront_published",
] as const;

type FunnelStageName = (typeof FUNNEL_STAGES)[number];

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

function buildEmptyResponse() {
  const funnel = FUNNEL_STAGES.map((stage, i) => ({
    stage,
    count: 0,
    conversionRate: i === 0 ? 100 : 0,
  }));

  const hourKeys = buildHourKeys(48);
  const timeSeries = hourKeys.map((key) => {
    const row: Record<string, unknown> = {
      hour: key.slice(5).replace("T", " ") + ":00",
    };
    FUNNEL_STAGES.forEach((stage) => {
      row[stage] = 0;
    });
    return row;
  });

  return { funnel, timeSeries, endToEndConversion: 0 };
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword && token !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(buildEmptyResponse());
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

    if (error) {
      console.error("Admin analytics query error:", error);
      return NextResponse.json(buildEmptyResponse());
    }

    const stageCounts: Record<FunnelStageName, number> = {
      domain_submitted: 0,
      brand_extraction_completed: 0,
      storefront_generated: 0,
      storefront_published: 0,
    };

    (events ?? []).forEach((e) => {
      if (e.event_name in stageCounts) {
        stageCounts[e.event_name as FunnelStageName] += 1;
      }
    });

    const topCount = stageCounts.domain_submitted;

    const funnel = FUNNEL_STAGES.map((stage, i) => {
      const prevStage = i > 0 ? FUNNEL_STAGES[i - 1] : null;
      const prevCount = prevStage ? stageCounts[prevStage] : stageCounts[stage];
      return {
        stage,
        count: stageCounts[stage],
        conversionRate:
          prevCount > 0
            ? Math.round((stageCounts[stage] / prevCount) * 100)
            : 0,
      };
    });

    const endToEndConversion =
      topCount > 0
        ? Math.round((stageCounts.storefront_published / topCount) * 100)
        : 0;

    const hourKeys = buildHourKeys(48);
    const timeSeries = hourKeys.map((key) => {
      const hourEvents = (events ?? []).filter(
        (e) => e.created_at?.slice(0, 13) === key
      );
      const row: Record<string, unknown> = {
        hour: key.slice(5).replace("T", " ") + ":00",
      };
      FUNNEL_STAGES.forEach((stage) => {
        row[stage] = hourEvents.filter((e) => e.event_name === stage).length;
      });
      return row;
    });

    return NextResponse.json({ funnel, timeSeries, endToEndConversion });
  } catch (e) {
    console.error("Admin analytics error:", e);
    return NextResponse.json(buildEmptyResponse());
  }
}
