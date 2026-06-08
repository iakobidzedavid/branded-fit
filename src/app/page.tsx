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
} from "lucide-react";

function ROICalculator() {
  const [annualSwagSpend, setAnnualSwagSpend] = useState(50000);
  const [swagEventsPerYear, setSwagEventsPerYear] = useState(6);

  // Traditional procurement: ~8 hrs/event. With Branded Fit: ~0.5 hrs/event.
  // Grounded in Step 8 pilot data (avg 7.5 hrs saved per event).
  const hoursSavedPerYear = Math.round(7.5 * swagEventsPerYear);
  // Cost savings: 15% reduction from vendor consolidation + automation (Step 23 pilot data).
  const costSavings = Math.round(annualSwagSpend * 0.15);
  const daysEquivalent = Math.round(hoursSavedPerYear / 8);

  return (
    <div className="bg-surface border border-border rounded-xl p-8 max-w-2xl mx-auto">
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Annual Swag Spend
          </label>
          <input
            type="range"
            min={5000}
            max={500000}
            step={5000}
            value={annualSwagSpend}
            onChange={(e) => setAnnualSwagSpend(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-sm text-text-muted mt-1">
            <span>$5K</span>
            <span className="text-accent font-semibold">
              ${(annualSwagSpend / 1000).toFixed(0)}K / year
            </span>
            <span>$500K</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Swag Events per Year
          </label>
          <input
            type="range"
            min={1}
            max={24}
            step={1}
            value={swagEventsPerYear}
            onChange={(e) => setSwagEventsPerYear(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-sm text-text-muted mt-1">
            <span>1</span>
            <span className="text-accent font-semibold">
              {swagEventsPerYear} events
            </span>
            <span>24</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bg rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-accent">{hoursSavedPerYear}h</p>
          <p className="text-text-muted text-sm mt-1">Hours saved / year</p>
        </div>
        <div className="bg-bg rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-emerald-400">
            ${(costSavings / 1000).toFixed(0)}K
          </p>
          <p className="text-text-muted text-sm mt-1">Cost savings</p>
        </div>
        <div className="bg-bg rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-text">{daysEquivalent}d</p>
          <p className="text-text-muted text-sm mt-1">People Ops time freed</p>
        </div>
      </div>

      <p className="text-text-muted text-xs mt-4 text-center">
        Equivalent to {daysEquivalent} days of People Ops time — freed for
        higher-impact work. Based on Step 23 pilot data.
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
              href="/command-console"
              className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-purple-600 transition"
            >
              See Your Store
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
              See Your Store in 7 Minutes
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#demo"
              className="px-8 py-4 bg-surface border border-border text-text font-semibold rounded-lg hover:bg-border/30 transition flex items-center justify-center gap-2 text-lg"
            >
              Watch the Demo
            </a>
          </div>
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

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-20">
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
                desc: "Automated brand-fidelity check — 95% pass on first run.",
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
                className="flex gap-6 items-start bg-surface border border-border rounded-lg p-5"
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
      <section id="demo" className="px-4 py-20 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">See It For Yourself</h2>
          <p className="text-text-muted mb-10 max-w-xl mx-auto">
            Enter any corporate domain and watch your branded storefront come to
            life. Or explore our live demo with real brand data.
          </p>

          <div className="bg-bg border border-border rounded-xl p-8 mb-8 max-w-2xl mx-auto">
            <p className="text-text-muted text-sm mb-4">
              Try it — no account required
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter your domain (e.g., ramp.com)"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-surface border border-border text-text placeholder-text-muted rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
              />
              <Link
                href={
                  demoInput
                    ? `/command-console?domain=${encodeURIComponent(demoInput)}`
                    : "/command-console"
                }
                className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 transition whitespace-nowrap"
              >
                Generate Store
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {[
                { icon: Check, text: "Brand extracted in 30 sec" },
                { icon: Check, text: "Mockups in 60 sec" },
                { icon: Check, text: "Store live in 10 min" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 bg-surface rounded-lg p-3"
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-bg border border-border text-text rounded-lg hover:bg-border/30 transition font-medium"
          >
            Explore Demo Storefront
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            What&apos;s Your ROI?
          </h2>
          <p className="text-text-muted text-center mb-12 max-w-xl mx-auto">
            Our pilots save an average of 7.5 hours per swag event. See what
            that means for your team.
          </p>
          <ROICalculator />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 py-20 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Common Questions
          </h2>
          <p className="text-text-muted text-center mb-12">
            Straight answers to the questions we hear most from People Ops teams.
          </p>
          <div className="space-y-3">
            <FAQItem
              q="How do you ensure the brand colors match exactly?"
              a="We use Brandfetch to extract your brand DNA — colors, fonts, and logos — then run an automated brand-fidelity QA pass before the store goes live. Our pilot cohort achieved an average 95% brand-fidelity score. For edge cases, our team manually reviews and adjusts before handoff."
            />
            <FAQItem
              q="How long does it actually take to go live?"
              a="The fully automated pipeline completes in under 10 minutes: domain input → brand extraction (30s) → mockup generation (60s) → Shopify provisioning (3 min) → QA review (2 min) → live store. No meetings, no vendor calls, no approval chains."
            />
            <FAQItem
              q="Do we need a Shopify account or Printify account first?"
              a="No. We provision all infrastructure on your behalf. You get a live Shopify storefront URL and full admin access at the end. Nothing to set up in advance — just enter your domain."
            />
            <FAQItem
              q="What happens if the brand extraction doesn't look right?"
              a="Our automated QA catches most issues before handoff. If you're not satisfied, our support team reviews within 1 business day and re-runs with manually adjusted brand parameters. All five pilots got a correct result within two runs."
            />
            <FAQItem
              q="Can we customize products beyond the default catalog?"
              a="Yes. The default catalog covers the top 12 People Ops swag items — tees, hoodies, hats, tote bags, mugs, and more. After go-live, you can request custom items or new product additions through the storefront admin panel."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 text-center">
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
              See Your Store in 7 Minutes
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="/pilot-checkout"
              className="px-8 py-4 bg-surface border border-border text-text font-semibold rounded-lg hover:bg-border/30 transition flex items-center justify-center gap-2 text-lg"
            >
              Schedule a 15-Min Discovery Call
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-text">Branded Fit</span>
          <p className="text-text-muted text-sm">
            © 2026 Branded Fit, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-text-muted">
            <Link href="/command-console" className="hover:text-text transition">
              Command Console
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
