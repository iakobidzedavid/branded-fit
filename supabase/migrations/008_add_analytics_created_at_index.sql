-- Add index on created_at for the analytics query in /api/admin/analytics
-- Migration 006 dropped and recreated the table without this index.
-- The admin analytics route filters events by created_at (7-day window),
-- so this index is required for fast query response times.
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
  ON analytics_events(created_at DESC);
