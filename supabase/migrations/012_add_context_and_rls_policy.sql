-- Add context JSONB column — canonical event payload for the 8 core funnel events.
-- metadata and properties columns are kept for backward compatibility.
-- Also adds a SELECT RLS policy so authenticated clients see only their own events.

ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS context JSONB;

CREATE INDEX IF NOT EXISTS idx_analytics_events_context
  ON analytics_events USING gin(context);

-- SELECT: authenticated clients see only rows where user_id matches their auth UID.
-- Rows with NULL user_id (anonymous pipeline events) are not visible to client queries.
-- Service-role key used by all Next.js API routes bypasses RLS entirely.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'analytics_events'
      AND policyname = 'analytics_events_select_own'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "analytics_events_select_own"
        ON analytics_events
        FOR SELECT
        USING (user_id = auth.uid()::text)
    $policy$;
  END IF;
END $$;
