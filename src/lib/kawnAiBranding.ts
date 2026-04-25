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
  "Hey there, I am KawnAI the AI Brain of Kawn, what do you have in mind today?";

const ASSISTANT_INTRO_I18N: Record<string, string> = {
  en: KAWN_ASSISTANT_INTRO_EN,
  ar: "مرحبًا، أنا KawnAI، العقل الاصطناعي لـ Kawn — ما الذي يدور في بالك اليوم؟",
  es: "Hola, soy KawnAI, el cerebro de IA de Kawn. ¿Qué tienes en mente hoy?",
  fr: "Salut, je suis KawnAI, le cerveau IA de Kawn — qu’as-tu en tête aujourd’hui ?",
  de: "Hey, ich bin KawnAI, das KI-Gehirn von Kawn – was hast du heute im Sinn?",
  pt: "Olá, eu sou o KawnAI, o cérebro de IA do Kawn — o que você tem em mente hoje?",
  it: "Ciao, sono KawnAI, il cervello AI di Kawn — cosa hai in mente oggi?",
  nl: "Hé, ik ben KawnAI, het AI-brein van Kawn — wat heb je vandaag in gedachten?",
  tr: "Selam, ben KawnAI, Kawn'un yapay zekâ beyniyim — bugün aklında ne var?",
  ru: "Привет, я KawnAI, ИИ-мозг Kawn — что у тебя сегодня на уме?",
  hi: "नमस्ते, मैं KawnAI हूँ, Kawn का AI मस्तिष्क — आज आपके मन में क्या है?",
  zh: "你好，我是 KawnAI，Kawn 的 AI 大脑——你今天有什么想法？",
  ja: "こんにちは、私は KawnAI、Kawn の AI ブレインです。今日は何を考えていますか？",
  ko: "안녕하세요, 저는 KawnAI, Kawn의 AI 두뇌입니다. 오늘 어떤 생각이 있으신가요?",
  id: "Hai, saya KawnAI, otak AI Kawn — kamu punya ide apa hari ini?",
  uk: "Привіт, я KawnAI, ШІ-мозок Kawn — що в тебе сьогодні на думці?",
  pl: "Hej, jestem KawnAI, sztucznym mózgiem Kawn — co masz dziś na myśli?",
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
