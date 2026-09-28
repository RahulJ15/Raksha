import { useEffect, useMemo, useRef, useState } from 'react';
import InfoCard, { InfoIcon } from './InfoCard';
import { RESULTS, resultKey } from './glossary';
import * as api from '../api';

export const TYPE_LABEL = { machine: 'Sound + vibration', sound: 'Microphone', bearing: 'Vibration spectrogram', thermal: 'Thermal camera',
  crack: 'Crack photo', strain_live: 'Strain gauge', crack_live: 'Crack gauge',
  vibration_live: 'Vibration sensor', thermal_live: 'Thermal sensor', pressure_live: 'Pressure sensor', acoustic_live: 'Acoustic sensor' };
const TYPE_OPTIONS = [['sound', 'Sound spectrogram'], ['bearing', 'Vibration spectrogram'], ['thermal', 'Thermal image'], ['crack', 'Concrete photo'], ['machine', 'Sensor capture (CSV)']];
const ACCEPT = 'image/*,.bmp,.csv,.npz';

// Model confidence is not accuracy, and softmax saturates: never show a flat "100%".
export const fmtPct = (p) => (p >= 0.995 ? '>99%' : p > 0 && p < 0.005 ? '<1%' : `${Math.round(p * 100)}%`);
const confWord = (p) => (p >= 0.95 ? 'Very confident' : p >= 0.8 ? 'Confident' : p >= 0.6 ? 'Fairly sure' : 'Unsure');

const pretty = (s) => s.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
const isImage = (f) => !/\.(csv|npz)$/i.test(f.name);

