import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServerSupabase } from "@/lib/supabase-server";

// ── Brand palette (deterministic by domain hash — matches /try page logic) ──
const BRAND_PALETTES = [
  { primary: "#4f46e5", secondary: "#818cf8", bg: "#eef2ff" },
  { primary: "#0891b2", secondary: "#67e8f9", bg: "#ecfeff" },
  { primary: "#059669", secondary: "#6ee7b7", bg: "#ecfdf5" },
  { primary: "#7c3aed", secondary: "#c4b5fd", bg: "#f5f3ff" },
  { primary: "#b45309", secondary: "#fcd34d", bg: "#fffbeb" },
  { primary: "#be185d", secondary: "#f9a8d4", bg: "#fdf2f8" },
  { primary: "#1d4ed8", secondary: "#93c5fd", bg: "#eff6ff" },
  { primary: "#047857", secondary: "#6ee7b7", bg: "#f0fdf4" },
];

function hashDomain(domain: string): number {
  let h = 0;
  for (let i = 0; i < domain.length; i++) {
    h = (h * 31 + domain.charCodeAt(i)) >>> 0;
  }
  return h;
}

const PRODUCTS = [
  { name: "Premium Hoodie", category: "Apparel", printMethod: "DTG", reorderRate: 87, price: 42 },
  { name: "Unisex Tee", category: "Apparel", printMethod: "Screen Print", reorderRate: 91, price: 28 },
  { name: "Quarter-Zip Fleece", category: "Apparel", printMethod: "Embroidery", reorderRate: 79, price: 58 },
  { name: "Canvas Tote Bag", category: "Accessories", printMethod: "DTG", reorderRate: 83, price: 18 },
  { name: "Insulated Tumbler", category: "Drinkware", printMethod: "Laser Engrave", reorderRate: 94, price: 36 },
  { name: "Snapback Cap", category: "Headwear", printMethod: "Embroidery", reorderRate: 82, price: 32 },
  { name: "Softcover Notebook", category: "Stationery", printMethod: "Full Cover Print", reorderRate: 76, price: 16 },
  { name: "Crew Socks", category: "Accessories", printMethod: "Knit", reorderRate: 88, price: 14 },
];

function getCategoryEmoji(category: string) {
  if (category === "Apparel") return "👕";
  if (category === "Drinkware") return "☕";
  if (category === "Headwear") return "🧢";
  if (category === "Stationery") return "📓";
  return "🎒";
}

