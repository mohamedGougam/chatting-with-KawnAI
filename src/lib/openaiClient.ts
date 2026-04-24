import OpenAI from "openai";

let cached: OpenAI | undefined;

/**
 * Shared OpenAI SDK client. Call only when `OPENAI_API_KEY` is set (see API route guard).
 * Lazy init avoids throwing during `next build` on hosts like Vercel where env secrets are not available at build time.
 */
export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("getOpenAIClient() requires OPENAI_API_KEY");
  }
  if (!cached) {
    cached = new OpenAI({ apiKey });
  }
  return cached;
}
