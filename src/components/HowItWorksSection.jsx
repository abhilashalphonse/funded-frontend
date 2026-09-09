import React from 'react';

export default function HowItWorksSection() {
  const steps = [
    {
      stepNumber: "01",
      badge: "Evaluation Process",
      title: "Prove your skills",
      description: "Complete our optimized 1-Step Speed or 2-Step Standard objectives to demonstrate your risk management and consistency.",
      gradientClass: "from-blue-600/20 via-indigo-600/5 to-transparent border-blue-500/30",
      accentGlow: "bg-blue-500/10",
      iconColor: "text-blue-400",
      customElement: (
        <div className="w-full bg-[#090A0F]/80 border border-gray-800/80 rounded-xl p-3.5 space-y-2.5 backdrop-blur-sm">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Profit Target</span>
            <span className="font-mono text-white font-bold">Passed</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Max Daily Loss</span>
            <span className="font-mono text-white font-bold">Passed</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Max Overall Loss</span>
            <span className="font-mono text-white font-bold">Passed</span>
          </div>
        </div>
      )
    },
    {
      stepNumber: "02",
      badge: "Funded Account",
      title: "Earn premium rewards",
      description: "Trade live simulated capital in an institutional environment with deep liquidity and keep up to 90% of your generated gains.",
      gradientClass: "from-emerald-600/20 via-teal-600/5 to-transparent border-emerald-500/30",
      accentGlow: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      customElement: (
        <div className="w-full bg-gradient-to-b from-[#161A26] to-[#0E111A] border border-gray-800 rounded-xl p-4 text-center relative overflow-hidden group-hover:scale-[1.03] transition-transform duration-300">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 block mb-1 font-bold">Certificate Issued</span>
          <p className="text-xs text-gray-400 mb-2">Reward Payout</p>
          <p className="text-2xl font-black font-mono text-white tracking-tight">$20,335.70</p>
        </div>
      )
    },
    {
      stepNumber: "03",
      badge: "Premium Programme",
      title: "Achieve & scale more",
      description: "Unlock elite account tiers, access capital scaling pathways, and tap into dedicated trading operations.",
      gradientClass: "from-amber-600/20 via-orange-600/5 to-transparent border-amber-500/30",
      accentGlow: "bg-amber-500/10",
      iconColor: "text-amber-400",
      customElement: (
        <div className="w-full flex justify-center items-center gap-2 py-2">
          <div className="px-3 py-2 bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 rounded-lg text-center transform -rotate-6 scale-95 shadow-lg">
            <span className="text-[10px] font-black tracking-wider text-amber-400 block">PRIME</span>
          </div>
          <div className="px-4 py-2.5 bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/30 rounded-lg text-center z-10 shadow-2xl relative">
            <span className="text-xs font-black tracking-widest text-white block">SUPREME</span>
          </div>
          <div className="px-3 py-2 bg-gradient-to-br from-cyan-500/20 to-transparent border border-cyan-500/20 rounded-lg text-center transform rotate-6 scale-95 shadow-lg">
            <span className="text-[10px] font-black tracking-wider text-cyan-400 block">QUANT</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="how" className="bg-[#090A0F] text-white py-24 px-6 sm:px-12 lg:px-24 font-sans overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header Text */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-xs font-bold tracking-widest text-blue-500 uppercase">Seamless Framework</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            How It{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
        </div>

        {/* Process Cards Step Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col justify-between group">
              
              {/* Desktop Connecting Arrow Vector Lines */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-7 -translate-y-1/2 z-20 items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-[#121520] border border-gray-800 flex items-center justify-center shadow-md">
                    <svg className="w-3 h-3 text-gray-500 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Main Step Wrapper Box */}
              <div className={`h-full flex flex-col justify-between bg-gradient-to-b ${step.gradientClass} border rounded-2xl p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#11131F]/40`}>
                
                {/* Upper Module Structure */}
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-3 py-1 rounded-full ${step.accentGlow} border border-white/5 text-[10px] font-bold tracking-wider uppercase ${step.iconColor}`}>
                      {step.badge}
                    </div>
                    <span className="font-mono text-3xl font-black tracking-tighter opacity-15 text-white block select-none">
                      {step.stepNumber}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white tracking-wide group-hover:text-white transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 leading-relaxed font-normal mb-8">
                    {step.description}
                  </p>
                </div>

                {/* Simulated Content/Visual Element Block Area */}
                <div className="mt-auto pt-2 w-full">
                  {step.customElement}
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Dynamic Navigation/CTA Triggers Row Below the Cards */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-4">
          <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
            Start Funding Challenge
          </button>
          <button className="px-8 py-3.5 rounded-xl bg-[#121520]/80 backdrop-blur-md border border-gray-800 hover:border-gray-700 text-xs font-bold uppercase tracking-wider hover:text-cyan-400 transition-all duration-300">
            Detailed FAQ Models
          </button>
        </div>

      </div>
    </section>
  );
}