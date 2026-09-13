import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Lock,
  ShieldCheck,
  CreditCard,
  Bitcoin,
  Check,
  Loader2,
  Plus,
  Mail,
  AlertCircle,
  Tag,
  ChevronDown,
  LogIn,
} from "lucide-react";
import logo from "../assets/ACG.png";

/* ============================================================================
   ACG FUNDED — CHECKOUT / CHALLENGE ACTIVATION PAGE

   Funnel:

   Marketing
      ↓
   Challenge Builder
      ↓
   PAYMENT PAGE (guest checkout)
      ↓
   Payment Provider
      ↓
   Payment Confirmation
      ↓
   Account Creation
      ↓
   Challenge Creation
      ↓
   MT5 Account Creation
      ↓
   Trading

   IMPORTANT:
   - Checkout does NOT require authentication. The customer's email is what
     identifies the checkout/customer; account creation happens after
     payment is confirmed on the backend.
   - Existing customers get a subtle "Already have an account? Sign in"
     affordance instead of a login wall.
   - Backend remains the source of truth for price/payment/order status.
   - No raw card data is handled by ACG.
   - No payment success is faked in this component.
   - MT5 is the only trading platform for V1.

   Expected plan shape:

   {
     stepMode: "1-step" | "2-step",
     currencyCode,
     accountId,
     accountSize,
     priceEUR,
     price,
     currency: { code, symbol, rate, ... }
   }
============================================================================ */

/* --------------------------------------------------------------------------
   Display-only challenge objectives.

   IMPORTANT: mirrored from the existing Challenge component. Before
   production launch, unify these with challengeRules.js so the checkout
   never has to maintain its own copy of the challenge rules.
-------------------------------------------------------------------------- */
const OBJECTIVES_BY_MODE = {
  "1-step": { target: 10, dailyLoss: 3, maxLoss: 6, time: "Unlimited" },
  "2-step": { target: 8, dailyLoss: 5, maxLoss: 10, time: "Unlimited" },
};

const STATUS = {
  IDLE: "IDLE",
  PROCESSING: "PROCESSING",
  INTEGRATION_PENDING: "INTEGRATION_PENDING",
};

const formatAccountSize = (size) => {
  if (!Number.isFinite(size)) return "";
  return size >= 1000 ? `$${Math.round(size / 1000)}K` : `$${size}`;
};

