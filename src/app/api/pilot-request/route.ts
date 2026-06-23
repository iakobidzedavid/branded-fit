import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

async function getAppConfig(supabase: ReturnType<typeof getServerSupabase>, key: string): Promise<string | null> {
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
  const rawEmail = buildRawEmail({
    from: "me",
    to,
    subject,
    body,
  });

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

  // Insert pilot request
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
      current_approach: typeof current_approach === "string" && current_approach ? current_approach : null,
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

  // Fetch Pica credentials from app_config (stored in DB, not in code)
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
        ? `\n  Annual ROI value: $${roi_annual_value.toLocaleString()}\n  ROI multiple: ${(roi_multiple as number).toFixed(1)}×`
        : "";

    const notifResult = await sendGmailViaPica({
      picaSecret,
      connectionKey,
      actionId,
      to: notificationEmail,
      subject: `[BrandedFit] New pilot request: ${company.trim()} (${email.trim()})`,
      body: [
        `New pilot request received via brandedfitco.com/pilot`,
        ``,
        `Name:    ${name.trim()}`,
        `Email:   ${email.trim()}`,
        `Company: ${company.trim()}`,
        `Domain:  ${typeof domain === "string" ? domain.trim() : "(not provided)"}`,
        `Team size: ${typeof team_size === "number" ? team_size : "(not provided)"}`,
        `Annual swag budget: ${typeof annual_swag_budget === "number" ? `$${(annual_swag_budget as number).toLocaleString()}` : "(not provided)"}`,
        roiStr,
        ``,
        `Submitted at: ${data.created_at}`,
        `Record ID: ${data.id}`,
      ].join("\n"),
    });

    notificationMessageId = notifResult.messageId;
    emailError = notifResult.error;

    if (notifResult.error) {
      console.error("pilot notification email error:", notifResult.error);
    } else {
      console.log("pilot notification sent, gmail message_id:", notifResult.messageId);
    }
  } else {
    console.warn("pilot-request: Pica config missing from app_config — email not sent");
  }

  return NextResponse.json(
    {
      success: true,
      id: data.id,
      notification: notificationMessageId
        ? { sent: true, message_id: notificationMessageId }
        : { sent: false, reason: emailError ?? "config not found" },
    },
    { status: 201 }
  );
}
