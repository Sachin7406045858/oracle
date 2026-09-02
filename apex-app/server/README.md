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

On Windows, double-click `setup.bat` (first time) then `run.bat` from the
`apex-app` folder — `run.bat` opens the backend in its own window and runs
the frontend in the current one. No extra npm packages required for this.

Or manually, first time only:

```bash
cd apex-app
npm run setup            # installs both frontend and server deps
cp server/.env.example server/.env   # then fill in real values
```

Then run both processes (two terminals):

```bash
# terminal 1
cd apex-app/server && npm run dev

# terminal 2
cd apex-app && npm run dev
```

The Vite dev server proxies `/api/*` requests to `http://localhost:4000`
(see `apex-app/vite.config.js`), so the frontend calls relative URLs like
`fetch('/api/agent/chat', ...)` and never needs to know the backend's host.

The server checks for all required `.env` variables at startup and prints a
clear warning (not a crash) listing exactly which ones are missing, so a
misconfigured `.env` is obvious immediately instead of surfacing as a vague
runtime error later.

## Troubleshooting

- **"Oracle OAuth credentials are not fully configured"** — `server/.env`
  is missing one of `TOKEN_URL`, `CLIENT_ID`, `CLIENT_SECRET`, `SCOPE`,
  `USERNAME`, `PASSWORD`. Check the startup log; it names the missing keys.
  Common Windows pitfall: Notepad saving the file as `.env.txt` instead of
  `.env` — verify with `dir server\.env*`.
- **"Token request failed (status 400): ... invalid_grant ..."** — the
  request reached Oracle correctly, but Oracle rejected the
  username/password itself (expired, reset, or a typo). This is a
  credentials problem with the Oracle account, not a bug in this proxy —
  confirm the username/password still work by logging into Fusion directly,
  or get a fresh password from whoever issued them.
- **Backend won't start / port already in use** — another process is
  already on port 4000; either stop it or set `PORT=<other>` in
  `server/.env` (and update `apex-app/vite.config.js`'s proxy target to
  match).
- **Frontend loads but chat always errors** — confirm the backend terminal
  (or the "Apex Backend" window opened by `run.bat`) is actually running
  and printed `Oracle agent proxy listening on http://localhost:4000` with
  no missing-vars warning above it.
- **`npm install` fails with `403 Forbidden ... forbidden by your security
  policy`** — this means npm is going through a corporate registry proxy
  (Nexus/Artifactory-style) that blocks specific packages, not a problem
  with this project's code. It can surface on any small transitive
  dependency, unpredictably. If it happens, note exactly which package
  failed and ask IT/whoever manages that proxy to allowlist it, or run
  `npm install` from a network without that restriction (e.g. a personal
  hotspot) to get `node_modules` populated once, then copy that folder to
  the restricted machine.

## Known limitation

Conversation continuity depends on Oracle's orchestrator API accepting a
non-null `conversationId` on subsequent `invokeAsync` calls to keep context.
This proxy passes it through when the frontend supplies one, but if Oracle's
API does not actually thread context that way, each turn effectively behaves
as a stateless, single-message exchange.
