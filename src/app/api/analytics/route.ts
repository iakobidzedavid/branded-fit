import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event_type, customer_id, domain, timestamp, metadata } = body;

  if (!event_type || typeof event_type !== "string") {
    return NextResponse.json(
      { error: "event_type is required and must be a string" },
      { status: 400 }
    );
  }

  const record: Record<string, unknown> = {
    // Populate both columns so the admin analytics route (which reads event_name)
    // and newer consumers (which read event_type) both see the value.
    event_name: event_type,
    event_type,
  };
  if (domain != null) record.domain = String(domain);
  if (customer_id != null) record.customer_id = String(customer_id);
  if (timestamp != null) record.timestamp = timestamp;
  if (metadata != null && typeof metadata === "object") record.metadata = metadata;

  // Analytics persistence is best-effort — DB errors must not surface as 500s.
  try {
    const client = getSupabase();

    const { data, error } = await client
      .from("analytics_events")
      .insert([record])
      .select("id, event_type, created_at");

    if (!error) {
      return NextResponse.json({ success: true, data: data?.[0] ?? null }, { status: 201 });
    }

    // Full insert failed (e.g. migration pending) — try minimal fallback.
    console.warn("Analytics insert failed, trying fallback:", error.message);
    const { error: fallbackError } = await client
      .from("analytics_events")
      .insert([{ event_name: event_type }]);

    if (!fallbackError) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
    console.warn("Analytics fallback insert also failed:", fallbackError.message);
  } catch (dbErr) {
    console.warn(
      "Analytics DB unavailable:",
      dbErr instanceof Error ? dbErr.message : String(dbErr)
    );
  }

  // Return 200 (not 500) — analytics is non-critical tracking.
  return NextResponse.json({ success: true, stored: false }, { status: 200 });
}
