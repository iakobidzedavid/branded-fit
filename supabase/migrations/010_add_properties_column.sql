-- Add properties JSONB column to analytics_events.
-- This is the canonical payload field for POST /api/analytics.
-- The existing metadata column is kept for backward compatibility with
-- older consumers (admin analytics route, /api/analytics/events route).
ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS properties JSONB;

CREATE INDEX IF NOT EXISTS idx_analytics_events_properties
  ON analytics_events USING gin(properties);
