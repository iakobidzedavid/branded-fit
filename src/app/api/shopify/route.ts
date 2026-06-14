import { NextRequest, NextResponse } from "next/server";
import {
  createShopifyClient,
  generateUniqueSubdomain,
  validateShopifyToken,
  ProductInput,
} from "@/lib/shopify";
import { insertStoreMetadata, updateStoreStatus } from "@/lib/stores";
import { orchestrationStore, OrchestrationState } from "@/lib/orchestration-state";

interface ProductVariant {
  sku: string;
  price: number;
  options?: Record<string, string>;
}

interface Product {
  title: string;
  description: string;
  images: Array<{ src: string; alt?: string }>;
  variants: ProductVariant[];
  vendor?: string;
  productType?: string;
}

interface ShopifyOrchestrationRequest {
  domain: string;
  products: Product[];
  brandName?: string;
  currency?: string;
  timezone?: string;
}

const TIMEOUT_MINUTES = 10;
const TIMEOUT_MS = TIMEOUT_MINUTES * 60 * 1000;

function createTimeoutPromise(): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error(`Store creation timeout after ${TIMEOUT_MINUTES} minutes`)),
      TIMEOUT_MS
    )
  );
}

export async function POST(request: NextRequest) {

  try {
    const {
      domain,
      products,
      brandName,
      currency = "USD",
      timezone = "America/New_York",
    }: ShopifyOrchestrationRequest = await request.json();

    const normalizedDomain = domain.toLowerCase().trim();

    if (!normalizedDomain) {
      return NextResponse.json(
        { message: "Domain is required" },
        { status: 400 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "Products array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Initialize orchestration state
    const state: OrchestrationState = {
      status: "in_progress",
      pipeline1: { status: "in_progress", message: "Provisioning Shopify store..." },
      pipeline2: { status: "pending", message: "Waiting..." },
      pipeline3: { status: "pending", message: "Waiting..." },
      timestamp: Date.now(),
    };
    orchestrationStore.set(normalizedDomain, state);

    // Check Shopify configuration
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const shopName = process.env.SHOPIFY_STORE_NAME || process.env.SHOPIFY_SHOP_NAME;

    if (!accessToken || !shopName) {
      state.status = "failed";
      state.pipeline1 = {
        status: "failed",
        message: "Shopify integration not configured",
      };
      orchestrationStore.set(normalizedDomain, state);

      return NextResponse.json(
        {
          message:
            "Shopify integration not configured. Set SHOPIFY_ACCESS_TOKEN and SHOPIFY_STORE_NAME environment variables.",
          orchestration: state,
        },
        { status: 503 }
      );
    }

    // Run with timeout
    const result = await Promise.race([
      orchestrateStoreCreation(
        normalizedDomain,
        products,
        brandName || normalizedDomain.split(".")[0],
        currency,
        timezone,
        accessToken,
        shopName
      ),
      createTimeoutPromise(),
    ]);

    orchestrationStore.set(normalizedDomain, result);

    return NextResponse.json(
      {
        success: true,
        message: "Store creation completed successfully",
        orchestration: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Shopify orchestration error:", error);

    const errorState: OrchestrationState = {
      status: "failed",
      pipeline1: { status: "failed", message: "Store provisioning failed" },
      pipeline2: { status: "failed", message: "Product upload failed" },
      pipeline3: { status: "failed", message: "Metadata save failed" },
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: Date.now(),
    };

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Store creation failed",
        orchestration: errorState,
      },
      { status: 500 }
    );
  }
}

async function orchestrateStoreCreation(
  domain: string,
  products: Product[],
  brandName: string,
  currency: string,
  timezone: string,
  accessToken: string,
  shopName: string
): Promise<OrchestrationState> {
  const state: OrchestrationState = {
    status: "in_progress",
    pipeline1: { status: "in_progress", message: "Provisioning Shopify store..." },
    pipeline2: { status: "pending", message: "Waiting..." },
    pipeline3: { status: "pending", message: "Waiting..." },
    timestamp: Date.now(),
  };

  try {
    // Step 1: Validate Shopify token
    const isValidToken = await validateShopifyToken(accessToken, shopName);
    if (!isValidToken) {
      state.status = "failed";
      state.pipeline1 = {
        status: "failed",
        message: "Invalid Shopify credentials",
      };
      return state;
    }

    // Step 2: Create Shopify client and provision store
    const shopifyClient = createShopifyClient(accessToken, shopName);
    const subdomain = generateUniqueSubdomain(domain);

    const provisioningResult = await shopifyClient.provisionStore({
      name: brandName,
      currency,
      timezone,
      subdomain,
    });

    state.pipeline1 = {
      status: "completed",
      message: `Store provisioned: ${provisioningResult.storeUrl}`,
    };
    state.pipeline2 = {
      status: "in_progress",
      message: `Uploading ${products.length} products...`,
    };
    orchestrationStore.set(domain, state);

    // Step 3: Upload products to Shopify
    const uploadedProducts = [];
    const failedProducts = [];

    for (let i = 0; i < products.length; i++) {
      try {
        const product = products[i];
        const productInput: ProductInput = {
          title: product.title,
          description: product.description,
          vendor: product.vendor || "Branded Fit",
          productType: product.productType || "Branded Merchandise",
          images: product.images || [],
          variants: product.variants || [],
        };

        const created = await shopifyClient.createProduct(
          provisioningResult.accessToken,
          productInput
        );

        uploadedProducts.push({
          id: created.id,
          title: created.title,
        });

        state.pipeline2 = {
          status: "in_progress",
          message: `Uploaded ${uploadedProducts.length}/${products.length} products`,
        };
        orchestrationStore.set(domain, state);
      } catch (error) {
        failedProducts.push({
          product: products[i].title,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    if (uploadedProducts.length === 0) {
      state.status = "failed";
      state.pipeline2 = {
        status: "failed",
        message: `Failed to upload any products. Errors: ${failedProducts.map((p) => p.error).join("; ")}`,
      };
      return state;
    }

    state.pipeline2 = {
      status: "completed",
      message: `Uploaded ${uploadedProducts.length} of ${products.length} products`,
    };
    state.pipeline3 = {
      status: "in_progress",
      message: "Saving store metadata...",
    };
    orchestrationStore.set(domain, state);

    // Step 4: Save store metadata to Supabase
    const storeMetadata = await insertStoreMetadata({
      domain,
      shopify_store_id: provisioningResult.storeId,
      shopify_store_url: provisioningResult.storeUrl,
      shopify_api_token: provisioningResult.accessToken,
      status: "created",
    });

    if (!storeMetadata) {
      console.warn(`Failed to save store metadata for ${domain}`);
    } else {
      await updateStoreStatus(domain, "created");
    }

    state.status = "completed";
    state.pipeline3 = {
      status: "completed",
      message: "Store metadata saved",
    };
    state.storefront = {
      url: provisioningResult.storeUrl,
      productCount: uploadedProducts.length,
    };

    return state;
  } catch (error) {
    state.status = "failed";
    const errorMsg = error instanceof Error ? error.message : "Unknown error";

    if (state.pipeline1.status === "in_progress") {
      state.pipeline1 = { status: "failed", message: errorMsg };
    } else if (state.pipeline2.status === "in_progress") {
      state.pipeline2 = { status: "failed", message: errorMsg };
    } else if (state.pipeline3.status === "in_progress") {
      state.pipeline3 = { status: "failed", message: errorMsg };
    }

    return state;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { message: "Domain query parameter is required" },
        { status: 400 }
      );
    }

    const normalizedDomain = domain.toLowerCase().trim();
    const state = orchestrationStore.get(normalizedDomain);

    if (!state) {
      return NextResponse.json(
        {
          message: "No store creation in progress for this domain",
          domain: normalizedDomain,
          status: "not_found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        domain: normalizedDomain,
        orchestration: state,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      {
        message: "Failed to retrieve status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
