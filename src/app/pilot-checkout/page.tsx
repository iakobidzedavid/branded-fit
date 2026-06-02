import Link from "next/link";

export default function PilotCheckout() {
  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">Brand Drop Pilot</h1>
        <p className="text-xl text-text-muted mb-8">
          Start your $4,800 pilot to launch custom branded apparel for your team.
        </p>

        <div className="bg-surface p-8 rounded-lg border border-border mb-8">
          <p className="text-lg text-text mb-4">
            Pilot includes:
          </p>
          <ul className="text-left text-text-muted space-y-3 mb-6">
            <li>✓ Brand extraction & AI-powered design</li>
            <li>✓ 3 SKUs (hoodie, water bottle, sticker)</li>
            <li>✓ Up to 2 design revisions</li>
            <li>✓ Shopify store setup</li>
            <li>✓ 200 units starter inventory</li>
          </ul>
          <p className="text-2xl font-bold text-accent">$4,800</p>
        </div>

        <Link
          href="/"
          className="inline-block px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
