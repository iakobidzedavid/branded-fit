# Shopify API Client & Store Provisioning Integration

**Date:** 2026-06-03  
**Status:** Complete  
**Version:** 1.0

## Overview

This document describes the Shopify Admin API client wrapper and store provisioning system implemented for the Branded Fit application. The system enables programmatic creation and configuration of Shopify stores with unique subdomains, store names, currencies, and timezones.

## Architecture

### Components

1. **Shopify Client Library** (`src/lib/shopify.ts`)
   - OAuth token-based authentication
   - REST API wrapper using fetch
   - Store provisioning and configuration
   - Input validation and error handling

2. **API Route** (`src/app/api/shopify/route.ts`)
   - HTTP endpoint for store provisioning requests
   - Token validation
   - Database integration
   - Response handling

3. **Test Suite** (`src/lib/shopify.test.ts`)
   - Comprehensive testing of all functionality
   - Validation of error handling
   - Input validation tests

## Environment Variables

Required environment variables for Shopify integration:

```
SHOPIFY_ACCESS_TOKEN=<oauth-access-token>
SHOPIFY_SHOP_NAME=<shop-name>.myshopify.com
```

### Obtaining Credentials

1. **OAuth Access Token**
   - Create a custom app in Shopify Partner Dashboard
   - Generate access token with appropriate scopes
   - Scopes required:
     - `write_shop` - Modify store name
     - `write_settings` - Configure store settings
     - `read_shop_info` - Read store information

2. **Shop Name**
   - Found in Shopify Admin dashboard (Settings > General)
   - Format: `your-shop-name.myshopify.com`
   - For sandbox/test stores, typically includes "test" or similar

## API Reference

### Client Initialization

```typescript
import { createShopifyClient } from "@/lib/shopify";

const client = createShopifyClient(
  process.env.SHOPIFY_ACCESS_TOKEN!,
  process.env.SHOPIFY_SHOP_NAME!
);
```

### Store Provisioning

**Function:** `provisionStore(config: ShopifyStoreConfig)`

**Parameters:**
```typescript
interface ShopifyStoreConfig {
  name: string;              // Store name (display name)
  currency: string;          // ISO 4217 currency code (e.g., "USD", "EUR")
  timezone: string;          // IANA timezone (e.g., "America/New_York")
  subdomain: string;         // Unique subdomain for store URL
}
```

**Returns:**
```typescript
interface ShopifyStoreProvisioningResult {
  storeId: string;           // Unique store ID from Shopify
  storeName: string;         // Configured store name
  storeUrl: string;          // Full store URL (https://{subdomain}.myshopify.com)
  accessToken: string;       // OAuth access token for API calls
  currency: string;          // Configured currency
  timezone: string;          // Configured timezone
}
```

**Example:**
```typescript
const result = await client.provisionStore({
  name: "Acme Brand Store",
  currency: "USD",
  timezone: "America/Chicago",
  subdomain: "acme-brand-5234"
});

console.log(`Store created: ${result.storeUrl}`);
```

### Get Store Info

**Function:** `getStoreInfo(accessToken: string)`

**Returns:**
```typescript
{
  id: string;                // Shopify store ID
  name: string;              // Store name
  email: string;             // Store owner email
  myshopifyDomain: string;   // Myshopify domain
}
```

### Update Store Settings

**Function:** `updateStoreSettings(accessToken: string, config: Partial<ShopifyStoreConfig>)`

Updates one or more store settings (name, currency, timezone).

### Validate Token

**Function:** `validateShopifyToken(accessToken: string, shopName: string)`

Returns: `boolean` - true if token is valid, false otherwise

### Generate Unique Subdomain

**Function:** `generateUniqueSubdomain(baseName: string)`

Generates a unique subdomain from a base name by:
1. Converting to lowercase
2. Removing invalid characters (keeping only alphanumeric and hyphens)
3. Appending 4-digit timestamp suffix

**Example:**
```typescript
generateUniqueSubdomain("My Brand") // "my-brand-5234"
```

## HTTP API Endpoint

### POST /api/shopify

Provisions a new Shopify store.

**Request:**
```json
{
  "domain": "example.com",
  "storeName": "Example Brand Store",
  "currency": "USD",
  "timezone": "America/New_York",
  "products": []
}
```

**Success Response (201):**
```json
{
  "success": true,
  "storeId": "gid://shopify/Shop/123456789",
  "storeName": "Example Brand Store",
  "storeUrl": "https://example-brand-5234.myshopify.com",
  "accessToken": "shpat_...",
  "currency": "USD",
  "timezone": "America/New_York",
  "subdomain": "example-brand-5234",
  "database": {
    "id": "uuid",
    "domain": "example.com",
    "shopify_store_id": "...",
    "shopify_store_url": "...",
    "shopify_api_token": "...",
    "status": "provisioned",
    "created_at": "2026-06-03T..."
  }
}
```

