"use client";

import { useState, useEffect } from "react";
import {
  Loader,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Download,
  Users,
} from "lucide-react";

type PipelineStatus = "pending" | "in_progress" | "completed" | "failed";

interface Pipeline {
  name: string;
  status: PipelineStatus;
  message: string;
}

interface OrchestrationState {
  domain: string;
  error?: string;
  pipeline1: Pipeline;
  pipeline2: Pipeline;
  pipeline3: Pipeline;
  storefront?: {
    url: string;
    productCount: number;
  };
}

export default function CommandConsole() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [orchestration, setOrchestration] = useState<OrchestrationState | null>(
    null
  );
  const [validationError, setValidationError] = useState("");

  const validateDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setValidated(false);

    if (!domain.trim()) {
      setValidationError("Please enter a domain");
      return;
    }

    try {
      const res = await fetch("/api/validate-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      const data = await res.json();

      if (!res.ok) {
        setValidationError(data.message || "Invalid domain");
        return;
      }

      setValidated(true);
    } catch (err) {
      setValidationError("Validation failed. Try again.");
    }
  };

  const submitOrchestration = async () => {
    setLoading(true);
    setValidationError("");

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      const data = await res.json();

      if (!res.ok) {
        setValidationError(data.message || "Orchestration failed");
        setLoading(false);
        return;
      }

      setOrchestration({
        domain,
        pipeline1: { name: "Brand Intelligence", status: "in_progress", message: "Extracting brand assets..." },
        pipeline2: { name: "Mockup Generation", status: "pending", message: "Waiting..." },
        pipeline3: { name: "Shopify Provisioning", status: "pending", message: "Waiting..." },
      });

      pollPipelineStatus();
    } catch (err) {
      setValidationError("Failed to start orchestration");
      setLoading(false);
    }
  };

  const pollPipelineStatus = async () => {
    const maxAttempts = 120;
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setOrchestration((prev) =>
          prev ? { ...prev, error: "Orchestration timed out after 10 minutes" } : null
        );
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/pipeline-status?domain=${domain}`);
        const data = await res.json();

        if (data.status === "completed" || data.status === "failed") {
          setOrchestration(data.orchestration);
          setLoading(false);
          return;
        }

        setOrchestration(data.orchestration);
        attempts++;
        setTimeout(poll, 5000);
      } catch (err) {
        attempts++;
        setTimeout(poll, 5000);
      }
    };

    poll();
  };

  const retryOrchestration = async () => {
    if (!orchestration) return;
    setOrchestration(null);
    setValidated(false);
    await submitOrchestration();
  };

  const openStorefront = () => {
    if (orchestration?.storefront?.url) {
      window.open(orchestration.storefront.url, "_blank");
    }
  };

  const PipelineCard = ({ pipeline }: { pipeline: Pipeline }) => {
    const statusColors = {
      pending: "border-color-border",
      in_progress: "border-accent",
      completed: "border-status-shipped",
      failed: "border-danger",
    };

    const statusIcons = {
      pending: <Clock size={20} className="text-text-muted" />,
      in_progress: <Loader size={20} className="animate-spin text-accent" />,
      completed: <CheckCircle size={20} className="text-status-shipped" />,
      failed: <AlertCircle size={20} className="text-danger" />,
    };

    const statusLabels = {
      pending: "Pending",
      in_progress: "Processing...",
      completed: "Complete",
      failed: "Failed",
    };

    return (
      <div
        className={`p-6 bg-surface border-2 ${statusColors[pipeline.status]} rounded-lg flex items-start gap-4`}
      >
        <div className="mt-1">{statusIcons[pipeline.status]}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{pipeline.name}</h3>
          <p className="text-text-muted text-sm">{pipeline.message}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <section className="bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold">Command Console</h1>
          <p className="text-text-muted mt-2">
            Submit your domain and watch your store come to life
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        {!orchestration ? (
          <div className="space-y-8">
            {/* Domain Input Section */}
            <div className="bg-surface rounded-lg border border-border p-8">
              <h2 className="text-2xl font-bold mb-6">Enter Your Domain</h2>

              <form onSubmit={validateDomain} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="your-company.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    disabled={loading || validated}
                    className="w-full px-6 py-4 bg-bg border-2 border-border text-text placeholder-text-muted rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  />
                  {validationError && (
                    <p className="text-danger text-sm mt-2">{validationError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || validated}
                  className="w-full px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? "Validating..." : validated ? "Domain Validated ✓" : "Validate Domain"}
                </button>
              </form>

              {validated && !loading && (
                <button
                  onClick={submitOrchestration}
                  disabled={loading}
                  className="w-full mt-4 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : "Start Orchestration"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Status Panel */}
            <div className="bg-surface rounded-lg border border-border p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Pipeline Progress</h2>
                <p className="text-text-muted text-sm">Domain: {orchestration.domain}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PipelineCard pipeline={orchestration.pipeline1} />
                <PipelineCard pipeline={orchestration.pipeline2} />
                <PipelineCard pipeline={orchestration.pipeline3} />
              </div>

              {orchestration.error && (
                <div className="mt-6 p-4 bg-danger/20 border-2 border-danger rounded-lg flex items-start gap-3">
                  <AlertCircle size={24} className="text-danger flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-danger">{orchestration.error}</p>
                    <button
                      onClick={retryOrchestration}
                      className="text-accent hover:underline text-sm mt-2"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Success Card */}
            {orchestration.storefront && (
              <div className="bg-surface rounded-lg border border-status-shipped p-8">
                <div className="flex items-start gap-4 mb-6">
                  <CheckCircle size={32} className="text-status-shipped flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Store Created Successfully!</h2>
                    <p className="text-text-muted">Your Shopify store is ready</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-bg rounded-lg p-4">
                    <p className="text-text-muted text-sm mb-1">Storefront URL</p>
                    <p className="font-mono text-sm break-all text-accent">
                      {orchestration.storefront.url}
                    </p>
                  </div>
                  <div className="bg-bg rounded-lg p-4">
                    <p className="text-text-muted text-sm mb-1">Products Generated</p>
                    <p className="text-2xl font-bold">
                      {orchestration.storefront.productCount}
                    </p>
                  </div>
                  <div className="bg-bg rounded-lg p-4">
                    <p className="text-text-muted text-sm mb-1">Status</p>
                    <p className="font-semibold text-status-shipped">Active (Draft Mode)</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={openStorefront}
                    className="flex-1 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 transition flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={20} />
                    View Storefront
                  </button>
                  <button className="flex-1 px-6 py-3 bg-surface border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition flex items-center justify-center gap-2">
                    <Download size={20} />
                    Download Assets
                  </button>
                  <button className="flex-1 px-6 py-3 bg-surface border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition flex items-center justify-center gap-2">
                    <Users size={20} />
                    Invite Team
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
