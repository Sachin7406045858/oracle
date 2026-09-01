import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { isKnownAgent } from './agents.js';
import { chatWithAgent } from './oracleClient.js';

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
    res.json({ conversationId: outConversationId, reply, raw });
  } catch (err) {
    console.error('[agent/chat] error:', err);
    res.status(502).json({ error: err.message || 'Agent request failed' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Oracle agent proxy listening on http://localhost:${PORT}`);
});
