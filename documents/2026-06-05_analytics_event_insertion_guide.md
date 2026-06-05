# Analytics Event Insertion Guide
## Provisioning Test Results → analytics_events Table

**Date:** June 5, 2026  
**Purpose:** Insert 3 provisioning test metrics into Supabase analytics_events table  
**Database:** Branded Fit (Production)

---

## Overview

This guide provides SQL statements and API calls to insert the provisioning test results into the analytics_events table for dashboard visualization and reporting.

### Test Data to Insert

- **Test 1:** Ramp (ramp.com) — 8:27, 8.7/10 fidelity, 8.4/10 mockups
- **Test 2:** Vanta (vanta.com) — 9:00, 8.0/10 fidelity, 7.8/10 mockups
- **Test 3:** Linear (linear.app) — 9:16, 9.0/10 fidelity, 8.8/10 mockups

---

## Method 1: Direct SQL Insertion (Supabase Dashboard)

### Step 1: Access Supabase Console
1. Go to https://supabase.com/dashboard
2. Select "Branded Fit" project
3. Navigate to SQL Editor
4. Create new query

### Step 2: Insert Test 1 (Ramp)

```sql
INSERT INTO analytics_events (
  event_name,
  event_data,
  created_at
) VALUES (
  'provisioning_test',
  jsonb_build_object(
    'test_id', 'provisioning_test_001',
    'domain', 'ramp.com',
    'provisioning_time_minutes', 8.45,
    'provisioning_time_seconds', 507,
    'brand_extraction_fidelity_score', 8.7,
    'mockup_quality_score', 8.4,
    'brand_extraction_status', 'completed',
    'mockup_generation_status', 'completed',
    'storefront_generation_status', 'completed',
    'product_count', 5,
    'shopify_url', 'https://ramp-mvbp-001.myshopify.com',
    'extraction_confidence_pct', 87,
    'errors', '[]'::jsonb,
    'sla_achieved', true,
    'test_result', 'PASS'
  ),
  '2026-06-05T14:38:42Z'::timestamptz
);
```

### Step 3: Insert Test 2 (Vanta)

```sql
INSERT INTO analytics_events (
  event_name,
  event_data,
  created_at
) VALUES (
  'provisioning_test',
  jsonb_build_object(
    'test_id', 'provisioning_test_002',
    'domain', 'vanta.com',
    'provisioning_time_minutes', 9.0,
    'provisioning_time_seconds', 540,
    'brand_extraction_fidelity_score', 8.0,
    'mockup_quality_score', 7.8,
    'brand_extraction_status', 'completed',
    'mockup_generation_status', 'completed',
    'storefront_generation_status', 'completed',
    'product_count', 5,
    'shopify_url', 'https://vanta-mvbp-002.myshopify.com',
    'extraction_confidence_pct', 84,
    'errors', '[]'::jsonb,
    'sla_achieved', true,
    'test_result', 'PASS'
  ),
  '2026-06-05T14:51:15Z'::timestamptz
);
```

### Step 4: Insert Test 3 (Linear)

```sql
INSERT INTO analytics_events (
  event_name,
  event_data,
  created_at
) VALUES (
  'provisioning_test',
  jsonb_build_object(
    'test_id', 'provisioning_test_003',
    'domain', 'linear.app',
    'provisioning_time_minutes', 9.27,
    'provisioning_time_seconds', 556,
    'brand_extraction_fidelity_score', 9.0,
    'mockup_quality_score', 8.8,
    'brand_extraction_status', 'completed',
    'mockup_generation_status', 'completed',
    'storefront_generation_status', 'completed',
    'product_count', 5,
    'shopify_url', 'https://linear-mvbp-003.myshopify.com',
    'extraction_confidence_pct', 86,
    'errors', '[]'::jsonb,
    'sla_achieved', true,
    'test_result', 'PASS'
  ),
  '2026-06-05T15:03:31Z'::timestamptz
);
```

### Step 5: Verify Insertion

```sql
SELECT 
  id,
  event_name,
  event_data->>'domain' AS domain,
  event_data->>'test_id' AS test_id,
  (event_data->>'provisioning_time_minutes')::float AS provisioning_minutes,
  (event_data->>'brand_extraction_fidelity_score')::float AS fidelity_score,
  event_data->>'test_result' AS result,
  created_at
FROM analytics_events
WHERE event_name = 'provisioning_test'
ORDER BY created_at DESC
LIMIT 3;
```

Expected output: 3 rows with provisioning_test events for ramp.com, vanta.com, linear.app

---

## Method 2: API Insertion (POST to /api/analytics/events)

### Step 1: Prepare API Endpoint

**Endpoint:** `POST https://branded-fit.vercel.app/api/analytics/events`  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

### Step 2: Call API for Test 1 (Ramp)

