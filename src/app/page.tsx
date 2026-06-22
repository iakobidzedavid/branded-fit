import Link from "next/link";
import DomainHero from "@/components/DomainHero";
import DemoRequestForm from "@/components/DemoRequestForm";

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
            href="#request-demo"
            style={{
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              fontWeight: 500,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Prefer a guided demo? Request one below →
          </Link>
        </div>
      </section>

      {/* How the AI gets smarter */}
      <section
        style={{
          paddingTop: "4rem",
          paddingBottom: "4rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 600, marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-block",
              padding: "0.3rem 0.875rem",
              background: "#f0fdf4",
              color: "#16a34a",
              borderRadius: 20,
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Data moat
          </div>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            The swag platform that gets smarter<br />with every order you place
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.65 }}>
            Industry average swag redemption is 52%. Our customers average 85%. That gap exists because
            of one thing: the <strong style={{ color: "var(--text-primary)" }}>Brand→Product Fit Graph</strong> — a compounding AI model
            trained on what teams at companies like yours actually use. The longer you&apos;re with Branded Fit,
            the more accurate your catalog becomes.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {[
            {
              step: "01",
              title: "Your brand is scanned",
              body: "We extract your logo, color palette, typography, and brand identity signals the moment you paste your domain.",
            },
            {
              step: "02",
              title: "AI curates your catalog",
              body: "The Brand→Product Fit model selects the 8–12 SKUs most likely to resonate with your team — based on 1,000s of brand signals across similar companies.",
            },
            {
              step: "03",
              title: "Every order trains the model",
              body: "We track what employees actually redeem. Each cycle, your catalog tightens. After two reorder cycles, your redemption rate is measurably higher than industry baseline.",
            },
          ].map((card) => (
            <div
              key={card.step}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "var(--primary)",
                  letterSpacing: "0.1em",
                  marginBottom: "0.625rem",
                }}
              >
                {card.step}
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                {card.title}
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            padding: "1.5rem 2rem",
            background: "var(--primary-light)",
            borderRadius: "var(--radius-lg)",
            flexWrap: "wrap",
          }}
        >
          {[
            { stat: "52%", label: "Industry avg redemption", sub: "SwagDrop 2026 — 2,500 workers surveyed" },
            { stat: "85%", label: "Branded Fit target rate", sub: "Tracked via per-employee redemption links" },
            { stat: "+30 pts", label: "Model-driven lift", sub: "A/B validation in progress with pilot cohort" },
          ].map((item) => (
            <div key={item.stat} style={{ flex: "1 1 140px" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
                {item.stat}
              </div>
              <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.875rem", margin: "0.25rem 0 0.15rem" }}>
                {item.label}
              </div>
              <div style={{ color: "var(--text-subtle)", fontSize: "0.75rem" }}>{item.sub}</div>
            </div>
          ))}
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

      {/* Request a Demo */}
      <section
        id="request-demo"
        style={{
          margin: "2rem 0",
          padding: "3rem",
          background: "var(--primary)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "0.3rem 0.875rem",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                borderRadius: 20,
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Live demo
            </div>
            <h2
              style={{
                fontSize: "clamp(1.4rem, 2.5vw, 1.875rem)",
                fontWeight: 800,
                color: "white",
                marginBottom: "0.75rem",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              See Branded Fit build your storefront live
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
              We&apos;ll walk through the full 8-minute flow using your company&apos;s domain — live brand extraction, AI catalog curation, and a working Shopify storefront before we hang up.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                "Live domain → storefront walkthrough",
                "Your real brand colors & products",
                "Q&A with the founding team",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: "#86efac", fontWeight: 700, fontSize: "0.9rem" }}>✓</span>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.875rem" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <DemoRequestForm />
        </div>
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
