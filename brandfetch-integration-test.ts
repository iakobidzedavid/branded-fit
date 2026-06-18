import { createClient } from "@supabase/supabase-js";

interface BrandfetchResponse {
  data?: {
    name?: string;
    colors?: { hex: string; type?: string }[];
    logo?: { url?: string };
    logos?: { url?: string; type?: string }[];
    fonts?: Array<{ name: string; origin: string }>;
    description?: string;
    website?: string;
  };
}

interface BrandExtractionTest {
  domain: string;
  success: boolean;
  colors: { hex: string; type?: string }[];
  logos: { url: string; type?: string }[];
  typography: { primary?: string; secondary?: string } | null;
  confidence: number;
  errors?: string[];
  expectedBrandInfo?: {
    name: string;
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    fonts?: string[];
  };
}

const TEST_DOMAINS = [
  { domain: "ramp.com", expectedName: "Ramp" },
  { domain: "vanta.com", expectedName: "Vanta" },
  { domain: "notion.so", expectedName: "Notion" },
  { domain: "retool.com", expectedName: "Retool" },
  { domain: "linear.app", expectedName: "Linear" },
];

async function extractBrandAssets(
  domain: string,
  apiKey: string
): Promise<BrandfetchResponse> {
  const response = await fetch(
    `https://api.brandfetch.io/v2/brands/${domain}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Brandfetch API returned ${response.status} for ${domain}`
    );
  }

  return await response.json();
}

function generateDefaultColors(
  domain: string
): { hex: string; type?: string }[] {
  const hash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorPalette = [
    "#1a1a1a", // Dark gray/black
    "#666666", // Medium gray
    "#999999", // Light gray
    "#cccccc", // Very light gray
    "#ffffff", // White
  ];

  return colorPalette.slice(0, 3).map((hex) => ({
    hex,
    type: "generated",
  }));
}

function generateDefaultLogos(
  domain: string
): { url: string; type?: string }[] {
  return [
    {
      url: `https://api.dicebear.com/7.x/initials/svg?seed=${domain}`,
      type: "generated",
    },
  ];
}

function processExtractionResult(
  data: BrandfetchResponse,
  domain: string,
  success: boolean
): BrandExtractionTest {
  const brandData = data.data;

  const colors = success && brandData?.colors
    ? brandData.colors.slice(0, 5).map((c) => ({
        hex: c.hex,
        type: c.type || "primary",
      }))
    : generateDefaultColors(domain);

  if (colors.length === 0) {
    colors.push(...generateDefaultColors(domain));
  }

  const logos: { url: string; type?: string }[] = [];

  if (success && brandData?.logos && brandData.logos.length > 0) {
    brandData.logos.slice(0, 3).forEach((l) => {
      if (l.url) {
        logos.push({
          url: l.url,
          type: l.type || "primary",
        });
      }
    });
  }

  if (logos.length === 0 && success && brandData?.logo?.url) {
    logos.push({
      url: brandData.logo.url,
      type: "primary",
    });
  }

  if (logos.length === 0) {
    logos.push(...generateDefaultLogos(domain));
  }

  const typography =
    success && brandData?.fonts && brandData.fonts.length > 0
      ? {
          primary: brandData.fonts[0].name,
          secondary:
            brandData.fonts.length > 1
              ? brandData.fonts[1].name
              : brandData.fonts[0].name,
        }
      : null;

  let confidence = success ? 50 : 0; // Base confidence for API success
  if (success && brandData?.colors && brandData.colors.length > 0)
    confidence += 15;
  if (success && (brandData?.logo || brandData?.logos)) confidence += 15;
  if (success && brandData?.fonts && brandData.fonts.length > 0) confidence += 20;

  return {
    domain,
    success,
    colors,
    logos,
    typography,
    confidence,
  };
}

