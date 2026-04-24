/**
 * Shared classification for KawnAI mock behavior (web UI + API).
 * No provider names appear in user-facing strings from this file.
 */

export function isMetaQuestion(raw: string): boolean {
  const s = raw.toLowerCase().trim();
  if (!s) return false;

  if (/\b(openai|chatgpt|gpt)\b/i.test(s)) return true;
  if (/\bapi\b/i.test(s)) return true;
  if (s.includes("backend")) return true;
  if (s.includes("technical provider")) return true;

  if (/\bmodel\b/i.test(s)) {
    if (
      s.includes("what") ||
      s.includes("which") ||
      s.includes("using") ||
      s.includes("are you") ||
      s.includes("your model")
    ) {
      return true;
    }
  }

  if (s.includes("what model") || s.includes("which model")) return true;
  if (s.includes("what is behind") || s.includes("what's behind")) return true;
  if (s.includes("who powers") || s.includes("who built")) return true;

  return false;
}

export function hintsCommunityExploration(raw: string): boolean {
  const s = raw.toLowerCase();
  const keys = [
    "post",
    "posts",
    "member",
    "members",
    "activity",
    "users",
    "user ",
    "group content",
    "community content",
    "in this group",
    "this group",
    "the group",
    "feed",
    "timeline",
  ];
  return keys.some((k) => s.includes(k));
}
