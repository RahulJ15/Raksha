import { useState } from 'react';
import { CHECKED_ON, FIGURES, SOURCES, usd } from './evidence';

// Visual pieces for the scan result. Every number comes from evidence.js (cited, re-checked); the only
// arithmetic done here is adding cited averages into a running total, and it is labelled as such.

export const ICONS = {
  wrench: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z',
  drop: 'M12 3.5c3.2 4.2 5.5 7.1 5.5 10a5.5 5.5 0 0 1-11 0c0-2.9 2.3-5.8 5.5-10z',
  alert: 'M12 4.5 20.5 19h-17zM12 10v4M12 16.8h.01',
  house: 'M3 20h18M5 20V10M19 20V10M3 10l9-6 9 6M9.5 20v-6h5v6',
  doc: 'M6 3.5h9l3 3V20.5H6zM9 11h6M9 15h4',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  person: 'M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 20a7 7 0 0 1 14 0',
};

export function LineIcon({ name, size = 16, color = 'currentColor', style }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ color, flexShrink: 0, ...style }}>
      <path className="ns-ic" d={ICONS[name]} />
    </svg>
  );
}

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
          <LineIcon name="doc" size={11} />{SOURCES[sid].short}
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
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--tx2)' }}><LineIcon name="check" size={13} color="var(--ok)" />Real data from</span>
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
    { icon: 'wrench', title: 'Fix the leak now', body: `Repair only${' '}(typical range ${usd(F.pipeRepair.lo)}–${usd(F.pipeRepair.hi)})`, add: F.pipeRepair.avg, ids: ['pipeRepair'] },
    { icon: 'drop', title: 'Water soaks the wall', body: `+ drywall ${usd(F.drywall.avg)} + water-damage cleanup ${usd(F.restoration.avg)}`, add: F.drywall.avg + F.restoration.avg, ids: ['drywall', 'restoration'] },
    { icon: 'alert', title: 'Mold sets in', body: `+ mold removal ${usd(F.mold.avg)}. Mold can start if things aren't dried within 24–48 h`, add: F.mold.avg, ids: ['mold', 'moldWindow'] },
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
          <span style={{ display: 'flex', justifyContent: 'center' }}><LineIcon name={r.icon} size={20} color={i === 0 ? 'var(--ok)' : i === 1 ? 'var(--watch)' : 'var(--crit)'} /></span>
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
        <span style={{ display: 'flex', justifyContent: 'center' }}><LineIcon name="house" size={20} color="var(--crit)" /></span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>Average water-damage insurance claim</span>
        <span className="ns-num" style={{ fontSize: 15, fontWeight: 700, color: 'var(--crit)' }}>{usd(F.claim.avg)}</span>
        <span />
        <span style={{ gridColumn: '2 / 4', height: 8, borderRadius: 4, background: 'var(--crit)' }} />
        <span />
        <span style={{ gridColumn: '2 / 4', fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>Average US homeowners claim for water damage<Cite ids={['claim']} block /></span>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>
        Even a slow drip adds up: one drip per second wastes over {F.leakWaste.faucet.toLocaleString('en-US')} gallons a year.<Cite ids={['leakWaste']} />
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

// Machines: what fixing it now costs vs the cost of letting it break, as a simple bar graph.
export function FixEarlyCard() {
  const F = FIGURES;
  const max = F.acReplace.avg;
  const bars = [
    { label: 'Fix it now', sub: 'planned motor replacement', value: F.blowerMotor.avg, color: 'var(--ok)', ids: ['blowerMotor'] },
    { label: 'Worst case: let it break', sub: `the whole AC unit has to be replaced (typically ${usd(F.acReplace.lo)}–${usd(F.acReplace.hi)})`, value: F.acReplace.avg, color: 'var(--crit)', ids: ['acReplace'] },
  ];
  return (
    <div style={card}>
      <div style={kicker}>Why fix it now</div>
      <div className="ns-serif" style={{ fontSize: 20, lineHeight: '26px', fontWeight: 500, margin: '2px 0 12px' }}>
        Fix now: <span style={{ color: 'var(--ok)' }}>~{usd(F.blowerMotor.avg)}</span> · Worst case: <span style={{ color: 'var(--crit)' }}>~{usd(F.acReplace.avg)}</span>
      </div>
      {bars.map((r) => (
        <div key={r.label} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{r.label}</span>
            <span className="ns-num" style={{ fontSize: 18, fontWeight: 700, color: r.color }}>{usd(r.value)}</span>
          </div>
          <span style={{ display: 'block', height: 14, margin: '5px 0 3px', borderRadius: 7, background: 'var(--panel2)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${Math.max(4, (r.value / max) * 100)}%`, borderRadius: 7, background: r.color }} />
          </span>
          <span style={{ fontSize: 12, lineHeight: '16px', color: 'var(--tx2)' }}>{r.sub}</span>
          <Cite ids={r.ids} block />
        </div>
      ))}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 12, background: 'var(--panel2)', fontSize: 13, lineHeight: '18px' }}>
        <LineIcon name="clock" size={16} color="var(--watch)" style={{ marginTop: 1 }} />
        <span>If it breaks after hours, emergency repairs cost <strong>${F.hvacEmergency.lo}–${F.hvacEmergency.hi} more per hour</strong>.<Cite ids={['hvacEmergency']} block /></span>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', marginTop: 8, borderRadius: 12, background: 'var(--panel2)', fontSize: 13, lineHeight: '18px' }}>
        <LineIcon name="check" size={16} color="var(--ok)" style={{ marginTop: 1 }} />
        <span>Planned repairs are <strong>{F.preventive.lo}–{F.preventive.hi}% cheaper</strong> than waiting for breakdowns.<Cite ids={['preventive']} block /></span>
      </div>
      <Sources ids={['blowerMotor', 'acReplace', 'hvacEmergency', 'preventive']} />
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
      <div style={kicker}>What happens if you wait</div>
      <div className="ns-serif" style={{ fontSize: 20, lineHeight: '25px', fontWeight: 500, margin: '2px 0 4px' }}>
        {warnDays != null
          ? <>Once it starts shaking more, a worn bearing can break in <span style={{ color: 'var(--crit)' }}>about {Math.round(warnDays)} days</span></>
          : 'Once it starts shaking more, it gets worse fast'}
      </div>
      <p style={{ margin: '0 0 6px', fontSize: 13, lineHeight: '18px', color: 'var(--tx2)' }}>
        In a real test, a bearing ran nonstop until it broke. It shook normally for {Math.round((rise ?? xMax) / 24)} days, then more and more, then broke.
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`Vibration of a real bearing over ${days} days until failure`} style={{ display: 'block' }}>
        <line x1={P.l} x2={W - P.r} y1={Y(data.normal_rms)} y2={Y(data.normal_rms)} stroke="var(--ok)" strokeDasharray="3 3" />
        <text x={P.l + 4} y={Y(data.normal_rms) - 5} style={{ fontSize: 9, fill: 'var(--ok)' }}>normal</text>
        {rise != null && <>
          <rect x={X(rise)} y={P.t} width={W - P.r - X(rise)} height={H - P.t - P.b} fill="var(--crit)" opacity="0.08" />
          <line x1={X(rise)} x2={X(rise)} y1={P.t} y2={H - P.b} stroke="var(--watch)" strokeDasharray="3 3" />
          <text x={X(rise) - 4} y={P.t + 10} textAnchor="end" style={{ fontSize: 9, fontWeight: 700, fill: 'var(--watch)' }}>starts wearing</text>
        </>}
        <path d={line} fill="none" stroke="var(--tx)" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx={X(xMax)} cy={Y(ys[ys.length - 1])} r="3.5" fill="var(--crit)" />
        <text x={X(xMax) - 6} y={Y(ys[ys.length - 1]) + 3} textAnchor="end" style={{ fontSize: 9, fontWeight: 700, fill: 'var(--crit)' }}>breaks</text>
        <line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke="var(--line2)" />
        {ticks.map((d) => (
          <text key={d} x={X(d * 24)} y={H - 8} textAnchor="middle" style={{ fontSize: 9, fill: 'var(--tx2)' }}>day {d}</text>
        ))}
        <text x={4} y={P.t + 6} style={{ fontSize: 9, fill: 'var(--tx2)' }}>shaking</text>
      </svg>
      <p style={{ margin: '6px 0 0', fontSize: 12, lineHeight: '17px', color: 'var(--tx2)' }}>
        Raksha spots that early rise, so you can plan the repair instead of dealing with a breakdown.
      </p>
      <span style={{ display: 'flex', marginTop: 6 }}>
        <a href="https://data.nasa.gov/dataset/ims-bearings" target="_blank" rel="noreferrer"
          title={`IMS Bearing Data Set, Center for Intelligent Maintenance Systems, University of Cincinnati. NASA Prognostics Data Repository. Test 2, bearing 1: one-second vibration readings every 10 minutes for ${(xMax / 24).toFixed(1)} days. 'Starts wearing' = vibration staying at least ${data.rise_factor}x its normal level (Raksha's rule applied to the real recordings).`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 7px', borderRadius: 999, border: '1px solid var(--line2)', fontSize: 10, fontWeight: 600, lineHeight: '15px', color: 'var(--tx2)', textDecoration: 'none', background: 'var(--panel)' }}>
          <LineIcon name="doc" size={11} />NASA · IMS, University of Cincinnati
        </a>
      </span>
    </div>
  );
}
