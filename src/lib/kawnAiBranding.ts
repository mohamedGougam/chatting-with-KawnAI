/**
 * Canonical Kawn product identity replies (KawnAI). Single source for prompt + mock fallback.
 * Do not mention third-party AI vendors here.
 */

export const KAWN_WELCOME_MESSAGE =
  "Hey! Glad you're here. I'm KawnAI. Ask me anything you're curious about, from news and facts to everyday questions.";

export const KAWN_BRAND_IDENTITY_REPLY =
  "Kawn is a community-driven social media app built to help people discover communities, connect around shared interests, and create meaningful conversations.";

export const KAWN_BRAND_DEVELOPER_REPLY =
  "Kawn is developed by Kawn Technologies.";

export const KAWN_BRAND_LOCATION_REPLY =
  "Kawn is unlike other social media platforms. It is designed as a decentralized network that belongs to all the beautiful humans around the globe.";

export const KAWN_META_FIRST_REPLY =
  "I'm KawnAI, your chat buddy inside Kawn. Happy to help with whatever you need.";

export const KAWN_META_FOLLOW_UP_REPLY =
  "For more information, please contact the Kawn support team.";

export const KAWN_GENERAL_TOPIC_REPLY =
  "Sure! I can help you look into that, break it down, or point you in the right direction. What's the main thing you want to know?";

export const KAWN_WHAT_CAN_YOU_HELP_REPLY =
  "I can help with news, facts, explanations, ideas, translations, and pretty much any topic. What do you want to start with?";

export const KAWN_DUPLICATE_REPLY_FALLBACK =
  "Ha, I might be repeating myself! What should we dig into next?";

export const KAWN_FOOTBALL_SCHEDULE_UNAVAILABLE_REPLY =
  "I don't have live match schedules hooked up yet, but I'm happy to chat about the World Cup, teams, players, or history. What do you want to talk about?";

/** Short assistant self-intro when the user asks who KawnAI is (not the one-time welcome). */
export const KAWN_ASSISTANT_INTRO_EN =
  "I'm KawnAI, your chat buddy in Kawn. Ask me about news, facts, ideas, or anything on your mind. What do you want to talk about?";

/** Varied casual greetings for social chat (mock + prompt reference). */
export const KAWN_CASUAL_GREETING_REPLIES = [
  "Hey! Good to see you. What's on your mind?",
  "Hi there! News, a random fact, or something you've been wondering about?",
  "Hey again! Got a question or just here to chat?",
  "Hello! I'm all ears. What would you like to talk about?",
  "Hey! Anything goes here. What are you curious about?",
] as const;

/** @deprecated Use KAWN_GENERAL_TOPIC_REPLY */
export const KAWN_COMMUNITY_EXPLORATION_REPLY = KAWN_GENERAL_TOPIC_REPLY;

export function pickCasualGreetingReply(
  message: string,
  priorAssistantCount = 0,
): string {
  const seed = [...(message + String(priorAssistantCount))].reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0,
  );
  const idx = (seed + priorAssistantCount) % KAWN_CASUAL_GREETING_REPLIES.length;
  const base = KAWN_CASUAL_GREETING_REPLIES[idx] ?? KAWN_CASUAL_GREETING_REPLIES[0];

  if (priorAssistantCount >= 2) {
    return `You're keeping me company. I like it! ${base}`;
  }
  return base;
}

const ASSISTANT_INTRO_I18N: Record<string, string> = {
  en: KAWN_ASSISTANT_INTRO_EN,
  ar: "أنا KawnAI، رفيق الدردشة في Kawn. اسألني عن الأخبار أو الحقائق أو الأفكار أو أي شيء يدور في بالك. بماذا تود أن نتحدث؟",
  es: "Soy KawnAI, tu compañero de chat en Kawn. Pregúntame sobre noticias, datos, ideas o lo que tengas en mente. ¿De qué quieres hablar?",
  fr: "Je suis KawnAI, ton compagnon de chat dans Kawn. Pose-moi des questions sur l'actu, des faits, des idées ou ce que tu veux. De quoi veux-tu parler ?",
  de: "Ich bin KawnAI, dein Chat-Buddy in Kawn. Frag mich zu News, Fakten, Ideen oder was auch immer dir durch den Kopf geht. Worüber möchtest du reden?",
  pt: "Sou o KawnAI, seu parceiro de chat no Kawn. Pergunte sobre notícias, fatos, ideias ou o que estiver na sua cabeça. Sobre o que você quer conversar?",
  it: "Sono KawnAI, il tuo compagno di chat in Kawn. Chiedimi di notizie, fatti, idee o qualsiasi cosa ti passi per la testa. Di cosa vuoi parlare?",
  nl: "Ik ben KawnAI, je chatmaatje in Kawn. Vraag me over nieuws, feiten, ideeën of wat je maar wilt. Waar wil je het over hebben?",
  tr: "Ben KawnAI, Kawn'daki sohbet arkadaşın. Haberler, bilgiler, fikirler veya aklındaki her şeyi sor. Ne hakkında konuşmak istersin?",
  ru: "Я KawnAI, твой собеседник в Kawn. Спрашивай про новости, факты, идеи или что угодно. О чём хочешь поговорить?",
  hi: "मैं KawnAI हूँ, Kawn में आपका चैट बडी। समाचार, तथ्य, विचार या कुछ भी पूछिए। आप किस बारे में बात करना चाहेंगे?",
  zh: "我是 KawnAI，你在 Kawn 里的聊天伙伴。新闻、知识、想法或任何话题都可以问。你想聊什么？",
  ja: "私は KawnAI、Kawn のチャット相手です。ニュース、事実、アイデア、何でも聞いてください。何について話したいですか？",
  ko: "저는 KawnAI, Kawn 안의 채팅 친구예요. 뉴스, 사실, 아이디어, 뭐든 물어보세요. 무엇에 대해 이야기하고 싶으세요?",
  id: "Saya KawnAI, teman ngobrolmu di Kawn. Tanya soal berita, fakta, ide, atau apa pun. Mau ngobrol tentang apa?",
  uk: "Я KawnAI, твій співрозмовник у Kawn. Питай про новини, факти, ідеї або що завгодно. Про що хочеш поговорити?",
  pl: "Jestem KawnAI, twój rozmówca w Kawn. Pytaj o wiadomości, fakty, pomysły lub cokolwiek. O czym chcesz porozmawiać?",
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
