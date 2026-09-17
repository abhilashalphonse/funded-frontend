import React, { useMemo, useState } from 'react';
import { ArrowRight, BarChart3, LogOut, Menu, ShieldCheck, Target, User, Wallet, X } from 'lucide-react';
import acg from '../../assets/ACG.png';
import { useAuth } from '../../AuthContext.jsx';
import { customerApi } from '../../api/customer.js';

const money = (value) => Number(value || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

function phaseTarget(account) {
  const phases = account?.rules?.phases || [];
  const current = phases.find(item => Number(item.phase) === Number(account?.currentPhase));
  return Number(current?.profitTarget || 0);
}

export default function ActiveChallengeDashboard({ account, onBack, onRefresh }) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [notice, setNotice] = useState('');
  const targetPct = phaseTarget(account);
  const initial = Number(account?.accountSize || 0);
  const profit = Number(account?.projections?.profit ?? Number(account?.balance || 0) - initial);
  const targetAmount = initial * (targetPct / 100);
  const progress = targetAmount > 0 ? Math.max(0, Math.min(100, (profit / targetAmount) * 100)) : 0;
  const identity = useMemo(() => {
    const metadata = user?.user_metadata || {};
    const name = metadata.full_name || metadata.name || metadata.first_name || user?.email?.split('@')[0] || 'Trader';
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    return { name, initials: parts.slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'TR' };
  }, [user]);

  const openTrader = async () => {
    setLaunching(true);
    setNotice('');
    try {
      const session = await customerApi.createTradingLaunch(account.accountId);
      if (!session?.launchUrl) throw new Error('Trading launch URL was not returned.');
      window.location.assign(session.launchUrl);
    } catch (error) {
      setNotice(error.message || 'Unable to open ACG Trader.');
      setLaunching(false);
    }
  };

  const logout = async () => {
    await signOut();
    onBack?.();
  };

  return <div className="min-h-screen bg-black text-[#EDEDED] antialiased">
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#222] bg-black px-4 sm:px-6">
      <div className="flex items-center gap-3"><button onClick={() => setSidebarOpen(value => !value)} className="p-1.5 text-[#888] md:hidden">{sidebarOpen ? <X size={18} /> : <Menu size={18} />}</button><img src={acg} alt="ACG Funded" className="h-5 w-auto" /></div>
      <div className="flex items-center gap-2"><span className="hidden text-[12px] text-[#777] sm:block">{identity.name}</span><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">{identity.initials}</span></div>
    </header>

    <div className="flex min-h-[calc(100vh-56px)]">
      <aside className={`fixed inset-y-0 left-0 top-14 z-40 flex w-64 flex-col justify-between border-r border-[#222] bg-black transition-transform md:static md:top-0 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4"><div className="mb-7 rounded-lg border border-[#222] bg-[#090909] p-3"><div className="text-[10px] uppercase tracking-[0.14em] text-[#555]">Current account</div><div className="mt-2 text-[13px] font-medium text-white">{account.accountId}</div><div className="mt-1 text-[11px] text-[#666]">{account.challengeType === 'TWO_STEP' ? '2-Step' : '1-Step'} · Phase {account.currentPhase}</div></div><nav className="space-y-0.5"><SideItem icon={BarChart3} label="Overview" active /><SideItem icon={Target} label="Objectives" /><SideItem icon={Wallet} label="Payouts" /><SideItem icon={User} label="Profile" /></nav></div>
        <div className="border-t border-[#222] p-4"><button onClick={logout} className="flex items-center gap-2 text-[12px] text-[#666] hover:text-white"><LogOut size={13} /> Log out</button></div>
      </aside>
      {sidebarOpen && <button onClick={() => setSidebarOpen(false)} className="fixed inset-0 top-14 z-30 bg-black/80 md:hidden" />}

      <main className="min-w-0 flex-1"><div className="mx-auto w-full max-w-[1120px] px-5 py-8 sm:px-7 sm:py-10">
        <div className="mb-6 flex flex-col gap-4 border-b border-[#222] pb-6 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[#666]"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {account.status} · Phase {account.currentPhase}</div><h1 className="mt-2 text-[30px] font-medium tracking-[-0.04em] text-white">{money(account.accountSize)} evaluation</h1><p className="mt-2 text-[13px] text-[#777]">Your ACG Funded challenge is active and connected to the trading infrastructure.</p></div><div className="flex gap-2"><button onClick={onRefresh} className="h-9 rounded-md border border-[#303030] px-4 text-[12px] text-[#AAA] hover:text-white">Refresh</button><button onClick={openTrader} disabled={launching || account.provisioning?.status !== 'ACTIVE'} className="flex h-9 items-center gap-2 rounded-md bg-white px-4 text-[12px] font-semibold text-black hover:bg-[#EAEAEA] disabled:opacity-40">{launching ? 'Opening…' : 'Open ACG Trader'} <ArrowRight size={13} /></button></div></div>
        {notice && <div className="mb-5 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">{notice}</div>}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric label="Balance" value={money(account.balance)} /><Metric label="Equity" value={money(account.equity)} /><Metric label="Daily loss" value={money(account.projections?.dailyLoss)} secondary={`Limit ${account.rules?.dailyDrawdown ?? 0}%`} /><Metric label="Overall loss" value={money(account.projections?.totalLoss)} secondary={`Limit ${account.rules?.maxDrawdown ?? 0}%`} /></div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-xl border border-[#222] bg-[#090909] p-5 sm:p-6"><div className="flex items-center justify-between"><div><div className="text-[11px] uppercase tracking-[0.14em] text-[#555]">Profit objective</div><div className="mt-2 text-xl font-medium text-white">{targetPct}% target</div></div><span className="font-mono text-[12px] text-[#888]">{Math.round(progress)}%</span></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#202020]"><div className="h-full bg-white" style={{ width: `${progress}%` }} /></div><div className="mt-4 flex items-center justify-between text-[11px]"><span className="text-[#666]">Current profit</span><span className={profit >= 0 ? 'font-mono text-emerald-400' : 'font-mono text-red-400'}>{profit >= 0 ? '+' : ''}{money(profit)}</span></div><div className="mt-2 flex items-center justify-between text-[11px]"><span className="text-[#666]">Target amount</span><span className="font-mono text-[#AAA]">{money(targetAmount)}</span></div></section>
          <section className="rounded-xl border border-[#222] bg-[#090909] p-5 sm:p-6"><div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] bg-[#111]"><ShieldCheck size={16} /></div><div className="text-[13px] font-medium text-white">Risk status</div><div className="mt-4 space-y-3 text-[11px]"><Rule label="Daily drawdown" value={`${account.rules?.dailyDrawdown ?? 0}%`} /><Rule label="Maximum drawdown" value={`${account.rules?.maxDrawdown ?? 0}%`} /><Rule label="Minimum trading days" value={String(account.rules?.minimumTradingDays ?? 0)} /><Rule label="Trading days completed" value={String(account.projections?.tradingDays ?? 0)} /></div></section>
        </div>
      </div></main>
    </div>
  </div>;
}

function Metric({ label, value, secondary }) { return <div className="rounded-xl border border-[#222] bg-[#090909] p-4 sm:p-5"><div className="text-[10px] uppercase tracking-[0.12em] text-[#555]">{label}</div><div className="mt-2 font-mono text-[18px] font-medium text-white sm:text-xl">{value}</div>{secondary && <div className="mt-2 text-[10px] text-[#666]">{secondary}</div>}</div>; }
function Rule({ label, value }) { return <div className="flex items-center justify-between border-b border-[#202020] pb-3 last:border-0 last:pb-0"><span className="text-[#666]">{label}</span><span className="font-mono text-[#CCC]">{value}</span></div>; }
function SideItem({ icon: Icon, label, active }) { return <button className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] ${active ? 'bg-[#111] text-white' : 'text-[#666] hover:bg-[#0B0B0B] hover:text-white'}`}><Icon size={15} />{label}</button>; }
