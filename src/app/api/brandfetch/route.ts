import { NextRequest, NextResponse } from "next/server";
import { BrandAssets } from "@/lib/supabase";

interface BrandfetchResponse {
  data?: {
    name?: string;
    colors?: { hex: string }[];
    logo?: { url?: string };
    logos?: { url?: string }[];
    description?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { message: "Domain is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.BRANDFETCH_API_KEY;
    if (!apiKey) {
      console.error("BRANDFETCH_API_KEY not configured");
      return NextResponse.json(
        { message: "Brand extraction service unavailable" },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Brandfetch failed for ${domain}:`,
        response.status,
        response.statusText
      );

      // Return sensible defaults if brand not found
      if (response.status === 404) {
        const defaults = generateDefaultBrandAssets(domain);
        return NextResponse.json({ assets: defaults });
      }

      return NextResponse.json(
        { message: `Brand not found for domain: ${domain}` },
        { status: 404 }
      );
    }

    const data: BrandfetchResponse = await response.json();

    const assets = extractBrandAssets(data, domain);
    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Brandfetch error:", error);
    return NextResponse.json(
      { message: "Failed to extract brand assets" },
      { status: 500 }
    );
  }
}

function generateDefaultBrandAssets(domain: string): BrandAssets {
  // Generate sensible defaults based on domain
  const hash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#d946ef", // fuchsia
    "#0ea5e9", // cyan
    "#14b8a6", // teal
  ];

  const primaryColor = colors[hash % colors.length];
  const secondaryColor = colors[(hash + 1) % colors.length];

  return {
    logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${domain}`,
    primaryColor,
    secondaryColor,
  };
}

function extractBrandAssets(data: BrandfetchResponse, domain: string): BrandAssets {
  const brandData = data.data;

  if (!brandData) {
    return generateDefaultBrandAssets(domain);
  }

  const primaryColor = brandData.colors?.[0]?.hex || "#6366f1";
  const secondaryColor = brandData.colors?.[1]?.hex || "#8b5cf6";
  const logoUrl =
    brandData.logo?.url ||
    brandData.logos?.[0]?.url ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${domain}`;

  return {
    logoUrl,
    primaryColor,
    secondaryColor,
    typography: brandData.description || undefined,
  };
}
