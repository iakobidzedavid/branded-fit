# Analytics Instrumentation Verification Framework
**Date:** 2026-06-15  
**Status:** Ready for Execution  
**Purpose:** Live verification protocol for analytics event emission on production Vercel deployment

---

## EXECUTIVE SUMMARY
This document provides a step-by-step execution framework for verifying that the analytics instrumentation is actively emitting, persisting, and rendering real conversion-funnel data on the live Branded Fit deployment at https://branded-david-7482s-projects.vercel.app.

**Success Criteria:**
- ✅ Command Console is accessible and domain input form is functional
- ✅ Event emitters fire for ≥5 test domain submissions across the conversion funnel
- ✅ Events persist in Supabase analytics_events table with correct timestamps
- ✅ /admin/analytics dashboard renders without errors
- ✅ Conversion funnel chart displays real event data (domain_submitted → brand_extraction_completed → storefront_generation_completed)
- ✅ Time-series chart shows event volume over test window
- ✅ No console errors or missing events in the pipeline

---

## PART 1: PRE-VERIFICATION CHECKLIST

### 1.1 Environment Verification
- [ ] Vercel deployment is accessible (no 500 errors, no downtime alerts)
- [ ] Supabase database is responding to queries
- [ ] NextAuth credentials are configured in Vercel env vars
- [ ] All required API endpoints are deployed:
  - [ ] `/api/analytics` (POST event submission)
  - [ ] `/admin/analytics` (dashboard, auth-gated)
  - [ ] `/command-console` (domain input form)

### 1.2 Browser Setup
- [ ] Use **incognito/private window** to avoid cached login state
- [ ] Open **Developer Tools** (F12) with **Console** tab visible
- [ ] Enable **Network** tab to monitor API calls to `/api/analytics`
- [ ] Note: Look for network requests to `https://[supabase-project].supabase.co` for real-time table inserts

---

## PART 2: COMMAND CONSOLE EVENT EMISSION VERIFICATION

### 2.1 First Test Domain Submission
**Domain:** `test-domain-1-$(date +%s).com` (use current timestamp to ensure uniqueness)

**Steps:**
1. Navigate to: `https://branded-david-7482s-projects.vercel.app/command-console`
2. Verify page loads with HTTP 200 (check network tab)
3. Verify custom UI is visible (not blank/default page)
4. **Open Browser Console** (F12 → Console tab)
5. Enter domain in input field
6. Click "Submit" or equivalent CTA
7. **Watch Console for event logs** (should see output like: `console.log("Event emitted:", {event_name: "domain_submitted", ...})`)
8. **Check Network tab** for POST request to `/api/analytics`
9. Verify response status is **HTTP 201** (or 200 if successful)
10. Response payload should include: `{success: true, event_id: "...", timestamp: "..."}`

**Expected Console Output (REQUIRED):**
```
Event emitted: {
  event_name: "domain_submitted",
  domain: "test-domain-1-xxxxxxxxxx.com",
  timestamp: "2026-06-15T14:30:00Z",
  user_session_id: "..."
}
```

**Screenshot 1 (CRITICAL):** Capture browser console showing domain_submitted event emission.

---

### 2.2 Monitor Brand Extraction Pipeline (30-60 seconds)
After domain submission, the backend should begin the Brandfetch → Printify → Shopify orchestration.

**Expected Events (in sequence):**
1. `brand_extraction_started` — Brandfetch API call initiated
2. `brand_extraction_completed` — Brand data extracted successfully
3. `storefront_generation_started` — Printify mockup generation initiated
4. `storefront_generation_completed` — Storefront preview ready

**Monitoring Instructions:**
1. Leave Console open and watch for event logs
2. Check Network tab for sequential POST requests to `/api/analytics`
3. Each event should have:
   - `event_name: "brand_extraction_started"` | `"brand_extraction_completed"` | `"storefront_generation_started"` | `"storefront_generation_completed"`
   - `domain: "test-domain-1-..."` (same as submitted)
   - `timestamp: "2026-06-15T14:xx:xxZ"`
   - `event_id: "uuid"` (unique per event)

