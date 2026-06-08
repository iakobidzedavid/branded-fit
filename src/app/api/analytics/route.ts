import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event_type, customer_id, timestamp, properties, domain, metadata } = body;

  if (!event_type || typeof event_type !== "string") {
    return NextResponse.json(
      { error: "event_type is required and must be a string" },
      { status: 400 }
    );
  }

  if (customer_id != null && typeof customer_id !== "string") {
    return NextResponse.json(
      { error: "customer_id must be a string" },
      { status: 400 }
    );
  }

  if (timestamp != null && typeof timestamp !== "string" && typeof timestamp !== "number") {
    return NextResponse.json(
      { error: "timestamp must be an ISO string or Unix ms integer" },
      { status: 400 }
    );
  }

  if (properties != null && (typeof properties !== "object" || Array.isArray(properties))) {
    return NextResponse.json(
      { error: "properties must be a JSON object" },
      { status: 400 }
    );
  }

  const record: Record<string, unknown> = {
    // Populate both event_name and event_type so legacy consumers (admin
    // analytics route) that query by event_name continue to work.
    event_name: event_type,
    event_type,
  };

  if (customer_id != null) record.customer_id = customer_id;
  if (timestamp != null) record.timestamp = timestamp;
  if (properties != null) record.properties = properties;
  if (domain != null) record.domain = String(domain);
  // Accept metadata for backward-compat callers; prefer properties for new callers.
  if (metadata != null && typeof metadata === "object" && !Array.isArray(metadata)) {
    record.metadata = metadata;
  }

  // Analytics persistence is best-effort — DB errors must not surface as 500s.
  try {
    const client = getSupabase();

    const { data, error } = await client
      .from("analytics_events")
      .insert([record])
      .select("id, event_type, customer_id, timestamp, properties, created_at");

    if (!error) {
      return NextResponse.json({ success: true, data: data?.[0] ?? null }, { status: 201 });
    }

    // Full insert failed — try minimal fallback.
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
