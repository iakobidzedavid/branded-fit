import { NextRequest, NextResponse } from "next/server";
import { updateStoreStatus } from "@/lib/stores";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { domain } = body;

    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ message: "Domain is required" }, { status: 400 });
    }

    const cleanDomain = domain.toLowerCase().trim();
    await updateStoreStatus(cleanDomain, "published");

    return NextResponse.json({
      success: true,
      message: "Store published successfully",
    });
  } catch (err) {
    console.error("[Publish Store] Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to publish store" },
      { status: 500 }
    );
  }
}
