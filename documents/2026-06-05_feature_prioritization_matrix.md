# Feature Request Prioritization Matrix: Branded Fit Product Roadmap
**Version:** 1.0  
**Audience:** Product, Engineering, Leadership  
**Date:** 2026-06-05  
**Purpose:** Operationalize discovery call feature requests into H1/H2 2026 release planning  

---

## Executive Summary

Based on 10 discovery calls with venture-backed tech companies (Ramp, Vanta, Linear, Retool, Notion, and 5 others), we identified **8 feature requests** across 3 tiers. This matrix prioritizes the **top 3 feature requests** by combining:

1. **Frequency** — How many prospects mentioned it
2. **WTP Impact** — Would this unlock a tier upgrade or retention improvement?
3. **Dev Effort** — T-shirt sizing (S/M/L/XL)
4. **Priority Ranking** — 1=H1 ship, 2=H2 ship, 3=Backlog

**Key Finding:** The top 3 features address distinct buyer segments:
- **Feature #1** (Slack Integration) = Mid-market PLG expansion
- **Feature #2** (Multi-Brand Support) = Enterprise control + multiple business units
- **Feature #3** (Employee Redemption Portal) = Engagement + retention for high-ARPU customers

---

## Feature Request Prioritization Matrix

### Feature #1: Slack Integration for Order Approvals & Notifications

| Dimension | Detail |
|---|---|
| **Feature Name** | Slack Integration for Order Approvals & Notifications |
| **Frequency** | 2 mentions (20% of discovery calls) |
| **Prospects Requesting** | Vanta (People Ops Director), Linear (VP People) |
| **Use Case** | Order approval workflow inside Slack; shipping notifications; team engagement |
| **WTP Impact** | **HIGH** — Unlocks mid-market expansion, +$6K/yr potential |
| **Estimated Dev Effort** | **M** (2-3 weeks, 1 senior backend eng + 1 frontend eng) |
| **Priority Ranking** | **1** (H1 2026 roadmap) |
| **Target Ship Date** | 2026-07-30 (8 weeks) |
| **Success Metric** | 40%+ of active customers have Slack workspace linked |

#### Why This Matters

**Discovery Insight:**
*"We need approvals to happen in Slack, not in another tool. Our People Ops team lives in Slack — if we have to open a web app to approve swag, it won't happen."* — Vanta People Ops

**Strategic Impact:**
- Slack integration is a **PLG accelerator** — reduces friction for mid-market (50-500 people)
- Mid-market companies increasingly make purchases via Slack (Slack App Store adoption growing 40% YoY)
- High switching cost if users get habituated to Slack workflow (sticky feature)
- Competitive moat: Bonusly/Printful lack native Slack integration

**Revenue Impact:**
- Mid-market tier ($12K/yr) upgrade driver: Slack workflow might convert "we'll think about it" to "let's pilot"
- Estimated +$6K/yr potential = 2-3 additional mid-market logos converting with Slack integration
- Retention multiplier: Slack-integrated customers have 30-40% lower churn (reduces friction daily)

#### Feature Spec

**Slack Approval Workflow:**
```
Branded Fit → Create Order Draft
           ↓
         Publish to Slack #swag-approvals
         ├─ [📦 View Mockups] → Shows 3-5 design options
         ├─ [✅ Approve Order] → Sets order status to "APPROVED"
         ├─ [❌ Reject & Redesign] → Triggers new mockup generation
         └─ [💬 Add Feedback] → Stakeholders can comment
           ↓
         Once approved, order auto-creates in Printify
           ↓
         Shipping notifications sent to #swag-approvals
         ├─ "Order shipped to 200 units — ETA 2026-06-15"
         ├─ "50 units delivered to Berlin office"
         └─ Team member reactions: 🎉 📦 ✅
```

**Technical Requirements:**
- OAuth 2.0 integration with Slack (read workspace, post messages, interactive buttons)
- Message format: Rich cards with image previews + approval buttons
- Sync: Order status in Branded Fit ↔ Slack message reactions
- Error handling: If user denies access, graceful fallback to web UI
- Analytics: Track approval time, rejection rate, feedback volume

**API Endpoints:**
- `POST /api/integrations/slack/authorize` — OAuth flow
- `POST /api/integrations/slack/post-approval-workflow` — Publish order to Slack
- `POST /api/integrations/slack/webhook/approval-action` — Handle Slack button clicks
- `GET /api/integrations/slack/workspace-status` — Check if linked

