"use client";

import Link from "next/link";
import { useState } from "react";
import PricingEmailForm from "@/components/PricingEmailForm";

const CHECK = "✓";
const CROSS = "✗";

const tiers = [
  {
    name: "Core",
    price: { annual: 2400, monthly: 249 },
    tagline: "Everything you need to launch your first swag program.",
    badge: null,
    features: [
      "1 active branded storefront",
      "AI-curated 120-SKU catalog",
      "Zero markup on all merchandise",
      "Basic analytics (orders + redemption)",
      "Email support (48 hr)",
      "Self-serve onboarding",
    ],
  },
  {
    name: "Growth",
    price: { annual: 4800, monthly: 499 },
    tagline: "For fast-growing teams managing multiple brands or sub-brands.",
    badge: "Most Popular",
    features: [
      "Up to 3 active storefronts",
      "Advanced AI catalog (300 SKUs + seasonal)",
      "Zero markup on all merchandise",
      "Full analytics (cohort, NPS, reorder alerts)",
      "Priority email support (24 hr response)",
      "Guided onboarding (email + video walkthrough)",
    ],
  },
  {
    name: "Scale",
    price: { annual: 9600, monthly: 999 },
    tagline: "Enterprise-grade for HR platforms, APIs, and multi-entity orgs.",
    badge: null,
    features: [
      "Unlimited active storefronts",
      "Custom AI training on your brand data",
      "Zero markup + 2% cashback on merch",
      "Custom reporting + data export",
      "Dedicated CSM + SLA",
      "White-glove migration",
      "Full REST API access",
      "SSO / SCIM",
    ],
  },
];

const addOns = [
  { label: "Additional storefront (Growth tier)", price: "$1,200 / yr each" },
  { label: "Annual design refresh", price: "$499 one-time" },
  { label: "Custom domain white-label", price: "$599 / yr" },
];

const competitors = [
  {
    name: "Branded Fit Core",
    annual: "$2,400 / yr",
    markup: "0% (zero markup)",
    storefront: true,
    aiCuration: true,
    highlight: true,
  },
  {
    name: "SwagUp Silver",
    annual: "$1,188 / yr",
    markup: "~18% on merch",
    storefront: false,
    aiCuration: false,
    highlight: false,
  },
  {
    name: "Stadium Swag Pro",
    annual: "$5,400 / yr",
    markup: "Yes (undisclosed)",
    storefront: true,
    aiCuration: false,
    highlight: false,
  },
  {
    name: "PerkUp",
    annual: "$1,800 / yr",
    markup: "N/A (gift cards only)",
    storefront: false,
    aiCuration: false,
    highlight: false,
  },
  {
    name: "Sendoso / Postal",
    annual: "$15,000+ / yr",
    markup: "Yes + warehousing",
    storefront: false,
    aiCuration: false,
    highlight: false,
  },
];

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes — your free trial is the 8-minute live demo of your actual brand's storefront. No credit card, no commitment. That's what lets you see the AI curation before you pay.",
  },
  {
    q: "Can I switch tiers later?",
    a: "Yes. Upgrade at any time and pay the prorated difference. Downgrade at your next renewal date.",
  },
  {
    q: "What does 'zero markup on merchandise' mean?",
    a: "You pay exactly what Printify charges for production and fulfillment. We don't add a margin on top. Our revenue comes only from the platform subscription. Most competitors charge 15–25% on top of every order.",
  },
  {
    q: "Is the $2,400/yr under my team's PO threshold?",
    a: "Most Series A/B People Ops teams have discretionary budget up to $5,000/year without a formal PO. Core fits within that range and is typically expensed as a culture or remote-work tool.",
  },
  {
    q: "How does the net cost compare to SwagUp or Stadium?",
    a: "SwagUp Silver is $1,188/yr but adds ~18% markup on every order — at $15K/yr in merch spend that's $2,700/yr in hidden markup. Branded Fit Core at $2,400/yr with zero markup costs you less when you run the math. Stadium Swag Pro is $5,400/yr, also with markup.",
  },
  {
    q: "Do you offer non-profit discounts?",
    a: "Yes — 20% off the Core tier for registered non-profits and B-Corps. Email us with your verification.",
  },
];

