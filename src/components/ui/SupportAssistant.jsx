import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bot, ChevronDown, LifeBuoy, Send, UserRound, X } from "lucide-react";
import { useAuth } from "../../AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "";
const SESSION_KEY = "acg:supportSessionId";
const CONVERSATION_KEY = "acg:supportConversationId";

function supportSessionId() {
  if (typeof window === "undefined") return "";
  let value = window.localStorage.getItem(SESSION_KEY);
  if (!value) {
    value = globalThis.crypto?.randomUUID?.() || `support-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(SESSION_KEY, value);
  }
  return value;
}

const starters = [
  "Explain my challenge rules",
  "Check my payment status",
  "Help with ACG Trader",
  "I have a payout question",
];

export default function SupportAssistant() {
  const { user, getAccessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(() =>
    typeof window !== "undefined" ? window.localStorage.getItem(CONVERSATION_KEY) || "" : ""
  );
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi — I’m ACG Support. I can help with challenge rules, ACG Trader, payments, account access and general payout questions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("OPEN");
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const sessionId = useMemo(() => supportSessionId(), []);

  useEffect(() => {
    if (!open || !conversationId) return;
    let cancelled = false;

    (async () => {
      try {
        const token = await getAccessToken().catch(() => null);
        const response = await fetch(
          `${API_URL}/api/support/conversations/${encodeURIComponent(conversationId)}?sessionId=${encodeURIComponent(sessionId)}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "x-acg-support-session": sessionId,
            },
          },
        );
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload?.data?.messages?.length || cancelled) return;
        setMessages(payload.data.messages.filter(message => message.role !== "system"));
        setStatus(payload.data.status || "OPEN");
      } catch {
        // A previous anonymous conversation may no longer belong to the signed-in identity.
      }
    })();

    return (
    <>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close support messenger"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[98] bg-black/45 backdrop-blur-[1px] sm:hidden"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-label="ACG Support"
            className="
              fixed inset-0 z-[99] flex min-h-0 flex-col overflow-hidden bg-[#0b0b0c] text-white
              sm:inset-auto sm:bottom-[92px] sm:right-5 sm:h-[min(720px,calc(100vh-120px))] sm:w-[400px]
              sm:rounded-[20px] sm:border sm:border-white/[0.1] sm:shadow-[0_24px_80px_rgba(0,0,0,0.55)]
            "
          >
            <header className="shrink-0 border-b border-white/[0.08] bg-[#0b0b0c] px-4 pb-4 pt-[max(env(safe-area-inset-top),16px)] sm:px-5 sm:pb-4 sm:pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-black">
                    <Bot size={18} strokeWidth={1.9} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-[14px] font-semibold tracking-[-0.01em]">ACG Support</h2>
                      <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                    </div>
                    <p className="mt-1 truncate text-[11px] text-zinc-500">
                      {status === "ESCALATED"
                        ? "Human review requested"
                        : user
                          ? "Account-aware support"
                          : "Typically replies instantly"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close ACG Support"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>

              {status !== "ESCALATED" && (
                <p className="mt-4 max-w-[300px] text-[12px] leading-5 text-zinc-400">
                  Ask about your challenge, account, payment, payout eligibility or ACG Trader.
                </p>
              )}

              {status === "ESCALATED" && (
                <div className="mt-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.06] px-3 py-2.5 text-[11px] leading-5 text-amber-200">
                  Your conversation is queued for human review. You do not need to repeat the details already shared.
                </div>
              )}
            </header>

            <div
              ref={scrollRef}
              className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#0b0b0c] px-4 py-5 sm:px-5"
            >
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] whitespace-pre-wrap break-words px-3.5 py-2.5 text-[13px] leading-[1.55] ${
                      message.role === "user"
                        ? "rounded-[18px] rounded-br-[6px] bg-white text-black"
                        : "rounded-[18px] rounded-bl-[6px] bg-[#171719] text-zinc-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-[18px] rounded-bl-[6px] bg-[#171719] px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:240ms]" />
                  </div>
                </div>
              )}

              {messages.length <= 1 && (
                <div className="space-y-2 pt-2">
                  <p className="px-1 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-600">Common questions</p>
                  <div className="grid gap-2">
                    {starters.map(starter => (
                      <button
                        key={starter}
                        type="button"
                        onClick={() => sendMessage(starter)}
                        className="flex min-h-11 items-center justify-between rounded-xl border border-white/[0.08] bg-[#121214] px-3.5 text-left text-[12px] text-zinc-300 transition hover:border-white/[0.14] hover:bg-[#171719] hover:text-white"
                      >
                        <span>{starter}</span>
                        <span className="ml-3 text-zinc-600">›</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <footer className="shrink-0 border-t border-white/[0.08] bg-[#0b0b0c] px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 sm:px-4 sm:pb-4">
              {error && (
                <div className="mb-2 rounded-lg border border-red-400/15 bg-red-400/[0.05] px-3 py-2 text-[10px] leading-4 text-red-300">
                  {error}
                </div>
              )}

              <div className="flex items-end gap-2 rounded-2xl border border-white/[0.1] bg-[#151517] p-2 shadow-inner">
                <textarea
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  rows={1}
                  maxLength={3000}
                  placeholder="Message ACG Support"
                  className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2.5 text-[13px] leading-5 text-white outline-none placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-black transition hover:bg-zinc-200 disabled:cursor-default disabled:bg-white/10 disabled:text-zinc-600"
                >
                  <Send size={15} />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 px-1">
                <button
                  type="button"
                  onClick={requestHuman}
                  disabled={sending || status === "ESCALATED"}
                  className="inline-flex items-center gap-1.5 text-[10px] text-zinc-500 transition hover:text-zinc-300 disabled:cursor-default disabled:text-zinc-700"
                >
                  <UserRound size={11} />
                  {status === "ESCALATED" ? "Human review requested" : "Talk to a person"}
                </button>
                <span className="text-right text-[9px] text-zinc-700">Never share passwords or private keys</span>
              </div>
            </footer>
          </section>
        </>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open ACG Support"
          className="
            fixed bottom-[calc(max(env(safe-area-inset-bottom),8px)+4.25rem)] right-4 z-[97]
            grid h-14 w-14 place-items-center rounded-full bg-white text-black
            shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition hover:scale-[1.03] hover:bg-zinc-200 active:scale-95
            sm:bottom-5 sm:right-5
          "
        >
          <LifeBuoy size={21} strokeWidth={2} />
        </button>
      )}
    </>
  );
}
