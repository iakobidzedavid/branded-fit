# Live-to-Testing Gate Criteria & Weekly Learnings Sync
**Established:** 2026-06-11  
**Owner:** Founder / Head of Growth (Outreach Lead)  
**Purpose:** Formal decision criteria to prevent ambiguous "maybe launch live" delays and establish structured escalation from testing (10 prospects) to live (50+ prospects) campaign phases.

---

## Executive Summary

This document codifies the explicit go/no-go decision framework for promoting Branded Fit's warm outreach campaign from testing phase (10 Gmail sends) to live campaign (50+ Gmail sends). The framework eliminates ambiguity by defining:
- **Testing phase duration**: 7–14 days from first send
- **Promotion success metrics**: 4 quantifiable thresholds (all must be met)
- **Owner & decision authority**: Single decision-maker (Outreach Lead) with unilateral authority
- **Weekly learnings sync**: Structured 30-min Monday meeting to track metrics, surface objections, and flag product blockers
- **Escalation path**: Clear process for borderline decisions (thresholds landed exactly at gate requirements)

**Goal:** By Day 7, the Outreach Lead will have one unambiguous decision: **SCALE to live (50+ prospects)**, **ITERATE with fresh cohort (14 more days)**, or **PAUSE and PIVOT (repositioning required)**.

---

## Section 1: Testing Phase Definition

### Phase Duration
- **Start date**: Day 1 = date of first Gmail send to testing cohort
- **Day 7 decision checkpoint**: Outreach Lead reviews metrics on Day 7 and decides GO/ITERATE/PAUSE
- **If ITERATE**: Testing extends to Day 14 (14 additional days with refreshed 10-prospect cohort)
- **If GO or PAUSE**: Exit testing phase and move to live campaign or strategy pivot

### Testing Cohort Size
- **Initial 10 prospects**: Named Step-9 targets, validated Apollo ≥90% confidence, warm-path identified
- **If ITERATE**: Fresh cohort of 10 new prospects (not the original 10 who received version 1)

### Testing Email Variants
During testing phase, the Outreach Lead may test up to 3 email variant versions (cold, warm-intro, or pilot-offer messaging) if metrics are ambiguous on Day 7. Each variant targets a subset of the 10 (e.g., 3 cold, 4 warm-intro, 3 pilot-offer) to isolate which messaging pillar resonates best.

---

## Section 2: Success Metrics for Promotion to Live Campaign

**ALL 4 metrics below must be MET to proceed to live campaign. If 2–3 metrics are met, ITERATE. If <2 metrics are met, PAUSE.**

### Metric 1: Response Rate ≥30%
- **Definition**: Percentage of the 10 testing-wave prospects who reply to the initial email (any reply, including soft objections)
- **Success threshold**: ≥3 replies minimum (3/10 = 30%)
- **Measurement**: Count confirmed email replies in inbox or CRM tracker
- **Rationale**: 30% response rate validates that the value prop is resonating enough to trigger engagement; <30% indicates messaging misalignment

### Metric 2: Objection Rate <40%
- **Definition**: Percentage of replies that contain a **hard objection** (deal-blocking concern)
- **Hard objections** (count toward this metric):
  - "Already using [vendor name]"
  - "No budget" / "Pricing not viable"
  - "Not interested in this category"
  - "Not a priority right now" (if stated firmly without future window)
  
- **Soft objections** (do NOT count toward this metric):
  - "Need to think about it" / "Let me discuss with team"
  - "Send more info"
  - "Can you adjust [feature]?"
  - "Interested but need to check with [CFO/board/spouse]"
  - "Timing is bad, but open to revisiting in Q3"

- **Success threshold**: <40% of replies contain hard objections (e.g., if 3 replies, max 1 hard objection)
- **Measurement**: Outreach Lead scores each reply as Hard Objection (1) or Soft Objection / Positive Intent (0) in tracker
- **Rationale**: Hard objections indicate fundamental misalignment with buyer's needs or circumstances; soft objections indicate potential deal with adjusted approach

