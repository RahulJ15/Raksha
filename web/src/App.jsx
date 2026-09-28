import { useEffect, useState } from 'react';
import { getSite } from './api';
import { revealInScroller } from './infrasensor/scroll';
import Main from './infrasensor/Main';

const POLL_MS = 30000;
const params = new URLSearchParams(location.search);

// Onboarding (welcome, sign-up, checkup) on the first visit only; ?start=intro replays it for demos.
function startScreen() {
  if (params.get('start')) return params.get('start');
  try { return localStorage.getItem('infrasensor:onboarded') ? 'overview' : 'intro'; } catch (e) { return 'intro'; }
}

export default function App() {
  const [site, setSite] = useState(null);
  const [error, setError] = useState(null);

  // When a section is expanded, bring what it revealed into view (it often opens below the fold).
  useEffect(() => {
    const onClick = (e) => {
      const btn = e.target.closest?.('main button[aria-expanded]');
      if (!btn || btn.getAttribute('aria-expanded') === 'true') return;
      // Twice: once as it starts opening, once after the open animation has finished growing the page.
      [320, 800].forEach((ms) => setTimeout(() => {
        if (btn.getAttribute('aria-expanded') !== 'true') return;
        revealInScroller(btn.closest('section') || btn.parentElement, { smooth: true, alignTop: true });
      }, ms));
    };
    // Capture phase: runs before React toggles the section, so we see its state before the click.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await getSite();
        if (alive) { setSite(data); setError(null); }
      } catch (e) {
        if (alive) setError(e.message);
      }
    };
    load();
    const t = setInterval(load, POLL_MS);
    return () => { alive = false; clearInterval(t); };
  }, []);

  if (!site) {
    return (
      <div className="boot">
        {error ? <>Can't reach the Raksha API ({error}).<br />Start it with <code>uvicorn api.main:app --port 8000</code></> : 'Loading site…'}
      </div>
    );
  }
  return (
    <div className="stage">
      <Main site={site} theme={params.get('theme') || 'Turtle'} start={startScreen()} />
    </div>
  );
}
