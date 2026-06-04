import { NextRequest, NextResponse } from "next/server";
import { BrandAssets, storeBrandExtraction } from "@/lib/supabase";

interface BrandfetchLogoFormat {
  src: string;
  format: string;
}

interface BrandfetchLogo {
  type?: string;
  theme?: string;
  formats?: BrandfetchLogoFormat[];
  url?: string;
}

interface BrandfetchBrand {
  name?: string;
  colors?: { hex: string; type?: string }[];
  logos?: BrandfetchLogo[];
  fonts?: Array<{ name: string; origin: string }>;
  description?: string;
}

interface BrandfetchResponse {
  data?: BrandfetchBrand;
}

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();

    if (!domain || typeof domain !== "string" || domain.trim() === "") {
      return NextResponse.json(
        { message: "Domain is required" },
        { status: 400 }
      );
    }

    const normalizedDomain = domain.trim().toLowerCase();
    const apiKey = process.env.BRANDFETCH_API_KEY;

    if (!apiKey) {
      console.error("BRANDFETCH_API_KEY not configured");
      return NextResponse.json(
        { message: "Brand extraction service unavailable" },
        { status: 500 }
      );
    }

    // Fetch from Brandfetch API
    let apiSuccess = false;
    let brandfetchData: BrandfetchResponse = {};

    try {
      const response = await fetch(
        `https://api.brandfetch.io/v2/brands/${normalizedDomain}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        apiSuccess = true;
        brandfetchData = await response.json();
      } else {
        console.warn(
          `Brandfetch returned ${response.status} for ${normalizedDomain}`
        );
      }
    } catch (fetchErr) {
      console.warn(
        `Brandfetch API call failed for ${normalizedDomain}:`,
        fetchErr
      );
    }

    // Extract brand assets with sensible defaults
    const assets = extractBrandAssets(
      brandfetchData,
      normalizedDomain,
      apiSuccess
    );

    // Cache extraction in Supabase for future use (30-day cache)
    const colors = (assets as any).extractedColors || [];
    const logos = (assets as any).extractedLogos || [];
    const typography = (assets as any).extractedTypography || null;
    const confidence = (assets as any).confidence || 50;

    const stored = await storeBrandExtraction(normalizedDomain, {
      domain: normalizedDomain,
      colors,
      logos,
      typography,
      extraction_confidence_pct: confidence,
    });

    if (!stored) {
      console.warn(
        `Failed to cache brand extraction for ${normalizedDomain} in Supabase`
      );
    }

    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Brandfetch error:", error);
    return NextResponse.json(
      { message: "Failed to extract brand assets" },
      { status: 500 }
    );
  }
}

function generateDefaultBrandAssets(domain: string): any {
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
    extractedColors: [
      { hex: primaryColor, type: "primary" },
      { hex: secondaryColor, type: "secondary" },
    ],
    extractedLogos: [
      {
        url: `https://api.dicebear.com/7.x/initials/svg?seed=${domain}`,
        type: "generated",
      },
    ],
    confidence: 20,
  };
}

function extractBrandAssets(
  data: BrandfetchResponse,
  domain: string,
  success: boolean
): any {
  const brandData = data.data;

  if (!success || !brandData) {
    return generateDefaultBrandAssets(domain);
  }

  // Extract colors with fallback to defaults
  const colors = brandData.colors
    ? brandData.colors.slice(0, 5).map((c) => ({
        hex: c.hex,
        type: c.type || "primary",
      }))
    : [];

  if (colors.length === 0) {
    return generateDefaultBrandAssets(domain);
  }

  // Extract logos — Brandfetch v2 stores URLs inside a `formats` array
  const logos: { url: string; type?: string }[] = [];

  if (brandData.logos && brandData.logos.length > 0) {
    brandData.logos.slice(0, 3).forEach((l) => {
      let url: string | undefined;
      if (l.formats && l.formats.length > 0) {
        const svg = l.formats.find((f) => f.format === "svg" && f.src);
        url = svg?.src ?? l.formats.find((f) => f.src)?.src;
      }
      if (!url && l.url) url = l.url;
      if (url) logos.push({ url, type: l.type || "logo" });
    });
  }

  if (logos.length === 0) {
    logos.push({
      url: `https://api.dicebear.com/7.x/initials/svg?seed=${domain}`,
      type: "generated",
    });
  }

  // Extract typography information
  const typography =
    brandData.fonts && brandData.fonts.length > 0
      ? {
          primary: brandData.fonts[0].name,
          secondary:
            brandData.fonts.length > 1
              ? brandData.fonts[1].name
              : brandData.fonts[0].name,
        }
      : null;

  // Calculate confidence based on available data
  let confidence = 50; // Base confidence for API success
  if (brandData.colors && brandData.colors.length > 0) confidence += 15;
  if (brandData.logos && brandData.logos.length > 0) confidence += 15;
  if (brandData.fonts && brandData.fonts.length > 0) confidence += 20;

  const primaryColor = colors[0]?.hex || "#6366f1";
  const secondaryColor = colors[1]?.hex || "#8b5cf6";

  return {
    logoUrl: logos[0]?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${domain}`,
    primaryColor,
    secondaryColor,
    extractedColors: colors,
    extractedLogos: logos,
    extractedTypography: typography,
    confidence,
  };
}