**Error Response (4xx/5xx):**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Validation Rules

### Subdomain Format
- Length: 3-32 characters
- Characters: Alphanumeric + hyphens only
- Cannot start or end with hyphen
- Examples: `my-store`, `brand123`, `test-co-5234`

### Currency
- Must be valid ISO 4217 code
- Three uppercase letters (e.g., USD, EUR, GBP, CAD)

### Timezone
- Must be valid IANA timezone identifier
- Examples: `America/New_York`, `Europe/London`, `Asia/Tokyo`

## Error Handling

The client throws descriptive errors for:

1. **Invalid Subdomain Format**
   ```
   "Subdomain must be 3-32 characters and contain only alphanumeric characters and hyphens"
   ```

2. **Invalid Currency**
   ```
   "Currency must be a valid ISO 4217 code (e.g., USD, EUR)"
   ```

3. **Authentication Failures**
   ```
   "Invalid Shopify access token or shop name"
   ```

4. **API Request Failures**
   ```
   "Failed to fetch store info: 401 Unauthorized"
   ```

## Security Considerations

1. **Token Storage**
   - Access tokens are stored in environment variables only
   - Never commit tokens to version control
   - Use .env.local or deployment secrets for production

2. **Token Scopes**
   - Only request necessary scopes
   - Minimize privileged operations in the client
   - Rotate tokens regularly

3. **API Rate Limiting**
   - Shopify Admin API has rate limits (2 requests/second default)
   - Implement backoff strategies for production
   - Monitor API response headers for rate limit status

4. **HTTPS Only**
   - All API calls use HTTPS
   - No sensitive data in logs
   - Sanitize error messages in user-facing responses

## Testing

Run the comprehensive test suite:

```bash
# Tests subdomain generation, token validation, store provisioning
ts-node src/lib/shopify.test.ts
```

**Test Coverage:**
- Subdomain generation with various inputs
- Token validation against Shopify sandbox
- Client initialization
- Store info retrieval
- Store settings updates
- Store provisioning workflow
- Invalid input rejection
- Error handling

## Database Integration

Store metadata is automatically persisted to the `stores` table:

**Schema:**
```
stores
├── id (UUID)
├── domain (string)
├── shopify_store_id (string)
├── shopify_url (string)
├── shopify_api_token (string)
├── status (string: "draft" | "provisioned" | "active")
└── created_at (timestamp)
```

## Next Steps

1. **Product Upload**
   - Use Admin API to create products
   - Upload mockup images to product listings
   - Configure variants and pricing

2. **Fulfillment Setup**
   - Configure shipping policies
   - Set up payment gateways
   - Enable fulfillment channels

3. **Store Publishing**
   - Activate store for customer access
   - Configure domain settings
   - Enable SSL/TLS

## Example Workflow

```typescript
import { createShopifyClient, generateUniqueSubdomain } from "@/lib/shopify";

// 1. Initialize client
const client = createShopifyClient(
  process.env.SHOPIFY_ACCESS_TOKEN!,
  process.env.SHOPIFY_SHOP_NAME!
);

// 2. Generate unique subdomain
const subdomain = generateUniqueSubdomain("my-brand");

// 3. Provision store
const result = await client.provisionStore({
  name: "My Brand Store",
  currency: "USD",
  timezone: "America/New_York",
  subdomain,
});

// 4. Use store details
console.log(`Store ID: ${result.storeId}`);
console.log(`Store URL: ${result.storeUrl}`);

// 5. Continue with product upload, fulfillment setup, etc.
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Shopify integration not configured" | Set SHOPIFY_ACCESS_TOKEN and SHOPIFY_SHOP_NAME env vars |
| "Invalid access token or shop name" | Verify token scopes and shop name format |
| "Subdomain must be 3-32 characters" | Use generateUniqueSubdomain() for consistent formatting |
| "Failed to fetch store info: 401" | Token may be expired or revoked - generate new token |
| Rate limit errors | Implement exponential backoff and retry logic |

## References

- [Shopify Admin API Documentation](https://shopify.dev/api/admin-rest)
- [OAuth Scopes](https://shopify.dev/api/admin-rest/2024-01#scope)
- [API Versioning](https://shopify.dev/api/admin-rest/2024-01)
- [ISO 4217 Currency Codes](https://en.wikipedia.org/wiki/ISO_4217)
- [IANA Timezone Database](https://www.iana.org/time-zones)
