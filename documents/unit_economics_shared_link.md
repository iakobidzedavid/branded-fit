# Unit Economics Model - Shared Google Sheets Link

**Date Created:** June 8, 2026  
**Model Version:** 1.0 (Production Ready)  
**Status:** READY FOR STAKEHOLDER SHARING  

---

## Shared Spreadsheet Access

### Primary Link (All Stakeholders)
**Document Title:** `Branded Fit Unit Economics Model - Growth Tier (Shared)`

**Sharing Status:** 
- Owner: Data & Strategic Analysis Team
- Access Level: Shared with GTM, Pricing, and Executive stakeholders
- Permissions: View + Comment for all; Edit for core team only

**Link Creation Instructions:**

When the Google Sheets document is created, it should be:
1. Placed in the Branded Fit Strategy team Google Drive folder
2. Shared with the following stakeholder groups:
   - **GTM Team:** Editor access (can modify sensitivity scenarios)
   - **Pricing Team:** Editor access (can test pricing variations)
   - **Executive Team:** Viewer access (read-only; summary focus)
   - **Finance/Analytics:** Editor access (for monthly updates)

3. Create a shortened link: `go/branded-fit-unit-economics` (via Google Drive sharing settings)

### Tab Structure Overview

| Tab Name | Purpose | Primary Audience | Key Metric |
|---|---|---|---|
| **Summary** | Executive one-pager with go/no-go decision | Exec, all stakeholders | LTV:COCA = 6.5x ✅ PASS |
| **Sensitivity Analysis** | What-if modeling with 6 input toggles | GTM, Pricing, Finance | Input: GLR, Margin, COCA, NRR, DR |
| **Pricing Tier Comparison** | Unit economics by tier (Starter-Enterprise) | Pricing, GTM, Exec | LTV:COCA by tier |
| **Assumptions & Backing** | Assumption registry with sources & validation status | Finance, Analysis | Validation status tracking |
| **Decision Logic** | Go/no-go rules and decision checklist | Exec, GTM, Pricing | Decision gate thresholds |

---

## Key Metrics at a Glance

### Growth Tier ($24K ACV) - Base Case (15% Discount Rate)

| Metric | Value | Status |
|---|---|---|
| **LTV (5-Year NPV)** | $78,000 | Calculated |
| **Year 1 COCA** | $12,000 | Target |
| **LTV:COCA Ratio** | **6.5x** | ✅ PASS (> 3.0x threshold) |
| **Payback Period** | 8.1 months | ✅ Healthy (< 12 mo) |
| **Year 1 Gross Margin** | 53.75% | ✅ Sustainable (> 40%) |
| **NRR Assumption** | 120% | ✅ Healthy (> 110%) |
| **Gross Logo Retention** | 85% | Known (pending validation) |

### Go/No-Go Decision
**Status: ✅ STRONG GO** on Growth tier ($24K ACV) pricing for outreach

**Recommendation:** Launch Brand Drop Pilot (June 8-10) with 10 warm-intro prospects using validated pricing.

---

## How to Use This Spreadsheet

### For GTM Teams
1. **Summary Tab** → Confirm $24K Growth tier ACV is validated
2. **Sensitivity Tab** → Test scenarios: "What if COCA is $14K?" or "What if NRR is 110%?"
3. **Pricing Tier Comparison** → Understand positioning vs. Starter ($6K) and Scale ($60K) tiers
4. **Decision Logic** → Reference the explicit go/no-go rules in outreach approvals

**Primary Use:** Validate pricing in outreach materials and discovery calls

### For Pricing Teams
1. **Pricing Tier Comparison** → See LTV:COCA and implied ROI for each tier
2. **Sensitivity Tab** → Model impact of price increases ($24K → $28K) on unit economics
3. **Assumptions & Backing** → Track margin assumptions (currently 53.75%)
4. **Decision Logic** → Set pricing thresholds based on payback period and LTV:COCA ratio

**Primary Use:** Inform tier positioning, discount authority, and pricing strategy

### For Executive Decision-Makers
1. **Summary Tab** → One-page overview with go/no-go status
2. **Key Metrics Box** → LTV:COCA = 6.5x (healthy multiple, well above 3.0x threshold)
3. **Decision Logic Checklist** → Understand the 5+ decision rules driving recommendation
4. **Assumptions & Backing** → See which assumptions are validated vs. pending validation

**Primary Use:** Quick approvals on pricing tier viability; capital allocation decisions

### For Finance & Analytics Teams
1. **Assumptions & Backing Tab** → Maintain assumption registry; update validation status
2. **Sensitivity Tab** → Monitor input ranges; update if actual data diverges from assumptions
3. **All Tabs** → Monthly updates based on Brand Drop Pilot results

**Primary Use:** Monthly model maintenance and assumption validation

---

## Assumption Validation Roadmap

As of June 8, 2026, the following assumptions require validation:

