import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import AcgJourney from './AcgJourney';

const Hero = ({ onGetStarted = () => {}, onFreeTrial = () => {}, onSeeHowItWorks = () => {} }) => {
  return (
    <div id="top" className="relative min-h-screen overflow-hidden bg-[#05060A] pb-14 pt-16 font-sans text-white selection:bg-white/20 selection:text-white">

      {/* --- BACKGROUND EFFECTS (Strictly Monochromatic) --- */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-[-15%] z-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[100px]" />

      {/* --- TOP OF FUNNEL --- */}
      <div className="relative z-10 mx-auto mt-5 flex w-full max-w-[1000px] flex-col items-center px-5 text-center sm:mt-9 sm:px-6">

        <div className="animate-fade-in-up mb-7 inline-flex min-h-9 items-center gap-2 rounded-full border border-white/[0.08] bg-[#0A0C12] px-3.5 py-1.5 text-[11px] font-medium text-zinc-400">
          <span className="size-1.5 rounded-full bg-white/80" />
          <span>Free trial available</span>
          <span className="text-white/20">·</span>
          <span className="text-zinc-500">No payment required</span>
        </div>

        <h1 className="animate-fade-in-up [animation-delay:100ms] text-[2.45rem] font-medium leading-[1.02] tracking-[-0.055em] sm:text-7xl">
          <span className="text-white">Prove your edge.</span>
          <br />
          <span className="bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
            Get funded.
          </span>
        </h1>

        <p className="animate-fade-in-up [animation-delay:200ms] mx-auto mt-6 max-w-xl text-[15px] font-light leading-7 text-zinc-400 sm:text-lg sm:leading-relaxed">
          Trade up to <span className="font-medium text-zinc-200">$200,000</span> in simulated funded capital.
          Follow clear risk rules and earn rewards when you perform.
        </p>

        <div className="animate-fade-in-up [animation-delay:300ms] mt-8 flex w-full max-w-sm flex-col gap-2.5 sm:max-w-none sm:flex-row sm:justify-center sm:gap-3">
          <button
            type="button"
            onClick={onGetStarted}
            className="flex min-h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-white px-6 text-[14px] font-semibold text-[#05060A] transition hover:bg-zinc-200 active:scale-[0.99] sm:w-auto"
          >
            Start Your Challenge
            <ChevronRight className="size-4 opacity-65" strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={onFreeTrial}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.025] px-6 text-[14px] font-semibold text-zinc-200 transition hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-white active:scale-[0.99] sm:w-auto"
          >
            Try Free Trial
            <ArrowRight className="size-4 text-zinc-500" strokeWidth={1.8} />
          </button>
        </div>

        <div className="animate-fade-in-up [animation-delay:380ms] mt-4 flex flex-col items-center gap-2.5">
          <p className="text-[10px] leading-4 text-zinc-600 sm:text-[11px]">
            Clear risk rules <span className="mx-1.5 text-white/15">·</span> Unlimited trading period <span className="mx-1.5 text-white/15">·</span> ACG Trader included
          </p>
          <button
            type="button"
            onClick={onSeeHowItWorks}
            className="inline-flex min-h-9 items-center gap-1.5 px-2 text-[11px] font-medium text-zinc-500 transition hover:text-zinc-200"
          >
            See how it works
            <ArrowRight className="size-3.5" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      {/* --- PROOF / JOURNEY BRIDGE --- */}
      <div className="relative z-10 mx-auto mt-20 w-full max-w-5xl px-4 animate-fade-in-up [animation-delay:500ms] sm:mt-24 sm:px-6">
        <AcgJourney />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}} />
    </div>
  );
};

export default Hero;
