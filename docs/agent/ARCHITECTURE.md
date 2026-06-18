# Architecture Documentation

**Project:** Branded Fit MVBP  
**Last Updated:** 2026-06-08  
**Status:** Active Development

---

## 1. Overview

Branded Fit is a minimum viable brand positioning (MVBP) application that enables rapid product validation through a three-stage workflow:

1. **Product Validation** - Users input corporate domain → extract brand identity via Brandfetch
2. **Analytics Instrumentation** - Track user behavior and pipeline progression via event emission
3. **Discovery Synthesis** - Aggregate learnings from customer outreach to inform go/pivot/no-go decisions

The system integrates three external APIs (Brandfetch, Printify, Shopify) to generate branded storefronts and captures detailed analytics on user interactions and conversion funnel performance.

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React, TypeScript |
| **Backend** | Next.js API routes, Node.js |
| **Database** | Supabase (PostgreSQL) |
| **Integrations** | Brandfetch API, Printify API, Shopify API |
| **Analytics** | Custom event emission system → Supabase |
| **Deployment** | Vercel |

---

## 3. Core Workflows

### 3.1 Product Validation Flow

```
User Domain Input (Command Console /)
    ↓
[domain_submission event]
    ↓
Brandfetch API Extract (brand identity, colors, fonts)
    ↓
[brand_extraction_started event]
    ↓
Printify API → Shopify Create Store
    ↓
[store_creation_complete event]
    ↓
Storefront Preview (/store/:storeId)
    ↓
[product_view, cart_add events]
```

### 3.2 Analytics Instrumentation Flow

```
User Action (form submit, product view, cart interaction)
    ↓
logEvent() function emits event
    ↓
POST /api/analytics
    ↓
Supabase Insert (analytics_events table)
    ↓
Dashboard Query & Render
```

### 3.3 Discovery Synthesis

- **Status:** BLOCKED - Awaiting ≥3 warm-outreach responses
- **Expected Deliverable:** Formal go/pivot/no-go decision document with explicit recommendation
- **Input Data:** Event analytics + customer feedback from outreach

---

## 4. Database Schema

### Primary Tables

#### `analytics_events`
```sql
id (uuid, pk)
user_id (uuid, fk → customers.id)
event_name (text) -- domain_submission, brand_extraction_started, etc.
event_data (jsonb) -- flexible event properties
pipeline_stage (text) -- validation, instrumentation, synthesis
duration_ms (integer) -- time spent in stage
created_at (timestamp)
```

#### `customers`
```sql
id (uuid, pk)
email (text, unique)
created_at (timestamp)
```

#### `stores`
```sql
id (uuid, pk)
customer_id (uuid, fk)
store_id (text) -- Shopify store identifier
domain (text) -- input domain
brand_data (jsonb) -- Brandfetch output
created_at (timestamp)
```

---

## 5. API Endpoints

### Command Console (/)

**POST /api/analytics**
- Accepts event emission from frontend
- Required fields: `user_id`, `event_name`, `pipeline_stage`
- Optional: `event_data` (jsonb), `duration_ms`
- Response: `{ success: true, event_id: uuid }`

**GET/POST /api/brand/:domain**
- Calls Brandfetch API to extract brand identity
- Returns: `{ colors: [...], fonts: [...], logo: url, ... }`

**POST /api/store/create**
- Calls Printify → Shopify to create storefront
- Input: Brandfetch data + domain
- Returns: `{ store_id: string, preview_url: string }`

### Storefront Preview (/store/:storeId)

- Renders branded product catalog from Shopify
- Emits `product_view` and `cart_add` events on interaction
- All events include `user_id` via `getOrCreateCustomerId()` helper

---

## 6. Event Schema (V3)

All events include:
```json
{
  "user_id": "uuid",
  "event_name": "string",
  "event_data": { /* flexible */ },
  "pipeline_stage": "validation|instrumentation|synthesis",
  "duration_ms": "integer (optional)",
  "created_at": "timestamp (auto)"
}
```

### Event Names by Stage

**Validation Stage:**
- `domain_submission` - User submits corporate domain
- `brand_extraction_started` - Brandfetch API call initiated
- `store_creation_complete` - Shopify store created

**Instrumentation Stage:**
- `product_view` - User views product detail
- `cart_add` - User adds product to cart
- `checkout_initiated` - User begins checkout

**Synthesis Stage:**
- `outreach_response_received` - Customer feedback captured
- `decision_recorded` - Go/pivot/no-go decision logged

---

## 7. User Journey

```
1. Land on Command Console (/)
   ↓ [domain_submission]
2. Input corporate domain (e.g., acme.com)
   ↓ [brand_extraction_started]
3. System extracts brand via Brandfetch
   ↓ [store_creation_complete]
4. Shopify storefront created and linked
   ↓
5. Redirect to Storefront Preview (/store/:storeId)
   ↓ [product_view, cart_add]
6. User browses branded products
   ↓
7. Analytics aggregated in dashboard
   ↓
8. (BLOCKED) Conduct outreach, receive feedback
   ↓
9. Synthesize → formal decision document
```

---

## 8. Recent Changes (Session