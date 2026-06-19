import { NextRequest, NextResponse } from "next/server";
import { appendFileSync } from "fs";
import { join } from "path";

type DemoRequest = {
  name: string;
  email: string;
  company: string;
  domain: string;
  source: string;
  submittedAt: string;
};

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
  if (typeof email !== "string" || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid work email is required" }, { status: 422 });
  }
  if (typeof company !== "string" || !company.trim()) {
    return NextResponse.json({ error: "Company is required" }, { status: 422 });
  }

  const emailStr = email.trim().toLowerCase();
  const domainMatch = emailStr.match(/@(.+)$/);
  const domain = domainMatch ? domainMatch[1] : "";

  const entry: DemoRequest = {
    name: name.trim(),
    email: emailStr,
    company: company.trim(),
    domain,
    source: typeof source === "string" ? source.trim() : "direct",
    submittedAt: new Date().toISOString(),
  };

  // Persist to NDJSON log — readable by the acquisition tracking sheet.
  // DEMO_LOG_PATH env var overrides default; on Vercel /tmp is writable per-instance.
  try {
    const logPath = join(process.env.DEMO_LOG_PATH ?? "/tmp", "demo-requests.ndjson");
    appendFileSync(logPath, JSON.stringify(entry) + "\n", "utf8");
  } catch {
    console.error("demo: failed to write log entry", entry);
  }

  // Send Gmail notification when NOTIFY_EMAIL is set.
  // Set NOTIFY_EMAIL=iakobidze94@gmail.com in your deployment environment.
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (notifyEmail) {
    try {
      await sendGmailNotification(notifyEmail, entry);
    } catch {
      // Notification failure is non-fatal
      console.error("demo: failed to send notification email");
    }
  }

  console.log("demo request received:", JSON.stringify(entry));

  return NextResponse.json({ success: true }, { status: 201 });
}

async function sendGmailNotification(to: string, entry: DemoRequest): Promise<void> {
  // Uses Gmail API via OAuth if GMAIL_ACCESS_TOKEN is set.
  // Obtain token via Google OAuth playground and set in deployment environment.
  const accessToken = process.env.GMAIL_ACCESS_TOKEN;
  if (!accessToken) return;

  const subject = `New demo request: ${entry.name} @ ${entry.company}`;
  const bodyText = [
    `New Branded Fit demo request`,
    ``,
    `Name:      ${entry.name}`,
    `Email:     ${entry.email}`,
    `Company:   ${entry.company}`,
    `Domain:    ${entry.domain}`,
    `Source:    ${entry.source}`,
    `Submitted: ${entry.submittedAt}`,
    ``,
    `Next step: record a 90-sec personalized Loom for ${entry.domain} and reply within 24h.`,
  ].join("\n");

  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    bodyText,
  ].join("\r\n");

  const encoded = Buffer.from(message).toString("base64url");

  await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: encoded }),
  });
}
