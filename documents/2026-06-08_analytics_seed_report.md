# Analytics Events Seed Report
**Date:** 2026-06-08

## Summary

Created and documented a seeding script for 36 synthetic test events across the MVBP funnel, distributed over 3 mock stores with a ~2.5-day timestamp span.

## Files Changed

| File | Action |
|------|--------|
| `supabase/seed.sql` | Replaced with MVBP funnel events |
| `src/app/api/admin/seed-analytics/route.ts` | New — runnable POST endpoint |

## Event Distribution

| Event Name | Count | Notes |
|---|---|---|
| `domain_submitted` | 10 | One per session |
| `brand_extraction_started` | 10 | Triggered automatically on submission |
| `brand_extraction_completed` | 8 | 2 sessions fail at extraction stage |
| `storefront_generated` | 5 | Drop-off after extraction |
| `storefront_published` | 3 | Final publish step |
| **Total** | **36** | |

## Mock Stores

| Store | Sessions | Timestamp Range |
|---|---|---|
| `acme.com` | 4 sessions (A, B, C, D) | 60h ago → 12h ago |
| `techcorp.io` | 3 sessions (A, C, B) | 48h ago → 7h ago |
| `buildfast.co` | 3 sessions (A, C, D) | 52h ago → 4h ago |

## Session Types

- **Type A** (3 sessions, full pipeline): all 5 funnel stages completed
- **Type B** (2 sessions): stops after `storefront_generated`
- **Type C** (3 sessions): stops after `brand_extraction_completed`
- **Type D** (2 sessions): `brand_extraction_started` recorded but extraction fails

## Data Enrichment

Events include realistic metadata:
- `brand_extraction_completed`: `fidelity_score` column + metadata (75.4–96.3 range)
- `storefront_generated`: `product_count` column + template info
- `storefront_published`: `storefront_url` column
- All events: `source` (landing_page / email_campaign / referral / direct), `ab_variant` (A/B/C)

## How to Run the Seed

### Via API (idempotent, safe for any environment)

```bash
# Run seed
curl -X POST https://branded-fit.vercel.app/api/admin/seed-analytics \
  -H "Authorization: Bearer $ADMIN_PASSWORD"

# Verify result
curl https://branded-fit.vercel.app/api/admin/seed-analytics \
  -H "Authorization: Bearer $ADMIN_PASSWORD"
```

The POST endpoint:
1. Deletes any existing rows with the known seed `session_id` values
2. Inserts all 36 events with `created_at` relative to the current timestamp
3. Returns counts by event type for immediate verification

### Via Supabase CLI (local/staging)

```bash
supabase db seed
```

## Verification Query

Run in Supabase SQL editor to confirm data integrity:

```sql
SELECT event_name, COUNT(*) as count
FROM analytics_events
WHERE session_id IN (
  'sess-acme-01','sess-acme-02','sess-acme-03','sess-acme-04',
  'sess-tech-01','sess-tech-02','sess-tech-03',
  'sess-build-01','sess-build-02','sess-build-03'
)
GROUP BY event_name
ORDER BY event_name;
```

Expected result:

| event_name | count |
|---|---|
| brand_extraction_completed | 8 |
| brand_extraction_started | 10 |
| domain_submitted | 10 |
| storefront_generated | 5 |
| storefront_published | 3 |