**Request:**
```bash
curl -X POST https://branded-fit.vercel.app/api/analytics/events \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "provisioning_test",
    "eventData": {
      "test_id": "provisioning_test_001",
      "domain": "ramp.com",
      "provisioning_time_minutes": 8.45,
      "provisioning_time_seconds": 507,
      "brand_extraction_fidelity_score": 8.7,
      "mockup_quality_score": 8.4,
      "brand_extraction_status": "completed",
      "mockup_generation_status": "completed",
      "storefront_generation_status": "completed",
      "product_count": 5,
      "shopify_url": "https://ramp-mvbp-001.myshopify.com",
      "extraction_confidence_pct": 87,
      "errors": [],
      "sla_achieved": true,
      "test_result": "PASS"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "event_type": "provisioning_test",
    "created_at": "2026-06-05T14:38:42Z"
  }
}
```

### Step 3: Call API for Test 2 (Vanta)

**Request:**
```bash
curl -X POST https://branded-fit.vercel.app/api/analytics/events \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "provisioning_test",
    "eventData": {
      "test_id": "provisioning_test_002",
      "domain": "vanta.com",
      "provisioning_time_minutes": 9.0,
      "provisioning_time_seconds": 540,
      "brand_extraction_fidelity_score": 8.0,
      "mockup_quality_score": 7.8,
      "brand_extraction_status": "completed",
      "mockup_generation_status": "completed",
      "storefront_generation_status": "completed",
      "product_count": 5,
      "shopify_url": "https://vanta-mvbp-002.myshopify.com",
      "extraction_confidence_pct": 84,
      "errors": [],
      "sla_achieved": true,
      "test_result": "PASS"
    }
  }'
```

### Step 4: Call API for Test 3 (Linear)

**Request:**
```bash
curl -X POST https://branded-fit.vercel.app/api/analytics/events \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "provisioning_test",
    "eventData": {
      "test_id": "provisioning_test_003",
      "domain": "linear.app",
      "provisioning_time_minutes": 9.27,
      "provisioning_time_seconds": 556,
      "brand_extraction_fidelity_score": 9.0,
      "mockup_quality_score": 8.8,
      "brand_extraction_status": "completed",
      "mockup_generation_status": "completed",
      "storefront_generation_status": "completed",
      "product_count": 5,
      "shopify_url": "https://linear-mvbp-003.myshopify.com",
      "extraction_confidence_pct": 86,
      "errors": [],
      "sla_achieved": true,
      "test_result": "PASS"
    }
  }'
```

---

## Method 3: Node.js Script (Programmatic Insertion)

### Step 1: Create insert-analytics-events.js

```javascript
// insert-analytics-events.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for server-side operations
const client = createClient(supabaseUrl, supabaseKey);

const testData = [
  {
    test_id: 'provisioning_test_001',
    domain: 'ramp.com',
    provisioning_time_minutes: 8.45,
    provisioning_time_seconds: 507,
    brand_extraction_fidelity_score: 8.7,
    mockup_quality_score: 8.4,
    brand_extraction_status: 'completed',
    mockup_generation_status: 'completed',
    storefront_generation_status: 'completed',
    product_count: 5,
    shopify_url: 'https://ramp-mvbp-001.myshopify.com',
    extraction_confidence_pct: 87,
    errors: [],
    sla_achieved: true,
    test_result: 'PASS',
    created_at: '2026-06-05T14:38:42Z'
  },
  {
    test_id: 'provisioning_test_002',
    domain: 'vanta.com',
    provisioning_time_minutes: 9.0,
    provisioning_time_seconds: 540,
    brand_extraction_fidelity_score: 8.0,
    mockup_quality_score: 7.8,
    brand_extraction_status: 'completed',
    mockup_generation_status: 'completed',
    storefront_generation_status: 'completed',
    product_count: 5,
    shopify_url: 'https://vanta-mvbp-002.myshopify.com',
    extraction_confidence_pct: 84,
    errors: [],
    sla_achieved: true,
    test_result: 'PASS',
    created_at: '2026-06-05T14:51:15Z'
  },
  {
    test_id: 'provisioning_test_003',
    domain: 'linear.app',
    provisioning_time_minutes: 9.27,
    provisioning_time_seconds: 556,
    brand_extraction_fidelity_score: 9.0,
    mockup_quality_score: 8.8,
    brand_extraction_status: 'completed',
    mockup_generation_status: 'completed',
    storefront_generation_status: 'completed',
    product_count: 5,
    shopify_url: 'https://linear-mvbp-003.myshopify.com',
    extraction_confidence_pct: 86,
    errors: [],
    sla_achieved: true,
    test_result: 'PASS',
    created_at: '2026-06-05T15:03:31Z'
  }
];

async function insertAnalyticsEvents() {
  for (const test of testData) {
    try {
      const { data, error } = await client
        .from('analytics_events')
        .insert([{
          event_name: 'provisioning_test',
          event_data: test,
          created_at: test.created_at
        }]);

      if (error) {
        console.error(`Error inserting ${test.domain}:`, error);
      } else {
        console.log(`✅ Inserted ${test.domain}: ${data[0]?.id}`);
      }
    } catch (err) {
      console.error(`Exception inserting ${test.domain}:`, err);
    }
  }
}

insertAnalyticsEvents();
```

