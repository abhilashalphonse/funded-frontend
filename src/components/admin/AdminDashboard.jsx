import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, BarChart3, Bell, ChevronRight, CircleDollarSign,
  CreditCard, FileClock, Gauge, LayoutDashboard, LifeBuoy, ListChecks, LogOut,
  Menu, RefreshCw, Search, Settings2, ShieldAlert, SlidersHorizontal, Users,
  WalletCards, X, Zap
} from "lucide-react";
import { useAuth } from "../../AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "";

const NAV = [
  { label: "Overview", items: [{ id: "overview", label: "Overview", icon: LayoutDashboard }] },
  { label: "Customers", items: [{ id: "users", label: "Users", icon: Users }] },
  { label: "Challenges", items: [
    { id: "challenges", label: "Challenges", icon: Gauge },
    { id: "trials", label: "Free Trials", icon: Zap },
  ] },
  { label: "Funded", items: [
    { id: "funded", label: "Funded Accounts", icon: WalletCards },
    { id: "payouts", label: "Payouts", icon: CircleDollarSign },
  ] },
  { label: "Commerce", items: [
    { id: "orders", label: "Orders", icon: ListChecks },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "refunds", label: "Refunds", icon: RefreshCw },
  ] },
  { label: "Trading", items: [
    { id: "trades", label: "Trades", icon: Activity },
  ] },
  { label: "Risk", items: [
    { id: "risk", label: "Risk Overview", icon: ShieldAlert },
    { id: "breaches", label: "Breaches", icon: AlertTriangle },
  ] },
  { label: "Growth", items: [
    { id: "funnel", label: "Funnel", icon: BarChart3 },
    { id: "revenue", label: "Revenue", icon: Activity },
    { id: "affiliates", label: "Affiliates", icon: Users },
  ] },
  { label: "Support", items: [{ id: "support", label: "Cases", icon: LifeBuoy }] },
  { label: "Operations", items: [
    { id: "jobs", label: "Jobs", icon: FileClock },
    { id: "integrations", label: "Integrations", icon: Activity },
    { id: "errors", label: "Errors", icon: AlertTriangle },
  ] },
  { label: "Configuration", items: [
    { id: "products", label: "Challenge Products", icon: Settings2 },
    { id: "pricing", label: "Pricing", icon: SlidersHorizontal },
    { id: "platforms", label: "Trading Platforms", icon: Gauge },
  ] },
  { label: "Admin", items: [
    { id: "admins", label: "Admin Users", icon: Users },
    { id: "audit", label: "Audit Log", icon: FileClock },
  ] },
];

const TITLES = {
  overview: ["Overview", "Business health and actions requiring attention"],
  users: ["Users", "Canonical customer records and lifecycle activity"],
  challenges: ["Challenges", "Paid evaluation accounts and challenge state"],
  trials: ["Free Trials", "Demo evaluations and conversion readiness"],
  funded: ["Funded Accounts", "Accounts in funded review or funded state"],
  payouts: ["Payouts", "Payout eligibility and review workflow"],
  orders: ["Orders", "Checkout, payment and activation lifecycle"],
  payments: ["Payments", "Provider payment records"],
  refunds: ["Refunds", "Refund workflow and provider state"],
  risk: ["Risk Overview", "Breaches, locked accounts and provisioning failures"],
  breaches: ["Breaches", "Rule-engine failures requiring review"],
  trades: ["Trades", "Recent ACG Trader executions across customer accounts"],
  funnel: ["Funnel", "Acquisition to paid challenge conversion"],
  revenue: ["Revenue", "Revenue and paid-order performance"],
  support: ["Support Cases", "Customer conversations escalated for human review"],
  jobs: ["Jobs", "Background work and provisioning operations"],
  integrations: ["Integrations", "Operational configuration and service readiness"],
  errors: ["Errors", "Application and integration failures requiring attention"],
  products: ["Challenge Products", "Published challenge definitions and versions"],
  pricing: ["Pricing", "Commercial pricing configuration"],
  platforms: ["Trading Platforms", "Available trading integrations"],
  affiliates: ["Affiliates", "Acquisition partners, attributed sales and commissions"],
  admins: ["Admin Users", "Accounts authorized to operate the admin dashboard"],
  audit: ["Audit Log", "Immutable record of privileged admin actions"],
};

const money = (value, currency = "USD") => {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(number);
};

const dateTime = value => value ? new Date(value).toLocaleString() : "—";
const pct = value => `${Number(value || 0).toFixed(2)}%`;
const humanize = value => String(value || "—").replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
const signedMoney = (value, currency = "USD") => {
  const number = Number(value || 0);
  const formatted = money(Math.abs(number), currency);
  return number > 0 ? `+${formatted}` : number < 0 ? `-${formatted}` : formatted;
};
const lossPct = (lossAmount, baseAmount) => {
  const loss = Number(lossAmount || 0);
  const base = Number(baseAmount || 0);
  if (!Number.isFinite(loss) || !Number.isFinite(base) || base <= 0) return "0.00%";
  return `${((loss / base) * 100).toFixed(2)}%`;
};
const lossBase = account => Number(account?.initialDeposit || account?.accountSize || 0);
const lossLimitAmount = (account, rulePercent) => lossBase(account) * Number(rulePercent || 0) / 100;
const statusTone = status => {
  const s = String(status || "").toUpperCase();
  if (["PAID", "ACTIVE", "FUNDED", "PASSED", "HEALTHY", "CONFIGURED", "READY", "OPEN"].includes(s)) return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
  if (["FAILED", "BREACHED", "BLOCKED", "CLOSED", "NOT_CONFIGURED"].includes(s)) return "text-red-300 bg-red-400/10 border-red-400/20";
  if (["PENDING", "WAITING", "CONFIRMING", "PHASE_2", "FUNDED_REVIEW", "ESCALATED", "LOCKED", "DEVELOPMENT", "NOT_INTEGRATED"].includes(s)) return "text-amber-300 bg-amber-400/10 border-amber-400/20";
  return "text-zinc-300 bg-white/5 border-white/10";
};

