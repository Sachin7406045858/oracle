import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import up from '../lib/uploads.js';
import D from '../data/oss-data.js';
import '../styles/oracle-solution-studio-base.css';

const ACCENT = '#E31837';

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

const EMAIL_DOMAIN = '@techmahindra.com';
const EMAIL_DOMAIN_MSG = 'Emails can only be sent to recipients within the Tech Mahindra organization.';
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isAllowedEmail(v) { return isValidEmail(v) && v.toLowerCase().endsWith(EMAIL_DOMAIN); }

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
  const [favsOpen, setFavsOpen] = useState(false);
  const [extQuery, setExtQuery] = useState('');
  const [extFavIds, setExtFavIds] = useState([]);
  const [extFavsOpen, setExtFavsOpen] = useState(false);
  const [agentQuery, setAgentQuery] = useState('');
  const [fusionAgentSel, setFusionAgentSel] = useState(null);
  const [openCat, setOpenCat] = useState('Finance');
  const [catShowAll, setCatShowAll] = useState(null);
  const [favIds, setFavIds] = useState(['supplier-invoice', 'po-creation']);
  const [agentChat, setAgentChat] = useState(null);
  const [glReplyShown, setGlReplyShown] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [showSalesOrders, setShowSalesOrders] = useState(false);
  const [theme, setTheme] = useState('light');

  // Live agent chat (real backend calls, replacing mocked free-text replies)
  const [liveAgentId, setLiveAgentId] = useState('AP_MANAGER');
  const [liveMessages, setLiveMessages] = useState([]); // { role: 'user'|'assistant'|'error', text }
  const [liveConversationId, setLiveConversationId] = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const LIVE_AGENTS = [
    { id: 'AP_MANAGER', label: 'AP Manager' },
    { id: 'EMPLOYEE_QUERY_AGENT', label: 'Employee Query (HR)' },
  ];

  const [studioEmailOpen, setStudioEmailOpen] = useState(false);
  const [studioEmailInput, setStudioEmailInput] = useState('');
  const [studioEmails, setStudioEmails] = useState([]);
  const [studioEmailStatus, setStudioEmailStatus] = useState('');
  const [studioEmailError, setStudioEmailError] = useState(false);
  const [studioEmailSent, setStudioEmailSent] = useState(false);
  const [studioUndoSecs, setStudioUndoSecs] = useState(0);
  const undoTimerRef = useRef(null);

  const [notes, setNotes] = useState([]);

  const activeAgent = D.AGENTS[0]; // agentId is never set from UI in the original app

  function selectFusionAgent(a) {
    setFusionAgentSel(a.id);
    setOpenCat(a.cat);
    setAgentChat(a.id);
    setGlReplyShown(false);
    setShowSalesOrders(false);
  }
  function toggleFusionFav(id, e) {
    e.stopPropagation();
    setFavIds((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  function selectExternal(id) {
    setExternalSel(id);
  }
  function toggleExtFav(id, e) {
    e.stopPropagation();
    setExtFavIds((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  const byCat = useMemo(() => {
    const m = {};
    const order = [];
    D.FUSION_AGENTS.forEach((a) => {
      if (!m[a.cat]) { m[a.cat] = []; order.push(a.cat); }
      m[a.cat].push(a);
    });
    return { m, order };
  }, []);

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
  const isSupplierChat = agentChat === 'supplier-invoice';
  const isGlChat = agentChat === 'gl-balance';

  function agentRow(a, opts, favSet, onSelect, onFav) {
    const active = (opts.selId === a.id);
    const isFav = favSet.includes(a.id);
    const bg = active ? 'var(--bg3)' : 'transparent';
    const border = active ? 'var(--border4)' : 'transparent';
    const iconBg = active ? ACCENT : 'var(--bg3)';
    const iconColor = active ? '#fff' : 'var(--text1)';
    const favTitle = isFav ? 'Remove from favorites' : 'Add to favorites';

    if (opts.compact) {
      return (
        <div key={a.id} className="dc-c125" style={{ background: bg }} onClick={() => onSelect(a)}>
          <div className="dc-c126" style={{ background: iconBg }}><AgentIcon d={a.icon} color={iconColor} /></div>
          <span className="dc-c127">{a.name}</span>
        </div>
      );
    }
    const wrapClass = opts.search ? 'dc-c140' : 'dc-c134';
    return (
      <div key={a.id} className={wrapClass} style={{ background: bg, border: `1px solid ${border}` }} onClick={() => onSelect(a)}>
        <div className="dc-c135" style={{ background: iconBg }}><AgentIcon d={a.icon} color={iconColor} /></div>
        {opts.catDesc ? (
          <div className="dc-c141">
            <div className="dc-c142">{a.name}</div>
            <div className="dc-c143">{a.cat} · {a.desc}</div>
          </div>
        ) : (
          <span className="dc-c127">{a.name}</span>
        )}
        {onFav && (
          <button title={favTitle} className="dc-c136" onClick={(e) => onFav(a.id, e)}>
            <StarIcon filled={isFav} stroke={isFav ? '#E8B93B' : 'var(--text3)'} />
          </button>
        )}
      </div>
    );
  }

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
  function downloadXls() {
    const rows = D.PO_ROWS;
    const rowsHtml = '<tr><th>PO Number</th><th>Supplier</th><th>Amount</th><th>Due</th><th>Days Late</th><th>Impact</th></tr>' +
      rows.map((r) => `<tr><td>${r.po}</td><td>${r.supplier}</td><td>${r.amount}</td><td>${r.due}</td><td>${r.days}</td><td>${r.impact}</td></tr>`).join('');
    const xls = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><style>th{background:#eee}td,th{border:1px solid #ccc;padding:4px 8px}</style></head><body><table>${rowsHtml}</table></body></html>`;
    downloadBlob(xls, 'application/vnd.ms-excel', 'Delayed_PO_Report.xls');
  }
  function downloadPdf() {
    const rows = D.PO_ROWS;
    const rowsHtml = rows.map((r) => `<tr><td>${r.po}</td><td>${r.supplier}</td><td style="text-align:right">${r.amount}</td><td>${r.impact}</td></tr>`).join('');
    const html = `<html><head><title>Delayed PO Report</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#1a1a1a}h1{font-size:18px}p{font-size:13px;line-height:1.6}table{border-collapse:collapse;width:100%;margin-top:16px;font-size:12px}th,td{border:1px solid #ddd;padding:6px 10px;text-align:left}th{background:#f4f4f4}</style></head><body><h1>Delayed PO Report</h1><p style="color:#888;font-size:11px">Generated by Oracle ERP AI Assistant · ${new Date().toLocaleDateString()}</p><p>14 purchase orders past their promised delivery date, totaling $2.41M in open value. The five highest-impact orders:</p><table><thead><tr><th>PO</th><th>Supplier</th><th>Amount</th><th>Impact</th></tr></thead><tbody>${rowsHtml}</tbody></table><script>window.onload=function(){window.print()}<` + `/script></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  }

  function studioEmailInputChange(v) {
    setStudioEmailInput(v);
    const bad = isValidEmail(v.trim()) && !isAllowedEmail(v.trim());
    setStudioEmailError(bad);
    if (bad) setStudioEmailStatus(EMAIL_DOMAIN_MSG);
    else setStudioEmailStatus('');
  }
  function studioEmailKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const v = (studioEmailInput || '').trim().replace(/,$/, '');
      if (!isValidEmail(v)) return;
      if (!isAllowedEmail(v)) {
        setStudioEmailStatus(EMAIL_DOMAIN_MSG);
        setStudioEmailError(true);
        setStudioEmailSent(false);
        return;
      }
      setStudioEmails((list) => (list.includes(v) ? list : [...list, v]));
      setStudioEmailInput('');
      setStudioEmailStatus('');
      setStudioEmailError(false);
    }
  }
  function removeStudioEmail(addr) {
    setStudioEmails((list) => list.filter((a) => a !== addr));
  }
  function sendStudioEmail() {
    const list = studioEmails;
    if (!list.length) { setStudioEmailStatus('Add at least one address'); return; }
    if (list.some((a) => !isAllowedEmail(a))) {
      setStudioEmailError(true);
      setStudioEmailStatus(EMAIL_DOMAIN_MSG);
      return;
    }
    setStudioEmailError(false);
    setStudioEmailStatus('Sending…');
    setStudioEmailSent(false);
    setTimeout(() => {
      setStudioUndoSecs(10);
      setStudioEmailSent(false);
      setStudioEmailStatus('Sending in 10s — you can still revert');
      clearInterval(undoTimerRef.current);
      undoTimerRef.current = setInterval(() => {
        setStudioUndoSecs((s) => {
          const next = s - 1;
          if (next <= 0) {
            clearInterval(undoTimerRef.current);
            setStudioEmailSent(true);
            setStudioEmailStatus(`Sent to ${studioEmails.length} recipient${studioEmails.length > 1 ? 's' : ''}`);
            return 0;
          }
          setStudioEmailStatus(`Sending in ${next}s — you can still revert`);
          return next;
        });
      }, 1000);
    }, 600);
  }
  function undoStudioEmail() {
    clearInterval(undoTimerRef.current);
    setStudioUndoSecs(0);
    setStudioEmailSent(false);
    setStudioEmailStatus('Email reverted — not sent');
  }
  useEffect(() => () => clearInterval(undoTimerRef.current), []);

  const pendingTrim = (studioEmailInput || '').trim();
  const badPending = isValidEmail(pendingTrim) && !isAllowedEmail(pendingTrim);
  const sendDisabled = !studioEmails.length || studioEmails.some((a) => !isAllowedEmail(a)) || badPending;

  function addNote() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setNotes((n) => [{ key: Date.now(), text: '', time, saved: false }, ...n]);
  }
  function removeNote(key) {
    setNotes((n) => n.filter((x) => x.key !== key));
  }
  function updateNoteText(key, text) {
    setNotes((n) => n.map((x) => (x.key === key ? { ...x, text } : x)));
  }
  function saveNote(key) {
    setNotes((n) => n.map((x) => (x.key === key ? { ...x, saved: true } : x)));
  }
  function editNote(key) {
    setNotes((n) => n.map((x) => (x.key === key ? { ...x, saved: false } : x)));
  }

  const themeVars = THEMES[theme];
  const rootStyle = {
    '--accent': ACCENT,
    '--accentText': '#FF5C74',
    ...Object.fromEntries(Object.entries(themeVars).map(([k, v]) => [`--${k}`, v])),
  };

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
          <span className="dc-c93">Oracle ERP AI Assist</span>
        </div>

        <div className="dc-c9" />

        <div className="dc-c94">
          <img src={up('icons/icon-80de2c921a.svg')} width="15" height="15" alt="" className="dc-c11" />
          <input placeholder="Search agents, sources, conversations…" className="dc-c95" />
          <span className="dc-c96">⌘K</span>
        </div>

        <div className="dc-c14">
          <button title="Notifications" className="dc-c97">
            <img src={up('icons/icon-9e7891adf3.svg')} width="18" height="18" alt="" />
            <span className="dc-c98" />
          </button>
          <button title="Toggle theme" className="dc-c99" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
            <img src={up('icons/icon-a638347ce9.svg')} width="18" height="18" alt="" style={{ display: theme === 'dark' ? '' : 'none' }} />
            <img src={up('icons/icon-7c44d6e7c1.svg')} width="18" height="18" alt="" style={{ display: theme === 'dark' ? 'none' : '' }} />
          </button>
          <button title="Install app" className="dc-c100">
            <img src={up('icons/icon-e66fb9fb44.svg')} width="15" height="15" alt="" />
            Install app
          </button>
          <div className="dc-c101" />
          <div className="dc-c19">
            <div className="dc-c102" onClick={() => setUserMenuOpen((v) => !v)}>
              <div className="dc-c103">
                <img src={up('icons/icon-92a3531814.svg')} width="14" height="14" alt="" />
              </div>
              <span className="dc-c22">oracle.apex_r2r</span>
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
                <div className="dc-c118">
                  <div className="dc-c119">
                    <img src={up('icons/icon-139778027f.svg')} width="14" height="14" alt="" />
                    <input placeholder="Search agents" className="dc-c120" value={agentQuery} onChange={(e) => setAgentQuery(e.target.value)} />
                  </div>
                </div>

                {!searching && (
                  <div className="dc-c121">
                    <div className="dc-c122" onClick={() => setFavsOpen((v) => !v)}>
                      <img src={up('icons/icon-bcf1f58498.svg')} width="11" height="11" alt="" />
                      <span className="dc-c9">FAVORITES</span>
                      <img src={up('icons/icon-20a962e729.svg')} width="11" height="11" alt="" className="dc-c123" style={{ transform: favsOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                    </div>
                    {favsOpen && (
                      <div className="dc-c124">
                        {favIds.map((id) => D.FUSION_AGENTS.find((a) => a.id === id)).filter(Boolean)
                          .map((a) => agentRow(a, { compact: true, selId: fusionAgentSel }, favIds, selectFusionAgent, toggleFusionFav))}
                      </div>
                    )}
                  </div>
                )}

                <div className="dc-c128">
                  {!searching && (
                    <div className="dc-c129">
                      {byCat.order.map((c) => {
                        const all = byCat.m[c];
                        const open = openCat === c;
                        const showAll = open && catShowAll === c;
                        const items = showAll ? all : all.slice(0, 3);
                        const hasMore = all.length > 3;
                        return (
                          <div key={c}>
                            <div className="dc-c130" onClick={() => { setOpenCat(openCat === c ? null : c); setCatShowAll(null); }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="dc-c123" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}><path d="M9 18l6-6-6-6" /></svg>
                              <span className="dc-c131">{c.toUpperCase()}</span>
                              <span className="dc-c132">{all.length}</span>
                            </div>
                            {open && (
                              <div className="dc-c133">
                                {items.map((a) => agentRow(a, { catDesc: false, selId: fusionAgentSel }, favIds, selectFusionAgent, toggleFusionFav))}
                                {hasMore && (
                                  <button className="dc-c137" onClick={() => setCatShowAll(catShowAll === c ? null : c)}>
                                    {showAll ? 'Show less' : `View all ${all.length}`}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {searching && (
                    <div>
                      <div className="dc-c138">{searchMatches.length}{searchMatches.length === 1 ? ' MATCH' : ' MATCHES'}</div>
                      <div className="dc-c139">
                        {searchMatches.map((a) => agentRow(a, { catDesc: true, search: true, selId: fusionAgentSel }, favIds, selectFusionAgent, toggleFusionFav))}
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

                    {isSupplierChat && (
                      <div className="dc-c167">
                        <div className="dc-c168">
                          <span className="dc-c169">RECENT SUPPLIER INVOICES</span>
                          <span className="dc-c170">Oracle Fusion Payables · demo data</span>
                        </div>
                        <div className="dc-c171">
                          <table className="dc-c172">
                            <thead>
                              <tr className="dc-c173">
                                <th className="dc-c174">INVOICE #</th>
                                <th className="dc-c174">SUPPLIER</th>
                                <th className="dc-c174">PO REF</th>
                                <th className="dc-c175">AMOUNT</th>
                                <th className="dc-c174">DUE DATE</th>
                                <th className="dc-c174">STATUS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {D.SUPPLIER_INVOICE_ROWS.map((r) => (
                                <tr className="dc-c176" key={r.inv}>
                                  <td className="dc-c177">{r.inv}</td>
                                  <td className="dc-c178">{r.supplier}</td>
                                  <td className="dc-c179">{r.po}</td>
                                  <td className="dc-c180">{r.amount}</td>
                                  <td className="dc-c181">{r.due}</td>
                                  <td className="dc-c182"><span className="dc-c183" style={{ color: r.badgeColor, background: r.badgeBg }}>{r.status}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {isGlChat && (
                      <div className="dc-c167">
                        <div className="dc-c168">
                          <span className="dc-c169">LEDGER BALANCES · JUN FY26</span>
                          <span className="dc-c170">Oracle Fusion General Ledger · demo data</span>
                        </div>
                        <div className="dc-c171">
                          <table className="dc-c172">
                            <thead>
                              <tr className="dc-c173">
                                <th className="dc-c237">ACCOUNT</th>
                                <th className="dc-c238">NET BALANCE</th>
                                <th className="dc-c237">STATUS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {D.GL_BALANCE_ROWS.map((r) => (
                                <tr className="dc-c176" key={r.account}>
                                  <td className="dc-c233">{r.account}</td>
                                  <td className="dc-c239">{r.net}</td>
                                  <td className="dc-c240"><span className="dc-c183" style={{ color: r.badgeColor, background: r.badgeBg }}>{r.status}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
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
                      <p className="dc-c191" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</p>
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
          <aside data-screen-label="Studio panel" className="dc-c108">
            <div className="dc-c257">
              <span className="dc-c110">Studio</span>
              <button title="Collapse panel" className="dc-c113" onClick={() => setRightOpen(false)}>
                <img src={up('icons/icon-bea1ab8c8a.svg')} width="15" height="15" alt="" />
              </button>
            </div>

            <div className="dc-c258">
              <div title="Download current output as Excel" className="dc-c259" onClick={downloadXls}>
                <img src={up('icons/icon-a43d771d6e.svg')} width="18" height="18" alt="" />
                <span className="dc-c260">XLS</span>
              </div>
              <div title="Download current output as PDF" className="dc-c259" onClick={downloadPdf}>
                <img src={up('icons/icon-a284ac7b6b.svg')} width="18" height="18" alt="" />
                <span className="dc-c260">PDF</span>
              </div>
              <div title="Email current output" className="dc-c261" style={{ background: studioEmailOpen ? 'var(--bg3)' : 'var(--bg2)' }} onClick={() => { setStudioEmailOpen((v) => !v); setStudioEmailStatus(''); setStudioEmailSent(false); }}>
                <img src={up('icons/icon-b234f8967c.svg')} width="18" height="18" alt="" />
                <span className="dc-c260">Email</span>
              </div>
            </div>

            {studioEmailOpen && (
              <div className="dc-c262">
                <span className="dc-c263">SEND TO</span>
                <div className="dc-c264">
                  {studioEmails.map((addr) => (
                    <span className="dc-c265" key={addr}>{addr}
                      <button className="dc-c266" onClick={() => removeStudioEmail(addr)}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  placeholder="name@techmahindra.com — press Enter to add"
                  className="dc-c267"
                  value={studioEmailInput}
                  onChange={(e) => studioEmailInputChange(e.target.value)}
                  onKeyDown={studioEmailKeyDown}
                />
                <div className="dc-c268">
                  <span className="dc-c269" style={{ color: studioEmailError ? '#E5484D' : studioEmailSent ? '#3FB56C' : 'var(--text3)' }}>{studioEmailStatus}</span>
                  {studioUndoSecs ? (
                    <button className="dc-c270" onClick={undoStudioEmail}>
                      <img src={up('icons/icon-7ec65569a6.svg')} width="12" height="12" alt="" />
                      <span>Undo · {studioUndoSecs}s</span>
                    </button>
                  ) : (
                    <button disabled={sendDisabled} className="dc-c271" style={{ cursor: sendDisabled ? 'not-allowed' : 'pointer', opacity: sendDisabled ? 0.45 : 1 }} onClick={sendStudioEmail}>Send</button>
                  )}
                </div>
              </div>
            )}

            <div className="dc-c272" />

            <div className="dc-c273">
              {notes.length > 0 ? (
                <div className="dc-c274">
                  {notes.map((n) => (
                    <div className="dc-c275" key={n.key}>
                      <div className="dc-c188">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                        <span className="dc-c276">NOTE · {n.time}</span>
                        <button className="dc-c277 dc-c277-hv1" onClick={() => removeNote(n.key)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                      {!n.saved ? (
                        <>
                          <textarea placeholder="Write your note…" rows="3" className="dc-c278" value={n.text} onChange={(e) => updateNoteText(n.key, e.target.value)} />
                          <div className="dc-c58"><button className="dc-c279" onClick={() => saveNote(n.key)}>Save</button></div>
                        </>
                      ) : (
                        <div title="Click to edit" className="dc-c280" onClick={() => editNote(n.key)}>{n.text}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dc-c302">
                  <img src={up('icons/icon-893098259e.svg')} width="22" height="22" alt="" />
                  <div className="dc-c197" style={{ color: '#FF5C74' }}>Export or share your output</div>
                  <div className="dc-c303">Download the current output as XLS or PDF, or email it to your team. Notes you add are saved here.</div>
                </div>
              )}
            </div>

            <div className="dc-c304">
              <button className="dc-c305" onClick={addNote}>
                <img src={up('icons/icon-289d2753d9.svg')} width="14" height="14" alt="" />
                Add note
              </button>
            </div>
          </aside>
        ) : (
          <aside className="dc-c148">
            <button title="Expand solutions" className="dc-c149" onClick={() => setRightOpen(true)}>
              <img src={up('icons/icon-c1ca783e08.svg')} width="15" height="15" alt="" />
            </button>
            <img src={up('icons/icon-4c113366bd.svg')} width="17" height="17" alt="" />
            <span className="dc-c150">STUDIO</span>
          </aside>
        )}
      </div>
    </div>
  );
}
