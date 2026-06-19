import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Branded Fit — Market Expansion Path: $48M to $1.1B",
  description:
    "How Branded Fit expands from a $48M beachhead (US Series A/B swag) to a $1.1B+ total addressable market across mid-market tech, customer gifting, and global markets.",
};

const BEACHHEAD = {
  label: "Beachhead",
  name: "US Series A/B SaaS",
  subtitle: "75–300 FTE, People Ops buyer",
  tam: "$48M",
  tamRaw: 48,
  year: "Now",
  color: "var(--primary)",
  bg: "var(--primary-light)",
  status: "Active",
};

const markets = [
  {
    id: 1,
    label: "Market 1",
    name: "Mid-Market Tech Swag",
    subtitle: "US tech companies, 300–5,000 FTE",
    tam: "$360M",
    tamRaw: 360,
    year: "Year 1–2",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    trigger: "≥25 paying beachhead customers + Growth tier launch",
    buyer: "Same buyer (People Ops / Head of Culture), larger budget",
    product: "No new product — Growth & Scale tiers, proven brand fidelity at 50+ SKUs",
    why: "Same Maya archetype at 500-FTE companies. Budget grows 10× but the tool is identical. Natural graduation as beachhead customers' companies scale.",
  },
  {
    id: 2,
    label: "Market 2",
    name: "Global Series A/B",
    subtitle: "Canada, UK, EU, ANZ — same ICP, non-US",
    tam: "$55M",
    tamRaw: 55,
    year: "Year 1–2",
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    trigger: "First inbound from non-US + Printify partner quality verified",
    buyer: "Same Maya buyer, local currency pricing",
    product: "GBP/EUR pricing, GDPR data terms — zero core product changes",
    why: "~3,800 qualifying firms in Canada, UK, EU, ANZ. Printify ships globally. Distribution play, not product play. Pure upside from existing product.",
  },
  {
    id: 3,
    label: "Market 3",
    name: "Customer & Event Gifting",
    subtitle: "B2B branded gifting — Sales & Marketing buyer",
    tam: "$350M",
    tamRaw: 350,
    year: "Year 2",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#a7f3d0",
    trigger: "≥3 Maya customers ask 'can I send this to clients?' → build Gifting Add-On",
    buyer: "New buyer: Marketing Ops / VP Marketing / Sales Ops",
    product: "Gifting module: send-to-address flows, per-rep spend limits, CRM sync",
    why: "Sendoso $84.8M revenue (2024, +137% YoY) validates massive demand for branded merch in B2B gifting. Branded Fit's AI brand pipeline is a genuine wedge — brand-first gifting vs. recipient-first.",
  },
  {
    id: 4,
    label: "Market 4",
    name: "Fortune 1000 HR / Total Rewards",
    subtitle: "Enterprise people programs, 1,000+ FTE",
    tam: "$200M",
    tamRaw: 200,
    year: "Year 3–4",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    trigger: "SOC 2 Type I + Enterprise tier + first $10K deal",
    buyer: "VP HR / Total Rewards Director + Procurement",
    product: "Enterprise tier ($9,600/yr), SSO/SCIM, custom brand governance",
    why: "Fortune 1000 companies spend $400–800K/yr on branded employee merchandise. AI automation displaces agency-managed programs at a fraction of the cost.",
  },
  {
    id: 5,
    label: "Market 5",
    name: "Conference & Event Organizers",
    subtitle: "Tech conferences, startup summits, corporate events",
    tam: "$75M",
    tamRaw: 75,
    year: "Year 2–3",
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#f9a8d4",
    trigger: "Opportunistic — accept inbound, no dedicated investment",
    buyer: "Event Manager / Marketing Coordinator",
    product: "Zero modification — branded storefront works for events",
    why: "$75M market of US tech event organizers. Same core product (AI brand → storefront) applied to event branding vs. company branding. Episodic buyer, so lower priority than recurring segments.",
  },
  {
    id: 6,
    label: "Market 6",
    name: "White-Label / Agency Channel",
    subtitle: "Marketing agencies + employer branding consultancies",
    tam: "$80M",
    tamRaw: 80,
    year: "Year 2–3",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#cbd5e1",
    trigger: "≥2 agency inbound requests → build Agency tier ($24K/yr)",
    buyer: "Agency principal / Client services director",
    product: "Agency tier: white-label domain, client management dashboard, agency billing",
    why: "Strategic value exceeds direct TAM. Each agency partner brings 5–20 client brands into the funnel at near-zero CAC. Amplifies reach across mid-market and Fortune 1000.",
  },
];

