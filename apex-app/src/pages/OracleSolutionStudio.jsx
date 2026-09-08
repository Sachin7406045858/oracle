import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import up from '../lib/uploads.js';
import D from '../data/oss-data.js';
import JobResultCard from '../components/JobResultCard.jsx';
import '../styles/oracle-solution-studio-base.css';

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
  const [glReplyShown, setGlReplyShown] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [showSalesOrders, setShowSalesOrders] = useState(false);
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
  const undoTimerRef = useRef(null);

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
  function studioXls() {
    const rows = D.PO_ROWS;
    const rowsHtml = `<tr><th>PO Number</th><th>Supplier</th><th>Amount</th><th>Due</th><th>Days Late</th><th>Impact</th></tr>` +
      rows.map((r) => `<tr><td>${r.po}</td><td>${r.supplier}</td><td>${r.amount}</td><td>${r.due}</td><td>${r.days}</td><td>${r.impact}</td></tr>`).join('');
    const xls = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><style>th{background:#eee}td,th{border:1px solid #ccc;padding:4px 8px}</style></head><body><table>${rowsHtml}</table></body></html>`;
    downloadBlob(xls, 'application/vnd.ms-excel', 'Delayed_PO_Report.xls');
  }
  function studioPdf() {
    const rows = D.PO_ROWS;
    const rowsHtml = rows.map((r) => `<tr><td>${r.po}</td><td>${r.supplier}</td><td style="text-align:right">${r.amount}</td><td>${r.impact}</td></tr>`).join('');
    const html = `<html><head><title>Delayed PO Report</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#1a1a1a}h1{font-size:18px}p{font-size:13px;line-height:1.6}table{border-collapse:collapse;width:100%;margin-top:16px;font-size:12px}th,td{border:1px solid #ddd;padding:6px 10px;text-align:left}th{background:#f4f4f4}</style></head><body><h1>Delayed PO Report</h1><p style="color:#888;font-size:11px">Generated by Oracle ERP AI Assistant · ${new Date().toLocaleDateString()}</p><p>14 purchase orders past their promised delivery date, totaling $2.41M in open value. The five highest-impact orders:</p><table><thead><tr><th>PO</th><th>Supplier</th><th>Amount</th><th>Impact</th></tr></thead><tbody>${rowsHtml}</tbody></table><script>window.onload=function(){window.print()}</script></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  }
  function studioToggleEmail() {
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
  const noOutputs = outputs.length === 0 && notes.length === 0;

  // Live agent chat (real backend calls, replacing mocked free-text replies)
  const [liveAgentId, setLiveAgentId] = useState('AP_MANAGER');
  const [liveMessages, setLiveMessages] = useState([]); // { role: 'user'|'assistant'|'error', text }
  const [liveConversationId, setLiveConversationId] = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const LIVE_AGENTS = [
    { id: 'AP_MANAGER', label: 'AP Manager' },
    { id: 'EMPLOYEE_QUERY_AGENT', label: 'Employee Query (HR)' },
  ];


  const activeAgent = D.AGENTS[0]; // agentId is never set from UI in the original app

  function selectFusionAgent(a) {
    setFusionAgentSel(a.id);
    setAgentChat(a.id);
    setGlReplyShown(false);
    setShowSalesOrders(false);
    if (a.id === 'ap-manager') { setLiveAgentId('AP_MANAGER'); setLiveConversationId(null); }
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
    if (t === 'Display Ledger, Period and financial information') {
      setGlReplyShown(true);
      setAgentChat(null);
      setChatInput('');
    } else {
      setChatInput(t);
    }
  }

  function submitInput() {
    const text = chatInput.trim();
    if (!text) return;
    if (text.toLowerCase() === 'display sales orders') {
      setShowSalesOrders(true);
      setChatInput('');
      return;
    }
    setChatInput('');
    sendLiveMessage(text);
  }

  async function sendLiveMessage(text) {
    setLiveMessages((m) => [...m, { role: 'user', text }]);
    setLiveLoading(true);
    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: liveAgentId,
          message: text,
          conversationId: liveConversationId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      if (data.conversationId) setLiveConversationId(data.conversationId);
      setLiveMessages((m) => [...m, { role: 'assistant', text: data.reply || '(no response)' }]);
    } catch (err) {
      setLiveMessages((m) => [...m, { role: 'error', text: err.message || 'Something went wrong contacting the agent.' }]);
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

  const showEmptyState = !agentChat && !glReplyShown && !showSalesOrders && liveMessages.length === 0 && !liveLoading;

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
              {showEmptyState && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 20px', gap: 18, minHeight: '60vh' }}>
                  <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24">
                      <path d="M12 2.5c.5 3.6 1.4 5.9 3 7.5s3.9 2.5 7.5 3c-3.6.5-5.9 1.4-7.5 3s-2.5 3.9-3 7.5c-.5-3.6-1.4-5.9-3-7.5s-3.9-2.5-7.5-3c3.6-.5 5.9-1.4 7.5-3s2.5-3.9 3-7.5z" fill="var(--text2)" opacity="0.92" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 520 }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 400, letterSpacing: '-.01em', color: 'var(--text0b)', fontFamily: 'Geist' }}>Ask anything</h2>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--text2)' }}>Pick an agent from the left, or type a question below.<br />I&rsquo;ll route it to the right agent and pull live answers from your connected sources.</p>
                  </div>
                </div>
              )}

              {glReplyShown && (
                <div>
                  <div className="dc-c58">
                    <div className="dc-c187">Display Ledger, Period and financial information</div>
                  </div>
                  <div className="dc-c220">
                    <div className="dc-c188">
                      <div className="dc-c189">{activeAgent.initials}</div>
                      <span className="dc-c190">{activeAgent.name}</span>
                      <span className="dc-c170">· queried Oracle Fusion General Ledger</span>
                    </div>
                    <p className="dc-c191">Here are the <strong className="dc-c192">ledgers</strong> with period set and financial information from Oracle Fusion General Ledger:</p>
                    <div className="dc-c171">
                      <div className="dc-c230">
                        <table className="dc-c231">
                          <thead>
                            <tr className="dc-c173">
                              {['LEDGER NAME', 'PERIOD SET NAME', 'LEDGER ID', 'LEDGER TYPE CODE', 'CURRENCY CODE', 'SEQUENCING MODE CODE', 'DESCRIPTION', 'CHART OF ACCOUNTS ID', 'ACCOUNTED PERIOD TYPE'].map((h) => (
                                <th className="dc-c232" key={h}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {D.LEDGER_ROWS.map((r) => (
                              <tr className="dc-c176" key={r.ledgerId}>
                                <td className="dc-c233">{r.name}</td>
                                <td className="dc-c234">{r.periodSet}</td>
                                <td className="dc-c235">{r.ledgerId}</td>
                                <td className="dc-c234">{r.typeCode}</td>
                                <td className="dc-c234">{r.currency}</td>
                                <td className="dc-c234">{r.seqMode}</td>
                                <td className="dc-c234">{r.desc}</td>
                                <td className="dc-c235">{r.coaId}</td>
                                <td className="dc-c235">{r.periodType}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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

              {showSalesOrders && (
                <div>
                  <div className="dc-c58">
                    <div className="dc-c187">Display sales orders</div>
                  </div>
                  <div className="dc-c51">
                    <div className="dc-c188">
                      <div className="dc-c189">{activeAgent.initials}</div>
                      <span className="dc-c190">{activeAgent.name}</span>
                      <span className="dc-c170">· queried Oracle ERP Cloud, Order Management</span>
                    </div>
                    <p className="dc-c191">Here are the <strong className="dc-c192">6 most recent sales orders</strong> from Order Management:</p>
                    <div className="dc-c171">
                      <div className="dc-c230">
                        <table className="dc-c241">
                          <thead>
                            <tr className="dc-c173">
                              {['ORDER NUMBER', 'ORDER LINE CREATION DATE', 'BUYER NAME', 'ACTION TYPE', 'TRANSACTION ON', 'ORDER HEADER CREATION DATE', 'STATUS', 'COMMENTS', 'SALES PERSON', 'PAYMENT TERMS', 'SUPPLIER NAME', 'FREIGHT TERMS', 'SHIPPING MODE', 'TRANSACTION TYPE', 'CUSTOMER PO NUMBER', 'BUSINESS UNIT NAME'].map((h) => (
                                <th className="dc-c232" key={h}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {D.SALES_ORDERS.map((o) => (
                              <tr className="dc-c176" key={o.orderNumber}>
                                <td className="dc-c177">{o.orderNumber}</td>
                                <td className="dc-c242">{o.lineCreationDate}</td>
                                <td className="dc-c242">{o.buyerName}</td>
                                <td className="dc-c242">{o.actionType}</td>
                                <td className="dc-c242">{o.transactionOn}</td>
                                <td className="dc-c242">{o.headerCreationDate}</td>
                                <td className="dc-c182"><span className="dc-c183" style={{ color: o.status === 'Closed' ? '#6FCF97' : '#F0BE5C', background: o.status === 'Closed' ? '#1C2B22' : '#332A15' }}>{o.status}</span></td>
                                <td className="dc-c242">{o.comments}</td>
                                <td className="dc-c243">{o.flagged ? <span className="dc-c244" /> : null}</td>
                                <td className="dc-c242">{o.paymentTerms}</td>
                                <td className="dc-c242">{o.supplierName}</td>
                                <td className="dc-c242">{o.freightTerms}</td>
                                <td className="dc-c242">{o.shippingMode}</td>
                                <td className="dc-c242">{o.transactionType}</td>
                                <td className="dc-c242">{o.customerPo}</td>
                                <td className="dc-c245">{o.businessUnit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="dc-c214">
                      <span className="dc-c215"><span className="dc-c216">1</span>Oracle ERP Cloud · Order Management</span>
                      <div className="dc-c9" />
                      <div className="dc-c217">
                        <button title="Helpful" className="dc-c218 dc-c218-hv3"><img src={up('icons/icon-e006d74f80.svg')} width="14" height="14" alt="" /></button>
                        <button title="Copy" className="dc-c218 dc-c218-hv3"><img src={up('icons/icon-e33ae36464.svg')} width="14" height="14" alt="" /></button>
                        <button className="dc-c219"><img src={up('icons/icon-68a0b186a7.svg')} width="13" height="13" alt="" />Add to report</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {liveMessages.map((m, i) => (
                <div key={i}>
                  {m.role === 'user' && (
                    <div className="dc-c58">
                      <div className="dc-c187">{m.text}</div>
                    </div>
                  )}
                  {m.role === 'assistant' && (
                    <div className="dc-c51">
                      <div className="dc-c188">
                        <div className="dc-c189">{activeAgent.initials}</div>
                        <span className="dc-c190">{LIVE_AGENTS.find((a) => a.id === liveAgentId)?.label}</span>
                        <span className="dc-c170">· Oracle Fusion AI agent</span>
                      </div>
                      <JobResultCard text={m.text} />
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
              {(D.AGENT_PROMPTS.r2r).map(renderSuggestedPrompt)}
            </div>
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
              <div onClick={studioXls} title="Download current output as Excel" style={{ background: 'var(--bg2)', border: '1px solid var(--border1)', borderRadius: 12, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text1)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9.5 12.5l5 5M14.5 12.5l-5 5" /></svg>
                <span style={{ fontSize: 12, fontWeight: 650, color: 'var(--text0)' }}>XLS</span>
              </div>
              <div onClick={studioPdf} title="Download current output as PDF" style={{ background: 'var(--bg2)', border: '1px solid var(--border1)', borderRadius: 12, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text1)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 16.5h1.2a1.3 1.3 0 0 0 0-2.6H9V17M13.2 13.9v3.6M17 13.9h-1.7v3.6M15.3 15.7h1.4" /></svg>
                <span style={{ fontSize: 12, fontWeight: 650, color: 'var(--text0)' }}>PDF</span>
              </div>
              <div onClick={studioToggleEmail} title="Email current output" style={{ background: studioEmailOpen ? 'var(--bg3)' : 'var(--bg2)', border: '1px solid var(--border1)', borderRadius: 12, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text1)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4zM22 6l-10 7L2 6" /></svg>
                <span style={{ fontSize: 12, fontWeight: 650, color: 'var(--text0)' }}>Email</span>
              </div>
            </div>

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