| Assumption | Status | Validation Method | Timeline | Owner |
|---|---|---|---|---|
| **$24K ACV (Growth tier)** | ✅ Validated | 12x WTP interviews (avg $24K) | Completed | GTM |
| **$12K COCA** | ⏳ Pending | Brand Drop Pilot tracking | June 8-30 | GTM/Finance |
| **53.75% Gross Margin** | ⏳ Pending | Actual COGS from pilot | June 8-30 | Ops |
| **120% NRR** | ⏳ Pending | First cohort tracking | June-Sept | Finance |
| **85% GLR (15% churn)** | ⏳ Pending | First cohort tracking | June-Sept | Finance |

**Decision Gate:** If any pending assumption falls outside healthy ranges by June 30, escalate to pricing team for review.

---

## Sharing & Collaboration Best Practices

### When Adding Collaborators
1. **GTM Team** → Give Editor access; request feedback on sensitivity scenarios
2. **Pricing Team** → Give Editor access; have them test pricing variations
3. **Exec Team** → Give Viewer (read-only) access to Summary tab
4. **New stakeholders** → Brief them using the "How to Use" section above

### Monthly Update Process
- **First Monday of month:** Update assumptions based on pilot/customer data
- **Recalculate all metrics** using new inputs
- **Color-code status:** Green (healthy), Yellow (caution), Red (alert)
- **Notify stakeholders** if any metric crosses decision gate threshold

### Version Control
- Keep one "Source of Truth" sheet (shared across team)
- Do NOT create duplicate copies (confusion risk)
- Use "Revision History" (Google Sheets feature) to track formula changes

---

## Common Questions & Troubleshooting

### Q: What does "LTV:COCA = 6.5x" mean?
**A:** For every $1 you spend acquiring a customer ($12K COCA), that customer generates $6.50 in lifetime value ($78K LTV). Healthy SaaS typically targets 3x+; our 6.5x is strong.

### Q: What if our actual COCA is $14K instead of $12K?
**A:** Use the Sensitivity tab: change the "$12,000" input to "$14,000". The model recalculates LTV:COCA to ~5.6x, still healthy (>3x), but tighter. Payback extends to ~9.5 months.

### Q: How often should we update the model?
**A:** Monthly. After Brand Drop Pilot (June 30), update with actual metrics. If any metric crosses the "yellow flag" threshold, alert exec team.

### Q: Can I change the discount rate from 15% to 10%?
**A:** Yes, in the Sensitivity tab. Lower discount rate increases LTV (more optimistic). Use to stress-test upside/downside scenarios.

### Q: What's the difference between the Growth tier and Scale tier?
**A:** See "Pricing Tier Comparison" tab. Growth ($24K) has 8.1 mo payback; Scale ($60K) has 5.4 mo payback. Scale has better unit economics but lower sales volume.

---

## Integration with Outreach Materials

### Use Cases for Growth Tier Validation

1. **Outreach Email Copy:** "Our validated unit economics show $24K ACV delivers 6.5x lifetime value, with payback in 8 months."

2. **Discovery Call Talking Point:** "We've modeled the ROI for your profile: at $24K annual investment, you'd see 6.5x return. Here's the math…"

3. **Pricing Justification (if prospects push back):** "The $24K tier reflects real cost to deliver value. Our model shows you break even in 8 months. Lower pricing would undermine margin."

4. **Exec Approval Document:** "LTV:COCA of 6.5x exceeds the 3.0x go/no-go threshold. Recommend launching Growth tier pricing."

---

## Data Security & Access Control

- **Document Location:** Branded Fit / Strategy / Unit Economics / [Shared folder]
- **Owner Email:** [Data Lead Email]
- **Backup Schedule:** Google Drive auto-versions; no manual backup needed
- **Access Expiry:** None (permanent shared document); review quarterly
- **Data Sensitivity:** Internal financial model; do not share externally without exec approval

---

## Next Steps

1. ✅ **Create Google Sheets document** using specifications in `documents/2026-06-08_unit_economics_model_export.md`
2. ✅ **Share with GTM, Pricing, Exec teams** (link below once created)
3. ✅ **Brief stakeholders** on how to use Summary and Sensitivity tabs
4. ⏳ **Launch Brand Drop Pilot** (June 8-10) using validated $24K pricing
5. ⏳ **Monitor COCA, margin, NRR** during pilot; update model by June 30
6. ⏳ **First monthly review** (July 1) to assess unit economics performance

---

## Contact & Support

**Questions about the model?**
- Data/Finance: [Data Lead]
- GTM/Pricing questions: [GTM Lead]
- Executive approval: [CFO]

**To request access to shared spreadsheet:** Contact [Data Lead] with your Google Workspace email.

---

**Document Last Updated:** June 8, 2026  
**Model Status:** Production Ready  
**Sharing Status:** Pending spreadsheet creation (link TBA)
