import React from 'react';

export default function YourChallengeSection() {
  return (
    <section className="bg-[#090A0F] text-white py-10 px-6 sm:px-12 lg:px-24 font-sans overflow-hidden relative">
      
      {/* Precision Overhead Conic/Linear Glow Effect matching the image */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[250px] pointer-events-none select-none">
        {/* The sharp top light aperture */}
        <div className="mx-auto w-40 h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
        {/* The expanding atmospheric down-light cone */}
        <div 
          className="w-full h-full bg-gradient-to-b from-blue-500/20 via-cyan-500/5 to-transparent blur-xl clip-cone"
          style={{
            clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)'
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Small Premium Badge Context */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-6 shadow-sm">
          Evaluation Tiers
        </div>

        {/* Main Header with Gradient & Sharp Interlacing */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
          Choose Your{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Elite
          </span>{' '}
          Challenge
        </h2>

        {/* Subtext Copy matching the premium layout */}
        <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
          Complete our optimized{' '}
          <span className="text-white font-medium underline decoration-cyan-500/40 decoration-2 underline-offset-4">
            Trading Objectives
          </span>{' '}
          to become eligible to gain your premium institutional account.
        </p>

      </div>

    </section>
    
  );
}