// One drop zone for every sensor type. Each file's type is detected on the server (and can be overridden);
// several files from one machine are combined into a single per-asset decision.
export default function ScanPanel({ onClose }) {
  const [files, setFiles] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [scan, setScan] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [machine, setMachine] = useState('');
  const [machines, setMachines] = useState([]);
  const input = useRef(null);

  const [samples, setSamples] = useState([]);
  useEffect(() => { api.getAssets().then(setMachines).catch(() => {}); api.getSamples().then(setSamples).catch(() => {}); }, []);

  const thumbs = useMemo(() => files.map((f) => (isImage(f) ? URL.createObjectURL(f) : null)), [files]);
  useEffect(() => () => thumbs.forEach((u) => u && URL.revokeObjectURL(u)), [thumbs]);

  useEffect(() => {
    if (!files.length) { setScan(null); return undefined; }
    let alive = true;
    setBusy(true); setError(null);
    api.scan(files, overrides, machine)
      .then((d) => alive && setScan(d))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setBusy(false));
    return () => { alive = false; };
  }, [files, overrides, machine]);

  const add = (list) => {
    const incoming = [...list].filter(Boolean);
    if (!incoming.length) return;
    setFiles((f) => [...f, ...incoming].slice(0, 6));
    setOverrides((o) => [...o, ...incoming.map(() => null)].slice(0, 6));
  };
  const remove = (i) => { setFiles((f) => f.filter((_, j) => j !== i)); setOverrides((o) => o.filter((_, j) => j !== i)); };
  const setType = (i, t) => setOverrides((o) => o.map((x, j) => (j === i ? t || null : x)));
  const items = scan?.items || [];
  const multi = files.length > 1;

  return (
    <div className="ns-scan-overlay" style={{ position: 'absolute', inset: 0, zIndex: 45, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(8, 20, 20, .38)' }} />
      <section role="dialog" aria-label="Upload a scan" className="ns-scan-sheet" style={{ position: 'relative', maxHeight: '88%', overflowY: 'auto', background: 'var(--panel)', borderRadius: '28px 28px 0 0', boxShadow: 'var(--shadow)', padding: '18px 18px 22px', animation: 'ns-rise 360ms cubic-bezier(.3,1.3,.5,1) both' }}>
        <header style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <div style={{ flexGrow: 1 }}>
            <h2 className="ns-serif" style={{ margin: 0, fontSize: 26, lineHeight: '30px', fontWeight: 500 }}>Scan a machine</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: '18px', color: 'var(--tx2)' }}>
              Add any sensor files from one machine. We work out what each one is and combine them.
            </p>
            {api.DEMO && (
              <p style={{ margin: '8px 0 0', padding: '6px 10px', borderRadius: 10, background: 'var(--panel2)', fontSize: 12, lineHeight: '17px', color: 'var(--tx2)' }}>
                <strong style={{ color: 'var(--tx)' }}>Demo version.</strong> Results for the sample files were produced by our trained models ahead of time; the combining rules run live.
              </p>
            )}
          </div>
          <button className="ns-btn ns-gh" aria-label="Close" onClick={onClose} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path className="ns-ic" d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </header>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 13, fontWeight: 600 }}>
          <span style={{ flexShrink: 0 }}>Which machine?</span>
          <select value={machine} onChange={(e) => setMachine(e.target.value)}
            style={{ flexGrow: 1, minWidth: 0, font: 'inherit', fontSize: 13, fontWeight: 500, padding: '8px 10px', borderRadius: 999, border: '1.5px solid var(--line2)', background: 'var(--bg)', color: 'var(--tx)' }}>
            <option value="">Not linked (files only)</option>
            {machines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>
        {machine && !files.length && (
          <p style={{ margin: '0 2px 12px', fontSize: 13, lineHeight: '18px', color: 'var(--tx2)' }}>
            Its live sensors will be compared with whatever you upload.
          </p>
        )}
        {api.DEMO && (
          <SampleGallery samples={samples} picked={files.map((f) => f.name)} onPick={add}
            onScenario={(list, machineId) => { setFiles(list); setOverrides(list.map(() => null)); setMachine(machineId || ''); }} />
        )}
        <button className="ns-btn" onClick={() => input.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
          style={{ width: '100%', boxSizing: 'border-box', minHeight: files.length || api.DEMO ? 64 : 132, marginTop: api.DEMO ? 12 : 0, borderRadius: 20, border: `2px dashed ${drag ? 'var(--acc)' : 'var(--line2)'}`, background: drag ? 'var(--panel2)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
          <span style={{ textAlign: 'center', fontSize: 14, color: 'var(--tx2)', lineHeight: '20px' }}>
            {!files.length && !api.DEMO && <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" style={{ display: 'block', margin: '0 auto 6px', color: 'var(--acc)' }}><path className="ns-ic" d="M12 15V4.5M7.5 9 12 4.5 16.5 9M5 14.5v4a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-4" /></svg>}
            <strong style={{ color: 'var(--tx)' }}>{files.length ? '+ Add another file from this machine' : api.DEMO ? 'Or upload your own file' : 'Choose or drop sensor files'}</strong>
            {!files.length && !api.DEMO && <><br />Spectrograms, thermal images, concrete photos or sensor CSVs. Several at once is fine.</>}
          </span>
        </button>
        <input ref={input} type="file" accept={ACCEPT} multiple hidden onChange={(e) => { add(e.target.files); e.target.value = ''; }} />


        {busy && <p style={{ margin: '14px 2px 0', fontSize: 14, color: 'var(--tx2)' }}>Detecting file types and running the models…</p>}
        {error && <p role="alert" style={{ margin: '14px 2px 0', fontSize: 14, color: 'var(--crit)' }}>{error}</p>}

        {scan?.asset && !busy && <AssetCard asset={scan.asset} items={items} live={scan.live || []} machine={scan.machine} />}

        {files.map((f, i) => (
          <ItemCard key={`${f.name}:${f.size}:${f.lastModified}`} file={f} thumb={thumbs[i]} item={items[i]} busy={busy}
            override={overrides[i]} onType={(t) => setType(i, t)} onRemove={() => remove(i)} startOpen={!multi} />
        ))}
        {files.length > 0 && (
          <button className="ns-btn" onClick={() => { setFiles([]); setOverrides([]); }} style={{ marginTop: 12, fontSize: 13, color: 'var(--tx2)', textDecoration: 'underline' }}>Clear all files</button>
        )}
      </section>
    </div>
  );
}

const verdictCache = new Map();

// One uploaded file: what we detected it as, the model result, explanations and the AI explanation.
function ItemCard({ file, thumb, item, busy, override, onType, onRemove, startOpen }) {
  const [open, setOpen] = useState(startOpen);
  const [infoFor, setInfoFor] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [verdictErr, setVerdictErr] = useState(null);
  const [verdictBusy, setVerdictBusy] = useState(false);
  useEffect(() => setOpen(startOpen), [startOpen]);

  const result = item?.result;
  const type = item?.type;
  const hasResult = Boolean(result);
  useEffect(() => {
    if (!hasResult || !type) return undefined;
    let alive = true;
    setVerdictBusy(true); setVerdictErr(null); setVerdict(null);
    // Cached per file + type, so re-scanning after adding another file doesn't ask for the explanation again.
    const key = `${file.name}:${file.size}:${file.lastModified}:${type}`;
    if (!verdictCache.has(key)) verdictCache.set(key, api.verdict(type, file));
    verdictCache.get(key)
      .then((d) => alive && setVerdict(d))
      .catch((e) => { verdictCache.delete(key); if (alive) setVerdictErr(e.message); })
      .finally(() => alive && setVerdictBusy(false));
    return () => { alive = false; };
  }, [hasResult, type, file]);

  const det = item?.detected;
  const unknownForced = det && !det.auto && det.type == null && !/\.(csv|npz)$/i.test(file.name);
  const explain = (label) => type && RESULTS[type]?.[resultKey(label)];
  const probs = result ? Object.entries(result.probs).sort((a, b) => b[1] - a[1]) : [];
  const tone = result ? (result.early_warning ? 'var(--watch)' : result.fault ? 'var(--crit)' : 'var(--ok)') : 'var(--tx)';
  const status = result && (result.early_warning ? 'Early warning' : result.fault ? 'Fault detected' : 'Looks healthy');
  const img = (type === 'crack' && result?.preview) || thumb || result?.preview;

  return (
    <div style={{ marginTop: 14, borderRadius: 20, border: '1.5px solid var(--line)', background: 'var(--panel)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10 }}>
        {img ? <img src={img} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
          : <span style={{ width: 56, height: 56, borderRadius: 10, background: 'var(--panel2)', flexShrink: 0 }} />}
        <button className="ns-btn" onClick={() => result && setOpen(!open)} aria-expanded={open} style={{ flexGrow: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
          {result && (
            <span style={{ display: 'block', fontSize: 14, color: tone, fontWeight: 600 }}>
              {pretty(result.name)} <span className="ns-num" style={{ color: 'var(--tx2)', fontWeight: 500 }}>· {fmtPct(result.confidence)}</span>
            </span>
          )}
          {!result && busy && <span style={{ fontSize: 12, color: 'var(--tx2)' }}>Working…</span>}
        </button>
        <button className="ns-btn" aria-label={`Remove ${file.name}`} onClick={onRemove} style={{ color: 'var(--tx2)', padding: 6, display: 'flex' }}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path className="ns-ic" d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px 10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--tx2)' }}>
          {det ? (det.auto ? (det.type || det.type === undefined ? `Detected: ${det.how}` : 'Not recognised') : 'Type chosen by you') : 'Detecting…'}
          {det?.auto && det.type && det.type !== 'machine' ? ` · ${fmtPct(det.confidence)}` : ''}
        </span>
        <select aria-label="File type" value={override || ''} onChange={(e) => onType(e.target.value)}
          style={{ marginLeft: 'auto', font: 'inherit', fontSize: 12, padding: '4px 8px', borderRadius: 999, border: '1.5px solid var(--line2)', background: 'var(--bg)', color: 'var(--tx)' }}>
          <option value="">Auto-detect</option>
          {TYPE_OPTIONS.map(([k, n]) => <option key={k} value={k}>{n}</option>)}
        </select>
      </div>
      {item?.error && <p role="alert" style={{ margin: '0 10px 10px', fontSize: 13, lineHeight: '18px', color: 'var(--crit)' }}>{item.error}</p>}
      {unknownForced && result && (
        <p style={{ margin: '0 10px 10px', fontSize: 13, lineHeight: '18px', color: 'var(--watch)' }}>
          This file didn't look like a {TYPE_LABEL[type].toLowerCase()} image, so this result may be meaningless even if it looks confident.
        </p>
      )}

      {result && open && (
        <div style={{ padding: '4px 12px 14px', borderTop: '1px solid var(--line)', animation: 'ns-enter 280ms ease both' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginTop: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: tone }}>{status}</span>
            <span className="ns-num" style={{ fontSize: 13, color: 'var(--tx2)' }}>{TYPE_LABEL[type]} model</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '2px 0 12px' }}>
            <span className="ns-serif" style={{ fontSize: 28, lineHeight: '34px', fontWeight: 500, flexGrow: 1 }}>{pretty(result.name)}</span>
            <span style={{ textAlign: 'right' }}>
              <span className="ns-num" style={{ display: 'block', fontSize: 28, fontWeight: 700, color: tone }}>{fmtPct(result.confidence)}</span>
              <span style={{ fontSize: 11, color: 'var(--tx2)' }}>{confWord(result.confidence)}</span>
            </span>
          </div>
          {result.early_warning && (
            <p style={{ margin: '0 0 10px', fontSize: 13, lineHeight: '18px', color: 'var(--tx2)' }}>
              The model leans healthy ({fmtPct(result.probs.healthy)}) but not confidently enough to clear it, so this is flagged early. Worth a check on the next visit.
            </p>
          )}
          {result.sensors && <SensorBreakdown result={result} />}
          {type === 'crack' && result.preview && (
            <figure style={{ margin: '0 0 12px' }}>
              <img src={result.preview} alt="Photo with cracked areas outlined in red" style={{ width: '100%', borderRadius: 14, display: 'block' }} />
              <figcaption style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
                {result.tiles > 1 ? `Checked in ${result.tiles} tiles; ${result.cracked_tiles} look cracked (red boxes).` : 'Checked as a single close-up.'}
              </figcaption>
            </figure>
          )}
          <div style={{ marginBottom: 14 }}>
            <InfoCard key={`${type}:${result.name}`} entry={explain(result.name)} open label="What does this mean?" />
          </div>
          <ReliabilityCard model={type} />
          {probs.map(([label, p]) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '1fr 44px', alignItems: 'center', gap: '4px 10px', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--tx2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {pretty(label)}
                {explain(label) && (
                  <button className="ns-btn" aria-label={`What is ${pretty(label).toLowerCase()}?`} aria-expanded={infoFor === label}
                    onClick={() => setInfoFor(infoFor === label ? null : label)} style={{ display: 'flex', color: infoFor === label ? 'var(--acc)' : 'var(--tx2)' }}>
                    <InfoIcon size={15} />
                  </button>
                )}
              </span>
              <span className="ns-num" style={{ fontSize: 13, textAlign: 'right' }}>{fmtPct(p)}</span>
              <span style={{ gridColumn: '1 / -1', height: 6, borderRadius: 3, background: 'var(--panel2)', overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: `${p * 100}%`, borderRadius: 3, background: label === result.label || pretty(label) === pretty(result.name) ? tone : 'var(--line2)', transition: 'width 500ms cubic-bezier(.3,1.2,.5,1)' }} />
              </span>
              {infoFor === label && (
                <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                  <InfoCard key={label} entry={explain(label)} open />
                </div>
              )}
            </div>
          ))}
          <VerdictCard verdict={verdict} busy={verdictBusy} error={verdictErr} />
        </div>
      )}
    </div>
  );
}

const AGREE = {
  agree: { text: 'Agrees with the model', color: 'var(--ok)' },
  disagree: { text: 'Disagrees with the model', color: 'var(--crit)' },
  unsure: { text: 'Not sure', color: 'var(--watch)' },
};

function VerdictCard({ verdict, busy, error }) {
  const label = { fontSize: 12, fontWeight: 700, color: 'var(--tx2)', margin: '12px 0 3px' };
  return (
    <div style={{ marginTop: 18, padding: 16, borderRadius: 20, background: 'var(--bg)', border: '1.5px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ color: 'var(--acc)' }}><path className="ns-ic" d="M12 3.5c.6 4.4 4.1 7.9 8.5 8.5-4.4.6-7.9 4.1-8.5 8.5-.6-4.4-4.1-7.9-8.5-8.5 4.4-.6 7.9-4.1 8.5-8.5z" /></svg>
        <span style={{ fontSize: 14, fontWeight: 700, flexGrow: 1 }}>AI explanation</span>
        {verdict && <span style={{ fontSize: 12, fontWeight: 700, color: (AGREE[verdict.agrees] || AGREE.unsure).color }}>{(AGREE[verdict.agrees] || AGREE.unsure).text}</span>}
      </div>
      {busy && (
        <div aria-label="Writing the explanation" style={{ display: 'flex', gap: 5, padding: '6px 0' }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--acc)', animation: `ns-dotp 1s ${i * 0.15}s infinite` }} />)}
        </div>
      )}
      {error && !busy && <p style={{ margin: 0, fontSize: 13, lineHeight: '19px', color: 'var(--tx2)' }}>{error}</p>}
      {verdict && !busy && (
        <div style={{ animation: 'ns-enter 320ms ease both' }}>
          <p className="ns-serif" style={{ margin: '0 0 6px', fontSize: 20, lineHeight: '25px', fontWeight: 500 }}>{verdict.headline}</p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: '20px' }}>{verdict.explanation}</p>
          <p style={label}>Likely cause</p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: '20px' }}>{verdict.likely_cause}</p>
          <p style={label}>If ignored</p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: '20px' }}>{verdict.risk}</p>
          <div style={{ display: 'flex', gap: 8, margin: '12px 0 4px' }}>
            {[['How urgent', verdict.urgency], ['Who can fix it', verdict.who]].map(([k, val]) => (
              <div key={k} style={{ flex: 1, padding: '8px 10px', borderRadius: 12, background: 'var(--panel2)' }}>
                <div style={{ fontSize: 11, color: 'var(--tx2)' }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{val}</div>
              </div>
            ))}
          </div>
          <p style={label}>What to do</p>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: '20px' }}>
            {verdict.next_steps.map((step, i) => <li key={i} style={{ marginBottom: 3 }}>{step}</li>)}
          </ol>
          <p style={{ margin: '10px 0 0', fontSize: 11, color: 'var(--tx2)' }}>AI-generated explanation. Check on site before acting.</p>
        </div>
      )}
    </div>
  );
}