const formatMoney = (amount, currency) => {
  const symbol = currency?.symbol ?? "$";
  const rounded = Math.round((amount ?? 0) * 100) / 100;
  return `${symbol}${rounded.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/* ============================================================================
   HEADER
============================================================================ */

function CheckoutHeader({ onSignIn }) {
  return (
    <header className="flex items-center justify-between py-5">
      <img src={logo} alt="ACG Funded" className="h-6 w-auto object-contain" />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onSignIn}
          className="hidden sm:flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 transition-colors hover:text-white focus:outline-none"
        >
          <LogIn className="h-3.5 w-3.5" strokeWidth={2} />
          Already have an account? Sign in
        </button>

        <div className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400">
          <Lock className="h-3.5 w-3.5" strokeWidth={2} />
          Secure Checkout
        </div>
      </div>
    </header>
  );
}

/* ============================================================================
   HERO
============================================================================ */

function CheckoutHero({ onBack }) {
  return (
    <div className="mb-8 sm:mb-10">
      <button
        type="button"
        onClick={onBack}
        className="group mb-5 flex items-center gap-1.5 text-[12.5px] font-medium text-neutral-500 transition-colors hover:text-white focus:outline-none"
      >
        <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={2} />
        Change challenge
      </button>

      <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
        <span className="h-1 w-1 rounded-full bg-zinc-500" />
        Challenge Activation
      </div>

      <h1 className="mt-3 text-[28px] font-semibold tracking-tight text-white sm:text-4xl">
        Complete your challenge
      </h1>

      <p className="mt-1.5 text-sm text-zinc-500">You're one step away from trading.</p>
    </div>
  );
}

/* ============================================================================
   MT5 PLATFORM
============================================================================ */

function PlatformCard() {
  return (
    <div>
      <div className="mb-2 text-[11px] font-medium uppercase tracking-widest text-zinc-500">
        Trading Platform
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>

        <div>
          <div className="leading-tight text-sm font-semibold text-white">MT5</div>
          <div className="leading-tight text-xs text-zinc-500">MetaTrader 5</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   OBJECTIVES
============================================================================ */

function ObjectivesRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] py-2.5 last:border-0">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="tabular-nums text-sm font-medium text-white">{value}</span>
    </div>
  );
}

/* ============================================================================
   CHALLENGE SUMMARY
   (single "Change challenge" affordance lives in CheckoutHero — not
   duplicated here.)
============================================================================ */

function ChallengeSummary({ plan }) {
  const stepLabel = plan.stepMode === "1-step" ? "1-Step Challenge" : "2-Step Challenge";
  const objectives = OBJECTIVES_BY_MODE[plan.stepMode] ?? OBJECTIVES_BY_MODE["2-step"];
  const total = plan.price ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-[#0A0C12] p-6 sm:p-7"
    >
      <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-zinc-500">
        Your Challenge
      </div>

      <div className="tabular-nums text-4xl font-semibold tracking-tight text-white">
        {formatAccountSize(plan.accountSize)}
      </div>

      <div className="mt-1 text-sm text-zinc-400">{stepLabel}</div>

      <div className="mt-6">
        <PlatformCard />
      </div>

      <div className="mt-6 border-t border-white/[0.06] pt-5">
        <div className="mb-1 text-[11px] font-medium uppercase tracking-widest text-zinc-500">
          Challenge Objectives
        </div>

        <ObjectivesRow label="Profit Target" value={`${objectives.target}%`} />
        <ObjectivesRow label="Daily Loss" value={`${objectives.dailyLoss}%`} />
        <ObjectivesRow label="Max Loss" value={`${objectives.maxLoss}%`} />
        <ObjectivesRow label="Trading Period" value={objectives.time} />
      </div>

      <div className="mt-6 space-y-2 border-t border-white/[0.06] pt-5 text-sm">
        <div className="flex items-center justify-between text-zinc-400">
          <span>Challenge</span>
          <span className="tabular-nums font-medium text-white">{formatMoney(total, plan.currency)}</span>
        </div>

        <div className="flex items-center justify-between text-zinc-400">
          <span>Discount</span>
          <span className="tabular-nums font-medium text-white">{formatMoney(0, plan.currency)}</span>
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="text-sm font-semibold text-white">Total</span>
          <span className="tabular-nums text-2xl font-semibold tracking-tight text-white">
            {formatMoney(total, plan.currency)}
          </span>
        </div>
      </div>

      {/* Secondary upsell — intentionally low emphasis, never auto-added */}
      <button
        type="button"
        className="mt-6 flex w-full items-center justify-between rounded-lg border border-dashed border-white/[0.1] px-4 py-3 text-left text-xs text-zinc-500 transition-colors hover:border-white/20 hover:text-zinc-300 focus:outline-none"
      >
        <span className="flex items-center gap-2">
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Add another account
        </span>
        <span className="text-zinc-600">Save 5%</span>
      </button>
    </motion.div>
  );
}

/* ============================================================================
   EMAIL (guest checkout — this is the customer identifier, no auth required)
============================================================================ */

function EmailField({ email, onChange }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="checkout-email" className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
        Email
      </label>

      <div className="relative">
        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" strokeWidth={1.75} />
        <input
          id="checkout-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => onChange(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-white/[0.09] bg-white/[0.02] py-2.5 pl-10 pr-3.5 text-[13.5px] text-white outline-none transition-all duration-150 placeholder:text-neutral-600 focus:border-white/30 focus:bg-white/[0.03] focus:ring-1 focus:ring-white/20"
        />
      </div>

      <p className="text-[11px] leading-relaxed text-zinc-600">
        We'll use this email to create and deliver access to your ACG account.
      </p>
    </div>
  );
}

/* ============================================================================
   PROMO CODE (collapsed by default — display only until backend validates)
============================================================================ */

function PromoCode({ code, onChange, onApply, applied }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-white focus:outline-none"
        aria-expanded={open}
      >
        <Tag className="h-3.5 w-3.5" strokeWidth={1.75} />
        Have a promo code?
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={1.75} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => onChange(e.target.value.toUpperCase())}
                placeholder="PROMO CODE"
                disabled={applied}
                className="min-w-0 flex-1 rounded-lg border border-white/[0.09] bg-white/[0.02] px-3.5 py-2.5 text-xs font-medium uppercase tracking-wide text-white outline-none placeholder:text-zinc-700 focus:border-white/30"
              />
              <button
                type="button"
                onClick={onApply}
                disabled={!code.trim() || applied}
                className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {applied ? "Applied" : "Apply"}
              </button>
            </div>
            {applied && (
              <p className="mt-2 text-[11px] text-zinc-600">
                Code saved — it will be validated and priced by the payment provider at checkout.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================================
   PAYMENT METHOD TABS
============================================================================ */

function PaymentMethodTabs({ method, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Payment method"
      className="grid grid-cols-2 gap-2 rounded-xl border border-white/[0.08] bg-white/[0.015] p-1"
    >
      {[
        { id: "card", label: "Card", icon: CreditCard },
        { id: "crypto", label: "Crypto", icon: Bitcoin },
      ].map(({ id, label, icon: Icon }) => {
        const active = method === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-semibold tracking-tight transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
              active ? "bg-white text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================================
   CARD PAYMENT

   INTEGRATION: replace with the real provider's secure hosted/embedded
   payment element. ACG must never receive PAN / CVC / raw card number or
   expiry — do not build custom card-number inputs here.
============================================================================ */

function CardPaymentPanel() {
  return (
    <div
      role="group"
      aria-label="Secure payment element"
      className="rounded-lg border border-white/[0.09] bg-white/[0.015] px-4 py-6 text-center"
    >
      <ShieldCheck className="mx-auto mb-2 h-5 w-5 text-zinc-500" strokeWidth={1.5} />
      <p className="text-xs leading-relaxed text-zinc-500">
        Secure card payment
        <br />
        Payment details are handled securely by our payment provider.
      </p>
    </div>
  );
}

/* ============================================================================
   CRYPTO PAYMENT
============================================================================ */

function CryptoPaymentPanel({ onContinue }) {
  const coins = ["BTC", "ETH", "USDT", "USDC"];
  return (
    <div className="rounded-lg border border-white/[0.09] bg-white/[0.015] px-4 py-5">
      <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-zinc-500">
        Crypto Payment
      </div>
      <p className="mb-3 text-xs text-zinc-500">Pay securely using:</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {coins.map((coin) => (
          <span
            key={coin}
            className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] font-mono font-medium text-zinc-300"
          >
            {coin}
          </span>
        ))}
      </div>
      <p className="mb-4 text-xs text-zinc-500">
        You'll be redirected to our secure crypto payment provider.
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="w-full rounded-lg border border-white/[0.12] bg-white/[0.03] py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/[0.06] focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
      >
        Continue to Crypto Payment →
      </button>
    </div>
  );
}

/* ============================================================================
   TERMS
============================================================================ */

function TermsAgreement({ checked, onChange }) {
  return (
    <label className="group flex cursor-pointer select-none items-start gap-2.5">
      <span
        className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-150 ${
          checked ? "border-white bg-white" : "border-white/[0.18] bg-white/[0.02]"
        }`}
      >
        {checked && <Check className="h-[10px] w-[10px] text-black" strokeWidth={3.5} />}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        aria-label="I agree to the Terms & Conditions and Refund Policy"
      />

      <span className="text-xs leading-relaxed text-neutral-500">
        I agree to the{" "}
        <a href="/terms" className="text-neutral-300 underline underline-offset-2 hover:text-white">
          Terms &amp; Conditions
        </a>{" "}
        and{" "}
        <a href="/refund-policy" className="text-neutral-300 underline underline-offset-2 hover:text-white">
          Refund Policy
        </a>
        .
      </span>
    </label>
  );
}

