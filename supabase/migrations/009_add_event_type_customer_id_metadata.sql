-- Add event_type, customer_id, and metadata columns to analytics_events.
-- These are additive — existing event_name rows are preserved for backward
-- compatibility with the admin analytics route that queries by event_name.

ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS event_type   TEXT,
  ADD COLUMN IF NOT EXISTS customer_id  TEXT,
  ADD COLUMN IF NOT EXISTS metadata     JSONB;

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type
  ON analytics_events(event_type);

CREATE INDEX IF NOT EXISTS idx_analytics_events_customer_id
  ON analytics_events(customer_id);

-- Enable RLS. The API routes use the service_role key which bypasses RLS,
-- so this primarily prevents direct public access to event data.
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow any caller to insert events (writes come through the Next.js API layer).
-- No SELECT / UPDATE / DELETE policy for anon — data is read-only via service_role.
CREATE POLICY "analytics_events_insert"
  ON analytics_events
  FOR INSERT
  WITH CHECK (true);
