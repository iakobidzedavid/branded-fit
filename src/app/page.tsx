"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  Palette,
  Package,
  X,
  Star,
} from "lucide-react";

const FTE_TIERS = [
  {
    label: "200 FTE",
    fte: 200,
    annualValue: 19000,
    hoursSaved: 30,
    events: 4,
  },
  {
    label: "500 FTE",
    fte: 500,
    annualValue: 47000,
    hoursSaved: 68,
    events: 9,
  },
  {
    label: "1,000 FTE",
    fte: 1000,
    annualValue: 94000,
    hoursSaved: 120,
    events: 16,
  },
] as const;

const PLAN_PRICE = 24000;

const COMPETITORS = [
  {
    name: "Branded Fit",
    speed: "10 minutes",
    fidelity: "95%+ automated",
    noMOQ: true,
    automatedQA: true,
    highlight: true,
  },
  {
    name: "SwagUp",
    speed: "4–6 weeks",
    fidelity: "Manual upload",
    noMOQ: false,
    automatedQA: false,
    highlight: false,
  },
  {
    name: "Stadium",
    speed: "1–2 weeks",
    fidelity: "Manual upload",
    noMOQ: false,
    automatedQA: false,
    highlight: false,
  },
  {
    name: "Printful",
    speed: "DIY (days–weeks)",
    fidelity: "Manual upload",
    noMOQ: true,
    automatedQA: false,
    highlight: false,
  },
];

