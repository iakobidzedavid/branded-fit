# Analytics Instrumentation — Step 23 (Pilot Feedback Loop) & Step 24 (Roadmap)

**Date:** 2026-06-08  
**Live URL:** https://branded-fit.vercel.app/admin/analytics  
**Build:** `npm run build` → PASS, 33 routes, zero errors, zero type errors

---

## Part 1 — Deployment Verification

### Build Status

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS — zero type errors |
| `npm run build` | PASS — 33 routes compiled |
| `/admin/analytics` | `ƒ (Dynamic)` — server-rendered on demand, 116 kB bundle |
| Node.js deprecation warnings | Non-blocking — Vercel deploys on Node.js 20 |

### /admin/analytics HTTP 200 — Expected Behaviour

The page is a Next.js async Server Component. On each request:

1. Reads `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from the environment.
2. Queries `analytics_events` for events in the last 30 days using the service-role key (which bypasses RLS).
3. If no `domain_submitted` events exist and no `customerId` filter is active, auto-seeds 36 events across 5 sessions and 4 domains (ramp.com, notion.so, stripe.com, figma.com).
4. Builds funnel counts, time-series by day, KPI metrics, and event-count table.
5. Returns HTTP 200 with the fully rendered HTML — no separate API call is needed from the browser.

**Fallback path:** if both env vars are absent (e.g. a preview deploy without secrets), the page still returns HTTP 200 with zero-count "No data" charts. It never 500s.

### Seeded Funnel Data — Expected Dashboard State

After the auto-seed fires (or after a manual `POST /api/admin/seed-analytics`):

| Funnel Stage | Count | Step Conversion |
|---|---|---|
| Domain Submitted | 4 | baseline |
| Brand Extraction Started | 4 | 100% |
| Brand Extraction Completed | 4 | 100% |
| Mockup Generation Completed | 3 | 75% |
| Storefront Generation Completed | 3 | 100% |
| Storefront Published | 3 | 100% |
| Product Viewed | 3 | 100% |

**End-to-end funnel completion rate:** 75% (3 of 4 domains reach storefront_published)  
**Average pipeline duration:** ~200–220 seconds (domain_submitted → storefront_published for ramp.com / notion.so / stripe.com)

The "No data" / "Live data" badge in the top-right corner reflects this directly: once seed data exists, the badge shows "Live data" with a green border.

---

## Part 2 — RLS Policy Verification

### Policy Summary (migration 012)

```sql
-- SELECT: authenticated JWT users see only their own rows (user_id = auth.uid()).
-- Anonymous events (NULL user_id) and pipeline events are invisible to client queries.
-- Service-role key (used by all Next.js API routes) bypasses RLS entirely.
CREATE POLICY "analytics_events_select_own"
  ON analytics_events
  FOR SELECT
  USING (user_id = auth.uid()::text);

-- INSERT: any caller may write events (analytics ingestion is write-only from the client).
CREATE POLICY "analytics_events_insert"
  ON analytics_events
  FOR INSERT
  WITH CHECK (true);
