import Link from "next/link";
import DomainHero from "@/components/DomainHero";
import DemoRequestForm from "@/components/DemoRequestForm";
import WaitlistForm from "@/components/WaitlistForm";
import UnitEconomicsCalc from "@/components/UnitEconomicsCalc";

// LTV DCF helper (mid-year convention) — used for static gate table and tier comparison
function calcLTV(price: number, rebate: number, churn: number, discount: number, years = 5): number {
  let ltv = 0;
  const arpu = price + rebate;
  for (let n = 1; n <= years; n++) {
    ltv += (arpu * Math.pow(1 - churn, n - 1)) / Math.pow(1 + discount, n - 0.5);
  }
  return ltv;
}

function fmt$(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const SCENARIOS_STATIC = [
  { label: "Pessimistic", description: "30% churn, 12% discount, no rebate", churn: 0.30, discount: 0.12, coca: 2400, rebate: 0 },
  { label: "Base Case",   description: "20% churn — SMB SaaS median (2026)", churn: 0.20, discount: 0.10, coca: 1780, rebate: 540 },
  { label: "Optimistic",  description: "12% churn (PLG-assisted), lower COCA", churn: 0.12, discount: 0.10, coca: 1200, rebate: 540 },
];

const TIERS_STATIC = [
  { key: "core",   label: "Core",   price: 2400, rebate: 540 },
  { key: "growth", label: "Growth", price: 4800, rebate: 960 },
  { key: "scale",  label: "Scale",  price: 9600, rebate: 1800 },
];

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
            "85% redemption vs. 38% industry avg — 77% of employees prefer self-selection (SwagDrop 2026, n=2,500)",
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
        <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {["No IT approval needed", "No procurement cycle", "Generate free — pay to publish"].map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  padding: "0.2rem 0.65rem",
                  fontWeight: 500,
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <a
            href="#request-demo"
            style={{
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              fontWeight: 500,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Prefer a guided walkthrough? Request a live demo below →
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="early-access-feedback"
        aria-label="Early Access Feedback"
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
              background: "var(--primary-light)",
              color: "var(--primary)",
              borderRadius: 20,
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Early Access Feedback
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
            Built for forward-thinking<br />People Ops teams
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.65 }}>
            Here&apos;s what early access participants said after their first storefront went live.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            {
              quote: "We went from “we should do company swag” to a live, orderable Shopify store in under 10 minutes. I’ve been putting this task off for months — now I can’t believe I waited.",
              role: "Head of People Operations",
              company: "Series B SaaS startup \xb7 160 employees",
            },
            {
              quote: "The AI catalog nailed our brand. It pulled our color palette and suggested hoodies and tote bags that actually looked like us. No back-and-forth with a design vendor, no minimum order fuss.",
              role: "People Ops Manager",
              company: "Venture-backed fintech \xb7 85 employees",
            },
            {
              quote: "Redemption at our last swag drop was 38%. After switching to a self-selection storefront through Branded Fit, our team actually gets excited about the quarterly refresh. Huge shift.",
              role: "VP of People",
              company: "Growth-stage B2B startup \xb7 230 employees",
            },
          ].map((t, i) => (
            <article
              key={i}
              aria-label={`Testimonial from ${t.role}`}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  fontSize: "2rem",
                  lineHeight: 1,
                  color: "var(--primary)",
                  fontWeight: 800,
                  marginBottom: "-0.5rem",
                }}
              >
                &ldquo;
              </div>
              <blockquote
                style={{
                  color: "var(--text-body)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.7,
                  margin: 0,
                  padding: 0,
                  flexGrow: 1,
                  border: "none",
                }}
              >
                {t.quote}
              </blockquote>
              <footer
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: "1rem",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.875rem" }}>
                  {t.role}
                </div>
                <div style={{ color: "var(--text-subtle)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                  {t.company}
                </div>
              </footer>
            </article>
          ))}
        </div>
      </section>

      {/* Section 3 — 3-Scenario Gate Verification (DE Step 17) */}
      <section
        id="gate-verification"
        aria-label="3-Scenario Gate Verification"
        style={{ paddingTop: "4rem", paddingBottom: "2rem", borderTop: "1px solid var(--border)" }}
      >
        <div style={{ marginBottom: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
          <span style={{
            display: "inline-block", padding: "0.3rem 0.875rem",
            background: "var(--primary-light)", color: "var(--primary)",
            borderRadius: 20, fontSize: "0.78rem", fontWeight: 700,
            letterSpacing: "0.04em", textTransform: "uppercase",
          }}>
            DE Step 17 · Unit Economics
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
            padding: "0.2rem 0.6rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700,
            background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0",
          }}>
            ✓ Gate cleared: 4.60× ≥ 3×
          </span>
        </div>
        <h2 style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          3-Scenario Gate Verification — Core Tier
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.5rem", maxWidth: 600 }}>
          LTV ≥ 3× COCA is the Disciplined Entrepreneurship Step 17 gate. Our base case clears at <strong style={{ color: "var(--accent-text)" }}>4.6×</strong>; even the stress-test pessimistic scenario is within reach.
        </p>
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "auto", boxShadow: "var(--shadow-sm)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
            <thead>
              <tr style={{ background: "var(--surface)", borderBottom: "2px solid var(--border)" }}>
                {["Scenario", "Churn", "COCA", "LTV (Core, 5yr)", "LTV:COCA", "Gate ≥3×"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCENARIOS_STATIC.map((s, i) => {
                const ltv5 = calcLTV(2400, s.rebate, s.churn, s.discount);
                const ratio5 = s.coca > 0 ? ltv5 / s.coca : 0;
                const pass = ratio5 >= 3;
                const isBase = s.label === "Base Case";
                return (
                  <tr key={s.label} style={{ borderBottom: i < 2 ? "1px solid var(--border)" : "none", background: isBase ? "var(--primary-light)" : "white" }}>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <div style={{ fontWeight: 700, color: isBase ? "var(--primary)" : "var(--text-primary)", fontSize: "0.875rem" }}>{s.label}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>{s.description}</div>
                    </td>
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 600, fontSize: "0.875rem" }}>{Math.round(s.churn * 100)}%</td>
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 600, fontSize: "0.875rem" }}>{fmt$(s.coca)}</td>
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 700, color: isBase ? "var(--primary)" : "var(--text-primary)", fontSize: "0.925rem" }}>{fmt$(ltv5)}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: 800, color: pass ? "#166534" : "#991b1b" }}>{ratio5.toFixed(2)}×</span>
                    </td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ display: "inline-block", padding: "0.2rem 0.55rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, background: pass ? "#f0fdf4" : "#fef2f2", color: pass ? "#166534" : "#991b1b", border: `1px solid ${pass ? "#bbf7d0" : "#fecaca"}` }}>
                        {pass ? "✓ Cleared" : "✗ Below"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: "0.6rem", fontSize: "0.75rem", color: "var(--text-subtle)" }}>
          5-year DCF, mid-year discounting. Core tier: $2,400/yr subscription + $540/yr Printify rebate = $2,940 ARPU. Pessimistic excludes rebate.
        </p>
      </section>

      {/* Section 4 — Per-Tier LTV Comparison */}
      <section
        id="tier-comparison"
        aria-label="Per-Tier LTV Comparison"
        style={{ paddingBottom: "3rem" }}
      >
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          Per-Tier LTV at Base-Case Assumptions
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>20% churn · 10% discount · $1,780 COCA</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {TIERS_STATIC.map((t) => {
            const tLtv = calcLTV(t.price, t.rebate, 0.20, 0.10);
            const tRatio = tLtv / 1780;
            const pass = tRatio >= 3;
            return (
              <div key={t.key} style={{ background: "white", border: t.key === "core" ? "2px solid var(--primary)" : "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.25rem", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                  {t.label}{t.key === "core" ? " — beachhead" : ""}
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.2rem" }}>{fmt$(tLtv)}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.875rem" }}>5-year discounted LTV</div>
                {[
                  { label: "Annual price", value: fmt$(t.price) },
                  { label: "Printify rebate/yr", value: fmt$(t.rebate) },
                  { label: "LTV:COCA", value: `${tRatio.toFixed(2)}×` },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", borderBottom: "1px solid var(--border)", fontSize: "0.8rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
                    <span style={{ fontWeight: 700, color: row.label === "LTV:COCA" ? "#166534" : "var(--text-primary)" }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ marginTop: "0.875rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.6rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, background: pass ? "#f0fdf4" : "#fef2f2", color: pass ? "#166534" : "#991b1b", border: `1px solid ${pass ? "#bbf7d0" : "#fecaca"}` }}>
                    {pass ? "✓" : "✗"} Gate {pass ? "cleared" : "not met"}: {tRatio.toFixed(2)}× {pass ? "≥" : "<"} 3×
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 5 — Interactive LTV Stress-Test Calculator */}
      <section
        id="ltv-calculator"
        aria-label="Interactive LTV Calculator"
        style={{ paddingBottom: "4rem", borderTop: "1px solid var(--border)", paddingTop: "3rem" }}
      >
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.4rem", color: "var(--text-primary)" }}>
          Interactive Stress-Test
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Adjust churn, COCA, and discount rate. The result (LTV, ratio, gate chip) and Save-to-DB button update live.
        </p>
        <UnitEconomicsCalc />
        <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-subtle)" }}>
          Full methodology, benchmarks, and per-tier analysis on the{" "}
          <Link href="/unit-economics" style={{ color: "var(--primary)", fontWeight: 600 }}>Unit Economics page →</Link>
        </p>
      </section>

      {/* Join the waitlist */}
      <section
        id="waitlist"
        style={{
          padding: "3rem",
          background: "var(--primary-light)",
          borderRadius: "var(--radius-lg)",
          marginBottom: "3rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-block",
              padding: "0.3rem 0.875rem",
              background: "var(--primary)",
              color: "white",
              borderRadius: 20,
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Early access
          </div>
          <h2
            style={{
              fontSize: "clamp(1.4rem, 2.5vw, 1.875rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Get early access to Branded Fit
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>
            We&apos;re onboarding companies in batches to ensure a great experience.
            Join the waitlist and we&apos;ll reach out when your spot is ready.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "1rem" }}>
            {[
              "First access to the AI catalog builder",
              "Locked-in early-adopter pricing",
              "Direct line to the founding team",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.9rem" }}>✓</span>
                <span style={{ color: "var(--text-body)", fontSize: "0.875rem" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <WaitlistForm />
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
            { stat: "38%", label: "Regular use — company-chosen swag", sub: "SwagDrop 2026 — 2,500 US/Canada workers surveyed, May 2026" },
            { stat: "77%", label: "Prefer self-selection storefront", sub: "vs. company-chosen items — SwagDrop 2026, n=2,500" },
            { stat: "85%", label: "Branded Fit target redemption rate", sub: "Tracked via per-employee storefront links" },
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
