import { useState } from 'react';
import { CHECKED_ON, FIGURES, SOURCES, usd } from './evidence';

// Visual pieces for the scan result. Every number comes from evidence.js (cited, re-checked); the only
// arithmetic done here is adding cited averages into a running total, and it is labelled as such.

const card = { marginBottom: 12, padding: 14, borderRadius: 18, border: '1.5px solid var(--line)', background: 'var(--panel)' };
const kicker = { fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--tx2)' };

function Cite({ ids }) {
  return (
    <sup style={{ fontSize: 9, marginLeft: 2 }}>
      {ids.filter((id, i) => ids.findIndex((j) => FIGURES[j].src === FIGURES[id].src) === i).map((id) => (
        <a key={id} href={SOURCES[FIGURES[id].src].url} target="_blank" rel="noreferrer" title={FIGURES[id].quote}
          style={{ color: 'var(--acc)', textDecoration: 'none', marginLeft: 1 }}>[{Object.keys(SOURCES).indexOf(FIGURES[id].src) + 1}]</a>
      ))}
    </sup>
  );
}

export function Sources({ ids }) {
  const [open, setOpen] = useState(false);
  const srcIds = [...new Set(ids.map((id) => FIGURES[id].src))];
  return (
    <div style={{ marginTop: 10 }}>
      <button className="ns-btn" aria-expanded={open} onClick={() => setOpen(!open)} style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx2)' }}>
        {open ? 'Hide sources' : `Sources (${srcIds.length})`} ·<span style={{ fontWeight: 500 }}> checked {CHECKED_ON}</span>
      </button>
      {open && (
        <ol style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 11, lineHeight: '16px', color: 'var(--tx2)' }}>
          {srcIds.map((sid) => {
            const s = SOURCES[sid];
            return (
              <li key={sid} value={Object.keys(SOURCES).indexOf(sid) + 1} style={{ marginBottom: 6 }}>
                {s.publisher}, <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--acc)' }}>{s.title}</a>
                {s.updated ? ` (${s.updated})` : ''}
                {s.archive && <> · <a href={s.archive} target="_blank" rel="noreferrer" style={{ color: 'var(--tx2)' }}>archived copy</a></>}
                {ids.filter((id) => FIGURES[id].src === sid).map((id) => (
                  <span key={id} style={{ display: 'block', fontStyle: 'italic' }}>“{FIGURES[id].quote}”</span>
                ))}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

// Water: what the problem costs if it is fixed now vs if the water keeps going.
export function CostLadder() {
  const F = FIGURES;
  const steps = [
    { icon: '🔧', title: 'Fix the leak now', body: `Repair only${' '}(typical range ${usd(F.pipeRepair.lo)}–${usd(F.pipeRepair.hi)})`, add: F.pipeRepair.avg, ids: ['pipeRepair'] },
    { icon: '💧', title: 'Water soaks the wall', body: `+ drywall ${usd(F.drywall.avg)} + water-damage cleanup ${usd(F.restoration.avg)}`, add: F.drywall.avg + F.restoration.avg, ids: ['drywall', 'restoration'] },
    { icon: '🍄', title: 'Mold sets in', body: `+ mold removal ${usd(F.mold.avg)}. Mold can start if things aren't dried within 24–48 h`, add: F.mold.avg, ids: ['mold', 'moldWindow'] },
  ];
  let run = 0;
  const rows = steps.map((s) => ({ ...s, total: (run += s.add) }));
  const max = F.claim.avg;
  return (
    <div style={card}>
      <div style={kicker}>What waiting can cost</div>
      <div className="ns-serif" style={{ fontSize: 20, lineHeight: '25px', fontWeight: 500, margin: '2px 0 10px' }}>
        Fix now: <span style={{ color: 'var(--ok)' }}>~{usd(F.pipeRepair.avg)}</span> · Wait: up to <span style={{ color: 'var(--crit)' }}>{usd(F.claim.avg)}</span>
      </div>
      {rows.map((r, i) => (
        <div key={r.title} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: '2px 10px', alignItems: 'center', marginBottom: 10 }}>
          <span aria-hidden="true" style={{ fontSize: 18, textAlign: 'center' }}>{r.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{i + 1}. {r.title}<Cite ids={r.ids} /></span>
          <span className="ns-num" style={{ fontSize: 15, fontWeight: 700, color: i === 0 ? 'var(--ok)' : i === 1 ? 'var(--watch)' : 'var(--crit)' }}>{usd(r.total)}</span>
          <span />
          <span style={{ gridColumn: '2 / 4', height: 8, borderRadius: 4, background: 'var(--panel2)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${Math.max(3, (r.total / max) * 100)}%`, borderRadius: 4, background: i === 0 ? 'var(--ok)' : i === 1 ? 'var(--watch)' : 'var(--crit)' }} />
          </span>
          <span />
          <span style={{ gridColumn: '2 / 4', fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>{r.body}</span>
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: '2px 10px', alignItems: 'center', paddingTop: 8, borderTop: '1px dashed var(--line2)' }}>
        <span aria-hidden="true" style={{ fontSize: 18, textAlign: 'center' }}>🏠</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>Average water-damage insurance claim<Cite ids={['claim']} /></span>
        <span className="ns-num" style={{ fontSize: 15, fontWeight: 700, color: 'var(--crit)' }}>{usd(F.claim.avg)}</span>
        <span />
        <span style={{ gridColumn: '2 / 4', height: 8, borderRadius: 4, background: 'var(--crit)' }} />
      </div>
      <p style={{ margin: '10px 0 0', fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>
        💧 Even a slow drip adds up: one drip per second wastes over {F.leakWaste.faucet.toLocaleString('en-US')} gallons a year.<Cite ids={['leakWaste']} />
      </p>
      <p style={{ margin: '6px 0 0', fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>
        US national averages. The running total adds the averages above; the real cost depends on where the water goes and local prices.
        An emergency call-out costs {F.emergency.lo}–{F.emergency.hi}× the normal rate.<Cite ids={['emergency']} />
      </p>
      <Sources ids={['pipeRepair', 'emergency', 'drywall', 'restoration', 'mold', 'moldWindow', 'claim', 'leakWaste']} />
    </div>
  );
}

// Machines: planned and sensor-predicted maintenance vs waiting for a breakdown.
export function FixEarlyCard() {
  const F = FIGURES;
  const tile = (big, small, color) => (
    <div style={{ flex: 1, padding: '10px 12px', borderRadius: 14, background: 'var(--panel2)' }}>
      <div className="ns-num" style={{ fontSize: 24, fontWeight: 700, color }}>{big}</div>
      <div style={{ fontSize: 12, lineHeight: '16px' }}>{small}</div>
    </div>
  );
  return (
    <div style={card}>
      <div style={kicker}>Why fix it before it breaks</div>
      <div className="ns-serif" style={{ fontSize: 20, lineHeight: '25px', fontWeight: 500, margin: '2px 0 10px' }}>Catching it early costs less</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 12, fontWeight: 700, color: 'var(--tx2)' }}>
        <span style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--crit)', color: 'var(--tagTx)' }}>Wait for breakdown</span>→
        <span style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--watch)', color: 'var(--tagTx)' }}>Planned repair</span>→
        <span style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--ok)', color: 'var(--tagTx)' }}>Sensor-predicted</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {tile(`${F.preventive.lo}–${F.preventive.hi}%`, <>cheaper with planned maintenance than waiting for breakdowns<Cite ids={['preventive']} /></>, 'var(--watch)')}
        {tile(`+${F.predictive.lo}–${F.predictive.hi}%`, <>more saved when sensors predict the fault, like this scan<Cite ids={['predictive']} /></>, 'var(--ok)')}
      </div>
      <Sources ids={['preventive', 'predictive']} />
    </div>
  );
}

// Confidence as a ring instead of a paragraph.
export function ConfidenceRing({ p, color, size = 64 }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  const label = p >= 0.995 ? '>99%' : `${Math.round(p * 100)}%`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label} confident`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--panel2)" strokeWidth="7" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={`${c * Math.min(p, 1)} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="ns-num" style={{ fontSize: size * 0.24, fontWeight: 700, fill: 'var(--tx)' }}>{label}</text>
    </svg>
  );
}

// A collapsed row: one-line summary, details on tap.
export function Disclosure({ title, summary, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: '1px solid var(--line)' }}>
      <button className="ns-btn" aria-expanded={open} onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '11px 2px' }}>
        <span style={{ flexGrow: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>{title}</span>
          {summary && !open && <span style={{ display: 'block', fontSize: 12, color: 'var(--tx2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary}</span>}
        </span>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 220ms', flexShrink: 0 }}><path className="ns-ic" d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && <div style={{ paddingBottom: 12, animation: 'ns-enter 240ms ease both' }}>{children}</div>}
    </div>
  );
}
