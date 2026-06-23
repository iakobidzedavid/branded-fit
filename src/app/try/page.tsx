"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// ── Brand color palette (deterministic by domain hash — simulates Brandfetch) ──
const BRAND_PALETTES = [
  { primary: "#4f46e5", secondary: "#818cf8", bg: "#eef2ff" }, // indigo
  { primary: "#0891b2", secondary: "#67e8f9", bg: "#ecfeff" }, // cyan
  { primary: "#059669", secondary: "#6ee7b7", bg: "#ecfdf5" }, // emerald
  { primary: "#7c3aed", secondary: "#c4b5fd", bg: "#f5f3ff" }, // violet
  { primary: "#b45309", secondary: "#fcd34d", bg: "#fffbeb" }, // amber
  { primary: "#be185d", secondary: "#f9a8d4", bg: "#fdf2f8" }, // pink
  { primary: "#1d4ed8", secondary: "#93c5fd", bg: "#eff6ff" }, // blue
  { primary: "#047857", secondary: "#6ee7b7", bg: "#f0fdf4" }, // green
];

function hashDomain(domain: string): number {
  let h = 0;
  for (let i = 0; i < domain.length; i++) {
    h = (h * 31 + domain.charCodeAt(i)) >>> 0;
  }
  return h;
}

function getCompanyName(raw: string): string {
  const domain = raw.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].split(".")[0];
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

function getBrandPalette(domain: string) {
  const h = hashDomain(domain);
  return BRAND_PALETTES[h % BRAND_PALETTES.length];
}

// ── Curated product catalog (120-SKU subset — 8 shown per storefront) ──
const PRODUCTS = [
  { name: "Premium Hoodie", category: "Apparel", printMethod: "DTG", reorderRate: 87, price: 42, sampled: true },
  { name: "Unisex Tee", category: "Apparel", printMethod: "Screen Print", reorderRate: 91, price: 28, sampled: true },
  { name: "Quarter-Zip Fleece", category: "Apparel", printMethod: "Embroidery", reorderRate: 79, price: 58, sampled: true },
  { name: "Canvas Tote Bag", category: "Accessories", printMethod: "DTG", reorderRate: 83, price: 18, sampled: true },
  { name: "Insulated Tumbler", category: "Drinkware", printMethod: "Laser Engrave", reorderRate: 94, price: 36, sampled: true },
  { name: "Snapback Cap", category: "Headwear", printMethod: "Embroidery", reorderRate: 82, price: 32, sampled: true },
  { name: "Softcover Notebook", category: "Stationery", printMethod: "Full Cover Print", reorderRate: 76, price: 16, sampled: false },
  { name: "Crew Socks", category: "Accessories", printMethod: "Knit", reorderRate: 88, price: 14, sampled: true },
];

// ── Generation steps ──
const GENERATION_STEPS = [
  { label: "Extracting brand identity", duration: 1600 },
  { label: "AI curating product catalog", duration: 2400 },
  { label: "Building your storefront preview", duration: 1200 },
];

type Stage = "idle" | "generating" | "preview" | "captured";

function ProductCard({
  product,
  brandColor,
  brandBg,
}: {
  product: (typeof PRODUCTS)[number];
  brandColor: string;
  brandBg: string;
}) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* product image placeholder with brand color */}
      <div
        style={{
          height: 110,
          background: brandBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.8rem",
        }}
      >
        {product.category === "Apparel"
          ? "👕"
          : product.category === "Drinkware"
          ? "☕"
          : product.category === "Headwear"
          ? "🧢"
          : product.category === "Stationery"
          ? "📓"
          : "🎒"}
      </div>
      <div style={{ padding: "0.75rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#111827", marginBottom: "0.25rem" }}>
          {product.name}
        </div>
        <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: "0.5rem" }}>
          ${product.price} / unit
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
          {product.sampled && (
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 600,
                color: "#166534",
                background: "#dcfce7",
                borderRadius: 4,
                padding: "0.15rem 0.4rem",
              }}
            >
              ✓ Sample reviewed
            </span>
          )}
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              color: "#374151",
              background: "#f3f4f6",
              borderRadius: 4,
              padding: "0.15rem 0.4rem",
            }}
          >
            {product.printMethod}
          </span>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              color: brandColor,
              background: brandBg,
              borderRadius: 4,
              padding: "0.15rem 0.4rem",
            }}
          >
            {product.reorderRate}% reorder
          </span>
        </div>
      </div>
    </div>
  );
}