### Step 2: Run Script

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Run the script
node insert-analytics-events.js
```

---

## Verification Checklist

After inserting events, verify successful insertion:

### Step 1: Check Supabase Dashboard

1. Go to Supabase dashboard → SQL Editor
2. Run verification query:
```sql
SELECT COUNT(*) as event_count, event_name
FROM analytics_events
WHERE event_name = 'provisioning_test'
GROUP BY event_name;
```
Expected: 1 row with event_count = 3

### Step 2: View Individual Events

```sql
SELECT 
  id,
  event_name,
  event_data->>'domain' AS domain,
  (event_data->>'brand_extraction_fidelity_score')::float AS fidelity,
  event_data->>'test_result' AS result,
  created_at
FROM analytics_events
WHERE event_name = 'provisioning_test'
ORDER BY created_at ASC;
```

Expected output:
```
| id | event_name | domain | fidelity | result | created_at |
|---|---|---|---|---|---|
| uuid1 | provisioning_test | ramp.com | 8.7 | PASS | 2026-06-05T14:38:42Z |
| uuid2 | provisioning_test | vanta.com | 8.0 | PASS | 2026-06-05T14:51:15Z |
| uuid3 | provisioning_test | linear.app | 9.0 | PASS | 2026-06-05T15:03:31Z |
```

### Step 3: Check Admin Dashboard

1. Navigate to https://branded-fit.vercel.app/admin/analytics
2. Verify provisioning_test events appear in the event list
3. Check that metrics cards show:
   - Average Provisioning Time: ~8.9 min
   - Average Fidelity Score: ~8.6/10
   - Average Mockup Quality: ~8.3/10

### Step 4: Validate Funnel Chart (if applicable)

If the dashboard includes conversion funnel analysis:
1. Check that 3 provisioning_test events are counted
2. Verify success rate shows 100% (3/3 pass)

---

## Database Schema Reference

### analytics_events Table Structure

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,           -- 'provisioning_test'
  event_data JSONB,                   -- Contains all test metrics
  user_id UUID,                       -- Optional
  session_id UUID NOT NULL,           -- Auto-generated
  created_at TIMESTAMPTZ NOT NULL     -- Test completion timestamp
);
```

### event_data Structure (for provisioning_test events)

```json
{
  "test_id": "provisioning_test_001",
  "domain": "ramp.com",
  "provisioning_time_minutes": 8.45,
  "provisioning_time_seconds": 507,
  "brand_extraction_fidelity_score": 8.7,
  "mockup_quality_score": 8.4,
  "brand_extraction_status": "completed",
  "mockup_generation_status": "completed",
  "storefront_generation_status": "completed",
  "product_count": 5,
  "shopify_url": "https://ramp-mvbp-001.myshopify.com",
  "extraction_confidence_pct": 87,
  "errors": [],
  "sla_achieved": true,
  "test_result": "PASS"
}
```

---

## Troubleshooting

### Issue: "Permission denied" error during SQL insertion

**Solution:** Use Supabase Dashboard with authenticated account, or use service role key for programmatic access.

### Issue: JSONB parsing error

**Solution:** Ensure all JSON fields are properly quoted and escaped. Use `jsonb_build_object()` for safe construction.

### Issue: Timestamp parsing error

**Solution:** Use `::timestamptz` cast to ensure proper timestamp conversion. Format: `YYYY-MM-DDTHH:MM:SSZ`

### Issue: Events not appearing in dashboard

**Solution:**
1. Verify events were inserted: `SELECT COUNT(*) FROM analytics_events WHERE event_name = 'provisioning_test'`
2. Check dashboard filters — may need to reset date range or clear filters
3. Try refreshing the dashboard page (Ctrl+R)

---

## Next Steps

After successful insertion:

1. **Dashboard Verification:** Confirm metrics appear on /admin/analytics
2. **Reporting:** Generate reports with 3 provisioning test results
3. **Decision Making:** Use data for go/pivot/no-go decision (June 11 milestone)
4. **Archive:** Save this guide and the insertion queries for audit purposes

---

**Document Version:** 1.0  
**Created:** June 5, 2026  
**Owner:** MVBP Deployment & Verification Lead  
**Status:** Ready for Execution

