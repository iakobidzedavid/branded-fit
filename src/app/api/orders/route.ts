import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const store = searchParams.get("store");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const supabase = getServerSupabase();
  let query = supabase
    .from("orders")
    .select(
      "id, shopify_order_id, store_name, customer_name, customer_email, customer_id, product_name, product_sku, product_mockup_url, quantity, unit_price, total_price, fulfillment_status, printify_tracking_url, order_date, order_notes"
    )
    .order("order_date", { ascending: false })
    .limit(200);

  if (store && store !== "all") {
    query = query.eq("store_name", store);
  }
  if (dateFrom) {
    query = query.gte("order_date", dateFrom);
  }
  if (dateTo) {
    // include the full end day
    const end = new Date(dateTo);
    end.setDate(end.getDate() + 1);
    query = query.lt("order_date", end.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error("orders fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also return distinct store names for the filter dropdown
  const { data: stores } = await supabase
    .from("orders")
    .select("store_name")
    .order("store_name");

  const storeNames = [...new Set((stores ?? []).map((r: { store_name: string }) => r.store_name))];

  return NextResponse.json({ orders: data ?? [], stores: storeNames, total: (data ?? []).length });
}
