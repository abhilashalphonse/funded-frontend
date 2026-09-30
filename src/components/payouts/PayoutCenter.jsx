import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  CircleDollarSign,
  Clock3,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { useAuth } from "../../AuthContext.jsx";
import PayoutRequestModal from "./PayoutRequestModal.jsx";
import PayoutCertificateModal from "./PayoutCertificateModal.jsx";

const API_URL = import.meta.env.VITE_API_URL || "";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function usd(value) {
  return usdFormatter.format(number(value));
}

function signedUsd(value) {
  const amount = number(value);
  if (Math.abs(amount) < 0.005) return usd(0);
  return `${amount > 0 ? "+" : "-"}${usd(Math.abs(amount))}`;
}

function dateLabel(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function statusTone(status) {
  const value = String(status || "").toUpperCase();
  if (value === "PAID") return "text-emerald-300 border-emerald-400/20 bg-emerald-400/[0.06]";
  if (["FAILED", "REJECTED", "CANCELLED"].includes(value)) return "text-rose-300 border-rose-400/20 bg-rose-400/[0.06]";
  return "text-[#d6d6d6] border-white/[0.12] bg-white/[0.04]";
}

function localPreview(account) {
  if (!account) return null;
  const isTrial = account.accountMode === "DEMO";
  const status = String(account.status || "").toUpperCase();
  const isMaster = status === "FUNDED";
  const configuredSplit = Number(account.commercialTerms?.profitSplit);
  const hasConfiguredSplit = Number.isFinite(configuredSplit) && configuredSplit > 0;
  const split = hasConfiguredSplit ? configuredSplit : isTrial ? 80 : null;
  const profit = Math.max(0, number(account.projections?.profit));
  const share = split != null ? profit * split / 100 : null;

  return {
    accountId: account.accountId,
    accountStage: isTrial ? "TRIAL" : isMaster ? "MASTER" : ["FUNDED_REVIEW", "PASSED"].includes(status) ? "MASTER_REVIEW" : "CHALLENGE",
    accountStatus: status,
    mode: isTrial ? "PREVIEW" : isMaster ? "REAL" : "JOURNEY",
    commercialTerms: {
      profitSplitPercent: split,
      profitSplitSource: hasConfiguredSplit ? "ACCOUNT_TERMS" : isTrial ? "ILLUSTRATIVE_DEFAULT" : null,
      payoutFrequency: account.commercialTerms?.payoutFrequency || null,
    },
    performance: {
      realizedProfitUsd: profit,
      estimatedTraderShareUsd: share,
      source: "LOCAL_PREVIEW",
    },
    ledger: {
      lifetimePaidUsd: 0,
      activeReservedUsd: 0,
      availableUsd: isMaster ? null : 0,
      payoutCount: 0,
      largestPayoutUsd: 0,
      activePayout: null,
    },
    cycle: {
      nextEligibleAt: null,
    },
    eligibility: {
      canRequest: false,
      blockers: isMaster ? ["PAYOUT_DATA_LOADING"] : ["MASTER_ACCOUNT_REQUIRED"],
    },
    fees: {
      providerFeePolicy: "ACG_COVERS",
      traderPaysProviderFee: false,
      description: "ACG covers payout-provider fees.",
    },
    methods: [
      { id: "UPI", label: "UPI", settlementCurrency: "INR", limits: null },
      { id: "BANK", label: "Bank Transfer", settlementCurrency: "INR", limits: null },
      { id: "USDT", label: "USDT", settlementCurrency: "USDT", limits: null, networks: [] },
    ],
  };
}

function usePayoutData(account) {
  const { getAccessToken } = useAuth();
  const [overview, setOverview] = useState(() => localPreview(account));
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(Boolean(account));
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setOverview(localPreview(account));
    setHistory([]);
    setError("");

    if (!account?.accountId) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Your ACG Funded session has expired.");

        const headers = { Authorization: `Bearer ${token}` };
        const accountId = encodeURIComponent(account.accountId);
        const [overviewResponse, historyResponse] = await Promise.all([
          fetch(`${API_URL}/api/customer/accounts/${accountId}/payout-overview`, {
            headers,
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch(`${API_URL}/api/customer/accounts/${accountId}/payouts`, {
            headers,
            cache: "no-store",
            signal: controller.signal,
          }),
        ]);

        const [overviewPayload, historyPayload] = await Promise.all([
          overviewResponse.json().catch(() => ({})),
          historyResponse.json().catch(() => ({})),
        ]);

        if (!overviewResponse.ok) {
          throw new Error(overviewPayload?.message || "Unable to load payout eligibility.");
        }
        if (!historyResponse.ok) {
          throw new Error(historyPayload?.message || "Unable to load payout history.");
        }

        if (!cancelled) {
          setOverview(overviewPayload?.data || localPreview(account));
          setHistory(Array.isArray(historyPayload?.data?.items) ? historyPayload.data.items : []);
          setError("");
        }
      } catch (loadError) {
        if (loadError?.name === "AbortError") return;
        if (!cancelled) {
          setError(loadError?.message || "Unable to load payout information.");
          // Trial/Challenge previews remain useful if the read-only payout API is
          // temporarily unavailable. Master money stays locked behind backend data.
          setOverview(current => current || localPreview(account));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [account, getAccessToken, reloadKey]);

  useEffect(() => {
    if (!overview?.ledger?.activePayout?.payoutId) return undefined;

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setReloadKey(value => value + 1);
      }
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [overview?.ledger?.activePayout?.payoutId, overview?.ledger?.activePayout?.status]);

  return {
    overview,
    history,
    loading,
    error,
    retry: () => setReloadKey(value => value + 1),
  };
}

function blockerCopy(code) {
  const labels = {
    MASTER_ACCOUNT_REQUIRED: "Master Account required",
    PROFIT_SPLIT_UNAVAILABLE: "Profit split unavailable",
    NO_REALIZED_PROFIT: "No realized profit available",
    ACCOUNT_NOT_ACTIVE: "Master Account is not active",
    CUSTOMER_ACCESS_BLOCKED: "Account access is restricted",
    PAYOUT_FREQUENCY_UNAVAILABLE: "Payout schedule unavailable",
    MASTER_ACTIVATION_DATE_UNAVAILABLE: "Master activation is still being finalized",
    PAYOUT_CYCLE_NOT_REACHED: "Waiting for your payout window",
    PAYOUT_ALREADY_IN_PROGRESS: "A payout is already in progress",
    PAYOUT_CYCLE_ALREADY_USED: "This payout window has already been used",
    NO_AVAILABLE_PAYOUT: "No payout balance is currently available",
    PAYOUT_DATA_LOADING: "Checking payout eligibility",
  };
  return labels[code] || String(code || "").replaceAll("_", " ").toLowerCase();
}

function stageCopy(overview) {
  if (!overview) {
    return {
      eyebrow: "Payout Center",
      title: "Your payout journey starts here",
      description: "Choose an account to see its payout path.",
    };
  }

  if (overview.mode === "PREVIEW") {
    return {
      eyebrow: "Payout Preview",
      title: "See what this performance could become",
      description: overview.commercialTerms?.profitSplitSource === "ILLUSTRATIVE_DEFAULT"
        ? "Trial profit is simulated and not withdrawable. This preview uses an illustrative 80% profit split to show what the same realized performance could look like on a Master Account."
        : "Trial profit is simulated and not withdrawable. This preview shows what the same realized performance could look like on a Master Account using the selected profit split.",
    };
  }

  if (overview.mode === "JOURNEY") {
    return {
      eyebrow: overview.accountStage === "MASTER_REVIEW" ? "Almost at Master" : "Payout Journey",
      title: overview.accountStage === "MASTER_REVIEW"
        ? "Your challenge is complete. Master comes next."
        : "Build the performance that leads to a payout",
      description: "Challenge profits are evaluation results, not withdrawable funds. Your selected payout terms become active after Master Account activation.",
    };
  }

  const available = overview.ledger?.availableUsd;
  return {
    eyebrow: "Payout Center",
    title: overview.eligibility?.canRequest
      ? `${usd(available)} is available for payout`
      : "Your Master payout is getting closer",
    description: overview.eligibility?.canRequest
      ? "Your payout window is open. Review your amount and choose how you want to receive it."
      : "We track realized profit, your profit split, payout window and previous payouts to calculate what becomes available next.",
  };
}

function journeySteps(overview) {
  const stage = overview?.accountStage;
  if (stage === "TRIAL") {
    return [
      { label: "Free Trial", hint: "Experience ACG", state: "current" },
      { label: "Challenge", hint: "Pass evaluation", state: "future" },
      { label: "Master", hint: "Trade your Master Account", state: "future" },
      { label: "Payout", hint: "UPI · Bank · USDT", state: "future" },
    ];
  }

  if (stage === "CHALLENGE") {
    return [
      { label: "Challenge", hint: "You are here", state: "current" },
      { label: "Master Review", hint: "Complete evaluation", state: "future" },
      { label: "Master", hint: "Payout terms activate", state: "future" },
      { label: "Payout", hint: "Receive your share", state: "future" },
    ];
  }

  if (stage === "MASTER_REVIEW") {
    return [
      { label: "Challenge", hint: "Completed", state: "done" },
      { label: "Master Review", hint: "You are here", state: "current" },
      { label: "Master", hint: "Activation", state: "future" },
      { label: "Payout", hint: "Receive your share", state: "future" },
    ];
  }

  const activeStatus = overview?.ledger?.activePayout?.status;
  const paid = number(overview?.ledger?.payoutCount) > 0;
  return [
    { label: "Master", hint: "Activated", state: "done" },
    { label: "Eligible", hint: overview?.eligibility?.canRequest ? "Window open" : "Tracking", state: overview?.eligibility?.canRequest ? "current" : "done" },
    { label: "Requested", hint: activeStatus ? "In progress" : "Choose method", state: activeStatus ? "current" : "future" },
    { label: "Paid", hint: paid ? "Payout history started" : "Money received", state: paid ? "done" : "future" },
  ];
}

function MethodCard({ method }) {
  const Icon = method.id === "UPI" ? Zap : method.id === "BANK" ? Building2 : CircleDollarSign;
  const detail = method.id === "UPI"
    ? "Fast INR payout"
    : method.id === "BANK"
      ? "Direct INR bank settlement"
      : "USDT wallet payout";
  const helper = method.id === "UPI"
    ? method.limits
      ? `₹${method.limits.min.toLocaleString()} – ₹${method.limits.max.toLocaleString()} per payout`
      : "Provider limits verified at processing"
    : method.id === "BANK"
      ? "Provider limits verified at processing"
      : method.networks?.length
        ? "Network selected before confirmation"
        : "Provider network pending";

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#080808] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-[#9a9a9a]">
          <Icon size={15} />
        </div>
        <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#555]">{method.settlementCurrency}</span>
      </div>
      <h4 className="mt-4 text-[12px] font-semibold text-white">{method.label}</h4>
      <p className="mt-1 text-[10px] text-[#777]">{detail}</p>
      <p className="mt-3 text-[9px] leading-4 text-[#555]">{helper}</p>
    </div>
  );
}

function Journey({ overview }) {
  const steps = journeySteps(overview);
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[12px] font-semibold text-white">Your path to payout</h3>
          <p className="mt-1 text-[10px] text-[#666]">Each stage moves you closer to money becoming payable.</p>
        </div>
        <ArrowRight size={15} className="mt-0.5 text-[#555]" />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-4">
        {steps.map((step, index) => {
          const done = step.state === "done";
          const current = step.state === "current";
          return (
            <div
              key={step.label}
              className={`relative rounded-xl border p-4 ${
                current
                  ? "border-white/[0.18] bg-white/[0.04]"
                  : done
                    ? "border-white/[0.1] bg-white/[0.025]"
                    : "border-white/[0.06] bg-black/20"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`grid size-6 place-items-center rounded-full border text-[9px] font-semibold ${
                  current
                    ? "border-white/[0.28] text-[#d6d6d6]"
                    : done
                      ? "border-emerald-400/20 text-emerald-300"
                      : "border-white/[0.08] text-[#555]"
                }`}>
                  {done ? <Check size={11} /> : index + 1}
                </span>
                {current && <span className="text-[7px] font-semibold uppercase tracking-[0.12em] text-[#a8a8a8]">You are here</span>}
              </div>
              <strong className={`mt-4 block text-[11px] font-semibold ${current || done ? "text-white" : "text-[#666]"}`}>{step.label}</strong>
              <span className="mt-1 block text-[9px] text-[#555]">{step.hint}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ActivePayoutTracker({ payout }) {
  if (!payout) return null;

  const stages = [
    ["REQUESTED", "Requested", payout.requestedAt],
    ["REVIEWING", "Reviewing", payout.reviewingAt],
    ["APPROVED", "Approved", payout.approvedAt],
    ["PROCESSING", "Processing", payout.processingAt],
    ["SENT", "Sent", payout.sentAt],
    ["PAID", "Paid", payout.paidAt],
  ];
  const currentStatus = String(payout.status || "").toUpperCase();
  const currentIndex = Math.max(0, stages.findIndex(([status]) => status === currentStatus));
  const reference = payout.reference?.txHash
    || payout.reference?.utr
    || payout.reference?.providerReference
    || null;

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0A0A0A]">
      <div className="border-b border-white/[0.07] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[#a8a8a8]">Payout in progress</span>
            <h3 className="mt-1.5 font-mono text-[20px] font-semibold text-white">{usd(payout.requestedAmountUsd)}</h3>
            <p className="mt-1 text-[9px] text-[#666]">
              {payout.method || "Payout"}{payout.destination?.destination ? ` · ${payout.destination.destination}` : ""}
            </p>
          </div>
          <span className={`rounded-full border px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] ${statusTone(payout.status)}`}>
            {String(payout.status || "").replaceAll("_", " ")}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-3 gap-y-5 sm:grid-cols-6">
          {stages.map(([status, label, timestamp], index) => {
            const reached = index <= currentIndex;
            const current = index === currentIndex;
            return (
              <div key={status} className="relative min-w-0 text-center">
                {index > 0 && (
                  <span className={`absolute right-1/2 top-3 hidden h-px w-full sm:block ${index <= currentIndex ? "bg-white/[0.18]" : "bg-white/[0.07]"}`} />
                )}
                <span className={`relative z-10 mx-auto grid size-6 place-items-center rounded-full border text-[8px] font-semibold ${
                  current
                    ? "border-white/50 bg-white/[0.08] text-white"
                    : reached
                      ? "border-white/[0.2] bg-[#080808] text-[#b8b8b8]"
                      : "border-white/[0.08] bg-[#080808] text-[#4c4c4c]"
                }`}>
                  {reached && !current ? <Check size={9} /> : index + 1}
                </span>
                <strong className={`mt-2 block truncate text-[8px] font-semibold ${reached ? "text-[#aaa]" : "text-[#4f4f4f]"}`}>{label}</strong>
                <span className="mt-1 block text-[7px] text-[#4f4f4f]">{timestamp ? dateLabel(timestamp) : "—"}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-white/[0.06] bg-black/25 px-3 py-3">
            <span className="text-[7px] font-semibold uppercase tracking-[0.1em] text-[#555]">Method</span>
            <strong className="mt-1 block text-[10px] text-[#aaa]">{payout.method || "—"}</strong>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-black/25 px-3 py-3">
            <span className="text-[7px] font-semibold uppercase tracking-[0.1em] text-[#555]">Trader receives</span>
            <strong className="mt-1 block font-mono text-[10px] text-[#aaa]">
              {payout.settlementAmount == null
                ? "Provider pending"
                : payout.settlementCurrency === "INR"
                  ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(number(payout.settlementAmount))
                  : `${number(payout.settlementAmount).toLocaleString("en-US")} ${payout.settlementCurrency || ""}`}
            </strong>
            <span className="mt-1 block text-[7px] text-[#555]">Provider fees paid by ACG</span>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-black/25 px-3 py-3">
            <span className="text-[7px] font-semibold uppercase tracking-[0.1em] text-[#555]">Reference</span>
            <strong className="mt-1 block truncate font-mono text-[9px] text-[#aaa]">{reference || "Appears after transfer"}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function PayoutHistory({ items, onCertificate }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A]">
      <div className="border-b border-white/[0.07] px-5 py-4 sm:px-6">
        <h3 className="text-[12px] font-semibold text-white">Payout record</h3>
        <p className="mt-1 text-[10px] text-[#666]">Every completed payout builds your ACG payout history.</p>
      </div>

      {!items.length ? (
        <div className="grid min-h-[210px] place-items-center px-6 py-10 text-center">
          <div className="max-w-sm">
            <div className="mx-auto grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-[#555]">
              <Wallet size={16} />
            </div>
            <p className="mt-4 text-[12px] font-semibold text-[#bbb]">Your first payout will appear here</p>
            <p className="mt-1.5 text-[10px] leading-4 text-[#666]">Amount, payout method, status and settlement date will be recorded automatically.</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.06]">
          {items.map(item => (
            <div key={item.payoutId} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="font-mono text-[13px] font-semibold text-white">{usd(item.requestedAmountUsd)}</strong>
                  <span className={`rounded-full border px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] ${statusTone(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-1.5 text-[9px] text-[#666]">
                  {item.method || "Method pending"} · {dateLabel(item.paidAt || item.requestedAt)}
                </p>
              </div>
              <div className="flex max-w-[46%] shrink-0 flex-col items-end gap-2">
                <span className="max-w-full truncate font-mono text-[8px] text-[#555]">{item.payoutId}</span>
                {String(item.status || "").toUpperCase() === "PAID" && (
                  <button
                    type="button"
                    onClick={() => onCertificate?.(item)}
                    className="rounded-md border border-white/[0.08] px-2 py-1 text-[8px] font-semibold text-[#888] hover:border-white/[0.16] hover:text-white"
                  >
                    View certificate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function PayoutCenter({ account }) {
  const { overview, history, loading, error, retry } = usePayoutData(account);
  const [requestOpen, setRequestOpen] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const copy = stageCopy(overview);
  const isPreview = overview?.mode === "PREVIEW";
  const isJourney = overview?.mode === "JOURNEY";
  const isReal = overview?.mode === "REAL";
  const split = overview?.commercialTerms?.profitSplitPercent;
  const realized = overview?.performance?.realizedProfitUsd;
  const estimatedShare = overview?.performance?.estimatedTraderShareUsd;
  const available = overview?.ledger?.availableUsd;
  const activePayout = overview?.ledger?.activePayout;
  const blockers = overview?.eligibility?.blockers || [];

  const heroAmount = useMemo(() => {
    if (!overview) return "—";
    if (isReal) return available == null ? "—" : usd(available);
    return estimatedShare == null ? "—" : usd(estimatedShare);
  }, [available, estimatedShare, isReal, overview]);

  if (!account) {
    return (
      <section className="grid min-h-[360px] place-items-center rounded-2xl border border-white/[0.08] bg-[#080808] px-6 text-center">
        <div className="max-w-sm">
          <Wallet size={20} className="mx-auto text-[#555]" />
          <h2 className="mt-4 text-[14px] font-semibold text-white">Choose a trading account</h2>
          <p className="mt-2 text-[10px] leading-5 text-[#666]">Your payout preview and payout history are account-specific.</p>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-5 pb-6 animate-fade-in">
      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.035] px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold text-amber-200">Live payout data is unavailable</p>
            <p className="mt-1 text-[9px] leading-4 text-[#777]">{error}</p>
          </div>
          <button type="button" onClick={retry} className="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-md border border-white/[0.08] px-2.5 text-[9px] text-[#aaa] hover:text-white">
            <RefreshCw size={10} />
            Retry
          </button>
        </div>
      )}

      <section className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#080808]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.18]" />
        <div className="grid lg:grid-cols-[1.3fr_.7fr]">
          <div className="p-5 sm:p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#8a8a8a]">
              {isPreview ? <Sparkles size={10} /> : isReal ? <ShieldCheck size={10} /> : <ArrowRight size={10} />}
              {copy.eyebrow}
            </div>

            <h2 className="mt-5 max-w-2xl text-[clamp(1.45rem,4vw,2.35rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-white">
              {copy.title}
            </h2>
            <p className="mt-3 max-w-xl text-[11px] leading-5 text-[#777]">{copy.description}</p>

            <div className="mt-7">
              <span className="block text-[8px] font-semibold uppercase tracking-[0.14em] text-[#555]">
                {isReal ? "Available payout" : "Estimated trader share"}
              </span>
              <strong className={`mt-2 block font-mono text-[clamp(2rem,7vw,4rem)] font-semibold leading-none tracking-[-0.055em] ${
                isReal && number(available) > 0 ? "text-white" : "text-[#f1f1f1]"
              }`}>
                {heroAmount}
              </strong>
              <p className="mt-3 text-[9px] text-[#666]">
                {isPreview && "Hypothetical only · Trial profits cannot be withdrawn."}
                {isJourney && "Illustrative only · Evaluation profits cannot be withdrawn."}
                {isReal && (loading ? "Checking your live payout ledger…" : "Calculated from realized Master Account profit and your selected profit split.")}
              </p>
            </div>

            {isReal && (
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setRequestOpen(true)}
                  disabled={!overview?.eligibility?.canRequest || loading || Boolean(error)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-[11px] font-semibold text-black transition hover:bg-[#e9e9e9] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Request payout
                  <ArrowRight size={13} />
                </button>
                <span className="text-[9px] text-[#555]">
                  {overview?.eligibility?.canRequest
                    ? "Choose UPI or Bank Transfer. USDT activates after provider network terms are configured."
                    : activePayout
                      ? "Your current payout is already being tracked."
                      : blockers.length
                        ? blockerCopy(blockers[0])
                        : "Checking payout eligibility…"}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-white/[0.07] bg-[#0A0A0A] lg:border-l lg:border-t-0">
            <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] lg:grid-cols-1 lg:divide-x-0">
              <HeroStat label="Realized profit" value={realized == null ? "—" : signedUsd(realized)} />
              <HeroStat
                label={isPreview && overview?.commercialTerms?.profitSplitSource === "ILLUSTRATIVE_DEFAULT" ? "Preview profit split" : "Your profit split"}
                value={split == null ? "—" : `${split}%${isPreview && overview?.commercialTerms?.profitSplitSource === "ILLUSTRATIVE_DEFAULT" ? " example" : ""}`}
              />
              <HeroStat label="Payout schedule" value={overview?.commercialTerms?.payoutFrequency || "—"} />
              <HeroStat
                label={isReal ? "Next eligible" : "Master payout"}
                value={isReal ? dateLabel(overview?.cycle?.nextEligibleAt) : "After activation"}
              />
            </div>
          </div>
        </div>
      </section>

      {isReal && (
        <section className="grid gap-3 sm:grid-cols-3">
          <LedgerCard label="Lifetime paid" value={usd(overview?.ledger?.lifetimePaidUsd)} helper={`${overview?.ledger?.payoutCount || 0} completed payout${overview?.ledger?.payoutCount === 1 ? "" : "s"}`} />
          <LedgerCard label="Largest payout" value={usd(overview?.ledger?.largestPayoutUsd)} helper="Your best completed payout" />
          <LedgerCard
            label="Current status"
            value={activePayout ? String(activePayout.status).replaceAll("_", " ") : overview?.eligibility?.canRequest ? "Eligible" : "Tracking"}
            helper={activePayout ? "A payout is already moving" : overview?.eligibility?.canRequest ? "Your payout window is open" : "Eligibility updates automatically"}
          />
        </section>
      )}

      <Journey overview={overview} />

      {activePayout && <ActivePayoutTracker payout={activePayout} />}

      <section className="rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-[12px] font-semibold text-white">{isReal ? "Receive your payout" : "How ACG pays traders"}</h3>
            <p className="mt-1 text-[10px] text-[#666]">
              {isReal ? "Your trader payout amount is shown before you confirm. ACG covers payout-provider fees." : "These methods become available once you reach an eligible Master Account payout."}
            </p>
          </div>
          {isPreview && <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#555]">Preview only</span>}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {(overview?.methods || localPreview(account)?.methods || []).map(method => <MethodCard key={method.id} method={method} />)}
        </div>

        <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/30 px-4 py-3 text-[9px] leading-4 text-[#666]">
          INR conversion and the trader payout amount are confirmed before a real payout request. ACG covers payout-provider fees. Provider-specific payout limits are enforced from provider configuration instead of being hardcoded in ACG.
        </div>
      </section>

      {isReal && blockers.length > 0 && !activePayout && (
        <section className="rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Clock3 size={14} className="text-[#777]" />
            <h3 className="text-[12px] font-semibold text-white">What remains before your next payout</h3>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {blockers.map(code => (
              <div key={code} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-3">
                <span className="grid size-5 shrink-0 place-items-center rounded-full border border-white/[0.08] text-[#666]">
                  <Clock3 size={9} />
                </span>
                <span className="text-[10px] text-[#888]">{blockerCopy(code)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <PayoutHistory items={history} onCertificate={setCertificate} />

        <section className="rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[12px] font-semibold text-white">Payout snapshot</h3>
              <p className="mt-1 text-[10px] text-[#666]">What the current account performance means for payouts.</p>
            </div>
            <Wallet size={15} className="text-[#555]" />
          </div>

          <div className="mt-5 divide-y divide-white/[0.06]">
            <SnapshotRow label="Account" value={overview?.accountId || account.accountId || "—"} />
            <SnapshotRow label="Account stage" value={String(overview?.accountStage || "—").replaceAll("_", " ")} />
            <SnapshotRow label="Realized profit" value={realized == null ? "—" : signedUsd(realized)} />
            <SnapshotRow label={isReal ? "Available now" : "Estimated share"} value={isReal ? (available == null ? "—" : usd(available)) : (estimatedShare == null ? "—" : usd(estimatedShare))} />
            <SnapshotRow label="Payout cycle" value={overview?.commercialTerms?.payoutFrequency || "—"} />
            <SnapshotRow label="Provider fees" value={overview?.fees?.traderPaysProviderFee === false ? "Paid by ACG" : "—"} />
          </div>

          <p className="mt-4 border-t border-white/[0.06] pt-4 text-[9px] leading-4 text-[#555]">
            {isReal
              ? "Real payout availability comes from ACG Funded's payout ledger and Master Account state. Floating P&L is not treated as withdrawable profit. Payout-provider fees are paid by ACG."
              : "Preview values are educational projections only. Trial and Challenge account profits are not payable."}
          </p>
        </section>
      </div>

      {certificate && (
        <PayoutCertificateModal payout={certificate} onClose={() => setCertificate(null)} />
      )}

      {requestOpen && overview && (
        <PayoutRequestModal
          accountId={account.accountId}
          overview={overview}
          methods={overview.methods || []}
          onClose={() => setRequestOpen(false)}
          onCreated={() => retry()}
        />
      )}
    </div>
  );
}

function HeroStat({ label, value }) {
  return (
    <div className="min-h-[92px] p-4 sm:p-5">
      <span className="block text-[8px] font-semibold uppercase tracking-[0.12em] text-[#555]">{label}</span>
      <strong className="mt-2 block truncate font-mono text-[12px] font-semibold text-white sm:text-[13px]">{value}</strong>
    </div>
  );
}

function LedgerCard({ label, value, helper }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0A0A0A] p-4">
      <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#555]">{label}</span>
      <strong className="mt-2 block font-mono text-[16px] font-semibold text-white">{value}</strong>
      <p className="mt-1.5 text-[9px] text-[#666]">{helper}</p>
    </div>
  );
}

function SnapshotRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
      <span className="text-[10px] text-[#666]">{label}</span>
      <span className="max-w-[62%] truncate text-right font-mono text-[10px] font-medium text-[#bbb]">{value}</span>
    </div>
  );
}
