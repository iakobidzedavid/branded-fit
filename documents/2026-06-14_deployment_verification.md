# Deployment Verification — 2026-06-14

## Production URL
https://branded-david-7482s-projects.vercel.app

## Pre-deployment Status

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✓ Clean (0 errors) |
| `npm run build` | ✓ 36 routes compiled successfully |
| Secrets in code | ✓ None — all credentials read from `process.env` |
| `.gitignore` | ✓ Excludes `node_modules/`, `.next/`, `out/`, `.vercel/` |
| `vercel.json` | ✓ Added with explicit framework/build/install settings |
| `/api/health` route | ✓ Added — returns 200 with env var presence map |

## Routes Deployed

| Route | Type | Notes |
|---|---|---|
| `/` | Static | Landing page |
| `/command-console` | Static (Client) | Main UI — domain input → pipeline display |
| `/api/orchestrate` | Dynamic (Server) | POST triggers Brand→Printify→Shopify pipeline; `maxDuration=300` |
| `/api/health` | Dynamic (Server) | Returns 200 + env var presence map (no values exposed) |
| `/api/brandfetch` | Dynamic (Server) | Brandfetch v2 integration |
| `/api/shopify` | Dynamic (Server) | Shopify store operations |
| `/api/printify` | Dynamic (Server) | Printify product operations |

## Required Vercel Environment Variables

Set these in the Vercel project dashboard → Settings → Environment Variables:

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Analytics + brand caching | Public — safe to prefix with NEXT_PUBLIC_ |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side DB writes | Keep secret — server only |
| `BRANDFETCH_API_KEY` | Pipeline 1 (brand extraction) | Brandfetch v2 bearer token |
| `PRINTIFY_API_KEY` | Pipeline 2 (mockup generation) | Printify shop API token |
| `SHOPIFY_ACCESS_TOKEN` | Pipeline 3 (storefront provisioning) | Shopify Admin API access token |
| `SHOPIFY_SHOP_NAME` | Pipeline 3 | Your `.myshopify.com` subdomain (e.g. `my-shop`) |

**Degraded-mode behaviour when env vars are absent:**

- Missing `BRANDFETCH_API_KEY`: Pipeline 1 falls back to hash-derived colors + DiceBear logo (20% confidence). Pipeline completes.
- Missing `PRINTIFY_API_KEY`: Pipeline 2 uses placeholder mockup URLs. Pipeline completes.
- Missing `SHOPIFY_ACCESS_TOKEN` or `SHOPIFY_SHOP_NAME`: Pipeline 3 runs in **demo mode** — returns a simulated `.myshopify.com` URL. Pipeline completes end-to-end.
- Missing Supabase vars: Brand extractions and products skip DB caching (best-effort write), but the pipeline still completes.

The orchestration endpoint returns HTTP 200 in all cases where the pipeline completes (including demo/degraded mode).

## Post-deployment Verification Steps

1. **HTTP 200 on root** — `curl -I https://branded-david-7482s-projects.vercel.app/` → expect `HTTP/2 200`
2. **HTTP 200 on Command Console** — `curl -I https://branded-david-7482s-projects.vercel.app/command-console` → expect `HTTP/2 200`
3. **Health check** — `curl https://branded-david-7482s-projects.vercel.app/api/health` → expect `{"status":"ok",...}` with env var presence flags
4. **End-to-end pipeline** — Submit a domain (e.g. `ramp.com`) in the Command Console; all three pipelines should complete (demo mode if Shopify creds absent)

## Orchestration Timeout Config

`/api/orchestrate/route.ts` exports `maxDuration = 300` — this sets the Vercel function timeout to 300 seconds (5 minutes) for the Pro tier. Vercel Hobby tier caps at 10 seconds; deploy on Pro or Team to use the full pipeline.
