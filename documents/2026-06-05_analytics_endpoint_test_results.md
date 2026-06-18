# Analytics Endpoint — Schema Migration & Test Results

**Date:** 2026-06-05

---

## What changed

### 1. Migration 006 — `supabase/migrations/006_update_analytics_events_schema.sql`

Drops the old `analytics_events` table (created in migration 005 with `event_data JSONB`,
`user_id UUID`, and `session_id UUID`) and recreates it with the canonical schema:

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | Primary key, `gen_random_uuid()` |
| `event_name` | `TEXT NOT NULL` | Required |
| `domain` | `TEXT` | Company domain (e.g. `stripe.com`) |
| `session_id` | `TEXT` | Client session identifier |
| `timestamp` | `TIMESTAMPTZ` | Client-supplied event time |
| `error_message` | `TEXT` | Error detail if event is a failure |
| `created_at` | `TIMESTAMPTZ NOT NULL DEFAULT NOW()` | Server insert time |

Indexes:
- `idx_analytics_events_event_name` on `event_name`
- `idx_analytics_events_timestamp` on `timestamp DESC`

### 2. Updated `POST /api/analytics`

Accepts JSON body with `event_name` (required), `domain`, `session_id`, `timestamp`,
and `error_message`. All optional fields except `event_name`.

---

## Deploy the migration

Run in the project root once Supabase credentials are configured:

```bash
supabase db push
```

Or paste `006_update_analytics_events_schema.sql` into the Supabase dashboard SQL editor.

---

## Curl test commands (run after migration is deployed)

### Happy path — all fields

```bash
curl -s -X POST https://branded-fit.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "event_name": "domain_submitted",
    "domain": "stripe.com",
    "session_id": "sess_abc123xyz",
    "timestamp": "2026-06-05T10:00:00Z",
    "error_message": null
  }' | jq .
```

Expected response (HTTP 201):
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "event_name": "domain_submitted",
    "domain": "stripe.com",
    "session_id": "sess_abc123xyz",
    "timestamp": "2026-06-05T10:00:00+00:00",
    "created_at": "<server_time>"
  }
}
```

### Minimal payload — event_name only

```bash
curl -s -X POST https://branded-fit.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"event_name": "page_view"}' | jq .
```

### Error event — with error_message

```bash
curl -s -X POST https://branded-fit.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "event_name": "pipeline_failed",
    "domain": "acme.io",
    "session_id": "sess_xyz999",
    "timestamp": "2026-06-05T11:30:00Z",
    "error_message": "Brandfetch API returned 429"
  }' | jq .
```

### Validation error — missing event_name

```bash
curl -s -X POST https://branded-fit.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"domain": "acme.io"}' | jq .
```

Expected response (HTTP 400):
```json
{"error": "event_name is required and must be a string"}
```

---

## Current live status

Tested `POST https://branded-fit.vercel.app/api/analytics` before deploying migration 006:

```
{"error":"Internal server error"}
```

This is expected — the live database has the old schema from migration 005 (`event_data`,
`user_id` columns; `session_id` as UUID) which doesn't match the new insert. After
`supabase db push` runs migration 006, all four curl tests above should pass.
