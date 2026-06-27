"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChatMessageBody } from "@/components/ChatMessageBody";
import { KawnLogo } from "@/components/KawnLogo";
import { KAWN_WELCOME_MESSAGE } from "@/lib/kawnAiBranding";
import {
  KAWN_AI_CLIENT_TIMEOUT_MS,
  KAWN_AI_MAX_HISTORY_MESSAGES,
} from "@/lib/kawnAiChatConfig";

type Role = "user" | "assistant";

export type ChatLine = {
  id: string;
  role: Role;
  text: string;
};

const WELCOME = KAWN_WELCOME_MESSAGE;

const TIMEOUT_MESSAGE =
  "KawnAI is taking a little longer than usual. Please try again.";

const OFFLINE_MESSAGE =
  "Sorry — I couldn't reach KawnAI right now. Please try again.";

/** Default context for the API when no community picker is shown (generic; clients may override). */
const DEFAULT_GROUP_ID = "general";
const DEFAULT_GROUP_NAME = "General";

function isWelcomeLine(line: ChatLine): boolean {
  return line.id === "welcome" || line.text.trim() === KAWN_WELCOME_MESSAGE;
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="inline-block h-1.5 w-1.5 rounded-full bg-[#ff7a18] opacity-70"
          style={{
            animation: "kawnai-dot 1s ease-in-out infinite",
            animationDelay: `${delay}ms`,
          }}
        />
      ))}
    </span>
  );
}

export function ChatWithKawnAI() {
  const [groupId] = useState<string>(DEFAULT_GROUP_ID);
  const [groupName] = useState<string>(DEFAULT_GROUP_NAME);
  const [lines, setLines] = useState<ChatLine[]>([
    { id: "welcome", role: "assistant", text: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const linesRef = useRef(lines);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, loading, scrollToBottom]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || sendingRef.current) return;

    sendingRef.current = true;
    setInput("");
    setLoading(true);

    const userLine: ChatLine = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    setLines((prev) => [...prev, userLine]);

    const history = linesRef.current
      .filter((line) => !isWelcomeLine(line))
      .slice(-KAWN_AI_MAX_HISTORY_MESSAGES)
      .map((line) => ({
        role: line.role,
        content: line.text,
      }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), KAWN_AI_CLIENT_TIMEOUT_MS);

    try {
      const res = await fetch("/api/kawn-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          groupId,
          groupName,
          userId: "demo-user",
          userLanguage: "auto",
          message: text,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error("request_failed");
      }

      const data = (await res.json()) as { reply?: string };
      const reply =
        data.reply?.trim() || "Something went wrong. Please try again.";

      setLines((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: reply },
      ]);
    } catch (err) {
      const isTimeout =
        err instanceof DOMException && err.name === "AbortError";
      setLines((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: isTimeout ? TIMEOUT_MESSAGE : OFFLINE_MESSAGE,
        },
      ]);
    } finally {
      clearTimeout(timeoutId);
      sendingRef.current = false;
      setLoading(false);
    }
  }, [groupId, groupName, input, loading]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[#0b0b0c] text-zinc-100">
      <header
        className="shrink-0 border-b border-zinc-800/80 bg-[#0b0b0c]/95 px-4 py-5 backdrop-blur-md sm:px-5"
        dir="ltr"
      >
        <div className="flex flex-col gap-3 sm:gap-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff7a18] sm:text-sm">
            Ask anything
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
                News, facts, ideas, and everyday questions
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
            aria-live="polite"
            aria-busy="true"
          >
            <div
              className="flex max-w-[min(100%,26rem)] items-center gap-3 rounded-2xl border border-zinc-700/80 bg-zinc-900/90 px-4 py-3.5 text-base text-zinc-400 sm:px-5"
              dir="ltr"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#ff7a18]/15">
                <ThinkingDots />
              </span>
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
