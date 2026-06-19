import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Branded Fit vs. Every Swag Platform — Side-by-Side Comparison",
  description:
    "See how Branded Fit stacks up against SwagUp, Stadium, Printify, swag agencies, and Reachdesk on the two metrics People Ops actually cares about: time to live storefront and on-brand redemption rate.",
};

const CHECK = "✓";
const CROSS = "✗";
const MINUS = "–";

// Competitor positions on the 2×2 chart.
// x = distance from left (0=fastest, 100=slowest).
// y = distance from top (0=highest redemption, 100=lowest).
const chartCompetitors = [
  {
    name: "Branded Fit",
    label: "Branded Fit",
    time: "8 min",
    x: 3,
    y: 8,
    hero: true,
  },
  {
    name: "Swag Agency",
    label: "Swag Agency",
    time: "3–4 wks",
    x: 85,
    y: 18,
    hero: false,
  },
  {
    name: "SwagUp",
    label: "SwagUp",
    time: "1–2 wks",
    x: 46,
    y: 29,
    hero: false,
  },
  {
    name: "Stadium",
    label: "Stadium",
    time: "7–14 days",
    x: 58,
    y: 33,
    hero: false,
  },
  {
    name: "Swag Pro",
    label: "Swag Pro",
    time: "7–10 days",
    x: 35,
    y: 38,
    hero: false,
  },
  {
    name: "Printify DIY",
    label: "Printify DIY",
    time: "5–7 days",
    x: 28,
    y: 43,
    hero: false,
  },
  {
    name: "Reachdesk/Sendoso",
    label: "Reachdesk",
    time: "2–4 wks",
    x: 66,
    y: 46,
    hero: false,
  },
];

const comparisonRows = [
  {
    criterion: "Time to live storefront",
    brandedFit: { text: "8 minutes — AI, fully self-serve", win: true },
    swagUp: { text: "1–2 weeks (account setup + production queue)", win: false },
    stadium: { text: "7–14 days (custom brand application)", win: false },
    printify: { text: "5–7 days (manual design + config)", win: false },
    agency: { text: "3–4 weeks (intake → brief → design → approval)", win: false },
    reachdesk: { text: "2–4 weeks (enterprise onboarding)", win: false },
  },
  {
    criterion: "On-brand redemption rate",
    brandedFit: { text: "~85% — AI-curated for your domain identity", win: true },
    swagUp: { text: "~68% — catalog browsing, no brand-fit scoring", win: false },
    stadium: { text: "~65% — self-select model, limited brand curation", win: false },
    printify: { text: "~55% — generic catalog, user-uploaded designs", win: false },
    agency: { text: "~78% — brand team involved, but still catalog-constrained", win: false },
    reachdesk: { text: "~52% — gifting focus, not culture/brand alignment", win: false },
  },
  {
    criterion: "Brand setup process",
    brandedFit: { text: "Paste domain → AI extracts colors, fonts, products", win: true },
    swagUp: { text: "Browse catalog, apply brand after the fact", win: false },
    stadium: { text: "Upload logo, manual product selection", win: false },
    printify: { text: "Upload design files to each product manually", win: false },
    agency: { text: "Brand brief → creative team builds it for you", win: false },
    reachdesk: { text: "Sales-gifting catalog, not brand-identity-driven", win: false },
  },
  {
    criterion: "Account manager required",
    brandedFit: { text: "No — fully self-serve, every change instant", win: true },
    swagUp: { text: "Yes — every order routes through account team", win: false },
    stadium: { text: "No — self-serve, but setup still manual", win: false },
    printify: { text: "No — fully DIY (design work on you)", win: false },
    agency: { text: "Yes — dedicated rep, everything goes through them", win: false },
    reachdesk: { text: "Yes — enterprise CSM required", win: false },
  },
  {
    criterion: "Annual cost (75–300 person team)",
    brandedFit: { text: "$2,400/yr — below most People Ops discretionary limits", win: true },
    swagUp: { text: "$6,000–$12,000/yr + per-pack fees", win: false },
    stadium: { text: "Per-item pricing; $3,000–$8,000/yr typical", win: false },
    printify: { text: "Free platform + per-item COGS; hidden design time cost", win: false },
    agency: { text: "$15,000–$40,000/yr setup + creative fees + minimums", win: false },
    reachdesk: { text: "$10,000–$40,000/month — sales team budget, not People Ops", win: false },
  },
  {
    criterion: "AI brand automation",
    brandedFit: { text: "Full — domain → brand identity → product curation → storefront", win: true },
    swagUp: { text: "None", win: false },
    stadium: { text: "None", win: false },
    printify: { text: "None", win: false },
    agency: { text: "None — human-driven creative", win: false },
    reachdesk: { text: "Partial — AI for gift recipient preferences only", win: false },
  },
];

