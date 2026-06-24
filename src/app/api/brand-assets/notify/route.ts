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

  const { name, email, company, domain } = body as Record<string, unknown>;

  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "email is required" }, { status: 422 });
  }
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 422 });
  }
  if (typeof company !== "string" || !company.trim()) {
    return NextResponse.json({ error: "company is required" }, { status: 422 });
  }

  const nameStr = name.trim();
  const emailStr = email.trim().toLowerCase();
  const companyStr = company.trim();
  const domainStr = typeof domain === "string" ? domain.trim() : "";

  // Persist the lead
  const supabase = getServerSupabase();
  const { data: lead, error: dbError } = await supabase
    .from("demo_requests")
    .insert({
      name: nameStr,
      email: emailStr,
      company: companyStr,
      domain: domainStr || null,
      source: "brand-assets-download",
    })
    .select("id, created_at")
    .single();

  if (dbError) {
    console.error("brand-assets/notify db error:", dbError);
    // non-fatal — still send email
  }

  // Send confirmation to the user
  const userBody = [
    `Hi ${nameStr},`,
    ``,
    `Your brand assets for ${companyStr} are ready to download!`,
    ``,
    `Your ZIP package includes:`,
    `  • SVG logo variants (primary and dark-background)`,
    `  • Brand color palette JSON (Tailwind tokens + raw hex)`,
    `  • README with regeneration instructions`,
    ``,
    `No personally identifiable information is included in the package.`,
    ``,
    `To re-download at any time, visit: https://branded-fit.vercel.app/brand-assets`,
    ``,
    `— Branded Fit`,
  ].join("\n");

  const userResult = await sendViaGmail(
    emailStr,
    `Your ${companyStr} brand assets are ready — Branded Fit`,
    userBody
  );

  // Notify the support team
  const notifyBody = [
    `Brand assets downloaded via Branded Fit`,
    ``,
    `Name:    ${nameStr}`,
    `Email:   ${emailStr}`,
    `Company: ${companyStr}`,
    `Domain:  ${domainStr || "(not provided)"}`,
    ``,
    `Lead ID: ${lead?.id ?? "n/a"}`,
    `Time:    ${lead?.created_at ?? new Date().toISOString()}`,
  ].join("\n");

  await sendViaGmail(
    SUPPORT_EMAIL,
    `[BrandedFit] Brand assets download: ${companyStr}`,
    notifyBody
  );

  return NextResponse.json(
    {
      success: true,
      messageId: userResult.messageId,
      message: `Confirmation email sent to ${emailStr}`,
      lead_id: lead?.id ?? null,
      email_error: userResult.error,
    },
    { status: 201 }
  );
}
