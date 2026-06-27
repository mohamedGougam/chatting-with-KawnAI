/**
 * Offline fallback for `POST /api/kawn-ai/chat` when `OPENAI_API_KEY` is missing
 * or the KawnAI model request fails. Keeps the chat usable without exposing errors.
 */

import {
  getKawnAiAssistantIntroReply,
  KAWN_BRAND_DEVELOPER_REPLY,
  KAWN_BRAND_IDENTITY_REPLY,
  KAWN_BRAND_LOCATION_REPLY,
  KAWN_COMMUNITY_EXPLORATION_REPLY,
  KAWN_FOOTBALL_SCHEDULE_UNAVAILABLE_REPLY,
  KAWN_META_FIRST_REPLY,
  KAWN_META_FOLLOW_UP_REPLY,
  KAWN_WHAT_CAN_YOU_HELP_REPLY,
  pickCasualGreetingReply,
} from "./kawnAiBranding";
import {
  hintsCommunityExploration,
  isCasualGreeting,
  isFootballScheduleQuestion,
  isKawnAiAssistantIntroQuestion,
  isKawnDeveloperQuestion,
  isKawnIdentityQuestion,
  isKawnLocationQuestion,
  isMetaQuestion,
  isWhatCanYouHelpQuestion,
} from "./kawnAiRules";

export type KawnAiHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type KawnAiChatRequest = {
  groupId: string;
  groupName: string;
  userId?: string;
  userLanguage?: string;
  message: string;
  /** Recent turns before the current user message (server keeps last 8). */
  history?: KawnAiHistoryMessage[];
  /**
   * Optional. Used only by this fallback when the live model is unavailable.
   * Mobile clients may pass this for multi-turn provider-style answers.
   */
  metaInquiriesSoFar?: number;
};

export function buildMockKawnAiReply(input: KawnAiChatRequest): string {
  const { message, groupName, metaInquiriesSoFar = 0, userLanguage, history = [] } = input;

  const priorAssistantCount = history.filter((t) => t.role === "assistant").length;

  if (isCasualGreeting(message)) {
    return pickCasualGreetingReply(message, groupName, priorAssistantCount);
  }

  if (isKawnLocationQuestion(message)) {
    return KAWN_BRAND_LOCATION_REPLY;
  }
  if (isKawnDeveloperQuestion(message)) {
    return KAWN_BRAND_DEVELOPER_REPLY;
  }
  if (isKawnAiAssistantIntroQuestion(message)) {
    return getKawnAiAssistantIntroReply(message, userLanguage);
  }
  if (isKawnIdentityQuestion(message)) {
    return KAWN_BRAND_IDENTITY_REPLY;
  }

  if (isMetaQuestion(message)) {
    return metaInquiriesSoFar >= 1 ? KAWN_META_FOLLOW_UP_REPLY : KAWN_META_FIRST_REPLY;
  }

  if (isWhatCanYouHelpQuestion(message)) {
    return KAWN_WHAT_CAN_YOU_HELP_REPLY;
  }

  if (isFootballScheduleQuestion(message)) {
    return KAWN_FOOTBALL_SCHEDULE_UNAVAILABLE_REPLY;
  }

  if (hintsCommunityExploration(message)) {
    return KAWN_COMMUNITY_EXPLORATION_REPLY;
  }

  return "I'm here for it — tell me a bit more and we'll figure it out together!";
}
