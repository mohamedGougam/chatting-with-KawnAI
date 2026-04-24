/**
 * Canonical Kawn product identity replies (KawnAI). Single source for prompt + mock fallback.
 * Do not mention third-party AI vendors here.
 */

export const KAWN_BRAND_IDENTITY_REPLY =
  "Kawn is a community-driven social media app built to help people discover communities, connect around shared interests, and create meaningful conversations.";

export const KAWN_BRAND_DEVELOPER_REPLY =
  "Kawn is developed by Kawn Technologies.";

export const KAWN_BRAND_LOCATION_REPLY =
  "Kawn is unlike other social media apps. It is designed as a decentralized network that belongs to all the beautiful humans around the globe.";

/** English baseline; live model translates; mock uses `getKawnAiAssistantIntroReply`. */
export const KAWN_ASSISTANT_INTRO_EN =
  "I am KawnAI the AI Brain of Kawn, what do you want to chat about?";

const ASSISTANT_INTRO_I18N: Record<string, string> = {
  en: KAWN_ASSISTANT_INTRO_EN,
  ar: "أنا KawnAI، العقل الاصطناعي لـ Kawn، ماذا تريد أن نتحدث عنه؟",
  es: "Soy KawnAI, el cerebro de IA de Kawn, ¿sobre qué quieres charlar?",
  fr: "Je suis KawnAI, le cerveau IA de Kawn — de quoi veux-tu parler ?",
  de: "Ich bin KawnAI, das KI-Gehirn von Kawn – worüber möchtest du chatten?",
  pt: "Sou o KawnAI, o cérebro de IA do Kawn — sobre o que você quer conversar?",
  it: "Sono KawnAI, il cervello AI di Kawn — di cosa vuoi parlare?",
  nl: "Ik ben KawnAI, het AI-brein van Kawn — waar wil je over chatten?",
  tr: "Ben KawnAI, Kawn'un yapay zekâ beyniyim — ne hakkında konuşmak istersin?",
  ru: "Я KawnAI, ИИ-мозг Kawn — о чём хочешь поговорить?",
  hi: "मैं KawnAI हूँ, Kawn का AI मस्तिष्क — आप किस विषय पर बात करना चाहते हैं?",
  zh: "我是 KawnAI，Kawn 的 AI 大脑——你想聊些什么？",
  ja: "私は KawnAI、Kawn の AI ブレインです。何について話したいですか？",
  ko: "저는 KawnAI, Kawn의 AI 두뇌입니다. 무엇에 대해 이야기하고 싶으세요?",
  id: "Saya KawnAI, otak AI Kawn — mau ngobrol tentang apa?",
  uk: "Я KawnAI, ШІ-мозок Kawn — про що хочеш поговорити?",
  pl: "Jestem KawnAI, sztucznym mózgiem Kawn — o czym chcesz porozmawiać?",
};

function normalizeLangTag(tag: string | undefined): string | null {
  if (!tag || tag === "auto") return null;
  const t = tag.trim().toLowerCase();
  const primary = t.split(/[-_]/)[0] ?? t;
  const two = primary.slice(0, 2);
  if (ASSISTANT_INTRO_I18N[two]) return two;
  if (ASSISTANT_INTRO_I18N[primary]) return primary;
  if (ASSISTANT_INTRO_I18N[t]) return t;
  return null;
}

function detectLangFromMessage(message: string): string | null {
  if (/[\u0600-\u06FF]/.test(message)) return "ar";
  if (/[\u4e00-\u9fff]/.test(message)) return "zh";
  if (/[\u3040-\u30ff]/.test(message)) return "ja";
  if (/[\uac00-\ud7af]/.test(message)) return "ko";
  if (/[\u0400-\u04FF]/.test(message)) return "ru";
  if (/[\u0900-\u097F]/.test(message)) return "hi";
  return null;
}

/**
 * Offline assistant self-intro in the user’s language when possible.
 */
export function getKawnAiAssistantIntroReply(message: string, userLanguage?: string): string {
  const fromTag = normalizeLangTag(userLanguage);
  const fromText = detectLangFromMessage(message);
  const lang = fromTag ?? fromText ?? "en";
  return ASSISTANT_INTRO_I18N[lang] ?? KAWN_ASSISTANT_INTRO_EN;
}
