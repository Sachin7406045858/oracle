// Rich "stat card" rendering for a parsed live-agent reply — big number +
// unit, optional progress bar, then a list of label/value rows, followed by
// quick-action chip buttons that resend the label text to the live agent.
// Styling matches the design reference (Employee Queries Agent leave-balance
// card) using the app's existing CSS custom properties so it respects the
// current theme + accent color.

export default function RichStatCard({ shape, quickActions, onQuickAction }) {
  if (!shape) return null;
  const { heading, unit, rows, progress, title } = shape;

  return (
    <div>
      {title && (
        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text0)', marginBottom: 8 }}>{title}</div>
      )}
      <div
        style={{
          background: 'var(--bg1)',
          border: '1px solid var(--border1)',
          borderRadius: 14,
          padding: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 26, fontWeight: 750, letterSpacing: '-.02em', color: 'var(--text0b)' }}>{heading}</div>
          {unit && <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>{unit}</div>}
        </div>
        {progress != null && (
          <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ width: `${Math.max(0, Math.min(100, progress))}%`, height: '100%', background: 'var(--accent,#E31837)', borderRadius: 99 }} />
          </div>
        )}
        {rows && rows.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {rows.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  fontSize: 12,
                  padding: '6px 0',
                  borderTop: '1px solid var(--border3)',
                }}
              >
                <span style={{ color: 'var(--text2)' }}>{r.label}</span>
                <span style={{ fontWeight: 650, color: 'var(--text0)', textAlign: 'right' }}>{r.value}</span>
              </div>
            ))}
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
