# End-to-End Provisioning Test Execution Plan
## 3 Real Customer Domains: Ramp, Vanta, Linear

**Date:** June 5, 2026  
**Status:** Execution Protocol  
**Target:** Measure 10-min SLA, brand-extraction fidelity, and mockup quality  
**Baseline:** All tests complete within 10 minutes; fidelity ≥8/10; mockup quality ≥7/10

---

## Executive Summary

This document establishes the protocol for executing 3 end-to-end provisioning tests on real customer domains (Ramp, Vanta, Linear) via the live Branded Fit MVBP at https://branded-fit.vercel.app. Each test will:

1. **Measure provisioning speed** — total time from domain input → live Shopify storefront
2. **Measure brand-extraction fidelity** — compare extracted brand data (logo, colors, fonts) to actual brand guidelines
3. **Measure mockup quality** — visual assessment of generated product mockups
4. **Log all metrics** to the analytics_events table with event_name='provisioning_test'

**Success Criteria:**
- ✅ **Provisioning Time:** All 3 tests complete **<10 minutes** (SLA achievement)
- ✅ **Fidelity Scores:** All 3 tests score **≥8/10** (1=off, 10=pixel-perfect)
- ✅ **Mockup Quality:** All 3 tests score **≥7/10** (visual appeal & on-brand)
- ✅ **Zero Critical Errors:** No API failures, missing logos, or failed pipeline stages

---

## Test Domains

### Domain 1: Ramp (ramp.com)

