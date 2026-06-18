# Analytics Implementation Guide (Step 22 MVBP)

## Overview
Complete guide to deploying the analytics infrastructure for measuring Branded Fit's Step 22 MVBP conversion funnel.

## What Was Built

### 1. Frontend Instrumentation (`src/lib/analytics.ts`)
- **Analytics utility** for tracking user events
- **A/B test assignment** using localStorage (stickiness across visits)
- **UTM parameter capture** from URL
- **Event tracking API** integration

### 2. Frontend Integration (`src/app/page.tsx`)
Landing page instrumented to track:
- ✅ Headline variant impressions on page load
- ✅ Domain submissions (form completion)
- ✅ Mockup gallery views (product interaction)
- ✅ FAQ accordion opens (content engagement)
- ✅ CTA clicks (conversion funnel)

### 3. Event Logging API (`src/app/api/analytics/events/route.ts`)
- Accepts POST requests with event data
- Stores events in Supabase `events` table
- Captures UTM params, A/B variant, and event-specific data
- No authentication required (safe for frontend calls)

### 4. Analytics Metrics API (`src/app/api/analytics/metrics/route.ts`)
- Computes metrics from raw events
- Supports 7-day and 30-day timeframes
- Returns:
  - Submission counts and conversion rates
  - Funnel metrics (submit → mockup → storefront)
  - UTM source attribution breakdown
  - A/B test performance comparison
  - Top FAQ questions by engagement

### 5. Analytics Dashboard (`src/app/analytics/page.tsx`)
- **Public metrics page** at `/analytics`
- Shows conversion funnel visualization
- Displays A/B test performance comparison
- Lists top traffic sources and FAQ questions
- Supports 7-day and 30-day views

### 6. Schema Migration Documentation
- Guide to extend Supabase `stores` table with UTM and classification columns
- SQL to create new `events` table for event storage
- RLS policies for security
- Event data structure definitions

### 7. Reporting Guides
- **Slack integration**: Weekly metrics posted to #branded-fit-metrics Monday 9am
- **Google Sheets integration**: Automated weekly report archival
- **Cron job**: Vercel cron trigger for automated reporting

### 8. A/B Testing Framework
- 3 headline variants (Speed, Product, Quality focus)
- Client-side randomization with localStorage
- Variant assignment stickiness
- Conversion rate tracking per variant
- Statistical significance guidance

## Getting Started

### Phase 1: Schema Setup (30 minutes)

1. **Open Supabase Console**
   - Go to https://app.supabase.com
   - Select your Branded Fit project
   - Open SQL Editor

2. **Run Schema Migration**
   - Copy SQL from `documents/2026-06-02_analytics_schema_migration.md`
   - Paste into SQL Editor
   - Execute

3. **Verify Tables Created**
   - Check that `stores` table has new columns
   - Check that `events` table exists with proper schema
   - Verify indexes created

### Phase 2: Deploy Code (5 minutes)

1. **Merge to Main**
   ```bash
   git add src/lib/analytics.ts
   git add src/app/page.tsx
   git add src/app/api/analytics/
   git add src/app/analytics/
   git commit -m "feat: Add landing page analytics infrastructure (Step 22 MVBP)"
   git push origin main
   ```

2. **Vercel Auto-Deploy**
   - Vercel automatically deploys main branch
   - Wait for build to complete
   - Check deployment status: https://vercel.com

### Phase 3: Verify Events Are Logging (10 minutes)

1. **Open Live Site**
   - Go to https://branded-david-7482s-projects.vercel.app (or your live URL)

2. **Check DevTools**
   - Open DevTools (F12)
   - Go to Network tab
   - Filter for "analytics"
   - See POST calls to `/api/analytics/events`

3. **Trigger Events**
   - Fill out domain form → check for `domain_submitted` event
   - View different mockups → check for `mockup_viewed` events
   - Click FAQ questions → check for `faq_opened` events
   - Verify all events have data in network tab

4. **Verify in Supabase**
   - Open Supabase console
   - Go to Table Editor
   - Open `events` table
   - Should see new rows with today's events
   - Check payload contains correct data

### Phase 4: View Analytics Dashboard (2 minutes)

1. **Navigate to Dashboard**
   - Go to `/analytics` on your live site
   - Should see "Analytics Dashboard" heading

2. **Check Metrics**
   - "Last 7 Days" should show your test events
   - Conversion funnel should display percentages
   - A/B test section shows 3 variants (A, B, C)
   - UTC attribution shows events by utm_source

3. **Switch Timeframe**
   - Click "Last 30 Days"
   - Data should update or show "no data" if only testing today

### Phase 5: Set Up A/B Test (5 minutes)

1. **Open New Browser / Incognito Window**
   - A/B variant assigned on first page load
   - localStorage stores selection
   - Refresh page → same variant assigned
   - Clear localStorage → new variant assigned

2. **Test All 3 Variants**
   - Variant A: "From Domain to Branded Drops in Minutes"
   - Variant B: "Deploy Branded Swag in 10 Minutes"
   - Variant C: "Zero Design Friction. 100% Brand Fidelity."
   - Verify headline changes per variant in page.tsx

3. **Monitor A/B Dashboard**
   - Submit form 3 times across different browsers
   - Each should show different variant in `ab_variant` field
   - Dashboard shows conversion rate per variant

### Phase 6: Set Up Weekly Reporting (Optional, 30 minutes)

**For Slack Integration:**