// What each sensor concluded on its own, next to the combined verdict.
function SensorBreakdown({ result }) {
  const rows = [...Object.values(result.sensors), { sensor: 'Combined', ...result }];
  const agree = Object.values(result.sensors).every((r) => r.label === result.label);
  return (
    <div style={{ margin: '0 0 12px', padding: '10px 12px', borderRadius: 16, border: '1.5px solid var(--line)' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)', marginBottom: 6 }}>What each sensor concluded</div>
      {rows.map((r) => (
        <div key={r.sensor} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '4px 0', fontWeight: r.sensor === 'Combined' ? 700 : 400, borderTop: r.sensor === 'Combined' ? '1px solid var(--line)' : 'none' }}>
          <span style={{ width: 128, flexShrink: 0, fontSize: 13, color: r.sensor === 'Combined' ? 'var(--tx)' : 'var(--tx2)' }}>{r.sensor}</span>
          <span style={{ flexGrow: 1, fontSize: 14, color: r.fault ? 'var(--crit)' : 'var(--ok)' }}>{pretty(r.name)}</span>
          <span className="ns-num" style={{ fontSize: 13 }}>{fmtPct(r.confidence)}</span>
        </div>
      ))}
      <p style={{ margin: '6px 0 0', fontSize: 12, lineHeight: '17px', color: 'var(--tx2)' }}>
        {agree ? 'Both sensors agree, so this is a strong signal.' : 'The sensors disagree. The combined model weighs both; confirm on site before sending anyone.'}
        {' '}Averaged over {result.windows} one-second windows.
      </p>
    </div>
  );
}

