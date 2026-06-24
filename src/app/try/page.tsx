"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// ── Brand color palette ──
const BRAND_PALETTES = [
  { primary: "#4f46e5", secondary: "#818cf8", bg: "#eef2ff" },
  { primary: "#0891b2", secondary: "#67e8f9", bg: "#ecfeff" },
  { primary: "#059669", secondary: "#6ee7b7", bg: "#ecfdf5" },
  { primary: "#7c3aed", secondary: "#c4b5fd", bg: "#f5f3ff" },
  { primary: "#b45309", secondary: "#fcd34d", bg: "#fffbeb" },
  { primary: "#be185d", secondary: "#f9a8d4", bg: "#fdf2f8" },
  { primary: "#1d4ed8", secondary: "#93c5fd", bg: "#eff6ff" },
  { primary: "#047857", secondary: "#6ee7b7", bg: "#f0fdf4" },
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function getBrandPalette(s: string) {
  return BRAND_PALETTES[hashStr(s) % BRAND_PALETTES.length];
}

function getPaletteIndex(s: string): number {
  return hashStr(s) % BRAND_PALETTES.length;
}

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

const GENERATION_STEPS = [
  { label: "Extracting brand identity", duration: 1500 },
  { label: "AI curating product catalog", duration: 2200 },
  { label: "Building your storefront preview", duration: 1000 },
];

type Stage = "idle" | "generating" | "captured";

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
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ height: 90, background: brandBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>
        {product.category === "Apparel" ? "👕" : product.category === "Drinkware" ? "☕" : product.category === "Headwear" ? "🧢" : product.category === "Stationery" ? "📓" : "🎒"}
      </div>
      <div style={{ padding: "0.625rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#111827", marginBottom: "0.2rem" }}>{product.name}</div>
        <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.4rem" }}>${product.price} / unit</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.2rem" }}>
          {product.sampled && (
            <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#166534", background: "#dcfce7", borderRadius: 4, padding: "0.1rem 0.35rem" }}>✓ Sampled</span>
          )}
          <span style={{ fontSize: "0.65rem", fontWeight: 600, color: brandColor, background: brandBg, borderRadius: 4, padding: "0.1rem 0.35rem" }}>{product.reorderRate}% reorder</span>
        </div>
      </div>
    </div>
  );
}

