import { NextRequest, NextResponse } from "next/server";
import { createProvisioningStore } from "@/lib/supabase";

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

function validateDomainFormat(domain: string): boolean {
  const domainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
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
    if (!validateDomainFormat(cleanDomain)) {
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

    // Create provisioning store in database
    const result = await createProvisioningStore(cleanDomain);

    if (!result) {
      return NextResponse.json(
        { message: "Failed to create store" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        storeId: result.storeId,
        status: result.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Orchestration error:", error);
    return NextResponse.json(
      { message: "Orchestration failed" },
      { status: 500 }
    );
  }
}
