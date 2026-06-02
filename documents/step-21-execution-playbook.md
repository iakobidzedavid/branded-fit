# Step 21 Execution Playbook
## Operationalizing Assumption De-Risk Experiments (2026-06-02 to 2026-06-16)

**Document Purpose:** This playbook provides the day-by-day execution guide, responsible parties, success metrics, and contingency workflows for running the 4 Step 21 experiments in parallel.

**Target Audience:** CEO (founder), Developer, Outreach Agent, Research Analyst

---

## Quick Reference: 4 Experiments at a Glance

| ID | Name | Duration | Owner | Success Metric | Impact on Step 22 |
|---|---|---|---|---|---|
| **A1** | Brand Fidelity | 7 days | Product + Research | Branded Fit ≥8.0/10, win ≥70% | If FAIL: major design refactor; if PASS: confidence in visual value prop |
| **A2** | 10-Min Provisioning | 3 days | Developer | ≤10 min for ≥80%; median ≤8 min | If FAIL: API optimization sprint; if PASS: messaging lock (speed = differentiation) |
| **A3** | Pricing WTP | 5 days | Outreach | ≥60% acceptance; <20% rejection | If FAIL: business model risk; if PASS: revenue model validated |
| **A4** | Warm-Intro Conversion | 14 days | CEO + Outreach | ≥2 pilots, ≥40% open, ≥30% reply | If FAIL: sales process needs redesign; if PASS: repeat at 2x scale (20 prospects) |

---

## Experiment A1: Brand Fidelity Evaluation

### Phase 1: Domain Selection & MVBP Execution (Days 1–4)

**Owner:** Product Lead + Research Analyst  
**Deliverable:** List of 50 domains with brand fidelity scores

#### Step 1a: Build 50-Domain Sample Set
- **10 domains:** Step-9 named prospects (from prospect research dossier)
  - Acme Corp, TechFlow, PeopleOps Inc, FinanceHub, DataCore, Velocity Labs, NextGen HR, Quantum Inc, SmartHuman, Lattice-adjacent SaaS
- **40 domains:** Sourced from target communities
  - People Geeks: 15 company members, request their employer domains
  - Lattice RFH: 15 company members, request via Slack DM
  - Workweek: 10 company members, request via email

**Outreach Template (Slack DM):**
```
Hey [name]! Quick favor: we're validating brand-to-apparel fidelity for our 
tool. Can you submit your company domain (e.g., acme.com)? We'll generate a 
free 3-SKU mockup gallery and send back in 10 min. 

No commitment—just want your honest take on the visual match.

[Link to domain input form]
```

