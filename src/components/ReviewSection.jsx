import React from 'react';
import PayoutProofSection from './PayoutProof';

export default function ReviewSection() {
  const stats = [
    { value: "3.5M+", label: "Customers worldwide" },
    { value: "$500M+", label: "Paid in rewards worldwide" },
    { value: "140+", label: "Countries served" }
  ];

  const testimonials = [
    {
      name: "Maik",
      country: "Germany",
      flagCode: "de", // Lowercase ISO 2-letter code for flag-icons library
      views: "81K",
      rewards: "$114,907",
      style: "Swing trader",
      imgPlaceholder: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Cinthya",
      country: "Ecuador",
      flagCode: "ec",
      views: "62K",
      rewards: "$41,018",
      style: "Day trader",
      imgPlaceholder: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Bjorn",
      country: "Belgium",
      flagCode: "be",
      views: "56K",
      rewards: "$40,931",
      style: "Swing trader",
      imgPlaceholder: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Tarhata",
      country: "USA",
      flagCode: "us",
      views: "66K",
      rewards: "$25,607",
      style: "Day trader",
      imgPlaceholder: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80"
    }
  ];

  return (
    <section className="bg-[#090A0F] text-white py-24 px-4 sm:px-8 lg:px-16 font-sans overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Millions
            </span>{' '}
            of Traders
          </h2>
          
          {/* Main Core Platform Statistics Row */}
          <div className="flex flex-wrap justify-center items-center gap-y-4 gap-x-8 pt-4">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 text-sm sm:text-base">
                <span className="font-mono font-black text-xl sm:text-2xl text-white bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="text-gray-400 font-medium tracking-wide text-xs sm:text-sm">{stat.label}</span>
                {i < stats.length - 1 && (
                  <span className="hidden md:inline text-gray-800 ml-4 font-light">|</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Video Cards Grid Layout */}
        <div className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x lg:grid lg:grid-cols-4 lg:overflow-x-visible lg:pb-0">
          {testimonials.map((trader, index) => (
            <div 
              key={index}
              className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-center bg-[#11131F] border border-gray-800/80 rounded-2xl overflow-hidden p-4 hover:border-gray-700 hover:bg-[#141727] transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Media Card Video Preview Container */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-950 mb-5 shadow-inner">
                <img 
                  src={trader.imgPlaceholder} 
                  alt={trader.name}
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" 
                />
                
                {/* Glassmorphic YouTube Badge Layer */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                  <svg className="w-3.5 h-3.5 text-red-500 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="text-[10px] font-bold font-mono tracking-wide text-gray-200">
                    YouTube • {trader.views} Views
                  </span>
                </div>

                {/* Central Interactive Play Button Ring Trigger */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black text-white">
                    <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Profile Identity Parameters */}
              <div className="px-1 mb-6 flex items-center gap-3">
                {/* Precision flag-icons container styled directly with Tailwind wrappers */}
                <div className="flex-shrink-0 w-7 h-5 overflow-hidden rounded shadow-sm border border-white/15 flex items-center justify-center bg-gray-900">
                  <span className={`fi fi-${trader.flagCode} !block w-full h-full object-cover`} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide">{trader.name}</h4>
                  <p className="text-xs text-gray-500 font-medium tracking-wide">{trader.country}</p>
                </div>
              </div>

              {/* Analytical Row Metric Values */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-900/80 px-1">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-0.5">Rewards Earned</span>
                  <span className="text-sm font-bold font-mono text-emerald-400 tracking-tight">{trader.rewards}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-0.5">Trading Style</span>
                  <span className="text-sm font-semibold text-gray-300 tracking-wide">{trader.style}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
        <PayoutProofSection />

      </div>
    </section>
  );
} 