import Link from "next/link";

const navLinks = [
  { href: "/try", label: "Try It" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare" },
  { href: "/roi-calculator", label: "ROI Calculator" },
  { href: "/for-your-boss", label: "For Your Boss" },
  { href: "/true-cost", label: "True Cost" },
];

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 800,
            fontSize: "1.1rem",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          Branded Fit
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.125rem",
            flexWrap: "wrap",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.5rem 0.875rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--text-muted)",
                borderRadius: "var(--radius-md)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/demo"
            style={{
              marginLeft: "0.625rem",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "white",
              background: "var(--primary)",
              borderRadius: "var(--radius-md)",
              whiteSpace: "nowrap",
            }}
          >
            Get a Demo →
          </Link>
        </nav>
      </div>
    </header>
  );
}
