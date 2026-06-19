-- Create stores table for managing brand storefronts
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,
  brand_name TEXT NOT NULL,
  colors JSONB,
  logo_url TEXT,
  mockup_images JSONB,
  shopify_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Create index on domain for fast lookups
CREATE INDEX IF NOT EXISTS idx_stores_domain ON stores(domain);

-- Create products table for storing generated mockup products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  mockup_image_url TEXT,
  variants JSONB,
  pricing JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on domain for fast lookups
CREATE INDEX IF NOT EXISTS idx_products_domain ON products(domain);

-- Create index on domain+sku for uniqueness checks
CREATE INDEX IF NOT EXISTS idx_products_domain_sku ON products(domain, sku);

-- Create storefronts table for published stores
CREATE TABLE IF NOT EXISTS storefronts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,
  shopify_store_id TEXT NOT NULL,
  storefront_url TEXT NOT NULL,
  product_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on domain for fast lookups
CREATE INDEX IF NOT EXISTS idx_storefronts_domain ON storefronts(domain);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_storefronts_status ON storefronts(status);
