import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Accept event_name as canonical field; fall back to event_type for backward compat.
  const event_name =
    (body.event_name as string | undefined) ||
    (body.event_type as string | undefined);

  if (!event_name || typeof event_name !== "string") {
    return NextResponse.json(
      { error: "event_name is required and must be a string" },
      { status: 400 }
    );
  }

  const {
    user_id,
    session_id, // alias for user_id
    domain,
    pipeline_stage,
    duration_ms,
    error_message,
    timestamp,
    context,
    payload, // alias for context
    // Legacy fields kept for backward compat
    customer_id,
    properties,
    metadata,
  } = body;

  const resolved_user_id =
    (user_id as string | undefined) ?? (session_id as string | undefined);
  const resolved_context =
    (context as Record<string, unknown> | undefined) ??
    (payload as Record<string, unknown> | undefined);

  if (resolved_user_id != null && typeof resolved_user_id !== "string") {
    return NextResponse.json(
      { error: "user_id must be a string" },
      { status: 400 }
    );
  }

  if (pipeline_stage != null && typeof pipeline_stage !== "string") {
    return NextResponse.json(
      { error: "pipeline_stage must be a string" },
      { status: 400 }
    );
  }

  if (
    duration_ms != null &&
    (typeof duration_ms !== "number" || !Number.isFinite(duration_ms) || duration_ms < 0)
  ) {
    return NextResponse.json(
      { error: "duration_ms must be a non-negative number" },
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

  if (context != null && (typeof context !== "object" || Array.isArray(context))) {
    return NextResponse.json(
      { error: "context must be a JSON object" },
      { status: 400 }
    );
  }

  if (payload != null && (typeof payload !== "object" || Array.isArray(payload))) {
    return NextResponse.json(
      { error: "payload must be a JSON object" },
      { status: 400 }
    );
  }

  const record: Record<string, unknown> = {
    event_name,
    // Mirror into event_type for legacy consumers that query that column.
    event_type: event_name,
  };

  if (resolved_user_id != null) record.user_id = String(resolved_user_id);
  if (domain != null) record.domain = String(domain);
  if (pipeline_stage != null) record.pipeline_stage = String(pipeline_stage);
  if (duration_ms != null) record.duration_ms = Math.round(duration_ms as number);
  if (error_message != null) record.error_message = String(error_message);
  if (timestamp != null) record.timestamp = timestamp;
  if (customer_id != null) record.customer_id = String(customer_id);
  if (properties != null) record.properties = properties;
  if (metadata != null && typeof metadata === "object" && !Array.isArray(metadata)) {
    record.metadata = metadata;
  }
  if (resolved_context != null) {
    record.context = resolved_context;
  }

  // Analytics persistence is best-effort — DB errors must not surface as 500s.
  try {
    const client = getSupabase();

    const { data, error } = await client
      .from("analytics_events")
      .insert([record])
      .select(
        "id, event_name, user_id, domain, pipeline_stage, duration_ms, error_message, timestamp, context, created_at"
      );

    if (!error) {
      return NextResponse.json(
        { success: true, data: data?.[0] ?? null },
        { status: 201 }
      );
    }

    // Full insert failed — try minimal fallback.
    console.warn("Analytics insert failed, trying fallback:", error.message);
    const { error: fallbackError } = await client
      .from("analytics_events")
      .insert([{ event_name }]);

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
