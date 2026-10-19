import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, BarChart3, ChevronRight, Gauge, LayoutDashboard, LifeBuoy, LogOut, Menu, RefreshCw, Search, Settings2, ShieldAlert, Users, WalletCards, X
} from "lucide-react";
import { useAuth } from "../../AuthContext.jsx";
import LaunchReadinessPanel from "./LaunchReadinessPanel.jsx";

const API_URL = import.meta.env.VITE_API_URL || "";

// Only everyday workspaces appear as primary navigation. Existing page IDs remain
// addressable so links from notices, account details and bookmarks keep working.
const NAV = [
  { id: "overview", label: "Command Center", icon: LayoutDashboard },
  { id: "users", label: "Customers", icon: Users },
  { id: "challenges", label: "Trading Accounts", icon: Gauge },
  { id: "orders", label: "Finance", icon: WalletCards },
  { id: "risk", label: "Risk & Reviews", icon: ShieldAlert },
  { id: "support", label: "Support", icon: LifeBuoy },
  { id: "funnel", label: "Analytics", icon: BarChart3 },
  { id: "integrations", label: "Settings & System", icon: Settings2 },
];

const WORKSPACE_TABS = {
  challenges: [
    { id: "challenges", label: "Paid Challenges" },
    { id: "trials", label: "Free Trials" },
    { id: "funded", label: "Funded Accounts" },
    { id: "trades", label: "Trade Activity" },
  ],
  orders: [
    { id: "orders", label: "Orders" },
    { id: "payments", label: "Payments" },
    { id: "payouts", label: "Payouts" },
  ],
  risk: [
    { id: "risk", label: "Risk Overview" },
    { id: "breaches", label: "Breaches" },
  ],
  funnel: [
    { id: "funnel", label: "Conversion Funnel" },
    { id: "revenue", label: "Revenue" },
  ],
  integrations: [
    { id: "integrations", label: "Integrations" },
    { id: "platforms", label: "Trading Platforms" },
    { id: "launch-readiness", label: "Launch Readiness" },
    { id: "admins", label: "Administrators" },
    { id: "audit", label: "Audit Log" },
  ],
};

// Unconnected modules remain addressable through existing bookmarks, but do not
// occupy everyday navigation until they provide a real operational workflow.
const UNAVAILABLE_WORKSPACE_PAGES = {
  refunds: "orders", affiliates: "funnel",
  products: "integrations", pricing: "integrations",
  jobs: "integrations", errors: "integrations",
};
const workspaceForPage = page =>
  Object.keys(WORKSPACE_TABS).find(workspace => WORKSPACE_TABS[workspace].some(tab => tab.id === page))
  || UNAVAILABLE_WORKSPACE_PAGES[page] || page;

