import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

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
