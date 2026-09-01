import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import About from './pages/About.jsx';
import Settings from './pages/Settings.jsx';
import OracleSolutionStudio from './pages/OracleSolutionStudio.jsx';
import TechMOracleSolutionStudio from './pages/TechMOracleSolutionStudio.jsx';
import OracleAIAgentStudio from './pages/OracleAIAgentStudio.jsx';
import OracleAIAgentStudioV2Dark from './pages/OracleAIAgentStudioV2Dark.jsx';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/oracle-solution-studio" element={<OracleSolutionStudio />} />
        <Route path="/techm-oracle-solution-studio" element={<TechMOracleSolutionStudio />} />
        <Route path="/oracle-ai-agent-studio" element={<OracleAIAgentStudio />} />
        <Route path="/oracle-ai-agent-studio-dark" element={<OracleAIAgentStudioV2Dark />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}