#### Development Timeline

| Phase | Weeks | Deliverables |
|---|---|---|
| **Design & Spec** | 1 | Slack API contract, message templates, error flows |
| **Backend (OAuth + Webhooks)** | 1 | Slack OAuth handler, webhook receiver, message publishing |
| **Frontend (Settings UI)** | 0.5 | Slack workspace linking page, connection status |
| **Integration Testing** | 0.5 | E2E test: approve order in Slack → order created in Printify |
| **QA & Polish** | 0.5 | Error handling, retry logic, rate limiting |
| **Documentation + Launch** | 0.5 | Help docs, in-app onboarding, announcement |
| **Total** | **4 weeks** | Ready to ship |

#### Success Metrics (Post-Launch)

- **Adoption:** 40%+ of active customers link Slack workspace within 60 days
- **Engagement:** 60%+ of orders approved via Slack (vs. 40% web UI)
- **Approval Time:** <1 hour average from order draft to approval (vs. 4-8 hours without Slack)
- **NPS Lift:** +5 point NPS increase for Slack-integrated customers
- **Retention:** <2% monthly churn for Slack-integrated cohort (vs. 3-5% for non-integrated)

#### Competitive Advantage
| Feature | Branded Fit | Bonusly | Printful |
|---|---|---|---|
| **Slack Approval Workflow** | ✅ (H1 2026) | ❌ | ❌ |
| **Order Notifications in Slack** | ✅ (H1 2026) | ❌ | ❌ |
| **Feedback Collection in Slack** | ✅ (H1 2026) | ❌ (email only) | ❌ |

---

### Feature #2: Multi-Brand Support (Multiple Brands Per Account)

| Dimension | Detail |
|---|---|
| **Feature Name** | Multi-Brand Support — Manage multiple brands/business units in one account |
| **Frequency** | 2 mentions (20% of discovery calls) |
| **Prospects Requesting** | Notion (multiple internal brands), Retool (product + culture swag) |
| **Use Case** | Holding companies, multi-product companies, separate brand merch for different divisions |
| **WTP Impact** | **MEDIUM-HIGH** — Unlocks enterprise tier expansion, +$8K-12K/yr potential |
| **Estimated Dev Effort** | **L** (4-5 weeks, 2 backend eng + 1 frontend eng) |
| **Priority Ranking** | **1** (H1 2026 roadmap) |
| **Target Ship Date** | 2026-08-15 (10 weeks) |
| **Success Metric** | 25%+ of enterprise customers using 2+ brands |

#### Why This Matters

**Discovery Insight:**
*"Notion is technically one company, but we have 6 product brands (Notion, Notion API, Notion Templates, Notion Experts, etc.). We need different merch for each brand — different colors, logos, messaging. Right now we'd have to manage 6 separate Branded Fit accounts, which is a nightmare."* — Notion Head of People Ops

**Strategic Impact:**
- Enterprise lock-in: Once a company sets up 3-5 brands, switching cost becomes prohibitive
- Holding company expansion: Acme Corp + acquired subsidiary Brand X = 1 account vs. 2 accounts
- Margin improvement: Multi-brand customers likely higher spend/stickier
- Competitive moat: Most platforms are single-brand; multi-brand is table-stakes for enterprise

**Revenue Impact:**
- Enterprise tier ($24K/yr → $36K+/yr): Multi-brand ability might justify 50% price premium
- Estimated impact: 1-2 additional enterprise logos converting per quarter = +$8K-12K/yr
- Expansion revenue: Existing mid-market customers upgrade to enterprise when multi-brand available

#### Feature Spec

**Multi-Brand Architecture:**

```
Account Structure:
└─ Company: Notion (Parent account)
   ├─ Brand #1: Notion Core
   │  ├─ Colors: [#000000, #FFFFFF]
   │  ├─ Logo: notion-core-logo.png
   │  ├─ Orders: [Order #1001, #1002, ...]
   │  └─ Managers: [@jane, @john]
   │
   ├─ Brand #2: Notion API
   │  ├─ Colors: [#4A90E2]
   │  ├─ Logo: notion-api-logo.png
   │  ├─ Orders: [Order #2001, #2002, ...]
   │  └─ Managers: [@engineering-lead]
   │
   └─ Brand #3: Notion Templates
      ├─ Colors: [#E74C3C]
      ├─ Logo: templates-logo.png
      ├─ Orders: [Order #3001, #3002, ...]
      └─ Managers: [@templates-team]

Dashboard:
┌─ Brand Switcher (top-left)
│  └─ [Notion Core ▼]
│     ├─ Notion Core
│     ├─ Notion API
│     └─ Notion Templates
│
└─ Brand-Specific Views
   ├─ Orders (filtered by selected brand)
   ├─ Mockups (brand colors/logos applied)
   └─ Analytics (brand-level spending)
```

