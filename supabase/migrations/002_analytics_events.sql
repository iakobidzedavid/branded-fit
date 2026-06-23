-- analytics_events: funnel event tracking for the Try → storefront flow

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name   TEXT        NOT NULL,
  domain       TEXT,
  session_id   TEXT,
  properties   JSONB       DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_events_name_idx ON public.analytics_events (event_name);
CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON public.analytics_events (created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_analytics_events" ON public.analytics_events;
CREATE POLICY "anon_insert_analytics_events"
  ON public.analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_analytics_events" ON public.analytics_events;
CREATE POLICY "anon_select_analytics_events"
  ON public.analytics_events FOR SELECT
  TO anon, authenticated
  USING (true);

-- also fix waitlist_signups missing SELECT policy (needed for the GET /api/waitlist endpoint)
DROP POLICY IF EXISTS "anon_select_waitlist_signups" ON public.waitlist_signups;
CREATE POLICY "anon_select_waitlist_signups"
  ON public.waitlist_signups FOR SELECT
  TO anon, authenticated
  USING (true);
