import { useEffect, useRef, useState } from 'react';

// First-visit walkthrough of the dashboard, plus a standing pointer to Scan (the part judges should try).
// Shown once per browser; ?tour=1 replays it.

const STEPS = [
  { sel: '[aria-label="Decisions"]', title: 'Your to-do count',
    body: 'How many things in the building need a decision right now, and how many are urgent or overdue.' },
  { sel: '[aria-label="Building health estimate"]', title: 'Building health',
    body: 'One score for the whole building, estimated from every sensor. Tap "how it works" to see why.' },
  { sel: '[data-tour="attention"]', title: 'Problems, most urgent first',
    body: 'Each card says what is wrong in plain English, how urgent it is and who is fixing it. Tap Details for what to do.' },
  { sel: 'button[aria-label="Site map"]', title: 'Find it on the map',
    body: 'Every sensor on the floor plan, with walking directions to the problem.' },
  { sel: 'button[aria-label="Upload scan"]', title: 'Try the AI yourself',
    body: 'Open Scan and pick a sample: sound, vibration, thermal images or crack photos. Pick two from one machine to see the sensors agree on a fault.',
    cta: 'Try it now' },
];

const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k) => { try { localStorage.setItem(k, '1'); } catch (e) { /* storage unavailable */ } },
};
const replay = new URLSearchParams(location.search).get('tour') === '1';

function useRect(sel, containerRef, active) {
  const [rect, setRect] = useState(null);
  useEffect(() => {
    if (!active || !sel) { setRect(null); return undefined; }
    let first = true;
    const measure = () => {
      const root = containerRef.current?.parentElement;
      const el = root?.querySelector(sel);
      if (!root || !el) { setRect(null); return; }
      if (first) { el.scrollIntoView({ block: 'nearest' }); first = false; }
      const t = el.getBoundingClientRect();
      const r = root.getBoundingClientRect();
      const next = { left: t.left - r.left, top: t.top - r.top, width: t.width, height: t.height, W: r.width, H: r.height };
      setRect((prev) => (prev && Object.keys(next).every((k) => Math.abs(prev[k] - next[k]) < 0.5) ? prev : next));
    };
    measure();
    const t = setInterval(measure, 250);
    window.addEventListener('resize', measure);
    return () => { clearInterval(t); window.removeEventListener('resize', measure); };
  }, [sel, active, containerRef]);
  return rect;
}

export default function Tour({ screen, scanOpen, busy, onOpenScan }) {
  const ref = useRef(null);
  const [step, setStep] = useState(null);
  const [tried, setTried] = useState(() => Boolean(store.get('infrasensor:scanTried')));

  // Start the tour the first time the dashboard is shown, after its intro animation.
  useEffect(() => {
    if (screen !== 'overview' || step !== null || (store.get('infrasensor:tourDone') && !replay)) return undefined;
    const t = setTimeout(() => setStep(0), 1400);
    return () => clearTimeout(t);
  }, [screen, step]);

  useEffect(() => { if (scanOpen && !tried) { store.set('infrasensor:scanTried'); setTried(true); } }, [scanOpen, tried]);

  const touring = step !== null && step < STEPS.length && screen === 'overview';
  const cur = touring ? STEPS[step] : null;
  const rect = useRect(cur?.sel, ref, touring);
  const scanRect = useRect('button[aria-label="Upload scan"]', ref, !touring && !scanOpen);

  const finish = () => { store.set('infrasensor:tourDone'); setStep(STEPS.length); };
  const next = () => { if (step + 1 >= STEPS.length) { finish(); onOpenScan(); } else setStep(step + 1); };

  const pad = 6;
  const card = rect && (() => {
    const w = Math.min(320, rect.W - 24);
    const inRail = rect.left < 80;
    let left = inRail ? rect.left + rect.width + 14 : Math.min(Math.max(12, rect.left), rect.W - w - 12);
    let top = inRail ? Math.max(12, rect.top - 8) : rect.top + rect.height + pad + 12;
    if (inRail && left + w > rect.W - 12) left = rect.W - w - 12;
    if (!inRail && top + 190 > rect.H) top = Math.max(12, rect.top - pad - 12 - 190);
    return { left, top, width: w };
  })();

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, zIndex: 80, pointerEvents: 'none' }}>
      <style>{`
        @keyframes ns-tour-ring { 0% { box-shadow: 0 0 0 0 rgba(57,174,169,.75); } 70% { box-shadow: 0 0 0 14px rgba(57,174,169,0); } 100% { box-shadow: 0 0 0 0 rgba(57,174,169,0); } }
        @keyframes ns-tour-float { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
      `}</style>

      {touring && rect && (
        <>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }} onClick={(e) => e.stopPropagation()} />
          <div style={{ position: 'absolute', left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2,
            borderRadius: 20, boxShadow: '0 0 0 9999px rgba(8,20,20,.55)', transition: 'all 320ms cubic-bezier(.3,1.2,.5,1)' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 20, border: '2px solid var(--acc)', animation: 'ns-tour-ring 1.6s infinite' }} />
          </div>
          <div role="dialog" aria-label={cur.title} style={{ position: 'absolute', ...card, pointerEvents: 'auto', background: 'var(--panel)', color: 'var(--tx)',
            borderRadius: 20, padding: 16, boxShadow: 'var(--shadow)', transition: 'left 320ms, top 320ms', animation: 'ns-pop 260ms ease both' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx2)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Quick tour · {step + 1} of {STEPS.length}</div>
            <div className="ns-serif" style={{ fontSize: 21, lineHeight: '26px', fontWeight: 500, margin: '4px 0 6px' }}>{cur.title}</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: '20px' }}>{cur.body}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
              <button className="ns-btn" onClick={finish} style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx2)', padding: '8px 4px' }}>Skip tour</button>
              <span style={{ flexGrow: 1 }} />
              {step > 0 && <button className="ns-btn ns-gh" onClick={() => setStep(step - 1)} style={{ height: 38, padding: '0 14px', borderRadius: 999, fontSize: 14, fontWeight: 600 }}>Back</button>}
              <button className="ns-btn ns-pri" onClick={next} style={{ height: 38, padding: '0 16px', borderRadius: 999, fontSize: 14, fontWeight: 700 }}>{cur.cta || 'Next'}</button>
            </div>
          </div>
        </>
      )}

      {/* Standing pointer to Scan, whether the tour was finished or skipped. */}
      {!touring && !scanOpen && !busy && scanRect && (
        <>
          <div style={{ position: 'absolute', left: scanRect.left - 3, top: scanRect.top - 3, width: scanRect.width + 6, height: scanRect.height + 6,
            borderRadius: 24, border: '2px solid var(--acc)', animation: 'ns-tour-ring 1.8s infinite' }} />
          {!tried && (
            <button className="ns-btn" onClick={onOpenScan} style={{ position: 'absolute', left: scanRect.left + scanRect.width + 12, top: scanRect.top + scanRect.height / 2 - 18,
              pointerEvents: 'auto', height: 36, padding: '0 14px 0 10px', borderRadius: 999, background: 'var(--acc)', color: 'var(--accTx)',
              fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 6,
              animation: 'ns-tour-float 1.6s ease-in-out infinite' }}>
              <span aria-hidden="true">←</span> Try the AI on sample files
            </button>
          )}
        </>
      )}
    </div>
  );
}
