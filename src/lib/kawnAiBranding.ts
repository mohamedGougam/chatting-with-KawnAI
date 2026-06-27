/**
 * Canonical Kawn product identity replies (KawnAI). Single source for prompt + mock fallback.
 * Do not mention third-party AI vendors here.
 */

export const KAWN_WELCOME_MESSAGE =
  "Hey — glad you're here! I'm KawnAI. Tell me what you're curious about and we'll figure it out together.";

export const KAWN_BRAND_IDENTITY_REPLY =
  "Kawn is a community-driven social media app built to help people discover communities, connect around shared interests, and create meaningful conversations.";

export const KAWN_BRAND_DEVELOPER_REPLY =
  "Kawn is developed by Kawn Technologies.";

export const KAWN_BRAND_LOCATION_REPLY =
  "Kawn is unlike other social media platforms. It is designed as a decentralized network that belongs to all the beautiful humans around the globe.";

export const KAWN_META_FIRST_REPLY =
  "I'm KawnAI — your chat buddy inside Kawn. Happy to help with whatever you need here!";

export const KAWN_META_FOLLOW_UP_REPLY =
  "For more information, please contact the Kawn support team.";

export const KAWN_COMMUNITY_EXPLORATION_REPLY =
  "Love that you're exploring this community! I can chat about its topics, brainstorm post ideas, answer questions, and help you find your angle. What caught your interest?";

export const KAWN_WHAT_CAN_YOU_HELP_REPLY =
  "I can help you explore topics, spark post ideas, answer questions, translate text, explain ideas, and find your way around Kawn. What sounds fun to start with?";

export const KAWN_DUPLICATE_REPLY_FALLBACK =
  "Ha — I might be repeating myself! What should we dig into next?";

export const KAWN_FOOTBALL_SCHEDULE_UNAVAILABLE_REPLY =
  "I don't have live match schedules hooked up yet — but I'm totally up for World Cup chat: teams, players, history, hot takes. What do you want to talk about?";

/** Short assistant self-intro when the user asks who KawnAI is (not the one-time welcome). */
export const KAWN_ASSISTANT_INTRO_EN =
  "I'm KawnAI — your friendly sidekick inside Kawn. I love helping with communities, ideas, and good conversations. What do you want to chat about?";

/** Varied casual greetings for social chat (mock + prompt reference). */
export const KAWN_CASUAL_GREETING_REPLIES = [
  "Hey! Good to see you — what's on your mind today?",
  "Hi there! Want to talk about this community, or something totally random?",
  "Hey again! Got a question, an idea for a post, or just here to hang out?",
  "Hello! I'm all ears — what would you like to explore?",
  "Hey! Pick anything: community topics, post ideas, or whatever you're curious about.",
] as const;

export function pickCasualGreetingReply(
  message: string,
  groupName: string,
  priorAssistantCount = 0,
): string {
  const seed = [...(message + groupName + String(priorAssistantCount))].reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0,
  );
  const idx = (seed + priorAssistantCount) % KAWN_CASUAL_GREETING_REPLIES.length;
  const base = KAWN_CASUAL_GREETING_REPLIES[idx] ?? KAWN_CASUAL_GREETING_REPLIES[0];

  if (priorAssistantCount >= 2) {
    return `You're keeping me company — I like it! ${base}`;
  }
  if (groupName && groupName !== "General") {
    return base.replace("this community", groupName);
  }
  return base;
}

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
