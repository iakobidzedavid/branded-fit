# Pipeline Fix & Verification Report

**Date:** 2026-06-15  
**Task:** Fix API routes and orchestration pipeline for Command Console

---

## Summary

Three code defects identified in the root-cause analysis were fixed. Build passes clean (0 TypeScript errors, all 27 routes compiled). The Brandfetch→Printify→Shopify pipeline in `/api/orchestrate` was already wired correctly and required no changes.

---

## Fixes Applied

### Fix 1 — Brandfetch Route: 500 on Missing API Key → Graceful Degradation

**File:** `src/app/api/brandfetch/route.ts`

**Before:** Returned HTTP 500 `"Brand extraction service unavailable"` when `BRANDFETCH_API_KEY` was not set.

**After:** Returns HTTP 200 with hash-derived default brand assets (same fallback the orchestration pipeline uses internally).

**Why this matters:** The `/api/brandfetch` endpoint is a standalone extraction endpoint. Returning 500 when called without an API key caused unnecessary failures. The orchestration pipeline already handled missing keys gracefully; the standalone route now matches that behavior.

---

### Fix 2 — v1/brand/extract Route: Same 500 Fix

**File:** `src/app/api/v1/brand/extract/route.ts`

**Before:** Same as Fix 1 — returned 500 when `BRANDFETCH_API_KEY` was missing.

**After:** Returns HTTP 200 with default brand assets (confidence: 0, hash-derived colors, DiceBear logo).

---

### Fix 3 — Shopify Route: Live Token No Longer Persisted to Supabase

**File:** `src/app/api/shopify/route.ts` (line 265)

**Before:** `shopify_api_token: provisioningResult.accessToken` — the live `shpat_…` token was written to the `stores` table in Supabase.

**After:** `shopify_api_token: ""` — the token is never stored. The primary orchestration route (`/api/orchestrate`) already used this pattern; the standalone Shopify route now matches.

**Why this matters:** Storing a live Shopify access token in a database column is a medium-severity security issue. If the Supabase `stores` table is ever exposed (via misconfigured RLS, a query leak, or a backup), the token could be used to modify the Shopify store directly.

---

### Fix 4 — `.env.example`: Removed Unused Variables

**Before:** Contained `SUPABASE_ANON_KEY`, `SHOPIFY_API_KEY`, `SHOPIFY_ADMIN_API_KEY`, `SHOPIFY_ADMIN_API_SECRET`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET` — none of which are read by any code path.

**After:** Only lists the 7 variables that the codebase actually uses:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BRANDFETCH_API_KEY`
- `PRINTIFY_API_KEY`
- `SHOPIFY_ACCESS_TOKEN`
- `SHOPIFY_STORE_NAME`
- `ADMIN_PASSWORD`

Each entry now includes a comment explaining what degrades when that variable is absent.

---

## Pipeline Architecture (Verified Correct, No Changes Needed)

The main orchestration route `POST /api/orchestrate` already had correct env var references and graceful fallbacks for all three pipelines:

| Pipeline | API Key Var | Fallback When Missing |
|---|---|---|
| Pipeline 1 — Brand Extraction | `BRANDFETCH_API_KEY` | Hash-derived colors + DiceBear logo (20% confidence) |
| Pipeline 2 — Mockup Generation | `PRINTIFY_API_KEY` | Placeholder `placehold.co` mockup URLs |
| Pipeline 3 — Shopify Provisioning | `SHOPIFY_ACCESS_TOKEN` + `SHOPIFY_STORE_NAME` | Demo mode — returns `{brand}-{timestamp}.myshopify.com` |

All three fallbacks complete successfully. The pipeline returns HTTP 200 with `orchestration.status = "completed"` even when all API keys are absent.

---

## End-to-End Pipeline Trace — ramp.com (Demo Mode)

The following trace is derived from code analysis of `/api/orchestrate` for domain `ramp.com` in an environment where only `BRANDFETCH_API_KEY` is set (Supabase and Shopify in demo mode):

| Stage | Expected Output |
|---|---|
| Domain validation | Pass — `ramp.com` matches regex + `.com` is in CORPORATE_TLDS |
| Pipeline 1 — Brandfetch call | `GET https://api.brandfetch.io/v2/brands/ramp.com` → colors, logos, fonts extracted |
| Pipeline 1 — Parse response | Colors: `[{hex, type}, ...]`, logos: `[{url (SVG), type}]`, typography: `{primary: "..."}` |
| Pipeline 1 — Confidence | 50 (API success) + 20 (real colors) + 20 (real logos) + 10 (typography) = 100% |
| Pipeline 2 — Products | 5 products × up to 5 variants = 25 SKUs; mockup URLs: `placehold.co/400x400/{primaryColor}/ffffff?text={label}` |
| Pipeline 3 — Demo mode | No Shopify creds → `ramp-{last4 of timestamp}.myshopify.com` returned immediately |
| Response | HTTP 200, `orchestration.status = "completed"`, `storefront.url` present |

---

## Build Verification

| Check | Result |
|---|---|
| `./node_modules/.bin/tsc --noEmit` | ✅ 0 errors |
| `npm run build` | ✅ 27 routes compiled — no warnings |
| Secrets in code | ✅ None — all credentials read from `process.env` |

---

## Remaining Non-Blockers (Not Changed)

| Issue | Status | Reason Not Fixed |
|---|---|---|
| In-memory `orchestrationStore` doesn't work across serverless instances | Not fixed | Non-blocking — POST returns full state inline; polling is cosmetic only |
| Vercel Hobby plan 60s timeout | Not fixed | Infrastructure choice; `maxDuration=300` is correct and honoured on Pro plan |
| `@shopify/shopify-api` package listed in `package.json` but unused | Not fixed | Hygiene-only; doesn't affect runtime or bundle |
