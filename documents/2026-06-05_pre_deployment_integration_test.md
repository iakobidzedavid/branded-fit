# Pre-Deployment Integration Test Guide
**Date:** 2026-06-05  
**Purpose:** Verify end-to-end functionality locally before Vercel deployment  
**Environment:** Local development (npm run dev) OR staging Vercel preview deployment

---

## Quick Start: Run Full Test Locally

### Prerequisites
```bash
# Ensure environment variables are set
cat .env.local
# Should have:
# NEXT_PUBLIC_SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...
# BRANDFETCH_API_KEY=...
# SHOPIFY_ADMIN_API_KEY=...
# SHOPIFY_ACCESS_TOKEN=...
# SHOPIFY_SHOP_NAME=...
# API_URL=http://localhost:3000
```

### Start Development Server
```bash
npm install
npm run dev
# Output: ▲ Next.js X.X.X
#        ready - started server on 0.0.0.0:3000
```

### Access Command Console
```
Browser: http://localhost:3000/command-console
```

---

## Test Scenarios (Run in Order)

### Scenario 1: Form Validation (No API Calls)

**Test 1.1: Accept Valid Corporate Domain**
```
Input: ramp.com
Expected: No error message, submit button enabled
Actual: _______________
Status: ☐ PASS ☐ FAIL
```

**Test 1.2: Accept Another Valid Domain**
```
Input: vanta.com
Expected: No error message, submit button enabled
Actual: _______________
Status: ☐ PASS ☐ FAIL
```

**Test 1.3: Reject Invalid TLD**
```
Input: localhost.test
Expected: Error message "not a valid corporate domain"
Actual: _______________
Status: ☐ PASS ☐ FAIL
```

**Test 1.4: Reject Malformed Domain**
```
Input: this-is-not-a-domain
Expected: Error message "Invalid domain format"
Actual: _______________
Status: ☐ PASS ☐ FAIL
```

**Test 1.5: Reject Empty Input**
```
Input: (empty)
Expected: Submit button disabled (no error until focus)
Actual: _______________
Status: ☐ PASS ☐ FAIL
```

---

### Scenario 2: Single Domain Orchestration (API Integration)

#### Test 2.1: Submit ramp.com (Complete Flow)

**Prerequisites:**
- Form validation test (1.1) passed
- Environment variables set
- Internet connection active (for Brandfetch + Shopify APIs)

**Steps:**

1. **Clear previous state**
   ```
   [ ] Refresh browser
   [ ] Verify form is empty
   [ ] Open DevTools: F12 → Console
   [ ] Clear console messages
   ```

2. **Input domain**
   ```
   [ ] Type: ramp.com
   [ ] Verify: No validation error
   ```

3. **Submit**
   ```
   [ ] Click "Generate"
   [ ] Verify: Button shows loading state (spinner)
   [ ] Verify: Cannot click again (disabled)
   ```

4. **Monitor Pipeline 1 (Brand Extraction)**
   ```
   Expected sequence:
   ☐ Pipeline 1: Pending → In Progress (within 1 sec)
   ☐ Status message: "Extracting brand assets..."
   ☐ After 2-3 sec: "Found X colors and Y logos"
   ☐ Icon: Spinner → Green checkmark
   
   Actual state:
   ______________________________________________
   ______________________________________________
   
   Status: ☐ PASS ☐ FAIL
   ```

5. **Monitor Pipeline 2 (Mockup Generation)**
   ```
   Expected sequence:
   ☐ Pipeline 2: Pending → In Progress (after 3-4 sec)
   ☐ Status message: "Generating product mockups..."
   ☐ After 3-4 sec: "Generated 5 products with variants"
   ☐ Icon: Spinner → Green checkmark
   
   Actual state:
   ______________________________________________
   ______________________________________________
   
   Status: ☐ PASS ☐ FAIL
   ```

