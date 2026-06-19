-- Recreate analytics_events with the canonical schema:
-- id, event_name, domain, session_id (text), timestamp, error_message, created_at
DROP TABLE IF EXISTS analytics_events;

CREATE TABLE analytics_events (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name    TEXT        NOT NULL,
  domain        TEXT,
  session_id    TEXT,
  timestamp     TIMESTAMPTZ,
  error_message TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_timestamp  ON analytics_events(timestamp DESC);
