#!/usr/bin/env node
/**
 * End-to-end test harness for Branded Fit pipeline
 * Tests all three pipelines against 5 real domains
 * Measures latency and documents results
 */

import * as https from "https";

interface TestResult {
  domain: string;
  timestamp: string;
  stages: {
    brand_extraction: StageResult;
    mockup_generation: StageResult;
    storefront_creation: StageResult;
  };
  total_duration_ms: number;
  all_stages_passed: boolean;
  errors: string[];
}

interface StageResult {
  status: "success" | "failure" | "partial";
  duration_ms: number;
  response?: Record<string, unknown>;
  error?: string;
  confidence?: number;
  product_count?: number;
  mockup_urls?: string[];
  storefront_url?: string;
}

const BASE_URL = "https://branded-david-7482s-projects.vercel.app";
const TEST_DOMAINS = ["ramp.com", "vanta.com", "linear.app", "retool.com", "notion.so"];

function makeRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<{ status: number; data: unknown; duration: number }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const startTime = Date.now();

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Branded-Fit-Test-Harness/1.0",
      },
    };

    const req = https.request(url, options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const duration = Date.now() - startTime;
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode || 500, data: parsed, duration });
        } catch {
          resolve({ status: res.statusCode || 500, data: { raw: data }, duration });
        }
      });
    });

    req.on("error", (err) => {
      const duration = Date.now() - startTime;
      reject({ error: String(err), duration });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function testBrandExtraction(domain: string): Promise<StageResult> {
  const startTime = Date.now();
  try {
    const result = await makeRequest(
      "POST",
      "/api/v1/brand/extract",
      { domain }
    );

    const duration = Date.now() - startTime;

    if (result.status === 200) {
      const data = result.data as Record<string, unknown>;
      return {
        status: "success",
        duration_ms: duration,
        response: data,
        confidence: (data.extraction_confidence_pct as number) || 0,
      };
    } else {
      return {
        status: "failure",
        duration_ms: duration,
        error: `HTTP ${result.status}`,
      };
    }
  } catch (err) {
    const duration = Date.now() - startTime;
    return {
      status: "failure",
      duration_ms: duration,
      error: String(err),
    };
  }
}

async function testMockupGeneration(
  domain: string,
  extractionResult: StageResult
): Promise<StageResult> {
  const startTime = Date.now();
  try {
    if (extractionResult.status === "failure") {
      return {
        status: "failure",
        duration_ms: 0,
        error: "Skipped: Brand extraction failed",
      };
    }

    const extractData = extractionResult.response as Record<string, unknown>;
    const colors = (extractData.colors as unknown[]) || [];
    const logos = (extractData.logos as unknown[]) || [];

    const result = await makeRequest(
      "POST",
      "/api/v1/mockup/generate",
      {
        domain,
        colors: colors.length > 0 ? colors : [{ hex: "#1a3a5c", type: "primary" }],
        logos: logos.length > 0 ? logos : [{ url: "https://via.placeholder.com/100x100" }],
      }
    );

    const duration = Date.now() - startTime;

    if (result.status === 200) {
      const data = result.data as Record<string, unknown>;
      return {
        status: "success",
        duration_ms: duration,
        response: data,
        product_count: (data.sku_count as number) || 0,
        mockup_urls: (data.mockup_urls as string[]) || [],
      };
    } else {
      return {
        status: "failure",
        duration_ms: duration,
        error: `HTTP ${result.status}`,
      };
    }
  } catch (err) {
    const duration = Date.now() - startTime;
    return {
      status: "failure",
      duration_ms: duration,
      error: String(err),
    };
  }
}

async function testStorefrontCreation(
  domain: string,
  mockupResult: StageResult
): Promise<StageResult> {
  const startTime = Date.now();
  try {
    if (mockupResult.status === "failure") {
      return {
        status: "failure",
        duration_ms: 0,
        error: "Skipped: Mockup generation failed",
      };
    }

    const mockupData = mockupResult.response as Record<string, unknown>;
    const productCount = mockupData.sku_count as number || 5;

    const products = Array.from({ length: productCount }, (_, i) => ({
      sku: `sku-${i + 1}`,
      product_name: `Product ${i + 1}`,
      base_price: 29.99 + i * 5,
      variants: [
        { color: "Black", size: "M" },
        { color: "White", size: "M" },
      ],
    }));

    const result = await makeRequest(
      "POST",
      "/api/v1/storefront/create",
      {
        domain,
        brand_name: domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1),
        products,
      }
    );

    const duration = Date.now() - startTime;

    if (result.status === 200 || result.status === 201) {
      const data = result.data as Record<string, unknown>;
      return {
        status: "success",
        duration_ms: duration,
        response: data,
        storefront_url: (data.storefront_url as string) || "",
      };
    } else {
      return {
        status: "failure",
        duration_ms: duration,
        error: `HTTP ${result.status}`,
      };
    }
  } catch (err) {
    const duration = Date.now() - startTime;
    return {
      status: "failure",
      duration_ms: duration,
      error: String(err),
    };
  }
}

async function testDomain(domain: string): Promise<TestResult> {
  const timestamp = new Date().toISOString();
  const overallStartTime = Date.now();
  const errors: string[] = [];

  console.log(`\n🔍 Testing domain: ${domain}`);

  // Stage 1: Brand Extraction
  console.log("  → Running brand extraction...");
  const brandExtraction = await testBrandExtraction(domain);
  if (brandExtraction.status === "failure") {
    errors.push(`Brand extraction failed: ${brandExtraction.error}`);
  }

  // Stage 2: Mockup Generation
  console.log("  → Running mockup generation...");
  const mockupGeneration = await testMockupGeneration(domain, brandExtraction);
  if (mockupGeneration.status === "failure") {
    errors.push(`Mockup generation failed: ${mockupGeneration.error}`);
  }

  // Stage 3: Storefront Creation
  console.log("  → Running storefront creation...");
  const storefrontCreation = await testStorefrontCreation(domain, mockupGeneration);
  if (storefrontCreation.status === "failure") {
    errors.push(`Storefront creation failed: ${storefrontCreation.error}`);
  }

  const total_duration_ms = Date.now() - overallStartTime;
  const all_stages_passed =
    brandExtraction.status === "success" &&
    mockupGeneration.status === "success" &&
    storefrontCreation.status === "success";

  const result: TestResult = {
    domain,
    timestamp,
    stages: {
      brand_extraction: brandExtraction,
      mockup_generation: mockupGeneration,
      storefront_creation: storefrontCreation,
    },
    total_duration_ms,
    all_stages_passed,
    errors,
  };

  console.log(`  ✓ Domain test completed in ${total_duration_ms}ms`);
  if (!all_stages_passed) {
    console.log(`  ✗ Errors encountered: ${errors.length}`);
  }

  return result;
}

async function generateTestReport(results: TestResult[]): Promise<string> {
  const timestamp = new Date().toISOString();
  const totalDuration = results.reduce((sum, r) => sum + r.total_duration_ms, 0);
  const passedDomains = results.filter((r) => r.all_stages_passed).length;
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

  let report = `# Branded Fit E2E Test Report

**Generated:** ${timestamp}
**Test Duration:** ${totalDuration}ms
**Base URL:** ${BASE_URL}

## Executive Summary

- **Domains Tested:** ${results.length}
- **Fully Passed:** ${passedDomains}/${results.length}
- **Total Errors:** ${totalErrors}
- **Average Time per Domain:** ${Math.round(totalDuration / results.length)}ms
- **Success Rate:** ${Math.round((passedDomains / results.length) * 100)}%

## Pipeline Stage Performance

| Stage | Avg Duration | Success Rate |
|-------|--------------|--------------|
| Brand Extraction | ${Math.round(results.reduce((sum, r) => sum + r.stages.brand_extraction.duration_ms, 0) / results.length)}ms | ${Math.round((results.filter((r) => r.stages.brand_extraction.status === "success").length / results.length) * 100)}% |
| Mockup Generation | ${Math.round(results.reduce((sum, r) => sum + r.stages.mockup_generation.duration_ms, 0) / results.length)}ms | ${Math.round((results.filter((r) => r.stages.mockup_generation.status === "success").length / results.length) * 100)}% |
| Storefront Creation | ${Math.round(results.reduce((sum, r) => sum + r.stages.storefront_creation.duration_ms, 0) / results.length)}ms | ${Math.round((results.filter((r) => r.stages.storefront_creation.status === "success").length / results.length) * 100)}% |

## Detailed Results

`;

  // Add pass/fail matrix
  report += `## Pass/Fail Matrix\n\n`;
  report += `| Domain | Brand Extraction | Mockup Generation | Storefront Creation | Total Time | Status |\n`;
  report += `|--------|------------------|-------------------|---------------------|------------|--------|\n`;

  for (const result of results) {
    const brandStatus = result.stages.brand_extraction.status === "success" ? "✅" : "❌";
    const mockupStatus = result.stages.mockup_generation.status === "success" ? "✅" : "❌";
    const storefrontStatus = result.stages.storefront_creation.status === "success" ? "✅" : "❌";
    const overallStatus = result.all_stages_passed ? "✅ PASS" : "❌ FAIL";

    report += `| ${result.domain} | ${brandStatus} ${result.stages.brand_extraction.duration_ms}ms | ${mockupStatus} ${result.stages.mockup_generation.duration_ms}ms | ${storefrontStatus} ${result.stages.storefront_creation.duration_ms}ms | ${result.total_duration_ms}ms | ${overallStatus} |\n`;
  }

  report += "\n## Detailed Analysis\n\n";

  for (const result of results) {
    report += `### Domain: ${result.domain}\n\n`;
    report += `- **Overall Status:** ${result.all_stages_passed ? "✅ PASS" : "❌ FAIL"}\n`;
    report += `- **Total Duration:** ${result.total_duration_ms}ms\n`;
    report += `- **Timestamp:** ${result.timestamp}\n\n`;

    // Brand Extraction
    report += `#### Brand Extraction\n\n`;
    report += `- **Status:** ${result.stages.brand_extraction.status}\n`;
    report += `- **Duration:** ${result.stages.brand_extraction.duration_ms}ms\n`;
    if (result.stages.brand_extraction.error) {
      report += `- **Error:** ${result.stages.brand_extraction.error}\n`;
    }
    if (result.stages.brand_extraction.confidence !== undefined) {
      report += `- **Confidence:** ${result.stages.brand_extraction.confidence}%\n`;
    }
    report += "\n";

    // Mockup Generation
    report += `#### Mockup Generation\n\n`;
    report += `- **Status:** ${result.stages.mockup_generation.status}\n`;
    report += `- **Duration:** ${result.stages.mockup_generation.duration_ms}ms\n`;
    if (result.stages.mockup_generation.error) {
      report += `- **Error:** ${result.stages.mockup_generation.error}\n`;
    }
    if (result.stages.mockup_generation.product_count !== undefined) {
      report += `- **Products Created:** ${result.stages.mockup_generation.product_count}\n`;
    }
    if (result.stages.mockup_generation.mockup_urls?.length) {
      report += `- **Mockup URLs Generated:** ${result.stages.mockup_generation.mockup_urls.length}\n`;
    }
    report += "\n";

    // Storefront Creation
    report += `#### Storefront Creation\n\n`;
    report += `- **Status:** ${result.stages.storefront_creation.status}\n`;
    report += `- **Duration:** ${result.stages.storefront_creation.duration_ms}ms\n`;
    if (result.stages.storefront_creation.error) {
      report += `- **Error:** ${result.stages.storefront_creation.error}\n`;
    }
    if (result.stages.storefront_creation.storefront_url) {
      report += `- **Storefront URL:** ${result.stages.storefront_creation.storefront_url}\n`;
    }
    report += "\n";
  }

  // Error Summary
  report += `## Error Summary\n\n`;
  const allErrors = results.flatMap((r) =>
    r.errors.map((e) => `- **${r.domain}:** ${e}`)
  );
  if (allErrors.length > 0) {
    report += allErrors.join("\n") + "\n\n";
  } else {
    report += "No errors encountered.\n\n";
  }

  // Recommendations
  report += `## Recommendations\n\n`;
  const failedCount = results.filter((r) => !r.all_stages_passed).length;
  if (failedCount === 0) {
    report += `✅ All tests passed successfully. The pipeline is operating normally.\n\n`;
  } else {
    report += `⚠️ ${failedCount} domain(s) encountered failures. Review the detailed analysis above for error details.\n\n`;
  }

  const slowDomains = results.filter((r) => r.total_duration_ms > 10000);
  if (slowDomains.length > 0) {
    report += `- **Performance:** ${slowDomains.length} domain(s) exceeded 10-second target:\n`;
    for (const domain of slowDomains) {
      report += `  - ${domain.domain}: ${domain.total_duration_ms}ms\n`;
    }
    report += "\n";
  }

  report += `## Testing Notes\n\n`;
  report += `- Test framework: Branded Fit E2E Test Harness v1.0\n`;
  report += `- Target: ${BASE_URL}\n`;
  report += `- Domains: ${TEST_DOMAINS.join(", ")}\n`;
  report += `- Stages: Brand Extraction → Mockup Generation → Storefront Creation\n\n`;

  return report;
}

async function runTests(): Promise<void> {
  console.log("🚀 Branded Fit E2E Test Suite Started");
  console.log(`📍 Testing against: ${BASE_URL}`);
  console.log(`🔄 Test domains: ${TEST_DOMAINS.join(", ")}\n`);

  const results: TestResult[] = [];

  for (const domain of TEST_DOMAINS) {
    const result = await testDomain(domain);
    results.push(result);
  }

  const report = await generateTestReport(results);

  // Save report to file
  const fs = await import("fs").then((m) => m.promises);
  const reportPath = "./documents/2026-06-03_e2e_test_report.md";

  try {
    await fs.mkdir("./documents", { recursive: true });
    await fs.writeFile(reportPath, report);
    console.log(`\n✅ Test report saved to: ${reportPath}`);
  } catch (err) {
    console.log("\n⚠️ Could not save test report to file, outputting to console instead:");
  }

  console.log("\n" + report);

  // Print summary
  const passedCount = results.filter((r) => r.all_stages_passed).length;
  console.log(`\n📊 Test Summary:`);
  console.log(`  Passed: ${passedCount}/${results.length}`);
  console.log(`  Failed: ${results.length - passedCount}/${results.length}`);
  console.log(`  Success Rate: ${Math.round((passedCount / results.length) * 100)}%`);

  process.exit(passedCount === results.length ? 0 : 1);
}

runTests().catch((err) => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
