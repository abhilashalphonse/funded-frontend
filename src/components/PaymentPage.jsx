import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ChevronLeft, Lock, Mail, Check, AlertCircle, Bitcoin, LogIn } from "lucide-react";
import logo from "../assets/ACG.png";
import { useAuth } from "../AuthContext.jsx";
import { supabase } from "../supabaseClient.js";

const API_URL = import.meta.env.VITE_API_URL || "";
const STATUS = { IDLE: "IDLE", PROCESSING: "PROCESSING" };

const formatAccountSize = (size) => Number.isFinite(size) ? `$${Math.round(size / 1000)}K` : "";
const formatMoney = (amount) => `€${Number(amount ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function CheckoutHeader({ onSignIn, authenticated }) {
  return <header className="flex items-center justify-between py-5">
    <img src={logo} alt="ACG Funded" className="h-6 w-auto object-contain" />
    <div className="flex items-center gap-4">
      {!authenticated && <button type="button" onClick={onSignIn} className="hidden items-center gap-1.5 text-[12px] font-medium text-zinc-500 hover:text-white sm:flex"><LogIn className="h-3.5 w-3.5" /> Already have an account? Sign in</button>}
      <div className="flex items-center gap-1.5 text-[12px] text-gray-400"><Lock className="h-3.5 w-3.5" /> Secure Checkout</div>
    </div>
  </header>;
}

function ChallengeSummary({ plan }) {
  const definition = plan.challengeDefinition;
  const rules = definition?.rules || {};
  const isTwoStep = definition?.step === "2step";
  const total = plan.pricingPreview?.finalPrice ?? 0;

  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[0.08] bg-[#0A0C12] p-6 sm:p-7">
    <div className="mb-3 text-[11px] uppercase tracking-widest text-zinc-500">Your Challenge</div>
    <div className="text-4xl font-semibold tracking-tight text-white">{formatAccountSize(definition.accountSize)}</div>
    <div className="mt-1 text-sm text-zinc-400">{isTwoStep ? "2-Step Challenge" : "1-Step Challenge"}</div>

    <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      <div><div className="text-sm font-semibold text-white">ACG Trader</div><div className="text-xs text-zinc-500">Trading access after activation</div></div>
    </div>

    <div className="mt-6 border-t border-white/[0.06] pt-5">
      <div className="mb-1 text-[11px] uppercase tracking-widest text-zinc-500">Challenge Objectives</div>
      {isTwoStep ? <><Row label="Phase 1 Target" value={`${rules.phase1ProfitTarget}%`} /><Row label="Phase 2 Target" value={`${rules.phase2ProfitTarget}%`} /></> : <Row label="Profit Target" value={`${rules.profitTarget}%`} />}
      <Row label="Daily Loss" value={`${rules.dailyLoss}%`} />
      <Row label="Max Loss" value={`${rules.maxLoss}%`} />
      <Row label="Minimum Trading Days" value={rules.minTradingDays} />
    </div>

    <div className="mt-6 border-t border-white/[0.06] pt-5">
      <div className="flex items-center justify-between text-sm text-zinc-400"><span>Challenge</span><span className="text-white">{formatMoney(total)}</span></div>
      <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3"><span className="font-semibold text-white">Total</span><span className="text-2xl font-semibold text-white">{formatMoney(total)}</span></div>
    </div>
  </motion.div>;
}

function Row({ label, value }) {
  return <div className="flex items-center justify-between border-b border-white/[0.05] py-2.5 last:border-0"><span className="text-xs text-zinc-500">{label}</span><span className="text-sm font-medium text-white">{value}</span></div>;
}

function PaymentSection({ plan, email, onEmailChange, authenticated }) {
  const [method, setMethod] = useState("BTC");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [notice, setNotice] = useState("");

  const definition = plan.challengeDefinition;
  const commercial = plan.commercialConfig;
  const emailValid = /^\S+@\S+\.\S+$/.test(email.trim());
  const canSubmit = emailValid && termsAccepted && status !== STATUS.PROCESSING;
  const amount = plan.pricingPreview?.finalPrice ?? 0;

  const createPayment = async () => {
    if (!canSubmit) return;
    setStatus(STATUS.PROCESSING);
    setNotice("");
    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data?.session?.access_token;
      const response = await fetch(`${API_URL}/api/payments/crypto/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ email, challengeDefinition: definition, commercialConfig: commercial, paymentMethod: method }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.data?.checkoutUrl) throw new Error(payload?.message || "Unable to create crypto payment.");
      window.location.assign(payload.data.checkoutUrl);
    } catch (error) {
      setStatus(STATUS.IDLE);
      setNotice(error.message || "Payment could not be started.");
    }
  };

  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[0.08] bg-[#0A0C12] p-6 sm:p-7">
    <div className="mb-1 text-[11px] uppercase tracking-widest text-zinc-500">Payment</div>
    <p className="mb-6 text-xs text-zinc-500">Complete your payment to activate your evaluation account.</p>
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-widest text-zinc-500" htmlFor="checkout-email">Email</label>
        <div className="relative"><Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" /><input id="checkout-email" type="email" autoComplete="email" value={email} onChange={(event) => onEmailChange(event.target.value)} readOnly={authenticated} className="w-full rounded-lg border border-white/[0.09] bg-white/[0.02] py-2.5 pl-10 pr-3.5 text-[13.5px] text-white outline-none read-only:text-zinc-400 focus:border-white/30" /></div>
        <p className="text-[11px] text-zinc-600">{authenticated ? "This purchase will be linked to your signed-in ACG Funded account." : "Use the email you will use for your ACG Funded account."}</p>
      </div>

      <div className="rounded-lg border border-white/[0.09] bg-white/[0.015] p-5">
        <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-widest text-zinc-500"><Bitcoin className="h-4 w-4" /> Crypto Payment</div>
        <div className="grid grid-cols-2 gap-2">{[{ id: "BTC", label: "Bitcoin (BTC)" }, { id: "USDT_TRX", label: "USDT · TRC20" }].map((coin) => <button key={coin.id} type="button" onClick={() => setMethod(coin.id)} className={`rounded-lg border px-3 py-3 text-left text-xs font-semibold transition-colors ${method === coin.id ? "border-white bg-white text-black" : "border-white/[0.09] text-zinc-400 hover:text-white"}`}>{coin.label}</button>)}</div>
        <p className="mt-4 text-xs leading-relaxed text-zinc-500">The backend validates your challenge configuration and final price before creating the provider invoice.</p>
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 text-xs text-zinc-500"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 accent-white" /><span>I agree to the <a href="/terms" className="text-zinc-300 underline">Terms & Conditions</a> and <a href="/refund-policy" className="text-zinc-300 underline">Refund Policy</a>.</span></label>
      {notice && <div className="flex items-start gap-2 rounded-md border border-white/[0.1] bg-white/[0.03] px-3 py-2.5 text-xs text-zinc-300"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{notice}</span></div>}
      <button type="button" onClick={createPayment} disabled={!canSubmit} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white text-[13.5px] font-semibold uppercase tracking-wide text-black hover:bg-neutral-200 disabled:opacity-40">{status === STATUS.PROCESSING ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating secure payment...</> : `Pay ${formatMoney(amount)} with ${method === "BTC" ? "BTC" : "USDT TRC20"} →`}</button>
      <div className="space-y-1.5 text-xs text-zinc-500"><div className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> Secure crypto payment</div><div className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Automatic challenge provisioning after confirmation</div><div className="flex items-center gap-1.5"><Check className="h-3 w-3" /> ACG Trader access from your dashboard</div></div>
    </div>
  </motion.div>;
}

