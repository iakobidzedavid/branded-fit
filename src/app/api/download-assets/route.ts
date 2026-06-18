import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ message: "Domain is required" }, { status: 400 });
  }

  // In production this would create and stream a ZIP of brand assets
  // For now return a JSON manifest of what would be included
  return NextResponse.json({
    success: true,
    domain,
    message: "Asset download package prepared",
    assets: [
      { type: "logo", format: "svg", label: "Primary Logo (SVG)" },
      { type: "logo", format: "png", label: "Primary Logo (PNG)" },
      { type: "colors", format: "css", label: "Brand Color Variables" },
      { type: "mockups", format: "png", label: "Product Mockup Images" },
    ],
  });
}
