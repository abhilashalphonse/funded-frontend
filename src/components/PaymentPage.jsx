import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  CreditCard,
  Bitcoin,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Zap,
  Rocket,
  Info,
  ChevronDown,
  Sparkles
} from "lucide-react";

// Pricing Database (USD) — kept in sync with the Challenges section
const PRICING = {
  "1-step": { 10000: 89, 25000: 98, 50000: 301, 100000: 549, 200000: 910 },
  "2-step": { 5000: 49, 10000: 69, 25000: 129, 50000: 249, 100000: 448, 200000: 789 },
};

// Account sizes differ per mode — 2-step also offers a $5k tier that 1-step doesn't.
const ACCOUNT_SIZES_BY_MODE = {
  "1-step": [10000, 25000, 50000, 100000, 200000],
  "2-step": [5000, 10000, 25000, 50000, 100000, 200000],
};

const PLATFORMS = ["MT4", "MT5", "cTrader"];

const BUNDLES = [
  { 
    qty: 1, 
    discount: 0, 
    title: "1 Account", 
    badge: "Default",
    features: [] 
  },
  { 
    qty: 2, 
    discount: 0.05, 
    title: "2 Accounts", 
    badge: "Increase chances",
    features: ["Trade different strategies", "Reduce evaluation risk"] 
  },
  { 
    qty: 3, 
    discount: 0.10, 
    title: "3 Accounts", 
    badge: "Most Popular",
    features: ["Scale faster", "Better diversification"] 
  },
  { 
    qty: 5, 
    discount: 0.15, 
    title: "5 Accounts", 
    badge: "⭐ Best Value",
    features: ["Professional setup", "Maximum scaling", "Biggest savings"] 
  },
];

