"use client";

import { useState } from "react";

function buildEmailBody({
  yourName,
  bossName,
  company,
  teamSize,
  currentTool,
}: {
  yourName: string;
  bossName: string;
  company: string;
  teamSize: string;
  currentTool: string;
}): string {
  const greeting = bossName ? `Hi ${bossName},` : "Hi,";
  const fromLine = yourName ? `\n${yourName}` : "";
  const teamLine = teamSize ? ` across our ${teamSize}-person team` : "";
  const toolLine = currentTool
    ? ` We're currently using ${currentTool}, but the cost, setup time, and redemption rates aren't where we need them to be.`
    : "";

  return `${greeting}

I've been looking into ways to improve our swag program at ${company || "the company"}${teamLine}.${toolLine} I came across Branded Fit and think it's worth a serious look.

Here's the short version of why:

→ 8-minute setup: paste our domain, get a live, branded Shopify storefront. No design team or procurement needed.
→ AI-curated catalog: it matches products to our brand identity automatically — no manual browsing.
→ 85% employee redemption vs. the industry average of 38%. The difference is that employees self-select from a curated store instead of receiving company-chosen items.
→ $2,400/yr flat, zero markup on merchandise. Comparable platforms charge $6K–$12K/yr plus 15–25% on every order.

I already ran our numbers through their ROI calculator — we'd recover the subscription fee within the first swag cycle just from time savings and reduced waste.

Can I forward you an email walkthrough showing exactly what our storefront would look like? No call needed, just a quick look. Let me know if you'd like me to send it over.

Best,${fromLine}`;
}

type SendState = "idle" | "sending" | "sent" | "error";

