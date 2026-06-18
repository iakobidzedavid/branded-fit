# Analytics Dashboard — Deployment Verification

**Date:** 2026-06-08
**Route:** `/admin/analytics`
**Live URL:** https://branded-fit.vercel.app/admin/analytics

---

## Build Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | Pass — zero type errors |
| `npm run build` | Pass — 31 pages compiled |
| `/admin/analytics` build output | `○ (Static)` — pre-rendered, 116 kB bundle |
| Warnings | Node.js 18 deprecation from Supabase SDK (non-blocking) |

The dashboard compiles without errors and Vercel will deploy it on the next push to `main`.

---

## Dashboard Behaviour

- **Live Supabase env vars present:** queries `analytics_events` for the last 7 days; renders "Live data" badge.
- **Env vars absent (build-time or missing config):** falls back gracefully to zero counts; renders "No data" badge.
- All charts (`FunnelChart`, `TimeSeriesChart`, `EventSummaryCards`) are client components using Recharts — they render without errors in both live and fallback modes.

---

## Seeded Test-Event Cohort

Seed file: `supabase/seed.sql`

Three mock companies, 10 sessions over a 60-hour window:

| Domain | Session | Type | Final Stage |
|---|---|---|---|
| acme.com | sess-acme-01 | Full pipeline | storefront_published |
| acme.com | sess-acme-02 | Stopped at generated | storefront_generated |
| acme.com | sess-acme-03 | Stopped at extracted | brand_extraction_completed |
| acme.com | sess-acme-04 | Extraction failed | brand_extraction_started |
| techcorp.io | sess-tech-01 | Full pipeline | storefront_published |
| techcorp.io | sess-tech-02 | Stopped at extracted | brand_extraction_completed |
| techcorp.io | sess-tech-03 | Stopped at generated | storefront_generated |
| buildfast.co | sess-build-01 | Full pipeline | storefront_published |
| buildfast.co | sess-build-02 | Stopped at extracted | brand_extraction_completed |
| buildfast.co | sess-build-03 | Extraction failed | brand_extraction_started |

**Total events:** 36 across 5 event types.

---

## Funnel Conversion Metrics

The dashboard tracks a 4-stage funnel (matching the `FUNNEL_STAGES` const in `page.tsx`):

| Stage | Count | Step Conversion | Cumulative |
|---|---|---|---|
| domain_submitted | 10 | baseline | 100% |
| brand_extraction_completed | 8 | 80% | 80% |
| storefront_generated | 5 | 63% | 50% |
| storefront_published | 3 | 60% | **30%** |

**End-to-end conversion (domain submit → storefront published): 30%**

Note: the seed also contains `brand_extraction_started` (10 events) and two `error` sessions that dropped out before `brand_extraction_completed`. This event is not part of the dashboard funnel (only the 4 stages above are tracked), but it can be queried from the raw `analytics_events` table for deeper drop-off analysis.

---

## Expected Dashboard Render (with Seeded Data)

**Summary cards row:**
- Domain Submitted: **10**
- Brand Extracted: **8**
- Storefront Generated: **5**
- Storefront Published: **3**
- End-to-End Rate: **30%**

**Conversion Funnel (horizontal bars):**
- Domain Submitted — 10 (baseline)
- Brand Extracted — 8 (80%)
- Storefront Generated — 5 (63%)
- Storefront Published — 3 (60%)

**Hourly Event Volume chart:** events distributed over the 48-hour window, with peaks around the session timestamps (4h, 7h, 12h, 22h, 24h, 28h, 36h, 48h, 52h, 60h ago).

---

## Verification Steps for Production

1. Navigate to https://branded-fit.vercel.app/admin/analytics
2. Confirm HTTP 200 and "Live data" badge is visible (green border).
3. Summary cards show counts matching the table above.
4. Funnel chart bars render in order (violet → blue → green → amber) with correct step conversion labels.
5. Time series chart shows multiple lines across the 48-hour window with non-zero activity.
6. No JavaScript console errors in the browser.
