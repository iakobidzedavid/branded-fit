# Step 21→24 Synthesis Framework: Discovery Calls to Founder Decision Memo
**Version:** 1.0  
**Date:** 2026-06-15  
**Purpose:** Structured process to convert 5 discovery calls into a founder decision memo (Step 24)

---

## Overview: From Raw Call Data to Founder Recommendation

**Timeline:**
- Days 1-5: Conduct 5+ discovery calls (capture all data in tracker)
- Days 6: Aggregate raw signals
- Days 7: Build assumption scorecard
- Days 8: Synthesize learnings + write founder memo

**Output:** 1-2 page founder memo with GO/PIVOT/PAUSE recommendation + confidence level + next-steps playbook

---

## Phase 1: Aggregate Raw Signals (Day 6)

### Step 1a: Compile All Call Data
From the discovery call tracker (`2026-06-15_discovery_call_execution_tracker.md`), extract:

**For each call:**
- [ ] Prospect name, company, attendees, date
- [ ] All 6 assumption scores (1-5, yes/no, or NPS)
- [ ] Verbatim quotes for each assumption
- [ ] Top 3 objections
- [ ] Pilot interest (YES/MAYBE/NO)
- [ ] Estimated ACV
- [ ] Overall fit assessment (strong/moderate/weak)

**Create a summary sheet:**

| Call | A1 Score | A2 Score | A3 WTP | A4 Attribution | A5 % Onboarding | A6 NPS | Pilot Interest | ACV |
|------|----------|----------|--------|----------------|-----------------|--------|---|---|
| 1 | [n] | [$K/yr] | [$] | Y/N | [%] | [n] | YES/MAYBE/NO | $[n] |
| 2 | [n] | [$K/yr] | [$] | Y/N | [%] | [n] | YES/MAYBE/NO | $[n] |
| 3 | [n] | [$K/yr] | [$] | Y/N | [%] | [n] | YES/MAYBE/NO | $[n] |
| 4 | [n] | [$K/yr] | [$] | Y/N | [%] | [n] | YES/MAYBE/NO | $[n] |
| 5 | [n] | [$K/yr] | [$] | Y/N | [%] | [n] | YES/MAYBE/NO | $[n] |
| **AVG** | [avg] | [avg] | [mode] | [%] | [avg] | [avg] | [tally] | $[total] |

### Step 1b: Extract Verbatim Quotes
For each assumption, pull the **strongest quote** that illustrates the insight.

**Example:**
```
A1 (Brand Fidelity) — Call 2, Vanta
Quote: "Our brand is everything. If the colors are off by even 5%, our design 
team will flag it. It needs to be pixel-perfect before we order."
Interpretation: CONFIRMED — Brand fidelity is critical for this buyer.
```

### Step 1c: Tally Objections
List all objections that appeared across 5 calls:

| Objection | Frequency | Strong Quote |
|-----------|-----------|--------------|
| "Can you really handle brand guidelines?" | 3/5 | "[Quote from Call 1]" |
| "This is cool but we don't have budget" | 2/5 | "[Quote from Call 3]" |
| "What about SwagUp?" | 2/5 | "[Quote from Call 5]" |

---

## Phase 2: Score Each Assumption (Day 7 Morning)

### Scoring Methodology

**For each assumption, map call data to a CONFIRM/GRAY/REFUTE classification:**

---

### **A1: Brand-Fidelity Perception**
**Hypothesis:** Does the prospect care about exact hex-color, logo, and typography match?  
**Target:** NPS ≥8 for fidelity importance (4 out of 5 calls validate)

**Scoring Rules:**
- ✅ **CONFIRMED:** ≥4/5 calls scored brand fidelity as 8+ importance
- ⚠️ **GRAY:** 2-3/5 calls scored 8+, remainder 5-7
- ❌ **REFUTE:** ≤1/5 calls scored 8+

**Calculation (Example):**
```
Call 1 (Vanta): Brand fidelity importance = 9 ✅
Call 2 (Linear): Brand fidelity importance = 7 ⚠️
Call 3 (Census): Brand fidelity importance = 8 ✅
Call 4 (Hex): Brand fidelity importance = 8 ✅
Call 5 (Mercury): Brand fidelity importance = 6 ⚠️

Result: 3/5 scored 8+ → CONFIRMED (meets 4/5 bar? NO—only 3/5. Mark as GRAY.)
Confidence: GRAY (2-3/5 confirmed)
```

