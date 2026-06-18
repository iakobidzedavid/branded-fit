# Deployment Failure Root Cause Analysis

**Date:** 2026-06-15  
**Live URL:** https://branded-david-7482s-projects.vercel.app  
**Task:** Diagnostic-only — no code changes

---

## Executive Summary

The **build itself is clean** and has never been the failure source. All deployment issues trace to two root causes:

1. **Missing Vercel environment variables** — all integration API keys were absent as of the June 14 audit; Supabase vars are the most critical because their absence causes throw-on-init failures.
2. **Env var name mismatch** — the task spec mentions `SHOPIFY_ADMIN_TOKEN` but the codebase checks `SHOPIFY_ACCESS_TOKEN`. If the wrong name is set in Vercel, Pipeline 3 silently runs in demo mode.

A secondary architectural risk is documented below (in-memory orchestration state on serverless) but does not cause a deployment failure — it causes a status-polling regression.

---

## 1. Build Status

| Check | Last Verified | Result |
|---|---|---|
| `./node_modules/.bin/tsc --noEmit` | 2026-06-15 | ✅ 0 errors |
| `npm run build` | 2026-06-15 | ✅ 36 routes compiled |
| Secrets in code | 2026-06-15 | ✅ None — all from `process.env` |
| `.gitignore` coverage | 2026-06-14 | ✅ `node_modules/`, `.next/`, `.vercel/` excluded |
| `vercel.json` | 2026-06-14 | ✅ Present, framework = `nextjs` |

**Conclusion: no build error.** The Vercel compilation step succeeds. Failures occur at runtime when API routes execute without required credentials.

---

## 2. Root Cause 1 — Missing Vercel Environment Variables

### Status as of June 14 health-check audit

The `/api/health` endpoint (`src/app/api/health/route.ts`) reports a boolean presence map for all required vars. As of the June 14 audit against the live deployment:

| Variable | Status (June 14) | Impact if missing |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **MISSING** | `getSupabase()` throws on first call — crashes analytics, brand caching, store writes |
| `SUPABASE_SERVICE_ROLE_KEY` | **MISSING** | Same as above — used for all server-side Supabase operations |
| `BRANDFETCH_API_KEY` | **MISSING** | Pipeline 1 degrades gracefully — falls back to hash-derived colors + DiceBear logo (20% confidence). Pipeline completes. |
| `PRINTIFY_API_KEY` | **MISSING** | Pipeline 2 skips API validation — uses placeholder mockup URLs. Pipeline completes. |
| `SHOPIFY_ACCESS_TOKEN` | **MISSING** | Pipeline 3 runs in **demo mode** — returns a fake `.myshopify.com` URL. No live store provisioned. |
| `SHOPIFY_STORE_NAME` | **MISSING** | Same as above. Code checks `SHOPIFY_STORE_NAME \|\| SHOPIFY_SHOP_NAME`. |
| `ADMIN_PASSWORD` | **UNKNOWN** | `/admin/analytics` login always returns 401 if absent. |

### Why Supabase missing vars is the only hard crash

`src/lib/supabase.ts:initializeSupabase()` (line 6–16) throws `"Missing Supabase environment variables"` when either var is absent. This affects:

- `emitEvent()` in `analytics.ts` — called via `void` (non-fatal, swallowed silently by `void`)
- `storeBrandExtraction()` — called with `.catch()` in the orchestrate route (non-fatal)
- `storeProduct()` — same `.catch()` wrapper (non-fatal)
- `insertStoreMetadata()` — same `.catch()` wrapper (non-fatal)
- **`POST /api/analytics`** — hits `getSupabase()` without wrapper → returns HTTP 500
- **`GET /api/admin/analytics`** — hits `getSupabase()` without wrapper → returns HTTP 500

The orchestration pipeline itself (`POST /api/orchestrate`) survives missing Supabase vars because every Supabase call in that route is wrapped in `.catch()`. It completes end-to-end in degraded mode.

### Required env vars — complete list for Vercel dashboard

Set under **Vercel → Project → Settings → Environment Variables** (all environments):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

BRANDFETCH_API_KEY=<brandfetch_bearer_token>

PRINTIFY_API_KEY=<printify_shop_token>

SHOPIFY_ACCESS_TOKEN=shpat_...
SHOPIFY_STORE_NAME=<your-shop.myshopify.com>

