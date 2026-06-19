import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const client = getSupabase();
    const timeframe = request.nextUrl.searchParams.get("timeframe") || "7d"; // 7d or 30d

    const getDaysBack = (tf: string): number => {
      return tf === "30d" ? 30 : 7;
    };

    const daysBack = getDaysBack(timeframe);
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysBack);

    // Fetch all events for the timeframe
    const { data: events, error: eventsError } = await client
      .from("events")
      .select("*")
      .gte("created_at", dateThreshold.toISOString())
      .order("created_at", { ascending: false });

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      return NextResponse.json(
        { error: "Failed to fetch metrics" },
        { status: 500 }
      );
    }

    // Calculate metrics
    const domainSubmissions = (events || []).filter(
      (e) => e.event_type === "domain_submitted"
    );
    const mockupViews = (events || []).filter(
      (e) => e.event_type === "mockup_viewed"
    );
    const storefrontClicks = (events || []).filter(
      (e) => e.event_type === "storefront_clicked"
    );
    const faqOpens = (events || []).filter(
      (e) => e.event_type === "faq_opened"
    );
    const headlineViews = (events || []).filter(
      (e) => e.event_type === "headline_variant_seen"
    );

    // Calculate conversion rate
    const submissionCount = domainSubmissions.length;
    const mockupViewCount = mockupViews.length;
    const storefrontClickCount = storefrontClicks.length;

    const submissionToMockupRate =
      submissionCount > 0
        ? ((mockupViewCount / submissionCount) * 100).toFixed(1)
        : "0.0";

    const submissionToStorefrontRate =
      submissionCount > 0
        ? ((storefrontClickCount / submissionCount) * 100).toFixed(1)
        : "0.0";

    // UTM source breakdown
    const utmSourceBreakdown: Record<
      string,
      { count: number; conversions: number }
    > = {};
    domainSubmissions.forEach((event) => {
      const source = event.utm_source || "direct";
      if (!utmSourceBreakdown[source]) {
        utmSourceBreakdown[source] = { count: 0, conversions: 0 };
      }
      utmSourceBreakdown[source].count += 1;

      // Check if this submission led to a mockup view
      const hasFollowUp = mockupViews.some(
        (mv) =>
          mv.event_data?.domain === event.event_data?.domain &&
          new Date(mv.created_at) > new Date(event.created_at)
      );

      if (hasFollowUp) {
        utmSourceBreakdown[source].conversions += 1;
      }
    });

    // A/B test breakdown
    const abTestBreakdown: Record<
      string,
      { impressions: number; conversions: number }
    > = {};
    headlineViews.forEach((event) => {
      const variant = event.ab_variant || "A";
      if (!abTestBreakdown[variant]) {
        abTestBreakdown[variant] = { impressions: 0, conversions: 0 };
      }
      abTestBreakdown[variant].impressions += 1;

      // Check if this led to a domain submission
      const hasConversion = domainSubmissions.some(
        (ds) =>
          ds.ab_variant === variant &&
          new Date(ds.created_at) > new Date(event.created_at)
      );

      if (hasConversion) {
        abTestBreakdown[variant].conversions += 1;
      }
    });

    // FAQ performance
    const faqPerformance: Record<
      string,
      { opens: number; ctr: number }
    > = {};
    faqOpens.forEach((event) => {
      const question = (event.event_data?.question as string) || "Unknown";
      if (!faqPerformance[question]) {
        faqPerformance[question] = { opens: 0, ctr: 0 };
      }
      faqPerformance[question].opens += 1;
    });

    const topFaqs = Object.entries(faqPerformance)
      .sort((a, b) => b[1].opens - a[1].opens)
      .slice(0, 5)
      .map(([question, data]) => ({
        question,
        opens: data.opens,
      }));

    // Daily submissions
    const dailySubmissions: Record<string, number> = {};
    domainSubmissions.forEach((event) => {
      const date = new Date(event.created_at).toISOString().split("T")[0];
      dailySubmissions[date] = (dailySubmissions[date] || 0) + 1;
    });

    return NextResponse.json({
      timeframe,
      metrics: {
        totalSubmissions: submissionCount,
        totalMockupViews: mockupViewCount,
        totalStorefrontClicks: storefrontClickCount,
        totalFaqOpens: faqOpens.length,
        submissionToMockupRate: parseFloat(submissionToMockupRate),
        submissionToStorefrontRate: parseFloat(submissionToStorefrontRate),
        utmSourceBreakdown: Object.entries(utmSourceBreakdown).map(
          ([source, data]) => ({
            source,
            submissions: data.count,
            conversions: data.conversions,
            conversionRate:
              data.count > 0
                ? ((data.conversions / data.count) * 100).toFixed(1)
                : "0.0",
          })
        ),
        abTestPerformance: Object.entries(abTestBreakdown).map(
          ([variant, data]) => ({
            variant,
            impressions: data.impressions,
            conversions: data.conversions,
            conversionRate:
              data.impressions > 0
                ? ((data.conversions / data.impressions) * 100).toFixed(1)
                : "0.0",
          })
        ),
        topFaqs,
        dailySubmissions,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/analytics/metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
