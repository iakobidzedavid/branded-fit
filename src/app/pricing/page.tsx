import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

const TIERS = [
  {
    name: "Brand Drop Pilot",
    price: "$4,800",
    period: "one-time",
    description: "Validate Branded Fit risk-free. 50-unit branded kit delivered in 14 days. Applies toward annual Growth tier if you convert.",
    features: [
      "50-unit custom branded kit",
      "14-day delivery SLA",
      "Full storefront provisioning",
      "95%+ brand-fidelity guarantee†",
      "3 product types (tee, hoodie, tote)",
      "Automated brand extraction",
    ],
    cta: "Start Pilot",
    href: "/command-console",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$24K",
    period: "/ year",
    description: "For ops and people teams managing swag programs at companies with 200–1,000 FTE. Most common tier in our early access cohort.",
    features: [
      "Fully provisioned Shopify storefront",
      "12 core product types",
      "On-demand print fulfillment",
      "14-day median delivery",
      "Brand-fidelity QA on every run",
      "Storefront admin access",
      "No per-order platform fees",
    ],
    cta: "Launch Free Brand Preview",
    href: "/command-console",
    highlight: true,
  },
  {
    name: "Scale / Enterprise",
    price: "Custom",
    period: "",
    description: "For larger teams or companies with complex brand systems, custom catalogs, or dedicated support requirements. Contact us.",
    features: [
      "Everything in Growth",
      "Custom product catalog",
      "Dedicated brand review support",
      "SLA-backed QA turnaround",
      "SSO and team management",
      "Invoicing and custom billing",
    ],
    cta: "Request Early Access",
    href: "/command-console",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <nav className="bg-surface border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-text">
            Branded Fit
          </Link>
          <Link
            href="/command-console"
            className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-purple-600 transition"
          >
            Launch Free Brand Preview
          </Link>
        </div>
      </nav>

      <main className="flex-1 px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-text-muted text-lg max-w-xl mx-auto">
              Start with a no-risk pilot. Upgrade when you see the results.
            </p>
            <p className="text-text-muted text-xs mt-4 border border-border bg-surface rounded-lg px-4 py-2 max-w-lg mx-auto">
              We are actively validating pricing tiers through discovery calls with ops and people teams at Series B–D companies. Prices shown reflect our early access cohort program (Q1–Q2 2026).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-8 flex flex-col ${
                  tier.highlight
                    ? "bg-accent/10 border-accent/40"
                    : "bg-surface border-border"
                }`}
              >
                {tier.highlight && (
                  <span className="text-xs bg-accent/20 text-accent border border-accent/30 rounded-full px-3 py-1 font-semibold self-start mb-4">
                    Most popular
                  </span>
                )}
                <h2 className="text-xl font-bold text-text mb-1">{tier.name}</h2>
                <div className="flex items-baseline gap-1 mb-3">
                  <span
                    className={`text-4xl font-bold ${
                      tier.highlight ? "text-accent" : "text-text"
                    }`}
                  >
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-text-muted text-sm">{tier.period}</span>
                  )}
                </div>
                <p className="text-text-muted text-sm mb-6 leading-relaxed">
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-text-muted">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold transition text-sm ${
                    tier.highlight
                      ? "bg-accent text-white hover:bg-purple-600"
                      : "bg-bg border border-border text-text hover:bg-border/30"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto bg-surface border border-border rounded-lg px-5 py-4">
            <p className="text-text-muted text-xs text-center leading-relaxed">
              <span className="font-semibold text-text-muted">† Methodology:</span> Brand-fidelity score = % of product mockups passing automated QA on first pass without manual revision. Measured on internal pilot cohort (n=5 companies, 200–1,000 FTE, Q1–Q2 2026). Small sample; findings directional. Case studies in progress.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-surface border-t border-border px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-text">Branded Fit</span>
          <p className="text-text-muted text-sm">
            © 2026 Branded Fit, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-text-muted">
            <Link href="/" className="hover:text-text transition">
              Home
            </Link>
            <Link href="/command-console" className="hover:text-text transition">
              Command Console
            </Link>
            <a href="/#faq" className="hover:text-text transition">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
