# Vercel Deployment Verification — 2026-06-15

## Target
- **Project**: branded-fit / branded-david-7482s-projects.vercel.app
- **Live URL**: https://branded-fit.vercel.app

## Pre-deployment checks

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run build` | ✅ Compiled successfully in 6.2s |
| Static pages generated | ✅ 37/37 |
| Secrets hardcoded | ✅ None — all API keys via `process.env.*` |

## Key routes verified in build output

| Route | Type | Notes |
|---|---|---|
| `/` | Static | Landing page with hero, CTAs |
| `/command-console` | Static | Domain input form + pipeline status panel |
| `/api/orchestrate` | Dynamic | POST triggers Pipeline 1 (Brandfetch) |
| `/api/health` | Dynamic | Returns HTTP 200 + env var status |
| `/api/analytics` | Dynamic | POST /api/analytics for event tracking |

## Command Console — domain input form

File: `src/app/command-console/page.tsx`

- Input element: `<input id="domain-input" type="text" placeholder="Enter your domain (e.g., ramp.com)" ... />`
- Submit button: `<button type="submit">Generate Brand Drop</button>` — disabled only when input is empty or validation fails
- URL param pre-fill: `?domain=ramp.com` pre-populates the field
- Submit flow:
  1. Client-side domain format validation (regex)
  2. `trackEvent({ event_name: "domain_submitted" })` → POST /api/analytics
  3. `trackEvent({ event_name: "brand_extraction_started" })` → POST /api/analytics
  4. State transitions to "running" with Pipeline 1 `in_progress`
  5. POST `/api/orchestrate` — triggers Pipeline 1 (Brandfetch brand extraction)
  6. Polling starts via GET `/api/orchestrate?domain=...` every 2s

## Pipeline 1 readiness

`/api/orchestrate` POST handler:
- Validates domain format and corporate TLD
- Calls `runPipeline1(domain)` → Brandfetch API (falls back to generated colors/avatar if `BRANDFETCH_API_KEY` is missing)
- Returns `OrchestrationState` with status `completed` or `failed`
- Demo mode for Pipeline 3 (Shopify) if `SHOPIFY_ACCESS_TOKEN` is not set — does not block Pipelines 1+2

## Deployment status

Build is clean. The platform will push this commit to the main branch and trigger a Vercel redeploy. No code changes were required — the codebase was already in a deployable state.
