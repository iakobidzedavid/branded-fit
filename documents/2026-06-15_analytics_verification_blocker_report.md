# Analytics Verification Task - Blocker Report
**Date:** 2026-06-15  
**Task:** Verify analytics instrumentation is live on production  
**Status:** BLOCKED - Cannot Execute  
**Task ID:** [operational verification task]

## Executive Summary

This task requires **live browser interaction with production systems** (domain submission, event monitoring, screenshot capture, authenticated dashboard access). The Testing Mode Prospect List Validator agent lacks:
- Browser automation capabilities to visit live URLs
- Screenshot functionality for production environments
- Supabase database credentials for direct query access
- Admin authentication tokens for the /admin/analytics dashboard
- Real-time event emission monitoring from browser console

This is a **technical limitation that cannot be solved through documentation**, requiring human execution or deployment of dedicated monitoring tools.

---

## What This Task Requires

| Requirement | Capability | Status |
|---|---|---|
| Visit live Vercel URL | Browser access | ❌ Not available |
| Trigger domain submissions | Interactive form submission | ❌ Not available |
| Monitor browser console events | JavaScript event capture | ❌ Not available |
| Take production screenshots | Screenshot automation | ❌ Not available |
| Authenticate to /admin/analytics | NextAuth token injection | ❌ Not available |
| Query Supabase directly | Database credentials | ❌ Not available |
| Monitor event persistence | Real-time DB query | ❌ Not available |

---

## Detailed Verification Checklist

Below is the complete verification framework that **must be executed manually** or by an agent with browser automation:

### 1. Command Console Event Emission Testing

**URL:** https://branded-david-7482s-projects.vercel.app/command-console

**Test Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear console
4. Navigate to Command Console
5. Submit test domain: `test-domain-1.com`
6. Watch console for event emissions

**Expected Events (in order):**
- `domain_submitted` → { domain: "test-domain-1.com", timestamp: ... }
- `brand_extraction_started` → { domain: "test-domain-1.com", timestamp: ... }
- `brand_extraction_completed` → { domain: "test-domain-1.com", status: "success", timestamp: ... }
- `storefront_generation_started` → { domain: "test-domain-1.com", timestamp: ... }
- `storefront_generation_completed` → { domain: "test-domain-1.com", status: "success", timestamp: ... }

**Pass Criteria:**
- ✅ All 5 events fire in sequence
- ✅ No console errors
- ✅ Each event includes timestamp
- ✅ domain field matches submitted domain

**Test Domains (repeat 2-4 times for ≥5 total events):**
- test-domain-1.com
- test-domain-2.com
- test-domain-3.com
- test-domain-4.com

---

### 2. API Endpoint Verification

**Endpoint:** POST /api/analytics

**Test Steps:**
1. Open DevTools Network tab
2. Filter for "analytics" requests
3. Submit a test domain
4. Check Network tab for POST to /api/analytics

**Verification:**
- ✅ HTTP 201 Created response
- ✅ Response body contains event_id
- ✅ Response time < 500ms
- ✅ No 401/403 errors

**Expected Response Format:**
```json
{
  "success": true,
  "event_id": "evt_abc123...",
  "event_name": "domain_submitted",
  "created_at": "2026-06-15T14:30:00Z"
}
```

---

### 3. Supabase Analytics Events Table Verification

**Database Query (execute in Supabase dashboard):**
```sql
SELECT 
  COUNT(*) as total_events,
  event_name,
  COUNT(DISTINCT domain) as unique_domains,
  MIN(created_at) as earliest_event,
  MAX(created_at) as latest_event
FROM analytics_events
WHERE created_at > NOW() - INTERVAL '2 hours'
GROUP BY event_name
ORDER BY event_name;
```

**Expected Results:**
| event_name | count | unique_domains |
|---|---|---|
| domain_submitted | ≥1 | ≥1 |
| brand_extraction_started | ≥1 | ≥1 |
| brand_extraction_completed | ≥1 | ≥1 |
| storefront_generation_started | ≥1 | ≥1 |
| storefront_generation_completed | ≥1 | ≥1 |

**Row-Level Query:**
```sql
SELECT 
  event_id,
  event_name,
  domain,
  created_at
FROM analytics_events
WHERE created_at > NOW() - INTERVAL '2 hours'
ORDER BY created_at DESC
LIMIT 50;
```

**Pass Criteria:**
- ✅ Minimum 5 rows total (≥5 events)
- ✅ All event_names match emission schema
- ✅ All timestamps within last 2 hours
- ✅ domain field populated for all rows
- ✅ No NULL values in event_name or created_at

---

### 4. /admin/analytics Dashboard Verification

**URL:** https://branded-david-7482s-projects.vercel.app/admin/analytics

**Authentication:**
1. Log in with admin credentials (stored in Team Vault)
2. If redirected to login, use NextAuth credentials
3. Dashboard should render without 401/403 errors

**Dashboard Elements to Verify:**

