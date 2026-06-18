# Analytics Dashboard — Live Deployment Verification

**Date:** 2026-06-08  
**Verified against:** https://branded-fit.vercel.app  
**Build node:** `npm run build` on Node 18 (local), Vercel (Node 20)

---

## Build Verification

| Check | Result |
|---|---|
| `npm run build` | PASS — compiled 33 routes, zero errors |
| `/admin/analytics` | `ƒ (Dynamic)` — server-rendered on demand, 116 kB bundle |
| TypeScript | Clean — no type errors |
| Warnings | Node.js 18 deprecation from `@supabase/supabase-js` (non-blocking; Vercel runs Node 20) |

---

## Live Endpoint Checks

| # | Check | Status | Detail |
|---|---|---|---|
| 1 | `GET /admin/analytics` HTTP status | **PASS** | HTTP 200, TTFB 344ms, fully rendered |
| 2 | `GET /api/analytics/events` response time | **PASS** | Avg 326.5ms across 5 requests (threshold: <350ms) |
| 3 | API JSON structure | **PASS** | `funnel[4]`, `timeSeries[7]`, `eventCounts[]`, `endToEndConversion` all present |
| 4 | Funnel counts match seed | **FAIL** | All counts = 0 — production DB is not seeded (see below) |
| 5 | Time-series has 7-day range | **PASS** | 7 entries, 06-02 → 06-08, correct structure |
| 6 | Dashboard renders without errors | **PASS** | Dark-theme components load, graceful "No data" empty state shown |

---

## Performance Detail

Five consecutive requests to `GET /api/analytics/events`:

| Request | Response time |
|---|---|
| 1 | 326.6 ms |
| 2 | 330.8 ms |
| 3 | 318.7 ms |
| 4 | 328.1 ms |
| 5 | 328.5 ms |
| **Average** | **326.5 ms** |

All requests are comfortably under the 350 ms SLA. With live data (25 rows), the `analytics_events` query will be trivially fast — the index on `created_at` means the 7-day window scan will not regress at current data volumes.

---

## Funnel Accuracy — Discrepancy

**Root cause:** the production `analytics_events` table contains zero rows. The seed has not been applied to the production Supabase project.

**Expected counts** (from `supabase/seed.sql` v2 and `src/app/api/admin/seed-analytics/route.ts`):

| Stage | Expected count | Step conversion | End-to-end |
|---|---|---|---|
| domain_submitted | 5 | baseline | 100% |
| brand_extraction_completed | 4 | 80% | 80% |
| storefront_generated | 3 | 75% | 60% |
| storefront_published | 2 | 67% | **40%** |

**Actual counts (live):** all zero — "No data" badge displayed.

**Resolution:** call the idempotent seed endpoint once with the `ADMIN_PASSWORD` bearer token:

```bash
curl -X POST https://branded-fit.vercel.app/api/admin/seed-analytics \
  -H "Authorization: Bearer <ADMIN_PASSWORD>"
```

This inserts 25 events across 5 sessions and 5 domains spanning a 168-hour window. The endpoint deletes and re-inserts only the known seed session IDs (`sess-v2-01` through `sess-v2-05`), so it is safe to re-run.

After seeding, the dashboard should show:
- Summary cards: 5 / 4 / 3 / 2 / 40%
- Funnel bars: 80% → 75% → 67% step labels
- Time-series: non-zero activity across days 06-01 through 06-07
- Event table: 8 distinct event types totalling 25 rows

---

## Code Quality Observations

No bugs found in the analytics path. The following are notes, not blockers:

- **`/api/analytics/metrics/route.ts`** queries a `"events"` table (not `"analytics_events"`), uses a different schema (`event_type` column, `mockup_viewed` / `storefront_clicked` event names). This endpoint is from an older iteration and is no longer used by the dashboard. It will 500 silently if called because the `events` table doesn't exist. It is safe to leave as dead code or delete.
- The dashboard `page.tsx` directly uses the Supabase service-role key for SSR queries — this is correct for a server component and the key is never sent to the client.
- Auth gate: `ADMIN_PASSWORD` env var is set in production, so `/admin/analytics` will show the `<AdminLogin>` form until a valid cookie is present. The API routes at `/api/analytics/events` and `/api/admin/seed-analytics` handle auth independently.

---

## Summary

The deployment is fully operational. The only gap between current production state and the verified-ready state is the absence of seed data in the production database. Infrastructure (Vercel, Supabase connection, API routes, React components) is working correctly. Run the seed endpoint once to complete validation.