const TOTAL_FOLLOW_ON = 360 + 55 + 350 + 200 + 75 + 80; // 1120
const TOTAL_ALL = BEACHHEAD.tamRaw + TOTAL_FOLLOW_ON; // 1168

export default function ExpansionPage() {
  const maxBar = TOTAL_FOLLOW_ON + BEACHHEAD.tamRaw;

  return (
    <main style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>

      {/* Hero */}
      <section style={{ padding: "4.5rem 0 3rem", maxWidth: 720 }}>
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
          Market Expansion Path
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
          From $48M beachhead
          <br />
          to $1.1B+ total market.
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--text-muted)",
            marginBottom: "2rem",
            lineHeight: 1.65,
            maxWidth: 600,
          }}
        >
          Branded Fit starts with the highest-conviction niche — US Series A/B SaaS swag — then
          expands to mid-market tech, customer gifting, and global markets via explicit, trigger-gated
          milestones. The $1B+ horizon is visible in 24 months.
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
            Get started — 8 min setup →
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
            Schedule a Demo
          </Link>
        </div>
      </section>

      {/* TAM Waterfall Bar Chart */}
      <section style={{ paddingBottom: "4rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Market expansion waterfall
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
          Each bar represents the incremental addressable market added as Branded Fit crosses into the
          next segment. Markets unlock sequentially — earlier markets fund later expansion.
        </p>

        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem 2rem 1.5rem",
          }}
        >
          {/* Beachhead row */}
          <WaterfallRow
            label={BEACHHEAD.label}
            name={BEACHHEAD.name}
            tam={BEACHHEAD.tam}
            tamRaw={BEACHHEAD.tamRaw}
            maxBar={maxBar}
            color={BEACHHEAD.color}
            year={BEACHHEAD.year}
            isBeachhead
          />

          <div
            style={{
              borderTop: "1px dashed var(--border)",
              margin: "0.75rem 0",
            }}
          />

          {/* Follow-on rows */}
          {markets.map((m) => (
            <WaterfallRow
              key={m.id}
              label={m.label}
              name={m.name}
              tam={m.tam}
              tamRaw={m.tamRaw}
              maxBar={maxBar}
              color={m.color}
              year={m.year}
            />
          ))}

          {/* Total line */}
          <div
            style={{
              borderTop: "2px solid var(--text-primary)",
              marginTop: "1rem",
              paddingTop: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Total addressable market (Beachhead + all follow-on)
            </span>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              ~$1.17B/yr
            </span>
          </div>
        </div>

        <p style={{ marginTop: "0.875rem", fontSize: "0.78rem", color: "var(--text-subtle)" }}>
          Bottom-up TAM methodology. Market sizing based on PPAI 2024, Sendoso revenue disclosures,
          BDC/Dealroom VC deal flow data, and US Bureau of Labor Statistics NAICS codes. June 2026.
        </p>
      </section>

      {/* Market cards */}
      <section style={{ paddingBottom: "4rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Each market in detail
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
          Every expansion has an explicit unlock trigger — a product milestone or market signal that
          gates entry. No premature market spread.
        </p>

        {/* Beachhead card */}
        <div
          style={{
            background: "var(--primary-light)",
            border: "2px solid var(--primary)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            marginBottom: "1rem",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--primary)",
                  background: "white",
                  padding: "0.2rem 0.5rem",
                  borderRadius: 20,
                }}
              >
                Active Now
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "var(--primary)",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                Beachhead
              </span>
            </div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "0.25rem",
              }}
            >
              US Series A/B SaaS — 75–300 FTE
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-body)", lineHeight: 1.6 }}>
              People Ops Generalist (Maya Chen) at a 120-FTE remote-first SaaS company. Buys on Slack
              peer recommendation in under 14 days. $2,400/yr subscription + launch swag order.
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div
              style={{
                fontSize: "1.625rem",
                fontWeight: 800,
                color: "var(--primary)",
                lineHeight: 1,
              }}
            >
              $48M
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              TAM/yr
            </div>
          </div>
        </div>

        {/* Follow-on market cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {markets.map((m) => (
            <div
              key={m.id}
              style={{
                background: m.bg,
                border: `1px solid ${m.border}`,
                borderRadius: "var(--radius-lg)",
                padding: "1.375rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: m.color,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      marginBottom: "0.375rem",
                    }}
                  >
                    {m.label} · {m.year}
                  </div>
                  <h3
                    style={{
                      fontSize: "0.975rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      lineHeight: 1.3,
                    }}
                  >
                    {m.name}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      marginTop: "0.2rem",
                    }}
                  >
                    {m.subtitle}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "0.75rem" }}>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: m.color,
                      lineHeight: 1,
                    }}
                  >
                    {m.tam}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)", marginTop: "0.2rem" }}>
                    TAM/yr
                  </div>
                </div>
              </div>

              {/* Why section */}
              <p style={{ fontSize: "0.855rem", color: "var(--text-body)", lineHeight: 1.6 }}>
                {m.why}
              </p>

              {/* Metadata rows */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  borderTop: `1px solid ${m.border}`,
                  paddingTop: "0.875rem",
                }}
              >
                <MetaRow icon="→" label="Buyer" value={m.buyer} />
                <MetaRow icon="⚙" label="Product" value={m.product} />
                <MetaRow icon="🔓" label="Unlock trigger" value={m.trigger} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expansion timeline */}
      <section style={{ paddingBottom: "4rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          The $1B path — milestone by milestone
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
          Each market opening is tied to a product or sales milestone already in the roadmap.
          No hand-waving about "eventually we'll expand."
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            {
              phase: "Now",
              cumTam: "$48M",
              title: "Win the beachhead",
              items: [
                "Sell to 25 Maya-archetype customers at $2,400/yr",
                "Validate Printify fulfillment quality at 5+ orders/quarter per account",
                "Achieve 80% WAU on live storefronts",
              ],
              color: "var(--primary)",
            },
            {
              phase: "Year 1–2",
              cumTam: "$463M",
              title: "Mid-market + global expansion",
              items: [
                "Launch Growth tier ($4,800/yr) for 300–5,000 FTE companies",
                "Ship EUR/GBP pricing + GDPR data terms for UK/EU/CA/ANZ inbound",
                "Publish 5 mid-market logos on case study page",
              ],
              color: "#7c3aed",
            },
            {
              phase: "Year 2",
              cumTam: "$813M",
              title: "Customer gifting module",
              items: [
                "Track feature requests: 'can I send this to clients?' from existing customers",
                "Build Gifting Add-On ($1,200/yr) with send-to-address flow + CRM sync",
                "Target Marketing Ops buyer at existing accounts — expansion MRR from same logo",
              ],
              color: "#059669",
            },
            {
              phase: "Year 3–4",
              cumTam: "$1.17B",
              title: "Enterprise + platform plays",
              items: [
                "SOC 2 Type I report — unlocks Fortune 1000 procurement",
                "Agency tier ($24K/yr) — white-label for employer branding consultancies",
                "Enterprise tier ($9,600/yr) — SSO, custom brand governance, PO billing",
              ],
              color: "#d97706",
            },
          ].map((step, i) => (
            <div
              key={step.phase}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: "1.5rem",
                paddingBottom: "2rem",
                position: "relative",
              }}
            >
              {/* Timeline left */}
              <div style={{ textAlign: "right", paddingTop: "0.25rem" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: step.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {step.phase}
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginTop: "0.25rem",
                  }}
                >
                  {step.cumTam}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)" }}>cumulative TAM</div>
              </div>

              {/* Content */}
              <div
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                  borderLeft: `3px solid ${step.color}`,
                  borderRadius: "var(--radius-md)",
                  padding: "1.125rem 1.25rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.975rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.625rem",
                  }}
                >
                  {step.title}
                </h3>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.375rem",
                  }}
                >
                  {step.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-body)",
                        lineHeight: 1.55,
                        paddingLeft: "1rem",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          color: step.color,
                          fontWeight: 700,
                        }}
                      >
                        ›
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why we sequence this way */}
      <section style={{ paddingBottom: "4rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.625rem",
          }}
        >
          Why this sequence and not another
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
          The DE framework requires crossing markets in the right order — not opportunistically
          chasing every segment at once. Here&rsquo;s the reasoning behind each sequencing choice.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              title: "Mid-market before gifting",
              body: "Mid-market tech is the same buyer (People Ops), same product, higher budget. Zero product investment required. By contrast, the gifting module requires a new product build and a new buyer relationship. Go where product-market fit already exists first.",
            },
            {
              title: "Global before enterprise",
              body: "Global expansion requires only localization (currency, GDPR terms). Enterprise requires SOC 2, SSO, and 6-month procurement cycles. Global is 90% of the opportunity at 10% of the complexity — always take those deals first.",
            },
            {
              title: "Gifting before Fortune 1000",
              body: "The gifting module ($350M) validates the platform thesis — one brand engine, multiple buyer types. This de-risks the larger enterprise bet: if Marketing/Sales adopts the gifting module at beachhead accounts, the product-led expansion story is proven before we walk into Fortune 1000 procurement.",
            },
          ].map((pt) => (
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
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                {pt.title}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                {pt.body}
              </p>
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
          The beachhead is where it starts.
        </h2>
        <p
          style={{
            color: "#4b5563",
            fontSize: "0.95rem",
            maxWidth: 500,
            margin: "0 auto 1.75rem",
            lineHeight: 1.65,
          }}
        >
          Every $1B market starts with a single, well-defined niche. Branded Fit&rsquo;s is US
          Series A/B SaaS People Ops. Generate your branded storefront in 8 minutes and see why
          Maya buys on the first call.
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
            Investor demo
          </Link>
        </div>
      </section>
    </main>
  );
}