#### Conversion Funnel Chart
- ✅ Shows all 5 stages:
  1. domain_submitted
  2. brand_extraction_started
  3. brand_extraction_completed
  4. storefront_generation_started
  5. storefront_generation_completed
- ✅ Each stage displays event count (≥1)
- ✅ Funnel shows conversion percentages
- ✅ Chart renders without errors
- ✅ Legend visible and labeled

#### Time-Series Chart
- ✅ Shows event volume over 7-day window
- ✅ Y-axis: event count
- ✅ X-axis: date/time
- ✅ At least one data point for test date (2026-06-15)
- ✅ Tooltip shows exact counts on hover

#### Event Type Breakdown Table
- ✅ Lists all event types with counts
- ✅ domain_submitted: ≥1
- ✅ brand_extraction_completed: ≥1
- ✅ storefront_generation_completed: ≥1
- ✅ Columns: event_name, count, percentage

**Screenshot Requirements:**
1. Full dashboard view (1920x1080 minimum)
2. Funnel chart clearly visible
3. Time-series chart visible
4. Event breakdown table visible
5. No error messages or 404s in DevTools
6. Network tab shows successful /api/analytics calls

---

### 5. Complete Event Emission Log (Manual Collection)

For each test domain, document:

**Test Domain 1: test-domain-1.com**
```
Submitted: 2026-06-15 14:30:00 UTC
✅ domain_submitted
   → Fired at: 14:30:01
   → Payload: {domain: "test-domain-1.com", ...}

✅ brand_extraction_started
   → Fired at: 14:30:05
   → Payload: {...}

✅ brand_extraction_completed
   → Fired at: 14:31:15
   → Payload: {...}

✅ storefront_generation_started
   → Fired at: 14:31:20
   → Payload: {...}

✅ storefront_generation_completed
   → Fired at: 14:35:45
   → Payload: {...}

Total time: ~5 minutes 45 seconds
```

Repeat for test-domain-2, test-domain-3, etc.

---

## Success Criteria Summary

**Task succeeds when ALL of the following are confirmed:**

1. ✅ Command Console event emitters firing (5 events per domain)
2. ✅ /api/analytics endpoint returning HTTP 201
3. ✅ Analytics events persisted in Supabase table (≥5 rows)
4. ✅ /admin/analytics dashboard accessible and renders
5. ✅ Conversion funnel chart displays real event data
6. ✅ Time-series chart shows event volume trend
7. ✅ Event breakdown shows all 5 event types
8. ✅ No console errors or missing data in any system
9. ✅ Screenshots captured for each verification section
10. ✅ Event emission log documented for ≥2 test domains

**Minimum viable completion:**
- ≥5 real test events across conversion funnel
- Supabase query confirms persistence
- Dashboard renders without auth errors
- No missing events in pipeline

---

## How to Execute This Verification

### Option 1: Manual Browser Testing (Recommended for immediate results)
1. Open this document on your browser
2. Follow each section step-by-step
3. Test real domains through production Command Console
4. Capture screenshots at each stage
5. Document findings in event emission log
6. **Estimated time:** 20-30 minutes

### Option 2: Automated with Browser Agent
1. Deploy with Browser Agent (if available)
2. Pass this checklist as test specification
3. Browser Agent executes all steps
4. Captures screenshots automatically
5. Returns event logs and dashboard screenshots

### Option 3: Engineering Team Verification
1. Engineering lead runs verification locally
2. Confirms all integration points working
3. Validates against this checklist
4. Provides sign-off documentation

---

## Blockers & Dependencies

| Blocker | Resolution |
|---|---|
| No browser access from this agent | Use Browser Agent or manual execution |
| No Supabase credentials in environment | Authenticate via Supabase dashboard UI |
| No NextAuth tokens for /admin/analytics | Use admin login credentials from Team Vault |
| No screenshot automation | Take manual screenshots during testing |
| Event emission testing requires live interaction | Manual form submission or Browser Agent |

---

## Event Schema Reference

**analytics_events table columns:**
```sql
CREATE TABLE analytics_events (
  event_id UUID PRIMARY KEY,
  event_name VARCHAR (e.g., "domain_submitted", "brand_extraction_started", etc.),
  domain VARCHAR,
  user_id UUID NULLABLE,
  properties JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Required event_name values:**
1. domain_submitted
2. brand_extraction_started
3. brand_extraction_completed
4. storefront_generation_started
5. storefront_generation_completed

---

## Next Steps (For Task Completion)

1. **Assign browser-capable agent** to execute this checklist
2. **Or schedule manual verification** with engineering/product team
3. **Document results** against this framework
4. **Screenshot all dashboard views**
5. **Confirm Supabase persistence** with query results
6. **Create final verification report** with evidence

**Timeline:** 30 minutes with browser access

---

## Notes

This framework represents the complete verification specification. The actual execution requires **live browser interaction** which this agent cannot provide. However, any team member or automated browser tool can execute this checklist to fully verify production analytics instrumentation.

**Verification Date:** [To be filled during execution]  
**Executed By:** [To be filled during execution]  
**Result:** [PASS / FAIL to be determined]
