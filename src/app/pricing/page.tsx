import Link from "next/link";

const CHECK = "✓";

const tiers = [
  {
    name: "Core",
    price: { annual: 2400, monthly: 249 },
    tagline: "Everything you need to launch your first swag program.",
    badge: null,
    cta: "Get a Demo",
    ctaHref: "/demo",
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
    cta: "Get a Demo",
    ctaHref: "/demo",
    features: [
      "Up to 3 active storefronts",
      "Advanced AI catalog (300 SKUs + seasonal)",
      "Zero markup on all merchandise",
      "Full analytics (cohort, NPS, reorder alerts)",
      "Priority email + Slack support (24 hr)",
      "Guided setup call",
    ],
  },
  {
    name: "Scale",
    price: { annual: 9600, monthly: 999 },
    tagline: "Enterprise-grade for HR platforms, APIs, and multi-entity orgs.",
    badge: null,
    cta: "Talk to Sales",
    ctaHref: "/demo",
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
          alignItems: "center",
          gap: "0.75rem",
          maxWidth: 700,
          margin: "0 auto 2.5rem",
        }}
      >
        <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>💡</span>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--accent-text)", lineHeight: 1.6 }}>
          <strong>Typical first-cycle ROI:</strong> People Ops teams save ~$3,800 in time, errors, and redemption lift per swag cycle — against a $2,400/yr Core subscription. You&apos;re ahead after cycle one.
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

            <Link
              href={tier.ctaHref}
              style={{
                display: "block",
                textAlign: "center",
                padding: "0.75rem 1rem",
                background: tier.badge ? "var(--primary)" : "white",
                color: tier.badge ? "white" : "var(--primary)",
                border: "2px solid var(--primary)",
                borderRadius: "var(--radius-md)",
                fontWeight: 700,
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
              }}
            >
              {tier.cta} →
            </Link>

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
          See exactly how the 48-hour concierge onboarding works — then book your kickoff call.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link
            href="/get-started"
            style={{
              display: "inline-block",
              padding: "0.875rem 2rem",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Get Started →
          </Link>
          <Link
            href="/demo"
            style={{
              display: "inline-block",
              padding: "0.875rem 1.5rem",
              background: "white",
              color: "var(--primary)",
              border: "2px solid var(--primary)",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Get a Demo
          </Link>
        </div>
      </section>
    </main>
  );
}
