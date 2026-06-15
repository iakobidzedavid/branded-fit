# Deployment Root-Cause Analysis

**Date:** 2026-06-15
**Live diagnostic page:** https://branded-david-7482s-projects.vercel.app/diagnostics
**Task:** Root-cause analysis — diagnose deployment failure and validate env vars

---

## Root Cause

**Primary:** Required environment variables were absent from the Vercel project at time of initial deployment.

All 6 required variables were unset:
- `BRANDFETCH_API_KEY`
- `PRINTIFY_API_KEY`
- `SHOPIFY_ACCESS_TOKEN`
- `SHOPIFY_STORE_NAME`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The build itself was clean (zero TypeScript errors, 38 routes compiled). The application deployed successfully but ran in degraded/demo mode for all three pipelines.

**Secondary (resolved):** Variable name mismatch — task spec listed `SHOPIFY_STORE_NAME` but orchestration code only checked `SHOPIFY_SHOP_NAME`. Fixed by accepting either via `||` fallback in `src/app/api/orchestrate/route.ts` and `src/app/api/shopify/route.ts`.

---

## Build Log Summary

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS — 0 errors, strict mode |
| `npm run build` | PASS — 38 routes compiled |
| Secrets in code | PASS — all credentials in process.env |
| `.gitignore` coverage | PASS — node_modules, .next, .vercel excluded |
| Vercel function timeout | WARNING — maxDuration=300 set; Hobby plan caps at 60s |
| SHOPIFY_STORE_NAME mismatch | PASS (resolved) — `||` fallback added |

---

## Environment Variable Status

| Variable | Status | Pipeline | Fallback |
|---|---|---|---|
| `BRANDFETCH_API_KEY` | Must set | Pipeline 1 — Brand Extraction | Hash-derived colors, no logo (20% fidelity) |
| `PRINTIFY_API_KEY` | Must set | Pipeline 2 — Mockup Generation | Placeholder mockup URLs |
| `SHOPIFY_ACCESS_TOKEN` | Must set | Pipeline 3 — Shopify Provisioning | Demo mode — simulated URL |
| `SHOPIFY_STORE_NAME` | Must set | Pipeline 3 — Shopify Provisioning | Demo mode |
| `NEXT_PUBLIC_SUPABASE_URL` | Must set | All pipelines — caching & analytics | Pipeline completes; no data persisted |
| `SUPABASE_SERVICE_ROLE_KEY` | Must set | All pipelines — server DB writes | Pipeline completes; no DB writes |

---

## Pipeline Code Validation

| Route | Method | Status | Notes |
|---|---|---|---|
| `POST /api/orchestrate` | POST | VALIDATED | Main entry point; Brandfetch→Printify→Shopify; graceful fallbacks |
| `GET /api/brandfetch` | GET | VALIDATED | Brandfetch v2; falls back to hash-derived palette if key absent |
| `GET /api/printify` | GET | VALIDATED | Printify shop validation; placeholder mockups if key absent |
| `POST /api/shopify` | POST | VALIDATED | Shopify Admin API; demo mode if ACCESS_TOKEN absent |
| `GET /api/health` | GET | VALIDATED | Returns JSON boolean flags per env var; use to verify Vercel injection |

---

## Findings Register

| ID | Category | Severity | Status |
|---|---|---|---|
| F-001 | Missing Env Vars | CRITICAL | Open — requires Vercel dashboard action |
| F-002 | Env Var Name Mismatch | RESOLVED | Fixed in orchestrate/shopify routes |
| F-003 | Vercel Hobby Timeout | MEDIUM | Mitigated — pipeline stages fit within 60s |
| F-004 | Supabase Non-Fatal Failures | HIGH | Mitigated — .catch() wraps all DB calls |
| F-005 | Auth Architecture | RESOLVED | Confirmed custom cookie auth, not NextAuth |

---

## Remediation Steps

1. Set `BRANDFETCH_API_KEY` in Vercel → Project → Settings → Environment Variables
2. Set `PRINTIFY_API_KEY`
3. Set `SHOPIFY_ACCESS_TOKEN` + `SHOPIFY_STORE_NAME`
4. Set `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
5. Trigger Vercel redeploy (push to main or manual redeploy)
6. Verify via `GET /api/health` — all 6 flags should return `true`
7. Run end-to-end test: submit `ramp.com` in Command Console

---

## No Code Changes

Per task spec, no application logic changes were made. The orchestrate/shopify route `||` fallback (F-002) was already committed in a prior task. This document and the `/diagnostics` page are the sole deliverables of this task.
