import { NextRequest, NextResponse } from "next/server";
import {
  storeProduct,
  getProductsByDomain,
} from "@/lib/supabase";
import {
  generateMockups,
  cacheMockupLocally,
  MockupGenerationInput,
  GeneratedMockup,
} from "@/lib/mockup-generator";

interface GenerateMockupRequest {
  domain: string;
  colors: { hex: string; type?: string }[];
  logos: { url: string; type?: string }[];
}

interface MockupResponse {
  domain: string;
  sku_count: number;
  variants_count: number;
  mockup_urls: string[];
  pricing: Array<{
    sku: string;
    basePrice: number;
    finalPrice: number;
  }>;
  products_created: number;
  cached: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateMockupRequest = await request.json();
    const { domain, colors, logos } = body;

    if (!domain || typeof domain !== "string" || domain.trim() === "") {
      return NextResponse.json(
        { error: "Valid domain is required" },
        { status: 400 }
      );
    }

    const normalizedDomain = domain.trim().toLowerCase();

    // Check for cached products first
    const existingProducts = await getProductsByDomain(normalizedDomain);
    if (existingProducts && existingProducts.length > 0) {
      const mockupUrls = existingProducts.map((p) => p.mockup_image_url);
      const pricingData = existingProducts.map((p) => ({
        sku: p.sku,
        basePrice: p.pricing.basePrice,
        finalPrice: p.pricing.finalPrice,
      }));

      // Calculate unique SKUs
      const uniqueSkus = new Set(existingProducts.map((p) => p.sku)).size;
      const totalVariants = existingProducts.reduce(
        (sum, p) => sum + p.variants.length,
        0
      );

      return NextResponse.json(
        {
          domain: normalizedDomain,
          sku_count: uniqueSkus,
          variants_count: totalVariants,
          mockup_urls: mockupUrls,
          pricing: pricingData,
          products_created: existingProducts.length,
          cached: true,
        } as MockupResponse,
        { status: 200 }
      );
    }

    // Generate new mockups
    const generationInput: MockupGenerationInput = {
      domain: normalizedDomain,
      colors: colors || [{ hex: "#1a3a5c", type: "primary" }],
      logos: logos || [{ url: "https://via.placeholder.com/100x100" }],
    };

    let mockups: GeneratedMockup[];
    try {
      mockups = await generateMockups(generationInput);
    } catch (err) {
      console.warn("Error generating mockups, attempting fallback:", err);
      mockups = await generateMockups(generationInput);
    }

    // Store products in Supabase and cache mockups
    const mockupUrls: string[] = [];
    const pricingData: Array<{
      sku: string;
      basePrice: number;
      finalPrice: number;
    }> = [];
    let productsStored = 0;

    for (let i = 0; i < mockups.length; i++) {
      const mockup = mockups[i];

      // Cache mockup locally
      const cachedUrl = await cacheMockupLocally(
        normalizedDomain,
        mockup.mockupImageUrl,
        i
      );
      const finalMockupUrl = cachedUrl || mockup.mockupImageUrl;
      mockupUrls.push(finalMockupUrl);

      // Store product in Supabase
      const stored = await storeProduct({
        domain: normalizedDomain,
        sku: mockup.sku,
        product_name: mockup.productName,
        mockup_image_url: finalMockupUrl,
        variants: mockup.variants,
        pricing: mockup.pricing,
      });

      if (stored) {
        productsStored++;
      }

      // Add pricing if not already added for this SKU
      if (
        !pricingData.some((p) => p.sku === mockup.sku && p.basePrice === mockup.pricing.basePrice)
      ) {
        pricingData.push({
          sku: mockup.sku,
          basePrice: mockup.pricing.basePrice,
          finalPrice: mockup.pricing.finalPrice,
        });
      }
    }

    // Calculate unique SKUs
    const uniqueSkus = new Set(mockups.map((m) => m.sku)).size;
    const totalVariants = mockups.reduce((sum, m) => sum + m.variants.length, 0);

    return NextResponse.json(
      {
        domain: normalizedDomain,
        sku_count: uniqueSkus,
        variants_count: totalVariants,
        mockup_urls: mockupUrls,
        pricing: pricingData,
        products_created: productsStored,
        cached: false,
      } as MockupResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Mockup generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate mockups" },
      { status: 500 }
    );
  }
}