const DECISION_TONE = { healthy: 'var(--ok)', monitor: 'var(--tx2)', inspect: 'var(--watch)', confirmed: 'var(--crit)' };

// Per-asset agreement: a ticket only when two independent sensor types both see a problem.
function AssetCard({ asset, items, live, machine }) {
  const tone = DECISION_TONE[asset.decision];
  const rows = items.filter((it) => it.result);
  return (
    <div style={{ margin: '14px 0 4px', padding: 14, borderRadius: 18, border: `2px solid ${tone}`, animation: 'ns-enter 300ms ease both' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: tone }}>{machine || 'This machine'} overall</div>
      <div className="ns-serif" style={{ fontSize: 21, lineHeight: '26px', fontWeight: 500, margin: '2px 0 8px' }}>{asset.title}</div>
      {rows.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, padding: '2px 0' }}>
          <span style={{ width: 128, flexShrink: 0, color: 'var(--tx2)' }}>{TYPE_LABEL[it.type]}</span>
          <span style={{ flexGrow: 1, color: it.result.fault ? 'var(--crit)' : 'var(--ok)' }}>{pretty(it.result.name)}</span>
          <span className="ns-num">{fmtPct(it.result.confidence)}</span>
        </div>
      ))}
      {live.length > 0 && (
        <div style={{ margin: '6px 0 0', paddingTop: 6, borderTop: '1px solid var(--line)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx2)', marginBottom: 2 }}>Live sensors on this machine</div>
          {live.map((l) => {
            const agrees = rows.length > 0 && rows.some((it) => it.result.fault) === l.result.fault;
            return (
              <div key={l.sensor} style={{ display: 'flex', gap: 8, fontSize: 13, padding: '2px 0', alignItems: 'baseline' }}>
                <span style={{ width: 128, flexShrink: 0, color: 'var(--tx2)' }}>{TYPE_LABEL[l.type]} <span className="ns-num">{l.sensor}</span></span>
                <span style={{ flexGrow: 1, color: l.result.fault ? 'var(--crit)' : 'var(--ok)' }}>
                  {pretty(l.result.name)}
                  <span style={{ display: 'block', fontSize: 11, color: 'var(--tx2)' }}>
                    {l.reading}{rows.length > 0 && <> · {agrees ? 'agrees with your upload' : 'disagrees with your upload'}</>}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}
      <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: '20px', fontWeight: 600 }}>{asset.action}</p>
      <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: '18px', color: 'var(--tx2)' }}>{asset.reason}</p>
    </div>
  );
}