6. **Monitor Pipeline 3 (Storefront Creation)**
   ```
   Expected sequence:
   ☐ Pipeline 3: Pending → In Progress (after 6-7 sec)
   ☐ Status message: "Creating Shopify storefront..."
   ☐ After 3-4 sec: "Storefront created: ramp-branded-fit-XXXXX.myshopify.com"
   ☐ Icon: Spinner → Green checkmark
   
   Actual state:
   ______________________________________________
   ______________________________________________
   
   Status: ☐ PASS ☐ FAIL
   ```

7. **Verify Success State**
   ```
   [ ] All 3 pipelines show green checkmark
   [ ] Total time: < 10 seconds
   [ ] Success message appears
   [ ] Shopify storefront URL is clickable
   [ ] "View Storefront" button visible
   ```

8. **Verify Storefront**
   ```
   [ ] Click "View Storefront" link
   [ ] Expected: Opens ramp-branded-fit-XXXXX.myshopify.com
   [ ] Verify: 5 products visible (T-shirt, Hoodie, Cap, Tote, Notebook)
   [ ] Verify: Colors match ramp's brand colors
   [ ] Record storefront URL: ___________________
   ```

9. **Monitor Network Requests**
   ```
   DevTools → Network tab
   [ ] POST /api/orchestrate (returns orchestration state)
   [ ] Multiple GET /api/pipeline-status requests (polling)
   [ ] Status: All requests return HTTP 200
   ```

10. **Monitor Analytics Events**
    ```
    DevTools → Network tab, filter: "api/analytics"
    Expected events:
    ☐ POST domain_submitted (with domain: "ramp.com")
    ☐ POST brand_extraction_complete (with color_count, logo_count)
    ☐ POST mockup_generation_complete (with mockup_count)
    ☐ POST storefront_generation_complete (with url)
    
    Status: ☐ PASS ☐ FAIL
    ```

11. **Verify Database Writes**
    ```
    Supabase Dashboard:
    [ ] Go to https://app.supabase.com (project)
    [ ] Tables → brand_extracts: See new row for ramp.com
    [ ] Tables → products: See 5 new rows with ramp colors
    [ ] Tables → storefronts: See 1 new row with ramp URL
    [ ] Tables → analytics_events: See 4 new rows
    ```

**Summary:**
```
Domain: ramp.com
Time Elapsed: _________ seconds
Storefront URL: _________________________________
Database Rows Created: ☐ brand_extracts ☐ products ☐ storefronts
Status: ☐ PASS ☐ FAIL
```

---

#### Test 2.2: Submit vanta.com (Repeat Flow)

**Steps:** Repeat Test 2.1 with vanta.com

**Observations:**
```
Domain: vanta.com
Time Elapsed: _________ seconds
Storefront URL: _________________________________
Status: ☐ PASS ☐ FAIL

Notes:
- Compare execution time to ramp.com
- Verify vanta colors are different from ramp
- Verify no cross-domain data contamination
```

---

### Scenario 3: Error Handling & Resilience

#### Test 3.1: Duplicate Domain Submission

**Steps:**
1. Submit ramp.com (from Test 2.1)
2. Wait for completion
3. Try to submit ramp.com again
4. Expected: Form shows error "already processed"

```
Error message: ___________________________________
Status: ☐ PASS ☐ FAIL
```

#### Test 3.2: Invalid API Key (Simulate Failure)

**Steps:**
1. Edit .env.local: `BRANDFETCH_API_KEY=invalid`
2. Restart dev server: `npm run dev`
3. Submit new domain (e.g., linear.app)
4. Expected: Pipeline 1 completes with fallback (generated colors)

```
Expected behavior:
[ ] Pipeline 1: Still completes (with lower confidence)
[ ] Message: "Found X default colors" or similar
[ ] Mockups still generate with fallback colors
[ ] Overall orchestration still succeeds

Actual: ___________________________________
Status: ☐ PASS ☐ FAIL
```

