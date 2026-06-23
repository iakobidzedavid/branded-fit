import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event_name, domain, session_id, properties } = body as Record<string, unknown>;

  if (typeof event_name !== "string" || !event_name.trim()) {
    return NextResponse.json({ error: "event_name is required" }, { status: 422 });
  }

  const { data, error } = await getSupabase()
    .from("analytics_events")
    .insert({
      event_name: event_name.trim(),
      domain: typeof domain === "string" && domain.trim() ? domain.trim() : null,
      session_id: typeof session_id === "string" && session_id.trim() ? session_id.trim() : null,
      properties: typeof properties === "object" && properties !== null ? properties : {},
    })
    .select("id, event_name, created_at")
    .single();

  if (error) {
    console.error("analytics insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, event: data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? "200"), 1000);
  const eventFilter = searchParams.get("event");
  const since = searchParams.get("since"); // ISO date string

  let query = getSupabase()
    .from("analytics_events")
    .select("id, event_name, domain, session_id, properties, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (eventFilter) {
    query = query.eq("event_name", eventFilter);
  }
  if (since) {
    query = query.gte("created_at", since);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data ?? [] });
}
