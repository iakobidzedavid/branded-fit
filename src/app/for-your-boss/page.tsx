import Link from "next/link";
import type { Metadata } from "next";
import BossEmailGenerator from "@/components/BossEmailGenerator";

export const metadata: Metadata = {
  title: "Branded Fit — For People Leaders: The Case for Branded Fit",
  description:
    "A quick brief for Heads of People and VP People evaluating Branded Fit. ROI, risk, and what your team will be able to do on Day 1.",
};

const roiRows = [
  {
    before: "8–12 hrs per swag cycle",
    after: "< 30 min per swag cycle",
    line: "Time spent on swag logistics",
  },
  {
    before: "55% employee redemption rate",
    after: "85% employee redemption rate",
    line: "Employees who actually use their swag",
  },
  {
    before: "$6K–$12K / yr (SwagUp)",
    after: "$2,400 / yr flat",
    line: "Annual platform cost",
  },
  {
    before: "2–4 weeks to launch",
    after: "8 minutes to first live storefront",
    line: "Time from idea to orderable link",
  },
];

const objections = [
  {
    q: "Will our brand actually look right?",
    a: "Branded Fit pulls your logo, colors, and fonts from your domain and applies them to every product mockup. Your team reviews the AI-generated storefront before any orders are placed — edit any product in two clicks.",
  },
  {
    q: "Is employee data safe?",
    a: "Employee data (names, shipping addresses) stays within your Shopify store, which you own. Branded Fit never stores personal employee data on our servers. We're SOC 2 compliant and GDPR-ready.",
  },
  {
    q: "What happens if we want to cancel?",
    a: "Cancel anytime — no annual lock-in required. Your storefront and order history export in one click. No vendor migration pain.",
  },
  {
    q: "Does this require IT or procurement involvement?",
    a: "At $200/mo, most People Ops teams approve this with a corporate card — no PO required. IT review: we have a one-page integration brief and SOC 2 attestation ready for any security review.",
  },
  {
    q: "How long does onboarding take?",
    a: "Your People Ops team will have a live, orderable branded storefront within 8 minutes of entering your domain. Full onboarding (storefront review, first order placed, team Slack announcement) typically completes within 48 hours.",
  },
];