const TITLES = {
  overview: ["Command Center", "Business health, priorities and actions requiring attention"],
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
  "launch-readiness": ["Launch Readiness", "Create isolated acceptance fixtures and validate the production lifecycle"],
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

const PAGE_STATUS_OPTIONS = {
  users: ["ACTIVE", "BLOCKED"],
  challenges: ["NEW", "ACTIVE", "PHASE_2", "PASSED", "BREACHED", "LOCKED", "EXPIRED", "CLOSED"],
  trials: ["NEW", "ACTIVE", "PASSED", "BREACHED", "LOCKED", "EXPIRED", "CLOSED"],
  funded: ["FUNDED_REVIEW", "FUNDED"],
  orders: ["CREATED", "WAITING", "CONFIRMING", "PAID", "FAILED", "EXPIRED", "UNDERPAID", "REFUNDED"],
  payments: ["CREATED", "WAITING", "CONFIRMING", "PAID", "FAILED", "EXPIRED", "UNDERPAID", "REFUNDED"],
  payouts: ["REQUESTED", "REVIEWING", "APPROVED", "PROCESSING", "SENT", "PAID", "FAILED", "REJECTED", "CANCELLED"],
  support: ["OPEN", "ESCALATED", "CLOSED"],
};

const QUEUE_LABELS = {
  provisioning: "Provisioning attention",
  "failed-payments": "Failed payments",
  escalated: "Support escalations",
};

const money = (value, currency = "USD") => {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(number);
};

const dateTime = value => value ? new Date(value).toLocaleString() : "—";
const ACTIVITY_LABELS = {
  signup_completed: "Registration",
  trial_created: "Free trial created",
  trial_first_trade: "Trial first trade",
  trial_phase_1_passed: "Trial phase 1 passed",
  trial_passed: "Trial passed",
  trial_failed: "Trial failed",
  trial_expired: "Trial expired",
  trial_cancelled: "Trial cancelled",
  phase_1_passed: "Paid phase 1 passed",
  phase_2_started: "Paid phase 2 started",
  evaluation_passed: "Evaluation passed",
  checkout_started: "Checkout started",
  payment_started: "Payment started",
  payment_completed: "Payment completed",
  payment_failed: "Payment failed",
  payment_expired: "Payment expired",
  account_activated: "Account activated",
};
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
const paymentChallengeLabel = payment => {
  const definition = payment?.challengeDefinition;
  const size = Number(definition?.accountSize);
  if (!Number.isFinite(size) || size <= 0) return "—";
  const sizeLabel = size >= 1000
    ? `${Number(size / 1000).toLocaleString("en-US", { maximumFractionDigits: 2 })}K`
    : money(size, "USD");
  const step = String(definition?.step || "").toLowerCase();
  const type = step === "2step" ? "2-Step" : step === "1step" ? "1-Step" : definition?.step || "Challenge";
  return `${sizeLabel} · ${type}`;
};
const statusTone = status => {
  const s = String(status || "").toUpperCase();
  if (["PAID", "ACTIVE", "FUNDED", "PASSED", "HEALTHY", "CONFIGURED", "READY", "OPEN"].includes(s)) return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
  if (["FAILED", "REJECTED", "CANCELLED", "BREACHED", "BLOCKED", "CLOSED", "NOT_CONFIGURED"].includes(s)) return "text-red-300 bg-red-400/10 border-red-400/20";
  if (["PENDING", "WAITING", "CONFIRMING", "REQUESTED", "REVIEWING", "APPROVED", "PROCESSING", "SENT", "PHASE_2", "FUNDED_REVIEW", "ESCALATED", "LOCKED", "DEVELOPMENT", "NOT_INTEGRATED", "NOT_READY", "FEE_GROSS_UP_REQUIRED"].includes(s)) return "text-amber-300 bg-amber-400/10 border-amber-400/20";
  return "text-zinc-300 bg-white/5 border-white/10";
};

function Badge({ children }) {
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${statusTone(children)}`}>{children || "—"}</span>;
}

function Kpi({ label, value, detail }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.07] bg-[#111] p-3 sm:p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p className="mt-2 break-words text-[19px] font-semibold tracking-[-0.04em] text-white [overflow-wrap:anywhere] sm:text-[24px]">{value}</p>
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
  const cell = (row, col) => col.render ? col.render(row) : row[col.key] ?? "—";
  const rowKey = (row, index) => row._id || row.payoutId || row.customerId || row.accountId || row.orderId || row.conversationId || index;

  return (
    <div className="min-w-0">
      {/* Mobile cards preserve every column and keep the existing row actions. */}
      <div className="space-y-2 md:hidden" aria-label="Records">
        {rows.map((row, index) => (
          <article key={rowKey(row, index)} className="min-w-0 rounded-xl border border-white/[0.08] bg-[#101010] p-3.5">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{columns[0]?.label}</p>
                <div className="mt-1 break-words text-[13px] font-semibold text-white [overflow-wrap:anywhere]">{columns[0] ? cell(row, columns[0]) : "—"}</div>
              </div>
              {onRow && (
                <button type="button" onClick={() => onRow(row)}
                  aria-label={`Open ${columns[0]?.label || "record"} details`}
                  className="flex min-h-10 shrink-0 items-center gap-1 rounded-lg border border-white/10 px-3 text-xs font-semibold text-zinc-200 hover:bg-white/[0.06]">
                  Open <ChevronRight size={14} />
                </button>
              )}
            </div>
            <dl className="mt-3 grid min-w-0 grid-cols-2 gap-x-3 gap-y-3 border-t border-white/[0.06] pt-3">
              {columns.slice(1, 5).map(col => (
                <div key={col.key} className="min-w-0">
                  <dt className="text-[10px] font-medium text-zinc-500">{col.label}</dt>
                  <dd className="mt-1 break-words text-xs text-zinc-200 [overflow-wrap:anywhere]">{cell(row, col)}</dd>
                </div>
              ))}
            </dl>
            {columns.length > 5 && (
              <details className="mt-3 border-t border-white/[0.06] pt-2">
                <summary className="cursor-pointer py-2 text-xs font-medium text-zinc-400 hover:text-white">
                  More fields ({columns.length - 5})
                </summary>
                <dl className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-3 pt-2">
                  {columns.slice(5).map(col => (
                    <div key={col.key} className="min-w-0">
                      <dt className="text-[10px] font-medium text-zinc-500">{col.label}</dt>
                      <dd className="mt-1 break-words text-xs text-zinc-200 [overflow-wrap:anywhere]">{cell(row, col)}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
          </article>
        ))}
      </div>
      <div className="hidden min-w-0 overflow-hidden rounded-xl border border-white/[0.07] bg-[#0f0f0f] md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-white/[0.07] bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
              <tr>{columns.map(col => <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium">{col.label}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {rows.map((row, index) => (
                <tr key={rowKey(row, index)}
                  onClick={() => onRow?.(row)}
                  className={onRow ? "cursor-pointer transition hover:bg-white/[0.035]" : ""}>
                  {columns.map(col => <td key={col.key} className="whitespace-nowrap px-4 py-3 text-zinc-300">{cell(row, col)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Pagination({ pagination, onPage }) {
  if (!pagination || Number(pagination.pages || 1) <= 1) return null;
  const current = Number(pagination.page || 1);
  const pages = Number(pagination.pages || 1);
  const total = Number(pagination.total || 0);
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/[0.07] bg-[#0f0f0f] px-4 py-3 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
      <span>{total.toLocaleString()} records · Page {current} of {pages}</span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={current <= 1}
          onClick={() => onPage(current - 1)}
          className="rounded-lg border border-white/[0.09] px-3 py-2 font-semibold text-zinc-300 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-35"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={current >= pages}
          onClick={() => onPage(current + 1)}
          className="rounded-lg border border-white/[0.09] px-3 py-2 font-semibold text-zinc-300 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-35"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Inspector({ title, subtitle, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="h-[100dvh] w-full min-w-0 max-w-2xl overflow-x-hidden overflow-y-auto overscroll-contain border-l border-white/10 bg-[#0b0b0b] shadow-2xl" role="dialog" aria-modal="true" onMouseDown={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex min-w-0 items-start justify-between gap-3 border-b border-white/[0.07] bg-[#0b0b0b]/95 px-4 py-4 backdrop-blur sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1"><h2 className="break-words text-base font-semibold tracking-[-0.03em] text-white [overflow-wrap:anywhere] sm:text-lg">{title}</h2><p className="mt-1 break-words text-xs text-zinc-500 [overflow-wrap:anywhere]">{subtitle}</p></div>
          <button type="button" onClick={onClose} aria-label="Close details" className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white"><X size={17} /></button>
        </div>
        <div className="min-w-0 p-3 pb-8 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ action, entity, onClose, onConfirm, busy }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/70 px-3 py-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#111] p-4 sm:p-5" onMouseDown={e => e.stopPropagation()}>
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


function payoutActionsFor(status) {
  const value = String(status || "").toUpperCase();
  if (value === "REQUESTED") return [
    { value: "START_REVIEW", label: "Start review", tone: "neutral" },
    { value: "APPROVE", label: "Approve", tone: "positive" },
    { value: "REJECT", label: "Reject", tone: "negative" },
    { value: "CANCEL", label: "Cancel", tone: "negative" },
  ];
  if (value === "REVIEWING") return [
    { value: "APPROVE", label: "Approve", tone: "positive" },
    { value: "REJECT", label: "Reject", tone: "negative" },
    { value: "CANCEL", label: "Cancel", tone: "negative" },
  ];
  if (value === "APPROVED") return [
    { value: "MARK_PROCESSING", label: "Mark processing", tone: "positive" },
    { value: "FAIL", label: "Mark failed", tone: "negative" },
  ];
  if (value === "PROCESSING") return [
    { value: "MARK_SENT", label: "Mark sent", tone: "positive" },
    { value: "FAIL", label: "Mark failed", tone: "negative" },
  ];
  if (value === "SENT") return [
    { value: "MARK_PAID", label: "Mark paid", tone: "positive" },
    { value: "FAIL", label: "Mark failed", tone: "negative" },
  ];
  return [];
}

function PayoutActionModal({ action, payout, onClose, onConfirm, busy }) {
  const [reason, setReason] = useState("");
  const [provider, setProvider] = useState(payout?.provider || "");
  const [providerReference, setProviderReference] = useState(payout?.providerReference || "");
  const [utr, setUtr] = useState(payout?.utr || "");
  const [txHash, setTxHash] = useState(payout?.txHash || "");
  const [network, setNetwork] = useState(payout?.network || payout?.destination?.network || "TRC20");
  const [settlementAmount, setSettlementAmount] = useState(payout?.settlementAmount ?? "");
  const [traderReceivedAmount, setTraderReceivedAmount] = useState("");
  const [providerFeePaidByAcg, setProviderFeePaidByAcg] = useState(
    payout?.providerFeePaidByAcg ?? payout?.providerFee ?? ""
  );
  const method = String(payout?.method || "").toUpperCase();
  const needsTransferReference = action?.value === "MARK_SENT" && ["UPI", "BANK"].includes(method);
  const needsTxHash = action?.value === "MARK_SENT" && method === "USDT";
  const needsPaidAccounting = action?.value === "MARK_PAID";
  const expectedSettlement = Number(payout?.settlementAmount);
  const receivedAmount = Number(traderReceivedAmount);
  const acgFeeAmount = Number(providerFeePaidByAcg);
  const exactReceiptConfirmed = !needsPaidAccounting || (
    Number.isFinite(expectedSettlement)
    && Number.isFinite(receivedAmount)
    && Number.isFinite(acgFeeAmount)
    && receivedAmount > 0
    && acgFeeAmount >= 0
    && Math.round(receivedAmount * 100) === Math.round(expectedSettlement * 100)
  );
  const canSubmit = reason.trim()
    && (!needsTransferReference || providerReference.trim() || utr.trim())
    && (!needsTxHash || txHash.trim())
    && exactReceiptConfirmed;

  const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-black px-3 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-white/25";

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black/75 px-3 py-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#111] p-4 sm:p-5" onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">{action.label}</h3>
            <p className="mt-1 font-mono text-[10px] text-zinc-500">{payout?.payoutId}</p>
          </div>
          <Badge>{payout?.status}</Badge>
        </div>

        {(action.value === "MARK_PROCESSING" || action.value === "MARK_SENT") && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[10px] font-medium text-zinc-500">Provider</span>
              <input value={provider} onChange={e => setProvider(e.target.value)} className={inputClass} placeholder="Provider name" />
            </label>
            <label className="block">
              <span className="text-[10px] font-medium text-zinc-500">Settlement amount</span>
              <input value={settlementAmount} onChange={e => setSettlementAmount(e.target.value)} inputMode="decimal" className={inputClass} placeholder="Optional" />
            </label>
          </div>
        )}

        {action.value === "MARK_SENT" && method !== "USDT" && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[10px] font-medium text-zinc-500">Provider reference</span>
              <input value={providerReference} onChange={e => setProviderReference(e.target.value)} className={inputClass} placeholder="Transfer reference" />
            </label>
            <label className="block">
              <span className="text-[10px] font-medium text-zinc-500">UTR</span>
              <input value={utr} onChange={e => setUtr(e.target.value)} className={inputClass} placeholder="UTR / bank reference" />
            </label>
          </div>
        )}

        {action.value === "MARK_SENT" && method === "USDT" && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[10px] font-medium text-zinc-500">Network</span>
              <input value={network} onChange={e => setNetwork(e.target.value.toUpperCase())} className={inputClass} placeholder="TRC20" />
            </label>
            <label className="block">
              <span className="text-[10px] font-medium text-zinc-500">Transaction hash</span>
              <input value={txHash} onChange={e => setTxHash(e.target.value)} className={inputClass} placeholder="Required before SENT" />
            </label>
          </div>
        )}

        {needsPaidAccounting && (
          <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/25 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-white">Exact receipt verification</p>
                <p className="mt-1 text-[10px] leading-4 text-zinc-500">ACG covers provider fees. Confirm the trader received the full quoted settlement before marking this payout paid.</p>
              </div>
              <Badge>ACG COVERS</Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-medium text-zinc-500">Quoted trader amount</span>
                <input
                  value={Number.isFinite(expectedSettlement) ? expectedSettlement : ""}
                  readOnly
                  className={inputClass + " cursor-not-allowed text-zinc-500"}
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-medium text-zinc-500">Trader actually received</span>
                <input
                  value={traderReceivedAmount}
                  onChange={e => setTraderReceivedAmount(e.target.value)}
                  inputMode="decimal"
                  className={inputClass}
                  placeholder={Number.isFinite(expectedSettlement) ? String(expectedSettlement) : "Required"}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[10px] font-medium text-zinc-500">Provider fee paid by ACG</span>
                <input
                  value={providerFeePaidByAcg}
                  onChange={e => setProviderFeePaidByAcg(e.target.value)}
                  inputMode="decimal"
                  className={inputClass}
                  placeholder="Enter 0 if there was no provider fee"
                />
              </label>
            </div>

            {traderReceivedAmount && !exactReceiptConfirmed && (
              <p className="mt-3 text-[10px] text-amber-300">
                The received amount must exactly equal the quoted trader amount. Do not mark this payout paid until any shortfall has been topped up.
              </p>
            )}

            {exactReceiptConfirmed && needsPaidAccounting && (
              <p className="mt-3 text-[10px] text-zinc-500">
                ACG total payout cost · {money(receivedAmount + acgFeeAmount, payout?.settlementCurrency || "INR")}
              </p>
            )}
          </div>
        )}

        <label className="mt-4 block">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">Reason</span>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/25"
            placeholder="Required for the audit log"
          />
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} disabled={busy} className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/5 disabled:opacity-40">Cancel</button>
          <button
            disabled={!canSubmit || busy}
            onClick={() => onConfirm({
              reason,
              provider: provider.trim() || undefined,
              providerReference: providerReference.trim() || undefined,
              utr: utr.trim() || undefined,
              txHash: txHash.trim() || undefined,
              network: network.trim() || undefined,
              settlementAmount: settlementAmount === "" ? undefined : Number(settlementAmount),
              settlementCurrency: payout?.settlementCurrency || undefined,
              traderReceivedAmount: needsPaidAccounting ? Number(traderReceivedAmount) : undefined,
              providerFeePaidByAcg: needsPaidAccounting ? Number(providerFeePaidByAcg) : undefined,
            })}
            className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black disabled:opacity-40"
          >
            {busy ? "Applying…" : action.label}
          </button>
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
  const [listPage, setListPage] = useState(1);
  const [queue, setQueue] = useState("");
  const [tradeLoadingMore, setTradeLoadingMore] = useState(false);
  const [days, setDays] = useState("30");
  const [journeyView, setJourneyView] = useState("trial");
  const [acquisitionSearch, setAcquisitionSearch] = useState("");
  const loadSequence = useRef(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [customerTab, setCustomerTab] = useState("overview");
  const [accountTab, setAccountTab] = useState("overview");
  const [returnCustomer, setReturnCustomer] = useState(null);
  const [action, setAction] = useState(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [supportReply, setSupportReply] = useState("");
  const [supportBusy, setSupportBusy] = useState(false);
  const [payoutAction, setPayoutAction] = useState(null);
  const [payoutBusy, setPayoutBusy] = useState(false);

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
    const p = `&page=${listPage}`;
    if (page === "overview") return "/overview";
    if (page === "users") return `/users?limit=100${p}${q}${s}`;
    if (page === "challenges") return `/challenges?limit=100${p}${q}${s}`;
    if (page === "trials") return `/challenges?mode=DEMO&limit=100${p}${q}${s}`;
    if (page === "funded") return `/challenges?funded=true&limit=100${p}${q}${s}`;
    if (page === "orders" || page === "payments") {
      const attention = queue === "provisioning"
        ? "&attention=provisioning"
        : queue === "failed-payments"
          ? "&attention=failed-today"
          : s;
      return `/${page}?limit=100${p}${q}${attention}`;
    }
    if (page === "payouts") return `/payouts?limit=100${p}${q}${s}`;
    if (page === "trades") return "/trades?limit=200";
    if (page === "risk" || page === "breaches") return "/risk";
    if (page === "funnel" || page === "revenue") return `/funnel?days=${days}`;
    if (page === "support") {
      const supportStatus = queue === "escalated" ? "&status=ESCALATED" : s;
      return `/support?limit=100${p}${q}${supportStatus}`;
    }
    if (page === "launch-readiness") return "/launch-readiness?limit=20";
    if (page === "audit") return `/audit?limit=100${p}`;
    if (page === "admins") return "/admin-users";
    if (["jobs", "integrations", "errors", "refunds", "products", "pricing", "platforms", "affiliates"].includes(page)) return "/system";
    return "/overview";
  }, [page, search, status, days, listPage, queue]);

  const load = useCallback(async () => {
    const requestId = ++loadSequence.current;
    setLoading(true);
    setError("");
    try {
      const result = await adminFetch(endpoint);
      if (requestId !== loadSequence.current) return;
      setData(result);
      if (endpoint === "/system") setSystem(result);
    } catch (err) {
      if (requestId !== loadSequence.current) return;
      setError(err.message || "Unable to load admin data.");
      setData(null);
    } finally {
      if (requestId === loadSequence.current) setLoading(false);
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
    setListPage(1);
    setQueue("");
    setSelected(null);
    setSelectedDetail(null);
    setSidebarOpen(false);
  };

  const openQueue = (destination, nextQueue = "") => {
    setPage(destination);
    setSearch("");
    setStatus("");
    setListPage(1);
    setQueue(nextQueue);
    setSelected(null);
    setSelectedDetail(null);
    setSidebarOpen(false);
  };

  const goToListPage = nextPage => {
    setListPage(Math.max(1, Number(nextPage) || 1));
    setSelected(null);
    setSelectedDetail(null);
  };

  const openAccountDetail = async row => {
    setReturnCustomer(page === "users" && selected ? { customer: selected, detail: selectedDetail } : null);
    setAccountTab(String(row?.status || "").toUpperCase() === "BREACHED" ? "risk" : "overview");
    const accountId = row?.accountId || row?.account?.externalRef;
    if (!accountId) return;
    const targetPage = row?.accountMode === "DEMO"
      ? "trials"
      : ["FUNDED_REVIEW", "FUNDED"].includes(String(row?.status || "").toUpperCase())
        ? "funded"
        : "challenges";
    setPage(targetPage);
    setSearch("");
    setStatus("");
    setListPage(1);
    setQueue("");
    setSelected({ ...row, accountId });
    setSelectedDetail(null);
    try {
      const detail = await adminFetch(`/challenges/${encodeURIComponent(accountId)}`);
      setSelected({
        ...row,
        accountId: detail?.account?.accountId || accountId,
        accountMode: detail?.account?.accountMode || row?.accountMode,
        accountSize: detail?.account?.accountSize || row?.accountSize,
        status: detail?.account?.status || row?.status,
      });
      setSelectedDetail(detail);
    } catch (err) {
      setSelectedDetail({ error: err.message });
    }
  };

  const openPaymentDetail = row => {
    setReturnCustomer(page === "users" && selected ? { customer: selected, detail: selectedDetail } : null);
    setPage("payments");
    setSearch("");
    setStatus("");
    setListPage(1);
    setQueue("");
    setSelected(row);
    setSelectedDetail({ payment: row });
  };

  const openRow = async row => {
    if (page === "users") setCustomerTab("overview");
    if (["challenges", "trials", "funded", "breaches", "risk", "trades"].includes(page)) {
      setAccountTab(["risk", "breaches"].includes(page) || String(row?.status || "").toUpperCase() === "BREACHED" ? "risk" : page === "trades" ? "trading" : "overview");
    }
    setReturnCustomer(null);
    setSelected(row);
    setSelectedDetail(null);
    try {
      if (page === "users") setSelectedDetail(await adminFetch(`/users/${encodeURIComponent(row.customerId)}`));
      if (["challenges", "trials", "funded", "breaches", "risk"].includes(page)) setSelectedDetail(await adminFetch(`/challenges/${encodeURIComponent(row.accountId)}`));
      if (page === "orders" || page === "payments") setSelectedDetail({ payment: row });
      if (page === "payouts") setSelectedDetail(await adminFetch(`/payouts/${encodeURIComponent(row.payoutId)}`));
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

  const returnToCustomer = () => {
    if (!returnCustomer) return;
    setPage("users");
    setSearch("");
    setStatus("");
    setListPage(1);
    setQueue("");
    setSelected(returnCustomer.customer);
    setSelectedDetail(returnCustomer.detail);
    setCustomerTab("accounts");
    setReturnCustomer(null);
  };

  const rows = data?.rows || [];

  const performPayoutAction = async input => {
    if (!payoutAction?.id) return;
    setPayoutBusy(true);
    setError("");
    try {
      const payoutId = encodeURIComponent(payoutAction.id);
      const path = payoutAction.value === "RETRY_EXECUTION"
        ? `/payouts/${payoutId}/execute`
        : payoutAction.value === "RECONCILE"
          ? `/payouts/${payoutId}/reconcile`
          : `/payouts/${payoutId}/action`;

      const body = payoutAction.value === "RETRY_EXECUTION" || payoutAction.value === "RECONCILE"
        ? { reason: input.reason }
        : { action: payoutAction.value, ...input };

      await adminFetch(path, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const detail = await adminFetch(`/payouts/${payoutId}`);
      setSelected(detail?.payout || selected);
      setSelectedDetail(detail);
      setPayoutAction(null);
      await load();
    } catch (err) {
      setError(err?.message || "Unable to update payout.");
    } finally {
      setPayoutBusy(false);
    }
  };

  const toolbar = !["overview", "risk", "breaches", "funnel", "revenue", "launch-readiness", "jobs", "integrations", "errors", "refunds", "products", "pricing", "platforms", "affiliates", "admins", "audit"].includes(page);


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

  const returnSupportToAi = async () => {
    const conversationId = selectedDetail?.conversation?.conversationId;
    if (!conversationId || supportBusy) return;
    setSupportBusy(true);
    setError("");
    try {
      await adminFetch(`/support/${encodeURIComponent(conversationId)}/return-to-ai`, {
        method: "POST",
        body: JSON.stringify({ reason: "Human support returned conversation to AI" }),
      });
      setSelectedDetail(await adminFetch(`/support/${encodeURIComponent(conversationId)}`));
      await load();
    } catch (err) {
      setError(err?.message || "Unable to return support case to AI.");
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

  const loadMoreTrades = async () => {
    const cursor = data?.page?.nextCursor;
    if (!cursor || tradeLoadingMore) return;
    setTradeLoadingMore(true);
    try {
      const next = await adminFetch(`/trades?limit=200&cursor=${encodeURIComponent(cursor)}`);
      setData(previous => ({
        ...next,
        items: [...(previous?.items || []), ...(next?.items || [])],
      }));
    } catch (err) {
      setError(err?.message || "Unable to load more executions.");
    } finally {
      setTradeLoadingMore(false);
    }
  };

  const renderOverview = () => {
    const k = data?.kpis || {};
    const funnel = data?.funnel || {};
    const eventCounts = funnel.byEvent || {};
    const trialSteps = funnel.journeys?.trial?.stages || [];
    const checkoutSteps = funnel.journeys?.paid?.stages || [];
    const trialCount = key => trialSteps.find(stage => stage.key === key)?.count || 0;
    const paidCount = key => checkoutSteps.find(stage => stage.key === key)?.count || 0;
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">Today at a glance</h2>
            <p className="mt-1 text-xs text-zinc-400">Business results and work that needs an operator's attention.</p>
          </div>
          <span className="text-[11px] text-zinc-500">Live admin records · refresh to update</span>
        </div>
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

        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <section className="order-2 rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-5">
            <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold text-white">30-day funnel</h3><p className="mt-1 text-xs text-zinc-500">Tracking signals are preliminary; confirmed payments use actual payment records.</p></div><button onClick={() => changePage("funnel")} className="text-xs text-zinc-400 hover:text-white">View funnel</button></div>
            <div className="mt-5 space-y-3">
              {[
                ["Observed browser visits", eventCounts.landing_view?.sessions || 0],
                ["Observed signup events", eventCounts.signup_completed?.events || 0],
                ["Trial customers", trialCount("trial_created")],
                ["Trial traders", trialCount("trial_first_trade")],
                ["Direct purchase customers", paidCount("payment_completed")],
                ["Confirmed paid orders", funnel.revenueSummary?.paidPayments || 0],
              ].map(([label, count]) => (
                <div key={label} className="flex items-center justify-between border-b border-white/[0.05] pb-3 last:border-0">
                  <span className="text-xs text-zinc-400">{label}</span>
                  <span className="text-sm font-semibold text-white">{count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="order-1 rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-5">
            <div className="flex items-center justify-between">
              <div><h3 className="text-sm font-semibold text-white">Action Center</h3>
                <p className="mt-1 text-xs text-zinc-500">Open a queue to investigate, review or resolve a case.</p>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">Priority queues</span>
            </div>
            <div className="mt-4 space-y-2">
              {[
                ["Account activation", "Paid orders requiring provisioning attention", k.pendingProvisioning, "orders", "provisioning"],
                ["Payment failures today", "Review unsuccessful transactions", k.failedPaymentsToday, "payments", "failed-payments"],
                ["Breaches today", "Inspect rule breaches and evidence", k.breachedToday, "breaches", ""],
                ["Support escalations", "Conversations waiting for a person", k.supportEscalated, "support", "escalated"],
              ].map(([label, description, value, destination, nextQueue]) => (
                <button key={label} type="button" onClick={() => openQueue(destination, nextQueue)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/[0.08] px-3 py-3 text-left transition hover:border-white/20 hover:bg-white/[0.04]">
                  <span className="min-w-0"><span className="block text-[13px] font-medium text-zinc-200">{label}</span>
                    <span className="mt-1 block text-[11px] text-zinc-500">{description}</span></span>
                  <span className="flex shrink-0 items-center gap-2"><span className="min-w-7 rounded-md bg-white/[0.07] px-2 py-1 text-center text-xs font-semibold text-white">{value || 0}</span><ChevronRight size={15} className="text-zinc-500" /></span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Recent customer activity</h3>
          <DataTable rows={data?.recentActivity || []} columns={[
            { key: "event", label: "Activity", render: row => ACTIVITY_LABELS[row.event] || humanize(row.event) },
            { key: "email", label: "Customer", render: row => row.email || "—" },
            { key: "accountId", label: "Account", render: row => row.accountId || "—" },
            { key: "occurredAt", label: "When", render: row => dateTime(row.occurredAt) },
          ]} empty="No recent funnel activity recorded." />
          <p className="text-xs text-zinc-500">Latest tracked events; payment and account records remain authoritative for sales and activation state.</p>
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
          <section><h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Recent payments</h3>
            <DataTable rows={data?.recentPayments || []} onRow={openPaymentDetail} columns={[
              { key: "orderId", label: "Order" }, { key: "email", label: "Customer" },
              { key: "amount", label: "Amount", render: r => money(r.amount, r.currency || "USD") },
              { key: "status", label: "Status", render: r => <Badge>{r.status}</Badge> },
            ]} />
          </section>
          <section><h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Recent accounts</h3>
            <DataTable rows={data?.recentAccounts || []} onRow={openAccountDetail} columns={[
              { key: "accountId", label: "Account" }, { key: "accountSize", label: "Size", render: r => money(r.accountSize, "USD") },
              { key: "accountMode", label: "Type" }, { key: "status", label: "Status", render: r => <Badge>{r.status}</Badge> },
            ]} />
          </section>
        </div>
      </div>
    );
  };

  const renderUsers = () => <div className="space-y-3"><DataTable rows={rows} onRow={openRow} columns={[
    { key: "primaryEmail", label: "User" },
    { key: "customerId", label: "Customer ID" },
    { key: "createdAt", label: "Joined", render: r => dateTime(r.createdAt) },
    { key: "lastAuthenticatedAt", label: "Last Login", render: r => dateTime(r.lastAuthenticatedAt) },
    { key: "challenges", label: "Challenges", render: r => r.stats?.challenges || 0 },
    { key: "trials", label: "Trials", render: r => r.stats?.trials || 0 },
    { key: "funded", label: "Funded", render: r => r.stats?.funded || 0 },
    { key: "spend", label: "Spend", render: r => money(r.stats?.totalSpend || 0) },
    { key: "status", label: "Status", render: r => <Badge>{r.status}</Badge> },
  ]} /><Pagination pagination={data?.pagination} onPage={goToListPage} /></div>;

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

  const renderChallenges = () => <div className="space-y-3"><DataTable rows={rows} onRow={openRow} columns={challengeColumns} /><Pagination pagination={data?.pagination} onPage={goToListPage} /></div>;

  const paymentColumns = [
    { key: "orderId", label: "Order" },
    { key: "email", label: "Customer" },
    { key: "challenge", label: "Requested Challenge", render: r => paymentChallengeLabel(r) },
    { key: "amount", label: "Price", render: r => money(r.amount, r.currency || "USD") },
    { key: "paymentMethod", label: "Method" },
    { key: "provider", label: "Provider" },
    { key: "providerPaymentId", label: "Provider Ref", render: r => r.providerPaymentId || r.providerInvoiceId || "—" },
    { key: "accountId", label: "Account", render: r => r.accountId || "Not created" },
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
        {data?.page?.hasMore && (
          <div className="flex justify-center">
            <button
              type="button"
              disabled={tradeLoadingMore}
              onClick={loadMoreTrades}
              className="rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/[0.06] disabled:opacity-40"
            >
              {tradeLoadingMore ? "Loading…" : "Load more executions"}
            </button>
          </div>
        )}
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
    const k = data?.kpis || {};
    const revenue = data?.revenueSummary || {};
    const journey = data?.journeys?.[journeyView] || {};
    const stages = journey.stages || [];
    const acquisition = (data?.acquisition || []).filter(row =>
      [row.source, row.campaign, row.creatorId, row.creativeId, row.market, row.language]
        .some(value => String(value || "").toLowerCase().includes(acquisitionSearch.trim().toLowerCase())),
    );
    const acquisitionColumns = [
      { key: "source", label: "Source" },
      { key: "campaign", label: "Campaign", render: row => row.campaign || "—" },
      { key: "creatorId", label: "Creator", render: row => row.creatorId || "—" },
      { key: "creativeId", label: "Creative", render: row => row.creativeId || "—" },
      { key: "market", label: "Market", render: row => row.market || "—" },
      { key: "registrations", label: "Registrations" },
      { key: "trialsCreated", label: "Trials" },
      { key: "activatedTrials", label: "First trades" },
      { key: "paidConversions", label: "Paid orders" },
      { key: "revenue", label: "Confirmed sales", render: row => money(row.revenue) },
    ];
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {["7", "30", "90"].map(value => (
              <button key={value} type="button" onClick={() => setDays(value)}
                className={"rounded-lg border px-3 py-2 text-xs font-semibold " + (days === value ? "border-white bg-white text-black" : "border-white/10 text-zinc-400")}>{value}D</button>
            ))}
          </div>
          <div className="flex gap-2">
            {[["trial", "Free Trial"], ["paid", "Direct Purchase"]].map(([value, label]) => (
              <button key={value} type="button" onClick={() => setJourneyView(value)}
                className={"rounded-lg border px-3 py-2 text-xs font-semibold " + (journeyView === value ? "border-white bg-white text-black" : "border-white/10 text-zinc-400")}>{label}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Observed visits" value={k.visitors || 0} detail="Browser tracking; not unique customers" />
          <Kpi label="Trial creation events" value={k.trialsCreated || 0} detail="Event count; customer cohort shown below" />
          <Kpi label="Confirmed paid orders" value={revenue.paidPayments || 0} detail="Current PAID records in period" />
          <Kpi label="Confirmed sales · USD" value={money(revenue.confirmedSalesUsd)} detail="Payment ledger; not net profit" />
        </div>
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-white">{journey.label || "Observed journey"}</h3>
            <p className="mt-1 text-xs leading-5 text-zinc-500">{journey.identity === "customer" ? journey.description : "Conversion rates unavailable until linked customer records are returned. Activity events above are observational; sales come from confirmed payments."} Customer-cohort rates may increase as existing customers trade or pay later.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stages.map((stage, index) => (
              <div key={stage.key} className="rounded-xl border border-white/[0.07] bg-[#111] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-zinc-500">{stage.label}</p>
                  <span className="text-[10px] text-zinc-600">{index + 1}/{stages.length}</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-white">{stage.count || 0}</p>
                <div className="mt-3 flex justify-between gap-2 text-[10px] text-zinc-500">
                  {journey.identity === "customer" ? (
                    <>
                      <span>From cohort {pct((stage.overallRate || 0) * 100)}</span>
                      <span>{stage.stepRate == null ? "Independent outcome" : `Step ${pct((stage.stepRate || 0) * 100)}`}</span>
                    </>
                  ) : <span>Conversion rate unavailable</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Acquisition sources</h3>
              <p className="mt-1 text-xs text-zinc-500">First-touch source, campaign, creator and creative. Paid orders and USD sales are reconciled to current payment records.</p>
            </div>
            <input type="search" value={acquisitionSearch} onChange={event => setAcquisitionSearch(event.target.value)}
              placeholder="Filter source, creator, campaign…" aria-label="Filter acquisition sources"
              className="h-10 w-full rounded-lg border border-white/10 bg-[#101010] px-3 text-xs text-white placeholder:text-zinc-600 sm:w-72" />
          </div>
          <DataTable rows={acquisition} columns={acquisitionColumns}
            empty="No matching attributed activity in this period." />
        </section>
      </div>
    );
  };

  const renderRevenue = () => {
    const summary = data?.revenueSummary || {};
    const methods = summary.byMethod || [];
    const products = summary.byProduct || [];
    return (
      <div className="space-y-5">
        <div className="flex gap-2">
          {["7", "30", "90"].map(value => (
            <button key={value} type="button" onClick={() => setDays(value)}
              className={"rounded-lg border px-3 py-2 text-xs font-semibold " + (days === value ? "border-white bg-white text-black" : "border-white/10 text-zinc-400")}>{value}D</button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Confirmed sales · USD" value={money(summary.confirmedSalesUsd)} detail="Current PAID payments in the period" />
          <Kpi label="Attributed sales · USD" value={money(summary.attributedSalesUsd)} detail="Paid orders with recorded acquisition tags" />
          <Kpi label="Unattributed sales · USD" value={money(summary.unattributedSalesUsd)} detail="Paid orders missing acquisition tags" />
          <Kpi label="Confirmed paid orders" value={summary.paidPayments || 0} detail="Authoritative payment records" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Sales by payment method</h3>
            <DataTable rows={methods} columns={[
              { key: "method", label: "Method" },
              { key: "paidPayments", label: "Paid orders" },
              { key: "salesUsd", label: "Confirmed USD", render: row => money(row.salesUsd) },
            ]} empty="No confirmed payments for this period." />
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Sales by challenge</h3>
            <DataTable rows={products} columns={[
              { key: "accountSize", label: "Account size", render: row => row.accountSize ? money(row.accountSize) : "—" },
              { key: "step", label: "Steps", render: row => row.step || "—" },
              { key: "paidPayments", label: "Paid orders" },
              { key: "salesUsd", label: "Confirmed USD", render: row => money(row.salesUsd) },
            ]} empty="No confirmed challenge sales for this period." />
          </section>
        </div>
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">Unsuccessful payment outcomes</h3>
            <button type="button" onClick={() => changePage("payments")}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white">Review payments</button>
          </div>
          <DataTable rows={summary.failedPaymentOutcomes || []} columns={[
            { key: "provider", label: "Payment provider" },
            { key: "status", label: "Latest order status" },
            { key: "payments", label: "Orders" },
          ]} empty="No failed, expired, or underpaid orders updated in this period." />
          <p className="text-xs text-zinc-500">Counts of currently unsuccessful payment records updated during this window, grouped by provider and status. These are orders, not unique customers or unrecovered revenue.</p>
        </section>
        <section className="rounded-xl border border-white/[0.07] bg-[#111] p-4">
          <h3 className="text-sm font-semibold text-white">Refund activity</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Kpi label="Refunded payments" value={summary.refundedPayments || 0} detail="Refunded records updated in period" />
            <Kpi label="Refunded amount · USD" value={money(summary.refundedAmountUsd)} detail="Original order amounts; not net settlements" />
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-500">Confirmed sales are current PAID orders with payment dates in the selected window; refunded orders are excluded. Refund activity uses the last update date and may include orders paid in earlier periods. Provider charges, affiliate commissions, and profit are not calculated here.</p>
        </section>
      </div>
    );
  };

  const renderPayouts = () => {
    const requested = rows.filter(row => row.status === "REQUESTED").length;
    const reviewing = rows.filter(row => ["REVIEWING", "APPROVED"].includes(row.status)).length;
    const processing = rows.filter(row => ["PROCESSING", "SENT"].includes(row.status)).length;
    const paidRows = rows.filter(row => row.status === "PAID");
    const paid = paidRows.reduce((sum, row) => sum + Number(row.requestedAmountUsd || 0), 0);
    const acgFeesInr = paidRows
      .filter(row => String(row.accountingCurrency || row.settlementCurrency || "").toUpperCase() === "INR")
      .reduce((sum, row) => sum + Number(row.providerFeePaidByAcg || 0), 0);
    const exactReceiptCount = paidRows.filter(row =>
      row.traderReceivedAmount != null
      && row.settlementAmount != null
      && Math.round(Number(row.traderReceivedAmount) * 100) === Math.round(Number(row.settlementAmount) * 100)
    ).length;

    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Kpi label="Requested (page)" value={requested} detail="Awaiting payout review" />
          <Kpi label="Review / Approved (page)" value={reviewing} detail="Operator attention" />
          <Kpi label="Processing / Sent (page)" value={processing} detail="Money moving" />
          <Kpi label="Paid to traders (page)" value={money(paid)} detail="Completed payout value for visible rows" />
          <Kpi label="ACG payout fees · INR" value={money(acgFeesInr, "INR")} detail={`${exactReceiptCount}/${paidRows.length} exact receipts verified`} />
        </div>

        <DataTable
          rows={rows}
          onRow={openRow}
          empty="No payout requests found."
          columns={[
            { key: "payoutId", label: "Payout" },
            { key: "accountId", label: "Account" },
            { key: "customerId", label: "Customer" },
            { key: "requestedAmountUsd", label: "Amount", render: row => money(row.requestedAmountUsd) },
            { key: "method", label: "Method", render: row => row.method || "—" },
            { key: "destination", label: "Destination", render: row => row.destination?.destination || "—" },
            { key: "settlement", label: "Trader Settlement", render: row => row.settlementAmount == null ? "Pending" : money(row.settlementAmount, row.settlementCurrency || "USD") },
            { key: "acgCost", label: "ACG Cost", render: row => row.acgTotalCostAmount == null ? "—" : money(row.acgTotalCostAmount, row.accountingCurrency || row.settlementCurrency || "INR") },
            { key: "status", label: "Status", render: row => <Badge>{row.status}</Badge> },
            { key: "requestedAt", label: "Requested", render: row => dateTime(row.requestedAt) },
          ]}
        />
        <Pagination pagination={data?.pagination} onPage={goToListPage} />
        <p className="text-[11px] text-zinc-500">Payout summaries above cover only the records loaded on this page, not all payouts. A full-period aggregate requires a separate authoritative API.</p>
      </div>
    );
  };

  const renderSupport = () => <div className="space-y-3"><DataTable rows={rows} onRow={openRow} columns={[
    { key: "conversationId", label: "Case" },
    { key: "channel", label: "Channel", render: r => <Badge>{r.channel || "WEB"}</Badge> },
    { key: "customer", label: "Customer", render: r => r.email?.customerEmail || r.customerId || "Anonymous" },
    { key: "subject", label: "Subject", render: r => r.email?.subject || "Web support" },
    { key: "category", label: "Category" },
    { key: "lastMessageAt", label: "Last Activity", render: r => dateTime(r.lastMessageAt) },
    { key: "status", label: "Status", render: r => <Badge>{r.status}</Badge> },
  ]} /><Pagination pagination={data?.pagination} onPage={goToListPage} /></div>;

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

      {page === "integrations" && (
        <section className="rounded-xl border border-white/[0.07] bg-[#111] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Payout execution</h3>
              <p className="mt-1 max-w-2xl text-[11px] leading-5 text-zinc-500">ACG pays payout-provider fees. Customer requests and admin review are ready; automated Sunpay execution stays closed until Sunpay can guarantee the trader receives the full quoted amount after provider fees.</p>
            </div>
            <Badge>{data?.capabilities?.payoutAutomation ? "AUTOMATED" : "MANUAL"}</Badge>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {(data?.payoutProviders || []).map(provider => (
              <div key={provider.id} className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">{provider.label}</p>
                    <p className="mt-1 text-[10px] text-zinc-600">{(provider.methods || []).join(" · ") || "No methods"}</p>
                    {provider.feePolicy && <p className="mt-1 text-[9px] uppercase tracking-wider text-zinc-700">Fee policy · {humanize(provider.feePolicy)}</p>}
                  </div>
                  <Badge>{provider.status}</Badge>
                </div>
                <p className="mt-3 text-[10px] leading-4 text-zinc-500">
                  {provider.automatic
                    ? !provider.configured
                      ? "Automatic adapter credentials are not connected."
                      : provider.automaticReady
                        ? "Provider can execute payout operations automatically."
                        : provider.status === "FEE_GROSS_UP_REQUIRED"
                          ? "Credentials are connected. Automation is intentionally blocked because ACG covers the fee and Sunpay does not expose a pre-submit gross-up mechanism in the supplied API."
                          : "Provider is connected but not ready for automatic payout execution."
                    : "Operator completes the transfer externally and records the reference here."}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/20 px-3 py-3 text-[11px]">
              <span className="text-zinc-500">Destination encryption</span>
              <Badge>{data?.payoutSecurity?.destinationEncryption ? "READY" : "NOT CONFIGURED"}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/20 px-3 py-3 text-[11px]">
              <span className="text-zinc-500">Signed payout quotes</span>
              <Badge>{data?.payoutSecurity?.signedQuotes ? "READY" : "NOT CONFIGURED"}</Badge>
            </div>
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

  const renderAudit = () => <div className="space-y-3"><DataTable rows={rows} columns={[
    { key: "createdAt", label: "Timestamp", render: r => dateTime(r.createdAt) },
    { key: "adminEmail", label: "Admin" }, { key: "action", label: "Action" }, { key: "entityType", label: "Entity Type" },
    { key: "entityId", label: "Entity" }, { key: "reason", label: "Reason" }, { key: "ip", label: "IP" },
  ]} /><Pagination pagination={data?.pagination} onPage={goToListPage} /></div>;

  const renderContent = () => {
    if (loading) return <Loading />;
    if (error) return <Empty title="Admin data could not be loaded" text={error} />;
    if (page === "overview") return renderOverview();
    if (page === "users") return renderUsers();
    if (["challenges","trials","funded"].includes(page)) return renderChallenges();
    if (page === "orders" || page === "payments") return <div className="space-y-3"><DataTable rows={rows} columns={paymentColumns} onRow={openRow} /><Pagination pagination={data?.pagination} onPage={goToListPage} /></div>;
    if (page === "trades") return renderTrades();
    if (page === "risk" || page === "breaches") return renderRisk();
    if (page === "funnel") return renderFunnel();
    if (page === "revenue") return renderRevenue();
    if (page === "support") return renderSupport();
    if (page === "launch-readiness") return <LaunchReadinessPanel data={data} adminFetch={adminFetch} reload={load} />;
    if (page === "integrations" || page === "platforms") return renderSystem();
    if (page === "admins") return <div className="space-y-4"><DataTable rows={rows} columns={[
      { key: "email", label: "Admin" },
      { key: "role", label: "Role" },
      { key: "source", label: "Source" },
      { key: "current", label: "Current", render: r => r.current ? <Badge>ACTIVE</Badge> : "—" },
    ]} /><p className="text-xs text-zinc-600">{data?.note}</p></div>;
    if (page === "audit") return renderAudit();
    if (page === "payouts") return renderPayouts();
    if (page === "refunds") return unavailable("Refund workflow is not connected yet", "Payments can reach REFUNDED from the provider, but there is not yet a first-class admin refund request/approval workflow.", "refunds");
    if (page === "products") return unavailable("Challenge product admin is not connected yet", "Current challenge rules/pricing are code-driven. Product versioning should be introduced before making these editable.", "challengeProductAdmin");
    if (page === "pricing") return unavailable("Pricing admin is not connected yet", "Pricing is currently code-driven. Publishing mutable pricing without version snapshots would risk changing historical challenge terms.", "pricingAdmin");
    if (page === "platforms") return renderSystem();
    if (page === "jobs") return unavailable("Job inspection is not exposed yet", "The backend uses pg-boss workers, but there is no safe operator read API for job payloads/retries yet. Do not expose raw queue controls without idempotency and permissions.");
    if (page === "errors") return unavailable("Central error inbox is not exposed yet", "Runtime errors are logged today, but they are not yet stored as first-class incident records that can be resolved or reopened safely.");
    if (page === "affiliates") return unavailable("Affiliate operations are not connected yet", "Attribution fields already exist in analytics and payments, but there is no affiliate entity, commission ledger or payout workflow yet.", "affiliates");
    return null;
  };

  const pageStatusOptions = PAGE_STATUS_OPTIONS[page] || [];
  const workspaceId = workspaceForPage(page);
  const workspaceTabs = WORKSPACE_TABS[workspaceId] || [];
  const userDetail = selectedDetail?.customer;
  const accountDetail = selectedDetail?.account;
  const tradingDetail = selectedDetail?.trading;
  const breachDetail = accountDetail?.breach;
  const openPositions = tradingDetail?.openPositions?.items || [];
  const closedPositions = tradingDetail?.closedPositions?.items || [];
  const executionDeals = tradingDetail?.deals?.items || [];
  const tradingOrders = tradingDetail?.orders?.items || [];
  const lifecycleEvents = tradingDetail?.lifecycle || [];
  const tradingPolicyShadowEvents = tradingDetail?.tradingPolicyShadowEvents || [];
  const effectivePermissions = tradingDetail?.tradingPermissionStatus?.effectivePolicies;
  const permissionControl = tradingDetail?.tradingPermissionStatus?.enforcementControl;
  const weekendActions = tradingDetail?.weekendActions || [];
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
        <nav aria-label="Admin workspaces" className="h-[calc(100vh-128px)] overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Workspaces</p>
          {NAV.filter(item => item.id !== "integrations").map(item => {
            const Icon = item.icon;
            const active = workspaceId === item.id;
            return <button key={item.id} onClick={() => changePage(item.id)} aria-current={active ? "page" : undefined}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${active ? "bg-white text-black" : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"}`}>
              <Icon size={16} /><span>{item.label}</span>
            </button>;
          })}
          <div className="my-5 border-t border-white/[0.08]" />
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Administration</p>
          {NAV.filter(item => item.id === "integrations").map(item => {
            const Icon = item.icon;
            const active = workspaceId === item.id;
            return <button key={item.id} onClick={() => changePage(item.id)} aria-current={active ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${active ? "bg-white text-black" : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"}`}>
              <Icon size={16} /><span>{item.label}</span>
            </button>;
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.06] p-3">
          <button onClick={signOut} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-zinc-500 hover:bg-white/[0.04] hover:text-white"><LogOut size={14} /> Sign out</button>
        </div>
      </aside>

      <div className="lg:pl-[238px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#090909]/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button className="rounded-lg border border-white/10 p-2 text-zinc-400 lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={16} /></button>
            <div className="min-w-0"><h1 className="truncate text-[17px] font-semibold text-white">{NAV.find(item => item.id === workspaceId)?.label || TITLES[page]?.[0]}</h1><p className="hidden truncate text-[11px] text-zinc-500 sm:block">{TITLES[page]?.[1]}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} className="rounded-lg border border-white/[0.08] p-2 text-zinc-500 hover:text-white"><RefreshCw size={14} /></button>

            <div className="hidden max-w-[220px] truncate rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] text-zinc-500 sm:block">{user?.email}</div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6">
          {workspaceTabs.length > 0 && (
            <nav aria-label={`${NAV.find(item => item.id === workspaceId)?.label} sections`} className="mb-5 flex gap-1 overflow-x-auto border-b border-white/[0.08] pb-px">
              {workspaceTabs.map(tab => (
                <button key={tab.id} type="button" onClick={() => changePage(tab.id)}
                  aria-current={page === tab.id ? "page" : undefined}
                  className={`shrink-0 border-b-2 px-3 py-3 text-[12px] font-medium transition ${page === tab.id ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-200"}`}>
                  {tab.label}
                </button>
              ))}
            </nav>
          )}
          {toolbar && <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" /><input value={search} onChange={e => { setSearch(e.target.value); setListPage(1); }} placeholder="Search by email, ID, order or account…" className="h-10 w-full rounded-lg border border-white/[0.08] bg-[#0e0e0e] pl-9 pr-3 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-white/20" /></div>
            {pageStatusOptions.length > 0 && <select value={status} onChange={e => { setStatus(e.target.value); setListPage(1); setQueue(""); }} className="h-10 rounded-lg border border-white/[0.08] bg-[#0e0e0e] px-3 text-xs text-zinc-400 outline-none">
              <option value="">All statuses</option>
              {pageStatusOptions.map(v => <option key={v} value={v}>{v}</option>)}
            </select>}
          </div>}
          {queue && <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] px-4 py-3">
            <div><p className="text-xs font-semibold text-amber-200">{QUEUE_LABELS[queue] || humanize(queue)}</p><p className="mt-0.5 text-[11px] text-zinc-500">Showing only records requiring this operational follow-up.</p></div>
            <button type="button" onClick={() => { setQueue(""); setStatus(""); setListPage(1); }} className="rounded-lg border border-white/10 px-3 py-2 text-[11px] font-semibold text-zinc-300 hover:bg-white/[0.04]">Clear queue</button>
          </div>}
          {renderContent()}
        </main>
      </div>

      {selected && page === "users" && <Inspector title={selected.primaryEmail} subtitle={selected.customerId} onClose={() => {setSelected(null);setSelectedDetail(null);}}>
        {!selectedDetail ? <Loading /> : selectedDetail.error ? <Empty title="Unable to load customer" text={selectedDetail.error} /> : <>
          <div className="grid gap-3 sm:grid-cols-3"><Kpi label="Total Spend" value={money(selectedDetail.stats?.totalSpend)} /><Kpi label="Accounts" value={selectedDetail.stats?.accounts || 0} /><Kpi label="Orders" value={selectedDetail.stats?.orders || 0} /></div>
          <nav aria-label="Customer profile sections" className="mt-5 flex gap-1 border-b border-white/[0.08]">
            {[["overview", "Overview"], ["accounts", "Accounts"], ["orders", "Orders"]].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setCustomerTab(id)}
                aria-current={customerTab === id ? "page" : undefined}
                className={`border-b-2 px-3 py-3 text-xs font-medium ${customerTab === id ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-200"}`}>
                {label}
              </button>
            ))}
          </nav>
          {customerTab === "overview" && (<>
            <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#111] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-xs font-semibold text-white">Customer status</p><div className="mt-2"><Badge>{userDetail?.status}</Badge></div></div>
                <div className="flex gap-2">
                  {userDetail?.status !== "BLOCKED" && <button onClick={() => setAction({type:"customer",id:userDetail.customerId,value:"BLOCKED",label:"Block customer"})} className="rounded-lg border border-red-400/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-400/10">Block</button>}
                  {userDetail?.status === "BLOCKED" && <button onClick={() => setAction({type:"customer",id:userDetail.customerId,value:"ACTIVE",label:"Reactivate customer"})} className="rounded-lg border border-emerald-400/20 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-400/10">Reactivate</button>}
                </div>
              </div>
              <div className="mt-4 grid gap-3 border-t border-white/[0.08] pt-4 sm:grid-cols-2"><div><p className="text-[10px] uppercase tracking-wider text-zinc-500">Joined</p><p className="mt-1 text-xs text-zinc-200">{dateTime(userDetail?.createdAt || selected?.createdAt)}</p></div><div><p className="text-[10px] uppercase tracking-wider text-zinc-500">Last login</p><p className="mt-1 text-xs text-zinc-200">{dateTime(userDetail?.lastAuthenticatedAt || selected?.lastAuthenticatedAt)}</p></div></div>
              <p className="mt-3 text-xs text-zinc-500">Review the account and purchase history before making a change. All privileged actions remain subject to server authorization and audit.</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setCustomerTab("accounts")} className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#111] p-4 text-left hover:bg-white/[0.05]">
                <span><span className="block text-sm font-semibold">Trading accounts</span><span className="mt-1 block text-xs text-zinc-500">View trial, challenge and funded records</span></span><ChevronRight size={16} />
              </button>
              <button type="button" onClick={() => setCustomerTab("orders")} className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#111] p-4 text-left hover:bg-white/[0.05]">
                <span><span className="block text-sm font-semibold">Purchases & payments</span><span className="mt-1 block text-xs text-zinc-500">Review orders and activation</span></span><ChevronRight size={16} />
              </button>
            </div>
          </>)}
          {customerTab === "accounts" && (<section className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-white">Challenges, trials & funded accounts</h3>
            <DataTable rows={selectedDetail.accounts || []} onRow={openAccountDetail} columns={challengeColumns.slice(0,7)} />
          </section>)}
          {customerTab === "orders" && (<section className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-white">Orders & payments</h3>
            <DataTable rows={selectedDetail.payments || []} onRow={openPaymentDetail} columns={paymentColumns.slice(0,6)} />
          </section>)}
        </>}
      </Inspector>}

      {selected && ["challenges","trials","funded","breaches","risk","trades"].includes(page) && <Inspector title={selected.accountId} subtitle={`${selected.accountMode} · ${money(selected.accountSize,"USD")}`} onClose={() => {setSelected(null);setSelectedDetail(null);}}>
        {!selectedDetail ? <Loading /> : selectedDetail.error ? <Empty title="Unable to load account" text={selectedDetail.error} /> : <>
          {returnCustomer && <button type="button" onClick={returnToCustomer} className="mb-4 flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white">← Back to customer</button>}
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
          <nav aria-label="Account detail sections" className="mt-5 flex gap-1 overflow-x-auto border-b border-white/[0.08]">
            {[
              ["overview", "Overview"],
              ["trading", "Trading"],
              ["risk", "Risk & Rules"],
              ["history", "History"],
            ].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setAccountTab(id)}
                aria-current={accountTab === id ? "page" : undefined}
                className={`shrink-0 border-b-2 px-3 py-3 text-xs font-medium ${accountTab === id ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-200"}`}>
                {label}
              </button>
            ))}
          </nav>
          {accountTab === "risk" && breachDetail && (
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

          {accountTab === "overview" && (
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
          )}

          {accountTab === "trading" && (
          <section className="mt-5 rounded-xl border border-white/[0.07] bg-[#111] p-4">
            <p className="text-xs font-semibold text-white">Trading statistics</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi label="Total Trades" value={accountDetail?.totalTrades || 0} />
              <Kpi label="Wins" value={accountDetail?.winningTrades || 0} />
              <Kpi label="Losses" value={accountDetail?.losingTrades || 0} />
              <Kpi label="Win Rate" value={pct((Number(accountDetail?.totalTrades || 0) > 0 ? Number(accountDetail?.winningTrades || 0) / Number(accountDetail.totalTrades) : 0) * 100)} />
            </div>
          </section>
          )}

          {accountTab === "trading" && selectedDetail?.tradingError && (
            <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-4 text-xs text-amber-200">
              Trader history is temporarily unavailable: {selectedDetail.tradingError.message}
            </div>
          )}

          {tradingDetail && (
            <>
              {accountTab === "trading" && (<>
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

              </>)}
              {accountTab === "risk" && (<>
              <section className="mt-5">
                <div className="mb-3 flex flex-wrap items-end justify-between gap-3"><div><h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Trading permission observations</h3><p className="mt-1 text-[11px] text-zinc-600">{tradingPolicyShadowEvents.length} recent observations · Permission version {tradingDetail?.tradingPermissionStatus?.permissionVersion ?? 'unknown'}</p></div><div className="flex flex-wrap gap-2"><Badge>NEWS {permissionControl?.newsDisabled ? 'DISABLED BY OPERATOR' : effectivePermissions?.newsTrading?.mode || 'UNKNOWN'}</Badge><Badge>WEEKEND {permissionControl?.weekendDisabled ? 'DISABLED BY OPERATOR' : effectivePermissions?.weekendHolding?.mode || 'UNKNOWN'}</Badge></div></div>
                <DataTable rows={tradingPolicyShadowEvents} empty="No news/weekend shadow events recorded for this account." columns={[
                  { key: "observedAt", label: "Observed", render: r => dateTime(r.observedAt) },
                  { key: "type", label: "Event", render: r => humanize(r.type) },
                  { key: "symbol", label: "Symbol" },
                  { key: "action", label: "Action", render: r => humanize(r.action) },
                  { key: "eventTitle", label: "News / cutoff", render: r => r.eventTitle || (r.weekendAutoCloseAt ? `Weekend cutoff ${dateTime(r.weekendAutoCloseAt)}` : "—") },
                  { key: "eventCurrency", label: "Currency", render: r => r.eventCurrency || "—" },
                  { key: "enforcementEnabled", label: "Enforced", render: r => r.enforcementEnabled ? <Badge>YES</Badge> : <span className="text-zinc-500">No</span> },
                ]} />
              </section>

              <section className="mt-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Weekend closure jobs</h3>
                <DataTable rows={weekendActions} empty="No weekend closure jobs planned for this account." columns={[
                  { key: 'symbol', label: 'Symbol' },
                  { key: 'mode', label: 'Mode', render: r => <Badge>{r.mode}</Badge> },
                  { key: 'state', label: 'State', render: r => <Badge>{r.state}</Badge> },
                  { key: 'processingStartAt', label: 'Begins', render: r => dateTime(r.processingStartAt) },
                  { key: 'requiredFlatAt', label: 'Flat target', render: r => dateTime(r.requiredFlatAt) },
                  { key: 'confirmedAt', label: 'Confirmed', render: r => r.confirmedAt ? `${dateTime(r.confirmedAt)}${r.late ? ' · LATE' : ''}` : '—' },
                  { key: 'attempt', label: 'Attempts' },
                  { key: 'lastError', label: 'Last error', render: r => r.lastError || '—' },
                ]} />
              </section>

              </>)}
              {accountTab === "history" && (
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
              )}
            </>
          )}

          {accountTab === "overview" && (<>
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

          </>)}
          {accountTab === "risk" && (
          <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#111] p-4"><p className="text-xs font-semibold text-white">Rules snapshot</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><div><p className="text-[10px] text-zinc-600">Daily drawdown</p><p className="mt-1 text-sm text-zinc-300">{pct(accountDetail?.rules?.dailyDrawdown)}</p></div><div><p className="text-[10px] text-zinc-600">Max drawdown</p><p className="mt-1 text-sm text-zinc-300">{pct(accountDetail?.rules?.maxDrawdown)}</p></div><div><p className="text-[10px] text-zinc-600">Minimum trading days</p><p className="mt-1 text-sm text-zinc-300">{accountDetail?.rules?.minimumTradingDays || 0}</p></div><div><p className="text-[10px] text-zinc-600">Platform</p><p className="mt-1 text-sm text-zinc-300">{accountDetail?.platform || "—"}</p></div></div></div>
          )}
        </>}
      </Inspector>}

      {selected && ["orders","payments"].includes(page) && <Inspector title={selected.orderId || "Payment"} subtitle={selected.email || selected._id} onClose={() => {setSelected(null);setSelectedDetail(null);}}>
        {returnCustomer && <button type="button" onClick={returnToCustomer} className="mb-4 flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white">← Back to customer</button>}
        <div className="grid gap-3 sm:grid-cols-3">
          <Kpi label="Amount" value={money(selected.amount, selected.currency || "USD")} />
          <Kpi label="Payment" value={selected.status || "—"} />
          <Kpi label="Activation" value={selected.activation?.status || "NOT_STARTED"} />
        </div>

        <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#111] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-white">Requested challenge</p>
              <p className="mt-1 text-[11px] text-zinc-500">Immutable checkout configuration captured before payment.</p>
            </div>
            <Badge>{selected.challengeDefinition?.step === "2step" ? "2-STEP" : selected.challengeDefinition?.step === "1step" ? "1-STEP" : "CHALLENGE"}</Badge>
          </div>
          <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Account size</p><p className="mt-1 text-sm font-semibold text-white">{selected.challengeDefinition?.accountSize ? money(selected.challengeDefinition.accountSize, "USD") : "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Evaluation</p><p className="mt-1 text-xs text-zinc-300">{selected.challengeDefinition?.step === "2step" ? "2-Step Challenge" : selected.challengeDefinition?.step === "1step" ? "1-Step Challenge" : selected.challengeDefinition?.step || "—"}</p></div>
            {selected.challengeDefinition?.step === "2step" ? <>
              <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Phase 1 target</p><p className="mt-1 text-xs text-zinc-300">{selected.challengeDefinition?.rules?.phase1ProfitTarget != null ? `${selected.challengeDefinition.rules.phase1ProfitTarget}%` : "—"}</p></div>
              <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Phase 2 target</p><p className="mt-1 text-xs text-zinc-300">{selected.challengeDefinition?.rules?.phase2ProfitTarget != null ? `${selected.challengeDefinition.rules.phase2ProfitTarget}%` : "—"}</p></div>
            </> : <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Profit target</p><p className="mt-1 text-xs text-zinc-300">{selected.challengeDefinition?.rules?.profitTarget != null ? `${selected.challengeDefinition.rules.profitTarget}%` : "—"}</p></div>}
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Daily loss</p><p className="mt-1 text-xs text-zinc-300">{selected.challengeDefinition?.rules?.dailyLoss != null ? `${selected.challengeDefinition.rules.dailyLoss}%` : "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Maximum loss</p><p className="mt-1 text-xs text-zinc-300">{selected.challengeDefinition?.rules?.maxLoss != null ? `${selected.challengeDefinition.rules.maxLoss}%` : "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Minimum trading days</p><p className="mt-1 text-xs text-zinc-300">{selected.challengeDefinition?.rules?.minTradingDays ?? "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Profit split</p><p className="mt-1 text-xs text-zinc-300">{selected.commercialConfig?.profitSplit != null ? `${selected.commercialConfig.profitSplit}%` : "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Payout frequency</p><p className="mt-1 text-xs text-zinc-300">{selected.commercialConfig?.payoutFrequency || "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">News trading</p><p className="mt-1 text-xs text-zinc-300">{selected.commercialConfig?.newsTrading == null ? "—" : selected.commercialConfig.newsTrading ? "Allowed" : "Restricted"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Weekend holding</p><p className="mt-1 text-xs text-zinc-300">{selected.commercialConfig?.weekendHolding == null ? "—" : selected.commercialConfig.weekendHolding ? "Allowed" : "Restricted"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Platform</p><p className="mt-1 text-xs text-zinc-300">ACG Trader</p></div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#111] p-4">
          <p className="text-xs font-semibold text-white">Payment & activation</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Method</p><p className="mt-1 text-xs text-zinc-300">{selected.paymentMethod || "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Provider</p><p className="mt-1 text-xs text-zinc-300">{selected.provider || "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Provider amount</p><p className="mt-1 text-xs text-zinc-300">{selected.providerAmount != null ? money(selected.providerAmount, selected.providerCurrency || "INR") : "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Provider status</p><p className="mt-1 text-xs text-zinc-300">{selected.providerStatus || "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Provider reference</p><p className="mt-1 break-all text-xs text-zinc-300">{selected.providerPaymentId || selected.providerInvoiceId || "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-600">Challenge account</p><p className="mt-1 text-xs text-zinc-300">{selected.accountId || "Not created yet"}</p></div>
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

      {selected && page === "payouts" && <Inspector
        title={selectedDetail?.payout?.payoutId || selected.payoutId || "Payout"}
        subtitle={selectedDetail?.payout ? `${selectedDetail.payout.accountId} · ${selectedDetail.payout.customerId}` : selected.accountId}
        onClose={() => { setSelected(null); setSelectedDetail(null); setPayoutAction(null); }}
      >
        {!selectedDetail ? <Loading /> : selectedDetail.error ? <Empty title="Unable to load payout" text={selectedDetail.error} /> : (() => {
          const payout = selectedDetail.payout;
          const destination = selectedDetail.destinationDetails;
          const actions = payoutActionsFor(payout?.status);
          const timeline = [
            ["Requested", payout?.requestedAt],
            ["Reviewing", payout?.reviewingAt],
            ["Approved", payout?.approvedAt],
            ["Processing", payout?.processingAt],
            ["Sent", payout?.sentAt],
            ["Paid", payout?.paidAt],
          ].filter(([, value]) => value);

          return <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <Kpi label="Payout Amount" value={money(payout?.requestedAmountUsd)} />
              <Kpi label="Method" value={payout?.method || "—"} />
              <Kpi label="Status" value={humanize(payout?.status)} />
            </div>

            <section className="rounded-xl border border-white/[0.07] bg-[#111] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-white">Payout destination</p>
                  <p className="mt-1 text-[11px] text-zinc-500">Sensitive payout details · verify before approval.</p>
                </div>
                <Badge>{payout?.method}</Badge>
              </div>

              {selectedDetail.destinationError ? (
                <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/[0.05] px-3 py-2 text-[11px] text-amber-200">
                  {selectedDetail.destinationError.message}
                </div>
              ) : (
                <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {payout?.method === "UPI" && <>
                    <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">Beneficiary</p><p className="mt-1 text-xs text-zinc-200">{destination?.beneficiaryName || "—"}</p></div>
                    <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">UPI ID</p><p className="mt-1 break-all font-mono text-xs text-zinc-200">{destination?.upiId || "—"}</p></div>
                  </>}
                  {payout?.method === "BANK" && <>
                    <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">Beneficiary</p><p className="mt-1 text-xs text-zinc-200">{destination?.beneficiaryName || "—"}</p></div>
                    <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">Bank</p><p className="mt-1 text-xs text-zinc-200">{destination?.bankName || "—"}</p></div>
                    <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">Account number</p><p className="mt-1 break-all font-mono text-xs text-zinc-200">{destination?.accountNumber || "—"}</p></div>
                    <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">IFSC</p><p className="mt-1 font-mono text-xs text-zinc-200">{destination?.ifsc || "—"}</p></div>
                  </>}
                  {payout?.method === "USDT" && <>
                    <div><p className="text-[10px] uppercase tracking-wider text-zinc-600">Network</p><p className="mt-1 text-xs text-zinc-200">{destination?.network || payout?.network || "—"}</p></div>
                    <div className="sm:col-span-2"><p className="text-[10px] uppercase tracking-wider text-zinc-600">Wallet address</p><p className="mt-1 break-all font-mono text-xs text-zinc-200">{destination?.walletAddress || "—"}</p></div>
                  </>}
                </div>
              )}
            </section>

            <section className="rounded-xl border border-white/[0.07] bg-[#111] p-4">
              <p className="text-xs font-semibold text-white">Financial snapshot</p>
              <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Realized profit", money(payout?.snapshot?.realizedProfitUsd)],
                  ["Profit split", payout?.snapshot?.profitSplitPercent != null ? `${payout.snapshot.profitSplitPercent}%` : "—"],
                  ["Trader entitlement", money(payout?.snapshot?.entitlementUsd)],
                  ["Previously paid", money(payout?.snapshot?.previouslyPaidUsd)],
                  ["Reserved before request", money(payout?.snapshot?.previouslyReservedUsd)],
                  ["Available at request", money(payout?.snapshot?.availableBeforeRequestUsd)],
                  ["Fee policy", payout?.feePolicy === "ACG_COVERS" ? "Paid by ACG" : humanize(payout?.feePolicy)],
                  ["Quoted trader settlement", payout?.settlementAmount == null ? "Provider pending" : money(payout.settlementAmount, payout.settlementCurrency || "USD")],
                  ["Trader actually received", payout?.traderReceivedAmount == null ? "Not verified yet" : money(payout.traderReceivedAmount, payout.accountingCurrency || payout.settlementCurrency || "USD")],
                  ["Provider fee paid by ACG", payout?.providerFeePaidByAcg == null ? "Not verified yet" : money(payout.providerFeePaidByAcg, payout.accountingCurrency || payout.settlementCurrency || "USD")],
                  ["Total ACG payout cost", payout?.acgTotalCostAmount == null ? "Not verified yet" : money(payout.acgTotalCostAmount, payout.accountingCurrency || payout.settlementCurrency || "USD")],
                  ["Accounting source", payout?.accountingSource ? humanize(payout.accountingSource) : "—"],
                  ["Accounting verified", payout?.accountingVerifiedAt ? dateTime(payout.accountingVerifiedAt) : "—"],
                  ["FX rate", payout?.fxRate ? String(payout.fxRate) : "—"],
                  ["Cycle", payout?.cycle?.frequency || "—"],
                ].map(([label, value]) => <div key={label}><p className="text-[10px] uppercase tracking-wider text-zinc-600">{label}</p><p className="mt-1 text-xs text-zinc-200">{value}</p></div>)}
              </div>
            </section>

            <section className="rounded-xl border border-white/[0.07] bg-[#111] p-4">
              <p className="text-xs font-semibold text-white">Transfer tracking</p>
              <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {[
                  ["Provider", payout?.provider],
                  ["Provider status", payout?.providerStatus],
                  ["Provider reference", payout?.providerReference],
                  ["UTR", payout?.utr],
                  ["Transaction hash", payout?.txHash],
                  ["Network", payout?.network],
                  ["Provider fee · ACG cost", payout?.providerFee == null ? null : money(payout.providerFee, payout.settlementCurrency || "INR")],
                  ["Provider net reported", payout?.providerNetAmount == null ? null : money(payout.providerNetAmount, payout.settlementCurrency || "INR")],
                  ["Last status check", payout?.providerStatusCheckedAt ? dateTime(payout.providerStatusCheckedAt) : null],
                  ["Webhook received", payout?.providerWebhookAt ? dateTime(payout.providerWebhookAt) : null],
                  ["Quote status", payout?.quoteStatus],
                ].map(([label, value]) => <div key={label}><p className="text-[10px] uppercase tracking-wider text-zinc-600">{label}</p><p className="mt-1 break-all font-mono text-xs text-zinc-200">{value || "—"}</p></div>)}
              </div>

              <div className="mt-5 border-t border-white/[0.06] pt-4">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">Timeline</p>
                <div className="mt-3 space-y-2">
                  {timeline.length ? timeline.map(([label, value], index) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className={`grid size-5 shrink-0 place-items-center rounded-full border text-[8px] ${index === timeline.length - 1 ? "border-white/20 text-white" : "border-emerald-400/20 text-emerald-300"}`}>{index + 1}</span>
                      <span className="min-w-[72px] text-[10px] text-zinc-300">{label}</span>
                      <span className="text-[10px] text-zinc-600">{dateTime(value)}</span>
                    </div>
                  )) : <p className="text-xs text-zinc-600">No lifecycle timestamps recorded.</p>}
                </div>
              </div>
            </section>

            {payout?.providerLastError && (
              <section className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">{payout.providerLastError.code || "Provider execution needs attention"}</p>
                <p className="mt-2 text-xs leading-5 text-zinc-300">{payout.providerLastError.message || "The provider operation needs to be retried."}</p>
                {(payout.providerLastError.minimum != null || payout.providerLastError.maximum != null) && (
                  <p className="mt-2 font-mono text-[10px] text-zinc-500">
                    Provider range · {payout.providerLastError.minimum ?? "—"} – {payout.providerLastError.maximum ?? "—"}
                  </p>
                )}
                {(payout.providerLastError.expectedAmount != null || payout.providerLastError.receivedAmount != null) && (
                  <p className="mt-2 font-mono text-[10px] text-zinc-500">
                    Expected {payout.providerLastError.expectedAmount ?? "—"} {payout.providerLastError.currency || ""}
                    {" · "}Provider reported {payout.providerLastError.receivedAmount ?? "—"} {payout.providerLastError.currency || ""}
                  </p>
                )}
              </section>
            )}

            {payout?.failure && (
              <section className="rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-red-300">{payout.failure.code || "Payout failure"}</p>
                <p className="mt-2 text-xs leading-5 text-zinc-300">{payout.failure.message || "No failure message recorded."}</p>
              </section>
            )}

            <section className="rounded-xl border border-white/[0.07] bg-[#111] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-white">Review actions</p>
                  <p className="mt-1 text-[11px] text-zinc-500">Every action requires a reason and is written to the admin audit log.</p>
                </div>
                <Badge>{payout?.status}</Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {actions.map(item => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPayoutAction({ ...item, id: payout.payoutId })}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      item.tone === "positive"
                        ? "border-emerald-400/20 text-emerald-300 hover:bg-emerald-400/[0.07]"
                        : item.tone === "negative"
                          ? "border-red-400/20 text-red-300 hover:bg-red-400/[0.07]"
                          : "border-white/10 text-zinc-300 hover:bg-white/[0.05]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                {data?.capabilities?.payoutAutomation && payout?.status === "APPROVED" && payout?.provider === "sunpay" && payout?.providerLastError && (
                  <button
                    type="button"
                    onClick={() => setPayoutAction({ value: "RETRY_EXECUTION", label: "Retry automatic transfer", tone: "positive", id: payout.payoutId })}
                    className="rounded-lg border border-emerald-400/20 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-400/[0.07]"
                  >
                    Retry automatic transfer
                  </button>
                )}

                {["PROCESSING", "SENT"].includes(String(payout?.status || "").toUpperCase()) && payout?.provider === "sunpay" && (
                  <button
                    type="button"
                    onClick={() => setPayoutAction({ value: "RECONCILE", label: "Verify Sunpay status", tone: "neutral", id: payout.payoutId })}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/[0.05]"
                  >
                    Verify Sunpay status
                  </button>
                )}
              </div>

              {!actions.length && !(
                (data?.capabilities?.payoutAutomation && payout?.status === "APPROVED" && payout?.provider === "sunpay" && payout?.providerLastError)
                || (["PROCESSING", "SENT"].includes(String(payout?.status || "").toUpperCase()) && payout?.provider === "sunpay")
              ) && (
                <p className="mt-4 text-xs text-zinc-600">This payout is in a terminal state.</p>
              )}
            </section>
          </div>;
        })()}
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
                  {conversation.status === "ESCALATED" && (
                    <button
                      onClick={returnSupportToAi}
                      disabled={supportBusy}
                      className="rounded-lg border border-sky-400/20 bg-sky-400/[0.06] px-4 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-400/[0.1] disabled:opacity-40"
                    >
                      Return to AI
                    </button>
                  )}
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

      {payoutAction && selectedDetail?.payout && (
        <PayoutActionModal
          action={payoutAction}
          payout={selectedDetail.payout}
          busy={payoutBusy}
          onClose={() => setPayoutAction(null)}
          onConfirm={performPayoutAction}
        />
      )}
      {action && <ConfirmModal action={action} entity={action.id} busy={actionBusy} onClose={() => setAction(null)} onConfirm={performAction} />}
    </div>
  );
}
