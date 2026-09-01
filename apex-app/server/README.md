# Oracle Fusion agent proxy

A small Express server that holds the Oracle Fusion IDCS OAuth credentials
server-side and exposes a single endpoint the React frontend can call safely,
without ever shipping the client secret or password to the browser.

## Setup

```bash
cd apex-app/server
cp .env.example .env
# then fill in the real values in .env (never commit this file)
npm install
npm run dev
```

The server listens on `http://localhost:4000` by default (`PORT` in `.env`).

## Endpoint

`POST /api/agent/chat`

Request body:

```json
{
  "agent": "AP_MANAGER",
  "message": "Show me overdue invoices",
  "conversationId": null
}
```

- `agent`: `"AP_MANAGER"` or `"EMPLOYEE_QUERY_AGENT"`.
- `conversationId`: optional, pass back the value returned by a previous
  call to continue the same conversation. Omit/`null` to start fresh.

Response body:

```json
{
  "conversationId": "...",
  "reply": "...",
  "raw": { }
}
```

`raw` is the full job payload from Oracle's status endpoint, included for
debugging — the field names for the final answer aren't documented, so
`reply` is extracted defensively from several common shapes (`response`,
`result`, `message`, `output`, `messages[]`, ...) and falls back to a JSON
dump of the payload if no text field is recognized.

## What it does internally

1. **Token** — `POST {TOKEN_URL}` using the OAuth2 password grant (HTTP
   Basic auth with `CLIENT_ID:CLIENT_SECRET`, body
   `grant_type=password&username=...&password=...&scope=...`). The access
   token is cached in memory and reused until shortly before `expires_in`
   elapses, so a new token is not fetched on every chat message.
2. **Invoke** — `POST {FUSION_AI_BASE_URL}/api/fusion-ai/orchestrator/agent/v2/{AGENT_NAME}/invokeAsync`
   with the bearer token, returns a `jobId`.
3. **Poll** — `GET .../status/{jobId}` every ~1.5s (60s timeout) until the
   job reaches a terminal status, then extracts the reply text.

## Running alongside the frontend

This is one of two processes:

```bash
# terminal 1
cd apex-app/server && npm install && npm run dev

# terminal 2
cd apex-app && npm install && npm run dev
```

The Vite dev server proxies `/api/*` requests to `http://localhost:4000`
(see `apex-app/vite.config.js`), so the frontend calls relative URLs like
`fetch('/api/agent/chat', ...)` and never needs to know the backend's host.

## Known limitation

Conversation continuity depends on Oracle's orchestrator API accepting a
non-null `conversationId` on subsequent `invokeAsync` calls to keep context.
This proxy passes it through when the frontend supplies one, but if Oracle's
API does not actually thread context that way, each turn effectively behaves
as a stateless, single-message exchange.
