# Step 21 Discovery Call Validation Framework
## Brand Drop Pilot Customer Validation (Vanta, Linear, Census, Hex, Mercury)

**Document Version:** 1.0  
**Last Updated:** June 15, 2026  
**Owner:** Testing Mode Discovery Call Orchestrator  
**Status:** Production Ready

---

## Executive Summary

This framework enables structured discovery calls with 5 Brand Drop Pilot customers to validate 6 critical business assumptions that remain GRAY (unvalidated with real customer feedback). The framework consists of:

1. **Fixed 45–60 minute call agenda** with 7 segments
2. **Van Westendorp pricing ladder** for WTP validation
3. **29-field data collection tracker** for standardized logging
4. **Assumption scoring methodology** with CONFIRM/REFUTE/GRAY thresholds
5. **Aggregation & synthesis protocol** for executive decision-making

**Target Outcome:** Quantified scorecard showing status of 6 assumptions with ≥80% confidence signals required for GO decision on annual Growth contract positioning.

---

## Part 1: The 6 Gray Assumptions & Validation Targets

| # | Assumption | Current Status | Validation Method | Success Threshold | Target Evidence |
|---|---|---|---|---|---|
| 1 | **Brand-Fidelity NPS** — Generated storefronts capture brand essence at ≥4/5 accuracy | GRAY | 1:1 call, visual comparison | ≥80% responses ≥4/5 | "Mockup matches our brand guidelines" |
| 2 | **$24K WTP Acceptance** — Growth tier ($24K annual) is acceptable price point | GRAY | Van Westendorp ladder | ≥80% rate $24K as "acceptable" or lower | Pricing anchors: $2K (cheap), $4.8K (bargain), $24K (acceptable), $36K (expensive) |
| 3 | **Warm-Intro Conversion** — Warm intros from Step 9 convert to calls at ≥15% rate | GRAY | Booking data + email tracking | ≥15% of warm prospects book discovery | Track: intros sent → opens → replies → booked calls |
| 4 | **Use-Case Fit** — Customers see multi-use cases beyond onboarding (score ≥3/5) | GRAY | Open-ended discovery | ≥80% score ≥3/5 on use-case breadth | "Would use for exit kits, referral rewards, offsite gifts" |
| 5 | **Provisioning Speed** — Domain→Live storefront in <10 min satisfies ≥4/5 | GRAY | Speed measurement + satisfaction | ≥80% satisfied (≥4/5) with <10 min delivery | Actual: measure days/hours from domain submission to live link |
| 6 | **Storefront Impact** — Employees respond positively; ≥8 NPS intent or reorder likelihood | GRAY | Employee feedback + annual intent | ≥80% show reorder intent OR employee NPS ≥8 | "Would definitely order again"; employee feedback quotes |

---

## Part 2: Discovery Call Agenda (45–60 Minutes)

### Pre-Call Checklist (5 minutes before)
- [ ] Calendar invite confirmed; prospect attending
- [ ] Zoom/Google Meet link sent 24 hours prior
- [ ] Pull up prospect's pilot data: domain, dates, mockup version, order status
- [ ] Load side-by-side comparison: generated mockup + actual brand guidelines
- [ ] Have Van Westendorp pricing ladder printed or on second screen
- [ ] Open data tracker spreadsheet in column view
- [ ] Confirm nobody will interrupt (no Slack notifications visible)

---

### 1. Warm-Up (5 minutes)
**Goal:** Build rapport, set context, establish permission.

**Script:**
> "Thanks so much for taking this call — I really appreciate it. Quick agenda: I want to thank you for the pilot, get your feedback on how accurate our mockups were, understand the pricing that would work for you, and see if there are other ways your team could use this beyond what you tried. Should take about 45 minutes. Does that work?"

**Actions:**
- [ ] Recap pilot start date, domain name, what they used it for
- [ ] Ask: "How has the swag landed with your team so far?"
- [ ] Listen for any early signals (positive/negative tone)
- [ ] Log in tracker: `call_date`, `prospect_name`, `call_start_time`

---

### 2. Brand-Fidelity Validation (10 minutes)
**Goal:** Quantify accuracy of generated storefront mockups vs. actual brand guidelines.