### Metric 3: Pilot Intent ≥1
- **Definition**: At least 1 prospect explicitly expresses willingness to explore a paid Brand Drop Pilot ($4,800) or discovery call with founder
- **What counts as pilot intent**:
  - "I'd like to see a mockup / demo"
  - "Let's set up a call to discuss"
  - "Send me pricing and details"
  - "I'm interested in trying this for [use case]"
  - "Let's pilot this with [department]"
  
- **What does NOT count**:
  - "I'll keep this in mind" (vague interest without commitment to discuss)
  - "Sounds interesting" (no next step implied)
  - "I'd need to see [feature] first" paired with a hard objection

- **Success threshold**: ≥1 prospect explicitly states interest in pilot or discovery call
- **Measurement**: Outreach Lead flags prospect name and exact quote in tracker
- **Rationale**: Pilot intent is the primary leading indicator of conversion; 0 pilot intent after 10 sends signals the value prop or ICP are misaligned

### Metric 4: Email Open Rate ≥40% (if Gmail integration supports tracking)
- **Definition**: Percentage of the 10 testing-wave emails that are opened within 48 hours of send
- **Success threshold**: ≥4 opens within 48 hours (4/10 = 40%)
- **Measurement**: Gmail API tracking pixel or manual open tracking via email client; log timestamp of open in tracker
- **Rationale**: 40%+ open rate validates that subject line and sender credibility (warm intro / founder email) are sufficient to drive engagement
- **Conditional**: If Gmail tracking is not yet implemented, this metric is waived; focus on Metrics 1–3

---

## Section 3: Go/No-Go Decision Logic

### GO to Live Campaign (Scale to 50+ Prospects)
**Criteria**: ALL 4 metrics met
- Response rate ≥30% ✓
- Objection rate <40% ✓
- Pilot intent ≥1 ✓
- Email open rate ≥40% (or N/A) ✓

**Actions**:
1. Outreach Lead declares **GO** decision in #outreach Slack channel with summary (e.g., "3 responses, 1 hard objection, 2 pilot intents, 45% open rate → GREEN LIGHT")
2. Prospect Research Lead builds 50-prospect list using Apollo (≥90% confidence) + warm-intro signal verification
3. Product Head / Founder approves expanded messaging playbook (5 email variants for A/B testing at scale)
4. Outreach Lead queues 50 Gmail sends for Week 2 (staggered sends, 5-10/day over 5-7 days)
5. Response Tracker expanded to 50-prospect capacity; daily standups resume for 7 days (Week 2)
6. Success criteria for live phase: ≥15 responses, ≥2 discovery calls booked, ≥3 pilot SOWs signed

### ITERATE and Extend Testing (14 Additional Days)
**Criteria**: 2–3 metrics met, but response rate or pilot intent is borderline
- Response rate 20–29% (1–2 replies) OR pilot intent = 0 with open rate ≥40%
- Objection rate near 40% but salvageable with messaging tweaks
- Email open rate low (<35%) despite good response rate (suggesting sample size/timing variance)

**Actions**:
1. Outreach Lead calls emergency sync with Founder + Product Lead to diagnose blockers
2. Map top objections to messaging adjustments (see Section 4: Objection-Driven Messaging Refinement)
3. Test refined messaging on fresh 10-prospect cohort (different names, same ICP filters)
4. Reset Day 1 counter; execute same 7-day checkpoint on new cohort
5. Log both cohorts in tracker with version labels (v1, v2) to compare performance
6. On Day 14 (cumulative), make final GO/PAUSE decision based on combined metrics (v1 + v2)

**Example iteration trigger**: 
- "Response rate = 20% (2/10), pilot intent = 1, objection rate = 33%, open rate = 42% → ITERATE. Two metrics borderline. Refine value prop for objection 'No budget' and resend to fresh cohort."

### PAUSE and PIVOT (Do Not Scale)
**Criteria**: <2 metrics met, or objection rate >40%, or zero pilot intent with low open rate
- Response rate <20% (<2 replies) combined with low open rate (<35%)
- Objection rate >40% (3+ hard objections out of 5+ replies)
- Pilot intent = 0 AND response rate <30%
- Open rate <30% consistently across both send times

