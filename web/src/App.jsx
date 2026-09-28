import { useEffect, useState } from 'react';
import { getSite } from './api';
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
