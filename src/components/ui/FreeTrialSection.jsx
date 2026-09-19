import React from 'react';
import {
  ArrowRight,
  BarChart3,
  Check,
  LineChart,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const benefits = [
  {
    icon: LineChart,
    title: 'Trade on ACG Trader',
    description: 'Use the same ACG Trader terminal experience available to challenge accounts.',
  },
  {
    icon: ShieldCheck,
    title: 'Experience the rules',
    description: 'See profit targets, drawdown limits and evaluation progress while you trade.',
  },
  {
    icon: Sparkles,
    title: 'No payment required',
    description: 'Create a free trial account and explore the evaluation flow before you buy.',
  },
];

function TerminalPreview() {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#07111a] shadow-[0_26px_80px_rgba(0,0,0,.35)]">
      <div className="flex h-11 items-center justify-between border-b border-white/[0.07] px-4">
        <div className="flex items-center gap-2">
          <div className="grid size-5 place-items-center rounded-md bg-white text-[8px] font-black text-black">A</div>
          <span className="text-[10px] font-semibold tracking-wide text-white">ACG Trader</span>
        </div>
        <div className="flex items-center gap-2 text-[8px] text-[#6f8798]">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span>Live</span>
        </div>
      </div>

      <div className="grid gap-px bg-white/[0.05] sm:grid-cols-[minmax(0,1fr)_160px]">
        <div className="bg-[#07111a] p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full border border-white/[0.08] bg-[#112230] text-[10px] font-black text-white">€</span>
              <div>
                <strong className="block text-[12px] font-bold text-white">EUR/USD</strong>
                <span className="text-[8px] text-[#658094]">Euro / US Dollar</span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="block text-[8px] text-[#648096]">BID / ASK</span>
              <strong className="mt-1 block text-[10px] text-[#dce8f0]">1.18423 / 1.18431</strong>
            </div>
          </div>

          <div className="mt-4 flex gap-1.5">
            {['1m', '5m', '15m', '30m', '1H'].map((item, index) => (
              <span
                key={item}
                className={`rounded-md px-2 py-1 text-[7px] font-bold ${index === 1 ? 'bg-[#12334a] text-[#65caff]' : 'text-[#60788b]'}`}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="relative mt-3 h-40 overflow-hidden rounded-xl border border-white/[0.06] bg-[#061019]">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
                backgroundSize: '36px 32px',
              }}
            />
            <svg viewBox="0 0 500 180" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
              <path
                d="M0 132 C38 125, 58 92, 88 110 S145 72, 180 88 S230 142, 270 118 S325 80, 360 94 S420 54, 500 70"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className="text-[#48d7a5]"
              />
              <path
                d="M0 132 C38 125, 58 92, 88 110 S145 72, 180 88 S230 142, 270 118 S325 80, 360 94 S420 54, 500 70 L500 180 L0 180 Z"
                fill="currentColor"
                className="text-[#48d7a5]/[0.05]"
              />
            </svg>
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <BarChart3 size={12} className="text-[#5a7588]" />
              <span className="text-[7px] font-semibold uppercase tracking-[0.1em] text-[#5d7688]">Free trial workspace</span>
            </div>
          </div>
        </div>

        <div className="bg-[#08131c] p-3.5">
          <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#60798b]">Challenge risk</span>
          <div className="mt-4 space-y-4">
            {[
              ['Daily loss', '10%'],
              ['Max loss', '5%'],
              ['Profit target', '0%'],
            ].map(([label, value], index) => (
              <div key={label}>
                <div className="flex items-center justify-between text-[8px]">
                  <span className="text-[#6b8294]">{label}</span>
                  <span className="font-mono font-bold text-[#dfe8ee]">{value}</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-[#55c9ff]"
                    style={{ width: index === 2 ? '5%' : index === 0 ? '18%' : '10%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-white/[0.07] bg-black/20 p-3">
            <span className="text-[7px] uppercase tracking-[0.12em] text-[#5f7788]">Account</span>
            <strong className="mt-1 block text-[15px] font-semibold tracking-tight text-white">$100,000</strong>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[7px]">
              <div>
                <span className="block text-[#5c7284]">Balance</span>
                <b className="mt-0.5 block text-[#cad7df]">$100,000</b>
              </div>
              <div>
                <span className="block text-[#5c7284]">Mode</span>
                <b className="mt-0.5 block text-[#cad7df]">Free Trial</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FreeTrialSection({ onStartTrial = () => {}, onViewChallenges = () => {} }) {
  return (
    <section id="free-trial" className="relative overflow-hidden bg-[#05060A] px-5 py-24 text-white sm:px-6 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 65% at 72% 45%, #000 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 72% 45%, #000 20%, transparent 80%)',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,.88fr)_minmax(0,1.12fr)] lg:gap-20">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="size-1 rounded-full bg-white" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Free trial</span>
          </div>

          <h2 className="mt-6 max-w-xl text-[2.4rem] font-medium leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-[3.5rem]">
            Try ACG Trader
            <span className="block text-zinc-600">before you buy.</span>
          </h2>

          <p className="mt-5 max-w-lg text-[15px] leading-7 text-zinc-400 sm:text-base">
            Experience the terminal, evaluation rules and challenge progress with a free trial account. No payment required.
          </p>

          <div className="mt-9 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4 py-4">
                <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-zinc-500" />
                <div>
                  <h3 className="text-[13px] font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-[12px] leading-5 text-zinc-500">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStartTrial}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-6 text-[13px] font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.99]"
            >
              Start Free Trial
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={onViewChallenges}
              className="inline-flex min-h-11 items-center justify-center gap-2 px-3 text-[13px] font-medium text-zinc-400 transition hover:text-white"
            >
              View Challenges
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="mt-5 flex items-start gap-2 text-[10px] leading-4 text-zinc-600">
            <Check size={13} className="mt-0.5 shrink-0" />
            <span>One free trial can be active at a time. Start another after the current trial ends.</span>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-10 rounded-full bg-white/[0.035] blur-3xl" />
          <TerminalPreview />
        </div>
      </div>
    </section>
  );
}