**Actions**:
1. Outreach Lead schedules urgent pivot meeting with Founder + Product Lead + GTM Lead
2. Diagnostic assessment:
   - **Is it audience fit?** Wrong ICP (e.g., People Ops too junior; should pivot to Field Marketing leaders)
   - **Is it product fit?** Step 7 MVBP missing critical feature (e.g., "I need Slack integration"); flag for roadmap
   - **Is it messaging?** Value prop not resonating (e.g., "Speed" pillar not landing; pivot to "Brand Fidelity" or "Risk Mitigation")
3. Decision options:
   - **Reposition value prop**: Keep same ICP, completely rewrite cold email and refresh 10 prospects
   - **Target different vertical**: Keep same messaging, pivot to different industry segment (e.g., Field Marketing vs. People Ops)
   - **Defer campaign**: Park warm outreach for 2–4 weeks while Product fixes blockers or Marketing tests new positioning with non-prospect audience
4. Do NOT scale to 50+ until at least 2/4 metrics pass on new cohort

---

## Section 4: Owner and Decision Authority

### Outreach Lead Role Definition
**Title**: Founder or Head of Growth  
**Authority**: Unilateral decision-maker on Day 7 (or Day 14 if iterating) based on the 4 metrics above  
**No committee approval required** — decision is Outreach Lead's own judgment call

### Decision-Making Process
1. **Day 6 evening**: Outreach Lead reviews all data (responses, open rates, objections, pilot intent) in tracker
2. **Day 7 morning**: Outreach Lead drafts decision memo with metric scorecard
3. **Day 7, 9–10 AM PT**: Outreach Lead announces decision in #outreach Slack with clear GO/ITERATE/PAUSE label
4. **No ambiguity**: Decision must be one of these three states. No "let's wait a few more days" delays

### Escalation to Founder (If Outreach Lead is not Founder)
If Outreach Lead is a team member (e.g., Head of Growth), Founder has veto power on Day 7 decision **only if metrics are ambiguous** (e.g., exactly 3 replies with exactly 1 hard objection, exactly 1 pilot intent). See Section 5 for ambiguity resolution.

---

## Section 5: Escalation Path for Ambiguous Metrics

### 48-Hour Extension (If Metric Lands Exactly at Threshold)
**Trigger**: A single metric is exactly at threshold (e.g., 30% response rate = exactly 3/10, or 40% open rate = exactly 4/10)

**Process**:
1. Outreach Lead can request a **48-hour extension** to gather one additional data point before finalizing decision
2. Example: "Response rate = 3/10 (exactly 30%); if 1 more reply arrives in next 48 hours, we hit ITERATE threshold and can gather more signal"
3. If additional data point arrives (4th reply, 5th open, etc.) → decision stands with new calculation
4. If no additional data arrives → use original threshold calculation to make decision

### Soft-Yes Prospects (Pending Confirmation)
**Definition**: A prospect replies with "interested but need to check with CFO" and commits to follow-up within 5 days

**Treatment**:
- Count as pilot intent **pending confirmation** in Day 7 decision (label as "1 pilot intent, 0 confirmed")
- If prospect confirms YES within 5 days → counts toward conversion intent
- If prospect confirms NO → downgrade to soft objection, adjust metrics retroactively if decision was borderline

### Founder Veto Scenario
**Rare case**: Outreach Lead declares **GO** based on metrics (3 responses, 0 hard objections, 1 pilot intent, 45% open rate), but Founder observes qualitative feedback suggesting positioning is misaligned (e.g., "all 3 responses are asking about 1 feature we don't have").

**Override process**:
1. Founder schedules 30-min call with Outreach Lead + Product Lead to surface concern
2. Founder can veto scale decision if: (a) hard blocker is identified (product gap), OR (b) objection pattern suggests ICP misalignment (not just sample size variance)
3. Decision reverts to ITERATE or PAUSE with documented reasoning in #outreach channel
4. **Note**: This override is rare and must be grounded in evidence, not gut feel; decision memo must be posted to Slack for transparency

---

## Section 6: Weekly Learnings Sync Schedule & Agenda

### Meeting Details
- **Cadence**: Every Monday at 10 AM PT, starting immediately after first 10 Gmail sends
- **Duration**: 30 minutes (hard stop)
- **Attendees**: 
  - Founder
  - Outreach Lead
  - Product Lead
