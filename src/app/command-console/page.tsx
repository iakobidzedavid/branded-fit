"use client";

import { useState, useEffect, useRef } from "react";
import {
  Check,
  AlertCircle,
  Loader,
  Clock,
  DownloadCloud,
  Users,
  ExternalLink,
} from "lucide-react";

interface PipelineStatus {
  status: "pending" | "in_progress" | "completed" | "failed";
  message: string;
}

interface OrchestrationState {
  status: "pending" | "in_progress" | "completed" | "failed";
  pipeline1: PipelineStatus;
  pipeline2: PipelineStatus;
  pipeline3: PipelineStatus;
  timestamp: number;
  storefront?: { url: string; productCount: number };
}

const CORPORATE_TLDS = new Set([
  "com",
  "io",
  "co",
  "org",
  "net",
  "dev",
  "app",
  "ai",
  "tech",
  "inc",
  "company",
]);

function isCorporateTLD(domain: string): boolean {
  const parts = domain.toLowerCase().split(".");
  if (parts.length < 2) return false;
  const tld = parts[parts.length - 1];
  return CORPORATE_TLDS.has(tld);
}

export default function CommandConsole() {
  const [domain, setDomain] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orchestrationState, setOrchestrationState] =
    useState<OrchestrationState | null>(null);
  const [pollingError, setPollingError] = useState("");
  const [completedAt, setCompletedAt] = useState<number | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const validateDomain = (value: string): boolean => {
    if (!value) {
      setValidationError("Domain is required");
      return false;
    }

    const cleanDomain = value.toLowerCase().trim();
    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

    if (!domainRegex.test(cleanDomain)) {
      setValidationError("Invalid domain format");
      return false;
    }

    if (!isCorporateTLD(cleanDomain)) {
      setValidationError(
        "Only corporate domains (.com, .io, .co, .org, etc.) are supported"
      );
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDomain(value);
    if (value) {
      validateDomain(value);
    } else {
      setValidationError("");
    }
  };

  const pollStatus = async (cleanDomain: string) => {
    try {
      const res = await fetch(
        `/api/pipeline-status?domain=${encodeURIComponent(cleanDomain)}`
      );
      const data = await res.json();

      if (data.orchestration) {
        setOrchestrationState(data.orchestration);
        setPollingError("");

        if (
          data.orchestration.status === "completed" ||
          data.orchestration.status === "failed"
        ) {
          setCompletedAt(Date.now());
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
      }
    } catch (error) {
      console.error("Polling error:", error);
      setPollingError("Failed to fetch status updates");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDomain(domain)) {
      return;
    }

    const cleanDomain = domain.toLowerCase().trim();
    setIsSubmitting(true);
    setValidationError("");
    setPollingError("");
    setCompletedAt(null);

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleanDomain }),
      });

      const data = await res.json();

      if (!res.ok) {
        setValidationError(data.message || "Failed to start orchestration");
        setIsSubmitting(false);
        return;
      }

      if (data.orchestration) {
        setOrchestrationState(data.orchestration);

        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }

        pollingIntervalRef.current = setInterval(() => {
          pollStatus(cleanDomain);
        }, 2000);

        await pollStatus(cleanDomain);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setValidationError("Failed to submit domain");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-5 h-5 text-emerald-400" />;
      case "in_progress":
        return <Loader className="w-5 h-5 text-accent animate-spin" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-danger" />;
      default:
        return <Clock className="w-5 h-5 text-text-muted" />;
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case "completed":
        return "border-emerald-400";
      case "in_progress":
        return "border-accent";
      case "failed":
        return "border-danger";
      default:
        return "border-border";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Complete";
      case "in_progress":
        return "Processing...";
      case "failed":
        return "Failed";
      default:
        return "Pending";
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "completed":
        return 100;
      case "in_progress":
        return 65;
      case "failed":
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Command Console</h1>
          <p className="text-text-muted">
            Submit your domain and watch your brand transform into a live
            storefront
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {!orchestrationState ? (
            // Input Section
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="domain-input" className="block text-sm font-medium text-text mb-2">
                    Domain
                  </label>
                  <input
                    id="domain-input"
                    type="text"
                    placeholder="Enter your domain (e.g., ramp.com)"
                    value={domain}
                    onChange={handleDomainChange}
                    disabled={isSubmitting}
                    className={`w-full px-6 py-4 bg-surface border-2 text-text placeholder-text-muted rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition ${
                      validationError ? "border-danger" : "border-border"
                    }`}
                  />
                  {validationError && (
                    <p className="text-danger text-sm mt-2">{validationError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !domain || !!validationError}
                  className="w-full px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Generate Brand Drop"
                  )}
                </button>
              </form>
            </div>
          ) : (
            // Status Panel Section
            <div className="space-y-8">
              {/* Pipeline Status Cards */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Pipeline Progress</h2>

                {/* Pipeline 1: Brand Intelligence */}
                <div
                  className={`bg-surface border-2 rounded-lg p-6 transition ${getStatusBorder(
                    orchestrationState.pipeline1.status
                  )}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(orchestrationState.pipeline1.status)}
                      <div>
                        <h3 className="font-semibold text-lg">
                          Brand Intelligence
                        </h3>
                        <p className="text-text-muted text-sm">
                          {orchestrationState.pipeline1.message}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-surface rounded px-2 py-1">
                      {getStatusLabel(orchestrationState.pipeline1.status)}
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        orchestrationState.pipeline1.status === "in_progress"
                          ? "bg-accent animate-pulse"
                          : orchestrationState.pipeline1.status === "completed"
                          ? "bg-emerald-400"
                          : orchestrationState.pipeline1.status === "failed"
                          ? "bg-danger"
                          : "bg-text-muted"
                      }`}
                      style={{
                        width: `${getProgressPercentage(orchestrationState.pipeline1.status)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Pipeline 2: Visual Mockup Engine */}
                <div
                  className={`bg-surface border-2 rounded-lg p-6 transition ${getStatusBorder(
                    orchestrationState.pipeline2.status
                  )}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(orchestrationState.pipeline2.status)}
                      <div>
                        <h3 className="font-semibold text-lg">
                          Visual Mockup Engine
                        </h3>
                        <p className="text-text-muted text-sm">
                          {orchestrationState.pipeline2.message}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-surface rounded px-2 py-1">
                      {getStatusLabel(orchestrationState.pipeline2.status)}
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        orchestrationState.pipeline2.status === "in_progress"
                          ? "bg-accent animate-pulse"
                          : orchestrationState.pipeline2.status === "completed"
                          ? "bg-emerald-400"
                          : orchestrationState.pipeline2.status === "failed"
                          ? "bg-danger"
                          : "bg-text-muted"
                      }`}
                      style={{
                        width: `${getProgressPercentage(orchestrationState.pipeline2.status)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Pipeline 3: Infrastructure Provisioning */}
                <div
                  className={`bg-surface border-2 rounded-lg p-6 transition ${getStatusBorder(
                    orchestrationState.pipeline3.status
                  )}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(orchestrationState.pipeline3.status)}
                      <div>
                        <h3 className="font-semibold text-lg">
                          Infrastructure Provisioning
                        </h3>
                        <p className="text-text-muted text-sm">
                          {orchestrationState.pipeline3.message}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-surface rounded px-2 py-1">
                      {getStatusLabel(orchestrationState.pipeline3.status)}
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        orchestrationState.pipeline3.status === "in_progress"
                          ? "bg-accent animate-pulse"
                          : orchestrationState.pipeline3.status === "completed"
                          ? "bg-emerald-400"
                          : orchestrationState.pipeline3.status === "failed"
                          ? "bg-danger"
                          : "bg-text-muted"
                      }`}
                      style={{
                        width: `${getProgressPercentage(orchestrationState.pipeline3.status)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Success State */}
              {orchestrationState.status === "completed" &&
                orchestrationState.storefront && (
                  <div className="bg-emerald-900/20 border-2 border-emerald-400/50 rounded-lg p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <Check className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-emerald-300 mb-1">
                          Brand Drop Ready!
                        </h3>
                        <p className="text-text-muted">
                          Your storefront is live with{" "}
                          {orchestrationState.storefront.productCount} products
                        </p>
                      </div>
                    </div>

                    <div className="bg-surface/50 rounded p-4 mb-6">
                      <p className="text-text-muted text-xs mb-2">
                        Storefront URL
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-accent break-all">
                          {orchestrationState.storefront.url}
                        </p>
                        <a
                          href={orchestrationState.storefront.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-accent text-white px-4 py-2 rounded flex items-center gap-2 whitespace-nowrap hover:bg-purple-600 transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Store
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          window.open(
                            `/api/download-assets?domain=${domain}`,
                            "_blank"
                          );
                        }}
                        className="bg-surface border-2 border-accent text-accent px-4 py-3 rounded flex items-center justify-center gap-2 hover:bg-accent/10 transition"
                      >
                        <DownloadCloud className="w-4 h-4" />
                        Download Assets
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement invite team modal
                        }}
                        className="bg-surface border-2 border-accent text-accent px-4 py-3 rounded flex items-center justify-center gap-2 hover:bg-accent/10 transition"
                      >
                        <Users className="w-4 h-4" />
                        Invite Team
                      </button>
                    </div>
                  </div>
                )}

              {/* Error State */}
              {orchestrationState.status === "failed" && (
                <div className="bg-red-900/20 border-2 border-danger/50 rounded-lg p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <AlertCircle className="w-6 h-6 text-danger flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-danger mb-1">
                        Orchestration Failed
                      </h3>
                      <p className="text-text-muted">
                        One or more pipelines encountered an error. Please try
                        again.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setOrchestrationState(null);
                      setDomain("");
                    }}
                    className="bg-danger text-white px-6 py-2 rounded hover:bg-red-600 transition"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {pollingError && (
                <div className="bg-yellow-900/20 border-2 border-yellow-600/50 rounded-lg p-4">
                  <p className="text-yellow-200">{pollingError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
