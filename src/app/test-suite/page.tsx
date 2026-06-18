"use client";

import { useState, useEffect } from "react";
import {
  Play,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from "lucide-react";

interface TestResult {
  domain: string;
  stage: string;
  status: "pass" | "fail";
  duration: number;
  details: string;
  data?: Record<string, unknown>;
}

interface DomainTestResult {
  domain: string;
  results: TestResult[];
  totalDuration: number;
  status: "success" | "partial" | "failed";
}

export default function TestSuite() {
  const testDomains = [
    "ramp.com",
    "vanta.com",
    "linear.app",
    "retool.com",
    "notion.so",
  ];

  const [testResults, setTestResults] = useState<DomainTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [reportGenerated, setReportGenerated] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    setReportGenerated(false);

    for (const domain of testDomains) {
      setCurrentDomain(domain);

      try {
        const response = await fetch("/api/run-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        });

        const data = (await response.json()) as DomainTestResult;
        setTestResults((prev) => [...prev, data]);
      } catch (error) {
        setTestResults((prev) => [
          ...prev,
          {
            domain,
            results: [
              {
                domain,
                stage: "error",
                status: "fail",
                duration: 0,
                details: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            totalDuration: 0,
            status: "failed",
          },
        ]);
      }
    }

    setCurrentDomain(null);
    setLoading(false);
    setReportGenerated(true);
  };

  const generateMarkdownReport = () => {
    let markdown = "# End-to-End Test Report\n\n";
    markdown += `**Generated:** ${new Date().toISOString()}\n\n`;

    // Pass/fail matrix
    markdown += "## Test Matrix\n\n";
    markdown += "| Domain | Brand Extraction | Mockup Generation | Storefront Creation | Status |\n";
    markdown += "|--------|------------------|-------------------|---------------------|--------|\n";

    for (const result of testResults) {
      const brandResult = result.results.find((r) => r.stage === "brand-extraction");
      const mockupResult = result.results.find((r) => r.stage === "mockup-generation");
      const storefrontResult = result.results.find(
        (r) => r.stage === "storefront-creation"
      );

      const brandStatus = brandResult?.status === "pass" ? "✓" : "✗";
      const mockupStatus = mockupResult?.status === "pass" ? "✓" : "✗";
      const storefrontStatus = storefrontResult?.status === "pass" ? "✓" : "✗";
      const overallStatus = result.status === "success" ? "✓ PASS" : "⚠ PARTIAL";

      markdown += `| ${result.domain} | ${brandStatus} | ${mockupStatus} | ${storefrontStatus} | ${overallStatus} |\n`;
    }

    markdown += "\n## Latency Analysis\n\n";
    markdown += "| Domain | Total Duration | Avg per Stage |\n";
    markdown += "|--------|----------------|---------------|\n";

    for (const result of testResults) {
      const avgDuration =
        result.results.length > 0
          ? Math.round(result.totalDuration / result.results.length)
          : 0;
      const totalSeconds = (result.totalDuration / 1000).toFixed(2);
      markdown += `| ${result.domain} | ${totalSeconds}s | ${avgDuration}ms |\n`;
    }

    markdown += "\n## Detailed Results\n\n";

    for (const result of testResults) {
      markdown += `### ${result.domain}\n\n`;
      markdown += `**Overall Status:** ${result.status.toUpperCase()}\n`;
      markdown += `**Total Duration:** ${(result.totalDuration / 1000).toFixed(2)}s\n\n`;

      for (const stageResult of result.results) {
        const icon = stageResult.status === "pass" ? "✓" : "✗";
        markdown += `#### ${icon} ${stageResult.stage}\n\n`;
        markdown += `- **Status:** ${stageResult.status.toUpperCase()}\n`;
        markdown += `- **Duration:** ${stageResult.duration}ms\n`;
        markdown += `- **Details:** ${stageResult.details}\n`;

        if (stageResult.data) {
          markdown += "- **Data:**\n";
          for (const [key, value] of Object.entries(stageResult.data)) {
            markdown += `  - ${key}: ${JSON.stringify(value)}\n`;
          }
        }

        markdown += "\n";
      }
    }

    markdown += "## Summary\n\n";
    const passCount = testResults.filter((r) => r.status === "success").length;
    const totalTests = testResults.length;
    const avgTotalDuration =
      testResults.length > 0
        ? testResults.reduce((sum, r) => sum + r.totalDuration, 0) /
          testResults.length
        : 0;

    markdown += `- **Domains Tested:** ${totalTests}\n`;
    markdown += `- **Fully Passing:** ${passCount}/${totalTests}\n`;
    markdown += `- **Average Duration per Domain:** ${(avgTotalDuration / 1000).toFixed(2)}s\n`;
    markdown += `- **Target Duration:** <10 minutes per domain\n`;
    markdown +=
      avgTotalDuration / 1000 < 600
        ? "- **Status:** ✓ All domains complete end-to-end testing within target time\n"
        : "- **Status:** ⚠ Some domains exceeded target time\n";

    return markdown;
  };

  const downloadReport = () => {
    const markdown = generateMarkdownReport();
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown)
    );
    element.setAttribute(
      "download",
      `test-report-${new Date().toISOString().split("T")[0]}.md`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <section className="px-4 py-12 border-b border-border bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">End-to-End Test Suite</h1>
          <p className="text-text-muted">
            Automated testing of Brandfetch → Printify → Shopify pipelines on 5
            production domains
          </p>
        </div>
      </section>

      {/* Control Panel */}
      <section className="px-4 py-8 bg-surface/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Test Domains</h3>
              <p className="text-text-muted text-sm">
                {testDomains.join(", ")}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={runTests}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Testing..." : "Run All Tests"}
                {!loading && <Play size={20} />}
              </button>

              {reportGenerated && (
                <button
                  onClick={downloadReport}
                  className="flex items-center gap-2 px-6 py-3 bg-surface border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition"
                >
                  <Download size={20} />
                  Download Report
                </button>
              )}
            </div>
          </div>

          {loading && currentDomain && (
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
              <p className="text-blue-300 flex items-center gap-2">
                <Clock size={16} />
                Testing {currentDomain}...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {testResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-muted text-lg">
                No test results yet. Click "Run All Tests" to start.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-6 bg-surface rounded-lg border border-border">
                  <p className="text-text-muted text-sm mb-2">Domains Tested</p>
                  <p className="text-3xl font-bold text-accent">
                    {testResults.length}
                  </p>
                </div>
                <div className="p-6 bg-surface rounded-lg border border-border">
                  <p className="text-text-muted text-sm mb-2">Fully Passing</p>
                  <p className="text-3xl font-bold text-emerald-500">
                    {testResults.filter((r) => r.status === "success").length}
                  </p>
                </div>
                <div className="p-6 bg-surface rounded-lg border border-border">
                  <p className="text-text-muted text-sm mb-2">
                    Avg Duration
                  </p>
                  <p className="text-3xl font-bold text-text">
                    {testResults.length > 0
                      ? (
                          testResults.reduce((sum, r) => sum + r.totalDuration, 0) /
                          testResults.length /
                          1000
                        ).toFixed(1)
                      : 0}
                    s
                  </p>
                </div>
              </div>

              {/* Individual Results */}
              {testResults.map((result) => (
                <div
                  key={result.domain}
                  className="bg-surface rounded-lg border border-border overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedDomain(
                        expandedDomain === result.domain ? null : result.domain
                      )
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface/80 transition"
                  >
                    <div className="flex items-center gap-4">
                      {result.status === "success" ? (
                        <CheckCircle size={24} className="text-emerald-500" />
                      ) : (
                        <XCircle size={24} className="text-amber-500" />
                      )}
                      <div className="text-left">
                        <h3 className="font-semibold text-lg">
                          {result.domain}
                        </h3>
                        <p className="text-text-muted text-sm">
                          {result.totalDuration / 1000 < 600
                            ? "✓ Within target"
                            : "⚠ Target exceeded"}{" "}
                          • {(result.totalDuration / 1000).toFixed(2)}s
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      size={24}
                      className={`flex-shrink-0 transition-transform ${
                        expandedDomain === result.domain ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedDomain === result.domain && (
                    <div className="px-6 py-4 bg-surface/50 border-t border-border space-y-4">
                      {result.results.map((stageResult, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-surface rounded-lg border border-border/50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {stageResult.status === "pass" ? (
                                <CheckCircle
                                  size={20}
                                  className="text-emerald-500"
                                />
                              ) : (
                                <XCircle size={20} className="text-danger" />
                              )}
                              <div>
                                <p className="font-semibold capitalize">
                                  {stageResult.stage.replace(/-/g, " ")}
                                </p>
                                <p className="text-text-muted text-sm">
                                  {stageResult.duration}ms
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                stageResult.status === "pass"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-danger/20 text-red-300"
                              }`}
                            >
                              {stageResult.status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-text-muted text-sm mb-2">
                            {stageResult.details}
                          </p>

                          {stageResult.data && (
                            <div className="mt-2 pt-2 border-t border-border/50 text-sm text-text-muted">
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(stageResult.data).map(
                                  ([key, value]) => (
                                    <div key={key}>
                                      <span className="capitalize font-semibold">
                                        {key}:
                                      </span>{" "}
                                      {typeof value === "object"
                                        ? JSON.stringify(value)
                                        : String(value)}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Test Report Preview */}
      {reportGenerated && (
        <section className="px-4 py-12 bg-surface/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Test Report Preview</h2>
            <div className="bg-surface p-6 rounded-lg border border-border overflow-auto max-h-96">
              <pre className="text-sm text-text-muted whitespace-pre-wrap font-mono">
                {generateMarkdownReport()}
              </pre>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
