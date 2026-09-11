// "Ready to submit — review before I file this" style card, matching the
// design reference. "Confirm & submit" resends confirmation text to the
// live agent conversation so the follow-up goes through the real backend
// call (no simulated/fabricated response).

export default function RichSubmitCard({ shape, onConfirm, onEdit, busy }) {
  if (!shape) return null;
  const { title, rows } = shape;

  return (
    <div
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border2)',
        borderRadius: 14,
        padding: 14,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--text1)',
          letterSpacing: '.04em',
          marginBottom: 10,
          textTransform: 'uppercase',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        {title}
      </div>
      {rows && rows.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
              <span style={{ color: 'var(--text1)' }}>{r.label}</span>
              <span style={{ fontWeight: 650, color: 'var(--text0)', textAlign: 'right' }}>{r.value}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onConfirm}
          disabled={busy}
          style={{
            flex: 1,
            border: 'none',
            background: 'var(--accent,#E31837)',
            color: '#fff',
            borderRadius: 9,
            padding: 9,
            fontSize: '12.5px',
            fontWeight: 650,
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          Confirm &amp; submit
        </button>
        <button
          onClick={onEdit}
          disabled={busy}
          style={{
            border: '1px solid var(--border2)',
            background: 'var(--bg1)',
            color: 'var(--text0)',
            borderRadius: 9,
            padding: '9px 14px',
            fontSize: '12.5px',
            fontWeight: 650,
            cursor: busy ? 'not-allowed' : 'pointer',
          }}
        >
          Edit details
        </button>
      </div>
    </div>
  );
}
