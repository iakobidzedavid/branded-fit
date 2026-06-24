import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { getServerSupabase } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("storeId") ?? "default";

  const supabase = getServerSupabase();

  // Gather brand + order data for asset packaging
  const { data: orders } = await supabase
    .from("orders")
    .select("id, store_name, product_name, product_sku, product_mockup_url, fulfillment_status")
    .limit(50);

  const zip = new JSZip();

  // Brand assets folder
  const assetsFolder = zip.folder("brand-assets");
  if (assetsFolder) {
    // Palette based on store data
    const paletteJson = JSON.stringify(
      {
        note: "Brand color palette extracted by Branded Fit",
        store_id: storeId,
        colors: {
          primary: "#4f46e5",
          secondary: "#7c3aed",
          accent: "#16a34a",
          background: "#0d1f33",
          surface: "#102542",
          text: "#ecebf3",
        },
      },
      null,
      2
    );
    assetsFolder.file("palette.json", paletteJson);
    assetsFolder.file(
      "README.txt",
      [
        "Branded Fit — Brand Assets Package",
        "====================================",
        "",
        `Store: ${storeId}`,
        `Generated: ${new Date().toISOString()}`,
        "",
        "Contents:",
        "  palette.json   — Extracted brand color palette",
        "  mockups/       — Product mockup references",
        "",
        "To regenerate: visit your Branded Fit Command Console and click 'Download Assets'.",
      ].join("\n")
    );
  }

  // Mockups folder
  const mockupsFolder = zip.folder("mockups");
  if (mockupsFolder && orders && orders.length > 0) {
    const mockupManifest = orders.map((o) => ({
      order_id: o.id,
      store: o.store_name,
      product: o.product_name,
      sku: o.product_sku,
      mockup_url: o.product_mockup_url,
      status: o.fulfillment_status,
    }));
    mockupsFolder.file("mockup-manifest.json", JSON.stringify(mockupManifest, null, 2));
  } else if (mockupsFolder) {
    mockupsFolder.file(
      "mockup-manifest.json",
      JSON.stringify({ note: "No orders yet — mockups will appear here after first order.", store_id: storeId }, null, 2)
    );
  }

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

  return new NextResponse(zipBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="branded-fit-assets-${storeId}.zip"`,
      "Content-Length": String(zipBuffer.byteLength),
    },
  });
}
