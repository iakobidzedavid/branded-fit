# Weekly Reporting Setup (Step 22 MVBP)

## Overview
This document outlines how to set up automated weekly reporting of Step 22 MVBP metrics to Slack and Google Sheets.

## 1. Slack Integration (Weekly Metrics to #branded-fit-metrics)

### Setup Steps

#### 1.1 Create Slack Webhook
1. Go to https://api.slack.com/apps
2. Create a new app or select existing "Branded Fit" app
3. Navigate to "Incoming Webhooks"
4. Create a new webhook for channel `#branded-fit-metrics`
5. Copy the webhook URL

#### 1.2 Store Webhook in Environment
Add to `.env.local` or GitHub Secrets (for GitHub Actions):
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

#### 1.3 Create Reporting Function
Create `src/lib/slack-reporter.ts`:

```typescript
export async function postWeeklyMetrics(metrics: {
  submissions: number;
  conversionRate: number;
  topUtmSource: string;
  topFaqQuestion: string;
  abWinner: string;
  abWinnerRate: string;
}) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("SLACK_WEBHOOK_URL not configured");
    return;
  }

  const message = {
    channel: "#branded-fit-metrics",
    username: "Branded Fit Analytics",
    icon_emoji: ":chart_with_upwards_trend:",
    attachments: [
      {
        color: "#a855f7",
        title: `Weekly Metrics - ${new Date().toLocaleDateString()}`,
        fields: [
          {
            title: "7-Day Submissions",
            value: metrics.submissions.toString(),
            short: true,
          },
          {
            title: "Conversion Rate",
            value: `${metrics.conversionRate}%`,
            short: true,
          },
          {
            title: "Top Traffic Source",
            value: metrics.topUtmSource || "direct",
            short: true,
          },
          {
            title: "Top FAQ Question",
            value: metrics.topFaqQuestion || "N/A",
            short: false,
          },
          {
            title: "A/B Test Winner",
            value: `Variant ${metrics.abWinner} (${metrics.abWinnerRate}%)`,
            short: true,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error("Failed to post to Slack:", response.statusText);
    }
  } catch (error) {
    console.error("Error posting to Slack:", error);
  }
}
```

#### 1.4 Schedule with Vercel Cron
Update `next.config.ts` to add a cron endpoint:

```typescript
// next.config.ts
const nextConfig = {
  crons: [
    {
      path: '/api/cron/weekly-metrics',
      schedule: '0 9 * * 1', // Every Monday at 9am UTC
    },
  ],
};
export default nextConfig;
```

Create `src/app/api/cron/weekly-metrics/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { postWeeklyMetrics } from '@/lib/slack-reporter';

export async function GET(request: NextRequest) {
  // Verify request is from Vercel
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch last 7 days of metrics
    const client = getSupabase();
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 7);

    const { data: events } = await client
      .from('events')
      .select('*')
      .gte('created_at', dateThreshold.toISOString());

    // Calculate metrics
    const submissions = (events || []).filter(e => e.event_type === 'domain_submitted').length;
    const mockupViews = (events || []).filter(e => e.event_type === 'mockup_viewed').length;
    const conversionRate = submissions > 0 ? ((mockupViews / submissions) * 100).toFixed(1) : '0.0';

    // Find top UTM source
    const utmCounts: Record<string, number> = {};
    (events || [])
      .filter(e => e.utm_source)
      .forEach(e => {
        utmCounts[e.utm_source] = (utmCounts[e.utm_source] || 0) + 1;
      });
    const topUtmSource = Object.entries(utmCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'direct';

    // Find top FAQ
    const faqCounts: Record<string, number> = {};
    (events || [])
      .filter(e => e.event_type === 'faq_opened')
      .forEach(e => {
        const q = (e.event_data as any)?.question || 'Unknown';
        faqCounts[q] = (faqCounts[q] || 0) + 1;
      });
    const topFaq = Object.entries(faqCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Find A/B winner
    const variantCounts: Record<string, { impressions: number; conversions: number }> = {};
    (events || []).forEach(e => {
      const v = e.ab_variant || 'A';
      if (!variantCounts[v]) variantCounts[v] = { impressions: 0, conversions: 0 };
      if (e.event_type === 'headline_variant_seen') variantCounts[v].impressions++;
      if (e.event_type === 'domain_submitted') variantCounts[v].conversions++;
    });

    let winner = 'A';
    let winnerRate = '0.0';
    let highestRate = 0;
    Object.entries(variantCounts).forEach(([v, data]) => {
      const rate = data.impressions > 0 ? data.conversions / data.impressions : 0;
      if (rate > highestRate) {
        highestRate = rate;
        winner = v;
        winnerRate = (rate * 100).toFixed(1);
      }
    });

    await postWeeklyMetrics({
      submissions,
      conversionRate: parseFloat(conversionRate as string),
      topUtmSource,
      topFaqQuestion: topFaq,
      abWinner: winner,
      abWinnerRate: winnerRate,
    });

    return NextResponse.json({ success: true, metrics: {
      submissions,
      conversionRate,
      topUtmSource,
      topFaq,
      abWinner: winner,
    }});
  } catch (error) {
    console.error('Error in weekly metrics cron:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## 2. Google Sheets Integration (Weekly Report)

### Setup Steps

#### 2.1 Create Google Service Account
1. Go to https://console.cloud.google.com
2. Create a new project "Branded Fit Analytics"
3. Enable Google Sheets API
4. Create Service Account credentials (JSON key)
5. Download the JSON file

#### 2.2 Create Google Sheet
1. Create a new Google Sheet: "Branded Fit Weekly Metrics"
2. Share it with your Service Account email (found in JSON credentials)
3. Copy the Sheet ID from URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

#### 2.3 Store Credentials
1. Add to `.env.local`:
   ```
   GOOGLE_SHEETS_API_KEY=[JSON credential content or base64 encoded]
   GOOGLE_SHEETS_ID=your-sheet-id
   ```

2. For production (Vercel), add as environment variables

#### 2.4 Create Google Sheets Helper
Create `src/lib/google-sheets-reporter.ts`:

```typescript
import { google } from 'googleapis';

