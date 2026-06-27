import { NextResponse } from "next/server";

import {
  KAWN_AI_BACKEND_TIMEOUT_MS,
  KAWN_AI_MAX_HISTORY_MESSAGES,
  KAWN_AI_MAX_OUTPUT_TOKENS,
} from "@/lib/kawnAiChatConfig";
import { KAWN_WELCOME_MESSAGE } from "@/lib/kawnAiBranding";
import { kawnAiSystemPrompt } from "@/lib/kawnAiSystemPrompt";
import {
  buildMockKawnAiReply,
  type KawnAiChatRequest,
  type KawnAiHistoryMessage,
} from "@/lib/mockKawnAiReply";
import { getOpenAIClient } from "@/lib/openaiClient";
import { sanitizeKawnAiReplyForUser } from "@/lib/sanitizeKawnAiReply";

function isWelcomeMessage(content: string): boolean {
  const trimmed = content.trim();
  if (!trimmed) return true;
  if (trimmed === KAWN_WELCOME_MESSAGE) return true;
  return /thanks for chatting with kawnai/i.test(trimmed);
}

function parseHistory(raw: unknown): KawnAiHistoryMessage[] {
  if (!Array.isArray(raw)) return [];

  const parsed: KawnAiHistoryMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const entry = item as Record<string, unknown>;
    const role = entry.role;
    const content = entry.content;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string" || !content.trim()) continue;
    if (role === "assistant" && isWelcomeMessage(content)) continue;
    parsed.push({ role, content: content.trim() });
  }

  return parsed.slice(-KAWN_AI_MAX_HISTORY_MESSAGES);
}

function lastAssistantReply(history: KawnAiHistoryMessage[]): string | undefined {
  for (let i = history.length - 1; i >= 0; i -= 1) {
    if (history[i]?.role === "assistant") return history[i].content;
  }
  return undefined;
}

function polishReply(
  rawReply: string,
  history: KawnAiHistoryMessage[],
): string {
  return sanitizeKawnAiReplyForUser(rawReply, {
    previousAssistantReply: lastAssistantReply(history),
    hasConversationHistory: history.length > 0,
  });
}

function buildUserContent(message: string, userLanguage?: string): string {
  if (!userLanguage || userLanguage === "auto") return message;
  return `${message}\n\n(Reply in the user's language: ${userLanguage})`;
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("KAWNAI_TIMEOUT")), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * KawnAI chat — web + Flutter/mobile clients should call:
 *
 * `POST /api/kawn-ai/chat`
 *
 * Request body: `groupId`, `groupName`, `message` (required), optional `userId`,
 * `userLanguage`, `history` (recent `{ role, content }[]`, last 8 turns).
 * Response: `{ "reply": string, "source": "kawnai" | "mock" }`
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected JSON object" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const message = typeof b.message === "string" ? b.message : "";
  const groupId = typeof b.groupId === "string" ? b.groupId : "";
  const groupName = typeof b.groupName === "string" ? b.groupName : "";

  if (!message.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  if (!groupId.trim() || !groupName.trim()) {
    return NextResponse.json(
      { error: "groupId and groupName are required" },
      { status: 400 },
    );
  }

  const history = parseHistory(b.history);

  const payload: KawnAiChatRequest = {
    groupId,
    groupName,
    userId: typeof b.userId === "string" ? b.userId : undefined,
    userLanguage: typeof b.userLanguage === "string" ? b.userLanguage : undefined,
    message,
    history,
    metaInquiriesSoFar:
      typeof b.metaInquiriesSoFar === "number" && Number.isFinite(b.metaInquiriesSoFar)
        ? Math.max(0, Math.floor(b.metaInquiriesSoFar))
        : undefined,
  };

  const userContent = buildUserContent(message, payload.userLanguage);

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    const reply = polishReply(buildMockKawnAiReply(payload), history);
    return NextResponse.json({ reply, source: "mock" as const });
  }

  try {
    const openai = getOpenAIClient();
    const model = process.env.KAWNAI_MODEL?.trim() || "gpt-4o";
    const webSearchEnabled = process.env.KAWNAI_WEB_SEARCH === "1";

    const input: Array<{ role: "user" | "assistant"; content: string }> = [
      ...history,
      { role: "user", content: userContent },
    ];

    const baseParams = {
      model,
      instructions: kawnAiSystemPrompt,
      input,
      max_output_tokens: KAWN_AI_MAX_OUTPUT_TOKENS,
    };

    const response = await withTimeout(
      openai.responses.create({
        ...baseParams,
        ...(webSearchEnabled
          ? { tools: [{ type: "web_search" as const }] }
          : {}),
      }),
      KAWN_AI_BACKEND_TIMEOUT_MS,
    );

    const replyText = (response.output_text ?? "").trim();
    const rawReply =
      replyText.length > 0 ? replyText : buildMockKawnAiReply(payload);
    const reply = polishReply(rawReply, history);

    return NextResponse.json({
      reply,
      source: replyText.length > 0 ? ("kawnai" as const) : ("mock" as const),
    });
  } catch (err) {
    console.error("[kawn-ai/chat] OpenAI request failed:", err);
    const reply = polishReply(buildMockKawnAiReply(payload), history);
    return NextResponse.json({ reply, source: "mock" as const });
  }
}
