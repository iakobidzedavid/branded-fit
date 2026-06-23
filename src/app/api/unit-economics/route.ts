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
    tier,
    scenario_label,
    annual_price,
    annual_rebate,
    churn_rate,
    discount_rate,
    coca,
    ltv_5yr,
    ltv_coca_ratio,
    notes,
    email,
  } = body as Record<string, unknown>;

  if (typeof annual_price !== "number" || annual_price <= 0) {
    return NextResponse.json({ error: "annual_price must be a positive number" }, { status: 422 });
  }
  if (typeof churn_rate !== "number" || churn_rate < 0 || churn_rate > 1) {
    return NextResponse.json({ error: "churn_rate must be between 0 and 1" }, { status: 422 });
  }
  if (typeof coca !== "number" || coca <= 0) {
    return NextResponse.json({ error: "coca must be a positive number" }, { status: 422 });
  }
  if (typeof ltv_5yr !== "number" || ltv_5yr <= 0) {
    return NextResponse.json({ error: "ltv_5yr must be a positive number" }, { status: 422 });
  }
  if (typeof ltv_coca_ratio !== "number") {
    return NextResponse.json({ error: "ltv_coca_ratio is required" }, { status: 422 });
  }

  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from("ltv_scenarios")
    .insert({
      tier: typeof tier === "string" ? tier : "core",
      scenario_label: typeof scenario_label === "string" && scenario_label.trim() ? scenario_label.trim() : null,
      annual_price,
      annual_rebate: typeof annual_rebate === "number" ? annual_rebate : 0,
      churn_rate,
      discount_rate: typeof discount_rate === "number" ? discount_rate : 0.10,
      coca,
      ltv_5yr,
      ltv_coca_ratio,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
      email: typeof email === "string" && email.trim() ? email.trim().toLowerCase() : null,
    })
    .select("id, created_at, gate_cleared")
    .single();

  if (error) {
    console.error("ltv_scenarios insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      success: true,
      scenario: {
        id: data.id,
        created_at: data.created_at,
        gate_cleared: data.gate_cleared,
        ltv_5yr,
        coca,
        ltv_coca_ratio,
      },
    },
    { status: 201 }
  );
}
