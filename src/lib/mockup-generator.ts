import { ProductVariant, ProductPricing } from "./supabase";
import fs from "fs";
import path from "path";

export interface MockupGenerationInput {
  domain: string;
  colors: { hex: string; type?: string }[];
  logos: { url: string; type?: string }[];
}

export interface GeneratedMockup {
  sku: string;
  productName: string;
  mockupImageUrl: string;
  variants: ProductVariant[];
  pricing: ProductPricing;
}

const DEFAULT_SKUS = [
  {
    id: "heavyweight-tee",
    name: "Heavyweight Tee",
    basePrice: 19.99,
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "premium-hoodie",
    name: "Premium Hoodie",
    basePrice: 54.99,
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "dad-cap",
    name: "Dad Cap",
    basePrice: 17.99,
    sizes: ["One Size"],
  },
  {
    id: "tote",
    name: "Tote Bag",
    basePrice: 22.99,
    sizes: ["One Size"],
  },
  {
    id: "notebook",
    name: "Hardcover Notebook",
    basePrice: 14.99,
    sizes: ["One Size"],
  },
];

const MARKUP_PERCENTAGE = 0.4; // 40% markup

function generateMockupUrl(
  sku: string,
  colorIndex: number,
  domain: string
): string {
  const colorPalette = [
    "FF6B6B",
    "4ECDC4",
    "45B7D1",
    "96CEB4",
    "FFEAA7",
    "DDA15E",
    "BC6C25",
  ];

  const color = colorPalette[colorIndex % colorPalette.length];
  const encodedDomain = encodeURIComponent(domain);

  const mockupTemplates: Record<string, string> = {
    "heavyweight-tee": `https://api.dicebear.com/7.x/avataaars/svg?backgroundColor=${color}&seed=tee-${encodedDomain}-${colorIndex}`,
    "premium-hoodie": `https://api.dicebear.com/7.x/avataaars/svg?backgroundColor=${color}&seed=hoodie-${encodedDomain}-${colorIndex}`,
    "dad-cap": `https://api.dicebear.com/7.x/shapes/svg?backgroundColor=${color}&seed=cap-${encodedDomain}-${colorIndex}`,
    tote: `https://api.dicebear.com/7.x/thumbs/svg?backgroundColor=${color}&seed=tote-${encodedDomain}-${colorIndex}`,
    notebook: `https://api.dicebear.com/7.x/shapes/svg?backgroundColor=${color}&seed=notebook-${encodedDomain}-${colorIndex}`,
  };

  return (
    mockupTemplates[sku] ||
    `https://via.placeholder.com/400x400?text=${encodeURIComponent(sku)}`
  );
}

function generateVariants(
  sizes: string[],
  colorCount: number
): ProductVariant[] {
  const variants: ProductVariant[] = [];
  const colors = [
    "Black",
    "White",
    "Navy",
    "Red",
    "Forest Green",
    "Charcoal",
    "Heather Gray",
  ];

  for (let i = 0; i < Math.min(colorCount, colors.length); i++) {
    for (const size of sizes) {
      variants.push({
        color: colors[i],
        size,
      });
    }
  }

  return variants.slice(0, 15); // Limit to 15 variants per product
}

export async function generateMockups(
  input: MockupGenerationInput
): Promise<GeneratedMockup[]> {
  const colorCount = Math.min(input.colors.length || 3, 5); // 3-5 color variants
  const mockups: GeneratedMockup[] = [];

  for (const sku of DEFAULT_SKUS) {
    for (let colorIndex = 0; colorIndex < colorCount; colorIndex++) {
      const basePrice = sku.basePrice;
      const markupAmount = basePrice * MARKUP_PERCENTAGE;
      const finalPrice = basePrice + markupAmount;

      const mockupUrl = generateMockupUrl(sku.id, colorIndex, input.domain);

      mockups.push({
        sku: sku.id,
        productName: sku.name,
        mockupImageUrl: mockupUrl,
        variants: generateVariants(sku.sizes, colorCount),
        pricing: {
          basePrice,
          markup: markupAmount,
          finalPrice: parseFloat(finalPrice.toFixed(2)),
        },
      });
    }
  }

  return mockups;
}

export async function cacheMockupLocally(
  domain: string,
  mockupUrl: string,
  mockupIndex: number
): Promise<string | null> {
  try {
    // For local caching, we'll store a reference to the mockup
    // In a real implementation, this would download and cache the image
    const mockupsDir = path.join(process.cwd(), "public", "mockups");

    if (!fs.existsSync(mockupsDir)) {
      fs.mkdirSync(mockupsDir, { recursive: true });
    }

    // Create a JSON metadata file for the mockup reference
    const filename = `${domain}-${mockupIndex}.json`;
    const filepath = path.join(mockupsDir, filename);

    const metadata = {
      domain,
      mockupIndex,
      sourceUrl: mockupUrl,
      cachedAt: new Date().toISOString(),
      publicUrl: `/mockups/${filename}`,
    };

    fs.writeFileSync(filepath, JSON.stringify(metadata, null, 2));

    return `/mockups/${filename}`;
  } catch (err) {
    console.error("Error caching mockup locally:", err);
    return null;
  }
}

export function getCachedMockupUrl(
  domain: string,
  mockupIndex: number
): string | null {
  try {
    const mockupsDir = path.join(process.cwd(), "public", "mockups");
    const filename = `${domain}-${mockupIndex}.json`;
    const filepath = path.join(mockupsDir, filename);

    if (fs.existsSync(filepath)) {
      const metadata = JSON.parse(fs.readFileSync(filepath, "utf-8"));
      return metadata.sourceUrl || metadata.publicUrl || null;
    }

    return null;
  } catch (err) {
    console.error("Error retrieving cached mockup:", err);
    return null;
  }
}
