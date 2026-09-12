import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Check, TrendingUp, ArrowRightCircle, ShieldCheck, Activity } from 'lucide-react';

const steps = [
  {
    date: 'Jul 4',
    label: 'Evaluation purchased',
    value: '$422',
    meta: '$100K 2-Step Challenge',
  },
  {
    date: 'Jul 4',
    label: 'Phase 1 passed',
    value: 'Same day',
    meta: 'Cleared',
    done: true,
  },
  {
    date: 'Jul 9',
    label: 'Phase 2 passed',
    sub: '5 days after Phase 1',
    value: 'Funded',
    meta: 'Master account funded',
    done: true,
  },
  {
    date: 'Jul 21',
    label: 'First payout',
    sub: '12 days after funded',
    value: '$4,050.90',
    meta: 'Paid out in 9 hrs',
    active: true,
  },
];

// NOTE: placeholder rows for layout/demo purposes only. Before shipping,
// wire this to a real event feed (e.g. websocket/poll of payout & pass
// events) — do not present static data as "live" to end users.
const activity = [
  { text: 'Trader •••482 passed Phase 1', time: '2m ago' },
  { text: 'Trader •••719 got funded', time: '6m ago' },
  { text: 'Trader •••203 received a $1,840 payout', time: '11m ago' },
  { text: 'Trader •••055 started a $50K evaluation', time: '14m ago' },
  { text: 'Trader •••866 passed Phase 2', time: '19m ago' },
];

function Dot({ step }) {
  return (
    <div
      className={`w-[22px] h-[22px] rounded-full border flex items-center justify-center shrink-0 bg-[#05060A] ${
        step.active ? 'border-white' : step.done ? 'border-white/40' : 'border-white/20'
      }`}
    >
      {step.done || step.active ? (
        <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
      ) : (
        <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
      )}
    </div>
  );
}

const AcgJourney = () => {
  const [pct, setPct] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setPct(6118);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1100;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setPct(Math.round(eased * 6118));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 text-white font-sans">
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 14s linear infinite;
        }
        .ticker-wrap:hover .ticker-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>

      {/* --- HEADER & ACTIVITY FEED --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white mb-2">
            A funded trader's journey
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Case study</span>
            <span className="text-gray-700">/</span>
            <span>Jul 4 – Jul 21</span>
            <span className="text-gray-700">/</span>
            <span>$100K 2-Step Challenge</span>
          </div>
        </div>

        {/* Activity feed — recent-events framing, not an unverified "live" claim */}
        <div className="ticker-wrap bg-[#0A0C12] border border-white/10 rounded-lg px-4 py-3.5 w-full max-w-sm overflow-hidden">
          <div className="flex items-center gap-1.5 mb-2.5 text-xs text-gray-500">
            <Activity className="w-3 h-3 text-white/70" />
            <span>Recent activity</span>
          </div>
          <div className="h-[52px] overflow-hidden relative">
            <div className="ticker-track flex flex-col">
              {[...activity, ...activity].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3 h-[26px] text-xs shrink-0">
                  <span className="text-gray-400 truncate">{item.text}</span>
                  <span className="text-gray-600 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT: TIMELINE & CTA --- */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Timeline */}
        <div className="flex-1 bg-[#0A0C12] border border-white/10 rounded-lg p-6 sm:p-8">

          {/* Desktop: 4-column, connector line lives inside the dot row so it never touches label/value text */}
          <div className="hidden md:grid grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.label} className={`flex flex-col ${i !== steps.length - 1 ? 'pr-6' : ''} ${i !== 0 ? 'pl-6' : ''}`}>
                <div className="flex items-center mb-6">
                  <Dot step={step} />
                  <span className={`ml-2.5 text-xs shrink-0 ${step.active ? 'text-white' : 'text-gray-500'}`}>
                    {step.date}
                  </span>
                  {i !== steps.length - 1 && <div className="flex-1 h-px bg-white/10 ml-3" />}
                </div>

                <h4 className="text-sm text-gray-300 mb-5 leading-snug">
                  {step.label}
                  {step.sub && <span className="block text-xs text-gray-600 mt-0.5">{step.sub}</span>}
                </h4>

                <div>
                  <div className="text-2xl font-medium tracking-tight text-white">
                    {step.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{step.meta}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: stacked list */}
          <div className="flex md:hidden flex-col divide-y divide-white/10">
            {steps.map((step) => (
              <div key={step.label} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                <Dot step={step} />
                <div className="flex-1 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm text-gray-300">{step.label}</h4>
                    <div className="text-xs text-gray-600 mt-0.5">{step.sub || step.date}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-medium text-white">{step.value}</div>
                    <div className="text-xs text-gray-500">{step.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Panel */}
        <div ref={ref} className="w-full lg:w-[300px] rounded-lg bg-[#0A0C12] border border-white/10 p-7 flex flex-col justify-center items-center text-center">

          <div className="inline-flex items-center gap-1.5 text-gray-500 text-xs mb-7">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>9 payouts and counting</span>
          </div>

          <div className="text-5xl font-medium text-white tracking-tight mb-2 leading-none tabular-nums">
            {pct.toLocaleString()}<span className="text-gray-600">%</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-6">
            Return on evaluation fee
            <br />
            in this case study
          </p>

          <div className="flex items-center justify-center gap-2.5 text-gray-500 text-sm mb-6 px-3 py-1.5 rounded-md border border-white/10">
            <span>$422</span>
            <ArrowRightCircle className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-200">$26,242</span>
          </div>

          <button className="w-full h-10 rounded-md bg-white text-[#05060A] font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5">
            Start Your Challenge
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-1.5 text-[11px] text-gray-600 mt-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Results reflect one trader's account</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AcgJourney;