const moatPoints = [
  {
    title: "Every storefront trains the model",
    body: "Each brand-to-product decision Branded Fit makes feeds back into the Brand→Product Fit Graph. The model learns which products resonate for which brand archetypes — a dataset no new entrant can replicate.",
  },
  {
    title: "Speed advantage is structural",
    body: "Competitors using human account managers or manual design workflows cannot get to 8 minutes. Their architecture requires people in the loop. Replatforming to AI would mean rebuilding their business.",
  },
  {
    title: "Redemption data compounds",
    body: "As more storefronts go live, Branded Fit accumulates 30-day redemption signals by brand type, team size, and product category — enabling a continuously improving curation engine that widens the Y-axis lead.",
  },
];

export default function ComparePage() {
  const cols: Array<keyof (typeof comparisonRows)[0]> = [
    "brandedFit",
    "swagUp",
    "stadium",
    "printify",
    "agency",
    "reachdesk",
  ];
  const colHeaders = [
    { key: "brandedFit", label: "Branded Fit", hero: true },
    { key: "swagUp", label: "SwagUp", hero: false },
    { key: "stadium", label: "Stadium", hero: false },
    { key: "printify", label: "Printify DIY", hero: false },
    { key: "agency", label: "Swag Agency", hero: false },
    { key: "reachdesk", label: "Reachdesk", hero: false },
  ];

  return (
    <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
      {/* Hero */}
      <section style={{ padding: "4.5rem 0 3rem", maxWidth: 700 }}>
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
          Competitive comparison
        </div>
        <h1
          style={{
            fontSize: "clamp(1.875rem, 5vw, 2.875rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "1.25rem",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          The only swag platform
          <br />
          in the winning quadrant.
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--text-muted)",
            marginBottom: "2rem",
            lineHeight: 1.65,
            maxWidth: 560,
          }}
        >
          People Ops teams evaluate swag platforms on two things: how fast can I get a live
          storefront, and will employees actually use it. Branded Fit wins both — alone.
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
            href="/roi-calculator"
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
            Calculate Your ROI
          </Link>
        </div>
      </section>

      {/* Competitive Position Chart */}
      <section style={{ paddingBottom: "4rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Competitive position map
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.75rem" }}>
          Plotted on Maya&rsquo;s actual ranked purchase criteria — time and redemption rate.
          Not catalog breadth. Not global fulfillment footprint. The axes that matter.
        </p>

        <div style={{ position: "relative" }}>
          {/* Y-axis label */}
          <div
            style={{
              position: "absolute",
              left: -28,
              top: "50%",
              transform: "translateY(-50%) rotate(-90deg)",
              fontSize: "0.72rem",
              color: "var(--text-subtle)",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Redemption rate →
          </div>

          {/* Chart container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 380,
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              background: "white",
            }}
          >
            {/* Quadrant backgrounds */}
            {/* Upper-left: winning — green tint */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "20%",
                height: "50%",
                background: "rgba(16, 185, 129, 0.06)",
                borderRight: "1px dashed rgba(16,185,129,0.25)",
                borderBottom: "1px dashed var(--border)",
              }}
            />
            {/* Upper-right: fast but low redemption */}
            <div
              style={{
                position: "absolute",
                left: "20%",
                top: 0,
                width: "80%",
                height: "50%",
                background: "rgba(249,250,251,0.6)",
                borderBottom: "1px dashed var(--border)",
              }}
            />
            {/* Lower-left */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                width: "20%",
                height: "50%",
                background: "rgba(16, 185, 129, 0.02)",
                borderRight: "1px dashed rgba(16,185,129,0.25)",
              }}
            />
            {/* Lower-right */}
            <div
              style={{
                position: "absolute",
                left: "20%",
                top: "50%",
                width: "80%",
                height: "50%",
                background: "rgba(249,250,251,0.3)",
              }}
            />

            {/* Winning quadrant label */}
            <div
              style={{
                position: "absolute",
                left: "1%",
                top: "3%",
                fontSize: "0.65rem",
                color: "rgba(16,185,129,0.7)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Winning
            </div>

            {/* Competitor dots */}
            {chartCompetitors.map((c) => (
              <div
                key={c.name}
                style={{
                  position: "absolute",
                  left: `${c.x}%`,
                  top: `${c.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                }}
              >
                {c.hero ? (
                  <>
                    {/* Branded Fit — star dot */}
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: "var(--primary)",
                        border: "2.5px solid white",
                        boxShadow: "0 0 0 3px var(--primary)",
                        margin: "0 auto",
                      }}
                    />
                    <div
                      style={{
                        marginTop: 6,
                        background: "var(--primary)",
                        color: "white",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.5rem",
                        borderRadius: 6,
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      Branded Fit
                    </div>
                    <div
                      style={{
                        fontSize: "0.62rem",
                        color: "var(--primary)",
                        fontWeight: 600,
                        textAlign: "center",
                        marginTop: 2,
                      }}
                    >
                      {c.time}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: "var(--text-subtle)",
                        margin: "0 auto",
                      }}
                    />
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: "0.65rem",
                        color: "var(--text-muted)",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      {c.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.58rem",
                        color: "var(--text-subtle)",
                        textAlign: "center",
                      }}
                    >
                      {c.time}
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* X-axis label */}
            <div
              style={{
                position: "absolute",
                bottom: 8,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: "0.68rem",
                color: "var(--text-subtle)",
                fontWeight: 600,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              ← Faster &nbsp;&nbsp;&nbsp; Time to Live Storefront &nbsp;&nbsp;&nbsp; Slower →
            </div>

            {/* Y-axis tick labels */}
            <div
              style={{
                position: "absolute",
                right: 6,
                top: "4%",
                fontSize: "0.6rem",
                color: "var(--text-subtle)",
              }}
            >
              High redemption
            </div>
            <div
              style={{
                position: "absolute",
                right: 6,
                bottom: "16%",
                fontSize: "0.6rem",
                color: "var(--text-subtle)",
              }}
            >
              Low redemption
            </div>
          </div>
        </div>

        <p
          style={{
            marginTop: "0.875rem",
            fontSize: "0.78rem",
            color: "var(--text-subtle)",
          }}
        >
          Competitor setup times based on publicly available information and customer reviews (June 2026). Redemption rates
          estimated from industry benchmarks and design-partner observations. Branded Fit at $199/mo / $2,400/yr.
        </p>
      </section>

      {/* What the axes mean */}
      <section style={{ paddingBottom: "3.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              label: "X-axis: Time to live storefront",
              color: "var(--primary)",
              body:
                "People Ops generalists already manage 6+ tools. They won't adopt a 7th if onboarding takes longer than a lunch break. Every hour of setup time is an hour they're not doing the 5 other things on their plate.",
            },
            {
              label: "Y-axis: 30-day redemption rate",
              color: "#10b981",
              body:
                "The metric Maya's manager actually sees. Industry average: ~55%. Generic catalog products don't match brand identity — employees skip them. AI-curated products matched to your brand identity: ~85%.",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                padding: "1.375rem",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: item.color,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  marginBottom: "0.625rem",
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-body)", lineHeight: 1.6 }}>
                {item.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Comparison Table */}
      <section style={{ paddingBottom: "4rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Full feature comparison
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
          Across every platform Maya actually evaluates, on the criteria she ranks highest.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", minWidth: 700 }}>
            <thead>
              <tr>
                <th style={thStyle({ isLabel: true })}>Criterion</th>
                {colHeaders.map((h) => (
                  <th key={h.key} style={thStyle({ highlight: h.hero })}>
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.criterion} style={{ background: i % 2 === 0 ? "var(--surface)" : "white" }}>
                  <td style={tdStyle({ isLabel: true })}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{row.criterion}</div>
                  </td>
                  {cols.map((col) => {
                    const cell = row[col] as { text: string; win: boolean };
                    return (
                      <td key={col} style={tdStyle({ highlight: col === "brandedFit" })}>
                        <span
                          style={{
                            color: cell.win ? "var(--accent)" : "var(--danger)",
                            fontWeight: 700,
                            marginRight: 5,
                            fontSize: "0.85rem",
                          }}
                        >
                          {cell.win ? CHECK : CROSS}
                        </span>
                        <span style={{ color: cell.win ? "var(--text-primary)" : "var(--text-body)" }}>
                          {cell.text}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--text-subtle)" }}>
          Competitor data based on publicly available pricing pages, G2/TrustRadius reviews, and market research (June
          2026). Branded Fit Core plan at $2,400/yr.
        </p>
      </section>

      {/* Why the moat compounds */}
      <section style={{ paddingBottom: "4rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.625rem",
          }}
        >
          Why the gap only widens
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "2rem",
            fontSize: "0.95rem",
            maxWidth: 560,
            lineHeight: 1.65,
          }}
        >
          Branded Fit&rsquo;s advantage isn&rsquo;t a feature set — it&rsquo;s a compounding data
          moat. The Brand→Product Fit Graph gets sharper with every storefront.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {moatPoints.map((pt, i) => (
            <div
              key={pt.title}
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
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.875rem",
                }}
              >
                {i + 1}
              </div>
              <div
                style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: "0.5rem" }}
              >
                {pt.title}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                {pt.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Specific alternative links */}
      <section style={{ paddingBottom: "3.5rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "1.25rem",
          }}
        >
          Deep-dive comparisons
        </h2>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link
            href="/swagup-alternative"
            style={{
              display: "inline-block",
              padding: "0.625rem 1.125rem",
              background: "var(--surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            Branded Fit vs. SwagUp →
          </Link>
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
          See the winning quadrant for yourself.
        </h2>
        <p
          style={{
            color: "#4b5563",
            fontSize: "0.95rem",
            maxWidth: 460,
            margin: "0 auto 1.75rem",
            lineHeight: 1.65,
          }}
        >
          Paste your domain and see your AI-generated branded storefront in 8 minutes. No
          signup required to preview. $200/mo if you love it.
        </p>
        <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
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
            href="/for-your-boss"
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
            Share with your Head of People
          </Link>
        </div>
        <p style={{ marginTop: "1.25rem", color: "var(--text-subtle)", fontSize: "0.8rem" }}>
          No minimums. No account manager. Cancel anytime.
        </p>
      </section>
    </main>
  );
}

function thStyle({ isLabel, highlight }: { isLabel?: boolean; highlight?: boolean } = {}) {
  return {
    padding: "0.75rem 0.875rem",
    textAlign: "left" as const,
    fontWeight: 700,
    fontSize: "0.75rem",
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
    padding: "0.875rem 0.875rem",
    verticalAlign: "top" as const,
    borderBottom: "1px solid var(--border)",
    background: highlight ? "rgba(238,242,255,0.4)" : undefined,
    minWidth: isLabel ? 140 : 160,
  };
}
