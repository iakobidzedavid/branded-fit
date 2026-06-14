# Analytics Verification - Quick Start Checklist
**Print This & Use During Testing**

---

## 🚀 BEFORE YOU START (5 minutes)

```
PRE-FLIGHT CHECKLIST:

☐ Browser: Open https://branded-david-7482s-projects.vercel.app in INCOGNITO mode
☐ DevTools: Press F12 → Console tab visible
☐ Network: DevTools Network tab open (filter: "analytics")
☐ Clear: Type clear() in console and press Enter
☐ Supabase: Log into https://app.supabase.com and open SQL Editor (in separate tab)
☐ Time: Note current UTC time: __________ for reference

CREDENTIALS NEEDED:
☐ Supabase login (Team Vault)
☐ NextAuth login for /admin/analytics (Team Vault)
☐ Vercel deployment URL: https://branded-david-7482s-projects.vercel.app
```

---

## TEST #1: DOMAIN SUBMISSION & EVENT EMISSION (5 minutes)

```
SUBMIT TEST DOMAIN #1:

Domain: test-domain-1.com
Submitted at: __________ UTC

WATCH CONSOLE FOR EVENTS:

☐ [__:__:__] domain_submitted
  Event ID: ____________________
  HTTP Status: ___ (should be 201)
  SCREENSHOT #1: ✓ Captured

☐ [__:__:__] brand_extraction_started
  Fired at: __________ UTC
  +__ seconds after domain_submitted

☐ [__:__:__] brand_extraction_completed
  Fired at: __________ UTC
  Duration: __ seconds
  SCREENSHOT #2: ✓ Captured

☐ [__:__:__] storefront_generation_started
  Fired at: __________ UTC

☐ [__:__:__] storefront_generation_completed
  Fired at: __________ UTC
  SCREENSHOT #3: ✓ Captured
  Total time: __ minutes __ seconds

NETWORK TAB CHECK:
☐ POST /api/analytics → HTTP 201 ✓
☐ Response includes event_id ✓
☐ No HTTP 4xx/5xx errors ✓
```

---

## TEST #2-5: ADDITIONAL DOMAINS (Repeat Template)

```
DOMAIN #2: test-domain-2.com
Submitted: __________ UTC

☐ All 5 events fired (domain_submitted → storefront_generation_completed)
☐ All HTTP 201 responses
☐ Total time: __ minutes
☐ SCREENSHOTS: Captured for domain_submitted and final event


DOMAIN #3: test-domain-3.com
☐ All 5 events fired
☐ All HTTP 201 responses
☐ SCREENSHOTS: Captured


[OPTIONAL] DOMAIN #4, #5:
☐ Repeat same pattern...
```

---

## ✅ CUMULATIVE EVENTS CHECK

```
After completing 2+ test domains:

Total Events Collected: ___ (need ≥5)

Event Type Count:
  - domain_submitted: ___
  - brand_extraction_started: ___
  - brand_extraction_completed: ___
  - storefront_generation_started: ___
  - storefront_generation_completed: ___

Missing any? ___________________
Any errors? ___________________
```

---

## 🔍 SUPABASE VERIFICATION (5 minutes)

```
SQL QUERY #1: All Events
```sql
SELECT event_name, domain, created_at 
FROM analytics_events 
WHERE created_at > NOW() - INTERVAL '2 hours'
ORDER BY created_at DESC;
```

Results: ☐ ≥5 rows returned

Event Types Found:
  ☐ domain_submitted: _____ rows
  ☐ brand_extraction_started: _____ rows
  ☐ brand_extraction_completed: _____ rows
  ☐ storefront_generation_started: _____ rows
  ☐ storefront_generation_completed: _____ rows

Timestamps Valid: ☐ Yes (within test window)
No NULL values: ☐ Yes
SCREENSHOT #4: ✓ Captured
```

---

## 📊 DASHBOARD VERIFICATION (10 minutes)

