import { NextRequest, NextResponse } from "next/server";
import { createShopifyClient, TaxRate, ShippingZone } from "@/lib/shopify";

interface ConfigureRequest {
  shopifyAccessToken: string;
  shopName: string;
  taxRates?: TaxRate[];
  shippingZones?: ShippingZone[];
}

export async function POST(request: NextRequest) {
  try {
    const {
      shopifyAccessToken,
      shopName,
      taxRates,
      shippingZones,
    }: ConfigureRequest = await request.json();

    if (!shopifyAccessToken || !shopName) {
      return NextResponse.json(
        { message: "shopifyAccessToken and shopName are required" },
        { status: 400 }
      );
    }

    const shopifyClient = createShopifyClient(shopifyAccessToken, shopName);

    // Configure tax rates
    const configuredTaxRates = [];
    const failedTaxRates = [];

    if (taxRates && taxRates.length > 0) {
      for (const taxRate of taxRates) {
        try {
          const success = await shopifyClient.createTaxRate(shopifyAccessToken, taxRate);
          if (success) {
            configuredTaxRates.push(taxRate.name);
          } else {
            failedTaxRates.push(taxRate.name);
          }
        } catch (error) {
          failedTaxRates.push(taxRate.name);
        }
      }
    }

    // Configure shipping zones
    const configuredShippingZones = [];
    const failedShippingZones = [];

    if (shippingZones && shippingZones.length > 0) {
      for (const zone of shippingZones) {
        try {
          const success = await shopifyClient.createShippingZone(
            shopifyAccessToken,
            zone
          );
          if (success) {
            configuredShippingZones.push(zone.name);
          } else {
            failedShippingZones.push(zone.name);
          }
        } catch (error) {
          failedShippingZones.push(zone.name);
        }
      }
    }

    // Set draft mode
    const draftModeSet = await shopifyClient.setDraftMode(shopifyAccessToken);

    return NextResponse.json(
      {
        success: true,
        draftMode: draftModeSet,
        taxRatesConfigured: configuredTaxRates.length,
        taxRates: configuredTaxRates,
        failedTaxRates,
        shippingZonesConfigured: configuredShippingZones.length,
        shippingZones: configuredShippingZones,
        failedShippingZones,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Store configuration error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to configure store";
    return NextResponse.json(
      { message, success: false },
      { status: 500 }
    );
  }
}