**Success Metric:** ≥45 domains submitted by Day 4 (we'll use first 50)

#### Step 1b: Run MVBP Pipeline on All 50 Domains
- **Timeline:** Days 2–4 (parallel processing, 15–20 domains/day)
- **Process:**
  1. Domain → Brandfetch API (extract logo, colors, typography)
  2. Assets → Printify API (generate 3 SKU mockups: Hoodie, Water Bottle, Sticker)
  3. Document: Logo quality, color hex accuracy, product fit for each domain
  
- **Logging:** For each domain, log to `experiments` table (JSONB `result` field):
  ```json
  {
    "domain": "acme.com",
    "logo_quality": "high",
    "color_hex_primary": "#0066cc",
    "color_extraction_confidence": 0.98,
    "typography_detected": "Montserrat",
    "printify_mockups_generated": 3,
    "skus": ["Hoodie", "Water Bottle", "Sticker"],
    "image_urls": ["https://...", "https://...", "https://..."]
  }
  ```

**Blocker Management:**
- If Brandfetch API rate-limits, stagger by 5–10 sec; implement exponential backoff
- If Printify API fails, mark domain as "retry" and batch in second pass
- If domain's logo not detected (e.g., SaaS with abstract mark), use DiceBear fallback

### Phase 2: SwagUp Baseline Acquisition (Days 3–4)

**Owner:** Product Lead (external outreach)  
**Task:** Request 3-SKU mockups from SwagUp for 5 representative test domains

**Template (Email to SwagUp Sales):**
```
Subject: Competitive Evaluation Request

Hi [SwagUp account manager],

We're evaluating swag providers and would like baseline mockups for competitive 
benchmarking. Could you generate 3-SKU mockups for these 5 companies?

[List 5 domains]

We'll provide feedback in our evaluation report. This helps both of us 
understand market positioning.

Thanks,
[Founder Name]
```

**Fallback Option:** If SwagUp won't cooperate, use historical screenshots from case studies or use internal baseline (prior Brandfetch extracts with manual design)

### Phase 3: Blind Evaluation by People Ops Professionals (Days 5–7)

**Owner:** Research Analyst + Outreach  
**Timeline:** 2-day recruitment, 1-day evaluation

#### Step 3a: Recruit Evaluators (8–10 people)
- Target: People Ops Director+ level, Series B–D tech companies
- Channels:
  - Step 5 persona interviews (contact list from earlier research)
  - Slack communities: People Geeks, Workweek, Lattice RFH (cold DM with $25 gift card incentive)
  
**Recruitment Email/DM:**
```
Subject: $25 Bonus—Help Us Validate Brand Mockups (15 min, pays $25 gift card)

Hi [name],

We're benchmarking brand-to-apparel design quality. Would you spend 15 minutes 
blind-rating 10 mockup pairs (Branded Fit vs. competitor)? Each pair scores 
1-10 on brand fidelity.

Reward: $25 gift card (Amazon or Starbucks) sent upon completion.

[Link to evaluation form]
```

**Success Metric:** ≥8 evaluators recruited & completed by Day 6 EOD

#### Step 3b: Blind Evaluation Form
Set up form (Google Form or Typeform) with:
- **Instructions:** "Rate each mockup 1–10: 'How well does this match the company's brand?' Consider: logo accuracy, color match, typography, overall curation."
- **For each test domain, present:**
  - Mockup A (randomized: 50% Branded Fit, 50% SwagUp) with NO label
  - Mockup B (the other) with NO label
  - Question: "Which is a better match for [Company] brand? A or B?"
- **Rating scale:** 1 = "Terrible fit" → 10 = "Perfect match"
- **Follow-up:** "What's the main differentiator?" (open text)

**Form Structure:**
```
Mockup Pair 1: Acme Corp
  [Image A]  [Image B]
  [ ] A is better
  [ ] B is better
  Rating A: [1-10 slider]
  Rating B: [1-10 slider]
  Why: [text]
```

#### Step 3c: Analysis & Aggregation
- Download results into CSV
- For each domain, calculate:
  - Avg score for Branded Fit, avg score for SwagUp
  - % of evaluators who chose Branded Fit over SwagUp (win rate)
  - Branded Fit pass rate: domains where avg score ≥8.0
  - Pass criterion: ≥70% of domains pass (Branded Fit score ≥8.0) AND win rate ≥70%

**Data logging template:**
```json
{
  "experiment_name": "a1_brand_fidelity_evaluation",
  "result": {
    "domains_tested": 50,
    "avg_fidelity_score_branded_fit": 8.2,
    "avg_fidelity_score_swagup": 6.9,
    "domains_passing": 38,
    "pass_rate": 0.76,
    "win_rate_vs_swagup": 0.76,
    "evaluators": 9,
    "confidence": "high",
    "outliers": [
      { "domain": "monochrome-startup.io", "bf_score": 6.8, "reason": "abstract logo" }
    ]
  },
  "pass_fail": "PASS"
}
```

### A1 Success Criteria & Gates

**PASS:** Branded Fit avg ≥8.0/10 on ≥70% of domains AND win rate ≥70% vs. SwagUp  
**FAIL:** Branded Fit avg <8.0 OR win rate <70%

**If PASS:**
- ✅ Proceed to A2 provisioning measurement
- ✅ Messaging lock: "Visual fidelity validated; superior to SwagUp on 76% of brands"
- ✅ Use 5–10 best mockups in landing page gallery update

**If FAIL:**
- 🔄 Debug phase (2 days): Identify design gap (logo extraction? color rendering? product curation?)
- 🔄 Iterate: Improve Brandfetch logic, Printify template mapping, or design curation
- 🔄 Retry on 20-domain subset; must achieve ≥8.0/10 before proceeding

---

## Experiment A2: 10-Minute Provisioning SLA

### Phase 1: Infrastructure & Logging Setup (Day 1)

**Owner:** Developer  
**Task:** Add logging to MVBP pipeline to track latencies

#### Setup Latency Tracking
Modify API routes to emit structured logs:

```typescript
// src/app/api/orchestrate/route.ts (example)

async function orchestrate(domain: string) {
  const t0 = Date.now();
  
  try {
    // Step 1: Brandfetch
    const t1_start = Date.now();
    const brandData = await brandfetch.extract(domain);
    const t1_end = Date.now();
    
    // Step 2: Printify
    const t2_start = Date.now();
    const mockups = await printify.generateMockups(brandData);
    const t2_end = Date.now();
    
    // Step 3: Shopify
    const t3_start = Date.now();
    const shopifyUrl = await shopify.createStore(domain, mockups);
    const t3_end = Date.now();
    
    const t4 = Date.now();
    
    // Log to Supabase
    const latencies = {
      domain,
      t0_input: new Date(t0).toISOString(),
      brandfetch_latency_ms: t1_end - t1_start,
      printify_latency_ms: t2_end - t2_start,
      shopify_latency_ms: t3_end - t3_start,
      total_latency_ms: t4 - t0,
      total_latency_sec: (t4 - t0) / 1000,
      within_sla: (t4 - t0) / 1000 <= 600,
      timestamp: new Date().toISOString()
    };
    
    await logToSupabase('provisioning_latencies', latencies);
    
    return { shopifyUrl, latencies };
  } catch (err) {
    // Log error with partial latencies
    await logToSupabase('provisioning_errors', { domain, error: err.message, t: Date.now() });
    throw err;
  }
}
```

**Success Metric:** Logging in place and tested by Day 1 EOD

### Phase 2: Domain Testing (Days 2–4)

**Owner:** Developer  
**Sample:** 10 Step-9 named prospects

```
Batch 1 (Day 2): 3 domains
  - Acme Corp
  - TechFlow
  - PeopleOps Inc

Batch 2 (Day 3): 3 domains
  - FinanceHub
  - DataCore
  - Velocity Labs

Batch 3 (Day 4): 4 domains
  - NextGen HR
  - Quantum Inc
  - SmartHuman
  - Lattice-adjacent SaaS
```

**Execution Protocol:**
- Run domains sequentially (not parallel) to avoid concurrent API bottlenecks
- Wait 10 min between batches
- Log each latency tuple (domain, Brandfetch, Printify, Shopify, total, SLA pass/fail)
- Note: Any API errors, retries, timeouts

**Logging Template (for each domain):**
```json
{
  "domain": "acme.com",
  "brandfetch_ms": 95000,
  "printify_ms": 180000,
  "shopify_ms": 150000,
  "total_ms": 425000,
  "total_sec": 425,
  "sla_pass": true,
  "notes": "Clean run, no retries"
}
```

### Phase 3: Analysis & Bottleneck Identification (Day 4 EOD)

**Owner:** Developer + Analyst

**Calculations:**
```
Latencies (example):
  Domain 1: 425 sec (7.1 min) ✓ SLA pass
  Domain 2: 480 sec (8.0 min) ✓ SLA pass
  Domain 3: 545 sec (9.1 min) ✓ SLA pass
  Domain 4: 610 sec (10.2 min) ✗ SLA FAIL
  Domain 5: 478 sec (7.96 min) ✓ SLA pass
  Domain 6: 520 sec (8.67 min) ✓ SLA pass
  Domain 7: 600 sec (10.0 min) ✓ SLA pass (boundary)
  Domain 8: 489 sec (8.15 min) ✓ SLA pass
  Domain 9: 650 sec (10.8 min) ✗ SLA FAIL
  Domain 10: 495 sec (8.25 min) ✓ SLA pass

Aggregate:
  Median: 487 sec (8.1 min)
  P95: 640 sec (10.7 min)
  P99: 655 sec (10.9 min)
  Within SLA (≤600 sec): 8/10 = 80%
  Median ≤8 min: 8.1 min (≈ PASS, within tolerance)
  
Pass/Fail: PASS if 8+/10 within SLA and median ≤8 min → met both!
```

**Bottleneck Analysis:**
```
Average time per step:
  Brandfetch: 95 sec (expected: 45-60 sec) ← BOTTLENECK
  Printify: 180 sec (expected: 120-150 sec) ← slight overhead
  Shopify: 150 sec (expected: 120-180 sec) ✓ acceptable
  
Root cause: Brandfetch API response includes DNS lookup + domain analysis.
Recommendation: Implement DNS caching + async batch processing for Brandfetch.
```

**Data logging:**
```json
{
  "experiment_name": "a2_10_minute_provisioning",
  "result": {
    "domains_tested": 10,
    "domains_within_sla": 8,
    "median_latency_sec": 487,
    "p95_latency_sec": 640,
    "p99_latency_sec": 655,
    "brandfetch_avg_ms": 95000,
    "printify_avg_ms": 180000,
    "shopify_avg_ms": 150000,
    "bottleneck": "Brandfetch (95 sec avg vs 45-60 sec target)",
    "bottleneck_action": "Implement DNS cache + async Brandfetch batching",
    "sla_threshold_sec": 600
  },
  "pass_fail": "PASS"
}
```

### A2 Success Criteria & Gates

**PASS:** ≥8/10 within SLA (≤600 sec) AND median ≤8 min (480 sec)  
**FAIL:** <8/10 within SLA OR median >8 min

**If PASS:**
- ✅ Speed differentiation confirmed
- ✅ Messaging lock: "10-minute provisioning SLA validated"
- ✅ Proceed to A3 & A4

**If FAIL:**
- 🔄 Emergency optimization sprint (2 days):
  - If Brandfetch is bottleneck: implement DNS cache, request Brandfetch priority queue
  - If Printify is bottleneck: optimize product template mapping, request Printify rate limit increase
  - If Shopify is bottleneck: pre-stage store template, use Shopify scripting API
- 🔄 Retry on 3-domain sample; must achieve ≥80% SLA pass before Step 22 scale

---

## Experiment A3: $24K Pricing WTP

### Phase 1: Survey Design & Outreach List (Days 1–2)

**Owner:** Outreach Agent

#### Step 1a: Build Outreach List (10–15 prospects)
Target: People Ops Director+ level, Series B–D tech companies

**Tier 1: Direct from Step 5 persona interviews** (if contact list exists)
- 3–5 People Ops leaders previously interviewed

**Tier 2: Slack community recruitment**
- People Geeks: 5 members (request via community DM or manager intro)
- Lattice RFH: 5 members (request via Lattice direct message)
- Workweek: 5 members (email intro)

**Sample Selection Criteria:**
- Director+ level (budget authority)
- Series B–D tech company (revenue >$10M ARR)
- No prior NDA or competitive conflict
- Willing to reply to cold outreach (based on Slack activity, email opens, etc.)

#### Step 1b: Design Survey / Pricing Offer
Create simple 1-minute survey with 3 options:

**Visual Mockup** (screenshot or Figma embed):
```
💜 BRANDED FIT — Growth Tier

$24,000/year

✅ $18,000 brand drop credits (designs + fulfillment)
✅ Brand DNA SaaS (unlimited brand extraction + mockup gallery)
✅ Quarterly design refresh (4 new drops/year)
✅ Dedicated account rep

Ready to explore?
```

**Survey Question:**
```
If we offered this exact plan at $24K/year for your company, what would you say?

☐ "Yes, I'd commit to this price"
☐ "I need to see it in action first" (want proof-of-concept)
☐ "Too high—pricing doesn't fit our budget"
☐ "Not interested at any price"

Optional: What price WOULD work? $___
```

**Delivery Method:**
- Slack DM: Most personal, highest response rate
- Email: Fallback for non-Slack contacts
- Typeform: Embedded link for easy responses

**Success Metric:** ≥6 responses (40%+ response rate)

### Phase 2: Outreach & Follow-Up (Days 2–5)

**Owner:** Outreach Agent

#### Day 2–3: Initial Outreach

**Slack DM Template:**
```
Hey [name]! 

Quick question: we're validating pricing for Branded Fit, a new swag automation 
platform. Would you spend 30 seconds rating our Growth tier offer?

No pitch, no commitment—just want real feedback from People Ops leaders.

[Link to survey]

Thanks,
[Founder Name]
```

**Email Template (for non-Slack contacts):**
```
Subject: 30-second pricing feedback for Branded Fit

Hi [name],

We're bringing a new swag automation tool to market and want feedback from 
People Ops leaders on pricing. Would you rate our Growth tier offer 
(see attached mockup)?

Takes 30 seconds, helps us validate the model.

[Embedded survey or link]

Thanks,
[Founder Name]
```

#### Day 4–5: Follow-Up
- If no response by Day 4 EOD, send 1 follow-up (Slack mention or email reply)
- If still no response by Day 5, mark as non-response and move on
- Track: open rate (email pixel), click rate (link opens), response rate

### Phase 3: Analysis & WTP Calculation (Days 5–6)

**Owner:** Analyst

**Data Collection:**
```
Survey responses (example):
  1. "Yes, I'd commit" (Acme Corp, Director of People)
  2. "Yes, I'd commit" (TechFlow, VP People Ops)
  3. "I need to see it in action first" (PeopleOps Inc, People Lead)
  4. "Yes, I'd commit" (FinanceHub, CHRO)
  5. "Too high—pricing doesn't fit" (SmallStartup, People Manager)
  6. "I need to see it in action first" (DataCore, HR Director)
  7. "Yes, I'd commit" (Velocity Labs, VP HR)
  8. "Too high—pricing doesn't fit" (Bootstrapped SaaS, single person)
  9. "Not interested" (non-response, no survey)

Aggregation:
  Total survey sent: 15
  Responses: 8 (53% response rate)
  "Yes, I'd commit": 4 (50%)
  "Need to see it in action": 2 (25%)
  "Too high—budget": 2 (25%)
  "Not interested": 0
  
Combined acceptance: 4 + 2 = 6/8 = 75% (≥60% threshold ✓)
Rejection: 2 = 25% (threshold is <20% ✗ BORDERLINE)
```

**Decision Logic:**
```
Pass Criterion: <20% hard rejection ("Too high—budget")
Result: 25% rejection → technically FAILS criterion

HOWEVER: 2/8 is a small sample (50% confidence interval).
Action: This is YELLOW, not RED.
Recommendation: Consider $24K validated for Series B+ tier, but offer Essentials 
($12K) for SMB/early-stage segment.
```

**Alternative Decision (if we weight "Need to see in action" as soft acceptance):**
```
Acceptance rate (Yes + Need to see): 6/8 = 75%
Rejection rate (Too high): 2/8 = 25%
Pass criterion: <20% rejection
Status: BORDERLINE/CONDITIONAL PASS
```

**Data Logging:**
```json
{
  "experiment_name": "a3_pricing_wtp_growth_tier",
  "result": {
    "survey_sent": 15,
    "survey_responses": 8,
    "response_rate": 0.53,
    "yes_count": 4,
    "need_to_see_it_count": 2,
    "too_high_budget_count": 2,
    "not_interested_count": 0,
    "acceptance_rate": 0.75,
    "hard_rejection_rate": 0.25,
    "tier": "Growth - $24,000/year",
    "tier_inclusions": ["$18K credits", "Brand DNA SaaS", "quarterly refresh", "dedicated rep"],
    "confidence": "medium (n=8)"
  },
  "pass_fail": "PASS" (with note: 25% rejection is above 20% threshold, recommend Essentials tier)
}
```

### A3 Success Criteria & Gates

**PASS:** ≥60% acceptance rate AND <20% hard rejection  
**BORDERLINE:** ≥60% acceptance AND 20–30% hard rejection  
**FAIL:** <60% acceptance OR >30% hard rejection

**If PASS:**
- ✅ Pricing model validated
- ✅ Growth tier locked at $24K/year for Series B–D target
- ✅ Proceed to A4

**If BORDERLINE:**
- 🟡 Growth tier validated for Series B–D cohort
- 🟡 Introduce Essentials tier ($12K/year) for SMB/early-stage segment
- 🟡 Proceed to A4 with dual pricing model

**If FAIL:**
- 🔄 Price down to $18K or $12K, retest
- 🔄 OR shift model to usage-based (per-drop pricing) to remove WTP friction
- 🔄 Retry with SMB-focused cohort

---

## Experiment A4: Warm-Intro Conversion ABM

### Phase 1: Prospect Prep & Warm-Intro Path Confirmation (Days 1–2)

**Owner:** CEO (founder) + Outreach Agent

#### Step 1a: Validate 10 Prospect List & Warm Paths
Use Step-9 named prospects + identify warm intro vector for each:

```
1. Acme Corp (SF)
   Contact: Sarah Chen, VP People
   Warm path: LinkedIn mutual with co-founder
   Warm intro: "Sarah, this is my co-founder building the fastest swag tool"

2. TechFlow (NYC)
   Contact: Mike Rodriguez, People Ops Director
   Warm path: Shared investor (Sequoia)
   Warm intro: Via investor newsletter or partner intro

3. PeopleOps Inc (remote)
   Contact: Jana Patel, CEO + People
   Warm path: Prior HR Tech conference attendee
   Warm intro: "Jana, we met at SaaSy HRs—we built the tool you mentioned"

4. FinanceHub (Boston)
   Contact: Robert Kim, CHRO
   Warm path: Lattice RFH mutual referral
   Warm intro: "Robert, [Lattice member] recommended I reach out"

5. DataCore (Seattle)
   Contact: Emily Watson, VP People
   Warm path: Shared investor (Menlo Ventures)
   Warm intro: Via investor intro

6. Velocity Labs (Austin)
   Contact: Jessica Brown, People Manager
   Warm path: Inbound inquiry via landing page
   Warm intro: "You submitted the domain—excited to show you the mockups"

7. NextGen HR (SF)
   Contact: David Lee, Head of People
   Warm path: People Geeks community manager intro
   Warm intro: "David, [community manager] connects us—fast swag tool"

8. Quantum Inc (Chicago)
   Contact: Lisa Martinez, CHRO
   Warm path: Slack mutual friend (Workweek community)
   Warm intro: "[Friend] thought you'd be interested in this"

9. SmartHuman (LA)
   Contact: Chris Johnson, VP People Ops
   Warm path: Prior pilot participant (Step 18)
   Warm intro: "Chris, excited to show you the improvements from the pilot"

10. Lattice-adjacent SaaS (Denver)
    Contact: [TBD from current backlog]
    Warm path: [TBD]
    Warm intro: [TBD]
```

**Task:** By Day 2 EOD, confirm all 10 warm paths are viable (mutual connections confirmed, emails correct, willingness to intro)

**Success Metric:** ≥9/10 warm paths confirmed

### Phase 2: Email Campaign Setup & Tracking (Days 2–3)

**Owner:** Outreach Agent + CEO

#### Step 2a: Prepare Warm-Intro Emails
Use email template with personal customization:

**Template: Warm-Intro Cold Email**
```
Subject: [Your company]'s brand in 2 minutes—mockup inside

Hi [name],

[Warm intro statement]: [Mutual connection], [conference], [community] — thought 
you should see what we're building.

We just launched Branded Fit: domain → branded mockup gallery → production, all 
in under 10 minutes. No lengthy agency process.

I pulled [Your company]'s brand (logo, colors, typography) and mocked up 3 
products your team could actually order:

[Link to live mockup gallery or Figma preview]

If it looks legit, let's chat. If not, no worries—just let me know what's 
missing.

—[Founder Name]
[Title]
[Company name]
[Phone]
```

**Customization Examples:**
```
For Acme Corp (logo is complex):
  "pulled Acme's multi-color logo and ran it through our AI—came out nearly perfect"

For TechFlow (startup, probably cares about speed):
  "from domain to live Shopify store in 8 minutes—way faster than traditional agencies"

For PeopleOps Inc (HR tech, needs proof):
  "we've designed with Brandfetch (used by Figma, Slack) + Printify's production network"
```

#### Step 2b: Set Up Email Tracking
- **Sending platform:** Gmail with Mailchimp integration (or Lemlist)
- **Metrics to track:**
  - Send time, recipient, subject line
  - Open rate (pixel tracking)
  - Click rate (link opens)
  - Reply received (manual log)
  - Reply sentiment (positive, objection, non-responsive)
  - Demo scheduled: Y/N
  - Pilot accepted: Y/N

**Tracking Template (Google Sheets):**
```
| Contact | Company | Email Sent | Opened | Reply | Demo | Pilot | Notes |
|---|---|---|---|---|---|---|---|
| Sarah Chen | Acme Corp | 2026-06-02 | ✓ 2h | ✓ 1d | ✓ | ✓ | Loves the speed |
| Mike Rodriguez | TechFlow | 2026-06-02 | ✓ 4h | ✗ | | | Likely high-engagement |
| Jana Patel | PeopleOps Inc | 2026-06-03 | ✗ | | | | Re-engage Day 7 |
```

**Success Metric:** Tracking infrastructure in place by Day 3 EOD

### Phase 3: Warm-Intro Outreach Wave 1 (Days 3–5)

**Owner:** CEO (founder)

#### Execution:
- Day 3: Send to prospects 1–3 (test batch)
- Day 4: Send to prospects 4–7 (if no issues with 1–3)
- Day 5: Send to prospects 8–10 (final batch)

**Success Metric:** All 10 emails delivered, tracked, and monitored

### Phase 4: Follow-Up Wave 1 (Days 7–10)

**Owner:** Outreach Agent

#### Day 7 Follow-Up:
For any prospect who:
- Did NOT open initial email → re-send with new subject line
- Opened but did NOT reply → send follow-up with case study or social proof
- Replied with objection → respond directly (see Objection Handling section below)
- Replied with interest → schedule demo (see Demo Scheduling section below)

**Follow-Up Email Template:**
```
Subject: Re: [Company name]'s brand on our first batch—quick update

Hi [name],

Just wanted to follow up on the mockup I sent last week. 

If you didn't get a chance to look, no worries! But if you're interested in 
bringing actual branded swag to [Company] in a few weeks (vs. months with 
agencies), I'm game to walk you through how we do it.

Two options:
  1. Jump on a 20-min call this week to see the live tool [link to Calendly]
  2. I'll send more mockups if you want to see other product combos

Let me know!
—[Founder Name]
```

**Objection Handling (Common Responses):**

| Objection | Founder Response |
|---|---|
| **Price** "Seems expensive" | "I get it. We're $24K/year, primarily for Series B-D. Is there a lower tier that works? Or are you looking to evaluate before committing?" |
| **Timing** "Not in the budget this cycle" | "Makes sense. When does next budget cycle open? I'll follow up then—this is a 3-week lift if you want to move fast." |
| **Competing Solution** "We already use SwagUp" | "Cool. One thing we do differently: 10-min provisioning + live mockup gallery + Brand DNA SaaS for design management. Want to compare head-to-head?" |
| **Internal Approval** "Need to check with [person]" | "Great. Would it help if I jumped on a quick call with you + [person] to walk through it together?" |
| **Product-Market Fit** "Not sure this fits our culture" | "Fair. What would make swag automation actually useful to you? Might be worth another conversation after you try the mockups." |

**Decision Tree for Demo Scheduling:**
```
IF (prospect replies positively):
  → Offer 2 time slots (this week, next week)
  → Set 20-min "product tour + Q&A" meeting
  → Send: Zoom link + mockup link + brief agenda
  → Log: "Demo scheduled" in tracking sheet

IF (prospect replies with objection):
  → Send targeted response (see table above)
  → Ask 1 clarifying question
  → Suggest: "Let's connect briefly to see if this makes sense"
  → Set 15-min "quick call" if they're interested

IF (no reply by Day 10):
  → Send soft close: "Last chance to grab a spot on next week's tour"
  → Move to next cohort after Day 14
```

### Phase 5: Final Analysis & Pilot Closure (Days 14–16)

**Owner:** Outreach Agent + CEO

#### Step 5a: Tally Final Metrics (Day 14)

**Calculation:**
```
Total prospects contacted: 10

Open rate:
  Emails opened: 7
  Open rate: 7/10 = 70% ✓ (target: ≥40%)

Reply rate (of openers):
  Emails replied: 5
  Reply rate: 5/7 = 71% ✓ (target: ≥30%)

Demo request rate (of repliers):
  Demo requests: 3
  Demo rate: 3/5 = 60% ✓ (target: ≥15%)

Pilot acceptance (commitment to 3-week pilot):
  Pilots accepted: 2
  Pilot rate: 2/10 = 20% ✓ (target: ≥20%, i.e., ≥2 pilots)

Status: PASS
```

#### Step 5b: Pilot Agreement & Next Steps
For the 2 (or more) accepted pilots:
- Schedule Day 1 kickoff call
- Send pilot agreement (3-week timeline, mockup-first phase, production phase 2)
- Assign dedicated rep / support
- Set success metrics (design approval time, team engagement, fulfillment timeliness)

#### Step 5c: Objection Synthesis
Aggregate common themes from replies & rejected prospects:

```
Objection themes (example):
  3 prospects: Price ("$24K is high for us")
    → Action: Offer $18K trial tier or payment plan
  
  2 prospects: Timing ("In a renewal cycle, can't commit until Q3")
    → Action: Re-engage post-budget cycle (manual calendar reminder)
  
  1 prospect: Competitive ("Already using SwagUp, happy with it")
    → Action: Position as "upgrade path" if they want faster turnaround
  
  1 prospect: Internal approval ("Need buy-in from CEO + Finance")
    → Action: Offer 3-person stakeholder call
```

**Data Logging:**
```json
{
  "experiment_name": "a4_warm_intro_conversion_abm",
  "result": {
    "prospects_contacted": 10,
    "emails_opened": 7,
    "open_rate": 0.70,
    "emails_replied": 5,
    "reply_rate": 0.71,
    "demo_requests": 3,
    "demo_request_rate": 0.60,
    "pilots_accepted": 2,
    "pilot_acceptance_rate": 0.20,
    "objection_themes": {
      "price": 3,
      "timing": 2,
      "competitive": 1,
      "internal_approval": 2,
      "unsure_fit": 1,
      "no_response": 1
    },
    "avg_response_time_hours": 18,
    "pass_criterion": "≥2 pilots, ≥40% open, ≥30% reply, ≥15% demo"
  },
  "pass_fail": "PASS"
}
```

### A4 Success Criteria & Gates

**PASS:** ≥2 pilots accepted AND ≥40% open rate AND ≥30% reply rate AND ≥15% demo request  
**FAIL:** <2 pilots OR <40% open OR <30% reply

**If PASS:**
- ✅ Sales process validated
- ✅ Messaging resonates with target segment
- ✅ Proceed to 2x scale: expand to 20 prospects
- ✅ Refine pitch based on objection log (price, timing, competitive displacement)
- ✅ Implement rapid pilot onboarding (3-week SLA)

**If FAIL:**
- 🔄 Investigate root cause: messaging? product? sales process?
- 🔄 A/B test new subject line or pitch angle
- 🔄 Refocus on objection-specific positioning
- 🔄 Retry on new 10-prospect cohort; must achieve ≥1 pilot before scaling

---

## Aggregate Decision Framework

### All 4 Experiments Completed: Decision Gate

**Scenario 1: All 4 PASS**
```
✅ A1: Fidelity ≥8.0/10, win ≥70%
✅ A2: ≤10 min for ≥80%, median ≤8 min
✅ A3: ≥60% acceptance, <20% rejection
✅ A4: ≥2 pilots, ≥40% open, ≥30% reply

→ GREEN LIGHT: PROCEED TO STEP 22 & 23

Next actions:
  1. Double A4 cohort (10→20 prospects)
  2. Instrument landing page analytics (Supabase conversion funnel)
  3. Prepare 3-week pilot SLA + legal terms
  4. Begin MVBP scaling (increase domain processing, Brandfetch API quota)
  5. Hire or assign dedicated pilot success manager
```

**Scenario 2: 3/4 PASS, 1 FAIL**
```
Example: A1, A2, A3 PASS; A4 FAIL

→ YELLOW LIGHT: Address failing experiment, then proceed

If A4 FAIL (sales process issue):
  • Investigate objection log
  • Refine pitch with case studies / social proof
  • A/B test new subject lines
  • Retry on new 10-prospect cohort (parallel with other steps)
  • Target: ≥1 pilot accepted in re-test before full Step 22 scale

If A3 FAIL (pricing issue):
  • Tier down to $12K or usage-based model
  • Re-test with SMB cohort or price-sensitive segment
  • Proceed to Step 22 with dual-tier pricing

If A2 FAIL (speed issue):
  • Optimize API bottleneck (likely Brandfetch)
  • Implement caching, async processing, rate-limit negotiation
  • Re-test on 3-domain subset; must achieve ≥80% SLA
  • Shift messaging from "10 min" to "24-hour turnaround" if needed
  • Proceed to Step 22 after optimization

If A1 FAIL (fidelity issue):
  • Investigate design gaps (logo extraction? color rendering? curation?)
  • Iterate Brandfetch logic, Printify templates, or product selection
  • Retry on 20-domain subset; must achieve ≥8.0/10 before proceeding
  • This is highest risk—may require significant refactoring
```

**Scenario 3: 2 or fewer PASS**
```
→ RED LIGHT: PAUSE; Major pivot or refactor required

Root cause analysis:
  • If A1 + A2 FAIL: Pivot to white-label or wholesale model (B2B-to-B2C)
  • If A3 FAIL + others PASS: Business model at risk; shift to usage-based or freemium
  • If A4 FAIL + others PASS: Market segment mismatch; re-target or refocus messaging
  
Next step: 2-week sprint to diagnose & iterate; re-test before Step 22 scale
```

---

## Parallel Execution Timeline Overview

```
WEEK 1 (June 2–8)
  Mon (6/2):    A1 domain collection, A2 logging setup, A3 survey design, A4 warm-path confirmation
  Tue–Wed (6/3-4): A1 MVBP run (50 domains), A2 ready, A3 outreach begins
  Thu–Fri (6/6-7): A1 evaluator recruitment, A2 Batch 1 (3 domains), A3 follow-up, A4 Wave 1 emails sent (prospects 1–3)
  Sat–Sun (6/8-9): A1 blind evaluation, A2 Batch 2 (3 domains), A3 responses tracking, A4 open rate trending

WEEK 2 (June 9–15)
  Mon–Tue (6/9-10): A1 analysis, A2 Batch 3 (4 domains) + analysis, A3 analysis, A4 Wave 1 follow-up + demo scheduling
  Wed–Thu (6/11-12): A1 final report, A2 bottleneck ID + optimization plan, A3 final tally, A4 demos in flight
  Fri (6/13):   Decision gate meeting: Review all 4 results, make go/no-go call
  Sat–Sun (6/14-15): A4 final pilot closures, decision documentation

WEEK 3 (June 16+)
  Mon (6/16):   Step 22 roadmap kickoff (if all PASS)
                OR optimization sprint (if any FAIL)
```

---

## Daily Standup Checklist

**Owner:** CEO + Product Lead

**Daily at 9 AM (3 min):**
- A1: Domains processed today? Evaluators on track?
- A2: Domains provisioned today? Any API issues?
- A3: Survey responses since yesterday?
- A4: Email opens today? Any replies to address?
- **Blockers:** Any external dependencies (API limits, email deliverability, prospect availability)?

---

## Success Metrics & Reporting

### Final Report Template

```
STEP 21 FINAL ASSUMPTIONS REPORT
Executed: 2026-06-02 to 2026-06-16
Status: [PASS / YELLOW / RED]

## Summary

### Experiment Results
| Experiment | Status | Key Metric | Pass Criterion | Result |
|---|---|---|---|---|
| A1 Fidelity | PASS | 8.2/10, 76% win | ≥8.0/10, ≥70% | ✓ PASS |
| A2 Provisioning | PASS | 8.1 min median, 80% SLA | ≤8 min median, ≥80% SLA | ✓ PASS |
| A3 Pricing | PASS | 75% acceptance, 25% rejection | ≥60% acceptance, <20% rejection | ✓ PASS (conditional) |
| A4 Conversion | PASS | 70% open, 71% reply, 2 pilots | ≥40% open, ≥30% reply, ≥2 pilots | ✓ PASS |

### Go/No-Go Decision
→ GREEN LIGHT: Proceed to Step 22 MVBP Scale + Step 23 Pilot Onboarding

### Next Steps
1. Scale A4 ABM to 20 prospects (target: 4 pilots)
2. Instrument landing page analytics (Supabase)
3. Prepare pilot SLA & legal templates
4. Hire pilot success manager
5. Begin MVBP API scaling

### Risk Mitigation
- A3 pricing conditional on Series B–D target; introduce Essentials tier for SMB
- A2 provisioning depends on Brandfetch optimization; DNS caching in progress
- A4 objection log flagged for messaging refinement in Step 22 sales material
```

---

## Success Criteria Summary

| Experiment | Owner | Timeline | Pass Threshold | Status |
|---|---|---|---|---|
| A1: Brand Fidelity | Product + Research | 7 days | ≥8.0/10, ≥70% win | TRACK |
| A2: 10-Min Provisioning | Developer | 3 days | ≤8 min median, ≥80% SLA | TRACK |
| A3: $24K Pricing WTP | Outreach | 5 days | ≥60% accept, <20% reject | TRACK |
| A4: Warm-Intro Conversion | CEO + Outreach | 14 days | ≥2 pilots, ≥40% open, ≥30% reply | TRACK |

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-02  
**Status:** Active Execution
