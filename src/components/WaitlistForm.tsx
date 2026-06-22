"use client";

import { useState, FormEvent } from "react";

type State = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [signupId, setSignupId] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong");
        setState("error");
        return;
      }
      setSignupId(json.signup?.id ?? null);
      setState("success");
    } catch {
      setErrorMsg("Network error — please try again");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎉</div>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          You&apos;re on the list!
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          We&apos;ll reach out when your early access spot is ready.
        </p>
        {signupId && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--text-subtle)",
              fontFamily: "monospace",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "0.25rem 0.5rem",
              display: "inline-block",
            }}
          >
            Signup ID: {signupId}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={state === "loading"}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={state === "loading"}
          style={inputStyle}
        />
        {state === "error" && (
          <p style={{ color: "var(--danger)", fontSize: "0.85rem", margin: 0 }}>
            {errorMsg}
          </p>
        )}
        <button
          type="submit"
          disabled={state === "loading"}
          style={{
            padding: "0.75rem 1.5rem",
            background: state === "loading" ? "var(--text-subtle)" : "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: state === "loading" ? "not-allowed" : "pointer",
            letterSpacing: "0.01em",
            transition: "background 0.15s",
          }}
        >
          {state === "loading" ? "Joining…" : "Join the waitlist →"}
        </button>
      </div>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.7rem 1rem",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  fontSize: "0.95rem",
  color: "var(--text-primary)",
  background: "white",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
