# Analytics Schema Migration (Step 22 MVBP)

## Overview
This document outlines the Supabase schema extensions needed to support the analytics infrastructure for measuring Step 22 MVBP conversion funnel and user behavior tracking.

## Schema Changes

### 1. Extend `stores` Table

Add the following columns to track user demographics and research status:

```sql
-- Add UTM tracking columns
ALTER TABLE stores ADD COLUMN utm_source TEXT;
ALTER TABLE stores ADD COLUMN utm_medium TEXT;
ALTER TABLE stores ADD COLUMN utm_campaign TEXT;

-- Add company classification for beachhead analysis
ALTER TABLE stores ADD COLUMN company_classification TEXT;
-- Values: 'Series A-B', 'Series C-D', 'Mid-Market', 'Enterprise', 'Unknown'

-- Add beachhead fit scoring (auto-calculated from domain research)
ALTER TABLE stores ADD COLUMN beachhead_fit_score INTEGER CHECK (beachhead_fit_score >= 1 AND beachhead_fit_score <= 10);

-- Add research status tracking
ALTER TABLE stores ADD COLUMN research_status TEXT DEFAULT 'prospect';
-- Values: 'prospect', 'pilot', 'customer'
```

### 2. Create `events` Table

Create a new table to track all user events on the landing page:

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  -- Values: 'domain_submitted', 'mockup_viewed', 'storefront_clicked', 'faq_opened', 'headline_variant_seen'
  event_data JSONB DEFAULT '{}',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ab_variant TEXT,
  -- Values: 'A', 'B', 'C'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_events_store_id ON events(store_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_ab_variant ON events(ab_variant);
CREATE INDEX idx_events_utm_source ON events(utm_source);
```

### 3. Row-Level Security (RLS)

Apply RLS to the `events` table to ensure users can only access their own events:

```sql
-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy for reading events
CREATE POLICY "Users can read their own events"
  ON events FOR SELECT
  USING (
    store_id IN (
      SELECT id FROM stores WHERE customer_id = auth.uid()
    )
  );

-- Create policy for inserting events
CREATE POLICY "Service role can insert events"
  ON events FOR INSERT
  WITH CHECK (true);
```

## Event Data Structure

Each event stores structured data in the `event_data` JSONB column:

### Domain Submitted
```json
{
  "domain": "example.com",
  "email": "user@example.com",
  "company_name": "Example Corp"
}
```

### Mockup Viewed
```json
{
  "mockup_index": 0,
  "brand": "TechCorp (Blue & White)"
}
```

### Storefront Clicked
```json
{
  "cta": "pilot_checkout" | "generate_report"
}
```

### FAQ Opened
```json
{
  "question": "What is a Brand Drop?",
  "index": 0
}
```

### Headline Variant Seen
```json
{
  "variant": "A" | "B" | "C",
  "pathname": "/"
}
```

## Integration Points

### Frontend Event Tracking
- **File**: `src/lib/analytics.ts`
- **Events tracked**:
  - Page load: headline variant impression
  - Form submit: domain submission
  - Gallery interaction: mockup view
  - FAQ accordion: question opened
  - CTA clicks: storefront interactions

### Event Logging API
- **Route**: `POST /api/analytics/events`
- **Payload**: Event object with type, data, and UTM params
- **Response**: Created event record or error

### Analytics Metrics API
- **Route**: `GET /api/analytics/metrics?timeframe=7d|30d`
- **Response**: Computed metrics including:
  - Submission counts
  - Conversion rates (submission → mockup → storefront)
  - UTM source breakdown
  - A/B test performance
  - FAQ performance

## Deployment Steps

1. **Create tables in Supabase Console**:
   - Go to SQL Editor in Supabase dashboard
   - Run the schema creation scripts above
   - Verify tables are created

2. **Enable RLS**:
   - Verify RLS policies are active
   - Test with test API calls

3. **Deploy frontend code**:
   - Merge analytics tracking changes to main
   - Deploy to Vercel

4. **Verify tracking**:
   - Open landing page in browser
   - Check Network tab for `/api/analytics/events` calls
   - Verify events appear in Supabase `events` table

## Monitoring & Reporting

### Google Sheets Integration (Optional)
To export metrics to Google Sheets for weekly reporting:

1. Create a Google Service Account
2. Store credentials in Supabase Secrets
3. Use `gs4py` or equivalent to append metrics to a Google Sheet
4. Schedule via GitHub Actions or Vercel Cron

### Weekly Report Template
```
Subject: Branded Fit Weekly Analytics - Week of [DATE]

SUBMISSIONS
- 7-day submissions: [COUNT]
- Conversion rate (submission → mockup): [%]

TRAFFIC ATTRIBUTION
- Top utm_source: [SOURCE]
- Second utm_source: [SOURCE2]

A/B TEST
- Variant A conversion: [%]
- Variant B conversion: [%]
- Variant C conversion: [%]
- Winner: Variant [X]

TOP FAQs
- [Question 1]: [COUNT] opens
- [Question 2]: [COUNT] opens
- [Question 3]: [COUNT] opens
```

### Slack Integration (Optional)
Post metrics summary to `#branded-fit-metrics` channel every Monday 9am UTC using Slack Incoming Webhooks.

## Testing

### Manual Testing
```bash
# Test event logging
curl -X POST http://localhost:3000/api/analytics/events \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "domain_submitted",
    "eventData": {"domain": "test.com"},
    "utmSource": "organic",
    "abVariant": "A"
  }'

# Fetch metrics
curl http://localhost:3000/api/analytics/metrics?timeframe=7d
```

### Browser DevTools
1. Open landing page
2. Open DevTools → Network tab
3. Filter for `/api/analytics/events`
4. Perform actions (submit domain, view mockup, click FAQ)
5. Verify POST requests are sent with correct event data

## Success Criteria

- ✅ Events table stores all frontend interactions
- ✅ Conversion funnel metrics visible in `/analytics` dashboard
- ✅ A/B test variants tracked and compared
- ✅ UTM parameters preserved and attributed correctly
- ✅ FAQ performance ranked by opens
- ✅ Weekly reporting data available in API
- ✅ ≥15% conversion rate achieved on at least one A/B variant (target)
