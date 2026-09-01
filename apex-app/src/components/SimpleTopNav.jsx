import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import up from '../lib/uploads.js';

// Shared header used by About and Settings pages (matches dc-c1..dc-c27 markup).
export default function SimpleTopNav({ page }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function logout() {
    localStorage.removeItem('erpAiSession');
    navigate('/login');
  }

  return (
    <header data-screen-label="Top navigation" className="dc-c2">
      <div className="dc-c3">
        <a href="#/oracle-solution-studio" className="dc-c4" onClick={(e) => { e.preventDefault(); navigate('/oracle-solution-studio'); }}>
          <img src={up('TM_Logo_Color_Pos_RGB.svg')} alt="Tech Mahindra" className="dc-c5" />
        </a>
        <div className="dc-c6" />
        <a href="#/oracle-solution-studio" className="dc-c7" onClick={(e) => { e.preventDefault(); navigate('/oracle-solution-studio'); }}>
          <span className="dc-c8">Oracle ERP AI Assist</span>
        </a>
      </div>

      <div className="dc-c9" />

      <div className="dc-c10">
        <img src={up('icons/icon-6eb771e914.svg')} width="15" height="15" alt="" className="dc-c11" />
        <input placeholder="Search agents, sources, conversations…" className="dc-c12" />
        <span className="dc-c13">⌘K</span>
      </div>

      <div className="dc-c14">
        <button title="Notifications" className="dc-c15">
          <img src={up('icons/icon-daa60afa85.svg')} width="18" height="18" alt="" />
          <span className="dc-c16" />
        </button>
        <button title="Install app" className="dc-c17">
          <img src={up('icons/icon-c65420b8da.svg')} width="15" height="15" alt="" />
          Install app
        </button>
        <div className="dc-c18" />
        <div className="dc-c19">
          <div className="dc-c20" onClick={() => setMenuOpen((v) => !v)}>
            <div className="dc-c21">
              <img src={up('icons/icon-92a3531814.svg')} width="14" height="14" alt="" />
            </div>
            <span className="dc-c22">oracle.apex_r2r</span>
            <img src={up('icons/icon-a88a1806d8.svg')} width="13" height="13" alt="" className="dc-c23" style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </div>
          {menuOpen && (
            <div className="dc-c24">
              {page !== 'about' ? (
                <div className="dc-c25" onClick={() => navigate('/about')}>
                  <img src={up('icons/icon-2273e74141.svg')} width="15" height="15" alt="" />
                  About
                </div>
              ) : (
                <div className="dc-c45">
                  <img src={up('icons/icon-2273e74141.svg')} width="15" height="15" alt="" />
                  About
                </div>
              )}
              {page !== 'settings' ? (
                <div className="dc-c25" onClick={() => navigate('/settings')}>
                  <img src={up('icons/icon-e689ba85d2.svg')} width="15" height="15" alt="" />
                  Settings
                </div>
              ) : (
                <div className="dc-c45">
                  <img src={up('icons/icon-e689ba85d2.svg')} width="15" height="15" alt="" />
                  Settings
                </div>
              )}
              <div className="dc-c26" />
              <div className="dc-c27 dc-c27-hv1" onClick={logout}>
                <img src={up('icons/icon-98894ca471.svg')} width="15" height="15" alt="" />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
