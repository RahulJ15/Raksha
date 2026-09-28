import { useState } from 'react';
import { CHECKED_ON, FIGURES, SOURCES, usd } from './evidence';

// Visual pieces for the scan result. Every number comes from evidence.js (cited, re-checked); the only
// arithmetic done here is adding cited averages into a running total, and it is labelled as such.

const card = { marginBottom: 12, padding: 14, borderRadius: 18, border: '1.5px solid var(--line)', background: 'var(--panel)' };
const kicker = { fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--tx2)' };

// Visible source tag(s) for a figure: the organisation and date, linking to the page it came from.
function Cite({ ids, block = false }) {
  const srcIds = [...new Set(ids.map((id) => FIGURES[id].src))];
  return (
    <span style={{ display: block ? 'flex' : 'inline-flex', flexWrap: 'wrap', gap: 4, marginLeft: block ? 0 : 6, marginTop: block ? 4 : 0, verticalAlign: 'middle' }}>
      {srcIds.map((sid) => (
        <a key={sid} href={SOURCES[sid].url} target="_blank" rel="noreferrer"
          title={ids.filter((id) => FIGURES[id].src === sid).map((id) => `“${FIGURES[id].quote}”`).join('\n')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 7px', borderRadius: 999, border: '1px solid var(--line2)',
            fontSize: 10, fontWeight: 600, lineHeight: '15px', color: 'var(--tx2)', textDecoration: 'none', whiteSpace: 'nowrap', background: 'var(--panel)' }}>
          <span aria-hidden="true">📄</span>{SOURCES[sid].short}
        </a>
      ))}
    </span>
  );
}

// Always-visible strip naming every organisation behind a card.
function DataFrom({ ids }) {
  const pubs = [...new Set(ids.map((id) => SOURCES[FIGURES[id].src].short.split(' ·')[0].replace(' 2026 data', ' cost guide').replace(' WaterSense', '')))];
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 12, padding: '8px 10px', borderRadius: 12, background: 'var(--panel2)' }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx2)' }}>✓ Real data from</span>
      {pubs.map((p) => <span key={p} style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{p}</span>).reduce((a, el, i) => (i ? [...a, <span key={`s${i}`} style={{ color: 'var(--line2)' }}>·</span>, el] : [el]), [])}
    </div>
  );
}