**Implication if CONFIRMED:**
- Product feature priority: Pixel-perfect color matching, brand-asset fidelity
- Messaging: Lead with "Your brand, exactly."
- Positioning: Brand stewards trust us

**Implication if GRAY:**
- Feature can be good-enough (90% match acceptable)
- Messaging: Lead with speed, not fidelity
- Positioning: Simplicity first, precision second

**Implication if REFUTE:**
- Brand fidelity is not a buying lever
- Deprioritize in sales playbook
- Focus on other pillars (speed, cost)

---

### **A2: Provisioning-Speed Perception**
**Hypothesis:** Is <10 minutes to live store table-stakes or a nice-to-have?  
**Target:** ≥40 hours/month saved = $5K+ annual value recognized (4 out of 5 calls)

**Scoring Rules:**
- ✅ **CONFIRMED:** ≥4/5 calls quantified ≥$5K annual value saved
- ⚠️ **GRAY:** 2-3/5 calls quantified $2-5K annual value
- ❌ **REFUTE:** ≤1/5 calls quantified >$2K value

**Calculation (Example):**
```
Call 1 (Vanta): 60 new hires/year × 5 hours saved per kit × $75/hour = $22.5K ✅
Call 2 (Linear): 30 new hires/year × 3 hours saved × $100/hour = $9K ✅
Call 3 (Census): "We don't really track time savings" = $0 ❌
Call 4 (Hex): 20 new hires/year × 4 hours saved × $80/hour = $6.4K ✅
Call 5 (Mercury): "Our people team would save maybe 2 hours a month" = $1.5K ❌

Result: 3/5 quantified >$5K → CONFIRMED? (Need ≥4/5. Only 3. Mark as GRAY.)
Avg recognized value: $7.9K (strong signal, but inconsistent recognition)
```

**Implication if CONFIRMED:**
- Speed is a financial lever (ROI clear)
- Messaging: Lead with "Save 40 hours/month"
- Positioning: Time = money
- Pricing: Can anchor higher (speed premium justified)

**Implication if GRAY:**
- Speed is valuable but not consistently quantified
- Messaging: Show calculation in sales deck
- Positioning: "Fast for busy teams"
- Pricing: Medium positioning (not as premium as if CONFIRMED)

**Implication if REFUTE:**
- Speed is not a buying driver
- Messaging: De-emphasize speed
- Positioning: Quality/delight-focused, not efficiency-focused

---

### **A3: $24K Growth-Tier WTP**
**Hypothesis:** At what annual price would ≥3/5 of prospects pilot?  
**Target:** ≥3/5 choose $24K or $36K tier

**Scoring Rules:**
- ✅ **CONFIRMED:** ≥3/5 select $24K or $36K
- ⚠️ **GRAY:** ≥3/5 select $12K but show interest in $24K if value proven
- ❌ **REFUTE:** ≥3/5 choose <$12K or negotiate significantly down

**Calculation (Example):**
```
Call 1 (Vanta): Selected $24K ✅
Call 2 (Linear): Selected $12K but noted "if we saw results, $24K makes sense" ⚠️
Call 3 (Census): Selected $24K ✅
Call 4 (Hex): Selected $24K ✅
Call 5 (Mercury): Selected $12K, "budget constrained" ❌

Result: 3/5 selected $24K → CONFIRMED (meets ≥3/5 bar: YES)
Mode WTP: $24K
```

**Implication if CONFIRMED:**
- Beachhead pricing is validated
- Messaging: "$24K annual investment" is anchored
- Positioning: Premium tier is realistic
- Next step: Launch $24K tier, use pilot model to de-risk

**Implication if GRAY:**
- WTP is conditional on proof
- Messaging: Lead with $4.8K pilot → $24K annual
- Positioning: Two-stage commitment model
- Next step: Nail pilot success metrics, upgrade path

**Implication if REFUTE:**
- Market WTP is lower than $24K
- Messaging: Price at $12K entry point
- Positioning: Freemium or low-cost model
- Next step: Revisit unit economics (may not hit targets)

---

### **A4: Warm-Intro Conversion**
**Hypothesis:** Did they take the call *because* of warm intro? Would cold email conversion be lower?  
**Target:** ≥80% attribute to warm path; ≥60% say they wouldn't take cold email

