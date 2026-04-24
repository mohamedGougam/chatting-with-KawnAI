import OpenAI from "openai";

/**
 * Official OpenAI SDK client. API key must come from the environment only.
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
