import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// Session IDs written by this seed — listed here so the endpoint is idempotent.
// v2 IDs included so old seed rows with legacy event names are cleaned up.
const SEED_SESSION_IDS = [
  "sess-v3-01",
  "sess-v3-02",
  "sess-v3-03",
  "sess-v3-04",
  "sess-v3-store",
  // Legacy v2 cleanup
  "sess-v2-01",
  "sess-v2-02",
  "sess-v2-03",
  "sess-v2-04",
  "sess-v2-05",
];

type SeedEvent = {
  event_name: string;
  event_type: string;
  domain: string;
  session_id: string;
  created_at: string;
  pipeline_stage?: string;
  metadata: Record<string, unknown>;
};

// Event names match what Command Console (/command-console) and
// Storefront Preview (/store/:storeId) actually emit at runtime.
function buildSeedEvents(now: Date): SeedEvent[] {
  const t = (hoursBack: number, extraSeconds = 0): string =>
    new Date(now.getTime() - hoursBack * 3_600_000 + extraSeconds * 1_000).toISOString();

  return [
    // ── ramp.com — full pipeline (~72h ago) ─────────────────────────────────
    { event_name: "domain_submission",            event_type: "domain_submission",            domain: "ramp.com",   session_id: "sess-v3-01", pipeline_stage: "intake",                created_at: t(72),        metadata: { source: "landing_page", ab_variant: "A" } },
    { event_name: "brand_extraction_start",       event_type: "brand_extraction_start",       domain: "ramp.com",   session_id: "sess-v3-01", pipeline_stage: "brand_extraction",      created_at: t(72, 18),    metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_complete",    event_type: "brand_extraction_complete",    domain: "ramp.com",   session_id: "sess-v3-01", pipeline_stage: "brand_extraction",      created_at: t(72, 72),    metadata: { fidelity_score: 92.4, colors_found: 3, logo_found: true, duration_ms: 54000 } },
    { event_name: "mockup_generation_start",      event_type: "mockup_generation_start",      domain: "ramp.com",   session_id: "sess-v3-01", pipeline_stage: "mockup_generation",     created_at: t(72, 74),    metadata: { trigger: "auto" } },
    { event_name: "mockup_generation_complete",   event_type: "mockup_generation_complete",   domain: "ramp.com",   session_id: "sess-v3-01", pipeline_stage: "mockup_generation",     created_at: t(72, 138),   metadata: { product_count: 6, duration_ms: 64000 } },
    { event_name: "storefront_generation_start",  event_type: "storefront_generation_start",  domain: "ramp.com",   session_id: "sess-v3-01", pipeline_stage: "storefront_generation", created_at: t(72, 140),   metadata: { trigger: "auto" } },
    { event_name: "storefront_generation_complete", event_type: "storefront_generation_complete", domain: "ramp.com", session_id: "sess-v3-01", pipeline_stage: "storefront_generation", created_at: t(72, 194),  metadata: { storefront_url: "https://ramp-merch.myshopify.com", product_count: 6, duration_ms: 54000 } },

    // ── notion.so — full pipeline (~48h ago) ─────────────────────────────────
    { event_name: "domain_submission",            event_type: "domain_submission",            domain: "notion.so",  session_id: "sess-v3-02", pipeline_stage: "intake",                created_at: t(48),        metadata: { source: "referral", ab_variant: "B" } },
    { event_name: "brand_extraction_start",       event_type: "brand_extraction_start",       domain: "notion.so",  session_id: "sess-v3-02", pipeline_stage: "brand_extraction",      created_at: t(48, 22),    metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_complete",    event_type: "brand_extraction_complete",    domain: "notion.so",  session_id: "sess-v3-02", pipeline_stage: "brand_extraction",      created_at: t(48, 88),    metadata: { fidelity_score: 95.1, colors_found: 5, logo_found: true, duration_ms: 66000 } },
    { event_name: "mockup_generation_start",      event_type: "mockup_generation_start",      domain: "notion.so",  session_id: "sess-v3-02", pipeline_stage: "mockup_generation",     created_at: t(48, 90),    metadata: { trigger: "auto" } },
    { event_name: "mockup_generation_complete",   event_type: "mockup_generation_complete",   domain: "notion.so",  session_id: "sess-v3-02", pipeline_stage: "mockup_generation",     created_at: t(48, 158),   metadata: { product_count: 8, duration_ms: 68000 } },
    { event_name: "storefront_generation_start",  event_type: "storefront_generation_start",  domain: "notion.so",  session_id: "sess-v3-02", pipeline_stage: "storefront_generation", created_at: t(48, 160),   metadata: { trigger: "auto" } },
    { event_name: "storefront_generation_complete", event_type: "storefront_generation_complete", domain: "notion.so", session_id: "sess-v3-02", pipeline_stage: "storefront_generation", created_at: t(48, 211),  metadata: { storefront_url: "https://notion-merch.myshopify.com", product_count: 8, duration_ms: 51000 } },

    // ── stripe.com — full pipeline (~24h ago) ─────────────────────────────────
    { event_name: "domain_submission",            event_type: "domain_submission",            domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "intake",                created_at: t(24),        metadata: { source: "direct", ab_variant: "A" } },
    { event_name: "brand_extraction_start",       event_type: "brand_extraction_start",       domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "brand_extraction",      created_at: t(24, 15),    metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_complete",    event_type: "brand_extraction_complete",    domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "brand_extraction",      created_at: t(24, 65),    metadata: { fidelity_score: 97.3, colors_found: 4, logo_found: true, duration_ms: 50000 } },
    { event_name: "mockup_generation_start",      event_type: "mockup_generation_start",      domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "mockup_generation",     created_at: t(24, 67),    metadata: { trigger: "auto" } },
    { event_name: "mockup_generation_complete",   event_type: "mockup_generation_complete",   domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "mockup_generation",     created_at: t(24, 127),   metadata: { product_count: 7, duration_ms: 60000 } },
    { event_name: "storefront_generation_start",  event_type: "storefront_generation_start",  domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "storefront_generation", created_at: t(24, 129),   metadata: { trigger: "auto" } },
    { event_name: "storefront_generation_complete", event_type: "storefront_generation_complete", domain: "stripe.com", session_id: "sess-v3-03", pipeline_stage: "storefront_generation", created_at: t(24, 183), metadata: { storefront_url: "https://stripe-merch.myshopify.com", product_count: 7, duration_ms: 54000 } },

    // ── figma.com — partial: dropped after mockup generation (~8h ago) ────────
    { event_name: "domain_submission",            event_type: "domain_submission",            domain: "figma.com",  session_id: "sess-v3-04", pipeline_stage: "intake",                created_at: t(8),         metadata: { source: "email_campaign", ab_variant: "C" } },
    { event_name: "brand_extraction_start",       event_type: "brand_extraction_start",       domain: "figma.com",  session_id: "sess-v3-04", pipeline_stage: "brand_extraction",      created_at: t(8, 26),     metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_complete",    event_type: "brand_extraction_complete",    domain: "figma.com",  session_id: "sess-v3-04", pipeline_stage: "brand_extraction",      created_at: t(8, 94),     metadata: { fidelity_score: 81.6, colors_found: 2, logo_found: true, duration_ms: 68000 } },
    { event_name: "mockup_generation_start",      event_type: "mockup_generation_start",      domain: "figma.com",  session_id: "sess-v3-04", pipeline_stage: "mockup_generation",     created_at: t(8, 96),     metadata: { trigger: "auto" } },

    // ── ramp.com storefront visits — product_view + cart_add (~2h ago) ────────
    { event_name: "storefront_view",  event_type: "storefront_view",  domain: "ramp.com",   session_id: "sess-v3-store", pipeline_stage: undefined, created_at: t(2),       metadata: { store_id: "ramp-001", status: "draft" } },
    { event_name: "product_view",     event_type: "product_view",     domain: "ramp.com",   session_id: "sess-v3-store", pipeline_stage: undefined, created_at: t(2, 45),   metadata: { sku: "BF-TEE-001", product_name: "Premium Tee", price: 32.99 } },
    { event_name: "product_view",     event_type: "product_view",     domain: "ramp.com",   session_id: "sess-v3-store", pipeline_stage: undefined, created_at: t(2, 82),   metadata: { sku: "BF-CAP-002", product_name: "Embroidered Cap", price: 28.99 } },
    { event_name: "cart_add",         event_type: "cart_add",         domain: "ramp.com",   session_id: "sess-v3-store", pipeline_stage: undefined, created_at: t(2, 95),   metadata: { sku: "BF-TEE-001", product_name: "Premium Tee", price: 32.99 } },
    { event_name: "product_view",     event_type: "product_view",     domain: "ramp.com",   session_id: "sess-v3-store", pipeline_stage: undefined, created_at: t(2, 130),  metadata: { sku: "BF-HOD-003", product_name: "Zip Hoodie", price: 64.99 } },
    { event_name: "cart_add",         event_type: "cart_add",         domain: "ramp.com",   session_id: "sess-v3-store", pipeline_stage: undefined, created_at: t(2, 148),  metadata: { sku: "BF-HOD-003", product_name: "Zip Hoodie", price: 64.99 } },
  ];
}

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword && token !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = getSupabase();

  // Remove any prior seed rows so the endpoint is idempotent.
  const { error: deleteError } = await client
    .from("analytics_events")
    .delete()
    .in("session_id", SEED_SESSION_IDS);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to clear existing seed data", detail: deleteError.message },
      { status: 500 }
    );
  }

  const now = new Date();
  const events = buildSeedEvents(now);

  const { data, error: insertError } = await client
    .from("analytics_events")
    .insert(events)
    .select("id, event_name, domain, session_id, created_at");

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to insert seed events", detail: insertError.message },
      { status: 500 }
    );
  }

  const counts: Record<string, number> = {};
  (data ?? []).forEach((row) => {
    counts[row.event_name] = (counts[row.event_name] ?? 0) + 1;
  });

  return NextResponse.json(
    {
      success: true,
      total: data?.length ?? 0,
      counts,
      domains: ["ramp.com", "notion.so", "stripe.com", "figma.com"],
      spanHours: 72,
      seededAt: now.toISOString(),
    },
    { status: 201 }
  );
}

export async function GET() {
  const client = getSupabase();

  const { data, error } = await client
    .from("analytics_events")
    .select("event_name, domain, session_id, created_at")
    .in("session_id", SEED_SESSION_IDS)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const counts: Record<string, number> = {};
  (data ?? []).forEach((row) => {
    counts[row.event_name] = (counts[row.event_name] ?? 0) + 1;
  });

  return NextResponse.json({
    total: data?.length ?? 0,
    counts,
    expected: {
      domain_submission: 4,
      brand_extraction_start: 4,
      brand_extraction_complete: 4,
      mockup_generation_start: 4,
      mockup_generation_complete: 3,
      storefront_generation_start: 3,
      storefront_generation_complete: 3,
      storefront_view: 1,
      product_view: 3,
      cart_add: 2,
    },
    events: data,
  });
}
