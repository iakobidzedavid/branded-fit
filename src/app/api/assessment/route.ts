import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    current_approach,
    team_size,
    annual_budget,
    cycles_per_year,
    biggest_pain,
    swag_score,
    estimated_waste_dollars,
    estimated_time_savings,
    roi_multiple,
    email,
  } = body as Record<string, unknown>;

  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from("swag_assessments")
    .insert({
      current_approach: typeof current_approach === "string" ? current_approach : null,
      team_size: typeof team_size === "number" ? team_size : null,
      annual_budget: typeof annual_budget === "number" ? annual_budget : null,
      cycles_per_year: typeof cycles_per_year === "number" ? cycles_per_year : null,
      biggest_pain: typeof biggest_pain === "string" ? biggest_pain : null,
      swag_score: typeof swag_score === "number" ? swag_score : null,
      estimated_waste_dollars:
        typeof estimated_waste_dollars === "number" ? estimated_waste_dollars : null,
      estimated_time_savings:
        typeof estimated_time_savings === "number" ? estimated_time_savings : null,
      roi_multiple: typeof roi_multiple === "number" ? roi_multiple : null,
      email: typeof email === "string" && email.trim() ? email.trim().toLowerCase() : null,
      source: "assessment-page",
    })
    .select("id, swag_score, created_at")
    .single();

  if (error) {
    console.error("swag_assessment insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ assessment: data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("swag_assessments")
    .select("id, swag_score, current_approach, team_size, annual_budget, cycles_per_year, biggest_pain, roi_multiple, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  return NextResponse.json({ assessment: data });
}
