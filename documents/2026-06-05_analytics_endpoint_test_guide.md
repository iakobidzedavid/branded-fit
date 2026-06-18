# POST /api/analytics — Test Guide

**Date:** 2026-06-05

## Schema

Final table schema after running all migrations (001–008):

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | PK, auto-generated |
| `event_name` | TEXT NOT NULL | Required — indexed |
| `domain` | TEXT | Optional |
| `session_id` | TEXT | Optional |
| `timestamp` | TIMESTAMPTZ | Optional — indexed |
| `error_message` | TEXT | Optional |
| `fidelity_score` | NUMERIC(5,2) | Optional |
| `product_count` | INTEGER | Optional |
| `storefront_url` | TEXT | Optional |
| `created_at` | TIMESTAMPTZ NOT NULL | Auto-set to NOW() — indexed |

## Endpoint

`POST /api/analytics`

**Request body** (JSON):
```json
{
  "event_name": "string (required)",
  "domain": "string (optional)",
  "session_id": "string (optional)",
  "timestamp": "ISO 8601 string (optional)",
  "fidelity_score": "number (optional)",
  "product_count": "number (optional)",
  "storefront_url": "string (optional)",
  "error_message": "string (optional)"
}
```

**Success response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "event_name": "...",
    "domain": "...",
    "session_id": "...",
    "timestamp": "...",
    "fidelity_score": null,
    "product_count": null,
    "storefront_url": null,
    "created_at": "..."
  }
}
```

**Error responses**:
- `400` — `event_name` missing or not a string
- `500` — database error

## curl Tests

### 1. Minimal event (event_name only)

```bash
curl -s -X POST https://branded-fit.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"event_name":"domain_submitted"}' | jq .
```

Expected: `{"success":true,"data":{"id":"...","event_name":"domain_submitted",...}}`

### 2. Full pipeline event

```bash
curl -s -X POST https://branded-fit.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "event_name": "storefront_created",
    "domain": "acme.com",
    "session_id": "sess_abc123",
    "timestamp": "2026-06-05T10:00:00Z",
    "fidelity_score": 87.5,
    "product_count": 6,
    "storefront_url": "https://acme.myshopify.com",
    "error_message": null
  }' | jq .
```

### 3. Error event

```bash
curl -s -X POST https://branded-fit.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "event_name": "pipeline_error",
    "domain": "bad-domain.xyz",
    "session_id": "sess_def456",
    "timestamp": "2026-06-05T10:01:00Z",
    "error_message": "Brandfetch returned no colors"
  }' | jq .
```

### 4. Validation — missing event_name (should return 400)

```bash
curl -s -X POST https://branded-fit.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"domain":"acme.com"}' | jq .
```

Expected: `{"error":"event_name is required and must be a string"}`

## Postman Import

Import the following collection JSON into Postman:

```json
{
  "info": { "name": "Branded Fit Analytics", "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
  "item": [
    {
      "name": "Track minimal event",
      "request": {
        "method": "POST",
        "url": "https://branded-fit.vercel.app/api/analytics",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": { "mode": "raw", "raw": "{\"event_name\":\"domain_submitted\"}" }
      }
    },
    {
      "name": "Track full pipeline event",
      "request": {
        "method": "POST",
        "url": "https://branded-fit.vercel.app/api/analytics",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\"event_name\":\"storefront_created\",\"domain\":\"acme.com\",\"session_id\":\"sess_abc123\",\"timestamp\":\"2026-06-05T10:00:00Z\",\"fidelity_score\":87.5,\"product_count\":6,\"storefront_url\":\"https://acme.myshopify.com\"}"
        }
      }
    },
    {
      "name": "Validation error — missing event_name",
      "request": {
        "method": "POST",
        "url": "https://branded-fit.vercel.app/api/analytics",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": { "mode": "raw", "raw": "{\"domain\":\"acme.com\"}" }
      }
    }
  ]
}
```

## Migration Chain Summary

| Migration | Description |
|---|---|
| `005_create_analytics_events_table.sql` | Initial table with event_name, event_data, user_id, session_id, created_at |
| `006_update_analytics_events_schema.sql` | Recreates with canonical schema; adds indexes on event_name and timestamp |
| `007_add_analytics_pipeline_columns.sql` | Adds fidelity_score, product_count, storefront_url |
| `008_add_analytics_created_at_index.sql` | Adds index on created_at |
