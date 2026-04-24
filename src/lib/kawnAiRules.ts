/**
 * Shared classification for KawnAI mock behavior (web UI + API).
 * No provider names appear in user-facing strings from this file.
 */

const HAS_KAWN = /\bkawn\b/i;

function norm(raw: string): string {
  return raw.toLowerCase().trim();
}

/** Geography / HQ / origin — Kawn or “this app” in a where-from sense. */
export function isKawnLocationQuestion(raw: string): boolean {
  const s = norm(raw);
  if (!s) return false;

  const aboutKawnOrApp =
    HAS_KAWN.test(s) ||
    /\b(this|the)\s+(app|application)\b/i.test(s) ||
    /\bkawn\s+app\b/i.test(s);

  if (!aboutKawnOrApp) return false;

  const geo =
    /\b(where|headquarters|\bhq\b|based|located|location|country|countries|origin|founded|geograph|from\s+what\s+country|which\s+country|what\s+country)\b/i.test(
      s,
    ) ||
    /\bwhere\s+(is|are|'s|was)\b/i.test(s) ||
    /\bcome\s+from\b/i.test(s);

  return geo;
}

/** Who built / developed / owns Kawn (not “who is Kawn” identity). */
export function isKawnDeveloperQuestion(raw: string): boolean {
  const s = norm(raw);
  if (!s) return false;

  if (/\bwho\s+is\s+kawn\b/i.test(raw)) return false;

  const mentionsKawn =
    HAS_KAWN.test(s) ||
    /\bkawn\s+technologies\b/i.test(s) ||
    (/\b(this|the)\s+(app|application)\b/i.test(s) &&
      /\b(who|whom|developer|development|creator|created|built|founded|owns?|owned|company\s+behind)\b/i.test(
        s,
      ));

  if (!mentionsKawn) return false;

  const dev =
    /\b(developer|development|developed|built|created|creator|creators|founded|founder|founders|owns?|owned|company\s+behind|made\s+by|who\s+(made|built|created|developed|owns?))\b/i.test(
      s,
    ) ||
    /\b(who|whom)\s+(is|are|'s)\s+.*\b(developer|creator|owner)\b/i.test(s);

  return dev;
}

/**
 * User asks who/what the **chat assistant** is (KawnAI), not Kawn the company/app.
 */
export function isKawnAiAssistantIntroQuestion(raw: string): boolean {
  const s = norm(raw);
  if (!s) return false;

  if (/\bwho\s+is\s+kawn\b/i.test(raw) || /\bwhat\s+is\s+kawn\b/i.test(s)) {
    return false;
  }

  if (
    /\b(who|what)\s+are\s+you\b(?!\s+(talking|doing|trying|going|wearing|looking|saying|asking|reading|playing|working|up\s+to)\b)/.test(
      s,
    )
  ) {
    return true;
  }
  if (/\bwhat\s+are\s+u\b/.test(s)) return true;
  if (/\bintroduce\s+yourself\b/.test(s)) return true;
  if (/\bwhat('s| is)\s+your\s+name\b/.test(s)) return true;
  if (/\btell\s+me\s+about\s+yourself\b/.test(s)) return true;
  if (/\bwho\s+might\s+you\s+be\b/.test(s)) return true;

  if (/\bqui\s+es-tu\b/.test(s) || /\bqui\s+êtes-vous\b/.test(s)) return true;
  if (/\bqu['']es-tu\b/.test(s) || /\bqu['']est-ce\s+que\s+tu\s+es\b/.test(s)) return true;
  if (/\bquién\s+eres\b/.test(s) || /\bqué\s+eres\b/.test(s)) return true;
  if (/\bwer\s+bist\s+du\b/.test(s) || /\bwas\s+bist\s+du\b/.test(s)) return true;
  if (/\bchi\s+sei\b/.test(s)) return true;
  if (/\bquem\s+é\s+você\b/.test(s) || /\bquem\s+es\s+tu\b/.test(s)) return true;
  if (/\bwie\s+ben\s+je\b/.test(s)) return true;
  if (/\bkim\s+jesteś\b/.test(s)) return true;
  if (/\bkimsin\b/.test(s) || /\bsen\s+kinsin\b/.test(s)) return true;

  if (/من\s*أنت|ماذا\s*أنت|من\s+انت/i.test(raw)) return true;
  if (/你是谁|你是什么/.test(raw)) return true;
  if (/あなたは誰|君は誰/.test(raw)) return true;
  if (/누구세요|당신은\s*누구/.test(raw)) return true;
  if (/кто\s+ты|что\s+ты\s+такое|кто\s+вы/i.test(raw)) return true;

  return false;
}

/** What / who is Kawn, describe the app — not developer or HQ. */
export function isKawnIdentityQuestion(raw: string): boolean {
  const s = norm(raw);
  if (!s) return false;

  if (isKawnAiAssistantIntroQuestion(raw)) return false;
  if (isKawnDeveloperQuestion(raw) || isKawnLocationQuestion(raw)) return false;

  const aboutKawn =
    HAS_KAWN.test(s) ||
    /\b(this|the)\s+(app|application)\b/i.test(s) ||
    /\bkawn\s+app\b/i.test(s);

  if (!aboutKawn) return false;

  if (
    /\b(tell|learn|know|more)\s+(me\s+)?(about|regarding)\s+kawn\b/i.test(s) ||
    /\babout\s+kawn\b/i.test(s) ||
    /\bwhat\s+is\s+(kawn|the\s+kawn\s+app)\b/i.test(s) ||
    /\bwhat\s+does\s+kawn(\s+app)?\s+do\b/i.test(s) ||
    /\bwho\s+is\s+kawn\b/i.test(s) ||
    /\b(describe|explain|introduce)\s+(me\s+)?(to\s+)?kawn\b/i.test(s) ||
    /\bkawn\b.*\b(in a nutshell|overview)\b/i.test(s) ||
    /\boverview\s+of\s+kawn\b/i.test(s) ||
    /\bwhat('s|s| is)\s+kawn\b/i.test(s)
  ) {
    return true;
  }

  if (
    /\b(this|the)\s+(app|application)\b/i.test(s) &&
    /\b(what|which|describe|explain)\b/i.test(s)
  ) {
    return true;
  }

  return false;
}

export function isMetaQuestion(raw: string): boolean {
  const s = norm(raw);
  if (!s) return false;

  if (
    isKawnAiAssistantIntroQuestion(raw) ||
    isKawnIdentityQuestion(raw) ||
    isKawnDeveloperQuestion(raw) ||
    isKawnLocationQuestion(raw)
  ) {
    return false;
  }

  if (/\b(openai|chatgpt|gpt)\b/i.test(s)) return true;
  if (/\bapi\b/i.test(s)) return true;
  if (s.includes("backend")) return true;
  if (/\bwhat\b.*\bbuilt\b/i.test(s) && /\b(you|kawnai)\b/i.test(s)) return true;
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
  if (/\bwho\s+(powers|built)\s+(you|u|this(\s+(ai|bot|assistant|chatbot))?)\b/i.test(s)) {
    return true;
  }

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
