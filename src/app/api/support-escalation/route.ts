import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { domain, error } = body;

    // In production this would notify the support team via email/Slack
    console.log("[Support Escalation] Received request:", { domain, error });

    return NextResponse.json({
      success: true,
      message: "Support has been notified. We'll be in touch within 24 hours.",
      ticketId: `TICKET-${Date.now().toString(36).toUpperCase()}`,
    });
  } catch (err) {
    console.error("[Support Escalation] Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to submit support request" },
      { status: 500 }
    );
  }
}
