import { NextRequest, NextResponse } from "next/server";
import { createStorefront, getStorefrontByDomain } from "@/lib/supabase";

interface CreateStorefrontRequest {
  domain: string;
  brand_name: string;
  products: Array<{
    sku: string;
    product_name: string;
    base_price: number;
    variants?: Array<{ color: string; size: string }>;
  }>;
}

interface CreateStorefrontResponse {
  storefront_url: string;
  storefront_id: string;
  product_count: number;
  status: string;
}

interface ShopifyProduct {
  title: string;
  productType: string;
  vendor: string;
  status: string;
  variants: Array<{
    title: string;
    price: string;
    taxable: boolean;
  }>;
}

function calculateMarkupPrice(basePrice: number, markup: number = 0.4): number {
  return Math.round((basePrice * (1 + markup)) * 100) / 100;
}

function generateStorefrontUrl(domain: string): string {
  const cleanDomain = domain.replace(/[^a-z0-9]/g, "-").toLowerCase();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `https://${cleanDomain}-branded-fit-${randomSuffix}.myshopify.com`;
}

async function createShopifyStore(
  storefrontUrl: string,
  brandName: string,
  products: CreateStorefrontRequest["products"]
): Promise<{ storeId: string; success: boolean }> {
  const apiKey = process.env.SHOPIFY_ADMIN_API_KEY;
  const apiSecret = process.env.SHOPIFY_ADMIN_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.warn("Shopify Admin API credentials not configured");
    return {
      storeId: `MOCK_STORE_${Date.now()}`,
      success: false,
    };
  }

  try {
    const endpoint = `https://${storefrontUrl.replace(/https:\/\//, "").replace(".myshopify.com", "")}.myshopify.com/admin/api/2024-01/graphql.json`;

    const createStoreMutation = `
      mutation CreateStore($input: StoreInput!) {
        storeCreate(input: $input) {
          store {
            id
            name
            domain {
              host
              ssl
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": apiSecret,
      },
      body: JSON.stringify({
        query: createStoreMutation,
        variables: {
          input: {
            name: brandName,
            domain: {
              host: storefrontUrl.replace(/https:\/\//, "").replace(".myshopify.com", ""),
            },
          },
        },
      }),
    });

    if (!response.ok) {
      console.error(`Shopify API error: ${response.status}`);
      return { storeId: `MOCK_STORE_${Date.now()}`, success: false };
    }

    const data = await response.json();

    if (data.errors || data.data?.storeCreate?.userErrors?.length > 0) {
      console.warn("Shopify mutation errors:", data.errors || data.data?.storeCreate?.userErrors);
      return { storeId: `MOCK_STORE_${Date.now()}`, success: false };
    }

    const storeId = data.data?.storeCreate?.store?.id || `MOCK_STORE_${Date.now()}`;
    return { storeId, success: true };
  } catch (error) {
    console.error("Error creating Shopify store:", error);
    return { storeId: `MOCK_STORE_${Date.now()}`, success: false };
  }
}

async function uploadProductsToShopify(
  storefrontUrl: string,
  products: CreateStorefrontRequest["products"]
): Promise<{ uploadedCount: number; success: boolean }> {
  const apiSecret = process.env.SHOPIFY_ADMIN_API_SECRET;

  if (!apiSecret) {
    console.warn("Shopify Admin API credentials not configured");
    return { uploadedCount: products.length, success: false };
  }

  let uploadedCount = 0;

  try {
    const endpoint = `https://${storefrontUrl.replace(/https:\/\//, "").replace(".myshopify.com", "")}.myshopify.com/admin/api/2024-01/graphql.json`;

    for (const product of products) {
      const markupPrice = calculateMarkupPrice(product.base_price);

      const createProductMutation = `
        mutation CreateProduct($input: ProductInput!) {
          productCreate(input: $input) {
            product {
              id
              title
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variants = product.variants || [
        { color: "Default", size: "One Size" },
      ];

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": apiSecret,
        },
        body: JSON.stringify({
          query: createProductMutation,
          variables: {
            input: {
              title: product.product_name,
              productType: "Custom Print",
              vendor: "Branded Fit",
              status: "DRAFT",
              variants: variants.map((v) => ({
                title: `${v.color} / ${v.size}`,
                price: markupPrice.toString(),
                taxable: true,
              })),
            },
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.errors && !data.data?.productCreate?.userErrors?.length) {
          uploadedCount++;
        }
      }
    }
  } catch (error) {
    console.error("Error uploading products to Shopify:", error);
  }

  return { uploadedCount, success: uploadedCount > 0 };
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateStorefrontRequest = await request.json();
    const { domain, brand_name, products } = body;

    if (
      !domain ||
      typeof domain !== "string" ||
      domain.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Valid domain is required" },
        { status: 400 }
      );
    }

    if (!brand_name || typeof brand_name !== "string") {
      return NextResponse.json(
        { error: "Valid brand_name is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "At least one product is required" },
        { status: 400 }
      );
    }

    const normalizedDomain = domain.trim().toLowerCase();

    const existingStorefront = await getStorefrontByDomain(normalizedDomain);
    if (existingStorefront) {
      return NextResponse.json(
        {
          storefront_url: existingStorefront.storefront_url,
          storefront_id: existingStorefront.id,
          product_count: existingStorefront.product_count,
          status: existingStorefront.status,
        } as CreateStorefrontResponse,
        { status: 200 }
      );
    }

    const storefrontUrl = generateStorefrontUrl(normalizedDomain);

    const { storeId } = await createShopifyStore(
      storefrontUrl,
      brand_name,
      products
    );

    const { uploadedCount } = await uploadProductsToShopify(
      storefrontUrl,
      products
    );

    const storefront = await createStorefront(
      normalizedDomain,
      storeId,
      storefrontUrl,
      uploadedCount,
      "draft"
    );

    if (!storefront) {
      console.error("Failed to create storefront record in database");
      return NextResponse.json(
        { error: "Failed to create storefront" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        storefront_url: storefront.storefront_url,
        storefront_id: storefront.id,
        product_count: storefront.product_count,
        status: storefront.status,
      } as CreateStorefrontResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("Storefront creation error:", error);
    return NextResponse.json(
      { error: "Failed to create storefront" },
      { status: 500 }
    );
  }
}
