"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Code2,
  RefreshCw,
} from "lucide-react";

const INVALID_TLDS = new Set([
  "test",
  "local",
  "dev",
  "example",
  "invalid",
  "localhost",
  "corp",
  "company",
  "intranet",
]);

function validateDomain(domain: string): { valid: boolean; error?: string } {
  const trimmed = domain.trim().toLowerCase();

  if (!trimmed) {
    return { valid: false, error: "Domain is required" };
  }

  const domainRegex =
    /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,}$/;
  if (!domainRegex.test(trimmed)) {
    return { valid: false, error: "Invalid domain format" };
  }

  const tld = trimmed.split(".").pop();
  if (tld && INVALID_TLDS.has(tld)) {
    return {
      valid: false,
      error: `${tld} is not a valid corporate domain`,
    };
  }

  return { valid: true };
}

interface Pipeline {
  name: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  message: string;
}

export default function CommandConsole() {
  const [domain, setDomain] = useState("");
  const [validationError, setValidationError] = useState("");
  const [submittedDomains, setSubmittedDomains] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      name: "Brand Intelligence",
      status: "pending",
      message: "Ready to start...",
    },
    {
      name: "Visual Mockup Engine",
      status: "pending",
      message: "Ready to start...",
    },
    {
      name: "Infrastructure Provisioning",
      status: "pending",
      message: "Ready to start...",
    },
  ]);
  const [currentDomain, setCurrentDomain] = useState("");
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleDomainChange = (value: string) => {
    setDomain(value);

    if (!value.trim()) {
      setValidationError("");
      return;
    }

    const { valid, error } = validateDomain(value);
    setValidationError(error || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { valid, error } = validateDomain(domain);
    if (!valid) {
      setValidationError(error || "Invalid domain");
      return;
    }

    const cleanDomain = domain.trim().toLowerCase();

    if (submittedDomains.has(cleanDomain)) {
      setValidationError("This domain has already been processed");
      return;
    }

    setLoading(true);
    setCurrentDomain(cleanDomain);

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleanDomain }),
      });

      if (!res.ok) {
        let errorMessage = "Failed to start orchestration";
        try {
          const data = await res.json();
          errorMessage = data.message || errorMessage;
        } catch {
          errorMessage = `Server error (${res.status})`;
        }
        setError(errorMessage);
        setLoading(false);
        return;
      }

      setSubmittedDomains((prev) => new Set([...prev, cleanDomain]));
      setDomain("");
      setValidationError("");

      startPolling(cleanDomain);
    } catch (err) {
      setError("Failed to submit domain");
      setLoading(false);
    }
  };

  const startPolling = (cleanDomain: string) => {
    let pollCount = 0;
    const maxPolls = 120;

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orchestrate?domain=${cleanDomain}`);
        const data = await res.json();
        const state = data.orchestration;

        setPipelines([
          {
            name: "Brand Intelligence",
            status: state.pipeline1.status,
            message: state.pipeline1.message,
          },
          {
            name: "Visual Mockup Engine",
            status: state.pipeline2.status,
            message: state.pipeline2.message,
          },
          {
            name: "Infrastructure Provisioning",
            status: state.pipeline3.status,
            message: state.pipeline3.message,
          },
        ]);

        if (state.status === "completed" || state.status === "failed") {
          clearInterval(interval);
          setLoading(false);
          pollingIntervalRef.current = null;
        }

        pollCount++;
        if (pollCount >= maxPolls) {
          clearInterval(interval);
          setLoading(false);
          pollingIntervalRef.current = null;
        }
      } catch (err) {
        // Silently ignore polling errors - polling will eventually timeout
      }
    }, 5000);

    pollingIntervalRef.current = interval;
  };

  const handleRetry = () => {
    setError("");
    if (currentDomain) {
      setDomain(currentDomain);
      handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Command Console
          </h1>
          <p className="text-text-muted text-lg">
            Enter your domain to orchestrate the full brand pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
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
                  disabled={loading || !domain.trim()}
                  className="w-full px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : "Submit Domain"}
                  {!loading && <Zap size={18} />}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-danger/20 border-2 border-danger rounded-lg flex items-center gap-3">
                  <AlertCircle size={20} className="text-danger flex-shrink-0" />
                  <p className="text-text text-sm">{error}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Pipeline Status</h2>
              {pipelines.map((pipeline, idx) => (
                <div
                  key={idx}
                  className="bg-surface border-2 border-border rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {pipeline.status === "pending" && (
                        <Clock size={24} className="text-text-muted" />
                      )}
                      {pipeline.status === "in_progress" && (
                        <Zap
                          size={24}
                          className="text-accent animate-pulse"
                        />
                      )}
                      {pipeline.status === "completed" && (
                        <CheckCircle2 size={24} className="text-green-500" />
                      )}
                      {pipeline.status === "failed" && (
                        <AlertCircle size={24} className="text-danger" />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">
                          {pipeline.name}
                        </h3>
                        <p className="text-text-muted text-sm">
                          {pipeline.message}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-mono px-2 py-1 bg-bg rounded text-text-muted">
                      {pipeline.status}
                    </span>
                  </div>

                  <div className="w-full bg-bg rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        pipeline.status === "completed"
                          ? "w-full bg-green-500"
                          : pipeline.status === "in_progress"
                          ? "w-2/3 bg-accent"
                          : pipeline.status === "failed"
                          ? "w-full bg-danger"
                          : "w-0 bg-border"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleRetry}
              disabled={loading || !error}
              className={`w-full px-6 py-3 font-semibold rounded-lg transition flex items-center justify-center gap-2 border-2 ${
                error
                  ? "bg-surface border-border text-text hover:border-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-bg border-border text-text-muted/50 cursor-not-allowed opacity-50"
              }`}
            >
              <RefreshCw size={18} />
              Retry
            </button>
          </div>

          <div className="bg-surface border-2 border-border rounded-lg p-8 h-fit">
            <h2 className="text-2xl font-bold mb-6">Brand Preview</h2>

            <div className="mb-8">
              <h3 className="font-semibold text-text-muted text-sm mb-3">
                Logo
              </h3>
              <div className="w-full aspect-square bg-bg rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <Code2 size={48} className="text-text-muted/50" />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-text-muted text-sm mb-3">
                Colors
              </h3>
              <div className="space-y-2">
                {["#a855f7", "#0d1f33", "#ecebf3"].map((color, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded border-2 border-border"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-sm text-text-muted">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-text-muted text-sm mb-3">
                Typography
              </h3>
              <div className="bg-bg rounded-lg p-4">
                <p className="text-sm text-text-muted mb-2">Font Family:</p>
                <p className="text-text text-xs">
                  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