1. Create Slack webhook (see `documents/2026-06-02_weekly_reporting_setup.md`)
2. Store `SLACK_WEBHOOK_URL` in Vercel environment
3. Create cron function (`src/app/api/cron/weekly-metrics/route.ts`)
4. Update `next.config.ts` with cron schedule
5. Test: Manual invoke via Vercel dashboard

**For Google Sheets Integration:**

1. Create Google Service Account (see reporting guide)
2. Create Google Sheet with headers
3. Store credentials in Vercel environment
4. Create Google Sheets helper function
5. Call from cron job

## Key Files Reference

### Frontend Tracking
- `src/lib/analytics.ts` — Core analytics utilities
- `src/app/page.tsx` — Instrumented landing page (check for `trackEvent` calls)

### Backend APIs
- `src/app/api/analytics/events/route.ts` — Event ingestion
- `src/app/api/analytics/metrics/route.ts` — Metrics computation

### Dashboard
- `src/app/analytics/page.tsx` — Public metrics dashboard

### Documentation
- `documents/2026-06-02_analytics_schema_migration.md` — Supabase setup
- `documents/2026-06-02_weekly_reporting_setup.md` — Slack + Google Sheets
- `documents/2026-06-02_ab_testing_guide.md` — A/B testing framework

## Environment Variables

No new environment variables required for basic analytics!

Optional for reporting:
- `SLACK_WEBHOOK_URL` — Slack incoming webhook
- `GOOGLE_SHEETS_API_KEY` — Google service account JSON (base64 or raw)
- `GOOGLE_SHEETS_ID` — Target Google Sheet ID
- `CRON_SECRET` — Secret for verifying cron requests

## Testing Checklist

- [ ] Supabase tables created with correct schema
- [ ] Code deployed to production
- [ ] Events logged when submitting form
- [ ] Mockup gallery interactions logged
- [ ] FAQ opens tracked
- [ ] CTA clicks tracked
- [ ] Headline variant assigned on first visit
- [ ] Variant sticks on page refresh
- [ ] A/B metrics show in dashboard
- [ ] `/analytics` dashboard displays data
- [ ] Conversion rates calculated correctly
- [ ] UTM source breakdown visible

## Success Metrics (7-Day Test)

**Phase 1: Tracking Validation**
- ✅ ≥100 unique users visit landing page
- ✅ ≥30 domain submissions logged
- ✅ ≥10 mockup gallery clicks logged
- ✅ Zero errors in Supabase or API logs

**Phase 2: A/B Test (Day 8-14)**
- ✅ 3 variants evenly distributed (30-35% each)
- ✅ ≥2,000 impressions per variant
- ✅ One variant achieves ≥15% conversion rate
- ✅ Results significant at p < 0.05 (if 15%+ baseline)

**Phase 3: Reporting Setup (Optional)**
- ✅ Weekly report posts to Slack Monday 9am
- ✅ Metrics appear in Google Sheet
- ✅ Historical data preserved

## Interpreting Results

### Conversion Funnel
```
100 domain submissions
→ 45 mockup views (45% conversion)
→ 15 storefront clicks (15% secondary conversion)
→ 3 pilot checkouts (3% final conversion)

Success = ≥15% from submission → mockup
```

### A/B Test Results
```
Variant A: 18% conversion (52/289 impressions)
Variant B: 22% conversion (61/277 impressions) ← Winner
Variant C: 16% conversion (45/281 impressions)

Lift: Variant B +22% vs Variant A
```

### Attribution
```
UTM Source Breakdown:
- organic: 45% of submissions (highest quality)
- direct: 35% of submissions
- referral: 20% of submissions (lowest volume)

→ Focus SEO and organic channel
```

### FAQ Performance
```
Top 5 questions opened:
1. "How long does it take?" - 187 opens
2. "Can we customize colors?" - 142 opens
3. "What is a Brand Drop?" - 128 opens
4. "How does fulfillment work?" - 94 opens
5. "What if we don't like the mockup?" - 81 opens

→ Feature top 3 prominently
```

## Troubleshooting

### Events not logging
1. Check Network tab in DevTools for 201/202 response from `/api/analytics/events`
2. Verify Supabase credentials in `.env`
3. Check Supabase `events` table has RLS disabled for inserts (or allow service role)

### Conversion rate = 0%
1. Ensure mockup_viewed events are being logged
2. Check timestamps on events in Supabase
3. Verify event_type values match API query filters

### A/B variants not switching
1. Check localStorage in DevTools Console: `localStorage.getItem('bf_ab_variant')`
2. Clear localStorage and reload: `localStorage.clear()`
3. Verify `getABTestVariant()` called on page load

### Dashboard shows "No data"
1. Wait 1-2 minutes for events to sync
2. Refresh page
3. Check Supabase directly for events
4. Verify timeframe filter (7d vs 30d)

## Next Steps

### Week 1
- Monitor event logging accuracy
- Collect ≥50 submissions for A/B test
- Check daily that no errors in APIs

### Week 2
- Run A/B test with ≥2,000 impressions per variant
- Document which variant wins
- Deploy winning variant to production

### Week 3
- Set up Slack + Google Sheets reporting
- Archive results in documents/
- Plan next test (e.g., subheadline or CTA)

### Ongoing
- Review `/analytics` dashboard weekly
- Check A/B test results on Mondays
- Iterate on messaging based on data
- Keep historical test results documented

## Support

For issues or questions:
1. Check `documents/` guides for detailed setup
2. Review this file's troubleshooting section
3. Check Supabase logs for database errors
4. Verify environment variables are set correctly
5. Contact team via #branded-fit-metrics Slack channel

---

**Implementation Date**: June 2, 2026
**Status**: Ready for deployment
**Last Updated**: June 2, 2026
