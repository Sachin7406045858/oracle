import { useNavigate } from 'react-router-dom';
import up from '../lib/uploads.js';
import SimpleTopNav from '../components/SimpleTopNav.jsx';
import '../styles/about-base.css';

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="dc-c1">
      <SimpleTopNav page="about" />

      <main data-screen-label="About content" className="dc-c28">
        <div className="dc-c29">
          <div className="dc-c30" style={{ maxWidth: 'none' }}>
            <div className="dc-c31">
              <div className="dc-c32">
                <div className="dc-c33">
                  <span className="dc-c34" />
                  About this tool
                </div>
                <h1 className="dc-c35" style={{ fontSize: 27 }}>
                  Welcome to the Gen AI Based NLP ERP Query Tool, a revolutionary system designed to simplify your interaction with Oracle's Enterprise Resource Planning (ERP) platform
                </h1>
              </div>
              <a href="#/oracle-solution-studio" className="dc-c36" onClick={(e) => { e.preventDefault(); navigate('/oracle-solution-studio'); }}>
                <img src={up('icons/icon-1c6dd1d7f5.svg')} width="14" height="14" alt="" />
                Back
              </a>
            </div>

            <div className="dc-c37">
              <p className="dc-c38" style={{ fontSize: 16 }}>
                This tool utilizes the power of Natural Language Processing (NLP) to provide an intuitive interface for accessing and understanding complex ERP data. By connecting to an Oracle database, it enables users to retrieve crucial Procure-to-Pay information effortlessly.
              </p>
              <p className="dc-c39" style={{ fontSize: 14 }}>
                With GenAI's assistance, ERP management teams can gain valuable insights and make informed decisions. Here's how it can enhance your ERP data management.
              </p>
            </div>

            <div className="dc-c40">
              <div className="dc-c41">
                <div className="dc-c42">
                  <img src={up('icons/icon-2b6aeaafac.svg')} width="18" height="18" alt="" />
                </div>
                <div className="dc-c43" style={{ fontSize: 16 }}>Recent Invoices and Purchase Orders</div>
                <div className="dc-c44" style={{ fontSize: 14 }}>The tool can quickly generate lists of invoices and purchase orders created in the last quarter, enabling easy tracking and analysis of recent financial transactions.</div>
              </div>
              <div className="dc-c41">
                <div className="dc-c42">
                  <img src={up('icons/icon-12d30a868a.svg')} width="18" height="18" alt="" />
                </div>
                <div className="dc-c43" style={{ fontSize: 16 }}>Invoice Details by Business Unit</div>
                <div className="dc-c44" style={{ fontSize: 14 }}>For specific insights, GenAI can list invoice numbers by business unit, e.g., National Water Company, providing a focused view of financial activities.</div>
              </div>
              <div className="dc-c41">
                <div className="dc-c42">
                  <img src={up('icons/icon-f2f4c94df4.svg')} width="18" height="18" alt="" />
                </div>
                <div className="dc-c43" style={{ fontSize: 16 }}>Invoice Details by Supplier</div>
                <div className="dc-c44" style={{ fontSize: 14 }}>Similarly, it can provide invoice details by supplier, such as LARSON &amp; TOURBO, helping to track supplier-specific transactions.</div>
              </div>
            </div>

            <div className="dc-c9" />
          </div>
        </div>
      </main>
    </div>
  );
}
