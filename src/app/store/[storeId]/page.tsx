"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader,
  Zap,
  RefreshCw,
} from "lucide-react";

interface StoreData {
  id: string;
  domain: string;
  shopifyUrl: string | null;
  shopifyStoreId: string | null;
  status: string;
  createdAt: string;
}

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

const DEMO_STORE: StoreData = {
  id: "demo",
  domain: "acme.com",
  shopifyUrl: "https://acme-branded.myshopify.com",
  shopifyStoreId: "demo-store-001",
  status: "draft",
  createdAt: new Date().toISOString(),
};

export default function StorefrontPreview() {
  const params = useParams();
  const storeId = typeof params?.storeId === "string" ? params.storeId : Array.isArray(params?.storeId) ? params.storeId[0] : "";

  const isDemo = storeId === "demo";

  const [store, setStore] = useState<StoreData | null>(isDemo ? DEMO_STORE : null);
  const [loading, setLoading] = useState(!isDemo);
  const [error, setError] = useState("");
  const [publishStatus, setPublishStatus] = useState<
    "idle" | "publishing" | "published" | "failed"
  >("idle");

  useEffect(() => {
    if (!storeId || isDemo) return;

    fetch(`/api/store/${encodeURIComponent(storeId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.store) {
          setStore(data.store);
        } else {
          setError("Store not found");
        }
      })
      .catch(() => setError("Failed to load store"))
      .finally(() => setLoading(false));
  }, [storeId, isDemo]);

  const handlePublish = async () => {
    if (!store) return;

    logEvent("user_clicks_publish", {
      domain: store.domain,
      storefront_url: store.shopifyUrl ?? null,
    });

    setPublishStatus("publishing");
    try {
      const res = await fetch("/api/publish-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: store.domain }),
      });
      setPublishStatus(res.ok ? "published" : "failed");
    } catch {
      setPublishStatus("failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <Loader size={24} className="animate-spin" />
          <span>Loading storefront…</span>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-danger mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
          <p className="text-text-muted">{error || "This storefront does not exist."}</p>
          <a
            href="/"
            className="inline-block mt-6 px-5 py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 transition text-sm"
          >
            Back to Command Console
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-text-muted text-sm mb-1">
            Storefront Preview{isDemo && <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">demo</span>}
          </p>
          <h1 className="text-4xl font-bold">{store.domain}</h1>
        </div>

        <div className="bg-surface border-2 border-border rounded-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 size={24} className="text-emerald-500" />
            <h2 className="text-xl font-bold">Store Ready</h2>
            <span
              className={`ml-auto text-xs font-mono px-2 py-1 rounded ${
                store.status === "published"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-accent/20 text-accent"
              }`}
            >
              {store.status}
            </span>
          </div>

          {store.shopifyUrl && (
            <div className="mb-6 p-4 bg-bg rounded-lg flex items-center gap-3">
              <ExternalLink size={16} className="text-accent flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-text-muted text-xs mb-1">Live Storefront URL</p>
                <a
                  href={store.shopifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline text-sm font-mono break-all"
                >
                  {store.shopifyUrl}
                </a>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-bg rounded-lg p-4">
              <p className="text-text-muted text-xs mb-1">Domain</p>
              <p className="text-text font-mono text-sm">{store.domain}</p>
            </div>
            <div className="bg-bg rounded-lg p-4">
              <p className="text-text-muted text-xs mb-1">Created</p>
              <p className="text-text text-sm">
                {new Date(store.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {store.shopifyUrl && (
              <a
                href={store.shopifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 transition flex items-center gap-2 text-sm"
              >
                <ExternalLink size={16} />
                View Store
              </a>
            )}
            <button
              onClick={handlePublish}
              disabled={
                publishStatus === "publishing" ||
                publishStatus === "published" ||
                store.status === "published"
              }
              className={`px-5 py-2.5 border-2 font-semibold rounded-lg transition flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                publishStatus === "published" || store.status === "published"
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                  : publishStatus === "failed"
                  ? "bg-danger/10 border-danger/50 text-danger"
                  : "bg-surface border-border text-text hover:border-accent/50"
              }`}
            >
              {publishStatus === "published" || store.status === "published" ? (
                <>
                  <CheckCircle2 size={16} />
                  Published
                </>
              ) : publishStatus === "publishing" ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Publishing…
                </>
              ) : publishStatus === "failed" ? (
                <>
                  <AlertCircle size={16} />
                  Retry Publish
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Publish Store
                </>
              )}
            </button>
          </div>
        </div>

        <a
          href="/"
          className="text-text-muted hover:text-text text-sm transition"
        >
          ← Back to Command Console
        </a>
      </div>
    </div>
  );
}
