import React from 'react';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Target,
  Monitor,
  CreditCard,
  UserRound,
  LifeBuoy,
  CheckCircle2,
} from 'lucide-react';

const supportAreas = [
  {
    icon: Target,
    title: 'Challenge & Rules',
    description: 'Profit targets, drawdown limits, phases and evaluation questions.',
  },
  {
    icon: Monitor,
    title: 'ACG Trader',
    description: 'Platform access, account activation and trading-account support.',
  },
  {
    icon: CreditCard,
    title: 'Payments & Payouts',
    description: 'Challenge payments, payment status and payout-related questions.',
  },
  {
    icon: UserRound,
    title: 'Account Support',
    description: 'Sign-in, account access, profile and challenge ownership questions.',
  },
];

const journeySupport = [
  'Before you buy',
  'During your evaluation',
  'After you pass',
  'When you request a payout',
];

export default function Support() {
  return (
    <section
      id="support"
      className="relative overflow-hidden bg-black px-4 py-20 font-sans text-white selection:bg-white/20 selection:text-white sm:px-6 md:py-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.045),transparent_68%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-10 max-w-2xl sm:mb-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11px] font-medium tracking-wide text-zinc-400">
            <LifeBuoy className="h-3.5 w-3.5" strokeWidth={1.6} />
            TRADER SUPPORT
          </div>

          <h2 className="text-4xl font-medium tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
            Support for every stage
            <span className="text-zinc-600"> of your challenge.</span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
            Clear help for challenge rules, account access, ACG Trader, payments and payouts.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050505]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-white/[0.08] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="flex h-full flex-col justify-between gap-10">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11px] text-zinc-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    ACG Funded Support
                  </div>

                  <h3 className="mt-7 text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
                    Need help with your account?
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 sm:text-[15px]">
                    Send us the email on your ACG account and, if applicable, your challenge or account ID so we can resolve your request faster.
                  </p>

                  <a
                    href="mailto:support@acgfunded.com"
                    className="group mt-7 flex min-h-12 w-full items-center justify-between rounded-xl border border-white/[0.1] bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 sm:w-fit sm:min-w-[240px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4" strokeWidth={1.8} />
                      Email Support
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.8} />
                  </a>
                </div>

                <div className="border-t border-white/[0.07] pt-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" strokeWidth={1.6} />
                    <div>
                      <p className="text-xs font-medium text-zinc-300">Account-specific support</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                        Never send passwords, recovery codes or private keys by email.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">Support email</p>
                    <a
                      href="mailto:support@acgfunded.com"
                      className="mt-1.5 inline-block text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                      support@acgfunded.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] pb-5">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">How we can help</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                    Support without the noise.
                  </h3>
                </div>
                <LifeBuoy className="hidden h-5 w-5 text-zinc-700 sm:block" strokeWidth={1.5} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {supportAreas.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.018] p-5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.03]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-zinc-400">
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </div>
                    <h4 className="mt-4 text-sm font-semibold text-white">{title}</h4>
                    <p className="mt-2 text-xs leading-5 text-zinc-500">{description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-white/[0.07] bg-black p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">Trader journey</p>
                    <p className="mt-1.5 text-sm font-medium text-zinc-300">Support stays with you from evaluation to payout.</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {journeySupport.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-xs text-zinc-500">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-zinc-400" strokeWidth={1.6} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
