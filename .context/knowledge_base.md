## Relevant Files

- **Unblocking Pattern: Framework-First Approach to External Dependencies** [process]
- **Assumption Validation Experiment Design: Hypothesis + Metric + Sample + Expected Outcome** [process]
- **Branded Fit Outreach Campaign Playbook** [gtm]
- **Response Tracking Dashboard (React Component)** [gtm]
- **Brand Fidelity Validation Hypothesis** [product]
- **Decision Memo Synthesis Framework** [process]
- **Compressed Feedback Loop: Embed Validation Questions in Outreach Copy** [process]
- **Step 20-21 Assumption Validation Test Plan** [gtm]
- **Parallel assumption validation within discovery calls** [process]
- **Assumption Validation Experiments Execution Plan** [gtm]

## Company Knowledge (Semantic Match)

### Pilot-to-Annual Conversion Workflow (process)
9-step workflow: (1) Prospect responds YES → (2) Send SOW + briefing → (3) Prospect signs SOW → (4) Log in tracker + set start date → (5) Founder runs domain-input flow → (6) Founder approves mockup → (7) Prospect places order → (8) Fulfillment ships → (9) Recipient receives swag + NPS QR → (10) Day 14 debrief call → (11) Classify conversion intent → (12) Log outcomes in tracker. 21-day total cycle.

### Beachhead ICP Definition as Load-Bearing GTM Asset (gtm)
A formalized ICP with 5 hard-filter qualifying criteria serves as the foundation for all downstream GTM activities: prospect prioritization, sales playbook design, pilot targeting, and messaging. The ICP should include market sizing (addressable count), vertical concentration analysis, explicit rationale for each filter, and warm-path signal identification. This structure enables repeatable, defensible prospect qualification.

### Sales Call Script Production Readiness Criteria (gtm)
7-point validation framework for sales calls: (1) Opening (0-2 min): establish credibility, reference warm intro/community, ask permission; (2) Discovery (2-8 min): 3-5 open-ended questions about swag process, pain points, timeline, success metrics, 70% listen/30% talk ratio, map to 3 pillars; (3) Positioning (8-12 min): share 90-second mockup/loom, highlight pain-point alignment, anchor pricing; (4) Objection handling (12-15 min): anticipate top 3 objections ('Can you handle brand guidelines?',

### Email Template Production Readiness Checklist (gtm)
10-point validation framework for GTM email templates: (1) Tone & voice consistency with 3-pillar messaging (Speed, Brand Fidelity, On-Demand Fulfillment), peer-to-peer conversational tone; (2) Objection handling with specific counters to top 5 buyer objections (cite pilot results, brand-fidelity scores); (3) Price anchoring ($24K Growth tier or $4,800 Brand Drop Pilot) to filter low-intent prospects; (4) Single clear self-serve CTA (forbidden: 'Schedule call', 'Book demo'); (5) Length constrain

### Analytics Instrumentation Verification Checklist (process)
Required verification steps for analytics go-live: (1) Event emitters wired in Command Console (domain_submitted, brand_extraction_started/completed, storefront_generation_completed), (2) Event emitters wired in Storefront Preview (storefront_viewed, storefront_published), (3) /api/analytics endpoint returns HTTP 201 on test POST, (4) Events persisted in Supabase analytics_events table, (5) /admin/analytics dashboard renders conversion funnel with correct event counts, (6) Time-series chart show


## Current Situation (Semantic Match)

### Gmail API Integration for Draft Queuing (decision)
Successfully implemented Gmail API for creating and queuing outreach drafts rather than manual draft creation. Drafts labeled 'Branded Fit Outreach Wave 1' for batch management. This enables scalable, trackable outreach workflow.

### Response Tracking Infrastructure Live (milestone)
18-column tracking schema deployed (Prospect Name, Company, Email, Send Date, Status, First Reply Date, Reply Sentiment, Top Objection, Next Action, etc.). Ready for real-time response logging and objection/signal synthesis.

### Testing Mode Execution Approach (decision)
Campaign framework created in testing mode with email sends as DRAFTS (not sent live) pending validation. All prospect data and contact information must be verified before live execution.

### Go/No-Go Decision Thresholds (milestone)
Day 3: ≥40% open rate (≥4 opens); Day 7: ≥30% response rate (≥3 qualified responses); Day 5: ≥1 discovery call booked. Fallback playbook triggered if Day 3 reply rate <10%.

### Daily monitoring activation needed (priority)
Daily async monitoring framework created but not yet operationalized. Requires daily CSV updates and sentiment classification through June 11 (Day 3) decision point.
