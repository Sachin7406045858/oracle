import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './JobResultCard.css';

export default function JobResultCard({ text }) {
  return (
    <div className="job-result-card">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}
