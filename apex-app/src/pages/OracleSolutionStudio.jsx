import { useEffect, useMemo, useState } from 'react';
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
  const [theme, setTheme] = useState('dark');
  const [accentIdx, setAccentIdx] = useState(0);
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);
  const [solQuery, setSolQuery] = useState('');

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

  const themeVars = THEMES[theme];
  const accent = ACCENT_OPTIONS[accentIdx];
  const ACCENT = accent.color;
  const rootStyle = {
    '--accent': accent.color,
    '--accentText': accent.text,
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

        {/* RIGHT: ORACLE SOLUTIONS */}
        {rightOpen ? (
          <aside data-screen-label="Oracle Solutions panel" className="dc-c108" style={{ width: 336 }}>
            <div className="dc-c109">
              <span className="dc-c110">Oracle Solutions</span>
              <div className="dc-c111">
                <span className="dc-c112">0 solutions</span>
                <button title="Collapse panel" className="dc-c113" onClick={() => setRightOpen(false)}>
                  <img src={up('icons/icon-bea1ab8c8a.svg')} width="15" height="15" alt="" />
                </button>
              </div>
            </div>

            <div className="dc-c118">
              <div className="dc-c119">
                <img src={up('icons/icon-139778027f.svg')} width="14" height="14" alt="" />
                <input placeholder="Search solutions" className="dc-c120" value={solQuery} onChange={(e) => setSolQuery(e.target.value)} />
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '24px 16px', textAlign: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" /></svg>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text1)' }}>No solutions yet</span>
              <span style={{ fontSize: '11.5px', color: 'var(--text3)', lineHeight: 1.5 }}>Solutions built from your conversations will appear here.</span>
            </div>
          </aside>
        ) : (
          <aside className="dc-c148">
            <button title="Expand solutions" className="dc-c149" onClick={() => setRightOpen(true)}>
              <img src={up('icons/icon-c1ca783e08.svg')} width="15" height="15" alt="" />
            </button>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" /></svg>
            <span className="dc-c150">ORACLE SOLUTIONS</span>
          </aside>
        )}
      </div>
    </div>
  );
}
