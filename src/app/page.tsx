"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Code2,
  RefreshCw,
  ExternalLink,
  Download,
  Users,
  MessageSquare,
  Timer,
  Target,
} from "lucide-react";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("bf_session_id");
  if (!id) {
    id = `ses_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("bf_session_id", id);
  }
  return id;
}

function logEvent(event_name: string, fields: Record<string, unknown>): void {
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_name,
      session_id: getOrCreateSessionId(),
      timestamp: new Date().toISOString(),
      ...fields,
    }),
  }).catch(() => {});
}

const INVALID_TLDS = new Set([
  "test", "local", "example", "invalid", "localhost", "corp", "intranet",
]);
// .so is valid (used by notion.so)

function validateDomain(domain: string): { valid: boolean; error?: string } {
  const trimmed = domain.trim().toLowerCase();
  if (!trimmed) return { valid: false, error: "Domain is required" };
  const domainRegex =
    /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,}$/;
  if (!domainRegex.test(trimmed))
    return { valid: false, error: "Invalid domain format" };
  const tld = trimmed.split(".").pop();
  if (tld && INVALID_TLDS.has(tld))
    return { valid: false, error: `${tld} is not a valid corporate domain` };
  return { valid: true };
}

interface PipelineState {
  name: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  message: string;
}

interface BrandData {
  colors: { hex: string; type?: string }[];
  logoUrl?: string;
  fontFamily?: string;
  confidence: number;
}

interface StorefrontData {
  url: string;
  productCount: number;
}

const DEFAULT_PIPELINES: PipelineState[] = [
  { name: "Brand Intelligence", status: "pending", message: "Ready to start..." },
  { name: "Visual Mockup Engine", status: "pending", message: "Ready to start..." },
  { name: "Infrastructure Provisioning", status: "pending", message: "Ready to start..." },
];

export default function CommandConsole() {
  const [domain, setDomain] = useState("");
  const [validationError, setValidationError] = useState("");
  const [submittedDomains, setSubmittedDomains] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pipelines, setPipelines] = useState<PipelineState[]>(DEFAULT_PIPELINES);
  const [currentDomain, setCurrentDomain] = useState("");
  const [orchestrationStatus, setOrchestrationStatus] = useState<
    "idle" | "in_progress" | "completed" | "failed"
  >("idle");
  const [storefront, setStorefront] = useState<StorefrontData | null>(null);
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [provisioningTime, setProvisioningTime] = useState<number | null>(null);
  const [publishStatus, setPublishStatus] = useState<"idle" | "publishing" | "published" | "failed">("idle");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const firedEventsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    if (!currentDomain) return;
    const [p1, p2, p3] = pipelines;

    if (p1.status === "in_progress" && !firedEventsRef.current.has("brand_extraction_started")) {
      firedEventsRef.current.add("brand_extraction_started");
      logEvent("brand_extraction_started", { domain: currentDomain });
    }
    if ((p1.status === "completed" || p1.status === "failed") && !firedEventsRef.current.has("brand_extraction_complete")) {
      firedEventsRef.current.add("brand_extraction_complete");
      logEvent("brand_extraction_complete", {
        domain: currentDomain,
        status: p1.status,
        fidelity_score: brandData?.confidence ?? null,
      });
    }

    if (p2.status === "in_progress" && !firedEventsRef.current.has("mockup_generation_started")) {
      firedEventsRef.current.add("mockup_generation_started");
      logEvent("mockup_generation_started", { domain: currentDomain });
    }
    if ((p2.status === "completed" || p2.status === "failed") && !firedEventsRef.current.has("mockup_generation_complete")) {
      firedEventsRef.current.add("mockup_generation_complete");
      const productMatch = p2.message.match(/(\d+) products/);
      logEvent("mockup_generation_complete", {
        domain: currentDomain,
        status: p2.status,
        product_count: productMatch ? parseInt(productMatch[1], 10) : null,
      });
    }

    if (p3.status === "in_progress" && !firedEventsRef.current.has("storefront_generation_started")) {
      firedEventsRef.current.add("storefront_generation_started");
      logEvent("storefront_generation_started", { domain: currentDomain });
    }
    if ((p3.status === "completed" || p3.status === "failed") && !firedEventsRef.current.has("storefront_generation_complete")) {
      firedEventsRef.current.add("storefront_generation_complete");
      logEvent("storefront_generation_complete", {
        domain: currentDomain,
        status: p3.status,
        storefront_url: storefront?.url ?? null,
        product_count: storefront?.productCount ?? null,
      });
    }
  }, [pipelines, currentDomain, brandData, storefront]);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const applyOrchestrationState = (orch: {
    status: string;
    pipeline1?: { status: string; message: string };
    pipeline2?: { status: string; message: string };
    pipeline3?: { status: string; message: string };
    storefront?: { url: string; productCount: number };
    brandData?: BrandData;
    error?: string;
  }) => {
    setPipelines([
      {
        name: "Brand Intelligence",
        status: (orch.pipeline1?.status ?? "pending") as PipelineState["status"],
        message: orch.pipeline1?.message ?? "",
      },
      {
        name: "Visual Mockup Engine",
        status: (orch.pipeline2?.status ?? "pending") as PipelineState["status"],
        message: orch.pipeline2?.message ?? "",
      },
      {
        name: "Infrastructure Provisioning",
        status: (orch.pipeline3?.status ?? "pending") as PipelineState["status"],
        message: orch.pipeline3?.message ?? "",
      },
    ]);

    if (orch.status === "completed") {
      setOrchestrationStatus("completed");
      if (orch.storefront) setStorefront(orch.storefront);
      if (orch.brandData) setBrandData(orch.brandData);
      if (startTimeRef.current) {
        setProvisioningTime(Math.round((Date.now() - startTimeRef.current) / 1000));
      }
    } else if (orch.status === "failed") {
      setOrchestrationStatus("failed");
      if (orch.error) setError(orch.error);
      if (orch.brandData) setBrandData(orch.brandData);
    }
  };

  const startPolling = (cleanDomain: string) => {
    stopPolling();
    let pollCount = 0;
    const maxPolls = 120; // 10 minutes at 5s intervals

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/orchestrate?domain=${encodeURIComponent(cleanDomain)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!data.orchestration) return;

        applyOrchestrationState(data.orchestration);

        if (
          data.orchestration.status === "completed" ||
          data.orchestration.status === "failed"
        ) {
          stopPolling();
          setLoading(false);
        }

        pollCount++;
        if (pollCount >= maxPolls) {
          stopPolling();
          setLoading(false);
          setError("Orchestration timed out — please retry");
          setOrchestrationStatus("failed");
        }
      } catch {
        // silently ignore transient poll errors
      }
    }, 5000);

    pollingRef.current = interval;
  };

  const handleDomainChange = (value: string) => {
    setDomain(value);
    if (!value.trim()) {
      setValidationError("");
      return;
    }
    const { error: valErr } = validateDomain(value);
    setValidationError(valErr || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { valid, error: valErr } = validateDomain(domain);
    if (!valid) {
      setValidationError(valErr || "Invalid domain");
      return;
    }

    const cleanDomain = domain.trim().toLowerCase();

    firedEventsRef.current = new Set();
    logEvent("domain_submitted", { domain: cleanDomain });

    if (submittedDomains.has(cleanDomain)) {
      setValidationError("This domain has already been processed");
      return;
    }

    setLoading(true);
    setCurrentDomain(cleanDomain);
    setOrchestrationStatus("in_progress");
    setStorefront(null);
    setBrandData(null);
    setProvisioningTime(null);
    setPublishStatus("idle");
    startTimeRef.current = Date.now();

    setPipelines([
      { name: "Brand Intelligence", status: "in_progress", message: "Extracting brand assets..." },
      { name: "Visual Mockup Engine", status: "pending", message: "Waiting for brand data..." },
      { name: "Infrastructure Provisioning", status: "pending", message: "Waiting for mockups..." },
    ]);

    // Start polling BEFORE awaiting POST so progress updates show during execution
    startPolling(cleanDomain);

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleanDomain }),
      });

      // POST has returned — stop polling and use the definitive response
      stopPolling();

      const data = await res.json().catch(() => ({})) as {
        success?: boolean;
        message?: string;
        orchestration?: Parameters<typeof applyOrchestrationState>[0];
      };

      if (!res.ok) {
        const errorMessage =
          data.message ||
          (data.orchestration as { error?: string } | undefined)?.error ||
          `Server error (${res.status})`;
        setError(errorMessage);
        setOrchestrationStatus("failed");
        // Still apply pipeline state so user can see which step failed
        if (data.orchestration) applyOrchestrationState(data.orchestration);
        setLoading(false);
        return;
      }

      if (data.orchestration) applyOrchestrationState(data.orchestration);

      setSubmittedDomains((prev) => new Set([...prev, cleanDomain]));
      setDomain("");
      setValidationError("");
    } catch {
      stopPolling();
      setError("Network error — check your connection and retry");
      setOrchestrationStatus("failed");
    }

    setLoading(false);
  };

  const handleRetry = () => {
    setError("");
    setOrchestrationStatus("idle");
    setPipelines(DEFAULT_PIPELINES);
    setPublishStatus("idle");
    if (currentDomain) setDomain(currentDomain);
  };

  const handlePublish = async () => {
    logEvent("user_clicks_publish", {
      domain: currentDomain,
      storefront_url: storefront?.url ?? null,
      product_count: storefront?.productCount ?? null,
    });
    setPublishStatus("publishing");
    try {
      const res = await fetch("/api/publish-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: currentDomain }),
      });
      setPublishStatus(res.ok ? "published" : "failed");
    } catch {
      setPublishStatus("failed");
    }
  };

  const handleSupportEscalation = async () => {
    try {
      const res = await fetch("/api/support-escalation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: currentDomain, error }),
      });
      const data = await res.json().catch(() => ({})) as { message?: string };
      alert(data.message ?? "Support has been notified.");
    } catch {
      alert("Failed to reach support — please email support@branded-fit.com");
    }
  };

  const showPanel = orchestrationStatus !== "idle";

  return (
    <div className="min-h-screen bg-bg text-text p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Command Console</h1>
            <p className="text-text-muted text-lg">
              Enter your domain to orchestrate the full brand pipeline
            </p>
          </div>
          <a
            href="/store/demo"
            className="px-4 py-2 bg-surface border-2 border-border text-text-muted hover:text-text hover:border-accent/50 text-sm font-medium rounded-lg transition flex items-center gap-2"
          >
            <ExternalLink size={14} />
            Preview Demo Store
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Domain Input */}
            <div className="bg-surface border-2 border-border rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Enter Domain</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => handleDomainChange(e.target.value)}
                    disabled={loading}
                    className={`w-full px-4 py-3 bg-bg border-2 rounded-lg text-text placeholder-text-muted focus:outline-none transition ${
                      validationError
                        ? "border-danger focus:border-danger"
                        : "border-border focus:border-accent"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {validationError && (
                    <p className="text-danger text-sm mt-2 flex items-center gap-2">
                      <AlertCircle size={16} />
                      {validationError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !domain.trim() || !!validationError}
                  className="w-full px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Domain
                      <Zap size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Error banner */}
              {error && (
                <div className="mt-4 p-4 bg-danger/10 border-2 border-danger rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertCircle size={20} className="text-danger flex-shrink-0 mt-0.5" />
                    <p className="text-text text-sm">{error}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 bg-surface border-2 border-border text-text text-sm font-medium rounded-lg hover:border-accent/50 transition flex items-center gap-2"
                    >
                      <RefreshCw size={14} />
                      Retry
                    </button>
                    <button
                      onClick={handleSupportEscalation}
                      className="px-4 py-2 bg-surface border-2 border-border text-text text-sm font-medium rounded-lg hover:border-accent/50 transition flex items-center gap-2"
                    >
                      <MessageSquare size={14} />
                      Contact Support
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pipeline Status */}
            {showPanel && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Pipeline Status</h2>
                {pipelines.map((pipeline, idx) => (
                  <div
                    key={idx}
                    className={`bg-surface border-2 rounded-lg p-6 transition-colors ${
                      pipeline.status === "completed"
                        ? "border-emerald-500/50"
                        : pipeline.status === "in_progress"
                        ? "border-accent/50"
                        : pipeline.status === "failed"
                        ? "border-danger/50"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {pipeline.status === "pending" && (
                          <Clock size={24} className="text-text-muted" />
                        )}
                        {pipeline.status === "in_progress" && (
                          <Zap size={24} className="text-accent animate-pulse" />
                        )}
                        {pipeline.status === "completed" && (
                          <CheckCircle2 size={24} className="text-emerald-500" />
                        )}
                        {pipeline.status === "failed" && (
                          <AlertCircle size={24} className="text-danger" />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">
                            Pipeline {idx + 1}: {pipeline.name}
                          </h3>
                          <p className="text-text-muted text-sm">{pipeline.message}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-mono px-2 py-1 rounded ${
                          pipeline.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : pipeline.status === "in_progress"
                            ? "bg-accent/20 text-accent"
                            : pipeline.status === "failed"
                            ? "bg-danger/20 text-danger"
                            : "bg-bg text-text-muted"
                        }`}
                      >
                        {pipeline.status}
                      </span>
                    </div>

                    <div className="w-full bg-bg rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          pipeline.status === "completed"
                            ? "w-full bg-emerald-500"
                            : pipeline.status === "in_progress"
                            ? "w-2/3 bg-accent animate-pulse"
                            : pipeline.status === "failed"
                            ? "w-full bg-danger"
                            : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Success Card */}
            {orchestrationStatus === "completed" && storefront && (
              <div className="bg-surface border-2 border-emerald-500/50 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 size={28} className="text-emerald-500" />
                  <h2 className="text-2xl font-bold">Storefront Ready</h2>
                </div>

                {/* Storefront URL */}
                <div className="mb-6 p-4 bg-bg rounded-lg flex items-center gap-3">
                  <ExternalLink size={16} className="text-accent flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-text-muted text-xs mb-1">Live Storefront URL</p>
                    <a
                      href={storefront.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline text-sm font-mono break-all"
                    >
                      {storefront.url}
                    </a>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-bg rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-text">{storefront.productCount}</p>
                    <p className="text-text-muted text-xs mt-1">Products</p>
                  </div>
                  {brandData && (
                    <div className="bg-bg rounded-lg p-4 text-center">
                      <p
                        className={`text-3xl font-bold ${
                          brandData.confidence >= 85
                            ? "text-emerald-400"
                            : brandData.confidence >= 60
                            ? "text-amber-400"
                            : "text-danger"
                        }`}
                      >
                        {brandData.confidence}%
                      </p>
                      <p className="text-text-muted text-xs mt-1">Brand Fidelity</p>
                    </div>
                  )}
                  {provisioningTime !== null && (
                    <div className="bg-bg rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-text">{provisioningTime}s</p>
                      <p className="text-text-muted text-xs mt-1">Provisioning Time</p>
                    </div>
                  )}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={storefront.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 transition flex items-center gap-2 text-sm"
                  >
                    <ExternalLink size={16} />
                    View Store
                  </a>
                  <button
                    onClick={handlePublish}
                    disabled={publishStatus === "publishing" || publishStatus === "published"}
                    className={`px-5 py-2.5 border-2 font-semibold rounded-lg transition flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                      publishStatus === "published"
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : publishStatus === "failed"
                        ? "bg-danger/10 border-danger/50 text-danger"
                        : "bg-surface border-border text-text hover:border-accent/50"
                    }`}
                  >
                    {publishStatus === "published" ? (
                      <><CheckCircle2 size={16} />Published!</>
                    ) : publishStatus === "publishing" ? (
                      <><RefreshCw size={16} className="animate-spin" />Publishing...</>
                    ) : publishStatus === "failed" ? (
                      <><AlertCircle size={16} />Retry Publish</>
                    ) : (
                      <><Zap size={16} />Publish Store</>
                    )}
                  </button>
                  <a
                    href={`/api/download-assets?domain=${encodeURIComponent(currentDomain)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-surface border-2 border-border text-text font-semibold rounded-lg hover:border-accent/50 transition flex items-center gap-2 text-sm"
                  >
                    <Download size={16} />
                    Download Assets
                  </a>
                  <button
                    onClick={() => alert("Team invite feature coming soon.")}
                    className="px-5 py-2.5 bg-surface border-2 border-border text-text font-semibold rounded-lg hover:border-accent/50 transition flex items-center gap-2 text-sm"
                  >
                    <Users size={16} />
                    Invite Team
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right column — Brand Preview */}
          <div className="bg-surface border-2 border-border rounded-lg p-8 h-fit sticky top-8">
            <h2 className="text-2xl font-bold mb-6">Brand Preview</h2>

            {/* Logo */}
            <div className="mb-8">
              <h3 className="font-semibold text-text-muted text-sm mb-3">Logo</h3>
              <div className="w-full aspect-square bg-bg rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                {brandData?.logoUrl ? (
                  <img
                    src={brandData.logoUrl}
                    alt={`${currentDomain} logo`}
                    className="max-w-full max-h-full object-contain p-4"
                  />
                ) : (
                  <Code2 size={48} className="text-text-muted/50" />
                )}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <h3 className="font-semibold text-text-muted text-sm mb-3">Colors</h3>
              <div className="space-y-2">
                {(
                  brandData?.colors && brandData.colors.length > 0
                    ? brandData.colors.slice(0, 3)
                    : [
                        { hex: "#a855f7" },
                        { hex: "#0d1f33" },
                        { hex: "#ecebf3" },
                      ]
                ).map((color, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded border-2 border-border flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="font-mono text-sm text-text-muted">{color.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="mb-6">
              <h3 className="font-semibold text-text-muted text-sm mb-3">Typography</h3>
              <div className="bg-bg rounded-lg p-4">
                <p className="text-sm text-text-muted mb-2">Font Family:</p>
                <p className="text-text text-xs">
                  {brandData?.fontFamily ??
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'}
                </p>
              </div>
            </div>

            {/* Fidelity meter */}
            {brandData && (
              <div className="pt-6 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={16} className="text-text-muted" />
                  <h3 className="font-semibold text-text-muted text-sm">Brand Fidelity</h3>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 bg-bg rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        brandData.confidence >= 85
                          ? "bg-emerald-500"
                          : brandData.confidence >= 60
                          ? "bg-amber-500"
                          : "bg-danger"
                      }`}
                      style={{ width: `${brandData.confidence}%` }}
                    />
                  </div>
                  <span className="text-text font-semibold text-sm tabular-nums">
                    {brandData.confidence}%
                  </span>
                </div>
                <p className="text-text-muted text-xs">
                  {brandData.confidence >= 85
                    ? "High confidence — ready for launch"
                    : brandData.confidence >= 60
                    ? "Moderate confidence — review recommended"
                    : "Low confidence — manual review required"}
                </p>
              </div>
            )}

            {/* Provisioning time */}
            {provisioningTime !== null && (
              <div className="mt-4 flex items-center gap-2 text-text-muted text-xs">
                <Timer size={13} />
                <span>Provisioned in {provisioningTime}s</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
