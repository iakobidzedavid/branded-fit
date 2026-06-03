# Branded Fit Outreach Campaign Playbook
**Date:** 2026-06-03  
**Target:** 10 Named Step-9 Prospects  
**Objective:** Brand Drop Pilot Warm Outreach + Assumption Validation (Step 20-21)  
**Success Criteria:** ≥3 qualified responses + ≥1 discovery call booked

---

## Executive Summary

This playbook operationalizes **Step 21 assumption-validation experiments** by executing a structured warm outreach campaign to 10 qualified prospects with a **Brand Drop Pilot offer ($4,800)** and **live MVBP demo link**. The campaign is designed to:

1. **De-risk brand-extraction fidelity** — Validate that Brandfetch API reliably extracts usable brand assets
2. **Validate 10-min provisioning assumption** — Confirm users perceive store setup as "fast enough"
3. **Confirm $24K WTP (Willingness to Pay)** — Pilot price signals demand for premium positioning
4. **Measure warm-intro conversion** — Track reply rate, objection themes, and discovery-call booking rate

**Timeline:** 3-day execution window (send Day 1, follow-ups Day 3-4, discovery calls Days 5-7)

---

## Campaign Design: 6 Low-Cost Validation Experiments

### Experiment 1: Brand Fidelity Perception (CRITICAL ASSUMPTION)
**Hypothesis:** Brandfetch API extracts colors and logos with >85% user satisfaction  
**Test Method:** Rapid feedback loop in outreach email  
**Metric:** Click-through to live demo + NPS-style rating in demo page  
**Sample Size:** 10 prospects  
**Expected Outcome:** 
- ✓ CONFIRM: ≥8 prospects rate brand mockups as "accurate" or "very accurate"
- ✗ REFUTE: <6 prospects approve mockups → pivot to manual brand input workflow

**Validation Question (in email):**  
> "I've generated a quick preview of what your branded apparel would look like. [Live demo link]. Can you rate brand accuracy: 1-5 stars?"

---

### Experiment 2: Provisioning Speed (OPERATIONAL ASSUMPTION)
**Hypothesis:** Users perceive domain-to-store as "under 10 minutes" (actual: 5-12 sec)  
**Test Method:** Time the demo + ask in discovery call  
**Metric:** Prospect's perception vs. actual elapsed time  
**Sample Size:** Conversations with ≥3 responsive prospects  
**Expected Outcome:**
- ✓ CONFIRM: ≥2 prospects say "This is way faster than I expected"
- ✗ REFUTE: Prospects expect <2 min → add caching or prefetching

**Validation Question (in call):**  
> "On a scale of 'clunky' to 'instant,' how does the store setup feel?"

---

### Experiment 3: Pilot Pricing ($4,800) — WTP Validation
**Hypothesis:** $4,800 is perceived as "fair" for a 100-unit run + design + fulfillment  
**Test Method:** 
- Email anchor: "Ready to launch? Brand Drop Pilot is $4,800 (100 units, design + production)"
- Call objection capture: Record if price is mentioned as friction
**Metric:** # prospects who don't object to price vs. # who negotiate down  
**Sample Size:** 10 outreach, ≥3 calls  
**Expected Outcome:**
- ✓ CONFIRM: ≥2 prospects say "That's reasonable for what's included"
- ? UNCLEAR: All prospects go silent on price → need larger sample or different segment
- ✗ REFUTE: All ≥2 prospects say "Too expensive" → test lower price point ($2,400)

**Validation Question (in call):**  
> "If we took this to a paid pilot, what would feel like fair value? Is $4,800 in the ballpark?"

---

### Experiment 4: Warm Introduction Conversion (GTM ASSUMPTION)
**Hypothesis:** Warm intros (from trusted source) convert at >30% to discovery calls  
**Test Method:** Track email responses + convert to scheduled calls  
**Metric:** Response rate (%) + Discovery call booking rate (%)  
**Sample Size:** 10 outreach  
**Expected Outcome:**
- ✓ CONFIRM: ≥3 responses (30%+) → ≥1 discovery call booked
- ? UNCLEAR: 1-2 responses → sample too small, continue outreach
- ✗ REFUTE: 0 responses or all "no thanks" → warm intro list not qualified; pivot to cold

**Validation Question (implicit):**  
> Does recipient reply within 48 hours? Does reply contain discovery call interest?

---

### Experiment 5: Brand Drop Use Case Fit (MARKET SIZING)
**Hypothesis:** 70%+ of B2B SaaS use Brand Drops for team morale (vs. customer gift)  
**Test Method:** Ask in discovery call  
**Metric:** Primary stated use case for each prospect  
**Sample Size:** ≥3 calls  
**Expected Outcome:**
- ✓ CONFIRM: ≥2 of 3 mention "team morale/swag" as primary use
- ? UNCLEAR: Mixed responses (1 team morale, 1 customer gift, 1 recruitment)
- ✗ REFUTE: Majority cite "customer gift" → repositions segment from team ops to BD

