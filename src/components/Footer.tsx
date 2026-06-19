import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare" },
  { href: "/roi-calculator", label: "ROI Calculator" },
  { href: "/get-started", label: "How It Works" },
  { href: "/demo", label: "Get a Demo" },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "3rem 1.5rem 2rem",
        marginTop: "4rem",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: "1.05rem",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          Branded Fit
        </span>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            maxWidth: 400,
            lineHeight: 1.65,
          }}
        >
          Your brand, automated. On-brand swag storefronts for forward-thinking teams, live in 8 minutes.
        </p>
        <nav
          style={{
            display: "flex",
            gap: "0.25rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-subtle)",
            paddingTop: "0.5rem",
            borderTop: "1px solid var(--border)",
            width: "100%",
            maxWidth: 400,
          }}
        >
          © 2026 Branded Fit. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
