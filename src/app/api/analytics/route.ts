import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_name, domain, session_id, timestamp, error_message } = body;

    if (!event_name || typeof event_name !== "string") {
      return NextResponse.json(
        { error: "event_name is required and must be a string" },
        { status: 400 }
      );
    }

    const record: Record<string, unknown> = { event_name };

    if (domain != null) record.domain = String(domain);
    if (session_id != null) record.session_id = String(session_id);
    if (error_message != null) record.error_message = String(error_message);
    if (timestamp != null) record.timestamp = timestamp;

    const client = getSupabase();
    const { data, error } = await client
      .from("analytics_events")
      .insert([record])
      .select("id, event_name, domain, session_id, timestamp, created_at");

    if (error) {
      console.error("Error inserting analytics event:", error);
      return NextResponse.json(
        { error: "Failed to record event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data?.[0] }, { status: 201 });
  } catch (err) {
    console.error("Error in POST /api/analytics:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
