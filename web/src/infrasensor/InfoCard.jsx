import { useState } from 'react';

const ROWS = [['signs', 'What you might notice'], ['causes', 'Usual causes'], ['check', 'Check first']];

export function InfoIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path className="ns-ic" d="M12 12m-8.5 0a8.5 8.5 0 1 0 17 0a8.5 8.5 0 1 0-17 0M12 11v5.5M12 7.6h.01" style={{ strokeWidth: 1.9 }} />
    </svg>
  );
}

// Plain-language explainer for a measurement or fault type. Collapsed it is a one-line "What does X mean?" button.
export default function InfoCard({ entry, open: initiallyOpen = false, label }) {
  const [open, setOpen] = useState(initiallyOpen);
  if (!entry) return null;
  return (
    <div style={{ borderRadius: 16, background: 'var(--panel2)', overflow: 'hidden' }}>
      <button className="ns-btn" aria-expanded={open} onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>
        <span style={{ color: 'var(--acc)', display: 'flex' }}><InfoIcon /></span>
        <span style={{ flexGrow: 1 }}>{label || `What does ${entry.title.replace(/ \(.*\)$/, '').toLowerCase()} mean?`}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 220ms' }}><path className="ns-ic" d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div style={{ padding: '0 12px 12px', fontSize: 13, lineHeight: '19px', animation: 'ns-enter 260ms ease both' }}>
          <p style={{ margin: '0 0 8px' }}><strong>{entry.title}.</strong> {entry.what}</p>
          {ROWS.map(([key, name]) => (
            <p key={key} style={{ margin: '0 0 6px' }}>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--tx2)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{name}</span>
              {entry[key]}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
