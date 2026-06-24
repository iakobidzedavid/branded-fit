"use client";

import { useEffect, useState, useCallback } from "react";

// Design tokens from App Blueprint
const T = {
  bg: "#0d1f33",
  surface: "#102542",
  border: "#1a3a5c",
  text: "#ecebf3",
  textMuted: "#8fa3b8",
  accent: "#4f46e5",
  danger: "#dc2626",
  statusShipped: "#10b981",
  statusPending: "#f59e0b",
  statusInProgress: "#3b82f6",
};

type ShippingAddress = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

type Order = {
  id: string;
  shopify_order_id: string | null;
  store_name: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_id: string | null;
  shipping_address: ShippingAddress | null;
  product_name: string | null;
  product_sku: string | null;
  product_mockup_url: string | null;
  quantity: number;
  unit_price: number | null;
  total_price: number | null;
  fulfillment_status: string;
  printify_tracking_url: string | null;
  order_date: string;
  order_notes: string | null;
};

function statusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "shipped":
    case "delivered":
      return T.statusShipped;
    case "processing":
    case "in_progress":
      return T.statusInProgress;
    default:
      return T.statusPending;
  }
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function currency(n: number | null) {
  if (n == null) return "—";
  return `$${Number(n).toFixed(2)}`;
}

// ---------- Order Detail Modal ----------
function OrderDetailModal({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [inviteResult, setInviteResult] = useState<string | null>(null);
  const [supportEmail, setSupportEmail] = useState("");
  const [supportError, setSupportErrorText] = useState("");
  const [supportResult, setSupportResult] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/orders/${orderId}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d: { order?: Order; error?: string }) => {
        if (d.error) throw new Error(d.error);
        setOrder(d.order ?? null);
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [orderId]);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function handleDownloadAssets() {
    const storeId = order?.store_name?.replace(/\s+/g, "-").toLowerCase() ?? "default";
    window.location.href = `/api/download-assets?storeId=${encodeURIComponent(storeId)}`;
  }

  async function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emails = inviteEmails
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((email) => ({ email, role: inviteRole }));
    if (emails.length === 0) return;
    const res = await fetch("/api/invite-team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invites: emails, store_name: order?.store_name }),
    });
    const data = await res.json() as { message?: string; error?: string };
    setInviteResult(data.message ?? data.error ?? "Done");
  }

  async function handleSupportSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/support-escalation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain: order?.store_name ?? orderId,
        error_details: supportError || "Manual escalation from Order Detail",
        contact_email: supportEmail,
      }),
    });
    const data = await res.json() as { message?: string; error?: string };
    setSupportResult(data.message ?? data.error ?? "Submitted");
  }

  const addr = order?.shipping_address;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.7)", display: "flex",
        alignItems: "center", justifyContent: "center", padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12,
        width: "100%", maxWidth: 680, maxHeight: "90vh", overflow: "auto",
        color: T.text,
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.25rem 1.5rem", background: T.surface,
          borderBottom: `1px solid ${T.border}`, borderRadius: "12px 12px 0 0",
        }}>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMuted, marginBottom: 4 }}>
              Order Details
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
              {order?.shopify_order_id ? `#${order.shopify_order_id}` : loading ? "Loading…" : `ID: ${orderId.slice(0, 8)}…`}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "none", border: "none", color: T.textMuted,
              fontSize: "1.5rem", cursor: "pointer", lineHeight: 1, padding: "0.25rem",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {loading && (
            <div style={{ textAlign: "center", color: T.textMuted, padding: "3rem 0" }}>
              Loading order details…
            </div>
          )}
          {error && (
            <div style={{ color: T.danger, padding: "1rem", background: "#3b0a0a", borderRadius: 8, marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          {order && !loading && (
            <>
              {/* Status + Date row */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <span style={{
                  padding: "0.25rem 0.75rem", borderRadius: 20,
                  background: `${statusColor(order.fulfillment_status)}22`,
                  color: statusColor(order.fulfillment_status),
                  fontSize: "0.78rem", fontWeight: 700, textTransform: "capitalize",
                }}>
                  {order.fulfillment_status}
                </span>
                <span style={{ color: T.textMuted, fontSize: "0.85rem" }}>
                  Order Date: {fmt(order.order_date)}
                </span>
                <span style={{ color: T.textMuted, fontSize: "0.85rem" }}>
                  Store: {order.store_name}
                </span>
              </div>

              {/* Customer section */}
              <div style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 8, padding: "1.25rem", marginBottom: "1rem",
              }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: T.textMuted, marginBottom: "0.75rem" }}>
                  Customer Details
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 1rem", fontSize: "0.9rem" }}>
                  <div>
                    <span style={{ color: T.textMuted }}>Name: </span>
                    <span>{order.customer_name ?? "—"}</span>
                  </div>
                  <div>
                    <span style={{ color: T.textMuted }}>Email: </span>
                    <span>{order.customer_email ?? "—"}</span>
                  </div>
                </div>
                {/* Shipping Address */}
                <div style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
                  <span style={{ color: T.textMuted }}>Shipping Address: </span>
                  {addr ? (
                    <span>
                      {[addr.street, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(", ")}
                    </span>
                  ) : (
                    <span style={{ color: T.textMuted }}>Not on file</span>
                  )}
                </div>
              </div>

              {/* Product section */}
              <div style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 8, padding: "1.25rem", marginBottom: "1rem",
              }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: T.textMuted, marginBottom: "0.75rem" }}>
                  Product Ordered
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  {order.product_mockup_url && (
                    <img
                      src={order.product_mockup_url}
                      alt={order.product_name ?? "Product mockup"}
                      style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg }}
                    />
                  )}
                  <div style={{ fontSize: "0.9rem", display: "grid", gap: "0.4rem" }}>
                    <div><span style={{ color: T.textMuted }}>Product: </span>{order.product_name ?? "—"}</div>
                    <div><span style={{ color: T.textMuted }}>SKU: </span>{order.product_sku ?? "—"}</div>
                    <div><span style={{ color: T.textMuted }}>Qty: </span>{order.quantity}</div>
                    <div>
                      <span style={{ color: T.textMuted }}>Unit: </span>{currency(order.unit_price)}
                      {"  "}
                      <span style={{ color: T.textMuted }}>Total: </span>
                      <strong>{currency(order.total_price)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.order_notes && (
                <div style={{
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 8, padding: "1rem", marginBottom: "1rem", fontSize: "0.875rem",
                }}>
                  <div style={{ color: T.textMuted, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                    Customer Notes
                  </div>
                  {order.order_notes}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
                {order.printify_tracking_url && (
                  <a
                    href={order.printify_tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "0.6rem 1.25rem", background: T.accent, color: T.text,
                      borderRadius: 8, fontWeight: 600, fontSize: "0.875rem",
                      textDecoration: "none", display: "inline-block",
                    }}
                  >
                    Track Order on Printify
                  </a>
                )}
                <button
                  onClick={handleDownloadAssets}
                  style={{
                    padding: "0.6rem 1.25rem", background: T.surface, color: T.text,
                    border: `1px solid ${T.border}`, borderRadius: 8,
                    fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
                  }}
                >
                  Download Assets
                </button>
                <button
                  onClick={() => { setInviteOpen(!inviteOpen); setSupportOpen(false); }}
                  style={{
                    padding: "0.6rem 1.25rem", background: T.surface, color: T.text,
                    border: `1px solid ${T.border}`, borderRadius: 8,
                    fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
                  }}
                >
                  Invite Team
                </button>
                <button
                  onClick={() => { setSupportOpen(!supportOpen); setInviteOpen(false); }}
                  style={{
                    padding: "0.6rem 1.25rem", background: T.surface, color: T.danger,
                    border: `1px solid ${T.danger}44`, borderRadius: 8,
                    fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
                  }}
                >
                  Contact Support
                </button>
              </div>

              {/* Invite Team inline form */}
              {inviteOpen && !inviteResult && (
                <form onSubmit={handleInviteSubmit} style={{
                  marginTop: "1rem", background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 8, padding: "1.25rem",
                }}>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                    Invite Team Members
                  </div>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", color: T.textMuted, marginBottom: "0.3rem" }}>
                      Emails (comma or newline separated)
                    </label>
                    <textarea
                      value={inviteEmails}
                      onChange={(e) => setInviteEmails(e.target.value)}
                      rows={3}
                      placeholder="alice@example.com, bob@example.com"
                      style={{
                        width: "100%", background: T.bg, border: `1px solid ${T.border}`,
                        borderRadius: 6, color: T.text, padding: "0.5rem 0.75rem",
                        fontSize: "0.875rem", resize: "vertical",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", color: T.textMuted, marginBottom: "0.3rem" }}>
                      Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      style={{
                        background: T.bg, border: `1px solid ${T.border}`,
                        borderRadius: 6, color: T.text, padding: "0.5rem 0.75rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: "0.55rem 1.25rem", background: T.accent, color: T.text,
                      border: "none", borderRadius: 6, fontWeight: 600,
                      fontSize: "0.875rem", cursor: "pointer",
                    }}
                  >
                    Send Invitations
                  </button>
                </form>
              )}
              {inviteResult && (
                <div style={{ marginTop: "0.75rem", padding: "0.75rem 1rem", background: "#10b98122", border: `1px solid ${T.statusShipped}44`, borderRadius: 8, color: T.statusShipped, fontSize: "0.875rem" }}>
                  {inviteResult}
                </div>
              )}

              {/* Support escalation inline form */}
              {supportOpen && !supportResult && (
                <form onSubmit={handleSupportSubmit} style={{
                  marginTop: "1rem", background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 8, padding: "1.25rem",
                }}>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                    Contact Support
                  </div>
                  <div style={{ fontSize: "0.8rem", color: T.textMuted, marginBottom: "0.75rem" }}>
                    Domain / store pre-filled: <strong style={{ color: T.text }}>{order.store_name}</strong>
                  </div>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", color: T.textMuted, marginBottom: "0.3rem" }}>
                      Describe the issue
                    </label>
                    <textarea
                      value={supportError}
                      onChange={(e) => setSupportErrorText(e.target.value)}
                      rows={3}
                      placeholder="What went wrong?"
                      style={{
                        width: "100%", background: T.bg, border: `1px solid ${T.border}`,
                        borderRadius: 6, color: T.text, padding: "0.5rem 0.75rem",
                        fontSize: "0.875rem", resize: "vertical",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", color: T.textMuted, marginBottom: "0.3rem" }}>
                      Your email (for follow-up)
                    </label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="you@company.com"
                      style={{
                        width: "100%", background: T.bg, border: `1px solid ${T.border}`,
                        borderRadius: 6, color: T.text, padding: "0.5rem 0.75rem",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: "0.55rem 1.25rem", background: T.danger, color: T.text,
                      border: "none", borderRadius: 6, fontWeight: 600,
                      fontSize: "0.875rem", cursor: "pointer",
                    }}
                  >
                    Submit Support Request
                  </button>
                </form>
              )}
              {supportResult && (
                <div style={{ marginTop: "0.75rem", padding: "0.75rem 1rem", background: "#3b0a0a22", border: `1px solid ${T.danger}44`, borderRadius: 8, color: "#fca5a5", fontSize: "0.875rem" }}>
                  {supportResult}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Main Orders Dashboard ----------
export default function OrdersDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchOrders = useCallback(async (store: string, from: string, to: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (store && store !== "all") params.set("store", store);
      if (from) params.set("dateFrom", from);
      if (to) params.set("dateTo", to);
      const res = await fetch(`/api/orders?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { orders: Order[]; stores: string[]; total: number };
      setOrders(data.orders ?? []);
      setStores(data.stores ?? []);
      setLastSync(new Date().toISOString());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  // Load orders on mount
  useEffect(() => {
    fetchOrders("all", "", "");
  }, [fetchOrders]);

  // Periodic sync every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncing(true);
      fetchOrders(selectedStore, dateFrom, dateTo);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchOrders, selectedStore, dateFrom, dateTo]);

  function handleApplyFilters(e: React.FormEvent) {
    e.preventDefault();
    fetchOrders(selectedStore, dateFrom, dateTo);
  }

  function relTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 2) return "just now";
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  }

  return (
    <main style={{ minHeight: "100vh", background: T.bg, color: T.text, padding: "2rem 1.5rem 4rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1rem", marginBottom: "2rem",
          padding: "1.5rem", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
        }}>
          <div>
            <div style={{
              display: "inline-block", padding: "0.25rem 0.75rem",
              background: `${T.accent}22`, color: T.accent,
              borderRadius: 20, fontSize: "0.7rem", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem",
            }}>
              Order Dashboard
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", color: T.text, margin: 0 }}>
              Orders
            </h1>
            <p style={{ color: T.textMuted, fontSize: "0.875rem", marginTop: "0.25rem" }}>
              All orders across your storefronts with Printify fulfillment status
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.35rem 0.875rem", background: T.bg, border: `1px solid ${T.border}`,
              borderRadius: 20, fontSize: "0.78rem", color: T.textMuted,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: syncing ? T.statusInProgress : T.statusShipped, display: "inline-block" }} />
              {syncing ? "Syncing…" : lastSync ? `Synced ${relTime(lastSync)}` : "Loading…"}
            </div>
          </div>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleApplyFilters}
          style={{
            display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end",
            padding: "1.25rem 1.5rem", background: T.surface,
            border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: "1.5rem",
          }}
        >
          {/* Store filter */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: T.textMuted, marginBottom: "0.3rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Store
            </label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              style={{
                background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6,
                color: T.text, padding: "0.5rem 0.875rem", fontSize: "0.875rem", minWidth: 180,
              }}
            >
              <option value="all">All Stores</option>
              {stores.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: T.textMuted, marginBottom: "0.3rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{
                background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6,
                color: T.text, padding: "0.5rem 0.875rem", fontSize: "0.875rem",
                colorScheme: "dark",
              }}
            />
          </div>

          {/* Date To */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: T.textMuted, marginBottom: "0.3rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{
                background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6,
                color: T.text, padding: "0.5rem 0.875rem", fontSize: "0.875rem",
                colorScheme: "dark",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "0.55rem 1.5rem", background: T.accent, color: T.text,
              border: "none", borderRadius: 6, fontWeight: 600,
              fontSize: "0.875rem", cursor: "pointer",
            }}
          >
            Apply
          </button>
        </form>

        {/* Error */}
        {error && (
          <div style={{
            padding: "1rem 1.25rem", background: "#3b0a0a", border: `1px solid ${T.danger}`,
            borderRadius: 8, color: "#fca5a5", fontSize: "0.875rem", marginBottom: "1rem",
          }}>
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div style={{ border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1.8fr 1.4fr 1.6fr 1fr 1fr",
            padding: "0.625rem 1.25rem",
            background: T.surface,
            borderBottom: `2px solid ${T.border}`,
            fontSize: "0.72rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.06em",
            color: T.textMuted,
          }}>
            <span>Order ID</span>
            <span>Customer</span>
            <span>Store</span>
            <span>Product</span>
            <span>Date</span>
            <span>Status</span>
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: T.textMuted, background: T.bg }}>
              Loading orders…
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: T.textMuted, background: T.bg }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📦</div>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>No orders yet</div>
              <div style={{ fontSize: "0.875rem" }}>
                Orders from your Shopify storefronts will appear here after the first purchase.
              </div>
            </div>
          ) : (
            orders.map((order, i) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.8fr 1.4fr 1.6fr 1fr 1fr",
                  padding: "0.875rem 1.25rem",
                  background: i % 2 === 0 ? T.bg : `${T.surface}88`,
                  borderBottom: `1px solid ${T.border}`,
                  fontSize: "0.85rem", alignItems: "center",
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${T.accent}18`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? T.bg : `${T.surface}88`)}
              >
                <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: T.textMuted }}>
                  {order.shopify_order_id ? `#${order.shopify_order_id}` : order.id.slice(0, 8) + "…"}
                </span>
                <div>
                  <div style={{ fontWeight: 500 }}>{order.customer_name ?? "—"}</div>
                  <div style={{ fontSize: "0.78rem", color: T.textMuted }}>{order.customer_email ?? "—"}</div>
                </div>
                <span>{order.store_name}</span>
                <div>
                  <div style={{ fontWeight: 500 }}>{order.product_name ?? "—"}</div>
                  <div style={{ fontSize: "0.78rem", color: T.textMuted }}>{order.product_sku ?? ""}</div>
                </div>
                <span style={{ color: T.textMuted }}>{fmt(order.order_date)}</span>
                <span style={{
                  padding: "0.2rem 0.625rem", borderRadius: 20,
                  background: `${statusColor(order.fulfillment_status)}22`,
                  color: statusColor(order.fulfillment_status),
                  fontSize: "0.75rem", fontWeight: 700, textTransform: "capitalize",
                  display: "inline-block",
                }}>
                  {order.fulfillment_status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Download Brand Assets CTA at bottom */}
        {!loading && (
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <a
              href="/api/brand-assets/download"
              download
              style={{
                padding: "0.6rem 1.25rem", background: T.surface, color: T.text,
                border: `1px solid ${T.border}`, borderRadius: 8,
                fontWeight: 600, fontSize: "0.875rem", textDecoration: "none",
                display: "inline-block",
              }}
            >
              Download Brand Assets
            </a>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </main>
  );
}
