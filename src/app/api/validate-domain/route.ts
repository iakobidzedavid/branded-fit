import { NextRequest, NextResponse } from "next/server";
import { getOrCreateStore } from "@/lib/supabase";

const CORPORATE_TLDS = new Set([
  "com",
  "io",
  "co",
  "org",
  "net",
  "dev",
  "app",
  "ai",
  "tech",
  "inc",
  "company",
]);

function isCorporateTLD(domain: string): boolean {
  const parts = domain.toLowerCase().split(".");
  if (parts.length < 2) return false;

  const tld = parts[parts.length - 1];
  return CORPORATE_TLDS.has(tld);
}

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { message: "Domain is required" },
        { status: 400 }
      );
    }

    const cleanDomain = domain.toLowerCase().trim();

    // Validate domain format
    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(cleanDomain)) {
      return NextResponse.json(
        { message: "Invalid domain format" },
        { status: 400 }
      );
    }

    // Check for corporate TLD
    if (!isCorporateTLD(cleanDomain)) {
      return NextResponse.json(
        {
          message:
            "Only corporate domains (.com, .io, .co, .org, etc.) are supported",
        },
        { status: 400 }
      );
    }

    // Check if domain has already been processed
    const existing = await getOrCreateStore(cleanDomain);
    if (existing) {
      return NextResponse.json(
        {
          message: "This domain has already been processed. Check your email for the storefront link.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Domain validation successful",
      domain: cleanDomain,
    });
  } catch (error) {
    console.error("Domain validation error:", error);
    return NextResponse.json(
      { message: "Validation failed" },
      { status: 500 }
    );
  }
}
