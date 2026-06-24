import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { sendViaGmail } from "@/lib/pica-email";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { invites, store_name, storefront_id, invited_by } = body as Record<string, unknown>;

  if (!Array.isArray(invites) || invites.length === 0) {
    return NextResponse.json({ error: "invites array is required" }, { status: 422 });
  }

  type InviteInput = { email: string; role?: string };
  const validInvites: InviteInput[] = (invites as unknown[])
    .filter(
      (inv): inv is InviteInput =>
        typeof inv === "object" && inv !== null &&
        typeof (inv as Record<string, unknown>).email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(((inv as Record<string, unknown>).email as string).trim())
    )
    .map((inv) => ({
      email: (inv.email as string).trim().toLowerCase(),
      role: typeof inv.role === "string" ? inv.role.trim() : "viewer",
    }));

  if (validInvites.length === 0) {
    return NextResponse.json({ error: "No valid email addresses provided" }, { status: 422 });
  }

  const storeLabel = typeof store_name === "string" ? store_name.trim() : "your storefront";
  const sfId = typeof storefront_id === "string" ? storefront_id.trim() : null;
  const inviterName = typeof invited_by === "string" ? invited_by.trim() : "The Branded Fit team";

  const supabase = getServerSupabase();

  const rows = validInvites.map((inv) => ({
    email: inv.email,
    role: inv.role ?? "viewer",
    storefront_id: sfId,
    store_name: storeLabel,
    invited_by: inviterName,
    status: "pending",
  }));

  const { data, error } = await supabase
    .from("team_invites")
    .insert(rows)
    .select("id, email, role, store_name, status, created_at");

  if (error) {
    console.error("team_invites insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send invite emails to each recipient
  const emailResults = await Promise.all(
    validInvites.map((inv) =>
      sendViaGmail(
        inv.email,
        `You've been invited to ${storeLabel} on Branded Fit`,
        [
          `Hi there,`,
          ``,
          `${inviterName} has invited you to join "${storeLabel}" as a ${inv.role ?? "viewer"} on Branded Fit.`,
          ``,
          `Branded Fit is an AI-powered brand merchandise platform. Your role gives you access to view and manage storefront orders.`,
          ``,
          `To get started, reply to this email or visit https://branded-fit.vercel.app`,
          ``,
          `— Branded Fit`,
        ].join("\n")
      )
    )
  );

  const sent = emailResults.filter((r) => r.messageId).length;
  const failed = emailResults.filter((r) => r.error).length;
  const messageIds = emailResults.map((r) => r.messageId).filter(Boolean);

  return NextResponse.json(
    {
      success: true,
      invites: data ?? [],
      email_summary: { sent, failed },
      email_message_ids: messageIds,
      message: `${sent} invitation${sent !== 1 ? "s" : ""} sent successfully.`,
    },
    { status: 201 }
  );
}
