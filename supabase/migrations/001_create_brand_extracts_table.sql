-- Create brand_extracts table for storing extracted brand assets
CREATE TABLE IF NOT EXISTS brand_extracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,
  colors JSONB,
  logos JSONB,
  typography JSONB,
  extracted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on domain for fast lookups
CREATE INDEX IF NOT EXISTS idx_brand_extracts_domain ON brand_extracts(domain);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_brand_extracts_created_at ON brand_extracts(created_at DESC);