let cardsPromise = null;
// How well the model does on data it never saw, including the hard tests. Shown so nobody mistakes confidence for accuracy.
function ReliabilityCard({ model }) {
  const [cards, setCards] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    cardsPromise = cardsPromise || api.getModels().catch(() => null);
    cardsPromise.then(setCards);
  }, []);
  const c = cards?.[model];
  if (!c) return null;
  return (
    <div style={{ marginBottom: 14, borderRadius: 16, border: '1.5px solid var(--line)' }}>
      <button className="ns-btn" aria-expanded={open} onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>
        <span style={{ flexGrow: 1 }}>How reliable is this model?</span>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 220ms' }}><path className="ns-ic" d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div style={{ padding: '0 12px 12px', fontSize: 13, lineHeight: '19px' }}>
          <p style={{ margin: '0 0 8px', color: 'var(--tx2)' }}>{c.data}</p>
          {c.tests.filter(([, v]) => v != null).map(([name, [acc, correct, total]]) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '3px 0', borderTop: '1px solid var(--line)' }}>
              <span>{name}</span>
              <span className="ns-num" style={{ textAlign: 'right' }}><strong>{correct.toLocaleString()} of {total.toLocaleString()}</strong> right ({Math.round(acc * 100)}%)</span>
            </div>
          ))}
          <p style={{ margin: '8px 0 0', color: 'var(--tx2)' }}>{c.caveat}</p>
        </div>
      )}
    </div>
  );
}

