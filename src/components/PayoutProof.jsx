import React from 'react';

const PAYOUTS = [
  { amount: '9,401.23', name: 'Jose', flag: '🇺🇸' },
  { amount: '262.34', name: 'Syed', flag: '🇵🇰' },
  { amount: '225.16', name: 'Niabulo', flag: '🇿🇦' },
  { amount: '240.21', name: 'Omprakash', flag: '🇮🇳' },
  { amount: '240.40', name: 'Hajj', flag: '🇲🇼' },
  { amount: '466.28', name: 'Yassir', flag: '🇫🇷' },
  { amount: '401.20', name: 'Dhanush', flag: '🇮🇳' },
  { amount: '840.00', name: 'Pijus', flag: '🇱🇹' },
  { amount: '4,084.49', name: 'Joe', flag: '🇬🇧' },
  { amount: '2,027.60', name: 'Stefan', flag: '🇩🇰' },
  { amount: '2,925.26', name: 'Rehman', flag: '🇵🇰' },
];

function CertificateThumb({ name, amount }) {
  return (
    <div className="relative w-[92px] h-[68px] shrink-0 rounded-md bg-gradient-to-b from-[#0d1420] to-[#070a10] border border-cyan-500/20 overflow-hidden">
      {/* faint corner glow */}
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-cyan-400/20 blur-xl rounded-full" />

      <div className="relative h-full flex flex-col justify-between p-1.5">
        <div>
          <p className="text-[6px] font-bold tracking-wider text-cyan-300 leading-tight">
            PAYOUT
          </p>
          <p className="text-[6px] font-bold tracking-wider text-white/80 leading-tight">
            CERTIFICATE
          </p>
        </div>

        <div>
          <p className="text-[6.5px] font-semibold text-white/90 truncate leading-tight">
            {name}
          </p>
          <p className="text-[7px] font-bold text-cyan-400 leading-tight">
            ${amount}
          </p>
        </div>
      </div>

      {/* mini glass/chart icon */}
      <svg
        className="absolute right-1.5 bottom-1.5 w-4 h-4 opacity-80"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M6 20h12M9 20V10m6 10V4"
          stroke="url(#certGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="certGrad" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function PayoutCard({ amount, name, flag }) {
  return (
    <div className="group relative flex items-center justify-between gap-3 rounded-2xl bg-white/[0.03] border border-white/5 p-5 transition-colors hover:border-cyan-500/20 hover:bg-white/[0.05]">
      <div>
        <p className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight">
          ${amount}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg leading-none">{flag}</span>
          <span className="text-sm text-gray-400 font-medium">{name}</span>
        </div>
      </div>

      <CertificateThumb name={name} amount={amount} />
    </div>
  );
}

export default function PayoutProofSection() {
  return (
    <section className="bg-[#090A0F] text-white py-20 px-6 sm:px-12 lg:px-24 font-sans overflow-hidden relative">

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PAYOUTS.map((p) => (
          <PayoutCard key={p.name} {...p} />
        ))}

        <div className="flex items-center justify-center rounded-2xl bg-white/[0.02] border border-dashed border-white/10 p-5 min-h-[140px]">
          <p className="text-sm text-gray-500 font-medium">
            ...and thousands more
          </p>
        </div>
      </div>
    </section>
  );
}