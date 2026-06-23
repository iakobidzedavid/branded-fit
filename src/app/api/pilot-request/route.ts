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
    name,
    email,
    company,
    domain,
    team_size,
    annual_swag_budget,
    swag_cycles_per_year,
    current_approach,
    roi_multiple,
    roi_annual_value,
  } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 422 });
  }
  if (
    typeof email !== "string" ||
    !email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json({ error: "Valid work email is required" }, { status: 422 });
  }
  if (typeof company !== "string" || !company.trim()) {
    return NextResponse.json({ error: "Company is required" }, { status: 422 });
  }

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("pilot_requests")
    .insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company.trim(),
      domain: typeof domain === "string" ? domain.trim() : null,
      team_size: typeof team_size === "number" ? team_size : null,
      annual_swag_budget: typeof annual_swag_budget === "number" ? annual_swag_budget : null,
      swag_cycles_per_year: typeof swag_cycles_per_year === "number" ? swag_cycles_per_year : 4,
      current_approach: typeof current_approach === "string" && current_approach ? current_approach : null,
      roi_multiple: typeof roi_multiple === "number" ? roi_multiple : null,
      roi_annual_value: typeof roi_annual_value === "number" ? roi_annual_value : null,
      source: "pilot-page",
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("pilot_request insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
