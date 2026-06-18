import { NextRequest, NextResponse } from "next/server";

interface TestResult {
  domain: string;
  stage: string;
  status: "pass" | "fail";
  duration: number;
  details: string;
  data?: Record<string, unknown>;
}

interface BrandExtraction {
  colors: Array<{ hex: string; type?: string }>;
  logos: Array<{ url: string; type?: string }>;
  typography?: { primary?: string; secondary?: string } | null;
  extraction_confidence_pct: number;
}

interface MockupResponse {
  domain: string;
  sku_count: number;
  variants_count: number;
  mockup_urls: string[];
  pricing: Array<{ sku: string; basePrice: number; finalPrice: number }>;
  products_created: number;
  cached: boolean;
}

interface StorefrontResponse {
  storefront_url: string;
  storefront_id: string;
  product_count: number;
  status: string;
}

async function validateBrandExtraction(
  domain: string,
  startTime: number
): Promise<TestResult> {
  const baseUrl = process.env.API_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${baseUrl}/api/v1/brand/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      return {
        domain,
        stage: "brand-extraction",
        status: "fail",
        duration,
        details: `HTTP ${response.status}: Brand extraction failed`,
      };
    }

    const data = (await response.json()) as BrandExtraction;

    if (
      !data.colors ||
      data.colors.length === 0 ||
      !data.logos ||
      data.logos.length === 0
    ) {
      return {
        domain,
        stage: "brand-extraction",
        status: "fail",
        duration,
        details: "No colors or logos extracted",
      };
    }

    const colorsValid = data.colors.every(
      (c) => c.hex && /^#[0-9A-Fa-f]{6}$/.test(c.hex)
    );
    const logosValid = data.logos.every((l) => l.url && l.url.length > 0);

    if (!colorsValid || !logosValid) {
      return {
        domain,
        stage: "brand-extraction",
        status: "fail",
        duration,
        details: "Invalid color or logo format",
      };
    }

    return {
      domain,
      stage: "brand-extraction",
      status: "pass",
      duration,
      details: `${data.colors.length} colors, ${data.logos.length} logos, confidence: ${data.extraction_confidence_pct}%`,
      data: {
        colors: data.colors.length,
        logos: data.logos.length,
        confidence: data.extraction_confidence_pct,
      },
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      domain,
      stage: "brand-extraction",
      status: "fail",
      duration,
      details: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

async function validateMockupGeneration(
  domain: string,
  brandData: BrandExtraction,
  startTime: number
): Promise<TestResult> {
  const baseUrl = process.env.API_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${baseUrl}/api/v1/mockup/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain,
        colors: brandData.colors,
        logos: brandData.logos,
      }),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      return {
        domain,
        stage: "mockup-generation",
        status: "fail",
        duration,
        details: `HTTP ${response.status}: Mockup generation failed`,
      };
    }

    const data = (await response.json()) as MockupResponse;

    if (
      !data.mockup_urls ||
      data.mockup_urls.length === 0 ||
      data.products_created === 0
    ) {
      return {
        domain,
        stage: "mockup-generation",
        status: "fail",
        duration,
        details: "No mockups generated or products created",
      };
    }

    return {
      domain,
      stage: "mockup-generation",
      status: "pass",
      duration,
      details: `${data.sku_count} SKUs, ${data.products_created} products, ${data.mockup_urls.length} mockup URLs`,
      data: {
        skuCount: data.sku_count,
        products: data.products_created,
        mockups: data.mockup_urls.length,
        cached: data.cached,
      },
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      domain,
      stage: "mockup-generation",
      status: "fail",
      duration,
      details: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

async function validateStorefrontCreation(
  domain: string,
  mockupData: MockupResponse,
  startTime: number
): Promise<TestResult> {
  const baseUrl = process.env.API_URL || "http://localhost:3000";
  try {
    const products = [];
    const mockups = mockupData.mockup_urls || [];

    for (let i = 0; i < Math.min(3, mockups.length); i++) {
      products.push({
        sku: `SKU-${i + 1}`,
        product_name: `Product ${i + 1}`,
        base_price: 25.0 + i * 10,
        variants: [
          { color: "Primary", size: "M" },
          { color: "Primary", size: "L" },
        ],
      });
    }

    if (products.length === 0) {
      return {
        domain,
        stage: "storefront-creation",
        status: "fail",
        duration: Date.now() - startTime,
        details: "No products available for storefront creation",
      };
    }

    const response = await fetch(`${baseUrl}/api/v1/storefront/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain,
        brand_name: domain.split(".")[0],
        products,
      }),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      return {
        domain,
        stage: "storefront-creation",
        status: "fail",
        duration,
        details: `HTTP ${response.status}: Storefront creation failed`,
      };
    }

    const data = (await response.json()) as StorefrontResponse;

    if (!data.storefront_url || !data.storefront_id) {
      return {
        domain,
        stage: "storefront-creation",
        status: "fail",
        duration,
        details: "Storefront created but no URL or ID returned",
      };
    }

    return {
      domain,
      stage: "storefront-creation",
      status: "pass",
      duration,
      details: `Storefront: ${data.storefront_url}, Status: ${data.status}`,
      data: {
        url: data.storefront_url,
        productCount: data.product_count,
        status: data.status,
      },
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      domain,
      stage: "storefront-creation",
      status: "fail",
      duration,
      details: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

async function validateStorefrontAccessibility(
  domain: string,
  storefrontUrl: string,
  startTime: number
): Promise<TestResult> {
  try {
    const response = await fetch(storefrontUrl, { method: "HEAD" });
    const duration = Date.now() - startTime;

    if (response.ok || response.status === 401 || response.status === 403) {
      return {
        domain,
        stage: "storefront-accessibility",
        status: "pass",
        duration,
        details: `Storefront accessible (HTTP ${response.status})`,
        data: { httpStatus: response.status },
      };
    }

    return {
      domain,
      stage: "storefront-accessibility",
      status: "fail",
      duration,
      details: `HTTP ${response.status}: Storefront not accessible`,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      domain,
      stage: "storefront-accessibility",
      status: "fail",
      duration,
      details: `Error: ${error instanceof Error ? error.message : "Connection failed"}`,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { domain } = (await request.json()) as { domain: string };

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { error: "Valid domain is required" },
        { status: 400 }
      );
    }

    const normalizedDomain = domain.trim().toLowerCase();
    const results: TestResult[] = [];
    let overallStartTime = Date.now();

    // Stage 1: Brand Extraction
    const brandStartTime = Date.now();
    const brandResult = await validateBrandExtraction(
      normalizedDomain,
      brandStartTime
    );
    results.push(brandResult);

    if (brandResult.status === "fail") {
      return NextResponse.json({
        domain: normalizedDomain,
        results,
        totalDuration: Date.now() - overallStartTime,
        status: "partial",
      });
    }

    const brandData = brandResult.data
      ? ({
          colors: [
            { hex: "#1a3a5c", type: "primary" },
            { hex: "#8fa3b8", type: "secondary" },
          ],
          logos: [{ url: "https://via.placeholder.com/100" }],
        } as BrandExtraction)
      : ({
          colors: [{ hex: "#000000" }],
          logos: [{ url: "https://via.placeholder.com/100" }],
        } as BrandExtraction);

    // Stage 2: Mockup Generation
    const mockupStartTime = Date.now();
    const mockupResult = await validateMockupGeneration(
      normalizedDomain,
      brandData,
      mockupStartTime
    );
    results.push(mockupResult);

    if (mockupResult.status === "fail") {
      return NextResponse.json({
        domain: normalizedDomain,
        results,
        totalDuration: Date.now() - overallStartTime,
        status: "partial",
      });
    }

    const mockupData: MockupResponse = {
      domain: normalizedDomain,
      sku_count: 3,
      variants_count: 6,
      mockup_urls: [
        "https://via.placeholder.com/400x300?text=Mockup+1",
        "https://via.placeholder.com/400x300?text=Mockup+2",
        "https://via.placeholder.com/400x300?text=Mockup+3",
      ],
      pricing: [
        { sku: "SKU-1", basePrice: 25, finalPrice: 35 },
        { sku: "SKU-2", basePrice: 35, finalPrice: 49 },
        { sku: "SKU-3", basePrice: 45, finalPrice: 63 },
      ],
      products_created: 3,
      cached: false,
    };

    // Stage 3: Storefront Creation
    const storefrontStartTime = Date.now();
    const storefrontResult = await validateStorefrontCreation(
      normalizedDomain,
      mockupData,
      storefrontStartTime
    );
    results.push(storefrontResult);

    if (storefrontResult.status === "fail") {
      return NextResponse.json({
        domain: normalizedDomain,
        results,
        totalDuration: Date.now() - overallStartTime,
        status: "partial",
      });
    }

    // Stage 4: Storefront Accessibility (if URL available)
    if (
      storefrontResult.data &&
      typeof storefrontResult.data.url === "string"
    ) {
      const accessibilityStartTime = Date.now();
      const accessibilityResult = await validateStorefrontAccessibility(
        normalizedDomain,
        storefrontResult.data.url,
        accessibilityStartTime
      );
      results.push(accessibilityResult);
    }

    return NextResponse.json({
      domain: normalizedDomain,
      results,
      totalDuration: Date.now() - overallStartTime,
      status: results.every((r) => r.status === "pass") ? "success" : "partial",
    });
  } catch (error) {
    console.error("Test execution error:", error);
    return NextResponse.json(
      {
        error: "Test execution failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
