import WaitlistForm from "@/components/WaitlistForm";

export const metadata = {
  title: "Join the Waitlist — Branded Fit",
  description: "Join the Branded Fit early access waitlist. Get notified when your spot is ready.",
};

export default function WaitlistPage() {
  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "4rem 1.5rem 5rem" }}>
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "0.625rem",
            color: "var(--text-primary)",
          }}
        >
          Join the Waitlist
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>
          We&apos;re rolling out Branded Fit access in batches. Drop your name and work email and we&apos;ll reach out when your spot is ready.
        </p>
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <WaitlistForm />
      </div>

      <p
        style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.85rem",
          color: "var(--text-subtle)",
        }}
      >
        No spam. We&apos;ll only email you when your spot is confirmed.
      </p>
    </main>
  );
}
