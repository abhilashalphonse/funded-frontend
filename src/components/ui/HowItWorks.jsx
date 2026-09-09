import React from "react";
import { motion } from "framer-motion";
import { Unlock, LineChart, Wallet, ShieldCheck, ArrowRight } from "lucide-react";

// ---------------------------------------------------------------------------
// No boxes. No icon-in-a-rounded-square. The signature here is structural:
// three columns separated by a single hairline rule, each carrying an
// oversized, near-invisible ghost numeral behind the copy — the kind of
// typographic flourish Linear/Stripe reach for instead of color or borders.
// Pure black / white / zinc. One filled pill CTA, one plain arrow link —
// never two boxed buttons side by side.
// ---------------------------------------------------------------------------
const ICON_STROKE = 1.25;

const STEPS = [
  {
    number: "01",
    icon: Unlock,
    title: "Unlock capital",
    description: "Pass the evaluation and get funded with our capital — no personal risk.",
  },
  {
    number: "02",
    icon: LineChart,
    title: "Trade",
    description: "Trade your strategy on the platform you already know, with real market conditions.",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Earn",
    description: "Withdraw 100% of the profits you generate. No splits, no delays.",
  },
];

export default function HowItWorksSection({ onGetFunded, onLearnMore }) {
  const handleGetFunded = () => {
    if (onGetFunded) return onGetFunded();
    window.open("https://acgfunded.com", "_blank", "noopener,noreferrer");
  };

  const handleLearnMore = () => {
    if (onLearnMore) return onLearnMore();
    window.open("https://acgfunded.com", "_blank", "noopener,noreferrer");
  };

  return (
    <section id="how-it-works" className="relative bg-black px-6 py-28 sm:py-36 text-zinc-300 font-sans selection:bg-white/20">
      <div className="relative mx-auto w-full max-w-6xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 justify-center sm:justify-start">
          <span className="h-1 w-1 rounded-full bg-zinc-600" />
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-500">How it works</span>
        </div>

        {/* Headline — restrained weight, precise scale, one deliberate emphasis shift */}
        <h2 className="mt-6 text-center sm:text-left text-[2.5rem] leading-[1.05] sm:text-6xl sm:leading-[1.02] tracking-tight">
          <span className="font-normal text-zinc-500">Trading revolutionized. </span>
          <span className="font-semibold text-white">Don&apos;t risk your own money.</span>
        </h2>

        <p className="mt-5 text-center sm:text-left text-base text-zinc-500 max-w-lg mx-auto sm:mx-0">
          Trade with our simulated capital and get paid real rewards.
        </p>

        {/* Process — three columns, one hairline rule set, ghost numerals */}
        <div className="relative mt-24 grid grid-cols-1 sm:grid-cols-3 divide-y divide-white/[0.08] sm:divide-y-0 sm:divide-x">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
                className="group relative py-10 sm:py-0 sm:px-10 first:sm:pl-0 last:sm:pr-0"
              >
                {/* Ghost numeral — the section's one typographic flourish */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute -top-6 right-0 sm:right-2 text-[6rem] sm:text-[7rem] font-semibold leading-none tracking-tighter text-white/[0.03] transition-colors duration-500 group-hover:text-white/[0.06]"
                >
                  {step.number}
                </span>

                <div className="relative">
                  <Icon
                    className="h-7 w-7 text-zinc-500 transition-colors duration-300 group-hover:text-white"
                    strokeWidth={ICON_STROKE}
                  />

                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-500 max-w-[26ch]">{step.description}</p>
                </div>

                {/* Flow connector — sits on the divider, desktop only */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden sm:flex absolute top-1/2 -right-[1px] -translate-y-1/2 z-10 h-6 w-6 items-center justify-center rounded-full bg-black border border-white/[0.1] text-zinc-600">
                    <ArrowRight className="h-3 w-3" strokeWidth={2} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA row — one filled pill, one plain arrow link. Never two boxed buttons. */}
        <div className="mt-20 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-center sm:justify-start">
          <button
            type="button"
            onClick={handleGetFunded}
            className="w-full sm:w-auto rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all duration-200 active:scale-[0.98] hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            Get Funded
          </button>

          <button
            type="button"
            onClick={handleLearnMore}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-white focus-visible:outline-none"
          >
            Learn more
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
          </button>
        </div>

        {/* Trust line */}
        <div className="mt-10 flex items-center justify-center sm:justify-start gap-2 text-xs text-zinc-600">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} />
          <span>You&apos;re not liable for any losses.</span>
        </div>
      </div>
    </section>
  );
}