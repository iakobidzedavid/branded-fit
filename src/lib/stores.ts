import { getSupabase } from "./supabase";

export type StoreMetadata = {
  domain: string;
  shopify_store_id: string;
  shopify_store_url: string;
  shopify_api_token: string;
  status?: string;
};

export type Store = {
  id: string;
  domain: string;
  shopify_store_id: string;
  shopify_store_url: string;
  shopify_api_token: string;
  created_at: string;
  status: string;
};

export async function insertStoreMetadata(
  storeData: StoreMetadata
): Promise<Store | null> {
  try {
    const client = getSupabase();

    const { data, error } = await client
      .from("stores")
      .insert([
        {
          domain: storeData.domain,
          shopify_store_id: storeData.shopify_store_id,
          shopify_url: storeData.shopify_store_url,
          shopify_api_token: storeData.shopify_api_token,
          status: storeData.status || "draft",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting store metadata:", error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return mapRowToStore(data[0]);
  } catch (err) {
    console.error("Error in insertStoreMetadata:", err);
    return null;
  }
}

export async function getStoreByDomain(domain: string): Promise<Store | null> {
  try {
    const client = getSupabase();

    const { data, error } = await client
      .from("stores")
      .select("*")
      .eq("domain", domain)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching store by domain:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return mapRowToStore(data);
  } catch (err) {
    console.error("Error in getStoreByDomain:", err);
    return null;
  }
}

export async function updateStoreStatus(
  domain: string,
  status: string
): Promise<boolean> {
  try {
    const client = getSupabase();

    const { error } = await client
      .from("stores")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("domain", domain);

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

function mapRowToStore(row: Record<string, unknown>): Store {
  return {
    id: String(row.id),
    domain: String(row.domain),
    shopify_store_id: String(row.shopify_store_id || ""),
    shopify_store_url: String(row.shopify_url || ""),
    shopify_api_token: String(row.shopify_api_token || ""),
    created_at: String(row.created_at),
    status: String(row.status || "draft"),
  };
}