ADMIN_PASSWORD=<strong_password>
```

**Not required** (not used in codebase):
- `SUPABASE_ANON_KEY` — defined in `.env.example` but `supabase.ts` uses `SUPABASE_SERVICE_ROLE_KEY` for all operations
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — NextAuth is not installed; admin auth uses a custom cookie mechanism
- `SHOPIFY_API_KEY` / `SHOPIFY_ADMIN_API_KEY` / `SHOPIFY_ADMIN_API_SECRET` — listed in `.env.example` but none are read by any code path

---

## 3. Root Cause 2 — Env Var Name Mismatch: `SHOPIFY_ADMIN_TOKEN` vs `SHOPIFY_ACCESS_TOKEN`

The task brief references `SHOPIFY_ADMIN_TOKEN` but **no code in this repository reads that variable name**.

All three code paths that access Shopify credentials use:
```typescript
process.env.SHOPIFY_ACCESS_TOKEN   // orchestrate/route.ts line 366
process.env.SHOPIFY_ACCESS_TOKEN   // shopify/route.ts line 84
process.env.SHOPIFY_ACCESS_TOKEN   // health/route.ts line 7
```

**If `SHOPIFY_ADMIN_TOKEN` was set in Vercel instead of `SHOPIFY_ACCESS_TOKEN`**, Pipeline 3 would silently enter demo mode — no error, no warning visible to the user, but no live Shopify store is provisioned.

**Fix:** Ensure the Vercel env var is named `SHOPIFY_ACCESS_TOKEN` (with `shpat_...` value).

---

## 4. Secondary Issue — In-Memory Orchestration State on Serverless

**File:** `src/lib/orchestration-state.ts`

`orchestrationStore` is a module-level `Map` instance. On Vercel's serverless functions, each function invocation runs in an isolated compute instance. This means:

- `POST /api/orchestrate` runs in Instance A — writes pipeline state to the in-memory Map
- `GET /api/orchestrate?domain=X` runs in Instance B (different cold-start) — the Map is empty, returns `status: "pending"` regardless of actual completion

**Impact:** The status-polling feature (`GET /api/orchestrate?domain=X`) does not work in production. However, the `POST /api/orchestrate` handler runs all three pipelines synchronously within a single request and returns the final `OrchestrationState` in the response body — so the Command Console UI receives the complete result from the initial POST. Polling is broken but the primary flow works.

**Not a deployment blocker.** The pipeline completes and the result is returned inline.

---

## 5. Additional Observations

### Vercel Hobby Plan — Function Timeout

`src/app/api/orchestrate/route.ts` exports `maxDuration = 300` (5 minutes). Vercel Hobby plan does not honour this and caps serverless functions at 10–60 seconds depending on plan tier. Live Shopify provisioning (when credentials are present) completes in ~30–60s; demo mode completes in <1s. The timeout is a risk only for live Shopify calls on Hobby plan. Upgrading to Vercel Pro honours the 300-second `maxDuration`.

### `@shopify/shopify-api` Package — Unused

`package.json` declares `"@shopify/shopify-api": "^12.2.0"` but `src/lib/shopify.ts` uses raw `fetch` calls against the Shopify REST Admin API, not the SDK. The SDK is never imported anywhere. This doesn't cause failures but adds ~500KB to install time and bundle analysis. **Not a blocker.**

### Security Note — Shopify Token Stored in Supabase

`src/app/api/shopify/route.ts` line 262 passes `shopify_api_token: provisioningResult.accessToken` to `insertStoreMetadata()`, which writes the live Shopify access token to the `stores` table. The primary orchestration route (`/api/orchestrate`) correctly passes `shopify_api_token: ""` to avoid this. The standalone `/api/shopify` route is the only path that persists the token. **Not a deployment blocker, but a medium-severity security concern.**

---

## 6. Verification Protocol — Post-Fix

After setting all env vars in Vercel and triggering a redeploy:

```bash
# 1. Health check — all vars should show true
curl https://branded-david-7482s-projects.vercel.app/api/health

# Expected:
# {
#   "status": "ok",
#   "env": {
#     "NEXT_PUBLIC_SUPABASE_URL": true,
#     "SUPABASE_SERVICE_ROLE_KEY": true,
#     "BRANDFETCH_API_KEY": true,
#     "PRINTIFY_API_KEY": true,
#     "SHOPIFY_ACCESS_TOKEN": true,
#     "SHOPIFY_STORE_NAME": true
#   },
#   "missingRequired": undefined
# }

# 2. End-to-end pipeline
# POST https://branded-david-7482s-projects.vercel.app/api/orchestrate
# Body: { "domain": "ramp.com" }
# Expect: HTTP 200, orchestration.status = "completed", storefront.url present
```

---

## 7. Summary Table

| Issue | Severity | Type | Status |
|---|---|---|---|
| All Vercel env vars absent | **Critical** | Configuration | Unverified — must be set manually in Vercel dashboard |
| `SHOPIFY_ADMIN_TOKEN` vs `SHOPIFY_ACCESS_TOKEN` naming | **High** | Configuration mismatch | Code uses `SHOPIFY_ACCESS_TOKEN` — set that name in Vercel |
| `SUPABASE_ANON_KEY` defined in `.env.example` but unused | Low | Documentation confusion | Ignore — `SUPABASE_SERVICE_ROLE_KEY` is what's required |
| In-memory orchestration state (serverless) | Medium | Architectural | Non-blocking — POST returns full state inline; polling broken |
| Vercel Hobby plan 60s timeout | Medium | Infrastructure | Upgrade to Pro if live Shopify provisioning exceeds 60s |
| `@shopify/shopify-api` unused package | Low | Hygiene | Non-blocking |
| Shopify token stored in Supabase (`/api/shopify`) | Medium | Security | Fix in next sprint — not a deployment blocker |
| Build errors | None | — | Build passes cleanly |
