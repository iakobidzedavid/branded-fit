import Link from "next/link";

const CHECK = "✓";

const tiers = [
  {
    name: "Core",
    price: { annual: 2400, monthly: 249 },
    tagline: "Everything you need to launch your first swag program.",
    badge: null,
    cta: "Get a Demo",
    features: [
      "1 active branded storefront",
      "AI-curated 120-SKU catalog",
      "Zero markup on all merchandise",
      "Basic analytics (orders + redemption)",
      "Email support (48 hr)",
      "Self-serve onboarding",
    ],
    notIncluded: ["Multiple storefronts", "Advanced analytics", "Priority support", "API access"],
  },
  {
    name: "Growth",
    price: { annual: 4800, monthly: 499 },
    tagline: "For fast-growing teams managing multiple brands or sub-brands.",
    badge: "Most Popular",
    cta: "Get a Demo",
    features: [
      "Up to 3 active storefronts",
      "Advanced AI catalog (300 SKUs + seasonal)",
      "Zero markup on all merchandise",
      "Full analytics (cohort, NPS, reorder alerts)",
      "Priority email + Slack support (24 hr)",
      "Guided setup call",
    ],
    notIncluded: ["Unlimited storefronts", "API access", "SSO / SCIM", "Dedicated CSM"],
  },
  {
    name: "Scale",
    price: { annual: 9600, monthly: 999 },
    tagline: "Enterprise-grade for HR platforms, APIs, and multi-entity orgs.",
    badge: null,
    cta: "Talk to Sales",
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
    notIncluded: [],
  },
];

const addOns = [
  { label: "Additional storefront (Growth tier)", price: "$1,200 / yr each" },
  { label: "Annual design refresh", price: "$499 one-time" },
  { label: "Custom domain white-label", price: "$599 / yr" },
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
    a: "You pay exactly what Printify charges for production and fulfillment. We don't add a margin on top. Our revenue comes only from the platform subscription.",
  },
  {
    q: "Is the $2,400/yr under my team's PO threshold?",
    a: "Most Series A/B People Ops teams have discretionary budget up to $5,000/year without a formal PO. Core fits within that range and is typically expensed as a culture or remote-work tool.",
  },
  {
    q: "Do you offer non-profit discounts?",
    a: "Yes — 20% off the Core tier for registered non-profits and B-Corps. Email us with your verification.",
  },
];

export default function PricingPage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: 960, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <Link
          href="/"
          style={{ color: "#4f46e5", fontSize: "0.875rem", textDecoration: "none", display: "block", marginBottom: "1.5rem" }}
        >
          ← Branded Fit
        </Link>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#111827", marginBottom: "0.75rem", lineHeight: 1.15 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#4b5563", maxWidth: 520, margin: "0 auto 0.75rem" }}>
          Pays for itself in the first swag cycle. Zero markup on merchandise — ever.
        </p>
        <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
          All plans billed annually. Monthly billing available on Growth and Scale.
        </p>
      </div>

      {/* ROI callout */}
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 10,
          padding: "1rem 1.5rem",
          marginBottom: "2.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          maxWidth: 700,
          margin: "0 auto 2.5rem",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>💡</span>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#166534" }}>
          <strong>Typical first-cycle ROI:</strong> People Ops teams save ~$3,800 in time, errors, and redemption lift per swag cycle — against a $2,400/yr Core subscription. You're ahead after cycle one.
        </p>
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
              border: tier.badge ? "2px solid #4f46e5" : "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "1.75rem",
              position: "relative",
              background: "white",
            }}
          >
            {tier.badge && (
              <div
                style={{
                  position: "absolute",
                  top: -14,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#4f46e5",
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

            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
              {tier.name}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "1.25rem", lineHeight: 1.4 }}>
              {tier.tagline}
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "#111827" }}>
                ${tier.price.annual.toLocaleString()}
              </span>
              <span style={{ fontSize: "0.9rem", color: "#6b7280", marginLeft: "0.25rem" }}>/&nbsp;year</span>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.2rem" }}>
                ${tier.price.monthly}/mo if billed monthly
              </div>
            </div>

            <Link
              href="/demo"
              style={{
                display: "block",
                textAlign: "center",
                padding: "0.75rem 1rem",
                background: tier.badge ? "#4f46e5" : "white",
                color: tier.badge ? "white" : "#4f46e5",
                border: "2px solid #4f46e5",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
              }}
            >
              {tier.cta} →
            </Link>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {tier.features.map((f) => (
                <li key={f} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", color: "#374151" }}>
                  <span style={{ color: "#16a34a", fontWeight: 700, flexShrink: 0 }}>{CHECK}</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1rem" }}>Add-ons</h2>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
          {addOns.map((a, i) => (
            <div
              key={a.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.875rem 1.25rem",
                background: i % 2 === 0 ? "#f9fafb" : "white",
                fontSize: "0.875rem",
              }}
            >
              <span style={{ color: "#374151" }}>{a.label}</span>
              <span style={{ fontWeight: 600, color: "#111827", whiteSpace: "nowrap", marginLeft: "1rem" }}>{a.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.25rem" }}>
          Frequently asked questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {faqs.map((faq) => (
            <div key={faq.q}>
              <p style={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem", marginBottom: "0.375rem" }}>
                {faq.q}
              </p>
              <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          background: "#eef2ff",
          borderRadius: 12,
          padding: "2.5rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.75rem" }}>
          Still have questions?
        </h2>
        <p style={{ color: "#4b5563", fontSize: "0.95rem", marginBottom: "1.75rem" }}>
          We&apos;ll walk you through the 8-minute storefront demo and answer any pricing questions live.
        </p>
        <Link
          href="/demo"
          style={{
            display: "inline-block",
            padding: "0.875rem 2rem",
            background: "#4f46e5",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          Get a Demo →
        </Link>
      </section>
    </main>
  );
}
