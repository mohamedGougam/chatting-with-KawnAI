/**
 * Canonical Kawn product identity replies (KawnAI). Single source for prompt + mock fallback.
 * Do not mention third-party AI vendors here.
 */

export const KAWN_WELCOME_MESSAGE =
  "Thanks for chatting with KawnAI. Tell me what you would like to know, and I'll check it for you.";

export const KAWN_BRAND_IDENTITY_REPLY =
  "Kawn is a community-driven social media app built to help people discover communities, connect around shared interests, and create meaningful conversations.";

export const KAWN_BRAND_DEVELOPER_REPLY =
  "Kawn is developed by Kawn Technologies.";

export const KAWN_BRAND_LOCATION_REPLY =
  "Kawn is unlike other social media platforms. It is designed as a decentralized network that belongs to all the beautiful humans around the globe.";

export const KAWN_META_FIRST_REPLY =
  "I'm KawnAI Chat, here to help you inside Kawn.";

export const KAWN_META_FOLLOW_UP_REPLY =
  "For more information, please contact the Kawn support team.";

export const KAWN_COMMUNITY_EXPLORATION_REPLY =
  "I can help you explore the topic of this community, discuss ideas, answer questions, and guide conversations related to it.";

export const KAWN_WHAT_CAN_YOU_HELP_REPLY =
  "I can help you explore topics, answer questions, create posts or replies, translate text, explain ideas, and guide you through Kawn. What would you like to do first?";

export const KAWN_DUPLICATE_REPLY_FALLBACK =
  "Let me understand that better. What would you like me to focus on?";

export const KAWN_FOOTBALL_SCHEDULE_UNAVAILABLE_REPLY =
  "I don't have the live match schedule connected yet, but I can still help with World Cup information, teams, players, history and discussions.";

/** Short assistant self-intro when the user asks who KawnAI is (not the one-time welcome). */
export const KAWN_ASSISTANT_INTRO_EN =
  "I'm KawnAI Chat, the assistant inside Kawn. I can help with questions, communities, and everyday topics. What would you like to talk about?";

const ASSISTANT_INTRO_I18N: Record<string, string> = {
  en: KAWN_ASSISTANT_INTRO_EN,
  ar: "أنا KawnAI Chat، المساعد داخل تطبيق Kawn. أستطيع المساعدة في الأسئلة والمجتمعات والمواضيع اليومية. بماذا تود أن نتحدث؟",
  es: "Soy KawnAI Chat, el asistente dentro de Kawn. Puedo ayudarte con preguntas, comunidades y temas del día a día. ¿De qué te gustaría hablar?",
  fr: "Je suis KawnAI Chat, l’assistant dans Kawn. Je peux t’aider avec des questions, des communautés et des sujets du quotidien. De quoi veux-tu parler ?",
  de: "Ich bin KawnAI Chat, der Assistent in Kawn. Ich helfe bei Fragen, Communities und Alltagsthemen. Worüber möchtest du sprechen?",
  pt: "Sou o KawnAI Chat, o assistente dentro do Kawn. Posso ajudar com perguntas, comunidades e assuntos do dia a dia. Sobre o que você gostaria de conversar?",
  it: "Sono KawnAI Chat, l’assistente dentro Kawn. Posso aiutarti con domande, community e argomenti quotidiani. Di cosa vorresti parlare?",
  nl: "Ik ben KawnAI Chat, de assistent in Kawn. Ik help met vragen, communities en alledaagse onderwerpen. Waar wil je het over hebben?",
  tr: "Ben KawnAI Chat, Kawn içindeki asistanım. Sorular, topluluklar ve günlük konularda yardımcı olabilirim. Ne hakkında konuşmak istersin?",
  ru: "Я KawnAI Chat — ассистент в Kawn. Могу помочь с вопросами, сообществами и повседневными темами. О чём хотите поговорить?",
  hi: "मैं KawnAI Chat हूँ — Kawn के अंदर आपका सहायक। मैं सवालों, समुदायों और रोज़मर्रा के विषयों में मदद कर सकता/सकती हूँ। आप किस बारे में बात करना चाहेंगे?",
  zh: "我是 KawnAI Chat，Kawn 里的助手。我可以帮你解答问题、了解社区和日常话题。你想聊什么？",
  ja: "私は KawnAI Chat、Kawn の中のアシスタントです。質問やコミュニティ、日常の話題を手伝えます。何について話したいですか？",
  ko: "저는 KawnAI Chat, Kawn 안의 도우미예요. 질문, 커뮤니티, 일상 주제를 도와드릴 수 있어요. 무엇에 대해 이야기하고 싶으세요?",
  id: "Saya KawnAI Chat, asisten di dalam Kawn. Saya bisa membantu pertanyaan, komunitas, dan topik sehari-hari. Mau ngobrol tentang apa?",
  uk: "Я KawnAI Chat — асистент у Kawn. Можу допомогти з питаннями, спільнотами та повсякденними темами. Про що хочете поговорити?",
  pl: "Jestem KawnAI Chat, asystent w Kawn. Mogę pomóc z pytaniami, społecznościami i codziennymi tematami. O czym chcesz porozmawiać?",
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
