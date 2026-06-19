# DE Step 23 — Show That the Dogs Will Eat the Dog Food
**Company:** Branded Fit  
**Date:** June 19, 2026  
**Step Status:** IN PROGRESS (Wave 1 outreach active; 0 paying customers as of today)  
**Validation Target:** ≥5 paying customers by August 18, 2026

---

## 1. What "Dogs Eating the Dog Food" Means for Branded Fit

In the Disciplined Entrepreneurship framework, Step 23 requires proof that real customers in the beachhead segment will **voluntarily pay for and actively use** the MVBP — not just say they would (that was Step 14 willingness-to-pay), but actually do it.

For Branded Fit, "dogs eating the dog food" = **Maya Chen pays $2,400/yr upfront, receives her storefront within 48 hours, and places a real merchandise order within 14 days.**

The three-part proof:
1. **She paid** — credit card charged, contract signed, not a free pilot
2. **We delivered** — domain-to-storefront in ≤48h, AI-curated product selections
3. **She ordered** — ≥$500 merch purchase within 14 days, meaning the storefront is live and useful

Retention (Day 30 NPS ≥8, second campaign within 90 days) upgrades from "first purchase" to "ongoing usage" — that is the higher bar that moves Step 23 from KNOWN to VALIDATED.

---

## 2. MVBP Definition (from DE Step 22)

**Product:** Paid 48-hour domain-to-storefront concierge  
**Price:** $2,400/yr upfront + ≥$500 first launch order  
**Buyer:** Maya Chen — People Ops Generalist, 28-34, at 75-300 FTE Series A/B SaaS company  
**Delivery:** Founder manually curates and builds first 10 storefronts via Shopify + Printify  
**Success path:** Day 0 payment → Day 2 storefront live → Day 14 launch order → Day 30 NPS → Day 90 repeat

Tech stack live at branded.fit:
- `/` — homepage with "Get Started →" primary CTA
- `/pricing` — three tiers (Starter $2,400 / Growth $4,800 / Enterprise custom)
- `/get-started` — 4-step concierge timeline, milestone badges, what's-included list
- `/demo` — self-serve demo with domain extraction and Gmail notification hook

---

## 3. Proof Criteria — Kill / Proceed Gates

### Gate 1: Day 3 — June 22, 2026
**Criterion:** ≥4 Wave 1 email opens  
**Purpose:** Confirms the ICP receives and engages with cold outreach  
**Kill signal:** <2 opens → hypothesis A1 (WTP) is too speculative; pivot to community-led (Slack, People Geeks) before spending more on email  
**Proceed signal:** ≥4 opens → book discovery calls, begin Gate 2

### Gate 2: Day 5 — June 24, 2026
**Criterion:** ≥1 discovery call booked via `/demo` or direct  
**Purpose:** Confirms interest converts to a live conversation  
**Kill signal:** 0 calls by June 24 → rewrite subject lines, A/B test "brand drop" vs "swag chaos" framing, activate Slack community channel  
**Proceed signal:** ≥1 call → run discovery script, probe WTP, close pilot contract

### Gate 3: Day 30 — July 19, 2026
**Criterion:** ≥1 paying customer at $2,400/yr, storefront delivered within 48h, launch order placed  
**Purpose:** First proof of purchase — the minimum "dog food" event  
**Kill signal:** 0 paying customers → revisit pricing (try $1,200/yr), revisit channel, revisit ICP (expand beyond People Ops)  
**Proceed signal:** ≥1 customer → replicate with next 4, track adoption metrics

### Gate 4: Validation — August 18, 2026 (60 days out)
**Full DE Step 23 VALIDATED when ALL of:**
| Metric | Target |
|--------|--------|
| Paying customers | ≥5 at $2,400/yr ($12,000 ARR) |
| 48h delivery SLA | ≥4/5 storefronts on time |
| Launch order rate | ≥4/5 place ≥$500 order in 14 days |
| NPS at Day 30 | ≥3/5 score ≥8 |
| 90-day retention | ≥3/5 initiate second campaign |

---

## 4. First Customer Acquisition — Wave 1 Outreach Status

### Wave 1 Companies (10 beachhead targets)
All are Series A/B SaaS, 75-300 FTE, matching Maya Chen archetype precisely.

