-- Add fidelity_score, product_count, storefront_url to analytics_events
-- Required for pipeline funnel analysis and A/B testing metrics

ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS fidelity_score  NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS product_count   INTEGER,
  ADD COLUMN IF NOT EXISTS storefront_url  TEXT;
