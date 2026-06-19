import Link from "next/link";

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
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: 860, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
        Branded Fit
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        Branded apparel that works as hard as your team.
      </p>

      <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "4rem" }}>
        <Link
          href="/roi-calculator"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            background: "#4f46e5",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          ROI Calculator →
        </Link>
      </nav>

      {/* Why Branded Fit section */}
      <section>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
          Why Branded Fit
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "2rem", fontSize: "0.95rem" }}>
          We're the only swag platform that's both fast <em>and</em> high-redemption — alone in the winning quadrant.
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
                <tr key={row.criterion} style={{ background: i % 2 === 0 ? "#f9fafb" : "white" }}>
                  <td style={tdStyle({ isLabel: true })}>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{row.criterion}</div>
                    <div style={{ color: "#9ca3af", fontSize: "0.75rem", marginTop: 2 }}>{row.detail}</div>
                  </td>
                  <td style={tdStyle({ highlight: true })}>
                    <span style={{ color: "#16a34a", fontWeight: 700, marginRight: 6 }}>{CHECK}</span>
                    <span style={{ color: "#111827", fontWeight: 500 }}>{row.brandedFit.text}</span>
                  </td>
                  <td style={tdStyle()}>
                    <span style={{ color: "#dc2626", fontWeight: 700, marginRight: 6 }}>{CROSS}</span>
                    <span style={{ color: "#374151" }}>{row.swagUp.text}</span>
                  </td>
                  <td style={tdStyle()}>
                    <span style={{ color: "#dc2626", fontWeight: 700, marginRight: 6 }}>{CROSS}</span>
                    <span style={{ color: "#374151" }}>{row.printify.text}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: "1.5rem", color: "#6b7280", fontSize: "0.8rem" }}>
          Fulfillment speed and redemption rate based on market research (June 2026). SwagUp pricing from SaaSWorthy/ColdIQ April 2026. Branded Fit at $199/mo.
        </p>
      </section>

      {/* Get a Demo CTA */}
      <section
        style={{
          marginTop: "3rem",
          padding: "2.5rem",
          background: "#eef2ff",
          borderRadius: 12,
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.75rem" }}>
          See Branded Fit in action
        </h2>
        <p style={{ color: "#4b5563", fontSize: "0.95rem", marginBottom: "1.75rem", maxWidth: 480, margin: "0 auto 1.75rem" }}>
          Built for forward-thinking brands. We&apos;ll walk you through the 8-minute storefront setup and show you how the AI curation works for your team.
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
            letterSpacing: "0.01em",
          }}
        >
          Get a Demo →
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
    color: highlight ? "#4f46e5" : isLabel ? "#111827" : "#6b7280",
    background: highlight ? "#eef2ff" : isLabel ? "#f3f4f6" : "#f3f4f6",
    borderBottom: "2px solid #e5e7eb",
    whiteSpace: "nowrap" as const,
  };
}

function tdStyle({ isLabel, highlight }: { isLabel?: boolean; highlight?: boolean } = {}) {
  return {
    padding: "0.875rem 1rem",
    verticalAlign: "top" as const,
    borderBottom: "1px solid #e5e7eb",
    background: highlight ? "rgba(238,242,255,0.4)" : undefined,
    minWidth: isLabel ? 140 : 180,
  };
}
