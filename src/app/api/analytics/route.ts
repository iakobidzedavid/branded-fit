import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_name, event_data, user_id } = body;

    if (!event_name || typeof event_name !== "string") {
      return NextResponse.json(
        { error: "event_name is required and must be a string" },
        { status: 400 }
      );
    }

    if (
      user_id !== undefined &&
      user_id !== null &&
      typeof user_id !== "string"
    ) {
      return NextResponse.json(
        { error: "user_id must be a UUID string when provided" },
        { status: 400 }
      );
    }

    const record: Record<string, unknown> = {
      event_name,
      event_data: event_data ?? null,
    };

    if (user_id != null) {
      record.user_id = user_id;
    }

    const client = getSupabase();

    const { data, error } = await client
      .from("analytics_events")
      .insert([record])
      .select("id, event_name, created_at");

    if (error) {
      console.error("Error inserting analytics event:", error);
      return NextResponse.json(
        { error: "Failed to record event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data?.[0] }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