export async function appendWeeklyMetrics(metrics: {
  date: string;
  submissions: number;
  conversionRate: number;
  topUtmSource: string;
  topFaqQuestion: string;
  abWinner: string;
}) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_API_KEY || '{}'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          metrics.date,
          metrics.submissions,
          metrics.conversionRate,
          metrics.topUtmSource,
          metrics.topFaqQuestion,
          metrics.abWinner,
        ]],
      },
    });
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    throw error;
  }
}
```

#### 2.5 Headers for Google Sheet
Set up headers in row 1:
- A1: Date
- B1: 7-Day Submissions
- C1: Conversion Rate (%)
- D1: Top UTM Source
- E1: Top FAQ Question
- F1: A/B Winner

### 2.6 Integrate into Cron Job
Update the cron endpoint to also write to Google Sheets:

```typescript
// In src/app/api/cron/weekly-metrics/route.ts
import { appendWeeklyMetrics } from '@/lib/google-sheets-reporter';

// After calculating metrics, add:
await appendWeeklyMetrics({
  date: new Date().toISOString().split('T')[0],
  submissions,
  conversionRate: parseFloat(conversionRate as string),
  topUtmSource,
  topFaqQuestion: topFaq,
  abWinner: winner,
});
```

## 3. Local Testing

### Test Slack Integration
```typescript
// In your terminal or test file
import { postWeeklyMetrics } from '@/lib/slack-reporter';

await postWeeklyMetrics({
  submissions: 42,
  conversionRate: 15.5,
  topUtmSource: 'organic',
  topFaqQuestion: 'How long does it take?',
  abWinner: 'B',
  abWinnerRate: '18.5',
});
```

### Test Google Sheets Integration
```typescript
// After setting up credentials
import { appendWeeklyMetrics } from '@/lib/google-sheets-reporter';

await appendWeeklyMetrics({
  date: new Date().toISOString().split('T')[0],
  submissions: 42,
  conversionRate: 15.5,
  topUtmSource: 'organic',
  topFaqQuestion: 'How long does it take?',
  abWinner: 'B',
});
```

## 4. Deployment Checklist

- [ ] Slack webhook URL stored in Vercel environment
- [ ] Google Service Account credentials stored in Vercel environment
- [ ] Google Sheet created and shared with service account
- [ ] Cron endpoint deployed to production
- [ ] Test cron job runs manually (via Vercel dashboard)
- [ ] First Monday report received in Slack
- [ ] Metrics appear in Google Sheet

## 5. Success Metrics

- ✅ Weekly report posts to Slack every Monday at 9am UTC
- ✅ Metrics data persists in Google Sheet for trending analysis
- ✅ A/B test performance tracked and compared weekly
- ✅ Traffic source attribution clear from utm_source breakdown
- ✅ FAQ performance ranked for content optimization