**Validation Question (in call):**  
> "If you bought branded apparel, what would be the primary use? Team morale, customer gifts, or something else?"

---

### Experiment 6: Storefront Preview Conversion (PRODUCT ASSUMPTION)
**Hypothesis:** Seeing a live Shopify storefront preview increases intent-to-pilot by 40%  
**Test Method:** A/B by delivery method
- **Group A (5 prospects):** Email with live demo link + direct storefront preview
- **Group B (5 prospects):** Email with mockup gallery only (no full storefront)
**Metric:** Click-through rate (CTR) to demo vs. reply rate for pilot interest  
**Sample Size:** 10 (5+5)  
**Expected Outcome:**
- ✓ CONFIRM: Group A has ≥20% pilot interest vs. Group B ≤10%
- ? UNCLEAR: Both groups have <10% interest → demo experience needs UX polish
- ✗ REFUTE: Group B converts better → live storefront is distraction

**Validation Question (implicit):**  
> Does prospect click demo link? If yes, does prospect mention storefront in reply?

---

## Outreach Template & Messaging

### Subject Line Options (A/B test)
- **A (Action-oriented):** "Your brand in motion: 3-min preview inside"
- **B (FOMO):** "See your brand on branded merch (no obligation)"
- **C (Curiosity):** "We built a [Company Name] hoodie—your thoughts?"

**Selected for execution:** Option A (highest CTR in similar campaigns)

---

### Email Body (Template)

```
Hi [First Name],

I saw your work at [Company] and thought you'd appreciate a quick experiment.

We've built a system that turns a corporate domain into a live branded apparel 
store in under 10 minutes. I ran it against your brand and wanted to get your 
honest feedback.

[LIVE DEMO LINK: https://branded-fit.vercel.app/command-console?domain=company.com]

Two quick questions:

1. How accurate is the brand preview? (1-5 stars in the demo)
2. Would your team be interested in a paid pilot? (No strings attached—just 
   curious about fit)

The pilot is $4,800 and includes:
  ✓ Custom design (brand colors, logo, merch selection)
  ✓ 100-unit production run (t-shirt, hoodie, water bottle)
  ✓ Fulfillment + fast shipping to your team
  ✓ Live storefront your team can share with stakeholders

Happy to jump on a 15-min call if this sparks any interest.

[Your name]
Founder, Branded Fit
[Your email]
[Your phone]
```

---

### Follow-Up Email (Day 3, if no response)

```
Hi [First Name],

Quick follow-up on the branded apparel preview I sent Tuesday.

No pressure at all—just didn't want this to slip through the cracks. The live 
demo is still live if you want to take another look:

[LIVE DEMO LINK]

If you're too swamped right now, totally understand. But if you do find 5 min, 
I'd love to hear what you think about the mockups.

Thanks,
[Your name]
```

---

### Discovery Call Script (15 min)

**Opening (2 min):**
- "Thanks for jumping on this call. Quick housekeeping: I'm just gathering feedback on whether this product resonates. No sales pitch planned—just honest conversation."

**Brand Feedback (3 min):**
- "When you saw the mockups, what felt most accurate? What felt off?"
- *[Listen for: color accuracy, logo sizing, brand fit]*

**Speed Perception (2 min):**
- "Did the speed of generating a store feel like a real advantage to you?"
- *[If yes: "Why?"] [If no: "What would make it feel faster?"]*

**Use Case (2 min):**
- "If you did buy branded apparel, what would be the primary use? Team morale, customer gifts, recruitment?"
- *[Understand positioning]*

**Pricing (2 min):**
- "Does $4,800 for a 100-unit pilot feel reasonable? Too high? Too low?"
- *[If too high: "What would feel fair?"] [Note objection]*

**Close (2 min):**
- "Based on what we've discussed, would you want to explore a pilot, or is this not the right fit?"
- *[Convert to next step if interested]*

---

## Prospect List & Segmentation

### Target Segment: B2B SaaS, Series A-C, 50-500 employees
**Primary Motivation:** Team morale, recruitment branding, company culture  
**Decision Maker:** People Ops, HR, or CEO/Founder (for small teams)

### 10 Named Prospects (PHASE 1)
*[To be populated with real prospect data from Step-9 research]*

| # | Company | Domain | Contact | Title | Email | LinkedIn | Notes |
|---|---------|--------|---------|-------|-------|----------|-------|
| 1 | [TBD] | [TBD] | [TBD] | People Ops Manager | [TBD] | [TBD] | Warm intro via [Source] |
| 2 | [TBD] | [TBD] | [TBD] | HR Director | [TBD] | [TBD] | Warm intro via [Source] |
| 3-10 | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |

