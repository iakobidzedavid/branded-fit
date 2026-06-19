import { NextRequest, NextResponse } from "next/server";
import { storeBrandExtraction, BrandExtraction } from "@/lib/supabase";

interface BrandfetchResponse {
  data?: {
    name?: string;
    colors?: { hex: string; type?: string }[];
    logo?: { url?: string };
    logos?: { url?: string; type?: string }[];
    fonts?: Array<{ name: string; origin: string }>;
  };
}

interface ExtractRequest {
  domain: string;
}

function generateDefaultColors(
  domain: string
): { hex: string; type?: string }[] {
  const hash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorPalette = [
    "#1a1a1a", // Dark gray/black
    "#666666", // Medium gray
    "#999999", // Light gray
    "#cccccc", // Very light gray
    "#ffffff", // White
  ];

  return colorPalette.slice(0, 3).map((hex) => ({
    hex,
    type: "generated",
  }));
}

function generateDefaultLogos(
  domain: string
): { url: string; type?: string }[] {
  return [
    {
      url: `https://api.dicebear.com/7.x/initials/svg?seed=${domain}`,
      type: "generated",
    },
  ];
}

function extractBrandAssets(
  data: BrandfetchResponse,
  domain: string,
  success: boolean
): {
  colors: { hex: string; type?: string }[];
  logos: { url: string; type?: string }[];
  typography: { primary?: string; secondary?: string } | null;
  confidence: number;
} {
  const brandData = data.data;

  if (!success || !brandData) {
    return {
      colors: generateDefaultColors(domain),
      logos: generateDefaultLogos(domain),
      typography: null,
      confidence: 0,
    };
  }

  // Extract colors with fallback to defaults
  const colors = brandData.colors
    ? brandData.colors.slice(0, 5).map((c) => ({
        hex: c.hex,
        type: c.type || "primary",
      }))
    : generateDefaultColors(domain);

  if (colors.length === 0) {
    colors.push(...generateDefaultColors(domain));
  }

  // Extract logos with fallback
  const logos: { url: string; type?: string }[] = [];

  if (brandData.logos && brandData.logos.length > 0) {
    brandData.logos.slice(0, 3).forEach((l) => {
      if (l.url) {
        logos.push({
          url: l.url,
          type: l.type || "primary",
        });
      }
    });
  }

  if (logos.length === 0 && brandData.logo?.url) {
    logos.push({
      url: brandData.logo.url,
      type: "primary",
    });
  }

  if (logos.length === 0) {
    logos.push(...generateDefaultLogos(domain));
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
  if (brandData.logo || brandData.logos) confidence += 15;
  if (brandData.fonts && brandData.fonts.length > 0) confidence += 20;

  return { colors, logos, typography, confidence };
}

export async function POST(request: NextRequest) {
  try {
    const body: ExtractRequest = await request.json();
    const { domain } = body;

    if (!domain || typeof domain !== "string" || domain.trim() === "") {
      return NextResponse.json(
        { error: "Valid domain is required" },
        { status: 400 }
      );
    }

    const normalizedDomain = domain.trim().toLowerCase();
    const apiKey = process.env.BRANDFETCH_API_KEY;

    if (!apiKey) {
      console.error("BRANDFETCH_API_KEY not configured");
      return NextResponse.json(
        { error: "Brand extraction service unavailable" },
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
      console.warn(`Brandfetch API call failed for ${normalizedDomain}:`, fetchErr);
    }

    // Extract brand assets with sensible defaults
    const { colors, logos, typography, confidence } = extractBrandAssets(
      brandfetchData,
      normalizedDomain,
      apiSuccess
    );

    const extraction: BrandExtraction = {
      domain: normalizedDomain,
      colors,
      logos,
      typography,
      extraction_confidence_pct: confidence,
    };

    // Store in Supabase
    const stored = await storeBrandExtraction(normalizedDomain, extraction);
    if (!stored) {
      console.warn(`Failed to store brand extraction for ${normalizedDomain}`);
    }

    return NextResponse.json(extraction, { status: 200 });
  } catch (error) {
    console.error("Brand extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract brand assets" },
      { status: 500 }
    );
  }
}