- **Location**: Zoom (link pinned in #outreach Slack channel)
- **Recordings**: Optional (no transcription required, but Founder notes shared to #outreach channel)

### Agenda (Fixed Structure)
1. **Metric Check-In (8 min)**
   - Current counts: [X replies], [Y hard objections], [Z pilot intents], [W opens]
   - Trend from prior Monday (if applicable)
   - On track to hit gate metrics by Day 7? (Y/N)
   - Quick flags: any invalid email addresses, bounces, or non-opens?

2. **Qualitative Feedback: What Are Prospects Saying? (8 min)**
   - Read 1–2 representative quotes from replies (best and worst feedback)
   - Themes: Do prospects understand the value prop? Which pillar resonates? (Speed / Brand Fidelity / Fulfillment)
   - Pricing sensitivity: Any mentions of "too expensive" or budget constraints?
   - Timeline: Are prospects interested but delayed, or truly uninterested?

3. **Product Blockers (6 min)**
   - Any objections rooted in missing features? (e.g., "Do you integrate with Slack?")
   - Are these blocker themes consistent across multiple prospects, or isolated?
   - Recommended roadmap priority: High / Medium / Low / Defer
   - Product Lead commits to next steps (e.g., "We'll add Slack integration to Q3 roadmap, but it's not Day 1 blocker")

4. **Messaging Adjustments (5 min)**
   - Based on objections, should we tweak cold email? Demo link? CTA? Subject line?
   - Recommend specific changes with rationale (e.g., "Shift from 'Speed' to 'Brand Fidelity' in subject line; 3 prospects mentioned brand accuracy concerns")
   - Decision: Deploy changes to cohort v2 (if iterating) or shelve for live-phase A/B tests?

5. **Forecast: Will We Hit Gate Metrics? (3 min)**
   - Outreach Lead gives gut-check: On current trajectory, will we hit all 4 metrics by Day 7?
   - If NO: What's the likely outcome? (ITERATE or PAUSE?)
   - Any contingency actions needed? (e.g., "Send follow-up email to soft-objection prospects on Day 5")

### Weekly Learnings Sync Output
**By EOD Monday (5 PM PT)**: Outreach Lead posts 2–3 minute summary to #outreach channel with:
- Metric snapshot (e.g., "Day 7 checkpoint: 3 responses, 1 hard objection, 1 pilot intent, 40% open rate")
- Top 1–2 objection themes (exact quotes)
- Product blockers identified (if any)
- Messaging changes tested (if any)
- Forecast: On track for GO/ITERATE/PAUSE?
- Next actions (e.g., "Send follow-up email Day 5", "Outreach Lead testing subject line variant Thursday")

**Example Slack Summary**:
```
📊 Warm Outreach Weekly Learnings Sync — June 12, 2026

METRICS (Day 5 of 7):
• Responses: 2/10 (20%)
• Hard Objections: 1 ("already using SwagUp")
• Pilot Intent: 1 ("interested in discussing mockup")
• Open Rate: 38% (not yet at 40% threshold)

FEEDBACK THEMES:
🔴 "Why should we switch from SwagUp?" — appears in 1 reply; messaging needs to compare value prop directly
🟡 "Can this integrate with Slack?" — 2 prospects asked; flagged for roadmap, not Day 1 blocker
🟢 "Love the 14-day turnaround" — positive feedback on Speed pillar from 1 prospect

PRODUCT BLOCKERS:
- Slack integration requested; Product Lead moving to Q3 (acceptable for MVP)
- No other blockers identified

MESSAGING ADJUSTMENTS:
- Testing new subject line: "Brand mockup in 90 seconds, not 6 weeks" (emphasizing Speed more directly)
- Will send variant to prospects 7–10 starting Day 6 to test vs. original

FORECAST:
🟡 BORDERLINE ITERATE — Current trajectory suggests 2–3 responses by Day 7, which is below 30% threshold
Next steps: Follow up with 3 non-responders on Day 6 morning; deploy subject line variant immediately

—Outreach Lead
```

---

## Section 7: Response Tracking Schema

### 18-Column Tracker
Every email send, open, reply, and objection is logged in a shared Google Sheet or Supabase table with these fields:

| # | Column Name | Data Type | Example | Notes |
|---|---|---|---|---|
| 1 | Prospect Name | Text | Sarah Chen | Full name |
| 2 | Company | Text | Ramp | Step-9 target |
| 3 | Email | Email | sarah@ramp.com | Validated Apollo ≥90% |
| 4 | Role | Text | Head of People Ops | Decision-maker role |
| 5 | Warm-Path Signal | Text | Mutual connection: Alex at Y Combinator | How we sourced contact |
| 6 | Email Variant | Text | A (Cold) / B (Warm-Intro) / C (Pilot-Offer) | Testing cohort version |
| 7 | Send Date | Date | 2026-06-11 | YYYY-MM-DD |
| 8 | Send Time | Time | 10:30 AM PT | For open-rate analysis |
| 9 | Email Open? | Boolean | Yes | Tracking pixel or manual |
| 10 | Open Date/Time | Date+Time | 2026-06-11 10:45 AM | If opened |
| 11 | Reply Received? | Boolean | Yes | Within testing window |
| 12 | Reply Date | Date | 2026-06-12 | YYYY-MM-DD |
| 13 | Reply Text (Summary) | Text | "Interested in mockup, let's chat" | 100-char summary |
| 14 | Objection Type | Text | Soft: "Need to think about it" | Hard or Soft |
| 15 | Pilot Intent? | Boolean | Yes | Interest in discovery call or pilot |
| 16 | Next Action | Text | Send SOW link / Follow-up Day 5 / Archive | Outreach Lead decision |
| 17 | Status | Text | In Progress / Converted / Paused | Current state |
| 18 | Notes | Text | Mentioned 3 pain points; warm intro via Alex | Any qualitative detail |

---

## Section 8: Critical Assumptions & Risk Mitigations

### Assumption 1: 10 Prospects Are Sufficient Sample
- **Assumption**: 10 email sends will produce enough signal (3+ replies) to evaluate messaging
- **Risk**: Sample too small; random variance dominates signal
- **Mitigation**: If <2 replies by Day 5, Outreach Lead can pre-authorize extended sends to 10 additional prospects (fresh cohort) to increase sample

### Assumption 2: 7 Days Is Enough Time for 30%+ Response
- **Assumption**: Step-9 decision-makers check email regularly; 70% of responses arrive within 48 hours, 30% within 2–7 days
- **Risk**: Slower email cadence in summer; 14-day data would be more reliable
- **Mitigation**: If Day 7 checkpoint shows 1–2 replies with high open rate, allow 48-hour extension (see Section 5)

### Assumption 3: Hard vs. Soft Objection Classification Is Objective
- **Assumption**: Outreach Lead can reliably classify "already using competitor" as Hard and "need to think about it" as Soft
- **Risk**: Borderline cases (e.g., "Our CFO won't approve new spend" — is this a budget hard objection or a soft "need approval" objection?)
- **Mitigation**: Outreach Lead documents classification rationale in tracker; if ambiguous, Founder makes final call on Day 6

### Assumption 4: Pilot Intent Signal Is Reliable
- **Assumption**: "Let's set up a call" = real conversion likelihood
- **Risk**: Prospect says yes to call but doesn't show up; soft intent masquerading as firm intent
- **Mitigation**: Classify pilot intent as "confirmed" only if prospect accepts calendar invite or replies with specific date/time availability

---

## Section 9: Success Criteria for Live Campaign Phase (Week 2+)

Once approved for live campaign (50+ prospects), success is measured by:

| Metric | Target | Measurement |
|---|---|---|
| **Response Rate** | ≥25% (12–13 replies) | Email replies in inbox + CRM |
| **Pilot Conversion Rate** | ≥4% (2+ discovery calls booked) | Calendar confirms + Zoom links sent |
| **Discovery Call → SOW Rate** | ≥50% (1+ SOWs signed) | DocuSign or Slack signed agreement |
| **Email Open Rate** | ≥35% (17–18 opens within 48h) | Gmail tracking pixel |
| **Hard Objection Rate** | <30% | Outreach Lead classification |

Live campaign runs for 14 days (Week 2–3), with daily standups and go/no-go decision on Day 14 for further expansion (100+ prospects) or pivot.

---

## Section 10: Post-Campaign Learning & Iteration

### Data Archival
- All response tracker data (testing + live phases) archived to `documents/response_tracker_[date].csv`
- Discovery call recordings & notes stored in shared folder for Product/GTM review

### Founder Decision Memo
- By Day 21 (end of live campaign), Founder Decision Memo synthesizes:
  - Actual conversion rates (prospects → discovery calls → SOWs)
  - Top 3 objections with counters
  - WTP feedback (pricing receptivity)
  - Brand-fidelity validation
  - Recommendation: Scale further, pivot positioning, or pause campaign

### GTM Playbook Update
- Winning email templates, subject lines, and objection counters baked into GTM Messaging & Sales Collateral playbook
- ICP refinements documented (e.g., "Head of People Ops at Series B tech companies" confirmed vs. rejected)
- Messaging pillars ranked by conversion impact (e.g., "Speed" resonated 2x better than "Brand Fidelity")

---

## Appendix A: Decision Tree (Quick Reference)

```
Day 7 Metric Review
│
├─ ALL 4 metrics met?
│  │
│  ├─ YES → GO to Live Campaign (50+ prospects)
│  │        Actions: Build 50-list, queue Week 2 sends, daily standups
│  │
│  └─ NO → Proceed to next check
│
├─ 2–3 metrics met (response rate or pilot intent near threshold)?
│  │
│  ├─ YES → ITERATE (14 more days, fresh 10-prospect cohort)
│  │        Actions: Refine messaging, reset Day 1 clock, map objections
│  │
│  └─ NO → Proceed to next check
│
└─ <2 metrics met OR objection rate >40% OR pilot intent = 0?
   │
   └─ YES → PAUSE and PIVOT
            Actions: Diagnostic meeting, reposition or change ICP, defer 2–4 weeks
```

---

## Appendix B: Sample Weekly Learnings Sync Agenda (Filled Template)

**Date:** Monday, June 12, 2026  
**Time:** 10 AM PT  
**Attendees:** Founder, Outreach Lead, Product Lead

### 1. Metric Check-In (8 min)
| Metric | Target | Actual | Status |
|---|---|---|---|
| Response Rate | ≥30% | 20% (2/10) | ⚠️ Below target |
| Objection Rate | <40% | 50% (1 hard out of 2 replies) | ⚠️ Above target |
| Pilot Intent | ≥1 | 1 | ✅ Met |
| Open Rate | ≥40% | 38% (satisfied by 48h window) | ⚠️ Below 40% but acceptable |

**Trend**: Same as Day 3 (2 replies); no new responses Thursday–Friday. Opens trending down by Saturday.

### 2. Qualitative Feedback (8 min)
**Best feedback (Reply #1)**:
> "Love the 90-second mockup timeline. We've been stuck in a 6-week design loop with our last vendor. Let's discuss how you handle brand guidelines. I'm interested in a demo." — Sarah Chen, Ramp

**Worst feedback (Reply #2)**:
> "We're already using SwagUp for swag fulfillment. Don't see how this replaces our existing workflow." — Michael Wu, Linear

**Themes**:
- Speed pillar resonating (mentioned positively in 1/2 replies)
- Competitive positioning weak ("why switch from incumbent?")
- Brand-fidelity questions (how do you match brand guidelines?)

### 3. Product Blockers (6 min)
- Sarah's question: "How do you handle brand guidelines?" → Product Lead: "Live demo shows color/logo accuracy at 95%+. Not a blocker; good sales demo point."
- No hard blockers identified
- Recommended: Embed brand-accuracy screenshots in follow-up email

### 4. Messaging Adjustments (5 min)
- **Change**: Revise follow-up email to emphasize competitive positioning: "Unlike [Incumbent], Branded Fit handles brand fidelity with 95%+ accuracy and delivers in 14 days, not 6 weeks."
- **Variant test**: Change subject line from "Brand mockup in 90 seconds" to "Faster than SwagUp, accurate as in-house design" for prospects 7–10
- **Deploy**: Send updated follow-up email to non-responders Monday evening

### 5. Forecast (3 min)
**Outreach Lead forecast**: "We're at 20% response rate with 5 days left. Unlikely to hit 30% unless 3+ more prospects reply. Borderline ITERATE case. Recommend follow-up email Tuesday + subject line variant to move needle."

**Decision**: Extend outreach with follow-up emails (non-aggressive) and new subject line variant; reconvene Day 6 morning for preliminary check-in.

---

## Appendix C: Email Escalation Template (If Ambiguous on Day 7)

**Subject:** [DECISION NEEDED] Live-to-Testing Gate Metric Review — [Date]

**To:** Founder, Product Lead

**From:** Outreach Lead

**Body:**
```
DECISION REQUIRED: Live-to-Testing Gate Metrics (Day 7)

METRIC SCORECARD:
✅ Response Rate: 30% (exactly 3/10) — MET (at threshold)
✅ Objection Rate: 33% (1 hard / 3 replies) — MET
✅ Pilot Intent: 1 — MET
✅ Open Rate: 42% — MET

DECISION: GO to Live Campaign (50+ prospects)

RECOMMENDATION: Scale to live. All 4 metrics met. Response quality high; objections indicate sales-solvable concerns, not product misalignment.

NEXT ACTIONS:
1. Prospect Research Lead builds 50-prospect list (Apollo ≥90%, warm-path verified)
2. Outreach Lead queues 50 sends for Week 2 (staggered, 5–10/day)
3. Founder approves expanded email templates (5 variants for A/B test at scale)
4. Daily standups resume Monday–Friday, Week 2–3

CONTINGENCY: If live campaign hits <25% response rate by Day 14, will pause expansion and diagnose.

Signed: [Outreach Lead]
```

---

## Appendix D: Objection Mapping Template

### Objection Taxonomy (Reference for Metric Scoring)

| Objection | Type | Counter | Severity |
|---|---|---|---|
| "Already using SwagUp" | Hard | Comparative demo: 95% brand accuracy, 14-day delivery vs. SwagUp's 30 days + manual review | High |
| "No budget" | Hard | Pilot offer: $4,800 for 1 proof-of-concept swag kit; ROI calculator | High |
| "Not interested in swag as category" | Hard | Reframe: "Not about swag—it's about brand expression on merchandise. Could be internal events, partner gifts, etc." | Critical |
| "Need to discuss with CFO" | Soft | "Happy to join CFO call or send executive summary. When does CFO have bandwidth?" | Low |
| "Can you handle our custom brand guidelines?" | Soft | Demo mockup showing color/logo accuracy; customer case study (if available) | Medium |
| "How does this integrate with our design tool?" | Soft | Product roadmap: Q3 Figma integration (if real); workaround: export mockup → import to Figma | Medium |
| "Send more info" | Soft | Follow-up email with 1-pager + demo link; calendar invite for brief call | Low |
| "Timing is bad right now" | Soft | "No problem. When would be a good time? Q3?" → Log as re-engage candidate | Low |

---

## Summary

This Live-to-Testing Gate framework eliminates ambiguity by:
1. **Defining testing phase** (Days 1–7, with option to extend to Day 14)
2. **Specifying 4 quantifiable metrics** with clear thresholds (response rate, objection rate, pilot intent, open rate)
3. **Assigning single decision-maker authority** (Outreach Lead makes unilateral GO/ITERATE/PAUSE call on Day 7)
4. **Establishing weekly learnings sync** (30 min every Monday to surface objections, product blockers, and messaging adjustments)
5. **Creating escalation path** for borderline decisions (48-hour extension if metric lands exactly at threshold)

**Expected outcome**: By Day 7, the company will have one of three clear paths:
- **SCALE** with confidence, backed by 4-metric evidence
- **ITERATE** with diagnostic insights and refined messaging (14 more days)
- **PIVOT** with clear understanding of what needs to change (positioning, ICP, or product)

**No limbo. No "let's see how it feels." Clear gates, clear owner, clear next steps.**

---

**Document Owner:** Founder / Head of Growth (Outreach Lead)  
**Last Updated:** 2026-06-11  
**Next Review Date:** Post-Day 7 decision checkpoint (2026-06-18)