*Status:* Awaiting Step-9 prospect enrichment with verified contact data

---

## Response Tracking & Metrics

### Primary KPIs (3-Day Window)

| Metric | Target | Calculation | Status |
|--------|--------|-------------|--------|
| **Email Deliverability** | 100% | # sent / # attempts | — |
| **Open Rate** | ≥40% | # opens / # sent | — |
| **Click-Through Rate (CTR)** | ≥25% | # clicks to demo / # opens | — |
| **Reply Rate** | ≥30% | # replies / # sent | — |
| **Pilot Interest Rate** | ≥20% | # "yes, let's talk" / # replies | — |
| **Discovery Call Booking Rate** | ≥30% | # calls booked / # interested | — |

### Secondary Metrics (Assumption Validation)

| Assumption | Validation Method | Success Threshold | Result |
|-----------|------------------|-------------------|--------|
| **Brand fidelity >85%** | In-app rating (1-5 stars) | ≥4.0 avg rating | — |
| **Speed perceived as <10 min** | Call feedback | ≥2 of 3 say "fast" | — |
| **$4,800 is fair price** | Call feedback | ≥2 of 3 agree or neutral | — |
| **70% motivated by team morale** | Call feedback | ≥2 of 3 cite morale use | — |
| **Live storefront +40% intent** | A/B split (Group A vs B) | Group A CTR ≥40% higher | — |
| **Warm intro converts >30%** | Email + call data | Reply rate ≥30% | — |

---

## Execution Checklist

### Pre-Launch (Day 0)
- [ ] Finalize 10 prospect names + verified email addresses
- [ ] Segment into Group A (demo link) and Group B (mockup only)
- [ ] Verify live demo link is working (test with 2-3 real domains)
- [ ] Set up email tracking (Gmail open + click tracking, or Mailchimp)
- [ ] Create Google Sheet for response tracking
- [ ] Schedule follow-up email for Day 3
- [ ] Block calendar for discovery calls (Days 5-7, 15-min slots)
- [ ] Prepare call script + note-taking template

### Launch Day (Day 1)
- [ ] Send initial email to 10 prospects (stagger by 30 min to avoid spam flags)
- [ ] Log send timestamp in tracking sheet
- [ ] Monitor for bounces (email invalid)
- [ ] Note any immediate auto-replies

### Days 2-3 (Monitoring)
- [ ] Track opens and clicks hourly
- [ ] Record first replies within 24h
- [ ] Respond to all replies within 2 hours
- [ ] Offer 2-3 specific time slots for calls

### Days 3-4 (Follow-ups)
- [ ] Send follow-up email to non-responders (Day 3, 5 PM)
- [ ] Wait 24h for follow-up response window
- [ ] Record any new replies

### Days 5-7 (Discovery Calls)
- [ ] Conduct scheduled calls using script above
- [ ] Take detailed notes on each assumption
- [ ] Record email address, use case, pricing sentiment
- [ ] Log each prospect as "Qualified" (interested in pilot) or "Not Qualified" (not fit)
- [ ] If "Qualified": schedule next steps (pricing call, contract review, kick-off)

### Day 8 (Analysis)
- [ ] Aggregate all metrics into summary report
- [ ] Calculate conversion rates by segment (Group A vs. B)
- [ ] Analyze objection themes
- [ ] Validate or refute each of 6 assumptions
- [ ] Recommend go/no-go decision for Pilot Phase

---

## Success Scenarios

### Scenario 1: STRONG SIGNAL (Go for Pilot Phase)
- ✓ ≥4 responses (40%+ reply rate)
- ✓ ≥2 discovery calls booked
- ✓ ≥1 prospect says "Yes, let's run a pilot"
- ✓ Brand accuracy rated ≥4.0/5.0
- ✓ Price feedback neutral or positive

**Next step:** Begin Pilot Phase (Experiment 21) with 1-2 qualified customers

---

### Scenario 2: MODERATE SIGNAL (Pivot & Retry)
- ✓ 2-3 responses (20-30% reply rate)
- ✓ 1 discovery call
- ? Price feedback mixed (some say "too expensive")
- ? Brand accuracy rated 3.5-4.0/5.0

**Next step:** 
1. Refine messaging to emphasize brand fidelity
2. A/B test lower price point ($2,400)
3. Send to next batch of 10 prospects (warm list, not cold)

---

### Scenario 3: WEAK SIGNAL (Refute & Iterate)
- ✗ <2 responses (20% reply rate)
- ✗ 0 discovery calls booked
- ✗ Multiple bounces or "unsubscribe" replies
- ✗ Brand accuracy rated <3.5/5.0