export default function PricingPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  return (
    <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "4rem 0 3rem" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: 520, margin: "0 auto 0.75rem", lineHeight: 1.65 }}>
          Pays for itself in the first swag cycle. Zero markup on merchandise — ever.
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--text-subtle)" }}>
          All plans billed annually. Monthly billing available on Growth and Scale.
        </p>
      </div>

      {/* ROI callout */}
      <div
        style={{
          background: "var(--accent-bg)",
          border: "1px solid var(--accent-border)",
          borderRadius: "var(--radius-lg)",
          padding: "1rem 1.5rem",
          marginBottom: "2.5rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
          maxWidth: 700,
          margin: "0 auto 2.5rem",
        }}
      >
        <span style={{ fontSize: "1.5rem", flexShrink: 0, marginTop: "0.1rem" }}>💡</span>
        <div>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.9rem", color: "var(--accent-text)", lineHeight: 1.6 }}>
            <strong>Typical first-cycle ROI:</strong> People Ops teams save ~$3,800 in time, markup, and redemption waste per swag cycle — against a $2,400/yr Core subscription. You&apos;re ahead after cycle one.
          </p>
          <Link
            href="/roi-calculator"
            style={{ fontSize: "0.82rem", color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
          >
            Calculate your exact ROI →
          </Link>
        </div>
      </div>

      {/* Tier cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        {tiers.map((tier) => (
          <div
            key={tier.name}
            style={{
              border: tier.badge ? "2px solid var(--primary)" : "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
              position: "relative",
              background: "white",
              boxShadow: tier.badge ? "var(--shadow-md)" : "var(--shadow-sm)",
            }}
          >
            {tier.badge && (
              <div
                style={{
                  position: "absolute",
                  top: -14,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--primary)",
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.25rem 0.875rem",
                  borderRadius: 20,
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {tier.badge}
              </div>
            )}

            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>
              {tier.name}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
              {tier.tagline}
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
                ${tier.price.annual.toLocaleString()}
              </span>
              <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginLeft: "0.25rem" }}>/&nbsp;year</span>
              <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "0.2rem" }}>
                ${tier.price.monthly}/mo if billed monthly
              </div>
            </div>

            <button
              onClick={() => setSelectedTier(tier.name)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                padding: "0.75rem 1rem",
                background: tier.badge ? "var(--primary)" : "white",
                color: tier.badge ? "white" : "var(--primary)",
                border: "2px solid var(--primary)",
                borderRadius: "var(--radius-md)",
                fontWeight: 700,
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Request Pricing Details →
            </button>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {tier.features.map((f) => (
                <li key={f} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-body)" }}>
                  <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>{CHECK}</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Competitor comparison */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          How we compare — 2026 market landscape
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
          Most swag platforms charge a markup on every order on top of their platform fee. That hidden cost adds up fast. Below is the transparent comparison.
        </p>
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          {/* Header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 2fr 1fr 1fr",
              background: "var(--surface)",
              borderBottom: "1px solid var(--border)",
              padding: "0.625rem 1.25rem",
              gap: "0.5rem",
            }}
          >
            {["Platform", "Annual fee", "Merch markup", "Branded storefront", "AI curation"].map((h) => (
              <div key={h} style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {h}
              </div>
            ))}
          </div>
          {competitors.map((c) => (
            <div
              key={c.name}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 2fr 1fr 1fr",
                padding: "0.875rem 1.25rem",
                gap: "0.5rem",
                alignItems: "center",
                background: c.highlight ? "var(--accent-bg)" : "white",
                borderBottom: "1px solid var(--border)",
                borderLeft: c.highlight ? "3px solid var(--accent)" : "3px solid transparent",
              }}
            >
              <div style={{ fontWeight: c.highlight ? 700 : 500, fontSize: "0.875rem", color: c.highlight ? "var(--accent-text)" : "var(--text-primary)" }}>
                {c.name}
              </div>
              <div style={{ fontSize: "0.875rem", fontWeight: c.highlight ? 700 : 400, color: c.highlight ? "var(--accent-text)" : "var(--text-body)" }}>
                {c.annual}
              </div>
              <div style={{ fontSize: "0.8rem", color: c.highlight ? "var(--accent)" : "var(--text-muted)" }}>
                {c.markup}
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: c.storefront ? "var(--accent)" : "var(--danger)" }}>
                {c.storefront ? CHECK : CROSS}
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: c.aiCuration ? "var(--accent)" : "var(--danger)" }}>
                {c.aiCuration ? CHECK : CROSS}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginTop: "0.75rem" }}>
          Competitor pricing sourced from public pricing pages and review sites (TrustRadius, Vendr, G2, PerkUp). Verified June 2026.
        </p>
      </section>

      {/* Zero markup explainer */}
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.75rem",
          marginBottom: "3rem",
        }}
      >
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          Why zero markup changes the math
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
          Most platforms charge a 15–25% markup on every order — on top of their platform subscription. On a typical $15,000/yr swag budget, that&apos;s $2,250–$3,750/yr in hidden fees. Branded Fit charges zero.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { label: "SwagUp Gold", fee: "$4,800/yr", markup: "~$2,700/yr markup on $15K", total: "$7,500/yr total" },
            { label: "Stadium Swag Pro", fee: "$5,400/yr", markup: "markup (undisclosed)", total: "$7,000+/yr total" },
            { label: "Branded Fit Core", fee: "$2,400/yr", markup: "$0 markup ever", total: "$2,400/yr total", highlight: true },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: item.highlight ? "var(--accent-bg)" : "white",
                border: item.highlight ? "1px solid var(--accent-border)" : "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "0.875rem", color: item.highlight ? "var(--accent-text)" : "var(--text-primary)", marginBottom: "0.5rem" }}>
                {item.label}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>Platform: {item.fee}</div>
              <div style={{ fontSize: "0.8rem", color: item.highlight ? "var(--accent)" : "var(--text-muted)", marginBottom: "0.5rem" }}>Markup: {item.markup}</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: item.highlight ? "var(--accent)" : "var(--text-primary)", borderTop: "1px solid var(--border)", paddingTop: "0.5rem" }}>
                {item.total}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "1rem" }}>
          Based on $15K/yr in merchandise spend — typical for a 120-person Series A/B SaaS team. <Link href="/roi-calculator" style={{ color: "var(--primary)", fontWeight: 600 }}>Run your own numbers →</Link>
        </p>
      </section>

      {/* Add-ons */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>Add-ons</h2>
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          {addOns.map((a, i) => (
            <div
              key={a.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.875rem 1.25rem",
                background: i % 2 === 0 ? "var(--surface)" : "white",
                fontSize: "0.875rem",
              }}
            >
              <span style={{ color: "var(--text-body)" }}>{a.label}</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", marginLeft: "1rem" }}>{a.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem" }}>
          Frequently asked questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {faqs.map((faq) => (
            <div key={faq.q}>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem", marginBottom: "0.375rem" }}>
                {faq.q}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          background: "var(--primary-light)",
          borderRadius: "var(--radius-lg)",
          padding: "3rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          Ready to launch your swag program?
        </h2>
        <p
          style={{
            color: "#4b5563",
            fontSize: "0.95rem",
            marginBottom: "1.75rem",
            maxWidth: 460,
            margin: "0 auto 1.75rem",
            lineHeight: 1.65,
          }}
        >
          Get started with a personalized walkthrough — we'll email you everything you need to know.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedTier("Get Started")}
            style={{
              display: "inline-block",
              padding: "0.875rem 2rem",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Get Started →
          </button>
          <Link
            href="/roi-calculator"
            style={{
              display: "inline-block",
              padding: "0.875rem 1.5rem",
              background: "white",
              color: "var(--text-body)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontWeight: 500,
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            Calculate My ROI
          </Link>
        </div>
      </section>

      {/* Modal overlay */}
      {selectedTier && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setSelectedTier(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              maxWidth: 400,
              width: "100%",
              boxShadow: "var(--shadow-md)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                {selectedTier === "Get Started" ? "Get Started" : `${selectedTier} Tier`}
              </h3>
              <button
                onClick={() => setSelectedTier(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                ×
              </button>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              {selectedTier === "Get Started"
                ? "Share your details and we'll send you personalized pricing and a product demo link within 24 hours."
                : `Tell us about your team and we'll send you tailored pricing for the ${selectedTier} tier.`}
            </p>
            <PricingEmailForm tier={selectedTier === "Get Started" ? "Pricing" : selectedTier} />
          </div>
        </div>
      )}
    </main>
  );
}