function TryPage() {
  const searchParams = useSearchParams();
  const domainParam = searchParams.get("domain") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [domain, setDomain] = useState(domainParam);

  // Sync domain from URL param after client-side hydration (useState only
  // captures the initial value; searchParams may not be ready on first render)
  useEffect(() => {
    const p = searchParams.get("domain");
    if (p) setDomain(p);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  // Client-side fallback ID — used when /api/preview fails so the Copy Link button is always shown
  const clientPreviewIdRef = useRef<string | null>(null);
  const [emailSent, setEmailSent] = useState<string | null>(null); // gmail message_id if sent
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive domain from email if not provided by query param
  function getEffectiveDomain(): string {
    if (domain.trim()) return domain.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    const match = email.trim().match(/@(.+)$/);
    return match ? match[1] : company.trim().toLowerCase().replace(/\s+/g, "") + ".com";
  }

  const effectiveDomain = getEffectiveDomain();
  const palette = effectiveDomain ? getBrandPalette(effectiveDomain) : (company.trim() ? getBrandPalette(company.trim().toLowerCase()) : BRAND_PALETTES[0]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let hasError = false;
    setSubmitError("");
    if (!name.trim()) { setNameError("Your name is required"); hasError = true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Enter a valid work email"); hasError = true; }
    if (!company.trim()) { setCompanyError("Company name is required"); hasError = true; }
    if (hasError) return;

    setSubmitting(true);
    // Generate a client-side fallback ID up-front so Copy Link is always available
    if (!clientPreviewIdRef.current) {
      clientPreviewIdRef.current = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    }
    try {
      // 1. Save demo request — non-blocking: failure logs silently but does not stop the flow
      const demoRes = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          company: company.trim(),
          source: "try-page",
        }),
      });
      if (!demoRes.ok) {
        console.warn("demo-request API error (non-blocking):", await demoRes.text().catch(() => demoRes.status));
      } else {
        try {
          const demoData = await demoRes.json() as { email?: { sent?: boolean; message_id?: string } };
          if (demoData?.email?.sent && demoData.email.message_id) {
            setEmailSent(demoData.email.message_id);
          }
        } catch { /* non-blocking */ }
      }

      // 2. Create a real persisted storefront preview in Supabase
      const effectiveDomainNow = getEffectiveDomain();
      const paletteIdx = getPaletteIndex(effectiveDomainNow);
      const previewRes = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: effectiveDomainNow,
          company_name: company.trim(),
          palette_index: paletteIdx,
          email: email.trim().toLowerCase(),
        }),
      });
      if (previewRes.ok) {
        const previewData = await previewRes.json() as { preview?: { id: string } };
        if (previewData?.preview?.id) {
          setPreviewId(previewData.preview.id);
        }
      }
    } catch (err) {
      // Network error — log it but still advance so the user sees the success card
      console.warn("try-page submit error (non-blocking):", err);
    }
    setSubmitting(false);
    setStage("generating");
  }

  useEffect(() => {
    if (stage !== "generating") return;
    let cancelled = false;

    async function runSteps() {
      for (let i = 0; i < GENERATION_STEPS.length; i++) {
        if (cancelled) return;
        setStepIndex(i);
        const { duration } = GENERATION_STEPS[i];
        const start = Date.now();
        while (Date.now() - start < duration) {
          if (cancelled) return;
          setStepProgress(Math.min(((Date.now() - start) / duration) * 100, 97));
          await new Promise((r) => setTimeout(r, 30));
        }
        setStepProgress(100);
        await new Promise((r) => setTimeout(r, 160));
      }
      if (!cancelled) setStage("captured");
    }

    runSteps();
    return () => { cancelled = true; };
  }, [stage]);

  function markCopied() {
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyLink() {
    if (!resolvedPreviewId) return;
    const url = `${window.location.origin}${previewUrl}`;

    // Modern Clipboard API — may be denied by the browser in certain contexts
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(markCopied).catch(() => {
        fallbackCopy(url);
      });
    } else {
      fallbackCopy(url);
    }
  }

  function fallbackCopy(text: string) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      markCopied();
    } catch {
      // clipboard unavailable — nothing to do
    }
    document.body.removeChild(textarea);
  }

  // ── IDLE ──
  if (stage === "idle") {
    return (
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "5rem 1.5rem 6rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.875rem", background: "var(--primary-light)", color: "var(--primary)", borderRadius: 20, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
          <span>✦</span> Interactive Preview
        </div>

        <h1 style={{ fontSize: "clamp(1.875rem, 5vw, 2.875rem)", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
          See your branded storefront<br />in 8 minutes.
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "2.5rem", maxWidth: 520 }}>
          Our AI extracts your brand identity and curates a 120-SKU store matched to your colors and identity — zero manual work.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.35rem" }}>Your name</label>
            <input
              type="text"
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); }}
              autoFocus
              style={{ width: "100%", padding: "0.875rem 1rem", fontSize: "1rem", border: `2px solid ${nameError ? "var(--danger)" : "var(--border)"}`, borderRadius: "var(--radius-md)", outline: "none", color: "var(--text-primary)", background: "white", boxSizing: "border-box" }}
            />
            {nameError && <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "var(--danger)" }}>{nameError}</p>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.35rem" }}>Work email</label>
            <input
              type="email"
              placeholder="you@yourcompany.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              style={{ width: "100%", padding: "0.875rem 1rem", fontSize: "1rem", border: `2px solid ${emailError ? "var(--danger)" : "var(--border)"}`, borderRadius: "var(--radius-md)", outline: "none", color: "var(--text-primary)", background: "white", boxSizing: "border-box" }}
            />
            {emailError && <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "var(--danger)" }}>{emailError}</p>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.35rem" }}>Company name</label>
            <input
              type="text"
              placeholder="Acme Inc."
              value={company}
              onChange={(e) => { setCompany(e.target.value); setCompanyError(""); }}
              style={{ width: "100%", padding: "0.875rem 1rem", fontSize: "1rem", border: `2px solid ${companyError ? "var(--danger)" : "var(--border)"}`, borderRadius: "var(--radius-md)", outline: "none", color: "var(--text-primary)", background: "white", boxSizing: "border-box" }}
            />
            {companyError && <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "var(--danger)" }}>{companyError}</p>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.35rem" }}>
              Company domain <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional — improves brand matching)</span>
            </label>
            <input
              type="text"
              placeholder="yourcompany.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              style={{ width: "100%", padding: "0.875rem 1rem", fontSize: "1rem", border: "2px solid var(--border)", borderRadius: "var(--radius-md)", outline: "none", color: "var(--text-primary)", background: "white", boxSizing: "border-box" }}
            />
            <p style={{ margin: "0.3rem 0 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>Used to generate your shareable preview URL</p>
          </div>

          {submitError && (
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--danger)", lineHeight: 1.4, padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "var(--radius-md)" }}>{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{ padding: "0.875rem 1.75rem", background: submitting ? "#818cf8" : "var(--primary)", color: "white", border: "none", borderRadius: "var(--radius-md)", fontWeight: 700, fontSize: "0.975rem", cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.15s" }}
          >
            {submitting ? "Submitting…" : "Generate My Storefront →"}
          </button>
        </form>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
          {[
            { n: "1", title: "Enter your details", desc: "Name, email, company. No credit card, no signup." },
            { n: "2", title: "AI curates your store", desc: "Brand colors + AI-matched 8–12 products." },
            { n: "3", title: "Get a shareable link", desc: "A real URL you can share with your boss or team." },
          ].map((step) => (
            <div key={step.n} style={{ padding: "1.25rem", background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 800, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.625rem" }}>{step.n}</div>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>{step.title}</div>
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
      <main style={{ maxWidth: 520, margin: "0 auto", padding: "6rem 1.5rem", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", border: `4px solid ${palette.bg}`, borderTopColor: palette.primary, animation: "spin 0.9s linear infinite", margin: "0 auto 2rem" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          Building <span style={{ color: palette.primary }}>{company}</span>&apos;s storefront…
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2.5rem" }}>This usually takes 8–12 seconds</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", textAlign: "left" }}>
          {GENERATION_STEPS.map((step, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div key={step.label} style={{ padding: "1rem 1.25rem", background: done ? palette.bg : active ? "white" : "var(--surface)", border: `1px solid ${done ? palette.primary + "40" : active ? "var(--primary)" : "var(--border)"}`, borderRadius: "var(--radius-lg)", transition: "all 0.3s", opacity: i > stepIndex ? 0.45 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: active ? "0.625rem" : 0 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, background: done ? palette.primary : active ? "var(--primary)" : "var(--border)", color: done || active ? "white" : "var(--text-muted)", flexShrink: 0 }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: "0.9rem", fontWeight: active || done ? 600 : 400, color: done ? palette.primary : active ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {step.label}{active ? "…" : done ? " — done" : ""}
                  </span>
                </div>
                {active && (
                  <div style={{ height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${stepProgress}%`, background: "var(--primary)", borderRadius: 2, transition: "width 0.08s linear" }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    );
  }

  // ── CAPTURED ──
  const firstName = name.trim().split(" ")[0];
  // Use the real persisted preview ID if available, otherwise fall back to client-side ID
  // so the Copy Link button is always visible in the success state.
  const resolvedPreviewId = previewId ?? clientPreviewIdRef.current;
  // Include company/domain as query params so the preview page can render without a DB record
  const previewUrl = resolvedPreviewId
    ? `/preview/${resolvedPreviewId}?c=${encodeURIComponent(company.trim())}&d=${encodeURIComponent(effectiveDomain)}&pi=${getPaletteIndex(effectiveDomain)}`
    : null;

  return (
    <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
      {/* Success header */}
      <div style={{ maxWidth: 560, margin: "3rem auto 2.5rem", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-bg)", border: "2px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", margin: "0 auto 1.25rem" }}>🎉</div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.625rem", letterSpacing: "-0.02em" }}>
          Your storefront is ready, {firstName}!
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.975rem", lineHeight: 1.65 }}>
          {emailSent ? (
            <>
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>✓ Confirmation sent</span> to{" "}
              <strong>{email.trim().toLowerCase()}</strong> — check your inbox.
            </>
          ) : (
            <>
              We&apos;ll send a personalized walkthrough for{" "}
              <strong style={{ color: palette.primary }}>{company}</strong> within 24 hours.
            </>
          )}
        </p>
      </div>

      {/* Shareable preview URL — the core new feature */}
      {previewUrl && (
        <div
          data-testid="shareable-preview-url"
          style={{
            maxWidth: 700,
            margin: "0 auto 2rem",
            padding: "1.375rem 1.5rem",
            background: "var(--primary)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "inline-block", padding: "0.2rem 0.65rem", background: "rgba(255,255,255,0.15)", color: "white", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.625rem" }}>
                ✦ Your shareable preview
              </div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "white", marginBottom: "0.35rem" }}>
                {company}&apos;s branded storefront is live
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", marginBottom: "1rem" }}>
                Share this link with your People Leader or team — anyone with the link can view your storefront preview.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-md)", padding: "0.6rem 0.875rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", fontFamily: "monospace", wordBreak: "break-all", flex: 1 }}>
                  {typeof window !== "undefined" ? window.location.origin : "https://branded-fit.vercel.app"}
                  {previewUrl}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <Link
              href={previewUrl}
              data-testid="view-preview-link"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 1.25rem", background: "white", color: "var(--primary)", borderRadius: "var(--radius-md)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              View Full Preview →
            </Link>
            <button
              onClick={handleCopyLink}
              data-testid="copy-preview-link"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 1.25rem", background: copied ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)", color: "white", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.15s" }}
            >
              {copied ? "✓ Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}

      {/* Share with boss banner */}
      <div style={{ maxWidth: 700, margin: "0 auto 2rem", padding: "1.375rem 1.5rem", background: "var(--primary-light)", border: "2px solid var(--primary)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
            Need internal buy-in?
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Send your People Leader a quick brief — pre-filled with {company}&apos;s details.
          </div>
        </div>
        <Link
          href={`/for-your-boss?company=${encodeURIComponent(company.trim())}${previewId ? `&previewId=${previewId}` : ""}`}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 1.25rem", background: "var(--primary)", color: "white", borderRadius: "var(--radius-md)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
        >
          Share with your boss →
        </Link>
      </div>

      {/* Mini storefront preview */}
      <div style={{ maxWidth: 900, margin: "0 auto 2rem" }}>
        <div style={{ padding: "1.25rem 1.5rem", background: palette.primary, borderRadius: "var(--radius-lg) var(--radius-lg) 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>{company} Store</div>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", marginTop: "0.2rem" }}>On-brand merch for your team · {PRODUCTS.length} items available</div>
          </div>
          <div style={{ padding: "0.4rem 0.875rem", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "var(--radius-md)", color: "white", fontWeight: 600, fontSize: "0.82rem" }}>🔒 Preview mode</div>
        </div>

        <div style={{ padding: "1.25rem", background: palette.bg, borderRadius: "0 0 var(--radius-lg) var(--radius-lg)", border: `1px solid ${palette.primary}20`, borderTop: "none" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.875rem" }}>
            {PRODUCTS.map((product) => (
              <ProductCard key={product.name} product={product} brandColor={palette.primary} brandBg={palette.bg} />
            ))}
          </div>
          <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
            <span>✓ <strong>7 of 8 items</strong> sample-reviewed</span>
            <span>✓ <strong>Defect SLA:</strong> replacement within 5 business days</span>
            <span>✓ <strong>Consolidated shipment</strong> — one tracking link</span>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div style={{ maxWidth: 700, margin: "0 auto 2rem", padding: "1.375rem 1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "0.875rem" }}>What happens next</div>
        {[
          "We generate a personalized brand profile for your domain",
          "You receive a shareable preview link within 24 hours",
          "We email you a full storefront walkthrough with your real brand applied",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0, fontSize: "0.875rem" }}>✓</span>
            <span style={{ fontSize: "0.875rem", color: "var(--text-body)", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/pilot" style={{ display: "inline-block", padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", borderRadius: "var(--radius-md)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
          Start My Pilot →
        </Link>
        <Link href="/" style={{ display: "inline-block", padding: "0.75rem 1.5rem", background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontWeight: 500, fontSize: "0.9rem", textDecoration: "none" }}>
          ← Back to home
        </Link>
      </div>
    </main>
  );
}

export default function TryPageWrapper() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>}>
      <TryPage />
    </Suspense>
  );
}
