import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './JobResultCard.css';

const COLLAPSE_LINE_THRESHOLD = 8;
const COLLAPSE_CHAR_THRESHOLD = 900;

function truncateText(text, maxLines) {
  const lines = text.split('\n');
  if (lines.length <= maxLines) return text;
  return lines.slice(0, maxLines).join('\n');
}

export default function JobResultCard({ text }) {
  const lineCount = text.split('\n').length;
  const isLong = lineCount > COLLAPSE_LINE_THRESHOLD || text.length > COLLAPSE_CHAR_THRESHOLD;
  const [expanded, setExpanded] = useState(!isLong);

  const displayText = expanded ? text : truncateText(text, COLLAPSE_LINE_THRESHOLD);

  return (
    <div className="job-result-card">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayText}</ReactMarkdown>
      {isLong && (
        <button
          type="button"
          className="job-result-card__toggle"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
