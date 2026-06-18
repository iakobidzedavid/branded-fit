"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { trackEvent, getOrCreateSessionId } from "@/lib/analytics";
import type { OrchestrationState } from "@/lib/orchestration-state";
import {
  Check,
  AlertCircle,
  Loader,
  Clock,
  ExternalLink,
  ArrowLeft,
  Zap,
  Palette,
  Package,
  ShoppingBag,
  Globe,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

type PipelineStatus = "pending" | "in_progress" | "completed" | "failed";

interface PipelineState {
  status: PipelineStatus;
  message: string;
}

type ConsolePhase = "input" | "running" | "success" | "failed";

interface BrandData {
  colors: { hex: string; type?: string }[];
  logoUrl?: string;
  fontFamily?: string;
  confidence: number;
}

interface ConsoleState {
  phase: ConsolePhase;
  pipeline1: PipelineState;
  pipeline2: PipelineState;
  pipeline3: PipelineState;
  submittedDomain: string;
  storefrontUrl: string;
  brandData: BrandData | null;
  productCount: number;
}

const INITIAL: ConsoleState = {
  phase: "input",
  pipeline1: { status: "pending", message: "Ready to extract brand data" },
  pipeline2: { status: "pending", message: "Awaiting brand assets" },
  pipeline3: { status: "pending", message: "Awaiting product mockups" },
  submittedDomain: "",
  storefrontUrl: "",
  brandData: null,
  productCount: 0,
};

const PREVIEW_PRODUCTS = [
  { id: 1, name: "Heavyweight T-Shirt", category: "Apparel", price: "$17" },
  { id: 2, name: "Premium Hoodie", category: "Apparel", price: "$26" },
  { id: 3, name: "Dad Cap", category: "Accessories", price: "$9" },
];

const STATUS_BORDER: Record<PipelineStatus, string> = {
  pending: "border-border",
  in_progress: "border-accent",
  completed: "border-emerald-400",
  failed: "border-danger",
};

const STATUS_LABEL: Record<PipelineStatus, string> = {
  pending: "Pending",
  in_progress: "Processing…",
  completed: "Complete",
  failed: "Failed",
};

const STATUS_BADGE: Record<PipelineStatus, string> = {
  pending: "bg-surface text-text-muted border-border",
  in_progress: "bg-accent/10 text-accent border-accent/20",
  completed: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  failed: "bg-danger/10 text-danger border-danger/20",
};

const STATUS_ICON_RING: Record<PipelineStatus, string> = {
  pending: "bg-surface border-border",
  in_progress: "bg-accent/10 border-accent/30",
  completed: "bg-emerald-400/10 border-emerald-400/30",
  failed: "bg-danger/10 border-danger/30",
};

const STATUS_MSG: Record<PipelineStatus, string> = {
  pending: "text-text-muted",
  in_progress: "text-text-muted",
  completed: "text-emerald-400",
  failed: "text-danger",
};

const PROGRESS_WIDTH: Record<PipelineStatus, number> = {
  pending: 0,
  in_progress: 65,
  completed: 100,
  failed: 0,
};

const PROGRESS_COLOR: Record<PipelineStatus, string> = {
  pending: "bg-border",
  in_progress: "bg-accent",
  completed: "bg-emerald-400",
  failed: "bg-danger",
};

function StatusIcon({ status }: { status: PipelineStatus }) {
  if (status === "completed") return <Check className="w-4 h-4 text-emerald-400" />;
  if (status === "in_progress") return <Loader className="w-4 h-4 text-accent animate-spin" />;
  if (status === "failed") return <AlertCircle className="w-4 h-4 text-danger" />;
  return <Clock className="w-4 h-4 text-text-muted" />;
}

function PipelineCard({
  number,
  title,
  pipeline,
}: {
  number: string;
  title: string;
  pipeline: PipelineState;
}) {
  const { status, message } = pipeline;
  return (
    <div
      className={`bg-surface border-2 rounded-xl p-5 transition-all duration-300 ${STATUS_BORDER[status]}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 ${STATUS_ICON_RING[status]}`}
          >
            <StatusIcon status={status} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-mono text-text-muted">{number}</span>
              <h3 className="font-semibold text-text text-sm">{title}</h3>
            </div>
            <p className={`text-sm ${STATUS_MSG[status]}`}>{message}</p>
          </div>
        </div>
        <span
          className={`text-xs rounded-full px-2.5 py-1 font-medium border whitespace-nowrap flex-shrink-0 ${STATUS_BADGE[status]}`}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>
      <div className="w-full bg-bg rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${PROGRESS_COLOR[status]} ${
            status === "in_progress" ? "animate-pulse" : ""
          }`}
          style={{ width: `${PROGRESS_WIDTH[status]}%` }}
        />
      </div>
    </div>
  );
}

export default function CommandConsole() {
  const [domain, setDomain] = useState("");
  const [validationError, setValidationError] = useState("");
  const [state, setState] = useState<ConsoleState>(INITIAL);
  const [supportStatus, setSupportStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sessionIdRef = useRef<string>("");
  const prevP1 = useRef<PipelineStatus>("pending");
  const prevP2 = useRef<PipelineStatus>("pending");
  const prevP3 = useRef<PipelineStatus>("pending");

  const stopPolling = useCallback(() => {
    if (pollingRef.current !== null) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlDomain = params.get("domain");
      if (urlDomain) setDomain(urlDomain);
    }
    return () => {
      stopPolling();
      abortRef.current?.abort();
    };
  }, [stopPolling]);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  useEffect(() => {
    if (!state.submittedDomain) return;
    const sid = sessionIdRef.current;
    const domain = state.submittedDomain;
    const ts = new Date().toISOString();

    if (prevP1.current !== state.pipeline1.status) {
      const s = state.pipeline1.status;
      if (s === "in_progress" || (prevP1.current === "pending" && s !== "pending")) {
        trackEvent({ event_name: "brand_extraction_started", domain, domain_submitted: domain, session_id: sid, pipeline_stage: "brand_intelligence", status: "in_progress", timestamp: ts });
      }
      if (s === "completed") {
        trackEvent({ event_name: "brand_extraction_completed", domain, domain_submitted: domain, session_id: sid, pipeline_stage: "brand_intelligence", status: "completed", timestamp: ts });
      } else if (s === "failed") {
        trackEvent({ event_name: "brand_extraction_failed", domain, domain_submitted: domain, session_id: sid, pipeline_stage: "brand_intelligence", status: "failed", timestamp: ts, error_message: state.pipeline1.message });
      }
      prevP1.current = s;
    }

    if (prevP2.current !== state.pipeline2.status) {
      const s = state.pipeline2.status;
      if (s === "in_progress" || (prevP2.current === "pending" && s !== "pending")) {
        trackEvent({ event_name: "mockup_generation_started", domain, domain_submitted: domain, session_id: sid, pipeline_stage: "mockup_generation", status: "in_progress", timestamp: ts });
      }
      if (s === "completed") {
        trackEvent({ event_name: "mockup_generation_completed", domain, domain_submitted: domain, session_id: sid, pipeline_stage: "mockup_generation", status: "completed", timestamp: ts });
      } else if (s === "failed") {
        trackEvent({ event_name: "mockup_generation_failed", domain, domain_submitted: domain, session_id: sid, pipeline_stage: "mockup_generation", status: "failed", timestamp: ts, error_message: state.pipeline2.message });
      }
      prevP2.current = s;
    }

    if (prevP3.current !== state.pipeline3.status) {
      const s = state.pipeline3.status;
      if (s === "in_progress" || (prevP3.current === "pending" && s !== "pending")) {
        trackEvent({ event_name: "storefront_generation_started", domain, domain_submitted: domain, session_id: sid, pipeline_stage: "shopify_provisioning", status: "in_progress", timestamp: ts });
      }
      if (s === "completed") {
        trackEvent({ event_name: "storefront_generation_completed", domain, domain_submitted: domain, session_id: sid, pipeline_stage: "shopify_provisioning", status: "completed", timestamp: ts, context: { product_count: state.productCount, store_url: state.storefrontUrl } });
      } else if (s === "failed") {
        trackEvent({ event_name: "storefront_generation_failed", domain, domain_submitted: domain, session_id: sid, pipeline_stage: "shopify_provisioning", status: "failed", timestamp: ts, error_message: state.pipeline3.message });
      }
      prevP3.current = s;
    }
  }, [
    state.pipeline1.status, state.pipeline2.status, state.pipeline3.status,
    state.pipeline1.message, state.pipeline2.message, state.pipeline3.message,
    state.submittedDomain, state.productCount, state.storefrontUrl,
  ]);

  const validate = (value: string): boolean => {
    const clean = value.toLowerCase().trim();
    if (!clean) {
      setValidationError("Domain is required");
      return false;
    }
    const regex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    if (!regex.test(clean)) {
      setValidationError("Enter a valid domain (e.g., ramp.com)");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDomain(value);
    if (validationError && value) validate(value);
    else if (!value) setValidationError("");
  };

  const applyOrchState = useCallback(
    (orch: OrchestrationState, onlyWhenRunning = false) => {
      setState((prev) => {
        if (onlyWhenRunning && prev.phase !== "running") return prev;
        return {
          ...prev,
          phase:
            orch.status === "completed"
              ? "success"
              : orch.status === "failed"
              ? "failed"
              : "running",
          pipeline1: orch.pipeline1,
          pipeline2: orch.pipeline2,
          pipeline3: orch.pipeline3,
          storefrontUrl: orch.storefront?.url ?? prev.storefrontUrl,
          brandData: orch.brandData ?? prev.brandData,
          productCount: orch.storefront?.productCount ?? prev.productCount,
        };
      });
    },
    []
  );

  const startPolling = useCallback(
    (cleanDomain: string) => {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(
            `/api/orchestrate?domain=${encodeURIComponent(cleanDomain)}`
          );
          if (!res.ok) return;
          const data: { status: string; orchestration: OrchestrationState } =
            await res.json();
          if (!data.orchestration) return;
          applyOrchState(data.orchestration, true);
          if (
            data.orchestration.status === "completed" ||
            data.orchestration.status === "failed"
          ) {
            stopPolling();
          }
        } catch {
          // transient poll error — next tick will retry
        }
      }, 2000);
    },
    [applyOrchState, stopPolling]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(domain)) return;

    stopPolling();
    abortRef.current?.abort();

    const cleanDomain = domain.toLowerCase().trim();

    trackEvent({
      event_name: "domain_submitted",
      domain: cleanDomain,
      domain_submitted: cleanDomain,
      session_id: sessionIdRef.current,
      status: "submitted",
      timestamp: new Date().toISOString(),
    });

    setState({
      ...INITIAL,
      phase: "running",
      submittedDomain: cleanDomain,
      pipeline1: { status: "in_progress", message: "Extracting brand assets from Brandfetch…" },
    });

    startPolling(cleanDomain);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleanDomain }),
        signal: ctrl.signal,
      });

      stopPolling();

      if (res.status === 400) {
        const err: { message?: string } = await res.json().catch(() => ({}));
        setState(INITIAL);
        setValidationError(err.message ?? "Invalid domain");
        return;
      }

      const data: { success: boolean; orchestration: OrchestrationState } =
        await res.json();
      applyOrchState(data.orchestration);

    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      stopPolling();
      setState((prev) => ({
        ...prev,
        phase: "failed",
        pipeline1:
          prev.pipeline1.status === "in_progress"
            ? { status: "failed", message: "Connection failed — please try again" }
            : prev.pipeline1,
      }));
    }
  };

  const handleReset = () => {
    stopPolling();
    abortRef.current?.abort();
    abortRef.current = null;
    prevP1.current = "pending";
    prevP2.current = "pending";
    prevP3.current = "pending";
    setState(INITIAL);
    setDomain("");
    setValidationError("");
    setSupportStatus("idle");
  };

  const handleEscalateSupport = async () => {
    if (supportStatus !== "idle") return;
    setSupportStatus("sending");
    const failedMessage =
      state.pipeline1.status === "failed"
        ? state.pipeline1.message
        : state.pipeline2.status === "failed"
        ? state.pipeline2.message
        : state.pipeline3.status === "failed"
        ? state.pipeline3.message
        : "Orchestration failed";
    try {
      const res = await fetch("/api/support-escalation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: state.submittedDomain, error: failedMessage }),
      });
      setSupportStatus(res.ok ? "sent" : "failed");
    } catch {
      setSupportStatus("failed");
    }
  };

  const { phase, pipeline1, pipeline2, pipeline3 } = state;
  const showPipelines = phase === "running" || phase === "success" || phase === "failed";

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      {/* Nav */}
      <header className="bg-surface border-b border-border px-4 py-3 flex-shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-text-muted hover:text-text transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Branded Fit
          </Link>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full transition-colors ${
                phase === "running"
                  ? "bg-amber-400 animate-pulse"
                  : phase === "success"
                  ? "bg-emerald-400"
                  : phase === "failed"
                  ? "bg-red-400"
                  : "bg-text-muted/30"
              }`}
            />
            <span className="text-xs font-mono text-text-muted tracking-wider">
              {phase === "running"
                ? "PIPELINE RUNNING"
                : phase === "success"
                ? "PIPELINE COMPLETE"
                : phase === "failed"
                ? "PIPELINE FAILED"
                : "COMMAND CONSOLE"}
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {!showPipelines ? (
          /* ---- INPUT PHASE ---- */
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
            <div className="w-full max-w-xl">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5 text-accent text-sm font-medium mb-6">
                <Zap className="w-3.5 h-3.5" />
                Domain to live storefront in 10 minutes
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Command Console
              </h1>
              <p className="text-text-muted text-lg mb-10">
                Enter your company domain. Three automated pipelines will build
                your branded Shopify storefront in real time.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 mb-10">
                <div>
                  <label htmlFor="domain-input" className="sr-only">
                    Company domain
                  </label>
                  <input
                    id="domain-input"
                    type="text"
                    autoFocus
                    placeholder="Enter your domain (e.g., ramp.com)"
                    value={domain}
                    onChange={handleChange}
                    className={`w-full px-6 py-5 bg-surface border-2 text-text text-lg placeholder-text-muted rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 transition ${
                      validationError ? "border-danger" : "border-border"
                    }`}
                  />
                  {validationError && (
                    <p className="text-danger text-sm mt-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {validationError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!domain || !!validationError}
                  className="w-full py-5 bg-accent text-white font-semibold rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-lg flex items-center justify-center gap-2"
                >
                  Generate Brand Drop
                  <ExternalLink className="w-5 h-5" />
                </button>
              </form>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Palette, label: "Brand Intelligence", time: "~30s" },
                  { icon: Package, label: "Mockup Generation", time: "~60s" },
                  { icon: Globe, label: "Shopify Provisioning", time: "~3 min" },
                ].map(({ icon: Icon, label, time }) => (
                  <div
                    key={label}
                    className="bg-surface border border-border rounded-lg p-3 text-center"
                  >
                    <Icon className="w-4 h-4 text-accent mx-auto mb-2" />
                    <p className="text-text text-xs font-medium leading-tight mb-0.5">
                      {label}
                    </p>
                    <p className="text-text-muted text-xs font-mono">{time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ---- RUNNING / SUCCESS / FAILED PHASE ---- */
          <div className="flex-1 px-4 py-8 md:py-10">
            <div className="max-w-5xl mx-auto">
              {/* Domain + reset */}
              <div className="flex items-start justify-between mb-8 gap-4">
                <div>
                  <p className="text-text-muted text-sm">Processing domain</p>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {state.submittedDomain}
                  </h2>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-text-muted hover:text-text border border-border rounded-lg px-4 py-2 transition flex-shrink-0"
                >
                  Start Over
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pipelines */}
                <div className="space-y-4">
                  <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-2">
                    Pipeline Status
                  </p>
                  <PipelineCard
                    number="01"
                    title="Brand Intelligence"
                    pipeline={pipeline1}
                  />
                  <PipelineCard
                    number="02"
                    title="Mockup Generation"
                    pipeline={pipeline2}
                  />
                  <PipelineCard
                    number="03"
                    title="Shopify Provisioning"
                    pipeline={pipeline3}
                  />
                </div>

                {/* Right panel */}
                <div>
                  {phase === "success" ? (
                    <div className="space-y-4">
                      {/* Success card */}
                      <div className="bg-emerald-900/20 border-2 border-emerald-400/40 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-9 h-9 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="font-bold text-emerald-300">
                              Brand Drop Ready!
                            </h3>
                            <p className="text-text-muted text-sm">
                              {state.productCount > 0 ? state.productCount : 3} products published to your Shopify storefront
                            </p>
                          </div>
                        </div>

                        {state.brandData && (
                          <div className="flex items-center gap-3 bg-bg/40 rounded-lg px-3 py-2 mb-3">
                            {state.brandData.logoUrl && (
                              <img
                                src={state.brandData.logoUrl}
                                alt={`${state.submittedDomain} logo`}
                                className="w-8 h-8 object-contain rounded flex-shrink-0"
                              />
                            )}
                            <div className="flex gap-1.5 flex-wrap">
                              {state.brandData.colors.slice(0, 5).map((c, i) => (
                                <div
                                  key={i}
                                  className="w-5 h-5 rounded-full border border-white/10 flex-shrink-0"
                                  style={{ backgroundColor: c.hex }}
                                  title={c.hex}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-text-muted ml-auto flex-shrink-0">
                              {state.brandData.confidence}% fidelity
                            </span>
                          </div>
                        )}

                        <div className="bg-bg/60 rounded-lg px-4 py-3 mb-4">
                          <p className="text-text-muted text-xs mb-1">
                            Shopify Storefront URL
                          </p>
                          <p className="text-accent text-sm font-mono break-all">
                            {state.storefrontUrl}
                          </p>
                        </div>
                        <a
                          href={state.storefrontUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Shopify Storefront
                        </a>
                      </div>

                      {/* Product preview */}
                      <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
                        Product Preview
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {PREVIEW_PRODUCTS.map((product) => (
                          <div
                            key={product.id}
                            className="bg-surface border border-border rounded-lg overflow-hidden hover:border-accent/50 transition group cursor-default"
                          >
                            <div className="aspect-square flex items-center justify-center bg-accent/10 border-b border-border group-hover:bg-accent/15 transition">
                              <ShoppingBag className="w-8 h-8 text-accent opacity-50 group-hover:opacity-80 transition" />
                            </div>
                            <div className="p-3">
                              <p className="text-text text-xs font-semibold leading-snug">
                                {product.name}
                              </p>
                              <p className="text-text-muted text-xs">
                                {product.category}
                              </p>
                              <p className="text-accent text-sm font-bold mt-1">
                                {product.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : phase === "failed" ? (
                    /* Failed state */
                    <div className="flex flex-col items-center justify-center bg-red-900/10 border-2 border-red-400/30 rounded-xl p-8 text-center min-h-64 h-full">
                      <div className="w-14 h-14 rounded-full bg-red-400/10 border border-red-400/30 flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      </div>
                      <p className="font-semibold text-text mb-1">Pipeline Failed</p>
                      <p className="text-text-muted text-sm max-w-xs mb-6">
                        {pipeline1.status === "failed"
                          ? pipeline1.message
                          : pipeline2.status === "failed"
                          ? pipeline2.message
                          : pipeline3.status === "failed"
                          ? pipeline3.message
                          : "An error occurred during orchestration"}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleReset}
                          className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text hover:border-accent/50 transition"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Try Again
                        </button>
                        <button
                          onClick={handleEscalateSupport}
                          disabled={supportStatus === "sending" || supportStatus === "sent"}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition disabled:cursor-not-allowed ${
                            supportStatus === "sent"
                              ? "bg-emerald-400/10 border border-emerald-400/30 text-emerald-400"
                              : "bg-surface border border-border text-text-muted hover:border-danger/50 hover:text-text"
                          }`}
                        >
                          {supportStatus === "sending" ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : supportStatus === "sent" ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <MessageSquare className="w-4 h-4" />
                          )}
                          {supportStatus === "sent" ? "Support Notified" : "Contact Support"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Waiting / running state */
                    <div className="flex flex-col items-center justify-center bg-surface border border-border rounded-xl p-8 text-center min-h-64 h-full">
                      <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-4">
                        <Loader className="w-6 h-6 text-accent animate-spin" />
                      </div>
                      <p className="font-semibold text-text mb-1">
                        Building your storefront…
                      </p>
                      <p className="text-text-muted text-sm max-w-xs">
                        Product preview will appear once all three pipelines
                        complete
                      </p>
                      <div className="flex gap-1.5 mt-5">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-pulse"
                            style={{ animationDelay: `${i * 0.25}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
