-- Add shopify_store_id, shopify_api_token, and status columns to stores table
-- These columns support Shopify integration for the storefront

ALTER TABLE IF EXISTS stores
ADD COLUMN IF NOT EXISTS shopify_store_id TEXT,
ADD COLUMN IF NOT EXISTS shopify_api_token TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

-- Create index on status for filtering by store status
CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status);

-- Create index on shopify_store_id for lookups
CREATE INDEX IF NOT EXISTS idx_stores_shopify_store_id ON stores(shopify_store_id);