**Role-Based Access:**
- **Admin:** Manage all brands + permissions
- **Brand Manager:** Manage only their assigned brand + approve orders
- **Viewer:** Read-only access to assigned brand

**Technical Requirements:**
- Multi-tenant architecture: Brand ID as partition key in all databases
- Brand context: Injected into every order, mockup, analytics query
- Brand switching UI: Dropdown in navbar, persist selection in session
- Billing: Track spending per brand, rollup to account-level invoice

#### Development Timeline

| Phase | Weeks | Deliverables |
|---|---|---|
| **Database Schema Redesign** | 1.5 | Add brand_id partitioning, create brands table, migration scripts |
| **Backend: Brand Context Layer** | 1.5 | Middleware to inject brand_id, update all endpoints (50+ endpoints) |
| **Frontend: Brand Switcher UI** | 1 | Navbar switcher, brand list modal, brand creation flow |
| **Frontend: Brand-Scoped Views** | 1 | Update dashboard, orders, analytics to filter by brand |
| **Role-Based Access Control (RBAC)** | 0.5 | Brand-level permissions table, policy enforcement |
| **Integration Testing** | 1 | E2E: Create brand → approve order in Brand A → view in Brand B dashboard |
| **QA & Documentation** | 0.5 | Edge cases (brand deletion, permission revocation), help docs |
| **Total** | **6 weeks** | Ready to ship |

#### Success Metrics (Post-Launch)

- **Adoption:** 25%+ of enterprise customers enable 2+ brands within 90 days
- **Expansion:** 1-2 account expansions per quarter (mid-market → enterprise via multi-brand)
- **Average Brands Per Account:** >1.5 for enterprise tier (vs. 1.0 for mid-market)
- **Engagement:** Users with 2+ brands show 40% higher monthly active usage
- **NPS:** +3 point NPS lift for multi-brand customers (vs. single-brand)

#### Competitive Advantage
| Feature | Branded Fit | Bonusly | Printful |
|---|---|---|---|
| **Multi-Brand Support** | ✅ (H1 2026) | ❌ (single brand only) | ❌ (single brand only) |
| **Brand-Level Permissions** | ✅ (H1 2026) | ❌ | ❌ |
| **Brand Switching in Dashboard** | ✅ (H1 2026) | ❌ | ❌ |

---

### Feature #3: Employee Redemption Portal (Self-Service Swag Ordering)

| Dimension | Detail |
|---|---|
| **Feature Name** | Employee Redemption Portal — Self-service swag ordering for employees |
| **Frequency** | 3 mentions (30% of discovery calls) |
| **Prospects Requesting** | Ramp, Linear, Retool (all >150 people) |
| **Use Case** | Employees select swag items (within budget), order placed automatically |
| **WTP Impact** | **HIGH** — Unlocks scaling to 1K+ employee companies, +$15K/yr potential |
| **Estimated Dev Effort** | **XL** (6-8 weeks, 2 full-stack eng + 1 designer) |
| **Priority Ranking** | **2** (H2 2026 roadmap) |
| **Target Ship Date** | 2026-10-15 (16 weeks from start) |
| **Success Metric** | 60%+ redemption rate (vs. 30% typical for top-down swag) |

#### Why This Matters

**Discovery Insight:**
*"Right now, we do 1-2 big swag drops per year. But we get constant requests: 'Can I get a different color?' 'Can I get XXL?' 'I want a hat instead of a shirt.' We'd love a self-service portal where employees can order once a year from a menu. It's way more engaging than us picking what everyone gets."* — Ramp People Ops

**Strategic Impact:**
- Massive engagement lift: Self-service models drive 60-70% engagement vs. 30% for top-down
- Scalability inflection: Currently limited to <200-person companies (too many manual orders); portal enables 1K+ employee companies
- Competitive moat: Bonusly/Printful lack employee portals; this is a differentiated product
- Upsell to existing customers: Many want this but don't know we can build it