#### Test 3.3: Network Timeout (Simulate Slow Shopify API)

**Steps:**
1. Use Chrome DevTools to simulate slow network:
   - DevTools → Network tab
   - Click throttling dropdown → "Slow 3G"
2. Submit new domain
3. Observe: Orchestration may take longer but should still complete OR fallback gracefully

```
Observed behavior:
[ ] Orchestration completes within 30 seconds
[ ] User sees clear status updates
[ ] No "hanging" or frozen UI
[ ] Either succeeds or fails gracefully

Status: ☐ PASS ☐ FAIL
```

---

### Scenario 4: Real-Time Polling Accuracy

**Test 4.1: Verify Polling Updates Every 2 Seconds**

**Steps:**
1. Open DevTools → Console
2. Submit new domain
3. Watch console for polling requests
4. Measure time between GET /api/pipeline-status requests

```
Expected: ~2 second intervals
Observed intervals: _____________
Acceptable range: 1.8–2.2 seconds

Status: ☐ PASS ☐ FAIL
```

**Test 4.2: Verify No Stale State**

**Steps:**
1. Submit domain
2. Immediately open DevTools → Network
3. Watch for polling requests
4. Verify pipeline status updates progress (not repeating same state)

```
Pipeline 1 status progression:
pending → in_progress (2-3 sec) → completed (2-3 sec)

Pipeline 2 status progression:
pending (3-4 sec) → in_progress (3-4 sec) → completed (3-4 sec)

Status: ☐ PASS ☐ FAIL
```

---

### Scenario 5: UI/UX Verification

#### Test 5.1: Form Accessibility

```
[ ] Label "Domain" is visible and associated with input
[ ] Input has placeholder text "Enter your domain..."
[ ] Submit button has clear label "Generate"
[ ] Error messages are red and visible
[ ] Validation errors appear within 1 second of input
```

#### Test 5.2: Pipeline Status Display

```
[ ] All 3 pipelines have icons (pending/loading/success/error)
[ ] Icons animate correctly (spinner on in_progress)
[ ] Status messages are clear and descriptive
[ ] Success state shows green checkmarks
[ ] Failed state shows red X and error message
```

#### Test 5.3: Mobile Responsiveness

**Steps:**
1. DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Select iPhone 12 (390px width)
3. Repeat Test 2.1 on mobile view

```
[ ] Form fits on screen without horizontal scroll
[ ] Pipeline cards stack vertically
[ ] Status messages are readable
[ ] Buttons are tappable (>44px height)
[ ] No overlapping text or elements

Status: ☐ PASS ☐ FAIL
```

---

### Scenario 6: Console Error Check

**Steps:**
1. Open DevTools: F12
2. Go to Console tab
3. Submit 3 domains and complete flow
4. Note any errors or warnings

```
Expected: No errors (console is clean)
Observed errors:
__________________________________________________
__________________________________________________

Acceptable warnings:
- Deprecation warnings from libraries (acceptable)
- Hydration warnings (acceptable in dev mode)

Status: ☐ PASS ☐ FAIL (only if critical errors)
```

---

## Performance Benchmark

**Measure end-to-end time for 3 domains:**

| Domain | P1 Time | P2 Time | P3 Time | Total | Target | Status |
|--------|---------|---------|---------|-------|--------|--------|
| ramp.com | ___ s | ___ s | ___ s | ___ s | <10s | ☐ |
| vanta.com | ___ s | ___ s | ___ s | ___ s | <10s | ☐ |
| linear.app | ___ s | ___ s | ___ s | ___ s | <10s | ☐ |

**Average Time:** _________ seconds

**Pass Criteria:** All three domains complete in <10 seconds  
**Status:** ☐ PASS ☐ FAIL

---

## Database Verification Checklist

**In Supabase Dashboard:**

