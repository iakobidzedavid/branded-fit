import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// Session IDs written by this seed so the endpoint is safely idempotent.
const SEED_SESSION_IDS = [
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
  fidelity_score?: number;
  product_count?: number;
  storefront_url?: string;
  metadata: Record<string, unknown>;
};

function buildSeedEvents(now: Date): SeedEvent[] {
  const t = (hoursBack: number, extraSeconds = 0): string =>
    new Date(now.getTime() - hoursBack * 3_600_000 + extraSeconds * 1_000).toISOString();

  return [
    // ── acme.com — full pipeline + email_opened + demo_viewed + pilot_cta_clicked (~160h ago) ──
    { event_name: "domain_submitted",           event_type: "domain_submitted",           domain: "acme.com",     session_id: "sess-v2-01", created_at: t(160),        metadata: { source: "landing_page", ab_variant: "A" } },
    { event_name: "brand_extraction_started",   event_type: "brand_extraction_started",   domain: "acme.com",     session_id: "sess-v2-01", created_at: t(160, 28),    metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "acme.com",     session_id: "sess-v2-01", created_at: t(160, 90),    fidelity_score: 91.5, metadata: { fidelity_score: 91.5, colors_found: 3, logo_found: true } },
    { event_name: "storefront_generated",       event_type: "storefront_generated",       domain: "acme.com",     session_id: "sess-v2-01", created_at: t(160, 240),   product_count: 6, metadata: { product_count: 6, template: "minimal" } },
    { event_name: "storefront_published",       event_type: "storefront_published",       domain: "acme.com",     session_id: "sess-v2-01", created_at: t(160, 420),   storefront_url: "https://acme-merch.myshopify.com", metadata: { storefront_url: "https://acme-merch.myshopify.com" } },
    { event_name: "email_opened",               event_type: "email_opened",               domain: "acme.com",     session_id: "sess-v2-01", created_at: t(155),        metadata: { campaign: "welcome_series", email_id: "welcome-001" } },
    { event_name: "demo_viewed",                event_type: "demo_viewed",                domain: "acme.com",     session_id: "sess-v2-01", created_at: t(150),        metadata: { demo_variant: "B", duration_seconds: 142 } },
    { event_name: "pilot_cta_clicked",          event_type: "pilot_cta_clicked",          domain: "acme.com",     session_id: "sess-v2-01", created_at: t(145),        metadata: { cta_location: "demo_page", plan: "starter" } },

    // ── techcorp.io — full pipeline + demo_viewed + pilot_cta_clicked (~120h ago) ──
    { event_name: "domain_submitted",           event_type: "domain_submitted",           domain: "techcorp.io",  session_id: "sess-v2-02", created_at: t(120),        metadata: { source: "referral", ab_variant: "B" } },
    { event_name: "brand_extraction_started",   event_type: "brand_extraction_started",   domain: "techcorp.io",  session_id: "sess-v2-02", created_at: t(120, 25),    metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "techcorp.io",  session_id: "sess-v2-02", created_at: t(120, 80),    fidelity_score: 94.1, metadata: { fidelity_score: 94.1, colors_found: 5, logo_found: true } },
    { event_name: "storefront_generated",       event_type: "storefront_generated",       domain: "techcorp.io",  session_id: "sess-v2-02", created_at: t(120, 180),   product_count: 8, metadata: { product_count: 8, template: "minimal" } },
    { event_name: "storefront_published",       event_type: "storefront_published",       domain: "techcorp.io",  session_id: "sess-v2-02", created_at: t(120, 360),   storefront_url: "https://techcorp-merch.myshopify.com", metadata: { storefront_url: "https://techcorp-merch.myshopify.com" } },
    { event_name: "demo_viewed",                event_type: "demo_viewed",                domain: "techcorp.io",  session_id: "sess-v2-02", created_at: t(115),        metadata: { demo_variant: "A", duration_seconds: 98 } },
    { event_name: "pilot_cta_clicked",          event_type: "pilot_cta_clicked",          domain: "techcorp.io",  session_id: "sess-v2-02", created_at: t(110),        metadata: { cta_location: "pricing_section", plan: "growth" } },

    // ── buildfast.co — through storefront_generated + demo_viewed (~80h ago) ──
    { event_name: "domain_submitted",           event_type: "domain_submitted",           domain: "buildfast.co", session_id: "sess-v2-03", created_at: t(80),         metadata: { source: "email_campaign", ab_variant: "C" } },
    { event_name: "brand_extraction_started",   event_type: "brand_extraction_started",   domain: "buildfast.co", session_id: "sess-v2-03", created_at: t(80, 22),     metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "buildfast.co", session_id: "sess-v2-03", created_at: t(80, 75),     fidelity_score: 88.7, metadata: { fidelity_score: 88.7, colors_found: 4, logo_found: true } },
    { event_name: "storefront_generated",       event_type: "storefront_generated",       domain: "buildfast.co", session_id: "sess-v2-03", created_at: t(80, 210),    product_count: 5, metadata: { product_count: 5, template: "bold" } },
    { event_name: "demo_viewed",                event_type: "demo_viewed",                domain: "buildfast.co", session_id: "sess-v2-03", created_at: t(75),         metadata: { demo_variant: "B", duration_seconds: 67 } },

    // ── startupco.io — through brand_extraction_completed (~50h ago) ──
    { event_name: "domain_submitted",           event_type: "domain_submitted",           domain: "startupco.io", session_id: "sess-v2-04", created_at: t(50),         metadata: { source: "direct", ab_variant: "A" } },
    { event_name: "brand_extraction_started",   event_type: "brand_extraction_started",   domain: "startupco.io", session_id: "sess-v2-04", created_at: t(50, 30),     metadata: { trigger: "auto" } },
    { event_name: "brand_extraction_completed", event_type: "brand_extraction_completed", domain: "startupco.io", session_id: "sess-v2-04", created_at: t(50, 85),     fidelity_score: 78.3, metadata: { fidelity_score: 78.3, colors_found: 2, logo_found: false } },

    // ── launchpad.co — extraction failed (~20h ago) ──
    { event_name: "domain_submitted",         event_type: "domain_submitted",         domain: "launchpad.co", session_id: "sess-v2-05", created_at: t(20),         metadata: { source: "landing_page", ab_variant: "B" } },
    { event_name: "brand_extraction_started", event_type: "brand_extraction_started", domain: "launchpad.co", session_id: "sess-v2-05", created_at: t(20, 31),     metadata: { trigger: "auto", error: "brandfetch_timeout" } },
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
      domains: ["acme.com", "techcorp.io", "buildfast.co", "startupco.io", "launchpad.co"],
      spanHours: 168,
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
      domain_submitted: 5,
      brand_extraction_started: 5,
      brand_extraction_completed: 4,
      storefront_generated: 3,
      storefront_published: 2,
      demo_viewed: 3,
      pilot_cta_clicked: 2,
      email_opened: 1,
    },
    events: data,
  });
}
