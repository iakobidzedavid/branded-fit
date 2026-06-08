import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const SEED_SESSION_IDS = [
  "sess-acme-01",
  "sess-acme-02",
  "sess-acme-03",
  "sess-acme-04",
  "sess-tech-01",
  "sess-tech-02",
  "sess-tech-03",
  "sess-build-01",
  "sess-build-02",
  "sess-build-03",
];

type SeedEvent = {
  event_name: string;
  event_type: string;
  domain: string;
  session_id: string;
  created_at: string;
  fidelity_score?: number;
  product_count?: number;
  storefront_url?: string;
  metadata: Record<string, unknown>;
};

function buildSeedEvents(now: Date): SeedEvent[] {
  const t = (hoursBack: number, extraSeconds = 0): string =>
    new Date(now.getTime() - hoursBack * 3_600_000 + extraSeconds * 1_000).toISOString();

  return [
    // ── acme.com ────────────────────────────────────────────────────────────
    // sess-acme-01: Type A — full pipeline, 60h ago
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "acme.com", session_id: "sess-acme-01", created_at: t(60), metadata: { source: "landing_page", ab_variant: "A" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "acme.com", session_id: "sess-acme-01", created_at: t(60, 30), metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "acme.com", session_id: "sess-acme-01", created_at: t(60, 90), fidelity_score: 91.5, metadata: { fidelity_score: 91.5, colors_found: 3, logo_found: true } },
    { event_name: "storefront_generated", event_type: "storefront_generated", domain: "acme.com", session_id: "sess-acme-01", created_at: t(60, 240), product_count: 6, metadata: { product_count: 6, template: "minimal" } },
    { event_name: "storefront_published", event_type: "storefront_published", domain: "acme.com", session_id: "sess-acme-01", created_at: t(60, 420), storefront_url: "https://acme-merch.myshopify.com", metadata: { storefront_url: "https://acme-merch.myshopify.com" } },
    // sess-acme-02: Type B — through storefront_generated, 36h ago
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "acme.com", session_id: "sess-acme-02", created_at: t(36), metadata: { source: "email_campaign", ab_variant: "B" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "acme.com", session_id: "sess-acme-02", created_at: t(36, 28), metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "acme.com", session_id: "sess-acme-02", created_at: t(36, 95), fidelity_score: 87.2, metadata: { fidelity_score: 87.2, colors_found: 4, logo_found: true } },
    { event_name: "storefront_generated", event_type: "storefront_generated", domain: "acme.com", session_id: "sess-acme-02", created_at: t(36, 300), product_count: 4, metadata: { product_count: 4, template: "bold" } },
    // sess-acme-03: Type C — through brand_extraction_completed, 24h ago
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "acme.com", session_id: "sess-acme-03", created_at: t(24), metadata: { source: "direct", ab_variant: "C" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "acme.com", session_id: "sess-acme-03", created_at: t(24, 32), metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "acme.com", session_id: "sess-acme-03", created_at: t(24, 85), fidelity_score: 79.8, metadata: { fidelity_score: 79.8, colors_found: 2, logo_found: false } },
    // sess-acme-04: Type D — extraction failed, 12h ago
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "acme.com", session_id: "sess-acme-04", created_at: t(12), metadata: { source: "landing_page", ab_variant: "A" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "acme.com", session_id: "sess-acme-04", created_at: t(12, 31), metadata: { trigger: "auto", error: "brandfetch_timeout" } },

    // ── techcorp.io ──────────────────────────────────────────────────────────
    // sess-tech-01: Type A — full pipeline, 48h ago
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "techcorp.io", session_id: "sess-tech-01", created_at: t(48), metadata: { source: "referral", ab_variant: "B" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "techcorp.io", session_id: "sess-tech-01", created_at: t(48, 25), metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "techcorp.io", session_id: "sess-tech-01", created_at: t(48, 80), fidelity_score: 94.1, metadata: { fidelity_score: 94.1, colors_found: 5, logo_found: true } },
    { event_name: "storefront_generated", event_type: "storefront_generated", domain: "techcorp.io", session_id: "sess-tech-01", created_at: t(48, 180), product_count: 8, metadata: { product_count: 8, template: "minimal" } },
    { event_name: "storefront_published", event_type: "storefront_published", domain: "techcorp.io", session_id: "sess-tech-01", created_at: t(48, 360), storefront_url: "https://techcorp-merch.myshopify.com", metadata: { storefront_url: "https://techcorp-merch.myshopify.com" } },
    // sess-tech-02: Type C — through brand_extraction_completed, 22h ago
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "techcorp.io", session_id: "sess-tech-02", created_at: t(22), metadata: { source: "direct", ab_variant: "C" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "techcorp.io", session_id: "sess-tech-02", created_at: t(22, 33), metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "techcorp.io", session_id: "sess-tech-02", created_at: t(22, 100), fidelity_score: 83.6, metadata: { fidelity_score: 83.6, colors_found: 3, logo_found: true } },
    // sess-tech-03: Type B — through storefront_generated, 7h ago
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "techcorp.io", session_id: "sess-tech-03", created_at: t(7), metadata: { source: "email_campaign", ab_variant: "A" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "techcorp.io", session_id: "sess-tech-03", created_at: t(7, 27), metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "techcorp.io", session_id: "sess-tech-03", created_at: t(7, 88), fidelity_score: 88.9, metadata: { fidelity_score: 88.9, colors_found: 4, logo_found: true } },
    { event_name: "storefront_generated", event_type: "storefront_generated", domain: "techcorp.io", session_id: "sess-tech-03", created_at: t(7, 240), product_count: 5, metadata: { product_count: 5, template: "bold" } },

    // ── buildfast.co ─────────────────────────────────────────────────────────
    // sess-build-01: Type A — full pipeline, 52h ago
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "buildfast.co", session_id: "sess-build-01", created_at: t(52), metadata: { source: "landing_page", ab_variant: "B" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "buildfast.co", session_id: "sess-build-01", created_at: t(52, 22), metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "buildfast.co", session_id: "sess-build-01", created_at: t(52, 75), fidelity_score: 96.3, metadata: { fidelity_score: 96.3, colors_found: 6, logo_found: true } },
    { event_name: "storefront_generated", event_type: "storefront_generated", domain: "buildfast.co", session_id: "sess-build-01", created_at: t(52, 210), product_count: 7, metadata: { product_count: 7, template: "minimal" } },
    { event_name: "storefront_published", event_type: "storefront_published", domain: "buildfast.co", session_id: "sess-build-01", created_at: t(52, 390), storefront_url: "https://buildfast-merch.myshopify.com", metadata: { storefront_url: "https://buildfast-merch.myshopify.com" } },
    // sess-build-02: Type C — through brand_extraction_completed, 28h ago
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "buildfast.co", session_id: "sess-build-02", created_at: t(28), metadata: { source: "referral", ab_variant: "C" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "buildfast.co", session_id: "sess-build-02", created_at: t(28, 35), metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "buildfast.co", session_id: "sess-build-02", created_at: t(28, 92), fidelity_score: 75.4, metadata: { fidelity_score: 75.4, colors_found: 2, logo_found: false } },
    // sess-build-03: Type D — extraction failed, 4h ago
    { event_name: "domain_submitted", event_type: "domain_submitted", domain: "buildfast.co", session_id: "sess-build-03", created_at: t(4), metadata: { source: "direct", ab_variant: "A" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "buildfast.co", session_id: "sess-build-03", created_at: t(4, 30), metadata: { trigger: "auto", error: "invalid_domain" } },
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

  // Remove any prior seed rows so the endpoint is idempotent
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

  // Build per-event-type counts for verification
  const counts: Record<string, number> = {};
  (data ?? []).forEach((row) => {
    counts[row.event_name] = (counts[row.event_name] ?? 0) + 1;
  });

  return NextResponse.json(
    {
      success: true,
      total: data?.length ?? 0,
      counts,
      stores: ["acme.com", "techcorp.io", "buildfast.co"],
      spanHours: 60,
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
      domain_submitted: 10,
      brand_extraction_started: 10,
      brand_extraction_completed: 8,
      storefront_generated: 5,
      storefront_published: 3,
    },
    events: data,
  });
}
