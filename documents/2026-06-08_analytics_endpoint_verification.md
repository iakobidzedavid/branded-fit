# Analytics Endpoint Verification

**Date:** 2026-06-08  
**Endpoint:** `POST /api/analytics`

## Schema (migration 010)

`analytics_events` now has the canonical task columns plus all prior columns for backward compat:

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto-generated |
| customer_id | TEXT | Optional |
| event_type | TEXT | Required (also written to event_name for legacy) |
| timestamp | TIMESTAMPTZ | Optional ISO string or Unix ms |
| properties | JSONB | Optional, GIN-indexed |
| event_name | TEXT NOT NULL | Legacy alias of event_type |
| metadata | JSONB | Legacy; accepted for backward compat |
| created_at | TIMESTAMPTZ | Auto-set |

RLS: enabled with INSERT policy (`analytics_events_insert`, `WITH CHECK (true)`).

## Manual Test Requests

### Test 1 — domain_submitted with properties
```bash
curl -s -X POST https://branded-fit.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_test_001",
    "event_type": "domain_submitted",
    "timestamp": "2026-06-08T12:00:00Z",
    "properties": {"domain": "stripe.com", "source": "landing_page"}
  }' | jq .
```

Expected: `{ "success": true, "data": { "id": "...", "event_type": "domain_submitted", "customer_id": "cust_test_001", ... } }`

### Test 2 — storefront_viewed with minimal payload
```bash
curl -s -X POST https://branded-fit.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "storefront_viewed",
    "customer_id": "cust_test_002",
    "properties": {"store_id": "abc123", "plan": "pilot"}
  }' | jq .
```

Expected: `{ "success": true, "data": { "id": "...", "event_type": "storefront_viewed", ... } }`

### Test 3 — validation rejection (missing event_type)
```bash
curl -s -X POST https://branded-fit.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"customer_id": "cust_test_003", "properties": {}}' | jq .
```

Expected: `{ "error": "event_type is required and must be a string" }` with HTTP 400

### Test 4 — validation rejection (properties not an object)
```bash
curl -s -X POST https://branded-fit.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"event_type": "test", "properties": "not-an-object"}' | jq .
```

Expected: `{ "error": "properties must be a JSON object" }` with HTTP 400
