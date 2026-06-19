import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    event_name,
    domain,
    session_id,
    timestamp,
    error_message,
    fidelity_score,
    product_count,
    storefront_url,
  } = body;

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
  if (fidelity_score != null) record.fidelity_score = Number(fidelity_score);
  if (product_count != null) record.product_count = Number(product_count);
  if (storefront_url != null) record.storefront_url = String(storefront_url);

  // Analytics persistence is best-effort — DB errors must not surface as 500s
  try {
    const client = getSupabase();

    const { data, error } = await client
      .from("analytics_events")
      .insert([record])
      .select("id, event_name, created_at");

    if (!error) {
      return NextResponse.json({ success: true, data: data?.[0] ?? null }, { status: 201 });
    }

    // Full insert failed (e.g. schema not yet migrated) — try minimal fallback
    console.warn("Analytics insert failed, trying fallback:", error.message);
    const { error: fallbackError } = await client
      .from("analytics_events")
      .insert([{ event_name }]);

    if (!fallbackError) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
    console.warn("Analytics fallback insert also failed:", fallbackError.message);
  } catch (dbErr) {
    // Supabase unavailable or misconfigured — log but never 500
    console.warn(
      "Analytics DB unavailable:",
      dbErr instanceof Error ? dbErr.message : String(dbErr)
    );
  }

  // Return 200 (not 500) — analytics is non-critical tracking
  return NextResponse.json({ success: true, stored: false }, { status: 200 });
}
