import React from "react";
import { ArrowDown, ArrowRight, Check, Target, Trophy } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Target,
    title: "Choose your evaluation",
    description: "Select your account size and choose a 1-Step or 2-Step evaluation.",
  },
  {
    number: "02",
    icon: Check,
    title: "Prove your skills",
    description: "Trade on ACG Trader, reach the objectives and stay within the risk rules.",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Get rewarded",
    description: "Complete the evaluation, progress to a Master Account and become eligible for performance rewards.",
  },
];

const highlights = [
  "Up to $200K",
  "Up to 90% reward",
  "1-Step or 2-Step",
  "Free Trial",
];

export default function TrustSection() {
  return (
    <section className="w-full bg-black px-5 py-24 font-sans text-white sm:px-6 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            How it works
          </p>
          <h2 className="mt-4 text-[2.15rem] font-medium leading-[1.03] tracking-[-0.045em] text-zinc-100 sm:text-5xl">
            Your path to a Master Account.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-zinc-400 sm:text-base">
            A straightforward evaluation process built around clear objectives and risk rules.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] lg:mt-14">
          <div className="grid gap-px lg:grid-cols-3">
            {steps.map(({ number, icon: Icon, title, description }, index) => (
              <div
                key={number}
                className="relative bg-black px-5 py-6 sm:px-7 sm:py-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-600">{number}</span>
                  <span className="grid size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.025] text-zinc-500">
                    <Icon size={16} strokeWidth={1.7} />
                  </span>
                </div>

                <h3 className="mt-8 text-[20px] font-semibold tracking-[-0.03em] text-white sm:text-[22px]">
                  {title}
                </h3>
                <p className="mt-3 max-w-sm text-[13px] leading-6 text-zinc-500 sm:text-[14px]">
                  {description}
                </p>

                {index < steps.length - 1 && (
                  <>
                    <ArrowDown
                      size={17}
                      strokeWidth={1.6}
                      className="mx-auto mt-7 text-zinc-700 lg:hidden"
                    />
                    <ArrowRight
                      size={17}
                      strokeWidth={1.6}
                      className="absolute right-[-9px] top-1/2 z-10 hidden -translate-y-1/2 text-zinc-700 lg:block"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.06] sm:grid-cols-4">
          {highlights.map((item) => (
            <div key={item} className="bg-black px-4 py-4 text-center">
              <span className="text-[11px] font-medium text-zinc-400 sm:text-[12px]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