export default function BossEmailGenerator({
  defaultCompany = "",
}: {
  defaultCompany?: string;
}) {
  const [yourName, setYourName] = useState("");
  const [bossName, setBossName] = useState("");
  const [bossEmail, setBossEmail] = useState("");
  const [company, setCompany] = useState(defaultCompany);
  const [teamSize, setTeamSize] = useState("");
  const [currentTool, setCurrentTool] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [bossEmailError, setBossEmailError] = useState("");
  const [gmailMessageId, setGmailMessageId] = useState<string | null>(null);

  const emailText = buildEmailBody({ yourName, bossName, company, teamSize, currentTool });
  const sent = sendState === "sent";

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bossEmail)) {
      setBossEmailError("Enter your boss's email address");
      return;
    }
    setBossEmailError("");
    setSendState("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/boss-email-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yourName: yourName.trim(),
          bossName: bossName.trim(),
          bossEmail: bossEmail.trim().toLowerCase(),
          company: company.trim(),
          teamSize: teamSize.trim(),
          currentTool: currentTool.trim(),
          emailBody: emailText,
        }),
      });
      const data = await res.json() as {
        success?: boolean;
        error?: string;
        email?: { sent: boolean; provider?: string; message_id?: string; reason?: string };
      };
      if (!res.ok) {
        throw new Error(data.error ?? "Send failed");
      }
      setGmailMessageId(data.email?.message_id ?? null);
      setSendState("sent");
    } catch (err) {
      setSendState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong — please try again.");
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(emailText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginTop: "2rem" }}>
      {/* Header */}
      <div style={{ padding: "1.25rem 1.5rem", background: "white", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
          ✉️
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)" }}>Send an approval email to your boss</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Fill in a few details — we&apos;ll send a personalized email directly to your People Leader
          </div>
        </div>
      </div>

      {sent ? (
        // ── SUCCESS STATE ──
        <div style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "0.375rem" }}>
            Email sent to {bossEmail}
          </div>
          {gmailMessageId && (
            <div style={{ display: "inline-block", margin: "0.375rem auto 0.75rem", padding: "0.25rem 0.75rem", background: "#dcfce7", border: "1px solid #86efac", borderRadius: "var(--radius-md)", fontSize: "0.75rem", color: "#166534", fontFamily: "monospace" }}>
              Gmail message ID: {gmailMessageId}
            </div>
          )}
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Your People Leader will receive the email below asking permission to forward an email walkthrough.
          </p>

          <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>Email sent — what your boss received</div>
              <button
                onClick={handleCopy}
                style={{ padding: "0.4rem 0.875rem", background: copied ? "var(--accent)" : "var(--primary)", color: "white", border: "none", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", transition: "background 0.2s" }}
              >
                {copied ? "✓ Copied!" : "Copy email"}
              </button>
            </div>
            <pre style={{ margin: 0, padding: "1rem", background: "white", border: "1px solid var(--primary)", borderRadius: "var(--radius-md)", fontSize: "0.8rem", lineHeight: 1.7, color: "var(--text-body)", whiteSpace: "pre-wrap", fontFamily: "inherit", overflowY: "auto", maxHeight: 340 }}>
              {emailText}
            </pre>
            <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", lineHeight: 1.5, marginTop: "0.5rem" }}>
              Subject line sent: <em>&ldquo;Swag program idea — worth a quick look?&rdquo;</em>
            </p>
          </div>
        </div>
      ) : (
        // ── FORM STATE ──
        <div className="boss-email-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <form onSubmit={handleGenerate} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", borderRight: "1px solid var(--border)" }}>
            <FormField label="Your name" placeholder="Alex Rivera" value={yourName} onChange={setYourName} />
            <FormField label="Your boss's name" placeholder="Jordan Chen" value={bossName} onChange={setBossName} />
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.35rem" }}>
                Boss&apos;s email address <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                type="email"
                placeholder="boss@company.com"
                value={bossEmail}
                onChange={(e) => { setBossEmail(e.target.value); setBossEmailError(""); }}
                style={{ width: "100%", padding: "0.55rem 0.75rem", fontSize: "0.875rem", border: `1px solid ${bossEmailError ? "var(--danger)" : "var(--border)"}`, borderRadius: "var(--radius-md)", background: "white", color: "var(--text-primary)", outline: "none", boxSizing: "border-box" }}
              />
              {bossEmailError && <p style={{ margin: "0.3rem 0 0", fontSize: "0.75rem", color: "var(--danger)" }}>{bossEmailError}</p>}
            </div>
            <FormField label="Company name" placeholder="Acme Inc." value={company} onChange={setCompany} />
            <FormField label="Team size" placeholder="120" value={teamSize} onChange={setTeamSize} />
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.35rem" }}>Current swag tool (optional)</label>
              <select value={currentTool} onChange={(e) => setCurrentTool(e.target.value)} style={{ width: "100%", padding: "0.55rem 0.75rem", fontSize: "0.875rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "white", color: "var(--text-primary)", outline: "none" }}>
                <option value="">— none / doing it manually —</option>
                <option value="SwagUp">SwagUp</option>
                <option value="Stadium">Stadium</option>
                <option value="PerkUp">PerkUp</option>
                <option value="Sendoso">Sendoso</option>
                <option value="Printify">Printify (DIY)</option>
              </select>
            </div>

            {errorMsg && (
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--danger)", lineHeight: 1.4 }}>{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={sendState === "sending"}
              style={{ marginTop: "0.25rem", padding: "0.75rem 1rem", background: sendState === "sending" ? "#818cf8" : "var(--primary)", color: "white", border: "none", borderRadius: "var(--radius-md)", fontWeight: 700, fontSize: "0.9rem", cursor: sendState === "sending" ? "not-allowed" : "pointer" }}
            >
              {sendState === "sending" ? "Sending…" : "Send to my boss →"}
            </button>
          </form>

          {/* Preview */}
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>Email preview (personalize by filling in details)</div>
            <pre style={{ flex: 1, margin: 0, padding: "1rem", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "0.8rem", lineHeight: 1.7, color: "var(--text-body)", whiteSpace: "pre-wrap", fontFamily: "inherit", overflowY: "auto", maxHeight: 400 }}>
              {emailText}
            </pre>
            <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", lineHeight: 1.5 }}>
              Tip: subject line will be sent as{" "}<em>&ldquo;Swag program idea — worth a quick look?&rdquo;</em>
            </p>
          </div>
        </div>
      )}

      <style>{`@media (max-width: 640px) { .boss-email-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function FormField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.35rem" }}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "0.55rem 0.75rem", fontSize: "0.875rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "white", color: "var(--text-primary)", outline: "none", boxSizing: "border-box" }}
      />
    </div>
  );
}
