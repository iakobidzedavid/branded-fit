# Drift Resolution Verification Report
**Date:** 2026-06-14  
**Page audited:** `/` (Landing page — `src/app/page.tsx`)  
**Live URL:** https://branded-david-7482s-projects.vercel.app  
**Audit scope:** Brand charter compliance — forbidden phrases, forbidden CTAs, parent-org exclusions, fabricated testimonials, future-dated claims

---

## Audit Methodology

Full scan of `src/app/page.tsx` against five violation categories:

1. Parent-org-name exclusions (`Entonomy` must not appear)
2. Forbidden marketing phrases (per brand charter)
3. Forbidden CTAs (demo/call/follow-up prompts)
4. Fabricated testimonials (names, quotes, or "trusted by" lists not grounded in pilot cohort data)
5. Future-dated claims (e.g. "Case studies coming Q2 2026")

Grep patterns run against `src/` directory for completeness across all routes.

---

## Violations Found and Fixed

### [DRIFT-1] Future-dated claim — Trust Signals disclaimer
**Severity:** Medium  
**Location:** Trust Signals section, methodology footnote box (~line 255)  
**Exact string removed:**  
```
Sample size is small; findings are directional. Case studies coming soon.
```  
**Replaced with:**  
```
Sample size is small; findings are directional. Outcomes data available on request.
```  
**Reason:** "Case studies coming soon" is a forward-looking content promise about material that does not yet exist. Violates the future-dated claims rule.

---

### [DRIFT-2] Forbidden follow-up promise — Founding Customer section (body copy)
**Severity:** High  
**Location:** Founding Customer Program section, submission description (~line 680)  
**Exact string removed:**  
```
A founding team member reviews every submission and follows up directly if there is a fit.
```  
**Replaced with:**  
```
Qualifying companies are selected for the founding cohort based on fit — self-serve onboarding starts immediately.
```  
**Reason:** Implied human follow-up ("follows up directly") is equivalent to the forbidden "We'll follow up" CTA pattern. The brand charter requires self-serve framing — no implied sales outreach.

---

### [DRIFT-3] Forbidden follow-up promise — Founding Customer section (disclaimer)
**Severity:** High  
**Location:** Founding Customer Program section, smaller disclaimer paragraph (~line 693)  
**Exact string removed:**  
```
A team member reviews submissions and may follow up if there is a pricing or product fit.
```  
**Replacement:** Sentence removed entirely; the preceding self-serve disclaimer already covers the intent:  
```
Self-serve onboarding is available immediately — no human contact required to start your brand preview or Brand Drop Pilot.
```  
**Reason:** Same violation as DRIFT-2 — implied follow-up is a forbidden CTA pattern. Removal leaves the self-serve framing intact without any contradictory promise of human outreach.

---

### [DRIFT-4] Future-dated claim — FAQ answer
**Severity:** Medium  
**Location:** FAQ item "I need proof this works at other companies before I can pitch it internally." (~line 788)  
**Exact string removed:**  
```
; detailed case studies are coming soon
```  
**Resulting sentence (before/after):**  
- Before: `These are early-stage findings; detailed case studies are coming soon. Submit your details...`  
- After: `These are early-stage findings. Submit your details...`  
**Reason:** "Case studies are coming soon" is a future-dated content promise about material that does not exist. Violates the future-dated claims rule.

---

## Clean Checks — No Violations Found

| Category | Check | Result |
|---|---|---|
| Parent org | "Entonomy" anywhere on page | ✓ Not present |
| Forbidden phrase | "Trusted by 400+ companies" | ✓ Not present |
| Forbidden phrase | "Used by Fortune 500" | ✓ Not present |
| Forbidden phrase | "Loved by thousands" | ✓ Not present |
| Forbidden phrase | "industry-leading" | ✓ Not present |
| Forbidden phrase | "fastest in the market" | ✓ Not present |
| Forbidden phrase | "the only platform that" | ✓ Not present |
| Forbidden phrase | "enterprise-grade reliability" | ✓ Not present |
| Forbidden phrase | "zero downtime guarantee" | ✓ Not present |
| Forbidden phrase | "award-winning" | ✓ Not present |
| Forbidden phrase | "powering global brands" | ✓ Not present |
| Forbidden phrase | "millions of orders processed" | ✓ Not present |
| Forbidden CTA | "Book a demo" | ✓ Not present |
| Forbidden CTA | "Schedule a demo" | ✓ Not present |
| Forbidden CTA | "Request a demo" | ✓ Not present |
| Forbidden CTA | "Schedule a call" | ✓ Not present |
| Forbidden CTA | "Speak with founder" | ✓ Not present |
| Forbidden CTA | "Calendly link" | ✓ Not present |
| Forbidden CTA | "Contact sales" | ✓ Not present |
| Forbidden CTA | "Onsite visit" | ✓ Not present |
| Testimonials | Named customer quotes | ✓ None present — uses "Pilot company 1–5" placeholders |
| Testimonials | "Trusted by [list]" with real names | ✓ Not present |
| Pilot data | NPS 8.6, 4/5 conversion, 95% fidelity | ✓ All labeled n=5, directional with methodology disclosure |

---

## Post-Fix Compliance Status

All primary CTAs on the page point to `/command-console` (self-serve) or `/store/demo` (demo storefront). No CTA triggers a human sales interaction. All pilot cohort statistics carry appropriate "n=5, directional" qualifiers and methodology footnotes.

**Build status:** `npm run build` passed with no errors post-fix.

---

## Summary

**Total violations found:** 4  
**Total violations fixed:** 4  
**Remaining violations:** 0  

The landing page is now compliant with the brand charter rules for forbidden phrases, forbidden CTAs, parent-org exclusions, fabricated testimonials, and future-dated claims.
