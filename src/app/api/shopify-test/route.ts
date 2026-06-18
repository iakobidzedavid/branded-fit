import { NextRequest, NextResponse } from "next/server";

interface TestResult {
  domain: string;
  status: "success" | "partial" | "failed";
  startTime: number;
  duration: number;
  steps: {
    provisioning: StepResult;
    productUpload: StepResult;
    metadataSave: StepResult;
  };
  storeUrl?: string;
  productCount?: number;
  errors: string[];
}

interface StepResult {
  status: "pending" | "in_progress" | "completed" | "failed";
  duration: number;
  message?: string;
  error?: string;
}

const TEST_DOMAINS = [
  "ramp.com",
  "vanta.com",
  "linear.app",
  "retool.com",
  "notion.so",
];

// Mock products for testing
function generateTestProducts(domain: string) {
  const brandName = domain.split(".")[0];
  return [
    {
      title: `Premium ${brandName} T-Shirt`,
      description: `High-quality t-shirt branded with ${domain} logo and colors`,
      images: [
        {
          src: `https://via.placeholder.com/400x400?text=${brandName}+Tee`,
          alt: `${brandName} T-Shirt`,
        },
      ],
      variants: [
        { sku: "tee-001", price: 35.0, options: { color: "Black", size: "M" } },
        { sku: "tee-002", price: 35.0, options: { color: "Black", size: "L" } },
        { sku: "tee-003", price: 35.0, options: { color: "White", size: "M" } },
      ],
      vendor: "Branded Fit",
      productType: "Apparel",
    },
    {
      title: `${brandName} Hoodie`,
      description: `Premium hoodie featuring ${domain} branding`,
      images: [
        {
          src: `https://via.placeholder.com/400x400?text=${brandName}+Hoodie`,
          alt: `${brandName} Hoodie`,
        },
      ],
      variants: [
        { sku: "hood-001", price: 65.0, options: { color: "Black", size: "M" } },
        { sku: "hood-002", price: 65.0, options: { color: "Black", size: "L" } },
      ],
      vendor: "Branded Fit",
      productType: "Apparel",
    },
    {
      title: `${brandName} Cap`,
      description: `Classic adjustable cap with embroidered ${domain} logo`,
      images: [
        {
          src: `https://via.placeholder.com/400x400?text=${brandName}+Cap`,
          alt: `${brandName} Cap`,
        },
      ],
      variants: [
        {
          sku: "cap-001",
          price: 25.0,
          options: { color: "Black", size: "One Size" },
        },
        {
          sku: "cap-002",
          price: 25.0,
          options: { color: "Navy", size: "One Size" },
        },
      ],
      vendor: "Branded Fit",
      productType: "Accessories",
    },
  ];
}

async function testDomain(
  domain: string,
  baseUrl: string
): Promise<TestResult> {
  const startTime = Date.now();
  const result: TestResult = {
    domain,
    status: "failed",
    startTime,
    duration: 0,
    steps: {
      provisioning: { status: "pending", duration: 0 },
      productUpload: { status: "pending", duration: 0 },
      metadataSave: { status: "pending", duration: 0 },
    },
    errors: [],
  };

  try {
    const products = generateTestProducts(domain);

    result.steps.provisioning.status = "in_progress";
    const provisionStart = Date.now();

    const response = await fetch(`${baseUrl}/api/shopify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain,
        products,
        brandName: domain.split(".")[0],
        currency: "USD",
        timezone: "America/New_York",
      }),
    });

    result.steps.provisioning.duration = Date.now() - provisionStart;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      result.status = "failed";
      result.steps.provisioning.status = "failed";
      result.steps.provisioning.error = `HTTP ${response.status}`;
      result.steps.productUpload.status = "failed";
      result.steps.productUpload.error = "Skipped due to provisioning failure";
      result.steps.metadataSave.status = "failed";
      result.steps.metadataSave.error = "Skipped due to provisioning failure";
      result.errors.push(`Provisioning failed: ${JSON.stringify(errorData)}`);
      result.duration = Date.now() - startTime;
      return result;
    }

    const data = await response.json();

    if (!data.orchestration || data.orchestration.status !== "completed") {
      result.status = "partial";
      result.steps.provisioning.status = "completed";
      result.steps.provisioning.message = "Store provisioned";

      const orchestration = data.orchestration || {};

      if (orchestration.pipeline2?.status === "completed") {
        result.steps.productUpload.status = "completed";
        result.steps.productUpload.message = orchestration.pipeline2?.message;
      } else {
        result.steps.productUpload.status = "failed";
        result.steps.productUpload.error = orchestration.pipeline2?.message;
      }

      if (orchestration.pipeline3?.status === "completed") {
        result.steps.metadataSave.status = "completed";
        result.steps.metadataSave.message = orchestration.pipeline3?.message;
      } else {
        result.steps.metadataSave.status = "failed";
        result.steps.metadataSave.error = orchestration.pipeline3?.message;
      }

      if (orchestration.storefront) {
        result.storeUrl = orchestration.storefront.url;
        result.productCount = orchestration.storefront.productCount;
      }

      result.errors.push(orchestration.error || "Orchestration incomplete");
    } else {
      result.status = "success";
      result.steps.provisioning.status = "completed";
      result.steps.provisioning.message = "Store provisioned";
      result.steps.productUpload.status = "completed";
      result.steps.productUpload.message = data.orchestration.pipeline2?.message;
      result.steps.metadataSave.status = "completed";
      result.steps.metadataSave.message = data.orchestration.pipeline3?.message;

      if (data.orchestration.storefront) {
        result.storeUrl = data.orchestration.storefront.url;
        result.productCount = data.orchestration.storefront.productCount;
      }
    }
  } catch (error) {
    result.status = "failed";
    result.steps.provisioning.status = "failed";
    result.steps.provisioning.error = error instanceof Error ? error.message : "Unknown error";
    result.errors.push(error instanceof Error ? error.message : "Unknown error");
  }

  result.duration = Date.now() - startTime;
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_VERCEL_URL &&
      !process.env.NEXT_PUBLIC_VERCEL_URL.includes("localhost")
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : process.env.API_URL || "http://localhost:3000";

    const testResults: TestResult[] = [];
    const overallStartTime = Date.now();

    for (const domain of TEST_DOMAINS) {
      const result = await testDomain(domain, baseUrl);
      testResults.push(result);
    }

    const overallDuration = Date.now() - overallStartTime;

    const summary = {
      totalDomains: TEST_DOMAINS.length,
      successCount: testResults.filter((r) => r.status === "success").length,
      partialCount: testResults.filter((r) => r.status === "partial").length,
      failedCount: testResults.filter((r) => r.status === "failed").length,
      averageDuration:
        testResults.length > 0
          ? Math.round(testResults.reduce((sum, r) => sum + r.duration, 0) / testResults.length)
          : 0,
      overallDuration,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        summary,
        results: testResults,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Test harness error:", error);
    return NextResponse.json(
      {
        error: "Test harness failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