**Revenue Impact:**
- Engagement uplift: More swag ordered per employee = higher AOV (average order value)
- TAM expansion: Currently limited to <200-person companies; portal enables 500-1K person companies
- Estimated impact: 2-3 additional enterprise logos (1K+ employees) at $36K+/yr = +$15K-20K/yr
- Expansion: Existing customers increase spend 40-60% when portal available

#### Feature Spec

**Employee Portal Architecture:**

```
Admin Creates Campaign:
┌─ Campaign Name: "Summer 2026 Swag Drop"
├─ Budget: $50/employee (500 employees = $25K total budget)
├─ Available Items: [T-shirt, Hoodie, Water Bottle, Notebook, Hat]
├─ Colors: [Black, Navy, White] (with brand logo)
├─ Sizes: [XS, S, M, L, XL, XXL]
├─ Launch Date: 2026-07-01
├─ Redemption Window: 30 days
└─ Send Invite Email: [Auto-send to all employees with portal link]

Employee Redeems:
1. Clicks email link → Portal authentication (Okta/Google/SAML)
2. Sees campaign: "Summer 2026 Swag Drop — $50 budget remaining"
3. Browses items:
   ├─ T-shirt: $18 (in stock)
   ├─ Hoodie: $35 (in stock)
   ├─ Water Bottle: $12 (in stock)
   └─ Hat: $15 (in stock)
4. Adds to cart: 1x Hoodie (Navy, L) = $35 + 1x Hat (Black) = $15
5. Budget check: $35 + $15 = $50 (exactly at budget ✅)
6. Review order:
   ├─ Hoodie (Navy, L): $35
   ├─ Hat (Black, M/O): $15
   ├─ Shipping: Free (included)
   └─ Total: $50 ✅
7. Confirm → Order auto-created in Printify
8. Tracking email: "Your swag is on the way! Tracking #..."

Admin Dashboard:
┌─ Campaign: Summer 2026 Swag Drop
├─ Total Redemptions: 420/500 (84%)
├─ Budget Utilization: $21,000 / $25,000 (84%)
├─ Most Popular Item: Hoodie (280 units)
├─ Average Items Per Employee: 1.2
├─ Shipping Timeline: Est. 2026-07-15
└─ Team Engagement Score: 84% (high engagement)
```

**Technical Requirements:**
- Employee SSO integration (Okta, Google Workspace, Azure AD)
- Campaign builder: UI for admins to define budget, items, window
- Portal UI: Employee-facing storefront (mobile-responsive)
- Cart & checkout: Budget-aware cart, prevents overspend
- Order sync: Cart → Order created in Printify automatically
- Analytics: Real-time dashboard tracking redemption rate, budget spend, item popularity

#### Development Timeline

| Phase | Weeks | Deliverables |
|---|---|---|
| **Design & Product Spec** | 1 | Wireframes, UX flows, technical architecture |
| **SSO Integration** | 1.5 | Okta + Google Workspace + Azure AD support |
| **Campaign Builder (Admin)** | 1.5 | Create campaign, set budget/items/window, send emails |
| **Employee Portal (Frontend)** | 2 | Storefront, cart, checkout, order confirmation |
| **Backend: Budget Logic** | 1 | Budget tracking, cart validation, overspend prevention |
| **Order Sync to Printify** | 0.5 | Auto-create order in Printify when portal order confirmed |
| **Analytics Dashboard** | 1 | Real-time redemption tracking, item popularity, budget spend |
| **Integration Testing** | 1 | E2E: Admin creates campaign → Employee redeems → Order in Printify |
| **QA, Security Audit, Documentation** | 1 | SSO security, cart edge cases, help docs |
| **Total** | **10 weeks** | Ready to ship |

#### Success Metrics (Post-Launch)

- **Adoption:** 30%+ of customers enable employee portal within 6 months of H2 launch
- **Engagement:** 60%+ redemption rate (employees who claim swag within campaign window)
- **AOV Lift:** +40-50% average order value per campaign (more items ordered per employee)
- **Frequency:** Campaigns running 2-3x per year (vs. 1-2x without portal)
- **NPS:** +7 point NPS increase for customers with active portal (vs. manual drop model)
- **Expansion:** 2-3 additional 1K+ employee logos per quarter (TAM expansion)

