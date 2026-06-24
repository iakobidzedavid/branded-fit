import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ customer_id: string }> }
) {
  const { customer_id } = await params;

  if (!customer_id) {
    return NextResponse.json({ error: "customer_id is required" }, { status: 400 });
  }

  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from("orders")
    .select("shipping_address, customer_name, customer_email, customer_id")
    .eq("customer_id", customer_id)
    .order("order_date", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    // Return empty address rather than 404 — customer may not have a cached address yet
    return NextResponse.json({
      customer_id,
      addresses: [{ street: null, city: null, state: null, zip: null, country: null }],
    });
  }

  const addr = (data.shipping_address as Record<string, string | null>) ?? {};

  return NextResponse.json({
    customer_id,
    customer_name: data.customer_name ?? null,
    customer_email: data.customer_email ?? null,
    addresses: [
      {
        street: addr.street ?? null,
        city: addr.city ?? null,
        state: addr.state ?? null,
        zip: addr.zip ?? null,
        country: addr.country ?? null,
      },
    ],
  });
}
