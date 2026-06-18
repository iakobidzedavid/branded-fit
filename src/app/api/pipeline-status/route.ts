import { NextRequest, NextResponse } from "next/server";
import { orchestrationStore } from "@/lib/orchestration-state";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { message: "Domain is required" },
        { status: 400 }
      );
    }

    const cleanDomain = domain.toLowerCase().trim();

    // First check in-memory state (for ongoing orchestrations)
    let state = orchestrationStore.get(cleanDomain);

    if (!state) {
      // Check database if not in memory
      try {
        const supabase = getSupabase();
        const { data: store } = await supabase
          .from("stores")
          .select("*")
          .eq("domain", cleanDomain)
          .single();

        if (store) {
          // Store exists, orchestration has completed
          state = {
            status: "completed",
            pipeline1: { status: "completed", message: "Brand assets extracted" },
            pipeline2: { status: "completed", message: "Mockups generated" },
            pipeline3: {
              status: "completed",
              message: "Shopify store provisioned",
            },
            storefront: {
              url: store.shopify_url || "",
              productCount: store.mockup_images
                ? Object.keys(store.mockup_images).length
                : 3,
            },
            timestamp: Date.now(),
          };
        }
      } catch (dbErr) {
        // Silently ignore database errors during polling
        console.error("Database error:", dbErr);
      }
    }

    if (!state) {
      return NextResponse.json(
        {
          status: "pending",
          orchestration: {
            status: "pending",
            pipeline1: { status: "pending", message: "Waiting..." },
            pipeline2: { status: "pending", message: "Waiting..." },
            pipeline3: { status: "pending", message: "Waiting..." },
            timestamp: Date.now(),
          },
        }
      );
    }

    return NextResponse.json({
      status: state.status,
      orchestration: state,
    });
  } catch (error) {
    console.error("Pipeline status error:", error);
    return NextResponse.json(
      { message: "Failed to get pipeline status" },
      { status: 500 }
    );
  }
}
