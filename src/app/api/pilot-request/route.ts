import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

// ── Resend (primary email provider) ──────────────────────────────────────────

async function sendViaResend({
  apiKey,
  from,
  to,
  subject,
  text,
}: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
}): Promise<{ messageId: string | null; error: string | null }> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { messageId: null, error: `Resend ${res.status}: ${body.slice(0, 200)}` };
    }
    const data = (await res.json()) as { id?: string };
    return { messageId: data.id ?? null, error: null };
  } catch (err) {
    return { messageId: null, error: String(err) };
  }
}

// ── Pica Gmail (fallback — credentials stored in app_config) ─────────────────

async function getAppConfig(
  supabase: ReturnType<typeof getServerSupabase>,
  key: string
): Promise<string | null> {
  const { data } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", key)
    .single();
  return data?.value ?? null;
}

function buildRawEmail({
  to,
  from,
  subject,
  body,
}: {
  to: string;
  from: string;
  subject: string;
  body: string;
}): string {
  const raw =
    `From: ${from}\r\n` +
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    `Content-Type: text/plain; charset=utf-8\r\n` +
    `\r\n` +
    body;
  return Buffer.from(raw).toString("base64url");
}

async function sendGmailViaPica({
  picaSecret,
  connectionKey,
  actionId,
  to,
  subject,
  body,
}: {
  picaSecret: string;
  connectionKey: string;
  actionId: string;
  to: string;
  subject: string;
  body: string;
}): Promise<{ messageId: string | null; error: string | null }> {
  const rawEmail = buildRawEmail({ from: "me", to, subject, body });
  try {
    const res = await fetch(
      "https://api.picaos.com/v1/passthrough/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          "x-pica-secret": picaSecret,
          "x-pica-connection-key": connectionKey,
          "x-pica-action-id": actionId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: rawEmail, connectionKey }),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      return { messageId: null, error: `Pica ${res.status}: ${text.slice(0, 200)}` };
    }
    const data = (await res.json()) as { id?: string };
    return { messageId: data.id ?? null, error: null };
  } catch (err) {
    return { messageId: null, error: String(err) };
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

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

  // Persist pilot request to database
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

  // User confirmation email body
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

  // Founder notification email body
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

  let userEmailMessageId: string | null = null;
  let founderEmailMessageId: string | null = null;
  let emailProvider: string | null = null;
  let emailError: string | null = null;

  const resendKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM ?? "Branded Fit <onboarding@brandedfitco.com>";

  if (resendKey) {
    // Primary path: Resend
    emailProvider = "resend";

    // Send user confirmation
    const userResult = await sendViaResend({
      apiKey: resendKey,
      from: emailFrom,
      to: emailStr,
      subject: `Your Branded Fit pilot for ${companyStr} is confirmed`,
      text: userEmailBody,
    });
    userEmailMessageId = userResult.messageId;
    if (userResult.error) {
      console.error("resend user confirmation error:", userResult.error);
      emailError = userResult.error;
    } else {
      console.log("resend user confirmation sent, id:", userResult.messageId);
    }

    // Send founder notification
    const founderEmail = process.env.FOUNDER_EMAIL ?? emailFrom;
    const founderResult = await sendViaResend({
      apiKey: resendKey,
      from: emailFrom,
      to: founderEmail,
      subject: `[BrandedFit] New pilot request: ${companyStr} (${emailStr})`,
      text: founderEmailBody,
    });
    founderEmailMessageId = founderResult.messageId;
    if (founderResult.error) {
      console.error("resend founder notification error:", founderResult.error);
    } else {
      console.log("resend founder notification sent, id:", founderResult.messageId);
    }
  } else {
    // Fallback: Pica Gmail (credentials from app_config)
    const [picaSecret, connectionKey, actionId, notificationEmail] = await Promise.all([
      getAppConfig(supabase, "pica_secret"),
      getAppConfig(supabase, "pica_gmail_connection_key"),
      getAppConfig(supabase, "pica_gmail_action_id"),
      getAppConfig(supabase, "notification_email"),
    ]);

    if (picaSecret && connectionKey && actionId && notificationEmail) {
      emailProvider = "pica_gmail";

      const founderResult = await sendGmailViaPica({
        picaSecret,
        connectionKey,
        actionId,
        to: notificationEmail,
        subject: `[BrandedFit] New pilot request: ${companyStr} (${emailStr})`,
        body: founderEmailBody,
      });
      founderEmailMessageId = founderResult.messageId;
      if (founderResult.error) {
        console.error("pica founder notification error:", founderResult.error);
        emailError = founderResult.error;
      } else {
        console.log("pica founder notification sent, gmail_message_id:", founderResult.messageId);
      }
    } else {
      console.warn(
        "pilot-request: no email credentials configured (RESEND_API_KEY env var or pica app_config) — email not sent"
      );
      emailError = "no_email_credentials";
    }
  }

  const emailSent = !!(userEmailMessageId || founderEmailMessageId);

  return NextResponse.json(
    {
      success: true,
      id: data.id,
      email: emailSent
        ? {
            sent: true,
            provider: emailProvider,
            user_confirmation_id: userEmailMessageId ?? undefined,
            founder_notification_id: founderEmailMessageId ?? undefined,
          }
        : {
            sent: false,
            provider: emailProvider,
            reason: emailError ?? "no_email_credentials",
          },
    },
    { status: 201 }
  );
}
