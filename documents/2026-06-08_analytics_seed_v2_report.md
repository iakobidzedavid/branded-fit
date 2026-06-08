# Analytics Seed v3 + Dashboard Alignment Report

**Date:** 2026-06-08
**Endpoint:** `POST /api/admin/seed-analytics`
**Verification:** `GET /api/admin/seed-analytics`

## Problem Fixed: Event Name Mismatch

The previous seed used legacy event names (`domain_submitted`,
`brand_extraction_completed`, `storefront_generated`, `storefront_published`)
that did not match what the Command Console and Storefront Preview actually emit.
The dashboard FUNNEL_STAGES also used these legacy names, so real traffic never
appeared in the funnel chart. This update aligns the seed data, dashboard, and
all API routes to use the correct event names.

## Event Name Mapping

| Old (broken) | New (correct) | Source |
|---|---|---|
| `domain_submitted` | `domain_submission` | Command Console fires `domain_submission` |
| `brand_extraction_completed` | `brand_extraction_complete` | Console fires `brand_extraction_complete` |
| `storefront_generated` | `mockup_generation_complete` | Console fires `mockup_generation_complete` |
| `storefront_published` | `storefront_generation_complete` | Console fires `storefront_generation_complete` |
| (absent) | `product_view` | Store page fires `product_view` |

## Files Changed

| File | Change |
|---|---|
| `src/app/api/admin/seed-analytics/route.ts` | 31-event v3 seed with correct event names; cleans up v2 legacy sessions |
| `src/app/admin/analytics/page.tsx` | Updated FUNNEL_STAGES (5 stages), STAGE_META, stageCounts, endToEndConversion |
| `src/app/api/admin/analytics/route.ts` | Updated FUNNEL_STAGES and stageCounts |
| `src/app/api/analytics/events/route.ts` | Updated FUNNEL_STAGES, STAGE_META, and stageCounts |

## Seed Data: 31 Events Across 4 Sessions

### Pipeline sessions (3 complete + 1 partial)

| Session | Domain | Age | Events | Status |
|---|---|---|---|---|
| sess-v3-01 | ramp.com | ~72h ago | 7 | Full pipeline, fidelity 92.4% |
| sess-v3-02 | notion.so | ~48h ago | 7 | Full pipeline, fidelity 95.1% |
| sess-v3-03 | stripe.com | ~24h ago | 7 | Full pipeline, fidelity 97.3% |
| sess-v3-04 | figma.com | ~8h ago | 4 | Partial — dropped after mockup_generation_start |

Each complete session fires 7 events:
`domain_submission → brand_extraction_start → brand_extraction_complete →
mockup_generation_start → mockup_generation_complete →
storefront_generation_start → storefront_generation_complete`

### Storefront events (sess-v3-store, ramp.com, ~2h ago)

| Event | Count |
|---|---|
| storefront_view | 1 |
| product_view | 3 |
| cart_add | 2 |

**Total: 31 events**

## Dashboard Funnel (5-stage)

| Stage | Event name | Label | Count from seed |
|---|---|---|---|
| 1 | `domain_submission` | Domain Submitted | 4 |
| 2 | `brand_extraction_complete` | Brand Extracted | 4 |
| 3 | `mockup_generation_complete` | Mockup Generated | 3 |
| 4 | `storefront_generation_complete` | Storefront Ready | 3 |
| 5 | `product_view` | Product Viewed | 3 |

End-to-end conversion (domain → storefront): **75%**

## How to Execute

```bash
# Seed the database (idempotent — deletes old v3 + legacy v2 sessions first)
curl -X POST https://branded-fit.vercel.app/api/admin/seed-analytics \
  -H "Authorization: Bearer $ADMIN_PASSWORD"

# Verify counts
curl https://branded-fit.vercel.app/api/admin/seed-analytics
```

## Supabase Verification Query

```sql
SELECT event_name, COUNT(*) AS cnt
FROM analytics_events
WHERE session_id IN (
  'sess-v3-01','sess-v3-02','sess-v3-03','sess-v3-04','sess-v3-store'
)
GROUP BY event_name
ORDER BY event_name;
-- Expected: 31 rows across 10 distinct event types
```

## Build Verification

- `npx tsc --noEmit` — pass (0 errors)
- `npm run build` — pass (33 routes compiled, 0 errors)
