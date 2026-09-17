import React, { useMemo, useState } from 'react';
import { ArrowRight, BarChart3, Check, CreditCard, LayoutDashboard, LogOut, Menu, Play, Plus, User, X } from 'lucide-react';
import acg from '../../assets/ACG.png';
import { useAuth } from '../../AuthContext.jsx';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'accounts', label: 'Trading Accounts', icon: BarChart3 },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function OnboardingDashboard({ workspace, onBack, onStartChallenge, onTryDemo }) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const identity = useMemo(() => {
    const metadata = user?.user_metadata || workspace?.customer?.metadata || {};
    const name = metadata.full_name || metadata.name || metadata.first_name || user?.email?.split('@')[0] || 'Trader';
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    return { name, initials: parts.slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'TR', email: user?.email || workspace?.customer?.email || '' };
  }, [user, workspace]);
  const demo = workspace?.demos?.[0] || null;

  const logout = async () => {
    await signOut();
    onBack?.();
  };

  return <div className="min-h-screen bg-black text-[#EDEDED] antialiased">
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#222] bg-black px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen(value => !value)} className="p-1.5 text-[#888] md:hidden">{sidebarOpen ? <X size={18} /> : <Menu size={18} />}</button>
        <img src={acg} alt="ACG Funded" className="h-5 w-auto" />
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block"><div className="text-[12px] text-[#AAA]">{identity.name}</div><div className="text-[10px] text-[#555]">{identity.email}</div></div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">{identity.initials}</div>
      </div>
    </header>

    <div className="flex min-h-[calc(100vh-56px)]">
      <aside className={`fixed inset-y-0 left-0 top-14 z-40 flex w-64 flex-col justify-between border-r border-[#222] bg-black transition-transform md:static md:top-0 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4">
          <button onClick={onStartChallenge} className="mb-7 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-white text-[13px] font-semibold text-black hover:bg-[#EAEAEA]"><Plus size={14} /> New Challenge</button>
          <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.15em] text-[#505050]">Workspace</p>
          <nav className="space-y-0.5">{navItems.map(item => { const Icon = item.icon; const active = item.id === activeTab; return <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] ${active ? 'bg-[#111] text-white' : 'text-[#777] hover:bg-[#0B0B0B] hover:text-white'}`}><Icon size={15} />{item.label}</button>; })}</nav>
        </div>
        <div className="border-t border-[#222] p-4"><button onClick={logout} className="flex items-center gap-2 text-[12px] text-[#666] hover:text-white"><LogOut size={13} /> Log out</button></div>
      </aside>
      {sidebarOpen && <button onClick={() => setSidebarOpen(false)} className="fixed inset-0 top-14 z-30 bg-black/80 md:hidden" />}

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-8 sm:px-7 sm:py-10">
          {activeTab === 'overview' && <Overview identity={identity} demo={demo} onStartChallenge={onStartChallenge} onTryDemo={onTryDemo} />}
          {activeTab === 'accounts' && <Accounts demo={demo} onStartChallenge={onStartChallenge} onTryDemo={onTryDemo} />}
          {activeTab === 'billing' && <Empty title="No billing activity yet" body="Challenge purchases, invoices and payment status will appear here after your first order." />}
          {activeTab === 'profile' && <Empty title="Your ACG Funded profile" body={`Signed in as ${identity.email || identity.name}. Identity and account settings will live here.`} />}
        </div>
      </main>
    </div>
  </div>;
}

