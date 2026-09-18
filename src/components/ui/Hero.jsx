import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import AcgJourney from './AcgJourney';

const Hero = ({ onGetStarted = () => {}, onFreeTrial = () => {}, onSeeHowItWorks = () => {} }) => {
  return (
    <div className="relative min-h-screen bg-[#05060A] text-white overflow-hidden flex flex-col items-center pt-16 pb-12 font-sans selection:bg-white/20 selection:text-white">

      {/* --- BACKGROUND EFFECTS (Strictly Monochromatic) --- */}
      {/* 1. Ultra-faint Grid Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)'
        }}
      />

      {/* 2. Pure White/Silver Ambient Light (No Colors) */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.04] blur-[100px] rounded-full pointer-events-none z-0" />

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 flex flex-col items-center text-center mt-6 sm:mt-8">

        {/* Minimalist Pill Badge */}
        <button type="button" onClick={onFreeTrial} className="animate-fade-in-up flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-[#0A0C12] text-xs font-medium text-gray-400 mb-8 hover:bg-white/[0.02] transition-colors cursor-pointer">
          <div className="w-1.5 h-1.5 rounded-full bg-white/[0.8] animate-pulse" />
          <span className="tracking-wide">How about a Free Trial?</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-50" strokeWidth={1.5} />
        </button>

        {/* High-Contrast Headline (Linear/Vercel Style Typography) */}
        <h1 className="animate-fade-in-up [animation-delay:100ms] text-5xl sm:text-7xl font-medium tracking-tighter mb-6 leading-[1.05]">
          <span className="text-white">Prove your edge.</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
            Get funded.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up [animation-delay:200ms] max-w-xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed font-light">
          Trade up to $200,000 in funded capital. Follow clear risk rules, and earn rewards when you perform.
        </p>

        {/* Call to Actions */}
        <div className="animate-fade-in-up [animation-delay:300ms] flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Primary CTA: Stark White */}
          <button type="button" onClick={onGetStarted} className="w-full sm:w-auto h-11 px-6 rounded-md bg-white text-[#05060A] font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5">
            Start Your Challenge
            <ChevronRight className="w-4 h-4 opacity-70" strokeWidth={2} />
          </button>

          {/* Secondary CTA: Surface Background */}
          <button type="button" onClick={onSeeHowItWorks} className="w-full sm:w-auto h-11 px-6 rounded-md border border-white/[0.08] bg-[#0A0C12] text-gray-300 text-sm font-medium hover:text-white hover:bg-white/[0.04] transition-all flex items-center justify-center gap-2 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
            See How It Works
          </button>
        </div>
      </div>

      {/* --- STRUCTURAL MOCKUP (Linear/Vercel Aesthetic) --- */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mt-14 sm:mt-16 px-4 sm:px-6 animate-fade-in-up [animation-delay:500ms]">
        <AcgJourney />
      </div>

      {/* Keyframe Animations */}
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