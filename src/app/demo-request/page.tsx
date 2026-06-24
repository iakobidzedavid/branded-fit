import DemoRequestForm from "@/components/DemoRequestForm";

export const metadata = {
  title: "Request a Demo — Branded Fit",
  description: "Request a personalized Branded Fit walkthrough. We'll email you a storefront demo built from your company's brand within 24 hours.",
};

export default function DemoRequestPage() {
  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "4rem 1.5rem 5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "0.625rem",
            color: "var(--text-primary)",
          }}
        >
          Request a Demo
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>
          Fill in your details and we&apos;ll email you a personalized storefront walkthrough — built from your company&apos;s brand — within 24 hours. No call required.
        </p>
      </div>

      <div
        style={{
          background: "var(--primary)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
        }}
      >
        <DemoRequestForm />
      </div>
    </main>
  );
}
