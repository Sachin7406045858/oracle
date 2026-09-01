import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import up from '../lib/uploads.js';
import D from '../data/v2dark-data.js';
import '../styles/oracle-ai-agent-studio-v2-dark-base.css';

const ACCENT = '#E31837';

function StarIcon({ filled, stroke }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? ACCENT : 'none'} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  );
}

export default function OracleAIAgentStudioV2Dark() {
  const navigate = useNavigate();
  const ACCENT_TEXT = D.ACCENT_TEXT[ACCENT] || ACCENT;

  useEffect(() => {
    if (!localStorage.getItem('erpAiSession')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const [agentId, setAgentId] = useState(null);
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);
  const [sourceQuery, setSourceQuery] = useState('');
  const [filter, setFilter] = useState('Oracle');
  const [pinned, setPinned] = useState(['report', 'sql', 'insights']);
  const [checked, setChecked] = useState(['erp', 'db', 'scm']);
  const [theme, setTheme] = useState('light');
  const [showSalesOrders, setShowSalesOrders] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const activeAgent = useMemo(() => D.AGENTS.find((a) => a.id === (agentId || 'r2r')) || D.AGENTS[0], [agentId]);
  const promptTexts = D.AGENT_PROMPTS[agentId || 'r2r'] || D.AGENT_PROMPTS.r2r;

  const themeVars = D.THEMES[theme];
  const rootStyle = {
    '--accent': ACCENT,
    '--accentText': ACCENT_TEXT,
    ...Object.fromEntries(Object.entries(themeVars).map(([k, v]) => [`--${k}`, v])),
  };

  const visibleSources = useMemo(() => {
    const q = sourceQuery.trim().toLowerCase();
    return D.SOURCES.filter((s) => filter === 'All' || s.cat === filter).filter(
      (s) => !q || s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q)
    );
  }, [sourceQuery, filter]);

  const sortedTools = useMemo(() => {
    const pinnedSet = new Set(pinned);
    return D.TOOLS.slice().sort((a, b) => (pinnedSet.has(b.id) ? 1 : 0) - (pinnedSet.has(a.id) ? 1 : 0));
  }, [pinned]);

  function toggleChecked(id) {
    setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  }
  function toggleSelectAll() {
    setChecked((c) => (c.length === D.SOURCES.length ? [] : D.SOURCES.map((s) => s.id)));
  }
  function togglePinned(id) {
    setPinned((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }
  function logout() {
    localStorage.removeItem('erpAiSession');
    navigate('/login');
  }
  function submitInput() {
    const text = chatInput.trim();
    if (text.toLowerCase() === 'display sales orders') {
      setShowSalesOrders(true);
      setChatInput('');
    } else if (text) {
      setChatInput('');
    }
  }

  return (
    <div id="rootEl" className="dc-c90" style={rootStyle}>
      <header data-screen-label="Top navigation" className="dc-c91">
        <div className="dc-c308">
          <div className="dc-c310">
            <span className="dc-c440">
              <img src={up('idtr6P9i4b_logos.svg')} alt="Oracle" className="dc-c441" style={{ filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none' }} /> ERP AI Assist
            </span>
            <span className="dc-c442">A TECH MAHINDRA PROTOTYPE FOR ORACLE</span>
          </div>
        </div>

        <div className="dc-c9" />

        <div className="dc-c443">
          <img src={up('icons/icon-8ed8102c8b.svg')} width="15" height="15" alt="" />
          <input placeholder="Search agents, sources, conversations…" className="dc-c444" />
          <span className="dc-c96">⌘K</span>
        </div>

        <div className="dc-c14">
          <button title="Analytics" className="dc-c100">
            <img src={up('icons/icon-2d336ed702.svg')} width="16" height="16" alt="" />
            Analytics
          </button>
          <button title="Notifications" className="dc-c97">
            <img src={up('icons/icon-9e7891adf3.svg')} width="18" height="18" alt="" />
            <span className="dc-c98" />
          </button>
          <button title="Settings" className="dc-c99">
            <img src={up('icons/icon-af2b5e2598.svg')} width="18" height="18" alt="" />
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
            <div className="dc-c321 dc-c321-hv3" onClick={() => setUserMenuOpen((v) => !v)}>
              <div className="dc-c445">PK</div>
              <div className="dc-c323">
                <span className="dc-c324">Priya.K</span>
              </div>
              <img src={up('icons/icon-ffe5a1a413.svg')} width="14" height="14" alt="" className="dc-c446" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </div>
            {userMenuOpen && (
              <div className="dc-c447">
                <div className="dc-c105">
                  <img src={up('icons/icon-1aae375c00.svg')} width="15" height="15" alt="" />
                  About
                </div>
                <div className="dc-c105">
                  <img src={up('icons/icon-a8cb42be00.svg')} width="15" height="15" alt="" />
                  Profile
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
        {/* LEFT: SOURCES */}
        {leftOpen ? (
          <aside data-screen-label="Sources panel" className="dc-c448">
            <div className="dc-c328">
              <span className="dc-c110">Sources</span>
              <div className="dc-c111">
                <span className="dc-c112">3 connected</span>
                <button title="Collapse panel" className="dc-c113" onClick={() => setLeftOpen(false)}>
                  <img src={up('icons/icon-77b0ed8361.svg')} width="15" height="15" alt="" />
                </button>
              </div>
            </div>

            <div className="dc-c331">
              <button className="dc-c449" onClick={() => { setAddMenuOpen((v) => !v); setAgentMenuOpen(false); }}>
                <img src={up('icons/icon-a9ca685136.svg')} width="15" height="15" alt="" />
                Add source
              </button>
              {addMenuOpen && (
                <div className="dc-c450">
                  <div className="dc-c451">UPLOAD DOCUMENTS</div>
                  <div>
                    {D.UPLOAD_OPTIONS.map((o) => (
                      <div className="dc-c452" key={o.name}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={o.icon} /></svg>
                        {o.name}
                      </div>
                    ))}
                  </div>
                  <div className="dc-c106" />
                  <div className="dc-c451">CONNECT DATA SOURCE</div>
                  <div>
                    {D.CONNECT_OPTIONS.map((o) => (
                      <div className="dc-c452" key={o.name}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={o.icon} /></svg>
                        {o.name}
                        {o.oracle && <span className="dc-c453">ORACLE</span>}
                      </div>
                    ))}
                  </div>
                  <div className="dc-c106" />
                  <div className="dc-c452">
                    <img src={up('icons/icon-483b0b815f.svg')} width="15" height="15" alt="" />
                    Add website
                  </div>
                </div>
              )}
            </div>

            <div className="dc-c338">
              <div className="dc-c454">
                <img src={up('icons/icon-139778027f.svg')} width="14" height="14" alt="" />
                <input placeholder="Search sources" className="dc-c120" value={sourceQuery} onChange={(e) => setSourceQuery(e.target.value)} />
              </div>
              <div className="dc-c341">
                {['Oracle', 'Files', 'Apps'].map((c) => {
                  const active = filter === c;
                  return (
                    <button key={c} className="dc-c342" style={{ border: '1px solid var(--border4)', background: active ? 'var(--bg3)' : 'transparent', color: active ? 'var(--text0)' : 'var(--text1)' }} onClick={() => setFilter(c)}>
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="dc-c455">
              <span className="dc-c456">Select all sources</span>
              <div className="dc-c84" style={{ background: checked.length === D.SOURCES.length ? 'var(--text1)' : 'transparent', border: `1.5px solid ${checked.length === D.SOURCES.length ? 'var(--text1)' : 'var(--border5)'}` }} onClick={toggleSelectAll}>
                <img src={up('icons/icon-bdde14fe2c.svg')} width="10" height="10" alt="" />
              </div>
            </div>

            <div className="dc-c345">
              {visibleSources.map((s) => {
                const isChecked = checked.includes(s.id);
                const dot = s.status === 'connected' ? '#4ECB71' : s.status === 'syncing' ? '#E3B341' : 'var(--text3)';
                const anim = s.status === 'syncing' ? 'syncPulse 1.4s ease-in-out infinite' : 'none';
                const statusLabel = s.status === 'connected' ? 'Connected' : s.status === 'syncing' ? 'Syncing' : 'Ready';
                const iconBg = s.oracle ? 'var(--bg4)' : 'var(--bg3)';
                const iconColor = s.oracle ? 'var(--text0)' : 'var(--text1)';
                return (
                  <div className="dc-c346 dc-c346-hv3" key={s.id}>
                    <div className="dc-c347" style={{ background: iconBg }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
                    </div>
                    <div className="dc-c141">
                      <div className="dc-c457">{s.name}</div>
                      <div className="dc-c458">{s.type} · {s.sync}</div>
                    </div>
                    <div title={statusLabel} className="dc-c349" style={{ background: dot, animation: anim }} />
                    <div className="dc-c350" style={{ background: isChecked ? ACCENT : 'transparent', border: `1.5px solid ${isChecked ? ACCENT : 'var(--border5)'}` }} onClick={() => toggleChecked(s.id)}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="dc-c459">
              <span className="dc-c146" />
              <span className="dc-c147"><span>{checked.length}</span> of <span>{D.SOURCES.length}</span> sources in scope for queries</span>
            </div>
          </aside>
        ) : (
          <aside className="dc-c148">
            <button title="Expand sources" className="dc-c149" onClick={() => setLeftOpen(true)}>
              <img src={up('icons/icon-622c38169f.svg')} width="15" height="15" alt="" />
            </button>
            <img src={up('icons/icon-93b640ea98.svg')} width="17" height="17" alt="" />
            <span className="dc-c150">SOURCES</span>
          </aside>
        )}

        {/* MIDDLE: CONVERSATION */}
        <main data-screen-label="AI conversation workspace" className="dc-c460">
          <div className="dc-c461">
            <div className="dc-c462" onClick={() => { setAgentMenuOpen((v) => !v); setAddMenuOpen(false); }}>
              <div className="dc-c360">{activeAgent.initials}</div>
              <div className="dc-c323">
                <span className="dc-c361">{activeAgent.name}</span>
                <span className="dc-c463">{activeAgent.domain}</span>
              </div>
              <img src={up('icons/icon-3de9173cc1.svg')} width="14" height="14" alt="" />
            </div>
            <span className="dc-c464">Published</span>

            {agentMenuOpen && (
              <div className="dc-c465">
                <div className="dc-c466">SWITCH AI AGENT</div>
                <div className="dc-c366">
                  {D.AGENTS.map((a) => {
                    const active = a.id === (agentId || 'r2r');
                    return (
                      <div key={a.id} className="dc-c367 dc-c367-hv3" style={{ background: active ? 'var(--bg3)' : 'transparent' }} onClick={() => { setAgentId(a.id); setAgentMenuOpen(false); }}>
                        <div className="dc-c368" style={{ background: active ? ACCENT : 'var(--border1)', color: active ? '#fff' : 'var(--text1)' }}>{a.initials}</div>
                        <div className="dc-c141">
                          <div className="dc-c57">{a.name}</div>
                          <div className="dc-c467">{a.domain}</div>
                        </div>
                        {active && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accentText,#FF5C74)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
                      </div>
                    );
                  })}
                </div>
                <div className="dc-c468">
                  <button className="dc-c469">
                    <img src={up('icons/icon-63edbe9ea1.svg')} width="13" height="13" alt="" />
                    Create new agent
                  </button>
                  <button className="dc-c470">Configure agent</button>
                </div>
              </div>
            )}

            <div className="dc-c9" />
            <span className="dc-c456">Querying <span>{checked.length}</span> sources</span>
            <button className="dc-c471">⋯</button>
          </div>

          <div className="dc-c472">
            <div className="dc-c473">
              <h1 className="dc-c474">Welcome to Oracle ERP <span className="dc-c475">AI Assist</span></h1>
              <p className="dc-c476">GEN AI based NLP ERP Query tool</p>
              <div className="dc-c477">
                {promptTexts.map((t, i) => (
                  <button key={i} className="dc-c478" onClick={() => setChatInput(t)}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="dc-c185">
            <div className="dc-c186">
              <div style={{ display: 'none' }} />

              <div style={{ display: showSalesOrders ? '' : 'none' }}>
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
                          {D.SALES_ORDERS.map((o) => {
                            const statusColor = o.status === 'Closed' ? '#6FCF97' : '#F0BE5C';
                            const statusBg = o.status === 'Closed' ? '#1C2B22' : '#332A15';
                            return (
                              <tr className="dc-c176" key={o.orderNumber}>
                                <td className="dc-c177">{o.orderNumber}</td>
                                <td className="dc-c242">{o.lineCreationDate}</td>
                                <td className="dc-c242">{o.buyerName}</td>
                                <td className="dc-c242">{o.actionType}</td>
                                <td className="dc-c242">{o.transactionOn}</td>
                                <td className="dc-c242">{o.headerCreationDate}</td>
                                <td className="dc-c182"><span className="dc-c183" style={{ color: statusColor, background: statusBg }}>{o.status}</span></td>
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
                            );
                          })}
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
            </div>
          </div>

          <div className="dc-c246">
            <div className="dc-c249">
              <div className="dc-c250">
                <textarea
                  rows="1"
                  placeholder={`Ask ${activeAgent.name} anything about your enterprise data…`}
                  className="dc-c251"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitInput(); } }}
                />
                <div className="dc-c252">
                  <button title="Attach files" className="dc-c253"><img src={up('icons/icon-e23497f4d0.svg')} width="15" height="15" alt="" /></button>
                  <button className="dc-c254"><img src={up('icons/icon-174fd5b7a9.svg')} width="12" height="12" alt="" />Source</button>
                  <button className="dc-c254"><img src={up('icons/icon-31ce605833.svg')} width="12" height="12" alt="" />Agent</button>
                  <button title="Quick prompts" className="dc-c253"><img src={up('icons/icon-13d7b6846b.svg')} width="14" height="14" alt="" /></button>
                  <div className="dc-c9" />
                  <button title="Voice input" className="dc-c255"><img src={up('icons/icon-7087406766.svg')} width="15" height="15" alt="" /></button>
                  <button title="Send" className="dc-c256" onClick={submitInput}><img src={up('icons/icon-8743b9e5a4.svg')} width="15" height="15" alt="" /></button>
                </div>
              </div>
              <div className="dc-c479">Prototype by Tech Mahindra for Oracle · Responses shown are illustrative demo data</div>
            </div>
          </div>
        </main>

        {/* RIGHT: AI STUDIO */}
        {rightOpen ? (
          <aside data-screen-label="AI Studio panel" className="dc-c480">
            <div className="dc-c257">
              <div className="dc-c188">
                <span className="dc-c110">AI Studio</span>
                <span className="dc-c481">7 tools</span>
              </div>
              <button title="Collapse panel" className="dc-c113" onClick={() => setRightOpen(false)}>
                <img src={up('icons/icon-bea1ab8c8a.svg')} width="15" height="15" alt="" />
              </button>
            </div>
            <div className="dc-c482">Generate outputs from your <span>{checked.length}</span> selected sources. Pin favourites to keep them on top.</div>

            <div className="dc-c430">
              {pinned.length > 0 && <div className="dc-c483">PINNED</div>}
              <div className="dc-c432">
                {sortedTools.map((t) => {
                  const p = pinned.includes(t.id);
                  const tint = D.TINTS[t.tint] || D.TINTS.green;
                  const toolIconChipBg = theme === 'light' ? 'rgba(0,0,0,.04)' : 'rgba(255,255,255,.05)';
                  const bg = theme === 'light' ? '#F6F2EA' : tint.bgDark;
                  const iconColor = theme === 'light' ? '#4A453D' : tint.icon;
                  return (
                    <div className="dc-c433 dc-c433-hv3" key={t.id} style={{ border: `1px solid ${p ? '#55232B' : 'var(--border1)'}`, background: bg }}>
                      <div className="dc-c434">
                        <div className="dc-c484" style={{ background: toolIconChipBg }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon} /></svg>
                        </div>
                        <button title="Pin tool" className="dc-c436" onClick={(e) => { e.stopPropagation(); togglePinned(t.id); }}>
                          <StarIcon filled={p} stroke={p ? ACCENT_TEXT : 'var(--text3)'} />
                        </button>
                      </div>
                      <div>
                        <div className="dc-c485">{t.name}</div>
                        <div className="dc-c486">{t.desc}</div>
                      </div>
                      <button className="dc-c487">Launch<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></button>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        ) : (
          <aside className="dc-c148">
            <button title="Expand AI Studio" className="dc-c149" onClick={() => setRightOpen(true)}>
              <img src={up('icons/icon-c1ca783e08.svg')} width="15" height="15" alt="" />
            </button>
            <img src={up('icons/icon-d74b6ec933.svg')} width="17" height="17" alt="" />
            <span className="dc-c150">AI STUDIO</span>
          </aside>
        )}
      </div>
    </div>
  );
}