**Scoring Rules:**
- ✅ **CONFIRMED:** ≥4/5 attribute to warm intro AND say no to cold email
- ⚠️ **GRAY:** ≥4/5 attribute to warm intro but would take cold email
- ❌ **REFUTE:** ≤2/5 attribute to warm intro

**Calculation (Example):**
```
Call 1 (Vanta): "Knew [warm contact] and trusted their rec" + "Wouldn't have opened cold" ✅
Call 2 (Linear): "Warm intro helped but I was already interested" ⚠️
Call 3 (Census): "No warm intro actually, saw your blog post and reached out" ❌
Call 4 (Hex): "Direct intro from [warm contact]" + "Cold email would sit in spam" ✅
Call 5 (Mercury): "[Warm contact] flagged it" + "Probably would have replied to cold too" ⚠️

Result: 2/5 fully confirmed (A1 + B1), 2/5 partial (A1 but not B1), 1/5 no → GRAY
Warm-path attribution: 4/5 (80%) ✅ but cold-email resistance only 2/5 (40%) ❌
Classification: GRAY (warm path works, but cold path is more viable than expected)
```

**Implication if CONFIRMED:**
- GTM strategy: Warm-path only (maximize ROI per outreach)
- Messaging: Leverage community, peer networks
- Positioning: "Recommended by [peer]" in sales deck
- Next step: Formalize warm-path program (ambassador network)

**Implication if GRAY:**
- GTM strategy: Hybrid (warm path prioritized, but cold path viable)
- Messaging: Show credibility/social proof to offset cold email skepticism
- Positioning: "Trusted by [peers]" + third-party validation
- Next step: Improve cold email with social proof hooks

**Implication if REFUTE:**
- GTM strategy: Cold outreach is viable
- Messaging: Lead with value prop, not warm intro
- Positioning: Standalone product appeal, not network-dependent
- Next step: Optimize email sequences

---

### **A5: Use-Case Fit**
**Hypothesis:** Is onboarding-kit gifting their #1 swag use case or split across multiple?  
**Target:** Onboarding ≥40% of the stated use-case mix (average across 5 calls)

**Scoring Rules:**
- ✅ **CONFIRMED:** Average onboarding mention ≥40% across 5 calls; listed as #1 priority in ≥4/5
- ⚠️ **GRAY:** Average onboarding ≥25-40%; mixed priority ranking
- ❌ **REFUTE:** Average onboarding <25%; not mentioned in top 3 use cases

**Calculation (Example):**
```
Use-Case Mentions (tallied across all 5 calls):
- Onboarding: 5/5 mentioned, avg ranking #1.2 → 100% mention rate, #1 priority
- Events: 4/5 mentioned, avg ranking #2.5 → 80% mention rate, #2 priority
- Recognition: 3/5 mentioned, avg ranking #3.0 → 60% mention rate, #3 priority
- Milestones: 2/5 mentioned → 40% mention rate, #4 priority

For calls where all 3 were mentioned, split:
  Call 1: Onboarding 40%, Events 35%, Recognition 25% → Onboarding leads
  Call 2: Onboarding 50%, Events 30%, Recognition 20% → Onboarding leads
  Call 3: Onboarding 30%, Events 40%, Milestones 30% → Events leads (⚠️ concern)
  Call 4: Onboarding 45%, Events 35%, Recognition 20% → Onboarding leads
  Call 5: Onboarding 60%, Recognition 40% → Onboarding leads

Average onboarding %: (40+50+30+45+60) / 5 = 45% ✅
Consistency: 4/5 ranked onboarding #1 ✅

Classification: CONFIRMED (45% > 40% threshold, and #1 priority in 4/5)
```

**Implication if CONFIRMED:**
- Beachhead positioning is validated
- Messaging: "The #1 use case we see: onboarding kits"
- Product roadmap: Prioritize onboarding workflow
- Positioning: Onboarding specialist, not general swag tool
- Next step: Build onboarding-specific features (cohort calendar, batch orders)

**Implication if GRAY:**
- Onboarding is important but competitive with other use cases
- Messaging: "Onboarding first, events second"
- Product roadmap: Dual-persona support
- Positioning: Flexible swag platform with onboarding optimized
- Next step: Add events/recognition workflows to expand SAM

