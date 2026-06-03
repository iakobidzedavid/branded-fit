import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

function initializeSupabase(): SupabaseClient {
  if (supabase) return supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
}

export function getSupabase(): SupabaseClient {
  return initializeSupabase();
}

export type BrandAssets = {
  logoUrl: string;
  logoVector?: string;
  primaryColor: string;
  secondaryColor: string;
  typography?: string;
};

export type Store = {
  id: string;
  customerId?: string;
  domain: string;
  brandName: string;
  logoUrl: string;
  colors: BrandAssets;
  shopifyUrl?: string;
  mockupImages: Record<string, string>;
  createdAt: string;
  publishedAt?: string;
};

export async function getOrCreateStore(
  domain: string
): Promise<Store | null> {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from("stores")
      .select("*")
      .eq("domain", domain)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching store:", error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error("Error in getOrCreateStore:", err);
    return null;
  }
}

export async function createStore(
  domain: string,
  brandName: string,
  colors: BrandAssets,
  logoUrl: string,
  mockupImages: Record<string, string>
): Promise<Store | null> {
  try {
    const client = getSupabase();
    const { data, error } = await client.from("stores").insert([
      {
        domain,
        brand_name: brandName,
        colors,
        logo_url: logoUrl,
        mockup_images: mockupImages,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error creating store:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error("Error in createStore:", err);
    return null;
  }
}

export async function updateStoreWithShopifyUrl(
  domain: string,
  shopifyUrl: string
): Promise<boolean> {
  try {
    const client = getSupabase();
    const { error } = await client
      .from("stores")
      .update({ shopify_url: shopifyUrl })
      .eq("domain", domain);

    if (error) {
      console.error("Error updating store:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in updateStoreWithShopifyUrl:", err);
    return false;
  }
}

export async function publishStore(domain: string): Promise<boolean> {
  try {
    const client = getSupabase();
    const { error } = await client
      .from("stores")
      .update({ published_at: new Date().toISOString() })
      .eq("domain", domain);

    if (error) {
      console.error("Error publishing store:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in publishStore:", err);
    return false;
  }
}

export type BrandExtraction = {
  domain: string;
  colors: { hex: string; type?: string }[];
  logos: { url: string; type?: string }[];
  typography: { primary?: string; secondary?: string } | null;
  extraction_confidence_pct: number;
};

export async function storeBrandExtraction(
  domain: string,
  extraction: BrandExtraction
): Promise<boolean> {
  try {
    const client = getSupabase();
    const { error } = await client.from("brand_extracts").upsert(
      {
        domain,
        colors: extraction.colors,
        logos: extraction.logos,
        typography: extraction.typography,
        extracted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
      { onConflict: "domain" }
    );

    if (error) {
      console.error("Error storing brand extraction:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in storeBrandExtraction:", err);
    return false;
  }
}

export async function getBrandExtraction(
  domain: string
): Promise<BrandExtraction | null> {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from("brand_extracts")
      .select("*")
      .eq("domain", domain)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching brand extraction:", error);
      return null;
    }

    if (!data) return null;

    return {
      domain: data.domain,
      colors: data.colors || [],
      logos: data.logos || [],
      typography: data.typography || null,
      extraction_confidence_pct: data.extraction_confidence_pct || 0,
    };
  } catch (err) {
    console.error("Error in getBrandExtraction:", err);
    return null;
  }
}

export type ProductVariant = {
  color: string;
  size: string;
};

export type ProductPricing = {
  basePrice: number;
  markup: number;
  finalPrice: number;
};

export type Product = {
  id?: string;
  domain: string;
  sku: string;
  product_name: string;
  mockup_image_url: string;
  variants: ProductVariant[];
  pricing: ProductPricing;
  created_at?: string;
};

export async function storeProduct(product: Product): Promise<boolean> {
  try {
    const client = getSupabase();
    const { error } = await client.from("products").insert([
      {
        domain: product.domain,
        sku: product.sku,
        product_name: product.product_name,
        mockup_image_url: product.mockup_image_url,
        variants: product.variants,
        pricing: product.pricing,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error storing product:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in storeProduct:", err);
    return false;
  }
}

export async function getProductsByDomain(
  domain: string
): Promise<Product[] | null> {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("domain", domain);

    if (error) {
      console.error("Error fetching products:", error);
      return null;
    }

    return data || [];
  } catch (err) {
    console.error("Error in getProductsByDomain:", err);
    return null;
  }
}

export type Storefront = {
  id: string;
  domain: string;
  shopify_store_id: string;
  storefront_url: string;
  product_count: number;
  status: string;
  created_at: string;
};

export async function createStorefront(
  domain: string,
  shopifyStoreId: string,
  storefrontUrl: string,
  productCount: number,
  status: string = "draft"
): Promise<Storefront | null> {
  try {
    const client = getSupabase();
    const { data, error } = await client.from("storefronts").insert([
      {
        domain,
        shopify_store_id: shopifyStoreId,
        storefront_url: storefrontUrl,
        product_count: productCount,
        status,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error creating storefront:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error("Error in createStorefront:", err);
    return null;
  }
}

export async function getStorefrontByDomain(
  domain: string
): Promise<Storefront | null> {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from("storefronts")
      .select("*")
      .eq("domain", domain)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching storefront:", error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error("Error in getStorefrontByDomain:", err);
    return null;
  }
}

export async function updateStorefrontStatus(
  domain: string,
  status: string
): Promise<boolean> {
  try {
    const client = getSupabase();
    const { error } = await client
      .from("storefronts")
      .update({ status })
      .eq("domain", domain);

    if (error) {
      console.error("Error updating storefront status:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in updateStorefrontStatus:", err);
    return false;
  }
}

export async function createProvisioningStore(
  domain: string
): Promise<{ storeId: string; status: string } | null> {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from("stores")
      .insert([
        {
          domain,
          status: "provisioning",
          created_at: new Date().toISOString(),
        },
      ])
      .select("id, status");

    if (error) {
      console.error("Error creating provisioning store:", error);
      return null;
    }

    const record = data?.[0];
    if (!record) return null;

    return {
      storeId: record.id,
      status: record.status,
    };
  } catch (err) {
    console.error("Error in createProvisioningStore:", err);
    return null;
  }
}

export async function getStoreById(
  storeId: string
): Promise<{
  id: string;
  domain: string;
  status: string;
  brand_data: any;
  products_count: number;
  created_at: string;
} | null> {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from("stores")
      .select("id, domain, status, brand_data, products_count, created_at")
      .eq("id", storeId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching store:", error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error("Error in getStoreById:", err);
    return null;
  }
}

export async function updateStoreStatus(
  storeId: string,
  status: string,
  updates?: Partial<{
    brand_data: any;
    products_count: number;
    shopify_url: string;
  }>
): Promise<boolean> {
  try {
    const client = getSupabase();
    const updateData: any = { status };

    if (updates?.brand_data) updateData.brand_data = updates.brand_data;
    if (updates?.products_count !== undefined)
      updateData.products_count = updates.products_count;
    if (updates?.shopify_url) updateData.shopify_url = updates.shopify_url;

    const { error } = await client
      .from("stores")
      .update(updateData)
      .eq("id", storeId);

    if (error) {
      console.error("Error updating store status:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in updateStoreStatus:", err);
    return false;
  }
}
