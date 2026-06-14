import { getSupabase } from "@/lib/supabase";

export async function emitEvent(
  eventName: string,
  eventData: Record<string, unknown>,
  customerId?: string
): Promise<boolean> {
  try {
    const client = getSupabase();
    const record: Record<string, unknown> = {
      event_name: eventName,
      event_data: eventData,
    };
    if (customerId != null) record.customer_id = customerId;
    const { error } = await client.from("analytics_events").insert([record]);
    if (error) {
      console.warn("emitEvent insert failed:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(
      "emitEvent error:",
      err instanceof Error ? err.message : String(err)
    );
    return false;
  }
}

export type FunnelEventType =
  | "domain_submitted"
  | "brand_extraction_started"
  | "brand_extraction_completed"
  | "mockup_generation_started"
  | "mockup_generation_completed"
  | "storefront_generation_started"
  | "storefront_generation_completed"
  | "storefront_published";

export type EventType =
  | FunnelEventType
  | "brand_extraction_failed"
  | "mockup_generation_failed"
  | "storefront_generation_failed"
  | "mockup_viewed"
  | "storefront_clicked"
  | "faq_opened"
  | "headline_variant_seen"
  | "pilot_checkout_viewed"
  | "brand_fidelity_feedback";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("bf_customer_id");
  if (!id) {
    id = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("bf_customer_id", id);
  }
  return id;
}

export interface TrackEventParams {
  event_name: string;
  session_id?: string;
  domain?: string;
  pipeline_stage?: string;
  duration_ms?: number;
  error_message?: string;
  user_id?: string;
  context?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export const trackEvent = async (params: TrackEventParams): Promise<void> => {
  try {
    const response = await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      console.error("Failed to track event:", response.statusText);
    }
  } catch (err) {
    console.error("Error tracking event:", err);
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
