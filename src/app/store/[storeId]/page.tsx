"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader,
  Zap,
  RefreshCw,
  ShoppingBag,
  MessageSquare,
  Activity,
  Clock,
  Database,
} from "lucide-react";

interface StoreData {
  id: string;
  domain: string;
  shopifyUrl: string | null;
  shopifyStoreId: string | null;
  status: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  description: string;
}

interface StoredFunnelEvent {
  firedAt: number;
  persisted?: boolean;
  persistedAt?: number;
}

interface FunnelState {
  domain: string;
  startedAt: number;
  events: Record<string, StoredFunnelEvent>;
}

const DEMO_PRODUCTS: Product[] = [
  { id: "1", name: "Premium Tee", sku: "BF-TEE-001", price: 32.99, description: "100% organic cotton crew neck" },
  { id: "2", name: "Embroidered Cap", sku: "BF-CAP-002", price: 28.99, description: "Structured 6-panel, adjustable strap" },
  { id: "3", name: "Zip Hoodie", sku: "BF-HOD-003", price: 64.99, description: "Midweight fleece, full-zip" },
  { id: "4", name: "Tote Bag", sku: "BF-TOT-004", price: 22.99, description: "12 oz canvas, reinforced handles" },
];

const DEMO_STORE: StoreData = {
  id: "demo",
  domain: "acme.com",
  shopifyUrl: "https://acme-branded.myshopify.com",
  shopifyStoreId: "demo-store-001",
  status: "draft",
  createdAt: "2024-01-01T00:00:00.000Z",
};

// The 8 required funnel events across pipeline stages
const FUNNEL_EVENTS = [
  { type: "domain_submitted", stage: "Stage 1 · Intake" },
  { type: "brand_extraction_started", stage: "Stage 2 · Brand Intelligence" },
  { type: "brand_extraction_complete", stage: "Stage 2 · Brand Intelligence" },
  { type: "mockup_generation_started", stage: "Stage 3 · Visual Engine" },
  { type: "mockup_generation_complete", stage: "Stage 3 · Visual Engine" },
  { type: "storefront_generation_started", stage: "Stage 4 · Infrastructure" },
  { type: "storefront_generation_complete", stage: "Stage 4 · Infrastructure" },
  { type: "storefront_view", stage: "Stage 5 · Engagement" },
];

// Representative latencies for demo mode (ms from pipeline start)
const DEMO_OFFSETS: Record<string, number> = {
  domain_submitted: 0,
  brand_extraction_started: 1180,
  brand_extraction_complete: 6340,
  mockup_generation_started: 6590,
  mockup_generation_complete: 19210,
  storefront_generation_started: 19480,
  storefront_generation_complete: 28850,
  storefront_view: 29140,
};

function buildDemoFunnelData(): FunnelState {
  const startedAt = Date.now() - 45000;
  const events: Record<string, StoredFunnelEvent> = {};
  for (const [type, offset] of Object.entries(DEMO_OFFSETS)) {
    events[type] = {
      firedAt: startedAt + offset,
      persisted: true,
      persistedAt: startedAt + offset + 320,
    };
  }
  return { domain: "acme.com", startedAt, events };
}

function loadFunnelData(): FunnelState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("bf_funnel_test");
    if (!raw) return null;
    return JSON.parse(raw) as FunnelState;
  } catch {
    return null;
  }
}

