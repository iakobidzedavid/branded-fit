import {
  createShopifyClient,
  validateShopifyToken,
  generateUniqueSubdomain,
  ShopifyStoreConfig,
  ShopifyStoreProvisioningResult,
} from "./shopify";

async function testSubdomainGeneration() {
  console.log("\n=== Testing Subdomain Generation ===");

  const testCases = [
    { input: "my-brand", description: "Normal brand name" },
    { input: "My Brand Co.", description: "Brand with spaces and punctuation" },
    { input: "brand123", description: "Brand with numbers" },
    {
      input: "verylongbrandnamethatexceedsthirtytwocharacters",
      description: "Very long brand name",
    },
  ];

  for (const testCase of testCases) {
    const subdomain = generateUniqueSubdomain(testCase.input);
    console.log(
      `✓ ${testCase.description}: "${testCase.input}" → "${subdomain}"`
    );

    // Verify subdomain format
    if (!/^[a-z0-9-]{3,32}$/.test(subdomain)) {
      console.error(`✗ Invalid subdomain format: ${subdomain}`);
    }
  }
}

async function testTokenValidation() {
  console.log("\n=== Testing Token Validation ===");

  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const shopName = process.env.SHOPIFY_SHOP_NAME;

  if (!accessToken || !shopName) {
    console.log(
      "⚠ Skipping token validation test: SHOPIFY_ACCESS_TOKEN or SHOPIFY_SHOP_NAME not set"
    );
    return;
  }

  console.log(`Testing with shop: ${shopName}`);

  try {
    const isValid = await validateShopifyToken(accessToken, shopName);
    if (isValid) {
      console.log("✓ Token validation succeeded");
    } else {
      console.error("✗ Token validation failed");
    }
  } catch (error) {
    console.error("✗ Token validation error:", error);
  }
}

async function testClientInitialization() {
  console.log("\n=== Testing Client Initialization ===");

  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const shopName = process.env.SHOPIFY_SHOP_NAME;

  if (!accessToken || !shopName) {
    console.log(
      "⚠ Skipping client initialization test: SHOPIFY_ACCESS_TOKEN or SHOPIFY_SHOP_NAME not set"
    );
    return;
  }

  try {
    const client = createShopifyClient(accessToken, shopName);
    console.log("✓ Client created successfully");

    // Test getStoreInfo
    try {
      const storeInfo = await client.getStoreInfo(accessToken);
      console.log("✓ Retrieved store info:");
      console.log(`  - Store ID: ${storeInfo.id}`);
      console.log(`  - Store Name: ${storeInfo.name}`);
      console.log(`  - Email: ${storeInfo.email}`);
      console.log(`  - Myshopify Domain: ${storeInfo.myshopifyDomain}`);
    } catch (error) {
      console.error("✗ Failed to retrieve store info:", error);
    }
  } catch (error) {
    console.error("✗ Failed to create client:", error);
  }
}

async function testStoreProvisioning() {
  console.log("\n=== Testing Store Provisioning ===");

  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const shopName = process.env.SHOPIFY_SHOP_NAME;

  if (!accessToken || !shopName) {
    console.log(
      "⚠ Skipping store provisioning test: SHOPIFY_ACCESS_TOKEN or SHOPIFY_SHOP_NAME not set"
    );
    return;
  }

  try {
    const client = createShopifyClient(accessToken, shopName);

    const config: ShopifyStoreConfig = {
      name: "Branded Fit Test Store",
      currency: "USD",
      timezone: "America/New_York",
      subdomain: generateUniqueSubdomain("branded-fit-test"),
    };

    console.log("Provisioning store with config:");
    console.log(`  - Name: ${config.name}`);
    console.log(`  - Currency: ${config.currency}`);
    console.log(`  - Timezone: ${config.timezone}`);
    console.log(`  - Subdomain: ${config.subdomain}`);

    try {
      const result = await client.provisionStore(config);
      console.log("✓ Store provisioned successfully:");
      console.log(`  - Store ID: ${result.storeId}`);
      console.log(`  - Store Name: ${result.storeName}`);
      console.log(`  - Store URL: ${result.storeUrl}`);
      console.log(`  - Currency: ${result.currency}`);
      console.log(`  - Timezone: ${result.timezone}`);
      console.log(`  - Access Token: ${result.accessToken.slice(0, 20)}...`);
    } catch (error) {
      console.error("✗ Failed to provision store:", error);
    }
  } catch (error) {
    console.error("✗ Failed to create client:", error);
  }
}

async function testInvalidInputs() {
  console.log("\n=== Testing Invalid Input Handling ===");

  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const shopName = process.env.SHOPIFY_SHOP_NAME;

  if (!accessToken || !shopName) {
    console.log(
      "⚠ Skipping invalid input tests: SHOPIFY_ACCESS_TOKEN or SHOPIFY_SHOP_NAME not set"
    );
    return;
  }

  const client = createShopifyClient(accessToken, shopName);

  // Test invalid subdomain
  const invalidConfigs = [
    {
      config: {
        name: "Test",
        currency: "USD",
        timezone: "America/New_York",
        subdomain: "ab", // Too short
      },
      description: "Subdomain too short",
    },
    {
      config: {
        name: "Test",
        currency: "USD",
        timezone: "America/New_York",
        subdomain: "invalid_subdomain", // Invalid characters
      },
      description: "Invalid subdomain characters",
    },
    {
      config: {
        name: "Test",
        currency: "INVALID", // Invalid currency
        timezone: "America/New_York",
        subdomain: "test-store",
      },
      description: "Invalid currency code",
    },
  ];

  for (const testCase of invalidConfigs) {
    try {
      await client.provisionStore(testCase.config);
      console.error(`✗ ${testCase.description}: Should have thrown error`);
    } catch (error) {
      console.log(`✓ ${testCase.description}: Correctly rejected`);
      console.log(`  Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

async function runAllTests() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║   Shopify API Client & Store Provisioning Test Suite   ║");
  console.log("╚════════════════════════════════════════════════════════╝");

  await testSubdomainGeneration();
  await testTokenValidation();
  await testClientInitialization();
  await testInvalidInputs();
  await testStoreProvisioning();

  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║                    Test Suite Complete                 ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export {
  testSubdomainGeneration,
  testTokenValidation,
  testClientInitialization,
  testStoreProvisioning,
  testInvalidInputs,
  runAllTests,
};