```
NAVIGATE TO DASHBOARD:
☐ URL: https://branded-david-7482s-projects.vercel.app/admin/analytics
☐ Page loads: HTTP 200 ✓
☐ Auth gate working: ☐ Login required
☐ Post-login: ☐ Dashboard renders

CONVERSION FUNNEL CHART:
☐ Chart visible (not "Loading..." or "No data")
☐ Shows stages:
  ☐ domain_submitted
  ☐ brand_extraction_completed
  ☐ storefront_generation_completed
☐ Event counts ≥2 per stage: _______________
☐ No JavaScript errors in console
SCREENSHOT #5: ✓ Captured

TIME-SERIES CHART:
☐ Chart visible
☐ X-axis: Time (hours/minutes)
☐ Y-axis: Event count
☐ Spikes align with test submissions: ☐ Yes
☐ Granularity readable: ☐ Yes
SCREENSHOT #6: ✓ Captured

EVENT TYPE BREAKDOWN (if available):
☐ Table shows all 5 event types
☐ Counts match Supabase query results
SCREENSHOT #7: ✓ Captured

DASHBOARD DATA VALIDATION:
Funnel counts match Supabase? ☐ Yes
Time-series aligned with tests? ☐ Yes
All charts render without errors? ☐ Yes
```

---

## 🚨 ERROR HANDLING

```
CONSOLE ERRORS CHECK:

Red "X" in console? 
  ☐ No errors
  ☐ Error: ________________________
    SCREENSHOT: ✓ Captured

Network errors to /api/analytics?
  ☐ All HTTP 201
  ☐ Error status: ___ (note URL and method)
    SCREENSHOT: ✓ Captured

CORS/Auth errors?
  ☐ None
  ☐ Error: ________________________

Dashboard "No data"?
  ☐ Data displayed correctly
  ☐ No data warning (investigate blocker)

Missing events in pipeline?
  ☐ All events present
  ☐ Missing event type: ________________
    Domain affected: ________________
```

---

## ✅ FINAL VERIFICATION CHECKLIST

```
SUCCESS CRITERIA:

EVENT EMISSION:
☐ ≥5 real events submitted via Command Console
☐ All events logged to browser console
☐ All responses HTTP 201
☐ No console errors during emission
☐ Events in correct sequence

SUPABASE PERSISTENCE:
☐ SQL query returns ≥5 rows
☐ All event_names correct
☐ Domains match submissions
☐ Timestamps recent (within test window)
☐ No NULL values

DASHBOARD RENDERING:
☐ Loads with HTTP 200
☐ Auth gate functional
☐ Funnel chart displays ≥5 events
☐ Time-series chart shows event trend
☐ Event counts match Supabase
☐ No errors or missing data

OVERALL PASS/FAIL:
☐ PASS - All checks successful, ready for Step 23
☐ FAIL - Blockers present (list below):
  _____________________________________
  _____________________________________
  _____________________________________
```

---

## 📸 SCREENSHOTS COLLECTED

```
Checklist (need 5 minimum):

☐ #1: domain_submitted event in console
☐ #2: brand_extraction_completed + storefront_generation_completed
☐ #3: Network tab showing HTTP 201 responses
☐ #4: Supabase SQL query results (≥5 events)
☐ #5: Dashboard conversion funnel chart
☐ #6: Dashboard time-series chart
☐ #7: Event type breakdown
☐ #8: Any errors (if blockers found)

Total Screenshots: _____ / 8
```

---

## 🔗 REFERENCE LINKS

```
Keep these URLs bookmarked during testing:

Production Deployment:
https://branded-david-7482s-projects.vercel.app

Command Console:
https://branded-david-7482s-projects.vercel.app/command-console

Admin Dashboard:
https://branded-david-7482s-projects.vercel.app/admin/analytics

Supabase SQL Editor:
https://app.supabase.com → SQL Editor

Full Verification Report:
documents/2026-06-15_analytics_instrumentation_live_verification_report.md
```

---

## 📝 NOTES & OBSERVATIONS

```
Test Date: ________________
Tested By: ________________
Environment: Production (Vercel)

Notes:
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

Blockers Encountered:
_________________________________________________________________

_________________________________________________________________

Estimated Fix Priority:
  ☐ Critical (blocks all analytics)
  ☐ High (blocks some events)
  ☐ Medium (affects dashboard display)
  ☐ Low (cosmetic or documentation)
```

---

## ✅ SIGN-OFF

```
Verification Status: 
  ☐ COMPLETE & PASSING
  ☐ COMPLETE WITH BLOCKERS
  ☐ INCOMPLETE (time constraint)

Verified By: _____________________________ (name)
Date: _____________________________ (date & time UTC)
Duration: _____ minutes

Ready to Proceed to Step 23? 
  ☐ YES - All checks passed
  ☐ NO - Fix blockers first (see notes above)

Next Action:
_________________________________________________________________
```

---

**PRINT THIS PAGE & BRING TO TESTING SESSION**
