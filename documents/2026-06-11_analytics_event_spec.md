# Branded Fit — Analytics Event Specification
**Date:** 2026-06-11  
**Endpoint:** `POST /api/analytics`  
**Storage:** Supabase `analytics_events` table

---

## Overview

All events are emitted fire-and-forget (async, non-blocking) from client components.  
Session identity uses `bf_customer_id` in localStorage (`sess_<timestamp36>_<random6>`).  
Events are persisted to `analytics_events` via `/api/analytics` POST.

---

## Payload Schema

Every event sends a JSON body with the following fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `event_name` | string | ✓ | Event identifier (see Event Catalogue below) |
| `user_id` | string | | Session/anonymous ID from localStorage |
| `domain` | string | | Company domain that was submitted |
| `pipeline_stage` | string | | Which pipeline emitted this event |
| `duration_ms` | number | | Elapsed ms since pipeline start (for timing events) |
| `error_message` | string | | Human-readable error if applicable |
| `timestamp` | string | | ISO 8601 timestamp |
| `context` | object | | Arbitrary extra fields (score, sku, etc.) |

---

## Event Catalogue

### Conversion Funnel Events (Command Console)

#### `domain_submitted`
Fired immediately when the user submits a valid domain in the Command Console.

```json
{
  "event_name": "domain_submitted",
  "domain": "ramp.com",
  "user_id": "sess_abc123_xyz"
}
```

#### `brand_extraction_started`
Fired at t=0 when Pipeline 01 (Brand Intelligence) begins.

```json
{
  "event_name": "brand_extraction_started",
  "domain": "ramp.com",
  "user_id": "sess_abc123_xyz",
  "pipeline_stage": "brand_intelligence"
}
```

#### `brand_extraction_completed`
Fired when Pipeline 01 finishes extracting brand assets (~2.5s).

```json
{
  "event_name": "brand_extraction_completed",
  "domain": "ramp.com",
  "user_id": "sess_abc123_xyz",
  "pipeline_stage": "brand_intelligence",
  "duration_ms": 2487
}
```

#### `mockup_generation_started`
Fired when Pipeline 02 (Mockup Generation) begins (~2.5s mark).

```json
{
  "event_name": "mockup_generation_started",
  "domain": "ramp.com",
  "user_id": "sess_abc123_xyz",
  "pipeline_stage": "mockup_generation"
}
```

#### `mockup_generation_completed`
Fired when Pipeline 02 finishes generating product mockups (~5.5s).

```json
{
  "event_name": "mockup_generation_completed",
  "domain": "ramp.com",
  "user_id": "sess_abc123_xyz",
  "pipeline_stage": "mockup_generation",
  "duration_ms": 5512
}
```

#### `storefront_generation_started`
Fired when Pipeline 03 (Shopify Provisioning) begins (~5.5s mark).

```json
{
  "event_name": "storefront_generation_started",
  "domain": "ramp.com",
  "user_id": "sess_abc123_xyz",
  "pipeline_stage": "shopify_provisioning"
}
```

#### `storefront_generation_completed`
Fired when Pipeline 03 finishes and the storefront is live (~9s).

```json
{
  "event_name": "storefront_generation_completed",
  "domain": "ramp.com",
  "user_id": "sess_abc123_xyz",
  "pipeline_stage": "shopify_provisioning",
  "duration_ms": 9001
}
```

---

### Storefront Preview Events (Store page)

#### `storefront_view`
Fired once on first load of the Storefront Preview page.

```json
{
  "event_name": "storefront_view",
  "domain": "acme.com",
  "user_id": "sess_abc123_xyz",
  "context": { "store_id": "demo", "status": "draft" }
}
```

#### `brand_fidelity_feedback`
Fired when a user submits a 1–5 brand match rating on the Storefront Preview.

```json
{
  "event_name": "brand_fidelity_feedback",
  "domain": "acme.com",
  "user_id": "sess_abc123_xyz",
  "context": { "score": 4, "max_score": 5 }
}
```

#### `product_view`
Fired when a user clicks on a product card.

```json
{
  "event_name": "product_view",
  "domain": "acme.com",
  "user_id": "sess_abc123_xyz",
  "pipeline_stage": "Stage 5 · Engagement",
  "context": { "sku": "BF-TEE-001", "product_name": "Premium Tee", "price": 32.99 }
}
```

#### `cart_add`
Fired when a user clicks "Add to Cart" on a product.

```json
{
  "event_name": "cart_add",
  "domain": "acme.com",
  "user_id": "sess_abc123_xyz",
  "pipeline_stage": "Stage 5 · Engagement",
  "context": { "sku": "BF-TEE-001", "product_name": "Premium Tee", "price": 32.99 }
}
```

#### `checkout_start`
Fired when a user clicks the Checkout button with items in cart.

```json
{
  "event_name": "checkout_start",
  "domain": "acme.com",
  "user_id": "sess_abc123_xyz",
  "pipeline_stage": "Stage 5 · Engagement",
  "context": { "cart_items": 2, "cart_total": 61.98 }
}
```

#### `request_quote`
Fired when a user clicks "Request Quote" on the storefront.

```json
{
  "event_name": "request_quote",
  "domain": "acme.com",
  "user_id": "sess_abc123_xyz",
  "context": { "store_id": "demo", "shopify_url": "https://acme-branded.myshopify.com" }
}
```

#### `storefront_published`
Fired when Publish Store succeeds.

```json
{
  "event_name": "storefront_published",
  "domain": "acme.com",
  "user_id": "sess_abc123_xyz",
  "pipeline_stage": "Stage 5 · Publish",
  "context": { "store_id": "demo", "shopify_url": "https://acme-branded.myshopify.com" }
}
```

---

## Funnel Definition (for `/api/analytics/events` dashboard)

| Step | Event Name | Dashboard Label |
|---|---|---|
| 1 | `domain_submitted` | Domain Submitted |
| 2 | `brand_extraction_completed` | Brand Extracted |
| 3 | `mockup_generation_completed` | Mockup Generated |
| 4 | `storefront_generation_completed` | Storefront Ready |
| 5 | `product_view` | Product Viewed |

End-to-end conversion = `storefront_generation_completed` / `domain_submitted`.

---

## Implementation Notes

- All events are **fire-and-forget** (`fetch` without `await` in the UI path).
- `trackEvent()` in `src/lib/analytics.ts` wraps the POST with a try/catch so network failures are swallowed silently.
- The `/api/analytics` endpoint returns HTTP 200 even on DB failures to prevent UI breakage.
- `user_id` / session ID is persisted in `localStorage` under key `bf_customer_id`.
