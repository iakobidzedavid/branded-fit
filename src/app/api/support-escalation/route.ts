import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { sendViaGmail } from "@/lib/pica-email";

const SUPPORT_EMAIL = "iakobidze94@gmail.com";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { domain, error_details, contact_email } = body as Record<string, unknown>;

  if (typeof domain !== "string" || !domain.trim()) {
    return NextResponse.json({ error: "domain is required" }, { status: 422 });
  }

  const domainStr = domain.trim();
  const errorStr = typeof error_details === "string" ? error_details.trim() : "";
  const contactEmail = typeof contact_email === "string" ? contact_email.trim() : "";

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("support_escalations")
    .insert({ domain: domainStr, error_details: errorStr, contact_email: contactEmail })
    .select("id, domain, status, created_at")
    .single();

  if (error) {
    console.error("support_escalation insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Notify support team
  const supportBody = [
    `Support escalation received via Branded Fit`,
    ``,
    `Domain:         ${domainStr}`,
    `Error Details:  ${errorStr || "(none provided)"}`,
    `Contact Email:  ${contactEmail || "(not provided)"}`,
    ``,
    `Escalation ID: ${data.id}`,
    `Submitted at:  ${data.created_at}`,
  ].join("\n");

  const teamNotify = await sendViaGmail(
    SUPPORT_EMAIL,
    `[BrandedFit Support] Escalation: ${domainStr}`,
    supportBody
  );

  // Confirm to user if email provided
  let userNotify: { messageId: string | null; error: string | null } = { messageId: null, error: null };
  if (contactEmail) {
    const confirmBody = [
      `Hi there,`,
      ``,
      `We've received your support request for domain: ${domainStr}`,
      ``,
      `${errorStr ? `Issue reported: ${errorStr}` : ""}`,
      ``,
      `Our team has been notified and will follow up by email within 4 business hours.`,
      ``,
      `Reference: ${data.id}`,
      ``,
      `— Branded Fit Support`,
    ]
      .filter((l) => l !== undefined)
      .join("\n");

    userNotify = await sendViaGmail(
      contactEmail,
      `Branded Fit support request received (${domainStr})`,
      confirmBody
    );
  }

  const messageIds = [teamNotify.messageId, userNotify.messageId].filter(Boolean);

  return NextResponse.json(
    {
      success: true,
      escalation: data,
      message: "Support team notified. You will receive an email follow-up.",
      email_message_ids: messageIds,
      support_email_id: teamNotify.messageId,
      user_email_id: userNotify.messageId,
    },
    { status: 201 }
  );
}