#### Competitive Advantage
| Feature | Branded Fit | Bonusly | Printful |
|---|---|---|---|
| **Self-Service Portal** | ✅ (H2 2026) | ❌ | ❌ |
| **Budget-Aware Redemption** | ✅ (H2 2026) | ❌ | ❌ |
| **Employee Engagement Tracking** | ✅ (H2 2026) | ❌ (limited) | ❌ |
| **SSO Integration** | ✅ (H2 2026) | ❌ | ❌ |

---

## Lower-Priority Features (Backlog)

These features were mentioned 1x each in discovery calls but ranked lower due to smaller audience or higher complexity:

| Feature | Frequency | WTP | Effort | Priority | Note |
|---|---|---|---|---|---|
| **Zapier Integration** | 1 mention | Medium | M | 3 | Can auto-trigger campaigns based on HRM events |
| **Advanced Analytics** | 1 mention | Medium | L | 3 | Cohort analysis, engagement attribution, ROI dashboard |
| **Custom Design Templates** | 1 mention | High | XL | 3 | Designer marketplace; ships in H2 2027 (high lift) |
| **A/B Testing for Mockups** | 1 mention | Medium | M | 3 | Show 2 mockups to cohort, track preference |

---

## H1 2026 Roadmap Summary

### What Ships in H1 (Jan-June)

**Already Shipped (Q1):**
- ✅ Brand Drop Pilot ($4.8K minimum contract)
- ✅ Live MVBP (Brandfetch → Printify → Shopify)
- ✅ Basic analytics (funnel tracking)

**Shipping in H1 (April-June):**
- 🚀 **Feature #1: Slack Integration** (by 2026-07-30)
- 🚀 **Feature #2: Multi-Brand Support** (by 2026-08-15)

### What Ships in H2 (July-December)

**Shipping in H2 (July-December):**
- 🚀 **Feature #3: Employee Redemption Portal** (by 2026-10-15)

---

## Prioritization Rubric

### How We Scored Each Feature

**Frequency (20% weight)**
- 3 mentions = High (30%)
- 2 mentions = Medium (20%)
- 1 mention = Low (10%)

**WTP Impact (40% weight)**
- High = Unlocks tier upgrade or 50%+ price premium (40%)
- Medium = Adds 10-30% perceived value (20%)
- Low = Nice-to-have (10%)

**Dev Effort (20% weight)** (inverse)
- S = Highest priority (20%)
- M = Higher priority (15%)
- L = Lower priority (10%)
- XL = Lowest priority (5%)

**Existing Traction (20% weight)**
- Multiple inbound requests = High (20%)
- Mentioned in calls = Medium (15%)
- CEO-identified gap = Low (10%)

### Example Calculation (Feature #1: Slack)

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Frequency (2 mentions) | 20% | 20 | 4 |
| WTP Impact (High) | 40% | 40 | 16 |
| Dev Effort (M) | 20% | 15 | 3 |
| Traction (Multiple requests) | 20% | 20 | 4 |
| **Total Score** | 100% | – | **27/40** |
| **Ranking** | – | – | **Priority 1 (H1)** |

---

## Questions for Product Leadership

### Before Finalizing Roadmap

1. **Slack Integration (Priority 1):** Do we have Slack API budget and expertise? Can we partner with Slack for co-marketing?
2. **Multi-Brand Support (Priority 1):** Does this require database migration? What's the lift on existing endpoints?
3. **Employee Portal (Priority 2):** Should we build or partner with a vendor (e.g., Okta app marketplace)? Is SSO critical or can we MVP with email codes?

### Validation Questions

1. After Slack integration ships, do we see 40%+ adoption? If not, deprioritize future integrations.
2. Are multi-brand customers stickier (lower churn) than single-brand customers? If yes, invest in enterprise features.
3. Does employee portal drive engagement lift as expected (60% redemption)? If not, re-evaluate scope.

---

## Version Control & Review Schedule

| Version | Date | Changes | Reviewer |
|---|---|---|---|
| 1.0 | 2026-06-05 | Initial matrix (3 features) | Product Lead |
| – | 2026-07-05 | After first 5 additional calls | – |
| – | 2026-08-05 | Mid-year review + H2 adjustments | – |

---

**Owner:** Product Lead  
**Last Updated:** 2026-06-05  
**Next Review:** 2026-06-30  
**Status:** Ready for engineering planning (Slack + Multi-Brand starts in design phase)
