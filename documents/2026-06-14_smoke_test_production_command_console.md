# Production Smoke Test — Command Console (5 Domains)

**Date:** 2026-06-14  
**Tester:** Automated smoke test agent  
**Live URL tested:** https://branded-fit.vercel.app  
**CLAUDE.md canonical URL:** https://branded-david-7482s-projects.vercel.app ← DEPLOYMENT_NOT_FOUND (see issues)

---

## 1. Pre-test Checks

| Check | Result |
|---|---|
| `/` root page HTTP status | ✅ HTTP 200 |
| `/command-console` page HTTP status | ✅ HTTP 200 |
| `/api/health` HTTP status | ✅ HTTP 200 |
| Content-type on `/command-console` | ✅ `text/html; charset=utf-8` |
| DEPLOYMENT_NOT_FOUND on CLAUDE.md URL | ❌ `https://branded-david-7482s-projects.vercel.app` returns DEPLOYMENT_NOT_FOUND |

**Health check env var snapshot (all false = degraded mode):**

```json
{
  "BRANDFETCH_API_KEY": false,
  "PRINTIFY_API_KEY": false,
  "SHOPIFY_ACCESS_TOKEN": false,
  "SHOPIFY_SHOP_NAME": false,
  "NEXT_PUBLIC_SUPABASE_URL": false,
  "SUPABASE_SERVICE_ROLE_KEY": false
}
```

All six required environment variables are absent from the Vercel project. The full pipeline runs in **degraded/demo mode**:
- Pipeline 1 uses hash-generated colors + DiceBear logo (20% confidence instead of 90%+)
- Pipeline 2 uses placehold.co placeholder mockup images
- Pipeline 3 generates a demo `.myshopify.com` URL without creating a real store

---

## 2. Domain Form Validation

| Input | Expected | Actual | Pass |
|---|---|---|---|
| Empty domain | HTTP 400 | HTTP 400 | ✅ |
| Invalid format (`not-a-domain`) | HTTP 400 | HTTP 400 | ✅ |
| Non-corporate TLD (`example.xyz`) | HTTP 400 + message | "Only corporate domains (.com, .io, .co, .org, etc.) are supported" | ✅ |

---

## 3. End-to-End Pipeline Results

**Method:** `POST https://branded-fit.vercel.app/api/orchestrate` with `{"domain":"<domain>"}`

| # | Domain | P1 Status | P2 Status | P3 Status | Storefront URL | Colors | Logo | Fidelity | Elapsed |
|---|---|---|---|---|---|---|---|---|---|
| 1 | ramp.com | ✅ completed | ✅ completed | ✅ completed | https://ramp-7449.myshopify.com | #d946ef, #0ea5e9 | DiceBear SVG | 20% | ~1s |
| 2 | vanta.com | ✅ completed | ✅ completed | ✅ completed | https://vanta-0010.myshopify.com | #0ea5e9, #14b8a6 | DiceBear SVG | 20% | <1s |
| 3 | retool.com | ✅ completed | ✅ completed | ✅ completed | https://retool-9878.myshopify.com | #8b5cf6, #d946ef | DiceBear SVG | 20% | <1s |
| 4 | notion.so | ✅ completed | ✅ completed | ✅ completed | https://notion-0544.myshopify.com | #6366f1, #8b5cf6 | DiceBear SVG | 20% | ~1s |
| 5 | linear.app | ✅ completed | ✅ completed | ✅ completed | https://linear-9900.myshopify.com | #d946ef, #0ea5e9 | DiceBear SVG | 20% | <1s |

**Summary:** 5/5 domains completed all three pipelines. All completed in <2 seconds (demo mode bypasses real API latency). All under the 10-minute SLA.

**Pipeline message detail (representative — ramp.com):**
- P1: "Extracted 2 colors, 1 logos (20% confidence)"
- P2: "Generated 5 products with 21 variants"
- P3: "Storefront provisioned (demo) — 5 products catalogued"

---

## 4. Storefront URL Accessibility

All five generated storefront URLs were checked for public HTTP accessibility:

| URL | HTTP Status | Notes |
|---|---|---|
| https://ramp-7449.myshopify.com | 404 | Demo URL — not a real Shopify store |
| https://vanta-0010.myshopify.com | 404 | Demo URL — not a real Shopify store |
| https://retool-9878.myshopify.com | 404 | Demo URL — not a real Shopify store |
| https://notion-0544.myshopify.com | 404 | Demo URL — not a real Shopify store |
| https://linear-9900.myshopify.com | 404 | Demo URL — not a real Shopify store |

**All 5 return HTTP 404.** This is expected behavior in demo mode — the pipeline generates a plausible `.myshopify.com` URL without actually provisioning a Shopify store. These are non-functional display URLs only.

---

## 5. Brand Extraction Fidelity Assessment

