import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Order ID required" }, { status: 400 });
  }

  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Order not found" }, { status: 404 });
  }

  // shipping_address is stored as JSONB inline on the order row
  // (fresh fetch simulates GET /customers/{customer_id}/addresses)
  const address = data.shipping_address ?? null;

  return NextResponse.json({ order: { ...data, shipping_address: address } });
}
