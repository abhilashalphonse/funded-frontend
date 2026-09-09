import React from 'react';

const Proof = () => {
  // Mock data for the live payout ledger
  const payouts = [
    { id: 1, name: "Jose M.", flag: "US", amount: "9,401.23", status: "Processed" },
    { id: 2, name: "Stefan K.", flag: "DK", amount: "2,027.60", status: "Processed" },
    { id: 3, name: "Rehman A.", flag: "PK", amount: "2,925.26", status: "Processed" },
    { id: 4, name: "Dhanush R.", flag: "IN", amount: "401.20", status: "Processed" },
    { id: 5, name: "Pijus L.", flag: "LT", amount: "840.00", status: "Processed" },
  ];

  return (
    <section className="min-h-screen bg-black text-neutral-200 font-sans px-6 selection:bg-white selection:text-black">
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-medium tracking-wide text-neutral-400">LIVE LEDGER</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-medium tracking-tighter text-white mb-6">
            Proof of <span className="text-neutral-600">Performance.</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-xl leading-relaxed mb-10 font-light">
            We don't sell lifestyle. We fund disciplined traders. 
            View real-time capital distributions to our global network.
          </p>
          <button className="h-11 px-6 rounded-lg bg-white text-black text-sm font-medium tracking-tight hover:bg-neutral-200 hover:scale-[1.02] transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-2">
            Start Evaluation
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* --- BENTO DASHBOARD UI --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Large Stat Card */}
          <div className="md:col-span-2 relative h-72 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl overflow-hidden group hover:border-white/[0.15] transition-colors duration-500">
            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
            
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Total Payouts (30d)</h3>
                <div className="text-4xl font-medium tracking-tighter text-white mt-2">
                  $2.4M<span className="text-neutral-600">.00</span>
                </div>
              </div>
              
              {/* Mock Chart Line */}
              <div className="w-full h-24 border-b border-dashed border-white/10 relative flex items-end">
                <svg className="w-full h-full text-neutral-700" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline points="0,100 20,80 40,85 60,40 80,50 100,10" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Small Feature Card */}
          <div className="relative h-72 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl overflow-hidden group hover:border-white/[0.15] transition-colors duration-500 p-8 flex flex-col justify-between">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
             <div>
               <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-6">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                   <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                 </svg>
               </div>
               <h3 className="text-lg font-medium text-white tracking-tight">Zero Friction</h3>
               <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                 Automated profit splits processed via Deel within 24 hours of request.
               </p>
             </div>
          </div>
        </div>

        {/* --- LIVE PAYOUT LEDGER TABLE --- */}
        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.08] flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-sm font-medium text-white">Recent Transactions</h3>
            <button className="text-xs text-neutral-500 hover:text-white transition-colors">View All &rarr;</button>
          </div>
          
          <div className="divide-y divide-white/[0.04]">
            {payouts.map((payout) => (
              <div 
                key={payout.id} 
                className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors group"
              >
                {/* Trader Info */}
                <div className="flex items-center gap-4 w-1/3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-neutral-500 font-mono">
                    {payout.flag}
                  </div>
                  <span className="text-sm font-medium text-neutral-300">{payout.name}</span>
                </div>
                
                {/* Status Tag - Monochrome */}
                <div className="w-1/3 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-[11px] font-medium tracking-wide text-neutral-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {payout.status}
                  </span>
                </div>

                {/* Amount */}
                <div className="w-1/3 text-right">
                  <span className="font-mono text-sm text-white group-hover:tracking-tight transition-all">
                    <span className="text-neutral-600 mr-1">$</span>
                    {payout.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Proof;