// Server-side only client for Oracle Fusion AI agents. Holds the OAuth2
// password-grant credentials and never exposes them to callers of this module.
import { AGENTS } from './agents.js';

const {
  TOKEN_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  SCOPE,
  USERNAME,
  PASSWORD,
  FUSION_AI_BASE_URL,
} = process.env;

// --- Token cache -----------------------------------------------------------
// A single in-memory cache is fine here: this backend authenticates as one
// Oracle Fusion end user (the service account above), not per-browser-user.
let cachedToken = null; // { accessToken, expiresAt } (expiresAt = epoch ms)

const TOKEN_SAFETY_MARGIN_MS = 30_000; // refetch a bit before real expiry

async function fetchNewToken() {
  if (!TOKEN_URL || !CLIENT_ID || !CLIENT_SECRET || !USERNAME || !PASSWORD || !SCOPE) {
    throw new Error('Oracle OAuth credentials are not fully configured (check server/.env)');
  }

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const body = new URLSearchParams({
    grant_type: 'password',
    username: USERNAME,
    password: PASSWORD,
    scope: SCOPE,
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Token endpoint returned non-JSON response (status ${res.status}): ${text.slice(0, 500)}`);
  }

  if (!res.ok) {
    throw new Error(`Token request failed (status ${res.status}): ${JSON.stringify(json)}`);
  }
  if (!json.access_token) {
    throw new Error(`Token response missing access_token: ${JSON.stringify(json)}`);
  }

  const expiresInSec = Number(json.expires_in) || 3600;
  return {
    accessToken: json.access_token,
    expiresAt: Date.now() + expiresInSec * 1000,
  };
}

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt - TOKEN_SAFETY_MARGIN_MS > now) {
    return cachedToken.accessToken;
  }
  cachedToken = await fetchNewToken();
  return cachedToken.accessToken;
}

// --- Agent invoke + poll -----------------------------------------------------

function agentBaseUrl(agentName) {
  return `${FUSION_AI_BASE_URL}/api/fusion-ai/orchestrator/agent/v2/${encodeURIComponent(agentName)}`;
}

async function invokeAgent({ agentName, version, message, conversationId, token }) {
  const res = await fetch(`${agentBaseUrl(agentName)}/invokeAsync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversational: true,
      conversationId: conversationId || null,
      version,
      status: 'PUBLISHED',
      message,
      invocationMode: 'END_USER',
    }),
  });

  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`invokeAsync returned non-JSON response (status ${res.status}): ${text.slice(0, 500)}`);
  }
  if (!res.ok) {
    throw new Error(`invokeAsync failed (status ${res.status}): ${JSON.stringify(json)}`);
  }

  const jobId = json.jobId || json.jobID || json.id || json.job_id;
  if (!jobId) {
    throw new Error(`invokeAsync response did not include a jobId: ${JSON.stringify(json)}`);
  }
  return jobId;
}

async function getJobStatus({ agentName, jobId, token }) {
  const res = await fetch(`${agentBaseUrl(agentName)}/status/${encodeURIComponent(jobId)}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`status endpoint returned non-JSON response (status ${res.status}): ${text.slice(0, 500)}`);
  }
  if (!res.ok) {
    throw new Error(`status request failed (status ${res.status}): ${JSON.stringify(json)}`);
  }
  return json;
}

const TERMINAL_STATUSES = new Set(['COMPLETED', 'SUCCEEDED', 'SUCCESS', 'DONE', 'FAILED', 'ERROR', 'CANCELLED']);
const FAILURE_STATUSES = new Set(['FAILED', 'ERROR', 'CANCELLED']);

function jobStatusValue(job) {
  const raw = job.status || job.state || job.jobStatus || job.jobState;
  return typeof raw === 'string' ? raw.toUpperCase() : raw;
}

// Field names for the final answer are not documented for this API, so we
// try the shapes that are common for orchestrator/agent-style responses and
// fall back to returning the raw job payload rather than throwing.
function extractReplyText(job) {
  const candidates = [
    job.response,
    job.result,
    job.message,
    job.output,
    job.answer,
    job.reply,
    job.responseMessage,
    job.result?.message,
    job.result?.response,
    job.result?.output,
    job.data?.message,
    job.data?.response,
  ];

  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c;
  }

  // Array-of-messages shape, e.g. { messages: [{ role, content }] }
  const messageArrays = [job.messages, job.output?.messages, job.result?.messages];
  for (const arr of messageArrays) {
    if (Array.isArray(arr) && arr.length) {
      const last = arr[arr.length - 1];
      const text = last?.content ?? last?.text ?? last?.message;
      if (typeof text === 'string' && text.trim()) return text;
      if (text) return JSON.stringify(text);
    }
  }

  return null;
}

async function pollJob({ agentName, jobId, token, timeoutMs = 60_000, intervalMs = 1_500 }) {
  const start = Date.now();
  let lastJob = null;
  while (Date.now() - start < timeoutMs) {
    lastJob = await getJobStatus({ agentName, jobId, token });
    const status = jobStatusValue(lastJob);
    if (status && TERMINAL_STATUSES.has(status)) {
      if (FAILURE_STATUSES.has(status)) {
        throw new Error(`Agent job ${jobId} ended with status ${status}: ${JSON.stringify(lastJob)}`);
      }
      return lastJob;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Timed out waiting for agent job ${jobId} to complete (last status: ${JSON.stringify(lastJob)})`);
}

/**
 * Send one chat message to an Oracle Fusion AI agent and wait for the reply.
 * @param {{ agent: keyof typeof AGENTS, message: string, conversationId?: string }} params
 * @returns {Promise<{ conversationId: string|null, reply: string, raw: object }>}
 */
export async function chatWithAgent({ agent, message, conversationId }) {
  const def = AGENTS[agent];
  if (!def) throw new Error(`Unknown agent "${agent}"`);

  const token = await getAccessToken();
  const jobId = await invokeAgent({
    agentName: def.name,
    version: def.version,
    message,
    conversationId,
    token,
  });
  const job = await pollJob({ agentName: def.name, jobId, token });
  const reply = extractReplyText(job);
  const outConversationId = job.conversationId || job.conversationID || conversationId || null;

  return {
    conversationId: outConversationId,
    reply: reply ?? JSON.stringify(job),
    raw: job,
  };
}