| Company | Contact Originally Emailed | Status | Corrected Contact |
|---------|---------------------------|--------|-------------------|
| Linear | david@linear.app | BOUNCED (550 5.1.3) | katie@linear.app ✓ re-sent June 19 |
| Hex | lili@hex.tech, amanda@hex.tech | BOUNCED (550 5.1.3 x2) | jessica.hardin@hex.tech ✓ re-sent June 19 |
| Mercury | james@mercury.com | BOUNCED (550 5.1.1) | Searching via Apollo — Linda (Head of People) |
| Census | christina@getcensus.com | BOUNCED (550 5.1.1) | No Apollo match found; manual research needed |
| Ramp | jacob@ramp.com | SENT ✓ | — |
| Airbyte | (contact) | Sent | — |
| Retool | (contact) | Sent | — |
| Notion | (contact) | Sent | — |
| Webflow | (contact) | Sent | — |
| Vanta | (contact) | Sent | — |

**Bounce rate:** ≥5/13 emails (≥38%) bounced — wrong addresses used in prior session  
**Remediation:** Apollo enrichment used to find verified emails; Linear and Hex corrected June 19

### Email Variants Deployed
- **Variant A (Command Console):** Positions Branded Fit as operational infrastructure — "your swag as a managed service." Deployed to ~6 contacts.
- **Variant B (Brand Drop Pilot):** Positions as a curated brand drop for Q3 — "done-for-you in 48 hours." Deployed to ~7 contacts (including Ramp: $4,800 pilot price tested).

### Corrected Emails Sent June 19, 2026
**Linear → Katie Royer (People Operations):**
- Apollo ID: `60f58d098484270001133c4b`
- Email: `katie@linear.app` (verified)
- Gmail Message ID: `19ee08d1bedc9712`
- Variant: Command Console / $2,400 pricing

**Hex → Jessica Hardin (People Operations Specialist):**
- Apollo ID: `67f2ec491800c20001ef2473`
- Email: `jessica.hardin@hex.tech` (verified)
- Gmail Message ID: `19ee08d32f47ee96`
- Variant: Command Console / $2,400 pricing

---

## 5. Discovery Call Script — When First Call Books

### Pre-call prep (5 min)
- Check LinkedIn: company size, growth stage, recent funding
- Brandfetch: does domain have brand colors + logo? (tests A2 coverage)
- Note: which email variant they responded to (brand-drop vs command-console)

### Opening (2 min)
> "Thanks for making time. Quick context: Branded Fit builds company storefronts on Shopify + Printify — you give us your domain, we deliver a live swag store in 48 hours. What I want to understand first is how you're handling merch today and where it breaks down."

### Discovery questions (10 min)
1. "When did you last run a merch drop, and what was the most painful part?"
2. "Who else is involved in approving the design or the vendor? Is it just you, or does the exec team weigh in?"
3. "What's the typical cycle from idea to merch in employees' hands — weeks, months?"
4. "What's your annual spend on swag today — rough order of magnitude?"
5. "If you had a live storefront next week — what's the first thing you'd order for?"

### WTP probe (5 min)
> "Our pilot is $2,400 for the year — that covers the storefront build, Shopify integration, AI product curation, and up to 3 storefront refreshes. Does that land in a budget you control, or does that need sign-off?"

Target response: "I can approve that" = strong signal. "I'd need to ask" = map the DMU, find the economic buyer.

### Close (3 min)
> "Here's what happens if we move forward: I'll need your domain and brand kit — logo, color hex, 2-3 words describing your culture. I build the storefront, you review it within 48 hours, and if it's right, you place your first order. Sound doable this week?"

---

## 6. Adoption Metrics Framework

### Funnel Metrics (tracked in Apollo + Google Sheet)
| Stage | Metric | Target by Aug 18 |
|-------|--------|-----------------|
| Outreach sent | Emails delivered | ≥25 (Wave 1 + Wave 2) |
| Open rate | Unique opens / delivered | ≥40% |
| Reply rate | Replies (any) / delivered | ≥10% |
| Call booked | Discovery calls / replies | ≥50% |
| Pilot closed | Signed + paid / calls | ≥25% |
| Storefront live | Delivered in 48h / closed | ≥80% |
| Launch order | ≥$500 order in 14 days / live | ≥80% |

### Retention / Adoption Metrics (tracked per customer)
| Event | Timing | Method |
|-------|--------|--------|
| Storefront review | Day 2 | Founder walkthrough via Loom or Zoom |
| Launch order confirmation | Day 14 | Check Printify order dashboard |
| NPS survey | Day 30 | 1-question email: "How likely are you to recommend Branded Fit to a colleague? (0-10)" |
| Repeat request | Day 90 | Inbound email/Slack ping for new campaign |
| WAU proxy | Weekly | Shopify storefront unique visits |