**Description:** Spend management platform for growing companies  
**Official Brand Resources:**
- Logo: https://ramp.com (check navbar/hero)
- Color Palette: Primary blue (#1F2937 Graphite, #2563EB Electric Blue)
- Typography: Inter, Helvetica (modern sans-serif)
- Brand Book: Likely modern fintech branding

**Extraction Targets:**
- Logo detection: Ramp wordmark + icon
- Primary color: Electric blue or graphite
- Font family: Sans-serif (likely Inter or Helvetica)

---

### Domain 2: Vanta (vanta.com)

**Description:** Trust & security automation platform  
**Official Brand Resources:**
- Logo: https://vanta.com (check navbar)
- Color Palette: Primary dark blue (#0F172A Navy, #3B82F6 Sky Blue)
- Typography: Clean sans-serif (likely Inter or Roboto)
- Brand Positioning: Enterprise security/compliance

**Extraction Targets:**
- Logo detection: Vanta shield/wordmark
- Primary color: Navy or sky blue
- Font family: Sans-serif corporate

---

### Domain 3: Linear (linear.app)

**Description:** Issue tracking & project management  
**Official Brand Resources:**
- Logo: https://linear.app (check navbar)
- Color Palette: Modern gradient (purples, blues)
- Typography: Geometric sans-serif (likely Inter, Work Sans)
- Brand Style: Minimal, modern developer tool

**Extraction Targets:**
- Logo detection: Linear geometric mark
- Primary color: Purple or blue
- Font family: Geometric sans-serif

---

## Test Execution Protocol

### Phase 1: Pre-Test Setup (T0 to T0+2 min)

**Actions:**
1. Open https://branded-fit.vercel.app in browser
2. Navigate to `/command-console` route
3. Have test data sheet open (see Appendix: Test Data Template)
4. Open browser DevTools → Network tab (to capture timing)
5. Open browser DevTools → Console (to observe event logs)

**Timing Reference:** Record start time as **T0**

---

### Phase 2: Domain Submission & Real-Time Monitoring (T0 to T0+10 min)

**For each domain (Ramp, Vanta, Linear):**

#### Step 1: Input Domain (T0)
- Enter domain in the "Command Console" form field
- Click "Submit Domain" button
- Record submission timestamp
- Log event: `domain_submitted` → domain={test_domain}

#### Step 2: Monitor Pipeline 1 (Brand Extraction) – T0 to T0+2 min
- Watch the UI status panel for "Brand Extraction: In Progress"
- Observe real-time updates on extracted data:
  - **Logo URL:** Check if valid image link returned
  - **Colors:** Verify array of hex codes (e.g., `["#2563EB", "#1F2937"]`)
  - **Typography:** Check if font names detected (e.g., "Inter", "Helvetica")
  - **Confidence Score:** Note the extraction_confidence_pct value
- Record timestamp when status changes to "Brand Extraction: Complete"
- Screenshot the extracted brand DNA panel
- Log event: `brand_extraction_complete` → status=completed, fidelity_score={score}

#### Step 3: Monitor Pipeline 2 (Mockup Generation) – T0+2 min to T0+5 min
- Watch status panel for "Mockup Generation: In Progress"
- Observe progress indicator (should show product count incrementing)
- Record product count when complete (target: 5 products)
- Screenshot a sample product mockup (e.g., the first T-shirt mockup)
- Visually assess mockup quality:
  - Does the brand logo appear on the mockup?
  - Are the brand colors applied correctly?
  - Does the layout look professional/on-brand?
- Record timestamp when status changes to "Mockup Generation: Complete"
- Log event: `mockup_generation_complete` → status=completed, product_count={count}

#### Step 4: Monitor Pipeline 3 (Storefront Generation) – T0+5 min to T0+10 min
- Watch status panel for "Storefront Generation: In Progress"
- Observe Shopify integration status
- Record Shopify URL when available (e.g., `https://{subdomain}.myshopify.com`)
- Verify storefront is live by clicking the URL
- Log event: `storefront_generation_complete` → status=completed, storefront_url={url}

#### Step 5: Calculate End-to-End Time
- Total time = timestamp(complete) - timestamp(submit)
- Target: < 10 minutes (600 seconds)
- Record result in test data sheet

---

### Phase 3: Brand Extraction Fidelity Assessment (T0+10 min to T0+15 min)

**For each domain, after provisioning completes:**

#### Comparison Method: Visual Audit
1. **Open Source Brand Guidelines:**
   - Visit each domain's official website
   - Screenshot the header/hero section (logo)
   - Screenshot the color palette (primary/secondary colors)
   - Screenshot typography samples

2. **Compare Extracted vs. Actual:**
   - Open the test data sheet with extracted brand data
   - Place extracted logo URL next to actual logo
   - Compare hex codes: extracted colors vs. actual brand colors
   - Assess typography: extracted font names vs. actual fonts used

3. **Scoring Scale (1–10):**
   ```
   10 = Pixel-perfect match — extracted data matches actual brand exactly
   9  = Excellent match — minor color/font deviation (<2% visual difference)
   8  = Good match — ~80% accuracy, usable but some tuning needed
   7  = Acceptable match — ~70% accuracy, mostly correct with noticeable differences
   6  = Fair match — ~60% accuracy, some critical elements off
   5  = Weak match — ~50% accuracy, significant misses
   4  = Poor match — ~40% accuracy, many errors
   3  = Very poor — ~30% accuracy, mostly wrong
   2  = Severely off — ~20% accuracy, very few correct elements
   1  = Completely wrong — <10% accuracy, unusable
   ```

4. **Document Findings:**
   - Record logo fidelity score (1–10)
   - Record color fidelity score (1–10)
   - Record typography fidelity score (1–10)
   - Calculate **overall fidelity score** = (logo + color + typography) / 3
   - Record any errors or fallbacks (e.g., "font detection failed, using system default")

---

### Phase 4: Mockup Quality Assessment (T0+15 min to T0+18 min)

**For each domain, after provisioning completes:**

#### Visual Quality Audit
1. **Access Storefront Preview:**
   - Click the storefront URL from the Command Console
   - Browse product listing pages
   - Select 2–3 products and view mockups

2. **Quality Scoring (1–10):**
   ```
   10 = Premium — mockups look professional, brand colors/logo perfectly applied, hero imagery excellent
   9  = Excellent — very minor visual issues, highly professional
   8  = Very good — looks professional, minor color/alignment issues
   7  = Good — acceptable visual quality, appears on-brand, minor refinements needed
   6  = Fair — decent quality but noticeable alignment/color issues
   5  = Acceptable — mockups are usable but lack polish
   4  = Poor — mockups have significant visual issues
   3  = Very poor — mockups appear unprofessional
   2  = Severely flawed — major visual defects
   1  = Unusable — mockups are broken or unusable
   ```

3. **Specific Quality Checks:**
   - ✅ Logo positioning on mockup (centered, correct size)
   - ✅ Color accuracy (brand colors match applied colors)
   - ✅ Text legibility (if any text on mockup)
   - ✅ Overall composition (balanced, professional)
   - ✅ Mockup style consistency across products

4. **Document Findings:**
   - Record overall mockup quality score (1–10)
   - Note specific issues (if any)
   - Record any visual defects or missing elements

---

## Test Data Template

For each domain, record the following:

```json
{
  "test_id": "provisioning_test_001",
  "domain": "ramp.com",
  "test_timestamp": "2026-06-05T14:30:00Z",
  "submission_timestamp": "2026-06-05T14:30:15Z",
  "completion_timestamp": "2026-06-05T14:38:45Z",
  "provisioning_time_minutes": 8.5,
  "provisioning_time_seconds": 510,
  "provisioning_sla_achieved": true,
  "brand_extraction": {
    "status": "completed",
    "logo_url": "https://...",
    "colors": [
      { "hex": "#2563EB", "type": "primary" },
      { "hex": "#1F2937", "type": "secondary" }
    ],
    "typography": {
      "primary": "Inter",
      "secondary": "Helvetica"
    },
    "extraction_confidence_pct": 85,
    "logo_fidelity_score": 9,
    "color_fidelity_score": 8,
    "typography_fidelity_score": 7,
    "overall_fidelity_score": 8.0,
    "errors": []
  },
  "mockup_generation": {
    "status": "completed",
    "product_count": 5,
    "mockup_quality_score": 8,
    "quality_notes": "Excellent brand application, minor alignment issues on hoodie"
  },
  "storefront_generation": {
    "status": "completed",
    "shopify_url": "https://ramp-branded-drop.myshopify.com",
    "product_count_live": 5
  },
  "test_result": "PASS",
  "result_summary": "All SLAs achieved: provisioning <10min (8.5min), fidelity 8.0/10, mockup quality 8/10"
}
```

---

## Success/Failure Criteria

### PASS Criteria (All must be met):
- ✅ Provisioning time < 10 minutes
- ✅ Brand extraction fidelity score ≥ 8/10
- ✅ Mockup quality score ≥ 7/10
- ✅ No critical errors (API failures, missing logos, etc.)
- ✅ Storefront is live and accessible

### FAIL Criteria (Any one triggers failure):
- ❌ Provisioning time ≥ 10 minutes
- ❌ Brand extraction fidelity score < 8/10
- ❌ Mockup quality score < 7/10
- ❌ Any API error or failed pipeline stage
- ❌ Storefront generation failed or URL not accessible
- ❌ Critical missing data (logo, colors, fonts all null)

---

## Analytics Logging

Each test will log metrics to `analytics_events` table:

```sql
INSERT INTO analytics_events (
  event_name,
  event_data,
  created_at
) VALUES (
  'provisioning_test',
  {
    "domain": "ramp.com",
    "provisioning_time_minutes": 8.5,
    "provisioning_time_seconds": 510,
    "brand_extraction_fidelity_score": 8.0,
    "mockup_quality_score": 8,
    "brand_extraction_status": "completed",
    "mockup_generation_status": "completed",
    "storefront_generation_status": "completed",
    "product_count": 5,
    "shopify_url": "https://ramp-branded-drop.myshopify.com",
    "extraction_confidence_pct": 85,
    "errors": [],
    "sla_achieved": true,
    "test_result": "PASS"
  },
  NOW()
);
```

---

## Expected Outcomes

### Ramp (ramp.com)
- **Estimated provisioning time:** 7–9 minutes (common TLD, modern brand)
- **Estimated fidelity score:** 7–9/10 (well-known brand, should be accurate)
- **Estimated mockup quality:** 7–8/10 (professional brand, good application)

### Vanta (vanta.com)
- **Estimated provisioning time:** 7–9 minutes
- **Estimated fidelity score:** 7–8/10 (enterprise brand, may have subtle colors)
- **Estimated mockup quality:** 7–8/10

### Linear (linear.app)
- **Estimated provisioning time:** 8–10 minutes (less common `.app` TLD)
- **Estimated fidelity score:** 8–9/10 (modern brand, strong visual identity)
- **Estimated mockup quality:** 8–9/10 (modern design tooling brand)

---

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| API rate limiting (Brandfetch, Printify) | Stagger tests by 2–3 minutes; check API quota before starting |
| Network latency | Use wired connection; minimize concurrent network activity |
| Shopify subdomain collision | Pre-generate unique subdomain names; verify availability |
| Missing brand data | Fall back to generated defaults; document as "confidence < 50%" |
| UI responsiveness issues | Reload Command Console if polling stalls >30s |
| Timing measurement accuracy | Use browser DevTools Network tab + local timestamps |

---

## Appendix: Quality Assessment Rubric

### Logo Fidelity (1–10 Scale)
| Score | Criteria |
|-------|----------|
| 10 | Extracted logo pixel-perfect match to official logo |
| 8–9 | Excellent match, minor color/scale variations |
| 6–7 | Good match, style preserved, some details lost |
| 4–5 | Acceptable, general shape correct, significant detail loss |
| 2–3 | Poor, barely recognizable as original |
| 1 | Completely wrong or missing |

### Color Fidelity (1–10 Scale)
| Score | Criteria |
|-------|----------|
| 10 | All primary colors exact hex match |
| 8–9 | 4–5 correct colors, 1–2 slight deviations |
| 6–7 | 3–4 correct colors, 1–2 noticeable deviations |
| 4–5 | 2–3 correct colors, multiple wrong |
| 2–3 | 1–2 colors correct, mostly wrong palette |
| 1 | All colors wrong or unavailable |

### Typography Fidelity (1–10 Scale)
| Score | Criteria |
|-------|----------|
| 10 | Primary and secondary fonts correctly identified |
| 8–9 | Primary correct, secondary approximate or missing |
| 6–7 | Primary correct but secondary wrong |
| 4–5 | One font correct, other completely off |
| 2–3 | Both fonts wrong but similar category |
| 1 | Typography completely unavailable |

### Mockup Quality (1–10 Scale)
| Score | Criteria |
|-------|----------|
| 10 | Professional, perfectly branded, retail-ready |
| 8–9 | Very polished, minor imperfections |
| 7 | Good quality, looks brand-appropriate, usable |
| 6 | Acceptable, some visual issues but serviceable |
| 5 | Passable but noticeably rough |
| 4 | Poor, significant visual flaws |
| 3 | Very poor, major defects visible |
| 2 | Severely flawed, nearly unusable |
| 1 | Completely broken or unusable |

---

## Next Steps After Test Execution

1. **Compile Results Document:** Aggregate all 3 test results into a single execution report
2. **Calculate Pass/Fail:** Determine if all SLA criteria are met
3. **Log to Analytics:** Insert all test metrics into `analytics_events` table
4. **Create Dashboard:** View results via `/admin/analytics` dashboard
5. **Decision Gate (Day 8, June 11):**
   - **PASS (all 3 pass):** Go ahead with warm outreach; confirm $24K pricing signal
   - **PIVOT (1–2 pass):** Investigate failures; optimize pipeline; retest
   - **NO-GO (0 pass):** Debug critical blockers; delay outreach by 3–5 days

---

**Document Version:** 1.0  
**Created:** June 5, 2026  
**Owner:** MVBP Deployment & Verification Lead  
**Status:** Ready for Execution
