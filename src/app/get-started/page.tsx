import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Share your domain",
    description:
      "Tell us your company domain and we pull your brand identity automatically — colors, fonts, logo, and tone. If you have a brand guide, you can attach it too.",
    detail: "Done at signup. Takes 2 minutes.",
    icon: "🌐",
  },
  {
    number: "02",
    title: "Review your brand profile",
    description:
      "Within 4 hours, we send you a one-page AI-generated brand profile — the palette, product aesthetic, and catalog direction our AI will use. You approve or tweak it.",
    detail: "Delivered within 4 hours of payment.",
    icon: "🎨",
  },
  {
    number: "03",
    title: "Approve your product catalog",
    description:
      "Within 24 hours, we hand-select 8–12 products from our 120-SKU Printify library that match your brand profile. You see visuals of each item mocked up in your colors. You approve, swap, or adjust.",
    detail: "Delivered within 24 hours. 1 revision round included.",
    icon: "👕",
  },
  {
    number: "04",
    title: "Your storefront goes live",
    description:
      "Within 48 hours of payment, your branded Shopify storefront is live with a shareable URL. We walk you through it on a 30-minute call and set up your Printify fulfillment so orders ship directly to your team.",
    detail: "Live within 48 hours. Walkthrough call included.",
    icon: "🚀",
  },
];

const includes = [
  "AI brand profile extracted from your domain",
  "8–12 curated products from 120-SKU Printify library",
  "Live Shopify storefront in your brand colors",
  "Printify fulfillment integration (ships directly to your team)",
  "Shareable storefront URL — send to your team on Day 1",
  "30-minute founder onboarding call",
  "Day-7 check-in call (15 min)",
  "Day-30 redemption report",
  "Email support (48-hr response SLA)",
];

const faqs = [
  {
    q: "Do I need a Shopify account?",
    a: "No. We provision and manage the Shopify storefront on your behalf. You get a shareable URL to send your team — no technical setup on your end.",
  },
  {
    q: "What if I don't like the product selection?",
    a: "You get one revision round after we share the catalog (step 03). In practice, the AI curation lands close enough that most teams approve with minor swaps. We will not launch until you're happy.",
  },
  {
    q: "How do my employees order?",
    a: "They visit the storefront URL and order directly. Orders are fulfilled via Printify and shipped to each person's address. Zero inventory you need to manage.",
  },
  {
    q: "What does $2,400/yr actually cover?",
    a: "The platform subscription. Merchandise is priced at Printify's production cost — we add zero markup. Most teams spend $500–$2,000 on their first launch order depending on team size.",
  },
  {
    q: "Can I start before my company's renewal date?",
    a: "Yes. The $2,400/yr subscription starts on the day your storefront goes live. You can time it to align with a budget cycle — just let us know at the kickoff call.",
  },
];

export default function GetStartedPage() {
  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        maxWidth: 820,
        margin: "0 auto",
      }}
    >
      {/* Breadcrumb */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/"
          style={{ color: "#4f46e5", fontSize: "0.875rem", textDecoration: "none" }}
        >
          ← Branded Fit
        </Link>
      </div>

      {/* Hero */}
      <div style={{ marginBottom: "3.5rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            color: "#111827",
            marginBottom: "0.75rem",
            lineHeight: 1.15,
          }}
        >
          Your storefront in 48 hours.
          <br />
          Here&apos;s exactly how it works.
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#4b5563",
            maxWidth: 560,
            lineHeight: 1.65,
            marginBottom: "1.75rem",
          }}
        >
          Branded Fit is a concierge service. You pay once, we do the setup.
          No Shopify expertise, no catalog browsing, no design work — just a
          live, on-brand swag storefront your team can order from in 48 hours.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
            }}
          >
            Book a kickoff call →
          </Link>
          <Link
            href="/pricing"
            style={{
              display: "inline-block",
              padding: "0.875rem 1.5rem",
              background: "white",
              color: "#4f46e5",
              border: "2px solid #4f46e5",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            See pricing
          </Link>
        </div>
      </div>

      {/* Timeline steps */}
      <section style={{ marginBottom: "4rem" }}>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "2rem",
          }}
        >
          The 4-step concierge process
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                display: "flex",
                gap: "1.5rem",
                paddingBottom: i < steps.length - 1 ? "2rem" : 0,
                position: "relative",
              }}
            >
              {/* Left: number + connector */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#eef2ff",
                    border: "2px solid #4f46e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    flexShrink: 0,
                  }}
                >
                  {step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: "#e5e7eb",
                      marginTop: 8,
                      marginBottom: 0,
                      minHeight: 32,
                    }}
                  />
                )}
              </div>

              {/* Right: content */}
              <div style={{ paddingTop: "0.625rem" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#4f46e5",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: "0.25rem",
                  }}
                >
                  Step {step.number}
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: "0.5rem",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    marginBottom: "0.5rem",
                  }}
                >
                  {step.description}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 6,
                    padding: "0.25rem 0.625rem",
                    fontSize: "0.78rem",
                    color: "#15803d",
                    fontWeight: 600,
                  }}
                >
                  {step.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "2rem",
          marginBottom: "3.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "1.25rem",
          }}
        >
          What&apos;s included at $2,400/yr
        </h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
          }}
        >
          {includes.map((item) => (
            <li
              key={item}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.625rem",
                fontSize: "0.9rem",
                color: "#374151",
              }}
            >
              <span style={{ color: "#16a34a", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p
          style={{
            marginTop: "1.25rem",
            fontSize: "0.8rem",
            color: "#9ca3af",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "1rem",
          }}
        >
          Merchandise is billed separately at Printify&apos;s production cost — no markup, ever.
          Most teams spend $500–$2,000 on their first launch order.
        </p>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "1.5rem",
          }}
        >
          Common questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {faqs.map((faq) => (
            <div key={faq.q}>
              <p
                style={{
                  fontWeight: 600,
                  color: "#111827",
                  fontSize: "0.9rem",
                  marginBottom: "0.375rem",
                }}
              >
                {faq.q}
              </p>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          background: "#eef2ff",
          borderRadius: 12,
          padding: "2.5rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "0.75rem",
          }}
        >
          Ready to launch your swag program?
        </h2>
        <p
          style={{
            color: "#4b5563",
            fontSize: "0.95rem",
            marginBottom: "1.75rem",
            maxWidth: 440,
            margin: "0 auto 1.75rem",
          }}
        >
          Book a 30-minute kickoff call. We&apos;ll confirm your brand profile and
          have your storefront live within 48 hours.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
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
            }}
          >
            Book a kickoff call →
          </Link>
          <Link
            href="/pricing"
            style={{
              display: "inline-block",
              padding: "0.875rem 1.5rem",
              background: "white",
              color: "#4f46e5",
              border: "2px solid #4f46e5",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Review pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