export function Sources({ ids }) {
  const [open, setOpen] = useState(false);
  const srcIds = [...new Set(ids.map((id) => FIGURES[id].src))];
  return (
    <div style={{ marginTop: 10 }}>
      <button className="ns-btn" aria-expanded={open} onClick={() => setOpen(!open)} style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx2)' }}>
        {open ? 'Hide full sources' : `Full sources and exact quotes (${srcIds.length})`} ·<span style={{ fontWeight: 500 }}> checked {CHECKED_ON}</span>
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
          <span style={{ fontSize: 13, fontWeight: 700 }}>{i + 1}. {r.title}</span>
          <span className="ns-num" style={{ fontSize: 15, fontWeight: 700, color: i === 0 ? 'var(--ok)' : i === 1 ? 'var(--watch)' : 'var(--crit)' }}>{usd(r.total)}</span>
          <span />
          <span style={{ gridColumn: '2 / 4', height: 8, borderRadius: 4, background: 'var(--panel2)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${Math.max(3, (r.total / max) * 100)}%`, borderRadius: 4, background: i === 0 ? 'var(--ok)' : i === 1 ? 'var(--watch)' : 'var(--crit)' }} />
          </span>
          <span />
          <span style={{ gridColumn: '2 / 4', fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>{r.body}<Cite ids={r.ids} block /></span>
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: '2px 10px', alignItems: 'center', paddingTop: 8, borderTop: '1px dashed var(--line2)' }}>
        <span aria-hidden="true" style={{ fontSize: 18, textAlign: 'center' }}>🏠</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>Average water-damage insurance claim</span>
        <span className="ns-num" style={{ fontSize: 15, fontWeight: 700, color: 'var(--crit)' }}>{usd(F.claim.avg)}</span>
        <span />
        <span style={{ gridColumn: '2 / 4', height: 8, borderRadius: 4, background: 'var(--crit)' }} />
        <span />
        <span style={{ gridColumn: '2 / 4', fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>Average US homeowners claim for water damage<Cite ids={['claim']} block /></span>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>
        💧 Even a slow drip adds up: one drip per second wastes over {F.leakWaste.faucet.toLocaleString('en-US')} gallons a year.<Cite ids={['leakWaste']} />
      </p>
      <p style={{ margin: '6px 0 0', fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>
        US national averages. The running total adds the averages above; the real cost depends on where the water goes and local prices.
        An emergency call-out costs {F.emergency.lo}–{F.emergency.hi}× the normal rate.<Cite ids={['emergency']} />
      </p>
      <DataFrom ids={['pipeRepair', 'drywall', 'restoration', 'mold', 'claim', 'moldWindow', 'leakWaste']} />
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
      <div style={{ fontSize: 12, fontWeight: 700, margin: '2px 0 6px' }}>Typical repair bills for this kind of equipment</div>
      {[
        { label: 'Replace a worn fan / blower motor', f: F.blowerMotor, ids: ['blowerMotor'] },
        { label: 'Replace an AC compressor', f: F.compressor, ids: ['compressor'] },
      ].map((r) => (
        <div key={r.label} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13 }}>
            <span>{r.label}</span>
            <span className="ns-num" style={{ fontWeight: 700 }}>{usd(r.f.avg)}{r.f.lo ? <span style={{ fontWeight: 500, color: 'var(--tx2)' }}> ({usd(r.f.lo)}–{usd(r.f.hi)})</span> : null}</span>
          </div>
          <span style={{ display: 'block', height: 8, marginTop: 4, borderRadius: 4, background: 'var(--panel2)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${(r.f.avg / F.compressor.hi) * 100}%`, borderRadius: 4, background: 'var(--watch)' }} />
          </span>
          <Cite ids={r.ids} block />
        </div>
      ))}
      <div style={{ fontSize: 12, fontWeight: 700, margin: '12px 0 6px' }}>What planned maintenance saves overall</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {tile(`${F.preventive.lo}–${F.preventive.hi}%`, <>cheaper with planned maintenance than waiting for breakdowns<Cite ids={['preventive']} block /></>, 'var(--watch)')}
        {tile(`+${F.predictive.lo}–${F.predictive.hi}%`, <>more saved when sensors predict the fault, like this scan<Cite ids={['predictive']} block /></>, 'var(--ok)')}
      </div>
      <p style={{ margin: '8px 0 0', fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>US national averages for single repairs. The savings figures are for a whole maintenance programme, not one repair.</p>
      <DataFrom ids={['blowerMotor', 'preventive']} />
      <Sources ids={['blowerMotor', 'compressor', 'preventive', 'predictive']} />
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

// Real run-to-failure curve: how a bearing's vibration grows before it fails (NASA IMS data, test 2 bearing 1).
export function DeteriorationChart({ data }) {
  if (!data?.points?.length) return null;
  const W = 320, H = 150, P = { l: 34, r: 8, t: 10, b: 24 };
  const xs = data.points.map((p) => p[0]), ys = data.points.map((p) => p[1]);
  const xMax = Math.max(...xs), yMax = Math.max(...ys) * 1.05;
  const X = (h) => P.l + (h / xMax) * (W - P.l - P.r);
  const Y = (v) => H - P.b - (v / yMax) * (H - P.t - P.b);
  const line = data.points.map(([h, v], i) => `${i ? 'L' : 'M'}${X(h).toFixed(1)} ${Y(v).toFixed(1)}`).join('');
  const days = Math.round(xMax / 24);
  const rise = data.first_rise_hours;
  const warnDays = rise != null ? ((data.end_hours - rise) / 24) : null;
  const ticks = Array.from({ length: days + 1 }, (_, d) => d).filter((d) => d * 24 <= xMax && d % Math.ceil(days / 7) === 0);  // only days the test reached
  return (
    <div style={{ ...card }}>
      <div style={kicker}>How fast a bearing wears out</div>
      <div className="ns-serif" style={{ fontSize: 20, lineHeight: '25px', fontWeight: 500, margin: '2px 0 4px' }}>
        {warnDays != null ? <>Quiet for days, then it climbs: <span style={{ color: 'var(--crit)' }}>{warnDays.toFixed(1)} days</span> of warning</> : 'Quiet for days, then it climbs'}
      </div>
      <p style={{ margin: '0 0 6px', fontSize: 12, lineHeight: '17px', color: 'var(--tx2)' }}>
        A real bearing run nonstop until it failed: a 1-second vibration reading every 10 minutes for {(xMax / 24).toFixed(1)} days (NASA test data).
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`Vibration of a real bearing over ${days} days until failure`} style={{ display: 'block' }}>
        <line x1={P.l} x2={W - P.r} y1={Y(data.normal_rms)} y2={Y(data.normal_rms)} stroke="var(--ok)" strokeDasharray="3 3" />
        <text x={P.l + 4} y={Y(data.normal_rms) - 5} style={{ fontSize: 9, fill: 'var(--ok)' }}>normal level</text>
        {rise != null && <>
          <rect x={X(rise)} y={P.t} width={W - P.r - X(rise)} height={H - P.t - P.b} fill="var(--crit)" opacity="0.08" />
          <line x1={X(rise)} x2={X(rise)} y1={P.t} y2={H - P.b} stroke="var(--watch)" strokeDasharray="3 3" />
          <text x={X(rise) - 4} y={P.t + 10} textAnchor="end" style={{ fontSize: 9, fontWeight: 700, fill: 'var(--watch)' }}>first clear rise</text>
        </>}
        <path d={line} fill="none" stroke="var(--tx)" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx={X(xMax)} cy={Y(ys[ys.length - 1])} r="3.5" fill="var(--crit)" />
        <text x={X(xMax) - 6} y={Y(ys[ys.length - 1]) + 3} textAnchor="end" style={{ fontSize: 9, fontWeight: 700, fill: 'var(--crit)' }}>failed</text>
        <line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke="var(--line2)" />
        {ticks.map((d) => (
          <text key={d} x={X(d * 24)} y={H - 8} textAnchor="middle" style={{ fontSize: 9, fill: 'var(--tx2)' }}>day {d}</text>
        ))}
        <text x={4} y={P.t + 6} style={{ fontSize: 9, fill: 'var(--tx2)' }}>vibration</text>
      </svg>
      <p style={{ margin: '6px 0 0', fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>
        "First clear rise" = vibration staying at least {data.rise_factor}× its normal level (our rule, applied to the real recordings).
        Raksha's job is to catch that rise, so the repair can be planned instead of forced.
      </p>
      <span style={{ display: 'flex', marginTop: 6 }}>
        <a href="https://data.nasa.gov/dataset/ims-bearings" target="_blank" rel="noreferrer"
          title="IMS Bearing Data Set, Center for Intelligent Maintenance Systems, University of Cincinnati. NASA Prognostics Data Repository."
          style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 7px', borderRadius: 999, border: '1px solid var(--line2)', fontSize: 10, fontWeight: 600, lineHeight: '15px', color: 'var(--tx2)', textDecoration: 'none', background: 'var(--panel)' }}>
          <span aria-hidden="true">📄</span>NASA · IMS, University of Cincinnati
        </a>
      </span>
    </div>
  );
}
