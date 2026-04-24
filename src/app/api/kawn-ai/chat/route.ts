import { NextResponse } from "next/server";

import { kawnAiSystemPrompt } from "@/lib/kawnAiSystemPrompt";
import {
  buildMockKawnAiReply,
  type KawnAiChatRequest,
} from "@/lib/mockKawnAiReply";
import { getOpenAIClient } from "@/lib/openaiClient";
import { sanitizeKawnAiReplyForUser } from "@/lib/sanitizeKawnAiReply";

/**
 * KawnAI chat — web + Flutter/mobile clients should call:
 *
 * `POST /api/kawn-ai/chat`
 *
 * Request body: `groupId`, `groupName`, `message` (required), optional `userId`, `userLanguage`.
 * Response: `{ "reply": string, "source": "kawnai" | "mock" }`
 *
 * // Future: add Azure Blob Storage community knowledge retrieval here.
 * // Future: inject community-specific knowledge before calling the KawnAI model service.
 *
 * Uses OpenAI Responses API with optional built-in `web_search` (see `KAWNAI_WEB_SEARCH`)
 * so schedule/group answers can follow current official sources, not only model training data.
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

  const payload: KawnAiChatRequest = {
    groupId,
    groupName,
    userId: typeof b.userId === "string" ? b.userId : undefined,
    userLanguage: typeof b.userLanguage === "string" ? b.userLanguage : undefined,
    message,
    metaInquiriesSoFar:
      typeof b.metaInquiriesSoFar === "number" && Number.isFinite(b.metaInquiriesSoFar)
        ? Math.max(0, Math.floor(b.metaInquiriesSoFar))
        : undefined,
  };

  const userLanguage = payload.userLanguage;
  const userId = payload.userId;

  const userContent = `
Community Group:
${groupName}

Group ID:
${groupId}

User ID:
${userId ?? "(not provided)"}

User language:
${userLanguage ?? "auto"}

User message:
${message}
`.trim();

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    const reply = sanitizeKawnAiReplyForUser(buildMockKawnAiReply(payload));
    return NextResponse.json({ reply, source: "mock" as const });
  }

  try {
    const openai = getOpenAIClient();
    const model = process.env.KAWNAI_MODEL?.trim() || "gpt-4.1-mini";
    // Web search lets the model pull current FIFA / fixture facts instead of stale training data only.
    const webSearchEnabled = process.env.KAWNAI_WEB_SEARCH !== "0";

    const baseParams = {
      model,
      instructions: kawnAiSystemPrompt,
      input: [
        {
          role: "user" as const,
          content: userContent,
        },
      ],
    };

    let response;
    try {
      response = await openai.responses.create({
        ...baseParams,
        ...(webSearchEnabled
          ? { tools: [{ type: "web_search" as const }] }
          : {}),
      });
    } catch (firstErr) {
      if (!webSearchEnabled) throw firstErr;
      console.warn(
        "[kawn-ai/chat] OpenAI request with web_search failed; retrying without tools:",
        firstErr,
      );
      response = await openai.responses.create(baseParams);
    }

    const replyText = (response.output_text ?? "").trim();
    const rawReply =
      replyText.length > 0 ? replyText : buildMockKawnAiReply(payload);
    const reply = sanitizeKawnAiReplyForUser(rawReply);

    return NextResponse.json({
      reply,
      source: replyText.length > 0 ? ("kawnai" as const) : ("mock" as const),
    });
  } catch (err) {
    console.error("[kawn-ai/chat] OpenAI request failed:", err);
    const reply = sanitizeKawnAiReplyForUser(buildMockKawnAiReply(payload));
    return NextResponse.json({ reply, source: "mock" as const });
  }
}
