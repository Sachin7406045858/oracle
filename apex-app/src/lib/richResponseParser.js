// Best-effort heuristic parser that looks at the raw freeform text reply
// coming back from a live Oracle Fusion agent (AP Manager or Employee
// Queries) and tries to detect a handful of known "shapes" so the UI can
// render a richer card instead of plain markdown.
//
// This is inherently fuzzy: Oracle's real API only returns text/markdown,
// not structured JSON, so everything here is regex/heuristic matching on
// that text. The guiding rule is to be conservative — when in doubt, return
// null so the caller falls back to the plain JobResultCard markdown
// rendering, which always works. Never throw.

/**
 * @typedef {{ label: string, value: string }} StatRow
 * @typedef {{ type: 'stat', heading: string, unit: string, rows: StatRow[], progress: number|null, title: string|null }} StatShape
 * @typedef {{ type: 'confirm', title: string, rows: StatRow[] }} ConfirmShape
 * @typedef {{ type: 'submitted', title: string, rows: StatRow[], note: string|null }} SubmittedShape
 */

function safe(fn, fallback = null) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

// Matches a line like "Ending balance: 33.53 Days" or "Used in January: -4.94 Days"
// or "Amount: $1,240.00" — a label, a separator (":" or trailing dots/dashes), and
// a value that looks numeric/currency-ish.
const LABEL_VALUE_RE = /^\s*[-*•]?\s*([A-Za-z][A-Za-z0-9 ()./&'_-]{1,60}?)\s*(?::|\.{2,}|—|-{1,2}>)\s*([+-]?[$€£]?\s?[\d][\d,]*(?:\.\d+)?\s?%?\s?[A-Za-z]{0,20})\s*$/;

// A leading "big number" line: "33.53" or "33.53 days" or "$1,240.00" possibly
// on its own line, optionally followed by a label line.
const BIG_NUMBER_RE = /^\s*([+-]?[$€£]?\s?[\d][\d,]*(?:\.\d+)?)\s*(days?|hours?|aed|usd|inr|%)?\s*$/i;

function splitLines(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/^\s*#{1,6}\s*/, '').trim());
}

function tryParseStatCard(text) {
  const lines = splitLines(text).filter((l) => l.length > 0);
  if (lines.length < 2) return null;

  // Find candidate label/value rows anywhere in the text.
  const rows = [];
  let title = null;
  let bigNumberLine = null;
  let bigNumberIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lv = LABEL_VALUE_RE.exec(line);
    if (lv) {
      const label = lv[1].trim();
      const value = lv[2].trim();
      rows.push({ label, value });
      continue;
    }
    if (bigNumberIdx === -1) {
      const bn = BIG_NUMBER_RE.exec(line);
      if (bn) {
        bigNumberLine = { heading: bn[1].replace(/\s/g, ''), unit: (bn[2] || '').trim() };
        bigNumberIdx = i;
      }
    }
  }

  // Need at least 2 label/value rows to call this a stat card — a single
  // "Label: value" pair is too weak a signal and is likely just prose.
  if (rows.length < 2) return null;

  // Prefer an explicit big-number line; otherwise derive the heading from
  // the first numeric row's value (e.g. "Ending balance: 33.53 Days").
  let heading = null;
  let unit = '';
  if (bigNumberLine) {
    heading = bigNumberLine.heading;
    unit = bigNumberLine.unit;
    // Use the line right before/around the number as a possible title, and
    // any short intro sentence before it as the card subtitle.
    if (bigNumberIdx > 0) {
      const prev = lines[bigNumberIdx - 1];
      if (prev && !LABEL_VALUE_RE.test(prev) && prev.length < 90 && !/[:.]$/.test(prev) === false) {
        title = null; // avoid over-guessing; keep simple
      }
    }
  } else {
    const firstNumericRow = rows.find((r) => /\d/.test(r.value));
    if (!firstNumericRow) return null;
    const m = /^([+-]?[$€£]?\s?[\d][\d,]*(?:\.\d+)?)\s*(.*)$/.exec(firstNumericRow.value);
    if (!m) return null;
    heading = m[1].replace(/\s/g, '');
    unit = (m[2] || '').trim();
    if (!unit) unit = firstNumericRow.label;
  }

  if (!heading) return null;

  // Try to find a lead sentence (not a row, not the heading line) to use as
  // a short subtitle above the card, e.g. "Here's your current leave
  // position, George."
  const leadSentence = lines.find(
    (l, idx) => idx < 3 && !LABEL_VALUE_RE.test(l) && !BIG_NUMBER_RE.test(l) && l.length > 8 && l.length < 160
  ) || null;

  // Optional progress bar: look for an explicit "X out of Y" / "X/Y" pattern,
  // or a row whose value looks like a percentage.
  let progress = null;
  const pctRow = rows.find((r) => /%$/.test(r.value.trim()));
  if (pctRow) {
    const p = parseFloat(pctRow.value);
    if (!Number.isNaN(p)) progress = Math.max(0, Math.min(100, p));
  } else {
    const fractionMatch = /([\d.]+)\s*(?:of|out of|\/)\s*([\d.]+)/i.exec(text);
    if (fractionMatch) {
      const a = parseFloat(fractionMatch[1]);
      const b = parseFloat(fractionMatch[2]);
      if (b > 0 && !Number.isNaN(a)) progress = Math.max(0, Math.min(100, (a / b) * 100));
    }
  }

  return {
    type: 'stat',
    heading,
    unit,
    rows: rows.slice(0, 8),
    progress,
    title: leadSentence,
  };
}

const CONFIRM_KEYWORDS = /ready to submit|review before|please confirm|confirm before|does this look right/i;
const SUBMIT_ACTION_WORDS = /confirm\s*&?\s*submit|confirm and submit/i;

function tryParseConfirmCard(text) {
  if (!CONFIRM_KEYWORDS.test(text)) return null;
  const lines = splitLines(text).filter(Boolean);
  const rows = [];
  for (const line of lines) {
    const lv = LABEL_VALUE_RE.exec(line);
    if (lv) rows.push({ label: lv[1].trim(), value: lv[2].trim() });
  }
  if (rows.length === 0) return null;
  const titleLine = lines.find((l) => CONFIRM_KEYWORDS.test(l)) || 'Ready to submit — review before I file this';
  return {
    type: 'confirm',
    title: titleLine.replace(/[*_#]/g, '').trim(),
    rows: rows.slice(0, 8),
  };
}

const SUBMITTED_KEYWORDS = /\b(submitted|awaiting approval|request id|has been submitted|created successfully|placed on hold|hold (?:has been )?released|approved|payment processed|cancel(?:l?ed)?)\b/i;

function tryParseSubmittedCard(text) {
  if (!SUBMITTED_KEYWORDS.test(text)) return null;
  const lines = splitLines(text).filter(Boolean);
  const rows = [];
  for (const line of lines) {
    const lv = LABEL_VALUE_RE.exec(line);
    if (lv) rows.push({ label: lv[1].trim(), value: lv[2].trim() });
  }
  // Require some structure (at least one row) so we don't hijack a plain
  // sentence like "Your request was submitted." with no details.
  if (rows.length === 0) return null;

  let title = 'Submitted';
  if (/awaiting approval/i.test(text)) title = 'Submitted — awaiting approval';
  else if (/approved/i.test(text)) title = 'Approved';
  else if (/payment processed|\bpaid\b/i.test(text)) title = 'Payment processed';
  else if (/placed on hold/i.test(text)) title = 'Placed on hold';
  else if (/hold (?:has been )?released/i.test(text)) title = 'Hold released';
  else if (/cancel/i.test(text)) title = 'Canceled';
  else if (/created successfully/i.test(text)) title = 'Created';

  let note = null;
  const noteMatch = /notified[^.\n]*\./i.exec(text);
  if (noteMatch) note = noteMatch[0].trim();

  const leadSentence = lines.find((l) => !LABEL_VALUE_RE.test(l) && l.length > 4 && l.length < 200) || null;

  return {
    type: 'submitted',
    title,
    rows: rows.slice(0, 8),
    note,
    lead: leadSentence,
  };
}

/**
 * Attempt to detect a rich shape in the given raw agent reply text.
 * Returns a shape descriptor object, or null if nothing recognized —
 * callers must fall back to plain markdown rendering on null.
 * Never throws.
 */
export function parseRichResponse(text) {
  return safe(() => {
    if (!text || typeof text !== 'string') return null;
    const trimmed = text.trim();
    if (!trimmed) return null;

    // Order matters: submitted/confirm are keyword-gated and fairly
    // specific, so check them first; the stat-card heuristic is looser
    // (any 2+ label/value rows) and should not shadow a submit/confirm
    // response that also happens to contain rows.
    const submitted = tryParseSubmittedCard(trimmed);
    if (submitted) return submitted;

    const confirm = tryParseConfirmCard(trimmed);
    if (confirm) return confirm;

    const stat = tryParseStatCard(trimmed);
    if (stat) return stat;

    return null;
  }, null);
}

export default parseRichResponse;