function TryInner() {
  const searchParams = useSearchParams();
  const initialDomain = searchParams.get("domain") ?? "";
  return <TryPage initialDomain={initialDomain} />;
}

export default function TryPageWrapper() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>}>
      <TryInner />
    </Suspense>
  );
}

function TryPage({ initialDomain = "" }: { initialDomain?: string }) {
  const [domain, setDomain] = useState(initialDomain);
  const [stage, setStage] = useState<Stage>(initialDomain ? "generating" : "idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0); // 0-100
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [capturedName, setCapturedName] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  const companyName = cleanDomain ? getCompanyName(cleanDomain) : "";
  const palette = cleanDomain ? getBrandPalette(cleanDomain) : BRAND_PALETTES[0];

  // Analytics: session id + domain ref (always current, used in fire-and-forget events)
  const sessionIdRef = useRef<string>('');
  if (!sessionIdRef.current && typeof window !== 'undefined') {
    sessionIdRef.current = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  const cleanDomainRef = useRef(cleanDomain);
  cleanDomainRef.current = cleanDomain; // sync on every render — no stale closures

  const fireEvent = useCallback((name: string, props: Record<string, unknown> = {}) => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: name,
        domain: cleanDomainRef.current || undefined,
        session_id: sessionIdRef.current || undefined,
        properties: props,
      }),
    }).catch(() => {});
  }, []);

  // run generation animation
  useEffect(() => {
    if (stage !== "generating") return;

    let cancelled = false;

    async function runSteps() {
      for (let i = 0; i < GENERATION_STEPS.length; i++) {
        if (cancelled) return;
        setStepIndex(i);
        if (i === 0) fireEvent('brand_extraction_started');
        const { duration } = GENERATION_STEPS[i];
        const start = Date.now();
        while (Date.now() - start < duration) {
          if (cancelled) return;
          setStepProgress(Math.min(((Date.now() - start) / duration) * 100, 97));
          await new Promise((r) => setTimeout(r, 30));
        }
        setStepProgress(100);
        await new Promise((r) => setTimeout(r, 180));
        if (i === 0) fireEvent('brand_extraction_completed');
      }
      if (!cancelled) {
        setStage("preview");
        fireEvent('storefront_generation_completed');
      }
    }

    runSteps();
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Fire storefront_viewed when preview first renders
  useEffect(() => {
    if (stage === 'preview') fireEvent('storefront_viewed');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!cleanDomain) return;
    setStage("generating");
    setStepIndex(0);
    setStepProgress(0);
    fireEvent('domain_submitted');
  }

  async function handleEmailCapture(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid work email");
      return;
    }
    setEmailError("");
    setSubmitting(true);

    // Create a shareable storefront preview in Supabase
    try {
      const previewRes = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: cleanDomain,
          company_name: companyName,
          palette_index: hashDomain(cleanDomain) % BRAND_PALETTES.length,
          email: email.trim().toLowerCase(),
        }),
      });
      if (previewRes.ok) {
        const previewData = await previewRes.json() as { preview?: { id: string } };
        if (previewData.preview?.id) {
          setShareUrl(`${window.location.origin}/preview/${previewData.preview.id}`);
        }
      }
    } catch {
      // non-fatal — proceed without shareable link
    }

    // Notify founder via demo request
    try {
      await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: companyName + " — Try Preview",
          email,
          company: companyName,
          source: "try-page",
        }),
      });
    } catch {
      // non-fatal
    }

    setCapturedName(email.split("@")[0]);
    setStage("captured");
    fireEvent('storefront_published');
    setSubmitting(false);
  }

  // ── IDLE ──
  if (stage === "idle") {
    return (
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "5rem 1.5rem 6rem" }}>
        {/* badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.3rem 0.875rem",
            background: "var(--primary-light)",
            color: "var(--primary)",
            borderRadius: 20,
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          <span>✦</span> Interactive Preview
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
          }}
        >
          See your branded storefront
          <br />
          in 8 minutes.
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--text-muted)",
            lineHeight: 1.65,
            marginBottom: "2.5rem",
            maxWidth: 540,
          }}
        >
          Type your company domain below. Our AI extracts your brand identity and curates
          a 120-SKU store matched to your colors, fonts, and identity — zero manual work.
        </p>

        <form onSubmit={handleGenerate} style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="yourcompany.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              autoFocus
              style={{
                flex: "1 1 260px",
                padding: "0.875rem 1rem",
                fontSize: "1rem",
                border: "2px solid var(--border)",
                borderRadius: "var(--radius-md)",
                outline: "none",
                color: "var(--text-primary)",
                background: "white",
              }}
            />
            <button
              type="submit"
              disabled={!cleanDomain}
              style={{
                padding: "0.875rem 1.75rem",
                background: cleanDomain ? "var(--primary)" : "#c7d2fe",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontWeight: 700,
                fontSize: "0.975rem",
                cursor: cleanDomain ? "pointer" : "not-allowed",
                whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
            >
              Generate Preview →
            </button>
          </div>
        </form>

        {/* example domains */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginRight: "0.25rem" }}>Try:</span>
          {["notion.so", "linear.app", "retool.com", "mercury.com"].map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              style={{
                padding: "0.3rem 0.75rem",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "var(--primary)",
                background: "var(--primary-light)",
                border: "none",
                borderRadius: 20,
                cursor: "pointer",
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* how it works */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            { n: "1", title: "Paste domain", desc: "One field. No signup, no design tools." },
            { n: "2", title: "AI curates store", desc: "Brand colors + AI-matched 8–12 products." },
            { n: "3", title: "Share preview", desc: "Shareable link in seconds — no Shopify needed." },
          ].map((step) => (
            <div
              key={step.n}
              style={{
                padding: "1.25rem",
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.625rem",
                }}
              >
                {step.n}
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                {step.title}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // ── GENERATING ──
  if (stage === "generating") {
    return (
      <main
        style={{
          maxWidth: 520,
          margin: "0 auto",
          padding: "6rem 1.5rem",
          textAlign: "center",
        }}
      >
        {/* animated brand color ring */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: `4px solid ${palette.bg}`,
            borderTopColor: palette.primary,
            animation: "spin 0.9s linear infinite",
            margin: "0 auto 2rem",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          Building <span style={{ color: palette.primary }}>{companyName}</span>&apos;s storefront…
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2.5rem" }}>
          This usually takes 8–12 seconds
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", textAlign: "left" }}>
          {GENERATION_STEPS.map((step, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div
                key={step.label}
                style={{
                  padding: "1rem 1.25rem",
                  background: done ? palette.bg : active ? "white" : "var(--surface)",
                  border: `1px solid ${done ? palette.primary + "40" : active ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: "var(--radius-lg)",
                  transition: "all 0.3s",
                  opacity: i > stepIndex ? 0.45 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: active ? "0.625rem" : 0 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      background: done ? palette.primary : active ? "var(--primary)" : "var(--border)",
                      color: done || active ? "white" : "var(--text-muted)",
                      flexShrink: 0,
                    }}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: active || done ? 600 : 400,
                      color: done ? palette.primary : active ? "var(--text-primary)" : "var(--text-muted)",
                    }}
                  >
                    {step.label}
                    {active ? "…" : done ? " — done" : ""}
                  </span>
                </div>
                {active && (
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: "var(--border)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${stepProgress}%`,
                        background: "var(--primary)",
                        borderRadius: 2,
                        transition: "width 0.08s linear",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ marginTop: "2rem", fontSize: "0.78rem", color: "var(--text-subtle)" }}>
          Powered by Brandfetch + OpenAI + Branded Fit curation model
        </p>
      </main>
    );
  }

  // ── PREVIEW ──
  if (stage === "preview") {
    return (
      <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
        {/* preview header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            background: palette.bg,
            border: `1px solid ${palette.primary}30`,
            borderRadius: "var(--radius-lg)",
            marginBottom: "1.5rem",
            marginTop: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: palette.primary,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.25rem",
              }}
            >
              ✦ Preview ready
            </div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              {companyName}&apos;s Branded Storefront
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              AI-curated 8-product store · Brand colors applied · Quality-verified catalog
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.625rem" }}>
            <button
              onClick={() => setStage("idle")}
              style={{
                padding: "0.625rem 1rem",
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              ← Try another domain
            </button>
          </div>
        </div>

        {/* mini storefront header */}
        <div
          style={{
            padding: "1.5rem",
            background: palette.primary,
            borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              {companyName} Store
            </div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginTop: "0.25rem" }}>
              On-brand merch for your team · {PRODUCTS.length} items available
            </div>
          </div>
          <div
            style={{
              padding: "0.5rem 1rem",
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "var(--radius-md)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            🔒 Preview mode
          </div>
        </div>

        {/* product grid */}
        <div
          style={{
            padding: "1.5rem",
            background: palette.bg,
            borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
            border: `1px solid ${palette.primary}20`,
            borderTop: "none",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
                brandColor={palette.primary}
                brandBg={palette.bg}
              />
            ))}
          </div>

          {/* quality note */}
          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.875rem 1rem",
              background: "white",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              display: "flex",
              gap: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <span>✓ <strong>7 of 8 items</strong> sample-reviewed by Branded Fit</span>
            <span>✓ <strong>Defect SLA:</strong> replacement within 5 business days</span>
            <span>✓ <strong>Consolidated shipment</strong> — one package, one tracking link</span>
          </div>
        </div>

        {/* email capture CTA */}
        <div
          style={{
            padding: "2.5rem",
            background: "white",
            border: "2px solid var(--primary)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.3rem 0.875rem",
              background: "var(--primary-light)",
              color: "var(--primary)",
              borderRadius: 20,
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            ✦ Get your live storefront
          </div>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            Ready to launch {companyName}&apos;s store?
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "1.75rem", maxWidth: 440, margin: "0 auto 1.75rem" }}>
            Enter your work email and we&apos;ll send you a personalized storefront link — plus how to get it live on Shopify in under 10 minutes.
          </p>

          <form onSubmit={handleEmailCapture} style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="you@yourcompany.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              style={{
                flex: "1 1 240px",
                maxWidth: 320,
                padding: "0.75rem 1rem",
                fontSize: "0.95rem",
                border: `1px solid ${emailError ? "var(--danger)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                outline: "none",
                color: "var(--text-primary)",
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "0.75rem 1.5rem",
                background: submitting ? "#818cf8" : "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: submitting ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {submitting ? "Sending…" : "Get My Storefront →"}
            </button>
          </form>
          {emailError && (
            <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--danger)" }}>{emailError}</p>
          )}
          <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--text-subtle)" }}>
            No credit card required · We&apos;ll reach out within 24 hours
          </p>
        </div>
      </main>
    );
  }

  // ── CAPTURED ──
  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--accent-bg)",
          border: "2px solid var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.75rem",
          margin: "0 auto 1.5rem",
        }}
      >
        🎉
      </div>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
        You&apos;re on the list, {capturedName}!
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.975rem", lineHeight: 1.65, marginBottom: "2rem" }}>
        We&apos;ll show you how to get{" "}
        <strong style={{ color: palette.primary }}>{companyName}&apos;s</strong> storefront live on
        Shopify in under 10 minutes.
      </p>

      {/* Shareable link card */}
      {shareUrl && (
        <div
          style={{
            padding: "1.5rem",
            background: palette.bg,
            border: `1.5px solid ${palette.primary}40`,
            borderRadius: "var(--radius-lg)",
            marginBottom: "1.5rem",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: palette.primary,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            ✦ Your shareable preview link
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.875rem", lineHeight: 1.5 }}>
            Share this with your People Leader or VP People — they can see the full storefront and book a call directly.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              readOnly
              value={shareUrl}
              style={{
                flex: 1,
                padding: "0.6rem 0.875rem",
                fontSize: "0.8rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                background: "white",
                color: "var(--text-body)",
                fontFamily: "monospace",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              style={{
                padding: "0.6rem 1rem",
                background: copied ? "var(--accent)" : palette.primary,
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "0.8rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              {copied ? "✓ Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          padding: "1.25rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          marginBottom: "2rem",
          textAlign: "left",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
          What happens next
        </div>
        {[
          "We record a 90-second personalized Loom for your domain",
          shareUrl ? "Share the preview link above with your People Leader" : "You receive a shareable preview link within 24 hours",
          "A 20-minute storefront walkthrough — no pressure, just your brand",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0, fontSize: "0.875rem" }}>✓</span>
            <span style={{ fontSize: "0.875rem", color: "var(--text-body)", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link
          href="/demo"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            background: "var(--primary)",
            color: "white",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          Book a 15-min call →
        </Link>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            background: "var(--surface)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontWeight: 500,
            fontSize: "0.9rem",
          }}
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
