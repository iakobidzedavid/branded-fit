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

  const { name, email, tier } = body as Record<string, unknown>;

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

  const nameStr = name.trim();
  const emailStr = email.trim().toLowerCase();
  const tierStr = typeof tier === "string" && tier.trim() ? tier.trim() : "Pricing";

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("waitlist_signups")
    .insert({ name: nameStr, email: emailStr })
    .select("id, name, email, created_at")
    .single();

  if (error) {
    console.error("waitlist insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userEmailBody = [
    `Hi ${nameStr},`,
    ``,
    `Thanks for your interest in Branded Fit!`,
    ``,
    `We'll email you within 24 hours with full pricing details and a personalized demo walkthrough for the ${tierStr} tier.`,
    ``,
    `Questions? Just reply to this email.`,
    ``,
    `— The Branded Fit Team`,
  ].join("\n");

  const notificationBody = [
    `New pricing inquiry via brandedfitco.com/pricing`,
    ``,
    `Name:  ${nameStr}`,
    `Email: ${emailStr}`,
    `Tier:  ${tierStr}`,
    ``,
    `Record ID: ${data.id}`,
    `Submitted at: ${data.created_at}`,
  ].join("\n");

  // Send confirmation to user and notification to founder in parallel
  const [userResult, founderResult] = await Promise.all([
    sendViaGmail(
      emailStr,
      `Your Branded Fit pricing request`,
      userEmailBody
    ),
    sendViaGmail(
      NOTIFICATION_EMAIL,
      `[BrandedFit] New pricing inquiry: ${nameStr} (${emailStr})`,
      notificationBody
    ),
  ]);

  if (userResult.error) {
    console.error("pica waitlist user email error:", userResult.error);
  } else {
    console.log("pica waitlist user email sent, gmail_message_id:", userResult.messageId);
  }

  if (founderResult.error) {
    console.error("pica waitlist founder notification error:", founderResult.error);
  } else {
    console.log("pica waitlist founder notification sent, gmail_message_id:", founderResult.messageId);
  }

  return NextResponse.json(
    {
      success: true,
      signup: data,
      email: userResult.messageId
        ? { sent: true, provider: "pica_gmail", message_id: userResult.messageId }
        : { sent: false, provider: "pica_gmail", reason: userResult.error ?? "unknown" },
    },
    { status: 201 }
  );
}

export async function GET() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("waitlist_signups")
    .select("id, name, email, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ signups: data });
}