function Overview({ identity, demo, onStartChallenge, onTryDemo }) {
  return <div className="space-y-5">
    <div className="border-b border-[#222] pb-6"><div className="text-[11px] uppercase tracking-[0.16em] text-[#555]">Customer workspace</div><h1 className="mt-2 text-[30px] font-medium tracking-[-0.04em] text-white sm:text-[36px]">Welcome, {identity.name}</h1><p className="mt-2 text-[13px] text-[#777]">You are signed in. Choose how you want to start.</p></div>

    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-6 sm:p-7">
        <div className="mb-8 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black"><Plus size={16} /></div>
        <div className="text-[10px] uppercase tracking-[0.16em] text-[#555]">Ready for evaluation</div>
        <h2 className="mt-2 text-xl font-medium text-white">Start your first challenge</h2>
        <p className="mt-2 max-w-md text-[13px] leading-5 text-[#777]">Configure account size, evaluation rules and payout preferences, then continue to activation.</p>
        <button onClick={onStartChallenge} className="mt-7 flex h-10 items-center gap-2 rounded-md bg-white px-4 text-[12px] font-semibold text-black hover:bg-[#EAEAEA]">Build challenge <ArrowRight size={13} /></button>
      </div>

      <div className="rounded-2xl border border-[#222] bg-[#090909] p-6 sm:p-7">
        <div className="mb-8 flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] bg-[#111] text-[#BBB]"><Play size={16} /></div>
        <div className="text-[10px] uppercase tracking-[0.16em] text-[#555]">No purchase required</div>
        <h2 className="mt-2 text-xl font-medium text-white">Try demo trading first</h2>
        <p className="mt-2 max-w-md text-[13px] leading-5 text-[#777]">Practice opening and closing simulated BTC positions using a $100,000 demo balance before moving to ACG Trader.</p>
        <button onClick={onTryDemo} className="mt-7 flex h-10 items-center gap-2 rounded-md border border-[#303030] bg-[#111] px-4 text-[12px] font-medium text-[#DDD] hover:bg-[#161616]">{demo ? 'Continue demo' : 'Create demo account'} <ArrowRight size={13} /></button>
      </div>
    </section>

    <section className="rounded-xl border border-[#222] bg-[#090909]">
      <div className="border-b border-[#202020] px-5 py-4"><h2 className="text-[13px] font-medium text-white">Your onboarding</h2></div>
      <div className="grid grid-cols-1 divide-y divide-[#202020] md:grid-cols-3 md:divide-x md:divide-y-0">
        <Journey step="01" title="Create your account" done body="Your ACG Funded customer identity is active." />
        <Journey step="02" title="Learn the workflow" done={Boolean(demo)} body={demo ? 'Your demo workspace is ready.' : 'Use the free demo or go directly to a challenge.'} />
        <Journey step="03" title="Activate a challenge" body="After payment, your evaluation account appears here and can launch ACG Trader." />
      </div>
    </section>
  </div>;
}

function Accounts({ demo, onStartChallenge, onTryDemo }) {
  return <div className="space-y-5"><div className="border-b border-[#222] pb-6"><div className="text-[11px] uppercase tracking-[0.16em] text-[#555]">Accounts</div><h1 className="mt-2 text-[28px] font-medium text-white">Trading accounts</h1><p className="mt-2 text-[13px] text-[#777]">Evaluation and funded accounts appear here after activation.</p></div>
    {demo ? <section className="rounded-xl border border-[#222] bg-[#090909] p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[10px] uppercase tracking-[0.16em] text-[#555]">Demo · {demo.accountId}</div><div className="mt-2 text-xl font-medium text-white">$100,000 Demo</div><div className="mt-1 font-mono text-[12px] text-[#777]">Balance {Number(demo.balance || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div></div><button onClick={onTryDemo} className="flex h-9 items-center gap-2 rounded-md border border-[#303030] px-4 text-[12px] text-[#DDD] hover:bg-[#141414]">Open demo <ArrowRight size={13} /></button></div></section> : <Empty title="No trading account yet" body="Create a free demo account or activate your first challenge." action={<div className="mt-5 flex justify-center gap-2"><button onClick={onTryDemo} className="rounded-md border border-[#303030] px-4 py-2 text-[12px] text-[#DDD]">Try demo</button><button onClick={onStartChallenge} className="rounded-md bg-white px-4 py-2 text-[12px] font-medium text-black">Start challenge</button></div>} />}
  </div>;
}

function Journey({ step, title, body, done }) { return <div className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="font-mono text-[10px] text-[#555]">{step}</span>{done && <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#333] text-[#AAA]"><Check size={10} /></span>}</div><div className="mt-5 text-[13px] font-medium text-white">{title}</div><p className="mt-2 text-[11px] leading-5 text-[#666]">{body}</p></div>; }
function Empty({ title, body, action }) { return <section className="rounded-xl border border-[#222] bg-[#090909] px-6 py-14 text-center"><h2 className="text-[14px] font-medium text-white">{title}</h2><p className="mx-auto mt-2 max-w-md text-[12px] leading-5 text-[#707070]">{body}</p>{action}</section>; }
