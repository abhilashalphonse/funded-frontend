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

    return () => { cancelled = true; };
  }, [conversationId, getAccessToken, open, sessionId, user?.id]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, [messages, open, sending]);

  async function sendMessage(prefill) {
    const text = String(prefill ?? input).trim();
    if (!text || sending) return;

    setInput("");
    setError("");
    setMessages(current => [...current, { role: "user", content: text }]);
    setSending(true);

    try {
      const token = await getAccessToken().catch(() => null);
      const response = await fetch(`${API_URL}/api/support/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "x-acg-support-session": sessionId,
        },
        body: JSON.stringify({
          sessionId,
          conversationId: conversationId || undefined,
          message: text,
          pageContext: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.data?.answer) {
        throw new Error(payload?.message || "Support is temporarily unavailable.");
      }

      const nextConversationId = payload.data.conversationId;
      if (nextConversationId && nextConversationId !== conversationId) {
        setConversationId(nextConversationId);
        window.localStorage.setItem(CONVERSATION_KEY, nextConversationId);
      }
      setStatus(payload.data.status || "OPEN");
      setMessages(current => [...current, { role: "assistant", content: payload.data.answer }]);
    } catch (requestError) {
      setError(requestError?.message || "Support is temporarily unavailable.");
      setMessages(current => [
        ...current,
        {
          role: "assistant",
          content: "I couldn’t send that message. You can retry, or email support@acgforex.com if the issue is urgent.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  async function requestHuman() {
    if (!conversationId || sending) {
      setMessages(current => [
        ...current,
        { role: "assistant", content: "Send me a short description first and I’ll attach it to the support handoff." },
      ]);
      return;
    }

    setSending(true);
    setError("");
    try {
      const token = await getAccessToken().catch(() => null);
      const response = await fetch(
        `${API_URL}/api/support/conversations/${encodeURIComponent(conversationId)}/escalate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "x-acg-support-session": sessionId,
          },
          body: JSON.stringify({ sessionId, reason: "CUSTOMER_REQUESTED" }),
        },
      );
      if (!response.ok) throw new Error("Unable to request human support.");
      setStatus("ESCALATED");
      setMessages(current => [
        ...current,
        {
          role: "assistant",
          content: "This conversation is now flagged for human review. You won’t need to repeat the details already in this chat.",
        },
      ]);
    } catch (requestError) {
      setError(requestError?.message || "Unable to request human support.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-[calc(max(env(safe-area-inset-bottom),8px)+4.5rem)] right-4 z-[90] sm:bottom-5 sm:right-5">
      {open && (
        <div className="mb-3 flex h-[min(72vh,620px)] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#080808] text-white shadow-2xl shadow-black/60">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                <Bot size={17} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold">ACG Support</p>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="mt-0.5 text-[10px] text-zinc-500">
                  {status === "ESCALATED" ? "Human review requested" : user ? "Account-aware support" : "Instant support"}
                </p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 hover:bg-white/[0.05] hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-5 ${
                  message.role === "user"
                    ? "rounded-br-md bg-white text-black"
                    : "rounded-bl-md border border-white/[0.07] bg-white/[0.035] text-zinc-300"
                }`}>
                  {message.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.035] px-3.5 py-2.5 text-[11px] text-zinc-500">
                  Checking…
                </div>
              </div>
            )}

            {messages.length <= 1 && (
              <div className="grid gap-2 pt-1">
                {starters.map(starter => (
                  <button key={starter} type="button" onClick={() => sendMessage(starter)} className="rounded-xl border border-white/[0.07] bg-black px-3.5 py-2.5 text-left text-[11px] text-zinc-400 hover:border-white/[0.13] hover:text-white">
                    {starter}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/[0.08] p-3">
            {error && <p className="mb-2 px-1 text-[10px] text-red-400">{error}</p>}
            <div className="flex items-end gap-2 rounded-xl border border-white/[0.09] bg-black p-2">
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
                placeholder="Ask ACG Support…"
                className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-[12px] text-white outline-none placeholder:text-zinc-700"
              />
              <button type="button" onClick={() => sendMessage()} disabled={!input.trim() || sending} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-black disabled:opacity-30">
                <Send size={14} />
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between px-1">
              <button type="button" onClick={requestHuman} disabled={sending || status === "ESCALATED"} className="flex items-center gap-1.5 text-[10px] text-zinc-600 hover:text-zinc-300 disabled:cursor-default disabled:text-zinc-700">
                <UserRound size={11} />
                {status === "ESCALATED" ? "Human review requested" : "Request human support"}
              </button>
              <p className="text-[9px] text-zinc-700">Never share passwords or private keys</p>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-label={open ? "Close ACG Support" : "Open ACG Support"}
        className="ml-auto flex h-12 items-center gap-2.5 rounded-full border border-white/[0.1] bg-white px-4 text-[12px] font-semibold text-black shadow-xl shadow-black/30 transition hover:bg-zinc-200"
      >
        {open ? <ChevronDown size={16} /> : <LifeBuoy size={16} />}
        <span>{open ? "Close" : "Support"}</span>
      </button>
    </div>
  );
}
