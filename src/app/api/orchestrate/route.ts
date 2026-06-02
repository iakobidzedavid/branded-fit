import { NextRequest, NextResponse } from "next/server";
import { createStore, updateStoreWithShopifyUrl } from "@/lib/supabase";
import { BrandAssets } from "@/lib/supabase";
import { orchestrationStore, OrchestrationState } from "@/lib/orchestration-state";

async function runPipeline1(domain: string): Promise<BrandAssets | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/brandfetch`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Pipeline 1 failed");

    return data.assets;
  } catch (error) {
    console.error("Pipeline 1 error:", error);
    return null;
  }
}

async function runPipeline2(
  domain: string,
  brandAssets: BrandAssets
): Promise<{ products: unknown[]; totalProducts: number } | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/printify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, brandAssets }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Pipeline 2 failed");

    return data;
  } catch (error) {
    console.error("Pipeline 2 error:", error);
    return null;
  }
}

async function runPipeline3(
  domain: string,
  products: unknown[],
  brandName: string
): Promise<{ storeUrl: string; productCount: number } | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/shopify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, products, brandName }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Pipeline 3 failed");

    return {
      storeUrl: data.storeUrl,
      productCount: data.productCount,
    };
  } catch (error) {
    console.error("Pipeline 3 error:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { message: "Domain is required" },
        { status: 400 }
      );
    }

    const cleanDomain = domain.toLowerCase().trim();

    // Initialize orchestration state
    const state: OrchestrationState = {
      status: "in_progress",
      pipeline1: { status: "in_progress", message: "Extracting brand assets..." },
      pipeline2: { status: "pending", message: "Waiting..." },
      pipeline3: { status: "pending", message: "Waiting..." },
      timestamp: Date.now(),
    };
    orchestrationStore.set(cleanDomain, state);

    // Run Pipeline 1: Brand Intelligence (Brandfetch)
    const brandAssets = await runPipeline1(cleanDomain);

    if (!brandAssets) {
      state.pipeline1 = {
        status: "failed",
        message: "Failed to extract brand assets",
      };
      state.status = "failed";
      orchestrationStore.set(cleanDomain, state);
      return NextResponse.json(
        { message: "Pipeline 1 failed", orchestration: state },
        { status: 400 }
      );
    }

    state.pipeline1 = {
      status: "completed",
      message: "Brand assets extracted successfully",
    };
    state.pipeline2 = { status: "in_progress", message: "Generating mockups..." };
    orchestrationStore.set(cleanDomain, state);

    // Run Pipeline 2: Mockup Generation (Printify)
    const mockupData = await runPipeline2(cleanDomain, brandAssets);

    if (!mockupData) {
      state.pipeline2 = {
        status: "failed",
        message: "Failed to generate mockups",
      };
      state.status = "failed";
      orchestrationStore.set(cleanDomain, state);
      return NextResponse.json(
        { message: "Pipeline 2 failed", orchestration: state },
        { status: 400 }
      );
    }

    state.pipeline2 = {
      status: "completed",
      message: `Generated ${mockupData.totalProducts} products`,
    };
    state.pipeline3 = {
      status: "in_progress",
      message: "Provisioning Shopify store...",
    };
    orchestrationStore.set(cleanDomain, state);

    // Run Pipeline 3: Shopify Provisioning
    const brandName = cleanDomain.split(".")[0];
    const shopifyResult = await runPipeline3(
      cleanDomain,
      mockupData.products,
      brandName
    );

    if (!shopifyResult) {
      state.pipeline3 = {
        status: "failed",
        message: "Failed to provision Shopify store",
      };
      state.status = "failed";
      orchestrationStore.set(cleanDomain, state);
      return NextResponse.json(
        { message: "Pipeline 3 failed", orchestration: state },
        { status: 400 }
      );
    }

    state.pipeline3 = {
      status: "completed",
      message: "Shopify store created successfully",
    };
    state.status = "completed";
    state.storefront = {
      url: shopifyResult.storeUrl,
      productCount: shopifyResult.productCount,
    };

    // Store in database
    await createStore(
      cleanDomain,
      brandName,
      brandAssets,
      brandAssets.logoUrl,
      {} // mockup images would go here
    );
    await updateStoreWithShopifyUrl(cleanDomain, shopifyResult.storeUrl);

    orchestrationStore.set(cleanDomain, state);

    return NextResponse.json({
      message: "Orchestration completed successfully",
      orchestration: state,
    });
  } catch (error) {
    console.error("Orchestration error:", error);
    return NextResponse.json(
      { message: "Orchestration failed" },
      { status: 500 }
    );
  }
}

// Helper function to get current state (for polling)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json(
      { message: "Domain is required" },
      { status: 400 }
    );
  }

  const state = orchestrationStore.get(domain);
  if (!state) {
    return NextResponse.json(
      { message: "No orchestration found for this domain" },
      { status: 404 }
    );
  }

  return NextResponse.json({ orchestration: state });
}
