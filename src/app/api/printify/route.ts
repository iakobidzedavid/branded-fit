import { NextRequest, NextResponse } from "next/server";
import { BrandAssets } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  markup: number;
  finalPrice: number;
  mockupUrl: string;
  variants: {
    color: string;
    size: string;
  }[];
}

const PRODUCT_TEMPLATES = [
  {
    id: "hoodie",
    name: "Premium Hoodie",
    description: "Comfortable, durable hoodie featuring your brand",
    basePrice: 18.5,
    colors: ["Black", "Navy", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "water-bottle",
    name: "Insulated Water Bottle",
    description: "Keep drinks cold for 24 hours, hot for 12",
    basePrice: 12.0,
    colors: ["White", "Black", "Steel Blue"],
    sizes: ["18oz", "24oz", "32oz"],
  },
  {
    id: "sticker-pack",
    name: "Brand Sticker Pack",
    description: "Premium vinyl stickers perfect for laptops and phones",
    basePrice: 3.5,
    colors: ["Glossy", "Matte"],
    sizes: ["4-pack", "8-pack"],
  },
];

const MARKUP_PERCENTAGE = 0.4; // 40% markup

function generateMockupUrl(
  productId: string,
  primaryColor: string,
  domain: string
): string {
  const colors = encodeURIComponent(primaryColor.replace("#", ""));
  const seed = encodeURIComponent(domain);
  const products: Record<string, string> = {
    hoodie: "https://api.dicebear.com/7.x/thumbs/svg?colors=primaryColor&seed=hoodie",
    "water-bottle":
      "https://api.dicebear.com/7.x/bottts/svg?colors=primaryColor&seed=bottle",
    "sticker-pack":
      "https://api.dicebear.com/7.x/shapes/svg?colors=primaryColor&seed=sticker",
  };

  return products[productId] || "https://via.placeholder.com/400x400";
}

export async function POST(request: NextRequest) {
  try {
    const { domain, brandAssets } = await request.json();

    if (!domain || !brandAssets) {
      return NextResponse.json(
        { message: "Domain and brandAssets are required" },
        { status: 400 }
      );
    }

    const assets: BrandAssets = brandAssets;
    const products: Product[] = [];

    for (const template of PRODUCT_TEMPLATES) {
      const basePrice = template.basePrice;
      const markupAmount = basePrice * MARKUP_PERCENTAGE;
      const finalPrice = basePrice + markupAmount;

      const variants = [];
      for (const color of template.colors) {
        for (const size of template.sizes) {
          variants.push({ color, size });
        }
      }

      products.push({
        id: template.id,
        name: template.name,
        description: template.description,
        basePrice,
        markup: markupAmount,
        finalPrice: parseFloat(finalPrice.toFixed(2)),
        mockupUrl: generateMockupUrl(template.id, assets.primaryColor, domain),
        variants: variants.slice(0, 5), // Limit to 5 variants per product
      });
    }

    return NextResponse.json({
      products,
      totalProducts: products.length,
      totalVariants: products.reduce((acc, p) => acc + p.variants.length, 0),
    });
  } catch (error) {
    console.error("Printify error:", error);
    return NextResponse.json(
      { message: "Failed to generate mockups" },
      { status: 500 }
    );
  }
}
