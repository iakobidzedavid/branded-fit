import Link from "next/link";
import DomainHero from "@/components/DomainHero";

const CHECK = "✓";
const CROSS = "✗";

const comparisonRows = [
  {
    criterion: "Fulfillment Speed",
    detail: "Time from signup to live, orderable storefront",
    brandedFit: { text: "8 minutes", win: true },
    swagUp: { text: "3 business days", win: false },
    printify: { text: "~2 weeks (DIY)", win: false },
  },
  {
    criterion: "Catalog Curation",
    detail: "How products are selected for your brand",
    brandedFit: { text: "AI-curated 120-SKU catalog matched to your brand identity", win: true },
    swagUp: { text: "Manual — you pick from a large catalog with design-team support", win: false },
    printify: { text: "Fully manual — browse thousands of items yourself", win: false },
  },
  {
    criterion: "AI Personalization",
    detail: "Intelligence applied to your swag program",
    brandedFit: { text: "Brand→Product Fit Graph learns from every storefront, improves over time", win: true },
    swagUp: { text: "No AI curation — design services team makes suggestions", win: false },
    printify: { text: "None — you're on your own", win: false },
  },
  {
    criterion: "Redemption Rate",
    detail: "% of employees who actually use their swag",
    brandedFit: { text: "85%", win: true },
    swagUp: { text: "68%", win: false },
    printify: { text: "55%", win: false },
  },
  {
    criterion: "Annual Cost",
    detail: "Typical yearly spend for a 75–300 person team",
    brandedFit: { text: "~$2,400 / yr", win: true },
    swagUp: { text: "$6K–$12K / yr", win: false },
    printify: { text: "~$500 / yr + 10–20 hrs of your time", win: false },
  },
];

export default function Home() {
  return (
    <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
      {/* Hero */}
      <section
        style={{
          padding: "5rem 0 4rem",
          maxWidth: 680,
        }}
      >
        <div
          style={{
            display: "inline-block",
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
          Early access
        </div>
        <h1
          style={{
            fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "1.25rem",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          On-brand swag,
          <br />
          live in 8 minutes.
        </h1>
        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--text-muted)",
            marginBottom: "2rem",
            lineHeight: 1.65,
            maxWidth: 520,
          }}
        >
          Paste your domain, get a live Shopify storefront with an AI-curated 120-SKU catalog —
          matched to your brand colors, fonts, and identity. Zero manual browsing.
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
          }}
        >
          {[
            "8-minute setup — enter your domain and get a live, orderable storefront",
            "AI-curated 120-SKU catalog — matched to your brand identity, zero manual browsing",
            "85% employee redemption — our Brand→Product Fit AI learns what your team actually wears",
          ].map((item) => (
            <li
              key={item}
              style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", color: "var(--text-body)", fontSize: "0.95rem" }}
            >
              <span style={{ color: "var(--accent)", fontWeight: 700, marginTop: 2, flexShrink: 0 }}>{CHECK}</span>
              <span dangerouslySetInnerHTML={{ __html: item.replace(/([^—]+)(—)(.+)/, "<strong>$1</strong>$2$3") }} />
            </li>
          ))}
        </ul>

        <DomainHero />
        <div style={{ marginTop: "1.5rem" }}>
          <Link
            href="/demo"
            style={{
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              fontWeight: 500,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Prefer a guided demo? Book one here →
          </Link>
        </div>
      </section>

      {/* Why Branded Fit */}
      <section style={{ paddingTop: "1rem", paddingBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Why Branded Fit
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
          We&apos;re the only swag platform that&apos;s both fast <em>and</em> high-redemption — alone in the winning quadrant.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr>
                <th style={thStyle({ isLabel: true })}>Feature</th>
                <th style={thStyle({ highlight: true })}>Branded Fit</th>
                <th style={thStyle()}>SwagUp</th>
                <th style={thStyle()}>Printify DIY</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.criterion} style={{ background: i % 2 === 0 ? "var(--surface)" : "white" }}>
                  <td style={tdStyle({ isLabel: true })}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{row.criterion}</div>
                    <div style={{ color: "var(--text-subtle)", fontSize: "0.75rem", marginTop: 2 }}>{row.detail}</div>
                  </td>
                  <td style={tdStyle({ highlight: true })}>
                    <span style={{ color: "var(--accent)", fontWeight: 700, marginRight: 6 }}>{CHECK}</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{row.brandedFit.text}</span>
                  </td>
                  <td style={tdStyle()}>
                    <span style={{ color: "var(--danger)", fontWeight: 700, marginRight: 6 }}>{CROSS}</span>
                    <span style={{ color: "var(--text-body)" }}>{row.swagUp.text}</span>
                  </td>
                  <td style={tdStyle()}>
                    <span style={{ color: "var(--danger)", fontWeight: 700, marginRight: 6 }}>{CROSS}</span>
                    <span style={{ color: "var(--text-body)" }}>{row.printify.text}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: "1.5rem", color: "var(--text-subtle)", fontSize: "0.8rem" }}>
          Fulfillment speed and redemption rate based on market research (June 2026). SwagUp pricing from SaaSWorthy/ColdIQ April 2026. Branded Fit at $199/mo.
        </p>
      </section>

      {/* Try It CTA */}
      <section
        style={{
          padding: "3rem",
          background: "var(--primary-light)",
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
          Try it with your own domain
        </h2>
        <p
          style={{
            color: "#4b5563",
            fontSize: "0.95rem",
            marginBottom: "1.75rem",
            maxWidth: 480,
            margin: "0 auto 1.75rem",
            lineHeight: 1.65,
          }}
        >
          Paste your domain and see your brand-matched storefront preview in under 15 seconds. No signup. No commitment.
        </p>
        <Link
          href="/try"
          style={{
            display: "inline-block",
            padding: "0.875rem 2rem",
            background: "var(--primary)",
            color: "white",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "0.01em",
          }}
        >
          See Your Storefront →
        </Link>
      </section>
    </main>
  );
}

function thStyle({ isLabel, highlight }: { isLabel?: boolean; highlight?: boolean } = {}) {
  return {
    padding: "0.75rem 1rem",
    textAlign: "left" as const,
    fontWeight: 700,
    fontSize: "0.8rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    color: highlight ? "var(--primary)" : isLabel ? "var(--text-primary)" : "var(--text-muted)",
    background: highlight ? "var(--primary-light)" : "var(--surface)",
    borderBottom: "2px solid var(--border)",
    whiteSpace: "nowrap" as const,
  };
}

function tdStyle({ isLabel, highlight }: { isLabel?: boolean; highlight?: boolean } = {}) {
  return {
    padding: "0.875rem 1rem",
    verticalAlign: "top" as const,
    borderBottom: "1px solid var(--border)",
    background: highlight ? "rgba(238,242,255,0.4)" : undefined,
    minWidth: isLabel ? 140 : 180,
  };
}
