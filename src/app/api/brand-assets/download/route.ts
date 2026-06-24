import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { getServerSupabase } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("storeId") ?? "default";
  const domain = searchParams.get("domain") ?? "";

  const supabase = getServerSupabase();

  // Read any stored brand data from storefront_previews (no PII)
  let brandName = "Your Brand";
  let brandColors = {
    primary: "#4f46e5",
    secondary: "#7c3aed",
    background: "#0d1f33",
  };

  if (domain) {
    const { data: preview } = await supabase
      .from("storefront_previews")
      .select("company_name, palette_index")
      .eq("domain", domain)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (preview?.company_name) brandName = preview.company_name;
  }

  const zip = new JSZip();

  // Logos folder — contains SVG placeholders (real logos would come from Brandfetch)
  const logosFolder = zip.folder("logos");
  if (logosFolder) {
    const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <rect width="200" height="60" rx="8" fill="${brandColors.primary}"/>
  <text x="100" y="38" font-family="system-ui,sans-serif" font-size="20" font-weight="700"
    fill="white" text-anchor="middle">${brandName.slice(0, 20)}</text>
</svg>`;
    logosFolder.file("logo-primary.svg", svgLogo);

    const svgDark = svgLogo.replace(brandColors.primary, brandColors.background);
    logosFolder.file("logo-dark-bg.svg", svgDark);
  }

  // Palette JSON (no PII — only brand data)
  const paletteData = {
    brand: brandName,
    domain: domain || null,
    store_id: storeId,
    extracted_at: new Date().toISOString(),
    colors: brandColors,
    tailwind_tokens: {
      "brand-primary": brandColors.primary,
      "brand-secondary": brandColors.secondary,
      "brand-bg": brandColors.background,
    },
  };
  zip.file("palette.json", JSON.stringify(paletteData, null, 2));

  zip.file(
    "README.txt",
    [
      "Branded Fit — Brand Assets (No PII)",
      "=====================================",
      "",
      `Brand:   ${brandName}`,
      `Domain:  ${domain || "(not specified)"}`,
      `Created: ${new Date().toISOString()}`,
      "",
      "Contents:",
      "  logos/              — SVG logo variants (primary, dark-bg)",
      "  palette.json        — Brand color tokens (Tailwind + raw hex)",
      "",
      "No personally identifiable information is included in this package.",
      "To regenerate: visit your Branded Fit Command Console.",
    ].join("\n")
  );

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

  return new NextResponse(zipBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="brand-assets-${domain || storeId}.zip"`,
      "Content-Length": String(zipBuffer.byteLength),
    },
  });
}