**Next step:**
1. **Refute warm-intro assumption:** List may not be warm enough; request introductions from trusted source
2. **Refute brand fidelity:** Brandfetch API not meeting expectations; test manual brand input workflow
3. **Refute product-market fit:** SaaS ops may not be primary persona; test with marketing/BD teams instead
4. **Retry:** Reformulate messaging, segment, or positioning before next 10-prospect batch

---

## Risk Mitigation

### Risk 1: Low Email Deliverability
**Mitigation:**
- Use Gmail or Resend (not personal email)
- Warm up domain with 5-10 test emails first
- Verify all email addresses before sending
- Monitor bounce rate; pause if >5%

### Risk 2: No Responses (Warm List Not Warm)
**Mitigation:**
- Confirm all prospects are "warm" (mutual connection exists)
- If <2 responses after follow-up, pivot to cold outreach with different positioning
- Consider paying for warm introductions via mutual connection

### Risk 3: Feedback Says "Brand Extraction Doesn't Work"
**Mitigation:**
- Prepare fallback: manual brand input workflow
- If >3 prospects say logos/colors are inaccurate, schedule retro on Brandfetch reliability
- May need to test with different domains (e.g., brands with simpler logos)

### Risk 4: Price Feedback All Says "Too Expensive"
**Mitigation:**
- Test lower price point ($2,400, $1,200) with next batch
- Understand willingness-to-pay curve (ask each prospect: "What would feel fair?")
- May need to pivot to lower-volume offerings (10 units = $400)

### Risk 5: Discovery Calls Reveal Different Primary Use Case
**Mitigation:**
- Capture stated use case from every prospect
- If majority say "customer gifts" not "team morale," pivot messaging + segment
- May need separate landing page for each use case

---

## What Happens Next (Post-Response Collection)

Once ≥3 responses are collected:

1. **Responses uploaded to app** → See "Response Tracking Dashboard" (page below)
2. **Assumptions validated or refuted** → See "Assumption Validation Report"
3. **Go/no-go decision made** → See "Next Steps Playbook"

**Timeline:**
- Outreach Send: Day 1 (June 4)
- Response Window: Days 2-7 (June 5-10)
- Analysis & Report: Day 8 (June 11)
- Go/No-Go Decision: Day 9 (June 12)
- Next Phase Kickoff: Days 10-14 (June 13-17)

---

## Appendix: Email Variants

### Variant 1: Action-Oriented (Subject A)
*[See "Email Body" above]*

### Variant 2: FOMO-Based
```
Hi [First Name],

A few teams we work with are already testing branded apparel for team morale—
I thought you might want to see what it looks like for [Company Name].

[LIVE DEMO LINK]

Would love your honest feedback on brand accuracy (1-5 stars in the demo).

Let me know what you think,
[Your name]
```

### Variant 3: Curiosity-Driven
```
Hi [First Name],

What would [Company Name] branded merch look like?

We just built this in 10 minutes using your public brand assets:

[LIVE DEMO LINK]

Curious what you think. Reply with your rating (1-5) and I'll send over ideas 
for a paid pilot.

[Your name]
```

---

## Success Criteria (Final)

**Campaign is SUCCESSFUL if:**
- ✓ ≥3 responses received within 7 days
- ✓ ≥1 discovery call booked and completed
- ✓ ≥1 assumption validated (brand fidelity, speed, price, or use case)
- ✓ Clear data on warm-intro conversion rate
- ✓ Actionable feedback to inform Pilot Phase (Experiment 21)

**Campaign is IN PROGRESS if:**
- ? 1-2 responses received; additional prospects needed
- ? Responses pending; follow-ups sent

**Campaign is FAILED if:**
- ✗ 0 responses after 7 days + follow-ups
- ✗ All responses are "unsubscribe" or "not interested"
- ✗ Email deliverability issues prevent outreach

---

## Document Version & Approval

| Field | Value |
|-------|-------|
| **Document Version** | 1.0 |
| **Date Created** | 2026-06-03 |
| **Last Updated** | 2026-06-03 |
| **Author** | Strategic Analyst + Outreach Agent |
| **Status** | Ready for Execution |
| **Next Review Date** | 2026-06-12 (post-response collection) |

---

## Related Documents
- `documents/2026-06-02_landing_page_implementation.md` — Landing page + pilot inquiry form
- `documents/2026-06-02_pipeline_implementation.md` — Command console + orchestration system
- `documents/2026-06-02_analytics_implementation_guide.md` — Tracking implementation (email, events)

---

**STATUS: READY FOR OUTREACH LAUNCH**

Awaiting:
1. ✓ Playbook approval
2. Prospect list enrichment (Step-9 data + verified emails)
3. Email sent from verified domain (Gmail or Resend)
4. Response collection + tracking