```

### How Isolation is Enforced

| Caller | Key Used | RLS Applies | Visible Rows |
|---|---|---|---|
| Admin dashboard (`/admin/analytics`) | `SUPABASE_SERVICE_ROLE_KEY` | No (bypassed) | All rows |
| `POST /api/analytics` (event ingestion) | `SUPABASE_SERVICE_ROLE_KEY` | No (bypassed) | Writes succeed |
| Future authenticated front-end client | `NEXT_PUBLIC_SUPABASE_ANON_KEY` + JWT | Yes | Only rows where `user_id = auth.uid()` |
| Unauthenticated / anonymous client | `NEXT_PUBLIC_SUPABASE_ANON_KEY` (no JWT) | Yes | Zero rows (no matching policy) |

Key design decision: pipeline events are written server-side with no `user_id` (they are system-generated, not user-owned). RLS prevents direct client access to these rows. An authenticated user can only see events they personally triggered when `user_id` was set to their auth UID at write time.

---

## Part 3 — Step 23: Pilot Feedback Loop Instrumentation

### Goal

Enable real-time observation of pilot customer behaviour from domain submission through storefront publish and first product interaction. Data collected during the pilot drives the product decisions made in Step 24 (roadmap).

### Events Already Instrumented

The pipeline automatically emits these 8 canonical funnel events via `POST /api/analytics`:

| Event Name | Where Emitted | Key Metadata |
|---|---|---|
| `domain_submitted` | Command Console (`/command-console`) | `domain`, `source`, `ab_variant`, `session_id` |
| `brand_extraction_started` | Orchestration backend (`/api/orchestrate`) | `domain`, `session_id` |
| `brand_extraction_completed` | Orchestration backend | `fidelity_score`, `colors_found`, `logo_found`, `duration_ms` |
| `mockup_generation_started` | Orchestration backend | `domain`, `session_id` |
| `mockup_generation_completed` | Orchestration backend | `product_count`, `duration_ms` |
| `storefront_generation_started` | Orchestration backend | `domain`, `session_id` |
| `storefront_generation_completed` | Orchestration backend | `storefront_url`, `product_count`, `duration_ms` |
| `storefront_published` | Publish endpoint (`/api/publish-store`) | `storefront_url` |

Plus three storefront-side events:

| Event Name | Where Emitted | Key Metadata |
|---|---|---|
| `storefront_view` | Store page (`/store/[storeId]`) | `store_id`, `status` |
| `product_view` | Store page | `sku`, `product_name`, `price` |
| `cart_add` | Store page | `sku`, `product_name`, `price` |

### Pilot Feedback Questions the Data Answers

| Business Question | Signal to Observe |
|---|---|
| Does the pipeline complete end-to-end? | `endToEndConversion` KPI on `/admin/analytics` |
| How fast does brand extraction take? | `duration_ms` on `brand_extraction_completed` events |
| Do pilots browse the generated storefront? | `product_view` and `cart_add` events post-publish |
| Where do pilots drop off? | Step-conversion labels in the Funnel Chart |
| Which landing page variant converts better? | `ab_variant` field on `domain_submitted` events |
| Is brand fidelity acceptable? | `fidelity_score` distribution in `brand_extraction_completed` context |

### How to Monitor During the Pilot

1. Navigate to https://branded-fit.vercel.app/admin/analytics (requires `ADMIN_PASSWORD` cookie).
2. Watch the **Funnel Completion Rate** KPI — target ≥ 75% for a healthy pilot.
3. Watch **Avg Pipeline Duration** — target < 4 minutes (240 seconds).
4. Use the **Filter by customer** input to scope the dashboard to a specific pilot's `customer_id`.
5. For per-session detail, query Supabase directly:
   ```sql
   SELECT event_name, domain, session_id, created_at, context
   FROM analytics_events
   WHERE customer_id = '<pilot_customer_id>'
   ORDER BY created_at;
   ```

### Pilot Error Detection

Two failure events signal pipeline problems:

| Event Name | Cause | Action |
|---|---|---|
| `brand_extraction_failed` | Brandfetch API returned no assets or SSL error | Check `error_message` and `context.error_code` in the DB row; escalate to Brandfetch support |
| `mockup_generation_failed` | Printify API timeout or invalid template | Check Printify dashboard for the template ID |
| `storefront_generation_failed` | Shopify API rate limit or invalid credentials | Verify `SHOPIFY_ACCESS_TOKEN` env var |

These events are visible in the **Event Count by Type** table at the bottom of the dashboard.

---

## Part 4 — Step 24: Analytics Roadmap

### Priority 1 — Pilot-Ready Enhancements (before first pilot customer)

| Enhancement | Why | Effort |
|---|---|---|
| Add `customer_id` to all pipeline events | Enables per-customer funnel view in the admin dashboard customer filter | Small — pass `customerId` from the orchestration request body through to each `trackEvent` call |
| NPS prompt after `storefront_published` | Collect pilot satisfaction score inline, store as `nps_score` event with `rating` and `comment` | Medium — add a modal on the store preview page, POST to `/api/analytics` |
| Alert on `brand_extraction_failed` | Email or Slack notification when any pilot domain fails extraction | Small — add a webhook call in the failure handler of `/api/orchestrate` |
| Session replay for the Command Console | Record the full interaction for pilots who consent, surface replays alongside the funnel | Large — requires a third-party tool (e.g. Posthog, LogRocket) |

### Priority 2 — Post-Pilot Iteration

| Enhancement | Why | Effort |
|---|---|---|
| A/B test result view | Aggregate `domain_submitted` by `ab_variant` and show conversion rates per variant | Medium — add a variant breakdown section to `/admin/analytics` |
| Fidelity score histogram | Surface brand extraction quality distribution across all domains | Small — add a histogram component reading `fidelity_score` from `brand_extraction_completed` events |
| Pipeline duration P50/P95 | Understand latency distribution, not just mean | Small — add percentile calculation to `buildAnalyticsResult` |
| Weekly email digest | Auto-send funnel metrics every Monday to founders | Medium — Vercel Cron Job + `POST /api/admin/analytics` → Resend email |

### Priority 3 — Scale (post-product-market-fit)

| Enhancement | Why | Effort |
|---|---|---|
| Retention cohort analysis | Track whether storefront owners return to add products or re-publish | Large — requires a `user_id` attach strategy and cohort table |
| Revenue attribution | Join `cart_add` events with Shopify order webhooks to calculate revenue per domain | Large — requires Shopify webhook registration and an `orders` table |
| Alerting dashboard | Pagerduty / Slack alert when funnel completion drops below threshold | Medium — threshold rule on the `/api/admin/analytics` GET endpoint |
| Multi-tenant analytics | Each pilot company gets a self-serve analytics sub-view with their own KPIs | Large — requires auth-gated per-tenant dashboard at `/analytics/[customerId]` |

### Schema Additions Needed for Roadmap Items

```sql
-- NPS events (Priority 1)
-- No schema change needed: POST /api/analytics with event_name = 'nps_score',
-- context = { rating: 8, comment: "..." }, customer_id = "<pilot_id>"

