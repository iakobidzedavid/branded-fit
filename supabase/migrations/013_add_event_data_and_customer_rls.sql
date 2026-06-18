-- Add event_data JSONB column — canonical payload for emitEvent() server helper.
-- The existing context/properties/metadata columns are preserved for backward compat.

ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS event_data JSONB;

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_data
  ON analytics_events USING gin(event_data);

-- SELECT policy: authenticated users see rows where customer_id matches auth.uid(),
-- or rows with NULL customer_id (anonymous pipeline events).
-- The service-role key used by Next.js API routes bypasses RLS entirely.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'analytics_events'
      AND policyname = 'analytics_events_select_by_customer'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "analytics_events_select_by_customer"
        ON analytics_events
        FOR SELECT
        USING (customer_id = auth.uid()::text OR customer_id IS NULL)
    $policy$;
  END IF;
END $$;
