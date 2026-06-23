import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { domain, company_name, palette_index, email } = body as Record<string, unknown>;

  if (typeof domain !== "string" || !domain.trim()) {
    return NextResponse.json({ error: "domain is required" }, { status: 422 });
  }

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("storefront_previews")
    .insert({
      domain: domain.trim().toLowerCase(),
      company_name: typeof company_name === "string" ? company_name.trim() : null,
      palette_index: typeof palette_index === "number" ? palette_index : 0,
      email: typeof email === "string" && email.trim() ? email.trim().toLowerCase() : null,
    })
    .select("id, domain, company_name, palette_index, created_at")
    .single();

  if (error) {
    console.error("storefront preview insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ preview: data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("storefront_previews")
    .select("id, domain, company_name, palette_index, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Preview not found" }, { status: 404 });
  }

  return NextResponse.json({ preview: data });
}
