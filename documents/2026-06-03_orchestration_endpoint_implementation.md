# Backend Orchestration Endpoint + Supabase Schema Implementation

## Summary
Implemented the core orchestration endpoints and database schema to support async brand-to-storefront pipeline. The system now accepts domain requests, validates them, creates provisioning records, and exposes status polling endpoints.

## Components Implemented

### 1. Supabase Schema Migration (004_add_orchestration_schema.sql)
Added columns to the `stores` table to support orchestration workflow:
- `store_id TEXT` — Unique identifier for the Shopify store
- `brand_data JSONB` — Extracted brand assets (colors, logos, typography)
- `products_count INTEGER` — Count of generated products

Created indexes for efficient querying:
- `idx_stores_store_id` — Fast lookup by store_id
- `idx_stores_orchestration_status` — Filter by status
- `idx_stores_status_created` — Composite index for polling queries

### 2. Supabase Helper Functions (src/lib/supabase.ts)
Added three new async functions:

#### `createProvisioningStore(domain: string)`
- Creates a new store record with status='provisioning'
- Returns `{ storeId: string, status: string }`
- Called immediately upon domain submission

#### `getStoreById(storeId: string)`
- Retrieves a store by UUID
- Returns full store record including `brand_data` and `products_count`
- Used by status polling endpoint

#### `updateStoreStatus(storeId: string, status: string, updates?)`
- Updates store status and optional brand data/product count
- Supports partial updates for pipeline progress

### 3. POST /api/orchestrate Endpoint
**Route:** `src/app/api/orchestrate/route.ts`

**Request:**
```json
{
  "domain": "example.com"
}
```

**Behavior:**
1. Validates domain format using regex pattern for RFC 1035 compliance
2. Checks domain has corporate TLD (.com, .io, .co, .org, .net, .dev, .app, .ai, .tech, .inc, .company)
3. Creates store record in Supabase with `status='provisioning'`
4. Returns immediately with storeId

**Response (201 Created):**
```json
{
  "storeId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "provisioning"
}
```

**Error Responses:**
- 400: Invalid/missing domain, unsupported TLD
- 500: Database creation failed

### 4. GET /api/orchestrate/:storeId/status Endpoint
**Route:** `src/app/api/orchestrate/[storeId]/status/route.ts`

**Request:**
```
GET /api/orchestrate/550e8400-e29b-41d4-a716-446655440000/status
```

**Response (200 OK):**
```json
{
  "storeId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "provisioning",
  "progress": {
    "extracting_brand": 0,
    "generating_mockups": 0,
    "provisioning_shopify": 0,
    "completed": 0
  },
  "brandData": null,
  "productCount": 0,
  "createdAt": "2026-06-03T15:58:00.000Z"
}
```

**Status Values:**
- `provisioning` — Store created, awaiting pipeline execution
- `in_progress` — Orchestration running (to be set by async workers)
- `completed` — All pipelines succeeded
- `failed` — Pipeline error occurred

**Error Responses:**
- 400: Missing storeId parameter
- 404: Store not found
- 500: Database query failed

## Design Decisions

### Async by Default
The POST endpoint returns immediately with a storeId, enabling client-side polling via the status endpoint. This prevents long-lived requests and allows parallel processing of multiple domains.

### Domain Validation
Integrated validation logic from existing `/api/validate-domain` endpoint:
- RFC 1035 format regex prevents invalid TLDs (e.g., "localhost", "test")
- Corporate TLD whitelist restricts to professional domains
- Prevents typos and ensures valid DNS zones

### Mock Progress Responses
The status endpoint currently returns mock progress values (0, 25, 50, 75, 100%) based on store status. These will be replaced with actual pipeline progress tracking when Brandfetch/Printify/Shopify endpoints are wired.

### No External Calls Yet
The POST endpoint does NOT call Brandfetch, Printify, or Shopify APIs—those calls will be triggered asynchronously by a separate worker (to be implemented). This keeps the response fast and decouples request handling from long-running operations.

## Database Schema (stores table)

```sql
stores (
  id UUID PRIMARY KEY,
  domain TEXT UNIQUE NOT NULL,
  store_id TEXT,
  shopify_url TEXT,
  brand_data JSONB,  -- NEW
  products_count INTEGER DEFAULT 0,  -- NEW
  status TEXT DEFAULT 'provisioning',  -- for orchestration
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
)
```

## Build Verification
✅ TypeScript compilation: No errors
✅ Next.js build: Success (24/24 pages generated)
✅ Routes registered: `/api/orchestrate`, `/api/orchestrate/[storeId]/status`

## Next Steps
1. **Implement async workers** — Background jobs to call Brandfetch → Printify → Shopify pipelines
2. **Update status tracking** — Set progress and status fields as each pipeline completes
3. **Add mock responses** — Placeholder data for Brandfetch/Printify/Shopify until real APIs are ready
4. **Client integration** — Wire frontend domain input form to POST /api/orchestrate, poll status endpoint