const FOLDERS = [
  { id: 'machine', title: 'Sound + vibration', blurb: 'A microphone and vibration sensors on the same motor, recorded together',
    icon: 'M9 4h6v16H9zM5 8v8M19 8v8M2 10v4M22 10v4' },
  { id: 'thermal', title: 'Thermal camera', blurb: 'Infrared photos of an electric motor: hotter is brighter',
    icon: 'M10 13.6V5.5a2 2 0 0 1 4 0v8.1a4 4 0 1 1-4 0zM12 10v6' },
  { id: 'crack', title: 'Concrete photos', blurb: 'Close-ups and whole walls, with and without cracks',
    icon: 'M12 3l-2.5 5 3.5 3-3.5 4 2.5 6M5 4v16M19 4v16' },
  { id: 'sound', title: 'Microphone', blurb: 'What machines and water pipes sound like, as a picture of the sound',
    icon: 'M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4' },
  { id: 'bearing', title: 'Vibration', blurb: 'Vibration patterns from worn and healthy bearings',
    icon: 'M3 12h3l1.5-4 3 8 3-8 3 8 1.5-4h3' },
];

// One-click stories that show the sensors agreeing or disagreeing.
const SCENARIOS = [
  { title: 'Two sensors agree', note: 'Faulty motor + overheating photo', result: 'Raise a ticket',
    files: ['bearing_fault__heldout.csv', 'stator_short_circuit__heldout.png'] },
  { title: 'Only one sensor sees it', note: 'Faulty motor + normal thermal photo', result: 'Check next visit',
    files: ['bearing_fault__heldout.csv', 'healthy__heldout.png'] },
  { title: 'All healthy', note: 'Healthy motor, from three sensors', result: 'No problem',
    files: ['healthy__motor.png', 'healthy_3.png', 'healthy__heldout.png'] },
  { title: 'Crack + strained column', note: 'Crack photo, linked to Parking column 2', result: 'Raise a ticket',
    files: ['crack__heldout.jpg'], machine: 'Pier P2' },
];

