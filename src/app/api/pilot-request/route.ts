import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { sendViaGmail } from "@/lib/pica-email";

const NOTIFICATION_EMAIL = "iakobidze94@gmail.com";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    name,
    email,
    company,
    domain,
    team_size,
    annual_swag_budget,
    swag_cycles_per_year,
    current_approach,
    roi_multiple,
    roi_annual_value,
  } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 422 });
  }
  if (
    typeof email !== "string" ||
    !email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json({ error: "Valid work email is required" }, { status: 422 });
  }
  if (typeof company !== "string" || !company.trim()) {
    return NextResponse.json({ error: "Company is required" }, { status: 422 });
  }

  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from("pilot_requests")
    .insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company.trim(),
      domain: typeof domain === "string" ? domain.trim() : null,
      team_size: typeof team_size === "number" ? team_size : null,
      annual_swag_budget: typeof annual_swag_budget === "number" ? annual_swag_budget : null,
      swag_cycles_per_year: typeof swag_cycles_per_year === "number" ? swag_cycles_per_year : 4,
      current_approach:
        typeof current_approach === "string" && current_approach ? current_approach : null,
      roi_multiple: typeof roi_multiple === "number" ? roi_multiple : null,
      roi_annual_value: typeof roi_annual_value === "number" ? roi_annual_value : null,
      source: "pilot-page",
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("pilot_request insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const nameStr = (name as string).trim();
  const emailStr = (email as string).trim().toLowerCase();
  const companyStr = (company as string).trim();
  const domainStr = typeof domain === "string" ? domain.trim() : "";
  const roiStr =
    typeof roi_annual_value === "number" && typeof roi_multiple === "number"
      ? `\n  Annual ROI value: $${(roi_annual_value as number).toLocaleString()}\n  ROI multiple: ${(roi_multiple as number).toFixed(1)}×`
      : "";

  const userEmailBody = [
    `Hi ${nameStr},`,
    ``,
    `Thanks for requesting a Branded Fit pilot for ${companyStr}!`,
    ``,
    `Here's what happens next:`,
    ``,
    `  24 hrs — We send you a one-page AI brand profile for ${domainStr || companyStr}`,
    `  48 hrs — Your branded Shopify storefront goes live with 8–12 curated products`,
    `  Day 3  — We email you a full walkthrough: catalog, redemption link, and first order guide`,
    `  Day 14 — First redemption report so you can see how your team responded`,
    ``,
    `Questions? Just reply to this email.`,
    ``,
    `— The Branded Fit Team`,
  ].join("\n");

  const founderEmailBody = [
    `New pilot request received via brandedfitco.com/pilot`,
    ``,
    `Name:    ${nameStr}`,
    `Email:   ${emailStr}`,
    `Company: ${companyStr}`,
    `Domain:  ${domainStr || "(not provided)"}`,
    `Team size: ${typeof team_size === "number" ? team_size : "(not provided)"}`,
    `Annual swag budget: ${
      typeof annual_swag_budget === "number"
        ? `$${(annual_swag_budget as number).toLocaleString()}`
        : "(not provided)"
    }`,
    roiStr,
    ``,
    `Submitted at: ${data.created_at}`,
    `Record ID: ${data.id}`,
  ].join("\n");

  // Send user confirmation and founder notification in parallel
  const [userResult, founderResult] = await Promise.all([
    sendViaGmail(
      emailStr,
      `Your Branded Fit pilot for ${companyStr} is confirmed`,
      userEmailBody
    ),
    sendViaGmail(
      NOTIFICATION_EMAIL,
      `[BrandedFit] New pilot request: ${companyStr} (${emailStr})`,
      founderEmailBody
    ),
  ]);

  if (userResult.error) {
    console.error("pica pilot user confirmation error:", userResult.error);
  } else {
    console.log("pica pilot user confirmation sent, gmail_message_id:", userResult.messageId);
  }

  if (founderResult.error) {
    console.error("pica pilot founder notification error:", founderResult.error);
  } else {
    console.log("pica pilot founder notification sent, gmail_message_id:", founderResult.messageId);
  }

  const emailSent = !!(userResult.messageId || founderResult.messageId);

  return NextResponse.json(
    {
      success: true,
      id: data.id,
      email: emailSent
        ? {
            sent: true,
            provider: "pica_gmail",
            user_confirmation_id: userResult.messageId ?? undefined,
            founder_notification_id: founderResult.messageId ?? undefined,
          }
        : {
            sent: false,
            provider: "pica_gmail",
            reason: userResult.error ?? founderResult.error ?? "unknown",
          },
    },
    { status: 201 }
  );
}