export default function PaymentPage({ plan, onBack  }) {
  if (!plan) return null;
  const { price, currency } = plan;

  // Checkout State
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Configuration State — seeded from the incoming plan, but now real state
  const [stepMode, setStepMode] = useState(plan.stepMode);
  const [accountSize, setAccountSize] = useState(plan.accountSize);
  const [platform, setPlatform] = useState("MT5");
  const [bundleQty, setBundleQty] = useState(1);
  const [showObjectives, setShowObjectives] = useState(false);

  const accountSizes = useMemo(() => ACCOUNT_SIZES_BY_MODE[stepMode], [stepMode]);

  // Keep the selected account size valid whenever the step mode changes
  // (e.g. 2-step's $5k tier doesn't exist under 1-step).
  useEffect(() => {
    if (!accountSizes.includes(accountSize)) {
      setAccountSize(accountSizes.includes(100000) ? 100000 : accountSizes[0]);
    }
  }, [accountSizes, accountSize]);

  // Dynamic Pricing Math
  const basePrice = PRICING[stepMode]?.[accountSize] ?? price ?? 0;
  const activeBundle = BUNDLES.find(b => b.qty === bundleQty);
  
  const unitPrice = basePrice * (1 - activeBundle.discount);
  const subtotal = basePrice * bundleQty;
  const bundleDiscount = subtotal - (unitPrice * bundleQty);
  const total = unitPrice * bundleQty;

  const objectives = useMemo(() => {
    if (stepMode === "1-step") {
      return { target: "10%", dailyLoss: "3%", maxLoss: "6%", time: "Unlimited" };
    }
    return { target: "8% (P1) / 6% (P2)", dailyLoss: "5%", maxLoss: "10%", time: "Unlimited" };
  }, [stepMode]);

  return (
    <section className="relative overflow-hidden bg-[#05060A] px-4 py-12 md:py-16 min-h-screen flex text-slate-300 font-sans selection:bg-blue-500/30">
      {/* Structural Visual Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-[#2E6BFF] blur-[160px] opacity-[0.08]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF7A3D] blur-[160px] opacity-[0.06]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Header / Back Button */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <button
            onClick={onBack} 
            className="group flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] transition-colors group-hover:bg-white/[0.08]">
              <ChevronLeft className="h-4 w-4" />
            </div>
            Back to Challenges
          </button>
          
          <div className="flex items-center gap-2 text-emerald-400/90 text-sm font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Lock className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          
          {/* LEFT COLUMN: Order Configuration & Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0C12]/80 shadow-2xl backdrop-blur-xl p-6 sm:p-8">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-white text-[10px]">1</span>
                Choose Challenge
              </h2>
              
              {/* Step Mode Toggle */}
              <div className="mb-6 flex rounded-xl border border-white/[0.05] bg-white/[0.01] p-1">
                <button
                  onClick={() => setStepMode("2-step")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all duration-300 ${
                    stepMode === "2-step" ? "bg-[#2A2B30] text-white shadow-md border border-white/10" : "text-slate-500 hover:text-white"
                  }`}
                >
                  <Rocket className="w-3.5 h-3.5" /> 2-Step
                </button>
                <button
                  onClick={() => setStepMode("1-step")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all duration-300 ${
                    stepMode === "1-step" ? "bg-[#2A2B30] text-white shadow-md border border-white/10" : "text-slate-500 hover:text-white"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" /> 1-Step
                </button>
              </div>

              {/* Account Size Selection */}
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Account Size</div>
                <div className="flex flex-wrap gap-2">
                  {accountSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setAccountSize(size)}
                      className={`flex-1 min-w-[60px] rounded-lg border py-2 text-xs font-bold transition-all duration-300 ${
                        accountSize === size
                          ? "border-[#2E6BFF]/50 bg-[#2E6BFF]/10 text-white"
                          : "border-white/[0.05] bg-white/[0.02] text-slate-400 hover:border-white/[0.1] hover:text-white"
                      }`}
                    >
                      {size / 1000}K
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Selection */}
              <div className="mb-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Trading Platform</div>
                <div className="flex gap-2">
                  {PLATFORMS.map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setPlatform(plat)}
                      className={`flex-1 rounded-lg border py-2 text-xs font-bold transition-all duration-300 ${
                        platform === plat
                          ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                          : "border-white/[0.05] bg-white/[0.02] text-slate-400 hover:border-white/[0.1] hover:text-white"
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-[1px] bg-white/[0.06] mb-8" />

              {/* STEP 2: Choose Bundle */}
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-white text-[10px]">2</span>
                Choose Bundle
              </h2>
              
              <div className="flex flex-col gap-3 mb-8">
                {BUNDLES.map((bundle) => {
                  const isSelected = bundleQty === bundle.qty;
                  const calculatedUnitPrice = basePrice * (1 - bundle.discount);
                  
                  return (
                    <button
                      key={bundle.qty}
                      onClick={() => setBundleQty(bundle.qty)}
                      className={`relative flex flex-col gap-2 rounded-xl border p-4 transition-all duration-300 text-left ${
                        isSelected
                          ? "border-[#D4AF37]/50 bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                          : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.1]"
                      }`}
                    >
                      {/* Inner Ring for Selection */}
                      <div className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? "border-[#D4AF37]" : "border-slate-600"
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                          </div>
                          <span className={`font-bold text-sm ${isSelected ? "text-[#D4AF37]" : "text-slate-300"}`}>
                            {bundle.title}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            bundle.qty === 5 ? "text-emerald-400" : "text-slate-500"
                          }`}>
                            {bundle.badge}
                          </span>
                          <span className={`font-black text-lg ${isSelected ? "text-white" : "text-slate-300"}`}>
                            ${calculatedUnitPrice.toFixed(2)}<span className="text-xs text-slate-500 font-medium">/ea</span>
                          </span>
                        </div>
                      </div>

                      {bundle.features.length > 0 && (
                        <div className="ml-7 mt-1 flex flex-col gap-1">
                          {bundle.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                              <CheckCircle2 className={`w-3 h-3 ${isSelected ? "text-[#D4AF37]/80" : "text-slate-600"}`} />
                              {feature}
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="w-full h-[1px] bg-white/[0.06] mb-6" />

              {/* Trading Objectives (collapsible) */}
              <button
                type="button"
                onClick={() => setShowObjectives(!showObjectives)}
                className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500 mb-4 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" />
                  Trading Objectives
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showObjectives ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showObjectives && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                        <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">Profit Target</div>
                        <div className="text-white font-bold">{objectives.target}</div>
                      </div>
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                        <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">Max Daily Loss</div>
                        <div className="text-white font-bold">{objectives.dailyLoss}</div>
                      </div>
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                        <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">Max Loss</div>
                        <div className="text-white font-bold">{objectives.maxLoss}</div>
                      </div>
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                        <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">Trading Period</div>
                        <div className="text-white font-bold">{objectives.time}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Order Summary Pricing */}
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                Order Summary
              </h2>
              
              <div className="flex flex-col gap-3 text-sm font-medium bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]">
                <div className="flex justify-between text-slate-400">
                  <span>{accountSize / 1000}K {platform} Challenge</span>
                  <span className="text-white">${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Bundle Selection</span>
                  <span className="text-white">{bundleQty} Accounts</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                
                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 pt-2 border-t border-white/[0.06]">
                    <span>Bundle Discount ({activeBundle.discount * 100}%)</span>
                    <span className="font-bold">-${bundleDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-white font-black text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-base font-bold text-slate-400">Total Due Today</span>
                <span className="text-3xl font-black text-white tracking-tight">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Checkout Form */}
          {/* RIGHT COLUMN: Checkout Form */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-7 flex flex-col gap-6"
      >
        <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0C12]/80 shadow-2xl backdrop-blur-xl p-6 sm:p-8">
          
          {/* Billing Info */}
          <div className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-white text-[10px]">1</span>
              Billing Details
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 ml-1">First Name</label>
                <input type="text" placeholder="John" className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-sm text-white placeholder-slate-600 transition-colors focus:border-[#2E6BFF]/50 focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#2E6BFF]/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 ml-1">Last Name</label>
                <input type="text" placeholder="Doe" className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-sm text-white placeholder-slate-600 transition-colors focus:border-[#2E6BFF]/50 focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#2E6BFF]/50" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 ml-1">Email Address</label>
                <input type="email" placeholder="john.doe@example.com" className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-sm text-white placeholder-slate-600 transition-colors focus:border-[#2E6BFF]/50 focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#2E6BFF]/50" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 ml-1">Country</label>
                <select className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-sm text-white transition-colors focus:border-[#2E6BFF]/50 focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#2E6BFF]/50 appearance-none">
                  <option className="bg-[#0A0C12]">United States</option>
                  <option className="bg-[#0A0C12]">United Kingdom</option>
                  <option className="bg-[#0A0C12]">European Union</option>
                </select>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-white/[0.04] mb-8" />

          {/* Payment Method */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-white text-[10px]">2</span>
              Payment Method
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 relative flex items-center justify-center gap-3 rounded-xl border p-4 transition-all duration-300 ${
                  paymentMethod === "card"
                    ? "border-[#2E6BFF]/50 bg-[#2E6BFF]/10 text-white"
                    : "border-white/[0.05] bg-white/[0.02] text-slate-400 hover:border-white/[0.1] hover:text-white"
                }`}
              >
                <CreditCard className={`w-5 h-5 ${paymentMethod === "card" ? "text-[#2E6BFF]" : ""}`} />
                <span className="font-bold text-sm tracking-wide">Credit Card</span>
                {paymentMethod === "card" && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2E6BFF] shadow-[0_0_8px_rgba(46,107,255,0.8)]" />
                )}
              </button>
              <button
                onClick={() => setPaymentMethod("crypto")}
                className={`flex-1 relative flex items-center justify-center gap-3 rounded-xl border p-4 transition-all duration-300 ${
                  paymentMethod === "crypto"
                    ? "border-[#ff7a00]/50 bg-[#ff7a00]/10 text-white"
                    : "border-white/[0.05] bg-white/[0.02] text-slate-400 hover:border-white/[0.1] hover:text-white"
                }`}
              >
                <Bitcoin className={`w-5 h-5 ${paymentMethod === "crypto" ? "text-[#ff7a00]" : ""}`} />
                <span className="font-bold text-sm tracking-wide">Cryptocurrency</span>
                {paymentMethod === "crypto" && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff7a00] shadow-[0_0_8px_rgba(255,122,0,0.8)]" />
                )}
              </button>
            </div>

            {/* Dynamic Payment Details Area */}
            <AnimatePresence mode="wait">
              {paymentMethod === "card" ? (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 ml-1">Card Number</label>
                    <div className="relative">
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 transition-colors focus:border-[#2E6BFF]/50 focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#2E6BFF]/50 font-mono" />
                      <CreditCard className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 ml-1">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-sm text-white placeholder-slate-600 transition-colors focus:border-[#2E6BFF]/50 focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#2E6BFF]/50 font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 ml-1">CVC</label>
                      <input type="text" placeholder="123" className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-sm text-white placeholder-slate-600 transition-colors focus:border-[#2E6BFF]/50 focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#2E6BFF]/50 font-mono" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="crypto"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-[#ff7a00]/20 bg-[#ff7a00]/5 p-5 text-center flex flex-col items-center justify-center gap-3 overflow-hidden"
                >
                  <Wallet className="w-8 h-8 text-[#ff7a00] mb-1" />
                  <p className="text-sm font-medium text-slate-300">
                    You will be redirected to our secure gateway to complete your transaction in BTC, ETH, USDT, or USDC.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TOS & Submit */}
          <div className="mt-8 space-y-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 rounded border border-white/[0.1] bg-white/[0.02] group-hover:border-white/[0.2] transition-colors shrink-0">
                <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer peer" required />
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6BFF] opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs font-medium text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                I agree to the <span className="text-white underline underline-offset-2 hover:text-[#2E6BFF]">Terms of Service</span>, <span className="text-white underline underline-offset-2 hover:text-[#2E6BFF]">Refund Policy</span>, and confirm I have read the trading guidelines.
              </span>
            </label>

            <button
              type="button"
              className="w-full relative overflow-hidden rounded-xl px-8 py-4.5 text-sm font-black uppercase tracking-widest text-white transition-all active:scale-[0.98] text-center shadow-lg bg-[#2E6BFF] shadow-[0_4px_20px_rgba(46,107,255,0.2)] hover:bg-[#4C7DFF] hover:shadow-[0_4px_30px_rgba(46,107,255,0.4)] flex items-center justify-center gap-2 group"
            >
              Pay ${total.toFixed(2)}
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50 group-hover:animate-ping absolute right-6" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">
              <AlertCircle className="w-3 h-3" />
              Prices are exclusive of local taxes
            </div>
          </div>
          
        </div>
      </motion.div>
        </div>
      </div>
    </section>
  );
}