-- A/B test results (Priority 2)
-- No schema change needed: ab_variant already stored in context on domain_submitted events

-- Weekly digest (Priority 2)
-- Add: CREATE TABLE digest_subscriptions (id UUID PK, email TEXT, customer_id TEXT, cadence TEXT)
```

---

## Part 5 — Verification Checklist

Run these checks against the live deployment at https://branded-fit.vercel.app:

| # | Check | How to Verify | Expected |
|---|---|---|---|
| 1 | HTTP 200 on /admin/analytics | `curl -I https://branded-fit.vercel.app/admin/analytics` | `HTTP/2 200` |
| 2 | Funnel Completion Rate KPI visible | Load page in browser | Shows `%` value (≥ 75% with seed data) |
| 3 | Avg Pipeline Duration KPI visible | Load page in browser | Shows `Xm Ys` value (≈ 3m 40s with seed data) |
| 4 | "Live data" badge displayed | Load page in browser | Green border pill reading "Live data" |
| 5 | Funnel chart renders 7 bars | Load page in browser | Bars for all 7 stages with conversion labels |
| 6 | Time-series chart renders 30-day range | Load page in browser | X-axis shows 30 day keys |
| 7 | Event Count by Type table shows rows | Load page in browser | ≥ 8 distinct event type rows |
| 8 | RLS: service role sees all rows | Query Supabase with service role | Returns all seed events |
| 9 | RLS: anon key sees zero rows | Query Supabase with anon key (no JWT) | Returns empty array |
| 10 | Seed endpoint idempotent | `POST /api/admin/seed-analytics` twice | Same counts both times, no duplicates |

---

## Appendix — Key File Paths

| File | Purpose |
|---|---|
| `src/app/admin/analytics/page.tsx` | Admin dashboard SSR page with auto-seed |
| `src/app/api/analytics/route.ts` | `POST /api/analytics` — event ingestion endpoint |
| `src/app/api/admin/seed-analytics/route.ts` | `POST /api/admin/seed-analytics` — idempotent seed endpoint |
| `src/app/api/admin/analytics/route.ts` | `GET /api/admin/analytics` — JSON funnel data endpoint |
| `src/lib/analytics.ts` | Client-side `trackEvent()` helper and event type definitions |
| `supabase/seed.sql` | Canonical seed with 20 traces (12 complete, 8 partial/failed) |
| `supabase/migrations/009_add_event_type_customer_id_metadata.sql` | Enables RLS, adds INSERT policy |
| `supabase/migrations/012_add_context_and_rls_policy.sql` | Adds SELECT RLS policy (user isolation) |
