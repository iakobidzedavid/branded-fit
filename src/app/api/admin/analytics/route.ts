import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const FUNNEL_STAGES = [
  "domain_submitted",
  "brand_extraction_complete",
  "mockup_generation_complete",
  "storefront_generation_complete",
] as const;

type FunnelStageName = (typeof FUNNEL_STAGES)[number];

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword && token !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = getSupabase();

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
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const stageCounts: Record<FunnelStageName, number> = {
      domain_submitted: 0,
      brand_extraction_complete: 0,
      mockup_generation_complete: 0,
      storefront_generation_complete: 0,
    };

    (events ?? []).forEach((e) => {
      if (e.event_name in stageCounts) {
        stageCounts[e.event_name as FunnelStageName] += 1;
      }
    });

    const topCount = stageCounts.domain_submitted;

    const funnel = FUNNEL_STAGES.map((stage) => ({
      stage,
      count: stageCounts[stage],
      conversionRate:
        topCount > 0 ? Math.round((stageCounts[stage] / topCount) * 100) : 0,
    }));

    const endToEndConversion =
      topCount > 0
        ? Math.round(
            (stageCounts.storefront_generation_complete / topCount) * 100
          )
        : 0;

    // Build 7-day time series buckets
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    const timeSeries = days.map((date) => {
      const dayEvents = (events ?? []).filter((e) =>
        e.created_at.startsWith(date)
      );
      const row: Record<string, unknown> = { date };
      FUNNEL_STAGES.forEach((stage) => {
        row[stage] = dayEvents.filter((e) => e.event_name === stage).length;
      });
      return row;
    });

    return NextResponse.json({ funnel, timeSeries, endToEndConversion });
  } catch (e) {
    console.error("Admin analytics error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