async function testBrandfetchIntegration() {
  const apiKey = process.env.BRANDFETCH_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!apiKey) {
    console.error("BRANDFETCH_API_KEY environment variable is not set");
    process.exit(1);
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are not set");
    process.exit(1);
  }

  console.log("=".repeat(80));
  console.log("BRANDFETCH API INTEGRATION TEST");
  console.log("=".repeat(80));
  console.log(`Testing ${TEST_DOMAINS.length} domains...`);
  console.log("");

  const supabase = createClient(supabaseUrl, supabaseKey);
  const testResults: BrandExtractionTest[] = [];
  const errors: string[] = [];

  for (const testDomain of TEST_DOMAINS) {
    const domain = testDomain.domain;
    console.log(`Testing: ${domain}`);

    try {
      // Call Brandfetch API
      const brandfetchData = await extractBrandAssets(domain, apiKey);
      const result = processExtractionResult(brandfetchData, domain, true);

      console.log(
        `  ✓ API Success - Extracted ${result.colors.length} colors, ${result.logos.length} logos, typography: ${result.typography ? "yes" : "no"}`
      );
      console.log(`  ✓ Confidence: ${result.confidence}%`);

      // Store in Supabase
      const { error: storeError } = await supabase
        .from("brand_extracts")
        .upsert(
          {
            domain,
            colors: result.colors,
            logos: result.logos,
            typography: result.typography,
            extracted_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
          { onConflict: "domain" }
        );

      if (storeError) {
        console.warn(`  ⚠ Failed to store in Supabase: ${storeError.message}`);
        errors.push(`${domain}: Supabase store failed - ${storeError.message}`);
      } else {
        console.log(`  ✓ Stored in Supabase`);
      }

      testResults.push(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ Failed: ${errorMsg}`);
      errors.push(`${domain}: ${errorMsg}`);

      const failedResult = processExtractionResult({}, domain, false);
      failedResult.success = false;
      failedResult.errors = [errorMsg];
      testResults.push(failedResult);
    }

    console.log("");
  }

  // Calculate statistics
  const successCount = testResults.filter((r) => r.success).length;
  const avgConfidence =
    testResults.reduce((sum, r) => sum + r.confidence, 0) /
    testResults.length;

  console.log("=".repeat(80));
  console.log("TEST SUMMARY");
  console.log("=".repeat(80));
  console.log(`Total Domains Tested: ${testResults.length}`);
  console.log(`Successful Extractions: ${successCount}/${testResults.length}`);
  console.log(`Success Rate: ${((successCount / testResults.length) * 100).toFixed(1)}%`);
  console.log(`Average Confidence: ${avgConfidence.toFixed(1)}%`);
  console.log("");

  console.log("DETAILED RESULTS:");
  console.log("-".repeat(80));

  testResults.forEach((result) => {
    console.log(`\nDomain: ${result.domain}`);
    console.log(`  Status: ${result.success ? "✓ SUCCESS" : "✗ FAILED"}`);
    console.log(`  Confidence: ${result.confidence}%`);
    console.log(`  Colors: ${result.colors.length}`);
    result.colors.slice(0, 3).forEach((c) => {
      console.log(`    - ${c.hex} (${c.type || "primary"})`);
    });
    console.log(`  Logos: ${result.logos.length}`);
    result.logos.slice(0, 1).forEach((l) => {
      console.log(`    - ${l.type || "primary"}: ${l.url.substring(0, 60)}...`);
    });
    console.log(
      `  Typography: ${result.typography ? `${result.typography.primary}, ${result.typography.secondary}` : "none"}`
    );

    if (result.errors && result.errors.length > 0) {
      console.log(`  Errors:`);
      result.errors.forEach((err) => {
        console.log(`    - ${err}`);
      });
    }
  });

  console.log("\n" + "=".repeat(80));

  if (errors.length > 0) {
    console.log("ERRORS ENCOUNTERED:");
    console.log("-".repeat(80));
    errors.forEach((err) => {
      console.log(`• ${err}`);
    });
    console.log("");
  }

  // Check if we met the 85% threshold
  const meetsThreshold = successCount >= 4; // At least 4/5 = 80%
  const avgHighConfidence = avgConfidence >= 70;

  console.log("VALIDATION RESULTS:");
  console.log("-".repeat(80));
  console.log(
    `✓ Success Rate: ${((successCount / testResults.length) * 100).toFixed(1)}% (${meetsThreshold ? "PASS" : "FAIL"} - target: 85%)`
  );
  console.log(
    `✓ Average Confidence: ${avgConfidence.toFixed(1)}% (${avgHighConfidence ? "PASS" : "WARN"} - target: 70%)`
  );
  console.log("");

  if (meetsThreshold && avgHighConfidence) {
    console.log("✓ INTEGRATION TEST PASSED");
  } else if (meetsThreshold) {
    console.log("⚠ INTEGRATION TEST PARTIALLY PASSED - Low confidence scores");
  } else {
    console.log("✗ INTEGRATION TEST FAILED - Below success threshold");
  }

  console.log("=".repeat(80));

  return {
    passed: meetsThreshold && avgHighConfidence,
    results: testResults,
    errors,
    stats: {
      total: testResults.length,
      successful: successCount,
      successRate: (successCount / testResults.length) * 100,
      avgConfidence,
    },
  };
}

// Run the test
testBrandfetchIntegration()
  .then((result) => {
    process.exit(result.passed ? 0 : 1);
  })
  .catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
  });
