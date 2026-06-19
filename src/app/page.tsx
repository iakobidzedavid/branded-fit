import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
        Branded Fit
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        Branded apparel that works as hard as your team.
      </p>

      <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link
          href="/roi-calculator"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            background: "#4f46e5",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          ROI Calculator →
        </Link>
      </nav>
    </main>
  );
}
