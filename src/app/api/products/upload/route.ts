import { NextRequest, NextResponse } from "next/server";
import {
  createShopifyClient,
  ProductInput,
  TaxRate,
  ShippingZone,
} from "@/lib/shopify";
import { getProductsByDomain } from "@/lib/supabase";
import { getStoreByDomain } from "@/lib/stores";

interface UploadRequest {
  domain: string;
  shopifyAccessToken: string;
  shopName: string;
  taxRates?: TaxRate[];
  shippingZones?: ShippingZone[];
}

export async function POST(request: NextRequest) {
  try {
    const {
      domain,
      shopifyAccessToken,
      shopName,
      taxRates,
      shippingZones,
    }: UploadRequest = await request.json();

    if (!domain || !shopifyAccessToken || !shopName) {
      return NextResponse.json(
        { message: "domain, shopifyAccessToken, and shopName are required" },
        { status: 400 }
      );
    }

    // Get products from Supabase for this domain
    const products = await getProductsByDomain(domain);

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "No products found for this domain. Run Printify pipeline first." },
        { status: 400 }
      );
    }

    // Get store info
    const store = await getStoreByDomain(domain);

    if (!store) {
      return NextResponse.json(
        { message: "Store not found. Provision a store first." },
        { status: 404 }
      );
    }

    // Create Shopify client
    const shopifyClient = createShopifyClient(shopifyAccessToken, shopName);

    // Create products on Shopify
    const createdProducts = [];
    const failedProducts = [];

    for (const product of products) {
      try {
        const productInput: ProductInput = {
          title: product.product_name,
          description: `Premium branded ${product.product_name}. Customized with your brand assets.`,
          vendor: "Branded Fit",
          productType: "Branded Merchandise",
          images: product.mockup_image_url
            ? [{ src: product.mockup_image_url, alt: product.product_name }]
            : [],
          variants: product.variants.map((variant) => ({
            sku: product.sku,
            price: product.pricing.finalPrice,
            options: {
              color: variant.color,
              size: variant.size,
            },
          })),
        };

        const created = await shopifyClient.createProduct(
          shopifyAccessToken,
          productInput
        );

        createdProducts.push({
          sku: product.sku,
          title: created.title,
          shopifyId: created.id,
        });
      } catch (error) {
        failedProducts.push({
          sku: product.sku,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Configure tax rates if provided
    const configuredTaxRates = [];
    const failedTaxRates = [];

    if (taxRates && taxRates.length > 0) {
      for (const taxRate of taxRates) {
        const success = await shopifyClient.createTaxRate(shopifyAccessToken, taxRate);
        if (success) {
          configuredTaxRates.push(taxRate.name);
        } else {
          failedTaxRates.push(taxRate.name);
        }
      }
    }

    // Configure shipping zones if provided
    const configuredShippingZones = [];
    const failedShippingZones = [];

    if (shippingZones && shippingZones.length > 0) {
      for (const zone of shippingZones) {
        const success = await shopifyClient.createShippingZone(
          shopifyAccessToken,
          zone
        );
        if (success) {
          configuredShippingZones.push(zone.name);
        } else {
          failedShippingZones.push(zone.name);
        }
      }
    }

    return NextResponse.json(
      {
        success: createdProducts.length > 0,
        domain,
        productsCreated: createdProducts.length,
        products: createdProducts,
        failedProducts,
        taxRatesConfigured: configuredTaxRates.length,
        taxRates: configuredTaxRates,
        failedTaxRates,
        shippingZonesConfigured: configuredShippingZones.length,
        shippingZones: configuredShippingZones,
        failedShippingZones,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product upload error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload products";
    return NextResponse.json(
      { message, success: false },
      { status: 500 }
    );
  }
}