**Time SLA:** All 4 events should complete within **10 minutes** (600 seconds). If exceeding this, note as blocker.

**Screenshot 2 (CRITICAL):** Capture console showing brand_extraction_completed and storefront_generation_completed events.

**Screenshot 3 (NICE-TO-HAVE):** Capture Network tab showing POST requests to `/api/analytics` with HTTP 201 responses.

---

### 2.3 Additional Test Domains (Repeat for 2-4 More Domains)
To collect ≥5 total events across the funnel:

**Domain 2:** `test-domain-2-$(date +%s).com`
- Repeat steps 2.1–2.2
- **Screenshot 4:** Console showing domain_submitted for Domain 2
- **Screenshot 5:** Console showing brand_extraction_completed and storefront_generation_completed for Domain 2

**Domain 3, 4, 5 (if time allows):**
- Repeat same process
- Minimum requirement: ≥5 events total (e.g., 2 domains with 2-3 events each, or 1 domain with 5 events)

---

## PART 3: SUPABASE VERIFICATION

### 3.1 Query Supabase analytics_events Table
**Purpose:** Confirm that all emitted events are persisted in the database.

**Steps:**
1. Log into Supabase dashboard: `https://app.supabase.com`
2. Select project: `[your-branded-fit-project]`
3. Navigate to **SQL Editor**
4. Run the following query:
   ```sql
   SELECT 
     id, 
     event_name, 
     domain, 
     created_at, 
     properties 
   FROM analytics_events 
   WHERE created_at > NOW() - INTERVAL '1 hour'
   ORDER BY created_at DESC
   LIMIT 50;
   ```
5. **Expected Result:** 5+ rows, with event_name values:
   - `domain_submitted` (1+ rows)
   - `brand_extraction_started` (1+ rows)
   - `brand_extraction_completed` (1+ rows)
   - `storefront_generation_started` (1+ rows)
   - `storefront_generation_completed` (1+ rows)

**Screenshot 6 (CRITICAL):** Capture Supabase SQL query results showing all event rows with timestamps and properties.

### 3.2 Event Count by Type
**Purpose:** Verify event distribution matches expectations.

**Query:**
```sql
SELECT 
  event_name, 
  COUNT(*) as event_count,
  MIN(created_at) as first_event,
  MAX(created_at) as last_event
FROM analytics_events
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY event_name
ORDER BY event_count DESC;
```

**Expected Output:**
| event_name | event_count | first_event | last_event |
|---|---|---|---|
| domain_submitted | ≥2 | 2026-06-15 14:30:00 | 2026-06-15 14:45:00 |
| brand_extraction_completed | ≥2 | 2026-06-15 14:30:30 | 2026-06-15 14:46:00 |
| storefront_generation_completed | ≥2 | 2026-06-15 14:31:00 | 2026-06-15 14:47:00 |

**Screenshot 7 (NICE-TO-HAVE):** Capture event count aggregation query.

---

## PART 4: /admin/analytics DASHBOARD VERIFICATION

### 4.1 Dashboard Accessibility & Auth Gate
**Steps:**
1. Navigate to: `https://branded-david-7482s-projects.vercel.app/admin/analytics`
2. **If redirected to login:** Dashboard auth gate is working ✅
3. Log in with valid credentials (should have been set up in NextAuth config)
4. Verify page loads with HTTP 200

**Screenshot 8 (CRITICAL):** Capture /admin/analytics dashboard landing (post-login).

### 4.2 Conversion Funnel Chart
**Expected Rendering:**
- Chart displays 3+ stages: `domain_submitted` → `brand_extraction_completed` → `storefront_generation_completed`
- Y-axis shows event counts (should be ≥2 per stage based on our test submissions)
- X-axis shows stage labels or time intervals
- Visual representation: bar chart or funnel chart (drop-off expected at each stage is normal)

