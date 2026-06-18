# /admin/analytics Route Verification Report

**Date:** 2026-06-05  
**URL tested:** https://branded-fit.vercel.app/admin/analytics

---

## Summary

The `/admin/analytics` route is deployed and serving. The page skeleton renders correctly. However, the backend API auth gate is **not enforced** because the `ADMIN_PASSWORD` environment variable is not configured in the Vercel deployment.

---

## Findings

### 1. Route deployment — PASS
- `GET https://branded-fit.vercel.app/admin/analytics` returns `HTTP 200` with `content-type: text/html`.
- The page is live on the current Vercel production deployment.

### 2. Page skeleton — PASS
- The page renders a password-protected login form on first load (`data` state starts as `null`).
- The login form uses semantic HTML (`<form>`, `<label>`, `<input type="password">`, `<button type="submit">`).
- Uses brand tokens: `bg-bg`, `bg-surface`, `border-border`, `text-text`, `text-text-muted`, `text-accent` — consistent with the design system.
- No runtime JavaScript errors are expected from the initial render path.

### 3. Authenticated user flow — PASS (functionally)
- Submitting a password triggers `POST /api/admin/analytics` with `Authorization: Bearer <password>`.
- On success the dashboard renders: metric cards, funnel bars, and a time-series SVG chart.
- All four UI states are handled: loading spinner, error message (wrong password), empty state (zero counts), and success.

### 4. Unauthenticated redirect / auth gate — FAIL
- The API route at `/api/admin/analytics` checks `process.env.ADMIN_PASSWORD`.
- **If the env var is unset the guard is skipped entirely** (line 43: `if (adminPassword && token !== adminPassword)`).
- Verified: `GET /api/admin/analytics` with `Authorization: Bearer wrongpassword` returns `HTTP 200` with full analytics JSON — not 401.
- Root cause: `ADMIN_PASSWORD` is not set as a Vercel environment variable in the production deployment.
- **Action required:** Add `ADMIN_PASSWORD` to Vercel project environment variables (Settings → Environment Variables → Production).

### 5. Analytics data — EMPTY (expected)
- Both the funnel and time-series return all-zero counts.
- This is expected if `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are not set, or if no `analytics_events` rows exist in the last 7 days.

---

## Action Items

| Priority | Item |
|---|---|
| High | Set `ADMIN_PASSWORD` in Vercel production env vars to activate the auth gate |
| Medium | Confirm `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set so real analytics data flows through |
| Low | Consider making the guard unconditional: remove the `adminPassword &&` guard so the route always requires a password |

---

## Code reference

- Page: `src/app/admin/analytics/page.tsx` — client component, login form + dashboard
- API: `src/app/api/admin/analytics/route.ts:43` — conditional auth gate
