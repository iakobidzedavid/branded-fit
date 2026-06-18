import { NextRequest, NextResponse } from "next/server";
import { orchestrationStore, OrchestrationState } from "@/lib/orchestration-state";
import { emitEvent } from "@/lib/analytics";

export const maxDuration = 300;
import {
  storeBrandExtraction,
  storeProduct,
  Product,
  BrandExtraction,
  ProductVariant,
  ProductPricing,
} from "@/lib/supabase";
import {
  createShopifyClient,
  validateShopifyToken,
  generateUniqueSubdomain,
  ProductInput,
} from "@/lib/shopify";
import { insertStoreMetadata } from "@/lib/stores";

// ─── Constants ────────────────────────────────────────────────────────────────

const CORPORATE_TLDS = new Set([
  "com", "io", "co", "org", "net", "dev", "app", "ai", "tech", "inc", "company", "so",
]);

const TOTAL_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 2;
const MARKUP_PERCENTAGE = 0.4;

// ─── Product templates (Printify-style) ───────────────────────────────────────

interface ProductTemplate {
  id: string;
  sku: string;
  name: string;
  description: string;
  basePriceCents: number;
  colors: string[];
  sizes: string[];
}

const PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    id: "heavyweight-tee",
    sku: "HWT-001",
    name: "Heavyweight T-Shirt",
    description: "Premium quality 100% cotton heavyweight t-shirt",
    basePriceCents: 1200,
    colors: ["Black", "White", "Navy", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "premium-hoodie",
    sku: "PHD-001",
    name: "Premium Hoodie",
    description: "Comfortable fleece-lined hoodie featuring your brand",
    basePriceCents: 1850,
    colors: ["Black", "Navy", "Charcoal", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "dad-cap",
    sku: "DAD-001",
    name: "Dad Cap",
    description: "Classic unstructured dad cap with curved visor",
    basePriceCents: 650,
    colors: ["Black", "White", "Navy", "Khaki"],
    sizes: ["One Size"],
  },
  {
    id: "tote-bag",
    sku: "TOT-001",
    name: "Tote Bag",
    description: "Durable canvas tote bag perfect for daily use",
    basePriceCents: 800,
    colors: ["Natural", "Black", "Navy", "Olive"],
    sizes: ["One Size"],
  },
  {
    id: "notebook",
    sku: "NTB-001",
    name: "Branded Notebook",
    description: "Premium hardcover notebook with custom branding",
    basePriceCents: 900,
    colors: ["Black", "Navy", "Burgundy", "Forest Green"],
    sizes: ["A5", "A4"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isCorporateTLD(domain: string): boolean {
  const parts = domain.toLowerCase().split(".");
  if (parts.length < 2) return false;
  return CORPORATE_TLDS.has(parts[parts.length - 1]);
}

function validateDomainFormat(domain: string): boolean {
  const re =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return re.test(domain);
}

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  label: string
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const delayMs = 1000 * Math.pow(2, attempt);
        console.warn(`[${label}] attempt ${attempt + 1} failed, retrying in ${delayMs}ms:`, err);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw lastError;
}

function generateMockupUrl(productId: string, primaryColor: string): string {
  const color = primaryColor.replace("#", "");
  const labels: Record<string, string> = {
    "heavyweight-tee": "T-Shirt",
    "premium-hoodie": "Hoodie",
    "dad-cap": "Cap",
    "tote-bag": "Tote",
    notebook: "Notebook",
  };
  const label = encodeURIComponent(labels[productId] || "Product");
  return `https://placehold.co/400x400/${color}/ffffff?text=${label}`;
}

// ─── Pipeline 1: Brand Intelligence (Brandfetch) ───────────────────────────────

// Brandfetch v2 API: logos have a `formats` array, each entry has a `src` URL.
interface BrandfetchLogoFormat {
  src: string;
  format: string;
  height?: number | null;
  width?: number | null;
  size?: number | null;
}

interface BrandfetchLogo {
  type?: string;
  theme?: string;
  formats?: BrandfetchLogoFormat[];
  // Legacy flat-shape fallback
  url?: string;
}

interface BrandfetchApiResponse {
  name?: string;
  colors?: { hex: string; type?: string }[];
  logos?: BrandfetchLogo[];
  fonts?: Array<{ name: string; type?: string; origin: string }>;
  // Some integrations wrap fields under `data`
  data?: {
    name?: string;
    colors?: { hex: string; type?: string }[];
    logos?: BrandfetchLogo[];
    fonts?: Array<{ name: string; type?: string; origin: string }>;
  };
}

function extractLogoUrl(logo: BrandfetchLogo): string | null {
  // Prefer SVG, then any other format from the `formats` array (Brandfetch v2)
  if (logo.formats && logo.formats.length > 0) {
    const svg = logo.formats.find((f) => f.format === "svg" && f.src);
    if (svg) return svg.src;
    const any = logo.formats.find((f) => f.src);
    if (any) return any.src;
  }
  // Legacy: flat `url` field
  if (logo.url) return logo.url;
  return null;
}

function parseBrandfetchResponse(raw: BrandfetchApiResponse, domain: string): BrandExtraction {
  // v2 API returns a flat object; some older integrations wrap under `data`
  const brand = raw.data ?? raw;

  const rawColors = brand.colors ?? [];
  const hasApiColors = rawColors.length > 0;
  const colors = hasApiColors
    ? rawColors.slice(0, 5).map((c) => ({ hex: c.hex, type: c.type ?? "brand" }))
    : generateDefaultColors(domain);

  const extractedLogos: { url: string; type: string }[] = [];
  if (brand.logos && brand.logos.length > 0) {
    for (const logo of brand.logos.slice(0, 3)) {
      const url = extractLogoUrl(logo);
      if (url) extractedLogos.push({ url, type: logo.type ?? "logo" });
    }
  }
  const hasApiLogos = extractedLogos.length > 0;
  const logos =
    hasApiLogos
      ? extractedLogos
      : [{ url: `https://api.dicebear.com/7.x/initials/svg?seed=${domain}`, type: "generated" }];

  const typography =
    brand.fonts && brand.fonts.length > 0
      ? {
          primary: brand.fonts[0].name,
          secondary: brand.fonts[1]?.name ?? brand.fonts[0].name,
        }
      : null;

  // Confidence: 50 base (API success) + 20 real colors + 20 real logos + 10 typography
  let confidence = 50;
  if (hasApiColors) confidence += 20;
  if (hasApiLogos) confidence += 20;
  if (typography) confidence += 10;

  return {
    domain,
    colors,
    logos,
    typography,
    extraction_confidence_pct: Math.min(confidence, 100),
  };
}

function generateDefaultColors(domain: string): { hex: string; type: string }[] {
  const palette = ["#6366f1", "#8b5cf6", "#d946ef", "#0ea5e9", "#14b8a6"];
  const hash = domain.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return [
    { hex: palette[hash % palette.length], type: "primary" },
    { hex: palette[(hash + 1) % palette.length], type: "secondary" },
  ];
}

async function runPipeline1(domain: string): Promise<BrandExtraction> {
  const apiKey = process.env.BRANDFETCH_API_KEY;

  let raw: BrandfetchApiResponse = {};
  let apiSuccess = false;

  if (apiKey) {
    try {
      const res = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        raw = await res.json();
        apiSuccess = true;
      } else {
        console.warn(`[Pipeline1] Brandfetch returned ${res.status} for ${domain}`);
      }
    } catch (err) {
      console.warn(`[Pipeline1] Brandfetch fetch failed for ${domain}:`, err);
    }
  } else {
    console.warn("[Pipeline1] BRANDFETCH_API_KEY not configured — using defaults");
  }

  const extraction = apiSuccess
    ? parseBrandfetchResponse(raw, domain)
    : {
        domain,
        colors: generateDefaultColors(domain),
        logos: [{ url: `https://api.dicebear.com/7.x/initials/svg?seed=${domain}`, type: "generated" }],
        typography: null,
        extraction_confidence_pct: 20,
      };

  // Cache in Supabase (best-effort — non-fatal if unavailable)
  await storeBrandExtraction(domain, extraction).catch((err) =>
    console.warn("[Pipeline1] Failed to cache brand extraction:", err)
  );

  return extraction;
}

// ─── Pipeline 2: Visual Mockup Engine (Printify-style) ───────────────────────

async function validatePrintifyKey(): Promise<boolean> {
  const apiKey = process.env.PRINTIFY_API_KEY;
  if (!apiKey) {
    console.warn("[Pipeline2] PRINTIFY_API_KEY not set — using placeholder mockups");
    return false;
  }
  try {
    const res = await fetch("https://api.printify.com/v1/shops.json", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.ok) {
      console.log("[Pipeline2] Printify API key validated successfully");
      return true;
    }
    console.warn(`[Pipeline2] Printify API key validation failed: ${res.status}`);
    return false;
  } catch (err) {
    console.warn("[Pipeline2] Printify API key validation error:", err);
    return false;
  }
}

async function runPipeline2(
  domain: string,
  brandExtraction: BrandExtraction
): Promise<Product[]> {
  await validatePrintifyKey();
  const primaryColor = brandExtraction.colors[0]?.hex ?? "#6366f1";
  const products: Product[] = [];

  for (const template of PRODUCT_TEMPLATES) {
    const basePrice = template.basePriceCents / 100;
    const markupAmount = basePrice * MARKUP_PERCENTAGE;
    const finalPrice = parseFloat((basePrice + markupAmount).toFixed(2));

    const variants: ProductVariant[] = [];
    const colorCount = Math.min(3, template.colors.length);
    const sizeCount = Math.min(Math.ceil(5 / colorCount), template.sizes.length);

    for (let ci = 0; ci < colorCount; ci++) {
      for (let si = 0; si < sizeCount && variants.length < 5; si++) {
        variants.push({ color: template.colors[ci], size: template.sizes[si] });
      }
    }

    const pricing: ProductPricing = {
      basePrice,
      markup: parseFloat(markupAmount.toFixed(2)),
      finalPrice,
    };

    const product: Product = {
      domain,
      sku: template.sku,
      product_name: template.name,
      mockup_image_url: generateMockupUrl(template.id, primaryColor),
      variants,
      pricing,
    };

    // Store in Supabase (best-effort)
    await storeProduct(product).catch((err) =>
      console.warn(`[Pipeline2] Failed to store product ${template.sku}:`, err)
    );

    products.push(product);
  }

  return products;
}

// ─── Pipeline 3: Infrastructure Provisioning (Shopify) ───────────────────────

async function runPipeline3(
  domain: string,
  products: Product[],
  brandExtraction: BrandExtraction
): Promise<{ storeUrl: string; productCount: number; isDemo?: boolean }> {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const shopName = process.env.SHOPIFY_SHOP_NAME;

  const brandName = domain.split(".")[0];
  const subdomain = generateUniqueSubdomain(brandName);

  if (!accessToken || !shopName) {
    // Demo mode: generate a realistic storefront URL without live Shopify credentials.
    // This allows end-to-end validation of Pipelines 1 and 2 while simulating Pipeline 3.
    const demoStoreUrl = `https://${subdomain}.myshopify.com`;

    await insertStoreMetadata({
      domain,
      shopify_store_id: `demo-${subdomain}`,
      shopify_store_url: demoStoreUrl,
      shopify_api_token: "",
      status: "demo",
    }).catch((err) => console.warn("[Pipeline3] Failed to save demo store metadata:", err));

    return { storeUrl: demoStoreUrl, productCount: products.length, isDemo: true };
  }

  // Live Shopify path ────────────────────────────────────────────────────────
  const tokenValid = await validateShopifyToken(accessToken, shopName);
  if (!tokenValid) {
    throw new Error("Invalid Shopify credentials — token validation failed");
  }

  const shopifyClient = createShopifyClient(accessToken, shopName);

  // Provision store (updates name/currency on existing store)
  const provisioned = await shopifyClient.provisionStore({
    name: brandName,
    currency: "USD",
    timezone: "America/New_York",
    subdomain,
  });

  // Upload products
  const uploadedIds: string[] = [];
  for (const product of products) {
    try {
      const shopifyVariants = product.variants.map((v, idx) => ({
        sku: `${product.sku}-${idx}`,
        price: product.pricing.finalPrice,
        options: { color: v.color, size: v.size },
      }));

      const input: ProductInput = {
        title: product.product_name,
        description: `${brandName} branded ${product.product_name.toLowerCase()}`,
        vendor: "Branded Fit",
        productType: "Branded Merchandise",
        images: [{ src: product.mockup_image_url, alt: product.product_name }],
        variants: shopifyVariants,
      };

      const created = await shopifyClient.createProduct(provisioned.accessToken, input);
      uploadedIds.push(created.id);
    } catch (err) {
      console.warn(`[Pipeline3] Failed to upload product ${product.sku}:`, err);
    }
  }

  if (uploadedIds.length === 0) {
    throw new Error("No products uploaded to Shopify store");
  }

  // Save store metadata (best-effort)
  await insertStoreMetadata({
    domain,
    shopify_store_id: provisioned.storeId,
    shopify_store_url: provisioned.storeUrl,
    shopify_api_token: "", // never persist the live token
    status: "created",
  }).catch((err) => console.warn("[Pipeline3] Failed to save store metadata:", err));

  return { storeUrl: provisioned.storeUrl, productCount: uploadedIds.length };
}

// ─── Main orchestration runner ────────────────────────────────────────────────

async function runOrchestration(domain: string): Promise<OrchestrationState> {
  const startTime = Date.now();
  const state: OrchestrationState = {
    status: "in_progress",
    pipeline1: { status: "in_progress", message: "Extracting brand assets from Brandfetch…" },
    pipeline2: { status: "pending", message: "Waiting for brand data…" },
    pipeline3: { status: "pending", message: "Waiting for mockups…" },
    startTime,
    timestamp: startTime,
  };
  orchestrationStore.set(domain, state);

  // Pipeline 1 ────────────────────────────────────────────────────────────────
  void emitEvent("brand_extraction_started", { domain });
  let brandExtraction: BrandExtraction;
  try {
    brandExtraction = await withRetry(() => runPipeline1(domain), MAX_RETRIES, "Pipeline1");
    state.pipeline1 = {
      status: "completed",
      message: `Extracted ${brandExtraction.colors.length} colors, ${brandExtraction.logos.length} logos (${brandExtraction.extraction_confidence_pct}% confidence)`,
    };
    state.brandData = {
      colors: brandExtraction.colors.slice(0, 5),
      logoUrl: brandExtraction.logos.find((l) => l.type !== "generated")?.url ?? brandExtraction.logos[0]?.url,
      fontFamily: brandExtraction.typography?.primary ?? undefined,
      confidence: brandExtraction.extraction_confidence_pct,
    };
    state.pipeline2 = { status: "in_progress", message: "Generating product mockups…" };
    orchestrationStore.set(domain, state);
    const hasRealLogos = brandExtraction.logos.length > 0 && brandExtraction.logos[0].type !== "generated";
    const hasRealColors = brandExtraction.colors.some(
      (c) => c.type !== "primary" && c.type !== "secondary"
    );
    void emitEvent("brand_extraction_completed", {
      domain,
      logo_accuracy: hasRealLogos ? 100 : 0,
      color_accuracy: hasRealColors ? 100 : 0,
      extraction_confidence_pct: brandExtraction.extraction_confidence_pct,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Brand extraction failed";
    state.status = "failed";
    state.pipeline1 = { status: "failed", message: msg };
    state.pipeline2 = { status: "failed", message: "Skipped — Pipeline 1 failed" };
    state.pipeline3 = { status: "failed", message: "Skipped — Pipeline 1 failed" };
    state.error = msg;
    orchestrationStore.set(domain, state);
    return state;
  }

  // Pipeline 2 ────────────────────────────────────────────────────────────────
  let products: Product[];
  try {
    products = await withRetry(() => runPipeline2(domain, brandExtraction), MAX_RETRIES, "Pipeline2");
    const variantCount = products.reduce((acc, p) => acc + p.variants.length, 0);
    state.pipeline2 = {
      status: "completed",
      message: `Generated ${products.length} products with ${variantCount} variants`,
    };
    state.pipeline3 = { status: "in_progress", message: "Provisioning Shopify storefront…" };
    orchestrationStore.set(domain, state);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Mockup generation failed";
    state.status = "failed";
    state.pipeline2 = { status: "failed", message: msg };
    state.pipeline3 = { status: "failed", message: "Skipped — Pipeline 2 failed" };
    state.error = msg;
    orchestrationStore.set(domain, state);
    return state;
  }

  // Pipeline 3 ────────────────────────────────────────────────────────────────
  void emitEvent("storefront_generation_started", { domain });
  const p3StartTime = Date.now();
  try {
    const storefront = await withRetry(
      () => runPipeline3(domain, products, brandExtraction),
      MAX_RETRIES,
      "Pipeline3"
    );
    const generationTimeMs = Date.now() - p3StartTime;
    state.pipeline3 = {
      status: "completed",
      message: storefront.isDemo
        ? `Storefront provisioned (demo) — ${storefront.productCount} products catalogued`
        : `Store live — ${storefront.productCount} products uploaded`,
    };
    state.status = "completed";
    state.storefront = { url: storefront.storeUrl, productCount: storefront.productCount };
    orchestrationStore.set(domain, state);
    void emitEvent("storefront_generation_completed", {
      domain,
      storefront_url: storefront.storeUrl,
      product_count: storefront.productCount,
      generation_time_ms: generationTimeMs,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Shopify provisioning failed";
    state.status = "failed";
    state.pipeline3 = { status: "failed", message: msg };
    state.error = msg;
    orchestrationStore.set(domain, state);
  }

  return state;
}

// ─── Route handlers ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ message: "Domain is required" }, { status: 400 });
  }
  const cleanDomain = domain.toLowerCase().trim();
  const state = orchestrationStore.get(cleanDomain);
  if (!state) {
    return NextResponse.json({
      status: "pending",
      orchestration: {
        status: "pending",
        pipeline1: { status: "pending", message: "Not started" },
        pipeline2: { status: "pending", message: "Not started" },
        pipeline3: { status: "pending", message: "Not started" },
        timestamp: Date.now(),
      },
    });
  }
  return NextResponse.json({ status: state.status, orchestration: state });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain } = body ?? {};

    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ message: "Domain is required" }, { status: 400 });
    }

    const cleanDomain = domain.toLowerCase().trim();

    if (!validateDomainFormat(cleanDomain)) {
      return NextResponse.json({ message: "Invalid domain format" }, { status: 400 });
    }

    if (!isCorporateTLD(cleanDomain)) {
      return NextResponse.json(
        { message: "Only corporate domains (.com, .io, .co, .org, etc.) are supported" },
        { status: 400 }
      );
    }

    void emitEvent("domain_submitted", { domain: cleanDomain });

    // Reject concurrent runs for the same domain
    const existingState = orchestrationStore.get(cleanDomain);
    if (existingState && existingState.status === "in_progress") {
      return NextResponse.json(
        {
          success: false,
          message: "Orchestration already in progress for this domain",
          orchestration: existingState,
        },
        { status: 409 }
      );
    }

    // Run all three pipelines with a 5-minute hard timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Orchestration timed out after 5 minutes")),
        TOTAL_TIMEOUT_MS
      )
    );

    let finalState: OrchestrationState;
    try {
      finalState = await Promise.race([runOrchestration(cleanDomain), timeoutPromise]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Orchestration timed out";
      const timeoutState: OrchestrationState = {
        status: "failed",
        pipeline1: { status: "failed", message: "Timed out" },
        pipeline2: { status: "failed", message: "Timed out" },
        pipeline3: { status: "failed", message: "Timed out" },
        error: msg,
        timestamp: Date.now(),
      };
      orchestrationStore.set(cleanDomain, timeoutState);
      return NextResponse.json(
        { success: false, message: msg, orchestration: timeoutState },
        { status: 504 }
      );
    }

    const success = finalState.status === "completed";
    return NextResponse.json(
      { success, message: finalState.error, orchestration: finalState },
      { status: success ? 200 : 500 }
    );
  } catch (error) {
    console.error("[Orchestrate] Unexpected error:", error);
    return NextResponse.json({ message: "Orchestration failed unexpectedly" }, { status: 500 });
  }
}
