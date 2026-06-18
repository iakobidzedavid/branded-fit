import React from "react";
import { cookies } from "next/headers";
import AdminLogin from "@/components/AdminLogin";

const NAV_ITEMS = [
  { label: "Overview", href: "#metrics" },
  { label: "Conversion Funnel", href: "#funnel" },
  { label: "Daily Volume", href: "#timeseries" },
  { label: "Event Types", href: "#events" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || session !== adminPassword) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <header className="bg-surface border-b border-border px-6 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-accent font-bold">Branded Fit</span>
          <span className="text-border select-none">/</span>
          <span className="text-text-muted text-sm">Admin Analytics</span>
        </div>
        <a
          href="/api/admin/logout"
          className="text-sm text-text-muted hover:text-text transition-colors"
        >
          Sign out
        </a>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 bg-surface border-r border-border shrink-0 py-6 px-3 hidden md:flex flex-col gap-1">
          <p className="text-xs text-text-muted uppercase tracking-wider px-2 mb-3">
            Dashboard
          </p>
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-text-muted hover:text-text hover:bg-bg transition-colors"
            >
              {label}
            </a>
          ))}
        </aside>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
