// Conservative keyword-based heuristic that suggests switching agents based
// on what the user is currently typing in the composer. This is a UI
// convenience only — it never auto-switches, it only signals a suggestion
// the caller can offer the user to accept or dismiss.
//
// The guiding rule, same as richResponseParser.js: be conservative. Only
// return a suggestion when the signal is clear and unambiguous (matches for
// one agent's keyword set and zero for the other's), and never for short or
// generic text.

const AP_KEYWORDS = [
  'invoice', 'invoices', 'payment', 'payments', 'supplier', 'suppliers',
  'po', 'purchase order', 'purchase orders', 'ap', 'accounts payable',
  'vendor', 'vendors', 'hold', 'holds', 'aging',
];

const HR_KEYWORDS = [
  'leave', 'vacation', 'compensation', 'salary', 'payslip', 'hr',
  'gratuity', 'benefits', 'benefit', 'insurance', 'policy',
];

const MIN_TEXT_LENGTH = 6;

function countMatches(lowerText, keywords) {
  let count = 0;
  for (const kw of keywords) {
    // Word-boundary match so short keywords like "ap"/"hr" don't match
    // inside unrelated words (e.g. "happy", "chapter").
    const re = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(lowerText)) count++;
  }
  return count;
}

/**
 * Given the composer's current text and the currently-selected agent id,
 * return the id of an agent that looks like a clearly better fit, or null
 * if there's no strong/unambiguous signal (or the text is too short).
 *
 * @param {string} text
 * @param {string} currentAgentId - 'AP_MANAGER' | 'EMPLOYEE_QUERY_AGENT'
 * @returns {'AP_MANAGER' | 'EMPLOYEE_QUERY_AGENT' | null}
 */
export function recommendAgent(text, currentAgentId) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (trimmed.length < MIN_TEXT_LENGTH) return null;
  // Require at least a couple of words — guards against short/generic
  // phrases like "hi" or "show me" that could contain a stray keyword.
  if (trimmed.split(/\s+/).length < 2) return null;

  const lower = trimmed.toLowerCase();
  const apScore = countMatches(lower, AP_KEYWORDS);
  const hrScore = countMatches(lower, HR_KEYWORDS);

  let suggested = null;
  if (apScore > 0 && hrScore === 0) suggested = 'AP_MANAGER';
  else if (hrScore > 0 && apScore === 0) suggested = 'EMPLOYEE_QUERY_AGENT';
  else return null; // ambiguous or no signal

  if (suggested === currentAgentId) return null;
  return suggested;
}

export default recommendAgent;
