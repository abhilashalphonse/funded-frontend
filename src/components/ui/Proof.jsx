import React from 'react';

const Proof = () => {
  return (
    <section className="min-h-screen bg-black text-neutral-200 font-sans px-6 selection:bg-white selection:text-black">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="text-xs font-medium tracking-wide text-neutral-400">CHALLENGE TRANSPARENCY</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-medium tracking-tighter text-white mb-6">
            Know the rules <span className="text-neutral-600">before you trade.</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-xl leading-relaxed font-light">
            Review your challenge configuration, risk limits, pricing and trading conditions before activation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-24">
          {[
            ["Challenge rules", "Profit target, daily loss and maximum loss are shown before you continue."],
            ["Account configuration", "Choose the account size and evaluation path that fit your trading style."],
            ["ACG Trader access", "Activated challenges connect to ACG Trader for the trading experience."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-8">
              <h3 className="text-lg font-medium tracking-tight text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Proof;
