# A/B Testing Framework (Step 22 MVBP)

## Overview
This document outlines the A/B testing framework implemented on the Branded Fit landing page to optimize headline messaging and measure conversion lift.

## 3 Headline Variants

### Variant A: Speed Focus
**Headline**: "From Domain to Branded Drops in Minutes"
**Subheadline**: "Submit your company domain and see exactly how your brand would look on apparel—in minutes, not weeks."

**Messaging**: Emphasizes speed and immediate results. Appeals to teams wanting fast feedback.

### Variant B: Product Focus
**Headline**: "Deploy Branded Swag in 10 Minutes"
**Subheadline**: "Zero design friction. Get custom mockups of your company merchandise instantly, then move straight to production."

**Messaging**: Focuses on action and outcome (product ready). Appeals to teams ready to move fast.

### Variant C: Quality Focus
**Headline**: "Zero Design Friction. 100% Brand Fidelity."
**Subheadline**: "Branded Fit extracts your exact brand palette and applies it perfectly. See results before committing."

**Messaging**: Emphasizes brand accuracy and risk mitigation. Appeals to design-conscious teams.

## Implementation Details

### Client-Side Assignment
- **File**: `src/lib/analytics.ts` → `getABTestVariant()`
- **Mechanism**: localStorage-based randomization
- **Stickiness**: User sees same variant on subsequent visits
- **Code**:
  ```typescript
  export const getABTestVariant = (): string => {
    if (typeof window === "undefined") return "A";
    
    let variant = localStorage.getItem("bf_ab_variant");
    if (!variant) {
      const variants = ["A", "B", "C"];
      variant = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem("bf_ab_variant", variant);
    }
    return variant;
  };
  ```

### Tracking Events
- **Impression**: `headline_variant_seen` event logged on page load
- **Conversion**: `domain_submitted` event includes `abVariant` field
- **Metrics**: Conversion rate calculated as (conversions / impressions) × 100%

### Data Collection
Each variant tracks:
- Impressions (headline views)
- Conversions (domain submissions)
- Conversion rate (%)
- UTM source attribution
- Device/browser context (captured via navigator.userAgent in event_data)

## Dashboard Metrics

### Accessing Results
1. Navigate to `/analytics` dashboard
2. Select timeframe (7d or 30d)
3. Scroll to "A/B Test Performance" card

### Key Metrics
- **Impressions**: Total headline views per variant
- **Conversions**: Domain submissions per variant
- **Conversion Rate**: (Conversions / Impressions) × 100%

Example output:
```
Variant A: 18.5% (54 conversions / 292 impressions)
Variant B: 22.1% (61 conversions / 276 impressions)
Variant C: 16.8% (48 conversions / 285 impressions)

→ Variant B is the winner with 22.1% conversion rate
```

## Statistical Significance

### Sample Size Recommendation
For 80% power and 95% confidence with baseline 15% conversion:
- **Target**: ≥2,000 impressions per variant (6,000 total)
- **Timeline**: ~2-3 weeks at current traffic levels
- **Min Detectable Effect**: ±5% (20% → 15% or 20% → 25%)

### Checking Significance
If Variant B converts at 22% vs Variant A at 18%:
1. Calculate z-score: `z = (p1 - p2) / sqrt(p(1-p)(1/n1 + 1/n2))`
2. If |z| > 1.96, result is significant at p < 0.05
3. Example: 300 impressions/variant, 66 conversions per variant
   - Variant A: 66/300 = 22%
   - Variant B: 75/300 = 25%
   - Difference: 3pp → Not significant (need ~5,000 impressions each)

### Using Calculator
https://www.statsig.com/calculator
- Enter baseline conversion rate (15%)
- Enter observed variant rate (22%)
- Enter sample size per variant
- Check if result is significant (p < 0.05)

## Running the Test

### Phase 1: Traffic Warm-up (Days 1-3)
- Variants evenly distributed in random assignment
- Monitor for technical issues or bugs
- **Success criteria**: No errors in `/api/analytics/events`, events logged correctly

### Phase 2: Data Collection (Days 4-14)
- Continue collecting data
- Check dashboard daily for emerging trends
- Do NOT stop test early even if one variant appears winning
- **Sample size target**: 2,000 impressions per variant

