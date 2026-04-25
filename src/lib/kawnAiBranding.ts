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
  "Hey! I’m KawnAI, your go-to for pretty much anything. What’s on your mind today? I’m all ears! ✨👾";

const ASSISTANT_INTRO_I18N: Record<string, string> = {
  en: KAWN_ASSISTANT_INTRO_EN,
  ar: "مرحبًا! أنا KawnAI — موجودة لمساعدتك تقريبًا في أي شيء. ما الذي يدور في بالك اليوم؟ أنا أستمع! ✨👾",
  es: "¡Hey! Soy KawnAI, tu apoyo para casi cualquier cosa. ¿Qué tienes en mente hoy? ¡Te escucho! ✨👾",
  fr: "Hey ! Je suis KawnAI, ton allié pour à peu près tout. Qu’est-ce que tu as en tête aujourd’hui ? Je t’écoute ! ✨👾",
  de: "Hey! Ich bin KawnAI, dein Go-to für so ziemlich alles. Was hast du heute im Kopf? Ich bin ganz Ohr! ✨👾",
  pt: "Ei! Eu sou o KawnAI, sua ajuda para praticamente qualquer coisa. O que está na sua cabeça hoje? Estou ouvindo! ✨👾",
  it: "Ehi! Sono KawnAI, il tuo punto di riferimento per praticamente qualsiasi cosa. Cosa ti passa per la testa oggi? Sono tutt’orecchi! ✨👾",
  nl: "Hé! Ik ben KawnAI, jouw go-to voor bijna alles. Wat houdt je vandaag bezig? Ik luister! ✨👾",
  tr: "Hey! Ben KawnAI, neredeyse her şey için yanındayım. Bugün aklında ne var? Kulaklarım sende! ✨👾",
  ru: "Привет! Я KawnAI — твой помощник почти по любым вопросам. Что у тебя сегодня на уме? Я слушаю! ✨👾",
  hi: "हे! मैं KawnAI हूँ—लगभग हर चीज़ में आपका go-to. आज आपके मन में क्या है? मैं सुन रहा/रही हूँ! ✨👾",
  zh: "嘿！我是 KawnAI，几乎什么都能帮你。今天你在想什么？我在听！✨👾",
  ja: "やあ！私は KawnAI。だいたい何でも頼れる相棒だよ。今日は何を考えてる？話してみて！✨👾",
  ko: "안녕! 저는 KawnAI예요—거의 뭐든 도와주는 당신의 go-to. 오늘 무슨 생각이 드세요? 듣고 있어요! ✨👾",
  id: "Hai! Aku KawnAI, andalan kamu untuk hampir apa pun. Hari ini kepikiran apa? Aku siap dengerin! ✨👾",
  uk: "Привіт! Я KawnAI — твій помічник майже з будь-чим. Що в тебе сьогодні на думці? Я слухаю! ✨👾",
  pl: "Hej! Jestem KawnAI — twoje wsparcie w praktycznie każdej sprawie. Co dziś masz na myśli? Słucham! ✨👾",
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