export default function PaymentPage({ plan, onBack = () => {}, onSignIn = () => {} }) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const hasPlan = useMemo(() => Boolean(plan?.challengeDefinition && plan?.commercialConfig), [plan]);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  if (!hasPlan) return null;

  return <section className="relative min-h-screen bg-[#05060A] font-sans text-zinc-300">
    <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 sm:px-8">
      <CheckoutHeader onSignIn={onSignIn} authenticated={Boolean(user)} />
      <div className="mb-8 sm:mb-10"><button type="button" onClick={onBack} className="mb-5 flex items-center gap-1.5 text-[12.5px] text-neutral-500 hover:text-white"><ChevronLeft className="h-3.5 w-3.5" /> Change challenge</button><div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Challenge Activation</div><h1 className="mt-3 text-[28px] font-semibold tracking-tight text-white sm:text-4xl">Complete your challenge</h1><p className="mt-1.5 text-sm text-zinc-500">You're one step away from activation.</p></div>
      <div className="grid grid-cols-1 gap-6 pb-20 lg:grid-cols-2"><ChallengeSummary plan={plan} /><PaymentSection plan={plan} email={email} onEmailChange={setEmail} authenticated={Boolean(user)} /></div>
      <div className="pb-10 text-center text-[11px] text-zinc-600">ACG Funded · <a href="/terms">Terms</a> · <a href="/support">Support</a></div>
    </div>
  </section>;
}