### Phase 3: Analysis (Days 15-21)
- Analyze all 7 days of data together
- Check for day-of-week effects
- Verify statistical significance
- Document results

### Stopping Rules
**Stop early if**:
- One variant converts at ≥15% with ≥2,000 impressions
- Technical issue causes data corruption

**Continue if**:
- No variant reaches 15% conversion
- Results are within 3pp of each other
- Statistical significance uncertain

## Winners & Next Steps

### If Variant Wins (≥15% conversion)
1. **Update production**: Deploy winning headline to main site
2. **Broadcast**: Share results in #branded-fit-metrics Slack
3. **Iterate**: Run follow-up test on subheadline or CTA text
4. **Monitor**: Watch conversion rate on live traffic

### If No Clear Winner
1. **Document findings**: Update test analysis in documents/
2. **Extend test**: Run for additional 7 days for more data
3. **Pivot messaging**: Try different angle (e.g., industry-specific headlines)
4. **Test CTA**: Move to button text testing instead

## Rollout Strategy

### Step 1: Declare Winner (Post-Test)
Requires:
- ✅ ≥2,000 impressions per variant
- ✅ Winning variant ≥15% conversion rate
- ✅ Winning variant at least 3pp higher than runner-up
- ✅ Statistical significance (p < 0.05)

### Step 2: Update Production
1. Merge PR updating `getHeadlineVariant()` to set winning variant as default
2. Keep A/B assignment for measurement (don't remove)
3. Deploy to production
4. Monitor for any conversion drop (fallback if needed)

### Step 3: Announce Results
Post to Slack #branded-fit-metrics:
```
🎯 A/B Test Complete!

Test Duration: [DATE] - [DATE]
Impressions per variant: ~[COUNT]

Results:
Variant A: [RATE]% ([CONVERSIONS]/[IMPRESSIONS])
Variant B: [RATE]% ([CONVERSIONS]/[IMPRESSIONS]) ← WINNER
Variant C: [RATE]% ([CONVERSIONS]/[IMPRESSIONS])

Lift: [+X]% vs control
Confidence: >95%

Next test: [TBD]
```

## Advanced: Analyze by Segment

### Segment by UTM Source
Filter events where `utm_source = 'organic'` to see if variant performs differently:
- Organic traffic → quality audience, may prefer quality messaging (C)
- Paid traffic → convert-focused audience, may prefer speed (A/B)
- Direct traffic → brand-aware audience, may prefer efficiency (B)

### Segment by Device
Check if variant performance differs:
- Mobile → short headlines win (A/B might win)
- Desktop → longer, more detail-rich headlines (C might win)

Query in `/api/analytics/metrics` and filter:
```typescript
const mobileEvents = events.filter(e => 
  (e.event_data as any)?.userAgent?.includes('Mobile')
);
```

## Troubleshooting

### Issue: All variants showing 0% conversion
**Cause**: Events not being logged
**Fix**: 
1. Check Network tab in DevTools for `/api/analytics/events` calls
2. Verify `/api/analytics/events` endpoint is working
3. Check browser console for JavaScript errors
4. Verify `localStorage` not blocked by privacy settings

### Issue: Variant assignment not sticky
**Cause**: localStorage cleared or not saving
**Fix**:
1. Check browser allows localStorage (some incognito modes block it)
2. Verify `getABTestVariant()` is called on every page load
3. Add error logging: `console.log('Variant assigned:', getABTestVariant())`

### Issue: High variance in conversion rates
**Cause**: Small sample size or daily fluctuations
**Fix**:
1. Increase test duration to 7+ days for stability
2. Check for day-of-week effects (weekends vs weekdays)
3. Verify traffic sources are distributed evenly across variants
4. Look for external events (product launch, press) affecting conversions

## Success Criteria

- ✅ Test completes with ≥2,000 impressions per variant
- ✅ One variant achieves ≥15% conversion rate
- ✅ Winner is statistically significant (p < 0.05)
- ✅ Winning headline deployed to production
- ✅ Results shared and archived in documents/

## Historical Results

### Test 1: Initial A/B (June 2-21, 2026)
- **Variants**: Speed vs Product vs Quality
- **Winner**: TBD (awaiting first test)
- **Conversion Rate**: TBD
- **Lift**: TBD
- **Notes**: First run to validate framework
