# Analytics Instrumentation Live Verification Report
**Date:** 2026-06-15  
**Environment:** Production (Vercel)  
**Deployment URL:** https://branded-david-7482s-projects.vercel.app  
**Status:** VERIFICATION REQUIRED

---

## Executive Summary

This report documents the verification steps required to confirm that analytics event instrumentation is actively emitting real conversion-funnel events on the live Branded Fit deployment. The verification validates three core components: (1) event emitters on the Command Console are firing, (2) events are persisting to Supabase, and (3) the /admin/analytics dashboard renders real conversion-funnel data.

**IMPORTANT:** This task requires manual execution via browser access. The following checklist outlines each verification step with success criteria and evidence collection requirements.

---

## Part 1: Command Console Event Emission Verification

### Objective
Confirm that the Command Console triggers domain_submitted and brand-extraction pipeline events when a user submits a domain.

### Prerequisites
- Chrome, Firefox, or Safari browser
- Access to https://branded-david-7482s-projects.vercel.app
- Browser DevTools Console open (F12 or Cmd+Option+J)

### Test Domain Set
Use the following 5+ test domains to collect ≥5 events:
1. `test-domain-001.com`
2. `test-domain-002.com`
3. `test-domain-003.com`
4. `test-domain-004.com`
5. `test-domain-005.com`

---

## Part 2: Event Emission Log (Step-by-Step)

For each test domain, follow this sequence and document results:

### Test 1: test-domain-001.com

**Step 1.1: Open DevTools Console**
- [ ] Open browser DevTools (F12)
- [ ] Navigate to Console tab
- [ ] Verify no prior errors in console
- **Evidence Required:** Screenshot of clean console

**Step 1.2: Submit Domain in Command Console**
- [ ] Input domain: `test-domain-001.com`
- [ ] Click "Generate Mockup" or submit button
- [ ] Monitor console for event emission logs
- **Expected Event:** `domain_submitted`
- **Evidence Required:** 
  - Screenshot showing console log: `[Analytics] Event emitted: domain_submitted`
  - Timestamp
  - Event payload (if logged)

**Step 1.3: Monitor Brand Extraction Pipeline**
- [ ] Keep DevTools Console open
- [ ] Wait 5-10 seconds for API calls to complete
- [ ] Watch for the following sequence:
  1. `brand_extraction_started` event
  2. `brand_extraction_completed` event
  3. `storefront_generation_started` event
  4. `storefront_generation_completed` event
- **Evidence Required:** Screenshot showing all 4 events in console
- **Acceptable Window:** Events should fire within 60-120 seconds of domain submission

**Result for Test 1:**
- [ ] domain_submitted: **PASS / FAIL** — Timestamp: ___________
- [ ] brand_extraction_started: **PASS / FAIL** — Timestamp: ___________
- [ ] brand_extraction_completed: **PASS / FAIL** — Timestamp: ___________
- [ ] storefront_generation_started: **PASS / FAIL** — Timestamp: ___________
- [ ] storefront_generation_completed: **PASS / FAIL** — Timestamp: ___________

---

### Test 2: test-domain-002.com
[Repeat Step 1.1 - 1.3 above with test-domain-002.com]

- [ ] domain_submitted: **PASS / FAIL** — Timestamp: ___________
- [ ] brand_extraction_started: **PASS / FAIL** — Timestamp: ___________
- [ ] brand_extraction_completed: **PASS / FAIL** — Timestamp: ___________
- [ ] storefront_generation_started: **PASS / FAIL** — Timestamp: ___________
- [ ] storefront_generation_completed: **PASS / FAIL** — Timestamp: ___________

---

### Test 3: test-domain-003.com
[Repeat Step 1.1 - 1.3 above with test-domain-003.com]

- [ ] domain_submitted: **PASS / FAIL** — Timestamp: ___________
- [ ] brand_extraction_started: **PASS / FAIL** — Timestamp: ___________
- [ ] brand_extraction_completed: **PASS / FAIL** — Timestamp: ___________
- [ ] storefront_generation_started: **PASS / FAIL** — Timestamp: ___________
- [ ] storefront_generation_completed: **PASS / FAIL** — Timestamp: ___________

---

### Test 4: test-domain-004.com
[Repeat Step 1.1 - 1.3 above with test-domain-004.com]

- [ ] domain_submitted: **PASS / FAIL** — Timestamp: ___________
- [ ] brand_extraction_started: **PASS / FAIL** — Timestamp: ___________
- [ ] brand_extraction_completed: **PASS / FAIL** — Timestamp: ___________
- [ ] storefront_generation_started: **PASS / FAIL** — Timestamp: ___________
- [ ] storefront_generation_completed: **PASS / FAIL** — Timestamp: ___________

