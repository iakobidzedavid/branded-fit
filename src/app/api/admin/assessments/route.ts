import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "200", 10), 500);

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("swag_assessments")
    .select(
      "id, email, current_approach, team_size, annual_budget, cycles_per_year, biggest_pain, swag_score, estimated_waste_dollars, estimated_time_savings, roi_multiple, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("admin assessments fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ assessments: data ?? [], total: (data ?? []).length });
}
