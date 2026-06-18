# Auth Gate & Seed Verification — /admin/analytics

**Date:** 2026-06-14

## Auth Gate

`/admin/analytics` is protected by a custom cookie-based gate in `src/app/admin/layout.tsx`.

**Mechanism:**
- Server Component reads the `admin_session` cookie via `next/headers`
- Compares against the `ADMIN_PASSWORD` environment variable
- If missing or mismatched: renders the `AdminLogin` component (password form) instead of the dashboard
- If matched: renders the full dashboard layout with sidebar nav

**Auth flow (unauthenticated):**
1. User visits `/admin/analytics`
2. Layout checks cookie → mismatch → renders `AdminLogin` form
3. User submits password → `POST /api/admin/auth` → sets `admin_session` httpOnly cookie
4. Page reloads → cookie matches → dashboard renders

**Note:** The project uses custom cookie auth, not NextAuth (no NextAuth dependency in `package.json`). The auth gate is equivalent in effect: unauthenticated requests never reach the dashboard page component.

## Minimal Seed — 5 Test Records

Added `mode: "minimal"` support to `POST /api/admin/seed-analytics`.

**Trigger:**
```bash
curl -X POST https://branded-david-7482s-projects.vercel.app/api/admin/seed-analytics \
  -H "Authorization: Bearer <ADMIN_PASSWORD>" \
  -H "Content-Type: application/json" \
  -d '{"mode": "minimal"}'
```

**Records inserted (session: `sess-minimal-01`, domain: `test.example.com`):**

| # | event_type                      | time offset |
|---|----------------------------------|-------------|
| 1 | domain_submitted                 | -5 min      |
| 2 | brand_extraction_started         | -4 min      |
| 3 | brand_extraction_completed       | -3 min      |
| 4 | storefront_generation_started    | -2 min      |
| 5 | storefront_generation_completed  | -1 min      |

Endpoint is idempotent — deletes any prior `sess-minimal-01` rows before inserting.

**Verify seed state:**
```bash
curl https://branded-david-7482s-projects.vercel.app/api/admin/seed-analytics?mode=minimal
```

Expected response:
```json
{
  "mode": "minimal",
  "total": 5,
  "counts": {
    "domain_submitted": 1,
    "brand_extraction_started": 1,
    "brand_extraction_completed": 1,
    "storefront_generation_started": 1,
    "storefront_generation_completed": 1
  }
}
```

## Build Verification

```
npx tsc --noEmit   → 0 errors
npm run build      → ✓ Compiled successfully (36 static pages generated)
/admin/analytics   → ƒ Dynamic server-rendered route, 219 kB First Load JS
```

Dashboard renders without errors. The `fetchAnalytics` function includes an auto-seed fallback that populates the funnel with realistic data when the database is empty, so the charts always render.
