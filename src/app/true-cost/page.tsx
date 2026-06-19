"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Metadata } from "next";

// SwagUp published transaction fee: 8-10% + storage ($0.25-3/item) + repacking ($8-16/pack)
// Agency model: 30-50% markup on all merchandise
// Branded Fit: $2,400/yr flat + zero markup on Printify actual cost

const BRANDED_FIT_ANNUAL_FEE = 2400;
const SWAGUP_TX_FEE_RATE = 0.09; // 9% midpoint of 8-10%
const SWAGUP_STORAGE_PER_ITEM = 1.0; // $0.25-$3; ~$1 avg per item stored
const SWAGUP_REPACK_PER_ORDER = 12; // $8-$16; $12 avg
const AGENCY_MARKUP_RATE = 0.40; // 40% markup (agencies typically 30-50%)
const ORDERS_PER_YEAR = 4; // typical 4 swag cycles/year
const ITEMS_PER_ORDER_PER_PERSON = 3; // avg items per employee per order

function fmt$(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function TrueCostPage() {
  const [swagBudget, setSwagBudget] = useState(15000);
  const [teamSize, setTeamSize] = useState(80);

  const calc = useMemo(() => {
    const ordersPerYear = ORDERS_PER_YEAR;
    const budgetPerOrder = swagBudget / ordersPerYear;
    const itemsPerYear = teamSize * ITEMS_PER_ORDER_PER_PERSON * ordersPerYear;

    // Branded Fit all-in cost
    const bfPlatformFee = BRANDED_FIT_ANNUAL_FEE;
    const bfMerchCost = swagBudget; // zero markup — customer pays Printify actual cost
    const bfTotal = bfPlatformFee + bfMerchCost;

    // SwagUp all-in cost
    const swagupTxFees = swagBudget * SWAGUP_TX_FEE_RATE;
    const swagupStorageFees = itemsPerYear * SWAGUP_STORAGE_PER_ITEM;
    const swagupRepackFees = ordersPerYear * (teamSize / 10) * SWAGUP_REPACK_PER_ORDER; // ~1 pack per 10 employees per order
    const swagupHiddenFees = swagupTxFees + swagupStorageFees + swagupRepackFees;
    const swagupTotal = swagBudget + swagupHiddenFees; // no platform fee (Basic tier)

    // Swag agency all-in cost
    const agencyMarkup = swagBudget * AGENCY_MARKUP_RATE;
    const agencyTotal = swagBudget + agencyMarkup;

    // Savings
    const savingsVsSwagUp = swagupTotal - bfTotal;
    const savingsVsAgency = agencyTotal - bfTotal;

    // At what budget does Branded Fit match SwagUp? Solve: 2400 + x = x * (1 + 0.09) + storage + repack
    // Approximate crossover
    const crossoverBudget = Math.round(
      (bfPlatformFee - (SWAGUP_STORAGE_PER_ITEM * teamSize * ITEMS_PER_ORDER_PER_PERSON * ordersPerYear) - (ordersPerYear * (teamSize / 10) * SWAGUP_REPACK_PER_ORDER))
      / SWAGUP_TX_FEE_RATE
    );

    return {
      bfPlatformFee,
      bfMerchCost,
      bfTotal,
      swagupTxFees,
      swagupStorageFees,
      swagupRepackFees,
      swagupHiddenFees,
      swagupTotal,
      agencyMarkup,
      agencyTotal,
      savingsVsSwagUp,
      savingsVsAgency,
      crossoverBudget: Math.max(5000, crossoverBudget),
      budgetPerOrder,
    };
  }, [swagBudget, teamSize]);

  const winningVsSwagUp = calc.savingsVsSwagUp > 0;
  const winningVsAgency = calc.savingsVsAgency > 0;

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

      {/* Hero */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{
          display: "inline-block",
          background: "var(--primary-light)",
          color: "var(--primary)",
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          padding: "0.3rem 0.75rem",
          borderRadius: "100px",
          marginBottom: "1rem",
        }}>
          Total cost of ownership
        </div>
        <h1 style={{
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginBottom: "0.75rem",
          lineHeight: 1.1,
        }}>
          Platform fee or merchandise markup?<br />
          <span style={{ color: "var(--primary)" }}>They&apos;re not the same thing.</span>
        </h1>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "1.05rem", maxWidth: 600 }}>
          Branded Fit charges a flat platform fee and passes merchandise through at Printify&apos;s actual cost — zero markup. Competitors quietly charge transaction fees, storage fees, and repacking fees on top of your merchandise spend. Enter your numbers to see the real difference.
        </p>
      </div>

      {/* Key claim callout */}
      <div style={{
        background: "#f0fdf4",
        border: "1px solid #86efac",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem 1.5rem",
        marginBottom: "2rem",
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
      }}>
        <div style={{ fontSize: "1.3rem", lineHeight: 1, flexShrink: 0, marginTop: "0.1rem" }}>✓</div>
        <div>
          <div style={{ fontWeight: 700, color: "#166534", fontSize: "0.95rem", marginBottom: "0.25rem" }}>
            SwagUp charges an 8–10% transaction fee on every order — on top of your merchandise cost
          </div>
          <div style={{ fontSize: "0.85rem", color: "#15803d", lineHeight: 1.5 }}>
            Plus $0.25–$3 per item for storage and $8–$16 per pack for repacking. On a $15K annual swag budget, that&apos;s $1,200–$2,500+ in fees you may not have priced in.
            &nbsp;<a href="https://support.swagup.com/en/articles/8937431-swagup-shops-faq" target="_blank" rel="noopener noreferrer" style={{ color: "#166534", textDecoration: "underline" }}>Source: SwagUp FAQ</a>
          </div>
        </div>
      </div>

      {/* Input sliders */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "2rem",
        marginBottom: "1.5rem",
      }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
          Your swag program
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
          <SliderField
            label="Annual swag budget"
            hint={`${fmt$(swagBudget)}/yr — total spend on branded merchandise`}
            value={swagBudget}
            min={3000}
            max={100000}
            step={1000}
            format={(v) => fmt$(v)}
            onChange={setSwagBudget}
          />
          <SliderField
            label="Team size (FTEs)"
            hint={`${teamSize} employees receiving swag`}
            value={teamSize}
            min={20}
            max={500}
            step={10}
            format={(v) => `${v} people`}
            onChange={setTeamSize}
          />
        </div>
      </div>

      {/* Three-column comparison */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1rem",
        marginBottom: "1.5rem",
      }}>
        {/* Branded Fit */}
        <div style={{
          background: "var(--accent-bg)",
          border: "2px solid var(--accent-border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: "-1px",
            right: "1.25rem",
            background: "var(--accent)",
            color: "white",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "0.2rem 0.6rem",
            borderRadius: "0 0 6px 6px",
          }}>
            Branded Fit
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent)", marginBottom: "0.25rem", marginTop: "0.5rem" }}>
            {fmt$(calc.bfTotal)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>total annual cost</div>
          <LineItem label="Platform fee (flat)" value={fmt$(calc.bfPlatformFee)} accent />
          <LineItem label="Merchandise (Printify actual cost)" value={fmt$(calc.bfMerchCost)} />
          <LineItem label="Transaction fees" value="$0" accent />
          <LineItem label="Storage fees" value="$0" accent />
          <LineItem label="Repacking fees" value="$0" accent />
          <div style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--accent-border)",
            fontSize: "0.82rem",
            color: "var(--accent-text)",
            fontWeight: 600,
          }}>
            No hidden fees. Ever.
          </div>
        </div>

        {/* SwagUp */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: "-1px",
            right: "1.25rem",
            background: "#6b7280",
            color: "white",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "0.2rem 0.6rem",
            borderRadius: "0 0 6px 6px",
          }}>
            SwagUp
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem", marginTop: "0.5rem" }}>
            {fmt$(calc.swagupTotal)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>total annual cost</div>
          <LineItem label="Platform fee" value="$0 (Basic tier)" />
          <LineItem label="Merchandise cost" value={fmt$(swagBudget)} />
          <LineItem label="Transaction fees (9% of orders)" value={fmt$(calc.swagupTxFees)} warn />
          <LineItem label="Storage (~$1/item/yr)" value={fmt$(calc.swagupStorageFees)} warn />
          <LineItem label="Repacking ($12/pack)" value={fmt$(calc.swagupRepackFees)} warn />
          <div style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border)",
            fontSize: "0.82rem",
            color: "#b45309",
            fontWeight: 600,
          }}>
            Hidden fees: {fmt$(calc.swagupHiddenFees)}
          </div>
        </div>

        {/* Agency */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: "-1px",
            right: "1.25rem",
            background: "#6b7280",
            color: "white",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "0.2rem 0.6rem",
            borderRadius: "0 0 6px 6px",
          }}>
            Swag Agency
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem", marginTop: "0.5rem" }}>
            {fmt$(calc.agencyTotal)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>total annual cost</div>
          <LineItem label="Agency management fee" value="$0 (baked in)" />
          <LineItem label="Merchandise (at agency cost)" value={fmt$(swagBudget)} />
          <LineItem label="Agency markup (40% of merch)" value={fmt$(calc.agencyMarkup)} warn />
          <LineItem label="Delivery & logistics" value="$0 (bundled)" />
          <LineItem label="Rush fees" value="Variable" warn />
          <div style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border)",
            fontSize: "0.82rem",
            color: "#b45309",
            fontWeight: 600,
          }}>
            Markup baked in: {fmt$(calc.agencyMarkup)}
          </div>
        </div>
      </div>

      {/* Savings callout */}
      <div style={{
        background: "var(--accent-bg)",
        border: "1px solid var(--accent-border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem 2rem",
        marginBottom: "1.5rem",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.5rem",
      }}>
        <div>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.35rem" }}>
            vs. SwagUp (hidden fees)
          </div>
          <div style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: winningVsSwagUp ? "var(--accent)" : "#b45309",
            lineHeight: 1,
          }}>
            {winningVsSwagUp ? `${fmt$(calc.savingsVsSwagUp)} cheaper` : `${fmt$(Math.abs(calc.savingsVsSwagUp))} more`}
          </div>
          {!winningVsSwagUp && (
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
              Breakeven at ~{fmt$(calc.crossoverBudget)} swag budget — above that, Branded Fit wins
            </div>
          )}
        </div>
        <div>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.35rem" }}>
            vs. Swag Agency (markup)
          </div>
          <div style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: winningVsAgency ? "var(--accent)" : "#b45309",
            lineHeight: 1,
          }}>
            {winningVsAgency ? `${fmt$(calc.savingsVsAgency)} cheaper` : `${fmt$(Math.abs(calc.savingsVsAgency))} more`}
          </div>
          {!winningVsAgency && (
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
              Agencies win at very small budgets — but can&apos;t touch our speed or brand quality
            </div>
          )}
        </div>
      </div>

      {/* What zero markup means */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem 2rem",
        marginBottom: "1.5rem",
      }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
          How Branded Fit makes money (and why this matters to you)
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
          {[
            {
              icon: "→",
              title: "We earn the platform fee",
              body: "Our $2,400/yr subscription covers storefront generation, brand AI, analytics, and support. That's the entire business model.",
            },
            {
              icon: "→",
              title: "You pay Printify's actual cost",
              body: "Merchandise routes through Printify at their published print-on-demand prices. We take $0 of your merchandise spend. We can prove it.",
            },
            {
              icon: "→",
              title: "Your incentives are aligned",
              body: "We make the same revenue whether you order $1K or $100K of swag. We're not incentivized to push higher-margin products — your brand fidelity is.",
            },
          ].map((item) => (
            <div key={item.title}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.35rem" }}>
                {item.title}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-body)", lineHeight: 1.55 }}>
                {item.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data sources note */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem 1.5rem",
        marginBottom: "2rem",
        fontSize: "0.78rem",
        color: "var(--text-muted)",
        lineHeight: 1.6,
      }}>
        <strong style={{ color: "var(--text-body)" }}>Sources & methodology</strong><br />
        SwagUp transaction fee (8–10%) and storage/repacking fees from{" "}
        <a href="https://support.swagup.com/en/articles/8937431-swagup-shops-faq" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>
          SwagUp Shops FAQ
        </a>{" "}
        (June 2026). Agency markup (30–50% midpoint 40%) from Merchloop platform comparison 2026. Branded Fit merchandise cost = Printify published pricing (no markup). Storage modeled at $1/item/yr (midpoint of SwagUp $0.25–$3 range). Repacking at $12/pack. Results are illustrative; actual SwagUp fees vary by plan.
      </div>

      {/* CTA */}
      <div style={{
        background: "var(--primary)",
        borderRadius: "var(--radius-lg)",
        padding: "2rem",
        textAlign: "center",
        color: "white",
      }}>
        <div style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          See your brand live in 8 minutes — for exactly {fmt$(BRANDED_FIT_ANNUAL_FEE)}/yr.
        </div>
        <p style={{ fontSize: "0.95rem", opacity: 0.85, marginBottom: "1.5rem" }}>
          No transaction fees. No storage fees. No markup on your merch. Just your brand, live.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/try"
            style={{
              display: "inline-block",
              background: "white",
              color: "var(--primary)",
              fontWeight: 700,
              padding: "0.75rem 1.75rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.95rem",
            }}
          >
            Try It Free →
          </Link>
          <Link
            href="/roi-calculator"
            style={{
              display: "inline-block",
              background: "transparent",
              color: "white",
              fontWeight: 600,
              padding: "0.75rem 1.75rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.95rem",
              border: "1.5px solid rgba(255,255,255,0.5)",
            }}
          >
            Calculate Your ROI
          </Link>
        </div>
      </div>
    </main>
  );
}

function SliderField({
  label, hint, value, min, max, step, format, onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
        <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-body)" }}>
          {label}
        </label>
        <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--primary)" }}>
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer" }}
      />
      <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginTop: "0.25rem" }}>{hint}</p>
    </div>
  );
}

function LineItem({ label, value, accent, warn }: {
  label: string;
  value: string;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: "0.6rem",
    }}>
      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", flex: 1, paddingRight: "1rem" }}>
        {label}
      </span>
      <span style={{
        fontSize: "0.85rem",
        fontWeight: 700,
        color: accent ? "var(--accent)" : warn ? "#b45309" : "var(--text-primary)",
        whiteSpace: "nowrap",
      }}>
        {value}
      </span>
    </div>
  );
}
