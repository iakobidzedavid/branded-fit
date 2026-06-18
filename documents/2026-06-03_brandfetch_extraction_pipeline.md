# Brandfetch Brand Extraction Pipeline

**Date:** 2026-06-03  
**Status:** Implemented (Sub-task 1)

## Overview

The Brandfetch Brand Extraction Pipeline provides a POST API endpoint that extracts brand assets (colors, logos, typography) from domain websites using the Brandfetch API and stores them in Supabase for later retrieval.

## API Endpoint

### POST `/api/v1/brand/extract`

Extracts brand assets for a given domain and stores them in the database.

**Request:**
```json
{
  "domain": "example.com"
}
```

**Response (Success - 200):**
```json
{
  "domain": "example.com",
  "colors": [
    { "hex": "#1a3a5c", "type": "primary" },
    { "hex": "#8fa3b8", "type": "secondary" },
    { "hex": "#0d1f33", "type": "accent" }
  ],
  "logos": [
    { "url": "https://example.com/logo.png", "type": "primary" },
    { "url": "https://example.com/logo-icon.png", "type": "icon" }
  ],
  "typography": {
    "primary": "Inter",
    "secondary": "Merriweather"
  },
  "extraction_confidence_pct": 95
}
```

**Response (Error - 400):**
```json
{
  "error": "Valid domain is required"
}
```

## Implementation Details

### Supabase Schema

The `brand_extracts` table stores extracted brand data:

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key, auto-generated |
| `domain` | TEXT | Unique constraint, normalized lowercase |
| `colors` | JSONB | Array of color objects with hex and type |
| `logos` | JSONB | Array of logo objects with URL and type |
| `typography` | JSONB | Object with primary and secondary fonts |
| `extracted_at` | TIMESTAMPTZ | When extraction occurred |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- `idx_brand_extracts_domain` - Fast lookups by domain
- `idx_brand_extracts_created_at` - Time-based queries

### Error Handling & Defaults

The pipeline gracefully handles missing or incomplete data:

**Default Colors** (neutral palette):
- `#1a1a1a` - Dark gray/black (primary)
- `#666666` - Medium gray (secondary)
- `#999999` - Light gray (tertiary)

**Default Logo**:
- DiceBear initials avatar: `https://api.dicebear.com/7.x/initials/svg?seed={domain}`

**Confidence Scoring**:
- Base: 50% for successful API response
- +15% if colors found
- +15% if logo(s) found
- +20% if typography info found
- 0% if API fails (falls back to defaults)

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role API key for server-side operations
- `BRANDFETCH_API_KEY` - Brandfetch API key

## Usage Example

```typescript
// Extract brand assets for a domain
const response = await fetch('/api/v1/brand/extract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ domain: 'example.com' })
});

const result = await response.json();
console.log(result.colors);      // Brand colors
console.log(result.logos);       // Brand logos
console.log(result.typography);  // Font information
console.log(result.extraction_confidence_pct); // Confidence level
```

## Database Migration

Run the migration to create the `brand_extracts` table:

```bash
# Using Supabase CLI
supabase migration up

# Or apply the SQL directly in Supabase Dashboard
# File: supabase/migrations/001_create_brand_extracts_table.sql
```

## Future Enhancements

- Webhook support for async extraction jobs
- Batch extraction endpoint for multiple domains
- Cache invalidation strategy for refreshing old extractions
- Brand asset validation and quality scoring
- Integration with Shopify API for store branding
