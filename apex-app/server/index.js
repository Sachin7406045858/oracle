import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { isKnownAgent } from './agents.js';
import { chatWithAgent } from './oracleClient.js';

const REQUIRED_VAR_PAIRS = [
  ['TOKEN_URL', 'ORACLE_TOKEN_URL'],
  ['CLIENT_ID', 'ORACLE_CLIENT_ID'],
  ['CLIENT_SECRET', 'ORACLE_CLIENT_SECRET'],
  ['SCOPE', 'ORACLE_SCOPE'],
  ['USERNAME', 'ORACLE_USERNAME'],
  ['PASSWORD', 'ORACLE_PASSWORD'],
];
const missing = REQUIRED_VAR_PAIRS.filter(([a, b]) => !process.env[a] && !process.env[b]).map(([a, b]) => `${a} (or ${b})`);
if (missing.length) {
  console.warn('\n⚠️  apex-app/server/.env is missing: ' + missing.join(', '));
  console.warn('   The server will start, but /api/agent/chat and /api/ap-manager/chat will fail until these are set.');
  console.warn('   Copy server/.env.example to server/.env, fill in the real values, then restart this process.\n');
}

const app = express();
app.use(express.json());

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/agent/chat', async (req, res) => {
  const { agent, message, conversationId } = req.body || {};

  if (!agent || !isKnownAgent(agent)) {
    return res.status(400).json({ error: 'agent must be one of AP_MANAGER, EMPLOYEE_QUERY_AGENT' });
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const { conversationId: outConversationId, reply, raw } = await chatWithAgent({
      agent,
      message: message.trim(),
      conversationId: conversationId || null,
    });
    res.json({ conversationId: outConversationId, reply, raw, sourcesCount: countSources(raw) });
  } catch (err) {
    console.error('[agent/chat] error:', err);
    res.status(502).json({ error: err.message || 'Agent request failed' });
  }
});

// Dedicated live endpoint for the AP Manager chat: takes only { message },
// always starts a fresh conversation (conversationId: null) per the
// integration spec, and never leaks jobId/token/raw payload/debug info to
// the frontend — only the extracted reply text, or a plain error message.
app.post('/api/ap-manager/chat', async (req, res) => {
  const { message } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const { reply, raw } = await chatWithAgent({
      agent: 'AP_MANAGER',
      message: message.trim(),
      conversationId: null,
    });
    res.json({ reply, sourcesCount: countSources(raw) });
  } catch (err) {
    console.error('[ap-manager/chat] error:', err);
    res.status(502).json({ error: 'Unable to get a response from AP Manager. Please try again.' });
  }
});

// Real "sources" count for a job's answer, derived only from fields Oracle
// actually returns (confirmed via ORACLE_DEBUG logging against the live
// API: the status-endpoint payload can carry both `citations` and
// `supportingChunks` arrays). We count `citations` only, not the sum of
// both arrays: in the observed payloads `supportingChunks` is the set of
// retrieved passages *considered*, while `citations` is the subset Oracle
// actually cited in the answer — summing them would double count the same
// underlying documents and could show a "Sources" number bigger than what
// the answer actually references. Never fabricated — 0/absent hides the UI.
function countSources(raw) {
  if (!raw || typeof raw !== 'object') return 0;
  if (Array.isArray(raw.citations)) return raw.citations.length;
  if (Array.isArray(raw.supportingChunks)) return raw.supportingChunks.length;
  return 0;
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Oracle agent proxy listening on http://localhost:${PORT}`);
});