**Critical Check:**
- [ ] Chart renders without JavaScript errors
- [ ] Data is real (not placeholder/seeded data from previous tests)
- [ ] Event counts match Supabase query results from Part 3.2
- [ ] No "Loading..." or "No data" messages

**Screenshot 9 (CRITICAL):** Capture conversion funnel chart with ≥5 real events visible.

**Metric to Document:**
- Conversion rate from `domain_submitted` to `storefront_generation_completed` (expected: 70-90% if pipeline is healthy)

### 4.3 Time-Series Chart
**Expected Rendering:**
- Chart shows event volume over the test window (last 1 hour)
- X-axis: time (e.g., 14:30, 14:40, 14:50, etc.)
- Y-axis: event count
- Data points correspond to when you submitted test domains

**Critical Check:**
- [ ] Chart renders without errors
- [ ] Spikes align with your test domain submissions (e.g., spike at 14:30 when you submitted Domain 1)
- [ ] Granularity is readable (hourly or 15-min buckets)

**Screenshot 10 (NICE-TO-HAVE):** Capture time-series chart showing event distribution over test window.

### 4.4 Event Type Breakdown
**Expected Rendering (if dashboard includes this widget):**
- Table or pie chart showing count by event_name:
  - `domain_submitted: N`
  - `brand_extraction_started: N`
  - `brand_extraction_completed: N`
  - `storefront_generation_started: N`
  - `storefront_generation_completed: N`

**Screenshot 11 (NICE-TO-HAVE):** Capture event-type breakdown widget.

---

## PART 5: ERROR HANDLING & BLOCKERS

### 5.1 Console Errors
**Check:** Open browser DevTools Console (F12 → Console tab) throughout entire test.

**FAIL CONDITIONS (mark test as BLOCKED):**
- Uncaught JavaScript errors (red "X" in console)
- Network errors to `/api/analytics` (HTTP 4xx or 5xx responses)
- CORS errors (Access-Control-Allow-Origin violations)
- Database connection errors in Supabase query

**If errors present:** Screenshot the error message and note the exact error text.

### 5.2 Missing Events in Pipeline
**FAIL CONDITION:** Any of the expected events are missing from Supabase after 10 minutes.

**Diagnostics:**
- Check browser network tab for failed POST requests to `/api/analytics`
- Query Supabase for incomplete event chains (e.g., `domain_submitted` without `brand_extraction_completed`)
- Check Vercel deployment logs for backend errors

### 5.3 Dashboard Rendering Issues
**FAIL CONDITION:** Dashboard loads but charts don't render or show "Loading..." indefinitely.

**Diagnostics:**
- Check browser console for JavaScript errors
- Check Network tab for failed requests to `/api/analytics?...` (dashboard data endpoint)
- Verify NextAuth session is valid (check cookies in DevTools)

---

## PART 6: FINAL DOCUMENTATION

### 6.1 Event Emission Log Template
Create a table documenting all events emitted during the test:

| Test # | Domain | Event Name | Expected | Observed | Timestamp | Status |
|---|---|---|---|---|---|---|
| 1 | test-domain-1-... | domain_submitted | ✓ | ✓ | 2026-06-15 14:30:00 | ✅ |
| 1 | test-domain-1-... | brand_extraction_started | ✓ | ✓ | 2026-06-15 14:30:30 | ✅ |
| 1 | test-domain-1-... | brand_extraction_completed | ✓ | ✓ | 2026-06-15 14:31:00 | ✅ |
| 1 | test-domain-1-... | storefront_generation_completed | ✓ | ✓ | 2026-06-15 14:32:00 | ✅ |
| 2 | test-domain-2-... | domain_submitted | ✓ | ✓ | 2026-06-15 14:35:00 | ✅ |
| ... | ... | ... | ... | ... | ... | ... |

**Interpretation:**
- ✅ PASS: All expected events emitted and persisted
- ⚠️ WARN: Some events missing but not critical (e.g., 3/4 events per domain)
- ❌ FAIL: Major events missing or pipeline incomplete

