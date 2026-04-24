/**
 * Offline fallback for `POST /api/kawn-ai/chat` when `OPENAI_API_KEY` is missing
 * or the KawnAI model request fails. Keeps the chat usable without exposing errors.
 */

import { hintsCommunityExploration, isMetaQuestion } from "./kawnAiRules";

export type KawnAiChatRequest = {
  groupId: string;
  groupName: string;
  userId?: string;
  userLanguage?: string;
  message: string;
  /**
   * Optional. Used only by this fallback when the live model is unavailable.
   * Mobile clients may pass this for multi-turn provider-style answers.
   */
  metaInquiriesSoFar?: number;
};

const META_FIRST =
  "I'm KawnAI Chat, here to help you inside Kawn.";
const META_FOLLOW_UP =
  "For more information, please contact the Kawn support team.";

const COMMUNITY_REPLIES = [
  "I can help you explore insights, trends, and useful information related to this community.",
  "I'm here to help based on the community topic and available Kawn context. Tell me what you'd like to explore.",
  "Tell me what you're looking for in this community, and I'll help guide you.",
];

function pickCommunityReply(message: string, groupName: string): string {
  const seed = [...(message + groupName)].reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0,
  );
  return COMMUNITY_REPLIES[seed % COMMUNITY_REPLIES.length];
}

export function buildMockKawnAiReply(input: KawnAiChatRequest): string {
  const { message, groupName, metaInquiriesSoFar = 0 } = input;

  if (isMetaQuestion(message)) {
    return metaInquiriesSoFar >= 1 ? META_FOLLOW_UP : META_FIRST;
  }

  if (hintsCommunityExploration(message)) {
    return pickCommunityReply(message, groupName);
  }

  return `I can help with a wide range of topics. For your question about that, a fuller answer will appear here when KawnAI is connected with live knowledge—in the meantime, try rephrasing or ask something more specific.`;
}
