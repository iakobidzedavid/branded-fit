"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Zap, CheckCircle, Gift, Sparkles } from "lucide-react";
import {
  trackEvent,
  getUTMParams,
  getABTestVariant,
  getHeadlineVariant,
} from "@/lib/analytics";

export default function Home() {
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [abVariant, setAbVariant] = useState("A");
  const [headlineText, setHeadlineText] = useState({
    headline: "",
    subheadline: "",
  });

  useEffect(() => {
    const variant = getABTestVariant();
    setAbVariant(variant);
    const headline = getHeadlineVariant(variant);
    setHeadlineText(headline);

    const utmParams = getUTMParams();
    trackEvent({
      eventType: "headline_variant_seen",
      abVariant: variant,
      utmSource: utmParams.source,
      utmMedium: utmParams.medium,
      utmCampaign: utmParams.campaign,
      eventData: {
        variant,
        pathname: window.location.pathname,
      },
    });
  }, []);

  const mockups = [
    {
      brand: "TechCorp (Blue & White)",
      colors: { primary: "#0066cc", secondary: "#ffffff" },
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%230066cc' width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='white' font-size='24' font-weight='bold'%3ETechCorp Hoodie%3C/text%3E%3C/svg%3E",
    },
    {
      brand: "FinanceHub (Teal & Black)",
      colors: { primary: "#14b8a6", secondary: "#1a1a1a" },
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%2314b8a6' width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='white' font-size='24' font-weight='bold'%3EFinanceHub Water Bottle%3C/text%3E%3C/svg%3E",
    },
    {
      brand: "PeopleOps (Purple & White)",
      colors: { primary: "#a855f7", secondary: "#ffffff" },
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23a855f7' width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='white' font-size='24' font-weight='bold'%3EPeopleOps Sticker%3C/text%3E%3C/svg%3E",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!domain || !email || !companyName) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      setError("Please enter a valid domain");
      setLoading(false);
      return;
    }

    const utmParams = getUTMParams();

    try {
      const res = await fetch("/api/pilot-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, email, company_name: companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      // Track domain submission event
      await trackEvent({
        eventType: "domain_submitted",
        abVariant,
        utmSource: utmParams.source,
        utmMedium: utmParams.medium,
        utmCampaign: utmParams.campaign,
        eventData: {
          domain,
          email,
          company_name: companyName,
        },
      });

      setSubmitted(true);
      setDomain("");
      setEmail("");
      setCompanyName("");

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError("Failed to submit inquiry");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "What is a Brand Drop?",
      answer:
        "A Brand Drop is a custom merchandise collection featuring your company's brand colors, logo, and design. We handle design, production, and fulfillment so your team gets professionally branded apparel within weeks.",
    },
    {
      question: "How long does it take?",
      answer:
        "From domain submission to live mockup gallery: less than 10 minutes. The full pilot (design approval through fulfillment) takes 3-4 weeks.",
    },
    {
      question: "Can we customize colors?",
      answer:
        "Yes! We extract your brand colors from your domain and website, then let you fine-tune them. The pilot includes 2 rounds of design revisions.",
    },
    {
      question: "What if we don't like the mockup?",
      answer:
        "No obligation. Our mockup gallery shows potential designs. If it's not a fit, you can pivot to a different brand or product mix before committing to production.",
    },
    {
      question: "How does fulfillment work?",
      answer:
        "We partner with on-demand manufacturers and handle all fulfillment. Items ship directly to employees or the address you specify. You pay only for what sells.",
    },
    {
      question: "What's included in the $4,800 pilot?",
      answer:
        "Brand extraction + AI-powered design (3 SKUs), up to 2 design revisions, Shopify store setup, and 200 units of starter inventory. Additional units billed at cost + 15% margin.",
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
            {headlineText.headline || "From Domain to Branded Drops in Minutes"}
          </h1>
          <p className="text-xl md:text-2xl text-text-muted mb-8 max-w-2xl mx-auto">
            {headlineText.subheadline ||
              "Submit your company domain and see exactly how your brand would look on apparel—in minutes, not weeks."}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="your-company.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={loading}
                  className="w-full px-6 py-4 bg-surface border-2 border-border text-text placeholder-text-muted rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="your@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="px-6 py-4 bg-surface border-2 border-border text-text placeholder-text-muted rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                  className="px-6 py-4 bg-surface border-2 border-border text-text placeholder-text-muted rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
              </div>
              {error && <p className="text-danger text-sm">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : "See Your Brand in Action"}
              {!loading && <Sparkles size={20} />}
            </button>
          </form>

          {submitted && (
            <div className="max-w-2xl mx-auto p-4 bg-green-900/20 border-2 border-green-500/50 rounded-lg">
              <p className="text-green-300">
                ✓ Thanks! We'll send you a mockup within 24 hours
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Mockup Gallery */}
      {!submitted && (
        <section className="px-4 py-20 bg-surface/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                This is your brand's look
              </h2>
              <p className="text-text-muted text-lg">
                See how your company colors and logo appear on real apparel
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Mockup */}
              <div className="flex items-center justify-center">
                <div
                  className="w-full max-w-md h-96 rounded-lg border-2 border-border flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: mockups[selectedMockup].colors.primary }}
                >
                  <img
                    src={mockups[selectedMockup].image}
                    alt="Mockup preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Mockup Selector */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-6">Select a product</h3>
                {mockups.map((mockup, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedMockup(idx);
                      const utmParams = getUTMParams();
                      trackEvent({
                        eventType: "mockup_viewed",
                        abVariant,
                        utmSource: utmParams.source,
                        utmMedium: utmParams.medium,
                        utmCampaign: utmParams.campaign,
                        eventData: {
                          mockup_index: idx,
                          brand: mockup.brand,
                        },
                      });
                    }}
                    className={`w-full p-6 rounded-lg border-2 transition text-left ${
                      selectedMockup === idx
                        ? "bg-accent/20 border-accent"
                        : "bg-surface border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded"
                          style={{
                            backgroundColor: mockup.colors.primary,
                          }}
                        />
                        <div
                          className="w-8 h-8 rounded border-2"
                          style={{
                            borderColor: mockup.colors.secondary,
                            backgroundColor: mockup.colors.secondary,
                          }}
                        />
                      </div>
                      <span className="font-semibold">{mockup.brand}</span>
                    </div>
                  </button>
                ))}

                <div className="p-4 bg-surface rounded-lg mt-6">
                  <p className="text-text-muted text-sm">
                    How close is this to your brand?
                  </p>
                  <div className="flex gap-2 mt-3">
                    {["😞", "😐", "😊", "😍"].map((emoji, idx) => (
                      <button
                        key={idx}
                        className="flex-1 text-3xl p-3 bg-surface hover:bg-accent/20 rounded-lg transition border-2 border-transparent hover:border-accent"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Value Prop Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Branded Fit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-surface rounded-lg border border-border hover:border-accent transition">
              <div className="text-accent mb-4 flex">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Speed</h3>
              <p className="text-text-muted">
                See your brand on apparel in under 10 minutes. No back-and-forth
                emails or design sprints.
              </p>
            </div>

            <div className="p-8 bg-surface rounded-lg border border-border hover:border-accent transition">
              <div className="text-accent mb-4 flex">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Brand Fidelity</h3>
              <p className="text-text-muted">
                95%+ color match guaranteed. We extract your exact brand
                palette and apply it perfectly.
              </p>
            </div>

            <div className="p-8 bg-surface rounded-lg border border-border hover:border-accent transition">
              <div className="text-accent mb-4 flex">
                <Gift size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Delightful Unboxing</h3>
              <p className="text-text-muted">
                Your team loves the experience. Custom packaging and personal
                notes included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-20 bg-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-text-muted mb-12 text-lg">
            People Ops leaders at forward-thinking companies trust Branded Fit
          </p>

          <div className="bg-surface rounded-lg p-8 mb-12 border border-border">
            <p className="text-lg italic text-text mb-6">
              "Our team loved the unboxing experience. It genuinely felt special
              to see our brand celebrated on real products."
            </p>
            <p className="font-semibold">A People Ops leader</p>
            <p className="text-text-muted text-sm">Company using Branded Fit</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to launch your Brand Drop?
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-4">
            <a
              href="/pilot-checkout"
              onClick={() => {
                const utmParams = getUTMParams();
                trackEvent({
                  eventType: "storefront_clicked",
                  abVariant,
                  utmSource: utmParams.source,
                  utmMedium: utmParams.medium,
                  utmCampaign: utmParams.campaign,
                  eventData: {
                    cta: "pilot_checkout",
                  },
                });
              }}
              className="px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-600 transition"
            >
              Start Your Pilot ($4,800)
            </a>
            <button
              onClick={() => {
                const utmParams = getUTMParams();
                trackEvent({
                  eventType: "storefront_clicked",
                  abVariant,
                  utmSource: utmParams.source,
                  utmMedium: utmParams.medium,
                  utmCampaign: utmParams.campaign,
                  eventData: {
                    cta: "generate_report",
                  },
                });
              }}
              className="px-8 py-4 bg-surface border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition"
            >
              Generate your first report
            </button>
          </div>
          <p className="text-text-muted text-sm">
            AI-powered setup, no sales call required
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 bg-surface/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-surface border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => {
                    const isOpening = expandedFaq !== idx;
                    setExpandedFaq(isOpening ? idx : null);
                    if (isOpening) {
                      const utmParams = getUTMParams();
                      trackEvent({
                        eventType: "faq_opened",
                        abVariant,
                        utmSource: utmParams.source,
                        utmMedium: utmParams.medium,
                        utmCampaign: utmParams.campaign,
                        eventData: {
                          question: faq.question,
                          index: idx,
                        },
                      });
                    }
                  }}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface/80 transition"
                >
                  <h3 className="font-semibold text-lg text-left">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={24}
                    className={`flex-shrink-0 transition-transform ${
                      expandedFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 py-4 bg-surface/50 border-t border-border">
                    <p className="text-text-muted">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-surface border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-text-muted text-sm">
              © 2026 Branded Fit. All rights reserved.
            </p>
            <div className="flex gap-8 text-text-muted text-sm">
              <a href="#" className="hover:text-accent transition">
                Privacy
              </a>
              <a href="#" className="hover:text-accent transition">
                Terms
              </a>
              <a href="#" className="hover:text-accent transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
