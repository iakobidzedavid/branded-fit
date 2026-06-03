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