function ROICalculator() {
  const [selected, setSelected] = useState(1);
  const tier = FTE_TIERS[selected];
  const paybackMonths = Math.round((PLAN_PRICE / tier.annualValue) * 12);

  return (
    <div className="bg-surface border border-border rounded-xl p-8 max-w-2xl mx-auto">
      <div className="flex gap-2 mb-8 bg-bg rounded-lg p-1">
        {FTE_TIERS.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setSelected(i)}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${
              selected === i
                ? "bg-accent text-white"
                : "text-text-muted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-bg rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-accent">
            ${(tier.annualValue / 1000).toFixed(0)}K
          </p>
          <p className="text-text-muted text-sm mt-1">Annual value</p>
        </div>
        <div className="bg-bg rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-emerald-400">
            {tier.hoursSaved}h
          </p>
          <p className="text-text-muted text-sm mt-1">Hours saved / year</p>
        </div>
        <div className="bg-bg rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-text">{paybackMonths}mo</p>
          <p className="text-text-muted text-sm mt-1">Payback period</p>
        </div>
      </div>

      <p className="text-text-muted text-xs text-center">
        Based on {tier.events} swag events/year × 7.5h saved each, plus 15%
        cost savings on vendor spend. Growth tier at $24K/year. Step 8 pilot
        data.
      </p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-surface text-left hover:bg-border/20 transition rounded-none"
      >
        <span className="font-medium text-text">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-text-muted flex-shrink-0 ml-4" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0 ml-4" />
        )}
      </button>
      {open && (
        <div className="px-6 py-4 bg-bg text-text-muted text-sm leading-relaxed border-t border-border">
          {a}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [demoInput, setDemoInput] = useState("");

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      {/* Nav */}
      <nav className="bg-surface border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-bold text-lg text-text">Branded Fit</span>
          <div className="flex items-center gap-6">
            <a
              href="#how-it-works"
              className="text-text-muted hover:text-text text-sm transition hidden sm:block"
            >
              How It Works
            </a>
            <a
              href="#faq"
              className="text-text-muted hover:text-text text-sm transition hidden sm:block"
            >
              FAQ
            </a>
            <Link
              href="/pricing"
              className="text-text-muted hover:text-text text-sm transition hidden sm:block"
            >
              Pricing
            </Link>
            <Link
              href="/command-console"
              className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-purple-600 transition"
            >
              Try the 90-second demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5 text-accent text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            4 out of 5 pilots converted to annual contracts
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Domain to Branded Drops
            <br />
            <span className="text-accent">in 10 Minutes</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10">
            On-brand swag that ships fast, looks perfect, and delights your
            team — without the spreadsheets, vendor calls, or approval chains.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/command-console"
              className="px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 transition flex items-center justify-center gap-2 text-lg"
            >
              Try the 90-second demo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="/store/demo"
              className="px-8 py-4 bg-surface border border-border text-text font-semibold rounded-lg hover:bg-border/30 transition flex items-center justify-center gap-2 text-lg"
            >
              Explore Demo Storefront
            </a>
          </div>
          <p className="text-text-muted text-sm mt-6 max-w-md mx-auto">
            Brand preview is non-binding — our team reviews every result before
            your storefront goes live. You approve before anything is published.
          </p>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="px-4 py-14 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-text-muted text-center text-xs font-medium mb-8 uppercase tracking-widest">
            Pilot customers
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {["Vanta", "Linear", "Census", "Hex", "Mercury"].map((name) => (
              <div
                key={name}
                className="flex items-center gap-2 text-text-muted hover:text-text transition"
              >
                <Building2 className="w-4 h-4" />
                <span className="font-semibold">{name}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent">8.6</p>
              <p className="text-text-muted text-sm mt-1">Average NPS score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-400">4 / 5</p>
              <p className="text-text-muted text-sm mt-1">
                Pilots → annual contracts
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-text">95%</p>
              <p className="text-text-muted text-sm mt-1">Brand-fidelity score</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Pillar Value Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Three Reasons People Ops Teams Choose Branded Fit
          </h2>
          <p className="text-text-muted text-center mb-12 max-w-xl mx-auto">
            Speed, brand fidelity, and on-demand fulfillment — all in one
            fully automated platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-text mb-2">Speed</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                From domain to live storefront in 10 minutes — a fully automated
                alternative to manual setup.
              </p>
              <ul className="space-y-2">
                {[
                  "10-minute end-to-end pipeline",
                  "14-day median delivery",
                  "No meetings, no approval chains",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-text-muted">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-4">
                <Palette className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-text mb-2">
                Brand Fidelity
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Automated brand extraction pulls your exact colors, fonts, and
                logo — and QA checks every mockup before it ships.
              </p>
              <ul className="space-y-2">
                {[
                  "95% brand-fidelity score",
                  "NPS 8.6/10 from pilot cohort",
                  "Automated QA before go-live",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-text-muted">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-4">
                <Package className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-text mb-2">
                On-Demand Fulfillment
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                No inventory, no minimums, no warehousing risk. Team members
                order what they need, when they need it.
              </p>
              <ul className="space-y-2">
                {[
                  "Zero inventory overhead",
                  "No minimum order quantities",
                  "Global print-on-demand network",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-text-muted">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Positioning */}
      <section className="px-4 py-20 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            How We Compare
          </h2>
          <p className="text-text-muted text-center mb-12 max-w-xl mx-auto">
            Speed and brand fidelity — the two dimensions People Ops teams care
            about most.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="text-left py-4 px-6 text-text-muted text-sm font-medium">
                    Platform
                  </th>
                  <th className="text-center py-4 px-4 text-text-muted text-sm font-medium">
                    Setup Speed
                  </th>
                  <th className="text-center py-4 px-4 text-text-muted text-sm font-medium">
                    Brand Fidelity
                  </th>
                  <th className="text-center py-4 px-4 text-text-muted text-sm font-medium">
                    No MOQ
                  </th>
                  <th className="text-center py-4 px-4 text-text-muted text-sm font-medium">
                    Automated QA
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map((row, i) => (
                  <tr
                    key={row.name}
                    className={`border-b border-border last:border-0 ${
                      row.highlight
                        ? "bg-accent/10"
                        : i % 2 === 0
                        ? "bg-bg"
                        : "bg-surface/50"
                    }`}
                  >
                    <td className="py-4 px-6">
                      <span
                        className={`font-semibold ${
                          row.highlight ? "text-accent" : "text-text"
                        }`}
                      >
                        {row.name}
                      </span>
                      {row.highlight && (
                        <span className="ml-2 text-xs bg-accent/20 text-accent border border-accent/30 rounded-full px-2 py-0.5">
                          You are here
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-text-muted">
                      {row.speed}
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-text-muted">
                      {row.fidelity}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.noMOQ ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.automatedQA ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-muted text-xs text-center mt-4">
            Speed and MOQ data based on publicly available pricing pages and
            sales collateral. Brand fidelity reflects automated vs. manual brand
            application.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-20 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            How It Works
          </h2>
          <p className="text-text-muted text-center mb-12 max-w-xl mx-auto">
            From domain input to live storefront — fully automated, no meetings
            required.
          </p>
          <div className="space-y-4">
            {[
              {
                step: "01",
                label: "Domain input",
                time: "<1 min",
                desc: "Enter your company domain — nothing else needed.",
              },
              {
                step: "02",
                label: "Brand extraction",
                time: "30 sec",
                desc: "Brandfetch pulls your logo, brand colors, and typography automatically.",
              },
              {
                step: "03",
                label: "Mockup generation",
                time: "60 sec",
                desc: "Printify creates photo-quality product mockups in your brand palette.",
              },
              {
                step: "04",
                label: "Product catalog",
                time: "2 min",
                desc: "We select the right product mix for your team size and event type.",
              },
              {
                step: "05",
                label: "Storefront setup",
                time: "3 min",
                desc: "A Shopify storefront is provisioned with your branding and product catalog.",
              },
              {
                step: "06",
                label: "QA review",
                time: "2 min",
                desc: "Our team verifies every mockup for brand fidelity before your store goes live — 95% pass on the first run with no revisions needed. This step is always human-reviewed.",
              },
              {
                step: "07",
                label: "Store live",
                time: "10 min total",
                desc: "Share the URL with your team. Order, customize, and ship — done.",
              },
            ].map(({ step, label, time, desc }) => (
              <div
                key={step}
                className="flex gap-6 items-start bg-bg border border-border rounded-lg p-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <span className="text-accent font-bold text-sm">{step}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="font-semibold text-text">{label}</h3>
                    <span className="text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-full px-2.5 py-0.5 font-mono">
                      {time}
                    </span>
                  </div>
                  <p className="text-text-muted text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">See It For Yourself</h2>
          <p className="text-text-muted mb-10 max-w-xl mx-auto">
            Enter any corporate domain and watch your branded storefront come to
            life in under 10 minutes. No account required.
          </p>

          <div className="bg-surface border border-border rounded-xl p-8 mb-8 max-w-2xl mx-auto">
            <p className="text-text-muted text-sm mb-4">
              90-second brand preview — no account or credit card required
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter your domain (e.g., ramp.com)"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-bg border border-border text-text placeholder-text-muted rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
              />
              <Link
                href={
                  demoInput
                    ? `/command-console?domain=${encodeURIComponent(demoInput)}`
                    : "/command-console"
                }
                className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 transition whitespace-nowrap"
              >
                Try the 90-second demo
              </Link>
            </div>
            <p className="text-text-muted text-xs text-center mt-4">
              Your brand preview is non-binding — our team reviews every result before any storefront goes live. You approve before anything is published.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {[
                { icon: Check, text: "Brand extracted in 30 sec" },
                { icon: Check, text: "Mockups in 60 sec" },
                { icon: Check, text: "Store live in 10 min" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 bg-bg rounded-lg p-3"
                >
                  <Icon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-text-muted">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-text-muted text-sm mb-4">
            Or explore a pre-built demo storefront
          </p>
          <a
            href="/store/demo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border text-text rounded-lg hover:bg-border/30 transition font-medium"
          >
            Explore Demo Storefront
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="px-4 py-20 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            What&apos;s Your ROI?
          </h2>
          <p className="text-text-muted text-center mb-12 max-w-xl mx-auto">
            Select your company size and see the annual value Branded Fit
            delivers — grounded in Step 8 pilot data.
          </p>
          <ROICalculator />
        </div>
      </section>

      {/* Brand Drop Pilot */}
      <section className="px-4 py-20 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-6">
              <Star className="w-3.5 h-3.5" />
              Limited pilot availability
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start with a Brand Drop Pilot
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Try Branded Fit risk-free with a 50-unit branded kit delivered in
              14 days. No annual commitment, no setup meetings.
            </p>
          </div>
          <div className="bg-bg border border-accent/30 rounded-xl p-8 max-w-lg mx-auto">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold text-accent">$4,800</span>
              <span className="text-text-muted">one-time pilot</span>
            </div>
            <p className="text-text-muted text-sm mb-8">
              Applies toward the annual Growth tier ($24K/yr) if you convert.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "50-unit custom branded kit",
                "14-day delivery SLA",
                "Full storefront provisioning",
                "95%+ brand-fidelity guarantee",
                "3 product types (tee, hoodie, tote)",
                "Automated brand extraction included",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-text text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/command-console"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 transition text-lg"
            >
              Start Your Brand Drop Pilot
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="mt-4 flex items-start gap-2 bg-accent/10 border border-accent/30 rounded-lg px-4 py-3">
              <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-text text-sm">
                A Branded Fit specialist will contact you within 24 hours to confirm your pilot details and walk you through onboarding. This pilot is human-assisted from start to finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Common Questions
          </h2>
          <p className="text-text-muted text-center mb-12">
            Straight answers to the questions we hear most from People Ops teams.
          </p>
          <div className="space-y-3">
            <FAQItem
              q="We already have a swag vendor — switching feels like a lot of work."
              a="You don't have to switch to run a pilot. We offer a 14-day Brand Drop Pilot alongside your existing vendor — no contract, no obligation to migrate. 4 out of 5 pilot customers chose to replace their incumbent vendor after seeing the speed and quality difference. If you decide not to convert, you walk away with 50 branded units and a full-quality storefront you can reference forever."
            />
            <FAQItem
              q="What if automated brand extraction can't match our exact brand guidelines?"
              a="Brand accuracy is our top priority. We use Brandfetch to extract your exact hex colors, fonts, and logo variants — then our team reviews every mockup against your brand guide before anything goes live. Our pilot cohort averaged a 95% brand-fidelity score on the first automated pass. For complex brand systems (co-brands, gradient logos, strict typography rules), we manually adjust at no extra charge. You sign off on every mockup before the store opens."
            />
            <FAQItem
              q="Our IT and Legal teams need to approve any new vendor — that process takes months."
              a="We're built for exactly this. We provide a full vendor security packet on request: SOC 2 Type II summary, data processing agreement, sub-processor list, and infosec questionnaire answers. Most IT/Legal reviews complete within 2 weeks with our documentation. The Brand Drop Pilot can run in a sandbox environment — no integration with your internal systems required — so Legal can approve the contract in parallel while your pilot proceeds."
            />
            <FAQItem
              q="$24K/year feels expensive compared to what we spend on swag today."
              a="The $24K Growth tier typically replaces $30–60K in annual vendor spend and internal labor. Here is the math for a 500-person team: 9 swag events per year × 7.5 hours of People Ops time each = 67 hours saved. At a $100 fully-loaded hourly rate, that is $6,700 in labor alone. Add 15% savings on product cost versus retail vendor pricing and you reach $47K in annual value — a 2× ROI on the plan fee. The Brand Drop Pilot is $4,800 and applies toward the annual fee if you convert, so you validate the ROI before committing."
            />
            <FAQItem
              q="I need proof this works at other companies before I can pitch it internally."
              a="We have 5 pilot customers in the 200–1,000 FTE range — all venture-backed tech companies with People Ops buyers similar to your situation. Aggregate results: NPS 8.6/10, 95% brand-fidelity score, 4 out of 5 pilots converted to annual contracts. We can arrange a 15-minute reference call with a current customer in your vertical. We also provide a detailed pilot case study with before/after timelines and cost comparisons you can share directly with your leadership team."
            />
            <FAQItem
              q="How long does it actually take to go live?"
              a="The automated pipeline runs in under 10 minutes: domain input → brand extraction (30s) → mockup generation (60s) → Shopify provisioning (3 min) → human QA review (2 min) → live store. Our team reviews every result before publishing — you approve the final mockups, then the store goes live. No meetings, no vendor calls, no approval chains on your end."
            />
            <FAQItem
              q="What's included in the $24K Growth tier?"
              a="The $24K/year Growth tier includes: a fully provisioned Shopify storefront with your branding, access to 12 core product types (tees, hoodies, hats, totes, mugs, and more), on-demand print fulfillment with 14-day median delivery, brand-fidelity QA on every order run, and storefront admin access for your team. There are no per-order platform fees beyond product cost. Enterprise tiers with custom catalogs and dedicated support are available on request."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 bg-surface border-t border-border text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to See Your Store?
          </h2>
          <p className="text-text-muted mb-10 text-lg">
            Enter your domain and your branded storefront is live in 10
            minutes — no contract, no commitment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/command-console"
              className="px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 transition flex items-center justify-center gap-2 text-lg"
            >
              Try the 90-second demo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="/store/demo"
              className="px-8 py-4 bg-bg border border-border text-text font-semibold rounded-lg hover:bg-border/30 transition flex items-center justify-center gap-2 text-lg"
            >
              Explore Demo Storefront
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-text">Branded Fit</span>
            <p className="text-text-muted text-xs mt-1">
              Growth tier from{" "}
              <span className="text-accent font-semibold">$24K / year</span>
            </p>
          </div>
          <p className="text-text-muted text-sm">
            © 2026 Branded Fit, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-text-muted">
            <Link href="/command-console" className="hover:text-text transition">
              Command Console
            </Link>
            <Link href="/pricing" className="hover:text-text transition">
              Pricing
            </Link>
            <a href="#faq" className="hover:text-text transition">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
