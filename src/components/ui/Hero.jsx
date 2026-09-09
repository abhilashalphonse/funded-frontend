import React from 'react';
import { ArrowRight, ChevronRight, Command, Terminal, Activity, ArrowUpRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-[#05060A] text-white overflow-hidden flex flex-col items-center pt-24 pb-20 font-sans selection:bg-white/20 selection:text-white">
      
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
      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 flex flex-col items-center text-center mt-16 sm:mt-24">
        
        {/* Minimalist Pill Badge */}
        <div className="animate-fade-in-up flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-[#0A0C12] text-xs font-medium text-gray-400 mb-8 hover:bg-white/[0.02] transition-colors cursor-pointer">
          <div className="w-1.5 h-1.5 rounded-full bg-white/[0.8] animate-pulse" />
          <span className="tracking-wide">Engine v2.4 Deployed</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-50" strokeWidth={1.5} />
        </div>

        {/* High-Contrast Headline (Linear/Vercel Style Typography) */}
        <h1 className="animate-fade-in-up [animation-delay:100ms] text-5xl sm:text-7xl font-medium tracking-tighter mb-6 leading-[1.05]">
          <span className="text-white">Institutional capital.</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
            Engineered for you.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up [animation-delay:200ms] max-w-xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed font-light">
          Scale your edge with up to $500,000 in funded capital. Execute trades with zero slippage, raw spreads, and a unified terminal built for precision.
        </p>

        {/* Call to Actions */}
        <div className="animate-fade-in-up [animation-delay:300ms] flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Primary CTA: Stark White */}
          <button className="w-full sm:w-auto h-11 px-6 rounded-md bg-white text-[#05060A] font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5">
            Start Trading
            <ChevronRight className="w-4 h-4 opacity-70" strokeWidth={2} />
          </button>
          
          {/* Secondary CTA: Surface Background */}
          <button className="w-full sm:w-auto h-11 px-6 rounded-md border border-white/[0.08] bg-[#0A0C12] text-gray-300 text-sm font-medium hover:text-white hover:bg-white/[0.04] transition-all flex items-center justify-center gap-2 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
            Read the Docs
          </button>
        </div>
      </div>

      {/* --- STRUCTURAL MOCKUP (Linear/Vercel Aesthetic) --- */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mt-24 px-4 sm:px-6 animate-fade-in-up [animation-delay:500ms]">
        
        {/* Outer Frame with inner box-shadow for depth */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0A0C12] shadow-2xl shadow-black overflow-hidden flex flex-col">
          
          {/* Mac-style minimalist header */}
          <div className="h-12 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between px-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full border border-white/[0.15]" />
              <div className="w-2.5 h-2.5 rounded-full border border-white/[0.15]" />
              <div className="w-2.5 h-2.5 rounded-full border border-white/[0.15]" />
            </div>
            
            {/* Command Pallette Hint */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.03] border border-white/[0.04] text-[10px] text-gray-500 font-mono">
              <Command className="w-3 h-3" strokeWidth={1.5} />
              <span>K to search</span>
            </div>
          </div>

          {/* Interface Body */}
          <div className="flex flex-col md:flex-row min-h-[320px]">
            
            {/* Sidebar */}
            <div className="w-full md:w-56 border-r border-white/[0.06] bg-[#05060A]/50 p-3 hidden md:flex flex-col gap-1">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Overview</div>
              {['Positions', 'Order History', 'Performance', 'API Keys'].map((item, i) => (
                <div key={i} className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors ${i === 0 ? 'bg-white/[0.06] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'}`}>
                  {i === 0 ? <Activity className="w-4 h-4 opacity-70" /> : <Terminal className="w-4 h-4 opacity-50" />}
                  {item}
                </div>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 bg-[#0A0C12]">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Available Margin</div>
                  <div className="text-3xl font-medium tracking-tight text-white flex items-baseline gap-1">
                    $1,240,500<span className="text-gray-500 text-lg">.00</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-[#05060A] border border-white/[0.06] px-3 py-1.5 rounded-md">
                  Status <span className="w-2 h-2 rounded-full bg-white opacity-80" /> Operational
                </div>
              </div>

              {/* Data Grid / Table */}
              <div className="border border-white/[0.06] rounded-lg bg-[#05060A] overflow-hidden">
                <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-white/[0.06] text-xs font-medium text-gray-500 bg-white/[0.01]">
                  <div>TICKER</div>
                  <div>SIZE</div>
                  <div>ENTRY</div>
                  <div className="text-right">PNL</div>
                </div>
                
                {[
                  { ticker: 'EUR/USD', size: '10.0', entry: '1.09452', pnl: '+$4,250', pos: true },
                  { ticker: 'XAU/USD', size: '5.0', entry: '2024.15', pnl: '-$1,120', pos: false },
                  { ticker: 'BTC/USD', size: '2.5', entry: '42,150.0', pnl: '+$8,900', pos: true },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-white/[0.04] last:border-0 text-sm hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className="font-medium text-gray-200">{row.ticker}</div>
                    <div className="text-gray-400 font-mono">{row.size}</div>
                    <div className="text-gray-400 font-mono">{row.entry}</div>
                    <div className={`text-right font-mono flex items-center justify-end gap-1 ${row.pos ? 'text-gray-200' : 'text-gray-500'}`}>
                      {row.pnl}
                      <ArrowUpRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${!row.pos && 'rotate-90'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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