### Evidence Log (updated in real time)

| Date | Event | Evidence |
|------|-------|----------|
| June 16-19, 2026 | Wave 1 outreach: 13 emails sent to 10 companies | Gmail Sent folder; 5 bounces identified |
| June 19, 2026 | Corrected emails sent to Linear (katie@linear.app) and Hex (jessica.hardin@hex.tech) | Gmail msg IDs: 19ee08d1bedc9712, 19ee08d32f47ee96 |
| June 22, 2026 | Day 3 open gate check | TBD |
| June 24, 2026 | Day 5 call gate check | TBD |
| July 19, 2026 | Day 30 first customer gate | TBD |
| August 18, 2026 | Final validation: ≥5 paying customers | TBD |

---

## 7. Wave 2 Outreach Plan (if Day 3 gate passes)

**Timing:** Launch Wave 2 by June 26, 2026  
**Volume:** 15 additional contacts at beachhead companies  
**ICP refinement:** Series A/B SaaS, 100-250 FTE, People Ops Manager or Head of People title  
**Apollo search criteria:** `person_titles: ["People Operations Manager", "Head of People", "VP People"]`, `organization_num_employees_ranges: ["100,250"]`, `q_organization_domains` from Wave 1 expansion list

**Slack community activation (Experiment 5 — A5):**
- Post in People Geeks (culture.amp community)
- Post in HROS (HR Open Source community)
- Post in Remote Work community
- Message: "We just launched a 48-hour company storefront service for People Ops teams — built on Shopify + Printify. If your swag process is broken, DM me — offering first 5 teams a founder-direct pilot at $0 setup cost. [link to /get-started]"

---

## 8. Kill / Pivot Criteria

### If ≥3 of these occur, pivot the MVBP before August 18:

| Signal | Meaning | Pivot |
|--------|---------|-------|
| <2 opens by June 22 | Wrong channel or wrong ICP | Shift to Slack + referral |
| 0 calls by June 30 | Subject line or value prop wrong | A/B new angle: "fire your swag vendor" |
| 0 closes by July 19 | Price too high or DMU wrong | Test $1,200/yr or land with economic buyer |
| <50% 48h SLA on first 3 | Ops capacity issue | Hire first contractor storefront builder |
| <50% launch order rate | Storefront not compelling | Add brand-specific product curation session |
| NPS <5 at Day 30 | Product-experience mismatch | Add white-glove onboarding call on Day 1 |

---

## 9. Step 23 Completion Checklist

- [x] DE Step 22 (MVBP) completed and deployed — branded.fit live with /get-started, /pricing, /demo
- [x] Wave 1 outreach launched — 13 emails sent June 16-19 to 10 beachhead companies
- [x] Bounce remediation — 5 bounced emails identified; 2 corrected (Linear, Hex); Mercury and Census pending
- [x] Day 3 gate defined — June 22, ≥4 opens required
- [x] Day 5 gate defined — June 24, ≥1 call booked required
- [ ] Day 3 gate passed — TBD June 22
- [ ] Day 5 gate passed — TBD June 24
- [ ] First discovery call completed — TBD
- [ ] First paying customer signed — TBD
- [ ] First storefront delivered in ≤48h — TBD
- [ ] First launch order placed (≥$500) — TBD
- [ ] 5 paying customers reached — TBD (target: Aug 18)
- [ ] Adoption metrics logged — TBD

---

## 10. Next Actions (ordered by impact)

1. **June 22 (Day 3):** Check Gmail for opens/replies from Wave 1. If ≥4 opens → proceed. If <4 → activate Slack communities immediately.
2. **June 22:** Fix Mercury bounce — enrich linda@mercury.com (Apollo ID: 54a29478746869382567e02d) and send corrected email.
3. **June 22:** Find GetCensus People Ops contact manually (LinkedIn, Apollo domain search for getcensus.com) and send outreach.
4. **June 24 (Day 5):** If any reply → book discovery call. Use /demo URL and Calendly link.
5. **June 26:** Launch Wave 2 (15 new contacts) + Slack community posts.
6. **First call:** Run discovery script (Section 5), probe WTP, close pilot contract same day if possible.

---

*This document is the formal DE Step 23 deliverable for Branded Fit. It will be updated in real time as customer acquisition evidence accumulates. Step 23 moves from IN PROGRESS to VALIDATED when all criteria in Section 3 Gate 4 are met.*
