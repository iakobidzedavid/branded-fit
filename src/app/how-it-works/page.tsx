import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branded Fit — How It Works: From Discovery to Live Storefront in 14 Days",
  description:
    "See exactly how your team goes from first hearing about Branded Fit to a live branded storefront with employees ordering — in as little as 14 days.",
};

const stages = [
  {
    day: "Day 0",
    label: "You discover Branded Fit",
    who: "Maya (People Ops)",
    duration: "5 minutes",
    description:
      "A colleague mentions it in Slack, or you find it through a Google search. You click the link, land on the homepage, and see the headline: 'Your brand on merch in 8 minutes.'",
    action: "Paste your company domain on the homepage",
    approvals: "None",
    color: "var(--primary)",
  },
  {
    day: "Day 0",
    label: "AI generates your branded storefront",
    who: "Maya (People Ops)",
    duration: "8 minutes",
    description:
      "Branded Fit reads your domain, extracts your brand colors, logo, and identity, and builds a live storefront with 8–12 curated products — all in your brand. You see your company name on a hoodie before the coffee finishes brewing.",
    action: "Review the AI-generated storefront. Edit any product in 2 clicks.",
    approvals: "None",
    color: "var(--primary)",
  },
  {
    day: "Day 1–3",
    label: "You share it with your Head of People",
    who: "Maya → Head of People",
    duration: "1–3 days",
    description:
      "You send a shareable preview link to your Head of People (and optionally your brand team for a quick brand check). The link shows the live storefront — no login required for reviewers.",
    action: "Share the /for-your-boss brief + preview link via Slack",
    approvals: "Head of People reviews: ~15 minutes",
    color: "#7c3aed",
  },
  {
    day: "Day 3–7",
    label: "Your Head of People approves",
    who: "Head of People",
    duration: "1–4 days",
    description:
      "At $200/mo, most Heads of People approve via Slack in under 24 hours — no PO, no procurement process. Your team charges the corporate card and you're live. Larger teams (150+ FTE) sometimes run a quick Finance review; we have a one-page security brief ready.",
    action: "Head of People gives Slack approval or signs off on CC",
    approvals: "Head of People sign-off (typically async, no meeting required)",
    color: "#7c3aed",
  },
  {
    day: "Day 7",
    label: "Subscribe and finalize your storefront",
    who: "Maya",
    duration: "20 minutes",
    description:
      "You subscribe at $200/mo (no annual commitment required). Within 10 minutes, your storefront is finalized with your brand. A member of our team checks in within 4 hours to make sure everything looks right before you share with employees.",
    action: "Complete checkout → storefront goes live",
    approvals: "None additional",
    color: "var(--accent)",
  },
  {
    day: "Day 7–10",
    label: "Announce to your team via Slack",
    who: "Maya",
    duration: "5 minutes",
    description:
      "Post the storefront link in your company #general or #swag channel with the Slack template we provide. Employees click, see their own brand on real products, and start ordering. No IT setup, no inventory to manage.",
    action: "Post Slack announcement with storefront link",
    approvals: "None",
    color: "var(--accent)",
  },
  {
    day: "Day 14",
    label: "First orders fulfilled. Team loves it.",
    who: "Your whole team",
    duration: "Ongoing",
    description:
      "Branded Fit handles all fulfillment — printing, shipping, tracking. Your employees get on-brand merch delivered to their doors. You see the redemption rate rise from 55% to 85%+. Your Head of People looks smart for approving it.",
    action: "Monitor orders from your Branded Fit dashboard",
    approvals: "None",
    color: "var(--accent)",
  },
];

const approvalFAQ = [
  {
    q: "Does $200/mo need procurement approval?",
    a: "At most Series A/B companies, $200/mo is within a People Ops team's operational budget — charged to a corporate card with a Slack message to your manager. No PO, no vendor onboarding form, no IT ticket. We made it this way on purpose.",
  },
  {
    q: "What about the first launch order?",
    a: "Your first launch order (employees buying merch) passes through your Shopify store — you own it. Order values depend on how many employees participate. Typical first orders range from $1,500–$4,000. Branded Fit never touches your payment; orders are fulfilled by Printify and charged to the employee or expensed per your company policy.",
  },
  {
    q: "What if Finance needs a security review?",
    a: "We're ready. We have a one-page security brief (SOC 2 attestation, data residency, GDPR compliance, cancellation terms) that answers every Finance question before they ask it. Most CC-paying customers never need this. If you do, we send it within the hour.",
  },
  {
    q: "Can I start without an annual commitment?",
    a: "Yes. $200/mo, cancel anytime, no annual lock-in. We're confident you'll stick around once your team sees the redemption rate — but we don't need a 12-month contract to prove it.",
  },
];

const stats = [
  { value: "8 min", label: "Domain to live storefront" },
  { value: "14 days", label: "Median time to first paid order" },
  { value: "$200/mo", label: "Subscription — no PO required" },
  { value: "85%+", label: "Employee redemption rate" },
];

