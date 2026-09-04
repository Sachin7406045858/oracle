import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import up from '../lib/uploads.js';
import '../styles/login-base.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pwdVisible, setPwdVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function clearError() {
    if (error) setError('');
  }

  function validate() {
    const em = email.trim();
    if (!em) return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return 'Enter a valid email address.';
    if (!password) return 'Please enter your password.';
    if (password.length < 4) return 'Password is too short.';
    return '';
  }

  function submit() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('erpAiSession', JSON.stringify({ email, ts: Date.now() }));
      navigate('/oracle-solution-studio');
    }, 900);
  }

  function onPasswordKeyDown(e) {
    if (e.key === 'Enter') submit();
  }

  const inputBorder = error ? '1px solid #E5484D' : '1px solid #D8DADE';

  return (
    <div className="dc-c60">
      <div className="dc-c61">
        <img src={up('vertical-shot-patterns-beautiful-sand-dunes-desert.jpg')} alt="" className="dc-c62" />
        <div className="dc-c63" />
        <div className="dc-c64">
          <h2 className="dc-c65">Oracle Turning Edge</h2>
          <p className="dc-c66">Automate, analyze, and accelerate Oracle ERP.</p>
        </div>
      </div>

      <div className="dc-c67">
        <img src={up('TM_Logo_Color_Pos_RGB.svg')} alt="Tech Mahindra" className="dc-c68" />

        <div className="dc-c69">
          <div className="dc-c70">
            <div className="dc-c52">
              <span className="dc-c71">Login your account</span>
              <h1 className="dc-c72">Welcome Back!</h1>
            </div>

            <div className="dc-c73">
              {error && (
                <div className="dc-c74">
                  <img src={up('icons/icon-9c216079b0.svg')} width="15" height="15" alt="" className="dc-c11" />
                  <span>{error}</span>
                </div>
              )}

              <div className="dc-c75">
                <label className="dc-c76">Email address</label>
                <div className="dc-c77">
                  <img src={up('icons/icon-7577df64c4.svg')} width="16" height="16" alt="" className="dc-c78" />
                  <input
                    type="email"
                    placeholder="you@oracle.com"
                    className="dc-c79"
                    style={{ border: inputBorder }}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  />
                </div>
              </div>

              <div className="dc-c75">
                <label className="dc-c76">Password</label>
                <div className="dc-c77">
                  <img src={up('icons/icon-1e42c3c6fe.svg')} width="16" height="16" alt="" className="dc-c78" />
                  <input
                    type={pwdVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="dc-c80"
                    style={{ border: inputBorder }}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    onKeyDown={onPasswordKeyDown}
                  />
                  <button type="button" title="Show/hide password" className="dc-c81" onClick={() => setPwdVisible((v) => !v)}>
                    <img src={up('icons/icon-3ff2bae6c7.svg')} width="16" height="16" alt="" style={{ display: pwdVisible ? '' : 'none' }} />
                    <img src={up('icons/icon-3ffd08b213.svg')} width="16" height="16" alt="" style={{ display: pwdVisible ? 'none' : '' }} />
                  </button>
                </div>
              </div>

              <div className="dc-c82">
                <label className="dc-c83">
                  <div
                    className="dc-c84"
                    style={{ background: remember ? '#E31837' : 'transparent', border: `1.5px solid ${remember ? '#E31837' : '#B7BAC1'}` }}
                    onClick={() => setRemember((r) => !r)}
                  >
                    <img src={up('icons/icon-a9dd1e895b.svg')} width="10" height="10" alt="" />
                  </div>
                  Remember me
                </label>
                <a href="#forgot">Forgot Password?</a>
              </div>

              <button id="submitBtn" className="dc-c86" style={{ opacity: loading ? 0.75 : 1 }} onClick={submit}>
                {loading ? (
                  <span>
                    <img src={up('icons/icon-7d202fa7a7.svg')} width="16" height="16" alt="" className="dc-c87" />
                    Signing in…
                  </span>
                ) : (
                  <span>Sign in</span>
                )}
              </button>

              <a href="#/oracle-ai-agent-studio-dark" className="dc-c88" onClick={(e) => { e.preventDefault(); navigate('/oracle-ai-agent-studio-dark'); }}>
                <img src={up('icons/icon-01f11615da.svg')} width="16" height="16" alt="" />
                Sign in with Oracle SSO
              </a>

              <p className="dc-c89">A Tech Mahindra prototype built for Oracle · Not for production use</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