/* ============================================================================
   CHECKOUT CTA
============================================================================ */

function CheckoutCTA({ label, status, disabled, onClick }) {
  const processing = status === STATUS.PROCESSING;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || processing}
      aria-live="polite"
      className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white text-[13.5px] font-semibold uppercase tracking-wide text-black transition-all active:scale-[0.99] hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C12]"
    >
      {processing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          Securely processing...
        </>
      ) : (
        label
      )}
    </button>
  );
}

/* ============================================================================
   TRUST INFO
============================================================================ */

function TrustInfo() {
  return (
    <div className="mt-4 space-y-1.5 text-xs text-zinc-500">
      <div className="flex items-center gap-1.5">
        <Lock className="h-3 w-3" strokeWidth={2} />
        Secure payment
      </div>
      <div className="flex items-center gap-1.5">
        <Check className="h-3 w-3 text-zinc-500" strokeWidth={2} />
        Challenge activated after payment
      </div>
      <div className="flex items-center gap-1.5">
        <Check className="h-3 w-3 text-zinc-500" strokeWidth={2} />
        MT5 account created after activation
      </div>
      <div className="flex items-center gap-1.5">
        <Check className="h-3 w-3 text-zinc-500" strokeWidth={2} />
        Access to your trading dashboard
      </div>
    </div>
  );
}

/* ============================================================================
   PAYMENT SECTION
============================================================================ */