const BEARING_NAMES = { ball: 'Ball fault', cage: 'Cage fault', inner_race: 'Inner race fault', outer_race: 'Outer race fault', healthy: 'Healthy' };

// Readable name + the true answer for a sample file (the file names encode the real label).
function describe(s) {
  const stem = s.name.replace(/\.(png|jpe?g|bmp|csv)$/i, '');
  if (s.folder === 'bearing') {
    const [, base, n] = stem.match(/^(.*)_(\d+)$/) || [null, stem, ''];
    return { title: `${BEARING_NAMES[base] || pretty(base)}${base === 'healthy' ? ` #${n}` : ''}`, truth: BEARING_NAMES[base] || pretty(base) };
  }
  const [label, rest = ''] = stem.split('__');
  const truth = pretty(label);
  const extra = rest.startsWith('composite') ? 'whole wall' : rest === 'motor' ? 'motor' : rest === 'pipe-no-leak' ? 'water pipe' : rest.endsWith('_2') ? 'second photo' : '';
  return { title: extra ? `${truth} · ${extra}` : truth, truth };
}

const thumbOf = (s) => (s.file ? `/demo/${s.file}` : s.item?.result?.preview || null);

function Icon({ d, size = 20 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path className="ns-ic" d={d} /></svg>;
}

// Demo build only: sample files in folders by sensor type, plus ready-made scenarios.
function SampleGallery({ samples, picked, onPick, onScenario }) {
  const [open, setOpen] = useState(true);
  const [folder, setFolder] = useState(null);
  if (!samples.length) return null;
  const byName = Object.fromEntries(samples.map((s) => [s.name, s]));
  const toFile = async (s) => {
    const blob = s.file ? await fetch(`/demo/${s.file}`).then((r) => r.blob()) : new Blob([], { type: 'text/csv' });
    return new File([blob], s.name, { type: blob.type });
  };
  const pick = async (s) => { onPick([await toFile(s)]); setOpen(false); };
  const runScenario = async (sc) => {
    onScenario(await Promise.all(sc.files.map((n) => toFile(byName[n]))), sc.machine);
    setOpen(false);
  };
  const current = FOLDERS.find((f) => f.id === folder);
  const inFolder = current ? samples.filter((s) => s.folder === current.id) : [];

  if (!open) {
    return (
      <button className="ns-btn ns-gh" onClick={() => setOpen(true)}
        style={{ width: '100%', marginTop: 12, height: 44, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 600 }}>
        <Icon d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4l2 2h8a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z" size={18} />
        Open sample files
      </button>
    );
  }

  return (
    <div style={{ marginTop: 12, borderRadius: 20, border: '1.5px solid var(--line)', padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        {current ? (
          <button className="ns-btn" onClick={() => setFolder(null)} aria-label="Back to folders"
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: 'var(--tx2)' }}>
            <Icon d="M15 6l-6 6 6 6" size={18} /> Samples
          </button>
        ) : <span style={{ fontSize: 13, fontWeight: 700 }}>Sample files</span>}
        {current && <span style={{ fontSize: 13, fontWeight: 700 }}>/ {current.title}</span>}
        <span style={{ flexGrow: 1 }} />
        <button className="ns-btn" onClick={() => setOpen(false)} style={{ fontSize: 12, color: 'var(--tx2)' }}>Hide</button>
      </div>

      {!current && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx2)', letterSpacing: '.05em', textTransform: 'uppercase', margin: '2px 0 6px' }}>Try a pair</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
            {SCENARIOS.map((sc) => (
              <button key={sc.title} className="ns-btn ns-row" onClick={() => runScenario(sc)}
                style={{ borderRadius: 14, padding: '10px 12px', border: '1.5px solid var(--line)', textAlign: 'left' }}>
                <span style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
                  {sc.files.map((n) => thumbOf(byName[n]) && <img key={n} src={thumbOf(byName[n])} alt="" style={{ width: 26, height: 26, borderRadius: 7, objectFit: 'cover' }} />)}
                </span>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>{sc.title}</span>
                <span style={{ display: 'block', fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>{sc.note}</span>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--acc)', marginTop: 4 }}>→ {sc.result}</span>
              </button>
            ))}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx2)', letterSpacing: '.05em', textTransform: 'uppercase', margin: '2px 0 6px' }}>Folders by sensor</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
            {FOLDERS.map((f) => {
              const list = samples.filter((s) => s.folder === f.id);
              const previews = list.map(thumbOf).filter(Boolean).slice(0, 3);
              return (
                <button key={f.id} className="ns-btn ns-row" onClick={() => setFolder(f.id)}
                  style={{ borderRadius: 16, padding: 12, border: '1.5px solid var(--line)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--mint)', color: 'var(--tx)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon d={f.icon} size={18} />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 14, fontWeight: 700, lineHeight: '17px' }}>{f.title}</span>
                      <span className="ns-num" style={{ fontSize: 11, color: 'var(--tx2)' }}>{list.length} samples</span>
                    </span>
                  </span>
                  <span style={{ fontSize: 11, lineHeight: '15px', color: 'var(--tx2)' }}>{f.blurb}</span>
                  <span style={{ display: 'flex', gap: 4 }}>
                    {previews.map((u) => <img key={u.slice(-40)} src={u} alt="" style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover' }} />)}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {current && (
        <>
          <p style={{ margin: '0 0 10px', fontSize: 12, lineHeight: '17px', color: 'var(--tx2)' }}>{current.blurb}. Tap one to scan it.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(118px, 1fr))', gap: 8 }}>
            {inFolder.map((s) => {
              const d = describe(s);
              const added = picked.includes(s.name);
              const src = thumbOf(s);
              return (
                <button key={s.name} className="ns-btn ns-row" onClick={() => !added && pick(s)} disabled={added} title={s.name}
                  style={{ borderRadius: 14, padding: 8, border: `1.5px solid ${added ? 'var(--acc)' : 'var(--line)'}`, textAlign: 'left', opacity: added ? 0.7 : 1 }}>
                  {src ? <img src={src} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 10, display: 'block' }} />
                    : <span style={{ display: 'block', width: '100%', aspectRatio: '1', borderRadius: 10, background: 'var(--panel2)' }} />}
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 700, marginTop: 6, lineHeight: '16px' }}>{d.title}</span>
                  <span style={{ display: 'block', fontSize: 11, color: 'var(--tx2)', marginTop: 2 }}>{added ? '✓ Added' : `True answer: ${d.truth}`}</span>
                </button>
              );
            })}
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 11, lineHeight: '16px', color: 'var(--tx2)' }}>
            None of these were used to train the models. Add samples from two folders, or pick a machine above, to see the sensors agree or disagree.
          </p>
        </>
      )}
    </div>
  );
}
