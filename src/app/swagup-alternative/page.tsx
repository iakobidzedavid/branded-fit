import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SwagUp Alternative for Startups — Branded Fit",
  description:
    "Tired of SwagUp's setup delays, account manager dependencies, and orders stuck in 'pending'? Branded Fit generates an on-brand swag storefront from your domain in 8 minutes. No design work, no minimums, no wait.",
};

const CHECK = "✓";
const CROSS = "✗";
const MINUS = "–";

const painPoints = [
  {
    pain: "Orders stuck in “pending” with no ETA",
    quote: "Items going missing, orders stuck with little communication",
  },
  {
    pain: "Account manager dependency for every change",
    quote: "Horribly complicated process with account manager issues",
  },
  {
    pain: "2–3 week setup for custom items",
    quote: "Takes too much time for time-sensitive campaigns",
  },
  {
    pain: "Narrow product selection that doesn't match your brand",
    quote: "Product selection is narrow; sourcing new items takes too long",
  },
  {
    pain: "Brand inconsistency — you pick from a catalog, not your brand",
    quote: "No brand input — you're browsing a generic catalog",
  },
];

const comparisonRows = [
  {
    criterion: "Time to live storefront",
    brandedFit: { text: "8 minutes", win: true },
    swagUp: { text: "3 business days minimum", win: false },
  },
  {
    criterion: "Brand matching",
    brandedFit: { text: "AI-generated from your domain — colors, fonts, products", win: true },
    swagUp: { text: "Manual catalog browsing; design team applies brand after the fact", win: false },
  },
  {
    criterion: "Account manager required",
    brandedFit: { text: "No — fully self-serve", win: true },
    swagUp: { text: "Yes — every order and change routes through an account team", win: false },
  },
  {
    criterion: "Order minimums",
    brandedFit: { text: "No minimums — print-on-demand, order 1 or 1,000", win: true },
    swagUp: { text: "Minimums apply on custom packs and many items", win: false },
  },
  {
    criterion: "Employee redemption rate",
    brandedFit: { text: "85% — AI-curated for your brand identity", win: true },
    swagUp: { text: "Not disclosed — catalog items aren't matched to your brand", win: false },
  },
  {
    criterion: "Annual cost (75–300 person team)",
    brandedFit: { text: "$2,400/yr — below most discretionary spend limits", win: true },
    swagUp: { text: "$6,000–$12,000/yr + per-pack fees", win: false },
  },
  {
    criterion: "New hire kit turnaround",
    brandedFit: { text: "Order today, ships in 3–5 business days", win: true },
    swagUp: { text: "2–4 week production lead time on custom items", win: false },
  },
  {
    criterion: "No procurement required",
    brandedFit: { text: "$2,400/yr — under most People Ops discretionary limits", win: true },
    swagUp: { text: "Pricing requires a sales call; often requires Finance sign-off", win: false },
  },
];

