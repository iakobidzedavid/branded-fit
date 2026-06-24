import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

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

  const { name, email, company, source } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 422 });
  }
  if (
    typeof email !== "string" ||
    !email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 422 });
  }
  if (typeof company !== "string" || !company.trim()) {
    return NextResponse.json({ error: "Company is required" }, { status: 422 });
  }

  const emailStr = email.trim().toLowerCase();
  const domainMatch = emailStr.match(/@(.+)$/);
  const emailDomain = domainMatch ? domainMatch[1] : "";

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("demo_requests")
    .insert({
      name: name.trim(),
      email: emailStr,
      company: company.trim(),
      domain: emailDomain,
      source: typeof source === "string" && source.trim() ? source.trim() : "homepage",
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("demo-request insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const nameStr = (name as string).trim();
  const companyStr = (company as string).trim();

  const userEmailBody = [
    `Hi ${nameStr},`,
    ``,
    `Thanks for requesting a Branded Fit walkthrough for ${companyStr}!`,
    ``,
    `We'll send you a personalized email showing your company's domain mapped through:`,
    `  - AI brand extraction (colors, fonts, identity signals)`,
    `  - Curated product catalog (8–12 SKUs matched to your brand)`,
    `  - A complete Shopify storefront preview`,
    ``,
    `Expect it within 24 hours. Reply to this email with any questions.`,
    ``,
    `— Branded Fit`,
  ].join("\n");

  let messageId: string | null = null;
  let emailProvider: string | null = null;

  const resendKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM ?? "Branded Fit <onboarding@brandedfitco.com>";

  if (resendKey) {
    emailProvider = "resend";
    const result = await sendViaResend({
      apiKey: resendKey,
      from: emailFrom,
      to: emailStr,
      subject: `Your Branded Fit walkthrough for ${companyStr}`,
      text: userEmailBody,
    });
    messageId = result.messageId;
    if (result.error) console.error("resend demo-request error:", result.error);
    else console.log("resend demo-request sent, id:", result.messageId);
  } else {
    const [picaSecret, connectionKey, actionId] = await Promise.all([
      getAppConfig(supabase, "pica_secret"),
      getAppConfig(supabase, "pica_gmail_connection_key"),
      getAppConfig(supabase, "pica_gmail_action_id"),
    ]);
    if (picaSecret && connectionKey && actionId) {
      emailProvider = "pica_gmail";
      const result = await sendGmailViaPica({
        picaSecret,
        connectionKey,
        actionId,
        to: emailStr,
        subject: `Your Branded Fit walkthrough for ${companyStr}`,
        body: userEmailBody,
      });
      messageId = result.messageId;
      if (result.error) console.error("pica demo-request error:", result.error);
      else console.log("pica demo-request sent, gmail_message_id:", result.messageId);
    } else {
      console.warn("demo-request: no email credentials configured — email not sent");
    }
  }

  return NextResponse.json(
    {
      success: true,
      id: data.id,
      email: messageId
        ? { sent: true, provider: emailProvider, message_id: messageId }
        : { sent: false, provider: emailProvider, reason: "no_email_credentials" },
    },
    { status: 201 }
  );
}
