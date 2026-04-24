# Chat with KawnAI (web prototype)

Standalone Next.js app: dark Kawn-style chat UI and **`POST /api/kawn-ai/chat`** backed by the OpenAI **Responses API**, with automatic fallback to `buildMockKawnAiReply` when the key is missing or the request fails.

## Setup

Copy `.env.example` to `.env.local` and set a real key:

```bash
cp .env.example .env.local
```

- `OPENAI_API_KEY` — required for live KawnAI replies (never commit real values).
- `KAWNAI_MODEL` — defaults to `gpt-4.1-mini` if unset.
- `KAWNAI_WEB_SEARCH` — defaults to **on** (any value except `0`). The API calls OpenAI’s **Responses API with the built-in `web_search` tool** so questions about FIFA schedules, groups, and opening matches can use **current web sources** instead of stale training data alone. Set to `0` to disable (lower cost; less reliable for “what’s the first match?” style questions).

### Why answers sometimes looked “wrong” before

The backend **was already calling OpenAI**. A plain model reply only knows facts up to its training cutoff and tends to hedge on post-cutoff tournaments. **Web search** (now enabled by default) lets the same API **retrieve up-to-date official listings** before answering.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API (Flutter / mobile)

**`POST /api/kawn-ai/chat`**

Request body:

```json
{
  "groupId": "world-cup-2026",
  "groupName": "FIFA World Cup 2026",
  "userId": "demo-user",
  "userLanguage": "auto",
  "message": "When is France playing next?"
}
```

Optional: `metaInquiriesSoFar` (number) — used only when the server falls back to the mock.

Response:

```json
{
  "reply": "assistant reply here",
  "source": "kawnai"
}
```

`source` is `"kawnai"` when the reply came from the model, and `"mock"` when the mock fallback was used.

Live integration lives in `src/app/api/kawn-ai/chat/route.ts`; system instructions in `src/lib/kawnAiSystemPrompt.ts`.
