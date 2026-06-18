import { getSupabase } from "./supabase";

export type EventType =
  | "domain_submitted"
  | "mockup_viewed"
  | "storefront_clicked"
  | "faq_opened"
  | "headline_variant_seen"
  | "pilot_checkout_viewed";

export interface AnalyticsEvent {
  eventType: EventType;
  eventData: Record<string, unknown>;
  storeId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  abVariant?: string;
}

export const getUTMParams = (): {
  source?: string;
  medium?: string;
  campaign?: string;
} => {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") || undefined,
    medium: params.get("utm_medium") || undefined,
    campaign: params.get("utm_campaign") || undefined,
  };
};

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

export const trackEvent = async (event: AnalyticsEvent) => {
  try {
    const response = await fetch("/api/analytics/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      console.error("Failed to track event:", response.statusText);
    }
  } catch (error) {
    console.error("Error tracking event:", error);
  }
};

export const getHeadlineVariant = (
  variant: string
): { headline: string; subheadline: string } => {
  const variants = {
    A: {
      headline: "From Domain to Branded Drops in Minutes",
      subheadline:
        "Submit your company domain and see exactly how your brand would look on apparel—in minutes, not weeks.",
    },
    B: {
      headline: "Deploy Branded Swag in 10 Minutes",
      subheadline:
        "Zero design friction. Get custom mockups of your company merchandise instantly, then move straight to production.",
    },
    C: {
      headline: "Zero Design Friction. 100% Brand Fidelity.",
      subheadline:
        "Branded Fit extracts your exact brand palette and applies it perfectly. See results before committing.",
    },
  };

  return variants[variant as keyof typeof variants] || variants.A;
};
