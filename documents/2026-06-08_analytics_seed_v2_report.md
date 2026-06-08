# Analytics Seed v2 — 25-Event Funnel Dataset

**Date:** 2026-06-08  
**Endpoint:** `POST /api/admin/seed-analytics`  
**Verification:** `GET /api/admin/seed-analytics`

## Overview

Updated the analytics seed to cover all 8 funnel event types distributed across 5 sessions spanning 7 days (168 hours). Total: 25 events.

## Event Distribution

| Event Type                 | Count | Expected |
|----------------------------|-------|----------|
| `domain_submitted`         | 5     | 5        |
| `brand_extraction_started` | 5     | 5        |
| `brand_extraction_completed`| 4    | 4        |
| `storefront_generated`     | 3     | 3        |
| `storefront_published`     | 2     | 2        |
| `demo_viewed`              | 3     | 3        |
| `pilot_cta_clicked`        | 2     | 2        |
| `email_opened`             | 1     | 1        |
| **TOTAL**                  | **25**| **25**   |

## Sessions

| Session ID   | Domain         | Funnel Stage Reached     | Hours Ago |
|--------------|----------------|--------------------------|-----------|
| sess-v2-01   | acme.com       | Full + engagement events | ~160h     |
| sess-v2-02   | techcorp.io    | Full + engagement events | ~120h     |
| sess-v2-03   | buildfast.co   | storefront_generated     | ~80h      |
| sess-v2-04   | startupco.io   | brand_extraction_completed | ~50h   |
| sess-v2-05   | launchpad.co   | brand_extraction_started (failed) | ~20h |

## Conversion Funnel Rates

- domain_submitted → brand_extraction_started: 5/5 = **100%**
- brand_extraction_started → brand_extraction_completed: 4/5 = **80%**
- brand_extraction_completed → storefront_generated: 3/4 = **75%**
- storefront_generated → storefront_published: 2/3 = **67%**
- storefront_published → demo_viewed: 2/2 = **100%** (of those who published)
- demo_viewed → pilot_cta_clicked: 2/3 = **67%**

## How to Execute

```bash
# Seed the database (idempotent — safe to re-run)
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
  'sess-v2-01','sess-v2-02','sess-v2-03','sess-v2-04','sess-v2-05'
)
GROUP BY event_name
ORDER BY event_name;
```

## Files Changed

- `supabase/seed.sql` — Updated SQL seed matching v2 event schema
- `src/app/api/admin/seed-analytics/route.ts` — Updated API seed endpoint with 8 event types, 5 sessions, 7-day span
