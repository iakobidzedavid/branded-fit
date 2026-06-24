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

  const { yourName, bossName, bossEmail, company, teamSize, currentTool, emailBody } =
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

  // Persist to Supabase
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
    console.error("boss-email-send insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Build the email to send to the boss
  const greeting = bossNameStr ? `Hi ${bossNameStr},` : "Hi,";
  const fromLine = yourNameStr ? `\n${yourNameStr}` : "";
  const teamLine = teamSizeStr ? ` across our ${teamSizeStr}-person team` : "";
  const toolLine = currentToolStr
    ? ` We're currently using ${currentToolStr}, but the cost, setup time, and redemption rates aren't where we need them to be.`
    : "";

  const body_text =
    typeof emailBody === "string" && emailBody.trim()
      ? emailBody.trim()
      : `${greeting}

I've been looking into ways to improve our swag program at ${companyStr}${teamLine}.${toolLine} I came across Branded Fit and think it's worth a serious look.

Here's the short version of why:

→ 8-minute setup: paste our domain, get a live, branded Shopify storefront. No design team or procurement needed.
→ AI-curated catalog: it matches products to our brand identity automatically — no manual browsing.
→ 85% employee redemption vs. the industry average of 38%. The difference is that employees self-select from a curated store instead of receiving company-chosen items.
→ $2,400/yr flat, zero markup on merchandise. Comparable platforms charge $6K–$12K/yr plus 15–25% on every order.

I already ran our numbers through their ROI calculator — we'd recover the subscription fee within the first swag cycle just from time savings and reduced waste.

Can I forward you an email walkthrough showing exactly what our storefront would look like? No call needed, just a quick look. Let me know if you'd like me to send it over.

Best,${fromLine}`;

  const result = await sendViaGmail(
    bossEmailStr,
    `Swag program idea — worth a quick look?`,
    body_text
  );

  if (result.error) {
    console.error("boss-email-send gmail error:", result.error);
  } else {
    console.log("boss-email-send sent, gmail_message_id:", result.messageId);
  }

  return NextResponse.json(
    {
      success: true,
      id: data?.id,
      email: result.messageId
        ? { sent: true, provider: "pica_gmail", message_id: result.messageId }
        : { sent: false, provider: "pica_gmail", reason: result.error ?? "unknown" },
    },
    { status: 201 }
  );
}