**Implication if REFUTE:**
- Onboarding is not the primary use case
- Messaging: Pivot to primary use case
- Product roadmap: Completely re-sequence features
- Positioning: General swag platform, not onboarding-focused
- Next step: Re-validate beachhead ICP

---

### **A6: Storefront Impact Perception**
**Hypothesis:** Do prospects see live storefront as table-stakes or a differentiator for employee delight?  
**Target:** NPS ≥7 for perceived delight lift (average across 5 calls)

**Scoring Rules:**
- ✅ **CONFIRMED:** Average storefront-delight NPS ≥7; ≥4/5 call it a "major differentiator"
- ⚠️ **GRAY:** Average NPS 5-6.5; mixed importance (some love it, some think it's feature-creep)
- ❌ **REFUTE:** Average NPS <5; seen as "nice-to-have" not essential

**Calculation (Example):**
```
Call 1 (Vanta): "Employee choice is a game-changer. They'd actually *want* the swag." NPS 9 ✅
Call 2 (Linear): "Nice feature. Employees would appreciate the autonomy." NPS 7 ✅
Call 3 (Census): "Honestly, we just want them to get *something*. Choice is secondary." NPS 5 ⚠️
Call 4 (Hex): "This is the coolest part. It's the difference between gifting and *gift*." NPS 8 ✅
Call 5 (Mercury): "Self-selection is nice but we're mainly focused on speed." NPS 6 ⚠️

Average NPS: (9+7+5+8+6) / 5 = 7.0 ✅ (meets ≥7 threshold)
"Differentiator" count: 3/5 (60%, below 4/5 ideal)

Classification: GRAY (hits NPS ≥7 bar, but not universal "game-changer" perception)
```

**Implication if CONFIRMED:**
- Storefront is a retention driver
- Messaging: "Employee delight through choice"
- Product feature: Core differentiator (invest heavily)
- Positioning: "Your employees choose. You delight."
- Next step: Build feedback loop (post-purchase NPS, retention tracking)

**Implication if GRAY:**
- Storefront is valuable but not universal priority
- Messaging: Lead with speed/brand, mention delight as secondary benefit
- Product feature: Good-to-have, not table-stakes
- Positioning: "Bonus: employees love the autonomy"
- Next step: Measure retention impact (does choice actually improve outcomes?)

**Implication if REFUTE:**
- Storefront is not a buying driver
- Messaging: De-emphasize self-selection
- Product feature: Consider building vs. pre-packed workflow
- Positioning: Fast, branded, done-for-you
- Next step: Re-evaluate product strategy (may be over-engineering)

---

## Phase 3: Build the Assumption Scorecard (Day 7 Afternoon)

### Template

| Assumption | Hypothesis | Target | Score (CONFIRM/GRAY/REFUTE) | Evidence | Key Quote | Implication |
|---|---|---|---|---|---|---|
| **A1: Brand Fidelity** | Prospect cares about exact hex/logo/typography match | NPS ≥8 (4+/5) | [CONFIRM/GRAY/REFUTE] | [Calculation] | "[Strong quote]" | [Product/Messaging/GTM implication] |
| **A2: Speed Value** | <10 min to live store is table-stakes | ≥$5K annual value (4+/5) | [CONFIRM/GRAY/REFUTE] | [Calculation] | "[Strong quote]" | [Implication] |
| **A3: $24K WTP** | Prospect will pay $24K+ for annual pilot | ≥3/5 choose $24K+ | [CONFIRM/GRAY/REFUTE] | [WTP distribution] | "[Strong quote]" | [Pricing implication] |
| **A4: Warm-Intro Conversion** | Warm path drives call + cold path lower | ≥80% attribute to warm; ≥60% wouldn't take cold | [CONFIRM/GRAY/REFUTE] | [Attribution %] | "[Strong quote]" | [GTM strategy implication] |
| **A5: Use-Case Fit** | Onboarding is #1 use case | Onboarding ≥40% of mix | [CONFIRM/GRAY/REFUTE] | [Use-case breakdown] | "[Strong quote]" | [Beachhead positioning implication] |
| **A6: Storefront Impact** | Live storefront is differentiator for delight | NPS ≥7 for delight lift | [CONFIRM/GRAY/REFUTE] | [NPS avg] | "[Strong quote]" | [Product strategy implication] |

---

## Phase 4: Synthesize into Founder Memo (Day 8)

### One-Page Founder Decision Memo Template

---

**BRANDED FIT — STEP 21 DISCOVERY CALL RESULTS & RECOMMENDATION**  
**Date:** 2026-06-15 → [Completion date]  
**Prepared by:** [Your name]  
**To:** Founder  
**Classification:** Internal Strategy

---

### EXECUTIVE SUMMARY & RECOMMENDATION

**Decision:** [GO / PIVOT / PAUSE]  
**Confidence Level:** [HIGH / MEDIUM / LOW]  
**Rationale:** [One sentence why]

Of 6 critical assumptions tested in 5 discovery calls (Vanta, Linear, Census, Hex, Mercury):
- **[N] CONFIRMED** (4-5/5 calls validated)
- **[N] GRAY** (2-3/5 calls validated)
- **[N] REFUTE** (≤1/5 calls validated)

**Bottom line:** [One-sentence thesis on market viability]

---

### KEY FINDINGS

#### Assumption Validation Summary

| Assumption | Status | Evidence | Implication |
|---|---|---|---|
| **A1: Brand Fidelity** | [CONFIRM/GRAY/REFUTE] | [NPS: X/5 avg] | [For product] |
| **A2: Speed Value** | [CONFIRM/GRAY/REFUTE] | [Value recognized: $X avg] | [For messaging] |
| **A3: $24K WTP** | [CONFIRM/GRAY/REFUTE] | [X/5 selected $24K+] | [For pricing] |
| **A4: Warm-Intro Conversion** | [CONFIRM/GRAY/REFUTE] | [X/5 warm-path attribution] | [For GTM] |
| **A5: Use-Case Fit** | [CONFIRM/GRAY/REFUTE] | [Onboarding: X% of mix] | [For positioning] |
| **A6: Storefront Impact** | [CONFIRM/GRAY/REFUTE] | [Delight NPS: X/10 avg] | [For retention] |

#### Top 3 Learnings

**Learning #1:** [Biggest surprise / insight from calls]  
*Evidence:* [Key quote] — [Call reference]  
*Action:* [What we do with this]

**Learning #2:** [Second biggest insight]  
*Evidence:* [Key quote] — [Call reference]  
*Action:* [What we do with this]

**Learning #3:** [Third biggest insight]  
*Evidence:* [Key quote] — [Call reference]  
*Action:* [What we do with this]

#### Top 3 Objections & Win Rate

| Objection | Frequency | Win Rate | Proven Counter |
|---|---|---|---|
| [Objection #1] | X/5 | [% of objectors who moved to pilot] | [Tactic that worked] |
| [Objection #2] | X/5 | [%] | [Tactic] |
| [Objection #3] | X/5 | [%] | [Tactic] |

---

### PILOT CONVERSION PIPELINE

**Pilot Interest Summary:**
- **PILOT YES (Ready to sign):** [N] prospects, $[ACV] estimated revenue, [Timeline]
- **PILOT MAYBE (Needs more info):** [N] prospects, $[ACV] estimated revenue, [Timeline]
- **PILOT NO:** [N] prospects

**Total addressable revenue from cohort:** $[Total ACV]

**Recommended next steps for each segment:**
- **YES:** Send SOW within 24h. Target start date: [Date]
- **MAYBE:** Follow-up call in [3-7 days]. Provide: [Specific info they asked for]
- **NO:** Document objection for future iteration. Offer peer intro to [company]

---

### DECISION FRAMEWORK

#### GO: Launch $24K Growth Tier
**Recommended if:** ≥4/6 assumptions CONFIRMED + ≥2 PILOT YES + favorable unit economics

**Next steps:**
1. Launch $24K tier (pricing confirmed by market)
2. Convert PILOT YES → SOW → fulfillment (expect [X] pilots in next 30 days)
3. Build retention tracking (post-pilot NPS survey, 30/60/90 cohort tracking)
4. Scale warm-path GTM (expand from 5 to 20+ prospects in July)
5. Prepare Y1 financial plan ($[projected ARR] based on conversion pipeline)

**Timeline:** Launch by [Date], first pilots ship by [Date], measure impact by [Date]

---

#### PIVOT: Adjust Product / Messaging / Pricing & Re-Test
**Recommended if:** 2-3 assumptions GRAY + unclear unit economics + mixed pilot interest

**Decision point:** Which lever needs adjustment?
- **Product:** [If A6 (storefront) is GRAY, simplify product; if A1 (brand fidelity) is GRAY, invest in matching engine]
- **Messaging:** [If A2 (speed value) is GRAY, better quantification in sales deck]
- **Pricing:** [If A3 (WTP) is GRAY, test $12K entry point instead of $24K]

**Next steps:**
1. Implement specific product/messaging/pricing change by [Date]
2. Re-test with [3-5 new prospects or same cohort] by [Date]
3. Make GO/PIVOT/PAUSE decision by [Date]

**Hold:** Don't launch $24K tier until we resolve [specific assumption]

---

#### PAUSE: Market Timing / Product Fit Issue
**Recommended if:** ≥2 assumptions REFUTE + ≤1 PILOT YES + major objection unresolved

**Root cause analysis:**
- [If A5 use-case is REFUTE: "Onboarding isn't actually their #1 problem—events are. We're selling to the wrong ICP."]
- [If A3 WTP is REFUTE: "Market WTP is $12K, not $24K. Unit economics don't work at current feature set."]

**Next steps:**
1. Identify root cause (product-market fit issue vs. GTM issue vs. timing issue)
2. Decide: Pivot ICP (different buyer persona), or pause and revisit in [3-6 months]
3. Document learning and circle back to founders

**Hold:** Pause all launch activities until root cause resolved

---

### CONFIDENCE RATIONALE

**Confidence: [HIGH / MEDIUM / LOW]**

- **HIGH:** ≥5/6 assumptions CONFIRMED, ≥2 PILOT YES, strong unit economics, clear next steps
- **MEDIUM:** 3-4/6 assumptions CONFIRMED or GRAY, ≥1 PILOT YES, one lever needs adjustment
- **LOW:** ≤2/6 CONFIRMED, 0 PILOT YES, multiple unresolved assumptions

**Why this confidence level:**
[Explain which assumptions are rock-solid vs. which are still uncertain]

---

### APPENDIX: CALL-BY-CALL SUMMARY

**Call 1: Vanta** | Date: [Date] | Pilot: YES | ACV: $24K  
[2-3 sentence summary of key insights + assumptions scored]

**Call 2: Linear** | Date: [Date] | Pilot: MAYBE | ACV: TBD  
[2-3 sentence summary]

**Call 3: Census** | Date: [Date] | Pilot: NO | Objection: [Primary objection]  
[2-3 sentence summary]

**Call 4: Hex** | Date: [Date] | Pilot: YES | ACV: $24K  
[2-3 sentence summary]

**Call 5: Mercury** | Date: [Date] | Pilot: MAYBE | ACV: $12K  
[2-3 sentence summary]

---

**Prepared by:** [Name]  
**QA'd by:** [Peer reviewer if available]  
**Sent:** [Date]  
**Next Sync:** [Founder review date/time]

---

## FAQ: What If I Get Mixed Results?

### "3/6 assumptions are GRAY—what should I do?"
**Answer:** This is actually the most common outcome. Gray means "need to adjust one lever (product/messaging/pricing) and re-test." Document which Gray assumptions are highest-priority (most impact on revenue) and focus your PIVOT effort there.

### "Nobody wants to pay $24K—they all chose $12K."
**Answer:** This is a REFUTE on A3. Options:
1. **PIVOT pricing:** Launch at $12K tier instead (likely halves ACV but increases volume)
2. **PIVOT positioning:** Maybe $24K is right but for a different buyer (e.g., larger companies)
3. **PIVOT product:** Maybe $24K is right once you add [feature]. What would justify $24K?

### "Everyone loved it but nobody committed to a pilot."
**Answer:** This is a contradiction (CONFIRMED assumptions but NO pilots). Root causes:
- **Budget:** They love it but money is locked (PIVOT: offer $4.8K Brand Drop Pilot as lower commitment)
- **Timing:** They want it but not now (PIVOT: nurture funnel + 90-day follow-up)
- **Authority:** They love it but need peer approval (PIVOT: add peer references to sales deck)

Pick the likeliest cause and adjust GTM.

---

**Framework prepared:** 2026-06-15  
**Expected completion:** 2026-06-22 (post-call synthesis)  
**Owner:** [Founder or sales lead]