function WaterfallRow({
  label,
  name,
  tam,
  tamRaw,
  maxBar,
  color,
  year,
  isBeachhead = false,
}: {
  label: string;
  name: string;
  tam: string;
  tamRaw: number;
  maxBar: number;
  color: string;
  year: string;
  isBeachhead?: boolean;
}) {
  const pct = Math.max(4, Math.round((tamRaw / maxBar) * 100));
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "110px 1fr 64px",
        alignItems: "center",
        gap: "1rem",
        padding: "0.5rem 0",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: color,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1.2,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-body)", lineHeight: 1.3, marginTop: 2 }}>
          {name}
        </div>
        <div style={{ fontSize: "0.68rem", color: "var(--text-subtle)", marginTop: 1 }}>{year}</div>
      </div>

      <div
        style={{
          height: 22,
          background: "var(--surface)",
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${pct}%`,
            background: color,
            opacity: isBeachhead ? 1 : 0.75,
            borderRadius: 4,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <div
        style={{
          textAlign: "right",
          fontSize: "0.875rem",
          fontWeight: 700,
          color: color,
          whiteSpace: "nowrap",
        }}
      >
        {tam}
      </div>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
      <span style={{ fontSize: "0.8rem", color: "var(--text-subtle)", flexShrink: 0, marginTop: 1 }}>
        {icon}
      </span>
      <div>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}:{" "}
        </span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-body)" }}>{value}</span>
      </div>
    </div>
  );
}
