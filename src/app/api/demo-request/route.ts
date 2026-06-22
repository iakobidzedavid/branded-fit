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

  const { name, email, company, source } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 422 });
  }
  if (
    typeof email !== "string" ||
    !email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 422 });
  }
  if (typeof company !== "string" || !company.trim()) {
    return NextResponse.json({ error: "Company is required" }, { status: 422 });
  }

  const emailStr = email.trim().toLowerCase();
  const domainMatch = emailStr.match(/@(.+)$/);
  const emailDomain = domainMatch ? domainMatch[1] : "";

  const { data, error } = await getSupabase()
    .from("demo_requests")
    .insert({
      name: name.trim(),
      email: emailStr,
      company: company.trim(),
      domain: emailDomain,
      source: typeof source === "string" && source.trim() ? source.trim() : "homepage",
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("demo-request insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { success: true, id: data.id, message: "Demo request received" },
    { status: 201 }
  );
}
