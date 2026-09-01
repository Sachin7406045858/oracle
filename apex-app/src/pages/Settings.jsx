import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleTopNav from '../components/SimpleTopNav.jsx';
import '../styles/settings-base.css';

export default function Settings() {
  const navigate = useNavigate();
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confPw, setConfPw] = useState('');
  const [message, setMessage] = useState({ text: '', ok: false });

  const mismatch = confPw && confPw !== newPw;
  const confBorder = `1px solid ${mismatch ? '#E5484D' : '#D8DADE'}`;

  function clearMessage() {
    if (message.text) setMessage({ text: '', ok: false });
  }

  function savePassword() {
    if (!curPw) {
      setMessage({ text: 'Enter your current password.', ok: false });
      return;
    }
    if (newPw.length < 8) {
      setMessage({ text: 'New password must be at least 8 characters.', ok: false });
      return;
    }
    if (newPw !== confPw) {
      setMessage({ text: 'Passwords do not match.', ok: false });
      return;
    }
    setMessage({ text: 'Password updated successfully.', ok: true });
    setCurPw('');
    setNewPw('');
    setConfPw('');
  }

  return (
    <div className="dc-c1">
      <SimpleTopNav page="settings" />

      <main data-screen-label="Settings content" className="dc-c28">
        <div className="dc-c29">
          <div className="dc-c31">
            <div className="dc-c32">
              <div className="dc-c33">
                <span className="dc-c34" />
                Account preferences
              </div>
              <h1 className="dc-c46">Settings</h1>
            </div>
            <a
              href="#/oracle-solution-studio"
              className="dc-c36"
              onClick={(e) => { e.preventDefault(); navigate('/oracle-solution-studio'); }}
            >
              Back
            </a>
          </div>

          <div className="dc-c47">
            <div className="dc-c48">
              <div className="dc-c49">Account</div>
              <div className="dc-c50">Your identity in Oracle ERP AI Assist.</div>
              <div className="dc-c51">
                <div className="dc-c52">
                  <label className="dc-c53">Username</label>
                  <input value="oracle.apex_r2r" readOnly className="dc-c54" />
                </div>
                <div className="dc-c52">
                  <label className="dc-c53">Display name</label>
                  <input defaultValue="R2R Analyst" placeholder="Enter display name" className="dc-c55" />
                </div>
                <div className="dc-c52">
                  <label className="dc-c53">Email</label>
                  <input defaultValue="r2r.analyst@oracle.com" placeholder="you@oracle.com" className="dc-c55" />
                </div>
              </div>
            </div>

            <div className="dc-c48">
              <div className="dc-c49">Change password</div>
              <div className="dc-c50">Use at least 8 characters with a mix of letters and numbers.</div>
              <div className="dc-c51">
                <div className="dc-c52">
                  <label className="dc-c53">Current password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="dc-c55"
                    value={curPw}
                    onChange={(e) => { setCurPw(e.target.value); clearMessage(); }}
                  />
                </div>
                <div className="dc-c52">
                  <label className="dc-c53">New password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="dc-c55"
                    value={newPw}
                    onChange={(e) => { setNewPw(e.target.value); clearMessage(); }}
                  />
                </div>
                <div className="dc-c52">
                  <label className="dc-c53">Confirm new password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="dc-c56"
                    style={{ border: confBorder }}
                    value={confPw}
                    onChange={(e) => { setConfPw(e.target.value); clearMessage(); }}
                  />
                </div>
                {message.text && (
                  <div className="dc-c57" style={{ color: message.ok ? '#1F8A5B' : '#C8142F' }}>{message.text}</div>
                )}
                <div className="dc-c58">
                  <button className="dc-c59" onClick={savePassword}>Update password</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
