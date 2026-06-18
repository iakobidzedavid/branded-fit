# Analytics Time-Series Chart Verification & Seed Data

**Date:** 2026-06-05

## Summary

Verified the time-series chart renders correctly, fixed a seed data bug (wrong event names), added a missing Supabase index, and seeded the `analytics_events` table with ≥5 well-spread test events.

---

## 1. Time-Series Chart Verification

**File:** `src/app/admin/analytics/page.tsx` — `TimeSeriesChart` component (line 289)

The chart is an SVG-based implementation that:
- Renders a 560×180 viewBox, responsive via `className="w-full"`
- Draws one polyline per funnel stage (5 lines total) using `makePath()`
- Plots a dot at each data point
- Shows MM-DD x-axis labels and numeric y-axis ticks (0, max/2, max)
- Handles empty data gracefully (`maxVal` defaults to 1 to avoid division by zero)
- Handles single-day data (n=1 centers the single column)

**API grouping logic** (`src/app/api/admin/analytics/route.ts`, line 116–124):
- Fetches events from `created_at >= 7 days ago`
- Builds a 7-day array (`days[-6]` through `days[today]`)
- Groups by `e.created_at?.startsWith(date)` — works correctly for UTC ISO timestamps returned by Supabase JS client

**Conclusion:** Chart implementation is correct. No code changes required.

---

## 2. Seed Data Fix

**Problem found:** The prior `supabase/seed.sql` used event names that do NOT match the API's `FUNNEL_STAGES` constant:

| Old name (broken) | Correct name |
|---|---|
| `storefront_created` | `storefront_generation_complete` |
| `brand_extracted` | `brand_extraction_complete` |
| `products_failed` | _(not a funnel stage — excluded)_ |
| `storefront_failed` | _(not a funnel stage — excluded)_ |
| `brand_extract_failed` | _(not a funnel stage — excluded)_ |

With the old seed, every funnel stage except `domain_submitted` would show 0 in the dashboard.

**Fix:** Rewrote `supabase/seed.sql` to use the exact event names from `FUNNEL_STAGES`.

### New Seed Data (26 events, 7 sessions)

| Session | Domain | Days Ago | Stages Completed |
|---|---|---|---|
| sess-001 | stripe.com | 6 | All 5 (full pipeline) |
| sess-002 | notion.so | 4 | All 5 (full pipeline) |
| sess-003 | figma.com | 2 | All 5 (full pipeline) |
| sess-004 | linear.app | 5 | domain_submitted + brand_extraction_complete |
| sess-005 | vercel.com | 3 | domain_submitted + brand_extraction_complete + mockup_generation_complete |
| sess-006 | loom.com | 7 | domain_submitted only |
| sess-007 | retool.com | today | All 5 (full pipeline) |

**Resulting funnel counts (last 7 days):**

| Stage | Count | Conversion |
|---|---|---|
| domain_submitted | 7 | baseline |
| brand_extraction_complete | 6 | 86% |
| mockup_generation_complete | 5 | 83% |
| storefront_generation_complete | 4 | 80% |
| user_clicks_publish | 4 | 100% |

**End-to-end conversion:** 57% (4/7)

**Time-series coverage:** Events on 6 of 7 chart days (days -6, -5, -4, -3, -2, today); day -1 is intentionally empty to demonstrate the chart handles gaps correctly.

Note: loom.com (day -7) is included in funnel totals but falls outside the 7-chart-day window (chart shows -6 through today).

---

## 3. Index Fix

**Problem found:** Migration 006 (`006_update_analytics_events_schema.sql`) used `DROP TABLE` and recreated `analytics_events` without the `created_at` index that migration 005 originally added. The admin analytics API filters by `created_at`:

```sql
.gte("created_at", since.toISOString())
```

Without an index, this is a full table scan.

**Fix:** Added `supabase/migrations/008_add_analytics_created_at_index.sql`:

```sql
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
  ON analytics_events(created_at DESC);
```

**Final indexes on `analytics_events`:**

| Index | Column | Purpose |
|---|---|---|
| `idx_analytics_events_event_name` | `event_name` | Filter by funnel stage |
| `idx_analytics_events_timestamp` | `timestamp DESC` | Legacy timestamp field |
| `idx_analytics_events_created_at` | `created_at DESC` | **Primary analytics query filter (new)** |

---

## 4. Build Verification

- `npm run build` — passes cleanly, no TypeScript or Next.js errors
- All existing routes and pages compile successfully
