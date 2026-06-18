import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return NextResponse.json({ error: "storeId is required" }, { status: 400 });
    }

    const client = getSupabase();
    const { data, error } = await client
      .from("stores")
      .select("id, domain, shopify_url, shopify_store_id, status, created_at")
      .eq("id", storeId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({
      store: {
        id: data.id,
        domain: data.domain,
        shopifyUrl: data.shopify_url ?? null,
        shopifyStoreId: data.shopify_store_id ?? null,
        status: data.status,
        createdAt: data.created_at,
      },
    });
  } catch (err) {
    console.error("[Store API] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
