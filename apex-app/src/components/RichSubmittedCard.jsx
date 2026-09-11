// "Submitted / approved / on hold / etc" confirmation card, matching the
// design reference's green-check success card. Generic across both agents
// (Employee Queries leave request, AP Manager invoice actions) since the
// shape (title + rows + optional note) is the same either way.

export default function RichSubmittedCard({ shape, quickActions, onQuickAction }) {
  if (!shape) return null;
  const { title, rows, note, lead } = shape;

  return (
    <div>
      {lead && (
        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text0)', marginBottom: 8 }}>{lead}</div>
      )}
      <div
        style={{
          background: 'var(--bg1)',
          border: '1px solid var(--border1)',
          borderRadius: 14,
          padding: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 99,
              background: '#3FB56C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text0b)' }}>{title}</span>
        </div>
        {rows && rows.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: note ? 11 : 0 }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
                <span style={{ color: 'var(--text2)' }}>{r.label}</span>
                <span style={{ fontWeight: 600, color: 'var(--text0)', textAlign: 'right' }}>{r.value}</span>
              </div>
            ))}
          </div>
        )}
        {note && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '11.5px',
              color: 'var(--text1)',
              background: 'var(--bg2)',
              borderRadius: 9,
              padding: '8px 10px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16v16H4zM22 6l-10 7L2 6" />
            </svg>
            {note}
          </div>
        )}
      </div>
      {quickActions && quickActions.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
          {quickActions.map((label, i) => (
            <button
              key={i}
              onClick={() => onQuickAction && onQuickAction(label)}
              style={{
                border: '1px solid var(--border2)',
                background: 'var(--bg1)',
                borderRadius: 99,
                padding: '7px 13px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text0)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
