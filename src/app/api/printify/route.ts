import { NextRequest, NextResponse } from "next/server";
import {
  getBrandExtraction,
  storeProduct,
  Product,
  ProductVariant,
  ProductPricing,
} from "@/lib/supabase";

interface PrintifyTemplate {
  id: string;
  sku: string;
  name: string;
  description: string;
  basePriceCents: number;
  colors: string[];
  sizes: string[];
}

const PRINTIFY_TEMPLATES: PrintifyTemplate[] = [
  {
    id: "heavyweight-tee",
    sku: "HWT-001",
    name: "Heavyweight T-Shirt",
    description: "Premium quality 100% cotton heavyweight t-shirt",
    basePriceCents: 1200, // $12.00
    colors: ["Black", "White", "Navy", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "premium-hoodie",
    sku: "PHD-001",
    name: "Premium Hoodie",
    description: "Comfortable fleece-lined hoodie featuring your brand",
    basePriceCents: 1850, // $18.50
    colors: ["Black", "Navy", "Charcoal", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "dad-cap",
    sku: "DAD-001",
    name: "Dad Cap",
    description: "Classic unstructured dad cap with curved visor",
    basePriceCents: 650, // $6.50
    colors: ["Black", "White", "Navy", "Khaki"],
    sizes: ["One Size"],
  },
  {
    id: "tote-bag",
    sku: "TOT-001",
    name: "Tote Bag",
    description: "Durable canvas tote bag perfect for daily use",
    basePriceCents: 800, // $8.00
    colors: ["Natural", "Black", "Navy", "Olive"],
    sizes: ["One Size"],
  },
  {
    id: "notebook",
    sku: "NTB-001",
    name: "Branded Notebook",
    description: "Premium hardcover notebook with custom branding",
    basePriceCents: 900, // $9.00
    colors: ["Black", "Navy", "Burgundy", "Forest Green"],
    sizes: ["A5", "A4"],
  },
];

const MARKUP_PERCENTAGE = 0.4; // 40% markup

function generateMockupUrl(
  productId: string,
  primaryColor: string,
): string {
  const cleanColor = primaryColor.replace("#", "");

  const labels: Record<string, string> = {
    "heavyweight-tee": "T-Shirt",
    "premium-hoodie": "Hoodie",
    "dad-cap": "Cap",
    "tote-bag": "Tote",
    notebook: "Notebook",
  };
  const label = encodeURIComponent(labels[productId] ?? "Product");
  return `https://placehold.co/400x400/${cleanColor}/ffffff?text=${label}`;
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

    // Fetch extracted brand data from cache; fall back to defaults if unavailable
    const brandExtraction = await getBrandExtraction(normalizedDomain);
    const primaryColor = brandExtraction?.colors[0]?.hex ?? "#6366f1";

    const products: Product[] = [];

    // Generate products from templates
    for (const template of PRINTIFY_TEMPLATES) {
      const basePrice = template.basePriceCents / 100;
      const markupAmount = basePrice * MARKUP_PERCENTAGE;
      const finalPrice = basePrice + markupAmount;

      // Generate variants (limit to 5)
      const variants: ProductVariant[] = [];
      const colorLimit = Math.min(3, template.colors.length);
      const sizeLimit = Math.min(Math.ceil(5 / colorLimit), template.sizes.length);

      for (let i = 0; i < colorLimit; i++) {
        for (let j = 0; j < sizeLimit; j++) {
          if (variants.length < 5) {
            variants.push({
              color: template.colors[i],
              size: template.sizes[j],
            });
          }
        }
      }

      const pricing: ProductPricing = {
        basePrice,
        markup: parseFloat(markupAmount.toFixed(2)),
        finalPrice: parseFloat(finalPrice.toFixed(2)),
      };

      const mockupImageUrl = generateMockupUrl(template.id, primaryColor);

      const product: Product = {
        domain: normalizedDomain,
        sku: template.sku,
        product_name: template.name,
        mockup_image_url: mockupImageUrl,
        variants,
        pricing,
      };

      // Store in Supabase
      const stored = await storeProduct(product);
      if (!stored) {
        console.warn(
          `Failed to store product ${template.sku} for domain ${normalizedDomain}`
        );
      }

      products.push(product);
    }

    return NextResponse.json({
      success: true,
      domain: normalizedDomain,
      products,
      totalProducts: products.length,
      totalVariants: products.reduce((acc, p) => acc + p.variants.length, 0),
      brandColors: brandExtraction?.colors ?? [],
      brandLogos: brandExtraction?.logos ?? [],
      brandDataSource: brandExtraction ? "cached" : "defaults",
    });
  } catch (error) {
    console.error("Printify mockup generation error:", error);
    return NextResponse.json(
      { message: "Failed to generate mockups" },
      { status: 500 }
    );
  }
}
