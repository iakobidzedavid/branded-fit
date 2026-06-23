-- GTM response tracking schema for outreach campaign monitoring
CREATE TABLE IF NOT EXISTS gtm_prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin_url TEXT,
  title TEXT,
  company_size TEXT,
  funding_stage TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS gtm_outreach (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID NOT NULL REFERENCES gtm_prospects(id) ON DELETE CASCADE,
  wave_name TEXT NOT NULL DEFAULT 'Wave 1',
  sent_date TIMESTAMP NOT NULL,
  email_subject TEXT,
  email_body TEXT,
  gmail_message_id TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'bounced', 'spam')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gtm_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outreach_id UUID NOT NULL REFERENCES gtm_outreach(id) ON DELETE CASCADE,
  prospect_id UUID NOT NULL REFERENCES gtm_prospects(id) ON DELETE CASCADE,
  first_reply_date TIMESTAMP,
  reply_type TEXT CHECK (reply_type IN ('email', 'linkedin', 'call', 'no_reply')),
  reply_body TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative', 'objection', 'unclassified')),
  top_objection TEXT,
  qualification_status TEXT DEFAULT 'unqualified' CHECK (qualification_status IN ('unqualified', 'qualified', 'hot', 'closed_won', 'closed_lost')),
  next_action TEXT,
  next_action_date DATE,
  discovery_call_scheduled BOOLEAN DEFAULT FALSE,
  discovery_call_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gtm_metrics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  measurement_date DATE NOT NULL,
  wave_name TEXT NOT NULL DEFAULT 'Wave 1',
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_replied INTEGER DEFAULT 0,
  total_qualified INTEGER DEFAULT 0,
  total_calls_scheduled INTEGER DEFAULT 0,
  sentiment_positive INTEGER DEFAULT 0,
  sentiment_negative INTEGER DEFAULT 0,
  sentiment_objection INTEGER DEFAULT 0,
  open_rate_pct NUMERIC,
  reply_rate_pct NUMERIC,
  qualification_rate_pct NUMERIC,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(measurement_date, wave_name)
);

-- Enable RLS
ALTER TABLE gtm_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gtm_outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE gtm_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gtm_metrics_daily ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for now; can be restricted later)
DROP POLICY IF EXISTS "Allow service role access to gtm_prospects" ON gtm_prospects;
CREATE POLICY "Allow service role access to gtm_prospects" ON gtm_prospects
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Allow service role access to gtm_outreach" ON gtm_outreach;
CREATE POLICY "Allow service role access to gtm_outreach" ON gtm_outreach
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Allow service role access to gtm_responses" ON gtm_responses;
CREATE POLICY "Allow service role access to gtm_responses" ON gtm_responses
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Allow service role access to gtm_metrics_daily" ON gtm_metrics_daily;
CREATE POLICY "Allow service role access to gtm_metrics_daily" ON gtm_metrics_daily
  FOR ALL USING (TRUE);
