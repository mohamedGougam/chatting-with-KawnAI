/**
 * Post-process assistant text before it reaches the Kawn UI.
 * Strips link syntax and raw URLs; preserves line breaks for structured Markdown.
 */

import {
  KAWN_ASSISTANT_INTRO_EN,
  KAWN_DUPLICATE_REPLY_FALLBACK,
  KAWN_WELCOME_MESSAGE,
} from "./kawnAiBranding";

/** Markdown links: `[label](url)` — remove entirely (URLs stay out of chat). */
const MARKDOWN_LINK = /\[[^\]]*\]\([^)]*\)/g;

/** https / http URLs */
const HTTP_URL = /https?:\/\/[^\s<>\])'"]+/gi;

/** Bare www. fragments */
const WWW_URL = /\bwww\.[^\s<>\])'"]+/gi;

const WELCOME_PATTERNS = [
  KAWN_WELCOME_MESSAGE,
  "Thanks for chatting with KawnAI",
  "Tell me what you would like to know",
  "Hi — I'm KawnAI",
  "Hey! I'm KawnAI",
  "Hey! I’m KawnAI",
  "your go-to for pretty much anything",
  "What's on your mind today",
  "What’s on your mind today",
  KAWN_ASSISTANT_INTRO_EN,
];

export type SanitizeKawnAiReplyOptions = {
  /** Last assistant message in the thread (for consecutive dedup). */
  previousAssistantReply?: string;
  /** True when the conversation already has prior turns. */
  hasConversationHistory?: boolean;
};

function normalizeForCompare(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .trim();
}

function splitSentences(text: string): string[] {
  const parts = text
    .split(/(?<=[.!?…])\s+|\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text.trim()];
}

function removeDuplicateSentences(text: string): string {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const sentence of splitSentences(text)) {
    const key = normalizeForCompare(sentence);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(sentence);
  }

  return unique.join(" ").trim();
}

function stripRepeatedWelcomePhrases(text: string): string {
  let out = text;
  for (const phrase of WELCOME_PATTERNS) {
    if (!phrase) continue;
    out = out.split(phrase).join(" ");
  }
  out = out.replace(/✨\s*👾?/g, "");
  out = out.replace(/\*\*Hi — I'm KawnAI\.\*\*/gi, "");
  return out.replace(/\s{2,}/g, " ").trim();
}

function preventIdenticalConsecutiveReply(
  text: string,
  previousAssistantReply?: string,
): string {
  if (!previousAssistantReply?.trim()) return text;

  const current = normalizeForCompare(text);
  const previous = normalizeForCompare(previousAssistantReply);
  if (!current || current !== previous) return text;

  const withoutWelcome = stripRepeatedWelcomePhrases(text);
  if (normalizeForCompare(withoutWelcome) && withoutWelcome !== text) {
    return withoutWelcome;
  }

  return KAWN_DUPLICATE_REPLY_FALLBACK;
}

export function sanitizeKawnAiReplyForUser(
  text: string,
  options: SanitizeKawnAiReplyOptions = {},
): string {
  let out = text.replace(MARKDOWN_LINK, "");
  out = out.replace(HTTP_URL, "");
  out = out.replace(WWW_URL, "");
  out = out.replace(/\butm_source=openai\b/gi, "");
  out = out.replace(/\(\s*\)/g, "");
  out = out.replace(/\[\s*\]/g, "");

  if (options.hasConversationHistory) {
    out = stripRepeatedWelcomePhrases(out);
  }

  out = removeDuplicateSentences(out);

  out = out
    .split("\n")
    .map((line) => line.replace(/[ \t]{2,}/g, " ").trimEnd())
    .join("\n");
  out = out.replace(/\s+([.,;:!?])/g, "$1");
  out = out.replace(/([.,;:])\s*([.,;:])/g, "$1");
  out = out.replace(/\n{5,}/g, "\n\n\n\n");
  out = out.replace(/^\s+$/gm, "");
  out = out.trim();

  out = preventIdenticalConsecutiveReply(out, options.previousAssistantReply);

  return out.trim();
}
