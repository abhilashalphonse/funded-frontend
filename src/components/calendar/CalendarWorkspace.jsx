import React, { useState } from "react";
import { BarChart3, CalendarDays } from "lucide-react";
import NewsCalendar from "./NewsCalendar.jsx";
import TradingCalendar from "./TradingCalendar.jsx";

export default function CalendarWorkspace({ account }) {
  const [mode, setMode] = useState("trading");

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="inline-flex w-full rounded-lg border border-white/[0.08] bg-[#080808] p-1 sm:w-auto">
        {[
          ["trading", "Trading", BarChart3],
          ["economic", "Economic", CalendarDays],
        ].map(([id, label, Icon]) => {
          const active = mode === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`flex min-h-9 flex-1 items-center justify-center gap-2 rounded-md px-4 text-[10px] font-medium transition sm:flex-none ${
                active ? "bg-white text-black" : "text-[#777] hover:text-white"
              }`}
              aria-pressed={active}
            >
              <Icon size={13} />
              {label}
            </button>
          );
        })}
      </div>

      {mode === "trading"
        ? <TradingCalendar account={account} />
        : <NewsCalendar account={account} />}
    </div>
  );
}
