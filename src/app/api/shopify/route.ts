import { NextRequest, NextResponse } from "next/server";

interface ShopifyStoreResponse {
  storeUrl: string;
  storeName: string;
  productCount: number;
  adminUrl: string;
}

function generateShopifyUrl(domain: string): string {
  // Generate a unique Shopify URL from the domain
  const cleanDomain = domain.replace(/[^a-z0-9]/g, "-").slice(0, 30);
  const timestamp = Date.now().toString().slice(-6);
  return `https://${cleanDomain}-branded-fit-${timestamp}.myshopify.com`;
}

function generateAdminUrl(storeUrl: string): string {
  return storeUrl.replace("myshopify.com", "admin.shopify.com");
}

export async function POST(request: NextRequest) {
  try {
    const { domain, products, brandName } = await request.json();

    if (!domain || !products) {
      return NextResponse.json(
        { message: "Domain and products are required" },
        { status: 400 }
      );
    }

    // For MVP, we'll generate a realistic mock Shopify store URL
    // In production, this would call the Shopify Admin API with OAuth tokens

    const apiKey = process.env.SHOPIFY_ADMIN_API_KEY;
    const apiSecret = process.env.SHOPIFY_ADMIN_API_SECRET;

    // If keys are not configured, return a demo store URL
    if (!apiKey || !apiSecret) {
      const storeUrl = generateShopifyUrl(domain);
      const response: ShopifyStoreResponse = {
        storeUrl,
        storeName: brandName || domain,
        productCount: products.length,
        adminUrl: generateAdminUrl(storeUrl),
      };
      return NextResponse.json(response);
    }

    // TODO: Implement actual Shopify Admin API integration
    // This would:
    // 1. Create a new app-owned store
    // 2. Set store name and domain
    // 3. Upload product data (name, description, price, images, variants)
    // 4. Configure store settings (currency, tax)
    // 5. Return store URL and credentials

    const storeUrl = generateShopifyUrl(domain);
    const response: ShopifyStoreResponse = {
      storeUrl,
      storeName: brandName || domain,
      productCount: products.length,
      adminUrl: generateAdminUrl(storeUrl),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Shopify provisioning error:", error);
    return NextResponse.json(
      { message: "Failed to provision Shopify store" },
      { status: 500 }
    );
  }
}
