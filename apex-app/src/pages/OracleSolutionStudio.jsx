import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import up from '../lib/uploads.js';
import D from '../data/oss-data.js';
import JobResultCard from '../components/JobResultCard.jsx';
import RichStatCard from '../components/RichStatCard.jsx';
import RichSubmitCard from '../components/RichSubmitCard.jsx';
import RichSubmittedCard from '../components/RichSubmittedCard.jsx';
import { parseRichResponse } from '../lib/richResponseParser.js';
import { recommendAgent } from '../lib/agentRecommender.js';
import '../styles/oracle-solution-studio-base.css';

const AGENT_LABELS = {
  AP_MANAGER: 'AP Manager',
  EMPLOYEE_QUERY_AGENT: 'Employee Queries',
};

// Generic per-agent, per-shape quick-action suggestions shown under a rich
// card. These are just suggested follow-up prompts (same idea as the
// existing suggested-prompt chips elsewhere in the app) — clicking one sends
// that exact text to the real live agent, it never fabricates a response.
const QUICK_ACTIONS = {
  EMPLOYEE_QUERY_AGENT: {
    stat: ['Apply one day Annual Leave', 'Show my compensation'],
    submitted: ['Show my leave balance'],
  },
  AP_MANAGER: {
    stat: ['Show invoices on payment hold', 'Create a new invoice'],
    submitted: ['List unpaid invoices'],
  },
};

// Welcome-state copy + starter prompts shown as the very first assistant
// bubble for each agent, before any real message has been sent. This is
// generic UI convenience copy (never claimed to be agent-generated content)
// — the prompts still send a real message to the live agent when clicked.
const WELCOME_CONFIG = {
  EMPLOYEE_QUERY_AGENT: {
    subtext: "I can check policies, pull your balances and pay, or file requests for you — just ask, or try one of these.",
    prompts: ['Show my leave balance', "What's my life insurance coverage?", 'Explain the payroll policy'],
  },
  AP_MANAGER: {
    subtext: 'I can check invoice status, flag payment holds, or help you process approvals — just ask, or try one of these.',
    prompts: ['Show invoices on payment hold', 'AP aging by supplier', 'Explain the Accounts Payable process'],
  },
};

// Short, generic follow-up chips shown under every assistant reply (not
// content-derived — just plausible next steps, same idea/shape as
// QUICK_ACTIONS above but not tied to a specific rich-card type). Clicking
// one sends that exact text to the live agent via sendLiveMessage, same as
// the rich-card quick actions.
const FOLLOWUP_SUGGESTIONS = {
  EMPLOYEE_QUERY_AGENT: ['Show my leave balance', "What's my life insurance coverage?"],
  AP_MANAGER: ['Show invoices on payment hold', 'List unpaid invoices'],
};

function AgentReply({ agentId, text, onQuickAction }) {
  const shape = parseRichResponse(text);
  if (!shape) return <JobResultCard text={text} />;
  try {
    if (shape.type === 'stat') {
      const actions = (QUICK_ACTIONS[agentId] && QUICK_ACTIONS[agentId].stat) || [];
      return <RichStatCard shape={shape} quickActions={actions} onQuickAction={onQuickAction} />;
    }
    if (shape.type === 'confirm') {
      return (
        <RichSubmitCard
          shape={shape}
          onConfirm={() => onQuickAction('Confirm & submit')}
          onEdit={() => onQuickAction('Edit details')}
        />
      );
    }
    if (shape.type === 'submitted') {
      const actions = (QUICK_ACTIONS[agentId] && QUICK_ACTIONS[agentId].submitted) || [];
      return <RichSubmittedCard shape={shape} quickActions={actions} onQuickAction={onQuickAction} />;
    }
  } catch {
    // Never let a rich-card rendering error blank out the response —
    // fall through to the always-safe plain markdown rendering.
  }
  return <JobResultCard text={text} />;
}

const ACCENT_OPTIONS = [
  { color: '#E31837', text: '#FF5C74' },
  { color: '#C74634', text: '#F0937A' },
  { color: '#7A1C2B', text: '#D96A7C' },
];

const THEMES = {
  dark: {
    bg0: '#0C0D0F', bg1: '#161719', bg2: '#1E2024', bg3: '#24262A', bg4: '#2C2E34',
    bubble: '#26282D',
    border1: '#26282C', border2: '#2E3035', border3: '#232529', border4: '#34363B', border5: '#4A4D52',
    text0: '#E9EAEC', text0b: '#F2F3F5', text1: '#A8ABB0', text2: '#8B8E93', text3: '#6E7176',
  },
  light: {
    bg0: '#F4F5F6', bg1: '#FFFFFF', bg2: '#F0F1F3', bg3: '#E8E9EC', bg4: '#DEE0E4',
    bubble: '#EDEFF2',
    border1: '#E1E3E7', border2: '#D8DADE', border3: '#E7E8EB', border4: '#CBCDD3', border5: '#B7BAC1',
    text0: '#1B1D21', text0b: '#0C0D0F', text1: '#54575E', text2: '#71747B', text3: '#8A8D94',
  },
};

function StarIcon({ filled, stroke }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? '#E8B93B' : 'none'} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  );
}
function AgentIcon({ d, color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
  );
}

