# Vercel Environment Variables Audit

**Date:** 2026-06-14  
**Checked via:** `https://branded-fit.vercel.app/api/health`

---

## Summary

All required Supabase environment variables are **absent** from the Vercel deployment.
NextAuth (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`) is **not used** by this codebase — the admin area uses a custom password-based auth (`ADMIN_PASSWORD`).

---

## Environment Variable Status

| Variable | Status | Used By |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **MISSING** | `src/lib/supabase.ts`, all API routes |
| `SUPABASE_SERVICE_ROLE_KEY` | **MISSING** | `src/lib/supabase.ts`, all API routes |
| `NEXTAUTH_SECRET` | **NOT APPLICABLE** | Not in codebase — NextAuth is not installed |
| `NEXTAUTH_URL` | **NOT APPLICABLE** | Not in codebase — NextAuth is not installed |
| `ADMIN_PASSWORD` | **UNKNOWN** (not in health endpoint) | `src/app/api/admin/auth/route.ts` |
| `BRANDFETCH_API_KEY` | **MISSING** | Brandfetch integration |
| `PRINTIFY_API_KEY` | **MISSING** | Printify integration |
| `SHOPIFY_ACCESS_TOKEN` | **MISSING** | Shopify integration |
| `SHOPIFY_SHOP_NAME` | **MISSING** | Shopify integration |

---

## Auth Architecture (Not NextAuth)

The admin area at `/admin` uses a **custom cookie-based password auth**, not NextAuth:

- `POST /api/admin/auth` — validates `body.password` against `process.env.ADMIN_PASSWORD`
- On success, sets an `admin_session` httpOnly cookie valid for 24 hours
- `src/app/admin/layout.tsx` checks this cookie to gate the admin dashboard

**NextAuth (`next-auth` package) is not listed in `package.json` and has zero references in the codebase.** Do not set `NEXTAUTH_SECRET` or `NEXTAUTH_URL` — they have no effect.

---

## Blocker: Required Values to Set in Vercel Dashboard

The following must be set under **Vercel → Project → Settings → Environment Variables** before any feature works:

### Supabase (critical — app crashes without these)

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key_from_supabase_dashboard>
```

Obtain from: Supabase Dashboard → Project → Settings → API → "Project URL" and "service_role" key.

### Admin Access

```
ADMIN_PASSWORD=<choose_a_strong_password>
```

This gates the `/admin/analytics` dashboard. Without it, the auth route returns 401 for any password.

### Third-party Integrations

```
BRANDFETCH_API_KEY=<key_from_brandfetch_io>
PRINTIFY_API_KEY=<key_from_printify_com>
SHOPIFY_ACCESS_TOKEN=<shpat_...>
SHOPIFY_SHOP_NAME=<your-shop.myshopify.com>
```

---

## Verification Steps

After setting the vars in Vercel and triggering a redeploy:

1. Hit `GET https://branded-fit.vercel.app/api/health` — all keys should show `true`
2. Visit `https://branded-fit.vercel.app/admin` — login form should accept `ADMIN_PASSWORD`
3. Submit a domain in the Command Console — pipeline should run end-to-end

---

## Impact of Missing Vars

| Feature | Impact |
|---|---|
| All Supabase reads/writes | Throws "Missing Supabase environment variables" |
| Brand extraction pipeline | Fails at brand_extracts upsert |
| Analytics dashboard | Returns 500 — no DB connection |
| Admin login | Returns 401 for all passwords (no `ADMIN_PASSWORD` to compare) |
| Printify mockup generation | Fails at API call |
| Shopify store creation | Fails at API call |
