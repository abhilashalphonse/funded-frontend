import React from 'react';
// Import the single unified platforms grid asset directly
import platformsGraphic from '../assets/platforms.webp'; 

export default function PlatformsSection() {
  return (
    <section className="bg-[#090A0F] text-white py-20 px-4 sm:px-8 lg:px-16 font-sans overflow-hidden relative">
      {/* Background ambient decorative light source */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Hand Column: Descriptive Content Matrix */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left order-2 lg:order-1">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            We Support Major{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent block mt-1">
              Platforms
            </span>
          </h2>
          
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
            We want to give you choices. That's why we offer the flexibility to tailor your experience 
            and choose between MT4, MT5 and cTrader. Pick the professional trading platform that 
            suits you best.
          </p>


        </div>

        {/* Right Hand Column: Unified Asset Container Wrapper */}
        <div className="lg:col-span-7 w-full order-1 lg:order-2 flex justify-center items-center">
          <div className="relative w-full max-w-[640px] lg:max-w-none  p-2 sm:p-4  ">
            
            {/* Soft internal gradient ambient ring on container card hover */}
            <div className="absolute inset-0 " />
            
            {/* The single high-fidelity platform graphic image */}
            <img 
              src={platformsGraphic} 
              alt="Supported Trading Platforms (MetaTrader 4, MetaTrader 5, and cTrader)" 
              className="w-full h-auto rounded-2xl object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </section>
  );
}