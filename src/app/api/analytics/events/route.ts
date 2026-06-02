import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventType,
      eventData,
      storeId,
      utmSource,
      utmMedium,
      utmCampaign,
      abVariant,
    } = body;

    if (!eventType) {
      return NextResponse.json(
        { error: "eventType is required" },
        { status: 400 }
      );
    }

    const client = getSupabase();

    const insertData: Record<string, unknown> = {
      event_type: eventType,
      event_data: eventData || {},
      created_at: new Date().toISOString(),
    };

    if (storeId) insertData.store_id = storeId;
    if (utmSource) insertData.utm_source = utmSource;
    if (utmMedium) insertData.utm_medium = utmMedium;
    if (utmCampaign) insertData.utm_campaign = utmCampaign;
    if (abVariant) insertData.ab_variant = abVariant;

    const { data, error } = await client
      .from("events")
      .insert([insertData])
      .select();

    if (error) {
      console.error("Error inserting event:", error);
      return NextResponse.json(
        { error: "Failed to log event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/analytics/events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
