-- pilot_requests — self-serve pilot intake form submissions
CREATE TABLE IF NOT EXISTS public.pilot_requests (
  id                    UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name                  TEXT        NOT NULL,
  email                 TEXT        NOT NULL,
  company               TEXT        NOT NULL,
  domain                TEXT,
  team_size             INTEGER,
  annual_swag_budget    INTEGER,
  swag_cycles_per_year  INTEGER     DEFAULT 4,
  current_approach      TEXT,
  roi_multiple          NUMERIC,
  roi_annual_value      INTEGER,
  source                TEXT        DEFAULT 'pilot-page',
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pilot_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_pilot_requests" ON public.pilot_requests;
CREATE POLICY "anon_insert_pilot_requests"
  ON public.pilot_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "service_select_pilot_requests" ON public.pilot_requests;
CREATE POLICY "service_select_pilot_requests"
  ON public.pilot_requests FOR SELECT
  TO service_role
  USING (true);
