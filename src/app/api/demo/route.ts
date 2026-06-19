import { NextRequest, NextResponse } from "next/server";
import { appendFileSync } from "fs";
import { join } from "path";

type DemoRequest = {
  name: string;
  email: string;
  company: string;
  submittedAt: string;
};

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, company } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 422 });
  }
  if (typeof email !== "string" || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid work email is required" }, { status: 422 });
  }
  if (typeof company !== "string" || !company.trim()) {
    return NextResponse.json({ error: "Company is required" }, { status: 422 });
  }

  const entry: DemoRequest = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    company: company.trim(),
    submittedAt: new Date().toISOString(),
  };

  // Append to a log file so submissions persist within the process lifetime.
  // On Vercel /tmp is writable; in production replace with a database or email service.
  try {
    const logPath = join(process.env.DEMO_LOG_PATH ?? "/tmp", "demo-requests.ndjson");
    appendFileSync(logPath, JSON.stringify(entry) + "\n", "utf8");
  } catch {
    // Log failure is non-fatal — submission still succeeds
    console.error("demo: failed to write log entry", entry);
  }

  console.log("demo request received:", JSON.stringify(entry));

  return NextResponse.json({ success: true }, { status: 201 });
}
