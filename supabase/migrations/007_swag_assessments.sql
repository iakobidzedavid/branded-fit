-- Swag Program Health Check assessments
CREATE TABLE IF NOT EXISTS swag_assessments (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  current_approach        text,
  team_size               integer,
  annual_budget           integer,
  cycles_per_year         integer,
  biggest_pain            text,
  swag_score              integer,
  estimated_waste_dollars integer,
  estimated_time_savings  integer,
  roi_multiple            numeric(6, 2),
  email                   text,
  source                  text DEFAULT 'assessment-page',
  created_at              timestamptz DEFAULT now()
);

ALTER TABLE swag_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_swag_assessments" ON swag_assessments;
CREATE POLICY "service_role_all_swag_assessments"
  ON swag_assessments FOR ALL
  USING (true)
  WITH CHECK (true);
