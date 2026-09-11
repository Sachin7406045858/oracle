import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './JobResultCard.css';

export default function JobResultCard({ text }) {
  return (
    <div className="job-result-card">
      <div className="job-result-card__header">
        <span className="job-result-card__icon" aria-hidden="true">📋</span>
        <span className="job-result-card__title">Job Result</span>
      </div>
      <div className="job-result-card__body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    </div>
  );
}
