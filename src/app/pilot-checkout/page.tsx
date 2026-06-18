import Link from "next/link";

export default function PilotCheckout() {
  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">Brand Drop Pilot</h1>
        <p className="text-xl text-text-muted mb-8">
          Our team will work with you to launch custom branded apparel for your team.
        </p>

        <div className="bg-surface p-8 rounded-lg border border-border mb-8">
          <p className="text-lg text-text mb-4">
            Your $4,800 pilot includes:
          </p>
          <ul className="text-left text-text-muted space-y-3 mb-6">
            <li>✓ Brand extraction & AI-powered design</li>
            <li>✓ 3 SKUs (hoodie, water bottle, sticker)</li>
            <li>✓ Up to 2 design revisions (with a specialist)</li>
            <li>✓ Shopify store setup (human-assisted)</li>
            <li>✓ 200 units starter inventory</li>
          </ul>
          <p className="text-text-muted text-sm mb-4">
            A Branded Fit specialist will guide you through the entire process.
          </p>
          <p className="text-2xl font-bold text-accent">$4,800</p>
        </div>

        <div className="mb-8">
          <p className="text-text-muted mb-4">
            Next, a member of our team will contact you to confirm details and get started.
          </p>
          <p className="text-sm text-text-muted mb-6">
            Check your email for a confirmation within 24 hours.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block px-8 py-4 bg-surface border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
