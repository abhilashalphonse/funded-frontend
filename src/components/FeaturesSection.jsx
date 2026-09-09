import React, { useState } from 'react';

export default function FeaturesSection() {
  // State to simulate an interactive metric card toggle or hover state if needed
  const [isActive, setIsActive] = useState(true);

  const features = [
    {
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Instant Rewards",
      description: "Fast, secure, and automated reward withdrawals processed instantly."
    },
    {
      icon: (
        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "Elite 24/7 Support",
      description: "Priority dedicated assistance via Live Chat, VIP Email, or WhatsApp."
    },
    {
      icon: (
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      title: "Institutional Tools",
      description: "Tailored analytical suites and execution services built for hyper-growth."
    },
    {
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Infinite Retries",
      description: "Zero restrictions. Take as many attempts and free trials as you need."
    }
  ];

  return (
    <section className="bg-[#090A0F] text-white py-16 px-6 sm:px-12 lg:px-24 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-widest text-blue-500 uppercase mb-2">Why Partner With Us</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
            The Ultimate Trading Arena
          </h2>
        </div>

        {/* Main Hero Card Container */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#121520] to-[#0A0C12] border border-gray-800/60 p-8 sm:p-12 lg:p-16 mb-6 shadow-2xl group">
          
          {/* Aesthetic background glows for that high-investment feel */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-blue-600/15 transition-all duration-700" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Live Funding Allocation
              </div>
              <h3 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                More Power, <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Absolute Control.
                </span>
              </h3>
              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                Access up to <span className="text-white font-semibold">$200,000</span> in simulated institutional capital with optimized low-latency execution and flexible risk parameters.
              </p>
              <div>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.02] transition-all duration-300">
                  Get Funded Now
                </button>
              </div>
            </div>

            {/* Right Column: Premium Abstract UI Interface mockup */}
            <div className="lg:col-span-6 relative w-full flex justify-center lg:justify-end items-center">
              
              {/* Main Chart Card Mockup */}
              <div className="w-full max-w-md bg-[#161925]/80 backdrop-blur-md rounded-2xl border border-gray-700/40 p-5 shadow-2xl relative transform group-hover:scale-[1.01] transition-transform duration-500">
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="text-xs text-gray-500 ml-2 font-mono">AUDCHF_M5</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-medium">Live Feed</span>
                </div>
                
                {/* Simulated Candlestick / Metrics Content Area */}
                <div className="space-y-4">
                  <div className="h-28 flex items-end justify-between gap-1 pt-4 px-2 bg-[#0E1017] rounded-xl overflow-hidden relative">
                    {/* Abstract Candlesticks */}
                    <div className="w-3 h-16 bg-red-500/30 rounded-sm relative flex justify-center items-center"><div className="w-0.5 h-20 bg-red-500 absolute" /></div>
                    <div className="w-3 h-12 bg-red-500/30 rounded-sm relative flex justify-center items-center"><div className="w-0.5 h-16 bg-red-500 absolute" /></div>
                    <div className="w-3 h-20 bg-emerald-500/30 rounded-sm relative flex justify-center items-center"><div className="w-0.5 h-24 bg-emerald-500 absolute" /></div>
                    <div className="w-3 h-14 bg-emerald-500/30 rounded-sm relative flex justify-center items-center"><div className="w-0.5 h-20 bg-emerald-500 absolute" /></div>
                    <div className="w-3 h-24 bg-emerald-500/30 rounded-sm relative flex justify-center items-center"><div className="w-0.5 h-28 bg-emerald-500 absolute" /></div>
                  </div>

                  {/* Floating Glass Dashboard Overlay */}
                  <div className="bg-[#1C2035]/90 border border-white/10 rounded-xl p-4 shadow-xl relative -mt-10 mx-2 backdrop-blur-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Account Balance</p>
                        <p className="text-2xl font-mono font-bold text-white tracking-tight">$219,999.43</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Status</p>
                        <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1 justify-end">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Ongoing
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Links inside the UI */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700/50">
                      <div className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white cursor-pointer bg-white/5 py-1 px-2 rounded-md transition-colors">
                        <span className="text-blue-400 font-mono">🔑</span> Credentials
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white cursor-pointer bg-white/5 py-1 px-2 rounded-md transition-colors">
                        <span className="text-purple-400 font-mono">📊</span> Metrix Analytics
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Bottom Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, index) => (
            <div 
              key={index} 
              className="bg-[#11131F] border border-gray-800/80 rounded-2xl p-6 hover:bg-[#151828] hover:border-gray-700/80 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feat.icon}
                </div>
                <h4 className="text-base font-bold mb-1.5 text-white tracking-wide">{feat.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}