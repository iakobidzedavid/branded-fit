-- Add orchestration schema columns to stores table
-- These columns support the async orchestration workflow

ALTER TABLE IF EXISTS stores
ADD COLUMN IF NOT EXISTS store_id TEXT,
ADD COLUMN IF NOT EXISTS brand_data JSONB,
ADD COLUMN IF NOT EXISTS products_count INTEGER DEFAULT 0;

-- Create index on store_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_stores_store_id ON stores(store_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_stores_orchestration_status ON stores(status);

-- Ensure status column is properly indexed for polling queries
CREATE INDEX IF NOT EXISTS idx_stores_status_created ON stores(status, created_at);
