/**
 * Post-process assistant text before it reaches the Kawn UI.
 * Strips link syntax and raw URLs; preserves line breaks for structured Markdown.
 */

/** Markdown links: `[label](url)` — remove entirely (URLs stay out of chat). */
const MARKDOWN_LINK = /\[[^\]]*\]\([^)]*\)/g;

/** https / http URLs */
const HTTP_URL = /https?:\/\/[^\s<>\])'"]+/gi;

/** Bare www. fragments */
const WWW_URL = /\bwww\.[^\s<>\])'"]+/gi;

export function sanitizeKawnAiReplyForUser(text: string): string {
  let out = text.replace(MARKDOWN_LINK, "");
  out = out.replace(HTTP_URL, "");
  out = out.replace(WWW_URL, "");
  out = out.replace(/\butm_source=openai\b/gi, "");
  out = out.replace(/\(\s*\)/g, "");
  out = out.replace(/\[\s*\]/g, "");
  // Collapse horizontal whitespace per line only — keep \n for lists / sections.
  out = out
    .split("\n")
    .map((line) => line.replace(/[ \t]{2,}/g, " ").trimEnd())
    .join("\n");
  out = out.replace(/\s+([.,;:!?])/g, "$1");
  out = out.replace(/([.,;:])\s*([.,;:])/g, "$1");
  out = out.replace(/\n{5,}/g, "\n\n\n\n");
  out = out.replace(/^\s+$/gm, "");
  return out.trim();
}