function FunnelTestPanel({ isDemo }: { isDemo: boolean }) {
  const [funnelData, setFunnelData] = useState<FunnelState | null>(null);

  useEffect(() => {
    setFunnelData(isDemo ? buildDemoFunnelData() : loadFunnelData());
  }, [isDemo]);

  if (!funnelData) return null;

  const { startedAt, events } = funnelData;
  const firedCount = FUNNEL_EVENTS.filter((e) => events[e.type]?.firedAt !== undefined).length;
  const persistedCount = FUNNEL_EVENTS.filter((e) => events[e.type]?.persisted).length;
  const lastEvent = events[FUNNEL_EVENTS[FUNNEL_EVENTS.length - 1].type];
  const totalMs = lastEvent?.firedAt ? lastEvent.firedAt - startedAt : 0;
  const allPassed = firedCount === FUNNEL_EVENTS.length && persistedCount === FUNNEL_EVENTS.length;
  const stages = [...new Set(FUNNEL_EVENTS.map((e) => e.stage))];

  return (
    <div className="bg-surface border-2 border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Activity size={16} className="text-accent" />
          Funnel Test Results
          {isDemo && (
            <span className="ml-1 text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
              demo
            </span>
          )}
        </h2>
        <span
          className={`text-xs font-mono px-3 py-1 rounded-full font-bold ${
            allPassed
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
          }`}
        >
          {allPassed ? "✓ PASS" : `${firedCount}/${FUNNEL_EVENTS.length}`}
        </span>
      </div>

      {/* Performance metrics summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-bg rounded-lg p-3 text-center">
          <p className="text-text-muted text-xs mb-1">Events Tracked</p>
          <p className="text-text font-bold text-xl">
            {firedCount}
            <span className="text-text-muted text-sm font-normal">/{FUNNEL_EVENTS.length}</span>
          </p>
        </div>
        <div className="bg-bg rounded-lg p-3 text-center">
          <p className="text-text-muted text-xs mb-1">Persisted</p>
          <p className="text-emerald-400 font-bold text-xl">
            {persistedCount}
            <span className="text-text-muted text-sm font-normal">/{firedCount}</span>
          </p>
        </div>
        <div className="bg-bg rounded-lg p-3 text-center">
          <p className="text-text-muted text-xs mb-1">Total Time</p>
          <p className="text-text font-bold text-xl">
            {totalMs > 0 ? (totalMs / 1000).toFixed(1) : "—"}
            {totalMs > 0 && <span className="text-text-muted text-sm font-normal">s</span>}
          </p>
        </div>
      </div>

      {/* Events grouped by stage */}
      <div className="space-y-4">
        {stages.map((stage) => {
          const stageEvents = FUNNEL_EVENTS.filter((e) => e.stage === stage);
          return (
            <div key={stage}>
              <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
                {stage}
              </p>
              <div className="space-y-1.5">
                {stageEvents.map((def) => {
                  const ev = events[def.type];
                  const fired = ev?.firedAt !== undefined;
                  const elapsedMs = fired ? ev.firedAt - startedAt : null;
                  const allEvIdx = FUNNEL_EVENTS.findIndex((e) => e.type === def.type);
                  const prevEv =
                    allEvIdx > 0 ? events[FUNNEL_EVENTS[allEvIdx - 1].type] : null;
                  const latencyMs =
                    fired && prevEv?.firedAt ? ev.firedAt - prevEv.firedAt : null;

                  return (
                    <div
                      key={def.type}
                      className="flex items-center gap-2 py-2 px-3 bg-bg rounded-lg"
                    >
                      {fired ? (
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Clock size={14} className="text-text-muted flex-shrink-0" />
                      )}
                      <span className="font-mono text-text text-xs flex-1 truncate">
                        {def.type}
                      </span>
                      {elapsedMs !== null && (
                        <span className="text-text-muted text-xs font-mono">
                          {(elapsedMs / 1000).toFixed(2)}s
                        </span>
                      )}
                      {latencyMs !== null && latencyMs > 0 && (
                        <span className="text-text-muted text-xs font-mono hidden sm:block">
                          +{(latencyMs / 1000).toFixed(2)}s
                        </span>
                      )}
                      {ev?.persisted ? (
                        <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono flex-shrink-0">
                          <Database size={10} />
                          Saved
                        </span>
                      ) : fired ? (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono flex-shrink-0">
                          Pending
                        </span>
                      ) : (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-border/50 text-text-muted font-mono flex-shrink-0">
                          —
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {allPassed && (
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-emerald-400 text-xs">
          <CheckCircle2 size={12} />
          All {FUNNEL_EVENTS.length} events tracked and persisted to Supabase in{" "}
          {(totalMs / 1000).toFixed(1)}s — target &lt;10 minutes
        </div>
      )}
    </div>
  );
}

function getOrCreateCustomerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("bf_customer_id");
  if (!id) {
    id = `cust_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("bf_customer_id", id);
  }
  return id;
}

function logEvent(
  event_type: string,
  domain: string,
  metadata?: Record<string, unknown>
): void {
  const firedAt = Date.now();

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("bf_funnel_test");
      const stored: {
        domain?: string;
        startedAt?: number;
        events?: Record<string, StoredFunnelEvent>;
      } = raw ? JSON.parse(raw) : {};
      if (!stored.events) stored.events = {};
      if (!stored.domain) stored.domain = domain;
      if (!stored.startedAt) stored.startedAt = firedAt;
      stored.events[event_type] = { firedAt };
      localStorage.setItem("bf_funnel_test", JSON.stringify(stored));
    } catch {}
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_type,
      customer_id: getOrCreateCustomerId(),
      domain,
      timestamp: new Date(firedAt).toISOString(),
      ...(metadata ? { metadata } : {}),
    }),
  })
    .then((res) => res.json())
    .then((data: { success?: boolean }) => {
      if (data?.success && typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("bf_funnel_test");
          if (raw) {
            const stored = JSON.parse(raw) as {
              events?: Record<string, StoredFunnelEvent>;
            };
            if (stored.events?.[event_type]) {
              stored.events[event_type].persisted = true;
              stored.events[event_type].persistedAt = Date.now();
              localStorage.setItem("bf_funnel_test", JSON.stringify(stored));
            }
          }
        } catch {}
      }
    })
    .catch(() => {});
}

export default function StorefrontPreview() {
  const params = useParams();
  const storeId =
    typeof params?.storeId === "string"
      ? params.storeId
      : Array.isArray(params?.storeId)
      ? params.storeId[0]
      : "";

  const isDemo = storeId === "demo";

  const [store, setStore] = useState<StoreData | null>(isDemo ? DEMO_STORE : null);
  const [loading, setLoading] = useState(!isDemo);
  const [error, setError] = useState("");
  const [publishStatus, setPublishStatus] = useState<
    "idle" | "publishing" | "published" | "failed"
  >("idle");
  const [quoteRequested, setQuoteRequested] = useState(false);

  const viewFired = useRef(false);

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

  useEffect(() => {
    if (!store || viewFired.current) return;
    viewFired.current = true;
    logEvent("storefront_view", store.domain, { store_id: store.id, status: store.status });
  }, [store]);

  const handleProductClick = (product: Product) => {
    if (!store) return;
    logEvent("product_clicked", store.domain, {
      sku: product.sku,
      product_name: product.name,
      price: product.price,
    });
  };

  const handleRequestQuote = () => {
    if (!store) return;
    logEvent("request_quote", store.domain, {
      store_id: store.id,
      shopify_url: store.shopifyUrl ?? null,
    });
    setQuoteRequested(true);
  };

  const handlePublish = async () => {
    if (!store) return;
    logEvent("user_clicks_publish", store.domain, {
      shopify_url: store.shopifyUrl ?? null,
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
            href="/command-console"
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
        {/* Header */}
        <div className="mb-8">
          <p className="text-text-muted text-sm mb-1">
            Storefront Preview
            {isDemo && (
              <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                demo
              </span>
            )}
          </p>
          <h1 className="text-4xl font-bold">{store.domain}</h1>
        </div>

        {/* Funnel Test Results — shows event tracking, latency, and persistence */}
        <FunnelTestPanel isDemo={isDemo} />

        {/* Request Quote CTA — prominent, above fold */}
        <div className="bg-surface border-2 border-accent/40 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold mb-1">Ready to order for your team?</h3>
              <p className="text-text-muted text-sm">
                Get a custom quote tailored to your headcount and product mix.
              </p>
            </div>
            <button
              onClick={handleRequestQuote}
              disabled={quoteRequested}
              className={`flex-shrink-0 px-6 py-2.5 font-semibold rounded-lg transition flex items-center gap-2 text-sm disabled:cursor-not-allowed ${
                quoteRequested
                  ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50"
                  : "bg-accent text-white hover:bg-purple-600"
              }`}
            >
              {quoteRequested ? (
                <>
                  <CheckCircle2 size={16} />
                  Quote Requested
                </>
              ) : (
                <>
                  <MessageSquare size={16} />
                  Request Quote
                </>
              )}
            </button>
          </div>
        </div>

        {/* Store status card */}
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

        {/* Featured products */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={18} className="text-accent" />
            <h2 className="text-lg font-bold">Featured Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_PRODUCTS.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-surface border-2 border-border rounded-lg p-5 text-left hover:border-accent/50 transition group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-text font-semibold text-sm group-hover:text-accent transition">
                    {product.name}
                  </p>
                  <span className="text-accent font-mono text-sm font-bold whitespace-nowrap">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-text-muted text-xs mb-3">{product.description}</p>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg text-text-muted border border-border">
                  {product.sku}
                </span>
              </button>
            ))}
          </div>
        </div>

        <a
          href="/command-console"
          className="text-text-muted hover:text-text text-sm transition"
        >
          ← Back to Command Console
        </a>
      </div>
    </div>
  );
}
