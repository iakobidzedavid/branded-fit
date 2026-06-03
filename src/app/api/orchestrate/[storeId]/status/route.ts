import { NextRequest, NextResponse } from "next/server";
import { getStoreById } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }

    const store = await getStoreById(storeId);

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({
      storeId: store.id,
      status: store.status,
      progress: {
        // Mock progress for now (will be populated as pipeline runs)
        extracting_brand: store.status === "provisioning" ? 0 : 25,
        generating_mockups: store.status === "provisioning" ? 0 : 50,
        provisioning_shopify: store.status === "provisioning" ? 0 : 75,
        completed: store.status === "completed" ? 100 : 0,
      },
      brandData: store.brand_data || null,
      productCount: store.products_count || 0,
      createdAt: store.created_at,
    });
  } catch (error) {
    console.error("Get store status error:", error);
    return NextResponse.json(
      { message: "Failed to fetch store status" },
      { status: 500 }
    );
  }
}
