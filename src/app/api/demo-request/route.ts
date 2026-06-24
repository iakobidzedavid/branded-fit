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
  const nameStr = (name as string).trim();
  const companyStr = (company as string).trim();

  // Send confirmation email first — independent of Supabase so it always fires
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

  const emailResult = await sendViaGmail(
    emailStr,
    `Your Branded Fit walkthrough for ${companyStr}`,
    userEmailBody
  );

  if (emailResult.error) {
    console.error("pica demo-request email error:", emailResult.error);
  } else {
    console.log("pica demo-request sent, gmail_message_id:", emailResult.messageId);
  }

  // Persist to Supabase — non-blocking: failure is logged but does not block the response
  let recordId: string | null = null;
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("demo_requests")
      .insert({
        name: nameStr,
        email: emailStr,
        company: companyStr,
        domain: emailDomain,
        source: typeof source === "string" && source.trim() ? source.trim() : "homepage",
      })
      .select("id")
      .single();

    if (error) {
      console.error("demo-request insert error (non-blocking):", error);
    } else {
      recordId = data?.id ?? null;
    }
  } catch (err) {
    console.error("demo-request supabase error (non-blocking):", err);
  }

  return NextResponse.json(
    {
      success: true,
      id: recordId,
      email: emailResult.messageId
        ? { sent: true, provider: "pica_gmail", message_id: emailResult.messageId }
        : { sent: false, provider: "pica_gmail", reason: emailResult.error ?? "unknown" },
    },
    { status: 201 }
  );
}
