import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ChevronLeft, Lock, Mail, Check, AlertCircle, Bitcoin, QrCode, LogIn } from "lucide-react";
import logo from "../assets/ACG.png";
import { useAuth } from "../AuthContext.jsx";
import { getAnalyticsSessionId, getAttribution, trackEvent } from "../utils/analytics.js";

const API_URL = import.meta.env.VITE_API_URL || "";
const STATUS = { IDLE: "IDLE", PROCESSING: "PROCESSING", ACTIVATING: "ACTIVATING", ACTIVE: "ACTIVE", ACTIVATION_FAILED: "ACTIVATION_FAILED" };

const formatAccountSize = (size) => Number.isFinite(size) ? `$${Math.round(size / 1000)}K` : "";
const formatMoney = (amount, currency = { symbol: "€" }) => {
  const symbol = currency?.symbol ?? "€";
  return `${symbol}${Number(amount ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const formatINR = (amount) => `₹${Number(amount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function CheckoutHeader({ onSignIn }) {
  return (
    <header className="flex items-center justify-between gap-3 py-4 sm:py-5">
      <img src={logo} alt="ACG Funded" className="h-6 w-auto object-contain" />
      <div className="flex items-center gap-2 sm:gap-4">
        <button type="button" onClick={onSignIn} className="flex min-h-10 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-zinc-500 hover:bg-white/[0.03] hover:text-white">
          <LogIn className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Already have an account?</span> Sign in
        </button>
        <div className="hidden items-center gap-1.5 text-[12px] text-gray-400 sm:flex"><Lock className="h-3.5 w-3.5" /> Secure Checkout</div>
      </div>
    </header>
  );
}

function ChallengeSummary({ plan }) {
  const definition = plan.challengeDefinition;
  const rules = definition?.rules || {};
  const isTwoStep = definition?.step === "2step";
  const total = plan.pricingPreview?.finalPrice ?? 0;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[0.08] bg-[#0A0C12] p-6 sm:p-7">
      <div className="mb-3 text-[11px] uppercase tracking-widest text-zinc-500">Your Challenge</div>
      <div className="text-4xl font-semibold tracking-tight text-white">{formatAccountSize(definition.accountSize)}</div>
      <div className="mt-1 text-sm text-zinc-400">{isTwoStep ? "2-Step Challenge" : "1-Step Challenge"}</div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <div><div className="text-sm font-semibold text-white">ACG Trader</div><div className="text-xs text-zinc-500">ACG trading platform</div></div>
      </div>

      <div className="mt-6 border-t border-white/[0.06] pt-5">
        <div className="mb-1 text-[11px] uppercase tracking-widest text-zinc-500">Challenge Objectives</div>
        {isTwoStep ? <>
          <Row label="Phase 1 Target" value={`${rules.phase1ProfitTarget}%`} />
          <Row label="Phase 2 Target" value={`${rules.phase2ProfitTarget}%`} />
        </> : <Row label="Profit Target" value={`${rules.profitTarget}%`} />}
        <Row label="Daily Loss" value={`${rules.dailyLoss}%`} />
        <Row label="Max Loss" value={`${rules.maxLoss}%`} />
        <Row label="Minimum Trading Days" value={rules.minTradingDays} />
        <Row label="Profit Split" value={`${plan.commercialConfig?.profitSplit ?? 80}%`} />
      </div>

      <div className="mt-6 border-t border-white/[0.06] pt-5">
        <div className="flex items-center justify-between text-sm text-zinc-400"><span>Challenge</span><span className="text-white">{formatMoney(total, plan.pricingPreview?.currency === "EUR" ? { symbol: "€" } : plan.currency)}</span></div>
        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3"><span className="font-semibold text-white">Total</span><span className="text-2xl font-semibold text-white">{formatMoney(total, { symbol: "€" })}</span></div>
      </div>
    </motion.div>
  );
}

function Row({ label, value }) {
  return <div className="flex items-center justify-between border-b border-white/[0.05] py-2.5 last:border-0"><span className="text-xs text-zinc-500">{label}</span><span className="text-sm font-medium text-white">{value}</span></div>;
}

function EmailField({ email, onChange, locked = false }) {
  return <div className="space-y-1.5">
    <label className="text-[11px] uppercase tracking-widest text-zinc-500" htmlFor="checkout-email">Email</label>
    <div className="relative"><Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
      <input id="checkout-email" type="email" autoComplete="email" value={email} onChange={(e) => onChange(e.target.value)} readOnly={locked} placeholder="you@example.com" className="w-full rounded-lg border border-white/[0.09] bg-white/[0.02] py-2.5 pl-10 pr-3.5 text-[13.5px] text-white outline-none placeholder:text-zinc-600 focus:border-white/30 read-only:cursor-default read-only:text-zinc-400" />
    </div>
    <p className="text-[11px] text-zinc-600">{locked ? "This challenge will be linked to your signed-in account." : "Use the email you want to use for your ACG account."}</p>
  </div>;
}

function PaymentMethodSelector({ method, onChange }) {
  const methods = [
    { id: "UPI", label: "UPI", icon: QrCode },
    { id: "CRYPTO", label: "Crypto", icon: Bitcoin },
  ];
  return (
    <div className="grid grid-cols-2 gap-2" aria-label="Payment methods">
      {methods.map((item) => {
        const active = method === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex min-h-12 items-center justify-between rounded-lg border px-3.5 text-left transition-colors ${active ? "border-white bg-white text-black" : "border-white/[0.09] bg-white/[0.01] text-zinc-400 hover:text-white"}`}
          >
            <span className="flex items-center gap-2 text-xs font-semibold">
              <Icon className="h-4 w-4" />
              {item.label}
            </span>
            {active && <Check className="h-3.5 w-3.5" />}
          </button>
        );
      })}
    </div>
  );
}

function UpiPaymentPanel({ quote, loading, error }) {
  return (
    <div className="rounded-lg border border-white/[0.09] bg-white/[0.015] p-5">
      <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-widest text-zinc-500"><QrCode className="h-4 w-4" /> UPI Payment</div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">Pay in Indian Rupees</p>
          <p className="mt-1 text-xs text-zinc-500">Processed securely by Rupayex</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-zinc-600">Amount payable</div>
          {loading
            ? <div className="mt-1 flex items-center justify-end gap-1.5 text-sm text-zinc-400"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Calculating…</div>
            : error
              ? <div className="mt-1 text-xs text-amber-400">Unavailable</div>
              : <div className="mt-1 text-xl font-semibold tracking-tight text-white">{formatINR(quote?.providerAmount)} <span className="text-xs font-medium text-zinc-500">INR</span></div>}
        </div>
      </div>
      {error
        ? <p className="mt-4 text-xs leading-relaxed text-amber-400">{error}</p>
        : <p className="mt-4 text-xs leading-relaxed text-zinc-500">Your challenge is priced in EUR. Rupayex charges the server-calculated INR equivalent shown above.</p>}
    </div>
  );
}

function CryptoPaymentPanel({ method, onMethodChange }) {
  return <div className="rounded-lg border border-white/[0.09] bg-white/[0.015] p-5">
    <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-widest text-zinc-500"><Bitcoin className="h-4 w-4" /> Crypto Payment</div>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {[{ id: "BTC", label: "Bitcoin (BTC)" }, { id: "USDT_TRX", label: "USDT · TRC20" }].map((coin) => (
        <button key={coin.id} type="button" onClick={() => onMethodChange(coin.id)} className={`rounded-lg border px-3 py-3 text-left text-xs font-semibold transition-colors ${method === coin.id ? "border-white bg-white text-black" : "border-white/[0.09] text-zinc-400 hover:text-white"}`}>
          {coin.label}
        </button>
      ))}
    </div>
    <p className="mt-4 text-xs leading-relaxed text-zinc-500">You'll be redirected to the secure crypto payment page. The backend calculates the final price before payment.</p>
  </div>;
}

function Terms({ checked, onChange }) {
  return <label className="flex cursor-pointer items-start gap-2.5 text-xs text-zinc-500">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-white" />
    <span>I agree to the <span className="text-zinc-300">Terms & Conditions</span> and <span className="text-zinc-300">Refund Policy</span>.</span>
  </label>;
}

function PaymentSection({ plan, email, onEmailChange, emailLocked = false, onSignIn, getAccessToken }) {
  const [method, setMethod] = useState("UPI");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [notice, setNotice] = useState("");
  const [paymentId, setPaymentId] = useState(null);
  const [upiQuote, setUpiQuote] = useState(null);
  const [upiQuoteLoading, setUpiQuoteLoading] = useState(false);
  const [upiQuoteError, setUpiQuoteError] = useState("");

  const definition = plan.challengeDefinition;
  const commercial = plan.commercialConfig;
  const emailValid = /^\S+@\S+\.\S+$/.test(email.trim());
  const amount = plan.pricingPreview?.finalPrice ?? 0;
  const upiReady = method !== "UPI" || (Boolean(upiQuote?.providerAmount) && !upiQuoteLoading && !upiQuoteError);
  const canSubmit = emailValid && termsAccepted && status !== STATUS.PROCESSING && upiReady;

  useEffect(() => {
    if (method !== "UPI") {
      setUpiQuote(null);
      setUpiQuoteError("");
      setUpiQuoteLoading(false);
      return undefined;
    }

    let active = true;
    setUpiQuoteLoading(true);
    setUpiQuoteError("");
    const loadQuote = async () => {
      try {
        const response = await fetch(`${API_URL}/api/payments/upi/quote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            challengeDefinition: definition,
            commercialConfig: commercial,
          }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!active) return;
        if (!response.ok || !payload?.data?.providerAmount) {
          throw new Error(payload?.message || "Unable to calculate the INR amount.");
        }
        setUpiQuote(payload.data);
      } catch (error) {
        if (active) {
          setUpiQuote(null);
          setUpiQuoteError(error?.message || "Unable to calculate the INR amount.");
        }
      } finally {
        if (active) setUpiQuoteLoading(false);
      }
    };
    void loadQuote();
    return () => { active = false; };
  }, [method, definition, commercial]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnedPaymentId = params.get("payment");
    if (!returnedPaymentId) return;
    setPaymentId(returnedPaymentId);
    setStatus(STATUS.PROCESSING);
    let active = true;
    const check = async () => {
      try {
        const response = await fetch(`${API_URL}/api/payments/${returnedPaymentId}/status`);
        const data = await response.json();
        if (!active) return;
        if (data?.data?.status === "PAID") {
          const activationStatus = data?.data?.activation?.status;
          if (activationStatus === "ACTIVE" && data?.data?.accountId) {
            setStatus(STATUS.ACTIVE);
            setNotice("Payment confirmed and your ACG Trader challenge is active.");
          } else if (activationStatus === "FAILED") {
            setStatus(STATUS.ACTIVATION_FAILED);
            setNotice("Payment confirmed, but trading-account activation needs to be retried.");
          } else {
            setStatus(STATUS.ACTIVATING);
            setNotice("Payment confirmed. Activating your ACG Trader challenge...");
          }
        } else if (["FAILED", "EXPIRED", "UNDERPAID"].includes(data?.data?.status)) {
          setStatus(STATUS.IDLE);
          setNotice(`Payment status: ${data.data.status}.`);
        } else {
          setNotice("Payment received by the provider. Waiting for confirmation...");
        }
      } catch { if (active) setNotice("Unable to check payment status. Please refresh in a moment."); }
    };
    check();
    const interval = window.setInterval(check, 5000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);

  const createPayment = async () => {
    if (!canSubmit) return;
    setStatus(STATUS.PROCESSING);
    setNotice("");
    void trackEvent("checkout_submitted", {
      step: definition?.step,
      accountSize: definition?.accountSize,
      paymentMethod: method,
      amount,
    }, { entryIntent: "paid" });
    try {
      const token = await getAccessToken?.().catch(() => null);
      const isUpi = method === "UPI";
      const response = await fetch(`${API_URL}${isUpi ? "/api/payments/upi/create" : "/api/payments/crypto/create"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-acg-session-id": getAnalyticsSessionId(),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email,
          challengeDefinition: definition,
          commercialConfig: commercial,
          ...(isUpi ? {} : { paymentMethod: method }),
          analyticsSessionId: getAnalyticsSessionId(),
          attribution: getAttribution(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.data?.checkoutUrl) throw new Error(data?.message || "Unable to create payment.");
      setPaymentId(data.data.paymentId);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("acg:lastCheckoutEmail", email.trim().toLowerCase());
      }
      window.location.href = data.data.checkoutUrl;
    } catch (error) {
      setStatus(STATUS.IDLE);
      setNotice(error.message || "Payment could not be started.");
      void trackEvent("payment_failed", {
        stage: "payment_create",
        paymentMethod: method,
        accountSize: definition?.accountSize,
        message: error?.message || "Payment could not be started.",
      }, { entryIntent: "paid" });
    }
  };

  if (status === STATUS.ACTIVE) {
    return <div className="rounded-2xl border border-emerald-500/20 bg-[#0A0C12] p-7"><Check className="mb-3 h-6 w-6 text-emerald-400" /><h2 className="text-xl font-semibold text-white">Challenge active</h2><p className="mt-2 text-sm text-zinc-500">Payment is confirmed and your ACG Trader account is ready. Trading access is linked to {email}.</p></div>;
  }

  if (status === STATUS.ACTIVATING) {
    return <div className="rounded-2xl border border-white/[0.08] bg-[#0A0C12] p-7"><Loader2 className="mb-3 h-6 w-6 animate-spin text-white" /><h2 className="text-xl font-semibold text-white">Activating challenge</h2><p className="mt-2 text-sm text-zinc-500">Payment is confirmed. We're provisioning your ACG Trader account now.</p></div>;
  }

  if (status === STATUS.ACTIVATION_FAILED) {
    return <div className="rounded-2xl border border-amber-500/20 bg-[#0A0C12] p-7"><AlertCircle className="mb-3 h-6 w-6 text-amber-400" /><h2 className="text-xl font-semibold text-white">Payment confirmed</h2><p className="mt-2 text-sm text-zinc-500">Your payment is safe, but account activation did not complete. The backend will retry provisioning; if it persists, contact support with payment ID {paymentId}.</p></div>;
  }

  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[0.08] bg-[#0A0C12] p-6 sm:p-7">
    <div className="mb-1 text-[11px] uppercase tracking-widest text-zinc-500">Payment</div>
    <p className="mb-6 text-xs text-zinc-500">Complete your payment to activate your challenge.</p>
    <div className="space-y-5">
      <EmailField email={email} onChange={onEmailChange} locked={emailLocked} />
      <PaymentMethodSelector method={method === "UPI" ? "UPI" : "CRYPTO"} onChange={(next) => setMethod(next === "UPI" ? "UPI" : "BTC")} />
      {method === "UPI" ? <UpiPaymentPanel quote={upiQuote} loading={upiQuoteLoading} error={upiQuoteError} /> : <CryptoPaymentPanel method={method} onMethodChange={setMethod} />}
      <Terms checked={termsAccepted} onChange={setTermsAccepted} />
      {notice && <div className="flex items-start gap-2 rounded-md border border-white/[0.1] bg-white/[0.03] px-3 py-2.5 text-xs text-zinc-300"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{notice}</span></div>}
      <button type="button" onClick={createPayment} disabled={!canSubmit} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white text-[13.5px] font-semibold uppercase tracking-wide text-black hover:bg-neutral-200 disabled:opacity-40">
        {status === STATUS.PROCESSING ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating secure payment...</> : method === "UPI" ? `Pay ${formatINR(upiQuote?.providerAmount)} INR with UPI →` : `Pay ${formatMoney(amount, { symbol: "€" })} with ${method === "BTC" ? "BTC" : "USDT TRC20"} →`}
      </button>
      {paymentId && <p className="text-center text-[10px] text-zinc-700">Payment ID: {paymentId}</p>}
      <div className="space-y-1.5 text-xs text-zinc-500"><div className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> Secure {method === "UPI" ? "UPI" : "crypto"} payment</div><div className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Challenge activated after confirmation</div><div className="flex items-center gap-1.5"><Check className="h-3 w-3" /> ACG Trader access after activation</div></div>
    </div>
  </motion.div>;
}

function PaymentReturn({ onHome, onDashboard }) {
  const [state, setState] = useState({ status: "PROCESSING", message: "Checking your payment…", paymentId: null });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("payment");
    if (params.get("status") === "cancelled") {
      void trackEvent("payment_cancelled", { paymentId }, { entryIntent: "paid" });
    }
    if (!paymentId) {
      setState({ status: "ERROR", message: "Payment reference is missing.", paymentId: null });
      return undefined;
    }

    let active = true;
    const check = async () => {
      try {
        const response = await fetch(`${API_URL}/api/payments/${encodeURIComponent(paymentId)}/status`);
        const payload = await response.json().catch(() => ({}));
        if (!active) return;
        if (!response.ok) throw new Error(payload?.message || "Unable to check payment status.");

        const payment = payload?.data || {};
        if (payment.status === "PAID" && payment.activation?.status === "ACTIVE" && payment.accountId) {
          setState({ status: "ACTIVE", message: "Your ACG Trader challenge is active.", paymentId });
          return;
        }
        if (payment.status === "PAID" && payment.activation?.status === "FAILED") {
          setState({ status: "ACTIVATION_FAILED", message: "Payment is confirmed, but account activation needs attention.", paymentId });
          return;
        }
        if (payment.status === "PAID") {
          setState({ status: "ACTIVATING", message: "Payment confirmed. Activating your ACG Trader challenge…", paymentId });
          return;
        }
        if (["FAILED", "EXPIRED", "UNDERPAID", "REFUNDED"].includes(payment.status)) {
          setState({ status: "ERROR", message: `Payment status: ${payment.status}.`, paymentId });
          return;
        }
        setState({ status: "PROCESSING", message: "Waiting for payment confirmation…", paymentId });
      } catch (error) {
        if (active) setState({ status: "ERROR", message: error?.message || "Unable to check payment status.", paymentId });
      }
    };

    void check();
    const interval = window.setInterval(check, 5000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const complete = state.status === "ACTIVE";
  return (
    <section className="grid min-h-screen place-items-center bg-[#05060A] px-5 font-sans text-zinc-300">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0A0C12] p-7">
        {complete
          ? <Check className="mb-4 h-7 w-7 text-emerald-400" />
          : state.status === "ERROR" || state.status === "ACTIVATION_FAILED"
            ? <AlertCircle className="mb-4 h-7 w-7 text-amber-400" />
            : <Loader2 className="mb-4 h-7 w-7 animate-spin text-white" />}
        <h1 className="text-2xl font-semibold text-white">{complete ? "Challenge active" : "Payment status"}</h1>
        <p className="mt-2 text-sm text-zinc-400">{state.message}</p>
        {state.paymentId && <p className="mt-3 text-[10px] text-zinc-600">Payment ID: {state.paymentId}</p>}
        <div className="mt-6 flex gap-3">
          {complete && <button type="button" onClick={onDashboard} className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black">Access my challenge</button>}
          <button type="button" onClick={onHome} className="rounded-lg border border-white/[0.1] px-4 py-2.5 text-sm text-zinc-300">Homepage</button>
        </div>
      </div>
    </section>
  );
}

export default function PaymentPage({ plan, onBack = () => {}, onHome = () => {}, onDashboard = () => {}, onSignIn = () => {} }) {
  const { user, getAccessToken } = useAuth();
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (user?.email) setEmail(current => current || user.email);
  }, [user?.email]);
  const hasPlan = useMemo(() => Boolean(plan?.challengeDefinition && plan?.commercialConfig), [plan]);

  useEffect(() => {
    if (!hasPlan) return;
    void trackEvent("checkout_viewed", {
      step: plan?.challengeDefinition?.step,
      accountSize: plan?.challengeDefinition?.accountSize,
      amount: plan?.pricingPreview?.finalPrice ?? 0,
    }, { entryIntent: "paid" });
  }, [hasPlan, plan]);

  const returningPayment = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("payment");
  if (!hasPlan && returningPayment) return <PaymentReturn onHome={onHome} onDashboard={onDashboard} />;
  if (!hasPlan) return null;

  return <section className="relative min-h-screen bg-[#05060A] font-sans text-zinc-300">
    <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 sm:px-8">
      <CheckoutHeader onSignIn={onSignIn} />
      <div className="mb-8 sm:mb-10">
        <button type="button" onClick={onBack} className="mb-5 flex items-center gap-1.5 text-[12.5px] text-neutral-500 hover:text-white"><ChevronLeft className="h-3.5 w-3.5" /> Change challenge</button>
        <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Challenge Activation</div>
        <h1 className="mt-3 text-[28px] font-semibold tracking-tight text-white sm:text-4xl">Complete your challenge</h1>
        <p className="mt-1.5 text-sm text-zinc-500">You're one step away from trading.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 pb-20 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <ChallengeSummary plan={plan} />
        </div>
        <div className="order-1 lg:order-2">
          <PaymentSection plan={plan} email={email} onEmailChange={setEmail} emailLocked={Boolean(user?.email)} onSignIn={onSignIn} getAccessToken={getAccessToken} />
        </div>
      </div>
      <div className="pb-10 text-center text-[11px] text-zinc-600">ACG Funded · <a href="mailto:support@acgforex.com" className="hover:text-zinc-400">Support</a></div>
    </div>
  </section>;
}