export default function OracleSolutionStudio() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('erpAiSession')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [leftTab, setLeftTab] = useState('fusion');
  const [externalSel, setExternalSel] = useState(null);
  const [extQuery, setExtQuery] = useState('');
  const [extFavIds, setExtFavIds] = useState([]);
  const [extFavsOpen, setExtFavsOpen] = useState(false);
  const [agentQuery, setAgentQuery] = useState('');
  const [fusionAgentSel, setFusionAgentSel] = useState(null);
  const [agentChat, setAgentChat] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [theme, setTheme] = useState('light');
  const [accentIdx, setAccentIdx] = useState(0);
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);
  const [agentStatusFilter, setAgentStatusFilter] = useState('active');

  // Studio (right panel) state
  const [studioEmails, setStudioEmails] = useState([]);
  const [studioEmailInput, setStudioEmailInput] = useState('');
  const [studioEmailOpen, setStudioEmailOpen] = useState(false);
  const [studioEmailStatus, setStudioEmailStatus] = useState('');
  const [studioEmailError, setStudioEmailError] = useState(false);
  const [studioEmailSent, setStudioEmailSent] = useState(false);
  const [studioUndoSecs, setStudioUndoSecs] = useState(0);
  const [notes, setNotes] = useState([]);
  const [outputs] = useState([]);
  // Generic export-batch state: any agent reply that resolves to a rich
  // "stat" shape hands Studio a batch of { label, sublabel } exportable
  // facts. Studio renders them as a selectable checklist and exports only
  // the items the user checks — no per-agent export logic lives here beyond
  // building the initial items list. Shape: { title, unit, loading, error,
  // status, items: [{ key, label, sublabel, selected }] } or null.
  const [exportBatch, setExportBatch] = useState(null);
  const exportBatchTimerRef = useRef(null);
  // Context-aware agent suggestion banner above the composer.
  const [suggestedAgent, setSuggestedAgent] = useState(null);
  const [suggestionDismissedFor, setSuggestionDismissedFor] = useState('');
  const undoTimerRef = useRef(null);

  // Generic hook: any agent hands Studio a batch of { label, sublabel } items
  // once its response contains exportable facts. Sets loading state
  // immediately and opens the Studio panel, then after a short delay
  // populates the checklist. Only replaces state if the batch title still
  // matches (avoids stale-async overwrites if a newer batch started).
  function pushExportBatch(title, unit, items) {
    clearTimeout(exportBatchTimerRef.current);
    setExportBatch({ title, unit, loading: true, error: null, status: '', items: [] });
    setRightOpen(true);
    exportBatchTimerRef.current = setTimeout(() => {
      setExportBatch((prev) => {
        if (!prev || prev.title !== title) return prev;
        return {
          title,
          unit,
          loading: false,
          error: null,
          status: '',
          items: items.map((it, i) => ({
            key: `${title.replace(/\s+/g, '_')}-${i}-${Date.now()}`,
            label: it.label,
            sublabel: it.sublabel,
            selected: false,
          })),
        };
      });
    }, 700);
  }

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isAllowedEmail = (v) => isValidEmail(v) && v.toLowerCase().endsWith(D.EMAIL_DOMAIN);

  function studioEmailChange(e) {
    const v = e.target.value;
    const bad = isValidEmail(v.trim()) && !isAllowedEmail(v.trim());
    setStudioEmailInput(v);
    setStudioEmailError(bad);
    if (bad) setStudioEmailStatus(D.EMAIL_DOMAIN_MSG);
    else setStudioEmailStatus((s) => (studioEmailError ? '' : s));
  }
  function studioEmailKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const v = studioEmailInput.trim().replace(/,$/, '');
      if (!isValidEmail(v)) return;
      if (!isAllowedEmail(v)) {
        setStudioEmailStatus(D.EMAIL_DOMAIN_MSG);
        setStudioEmailError(true);
        setStudioEmailSent(false);
        return;
      }
      setStudioEmails((list) => [...new Set([...list, v])]);
      setStudioEmailInput('');
      setStudioEmailStatus('');
      setStudioEmailError(false);
    }
  }
  const studioSendDisabled = (() => {
    const pending = studioEmailInput.trim();
    const badPending = isValidEmail(pending) && !isAllowedEmail(pending);
    return !studioEmails.length || studioEmails.some((a) => !isAllowedEmail(a)) || badPending;
  })();
  function studioSendEmail() {
    if (!studioEmails.length) { setStudioEmailStatus('Add at least one address'); return; }
    if (studioEmails.some((a) => !isAllowedEmail(a))) { setStudioEmailStatus(D.EMAIL_DOMAIN_MSG); setStudioEmailError(true); return; }
    setStudioEmailError(false);
    setStudioEmailStatus('Sending…');
    setStudioEmailSent(false);
    setTimeout(() => {
      setStudioUndoSecs(10);
      setStudioEmailSent(false);
      setStudioEmailStatus('Sending in 10s — you can still revert');
      clearInterval(undoTimerRef.current);
      undoTimerRef.current = setInterval(() => {
        setStudioUndoSecs((s0) => {
          const s = s0 - 1;
          if (s <= 0) {
            clearInterval(undoTimerRef.current);
            const n = studioEmails.length;
            setStudioEmailSent(true);
            setStudioEmailStatus('Sent to ' + n + ' recipient' + (n > 1 ? 's' : ''));
            return 0;
          }
          setStudioEmailStatus('Sending in ' + s + 's — you can still revert');
          return s;
        });
      }, 1000);
    }, 600);
  }
  function studioUndoEmail() {
    clearInterval(undoTimerRef.current);
    setStudioUndoSecs(0);
    setStudioEmailSent(false);
    setStudioEmailStatus('Email reverted — not sent');
  }
  function downloadBlob(content, mime, filename) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  // Derived export-batch state (Studio panel). Export actions operate on the
  // selected checklist items when a batch is active; otherwise fall back to
  // the legacy quick-export mock.
  const exportBatchItemsRaw = (exportBatch && exportBatch.items) || [];
  const exportBatchSelected = exportBatchItemsRaw.filter((i) => i.selected);
  const hasExportBatch = !!exportBatch;
  const exportBatchReady = hasExportBatch && !exportBatch.loading && !exportBatch.error;
  const exportBatchNoneSelected = exportBatchReady && exportBatchItemsRaw.length > 0 && exportBatchSelected.length === 0;
  const exportButtonsDisabled = exportBatchNoneSelected;
  const exportHint = exportBatchNoneSelected ? 'Select at least one item to export' : '';
  const exportBatchMeta = exportBatchReady
    ? `${exportBatchItemsRaw.length} item${exportBatchItemsRaw.length === 1 ? '' : 's'} · ${exportBatchSelected.length} selected`
    : 'Preparing exportable items…';
  const exportBatchHasMultiple = exportBatchReady && exportBatchItemsRaw.length > 1;
  const selectAllLabel = exportBatchSelected.length === exportBatchItemsRaw.length && exportBatchItemsRaw.length > 0 ? 'Clear all' : 'Select all';

  function onSelectAllExport() {
    const allSelected = exportBatchSelected.length === exportBatchItemsRaw.length;
    setExportBatch((p) => (p ? { ...p, items: p.items.map((i) => ({ ...i, selected: !allSelected })) } : p));
  }
  function toggleExportItem(key) {
    setExportBatch((p) => (p ? { ...p, items: p.items.map((x) => (x.key === key ? { ...x, selected: !x.selected } : x)), status: '' } : p));
  }
  function exportSelectedXls() {
    try {
      const rowsHtml = exportBatchSelected.map((i) => `<tr><td>${i.label}</td><td>${i.sublabel}</td></tr>`).join('');
      const xls = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><style>th{background:#eee}td,th{border:1px solid #ccc;padding:4px 8px}</style></head><body><table><tr><th>Item</th><th>Value</th></tr>${rowsHtml}</table></body></html>`;
      downloadBlob(xls, 'application/vnd.ms-excel', exportBatch.title.replace(/\s+/g, '_') + '.xls');
      setExportBatch((p) => (p ? { ...p, error: null, status: `Exported ${exportBatchSelected.length} item${exportBatchSelected.length > 1 ? 's' : ''} to XLS` } : p));
    } catch {
      setExportBatch((p) => (p ? { ...p, error: "Couldn't generate the XLS file — try again." } : p));
    }
  }
  function exportSelectedPdf() {
    try {
      const rowsHtml = exportBatchSelected.map((i) => `<tr><td>${i.label}</td><td>${i.sublabel}</td></tr>`).join('');
      const html = `<html><head><title>${exportBatch.title}</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#1a1a1a}h1{font-size:18px}p{font-size:13px;line-height:1.6;color:#666}table{border-collapse:collapse;width:100%;margin-top:16px;font-size:12px}th,td{border:1px solid #ddd;padding:6px 10px;text-align:left}th{background:#f4f4f4}</style></head><body><h1>${exportBatch.title}</h1><p>${exportBatchSelected.length} item${exportBatchSelected.length > 1 ? 's' : ''} selected · Generated by Oracle ERP AI Assistant · ${new Date().toLocaleDateString()}</p><table><thead><tr><th>Item</th><th>Value</th></tr></thead><tbody>${rowsHtml}</tbody></table><script>window.onload=function(){window.print()}</script></body></html>`;
      const w = window.open('', '_blank');
      if (!w) throw new Error('popup-blocked');
      w.document.write(html);
      w.document.close();
      setExportBatch((p) => (p ? { ...p, error: null, status: `Opened PDF with ${exportBatchSelected.length} item${exportBatchSelected.length > 1 ? 's' : ''}` } : p));
    } catch {
      setExportBatch((p) => (p ? { ...p, error: "Couldn't generate the PDF — check your popup blocker and try again." } : p));
    }
  }
  function studioXls() {
    if (hasExportBatch) { if (!exportBatchNoneSelected) exportSelectedXls(); return; }
    const rows = D.PO_ROWS;
    const rowsHtml = `<tr><th>PO Number</th><th>Supplier</th><th>Amount</th><th>Due</th><th>Days Late</th><th>Impact</th></tr>` +
      rows.map((r) => `<tr><td>${r.po}</td><td>${r.supplier}</td><td>${r.amount}</td><td>${r.due}</td><td>${r.days}</td><td>${r.impact}</td></tr>`).join('');
    const xls = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><style>th{background:#eee}td,th{border:1px solid #ccc;padding:4px 8px}</style></head><body><table>${rowsHtml}</table></body></html>`;
    downloadBlob(xls, 'application/vnd.ms-excel', 'Delayed_PO_Report.xls');
  }
  function studioPdf() {
    if (hasExportBatch) { if (!exportBatchNoneSelected) exportSelectedPdf(); return; }
    const rows = D.PO_ROWS;
    const rowsHtml = rows.map((r) => `<tr><td>${r.po}</td><td>${r.supplier}</td><td style="text-align:right">${r.amount}</td><td>${r.impact}</td></tr>`).join('');
    const html = `<html><head><title>Delayed PO Report</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#1a1a1a}h1{font-size:18px}p{font-size:13px;line-height:1.6}table{border-collapse:collapse;width:100%;margin-top:16px;font-size:12px}th,td{border:1px solid #ddd;padding:6px 10px;text-align:left}th{background:#f4f4f4}</style></head><body><h1>Delayed PO Report</h1><p style="color:#888;font-size:11px">Generated by Oracle ERP AI Assistant · ${new Date().toLocaleDateString()}</p><p>14 purchase orders past their promised delivery date, totaling $2.41M in open value. The five highest-impact orders:</p><table><thead><tr><th>PO</th><th>Supplier</th><th>Amount</th><th>Impact</th></tr></thead><tbody>${rowsHtml}</tbody></table><script>window.onload=function(){window.print()}</script></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  }
  function studioToggleEmail() {
    if (hasExportBatch && exportBatchNoneSelected) return;
    setStudioEmailOpen((v) => !v);
    setStudioEmailStatus('');
    setStudioEmailSent(false);
  }
  function onAddNote() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setNotes((n) => [{ key: Date.now(), text: '', time, saved: false }, ...n]);
  }
  function noteSave(key) {
    setNotes((n) => n.map((x) => (x.key === key ? { ...x, saved: true } : x)));
  }
  function noteStartEdit(key) {
    setNotes((n) => n.map((x) => (x.key === key ? { ...x, saved: false } : x)));
  }
  function noteEdit(key, text) {
    setNotes((n) => n.map((x) => (x.key === key ? { ...x, text } : x)));
  }
  function noteRemove(key) {
    setNotes((n) => n.filter((x) => x.key !== key));
  }
  const hasNotes = notes.length > 0;
  const hasOutputs = outputs.length > 0;
  const noOutputs = outputs.length === 0 && notes.length === 0 && !exportBatch;

  // Live agent chat (real backend calls, replacing mocked free-text replies)
  const [liveAgentId, setLiveAgentId] = useState('AP_MANAGER');
  const [liveMessages, setLiveMessages] = useState([]); // { role: 'user'|'assistant'|'error', text }
  const [liveConversationId, setLiveConversationId] = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState({}); // { [messageIndex]: boolean }
  const LIVE_AGENTS = [
    { id: 'AP_MANAGER', label: 'AP Manager' },
    { id: 'EMPLOYEE_QUERY_AGENT', label: 'Employee Query (HR)' },
  ];


  const activeAgent = D.AGENTS[0]; // agentId is never set from UI in the original app

  function selectFusionAgent(a) {
    setFusionAgentSel(a.id);
    if (a.id === 'ap-manager') {
      // AP Manager has no static/demo placeholder response — selecting it
      // just switches the live agent; the welcome/empty state stays until
      // the user actually sends a message, which goes straight to the
      // live Oracle API.
      setAgentChat(null);
      setLiveAgentId('AP_MANAGER');
      setLiveConversationId(null);
      return;
    }
    setAgentChat(a.id);
    if (a.id === 'emp-queries') { setLiveAgentId('EMPLOYEE_QUERY_AGENT'); setLiveConversationId(null); }
  }

  function selectExternal(id) {
    setExternalSel(id);
  }
  function toggleExtFav(id, e) {
    e.stopPropagation();
    setExtFavIds((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  const searching = agentQuery.trim().length > 0;
  const searchMatches = useMemo(() => {
    const q = agentQuery.trim().toLowerCase();
    if (!q) return [];
    return D.FUSION_AGENTS.filter((a) => a.name.toLowerCase().includes(q) || a.cat.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));
  }, [agentQuery]);

  const extSearching = extQuery.trim().length > 0;
  const extMatches = useMemo(() => {
    const q = extQuery.trim().toLowerCase();
    return q ? D.EXTERNAL_AGENTS.filter((s) => s.name.toLowerCase().includes(q)) : D.EXTERNAL_AGENTS;
  }, [extQuery]);

  const chatAgent = D.FUSION_AGENTS.find((x) => x.id === agentChat) || { name: '', cat: '', desc: '' };

  function extRow(s, compact) {
    const active = externalSel === s.id;
    const isFav = extFavIds.includes(s.id);
    const bg = active ? 'var(--bg3)' : 'transparent';
    const border = active ? 'var(--border4)' : 'transparent';
    const iconBg = active ? ACCENT : 'var(--bg3)';
    const iconColor = active ? '#fff' : 'var(--text1)';
    const favTitle = isFav ? 'Remove from favorites' : 'Add to favorites';
    if (compact) {
      return (
        <div key={s.id} className="dc-c125" style={{ background: bg }} onClick={() => selectExternal(s.id)}>
          <div className="dc-c126" style={{ background: iconBg }}><AgentIcon d={s.icon} color={iconColor} /></div>
          <span className="dc-c127">{s.name}</span>
        </div>
      );
    }
    return (
      <div key={s.id} className="dc-c134" style={{ background: bg, border: `1px solid ${border}` }} onClick={() => selectExternal(s.id)}>
        <div className="dc-c135" style={{ background: iconBg }}><AgentIcon d={s.icon} color={iconColor} /></div>
        <span className="dc-c127">{s.name}</span>
        <button title={favTitle} className="dc-c136" onClick={(e) => toggleExtFav(s.id, e)}>
          <StarIcon filled={isFav} stroke={isFav ? '#E8B93B' : 'var(--text3)'} />
        </button>
      </div>
    );
  }

  function renderSuggestedPrompt(t, i) {
    return (
      <button key={i} className="dc-c248" onClick={() => onPromptClick(t)}>{t}</button>
    );
  }
  function onPromptClick(t) {
    // Every suggested prompt calls the live API directly on click — no
    // predefined/static response is ever shown for any agent.
    setChatInput('');
    sendLiveMessage(t);
  }

  // Context-aware agent suggestion: as the user types, check if their
  // wording strongly and unambiguously suggests the other agent. Never
  // auto-switch — only surface a dismissible banner; the user clicks
  // "Switch" to actually change agents.
  useEffect(() => {
    const suggestion = recommendAgent(chatInput, liveAgentId);
    if (suggestion && chatInput.trim() !== suggestionDismissedFor) {
      setSuggestedAgent(suggestion);
    } else {
      setSuggestedAgent(null);
    }
  }, [chatInput, liveAgentId, suggestionDismissedFor]);

  function switchToSuggestedAgent() {
    if (!suggestedAgent) return;
    setLiveAgentId(suggestedAgent);
    setLiveConversationId(null);
    setSuggestedAgent(null);
  }
  function dismissSuggestion() {
    setSuggestionDismissedFor(chatInput.trim());
    setSuggestedAgent(null);
  }

  function submitInput() {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput('');
    sendLiveMessage(text);
  }

  async function sendLiveMessage(text) {
    setLiveMessages((m) => [...m, { role: 'user', text }]);
    setLiveLoading(true);
    try {
      const isApManager = liveAgentId === 'AP_MANAGER';
      const res = await fetch(isApManager ? '/api/ap-manager/chat' : '/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isApManager
            ? { message: text }
            : { agent: liveAgentId, message: text, conversationId: liveConversationId }
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // AP Manager never surfaces raw/debug error detail to the user —
        // just the plain fallback message the backend already returns.
        throw new Error(isApManager ? (data.error || 'Unable to get a response from AP Manager. Please try again.') : (data.error || `Request failed (${res.status})`));
      }
      if (data.conversationId) setLiveConversationId(data.conversationId);
      const replyText = data.reply || '(no response)';
      // sourcesCount is real-derived-only from the backend (see
      // server/index.js countSources) — 0/absent means no Sources pill.
      const sourcesCount = Number.isFinite(data.sourcesCount) ? data.sourcesCount : 0;
      setLiveMessages((m) => [...m, { role: 'assistant', text: replyText, sourcesCount }]);
      // Keep the Studio export panel's item generically in sync with the
      // last rich stat card the user saw, whichever agent produced it.
      const shape = parseRichResponse(replyText);
      if (shape && shape.type === 'stat' && Array.isArray(shape.rows) && shape.rows.length) {
        // Build a short title like the design's own example, e.g.
        // "Annual Leave — 18 days remaining": prefer the shape's lead
        // sentence/title, falling back to a heading + unit summary line.
        const firstLine = `${shape.heading || ''}${shape.unit ? ' ' + shape.unit : ''}`.trim();
        const title = shape.title
          ? (firstLine ? `${shape.title} — ${firstLine}` : shape.title)
          : (firstLine || 'Result');
        pushExportBatch(title, shape.unit || 'item', shape.rows.map((r) => ({ label: r.label, sublabel: r.value })));
      }
    } catch (err) {
      const isApManager = liveAgentId === 'AP_MANAGER';
      const fallback = isApManager ? 'Unable to get a response from AP Manager. Please try again.' : 'Something went wrong contacting the agent.';
      setLiveMessages((m) => [...m, { role: 'error', text: isApManager ? fallback : (err.message || fallback) }]);
    } finally {
      setLiveLoading(false);
    }
  }

  const themeVars = THEMES[theme];
  const accent = ACCENT_OPTIONS[accentIdx];
  const ACCENT = accent.color;
  const rootStyle = {
    '--accent': accent.color,
    '--accentText': accent.text,
    ...Object.fromEntries(Object.entries(themeVars).map(([k, v]) => [`--${k}`, v])),
  };

  const showEmptyState = !agentChat && liveMessages.length === 0 && !liveLoading;

  function logout() {
    localStorage.removeItem('erpAiSession');
    navigate('/login');
  }

  return (
    <div id="rootEl" className="dc-c90" style={rootStyle}>
      <header data-screen-label="Top navigation" className="dc-c91">
        <div className="dc-c3">
          <a href="#/oracle-solution-studio" className="dc-c4" onClick={(e) => e.preventDefault()}>
            <img src={up('TM_Logo_Color_Pos_RGB.svg')} alt="Tech Mahindra" className="dc-c5" />
          </a>
          <div className="dc-c92" />
          <span className="dc-c93">Oracle Turning Edge</span>
        </div>

        <div className="dc-c9" />

        <div className="dc-c94">
          <img src={up('icons/icon-80de2c921a.svg')} width="15" height="15" alt="" className="dc-c11" />
          <input placeholder="Search agents, sources, conversations…" className="dc-c95" />
          <span className="dc-c96">⌘K</span>
        </div>

        <div className="dc-c14" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginRight: '4px' }}>
            {ACCENT_OPTIONS.map((opt, i) => (
              <button
                key={opt.color}
                title={opt.color}
                onClick={() => setAccentIdx(i)}
                style={{
                  width: 16, height: 16, borderRadius: '50%', background: opt.color, cursor: 'pointer',
                  border: i === accentIdx ? '2px solid var(--text0)' : '2px solid transparent',
                  padding: 0,
                }}
              />
            ))}
          </div>
          <button title="Toggle theme" className="dc-c99" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
            <img src={up('icons/icon-a638347ce9.svg')} width="18" height="18" alt="" style={{ display: theme === 'dark' ? '' : 'none' }} />
            <img src={up('icons/icon-7c44d6e7c1.svg')} width="18" height="18" alt="" style={{ display: theme === 'dark' ? 'none' : '' }} />
          </button>
          <div className="dc-c19" style={{ position: 'relative' }}>
            <div className="dc-c102" onClick={() => { setAgentMenuOpen((v) => !v); setUserMenuOpen(false); }}>
              <div className="dc-c103">
                <img src={up('icons/icon-92a3531814.svg')} width="14" height="14" alt="" />
              </div>
              <span className="dc-c22">{D.AGENTS[0].name}</span>
              <img src={up('icons/icon-40e62d5896.svg')} width="13" height="13" alt="" className="dc-c23" style={{ transform: agentMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </div>
            {agentMenuOpen && (
              <div className="dc-c104" style={{ width: 320 }}>
                {D.AGENTS.map((a) => (
                  <div key={a.id} className="dc-c105" onClick={() => setAgentMenuOpen(false)}>
                    <span style={{ flex: 1 }}>{a.name}</span>
                    {a.id === D.AGENTS[0].id && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent,#E31837)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    )}
                  </div>
                ))}
                <div className="dc-c106" />
                <div className="dc-c105" style={{ justifyContent: 'center', color: 'var(--text1)' }} onClick={() => setAgentMenuOpen(false)}>Configure agent</div>
              </div>
            )}
          </div>
          <div className="dc-c19" style={{ position: 'relative' }}>
            <div className="dc-c102" onClick={() => { setUserMenuOpen((v) => !v); setAgentMenuOpen(false); }}>
              <div className="dc-c103">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <span className="dc-c22">Aarthi</span>
              <img src={up('icons/icon-40e62d5896.svg')} width="13" height="13" alt="" className="dc-c23" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </div>
            {userMenuOpen && (
              <div className="dc-c104">
                <div className="dc-c105" onClick={() => navigate('/about')}>
                  <img src={up('icons/icon-1aae375c00.svg')} width="15" height="15" alt="" />
                  About
                </div>
                <div className="dc-c105" onClick={() => navigate('/settings')}>
                  <img src={up('icons/icon-1c774a4f62.svg')} width="15" height="15" alt="" />
                  Settings
                </div>
                <div className="dc-c106" />
                <div className="dc-c27 dc-c27-hv2" onClick={logout}>
                  <img src={up('icons/icon-98894ca471.svg')} width="15" height="15" alt="" />
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="dc-c107">
        {/* LEFT: FUSION AGENTS */}
        {leftOpen ? (
          <aside data-screen-label="Fusion Agents panel" className="dc-c108">
            <div className="dc-c109">
              <span className="dc-c110">{leftTab === 'external' ? 'Fusion External Agents' : 'Oracle Fusion Agents'}</span>
              <div className="dc-c111">
                <span className="dc-c112">{leftTab === 'external' ? D.EXTERNAL_AGENTS.length : D.FUSION_AGENTS.length} agents</span>
                <button title="Collapse panel" className="dc-c113" onClick={() => setLeftOpen(false)}>
                  <img src={up('icons/icon-77b0ed8361.svg')} width="15" height="15" alt="" />
                </button>
              </div>
            </div>

            <div className="dc-c114">
              <div className="dc-c115">
                <div className="dc-c116" style={{ transform: leftTab === 'external' ? 'translateX(100%)' : 'translateX(0)' }} />
                <button className="dc-c117" style={{ color: leftTab !== 'external' ? 'var(--text0)' : 'var(--text2)' }} onClick={() => setLeftTab('fusion')}>Fusion Agents</button>
                <button className="dc-c117" style={{ color: leftTab === 'external' ? 'var(--text0)' : 'var(--text2)' }} onClick={() => setLeftTab('external')}>Fusion External Agents</button>
              </div>
            </div>

            {leftTab !== 'external' ? (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                {!searching && (
                  <div style={{ flex: 'none', padding: '0 16px 10px', borderBottom: '1px solid var(--border3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {[
                        { key: 'active', label: 'ACTIVE', dot: '#4ECB71' },
                        { key: 'inactive', label: 'LAUNCHING SOON', dot: 'var(--text3)' },
                        { key: 'unavailable', label: 'UPCOMING', dot: '#E5484D' },
                      ].map((g) => {
                        const count = D.FUSION_AGENTS.filter((a) => (a.status || 'active') === g.key).length;
                        const sel = agentStatusFilter === g.key;
                        return (
                          <div
                            key={g.key}
                            onClick={() => setAgentStatusFilter((f) => (f === g.key ? null : g.key))}
                            style={{
                              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                              padding: '7px 4px', borderRadius: 8, cursor: 'pointer', userSelect: 'none',
                              background: sel ? 'var(--bg2)' : 'transparent',
                              border: `1px solid ${sel ? 'var(--border2)' : 'transparent'}`,
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: 99, background: g.dot, flex: 'none' }} />
                            <span style={{ fontSize: 10, fontWeight: 650, color: 'var(--text2)', letterSpacing: '.03em', whiteSpace: 'nowrap' }}>{g.label}</span>
                            <span style={{ fontSize: 10, fontWeight: 650, color: 'var(--text3)' }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="dc-c118">
                  <div className="dc-c119">
                    <img src={up('icons/icon-139778027f.svg')} width="14" height="14" alt="" />
                    <input placeholder="Search agents" className="dc-c120" value={agentQuery} onChange={(e) => setAgentQuery(e.target.value)} />
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  {!searching && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {D.FUSION_AGENTS.filter((a) => !agentStatusFilter || (a.status || 'active') === agentStatusFilter).map((a) => {
                        const meta = D.STATUS_META[a.status || 'active'];
                        const active = fusionAgentSel === a.id;
                        return (
                          <div
                            key={a.id}
                            onClick={() => selectFusionAgent(a)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8, padding: 10, borderRadius: 10, cursor: 'pointer',
                              background: active ? 'var(--bg3)' : 'transparent',
                              border: `1px solid ${active ? 'var(--border4)' : 'transparent'}`,
                            }}
                          >
                            <span style={{ flex: 1, minWidth: 0, fontSize: '12.5px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</span>
                            <span style={{ flex: 'none', fontSize: 10, fontWeight: 600, color: 'var(--text3)', background: 'var(--bg3)', borderRadius: 99, padding: '2px 8px', letterSpacing: '.02em' }}>{a.cat}</span>
                            <span style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: meta.color, letterSpacing: '.02em' }}>
                              <span style={{ width: 5, height: 5, borderRadius: 99, background: meta.color }} />{meta.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {searching && (
                    <div>
                      <div className="dc-c138">{searchMatches.length}{searchMatches.length === 1 ? ' MATCH' : ' MATCHES'}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {searchMatches.map((a) => {
                          const meta = D.STATUS_META[a.status || 'active'];
                          const active = fusionAgentSel === a.id;
                          return (
                            <div
                              key={a.id}
                              onClick={() => selectFusionAgent(a)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 10, cursor: 'pointer',
                                background: active ? 'var(--bg3)' : 'transparent',
                                border: `1px solid ${active ? 'var(--border4)' : 'transparent'}`,
                              }}
                            >
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '12.5px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>{a.cat} · {a.desc}</div>
                              </div>
                              <span style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: meta.color, letterSpacing: '.02em' }}>
                                <span style={{ width: 5, height: 5, borderRadius: 99, background: meta.color }} />{meta.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <div className="dc-c118">
                  <div className="dc-c119">
                    <img src={up('icons/icon-139778027f.svg')} width="14" height="14" alt="" />
                    <input placeholder="Search agents" className="dc-c120" value={extQuery} onChange={(e) => setExtQuery(e.target.value)} />
                  </div>
                </div>

                {extFavIds.length > 0 && (
                  <div className="dc-c121">
                    <div className="dc-c122" onClick={() => setExtFavsOpen((v) => !v)}>
                      <img src={up('icons/icon-bcf1f58498.svg')} width="11" height="11" alt="" />
                      <span className="dc-c9">FAVORITES</span>
                      <img src={up('icons/icon-a2b75fab24.svg')} width="11" height="11" alt="" className="dc-c123" style={{ transform: extFavsOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                    </div>
                    {extFavsOpen && (
                      <div className="dc-c124">
                        {extFavIds.map((id) => D.EXTERNAL_AGENTS.find((s) => s.id === id)).filter(Boolean).map((s) => extRow(s, true))}
                      </div>
                    )}
                  </div>
                )}

                <div className="dc-c144">
                  {extSearching && <div className="dc-c138">{extMatches.length}{extMatches.length === 1 ? ' MATCH' : ' MATCHES'}</div>}
                  <div>{extMatches.map((s) => extRow(s, false))}</div>
                </div>
              </div>
            )}

            <div className="dc-c145">
              <span className="dc-c146" />
              <span className="dc-c147">Agents launch Oracle's native agent experience</span>
            </div>
          </aside>
        ) : (
          <aside className="dc-c148">
            <button title="Expand agents" className="dc-c149" onClick={() => setLeftOpen(true)}>
              <img src={up('icons/icon-622c38169f.svg')} width="15" height="15" alt="" />
            </button>
            <img src={up('icons/icon-251b32b4ef.svg')} width="17" height="17" alt="" />
            <span className="dc-c150">FUSION AGENTS</span>
          </aside>
        )}

        {/* MIDDLE: CONVERSATION */}
        <main data-screen-label="AI conversation workspace" className="dc-c151">
          <div className="dc-c185">
            <div className="dc-c186">
              {showEmptyState && (() => {
                const welcome = WELCOME_CONFIG[liveAgentId] || WELCOME_CONFIG.EMPLOYEE_QUERY_AGENT;
                const agentLabel = LIVE_AGENTS.find((a) => a.id === liveAgentId)?.label || '';
                return (
                  <div className="dc-c51">
                    <div className="dc-c188">
                      <div className="dc-c189">{activeAgent.initials}</div>
                      <span className="dc-c190">{agentLabel}</span>
                      <span className="dc-c170">· Oracle Fusion AI agent</span>
                    </div>
                    <div style={{ maxWidth: '70%', background: 'var(--bubble)', borderRadius: '4px 16px 16px 16px', padding: '13px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text0b)' }}>Hi Aarthi, how can I help?</div>
                      <div style={{ fontSize: '12.5px', lineHeight: 1.55, color: 'var(--text2)' }}>{welcome.subtext}</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {welcome.prompts.map((t, i) => (
                        <button key={i} className="dc-c248" onClick={() => onPromptClick(t)}>{t}</button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {agentChat && (
                <div>
                  <div className="dc-c58">
                    <div className="dc-c187">Show me {chatAgent.name}</div>
                  </div>
                  <div className="dc-c220">
                    <div className="dc-c188">
                      <div className="dc-c189">{activeAgent.initials}</div>
                      <span className="dc-c190">{activeAgent.name}</span>
                      <span className="dc-c170">· Oracle Fusion agent</span>
                    </div>
                    <div className="dc-c159">
                      <h3 className="dc-c236">{chatAgent.name}</h3>
                      <span className="dc-c161">{(chatAgent.cat || '').toUpperCase()}</span>
                    </div>
                    <p className="dc-c191">{chatAgent.desc}</p>
                  </div>
                </div>
              )}

              {liveMessages.map((m, i) => (
                <div key={i}>
                  {m.role === 'user' && (
                    <div className="dc-c58">
                      <div className="dc-c187" style={{ background: 'var(--accent,#E31837)', color: '#fff', borderRadius: 18 }}>{m.text}</div>
                    </div>
                  )}
                  {m.role === 'assistant' && (
                    <div className="dc-c51">
                      <div className="dc-c188">
                        <div className="dc-c189">{activeAgent.initials}</div>
                        <span className="dc-c190">{LIVE_AGENTS.find((a) => a.id === liveAgentId)?.label}</span>
                        <span className="dc-c170">· Oracle Fusion AI agent</span>
                      </div>
                      <AgentReply agentId={liveAgentId} text={m.text} onQuickAction={sendLiveMessage} />
                      {m.sourcesCount > 0 && (
                        <div>
                          <button
                            className="dc-c248"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                            onClick={() => setExpandedSources((s) => ({ ...s, [i]: !s[i] }))}
                          >
                            📄 Sources ({m.sourcesCount})
                          </button>
                          {expandedSources[i] && (
                            <div style={{ marginTop: 6, fontSize: '11.5px', color: 'var(--text2)' }}>
                              {m.sourcesCount} source{m.sourcesCount > 1 ? 's' : ''} found
                            </div>
                          )}
                        </div>
                      )}
                      {(FOLLOWUP_SUGGESTIONS[liveAgentId] || []).length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {FOLLOWUP_SUGGESTIONS[liveAgentId].map((t, ti) => (
                            <button key={ti} className="dc-c248" onClick={() => sendLiveMessage(t)}>{t}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {m.role === 'error' && (
                    <div className="dc-c51" style={{ color: '#E5484D' }}>
                      <span>Error: {m.text}</span>
                    </div>
                  )}
                </div>
              ))}

              {liveLoading && (
                <div className="dc-c51">
                  <div className="dc-c188">
                    <div className="dc-c189">{activeAgent.initials}</div>
                    <span className="dc-c190">{LIVE_AGENTS.find((a) => a.id === liveAgentId)?.label}</span>
                    <span className="dc-c170">· thinking…</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="dc-c246">
            <div className="dc-c247" style={{ alignItems: 'center', gap: '8px' }}>
              <select
                aria-label="Select Oracle Fusion agent"
                value={liveAgentId}
                onChange={(e) => { setLiveAgentId(e.target.value); setLiveConversationId(null); }}
                className="dc-c248"
                style={{ cursor: 'pointer' }}
              >
                {LIVE_AGENTS.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
              {(liveAgentId === 'AP_MANAGER' ? D.AGENT_PROMPTS.ap : D.AGENT_PROMPTS.r2r).map(renderSuggestedPrompt)}
            </div>
            {suggestedAgent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0 0', padding: '8px 12px', borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border2)', fontSize: '12px', color: 'var(--text1)' }}>
                <span style={{ flex: 1 }}>This looks like a {AGENT_LABELS[suggestedAgent]} question — switch agent?</span>
                <button onClick={switchToSuggestedAgent} style={{ border: 'none', background: 'var(--accent,#E31837)', color: '#fff', borderRadius: 99, padding: '5px 12px', fontSize: '11.5px', fontWeight: 650, cursor: 'pointer' }}>Switch</button>
                <button title="Dismiss" onClick={dismissSuggestion} style={{ width: 22, height: 22, border: 'none', background: 'transparent', borderRadius: '50%', cursor: 'pointer', color: 'var(--text3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            )}
            <div className="dc-c249">
              <div className="dc-c250">
                <textarea
                  rows="1"
                  placeholder="Ask anything about your enterprise data…"
                  className="dc-c251"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitInput(); } }}
                />
                <div className="dc-c252">
                  <button title="Attach files" className="dc-c253"><img src={up('icons/icon-e23497f4d0.svg')} width="15" height="15" alt="" /></button>
                  <button className="dc-c254"><img src={up('icons/icon-174fd5b7a9.svg')} width="12" height="12" alt="" />Source</button>
                  <div className="dc-c9" />
                  <button title="Voice input" className="dc-c255"><img src={up('icons/icon-7087406766.svg')} width="15" height="15" alt="" /></button>
                  <button title="Send" className="dc-c256" onClick={submitInput} disabled={liveLoading} style={liveLoading ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}><img src={up('icons/icon-8743b9e5a4.svg')} width="15" height="15" alt="" /></button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: STUDIO */}
        {rightOpen ? (
          <aside data-screen-label="Studio panel" className="dc-c108" style={{ width: 308 }}>
            <div style={{ padding: '16px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14.5px', fontWeight: 650 }}>Studio</span>
              <button title="Collapse panel" className="dc-c113" onClick={() => setRightOpen(false)}>
                <img src={up('icons/icon-bea1ab8c8a.svg')} width="15" height="15" alt="" />
              </button>
            </div>

            <div style={{ padding: '0 12px 4px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div onClick={studioXls} title="Download current output as Excel" style={{ background: 'var(--bg2)', border: '1px solid var(--border1)', borderRadius: 12, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: exportButtonsDisabled ? 'not-allowed' : 'pointer', opacity: exportButtonsDisabled ? 0.45 : 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text1)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9.5 12.5l5 5M14.5 12.5l-5 5" /></svg>
                <span style={{ fontSize: 12, fontWeight: 650, color: 'var(--text0)' }}>XLS</span>
              </div>
              <div onClick={studioPdf} title="Download current output as PDF" style={{ background: 'var(--bg2)', border: '1px solid var(--border1)', borderRadius: 12, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: exportButtonsDisabled ? 'not-allowed' : 'pointer', opacity: exportButtonsDisabled ? 0.45 : 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text1)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 16.5h1.2a1.3 1.3 0 0 0 0-2.6H9V17M13.2 13.9v3.6M17 13.9h-1.7v3.6M15.3 15.7h1.4" /></svg>
                <span style={{ fontSize: 12, fontWeight: 650, color: 'var(--text0)' }}>PDF</span>
              </div>
              <div onClick={studioToggleEmail} title="Email current output" style={{ background: studioEmailOpen ? 'var(--bg3)' : 'var(--bg2)', border: '1px solid var(--border1)', borderRadius: 12, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: exportButtonsDisabled ? 'not-allowed' : 'pointer', opacity: exportButtonsDisabled ? 0.45 : 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text1)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4zM22 6l-10 7L2 6" /></svg>
                <span style={{ fontSize: 12, fontWeight: 650, color: 'var(--text0)' }}>Email</span>
              </div>
            </div>

            {exportHint && (
              <div style={{ margin: '2px 16px 0', fontSize: '10.5px', color: 'var(--text3)', textAlign: 'center' }}>{exportHint}</div>
            )}

            {hasExportBatch && (
              <div style={{ margin: '10px 12px 0', border: '1px solid var(--border1)', background: 'var(--bg2)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderBottom: '1px solid var(--border3)' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 650, color: 'var(--text0)' }}>{exportBatch.title}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text2)', marginTop: 2 }}>{exportBatchMeta}</div>
                  </div>
                  {exportBatchHasMultiple && (
                    <button onClick={onSelectAllExport} style={{ border: '1px solid var(--border2)', background: 'var(--bg1)', color: 'var(--text1)', borderRadius: 99, padding: '5px 10px', fontSize: '10.5px', fontWeight: 600, cursor: 'pointer', flex: 'none' }}>{selectAllLabel}</button>
                  )}
                </div>
                {exportBatch.loading && (
                  <div style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '11.5px', color: 'var(--text2)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accentText,#FF5C74)" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin .8s linear infinite' }}><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                    Preparing exportable items…
                  </div>
                )}
                {exportBatchReady && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {exportBatchItemsRaw.map((it) => (
                      <div key={it.key} onClick={() => toggleExportItem(it.key)} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 12px', cursor: 'pointer', borderTop: '1px solid var(--border3)' }}>
                        <span style={{ width: 16, height: 16, flex: 'none', marginTop: 1, borderRadius: 4, border: `1.5px solid ${it.selected ? 'var(--accent,#E31837)' : 'var(--border4)'}`, background: it.selected ? 'var(--accent,#E31837)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s ease' }}>
                          {it.selected && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                          )}
                        </span>
                        <span style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text0)' }}>{it.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 1 }}>{it.sublabel}</div>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {exportBatch.error && (
                  <div style={{ padding: '10px 12px', fontSize: 11, color: '#E5484D', borderTop: '1px solid var(--border3)' }}>{exportBatch.error}</div>
                )}
                {exportBatch.status && (
                  <div style={{ padding: '8px 12px', fontSize: '10.5px', color: '#3FB56C', borderTop: '1px solid var(--border3)' }}>{exportBatch.status}</div>
                )}
              </div>
            )}

            {studioEmailOpen && (
              <div style={{ margin: '8px 12px 0', border: '1px solid var(--border1)', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--bg2)' }}>
                <span style={{ fontSize: 11, fontWeight: 650, color: 'var(--text2)', letterSpacing: '.03em' }}>SEND TO</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {studioEmails.map((addr) => (
                    <span key={addr} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg3)', borderRadius: 99, padding: '5px 6px 5px 11px', fontSize: '11.5px', color: 'var(--text0)' }}>
                      {addr}
                      <button onClick={() => setStudioEmails((list) => list.filter((a) => a !== addr))} style={{ width: 16, height: 16, border: 'none', background: 'transparent', borderRadius: '50%', cursor: 'pointer', color: 'var(--text3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  value={studioEmailInput}
                  onChange={studioEmailChange}
                  onKeyDown={studioEmailKeyDown}
                  placeholder="name@techmahindra.com — press Enter to add"
                  style={{ border: '1px solid var(--border2)', background: 'var(--bg1)', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: 'var(--text0)', outline: 'none' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: '10.5px', color: studioEmailError ? '#E5484D' : studioEmailSent ? '#3FB56C' : 'var(--text3)' }}>{studioEmailStatus}</span>
                  {studioUndoSecs > 0 ? (
                    <button onClick={studioUndoEmail} style={{ display: 'flex', alignItems: 'center', gap: 7, border: '1px solid var(--border2)', background: 'var(--bg1)', color: 'var(--text0)', borderRadius: 99, padding: '7px 14px', fontSize: '11.5px', fontWeight: 650, cursor: 'pointer' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6M3 13a9 9 0 1 0 3-7.7" /></svg>
                      Undo · {studioUndoSecs}s
                    </button>
                  ) : (
                    <button onClick={studioSendEmail} disabled={studioSendDisabled} style={{ border: 'none', background: 'var(--accent,#E31837)', color: '#fff', borderRadius: 99, padding: '7px 16px', fontSize: '11.5px', fontWeight: 650, cursor: studioSendDisabled ? 'not-allowed' : 'pointer', opacity: studioSendDisabled ? 0.45 : 1, transition: 'opacity .15s ease' }}>Send</button>
                  )}
                </div>
              </div>
            )}

            <div style={{ margin: '10px 16px 0', borderTop: '1px solid var(--border3)' }} />

            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '10px 12px 12px', display: 'flex', flexDirection: 'column' }}>
              {hasNotes && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                  {notes.map((n) => (
                    <div key={n.key} style={{ border: '1px solid var(--border1)', background: 'var(--bg2)', borderRadius: 12, padding: '11px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                        <span style={{ flex: 1, fontSize: '10.5px', fontWeight: 650, color: 'var(--text2)', letterSpacing: '.04em' }}>NOTE · {n.time}</span>
                        <button title="Delete note" onClick={() => noteRemove(n.key)} style={{ width: 24, height: 24, flex: 'none', border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', color: 'var(--text3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                      {!n.saved ? (
                        <>
                          <textarea
                            value={n.text}
                            onChange={(e) => noteEdit(n.key, e.target.value)}
                            placeholder="Write your note…"
                            rows="3"
                            style={{ border: 'none', background: 'transparent', resize: 'vertical', fontSize: 12, lineHeight: 1.5, color: 'var(--text0)', fontFamily: 'inherit', outline: 'none', minHeight: 44 }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => noteSave(n.key)} style={{ border: 'none', background: 'var(--accent)', color: '#fff', borderRadius: 99, padding: '7px 18px', fontSize: 12, fontWeight: 650, cursor: 'pointer' }}>Save</button>
                          </div>
                        </>
                      ) : (
                        <div onClick={() => noteStartEdit(n.key)} title="Click to edit" style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text0)', whiteSpace: 'pre-wrap', cursor: 'text' }}>{n.text}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {noOutputs && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 8, padding: '20px 24px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accent.text} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2M15 8v-2M11.5 5.5h-2M20.5 5.5h-2M6 22l12-12-3-3L3 19l3 3zM14 8l2 2" /></svg>
                  <div style={{ fontSize: '12.5px', fontWeight: 650, color: accent.text }}>Export or share your output</div>
                  <div style={{ fontSize: '11.5px', lineHeight: 1.5, color: 'var(--text2)' }}>Download the current output as XLS or PDF, or email it to your team. Notes you add are saved here.</div>
                </div>
              )}
            </div>

            <div style={{ padding: '0 12px 14px', display: 'flex', justifyContent: 'center' }}>
              <button onClick={onAddNote} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text0)', borderRadius: 99, padding: '9px 18px', fontSize: '12.5px', fontWeight: 650, cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                Add note
              </button>
            </div>
          </aside>
        ) : (
          <aside className="dc-c148">
            <button title="Expand solutions" className="dc-c149" onClick={() => setRightOpen(true)}>
              <img src={up('icons/icon-c1ca783e08.svg')} width="15" height="15" alt="" />
            </button>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            <span className="dc-c150">STUDIO</span>
          </aside>
        )}
      </div>
    </div>
  );
}
