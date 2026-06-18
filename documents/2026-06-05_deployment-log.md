# Deployment Log — Branded Fit MVBP Production

**Date:** 2026-06-05  
**Branch:** main  
**Live URL:** https://branded-fit.vercel.app  
**Deploy trigger:** git push → Vercel auto-deploy

---

## 1. Summary

This deployment completes the MVBP by wiring the Command Console frontend (home page `/`) to the fixed `POST /api/orchestrate` backend and verifying the full three-pipeline flow is production-ready.

---

## 2. What ships in this commit

| Area | Change |
|---|---|
| Frontend | Home page (`src/app/page.tsx`) — fully wired to `POST /api/orchestrate` + polling `GET /api/orchestrate` every 5 s |
| Backend | `src/app/api/orchestrate/route.ts` — three-pipeline orchestrator with all prior bugs fixed (see task 56b81837) |
| Brand preview | Right-column sidebar shows extracted logo, colors (up to 3), font family, and brand-fidelity meter |
| Success state | Storefront URL card with `View Store`, `Download Assets`, and `Invite Team` actions |
| Error state | Inline error banner with Retry + Contact Support; support escalation hits `/api/support-escalation` |
| Build | `npx tsc --noEmit` ✓ clean; `npm run build` ✓ clean — 26 routes compiled, zero TS/lint errors |

---

## 3. Environment variables required in Vercel

Set these in Vercel → Project → Settings → Environment Variables (Production).

| Variable | Purpose | Degradation if absent |
|---|---|---|
| `BRANDFETCH_API_KEY` | Brand color/logo extraction | Falls back to hash-generated defaults (20% confidence) |
| `PRINTIFY_API_KEY` | Printify API validation in Pipeline 2 | Uses placeholder mockup images (placehold.co) |
| `SHOPIFY_ACCESS_TOKEN` | Live Shopify store provisioning | Demo mode — generates a `*.myshopify.com` URL without creating a real store |
| `SHOPIFY_SHOP_NAME` | Shopify shop subdomain (e.g. `mybrand.myshopify.com`) | Same as above — demo mode |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL for caching | All DB writes silently skipped (non-fatal) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key | Same — Supabase calls are best-effort |

**Minimum viable set for live brand extraction:** `BRANDFETCH_API_KEY` is the only key that meaningfully changes output quality. Without Shopify credentials the pipeline completes in demo mode, which is sufficient to demonstrate the MVBP to prospects.

---

## 4. Pipeline architecture confirmed

```
POST /api/orchestrate { domain }
  │
  ├─ Pipeline 1: Brandfetch v2 API
  │    → extracts colors, logos, fonts
  │    → graceful fallback to hash-generated defaults if key missing or API fails
  │    → caches result to Supabase brand_extracts (best-effort)
  │
  ├─ Pipeline 2: Printify-style mockup engine
  │    → validates Printify key (non-fatal either way)
  │    → generates 5 products × up to 5 variants each
  │    → mockup URLs: placehold.co/400x400/{primaryColor}/ffffff?text={label}
  │    → stores products in Supabase (best-effort)
  │
  └─ Pipeline 3: Shopify provisioning
       → if SHOPIFY_ACCESS_TOKEN + SHOPIFY_SHOP_NAME present: live store
       → else: demo mode, returns https://{brand}-{ts4}.myshopify.com URL
       → saves store metadata to Supabase stores table (best-effort)

GET /api/orchestrate?domain={domain}
  └─ returns current OrchestrationState from in-memory store
     (frontend polls every 5 s until status === "completed" | "failed")
```

---

## 5. Frontend wiring details

File: `src/app/page.tsx` (the Command Console, served at `/`)

- Domain input with client-side validation (format + corporate TLD allowlist)
- On submit: sets `orchestrationStatus = "in_progress"`, starts polling `GET /api/orchestrate`, then fires `POST /api/orchestrate`
- When POST returns: stops polling, calls `applyOrchestrationState()` with the definitive response
- `applyOrchestrationState()` updates pipeline cards, brand preview sidebar, storefront success card, and provisioning timer
- Error path: inline error banner with retry + support escalation

---

## 6. Pipeline validation results (from prior task 56b81837)

Tested on three real domains before this deployment:

| Domain | P1 Confidence | Products | Storefront | Duration |
|---|---|---|---|---|
| ramp.com | 90% | 5 (25 variants) | Demo URL returned | ~10 s |
| vanta.io | 90% | 5 (25 variants) | Demo URL returned | ~10 s |
| linear.app | 90% | 5 (25 variants) | Demo URL returned | ~10 s |

All three completed within 15 s. Brand colors and logos were correctly extracted from Brandfetch v2. Mockup images rendered as colored placeholders keyed to the brand's primary color.

**Known gap:** Printify blueprint selection and actual print-file upload is not yet implemented — the current mockup URLs are placehold.co placeholders. This is the next milestone for turning the pipeline into a production print workflow.

---

## 7. Post-deployment verification checklist

Once Vercel deploys this commit:

- [ ] `curl -I https://branded-fit.vercel.app` → HTTP 200
- [ ] Load `https://branded-fit.vercel.app` in browser → domain input form visible
- [ ] Submit `linear.app` → three pipeline cards animate to "completed" within 60 s
- [ ] Brand preview sidebar shows Linear's purple/white colors and logo
- [ ] Success card shows storefront URL (demo or live depending on Shopify credentials)
- [ ] Submit `ramp.com` in a second tab to confirm parallel runs work
- [ ] Network tab: `POST /api/orchestrate` → 200 with `success: true`
- [ ] Network tab: `GET /api/orchestrate?domain=linear.app` → 200 with pipeline states

---

## 8. Build output summary

```
Route (app)                   Size    First Load JS
┌ ○ /                         5.18 kB      108 kB   ← Command Console
├ ƒ /api/orchestrate            167 B      103 kB   ← main pipeline endpoint
├ ○ /command-console           3.81 kB     106 kB   ← legacy console (still works)
└ ... 26 routes total

TypeScript: ✓ zero errors
Lint:       ✓ zero errors
Build:      ✓ compiled successfully in 3.7 s
```
