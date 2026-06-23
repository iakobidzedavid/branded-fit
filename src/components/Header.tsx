"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/try", label: "Try It" },
  { href: "/roi-report", label: "ROI Report" },
  { href: "/assessment", label: "Health Check" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/for-your-boss", label: "For Your Boss" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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

        {/* Desktop nav */}
        <nav
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.125rem",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.5rem 0.75rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--text-muted)",
                borderRadius: "var(--radius-md)",
                whiteSpace: "nowrap",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/pilot"
            style={{
              marginLeft: "0.5rem",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "white",
              background: "var(--primary)",
              borderRadius: "var(--radius-md)",
              whiteSpace: "nowrap",
            }}
          >
            Start Pilot →
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            display: "none",
            background: "none",
            border: "none",
            padding: "0.5rem",
            cursor: "pointer",
            color: "var(--text-primary)",
            flexShrink: 0,
          }}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{
            display: "none",
            position: "absolute",
            top: 64,
            left: 0,
            right: 0,
            background: "white",
            borderBottom: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
            padding: "1rem 1.5rem 1.5rem",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "0.75rem 0.875rem",
                fontSize: "0.95rem",
                fontWeight: 500,
                color: "var(--text-body)",
                borderRadius: "var(--radius-md)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/pilot"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              marginTop: "0.75rem",
              padding: "0.875rem 1rem",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "white",
              background: "var(--primary)",
              borderRadius: "var(--radius-md)",
              textAlign: "center",
            }}
          >
            Start Pilot →
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
