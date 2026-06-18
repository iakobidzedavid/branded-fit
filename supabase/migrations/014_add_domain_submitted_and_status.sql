-- Add domain_submitted and status columns to analytics_events.
-- domain_submitted is the canonical field for the domain entered by the user
-- (the existing `domain` column is kept for backward compatibility).
-- status captures pipeline stage outcome (e.g. 'success', 'error', 'pending').

ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS domain_submitted TEXT,
  ADD COLUMN IF NOT EXISTS status           TEXT;

CREATE INDEX IF NOT EXISTS idx_analytics_events_domain_submitted
  ON analytics_events(domain_submitted);

CREATE INDEX IF NOT EXISTS idx_analytics_events_status
  ON analytics_events(status);
