import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

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

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    domain,
    company_name,
    email,
    name,
    team_size,
    annual_budget,
    cycles_per_year,
    hours_per_cycle,
    roi_multiple,
    roi_annual_value,
    time_savings,
    waste_savings,
    palette_index,
  } = body as Record<string, unknown>;

  if (typeof domain !== "string" || !domain.trim()) {
    return NextResponse.json({ error: "Domain is required" }, { status: 422 });
  }
  if (typeof company_name !== "string" || !company_name.trim()) {
    return NextResponse.json({ error: "Company name is required" }, { status: 422 });
  }
  if (
    typeof email !== "string" ||
    !email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return NextResponse.json({ error: "Valid work email is required" }, { status: 422 });
  }

  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from("roi_reports")
    .insert({
      domain: domain.trim().toLowerCase(),
      company_name: company_name.trim(),
      email: email.trim().toLowerCase(),
      name: typeof name === "string" && name.trim() ? name.trim() : null,
      team_size: typeof team_size === "number" ? team_size : null,
      annual_budget: typeof annual_budget === "number" ? annual_budget : null,
      cycles_per_year: typeof cycles_per_year === "number" ? cycles_per_year : 4,
      hours_per_cycle: typeof hours_per_cycle === "number" ? hours_per_cycle : 11,
      roi_multiple: typeof roi_multiple === "number" ? roi_multiple : null,
      roi_annual_value: typeof roi_annual_value === "number" ? roi_annual_value : null,
      time_savings: typeof time_savings === "number" ? time_savings : null,
      waste_savings: typeof waste_savings === "number" ? waste_savings : null,
      palette_index: typeof palette_index === "number" ? palette_index : 0,
      source: "roi-report",
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("roi_report insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send founder notification email via Pica (non-blocking, best-effort)
  const [picaSecret, connectionKey, actionId, notificationEmail] = await Promise.all([
    getAppConfig(supabase, "pica_secret"),
    getAppConfig(supabase, "pica_gmail_connection_key"),
    getAppConfig(supabase, "pica_gmail_action_id"),
    getAppConfig(supabase, "notification_email"),
  ]);

  let notificationMessageId: string | null = null;
  let emailError: string | null = null;

  if (picaSecret && connectionKey && actionId && notificationEmail) {
    const roiStr =
      typeof roi_annual_value === "number" && typeof roi_multiple === "number"
        ? `\n  Annual ROI value: $${(roi_annual_value as number).toLocaleString()}\n  ROI multiple: ${(roi_multiple as number).toFixed(1)}×`
        : "";

    const notifResult = await sendGmailViaPica({
      picaSecret,
      connectionKey,
      actionId,
      to: notificationEmail,
      subject: `[BrandedFit] New ROI report: ${company_name.trim()} (${email.trim()})`,
      body: [
        `New ROI report generated via brandedfitco.com/roi-report`,
        ``,
        `Name:      ${typeof name === "string" && name.trim() ? name.trim() : "(not provided)"}`,
        `Email:     ${email.trim()}`,
        `Company:   ${company_name.trim()}`,
        `Domain:    ${domain.trim()}`,
        `Team size: ${typeof team_size === "number" ? team_size : "(not provided)"}`,
        `Budget:    ${typeof annual_budget === "number" ? `$${(annual_budget as number).toLocaleString()}/yr` : "(not provided)"}`,
        `Cycles:    ${typeof cycles_per_year === "number" ? cycles_per_year : "(not provided)"}/yr`,
        roiStr,
        ``,
        `Report URL: /roi-report/${data.id}`,
        `Submitted:  ${data.created_at}`,
      ].join("\n"),
    });

    notificationMessageId = notifResult.messageId;
    emailError = notifResult.error;

    if (notifResult.error) {
      console.error("roi-report notification email error:", notifResult.error);
    } else {
      console.log("roi-report notification sent, gmail message_id:", notifResult.messageId);
    }
  } else {
    console.warn("roi-report: Pica config missing from app_config — email not sent");
  }

  return NextResponse.json(
    {
      success: true,
      report: { id: data.id, created_at: data.created_at },
      notification: notificationMessageId
        ? { sent: true, message_id: notificationMessageId }
        : { sent: false, reason: emailError ?? "config not found" },
    },
    { status: 201 }
  );
}