export default function SwagUpAlternativePage() {
  return (
    <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
      {/* Hero */}
      <section style={{ padding: "4.5rem 0 3rem", maxWidth: 700 }}>
        <div
          style={{
            display: "inline-block",
            padding: "0.3rem 0.875rem",
            background: "#fef2f2",
            color: "#dc2626",
            borderRadius: 20,
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          SwagUp alternative
        </div>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "1.25rem",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          Done waiting on
          <br />
          your account manager.
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--text-muted)",
            marginBottom: "2rem",
            lineHeight: 1.65,
            maxWidth: 540,
          }}
        >
          SwagUp works — until you need something fast, branded, and without a 2-week production
          queue. Branded Fit generates your on-brand swag storefront from your domain in 8 minutes.
          No design work. No minimums. No waiting.
        </p>
        <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
          <Link
            href="/get-started"
            style={{
              display: "inline-block",
              padding: "0.875rem 1.75rem",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "0.975rem",
            }}
          >
            Try it free — 8 min setup →
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
            See a Demo
          </Link>
        </div>
      </section>

      {/* Why People Switch Section */}
      <section style={{ paddingBottom: "3.5rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Why People Ops teams switch away from SwagUp
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
          Real quotes from TrustRadius and G2 reviews, 2025–2026.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {painPoints.map((p) => (
            <div
              key={p.pain}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem 1.375rem",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontSize: "0.925rem",
                  marginBottom: "0.625rem",
                }}
              >
                {p.pain}
              </div>
              <div
                style={{
                  color: "var(--text-subtle)",
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                  lineHeight: 1.55,
                  borderLeft: "3px solid var(--border)",
                  paddingLeft: "0.75rem",
                }}
              >
                &ldquo;{p.quote}&rdquo;
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ paddingBottom: "3.5rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Branded Fit vs. SwagUp — side by side
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
          For People Ops teams at 75–300 person startups.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr>
                <th style={thStyle({ isLabel: true })}>Criterion</th>
                <th style={thStyle({ highlight: true })}>Branded Fit</th>
                <th style={thStyle()}>SwagUp</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.criterion} style={{ background: i % 2 === 0 ? "var(--surface)" : "white" }}>
                  <td style={tdStyle({ isLabel: true })}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{row.criterion}</div>
                  </td>
                  <td style={tdStyle({ highlight: true })}>
                    <span style={{ color: "var(--accent)", fontWeight: 700, marginRight: 6 }}>{CHECK}</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{row.brandedFit.text}</span>
                  </td>
                  <td style={tdStyle()}>
                    <span style={{ color: "var(--danger)", fontWeight: 700, marginRight: 6 }}>{CROSS}</span>
                    <span style={{ color: "var(--text-body)" }}>{row.swagUp.text}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: "1rem", color: "var(--text-subtle)", fontSize: "0.78rem" }}>
          SwagUp pricing and timelines based on publicly available information and customer reviews (June 2026). Branded Fit at $199/mo / $2,400/yr.
        </p>
      </section>

      {/* How It Works */}
      <section
        style={{
          padding: "2.5rem",
          background: "var(--primary-light)",
          borderRadius: "var(--radius-lg)",
          marginBottom: "3.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "1.5rem",
          }}
        >
          How Branded Fit works — the 8-minute setup
        </h2>
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {[
            { step: "1", text: "Paste your company domain — no signup required to preview" },
            { step: "2", text: "AI extracts your brand colors, fonts, and identity from Brandfetch" },
            { step: "3", text: "AI curates 8–12 products from a 120-SKU quality-scored catalog, matched to your brand" },
            { step: "4", text: "You get a live, shareable storefront preview — edit any product if needed" },
            { step: "5", text: "Place your first order — ships in 3–5 business days, no minimums" },
          ].map((item) => (
            <li key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {item.step}
              </span>
              <span style={{ color: "var(--text-body)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {item.text}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* For People Ops section */}
      <section style={{ paddingBottom: "3.5rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
          }}
        >
          Built for how People Ops actually works
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "2rem",
            fontSize: "0.95rem",
            maxWidth: 580,
            lineHeight: 1.65,
          }}
        >
          SwagUp was built for procurement teams. Branded Fit was built for the solo People Ops
          generalist who needs everything done between two Zoom calls.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              title: "New hire kits on Day 1",
              body:
                "New hire starts Monday? Order today. No account manager, no minimum order, ships in 3–5 days.",
            },
            {
              title: "No design work required",
              body:
                "Your brand identity is pulled from your domain. You get an on-brand storefront without opening Canva once.",
            },
            {
              title: "Under your sign-off limit",
              body:
                "$2,400/yr. Under most People Ops discretionary spending limits — no Finance conversation required.",
            },
            {
              title: "Reorders in 2 clicks",
              body:
                "All-hands gift, quarterly team drop, conference giveaway — reorder from your storefront dashboard without touching the product setup again.",
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                background: "white",
                borderRadius: "var(--radius-lg)",
                padding: "1.375rem",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  marginBottom: "0.5rem",
                }}
              >
                {card.title}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                {card.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "3rem",
          background: "var(--primary-light)",
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
          }}
        >
          Ready to leave "pending" behind?
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
          Paste your domain and see your branded storefront in 8 minutes. No signup required to
          preview. $2,400/yr if you love it — no procurement conversation needed.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.875rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
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
              letterSpacing: "0.01em",
            }}
          >
            Try it free →
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
        <p
          style={{
            marginTop: "1.25rem",
            color: "var(--text-subtle)",
            fontSize: "0.8rem",
          }}
        >
          No minimums. No account manager. Cancel anytime.
        </p>
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
    minWidth: isLabel ? 160 : 200,
  };
}
