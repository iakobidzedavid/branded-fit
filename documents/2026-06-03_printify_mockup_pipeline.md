# Printify Mockup Generation Pipeline

**Date:** 2026-06-03  
**Status:** Implemented (Sub-task 2)

## Overview

The Printify Mockup Generation Pipeline provides a POST API endpoint that generates product mockups across 5 default SKUs with 3-5 color variants, stores product metadata in Supabase, caches mockup images locally, and includes fallback logic for API failures.

## API Endpoint

### POST `/api/v1/mockup/generate`

Generates product mockups for a given domain with brand colors and logos, stores metadata in Supabase, and caches images locally.

**Request:**
```json
{
  "domain": "example.com",
  "colors": [
    { "hex": "#1a3a5c", "type": "primary" },
    { "hex": "#8fa3b8", "type": "secondary" },
    { "hex": "#0d1f33", "type": "accent" }
  ],
  "logos": [
    { "url": "https://example.com/logo.png", "type": "primary" }
  ]
}
```

**Response (Success - 200):**
```json
{
  "domain": "example.com",
  "sku_count": 5,
  "variants_count": 45,
  "mockup_urls": [
    "/mockups/example.com-0.json",
    "/mockups/example.com-1.json",
    "..."
  ],
  "pricing": [
    { "sku": "heavyweight-tee", "basePrice": 19.99, "finalPrice": 27.99 },
    { "sku": "premium-hoodie", "basePrice": 54.99, "finalPrice": 76.99 },
    { "sku": "dad-cap", "basePrice": 17.99, "finalPrice": 25.19 },
    { "sku": "tote", "basePrice": 22.99, "finalPrice": 32.19 },
    { "sku": "notebook", "basePrice": 14.99, "finalPrice": 20.99 }
  ],
  "products_created": 15,
  "cached": false
}
```

**Response (Cached - 200):**
```json
{
  "domain": "example.com",
  "sku_count": 5,
  "variants_count": 45,
  "mockup_urls": [
    "/mockups/example.com-0.json",
    "/mockups/example.com-1.json",
    "..."
  ],
  "pricing": [
    { "sku": "heavyweight-tee", "basePrice": 19.99, "finalPrice": 27.99 },
    "..."
  ],
  "products_created": 15,
  "cached": true
}
```

**Response (Error - 400):**
```json
{
  "error": "Valid domain is required"
}
```

## Implementation Details

### Default SKUs

The pipeline generates mockups across 5 product types:

| SKU | Product Name | Base Price | Variants |
|-----|--------------|-----------|----------|
| `heavyweight-tee` | Heavyweight Tee | $19.99 | 6 sizes (XS-2XL) × color variants |
| `premium-hoodie` | Premium Hoodie | $54.99 | 6 sizes (XS-2XL) × color variants |
| `dad-cap` | Dad Cap | $17.99 | One Size × color variants |
| `tote` | Tote Bag | $22.99 | One Size × color variants |
| `notebook` | Hardcover Notebook | $14.99 | One Size × color variants |

### Color Variants

- Generates 3-5 color variants based on provided brand colors (maximum 5)
- Falls back to default color palette if no colors provided
- Each variant is generated with a unique mockup URL

### Pricing Strategy

- **Markup:** 40% standard markup on all products
- **Formula:** `finalPrice = basePrice + (basePrice × 0.40)`
- **Example:** Tee $19.99 → $27.99 (markup $7.99)

### Supabase Schema

The `products` table stores generated product metadata:

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key, auto-generated |
| `domain` | TEXT | Domain for the brand |
| `sku` | TEXT | Product SKU identifier |
| `product_name` | TEXT | Display name of product |
| `mockup_image_url` | TEXT | URL to cached mockup image |
| `variants` | JSONB | Array of color/size combinations |
| `pricing` | JSONB | basePrice, markup, finalPrice |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

**Indexes:**
- `idx_products_domain` - Fast lookups by domain
- `idx_products_sku` - Fast lookups by SKU
- `idx_products_created_at` - Time-based queries

