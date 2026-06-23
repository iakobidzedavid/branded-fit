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
    current_approach,
    team_size,
    annual_budget,
    cycles_per_year,
    biggest_pain,
    swag_score,
    estimated_waste_dollars,
    estimated_time_savings,
    roi_multiple,
    email,
  } = body as Record<string, unknown>;

  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from("swag_assessments")
    .insert({
      current_approach: typeof current_approach === "string" ? current_approach : null,
      team_size: typeof team_size === "number" ? team_size : null,
      annual_budget: typeof annual_budget === "number" ? annual_budget : null,
      cycles_per_year: typeof cycles_per_year === "number" ? cycles_per_year : null,
      biggest_pain: typeof biggest_pain === "string" ? biggest_pain : null,
      swag_score: typeof swag_score === "number" ? swag_score : null,
      estimated_waste_dollars:
        typeof estimated_waste_dollars === "number" ? estimated_waste_dollars : null,
      estimated_time_savings:
        typeof estimated_time_savings === "number" ? estimated_time_savings : null,
      roi_multiple: typeof roi_multiple === "number" ? roi_multiple : null,
      email: typeof email === "string" && email.trim() ? email.trim().toLowerCase() : null,
      source: "assessment-page",
    })
    .select("id, swag_score, created_at")
    .single();

  if (error) {
    console.error("swag_assessment insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send notification email via Pica/Gmail
  const [picaSecret, connectionKey, actionId, notificationEmail] = await Promise.all([
    getAppConfig(supabase, "pica_secret"),
    getAppConfig(supabase, "pica_gmail_connection_key"),
    getAppConfig(supabase, "pica_gmail_action_id"),
    getAppConfig(supabase, "notification_email"),
  ]);

  let notificationMessageId: string | null = null;
  let emailError: string | null = null;

  if (picaSecret && connectionKey && actionId && notificationEmail) {
    const scoreNum = typeof swag_score === "number" ? swag_score : 0;
    const roiStr =
      typeof roi_multiple === "number"
        ? `\n  ROI multiple: ${(roi_multiple as number).toFixed(1)}×`
        : "";
    const wasteStr =
      typeof estimated_waste_dollars === "number"
        ? `\n  Estimated annual waste: $${(estimated_waste_dollars as number).toLocaleString()}`
        : "";

    const notifResult = await sendGmailViaPica({
      picaSecret,
      connectionKey,
      actionId,
      to: notificationEmail,
      subject: `[BrandedFit] New Swag Health Check: score ${scoreNum}/100 — ${typeof email === "string" ? email.trim() : "anonymous"}`,
      body: [
        `New Swag Health Check assessment submitted via brandedfitco.com/assessment`,
        ``,
        `Email:         ${typeof email === "string" ? email.trim() : "(not provided)"}`,
        `Swag Score:    ${scoreNum}/100`,
        `Approach:      ${typeof current_approach === "string" ? current_approach : "(not provided)"}`,
        `Team size:     ${typeof team_size === "number" ? team_size : "(not provided)"}`,
        `Annual budget: ${typeof annual_budget === "number" ? `$${(annual_budget as number).toLocaleString()}` : "(not provided)"}`,
        `Biggest pain:  ${typeof biggest_pain === "string" ? biggest_pain : "(not provided)"}`,
        wasteStr,
        roiStr,
        ``,
        `Submitted at: ${data.created_at}`,
        `Record ID: ${data.id}`,
      ].join("\n"),
    });

    notificationMessageId = notifResult.messageId;
    emailError = notifResult.error;

    if (notifResult.error) {
      console.error("assessment notification email error:", notifResult.error);
    } else {
      console.log("assessment notification sent, gmail message_id:", notifResult.messageId);
    }
  } else {
    console.warn("assessment: Pica config missing from app_config — email not sent");
  }

  return NextResponse.json(
    {
      assessment: data,
      notification: notificationMessageId
        ? { sent: true, message_id: notificationMessageId }
        : { sent: false, reason: emailError ?? "config not found" },
    },
    { status: 201 }
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("swag_assessments")
    .select("id, swag_score, current_approach, team_size, annual_budget, cycles_per_year, biggest_pain, roi_multiple, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  return NextResponse.json({ assessment: data });
}