**Setup:**
- Show generated mockup on screen (share window)
- Pull up actual brand guidelines (logo, color palette, typography) side-by-side
- Ask prospect to narrate what they see

**Script:**
> "I'm going to show you the mockup we generated alongside your actual brand guidelines. Walk me through: Does the logo placement look right? How about the colors — are they accurate? Typography? Overall, on a scale of 1 to 5, where 1 is 'completely off brand' and 5 is 'nailed it perfectly,' how accurately does this capture your brand?"

**Follow-Up Probes (if rating <4):**
- "What's missing or off-brand about it?"
- "What would you change to make it more accurate?"
- "Are there specific brand elements we didn't get right?"

**Data to Log:**
- `brand_fidelity_rating` (1–5)
- `brand_fidelity_comments` (verbatim, e.g., "Logo was too small, colors perfect")
- `specific_brand_fixes_needed` (list any changes they'd request)

---

### 3. Pricing & WTP Validation (10 minutes)
**Goal:** Establish acceptable price point using Van Westendorp pricing ladder.

**Setup:**
Share the 4-tier pricing ladder. Read each price point slowly.

**Script:**
> "Now let's talk pricing. I'm going to read four price points, and for each one, I want you to be honest: how would you feel?
>
> 1. **$2,000/year for Branded Fit Growth tier.** At that price, would this be so cheap you'd worry about quality?
> 
> 2. **$4,800/year** (our Brand Drop Pilot price). At that price, would this feel like a great bargain?
>
> 3. **$24,000/year** (annual contract for Growth tier). At that price, would this be acceptable for what you get?
>
> 4. **$36,000/year.** At that price, would it be too expensive?"

**Follow-Up Questions:**
- "Which of these feels like the 'sweet spot' to you?"
- "If we landed at $24K/year, would that trigger a buying decision? Why or why not?"
- "What's your current swag spend? How does $24K compare?"

**Data to Log:**
- `wtp_too_cheap` (price: $2K)
- `wtp_bargain` (price: $4.8K)
- `wtp_acceptable` (price: $24K) — **KEY METRIC**
- `wtp_too_expensive` (price: $36K)
- `wtp_comments` (rationale for acceptance/rejection of $24K)
- `current_swag_spend` (their annual budget, if disclosed)

---

### 4. Use-Case Fit & Multi-Use Potential (8 minutes)
**Goal:** Understand breadth of use cases beyond pilot; identify upsell opportunities.

**Script:**
> "Let's talk about use cases. What was your primary reason for running this pilot? Was it onboarding, a milestone event, or something else?"

**Listen & Probe:**
- "Beyond that, what other People Ops moments do you think could benefit from this? Exit kits? Referral rewards? Anniversary gifts? Holiday swag?"
- "How many times per year would you realistically order from us if we solved those use cases?"

**Use-Case Scoring (1–5 scale):**
- 1 = Onboarding only
- 2 = Onboarding + 1 other use case (e.g., milestone)
- 3 = 2–3 recurring use cases identified
- 4 = 3–4 use cases + clear annual cadence
- 5 = 5+ use cases + structured annual plan (quarterly ordering)

**Data to Log:**
- `primary_use_case` (e.g., "new hire onboarding")
- `secondary_use_cases` (list, e.g., "exit gifts, anniversary swag")
- `use_case_fit_score` (1–5)
- `estimated_annual_orders` (# of orders/year they'd place)

---

### 5. Speed & Provisioning Perception (7 minutes)
**Goal:** Validate that rapid provisioning (<10 min) meets expectations; measure satisfaction.

**Script:**
> "Let's talk about speed. From the time you submitted your domain to when you saw a live storefront, how long did that take?"

**Listen & Record:**
- Actual time from domain submission to live link (check pilot tracker data)
- Their perception: "Did that feel fast to you?"
- "On a scale of 1–5, how satisfied were you with that turnaround?"

**Follow-Up if <4/5 satisfaction:**
- "What would have made it faster?"
- "If we could do it in <5 minutes, would that change your willingness to order?"

**Data to Log:**
- `actual_provisioning_hours` (from domain submission to live link)
- `perceived_speed_rating` (1–5, "How fast did this feel?")
- `speed_satisfaction_score` (1–5, "How satisfied with turnaround?")
- `speed_comments` (what would improve it)

---

### 6. Storefront Impact & Employee Response (8 minutes)
**Goal:** Capture employee feedback and reorder intent signal.

**Script:**
> "Now, let's talk about impact. What was the reaction from your team when they received the swag? Did you get any feedback?"

**Listen & Probe:**
- "Did anyone specifically comment on the branded packaging or unboxing?"
- "Would your team be excited to receive this again?"
- "On a scale of 1–10, how likely is it that you'd recommend Branded Fit to a peer in People Ops?"
- "If we reached out in 3 months with another use case, would you be interested in ordering again?"

**Data to Log:**
- `employee_feedback_summary` (e.g., "Great unboxing experience, loved the personalization")
- `employee_nps_if_available` (any actual NPS collected from recipients)
- `reorder_likelihood_1to10` (1 = definitely not, 10 = definitely will)
- `peer_recommendation_1to10` (likelihood of recommending to People Ops peer)
- `estimated_cac_vs_ltv` (if they order again, what's the payback period?)

---

### 7. Objections & Next Steps (12 minutes)
**Goal:** Surface deal blockers; clarify path to annual contract conversion.

**Script:**
> "Before we wrap, I want to address any concerns. What would need to change for you to commit to an annual Growth contract with us?"

**Objection Categories & Counter Prompts:**

| Objection | Probe | Counter Setup |
|---|---|---|
| "Price is too high" | "What would feel right? $18K? $20K?" | [Acknowledge and pivot to value] |
| "Need to see more use cases first" | "Which use cases would trigger a decision?" | [Offer roadmap visibility] |
| "Concerned about brand accuracy" | "What would give you confidence?" | [Offer approval workflow, case studies] |
| "We're happy with [competitor]" | "What's working? What's missing?" | [Competitive positioning] |
| "Budget is locked until Q3" | "Would Q3 work if we held pricing?" | [Lock-in offer] |

**Closing Questions:**
- "If everything aligned on price and use cases, what's your timeline to decide?"
- "Who else needs to sign off on an annual contract?"
- "Can I send you a few case studies from peers who use similar cadences?"

**Data to Log:**
- `top_3_objections` (list, ranked by severity)
- `deal_blocker_y_n` (is any objection a hard stop?)
- `conversion_timeline` (if they committed, when would it be?)
- `next_touch_required` (case studies, pricing proposal, product demo, etc.)
- `stakeholder_info` (who else needs approval?)

---

### Post-Call (2 minutes)
- [ ] Thank prospect warmly
- [ ] Confirm next step: "I'll send you [case studies/proposal] by [date]. Look for it."
- [ ] Log: `call_end_time`, `call_duration_minutes`
- [ ] Review tracker for missing fields; fill gaps immediately while memory is fresh

---

## Part 3: Data Collection Tracker (29 Fields)

**File Format:** Google Sheets or Excel  
**Columns:** See below

| Field # | Field Name | Type | Example | Notes |
|---------|-----------|------|---------|-------|
| 1 | `call_date` | Date | 2026-06-17 | Format: YYYY-MM-DD |
| 2 | `prospect_name` | Text | Sarah Chen, Vanta | Full name + company |
| 3 | `prospect_company` | Text | Vanta | From pilot tracker |
| 4 | `prospect_role` | Text | Sr. Manager, People Ops | Title |
| 5 | `call_start_time` | Time | 14:30 UTC | Start of call |
| 6 | `call_end_time` | Time | 15:25 UTC | End of call |
| 7 | `call_duration_minutes` | Number | 55 | Calculated |
| 8 | `brand_fidelity_rating` | 1–5 | 4 | 1=Completely off, 5=Perfect |
| 9 | `brand_fidelity_comments` | Text | "Logo placement perfect; colors accurate; font too small" | Verbatim feedback |
| 10 | `specific_brand_fixes_needed` | Text | "Increase font size to 14pt" | What they'd change |
| 11 | `wtp_too_cheap_2k` | Y/N | Y | Would $2K feel TOO cheap? |
| 12 | `wtp_bargain_4_8k` | Y/N | Y | Would $4.8K feel like great bargain? |
| 13 | `wtp_acceptable_24k` | Y/N | Y | Would $24K be ACCEPTABLE? — **KEY** |
| 14 | `wtp_too_expensive_36k` | Y/N | N | Would $36K be too expensive? |
| 15 | `wtp_comments` | Text | "$24K fits in our annual People Ops budget (~$100K); $36K would need special approval" | Rationale |
| 16 | `current_annual_swag_spend` | Currency | $50,000 | What they spend now |
| 17 | `primary_use_case` | Text | "New hire onboarding" | Main pilot use case |
| 18 | `secondary_use_cases` | Text | "Exit gifts; 1-year anniversaries; referral rewards" | List other use cases |
| 19 | `use_case_fit_score` | 1–5 | 4 | 1=Onboarding only; 5=5+ cases |
| 20 | `estimated_annual_orders` | Number | 8 | Orders/year if all use cases active |
| 21 | `actual_provisioning_hours` | Decimal | 0.33 | Hours from domain→live (e.g., 20 min = 0.33) |
| 22 | `perceived_speed_rating` | 1–5 | 5 | "How fast did this feel?" |
| 23 | `speed_satisfaction_score` | 1–5 | 5 | "How satisfied with turnaround?" |
| 24 | `speed_comments` | Text | "Faster than any vendor we've used" | What would improve it? |
| 25 | `employee_feedback_summary` | Text | "Unboxing was delightful; team loved personalization; packaging felt premium" | Verbatim feedback |
| 26 | `reorder_likelihood_1to10` | 1–10 | 9 | 1=Never; 10=Definitely |
| 27 | `peer_recommendation_1to10` | 1–10 | 8 | Would recommend to peer? |
| 28 | `top_3_objections` | Text | "1) Price point; 2) Need proof on multi-use cases; 3) Internal approval timeline" | Ranked |
| 29 | `next_touch_required` | Text | "Send case studies on multi-use; pricing proposal for $24K" | Follow-up action |

---

## Part 4: Assumption Scoring Methodology

After all 5 calls are complete, aggregate results using this framework.

### Aggregation Formula

For each assumption, calculate % of respondents meeting success threshold:

```
Assumption Status = 
  IF % meeting threshold ≥ 80%  → CONFIRM
  IF % meeting threshold 60-79% → GRAY
  IF % meeting threshold <60%   → REFUTE
```

---

### Assumption-by-Assumption Scoring

#### Assumption #1: Brand-Fidelity NPS ≥4/5
- **Success Threshold:** ≥80% rate ≥4/5
- **Data Source:** `brand_fidelity_rating` column
- **Calculation:** Count responses ≥4 ÷ Total responses × 100
- **Example:** 4 out of 5 gave 4–5 = 80% → **CONFIRM**
- **Alternative:** If 3 out of 5 gave ≥4 = 60% → **GRAY**

#### Assumption #2: $24K WTP Acceptance
- **Success Threshold:** ≥80% rate $24K as "acceptable"
- **Data Source:** `wtp_acceptable_24k` column (Y/N)
- **Calculation:** Count Y responses ÷ Total × 100
- **Example:** 4 out of 5 said Y = 80% → **CONFIRM**

#### Assumption #3: Warm-Intro Conversion ≥15%
- **Success Threshold:** ≥15% of Step-9 warm prospects booked discovery call
- **Data Source:** Gmail tracking + calendar data (not tracker; external)
- **Calculation:** Booked calls ÷ Warm intros sent × 100
- **Note:** This is measured at campaign level, not per-call; aggregate after outreach completes

#### Assumption #4: Use-Case Fit ≥3/5
- **Success Threshold:** ≥80% score ≥3/5 on multi-use cases
- **Data Source:** `use_case_fit_score` column
- **Calculation:** Count responses ≥3 ÷ Total × 100
- **Example:** 4 out of 5 gave ≥3 = 80% → **CONFIRM**

#### Assumption #5: Provisioning Speed ≥4/5 for <10 min
- **Success Threshold:** ≥80% satisfied (≥4/5) AND actual time <10 min
- **Data Source:** `speed_satisfaction_score` column + `actual_provisioning_hours`
- **Calculation:** Count (satisfaction ≥4 AND hours <0.167 [10 min]) ÷ Total × 100
- **Example:** All 5 had <10 min delivery; 4 gave ≥4/5 satisfaction = 80% → **CONFIRM**

#### Assumption #6: Storefront Impact & Reorder Intent
- **Success Threshold:** ≥80% show reorder intent (≥8 on 1–10) OR employee NPS ≥8
- **Data Source:** `reorder_likelihood_1to10` + `peer_recommendation_1to10`
- **Calculation:** Count (reorder ≥8 OR peer_rec ≥8) ÷ Total × 100
- **Example:** 4 out of 5 gave ≥8 on reorder = 80% → **CONFIRM**

---

## Part 5: Aggregation Report Template

**File:** `step21_assumption_scorecard_final.md`

```markdown
# Step 21 Assumption Scorecard — Final Results
**Date:** [Synthesis date]
**Calls Completed:** 5 of 5 (Vanta, Linear, Census, Hex, Mercury)
**Data Quality:** [# gaps, # excellent responses]

## Assumption Status Summary

| Assumption | Status | % Confirming | Confidence | Evidence |
|---|---|---|---|---|
| Brand-Fidelity NPS ≥4/5 | CONFIRM / GRAY / REFUTE | 80% | HIGH / MEDIUM / LOW | [Avg rating: 4.2/5] |
| $24K WTP Acceptable | CONFIRM / GRAY / REFUTE | 80% | HIGH / MEDIUM / LOW | [4/5 accepted $24K] |
| Warm-Intro Conversion ≥15% | CONFIRM / GRAY / REFUTE | [%] | HIGH / MEDIUM / LOW | [e.g., 7 of 45 = 15.6%] |
| Use-Case Fit ≥3/5 | CONFIRM / GRAY / REFUTE | 80% | HIGH / MEDIUM / LOW | [Avg score: 3.6/5] |
| Provisioning Speed <10 min ≥4/5 | CONFIRM / GRAY / REFUTE | 80% | HIGH / MEDIUM / LOW | [Avg: 4.2 min; satisfaction: 4.4/5] |
| Storefront Impact & Reorder ≥8 | CONFIRM / GRAY / REFUTE | 80% | HIGH / MEDIUM / LOW | [Reorder intent: 8.4/10] |

## Overall Decision Readiness
- **High Confidence Assumptions (CONFIRM):** [#] of 6
- **Medium Confidence (GRAY):** [#] of 6
- **Low Confidence (REFUTE):** [#] of 6
- **Founder Decision Recommendation:** GO / CONTINGENT / PAUSE

## Top 3 Objections & Counters

| Objection | Frequency | Counter | Severity |
|---|---|---|---|
| [e.g., "Price too high for small companies"] | 2 of 5 | "Show unit economics for high-frequency orders" | Medium |
| [e.g., "Need proof on multi-use cases"] | 1 of 5 | "Send case study: Company X uses 4 use cases/year"] | Low |
| [e.g., "Approval timeline unclear"] | 1 of 5 | "Offer locked pricing guarantee through Q3 2026"] | Low |

## Financial Implications

- **Avg WTP:** $[calculated avg of acceptable prices]
- **Reorder Intent (Annual Revenue Model):** [Avg annual orders × $24K] = $[ARR projection]
- **Gross Margin Assumption:** [Based on pilot unit economics]
- **Payback Period:** [Months to recover CAC]

## Next Steps

1. [Action for GO decision: e.g., "Build multi-use-case landing page"]
2. [Action for objection counters: e.g., "Create case study for pricing objection"]
3. [Action for uncertain assumptions: e.g., "Run second cohort with verticals showing low-fit"]
```

---

## Part 6: Execution Checklist

Before starting calls:

### Pre-Execution (1 week before first call)
- [ ] Confirm all 5 pilot customers will participate (Vanta, Linear, Census, Hex, Mercury)
- [ ] Schedule 5 calls, 1–2 per day, across 2-week window (June 16–30, 2026)
- [ ] Send calendar invites with Zoom link + 2-day reminder
- [ ] Create shared Google Sheet tracker with 29 fields; share read-only link with stakeholders
- [ ] Export pilot data: domain, order date, delivery date for each customer
- [ ] Prepare side-by-side brand comparison files (generated mockup + guidelines) for each
- [ ] Print or digitize Van Westendorp pricing ladder
- [ ] Prep competitor comparison & case studies for objection handling
- [ ] Run test call with internal team member (15 min) to validate flow and timing

### During Calls
- [ ] Record call (with permission) for synthesis team reference
- [ ] Fill tracker in real-time; flag any data gaps
- [ ] Note verbatim quotes for decision memo
- [ ] Observe tone/enthusiasm: are they genuinely excited or politely interested?

### Post-Call (Same day)
- [ ] Fill any missing tracker fields
- [ ] Send thank-you email with promised follow-up (case studies, proposal, etc.)
- [ ] Tag transcript for synthesis team

### Post-All-Calls (Within 2 days)
- [ ] Aggregate all 5 rows in tracker
- [ ] Calculate % for each assumption
- [ ] Determine CONFIRM/GRAY/REFUTE status
- [ ] Write assumption scorecard (Part 5 template)
- [ ] Identify top 3 objections and rank by frequency
- [ ] Prepare 1-pager synthesis for founder decision memo (Step 24)

---

## Part 7: Success Criteria for Step 21 Completion

| Deliverable | Success Criterion |
|---|---|
| **Calls Completed** | 5 of 5 pilot customers called; ≥45 min each |
| **Data Collection** | 29 fields × 5 responses = 145 data points; <5% gaps |
| **Assumption Scoring** | All 6 assumptions scored CONFIRM/GRAY/REFUTE with % thresholds met |
| **Objection Synthesis** | Top 3 objections identified; severity ranked; counters prepared |
| **Quality Check** | Call recordings transcribed; quotes verified for accuracy |
| **Founder Readiness** | 1-pager assumption scorecard ready for Step 24 decision memo |

---

## Appendix: Example Call Transcript Snippet

**Call:** Vanta, Sarah Chen | **Date:** 2026-06-17 | **Duration:** 54 min

**[Segment 2: Brand-Fidelity]**

**Moderator:** "On a scale of 1 to 5, how accurately does this capture your brand?"

**Sarah:** "I'd say 4. The colors are spot-on, and the logo placement is clean. My only note is the font — you used a sans-serif, and we prefer serif headers in our brand guidelines. But that's a small tweak."

**Moderator:** "Great. So if we made that one font change, would you go to a 5?"

**Sarah:** "Probably, yeah. The overall aesthetic is definitely us."

**[Field logged: brand_fidelity_rating = 4, brand_fidelity_comments = "Colors & logo perfect; font should be serif per guidelines", specific_brand_fixes_needed = "Change header font to serif (e.g., Garamond)"]**

---

**[Segment 3: Pricing]**

**Moderator:** "At $24,000/year for the Growth tier, would that be acceptable?"

**Sarah:** "Yeah, that fits in our People Ops budget. We're spending about $50K a year on swag and experiences, so $24K is roughly half of that. We'd need to cut some of our other vendors, but it's doable."

**[Field logged: wtp_acceptable_24k = Y, current_annual_swag_spend = $50,000, wtp_comments = "Fits in budget (~50% of current spend); would require vendor consolidation"]**

---

## Conclusion

This framework operationalizes the discovery-call validation process for Step 21. It provides:

1. **Consistency:** Fixed agenda ensures all 5 calls follow the same script and cover the same assumptions
2. **Rigor:** 29-field tracker eliminates subjective interpretation; % thresholds are pre-defined
3. **Actionability:** Objections are captured and ranked; counters feed directly into Step 24 decision memo
4. **Speed:** Assumes 5 calls in 2 weeks; aggregation within 48 hours

By following this framework, the team will have quantified signals on all 6 assumptions within 2 weeks, enabling a high-confidence founder decision on the Growth contract positioning and annual ARR model.

---

**Document End**
