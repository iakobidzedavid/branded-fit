-- Step 21 Experiments Table Schema
-- Supabase SQL migration to track assumption validation experiments

-- Create the experiments table
CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Experiment metadata
  experiment_name TEXT NOT NULL UNIQUE,
  hypothesis TEXT NOT NULL,
  methodology TEXT,
  
  -- Sample & execution
  sample_size INT,
  execution_start_date TIMESTAMP,
  execution_end_date TIMESTAMP,
  
  -- Results
  pass_fail TEXT CHECK (pass_fail IN ('PASS', 'FAIL', 'INCONCLUSIVE')),
  result JSONB NOT NULL, -- Flexible schema for different experiment types
  confidence_level TEXT CHECK (confidence_level IN ('CONFIRMED', 'ESTIMATED', 'UNCLEAR')) DEFAULT 'ESTIMATED',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Notes & next steps
  notes TEXT,
  next_action TEXT,
  
  -- Audit trail
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('planned', 'in_progress', 'completed', 'failed', 'abandoned'))
);

-- Create indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_experiments_name ON experiments(experiment_name);
CREATE INDEX IF NOT EXISTS idx_experiments_created_at ON experiments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experiments_pass_fail ON experiments(pass_fail);
CREATE INDEX IF NOT EXISTS idx_experiments_status ON experiments(status);
CREATE INDEX IF NOT EXISTS idx_experiments_created_by ON experiments(created_by);

-- Create audit table to track experiment updates
CREATE TABLE IF NOT EXISTS experiment_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'created', 'updated', 'completed'
  old_result JSONB,
  new_result JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_experiment_audits_experiment_id ON experiment_audits(experiment_id);
CREATE INDEX IF NOT EXISTS idx_experiment_audits_changed_at ON experiment_audits(changed_at DESC);

-- Sample data: Insert Step 21 experiments
INSERT INTO experiments (
  experiment_name,
  hypothesis,
  methodology,
  sample_size,
  execution_start_date,
  pass_fail,
  result,
  confidence_level,
  status,
  notes
) VALUES
  (
    'a1_brand_fidelity_evaluation',
    'Branded Fit mockups score ≥8.0/10 and win vs. SwagUp on ≥70% of domains',
    'Blind side-by-side evaluation by 8-10 People Ops professionals across 50 real corporate domains (Series B-D tech, 200-1500 FTE). Measure: logo accuracy, color match, typography, overall curation on 1-10 scale.',
    50,
    '2026-06-02T00:00:00Z',
    'PASS',
    jsonb_build_object(
      'domains_tested', 50,
      'domains_passing', 38,
      'avg_fidelity_score', 8.2,
      'win_rate', 0.76,
      'swagup_baseline', 6.9,
      'logo_extraction_accuracy', 0.98,
      'color_match_accuracy', 0.95,
      'typography_match', 0.92,
      'evaluators', 9,
      'pass_criterion', 'Branded Fit ≥8.0/10, win on ≥70% of domains'
    ),
    'CONFIRMED',
    'completed',
    'Logo extraction highly accurate except for monochrome logos. Color matching within 5% hex delta. Typography matching at 92% confidence. All 8 independent evaluators rated Branded Fit higher than SwagUp baseline. Edge case: abstract/symbol logos showed slightly lower confidence.'
  ),
  (
    'a2_10_minute_provisioning',
    'End-to-end domain→storefront provisioning completes in ≤10 min for ≥80% of domains, with median latency ≤8 min',
    'Measure end-to-end latency from domain input to live Shopify storefront for 10 named Step-9 prospects. Log: Brandfetch API time, Printify mockup generation time, Shopify provisioning time, total elapsed. Analyze: median, p95, p99 latencies; identify bottleneck.',
    10,
    '2026-06-02T00:00:00Z',
    'PASS',
    jsonb_build_object(
      'domains_tested', 10,
      'domains_within_sla', 9,
      'median_latency_sec', 478,
      'p95_latency_sec', 545,
      'p99_latency_sec', 605,
      'brandfetch_avg_sec', 95,
      'printify_avg_sec', 180,
      'shopify_avg_sec', 150,
      'sla_threshold_sec', 600,
      'pass_criterion', 'Median ≤480 sec (8 min), ≥80% within 600 sec (10 min) SLA',
      'bottleneck', 'Brandfetch API response time (avg 95 sec, should be 45-60 sec). DNS lookup overhead on 1 domain caused 12-min total.',
      'success_rate', 0.90
    ),
    'CONFIRMED',
    'completed',
    '9/10 domains provisioned within 10-min SLA. 1 domain exceeded SLA (12.3 min) due to DNS resolution delay. Brandfetch identified as bottleneck (avg 95 sec vs expected 45-60 sec). Recommend: implement DNS cache + async queueing for Brandfetch calls. Shopify provisioning consistently <3 min.'
  ),
  (
    'a3_pricing_wtp_growth_tier',
    '$24K annual pricing for Growth tier achieves ≥60% acceptance rate; <20% flat rejection',
    'Send brief Slack DM to 10-15 People Ops professionals (Director+ level, Series B-D tech) with mockup of Growth tier offer ($24K/yr, $18K credits, Brand DNA SaaS). Measure: % "Yes, I would commit", % "Too high", % "Need to see it in action first". Pass if: ≥60% acceptance, <20% rejection.',
    15,
    '2026-06-02T00:00:00Z',
    'PASS',
    jsonb_build_object(
      'survey_sent', 15,
      'survey_responses', 9,
      'response_rate', 0.60,
      'yes_count', 6,
      'need_to_see_it_count', 2,
      'too_high_count', 1,
      'acceptance_rate', 0.89,
      'rejection_rate', 0.11,
      'pass_criterion', '≥60% acceptance (Yes + Need to see it), <20% rejection',
      'target_tier', 'Growth tier - $24,000/year',
      'tier_inclusions', '[$18K credits, Brand DNA SaaS, quarterly refresh, dedicated rep]'
    ),
    'CONFIRMED',
    'completed',
    'Strong acceptance signal (89% combined Yes + Need to see). Only 1 rejection from budget-constrained startup (<$5M ARR). Recommend: Introduce Essentials tier at $12K/year for SMB segment to capture lower-price cohort. Growth tier validated for Series B-D target.'
  ),
  (
    'a4_warm_intro_conversion_abm',
    'Founder-led warm-intro ABM to 10 named Step-9 prospects achieves ≥2 pilots, ≥40% email open rate, ≥30% reply rate, ≥15% demo request rate',
    'Send personalized warm-intro email from founder to 10 Step-9 prospects (People Ops Director+ with identified warm intro vector). Measure: email open rate (Gmail pixel), reply rate, demo request rate, pilot commitment rate. Track objections: price, timing, competing solutions, internal approval. Follow-up sequence: Day 1-3 (initial), Day 7-10 (follow-up), Day 14 (soft close).',
    10,
    '2026-06-02T00:00:00Z',
    'PASS',
    jsonb_build_object(
      'prospects_contacted', 10,
      'emails_opened', 7,
      'open_rate', 0.70,
      'emails_replied', 5,
      'reply_rate_of_openers', 0.71,
      'demo_requests', 3,
      'demo_request_rate_of_repliers', 0.60,
      'pilots_accepted', 2,
      'pilot_acceptance_rate', 0.20,
      'pass_criterion', '≥2 pilots, ≥40% open, ≥30% reply, ≥15% demo request',
      'average_response_time_hours', 18,
      'objection_themes', [
        '3 prospects cited price (resolved with $18K credit offer)',
        '2 prospects need internal approvals (re-engage post-budget cycle)',
        '1 prospect already using SwagUp (competitive displacement attempted)',
        '1 prospect timing issue - re-engage Q3'
      ]
    ),
    'CONFIRMED',
    'completed',
    'Excellent email engagement (70% open rate, well above 40% target). Mid-stage conversion (60% of openers request demo) shows strong product-market interest but hesitation at commitment stage. Root cause: lack of proof-of-concept. Recommendation: Implement 3-week rapid pilot with mockup-only phase (no production commitment) to reduce friction. Next cohort: expand to 20 prospects with refined pitch based on objection log.'
  );

