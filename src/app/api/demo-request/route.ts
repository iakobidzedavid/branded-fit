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

  const result = await sendViaGmail(
    emailStr,
    `Your Branded Fit walkthrough for ${companyStr}`,
    userEmailBody
  );

  if (result.error) {
    console.error("pica demo-request email error:", result.error);
  } else {
    console.log("pica demo-request sent, gmail_message_id:", result.messageId);
  }

  return NextResponse.json(
    {
      success: true,
      id: data.id,
      email: result.messageId
        ? { sent: true, provider: "pica_gmail", message_id: result.messageId }
        : { sent: false, provider: "pica_gmail", reason: result.error ?? "unknown" },
    },
    { status: 201 }
  );
}
