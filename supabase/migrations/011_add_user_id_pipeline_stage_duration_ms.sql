-- Add user_id, pipeline_stage, and duration_ms columns to analytics_events.
-- These complete the canonical schema for the /api/analytics POST endpoint.

ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS user_id        TEXT,
  ADD COLUMN IF NOT EXISTS pipeline_stage TEXT,
  ADD COLUMN IF NOT EXISTS duration_ms    INTEGER;

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id
  ON analytics_events(user_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_pipeline_stage
  ON analytics_events(pipeline_stage);