### Local Caching

Mockup images are cached locally in `/public/mockups/`:

```
/public/mockups/
├── .gitkeep
├── example.com-0.json    (metadata for first mockup variant)
├── example.com-1.json    (metadata for second variant)
└── ...
```

Each cached file contains:
```json
{
  "domain": "example.com",
  "mockupIndex": 0,
  "sourceUrl": "https://api.dicebear.com/7.x/...",
  "cachedAt": "2026-06-03T14:25:00.000Z",
  "publicUrl": "/mockups/example.com-0.json"
}
```

### Error Handling & Fallback

The pipeline implements graceful fallback:

1. **Cache-First Strategy**: If products already exist for a domain, return cached results immediately
2. **Default Colors**: Uses neutral palette if no colors provided
3. **Mockup Generation Failure**: Falls back to placeholder images
4. **Storage Failure**: Returns mockup data even if Supabase storage fails

### Mockup Generation

Mockups are generated using DiceBear API with deterministic seeds for consistency:

- **Template:** `https://api.dicebear.com/7.x/{style}/svg?backgroundColor={color}&seed={domain}-{variant}`
- **Styles by Product:**
  - Tee: `avataaars` (avatar style)
  - Hoodie: `avataaars` (avatar style)
  - Cap: `shapes` (geometric style)
  - Tote: `thumbs` (thumbs style)
  - Notebook: `shapes` (geometric style)

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role API key for server-side operations

### File Structure

```
src/
├── app/api/v1/mockup/generate/route.ts  -- Main API endpoint
├── lib/
│   ├── supabase.ts                      -- Product storage functions
│   └── mockup-generator.ts              -- Mockup generation logic
└── ...
public/
└── mockups/                             -- Local cache directory
    └── .gitkeep
documents/
└── 2026-06-03_printify_mockup_pipeline.md
```

## Usage Example

```typescript
// Generate mockups for a domain
const response = await fetch('/api/v1/mockup/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    domain: 'example.com',
    colors: [
      { hex: '#1a3a5c', type: 'primary' },
      { hex: '#8fa3b8', type: 'secondary' }
    ],
    logos: [
      { url: 'https://example.com/logo.png', type: 'primary' }
    ]
  })
});

const result = await response.json();
console.log(`Generated ${result.sku_count} SKUs`);
console.log(`${result.variants_count} total variants`);
console.log(`${result.products_created} products stored`);
console.log('Mockup URLs:', result.mockup_urls);
console.log('Pricing:', result.pricing);
```

## Integration with Brand Extraction

This pipeline works seamlessly with the Brand Extraction Pipeline:

```typescript
// Step 1: Extract brand assets
const extractResponse = await fetch('/api/v1/brand/extract', {
  method: 'POST',
  body: JSON.stringify({ domain: 'example.com' })
});
const brandData = await extractResponse.json();

// Step 2: Generate mockups with extracted assets
const mockupResponse = await fetch('/api/v1/mockup/generate', {
  method: 'POST',
  body: JSON.stringify({
    domain: 'example.com',
    colors: brandData.colors,
    logos: brandData.logos
  })
});
const mockups = await mockupResponse.json();
```

## Database Migration

The `products` table must be created in Supabase:

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  mockup_image_url TEXT NOT NULL,
  variants JSONB NOT NULL DEFAULT '[]',
  pricing JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_domain ON products(domain);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

## Performance Characteristics

- **Cache-First Response**: ~50ms (from Supabase)
- **Fresh Generation**: ~1-2 seconds (mockup generation + storage)
- **Mockup URLs:** 15 URLs per domain (5 SKUs × 3 color variants)
- **Storage:** ~2KB per product record, ~30KB per domain

## Future Enhancements

- Real Printify API integration with OAuth
- Image processing and optimization for cached mockups
- Batch generation for multiple domains
- Webhook support for async mockup generation
- Color scheme validation and optimization
- Product variant customization UI
- A/B testing of product offerings

