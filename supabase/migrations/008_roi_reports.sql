-- roi_reports — shareable ROI report cards generated at /roi-report
CREATE TABLE IF NOT EXISTS public.roi_reports (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  domain           TEXT        NOT NULL,
  company_name     TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  name             TEXT,
  team_size        INTEGER,
  annual_budget    NUMERIC,
  cycles_per_year  INTEGER     NOT NULL DEFAULT 4,
  hours_per_cycle  INTEGER     DEFAULT 11,
  roi_multiple     NUMERIC,
  roi_annual_value NUMERIC,
  time_savings     NUMERIC,
  waste_savings    NUMERIC,
  palette_index    INTEGER     DEFAULT 0,
  source           TEXT        DEFAULT 'roi-report',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.roi_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_roi_reports" ON public.roi_reports;
CREATE POLICY "anon_insert_roi_reports"
  ON public.roi_reports FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_roi_reports" ON public.roi_reports;
CREATE POLICY "anon_select_roi_reports"
  ON public.roi_reports FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "service_select_roi_reports" ON public.roi_reports;
CREATE POLICY "service_select_roi_reports"
  ON public.roi_reports FOR SELECT
  TO service_role
  USING (true);