async function getPreview(id: string) {
  const supabase = getServerSupabase();
  const { data } = await supabase
    .from("storefront_previews")
    .select("id, domain, company_name, palette_index, created_at")
    .eq("id", id)
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const preview = await getPreview(id);
  if (!preview) return { title: "Preview not found" };
  const name = preview.company_name ?? preview.domain;
  return {
    title: `${name} Branded Storefront — Branded Fit`,
    description: `See ${name}'s AI-curated on-brand merch store. Get a live, orderable storefront in 8 minutes with Branded Fit.`,
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const preview = await getPreview(id);

  if (!preview) {
    notFound();
  }

  const paletteIdx = preview.palette_index ?? (hashDomain(preview.domain) % BRAND_PALETTES.length);
  const palette = BRAND_PALETTES[paletteIdx % BRAND_PALETTES.length];
  const companyName = preview.company_name ?? (
    preview.domain.charAt(0).toUpperCase() + preview.domain.slice(1).split(".")[0]
  );

  return (
    <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
      {/* Context strip */}
      <div
        style={{
          padding: "1.25rem 0 0",
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <span>Shared by {companyName}&apos;s People Ops team</span>
        <span style={{ color: "var(--border)" }}>·</span>
        <span>AI-curated storefront preview</span>
        <span style={{ color: "var(--border)" }}>·</span>
        <Link href="/try" style={{ color: "var(--primary)", fontWeight: 500 }}>
          Generate your own →
        </Link>
      </div>

      {/* Preview header */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          background: palette.bg,
          border: `1px solid ${palette.primary}30`,
          borderRadius: "var(--radius-lg)",
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: palette.primary,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.25rem",
            }}
          >
            ✦ Storefront preview
          </div>
          <h1
            style={{
              fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {companyName}&apos;s Branded Storefront
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            AI-curated {PRODUCTS.length}-product store · Brand colors applied · Ready to launch
          </p>
        </div>
        <div
          style={{
            padding: "0.5rem 1rem",
            background: "rgba(0,0,0,0.06)",
            border: `1px solid ${palette.primary}30`,
            borderRadius: "var(--radius-md)",
            color: palette.primary,
            fontWeight: 600,
            fontSize: "0.85rem",
          }}
        >
          🔒 Preview mode
        </div>
      </div>

      {/* Mini storefront */}
      <div>
        {/* Storefront header */}
        <div
          style={{
            padding: "1.5rem",
            background: palette.primary,
            borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>
              {companyName} Store
            </div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginTop: "0.25rem" }}>
              On-brand merch for your team · {PRODUCTS.length} items available
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              padding: "0.375rem 0.75rem",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.8rem",
              color: "white",
              fontWeight: 600,
            }}
          >
            ✓ Quality-verified catalog
          </div>
        </div>

        {/* Product grid */}
        <div
          style={{
            padding: "1.5rem",
            background: palette.bg,
            borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
            border: `1px solid ${palette.primary}20`,
            borderTop: "none",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {PRODUCTS.map((product) => (
              <div
                key={product.name}
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    height: 110,
                    background: palette.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                  }}
                >
                  {getCategoryEmoji(product.category)}
                </div>
                <div style={{ padding: "0.75rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#111827", marginBottom: "0.25rem" }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                    ${product.price} / unit
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        color: "#374151",
                        background: "#f3f4f6",
                        borderRadius: 4,
                        padding: "0.15rem 0.4rem",
                      }}
                    >
                      {product.printMethod}
                    </span>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        color: palette.primary,
                        background: palette.bg,
                        borderRadius: 4,
                        padding: "0.15rem 0.4rem",
                      }}
                    >
                      {product.reorderRate}% reorder
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.875rem 1rem",
              background: "white",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              display: "flex",
              gap: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <span>✓ <strong>7 of 8 items</strong> sample-reviewed by Branded Fit</span>
            <span>✓ <strong>Zero markup</strong> — you pay Printify cost only</span>
            <span>✓ <strong>Ships direct</strong> to each employee address</span>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div
        style={{
          padding: "3rem",
          background: "var(--primary)",
          borderRadius: "var(--radius-lg)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-block",
              padding: "0.3rem 0.875rem",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              borderRadius: 20,
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Get this live
          </div>
          <h2
            style={{
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              fontWeight: 800,
              color: "white",
              marginBottom: "0.75rem",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Ready to launch {companyName}&apos;s real storefront?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
            This preview becomes a live, orderable Shopify storefront — in 48 hours.
            $2,400/yr flat. Zero merchandise markup. Cancel anytime.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/demo"
              style={{
                display: "inline-block",
                padding: "0.875rem 1.75rem",
                background: "white",
                color: "var(--primary)",
                borderRadius: "var(--radius-md)",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              Book a 15-min call →
            </Link>
            <Link
              href="/try"
              style={{
                display: "inline-block",
                padding: "0.875rem 1.5rem",
                background: "transparent",
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.5)",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              Generate your own
            </Link>
          </div>
        </div>

        {/* Stats column */}
        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            minWidth: 180,
          }}
        >
          {[
            { stat: "8 min", label: "Domain to live storefront" },
            { stat: "85%", label: "Employee redemption rate" },
            { stat: "$0", label: "Merchandise markup" },
          ].map((item) => (
            <div key={item.stat} style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", lineHeight: 1 }}>
                {item.stat}
              </div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", marginTop: "0.2rem" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* For your boss link */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Need to get approval?{" "}
          <Link href="/for-your-boss" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Read the 2-minute case for your People Leader →
          </Link>
        </p>
      </div>
    </main>
  );
}
