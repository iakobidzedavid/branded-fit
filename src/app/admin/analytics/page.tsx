import FunnelChart, { FunnelEntry } from "@/components/FunnelChart";
import TimeSeriesChart, {
  HourlyDataPoint,
  EventSeries,
} from "@/components/TimeSeriesChart";
import EventSummaryCards, {
  EventTypeCount,
} from "@/components/EventSummaryCards";

const FUNNEL_DATA: FunnelEntry[] = [
  {
    stage: "domain_submitted",
    label: "Domain Submitted",
    count: 28,
    conversionRate: 100,
    color: "#a855f7",
  },
  {
    stage: "brand_extraction_complete",
    label: "Brand Extracted",
    count: 21,
    conversionRate: 75,
    color: "#3b82f6",
  },
  {
    stage: "mockup_generation_complete",
    label: "Mockup Generated",
    count: 16,
    conversionRate: 76,
    color: "#10b981",
  },
  {
    stage: "storefront_generation_complete",
    label: "Storefront Created",
    count: 12,
    conversionRate: 75,
    color: "#f59e0b",
  },
  {
    stage: "user_clicks_publish",
    label: "Store Viewed",
    count: 8,
    conversionRate: 67,
    color: "#ec4899",
  },
];

const HOURLY_DATA: HourlyDataPoint[] = [
  { hour: "08:00", domain_submitted: 1, brand_extraction_complete: 0, mockup_generation_complete: 0, storefront_generation_complete: 0, user_clicks_publish: 0 },
  { hour: "09:00", domain_submitted: 3, brand_extraction_complete: 1, mockup_generation_complete: 0, storefront_generation_complete: 0, user_clicks_publish: 0 },
  { hour: "10:00", domain_submitted: 5, brand_extraction_complete: 3, mockup_generation_complete: 2, storefront_generation_complete: 0, user_clicks_publish: 0 },
  { hour: "11:00", domain_submitted: 4, brand_extraction_complete: 4, mockup_generation_complete: 2, storefront_generation_complete: 1, user_clicks_publish: 0 },
  { hour: "12:00", domain_submitted: 2, brand_extraction_complete: 2, mockup_generation_complete: 3, storefront_generation_complete: 2, user_clicks_publish: 1 },
  { hour: "13:00", domain_submitted: 1, brand_extraction_complete: 2, mockup_generation_complete: 1, storefront_generation_complete: 2, user_clicks_publish: 1 },
  { hour: "14:00", domain_submitted: 4, brand_extraction_complete: 1, mockup_generation_complete: 2, storefront_generation_complete: 1, user_clicks_publish: 1 },
  { hour: "15:00", domain_submitted: 5, brand_extraction_complete: 3, mockup_generation_complete: 1, storefront_generation_complete: 1, user_clicks_publish: 2 },
  { hour: "16:00", domain_submitted: 3, brand_extraction_complete: 3, mockup_generation_complete: 2, storefront_generation_complete: 2, user_clicks_publish: 1 },
  { hour: "17:00", domain_submitted: 0, brand_extraction_complete: 2, mockup_generation_complete: 2, storefront_generation_complete: 1, user_clicks_publish: 1 },
  { hour: "18:00", domain_submitted: 0, brand_extraction_complete: 0, mockup_generation_complete: 1, storefront_generation_complete: 1, user_clicks_publish: 1 },
  { hour: "19:00", domain_submitted: 0, brand_extraction_complete: 0, mockup_generation_complete: 0, storefront_generation_complete: 1, user_clicks_publish: 0 },
];

const HOURLY_SERIES: EventSeries[] = [
  { key: "domain_submitted", label: "Domain Submitted", color: "#a855f7" },
  { key: "brand_extraction_complete", label: "Brand Extracted", color: "#3b82f6" },
  { key: "mockup_generation_complete", label: "Mockup Generated", color: "#10b981" },
  { key: "storefront_generation_complete", label: "Storefront Created", color: "#f59e0b" },
  { key: "user_clicks_publish", label: "Store Viewed", color: "#ec4899" },
];

const EVENT_TYPE_SUMMARY: EventTypeCount[] = [
  { type: "domain_submitted", label: "Domain Submitted", count: 28, color: "#a855f7" },
  { type: "brand_extraction_complete", label: "Brand Extracted", count: 21, color: "#3b82f6" },
  { type: "mockup_generation_complete", label: "Mockup Generated", count: 16, color: "#10b981" },
  { type: "storefront_generation_complete", label: "Storefront Created", count: 12, color: "#f59e0b" },
  { type: "user_clicks_publish", label: "Store Viewed", count: 8, color: "#ec4899" },
  { type: "mockup_viewed", label: "Mockup Viewed", count: 45, color: "#06b6d4" },
  { type: "storefront_clicked", label: "Storefront Clicked", count: 32, color: "#84cc16" },
  { type: "faq_opened", label: "FAQ Opened", count: 18, color: "#f97316" },
  { type: "headline_variant_seen", label: "Headline Variant Seen", count: 73, color: "#8b5cf6" },
  { type: "pilot_checkout_viewed", label: "Pilot Checkout Viewed", count: 12, color: "#14b8a6" },
];

const END_TO_END_RATE = Math.round(
  (FUNNEL_DATA[FUNNEL_DATA.length - 1].count / FUNNEL_DATA[0].count) * 100
);

export default function AdminAnalytics() {
  return (
    <div className="min-h-screen bg-bg text-text px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-text-muted mt-1 text-sm">
              Pipeline conversion funnel · Hourly event volume
            </p>
          </div>
          <span className="px-3 py-1 text-xs rounded-full border border-border text-text-muted">
            Mock data
          </span>
        </div>

        <div className="mb-8">
          <EventSummaryCards
            events={EVENT_TYPE_SUMMARY}
            endToEndRate={END_TO_END_RATE}
          />
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-6">Conversion Funnel</h2>
          <FunnelChart data={FUNNEL_DATA} />
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6">Hourly Event Volume</h2>
          <TimeSeriesChart data={HOURLY_DATA} series={HOURLY_SERIES} />
        </div>
      </div>
    </div>
  );
}