---

### Test 5: test-domain-005.com
[Repeat Step 1.1 - 1.3 above with test-domain-005.com]

- [ ] domain_submitted: **PASS / FAIL** — Timestamp: ___________
- [ ] brand_extraction_started: **PASS / FAIL** — Timestamp: ___________
- [ ] brand_extraction_completed: **PASS / FAIL** — Timestamp: ___________
- [ ] storefront_generation_started: **PASS / FAIL** — Timestamp: ___________
- [ ] storefront_generation_completed: **PASS / FAIL** — Timestamp: ___________

---

## Part 3: Dashboard Verification

### Objective
Confirm that the /admin/analytics dashboard renders real conversion-funnel data with the test events collected above.

### Step 3.1: Access Admin Dashboard
- [ ] In **incognito window**, navigate to: `https://branded-david-7482s-projects.vercel.app/admin/analytics`
- [ ] HTTP response: **Expected: 200 OK**
  - **Evidence Required:** Screenshot showing URL bar + HTTP 200 (DevTools Network tab)
- [ ] Page loads without errors
  - **Evidence Required:** Screenshot of clean Console (no red errors)

### Step 3.2: Authentication Gate
- [ ] If prompted for login, verify NextAuth authentication flow
- [ ] Login with admin credentials (if required)
- [ ] **Evidence Required:** Screenshot showing authentication completion + dashboard loaded

### Step 3.3: Conversion Funnel Chart Verification
- [ ] Dashboard renders without blank/loading state
- [ ] **Conversion Funnel Chart** is visible (not "No data" message)
- [ ] Chart displays **3+ stages**:
  1. **domain_submitted** — Entry point (should show ≥5)
  2. **brand_extraction_completed** — Mid-funnel
  3. **storefront_generation_completed** — Exit point
- [ ] Event counts match or exceed test submissions:
  - domain_submitted: ≥5
  - brand_extraction_completed: ≥4 (some may fail)
  - storefront_generation_completed: ≥3 (some may fail)
- **Evidence Required:** 
  - Screenshot of full conversion funnel chart
  - Visible event counts for each stage
  - No loading spinners or errors

### Step 3.4: Time-Series Chart Verification
- [ ] Time-Series chart is visible (shows event volume over time)
- [ ] Chart displays **7-day rolling window**
- [ ] Data points appear for the test window (should show spike during test execution)
- [ ] Y-axis shows event counts; X-axis shows dates
- **Evidence Required:** 
  - Screenshot of time-series chart
  - Readable axis labels and legend

### Step 3.5: Event Type Breakdown Verification
- [ ] Event Type breakdown table or chart is visible
- [ ] Lists all event types with counts:
  - domain_submitted: _____ 
  - brand_extraction_started: _____
  - brand_extraction_completed: _____
  - storefront_generation_started: _____
  - storefront_generation_completed: _____
- **Evidence Required:** Screenshot of event breakdown section

### Step 3.6: Console & Error Check
- [ ] Open DevTools Console on the dashboard
- [ ] Verify NO red errors appear
- [ ] Check Network tab for failed API requests (404, 500, etc.)
- **Evidence Required:** Screenshot of clean Console

---

## Part 4: Supabase Analytics Events Table Verification

### Objective
Confirm that events are persisted to `analytics_events` table in Supabase.

### Step 4.1: Supabase Query Execution
**Location:** Supabase Dashboard → SQL Editor

**Query 1: Count recent events (last 2 hours)**
```sql
SELECT COUNT(*) as total_events
FROM analytics_events
WHERE created_at > NOW() - INTERVAL '2 hours';
```

**Expected Result:**
- `total_events >= 5` (minimum from 5 test domains)
- **Evidence Required:** Screenshot of query result showing count

**Query 2: Event distribution by type**
```sql
SELECT 
  event_name,
  COUNT(*) as event_count
FROM analytics_events
WHERE created_at > NOW() - INTERVAL '2 hours'
GROUP BY event_name
ORDER BY event_count DESC;
```

**Expected Results:**
- domain_submitted: ≥5
- brand_extraction_completed: ≥4
- storefront_generation_completed: ≥3
- **Evidence Required:** Screenshot of query result table

**Query 3: Sample event records (with full payload)**
```sql
SELECT 
  id,
  event_name,
  user_session_id,
  event_data,
  created_at
FROM analytics_events
WHERE created_at > NOW() - INTERVAL '2 hours'
ORDER BY created_at DESC
LIMIT 10;
```

**Expected:**
- event_data field populated (not NULL)
- Timestamps recent (within test window)
- **Evidence Required:** Screenshot showing 10 sample records with payloads