function Badge({ children }) {
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${statusTone(children)}`}>{children || "—"}</span>;
}

function Kpi({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#111] p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-white">{value}</p>
      {detail && <p className="mt-1 text-[11px] text-zinc-500">{detail}</p>}
    </div>
  );
}

function Empty({ title, text }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
      <p className="text-sm font-semibold text-zinc-200">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-zinc-500">{text}</p>
    </div>
  );
}

function Loading() {
  return <div className="flex min-h-[320px] items-center justify-center"><div className="size-6 animate-spin rounded-full border-2 border-white/15 border-t-white" /></div>;
}

function DataTable({ columns, rows, onRow, empty = "No records found." }) {
  if (!rows?.length) return <Empty title={empty} text="Adjust the current filters or check again when new activity is recorded." />;
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#0f0f0f]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="border-b border-white/[0.07] bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
            <tr>{columns.map(col => <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium">{col.label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {rows.map((row, index) => (
              <tr key={row._id || row.customerId || row.accountId || row.orderId || row.conversationId || index}
                onClick={() => onRow?.(row)}
                className={onRow ? "cursor-pointer transition hover:bg-white/[0.035]" : ""}>
                {columns.map(col => <td key={col.key} className="whitespace-nowrap px-4 py-3 text-zinc-300">{col.render ? col.render(row) : row[col.key] ?? "—"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Inspector({ title, subtitle, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-[#0b0b0b] shadow-2xl" onMouseDown={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/[0.07] bg-[#0b0b0b]/95 px-6 py-5 backdrop-blur">
          <div><h2 className="text-lg font-semibold tracking-[-0.03em] text-white">{title}</h2><p className="mt-1 text-xs text-zinc-500">{subtitle}</p></div>
          <button onClick={onClose} className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:bg-white/5 hover:text-white"><X size={15} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ action, entity, onClose, onConfirm, busy }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 px-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-5" onMouseDown={e => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-white">{action.label}</h3>
        <p className="mt-1 text-xs text-zinc-500">{entity}</p>
        <label className="mt-5 block text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">Reason</label>
        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-white/25"
          placeholder="Required for the audit log" />
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/5">Cancel</button>
          <button disabled={!reason.trim() || busy} onClick={() => onConfirm(reason)}
            className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black disabled:opacity-40">{busy ? "Applying…" : action.label}</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, getAccessToken, signOut } = useAuth();
  const initialPage = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("page") || "overview" : "overview";
  const [page, setPage] = useState(TITLES[initialPage] ? initialPage : "overview");
  const [data, setData] = useState(null);
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [days, setDays] = useState("30");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [action, setAction] = useState(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [supportReply, setSupportReply] = useState("");
  const [supportBusy, setSupportBusy] = useState(false);

  const adminFetch = useCallback(async (path, options = {}) => {
    const token = await getAccessToken();
    if (!token) throw new Error("Your admin session has expired.");
    const response = await fetch(`${API_URL}/api/admin${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const err = new Error(payload?.message || `Admin request failed (${response.status}).`);
      err.status = response.status;
      throw err;
    }
    return payload.data;
  }, [getAccessToken]);

  const endpoint = useMemo(() => {
    const q = search.trim() ? `&q=${encodeURIComponent(search.trim())}` : "";
    const s = status ? `&status=${encodeURIComponent(status)}` : "";
    if (page === "overview") return "/overview";
    if (page === "users") return `/users?limit=100${q}${s}`;
    if (page === "challenges") return `/challenges?limit=100${q}${s}`;
    if (page === "trials") return `/challenges?mode=DEMO&limit=100${q}${s}`;
    if (page === "funded") return `/challenges?funded=true&limit=100${q}`;
    if (page === "orders") return `/orders?limit=100${q}${s}`;
    if (page === "payments") return `/payments?limit=100${q}${s}`;
    if (page === "trades") return "/trades?limit=200";
    if (page === "risk" || page === "breaches") return "/risk";
    if (page === "funnel" || page === "revenue") return `/funnel?days=${days}`;
    if (page === "support") return `/support?limit=100${q}${s}`;
    if (page === "audit") return "/audit?limit=100";
    if (page === "admins") return "/admin-users";
    if (["jobs", "integrations", "errors", "payouts", "refunds", "products", "pricing", "platforms", "affiliates"].includes(page)) return "/system";
    return "/overview";
  }, [page, search, status, days]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await adminFetch(endpoint);
      setData(result);
      if (endpoint === "/system") setSystem(result);
    } catch (err) {
      setError(err.message || "Unable to load admin data.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [adminFetch, endpoint]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("page", page);
    window.history.replaceState({}, "", url);
  }, [page]);

  const changePage = id => {
    setPage(id);
    setSearch("");
    setStatus("");
    setSelected(null);
    setSelectedDetail(null);
    setSidebarOpen(false);
  };

  const openRow = async row => {
    setSelected(row);
    setSelectedDetail(null);
    try {
      if (page === "users") setSelectedDetail(await adminFetch(`/users/${encodeURIComponent(row.customerId)}`));
      if (["challenges", "trials", "funded", "breaches"].includes(page)) setSelectedDetail(await adminFetch(`/challenges/${encodeURIComponent(row.accountId)}`));
      if (page === "orders" || page === "payments") setSelectedDetail({ payment: row });
      if (page === "trades" && row.account?.externalRef) {
        const detail = await adminFetch(`/challenges/${encodeURIComponent(row.account.externalRef)}`);
        setSelected({
          ...row,
          accountId: detail?.account?.accountId || row.account.externalRef,
          accountMode: detail?.account?.accountMode,
          accountSize: detail?.account?.accountSize,
        });
        setSelectedDetail(detail);
      }
      if (page === "support") {
        setSupportReply("");
        setSelectedDetail(await adminFetch(`/support/${encodeURIComponent(row.conversationId)}`));
      }
    } catch (err) {
      setSelectedDetail({ error: err.message });
    }
  };

  const performAction = async reason => {
    if (!action) return;
    setActionBusy(true);
    try {
      if (action.type === "customer") {
        await adminFetch(`/users/${encodeURIComponent(action.id)}/status`, { method: "POST", body: JSON.stringify({ status: action.value, reason }) });
      } else if (action.type === "payment") {
        await adminFetch(`/payments/${encodeURIComponent(action.id)}/retry-activation`, { method: "POST", body: JSON.stringify({ reason }) });
      } else if (action.type === "upiGateway") {
        await adminFetch("/upi-gateways/active", { method: "POST", body: JSON.stringify({ gatewayId: action.value, reason }) });
      } else {
        await adminFetch(`/challenges/${encodeURIComponent(action.id)}/action`, { method: "POST", body: JSON.stringify({ action: action.value, reason }) });
      }
      setAction(null);
      setSelected(null);
      setSelectedDetail(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const rows = data?.rows || [];

  const toolbar = !["overview", "risk", "breaches", "funnel", "revenue", "jobs", "integrations", "errors", "payouts", "refunds", "products", "pricing", "platforms", "affiliates", "admins", "audit"].includes(page);


  const sendHumanSupportReply = async () => {
    const conversationId = selectedDetail?.conversation?.conversationId;
    const message = supportReply.trim();
    if (!conversationId || !message || supportBusy) return;
    setSupportBusy(true);
    try {
      await adminFetch(`/support/${encodeURIComponent(conversationId)}/reply`, {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      setSupportReply("");
      setSelectedDetail(await adminFetch(`/support/${encodeURIComponent(conversationId)}`));
      await load();
    } catch (err) {
      setError(err?.message || "Unable to send support reply.");
    } finally {
      setSupportBusy(false);
    }
  };

  const closeSupportCase = async () => {
    const conversationId = selectedDetail?.conversation?.conversationId;
    if (!conversationId || supportBusy) return;
    setSupportBusy(true);
    try {
      await adminFetch(`/support/${encodeURIComponent(conversationId)}/close`, {
        method: "POST",
        body: JSON.stringify({ reason: "Resolved by human support" }),
      });
      setSelectedDetail(await adminFetch(`/support/${encodeURIComponent(conversationId)}`));
      await load();
    } catch (err) {
      setError(err?.message || "Unable to close support case.");
    } finally {
      setSupportBusy(false);
    }
  };

  const renderOverview = () => {
    const k = data?.kpis || {};
    const funnel = data?.funnel?.byEvent || {};
    return (
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Revenue Today" value={money(k.revenueToday)} detail={`${k.paidChallengesToday || 0} paid challenges`} />
          <Kpi label="New Users Today" value={k.newUsersToday || 0} detail={`${k.totalUsers || 0} active customers`} />
          <Kpi label="Active Challenges" value={k.activeChallenges || 0} detail={`${k.activeTrials || 0} active trials`} />
          <Kpi label="Funded Accounts" value={k.fundedAccounts || 0} detail={`${k.payoutReview || 0} in funded review`} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Breaches Today" value={k.breachedToday || 0} />
          <Kpi label="Provisioning Attention" value={k.pendingProvisioning || 0} />
          <Kpi label="Failed Payments Today" value={k.failedPaymentsToday || 0} />
          <Kpi label="Human Support Queue" value={k.supportEscalated || 0} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
          <section className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-5">
            <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold text-white">30-day funnel</h3><p className="mt-1 text-xs text-zinc-500">Unique sessions/events captured by the current analytics layer.</p></div><button onClick={() => changePage("funnel")} className="text-xs text-zinc-400 hover:text-white">View funnel</button></div>
            <div className="mt-5 space-y-3">
              {[
                ["landing_view", "Visitors"], ["signup_completed", "Registrations"], ["trial_created", "Free trials"],
                ["trial_first_trade", "Activated trial"], ["checkout_started", "Checkout"], ["payment_completed", "Paid"],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between border-b border-white/[0.05] pb-3 last:border-0">
                  <span className="text-xs text-zinc-400">{label}</span>
                  <span className="text-sm font-semibold text-white">{funnel[key]?.sessions || funnel[key]?.events || 0}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-5">
            <h3 className="text-sm font-semibold text-white">Requires attention</h3>
            <div className="mt-4 space-y-2">
              {[
                ["Provisioning", k.pendingProvisioning, "orders"],
                ["Failed payments", k.failedPaymentsToday, "payments"],
                ["Breaches", k.breachedToday, "breaches"],
                ["Support escalations", k.supportEscalated, "support"],
              ].map(([label, value, destination]) => (
                <button key={label} onClick={() => changePage(destination)} className="flex w-full items-center justify-between rounded-lg border border-white/[0.06] px-3 py-3 text-left hover:bg-white/[0.03]">
                  <span className="text-xs text-zinc-400">{label}</span><span className="flex items-center gap-2 text-sm font-semibold text-white">{value || 0}<ChevronRight size={13} className="text-zinc-600" /></span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <section><h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Recent payments</h3>
            <DataTable rows={data?.recentPayments || []} columns={[
              { key: "orderId", label: "Order" }, { key: "email", label: "Customer" },
              { key: "amount", label: "Amount", render: r => money(r.amount, r.currency || "EUR") },
              { key: "status", label: "Status", render: r => <Badge>{r.status}</Badge> },
            ]} />
          </section>
          <section><h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Recent accounts</h3>
            <DataTable rows={data?.recentAccounts || []} columns={[
              { key: "accountId", label: "Account" }, { key: "accountSize", label: "Size", render: r => money(r.accountSize, "USD") },
              { key: "accountMode", label: "Type" }, { key: "status", label: "Status", render: r => <Badge>{r.status}</Badge> },
            ]} />
          </section>
        </div>
      </div>
    );
  };

  const renderUsers = () => <DataTable rows={rows} onRow={openRow} columns={[
    { key: "primaryEmail", label: "User" },
    { key: "customerId", label: "Customer ID" },
    { key: "createdAt", label: "Joined", render: r => dateTime(r.createdAt) },
    { key: "lastAuthenticatedAt", label: "Last Login", render: r => dateTime(r.lastAuthenticatedAt) },
    { key: "challenges", label: "Challenges", render: r => r.stats?.challenges || 0 },
    { key: "trials", label: "Trials", render: r => r.stats?.trials || 0 },
    { key: "funded", label: "Funded", render: r => r.stats?.funded || 0 },
    { key: "spend", label: "Spend", render: r => money(r.stats?.totalSpend || 0) },
    { key: "status", label: "Status", render: r => <Badge>{r.status}</Badge> },
  ]} />;

  const challengeColumns = [
    { key: "accountId", label: "Account" },
    { key: "customerId", label: "Customer" },
    { key: "accountSize", label: "Size", render: r => money(r.accountSize, "USD") },
    { key: "challengeType", label: "Type" },
    { key: "currentPhase", label: "Phase", render: r => r.currentPhase || 1 },
    { key: "platform", label: "Platform" },
    { key: "profit", label: "Profit", render: r => money(r.projections?.profit || 0, "USD") },
    {
      key: "dailyLoss",
      label: "Daily Loss",
      render: r => `${lossPct(r.projections?.dailyLoss, lossBase(r))} · ${money(r.projections?.dailyLoss || 0, "USD")}`,
    },
    { key: "tradingDays", label: "Days", render: r => r.projections?.tradingDays || 0 },
    { key: "status", label: "Status", render: r => <Badge>{r.status}</Badge> },
  ];

  const renderChallenges = () => <DataTable rows={rows} onRow={openRow} columns={challengeColumns} />;

  const paymentColumns = [
    { key: "orderId", label: "Order" },
    { key: "email", label: "Customer" },
    { key: "amount", label: "Amount", render: r => money(r.amount, r.currency || "EUR") },
    { key: "paymentMethod", label: "Method" },
    { key: "provider", label: "Provider" },
    { key: "providerPaymentId", label: "Provider Ref" },
    { key: "accountId", label: "Account" },
    { key: "createdAt", label: "Created", render: r => dateTime(r.createdAt) },
    { key: "status", label: "Status", render: r => <Badge>{r.status}</Badge> },
  ];

  const renderTrades = () => {
    const term = search.trim().toLowerCase();
    const items = (data?.items || []).filter(row => {
      if (!term) return true;
      return [
        row.dealId,
        row.symbol,
        row.side,
        row.type,
        row.account?.accountCode,
        row.account?.externalRef,
        row.account?.ownerExternalRef,
        row.account?.accountType,
      ].some(value => String(value || "").toLowerCase().includes(term));
    });

    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Executions Loaded" value={items.length} detail={data?.page?.hasMore ? "Showing latest 200 · more history available" : "Latest execution history"} />
          <Kpi label="Realized P&L" value={signedMoney(items.reduce((sum, item) => sum + Number(item.realizedPnl || 0), 0))} />
          <Kpi label="Commission" value={money(items.reduce((sum, item) => sum + Math.abs(Number(item.commission || 0)), 0))} />
          <Kpi label="Accounts" value={new Set(items.map(item => item.account?.externalRef).filter(Boolean)).size} />
        </div>
        <DataTable
          rows={items}
          onRow={openRow}
          empty="No matching executions."
          columns={[
            { key: "executedAt", label: "Executed", render: r => dateTime(r.executedAt) },
            { key: "account", label: "Account", render: r => r.account?.externalRef || r.account?.accountCode || "—" },
            { key: "accountType", label: "Type", render: r => r.account?.accountType || "—" },
            { key: "symbol", label: "Symbol" },
            { key: "side", label: "Side", render: r => <Badge>{r.side}</Badge> },
            { key: "type", label: "Execution" },
            { key: "volume", label: "Volume" },
            { key: "price", label: "Price" },
            { key: "spreadPoints", label: "Spread", render: r => r.spreadPoints ?? "—" },
            { key: "commission", label: "Commission", render: r => money(r.commission || 0) },
            { key: "swap", label: "Swap", render: r => money(r.swap || 0) },
            { key: "realizedPnl", label: "Realized P&L", render: r => signedMoney(r.realizedPnl || 0) },
            { key: "dealId", label: "Deal ID" },
          ]}
        />
      </div>
    );
  };

  const renderRisk = () => {
    const breachRows = page === "breaches" ? (data?.breached || []) : [...(data?.breached || []), ...(data?.locked || []), ...(data?.failedProvisioning || [])];
    return (
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Breached" value={data?.breached?.length || 0} />
          <Kpi label="Locked" value={data?.locked?.length || 0} />
          <Kpi label="Funded Review" value={data?.fundedReview?.length || 0} />
          <Kpi label="Provisioning Failed" value={data?.failedProvisioning?.length || 0} />
        </div>
        <DataTable rows={breachRows} onRow={openRow} columns={challengeColumns} />
      </div>
    );
  };

  const renderFunnel = () => {
    const e = data?.byEvent || {};
    const k = data?.kpis || {};
    const acquisition = data?.acquisition || [];
    const countFor = key => {
      if (key === "trial_outcome") return Number(k.trialOutcomes || 0);
      return Number(e[key]?.sessions || e[key]?.events || 0);
    };
    const stages = [
      ["landing_view", "Visitors"],
      ["signup_completed", "Registrations"],
      ["trial_created", "Free trials"],
      ["trial_first_trade", "Activated trials"],
      ["trial_outcome", "Trial outcome"],
      ["checkout_started", "Checkout"],
      ["payment_completed", "Paid"],
    ];
    const first = countFor(stages[0][0]);
    const acquisitionColumns = [
      { key: "source", label: "Source" },
      { key: "campaign", label: "Campaign", render: row => row.campaign || "—" },
      { key: "creatorId", label: "Creator", render: row => row.creatorId || "—" },
      { key: "creativeId", label: "Creative", render: row => row.creativeId || "—" },
      { key: "market", label: "Market", render: row => row.market || "—" },
      { key: "language", label: "Language", render: row => row.language || "—" },
      { key: "registrations", label: "Registrations" },
      { key: "trialsCreated", label: "Trials" },
      { key: "activatedTrials", label: "Activated" },
      { key: "paidConversions", label: "Paid" },
      { key: "revenue", label: "Revenue", render: row => money(row.revenue) },
    ];

    return (
      <div className="space-y-5">
        <div className="flex gap-2">{["7","30","90"].map(v => <button key={v} onClick={() => setDays(v)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${days===v ? "border-white bg-white text-black" : "border-white/10 text-zinc-400"}`}>{v}D</button>)}</div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Registrations" value={k.registrations || 0} detail={`${pct((k.visitorToRegistration || 0) * 100)} visitor → registration`} />
          <Kpi label="Activated Trials" value={k.activatedTrials || 0} detail={`${pct((k.trialToActivation || 0) * 100)} trial → first trade`} />
          <Kpi label="Paid Conversions" value={k.paidConversions || 0} detail={`${pct((k.checkoutToPaid || 0) * 100)} checkout → paid`} />
          <Kpi label="Attributed Revenue" value={money(k.revenue || 0)} detail={`${k.trialOutcomes || 0} trial outcomes · ${k.trialPassed || 0} passed · ${k.trialFailed || 0} failed`} />
        </div>

        <div className="grid gap-3 lg:grid-cols-4">
          {stages.map(([key,label], i) => {
            const count = countFor(key);
            const previous = i === 0 ? 0 : countFor(stages[i - 1][0]);
            const stepConversion = i === 0 ? 100 : previous ? (count / previous) * 100 : 0;
            const overall = first ? (count / first) * 100 : 0;
            return <div key={key} className="rounded-xl border border-white/[0.07] bg-[#111] p-4">
              <p className="text-xs text-zinc-500">{label}</p><p className="mt-2 text-2xl font-semibold text-white">{count}</p>
              <div className="mt-3 flex justify-between text-[10px] text-zinc-500"><span>Step {pct(stepConversion)}</span><span>Overall {pct(overall)}</span></div>
            </div>;
          })}
        </div>

        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Acquisition sources</h3>
            <p className="mt-1 text-xs text-zinc-500">First-touch attribution from campaign → creator → creative through trial activation and paid conversion.</p>
          </div>
          <DataTable
            rows={acquisition}
            columns={acquisitionColumns}
            empty="No attributed acquisition activity yet."
          />
        </section>
      </div>
    );
  };

  const renderRevenue = () => {
    const paid = data?.byEvent?.payment_completed?.events || 0;
    const activated = data?.byEvent?.challenge_activated?.events || 0;
    return <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-3"><Kpi label="Paid events" value={paid} /><Kpi label="Activated challenges" value={activated} /><Kpi label="Window" value={`${days} days`} /></div><Empty title="Revenue ledger analytics are not yet materialized" text="The current backend stores payment records and funnel events. Revenue-by-product, country, affiliate, refunds and chargebacks should be added after the payment ledger/refund workflow is implemented." /></div>;
  };

  const renderSupport = () => <DataTable rows={rows} onRow={openRow} columns={[
    { key: "conversationId", label: "Case" },
    { key: "channel", label: "Channel", render: r => <Badge>{r.channel || "WEB"}</Badge> },
    { key: "customer", label: "Customer", render: r => r.email?.customerEmail || r.customerId || "Anonymous" },
    { key: "subject", label: "Subject", render: r => r.email?.subject || "Web support" },
    { key: "category", label: "Category" },
    { key: "lastMessageAt", label: "Last Activity", render: r => dateTime(r.lastMessageAt) },
    { key: "status", label: "Status", render: r => <Badge>{r.status}</Badge> },
  ]} />;

  const renderSystem = () => (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{(data?.services || []).map(item => <div key={item.name} className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#111] px-4 py-4"><div><p className="text-sm font-medium text-zinc-200">{item.name}</p><p className="mt-1 text-[11px] text-zinc-600">Operational configuration</p></div><Badge>{item.status}</Badge></div>)}</div>

      {page === "integrations" && (
        <section className="rounded-xl border border-white/[0.07] bg-[#111] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">UPI payment routing</h3>
              <p className="mt-1 max-w-2xl text-[11px] leading-5 text-zinc-500">The active gateway is used only for new UPI checkouts. Existing and pending payments remain pinned to the gateway that created them.</p>
            </div>
            <Badge>{data?.upiGateways?.find(item => item.active)?.label || "NO ACTIVE GATEWAY"}</Badge>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(data?.upiGateways || []).map(gateway => {
              const canActivate = gateway.implemented && gateway.configured && !gateway.active;
              const detail = gateway.active
                ? "Used for new UPI payments"
                : !gateway.implemented
                  ? "Adapter not integrated yet"
                  : !gateway.configured
                    ? "Backend configuration is incomplete"
                    : "Configured and ready to activate";
              return (
                <div key={gateway.id} className={`rounded-xl border p-4 ${gateway.active ? "border-emerald-400/20 bg-emerald-400/[0.04]" : "border-white/[0.07] bg-black/20"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{gateway.label}</p>
                      <p className="mt-1 text-[11px] text-zinc-500">{detail}</p>
                    </div>
                    <Badge>{gateway.status}</Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-600">{gateway.active ? "Current route" : "Available route"}</span>
                    <button
                      type="button"
                      disabled={!canActivate}
                      onClick={() => setAction({ type: "upiGateway", id: gateway.id, value: gateway.id, label: `Activate ${gateway.label}` })}
                      className="rounded-lg border border-white/[0.09] px-3 py-2 text-[11px] font-semibold text-zinc-200 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      {gateway.active ? "Active" : gateway.implemented && gateway.configured ? "Activate" : "Unavailable"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="rounded-xl border border-white/[0.07] bg-[#111] p-5"><h3 className="text-sm font-semibold text-white">Runtime</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Environment</p><p className="mt-1 text-sm text-zinc-300">{data?.environment}</p></div><div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Trading provider</p><p className="mt-1 text-sm text-zinc-300">{data?.tradingProvider}</p></div></div></div>
    </div>
  );

  const capability = key => system?.capabilities?.[key] ?? data?.capabilities?.[key];

  const unavailable = (title, text, capabilityKey) => (
    <Empty title={title} text={capabilityKey && capability(capabilityKey) === false ? `${text} The backend explicitly reports this capability as not connected, so the admin does not fabricate state.` : text} />
  );

  const renderAudit = () => <DataTable rows={rows} columns={[
    { key: "createdAt", label: "Timestamp", render: r => dateTime(r.createdAt) },
    { key: "adminEmail", label: "Admin" }, { key: "action", label: "Action" }, { key: "entityType", label: "Entity Type" },
    { key: "entityId", label: "Entity" }, { key: "reason", label: "Reason" }, { key: "ip", label: "IP" },
  ]} />;

  const renderContent = () => {
    if (loading) return <Loading />;
    if (error) return <Empty title="Admin data could not be loaded" text={error} />;
    if (page === "overview") return renderOverview();
    if (page === "users") return renderUsers();
    if (["challenges","trials","funded"].includes(page)) return renderChallenges();
    if (page === "orders" || page === "payments") return <DataTable rows={rows} columns={paymentColumns} onRow={openRow} />;
    if (page === "trades") return renderTrades();
    if (page === "risk" || page === "breaches") return renderRisk();
    if (page === "funnel") return renderFunnel();
    if (page === "revenue") return renderRevenue();
    if (page === "support") return renderSupport();
    if (page === "integrations" || page === "platforms") return renderSystem();
    if (page === "admins") return <div className="space-y-4"><DataTable rows={rows} columns={[
      { key: "email", label: "Admin" },
      { key: "role", label: "Role" },
      { key: "source", label: "Source" },
      { key: "current", label: "Current", render: r => r.current ? <Badge>ACTIVE</Badge> : "—" },
    ]} /><p className="text-xs text-zinc-600">{data?.note}</p></div>;
    if (page === "audit") return renderAudit();
    if (page === "payouts") return unavailable("Payout workflow is not connected yet", "Funded-review accounts are visible, but the backend currently has no payout entity or payout processing lifecycle.", "payouts");
    if (page === "refunds") return unavailable("Refund workflow is not connected yet", "Payments can reach REFUNDED from the provider, but there is not yet a first-class admin refund request/approval workflow.", "refunds");
    if (page === "products") return unavailable("Challenge product admin is not connected yet", "Current challenge rules/pricing are code-driven. Product versioning should be introduced before making these editable.", "challengeProductAdmin");
    if (page === "pricing") return unavailable("Pricing admin is not connected yet", "Pricing is currently code-driven. Publishing mutable pricing without version snapshots would risk changing historical challenge terms.", "pricingAdmin");
    if (page === "platforms") return renderSystem();
    if (page === "jobs") return unavailable("Job inspection is not exposed yet", "The backend uses pg-boss workers, but there is no safe operator read API for job payloads/retries yet. Do not expose raw queue controls without idempotency and permissions.");
    if (page === "errors") return unavailable("Central error inbox is not exposed yet", "Runtime errors are logged today, but they are not yet stored as first-class incident records that can be resolved or reopened safely.");
    if (page === "affiliates") return unavailable("Affiliate operations are not connected yet", "Attribution fields already exist in analytics and payments, but there is no affiliate entity, commission ledger or payout workflow yet.", "affiliates");
    return null;
  };

  const userDetail = selectedDetail?.customer;
  const accountDetail = selectedDetail?.account;
  const tradingDetail = selectedDetail?.trading;
  const breachDetail = accountDetail?.breach;
  const openPositions = tradingDetail?.openPositions?.items || [];
  const closedPositions = tradingDetail?.closedPositions?.items || [];
  const executionDeals = tradingDetail?.deals?.items || [];
  const tradingOrders = tradingDetail?.orders?.items || [];
  const lifecycleEvents = tradingDetail?.lifecycle || [];
  const initialBalance = Number(accountDetail?.initialDeposit || accountDetail?.accountSize || 0);
  const reconstructedDailyLoss = Math.max(0, Number(accountDetail?.dailyStartEquity || initialBalance) - Number(accountDetail?.equity || 0));
  const reconstructedTotalLoss = Math.max(0, initialBalance - Number(accountDetail?.equity || 0));
  const breachIsMax = String(breachDetail?.primaryReason || "").toUpperCase() === "MAX_DRAWDOWN";
  const breachEvidenceSource = String(breachDetail?.evidenceSource || "").toUpperCase();
  const legacyBreachEvidence = Boolean(
    breachDetail
    && !["TRADER_TRIGGER", "FUNDED_SNAPSHOT"].includes(breachEvidenceSource)
  );
  const reconstructedBreachLoss = breachIsMax ? reconstructedTotalLoss : reconstructedDailyLoss;
  const breachLimit = Number(
    breachDetail?.limitAmount
    ?? lossLimitAmount(accountDetail, breachIsMax ? accountDetail?.rules?.maxDrawdown : accountDetail?.rules?.dailyDrawdown)
  );
  const displayedBreachLoss = legacyBreachEvidence
    ? reconstructedBreachLoss
    : Number(breachDetail?.actualLoss || 0);
  const displayedBreachAmount = legacyBreachEvidence
    ? Math.max(0, reconstructedBreachLoss - breachLimit)
    : Number(breachDetail?.breachAmount || 0);
  const breachReference = breachIsMax
    ? Number(breachDetail?.initialBalance ?? initialBalance)
    : Number(breachDetail?.dailyStartEquity ?? accountDetail?.dailyStartEquity ?? initialBalance);
  const breachThreshold = Number.isFinite(Number(breachDetail?.thresholdEquity))
    ? Number(breachDetail.thresholdEquity)
    : breachReference - breachLimit;
  const currentDailyLoss = accountDetail?.status === "BREACHED"
    ? Math.max(Number(accountDetail?.projections?.dailyLoss || 0), reconstructedDailyLoss)
    : Number(accountDetail?.projections?.dailyLoss || 0);
  const currentTotalLoss = accountDetail?.status === "BREACHED"
    ? Math.max(Number(accountDetail?.projections?.totalLoss || 0), reconstructedTotalLoss)
    : Number(accountDetail?.projections?.totalLoss || 0);
  const currentProfit = accountDetail?.status === "BREACHED"
    ? Number(accountDetail?.balance || 0) - initialBalance
    : Number(accountDetail?.projections?.profit || 0);

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      {sidebarOpen && <button aria-label="Close sidebar" className="fixed inset-0 z-30 bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[238px] border-r border-white/[0.07] bg-[#0b0b0b] transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
          <div><div className="text-sm font-bold tracking-[-0.02em] text-white">ACG FUNDED</div><div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">Admin</div></div>
          <button className="text-zinc-500 lg:hidden" onClick={() => setSidebarOpen(false)}><X size={17} /></button>
        </div>
        <nav className="h-[calc(100vh-128px)] overflow-y-auto px-3 py-4">
          {NAV.map(group => <div key={group.label} className="mb-5"><p className="mb-1.5 px-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-700">{group.label}</p>
            {group.items.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => changePage(item.id)} className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium transition ${page===item.id ? "bg-white text-black" : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"}`}><Icon size={14} /><span>{item.label}</span></button>; })}
          </div>)}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.06] p-3">
          <button onClick={signOut} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-zinc-500 hover:bg-white/[0.04] hover:text-white"><LogOut size={14} /> Sign out</button>
        </div>
      </aside>

      <div className="lg:pl-[238px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#090909]/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button className="rounded-lg border border-white/10 p-2 text-zinc-400 lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={16} /></button>
            <div className="min-w-0"><h1 className="truncate text-[15px] font-semibold text-white">{TITLES[page]?.[0]}</h1><p className="hidden truncate text-[10px] text-zinc-600 sm:block">{TITLES[page]?.[1]}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} className="rounded-lg border border-white/[0.08] p-2 text-zinc-500 hover:text-white"><RefreshCw size={14} /></button>
            <button className="rounded-lg border border-white/[0.08] p-2 text-zinc-500"><Bell size={14} /></button>
            <div className="hidden max-w-[220px] truncate rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] text-zinc-500 sm:block">{user?.email}</div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6">
          {toolbar && <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email, ID, order or account…" className="h-10 w-full rounded-lg border border-white/[0.08] bg-[#0e0e0e] pl-9 pr-3 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-white/20" /></div>
            <select value={status} onChange={e => setStatus(e.target.value)} className="h-10 rounded-lg border border-white/[0.08] bg-[#0e0e0e] px-3 text-xs text-zinc-400 outline-none">
              <option value="">All statuses</option>
              {["ACTIVE","BLOCKED","PAID","WAITING","FAILED","NEW","PASSED","BREACHED","LOCKED","PHASE_2","FUNDED_REVIEW","FUNDED","ESCALATED","OPEN"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>}
          {renderContent()}
        </main>
      </div>

      {selected && page === "users" && <Inspector title={selected.primaryEmail} subtitle={selected.customerId} onClose={() => {setSelected(null);setSelectedDetail(null);}}>
        {!selectedDetail ? <Loading /> : selectedDetail.error ? <Empty title="Unable to load customer" text={selectedDetail.error} /> : <>
          <div className="grid gap-3 sm:grid-cols-3"><Kpi label="Total Spend" value={money(selectedDetail.stats?.totalSpend)} /><Kpi label="Accounts" value={selectedDetail.stats?.accounts || 0} /><Kpi label="Orders" value={selectedDetail.stats?.orders || 0} /></div>
          <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#111] p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-zinc-500">Account status</p><div className="mt-2"><Badge>{userDetail?.status}</Badge></div></div><div className="flex gap-2">
            {userDetail?.status !== "BLOCKED" && <button onClick={() => setAction({type:"customer",id:userDetail.customerId,value:"BLOCKED",label:"Block customer"})} className="rounded-lg border border-red-400/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-400/10">Block</button>}
            {userDetail?.status === "BLOCKED" && <button onClick={() => setAction({type:"customer",id:userDetail.customerId,value:"ACTIVE",label:"Reactivate customer"})} className="rounded-lg border border-emerald-400/20 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-400/10">Reactivate</button>}
          </div></div></div>
          <h3 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">Challenges & trials</h3>
          <DataTable rows={selectedDetail.accounts || []} columns={challengeColumns.slice(0,7)} />
          <h3 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">Orders</h3>
          <DataTable rows={selectedDetail.payments || []} columns={paymentColumns.slice(0,6)} />
        </>}
      </Inspector>}

      {selected && ["challenges","trials","funded","breaches","trades"].includes(page) && <Inspector title={selected.accountId} subtitle={`${selected.accountMode} · ${money(selected.accountSize,"USD")}`} onClose={() => {setSelected(null);setSelectedDetail(null);}}>
        {!selectedDetail ? <Loading /> : selectedDetail.error ? <Empty title="Unable to load account" text={selectedDetail.error} /> : <>
          <div className="grid gap-3 sm:grid-cols-3"><Kpi label="Balance" value={money(accountDetail?.balance,"USD")} /><Kpi label="Equity" value={money(accountDetail?.equity,"USD")} /><Kpi label="Profit" value={signedMoney(currentProfit,"USD")} /></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Kpi
              label="Daily Loss"
              value={lossPct(currentDailyLoss, lossBase(accountDetail))}
              detail={`${money(currentDailyLoss, "USD")} of ${money(lossLimitAmount(accountDetail, accountDetail?.rules?.dailyDrawdown), "USD")} limit`}
            />
            <Kpi
              label="Total Loss"
              value={lossPct(currentTotalLoss, lossBase(accountDetail))}
              detail={`${money(currentTotalLoss, "USD")} of ${money(lossLimitAmount(accountDetail, accountDetail?.rules?.maxDrawdown), "USD")} limit`}
            />
            <Kpi label="Trading Days" value={accountDetail?.projections?.tradingDays || 0} />
          </div>
          {breachDetail && (
            <section className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-red-400">Breach evidence</p>
                  <h3 className="mt-1 text-base font-semibold text-white">{humanize(breachDetail.primaryReason)}</h3>
                  <p className="mt-1 text-xs text-zinc-400">{dateTime(breachDetail.breachedAt)} · Phase {breachDetail.phase || accountDetail?.currentPhase || 1}</p>
                </div>
                <Badge>BREACHED</Badge>
              </div>
              {legacyBreachEvidence && (
                <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 text-[11px] leading-5 text-amber-200">
                  <span className="font-semibold">Legacy breach evidence:</span> this account breached before exact trigger valuations were persisted. The recorded trigger snapshot is stale. Current loss figures below are reconstructed from the post-breach account equity and are not presented as the exact trigger tick.
                </div>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Kpi label={legacyBreachEvidence ? "Reconstructed Loss" : "Actual Loss"} value={money(displayedBreachLoss)} detail={`Limit ${money(breachLimit)}`} />
                <Kpi label={legacyBreachEvidence ? "Current Beyond Limit" : "Beyond Limit"} value={money(displayedBreachAmount)} />
                <Kpi label={legacyBreachEvidence ? "Recorded Trigger Equity" : "Equity at Breach"} value={money(breachDetail.equity || 0)} />
                <Kpi label="Threshold Equity" value={money(breachThreshold)} />
              </div>
              <div className="mt-4 grid gap-x-6 gap-y-3 border-t border-red-400/10 pt-4 sm:grid-cols-2">
                <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">Triggered rules</p><p className="mt-1 text-xs text-zinc-200">{(breachDetail.triggeredRules || []).map(humanize).join(", ") || humanize(breachDetail.primaryReason)}</p></div>
                <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">Daily start equity</p><p className="mt-1 text-xs text-zinc-200">{money(breachDetail.dailyStartEquity || 0)}</p></div>
                <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">{legacyBreachEvidence ? "Current daily loss" : "Daily loss at breach"}</p><p className="mt-1 text-xs text-zinc-200">{money(legacyBreachEvidence ? reconstructedDailyLoss : (breachDetail.dailyLoss || 0))}</p></div>
                <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">{legacyBreachEvidence ? "Current total loss" : "Total loss at breach"}</p><p className="mt-1 text-xs text-zinc-200">{money(legacyBreachEvidence ? reconstructedTotalLoss : (breachDetail.totalLoss || 0))}</p></div>
                <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">Trigger valuation</p><p className="mt-1 text-xs text-zinc-200">{breachDetail.valuedAt ? dateTime(breachDetail.valuedAt) : "Legacy record"}</p></div>
                <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">Evidence source</p><p className="mt-1 text-xs text-zinc-200">{humanize(breachDetail.evidenceSource || "LEGACY")}</p></div>
                <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">Reason code</p><p className="mt-1 text-xs text-zinc-200">{breachDetail.reasonCode || "—"}</p></div>
                <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">Floating P&L at trigger</p><p className="mt-1 text-xs text-zinc-200">{breachDetail.floatingPnl == null ? "—" : signedMoney(breachDetail.floatingPnl)}</p></div>
              </div>
            </section>
          )}

          <section className="mt-5 rounded-xl border border-white/[0.07] bg-[#111] p-4">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-xs font-semibold text-white">Account 360°</p><p className="mt-1 text-[11px] text-zinc-500">Customer, platform, lifecycle and risk state.</p></div>
              <Badge>{accountDetail?.accountMode === "DEMO" ? "TRIAL" : accountDetail?.status === "FUNDED" ? "MASTER" : "CHALLENGE"}</Badge>
            </div>
            <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Customer", selectedDetail?.customer?.primaryEmail || accountDetail?.customerId],
                ["Customer ID", accountDetail?.customerId],
                ["Account ID", accountDetail?.accountId],
                ["Platform account", accountDetail?.platformAccountId],
                ["Platform code", accountDetail?.platformAccountCode],
                ["Platform login", accountDetail?.platformLogin],
                ["Challenge", accountDetail?.challengeType],
                ["Phase", accountDetail?.currentPhase || 1],
                ["Leverage", accountDetail?.leverage ? `1:${accountDetail.leverage}` : "—"],
                ["Floating P&L", signedMoney(accountDetail?.floatingProfit || 0)],
                ["Used margin", money(accountDetail?.margin || 0)],
                ["Free margin", money(accountDetail?.marginFree || 0)],
                ["Margin level", accountDetail?.marginLevel ? `${Number(accountDetail.marginLevel).toFixed(2)}%` : "—"],
                ["Highest balance", money(accountDetail?.projections?.highestBalance || 0)],
                ["Highest equity", money(accountDetail?.projections?.highestEquity || 0)],
                ["Last platform snapshot", dateTime(accountDetail?.lastPlatformSnapshotAt)],
                ["Created", dateTime(accountDetail?.createdAt)],
                ["Updated", dateTime(accountDetail?.updatedAt)],
              ].map(([label, value]) => <div key={label}><p className="text-[10px] uppercase tracking-wider text-zinc-600">{label}</p><p className="mt-1 break-all text-xs text-zinc-200">{value || "—"}</p></div>)}
            </div>
          </section>

          <section className="mt-5 rounded-xl border border-white/[0.07] bg-[#111] p-4">
            <p className="text-xs font-semibold text-white">Trading statistics</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi label="Total Trades" value={accountDetail?.totalTrades || 0} />
              <Kpi label="Wins" value={accountDetail?.winningTrades || 0} />
              <Kpi label="Losses" value={accountDetail?.losingTrades || 0} />
              <Kpi label="Win Rate" value={pct((Number(accountDetail?.totalTrades || 0) > 0 ? Number(accountDetail?.winningTrades || 0) / Number(accountDetail.totalTrades) : 0) * 100)} />
            </div>
          </section>

          {selectedDetail?.tradingError && (
            <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-4 text-xs text-amber-200">
              Trader history is temporarily unavailable: {selectedDetail.tradingError.message}
            </div>
          )}

          {tradingDetail && (
            <>
              <section className="mt-5">
                <div className="mb-3 flex items-end justify-between"><div><h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Open positions</h3><p className="mt-1 text-[11px] text-zinc-600">{openPositions.length} currently open</p></div></div>
                <DataTable rows={openPositions} empty="No open positions." columns={[
                  { key: "symbol", label: "Symbol" },
                  { key: "side", label: "Side", render: r => <Badge>{r.side}</Badge> },
                  { key: "openVolume", label: "Open Volume" },
                  { key: "entryPrice", label: "Entry" },
                  { key: "stopLoss", label: "SL", render: r => r.stopLoss ?? "—" },
                  { key: "takeProfit", label: "TP", render: r => r.takeProfit ?? "—" },
                  { key: "margin", label: "Margin", render: r => money(r.margin || 0) },
                  { key: "realizedPnl", label: "Realized P&L", render: r => signedMoney(r.realizedPnl || 0) },
                  { key: "openedAt", label: "Opened", render: r => dateTime(r.openedAt) },
                  { key: "positionId", label: "Position ID" },
                ]} />
              </section>

              <section className="mt-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Closed positions</h3>
                <DataTable rows={closedPositions} empty="No closed positions." columns={[
                  { key: "symbol", label: "Symbol" },
                  { key: "side", label: "Side", render: r => <Badge>{r.side}</Badge> },
                  { key: "initialVolume", label: "Volume" },
                  { key: "entryPrice", label: "Entry" },
                  { key: "realizedPnl", label: "P&L", render: r => signedMoney(r.realizedPnl || 0) },
                  { key: "commissionPaid", label: "Commission", render: r => money(r.commissionPaid || 0) },
                  { key: "swapPaid", label: "Swap", render: r => money(r.swapPaid || 0) },
                  { key: "closeReason", label: "Close Reason", render: r => humanize(r.closeReason) },
                  { key: "openedAt", label: "Opened", render: r => dateTime(r.openedAt) },
                  { key: "closedAt", label: "Closed", render: r => dateTime(r.closedAt) },
                ]} />
              </section>

              <section className="mt-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Execution deals</h3>
                <DataTable rows={executionDeals} empty="No executions recorded." columns={[
                  { key: "executedAt", label: "Executed", render: r => dateTime(r.executedAt) },
                  { key: "symbol", label: "Symbol" },
                  { key: "side", label: "Side", render: r => <Badge>{r.side}</Badge> },
                  { key: "type", label: "Type" },
                  { key: "volume", label: "Volume" },
                  { key: "price", label: "Price" },
                  { key: "spreadPoints", label: "Spread" },
                  { key: "commission", label: "Commission", render: r => money(r.commission || 0) },
                  { key: "swap", label: "Swap", render: r => money(r.swap || 0) },
                  { key: "realizedPnl", label: "P&L", render: r => signedMoney(r.realizedPnl || 0) },
                  { key: "dealId", label: "Deal ID" },
                ]} />
              </section>

              <section className="mt-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Orders</h3>
                <DataTable rows={tradingOrders} empty="No orders recorded." columns={[
                  { key: "receivedAt", label: "Received", render: r => dateTime(r.receivedAt) },
                  { key: "symbol", label: "Symbol" },
                  { key: "side", label: "Side", render: r => <Badge>{r.side}</Badge> },
                  { key: "type", label: "Type" },
                  { key: "status", label: "Status", render: r => <Badge>{r.status}</Badge> },
                  { key: "requestedVolume", label: "Requested" },
                  { key: "filledVolume", label: "Filled" },
                  { key: "acceptedPrice", label: "Fill Price", render: r => r.acceptedPrice ?? "—" },
                  { key: "stopLoss", label: "SL", render: r => r.stopLoss ?? "—" },
                  { key: "takeProfit", label: "TP", render: r => r.takeProfit ?? "—" },
                  { key: "rejectMessage", label: "Reject Reason", render: r => r.rejectMessage || "—" },
                ]} />
              </section>

              <section className="mt-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Lifecycle timeline</h3>
                <DataTable rows={lifecycleEvents} empty="No Trader lifecycle events recorded." columns={[
                  { key: "createdAt", label: "Time", render: r => dateTime(r.createdAt) },
                  { key: "type", label: "Event", render: r => humanize(r.type) },
                  { key: "fromStatus", label: "From", render: r => r.fromStatus || "—" },
                  { key: "toStatus", label: "To", render: r => r.toStatus || "—" },
                  { key: "reason", label: "Reason", render: r => humanize(r.reason) },
                  { key: "actorType", label: "Actor" },
                ]} />
              </section>
            </>
          )}

          <section className="mt-5 rounded-xl border border-white/[0.07] bg-[#111] p-4">
            <p className="text-xs font-semibold text-white">Commercial & activation</p>
            <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Order", selectedDetail?.payment?.orderId],
                ["Paid", selectedDetail?.payment ? money(selectedDetail.payment.amount, selectedDetail.payment.currency || "USD") : "—"],
                ["Payment status", selectedDetail?.payment?.status],
                ["Payment method", selectedDetail?.payment?.paymentMethod],
                ["Activation", selectedDetail?.payment?.activation?.status],
                ["Profit split", accountDetail?.commercialTerms?.profitSplit != null ? `${accountDetail.commercialTerms.profitSplit}%` : "—"],
                ["Payout frequency", accountDetail?.commercialTerms?.payoutFrequency],
                ["News trading", accountDetail?.commercialTerms?.newsTrading == null ? "—" : accountDetail.commercialTerms.newsTrading ? "Allowed" : "Restricted"],
                ["Weekend holding", accountDetail?.commercialTerms?.weekendHolding == null ? "—" : accountDetail.commercialTerms.weekendHolding ? "Allowed" : "Restricted"],
              ].map(([label, value]) => <div key={label}><p className="text-[10px] uppercase tracking-wider text-zinc-600">{label}</p><p className="mt-1 text-xs text-zinc-200">{value || "—"}</p></div>)}
            </div>
          </section>

          <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#111] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-widest text-zinc-600">State</p><div className="mt-2"><Badge>{accountDetail?.status}</Badge></div></div><div className="flex flex-wrap gap-2">
            {["ACTIVE","PHASE_2","FUNDED"].includes(accountDetail?.status) && <button onClick={() => setAction({type:"challenge",id:accountDetail.accountId,value:"LOCK",label:"Lock account"})} className="rounded-lg border border-amber-400/20 px-3 py-2 text-xs font-semibold text-amber-300">Lock</button>}
            {accountDetail?.status === "LOCKED" && <button onClick={() => setAction({type:"challenge",id:accountDetail.accountId,value:"UNLOCK",label:"Unlock account"})} className="rounded-lg border border-emerald-400/20 px-3 py-2 text-xs font-semibold text-emerald-300">Unlock</button>}
            {accountDetail?.status === "FUNDED_REVIEW" && <button onClick={() => setAction({type:"challenge",id:accountDetail.accountId,value:"APPROVE_FUNDED",label:"Approve funded account"})} className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs font-semibold text-emerald-300">Approve Funded</button>}
            {accountDetail?.status !== "CLOSED" && <button onClick={() => setAction({type:"challenge",id:accountDetail.accountId,value:"CLOSE",label:"Close account"})} className="rounded-lg border border-red-400/20 px-3 py-2 text-xs font-semibold text-red-300">Close</button>}
          </div></div></div>
          <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#111] p-4"><p className="text-xs font-semibold text-white">Rules snapshot</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><div><p className="text-[10px] text-zinc-600">Daily drawdown</p><p className="mt-1 text-sm text-zinc-300">{pct(accountDetail?.rules?.dailyDrawdown)}</p></div><div><p className="text-[10px] text-zinc-600">Max drawdown</p><p className="mt-1 text-sm text-zinc-300">{pct(accountDetail?.rules?.maxDrawdown)}</p></div><div><p className="text-[10px] text-zinc-600">Minimum trading days</p><p className="mt-1 text-sm text-zinc-300">{accountDetail?.rules?.minimumTradingDays || 0}</p></div><div><p className="text-[10px] text-zinc-600">Platform</p><p className="mt-1 text-sm text-zinc-300">{accountDetail?.platform || "—"}</p></div></div></div>
        </>}
      </Inspector>}

      {selected && ["orders","payments"].includes(page) && <Inspector title={selected.orderId || "Payment"} subtitle={selected.email || selected._id} onClose={() => {setSelected(null);setSelectedDetail(null);}}>
        <div className="grid gap-3 sm:grid-cols-3">
          <Kpi label="Amount" value={money(selected.amount, selected.currency || "USD")} />
          <Kpi label="Payment" value={selected.status || "—"} />
          <Kpi label="Activation" value={selected.activation?.status || "NOT_STARTED"} />
        </div>
        <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#111] p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Provider reference</p><p className="mt-1 break-all text-xs text-zinc-300">{selected.providerPaymentId || selected.providerInvoiceId || "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Funded account</p><p className="mt-1 text-xs text-zinc-300">{selected.accountId || "Not activated"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Last activation attempt</p><p className="mt-1 text-xs text-zinc-300">{dateTime(selected.activation?.attemptedAt)}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Activation error</p><p className="mt-1 text-xs text-zinc-300">{selected.activation?.error || "—"}</p></div>
          </div>
          {selected.status === "PAID" && !selected.accountId && selected.activation?.status !== "ACTIVE" && (
            <button
              onClick={() => setAction({type:"payment",id:selected._id,value:"RETRY_ACTIVATION",label:"Retry account activation"})}
              className="mt-5 rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-xs font-semibold text-amber-300"
            >
              Retry activation
            </button>
          )}
        </div>
      </Inspector>}

      {selected && page === "support" && <Inspector
        title={selectedDetail?.conversation?.email?.subject || "Support case"}
        subtitle={selectedDetail?.conversation?.email?.customerEmail || selectedDetail?.customer?.primaryEmail || selected.conversationId}
        onClose={() => { setSelected(null); setSelectedDetail(null); setSupportReply(""); }}
      >
        {!selectedDetail ? <Loading /> : selectedDetail.error ? <Empty title="Unable to load support case" text={selectedDetail.error} /> : (() => {
          const conversation = selectedDetail.conversation;
          return <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{conversation.channel || "WEB"}</Badge>
              <Badge>{conversation.category}</Badge>
              <Badge>{conversation.status}</Badge>
              {conversation.handoffReason && <span className="text-[11px] text-zinc-500">{conversation.handoffReason}</span>}
            </div>

            <div className="max-h-[50vh] space-y-3 overflow-y-auto rounded-xl border border-white/[0.07] bg-[#0b0b0b] p-4">
              {(conversation.messages || []).map(message => (
                <div key={message.messageId} className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[86%] rounded-xl px-3 py-2.5 text-xs leading-5 ${message.role === "user" ? "bg-white/[0.06] text-zinc-200" : "bg-white text-black"}`}>
                    <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider opacity-50">
                      {message.role === "user" ? "Customer" : message.source === "human" ? "Human support" : "ACG Support"}
                    </div>
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    <div className="mt-1 text-[9px] opacity-45">{dateTime(message.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>

            {conversation.status !== "CLOSED" && (
              <div className="space-y-3">
                <textarea
                  value={supportReply}
                  onChange={event => setSupportReply(event.target.value)}
                  maxLength={3000}
                  rows={5}
                  placeholder={conversation.channel === "EMAIL" ? "Reply by email…" : "Reply to this support conversation…"}
                  className="w-full resize-none rounded-xl border border-white/[0.1] bg-black px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/25"
                />
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    onClick={closeSupportCase}
                    disabled={supportBusy}
                    className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/5 disabled:opacity-40"
                  >
                    Close case
                  </button>
                  <button
                    onClick={sendHumanSupportReply}
                    disabled={!supportReply.trim() || supportBusy}
                    className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black disabled:opacity-40"
                  >
                    {supportBusy ? "Sending…" : conversation.channel === "EMAIL" ? "Send email reply" : "Send reply"}
                  </button>
                </div>
              </div>
            )}
          </div>;
        })()}
      </Inspector>}

      {action && <ConfirmModal action={action} entity={action.id} busy={actionBusy} onClose={() => setAction(null)} onConfirm={performAction} />}
    </div>
  );
}