export default async function ForYourBossPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string; company?: string }>;
}) {
  const params = await searchParams;
  const prefilledCompany = params.company ?? "";
  return (
    <main
      style={{
        maxWidth: "var(--max-width)",
        margin: "0 auto",
        padding: "0 1.5rem 5rem",
      }}
    >
      {/* Breadcrumb / context strip */}
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
        <span>Shared by your People Ops team</span>
        <span style={{ color: "var(--border)" }}>·</span>
        <span>2-minute read for People Leaders</span>
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
          For Heads of People &amp; VP People
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
          Your team found a way to get&nbsp;
          <span style={{ color: "var(--primary)" }}>44 hours/year back</span>
          &nbsp;and&nbsp;triple swag ROI.
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.65,
            color: "var(--text-body)",
            marginBottom: "2rem",
          }}
        >
          Branded Fit turns your company domain into a live, on-brand swag
          storefront in under 10 minutes — no design team, no agency, no
          multi-week back-and-forth. Your People Ops team thinks it's worth a
          look. Here's the two-minute brief.
        </p>

        <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
          <a
            href="#email-generator"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.75rem 1.5rem",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              textDecoration: "none",
            }}
          >
            Request an email walkthrough →
          </a>
          <Link
            href="/roi-calculator"
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
            Calculate your ROI
          </Link>
        </div>
      </section>

      {/* Email generator — moved above the fold so it's immediately reachable */}
      <section id="email-generator" style={{ marginBottom: "4rem" }}>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
            color: "var(--text-primary)",
          }}
        >
          Send your People Leader a 60-second brief
        </h2>
        <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", marginBottom: "0" }}>
          Fill in your boss&apos;s email — we&apos;ll send a personalized note directly to them.
        </p>
        <BossEmailGenerator defaultCompany={prefilledCompany} />
      </section>

      {/* The headline numbers */}
      <section style={{ marginBottom: "5rem" }}>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
            color: "var(--text-primary)",
          }}
        >
          Before &amp; after — on the metrics you care about
        </h2>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              borderBottom: "1px solid var(--border)",
              background: "white",
            }}
          >
            {["", "Without Branded Fit", "With Branded Fit"].map((col, i) => (
              <div
                key={i}
                style={{
                  padding: "0.875rem 1.25rem",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: i === 2 ? "var(--primary)" : "var(--text-muted)",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                }}
              >
                {col}
              </div>
            ))}
          </div>

          {roiRows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                borderBottom:
                  i < roiRows.length - 1 ? "1px solid var(--border)" : "none",
                background: i % 2 === 0 ? "white" : "var(--surface)",
              }}
            >
              <div
                style={{
                  padding: "1rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--text-body)",
                }}
              >
                {row.line}
              </div>
              <div
                style={{
                  padding: "1rem 1.25rem",
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  borderLeft: "1px solid var(--border)",
                }}
              >
                {row.before}
              </div>
              <div
                style={{
                  padding: "1rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "var(--accent-text)",
                  background: "var(--accent-bg)",
                  borderLeft: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                <span style={{ color: "var(--accent)" }}>✓</span>
                {row.after}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-subtle)",
            marginTop: "0.75rem",
          }}
        >
          Based on a 120-FTE Series A/B company running 4 swag cycles per year. See{" "}
          <Link
            href="/roi-calculator"
            style={{ color: "var(--primary)", fontWeight: 600 }}
          >
            the full ROI model →
          </Link>
        </p>
      </section>

      {/* How it works — 3 steps */}
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
          How it works — three steps, 8 minutes
        </h2>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--text-muted)",
            marginBottom: "2rem",
          }}
        >
          Your People Ops team does this. No IT ticket required.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {[
            {
              step: "01",
              title: "Paste your domain",
              body: "AI extracts your brand colors, logo, and identity from your company website. Nothing to upload or configure.",
            },
            {
              step: "02",
              title: "Review AI-curated storefront",
              body: "Branded Fit selects 8–12 quality-scored products and applies your brand to every mockup. Your team edits in two clicks before any orders are placed.",
            },
            {
              step: "03",
              title: "Share the Slack link",
              body: "Employees get a link to the storefront. They pick what they want. Branded Fit handles fulfillment — no inventory, no 3PL, no shipping logistics.",
            },
          ].map((item) => (
            <div
              key={item.step}
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
                  letterSpacing: "0.1em",
                  color: "var(--primary)",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                Step {item.step}
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "var(--text-primary)",
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Objection handler */}
      <section style={{ marginBottom: "5rem" }}>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
            color: "var(--text-primary)",
          }}
        >
          Common questions from People Leaders
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {objections.map((item, i) => (
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
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.65 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing callout */}
      <section
        style={{
          background: "var(--primary-light)",
          border: "1px solid #c7d2fe",
          borderRadius: "var(--radius-lg)",
          padding: "2rem 2.5rem",
          marginBottom: "5rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 260 }}>
          <div
            style={{
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "var(--primary)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.5rem",
            }}
          >
            Pricing — no surprises
          </div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: "0.25rem",
            }}
          >
            $200/mo
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              marginBottom: "1rem",
            }}
          >
            Flat subscription · No per-seat fees · No hidden order markups
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            {[
              "Cancel anytime — no annual commitment required",
              "No procurement process needed at $200/mo",
              "Typically approved same-day with a corporate card",
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  color: "var(--text-body)",
                }}
              >
                <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "1.25rem 1.5rem",
            minWidth: 220,
          }}
        >
          <div
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              marginBottom: "0.25rem",
            }}
          >
            vs. SwagUp
          </div>
          <div
            style={{
              fontSize: "1.375rem",
              fontWeight: 800,
              color: "var(--danger)",
              letterSpacing: "-0.02em",
              textDecoration: "line-through",
              marginBottom: "0.25rem",
            }}
          >
            $11,988+/yr
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            Branded Fit saves your team
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
              {" "}$9,588/yr{" "}
            </span>
            vs. the next closest platform.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "3rem 1rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          marginBottom: "2rem",
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
          Ready to see it on your brand?
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
          We'll generate a live branded storefront from your company domain —
          free, no credit card, in the next 5 minutes.
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.875rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#email-generator"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.875rem 1.75rem",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            Request an email walkthrough →
          </a>
          <Link
            href="/try"
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
            Try it now — free
          </Link>
        </div>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-subtle)",
            marginTop: "1rem",
          }}
        >
          No procurement required · $200/mo · Cancel anytime
        </p>
      </section>
    </main>
  );
}
