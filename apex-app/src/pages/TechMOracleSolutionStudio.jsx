import { useState } from 'react';
import up from '../lib/uploads.js';
import { FUSION_AGENTS, SOLUTIONS } from '../data/techm-solutions-data.js';
import '../styles/techm-oracle-solution-studio-base.css';

const NAV_ITEMS = [
  { key: 'agents', icon: 'icon-e61105a059.svg', title: 'Oracle Fusion Agents', sub: '22 AI agents' },
  { key: 'assist', icon: 'icon-fa570b845a.svg', title: 'ERP Assist', sub: 'Chat workspace' },
  { key: 'solutions', icon: 'icon-a2d7ef6365.svg', title: 'Oracle Solutions', sub: '8 solutions' },
];

function assistIframeSrc() {
  return window.location.origin + window.location.pathname + '#/oracle-ai-agent-studio-dark';
}

export default function TechMOracleSolutionStudio() {
  const [open, setOpen] = useState('agents');

  return (
    <div className="dc-c579">
      <header data-screen-label="Header" className="dc-c580">
        <div className="dc-c581">TM</div>
        <div className="dc-c582">
          <span className="dc-c583">Tech Mahindra Oracle Solution Studio</span>
          <span className="dc-c584">Access AI Agents, ERP Assist, and Oracle Solutions from one unified workspace.</span>
        </div>
        <div className="dc-c9" />
        <span className="dc-c585">EMBEDDED IN ORACLE FUSION</span>
      </header>

      <div className="dc-c586">
        <nav data-screen-label="Section rail" className="dc-c587">
          {NAV_ITEMS.map((item) => {
            const active = open === item.key;
            return (
              <div
                key={item.key}
                className="dc-c588 nav-item"
                style={{ background: active ? '#FDECEE' : 'transparent', border: `1px solid ${active ? '#F5C6CD' : 'transparent'}` }}
                onClick={() => setOpen(item.key)}
              >
                <div className="dc-c589" style={{ background: active ? '#E31837' : '#F2F3F5', color: active ? '#FFFFFF' : '#4A453D' }}>
                  <img src={up(`icons/${item.icon}`)} width="17" height="17" alt="" />
                </div>
                <div className="dc-c590">
                  <span className="dc-c591">{item.title}</span>
                  <span className="dc-c592">{item.sub}</span>
                </div>
              </div>
            );
          })}
          <div className="dc-c9" />
          <span className="dc-c593">A Tech Mahindra prototype for Oracle</span>
        </nav>

        <main className="dc-c594">
          {open === 'agents' && (
            <div data-screen-label="Fusion Agents" className="dc-c595">
              <div className="dc-c596">
                <span className="dc-c597">Tech Mahindra Oracle Fusion Agents</span>
                <span className="dc-c598">22 agents</span>
              </div>
              <div className="dc-c599">
                {FUSION_AGENTS.map((a) => (
                  <div className="dc-c600" key={a.name}>
                    <div className="dc-c159">
                      <div className="dc-c601">
                        <img src={up(`icons/${a.icon}`)} width="16" height="16" alt="" />
                      </div>
                      <div className="dc-c602">
                        <span className="dc-c591">{a.name}</span>
                        <span className="dc-c603">{a.cat}</span>
                      </div>
                    </div>
                    <span className="dc-c604">{a.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {open === 'assist' && (
            <div data-screen-label="ERP Assist" className="dc-c605">
              <iframe src={assistIframeSrc()} title="ERP Assist" className="dc-c606" />
            </div>
          )}

          {open === 'solutions' && (
            <div data-screen-label="Oracle Solutions" className="dc-c595">
              <div className="dc-c596">
                <span className="dc-c597">Tech Mahindra Oracle Solutions</span>
                <span className="dc-c598">8 solutions</span>
              </div>
              <div className="dc-c607">
                {SOLUTIONS.map((s) => (
                  <div className="dc-c600" key={s.name}>
                    <div className="dc-c159">
                      <div className="dc-c601">
                        <img src={up(`icons/${s.icon}`)} width="16" height="16" alt="" />
                      </div>
                      <div className="dc-c602">
                        <span className="dc-c608">{s.name}</span>
                        <span className="dc-c603">{s.cat}</span>
                      </div>
                      <img src={up('icons/icon-17c14fd09b.svg')} width="14" height="14" alt="" className="dc-c11" />
                    </div>
                    <span className="dc-c604">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
