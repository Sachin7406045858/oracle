import { useMemo, useState } from 'react';
import up from '../lib/uploads.js';
import D from '../data/oaas-data.js';
import '../styles/oracle-ai-agent-studio-base.css';

const ACCENT = '#E31837';

function StarIcon({ filled, stroke }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? ACCENT : 'none'} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  );
}

export default function OracleAIAgentStudio() {
  const [agentId, setAgentId] = useState(null);
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [insightOpen, setInsightOpen] = useState(false);
  const [sourceQuery, setSourceQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [pinned, setPinned] = useState(['report', 'sql', 'insights']);
  const [checked, setChecked] = useState(['erp', 'db', 'scm', 'sp', 'api', 'pdf', 'xlsx', 'csv']);
  const [chatInput, setChatInput] = useState('');

  const activeAgent = useMemo(() => D.AGENTS.find((a) => a.id === (agentId || 'proc')) || D.AGENTS[0], [agentId]);

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

  return (
    <div className="dc-c306" style={{ '--accent': ACCENT }}>
      <header data-screen-label="Top navigation" className="dc-c307">
        <div className="dc-c308">
          <div className="dc-c309">
            <img src={up('icons/icon-205ac907b3.svg')} width="18" height="18" alt="" />
          </div>
          <div className="dc-c310">
            <div className="dc-c311">
              <span className="dc-c312">Oracle AI Agent Studio</span>
            </div>
            <span className="dc-c313">A TECH MAHINDRA PROTOTYPE FOR ORACLE</span>
          </div>
        </div>

        <div className="dc-c9" />

        <div className="dc-c314">
          <img src={up('icons/icon-7a919b1387.svg')} width="15" height="15" alt="" />
          <input placeholder="Search agents, sources, conversations…" className="dc-c315" />
          <span className="dc-c316">⌘K</span>
        </div>

        <div className="dc-c14">
          <button title="Analytics" className="dc-c317">
            <img src={up('icons/icon-a74dec5f5d.svg')} width="18" height="18" alt="" />
          </button>
          <button title="Notifications" className="dc-c318">
            <img src={up('icons/icon-becfa20219.svg')} width="18" height="18" alt="" />
            <span className="dc-c319" />
          </button>
          <button title="Settings" className="dc-c317">
            <img src={up('icons/icon-0f4cc9de8b.svg')} width="18" height="18" alt="" />
          </button>
          <div className="dc-c320" />
          <div className="dc-c321 dc-c321-hv2">
            <div className="dc-c322">PK</div>
            <div className="dc-c323">
              <span className="dc-c324">Priya Krishnan</span>
              <span className="dc-c325">Finance Operations</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dc-c326">
        {/* LEFT: SOURCES */}
        {leftOpen ? (
          <aside data-screen-label="Sources panel" className="dc-c327">
            <div className="dc-c328">
              <span className="dc-c110">Sources</span>
              <div className="dc-c111">
                <span className="dc-c329">4 connected</span>
                <button title="Collapse panel" className="dc-c330" onClick={() => setLeftOpen(false)}>
                  <img src={up('icons/icon-d817a770a1.svg')} width="15" height="15" alt="" />
                </button>
              </div>
            </div>

            <div className="dc-c331">
              <button className="dc-c332" onClick={() => setAddMenuOpen((v) => !v)}>
                <img src={up('icons/icon-61ef20eb7a.svg')} width="15" height="15" alt="" />
                Add source
              </button>
              {addMenuOpen && (
                <div className="dc-c333">
                  <div className="dc-c334">UPLOAD DOCUMENTS</div>
                  <div>
                    {D.UPLOAD_OPTIONS.map((o) => (
                      <div className="dc-c335" key={o.name}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6E675E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={o.icon} /></svg>
                        {o.name}
                      </div>
                    ))}
                  </div>
                  <div className="dc-c336" />
                  <div className="dc-c334">CONNECT DATA SOURCE</div>
                  <div>
                    {D.CONNECT_OPTIONS.map((o) => (
                      <div className="dc-c335" key={o.name}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6E675E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={o.icon} /></svg>
                        {o.name}
                        {o.oracle && <span className="dc-c337">ORACLE</span>}
                      </div>
                    ))}
                  </div>
                  <div className="dc-c336" />
                  <div className="dc-c335">
                    <img src={up('icons/icon-74ebd66b49.svg')} width="15" height="15" alt="" />
                    Add website
                  </div>
                </div>
              )}
            </div>

            <div className="dc-c338">
              <div className="dc-c339">
                <img src={up('icons/icon-f831f493cb.svg')} width="14" height="14" alt="" />
                <input placeholder="Search sources" className="dc-c340" value={sourceQuery} onChange={(e) => setSourceQuery(e.target.value)} />
              </div>
              <div className="dc-c341">
                {['All', 'Oracle', 'Files', 'Apps'].map((c) => {
                  const active = filter === c;
                  return (
                    <button
                      key={c}
                      className="dc-c342"
                      style={{ border: `1px solid ${active ? '#201D1A' : '#E8E4DD'}`, background: active ? '#201D1A' : '#fff', color: active ? '#fff' : '#5E574D' }}
                      onClick={() => setFilter(c)}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="dc-c343">
              <span className="dc-c344">Select all sources</span>
              <div
                className="dc-c84"
                style={{ background: checked.length === D.SOURCES.length ? ACCENT : '#fff', border: `1.5px solid ${checked.length === D.SOURCES.length ? ACCENT : '#D3CDC2'}` }}
                onClick={toggleSelectAll}
              >
                <img src={up('icons/icon-a9dd1e895b.svg')} width="10" height="10" alt="" />
              </div>
            </div>

            <div className="dc-c345">
              {visibleSources.map((s) => {
                const isChecked = checked.includes(s.id);
                const dot = s.status === 'connected' ? '#1E9E5A' : s.status === 'syncing' ? '#D99A06' : '#B0A99D';
                const anim = s.status === 'syncing' ? 'syncPulse 1.4s ease-in-out infinite' : 'none';
                const statusLabel = s.status === 'connected' ? 'Connected' : s.status === 'syncing' ? 'Syncing' : 'Ready';
                const iconBg = s.oracle ? '#FBEDEA' : '#F4F1EB';
                const iconColor = s.oracle ? '#C74634' : '#5E574D';
                return (
                  <div className="dc-c346 dc-c346-hv2" key={s.id}>
                    <div className="dc-c347" style={{ background: iconBg }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
                    </div>
                    <div className="dc-c141">
                      <div className="dc-c142">{s.name}</div>
                      <div className="dc-c348">{s.type} · {s.sync}</div>
                    </div>
                    <div title={statusLabel} className="dc-c349" style={{ background: dot, animation: anim }} />
                    <div
                      className="dc-c350"
                      style={{ background: isChecked ? ACCENT : '#fff', border: `1.5px solid ${isChecked ? ACCENT : '#D3CDC2'}` }}
                      onClick={() => toggleChecked(s.id)}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="dc-c351">
              <span className="dc-c352" />
              <span className="dc-c353"><span>{checked.length}</span> of <span>{D.SOURCES.length}</span> sources in scope for queries</span>
            </div>
          </aside>
        ) : (
          <aside className="dc-c354">
            <button title="Expand sources" className="dc-c355" onClick={() => setLeftOpen(true)}>
              <img src={up('icons/icon-463df7b5c3.svg')} width="15" height="15" alt="" />
            </button>
            <img src={up('icons/icon-23b1e8a21d.svg')} width="17" height="17" alt="" />
            <span className="dc-c356">SOURCES</span>
          </aside>
        )}

        {/* MIDDLE: CONVERSATION */}
        <main data-screen-label="AI conversation workspace" className="dc-c357">
          <div className="dc-c358">
            <div className="dc-c359" onClick={() => { setAgentMenuOpen((v) => !v); setAddMenuOpen(false); }}>
              <div className="dc-c360">{activeAgent.initials}</div>
              <div className="dc-c323">
                <span className="dc-c361">{activeAgent.name}</span>
                <span className="dc-c362">{activeAgent.domain}</span>
              </div>
              <img src={up('icons/icon-7ab698680b.svg')} width="14" height="14" alt="" />
            </div>
            <span className="dc-c363">Published</span>

            {agentMenuOpen && (
              <div className="dc-c364">
                <div className="dc-c365">SWITCH AI AGENT</div>
                <div className="dc-c366">
                  {D.AGENTS.map((a) => {
                    const active = a.id === (agentId || 'proc');
                    return (
                      <div
                        key={a.id}
                        className="dc-c367 dc-c367-hv2"
                        style={{ background: active ? '#F8F6F1' : 'transparent' }}
                        onClick={() => { setAgentId(a.id); setAgentMenuOpen(false); }}
                      >
                        <div className="dc-c368" style={{ background: active ? ACCENT : '#F3F0EA', color: active ? '#fff' : '#5E574D' }}>{a.initials}</div>
                        <div className="dc-c141">
                          <div className="dc-c57">{a.name}</div>
                          <div className="dc-c369">{a.domain}</div>
                        </div>
                        {active && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent,#E31837)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
                      </div>
                    );
                  })}
                </div>
                <div className="dc-c370">
                  <button className="dc-c371">
                    <img src={up('icons/icon-e7becd776e.svg')} width="13" height="13" alt="" />
                    Create new agent
                  </button>
                  <button className="dc-c372">Configure agent</button>
                </div>
              </div>
            )}

            <div className="dc-c9" />
            <span className="dc-c344">Querying <span>{checked.length}</span> sources</span>
            <button className="dc-c373">⋯</button>
          </div>

          <div className="dc-c374">
            <div className="dc-c375">
              <div className="dc-c376">
                <div className="dc-c377">
                  <img src={up('icons/icon-14324fd95a.svg')} width="22" height="22" alt="" />
                </div>
                <h1 className="dc-c378">Welcome to Oracle AI Agent Studio</h1>
                <p className="dc-c379">Ask questions across Oracle ERP, Finance, Procurement, Supply Chain, HR, Accounts Payable, Order-to-Cash, or any connected enterprise data source.</p>
                <div className="dc-c380">
                  {D.PROMPT_TEXTS.map((t, i) => (
                    <button key={i} className="dc-c381" onClick={() => setChatInput(t)}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="dc-c58">
                <div className="dc-c382">Show delayed purchase orders with supplier impact</div>
              </div>

              <div className="dc-c51">
                <div className="dc-c188">
                  <div className="dc-c189">{activeAgent.initials}</div>
                  <span className="dc-c190">{activeAgent.name}</span>
                  <span className="dc-c383">· queried Oracle ERP Cloud, PO Register, Vendor Master API</span>
                </div>

                <p className="dc-c384">
                  I found <strong>14 purchase orders</strong> past their promised delivery date across your connected sources, totaling <strong>$2.41M</strong> in open value <span className="dc-c385">1</span>. Raw-material suppliers account for 41% of the exposure. The five highest-impact orders <span className="dc-c385">2</span>:
                </p>

                <div className="dc-c386">
                  <table className="dc-c172">
                    <thead>
                      <tr className="dc-c387">
                        <th className="dc-c388">PO NUMBER</th>
                        <th className="dc-c388">SUPPLIER</th>
                        <th className="dc-c389">OPEN VALUE</th>
                        <th className="dc-c388">PROMISED</th>
                        <th className="dc-c389">DAYS LATE</th>
                        <th className="dc-c388">IMPACT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {D.PO_ROWS.map((r) => (
                        <tr className="dc-c390" key={r.po}>
                          <td className="dc-c391">{r.po}</td>
                          <td className="dc-c392">{r.supplier}</td>
                          <td className="dc-c393">{r.amount}</td>
                          <td className="dc-c394">{r.due}</td>
                          <td className="dc-c395">{r.days}</td>
                          <td className="dc-c182"><span className="dc-c183" style={{ color: r.badgeColor, background: r.badgeBg }}>{r.impact}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="dc-c396">
                  <div className="dc-c196">
                    <span className="dc-c197">Delay exposure by category</span>
                    <span className="dc-c383">Open PO value, past due · Q2 FY26</span>
                  </div>
                  <div className="dc-c167">
                    {D.CHART.map((c, i) => {
                      const color = i === 0 ? ACCENT : i === 1 ? '#E8697D' : i === 2 ? '#F0A0AD' : i === 3 ? '#F5C4CC' : '#F9DDE1';
                      return (
                        <div className="dc-c198" key={c.label}>
                          <span className="dc-c397">{c.label}</span>
                          <div className="dc-c398"><div className="dc-c201" style={{ width: `${c.pct}%`, background: color }} /></div>
                          <span className="dc-c399">{c.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="dc-c400">
                  <div className="dc-c204">
                    <img src={up('icons/icon-27710ba2ab.svg')} width="14" height="14" alt="" />
                  </div>
                  <div>
                    <div className="dc-c401">Oracle recommends</div>
                    <div className="dc-c402">Enable <strong>auto-expedite</strong> in Oracle Fusion SCM for the two critical POs and alert the Acme Industrial category manager. Estimated recovery: <strong>6–9 days</strong>. A pre-built expedite workflow is available in Workflow Generator.</div>
                  </div>
                </div>

                <div className="dc-c386">
                  <div className="dc-c403" onClick={() => setInsightOpen((v) => !v)}>
                    <img src={up('icons/icon-ff35fe084d.svg')} width="15" height="15" alt="" />
                    <span className="dc-c209">Insight: why are these orders delayed?</span>
                    <img src={up('icons/icon-4a7516de8a.svg')} width="14" height="14" alt="" className="dc-c210" style={{ transform: insightOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                  {insightOpen && (
                    <div className="dc-c404">
                      <ul className="dc-c405">
                        <li><strong>Supplier capacity</strong> — Acme Industrial is running at 96% capacity; both critical POs share its Pune line.</li>
                        <li><strong>Logistics congestion</strong> — TransGlobal shipments are held at Nhava Sheva port (avg. +6 days this quarter).</li>
                        <li><strong>MRP reschedule gap</strong> — 4 POs were rescheduled in planning but the new dates never propagated to supplier commitments.</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="dc-c214">
                  <span className="dc-c406"><span className="dc-c407">1</span>Oracle ERP Cloud · PO_HEADERS_ALL</span>
                  <span className="dc-c406"><span className="dc-c407">2</span>PO_Register_FY26.xlsx</span>
                  <span className="dc-c406"><span className="dc-c407">3</span>Oracle Database · FIN_PROD</span>
                  <div className="dc-c9" />
                  <div className="dc-c408">
                    <button title="Helpful" className="dc-c218 dc-c218-hv2"><img src={up('icons/icon-5429f77838.svg')} width="14" height="14" alt="" /></button>
                    <button title="Copy" className="dc-c218 dc-c218-hv2"><img src={up('icons/icon-f686b562b1.svg')} width="14" height="14" alt="" /></button>
                    <button title="Regenerate" className="dc-c218 dc-c218-hv2"><img src={up('icons/icon-185b29c526.svg')} width="14" height="14" alt="" /></button>
                    <button className="dc-c409"><img src={up('icons/icon-573bc74c6f.svg')} width="13" height="13" alt="" />Add to report</button>
                  </div>
                </div>
              </div>

              <div className="dc-c58">
                <div className="dc-c382">Generate the Oracle SQL behind this analysis</div>
              </div>

              <div className="dc-c220">
                <div className="dc-c188">
                  <div className="dc-c189">{activeAgent.initials}</div>
                  <span className="dc-c190">{activeAgent.name}</span>
                  <span className="dc-c383">· schema-aware · FIN_PROD</span>
                </div>
                <p className="dc-c384">Here's the query against the Procurement schema in <strong>FIN_PROD</strong>. It joins PO headers, lines and supplier master, keeping open lines past their promised date <span className="dc-c385">3</span>:</p>
                <div className="dc-c410">
                  <div className="dc-c411">
                    <img src={up('icons/icon-c2c1563a15.svg')} width="13" height="13" alt="" />
                    <span className="dc-c412">ORACLE SQL · FIN_PROD</span>
                    <div className="dc-c9" />
                    <button className="dc-c413"><img src={up('icons/icon-1b31699bdc.svg')} width="12" height="12" alt="" />Copy</button>
                    <button className="dc-c414"><img src={up('icons/icon-a477153fb4.svg')} width="10" height="10" alt="" />Run in Oracle Database</button>
                  </div>
                  <pre className="dc-c415">{`SELECT ph.segment1            AS po_number,
       s.vendor_name         AS supplier,
       SUM(pl.unit_price * pl.quantity_open) AS open_value,
       ll.promised_date,
       TRUNC(SYSDATE - ll.promised_date)     AS days_late
FROM   po_headers_all ph
JOIN   po_lines_all pl        ON pl.po_header_id = ph.po_header_id
JOIN   po_line_locations_all ll ON ll.po_line_id = pl.po_line_id
JOIN   ap_suppliers s         ON s.vendor_id = ph.vendor_id
WHERE  ll.promised_date < SYSDATE
  AND  pl.quantity_open > 0
GROUP BY ph.segment1, s.vendor_name, ll.promised_date
ORDER BY open_value DESC;`}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="dc-c246">
            <div className="dc-c419">
              <div className="dc-c420">
                <textarea
                  rows="1"
                  placeholder={`Ask ${activeAgent.name} anything about your enterprise data…`}
                  className="dc-c421"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <div className="dc-c252">
                  <button title="Attach files" className="dc-c422"><img src={up('icons/icon-93987f540d.svg')} width="15" height="15" alt="" /></button>
                  <button className="dc-c423"><img src={up('icons/icon-ba15f3db49.svg')} width="12" height="12" alt="" />Source</button>
                  <button className="dc-c423"><img src={up('icons/icon-77427d717a.svg')} width="12" height="12" alt="" />Agent</button>
                  <button title="Quick prompts" className="dc-c422"><img src={up('icons/icon-258fe473de.svg')} width="14" height="14" alt="" /></button>
                  <div className="dc-c9" />
                  <button title="Voice input" className="dc-c424"><img src={up('icons/icon-bdb4fa472a.svg')} width="15" height="15" alt="" /></button>
                  <button title="Send" className="dc-c425" onClick={() => setChatInput('')}><img src={up('icons/icon-8743b9e5a4.svg')} width="15" height="15" alt="" /></button>
                </div>
              </div>
              <div className="dc-c426">Prototype by Tech Mahindra for Oracle · Responses shown are illustrative demo data</div>
            </div>
          </div>
        </main>

        {/* RIGHT: AI STUDIO */}
        {rightOpen ? (
          <aside data-screen-label="AI Studio panel" className="dc-c427">
            <div className="dc-c257">
              <div className="dc-c188">
                <span className="dc-c110">AI Studio</span>
                <span className="dc-c428">15 tools</span>
              </div>
              <button title="Collapse panel" className="dc-c330" onClick={() => setRightOpen(false)}>
                <img src={up('icons/icon-1ff89f7339.svg')} width="15" height="15" alt="" />
              </button>
            </div>
            <div className="dc-c429">Generate outputs from your <span>{checked.length}</span> selected sources. Pin favourites to keep them on top.</div>

            <div className="dc-c430">
              {pinned.length > 0 && <div className="dc-c431">PINNED</div>}
              <div className="dc-c432">
                {sortedTools.map((t) => {
                  const p = pinned.includes(t.id);
                  return (
                    <div className="dc-c433 dc-c433-hv2" key={t.id} style={{ border: `1px solid ${p ? '#F0D4C9' : '#EBE7E0'}`, background: p ? '#FDFAF6' : '#fff' }}>
                      <div className="dc-c434">
                        <div className="dc-c435">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4A443C" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon} /></svg>
                        </div>
                        <button title="Pin tool" className="dc-c436" onClick={(e) => { e.stopPropagation(); togglePinned(t.id); }}>
                          <StarIcon filled={p} stroke={p ? ACCENT : '#B0A99D'} />
                        </button>
                      </div>
                      <div>
                        <div className="dc-c437">{t.name}</div>
                        <div className="dc-c438">{t.desc}</div>
                      </div>
                      <button className="dc-c439">Launch<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></button>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        ) : (
          <aside className="dc-c354">
            <button title="Expand AI Studio" className="dc-c355" onClick={() => setRightOpen(true)}>
              <img src={up('icons/icon-321c9b6ca7.svg')} width="15" height="15" alt="" />
            </button>
            <img src={up('icons/icon-0f58ee8909.svg')} width="17" height="17" alt="" />
            <span className="dc-c356">AI STUDIO</span>
          </aside>
        )}
      </div>
    </div>
  );
}
