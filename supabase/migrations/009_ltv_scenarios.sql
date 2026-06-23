-- LTV scenario snapshots — DE Step 17 gate evidence table
CREATE TABLE IF NOT EXISTS ltv_scenarios (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  tier           text        NOT NULL DEFAULT 'core',
  scenario_label text,
  annual_price   numeric     NOT NULL,
  annual_rebate  numeric     NOT NULL DEFAULT 0,
  churn_rate     numeric     NOT NULL,
  discount_rate  numeric     NOT NULL DEFAULT 0.10,
  coca           numeric     NOT NULL,
  ltv_5yr        numeric     NOT NULL,
  ltv_coca_ratio numeric     NOT NULL,
  gate_cleared   boolean     GENERATED ALWAYS AS (ltv_5yr >= 3 * coca) STORED,
  notes          text,
  email          text,
  created_at     timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE ltv_scenarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_ltv_scenarios" ON ltv_scenarios;
CREATE POLICY "anon_insert_ltv_scenarios" ON ltv_scenarios
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "service_all_ltv_scenarios" ON ltv_scenarios;
CREATE POLICY "service_all_ltv_scenarios" ON ltv_scenarios
  FOR ALL TO service_role USING (true) WITH CHECK (true);
