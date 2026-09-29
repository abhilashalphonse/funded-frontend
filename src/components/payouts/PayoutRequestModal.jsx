import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleDollarSign,
  RefreshCw,
  ShieldCheck,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useAuth } from "../../AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
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

function inr(value) {
  return inrFormatter.format(number(value));
}

function requestIdempotencyKey() {
  if (globalThis.crypto?.randomUUID) return `payout-${globalThis.crypto.randomUUID()}`;
  const bytes = new Uint8Array(16);
  globalThis.crypto?.getRandomValues?.(bytes);
  const fallback = Array.from(bytes).map(value => value.toString(16).padStart(2, "0")).join("");
  return `payout-${fallback || Date.now().toString(36)}`;
}

function MethodOption({ method, selected, onSelect }) {
  const Icon = method.id === "UPI" ? Zap : method.id === "BANK" ? Building2 : CircleDollarSign;
  const helper = method.id === "UPI"
    ? "₹100 – ₹20,000"
    : method.id === "BANK"
      ? "Direct INR transfer"
      : "TRC20 wallet";

  return (
    <button
      type="button"
      onClick={() => onSelect(method.id)}
      className={`min-w-0 rounded-xl border p-3 text-left transition ${
        selected
          ? "border-[#195be1]/70 bg-[#195be1]/[0.06]"
          : "border-white/[0.08] bg-black/20 hover:border-white/[0.16]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`grid size-8 place-items-center rounded-lg border ${
          selected ? "border-[#195be1]/40 text-[#8fb0ff]" : "border-white/[0.08] text-[#777]"
        }`}>
          <Icon size={13} />
        </span>
        {selected && <Check size={13} className="text-[#8fb0ff]" />}
      </div>
      <strong className="mt-3 block text-[11px] font-semibold text-white">{method.label}</strong>
      <span className="mt-1 block text-[8px] text-[#666]">{helper}</span>
    </button>
  );
}

function TextField({ label, value, onChange, placeholder, inputMode, autoComplete = "off" }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[9px] font-medium text-[#777]">{label}</span>
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-lg border border-white/[0.09] bg-black px-3 text-[11px] text-white outline-none transition placeholder:text-[#444] focus:border-[#195be1]/55"
      />
    </label>
  );
}

function destinationSummary(method, destination) {
  if (method === "UPI") return destination.upiId || "—";
  if (method === "BANK") {
    const account = String(destination.accountNumber || "").replace(/\s+/g, "");
    return account ? `${destination.bankName || "Bank"} · •••• ${account.slice(-4)}` : "—";
  }
  if (method === "USDT") {
    const wallet = String(destination.walletAddress || "");
    return wallet.length > 12 ? `${wallet.slice(0, 6)}…${wallet.slice(-4)} · ${destination.network || "TRC20"}` : wallet || "—";
  }
  return "—";
}

function destinationReady(method, destination) {
  if (method === "UPI") return Boolean(destination.beneficiaryName?.trim() && destination.upiId?.trim());
  if (method === "BANK") return Boolean(
    destination.beneficiaryName?.trim()
    && destination.accountNumber?.trim()
    && destination.ifsc?.trim()
  );
  if (method === "USDT") return Boolean(destination.walletAddress?.trim() && destination.network);
  return false;
}

function quoteExplanation(quote) {
  if (!quote) return "";
  if (quote.method === "UPI" && quote.available === false) {
    return "UPI is unavailable for this amount. Reduce the payout amount or choose Bank Transfer / USDT.";
  }
  if (quote.quoteStatus === "PROVIDER_PENDING") {
    return "Your USD payout amount is locked. The exact USDT settlement amount is finalized when the payout provider processes the request.";
  }
  return "This settlement estimate is calculated server-side from the current payout quote.";
}

export default function PayoutRequestModal({ accountId, overview, methods = [], onClose, onCreated }) {
  const { getAccessToken } = useAuth();
  const availableUsd = number(overview?.ledger?.availableUsd);
  const [step, setStep] = useState("details");
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState(() => availableUsd ? availableUsd.toFixed(2) : "");
  const [destination, setDestination] = useState({
    beneficiaryName: "",
    upiId: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    network: "TRC20",
    walletAddress: "",
  });
  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [destinationConfirmed, setDestinationConfirmed] = useState(false);
  const [created, setCreated] = useState(null);
  const [idempotencyKey] = useState(() => requestIdempotencyKey());

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = event => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, submitting]);

  const amountNumber = number(amount);
  const amountValid = amountNumber > 0 && amountNumber <= availableUsd;
  const detailsReady = Boolean(method && amountValid && destinationReady(method, destination));

  const selectedMethod = useMemo(
    () => methods.find(item => item.id === method) || null,
    [method, methods],
  );

  const updateDestination = (key, value) => {
    setDestination(current => ({ ...current, [key]: value }));
    setQuote(null);
    setDestinationConfirmed(false);
    setError("");
  };

  const chooseMethod = value => {
    setMethod(value);
    setQuote(null);
    setDestinationConfirmed(false);
    setError("");
  };

  const loadQuote = async () => {
    if (!detailsReady) return;
    setLoadingQuote(true);
    setError("");
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Your ACG Funded session has expired.");

      const response = await fetch(
        `${API_URL}/api/customer/accounts/${encodeURIComponent(accountId)}/payout-quote`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({
            method,
            amountUsd: amountNumber,
          }),
        },
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.message || "Unable to prepare this payout.");

      setQuote(payload?.data?.quote || null);
      setStep("confirm");
    } catch (quoteError) {
      setError(quoteError?.message || "Unable to prepare this payout.");
    } finally {
      setLoadingQuote(false);
    }
  };

  const submit = async () => {
    if (!quote?.available || !destinationConfirmed) return;
    setSubmitting(true);
    setError("");
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Your ACG Funded session has expired.");

      const response = await fetch(
        `${API_URL}/api/customer/accounts/${encodeURIComponent(accountId)}/payouts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
          cache: "no-store",
          body: JSON.stringify({
            method,
            amountUsd: amountNumber,
            quoteId: quote.quoteId,
            destination,
          }),
        },
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.message || "Unable to submit this payout request.");

      setCreated(payload?.data?.payout || null);
      setStep("success");
      onCreated?.(payload?.data?.payout || null);
    } catch (submitError) {
      setError(submitError?.message || "Unable to submit this payout request.");
    } finally {
      setSubmitting(false);
    }
  };

  const body = (
    <div className="fixed inset-0 z-[140]" role="dialog" aria-modal="true" aria-label="Request payout">
      <button
        type="button"
        className="absolute inset-0 bg-black/80"
        onClick={submitting ? undefined : onClose}
        aria-label="Close payout request"
      />

      <section className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-2xl border-t border-white/[0.1] bg-[#080808] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(94vw,620px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border">
        <header className="shrink-0 border-b border-white/[0.07] px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#555]">ACG Payout</span>
              <h2 className="mt-1.5 text-[16px] font-semibold text-white">
                {step === "success" ? "Payout request received" : step === "confirm" ? "Confirm your payout" : "Choose how to receive it"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="grid size-9 place-items-center rounded-lg border border-white/[0.08] text-[#777] hover:text-white disabled:opacity-40"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-5">
          {error && (
            <div className="mb-4 rounded-lg border border-rose-400/15 bg-rose-400/[0.04] px-3 py-2.5 text-[9px] leading-4 text-rose-200">
              {error}
            </div>
          )}

          {step === "details" && (
            <div>
              <div className="rounded-xl border border-white/[0.08] bg-black/25 p-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#555]">Available</span>
                    <strong className="mt-1.5 block font-mono text-[22px] font-semibold text-white">{usd(availableUsd)}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAmount(availableUsd.toFixed(2))}
                    className="rounded-md border border-white/[0.09] px-2.5 py-1.5 text-[9px] text-[#aaa] hover:text-white"
                  >
                    Use max
                  </button>
                </div>

                <label className="mt-4 block">
                  <span className="mb-1.5 block text-[9px] font-medium text-[#777]">Payout amount · USD</span>
                  <div className="flex h-11 items-center rounded-lg border border-white/[0.09] bg-black px-3 focus-within:border-[#195be1]/55">
                    <span className="mr-1 font-mono text-[11px] text-[#666]">$</span>
                    <input
                      value={amount}
                      onChange={event => {
                        setAmount(event.target.value);
                        setQuote(null);
                        setError("");
                      }}
                      inputMode="decimal"
                      className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-white outline-none"
                    />
                  </div>
                  {!amountValid && amount && (
                    <span className="mt-1.5 block text-[8px] text-rose-300">Enter an amount up to {usd(availableUsd)}.</span>
                  )}
                </label>
              </div>

              <div className="mt-5">
                <span className="text-[9px] font-semibold text-white">Payout method</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {methods.map(item => (
                    <MethodOption key={item.id} method={item} selected={method === item.id} onSelect={chooseMethod} />
                  ))}
                </div>
              </div>

              {method && (
                <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#0A0A0A] p-4">
                  <div className="mb-4">
                    <h3 className="text-[10px] font-semibold text-white">Payout destination</h3>
                    <p className="mt-1 text-[8px] leading-4 text-[#555]">These details are encrypted before they are stored.</p>
                  </div>

                  {method === "UPI" && (
                    <div className="grid gap-3">
                      <TextField label="Account holder name" value={destination.beneficiaryName} onChange={value => updateDestination("beneficiaryName", value)} placeholder="Name on payout account" />
                      <TextField label="UPI ID" value={destination.upiId} onChange={value => updateDestination("upiId", value)} placeholder="name@upi" autoComplete="off" />
                    </div>
                  )}

                  {method === "BANK" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <TextField label="Beneficiary name" value={destination.beneficiaryName} onChange={value => updateDestination("beneficiaryName", value)} placeholder="Name on bank account" />
                      </div>
                      <TextField label="Bank name · optional" value={destination.bankName} onChange={value => updateDestination("bankName", value)} placeholder="Bank name" />
                      <TextField label="IFSC" value={destination.ifsc} onChange={value => updateDestination("ifsc", value.toUpperCase())} placeholder="HDFC0001234" autoComplete="off" />
                      <div className="sm:col-span-2">
                        <TextField label="Account number" value={destination.accountNumber} onChange={value => updateDestination("accountNumber", value)} placeholder="Bank account number" inputMode="numeric" autoComplete="off" />
                      </div>
                    </div>
                  )}

                  {method === "USDT" && (
                    <div className="grid gap-3">
                      <label className="block">
                        <span className="mb-1.5 block text-[9px] font-medium text-[#777]">Network</span>
                        <select
                          value={destination.network}
                          onChange={event => updateDestination("network", event.target.value)}
                          className="h-11 w-full rounded-lg border border-white/[0.09] bg-black px-3 text-[11px] text-white outline-none focus:border-[#195be1]/55"
                        >
                          {(selectedMethod?.networks || ["TRC20"]).map(network => <option key={network} value={network}>{network}</option>)}
                        </select>
                      </label>
                      <TextField label="USDT wallet address" value={destination.walletAddress} onChange={value => updateDestination("walletAddress", value)} placeholder="TRC20 wallet address" autoComplete="off" />
                      <p className="text-[8px] leading-4 text-amber-200/70">Crypto transfers are irreversible. The wallet and network must match exactly.</p>
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={loadQuote}
                disabled={!detailsReady || loadingQuote}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-[11px] font-semibold text-black transition hover:bg-[#e9e9e9] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {loadingQuote ? <RefreshCw size={13} className="animate-spin" /> : <ArrowRight size={13} />}
                {loadingQuote ? "Preparing payout…" : "Review payout"}
              </button>
            </div>
          )}

          {step === "confirm" && quote && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setStep("details");
                  setDestinationConfirmed(false);
                }}
                className="mb-4 inline-flex items-center gap-1.5 text-[9px] text-[#777] hover:text-white"
              >
                <ArrowLeft size={11} />
                Edit payout
              </button>

              <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/25">
                <ConfirmRow label="Requested payout" value={usd(quote.requestedAmountUsd)} emphasized />
                <ConfirmRow label="Method" value={selectedMethod?.label || method} />
                <ConfirmRow label="Destination" value={destinationSummary(method, destination)} />
                {quote.settlementAmount != null && (
                  <ConfirmRow
                    label="Estimated settlement"
                    value={quote.settlementCurrency === "INR" ? inr(quote.settlementAmount) : String(quote.settlementAmount)}
                  />
                )}
                {quote.fxRate && <ConfirmRow label="USD → INR" value={`₹${number(quote.fxRate).toFixed(4)}`} />}
                {quote.quoteExpiresAt && <ConfirmRow label="Quote valid until" value={new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(new Date(quote.quoteExpiresAt)) + " UTC"} />}
              </div>

              <div className={`mt-4 rounded-xl border px-4 py-3 text-[9px] leading-4 ${
                quote.available ? "border-white/[0.07] bg-white/[0.02] text-[#777]" : "border-amber-400/15 bg-amber-400/[0.035] text-amber-100/80"
              }`}>
                {quoteExplanation(quote)}
              </div>

              {quote.available && (
                <>
                  <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-[#0A0A0A] p-4">
                    <input
                      type="checkbox"
                      checked={destinationConfirmed}
                      onChange={event => setDestinationConfirmed(event.target.checked)}
                      className="mt-0.5 size-4 accent-[#195be1]"
                    />
                    <span className="text-[9px] leading-4 text-[#888]">
                      I confirm the payout amount, method and destination above are correct.
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={submit}
                    disabled={!destinationConfirmed || submitting}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-[11px] font-semibold text-black transition hover:bg-[#e9e9e9] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {submitting ? <RefreshCw size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                    {submitting ? "Submitting securely…" : `Request ${usd(quote.requestedAmountUsd)} payout`}
                  </button>
                </>
              )}
            </div>
          )}

          {step === "success" && (
            <div className="py-5 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-300">
                <Check size={20} />
              </div>
              <span className="mt-5 block text-[8px] font-semibold uppercase tracking-[0.14em] text-[#666]">Request received</span>
              <strong className="mt-2 block font-mono text-[30px] font-semibold tracking-[-0.04em] text-white">
                {usd(created?.requestedAmountUsd || amountNumber)}
              </strong>
              <p className="mx-auto mt-3 max-w-sm text-[10px] leading-5 text-[#777]">
                Your payout has been reserved and entered the ACG review queue. The Payout Center will track every status change.
              </p>

              <div className="mx-auto mt-5 max-w-sm rounded-xl border border-white/[0.08] bg-black/25 p-4 text-left">
                <ConfirmRow label="Status" value={created?.status || "REQUESTED"} />
                <ConfirmRow label="Method" value={created?.method || method} />
                <ConfirmRow label="Reference" value={created?.payoutId || "—"} />
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[11px] font-semibold text-black hover:bg-[#e9e9e9]"
              >
                <Wallet size={13} />
                Back to Payout Center
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  return createPortal(body, document.body);
}

function ConfirmRow({ label, value, emphasized = false }) {
  return (
    <div className={`flex items-center justify-between gap-4 border-b border-white/[0.06] px-4 py-3 last:border-b-0 ${emphasized ? "bg-white/[0.02]" : ""}`}>
      <span className="text-[9px] text-[#666]">{label}</span>
      <span className={`max-w-[65%] truncate text-right font-mono text-[10px] ${emphasized ? "font-semibold text-white" : "text-[#aaa]"}`}>{value}</span>
    </div>
  );
}
