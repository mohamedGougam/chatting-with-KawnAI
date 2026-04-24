"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Sparkles, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChatMessageBody } from "@/components/ChatMessageBody";
import { KawnLogo } from "@/components/KawnLogo";

type Role = "user" | "assistant";

export type ChatLine = {
  id: string;
  role: Role;
  text: string;
};

const WELCOME = `✨ **Hi — I'm KawnAI.**

Thanks for chatting with KawnAI. Tell me what you would like to know, and I'll check it for you.

⚽ Ask about fixtures, this group, or anything you're curious about.`;

/** Default context for the API when no community picker is shown. */
const DEFAULT_GROUP_ID = "world-cup-2026";
const DEFAULT_GROUP_NAME = "FIFA World Cup 2026";

export function ChatWithKawnAI() {
  const [groupId] = useState<string>(DEFAULT_GROUP_ID);
  const [groupName] = useState<string>(DEFAULT_GROUP_NAME);
  const [lines, setLines] = useState<ChatLine[]>([
    { id: "welcome", role: "assistant", text: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, loading, scrollToBottom]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userLine: ChatLine = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    setLines((prev) => [...prev, userLine]);
    setLoading(true);

    try {
      /** Calls `POST /api/kawn-ai/chat` — same endpoint the Flutter app should use. */
      const res = await fetch("/api/kawn-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          groupName,
          userId: "demo-user",
          userLanguage: "auto",
          message: text,
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = (await res.json()) as { reply?: string };
      const reply = data.reply?.trim() || "Something went wrong. Please try again.";

      setLines((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: reply },
      ]);
    } catch {
      setLines((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Sorry — I couldn't reach KawnAI right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[#0b0b0c] text-zinc-100">
      <header
        className="shrink-0 border-b border-zinc-800/80 bg-[#0b0b0c]/95 px-4 py-5 backdrop-blur-md sm:px-5"
        dir="ltr"
      >
        <div className="flex flex-col gap-3 sm:gap-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff7a18] sm:text-sm">
            Kawn community
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <KawnLogo
              width={44}
              height={44}
              className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Chat with KawnAI
              </h1>
              <p className="mt-1.5 text-base leading-snug text-zinc-400 sm:mt-2 sm:text-lg">
                Ask anything you want to know
              </p>
            </div>
          </div>
        </div>
      </header>

      <div
        ref={listRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5"
      >
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className={`flex ${line.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[min(100%,26rem)] rounded-2xl border px-4 py-3.5 shadow-lg sm:max-w-[min(100%,28rem)] sm:px-5 sm:py-4 ${
                  line.role === "user"
                    ? "rounded-br-md border-[#ff7a18]/35 bg-[#ff7a18] text-black"
                    : "rounded-bl-md border-zinc-700/80 bg-zinc-900/90 text-zinc-100"
                }`}
              >
                {line.role === "assistant" ? (
                  <>
                    <div
                      className="mb-3 flex items-center gap-2.5 border-b border-zinc-700/60 pb-2.5"
                      dir="ltr"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ff7a18]/15 text-[#ff7a18]">
                        <Sparkles className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
                      </span>
                      <span className="text-sm font-bold uppercase tracking-[0.14em] text-[#ff9f5a]">
                        KawnAI
                      </span>
                    </div>
                    <ChatMessageBody
                      content={line.text}
                      variant="assistant"
                    />
                  </>
                ) : (
                  <>
                    <div
                      className="mb-2 flex items-center justify-end gap-2 opacity-85"
                      dir="ltr"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">
                        You
                      </span>
                      <User className="h-4 w-4" aria-hidden />
                    </div>
                    <ChatMessageBody content={line.text} variant="user" />
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div
              className="flex max-w-[min(100%,26rem)] items-center gap-3 rounded-2xl border border-zinc-700/80 bg-zinc-900/90 px-4 py-3.5 text-base text-zinc-400 sm:px-5"
              dir="ltr"
            >
              <MessageCircle
                className="h-5 w-5 shrink-0 text-[#ff7a18]"
                aria-hidden
              />
              <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-[#ff7a18] border-t-transparent" />
              <span>KawnAI is thinking…</span>
            </div>
          </motion.div>
        ) : null}
      </div>

      <div
        className="shrink-0 border-t border-zinc-800 bg-[#151517] px-4 py-4 sm:px-5"
        dir="ltr"
      >
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Message KawnAI…"
            rows={1}
            dir="auto"
            className="min-h-[52px] flex-1 resize-none rounded-2xl border border-zinc-700 bg-zinc-900/80 px-4 py-3.5 text-[17px] leading-snug text-zinc-100 placeholder:text-zinc-500 focus:border-[#ff7a18]/60 focus:outline-none focus:ring-2 focus:ring-[#ff7a18]/25 sm:text-lg"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            className="h-[52px] shrink-0 self-end rounded-2xl bg-[#ff7a18] px-6 text-base font-bold text-black shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:h-[52px] sm:text-lg"
          >
            Send
          </button>
        </div>
      </div>

      <footer
        className="shrink-0 border-t border-zinc-800/90 bg-[#0b0b0c] px-4 py-3 sm:px-5"
        dir="ltr"
      >
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <KawnLogo
            width={36}
            height={36}
            decorative
            className="h-9 w-9 object-contain opacity-95"
          />
          <p className="text-center text-sm font-medium tracking-wide text-zinc-500">
            Kawn Technologies
          </p>
        </div>
      </footer>
    </div>
  );
}
