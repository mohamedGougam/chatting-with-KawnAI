/** Shared chat limits for API + UI (keep in sync). */
export const KAWN_AI_MAX_HISTORY_MESSAGES = 8;

/** Target max tokens for model replies (250–350 range). */
export const KAWN_AI_MAX_OUTPUT_TOKENS = 300;

/** Frontend fetch timeout before showing a friendly slow-response message. */
export const KAWN_AI_CLIENT_TIMEOUT_MS = 30_000;

/** Backend OpenAI call timeout before falling back to mock. */
export const KAWN_AI_BACKEND_TIMEOUT_MS = 25_000;
