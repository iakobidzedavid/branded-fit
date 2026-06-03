
export interface ShopifyStoreConfig {
  name: string;
  currency: string;
  timezone: string;
  subdomain: string;
}

export interface ShopifyStoreProvisioningResult {
  storeId: string;
  storeName: string;
  storeUrl: string;
  accessToken: string;
  currency: string;
  timezone: string;
}

export interface ShopifyClient {
  provisionStore(
    config: ShopifyStoreConfig
  ): Promise<ShopifyStoreProvisioningResult>;
  getStoreInfo(accessToken: string): Promise<{
    id: string;
    name: string;
    email: string;
    myshopifyDomain: string;
  }>;
  updateStoreSettings(
    accessToken: string,
    config: Partial<ShopifyStoreConfig>
  ): Promise<boolean>;
}

class ShopifyAPIClient implements ShopifyClient {
  private accessToken: string;
  private shopName: string;

  constructor(accessToken: string, shopName: string) {
    if (!accessToken || !shopName) {
      throw new Error(
        "Shopify access token and shop name are required for initialization"
      );
    }
    this.accessToken = accessToken;
    this.shopName = shopName;
  }

  async getStoreInfo(
    accessToken: string
  ): Promise<{ id: string; name: string; email: string; myshopifyDomain: string }> {
    try {
      const response = await fetch(`https://${this.shopName}/admin/api/2024-01/shop.json`, {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": accessToken || this.accessToken,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch store info: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const shop = data.shop;

      return {
        id: shop.id,
        name: shop.name,
        email: shop.email,
        myshopifyDomain: shop.myshopify_domain,
      };
    } catch (error) {
      console.error("Error fetching store info:", error);
      throw error;
    }
  }

  async updateStoreSettings(
    accessToken: string,
    config: Partial<ShopifyStoreConfig>
  ): Promise<boolean> {
    try {
      const updatePayload: Record<string, unknown> = {};

      if (config.name) updatePayload.name = config.name;
      if (config.currency) updatePayload.currency = config.currency;
      if (config.timezone) updatePayload.timezone = config.timezone;

      if (Object.keys(updatePayload).length === 0) {
        return true;
      }

      const response = await fetch(
        `https://${this.shopName}/admin/api/2024-01/shop.json`,
        {
          method: "PUT",
          headers: {
            "X-Shopify-Access-Token": accessToken || this.accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shop: updatePayload }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update store settings: ${response.status} ${response.statusText}`
        );
      }

      return true;
    } catch (error) {
      console.error("Error updating store settings:", error);
      throw error;
    }
  }

  async provisionStore(
    config: ShopifyStoreConfig
  ): Promise<ShopifyStoreProvisioningResult> {
    try {
      // Validate subdomain format
      const subdomainPattern = /^[a-z0-9-]{3,32}$/i;
      if (!subdomainPattern.test(config.subdomain)) {
        throw new Error(
          "Subdomain must be 3-32 characters and contain only alphanumeric characters and hyphens"
        );
      }

      // Validate currency (ISO 4217 format)
      const currencyPattern = /^[A-Z]{3}$/;
      if (!currencyPattern.test(config.currency)) {
        throw new Error("Currency must be a valid ISO 4217 code (e.g., USD, EUR)");
      }

      // Get current shop info to verify token is valid
      const storeInfo = await this.getStoreInfo(this.accessToken);

      // Update store settings (name, currency, timezone)
      const settingsUpdated = await this.updateStoreSettings(this.accessToken, {
        name: config.name,
        currency: config.currency,
        timezone: config.timezone,
      });

      if (!settingsUpdated) {
        throw new Error("Failed to update store settings");
      }

      // Construct the store URL
      const storeUrl = `https://${config.subdomain}.myshopify.com`;

      return {
        storeId: storeInfo.id,
        storeName: config.name,
        storeUrl,
        accessToken: this.accessToken,
        currency: config.currency,
        timezone: config.timezone,
      };
    } catch (error) {
      console.error("Error provisioning store:", error);
      throw error;
    }
  }
}

export function createShopifyClient(
  accessToken: string,
  shopName: string
): ShopifyClient {
  return new ShopifyAPIClient(accessToken, shopName);
}

export async function validateShopifyToken(
  accessToken: string,
  shopName: string
): Promise<boolean> {
  try {
    const response = await fetch(`https://${shopName}/admin/api/2024-01/shop.json`, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error validating Shopify token:", error);
    return false;
  }
}

export function generateUniqueSubdomain(baseName: string): string {
  const sanitized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);

  const timestamp = Date.now().toString().slice(-4);
  return `${sanitized}-${timestamp}`;
}