### 6.2 Go/No-Go Criteria

**GO (Proceed to Production):**
- ✅ All 5+ test events emitted and visible in browser console
- ✅ All events persisted in Supabase with correct timestamps
- ✅ /admin/analytics dashboard loads and displays real event data
- ✅ Conversion funnel chart shows ≥5 events across 3+ stages
- ✅ No critical JavaScript or database errors
- ✅ Event pipeline latency <10 minutes for full cycle (domain_submitted → storefront_generation_completed)

**PIVOT (Minor Issues, Fixable):**
- ⚠️ 1-2 events missing due to timing issues (re-run test)
- ⚠️ Dashboard renders but time-series chart is blank (data endpoint lag)
- ⚠️ One event type not emitting (backend log required to diagnose)

**NO-GO (Block from Production):**
- ❌ Events not persisting in Supabase (database connection broken)
- ❌ /api/analytics endpoint returns HTTP 5xx consistently
- ❌ /admin/analytics dashboard inaccessible or renders blank
- ❌ Multiple events missing across different test domains
- ❌ Console shows unhandled JavaScript errors in analytics code

---

## PART 7: SCREENSHOT CHECKLIST

| Screenshot # | Description | Purpose | Status |
|---|---|---|---|
| 1 | Browser console showing domain_submitted event | Proof of event emission | ☐ REQUIRED |
| 2 | Console showing brand_extraction_completed + storefront_generation_completed | Proof of pipeline completion | ☐ REQUIRED |
| 3 | Network tab showing /api/analytics POST with HTTP 201 | Proof of API endpoint working | ☐ NICE-TO-HAVE |
| 4 | Console for Domain 2 domain_submitted | Additional test confirmation | ☐ REQUIRED (if doing 2+ domains) |
| 5 | Console for Domain 2 final events | Additional test confirmation | ☐ REQUIRED (if doing 2+ domains) |
| 6 | Supabase query results (analytics_events table) | Proof of persistence | ☐ REQUIRED |
| 7 | Supabase event count aggregation | Proof of event distribution | ☐ NICE-TO-HAVE |
| 8 | /admin/analytics dashboard landing page | Dashboard accessibility | ☐ REQUIRED |
| 9 | Conversion funnel chart with real data | Core deliverable proof | ☐ REQUIRED |
| 10 | Time-series chart showing event distribution | Data visualization validation | ☐ NICE-TO-HAVE |
| 11 | Event type breakdown widget | Data aggregation validation | ☐ NICE-TO-HAVE |

**Minimum Viable Verification:** Screenshots 1, 2, 6, 8, 9 (5 critical screenshots)

---

## PART 8: EXECUTION TIMELINE

| Phase | Duration | Action |
|---|---|---|
| Pre-Verification | 5 min | Environment checks, browser setup |
| Test 1 Domain | 10 min | Submit domain, monitor events (30-60 sec per event) |
| Test 2-4 Domains | 20-40 min | Repeat domain submissions |
| Supabase Verification | 10 min | Query analytics_events table |
| Dashboard Verification | 10 min | Load /admin/analytics, verify charts |
| Documentation | 10 min | Compile event log, take final screenshots |
| **TOTAL** | **45-75 min** | Entire verification cycle |

---

## SUMMARY: READY FOR EXECUTION

This framework provides:
- ✅ 11-step verification protocol (no guessing)
- ✅ 11 critical/nice-to-have screenshots (clear success criteria)
- ✅ Supabase queries (objective database confirmation)
- ✅ Event emission log template (traceable evidence)
- ✅ Go/No-Go decision criteria (clear pass/fail)
- ✅ 45-75 minute timeline (realistic execution window)

**Next Action:** Execute this framework on live https://branded-david-7482s-projects.vercel.app deployment. Document all findings in event emission log. Proceed only if all REQUIRED screenshots captured and Go criteria met.

---

**Framework Version:** 1.0  
**Status:** Production-Ready for Execution  
**Created:** 2026-06-15  
**Last Updated:** 2026-06-15
