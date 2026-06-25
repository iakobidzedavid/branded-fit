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

  const { yourName, bossName, bossEmail, company, teamSize, currentTool, emailBody, previewUrl } =
    body as Record<string, unknown>;

  if (typeof bossEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bossEmail.trim())) {
    return NextResponse.json({ error: "Valid boss email is required" }, { status: 422 });
  }

  const bossEmailStr = (bossEmail as string).trim().toLowerCase();
  const companyStr = typeof company === "string" && company.trim() ? company.trim() : "your company";
  const yourNameStr = typeof yourName === "string" ? yourName.trim() : "";
  const bossNameStr = typeof bossName === "string" ? bossName.trim() : "";
  const teamSizeStr = typeof teamSize === "string" ? teamSize.trim() : "";
  const currentToolStr = typeof currentTool === "string" ? currentTool.trim() : "";
  const emailDomain = bossEmailStr.split("@")[1] ?? "";

  // Build the email to send to the boss
  const greeting = bossNameStr ? `Hi ${bossNameStr},` : "Hi,";
  const fromLine = yourNameStr ? `\n${yourNameStr}` : "";
  const teamLine = teamSizeStr ? ` across our ${teamSizeStr}-person team` : "";
  const toolLine = currentToolStr
    ? ` We're currently using ${currentToolStr}, but the cost, setup time, and redemption rates aren't where we need them to be.`
    : "";

  const previewUrlStr = typeof previewUrl === "string" && previewUrl.trim() ? previewUrl.trim() : "";
  const previewLine = previewUrlStr
    ? `\nI already generated a storefront preview for ${companyStr} — you can see it here:\n→ ${previewUrlStr}\n`
    : "";

  const body_text =
    typeof emailBody === "string" && emailBody.trim()
      ? emailBody.trim()
      : `${greeting}

I've been looking into ways to improve our swag program at ${companyStr}${teamLine}.${toolLine} I came across Branded Fit and think it's worth a serious look.

Here's the short version of why:

→ 8-minute setup: paste our domain, get a live, branded Shopify storefront. No design team or procurement needed.
→ AI-curated catalog: it matches products to our brand identity automatically — no manual browsing.
→ Target redemption of 85% through self-selection — employees get what they actually want, vs. 55% for company-chosen programs.
→ $2,400/yr flat, zero markup on merchandise. Comparable platforms charge $6K–$12K/yr plus 15–25% on every order.
${previewLine}
I already ran our numbers through their ROI calculator — we'd recover the subscription fee within the first swag cycle just from time savings and reduced waste.

${previewUrlStr ? "Take a look at the preview above and let me know what you think. No call needed — they respond by email." : "Can I forward you an email walkthrough showing exactly what our storefront would look like? No call needed, just a quick look. Let me know if you'd like me to send it over."}

Best,${fromLine}`;

  const result = await sendViaGmail(
    bossEmailStr,
    `Swag program idea — worth a quick look?`,
    body_text
  );

  if (result.error) {
    console.error("boss-email-send gmail error:", result.error);
    return NextResponse.json(
      { error: `Email delivery failed: ${result.error}` },
      { status: 500 }
    );
  }

  console.log("boss-email-send sent, gmail_message_id:", result.messageId);

  // Persist to Supabase — non-blocking: failure does not prevent the email from being sent
  let recordId: string | null = null;
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("demo_requests")
      .insert({
        name: yourNameStr || `${companyStr} — boss email request`,
        email: bossEmailStr,
        company: companyStr,
        domain: emailDomain,
        source: "boss-email-send",
      })
      .select("id")
      .single();
    if (error) {
      console.error("boss-email-send insert error (non-blocking):", error);
    } else {
      recordId = data?.id ?? null;
    }
  } catch (err) {
    console.error("boss-email-send supabase error (non-blocking):", err);
  }

  return NextResponse.json(
    {
      success: true,
      id: recordId,
      email: { sent: true, provider: "pica_gmail", message_id: result.messageId },
    },
    { status: 201 }
  );
}