| Domain | Expected Real Brand Colors | Extracted Colors | Logo Source | Assessment |
|---|---|---|---|---|
| ramp.com | Green (#00D563), dark grey | #d946ef, #0ea5e9 | DiceBear SVG | ❌ Incorrect — hash fallback |
| vanta.com | Purple (#5B50D6), white | #0ea5e9, #14b8a6 | DiceBear SVG | ❌ Incorrect — hash fallback |
| retool.com | Blue (#3D63DD), yellow | #8b5cf6, #d946ef | DiceBear SVG | ❌ Incorrect — hash fallback |
| notion.so | Black, white | #6366f1, #8b5cf6 | DiceBear SVG | ❌ Incorrect — hash fallback |
| linear.app | Purple (#5E6AD2), dark | #d946ef, #0ea5e9 | DiceBear SVG | ❌ Incorrect — hash fallback |

**Brand fidelity: 0/5 correct** — all colors are hash-generated fallbacks from `generateDefaultColors()`, not actual brand colors. No real brand logos were fetched. Root cause: `BRANDFETCH_API_KEY` is not set in Vercel.

---

## 6. Issues Found

### BLOCKER — P0: CLAUDE.md canonical URL is stale

- **CLAUDE.md URL:** `https://branded-david-7482s-projects.vercel.app`
- **Actual live URL:** `https://branded-fit.vercel.app`
- The canonical URL returns `DEPLOYMENT_NOT_FOUND` for all routes
- All future agents and the GTM handoff must use `https://branded-fit.vercel.app`

### BLOCKER — P0: No environment variables configured in Vercel

All six required env vars are absent. Impact:
- Brand fidelity is 20% (hash-generated) instead of 90%+ (Brandfetch)
- No real Shopify storefronts are provisioned
- Supabase analytics/caching is disabled

**Action required:** Set the following in Vercel → Project → Settings → Environment Variables:
```
BRANDFETCH_API_KEY=<brandfetch bearer token>
SHOPIFY_ACCESS_TOKEN=<shopify admin token>
SHOPIFY_SHOP_NAME=<shop>.myshopify.com
NEXT_PUBLIC_SUPABASE_URL=<supabase url>
SUPABASE_SERVICE_ROLE_KEY=<supabase service key>
```

### P1: GET polling is non-functional on Vercel (architectural)

- `GET /api/orchestrate?domain=ramp.com` returns `status: "pending"` even after a successful POST
- Root cause: `orchestrationStore` is an in-memory `Map` in `lib/orchestration-state.ts`; Vercel serverless functions are stateless — each invocation gets a fresh Map, so state written during POST is never visible to GET
- The frontend's 2-second polling loop will never see progress updates in production
- **Fix required:** Replace in-memory store with Supabase (or Redis/KV) persistence before the GET polling path is meaningful. Alternatively, rely entirely on the POST response (which does return final state correctly).

### P2: Concurrent run state is also lost

- The `409 Conflict` guard for in-progress runs (`existingState.status === "in_progress"`) will never fire in production for the same reason as above — each request starts with an empty store

---

## 7. What Works Today

| Feature | Status | Notes |
|---|---|---|
| Domain input form renders | ✅ | HTTP 200, `text/html` |
| Domain validation (format + TLD) | ✅ | Empty, invalid, .xyz all return correct 400s |
| POST /api/orchestrate returns 200 | ✅ | All 5 domains |
| All 3 pipeline stages complete | ✅ | P1 + P2 + P3 completed for all 5 domains |
| Storefront URL generated | ✅ | Demo URL per domain (format: `{brand}-{hash4}.myshopify.com`) |
| Latency under 10 minutes | ✅ | <2s in demo mode |
| Response includes brand data | ✅ | Colors + logoUrl + confidence returned in JSON |
| GET polling works | ❌ | Returns stale "pending" due to serverless statelessness |
| Real brand colors extracted | ❌ | Requires BRANDFETCH_API_KEY |
| Storefront publicly accessible | ❌ | Demo URLs return 404 — requires real Shopify credentials |
| Supabase caching | ❌ | Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY |

---

## 8. GTM Handoff Notes

**For prospects/demos:** The pipeline endpoint (`POST /api/orchestrate`) reliably returns a completed response with a storefront URL for all corporate domains. The end-to-end flow is functional at the API level. The UI at `/command-console` renders correctly.

**What to disclose:** Storefronts are currently in demo mode (no real Shopify store created). Brand colors are hash-generated fallbacks (not real brand extraction). Neither limitation is visible in the UI's success state — prospects will see a storefront URL and brand colors, but colors will be wrong and the storefront URL won't resolve.

**Before GTM launch:** The BRANDFETCH_API_KEY must be set in Vercel to achieve real brand extraction fidelity. The SHOPIFY_ACCESS_TOKEN must be set to provision real storefronts. The GET polling path should be fixed (replace in-memory store with persistent KV) for the real-time progress indicator to work.
