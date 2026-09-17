import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  ShieldCheck,
  User,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import acg from '../../assets/ACG.png';
import { useAuth } from '../../AuthContext';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'accounts', label: 'Trading Accounts', icon: BarChart3 },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'profile', label: 'Profile', icon: User },
];

const journey = [
  {
    step: '01',
    title: 'Choose your challenge',
    description: 'Select an account size and evaluation model that fits your trading style.',
  },
  {
    step: '02',
    title: 'Trade the evaluation',
    description: 'Trade on ACG Trader while staying inside your configured risk limits.',
  },
  {
    step: '03',
    title: 'Unlock funded status',
    description: 'Complete the objectives to progress toward an ACG Funded account.',
  },
];

const EmptyAccounts = ({ onStartChallenge }) => (
  <div className="space-y-6">
    <section className="overflow-hidden rounded-2xl border border-[#242424] bg-[#0A0A0A]">
      <div className="border-b border-[#202020] px-6 py-5 sm:px-8 sm:py-7">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#111111] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#A1A1A1]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#777777]" />
          No active challenge
        </div>

        <div className="max-w-2xl">
          <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-white sm:text-[42px] sm:leading-[1.08]">
            Your trading workspace is ready.
          </h1>
          <p className="mt-4 max-w-xl text-[14px] leading-6 text-[#8D8D8D] sm:text-[15px]">
            Start an ACG challenge to create your first trading account. Your balance, objectives,
            risk limits and ACG Trader access will appear here after activation.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onStartChallenge}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[13px] font-semibold text-black transition-colors hover:bg-[#E8E8E8]"
          >
            Start a challenge
            <ArrowRight size={15} />
          </button>
          <button
            onClick={onStartChallenge}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#292929] bg-[#111111] px-5 text-[13px] font-medium text-[#D6D6D6] transition-colors hover:border-[#3A3A3A] hover:bg-[#151515]"
          >
            View challenge options
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-[#202020] md:grid-cols-3 md:divide-x md:divide-y-0">
        {journey.map((item) => (
          <div key={item.step} className="px-6 py-5 sm:px-8">
            <div className="mb-4 font-mono text-[11px] text-[#555555]">{item.step}</div>
            <h3 className="text-[14px] font-medium text-[#F1F1F1]">{item.title}</h3>
            <p className="mt-2 text-[12px] leading-5 text-[#777777]">{item.description}</p>
          </div>
        ))}
      </div>
    </section>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <section className="rounded-xl border border-[#222222] bg-[#090909] p-5 lg:col-span-2">
        <div className="flex items-center justify-between gap-4 border-b border-[#202020] pb-4">
          <div>
            <h2 className="text-[14px] font-medium text-white">Trading accounts</h2>
            <p className="mt-1 text-[12px] text-[#707070]">Your evaluation and funded accounts will appear here.</p>
          </div>
          <span className="rounded-md border border-[#252525] bg-[#101010] px-2 py-1 font-mono text-[11px] text-[#666666]">0 accounts</span>
        </div>

        <div className="flex min-h-[210px] flex-col items-center justify-center px-4 py-10 text-center">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#282828] bg-[#111111] text-[#8A8A8A]">
            <Wallet size={18} />
          </div>
          <h3 className="text-[14px] font-medium text-[#EDEDED]">No trading account yet</h3>
          <p className="mt-2 max-w-sm text-[12px] leading-5 text-[#6F6F6F]">
            Once a challenge is activated, this section becomes your account switcher and performance overview.
          </p>
          <button
            onClick={onStartChallenge}
            className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#D8D8D8] transition-colors hover:text-white"
          >
            Create your first account <ArrowRight size={13} />
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-[#222222] bg-[#090909] p-5">
        <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] bg-[#111111] text-[#B7B7B7]">
          <ShieldCheck size={17} />
        </div>
        <h2 className="text-[14px] font-medium text-white">What unlocks next</h2>
        <div className="mt-4 space-y-3">
          {['Live risk metrics', 'Trading objectives', 'ACG Trader access', 'Performance analytics'].map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-[12px] text-[#808080]">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-[#333333]">
                <Check size={9} />
              </div>
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

export default function NoChallengeDashboard({ onBack = () => {}, onStartChallenge = () => {} }) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const identity = useMemo(() => {
    const metadata = user?.user_metadata || {};
    const fullName = metadata.full_name || metadata.name || metadata.first_name || user?.email?.split('@')[0] || 'Trader';
    const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
    const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'TR';
    return { fullName, initials, email: user?.email || '' };
  }, [user]);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error?.message || error);
    }
  };

  const selectTab = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-black font-sans text-[#EDEDED] antialiased selection:bg-white/20">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#222222] bg-black px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((open) => !open)}
            className="p-1.5 text-[#888888] transition-colors hover:text-white md:hidden"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <img src={acg} alt="ACG Funded" className="h-5 w-auto object-contain" />
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full py-1 pl-2 pr-1.5 transition-colors hover:bg-[#111111]"
          >
            <span className="hidden max-w-[160px] truncate text-[13px] text-[#888888] sm:block">{identity.fullName}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
              {identity.initials}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-[#242424] bg-[#0A0A0A] shadow-2xl">
              <div className="border-b border-[#222222] px-4 py-3">
                <p className="truncate text-[13px] font-medium text-white">{identity.fullName}</p>
                {identity.email && <p className="mt-0.5 truncate text-[11px] text-[#666666]">{identity.email}</p>}
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onBack();
                  }}
                  className="flex w-full items-center rounded-md px-3 py-2 text-left text-[12px] text-[#888888] hover:bg-[#151515] hover:text-white"
                >
                  Homepage
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[12px] text-[#888888] hover:bg-[#151515] hover:text-white"
                >
                  <LogOut size={13} /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-56px)]">
        <aside
          className={`fixed inset-y-0 left-0 top-14 z-40 flex w-64 flex-col justify-between border-r border-[#222222] bg-black transition-transform duration-200 md:static md:top-0 md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4">
            <button
              onClick={onStartChallenge}
              className="mb-7 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-white text-[13px] font-semibold text-black transition-colors hover:bg-[#E8E8E8]"
            >
              <Plus size={14} /> New Challenge
            </button>

            <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#505050]">Workspace</p>
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => selectTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors ${
                      active ? 'bg-[#111111] text-white' : 'text-[#7D7D7D] hover:bg-[#0B0B0B] hover:text-[#D8D8D8]'
                    }`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-[#222222] p-4">
            <div className="flex items-center justify-between text-[11px] text-[#505050]">
              <span>ACG Funded</span>
              <ChevronDown size={13} />
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-14 z-30 bg-black/80 md:hidden"
          />
        )}

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1120px] px-5 py-8 sm:px-7 sm:py-10">
            <div className="mb-8 flex flex-col gap-4 border-b border-[#222222] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[#5F5F5F]">
                  <Zap size={12} /> ACG Funded workspace
                </div>
                <h1 className="text-[26px] font-medium tracking-[-0.03em] text-white sm:text-[30px]">
                  {activeTab === 'overview' ? `Welcome, ${identity.fullName}` : navItems.find((item) => item.id === activeTab)?.label}
                </h1>
                <p className="mt-2 text-[13px] text-[#777777]">
                  {activeTab === 'overview'
                    ? 'Manage your challenges, trading accounts and progression from one place.'
                    : 'This section becomes active as your ACG Funded account grows.'}
                </p>
              </div>
              <button
                onClick={onStartChallenge}
                className="inline-flex h-9 w-fit items-center gap-2 rounded-md border border-[#2A2A2A] bg-[#0D0D0D] px-4 text-[12px] font-medium text-[#D0D0D0] transition-colors hover:border-[#3B3B3B] hover:bg-[#141414]"
              >
                Start challenge <ArrowRight size={13} />
              </button>
            </div>

            {activeTab === 'overview' || activeTab === 'accounts' ? (
              <EmptyAccounts onStartChallenge={onStartChallenge} />
            ) : (
              <section className="rounded-xl border border-[#222222] bg-[#090909] px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#282828] bg-[#111111] text-[#777777]">
                  {activeTab === 'billing' ? <CreditCard size={17} /> : <User size={17} />}
                </div>
                <h2 className="text-[14px] font-medium text-white">
                  {activeTab === 'billing' ? 'No billing activity yet' : 'Profile workspace'}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[12px] leading-5 text-[#707070]">
                  {activeTab === 'billing'
                    ? 'Challenge purchases, invoices and payout activity will be available here.'
                    : 'Your authenticated ACG Funded account is active. Additional profile controls can be connected here.'}
                </p>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