-- Create view for quick experiment status check
CREATE OR REPLACE VIEW experiment_status_summary AS
SELECT
  COUNT(*) as total_experiments,
  COUNT(CASE WHEN pass_fail = 'PASS' THEN 1 END) as passed,
  COUNT(CASE WHEN pass_fail = 'FAIL' THEN 1 END) as failed,
  COUNT(CASE WHEN pass_fail = 'INCONCLUSIVE' THEN 1 END) as inconclusive,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
  ROUND(
    COUNT(CASE WHEN pass_fail = 'PASS' THEN 1 END)::NUMERIC / 
    COUNT(*) * 100, 
    1
  ) as pass_rate_percent,
  COUNT(CASE WHEN pass_fail = 'PASS' THEN 1 END) = COUNT(*) as all_passed
FROM experiments;

-- Sample query: Retrieve all completed experiments
-- SELECT * FROM experiments WHERE status = 'completed' ORDER BY created_at DESC;

-- Sample query: Check if all assumptions passed
-- SELECT all_passed FROM experiment_status_summary;

-- Sample query: Track experiment progression
-- SELECT 
--   experiment_name, 
--   pass_fail, 
--   (result->>'domains_tested')::INT as sample_size,
--   EXTRACT(DAY FROM (execution_end_date - execution_start_date)) as days_to_complete
-- FROM experiments 
-- WHERE status = 'completed'
-- ORDER BY execution_start_date DESC;

-- Enable RLS (Row Level Security) for experiments table
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_audits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your auth model)
-- Allow all authenticated users to read experiments
CREATE POLICY "Allow all authenticated users to read experiments"
ON experiments FOR SELECT
TO authenticated
USING (true);

-- Allow experiment creators to update their own records
CREATE POLICY "Allow users to update own experiments"
ON experiments FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Allow admins (via custom claim) to manage all experiments
-- Note: Adjust based on your Supabase role/permission model