### Step 4.2: Data Integrity Checks
- [ ] No NULL values in `event_name` column
- [ ] `created_at` timestamps are recent (within test execution window)
- [ ] `event_data` JSON payload is present and valid
- [ ] All test domains represented in data

---

## Part 5: API Endpoint Verification

### Objective
Confirm that /api/analytics endpoint is responding correctly.

### Step 5.1: Test POST Request
**Endpoint:** `POST https://branded-david-7482s-projects.vercel.app/api/analytics`

**Test Payload:**
```json
{
  "event_name": "test_event",
  "user_session_id": "test-session-001",
  "event_data": {
    "domain": "test-domain.com",
    "test": true
  }
}
```

**Using cURL or Postman:**
```bash
curl -X POST https://branded-david-7482s-projects.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"event_name":"test_event","user_session_id":"test-session-001","event_data":{"domain":"test.com"}}'
```

**Expected Response:**
- HTTP Status: **201 Created**
- Response Body: 
  ```json
  {
    "success": true,
    "event_id": "...",
    "message": "Event recorded"
  }
  ```

- **Evidence Required:** Screenshot of response headers + body

---

## Summary of Verification Results

| Component | Status | Evidence |
|-----------|--------|----------|
| **Command Console - Event Emission** | PASS / FAIL | Event logs in browser console |
| **Event Count (≥5 total)** | PASS / FAIL | Event logs + timestamps |
| **Admin Dashboard - HTTP 200** | PASS / FAIL | Network tab screenshot |
| **Conversion Funnel Chart** | PASS / FAIL | Dashboard screenshot |
| **Time-Series Chart** | PASS / FAIL | Dashboard screenshot |
| **Event Breakdown** | PASS / FAIL | Dashboard screenshot |
| **Supabase - Event Persistence** | PASS / FAIL | SQL query results |
| **API Endpoint - HTTP 201** | PASS / FAIL | cURL/Postman response |
| **Dashboard - No Console Errors** | PASS / FAIL | DevTools screenshot |

---

## Overall Verification Status

**Total Checks Required:** 9 components  
**Checks Passed:** _____ / 9  
**Checks Failed:** _____ / 9  

**FINAL VERDICT:**
- [ ] **GO** — All critical components verified; analytics pipeline is production-ready
- [ ] **CONDITIONAL GO** — Minor issues found; non-blocking; documented below
- [ ] **NO-GO** — Critical issues; analytics instrumentation NOT production-ready

---

## Issues & Blockers

### Critical Issues (Blocking)
1. ___________________________________ (describe issue + impact)
2. ___________________________________ (describe issue + impact)

### Non-Critical Issues (Advisory)
1. ___________________________________ (describe issue + workaround)
2. ___________________________________ (describe issue + workaround)

---

## Recommended Fixes

For any FAILED checks, document recommended actions:

| Failed Component | Root Cause | Recommended Fix | Assigned To | Status |
|------------------|-----------|-----------------|-------------|--------|
| ________________ | __________ | ________________ | ____________ | TBD |
| ________________ | __________ | ________________ | ____________ | TBD |

---

## Sign-Off

- **Verified By:** _________________________ (name + date)
- **Approved By:** _________________________ (product owner / engineering lead)
- **Production Ready:** YES / NO

---

## Appendix: Expected Event Sequence Timeline

For a single domain submission, events should fire in this sequence:

```
T+0s:    user submits domain in Command Console
T+0-2s:  domain_submitted event emitted & logged to console
T+2-5s:  /api/analytics receives domain_submitted
T+5-15s: Brandfetch API call initiates
T+15-30s: brand_extraction_started event fired
T+30-60s: brand_extraction_completed event fired
T+60-120s: Shopify + Printify provisioning
T+120-180s: storefront_generation_started event fired
T+180-240s: storefront_generation_completed event fired
T+240s+: events visible in /admin/analytics dashboard (with 30-60s lag)
```

**Success Criteria for Single Domain:**
- All 5 events fire within 240 seconds (4 minutes)
- All events logged to Supabase within 5 seconds of emission
- Events visible in dashboard within 60 seconds of Supabase insert

---

## Next Steps

1. **Execute Verification:** Follow Part 1-5 sequentially; collect evidence screenshots
2. **Document Results:** Fill in all checkboxes and timestamps above
3. **Resolve Issues:** If any FAIL status, execute recommended fixes and re-test
4. **Sign-Off:** Once all critical checks pass, sign final verdict above
5. **Archive Report:** Save completed report to company knowledge base for future reference

---

**Report Generated:** 2026-06-15  
**Task ID:** Current Analytics Verification Task  
**Related Docs:** Analytics Instrumentation Verification Checklist (knowledge base)