### brand_extracts Table
```
Expected columns:
[ ] domain (text)
[ ] colors (JSON array)
[ ] logos (JSON array)
[ ] typography (JSON)
[ ] extraction_confidence_pct (number)
[ ] created_at (timestamp)

Row count after 3 domains: ________
Sample data looks correct: ☐ YES ☐ NO
```

### products Table
```
Expected columns:
[ ] id (UUID)
[ ] domain (text)
[ ] sku (text)
[ ] name (text)
[ ] base_price_cents (number)
[ ] final_price_cents (number)
[ ] colors (JSON array)
[ ] sizes (JSON array)
[ ] mockup_url (text)
[ ] created_at (timestamp)

Row count after 3 domains: ________ (should be 15 = 3 domains × 5 products)
Pricing looks correct (40% markup): ☐ YES ☐ NO
```

### storefronts Table
```
Expected columns:
[ ] id (UUID)
[ ] domain (text)
[ ] shopify_url (text)
[ ] product_count (number)
[ ] created_at (timestamp)

Row count after 3 domains: ________
URLs are valid format: ☐ YES ☐ NO
Product counts are 5: ☐ YES ☐ NO
```

### analytics_events Table
```
Expected columns:
[ ] id (UUID)
[ ] event_name (text)
[ ] event_data (JSON)
[ ] created_at (timestamp)

Total event count after 3 domains: ________ (should be 12 = 3 domains × 4 events)
Event types present:
  [ ] domain_submitted
  [ ] brand_extraction_complete
  [ ] mockup_generation_complete
  [ ] storefront_generation_complete
```

---

## Final Go/No-Go Decision

### Blocking Issues (MUST FIX Before Production)
- [ ] Form submission fails
- [ ] Orchestration doesn't complete
- [ ] Storefront URLs are invalid
- [ ] Database writes failing
- [ ] Console has critical errors
- [ ] Performance > 10 seconds

### Non-Blocking Issues (Can Fix Post-Launch)
- [ ] Minor UI tweaks
- [ ] Analytics event names
- [ ] Error message wording
- [ ] Timeout thresholds

---

## Sign-Off

```
Test Date: _______________
Tested By: _______________
Environment: ☐ Local (npm run dev) ☐ Vercel Preview

All blocking tests passed: ☐ YES ☐ NO

Ready for Vercel production deployment: ☐ YES ☐ NO

Signature: _________________ Date: _________
```

---

## Appendix: Troubleshooting

### Issue: "Form not submitting"
**Debug steps:**
1. Check browser console (F12) for errors
2. Check Network tab: POST /api/orchestrate should show 200 status
3. Verify API_URL environment variable is set
4. Check Vercel logs if deployed

### Issue: "Pipeline stuck on pending"
**Debug steps:**
1. Check Network tab for GET /api/pipeline-status requests
2. Verify polling is working (should see requests every 2 sec)
3. Check API_KEY environment variables
4. Try refreshing page

### Issue: "Storefront URL is mock/invalid"
**Debug steps:**
1. This is expected fallback behavior (Shopify API down)
2. Not a blocker for launch
3. Will work once Shopify API is available

### Issue: "Database writes not persisting"
**Debug steps:**
1. Verify SUPABASE_SERVICE_ROLE_KEY is set
2. Check Supabase Dashboard for any SQL errors
3. Verify database is not full/quota exceeded
4. Check firewall/VPN not blocking Supabase

---

## Success Summary

If you've checked off:
- ✅ All Form Validation tests (1.1–1.5)
- ✅ All Orchestration tests (2.1–2.2)
- ✅ All Error Handling tests (3.1–3.3)
- ✅ Polling Accuracy tests (4.1–4.2)
- ✅ UI/UX tests (5.1–5.3)
- ✅ Console is clean (6)
- ✅ All 3 domains complete <10 seconds
- ✅ Database has correct rows
- ✅ No blocking issues

**THEN YOU ARE READY FOR VERCEL PRODUCTION DEPLOYMENT! 🚀**