function PaymentSection({ plan, email, onEmailChange, onSignIn }) {
  const [method, setMethod] = useState("card");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [notice, setNotice] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const ctaLabel = `Start My ${formatAccountSize(plan.accountSize)} Challenge — ${formatMoney(
    plan.price ?? 0,
    plan.currency
  )} →`;

  // Fixed regex — the previous version (/\S+@\S+\.\S+/) allowed things like
  // "a@b." with no valid TLD and rejected valid addresses containing
  // whitespace-adjacent edge cases inconsistently. This anchors the match
  // and disallows whitespace/@ inside the local and domain parts.
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const canSubmit = emailValid && termsAccepted && status !== STATUS.PROCESSING;

  const handlePromoApply = () => {
    if (!promoCode.trim()) return;

    /*
      INTEGRATION: validate the coupon server-side — never calculate or
      authorize a discount purely on the client.

        POST /api/checkout/validate-coupon
        { code: promoCode, challengeId: plan.accountId }
        -> { valid, discount, finalAmount }

      Until that call exists, marking the code "applied" here is cosmetic
      only and must NOT change the displayed price.
    */
    setPromoApplied(true);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setNotice("");

    if (method === "crypto") {
      setNotice("Crypto checkout isn't connected yet in this environment.");
      return;
    }

    /*
      INTEGRATION: single payment entry point.

      1. POST { challengeId/accountId, email, promoCode, paymentMethod } to
         the ACG backend.
      2. Backend re-validates price, currency, coupon, and platform, then
         creates a payment session with the real provider.
      3. Frontend hands off to the provider's hosted/embedded checkout.
      4. Provider confirms payment -> webhook -> backend verifies -> order
         marked PAID.
      5. Backend creates/links the customer account (from `email`), creates
         the challenge, then creates the MT5 account.
      6. Frontend polls/subscribes for that real activation status.

      This button click must never mark a payment as successful by itself.
    */
    setStatus(STATUS.PROCESSING);

    // Placeholder only — remove once the real payment session call exists.
    window.setTimeout(() => {
      setStatus(STATUS.IDLE);
      setNotice(
        "Payment processing will connect to the live payment provider once integrated. No charge has been made."
      );
    }, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-[#0A0C12] p-6 sm:p-7"
    >
      <div className="mb-1 text-[11px] font-medium uppercase tracking-widest text-zinc-500">Payment</div>
      <p className="mb-6 text-xs text-zinc-500">Complete your payment to activate your challenge.</p>

      <div className="space-y-5">
        <EmailField email={email} onChange={onEmailChange} />

        {/* Existing-customer path — not a login wall, just an escape hatch */}
        <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.015] px-3.5 py-2.5 sm:hidden">
          <div className="text-xs text-zinc-500">Already have an ACG account?</div>
          <button
            type="button"
            onClick={onSignIn}
            className="text-xs font-semibold text-zinc-300 transition-colors hover:text-white focus:outline-none"
          >
            Sign in
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">Payment Method</div>
          <PaymentMethodTabs method={method} onChange={setMethod} />

          <AnimatePresence mode="wait">
            {method === "card" ? (
              <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <CardPaymentPanel />
              </motion.div>
            ) : (
              <motion.div key="crypto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <CryptoPaymentPanel onContinue={() => setNotice("Crypto checkout isn't connected yet in this environment.")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <PromoCode code={promoCode} onChange={setPromoCode} onApply={handlePromoApply} applied={promoApplied} />

        <TermsAgreement checked={termsAccepted} onChange={setTermsAccepted} />

        {notice && (
          <div className="flex items-start gap-2 rounded-md border border-white/[0.1] bg-white/[0.03] px-3 py-2.5 text-xs text-zinc-300">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
            <span>{notice}</span>
          </div>
        )}

        <CheckoutCTA label={ctaLabel} status={status} disabled={!canSubmit} onClick={handleSubmit} />

        <TrustInfo />
      </div>
    </motion.div>
  );
}

/* ============================================================================
   PAYMENT PAGE

   IMPORTANT: authentication is intentionally NOT required here — there is
   no `useAuth()` call in this file. The checkout works for guests and
   existing customers alike; an existing customer who wants to sign in gets
   a plain "Sign in" affordance (see CheckoutHeader / PaymentSection) that
   should route to the existing Auth screen, not block checkout.
============================================================================ */

export default function PaymentPage({ plan, onBack = () => {}, onSignIn = () => {} }) {
  const [email, setEmail] = useState("");

  if (!plan) return null;

  return (
    <section className="relative min-h-screen bg-[#05060A] font-sans text-zinc-300 selection:bg-white/20">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[40%] w-[70%] -translate-x-1/2 rounded-full bg-white opacity-[0.02] blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <CheckoutHeader onSignIn={onSignIn} />
        <CheckoutHero onBack={onBack} />

        <div className="grid grid-cols-1 gap-6 pb-20 lg:grid-cols-2">
          <ChallengeSummary plan={plan} />
          <PaymentSection plan={plan} email={email} onEmailChange={setEmail} onSignIn={onSignIn} />
        </div>

        <div className="pb-10 text-center text-[11px] text-zinc-600">
          ACG Funded · <a href="/terms" className="hover:text-zinc-400">Terms</a> ·{" "}
          <a href="/support" className="hover:text-zinc-400">Support</a>
        </div>
      </div>
    </section>
  );
}