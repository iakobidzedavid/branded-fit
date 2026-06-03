import { NextRequest, NextResponse } from "next/server";
import {
  createShopifyClient,
  generateUniqueSubdomain,
  validateShopifyToken,
  ShopifyStoreProvisioningResult,
} from "@/lib/shopify";
import { insertStoreMetadata } from "@/lib/stores";

interface StoreProvisioningRequest {
  domain: string;
  storeName: string;
  currency?: string;
  timezone?: string;
  products?: unknown[];
}

export async function POST(request: NextRequest) {
  try {
    const {
      domain,
      storeName,
      currency = "USD",
      timezone = "America/New_York",
      products = [],
    }: StoreProvisioningRequest = await request.json();

    if (!domain || !storeName) {
      return NextResponse.json(
        { message: "Domain and storeName are required" },
        { status: 400 }
      );
    }

    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const shopName = process.env.SHOPIFY_SHOP_NAME;

    if (!accessToken || !shopName) {
      return NextResponse.json(
        {
          message:
            "Shopify integration not configured. Set SHOPIFY_ACCESS_TOKEN and SHOPIFY_SHOP_NAME environment variables.",
        },
        { status: 503 }
      );
    }

    // Validate the access token
    const isValidToken = await validateShopifyToken(accessToken, shopName);
    if (!isValidToken) {
      return NextResponse.json(
        { message: "Invalid Shopify access token or shop name" },
        { status: 401 }
      );
    }

    // Create Shopify client
    const shopifyClient = createShopifyClient(accessToken, shopName);

    // Generate unique subdomain
    const subdomain = generateUniqueSubdomain(domain);

    // Provision store
    const provisioningResult = await shopifyClient.provisionStore({
      name: storeName,
      currency,
      timezone,
      subdomain,
    });

    // Store metadata in database
    const storeMetadata = await insertStoreMetadata({
      domain,
      shopify_store_id: provisioningResult.storeId,
      shopify_store_url: provisioningResult.storeUrl,
      shopify_api_token: provisioningResult.accessToken,
      status: "provisioned",
    });

    return NextResponse.json(
      {
        success: true,
        storeId: provisioningResult.storeId,
        storeName: provisioningResult.storeName,
        storeUrl: provisioningResult.storeUrl,
        accessToken: provisioningResult.accessToken,
        currency: provisioningResult.currency,
        timezone: provisioningResult.timezone,
        subdomain,
        database: storeMetadata,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Shopify provisioning error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to provision Shopify store";
    return NextResponse.json(
      { message, success: false },
      { status: 500 }
    );
  }
}