export default function HowItWorksPage() {
  return (
    <main
      style={{
        maxWidth: "var(--max-width)",
        margin: "0 auto",
        padding: "0 1.5rem 5rem",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          padding: "1.25rem 0 0",
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <span>Branded Fit</span>
        <span style={{ color: "var(--border)" }}>›</span>
        <span>How It Works</span>
      </div>

      {/* Hero */}
      <section style={{ padding: "3rem 0 3.5rem", maxWidth: 680 }}>
        <div
          style={{
            display: "inline-block",
            padding: "0.3rem 0.875rem",
            background: "var(--primary-light)",
            color: "var(--primary)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            marginBottom: "1.25rem",
            letterSpacing: "0.01em",
          }}
        >
          From discovery to live storefront
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
            color: "var(--text-primary)",
          }}
        >
          Discovery to first order:{" "}
          <span style={{ color: "var(--primary)" }}>14 days.</span>
          <br />
          No IT ticket. No procurement. No agency back-and-forth.
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.65,
            color: "var(--text-body)",
            marginBottom: "2rem",
          }}
        >
          Here is exactly how your team goes from &ldquo;I just heard about
          this&rdquo; to employees ordering branded merch — with every approval
          step, timeline, and decision mapped out.
        </p>

        <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
          <Link
            href="/try"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.75rem 1.5rem",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "0.9375rem",
            }}
          >
            Generate your storefront now →
          </Link>
          <Link
            href="/for-your-boss"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.75rem 1.5rem",
              background: "var(--surface)",
              color: "var(--text-primary)",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.9375rem",
              border: "1px solid var(--border)",
            }}
          >
            Share with your Head of People
          </Link>
        </div>
      </section>

      {/* Stats row */}
      <section style={{ marginBottom: "4rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.375rem 1.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "var(--primary)",
                  letterSpacing: "-0.03em",
                  marginBottom: "0.25rem",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Journey timeline */}
      <section style={{ marginBottom: "5rem" }}>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
            color: "var(--text-primary)",
          }}
        >
          The full journey — every step, every approval
        </h2>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--text-muted)",
            marginBottom: "2.5rem",
          }}
        >
          No surprises. Here&apos;s exactly what happens and who does what.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
            position: "relative",
          }}
        >
          {stages.map((stage, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: "1.5rem",
                marginBottom: i < stages.length - 1 ? "0" : "0",
              }}
            >
              {/* Day label + connector */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: "1.25rem",
                }}
              >
                <div
                  style={{
                    background: stage.color,
                    color: "white",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.3rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    marginBottom: "0.5rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {stage.day}
                </div>
                {i < stages.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: "var(--border)",
                      minHeight: 24,
                    }}
                  />
                )}
              </div>

              {/* Card */}
              <div
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.375rem 1.5rem",
                  marginBottom: i < stages.length - 1 ? "1rem" : "0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "0.625rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {stage.label}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.2rem 0.6rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {stage.duration}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    marginBottom: "1rem",
                  }}
                >
                  {stage.description}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      background: "var(--surface)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.625rem 0.875rem",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        display: "block",
                        marginBottom: "0.2rem",
                      }}
                    >
                      Your action
                    </span>
                    <span style={{ color: "var(--text-body)" }}>{stage.action}</span>
                  </div>
                  <div
                    style={{
                      background:
                        stage.approvals === "None"
                          ? "var(--accent-bg)"
                          : "var(--primary-light)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.625rem 0.875rem",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color:
                          stage.approvals === "None"
                            ? "var(--accent-text)"
                            : "var(--primary)",
                        display: "block",
                        marginBottom: "0.2rem",
                      }}
                    >
                      Approvals required
                    </span>
                    <span
                      style={{
                        color:
                          stage.approvals === "None"
                            ? "var(--accent-text)"
                            : "var(--text-body)",
                      }}
                    >
                      {stage.approvals === "None" ? "✓ None" : stage.approvals}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "0.75rem",
                    color: "var(--text-subtle)",
                  }}
                >
                  {stage.who}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Approval FAQ */}
      <section style={{ marginBottom: "5rem" }}>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
            color: "var(--text-primary)",
          }}
        >
          Approval questions — answered before you need to ask
        </h2>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--text-muted)",
            marginBottom: "2rem",
          }}
        >
          We built Branded Fit to fit how People Ops teams actually buy software.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {approvalFAQ.map((item, i) => (
            <div
              key={i}
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.375rem 1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                {item.q}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.65,
                }}
              >
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Share strip */}
      <section
        style={{
          background: "var(--primary-light)",
          border: "1px solid #c7d2fe",
          borderRadius: "var(--radius-lg)",
          padding: "2rem 2.5rem",
          marginBottom: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "var(--primary)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.375rem",
            }}
          >
            Share this with your Head of People
          </div>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-body)",
              margin: 0,
              maxWidth: 520,
              lineHeight: 1.55,
            }}
          >
            We wrote a 2-minute ROI brief specifically for Heads of People and VP People —
            built to answer every question they&apos;ll have before they ask it.
          </p>
        </div>
        <Link
          href="/for-your-boss"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.75rem 1.5rem",
            background: "var(--primary)",
            color: "white",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            fontSize: "0.9375rem",
            whiteSpace: "nowrap",
          }}
        >
          Read the brief →
        </Link>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "3rem 1rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <h2
          style={{
            fontSize: "1.625rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "0.75rem",
            color: "var(--text-primary)",
          }}
        >
          Ready to start the 14-day journey?
        </h2>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-muted)",
            marginBottom: "2rem",
            maxWidth: 480,
            margin: "0 auto 2rem",
          }}
        >
          Paste your company domain and see your branded storefront in under 10
          minutes — free, no credit card, no IT ticket.
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
            href="/try"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.875rem 1.75rem",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Generate my storefront →
          </Link>
          <Link
            href="/demo"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.875rem 1.75rem",
              background: "white",
              color: "var(--text-primary)",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "1rem",
              border: "1px solid var(--border)",
            }}
          >
            Book a 15-minute demo
          </Link>
        </div>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-subtle)",
            marginTop: "1rem",
          }}
        >
          $200/mo · No annual commitment · Cancel anytime
        </p>
      </section>
    </main>
  );
}
