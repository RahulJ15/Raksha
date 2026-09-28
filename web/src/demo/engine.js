// Static demo backend for the Vercel build: replays real model results snapshotted by
// scripts/build_demo_data.py, and runs the same combining rules as api/engine.py in the browser.

const load = (() => {
  let p = null;
  return () => (p = p || Promise.all(['site', 'models', 'assets', 'samples'].map((n) => fetch(`/demo/${n}.json`).then((r) => r.json())))
    .then(([site, models, assets, samples]) => ({ site, models, assets, samples })));
})();

// --- mirrors api/engine.py -------------------------------------------------------------------------

const AREA = {
  bearing_fault: 'mechanical', unbalanced_rotor: 'mechanical', misalignment: 'mechanical', stuck_rotor: 'mechanical',
  stator_short_circuit: 'electrical', cooling_fan_failure: 'cooling', pipe_leak: 'water',
  I: 'mechanical', O: 'mechanical', B: 'mechanical', C: 'mechanical',
  vibration: 'mechanical', thermal: 'electrical', pressure: 'water', acoustic: 'water', crack: 'structural', strain: 'structural',
};
const SENSOR_NAME = {
  machine: 'Sound + vibration', thermal: 'Thermal camera', sound: 'Microphone', bearing: 'Vibration spectrogram',
  crack: 'Crack photo', strain_live: 'Strain gauge (live)', crack_live: 'Crack gauge (live)',
  vibration_live: 'Vibration sensor (live)', thermal_live: 'Thermal sensor (live)', pressure_live: 'Pressure sensor (live)',
  acoustic_live: 'Acoustic sensor (live)',
};
const VERY_SURE = 0.95;

export function assessAsset(results) {
  const faults = Object.entries(results).filter(([, r]) => r.fault);
  if (!faults.length) {
    return { decision: 'healthy', title: 'No problem found', action: 'No action. Keep monitoring as usual.', reason: 'Every sensor type reads healthy.' };
  }
  if (faults.length >= 2) {
    const areas = [...new Set(faults.map(([, r]) => AREA[r.label] || 'other'))].sort();
    return {
      decision: 'confirmed', title: 'Confirmed problem: raise a ticket',
      action: 'Send a technician. Two independent sensor types agree something is wrong.',
      reason: areas.length === 1 ? `Both point to the same kind of problem (${areas[0]}).`
        : `They see different sides of it (${areas.join(' and ')}), so there may be two problems. Check both.`,
    };
  }
  const [[key, r]] = faults;
  const others = Object.keys(results).filter((k) => k !== key).map((k) => SENSOR_NAME[k].toLowerCase());
  if (r.confidence >= VERY_SURE) {
    return {
      decision: 'inspect', title: 'Check on the next visit', action: "Schedule an inspection. Don't send anyone out urgently yet.",
      reason: `Only the ${SENSOR_NAME[key].toLowerCase()} sees a problem (${r.name}, very confident); `
        + (others.length ? `the ${others.join(' and ')} reads healthy.`
          : `add a second sensor type (${key === 'thermal' ? 'e.g. a sound + vibration capture' : 'e.g. a thermal image'}) to confirm.`),
    };
  }
  return { decision: 'monitor', title: 'Keep an eye on it', action: 'No visit needed. Take another reading later to see if it persists.',
    reason: `Only the ${SENSOR_NAME[key].toLowerCase()} flags ${r.name}, and it isn't sure.` };
}

export function perType(items) {
  const best = {};
  const rank = (r) => [r.fault ? 1 : 0, r.fault ? r.confidence : -r.confidence];
  for (const it of items) {
    const r = it.result;
    if (!r) continue;
    const cur = best[it.type];
    const a = rank(r);
    const b = cur && rank(cur);
    if (!cur || a[0] > b[0] || (a[0] === b[0] && a[1] > b[1])) best[it.type] = r;
  }
  return best;
}

export function liveResults(site, sensorIds) {
  const byId = Object.fromEntries(site.sensors.map((s) => [s.id, s]));
  const out = [];
  for (const sid of sensorIds) {
    const s = byId[sid];
    if (!s || s.st === 'off') continue;
    const kind = site.kinds[s.kind];
    const m = s.model || {};
    const fault = s.st === 'crit' || s.st === 'watch';
    let conf = { crit: 0.99, watch: 0.8, ok: 0.9 }[s.st];
    let label;
    let name;
    if (fault && m.fault) { label = m.label; name = m.name; if (s.st === 'crit') conf = Math.max(conf, m.confidence); }
    else if (fault) { label = s.kind; name = (s.plain || {}).h || `${kind.name} out of range`; }
    else { label = 'healthy'; name = 'healthy'; }
    const family = ['thermal', 'pressure', 'acoustic', 'strain', 'crack'].includes(s.kind) ? s.kind : 'vibration';
    out.push({
      type: `${family}_live`, sensor: sid, zone: s.zone,
      reading: `${s.v.toFixed(kind.dp)} ${kind.unit}${{ crit: ' (critical)', watch: ' (watch)', ok: '' }[s.st]}`,
      result: { label, name, confidence: Math.round(conf * 1000) / 1000, fault },
    });
  }
  return out;
}

// --- the API surface the UI uses ------------------------------------------------------------------

export async function getSite() { return (await load()).site; }
export async function getModels() { return (await load()).models; }
export async function getAssets() { return (await load()).assets; }
export async function getSamples() { return (await load()).samples; }

export async function scan(files, overrides, assetId) {
  const { site, assets, samples } = await load();
  const items = files.map((f, i) => {
    const sample = samples.find((s) => s.name === f.name);
    if (!sample) {
      return { filename: f.name, error: 'Demo mode only has results for the sample files. Pick one from "Try a sample" below; the full version analyses any upload.' };
    }
    const item = structuredClone(sample.item);
    const forced = overrides[i];
    if (forced && forced !== item.type) {
      return { filename: f.name, detected: { ...item.detected, auto: false }, error: 'Demo mode can only show the auto-detected result for this sample.' };
    }
    return item;
  });
  const machine = assets.find((a) => a.id === assetId);
  const live = machine ? liveResults(site, machine.sensors) : [];
  const combined = perType([...items, ...live]);
  return { items, live, machine: machine?.name ?? null, asset: Object.keys(combined).length ? assessAsset(combined) : null, sensor_types: Object.keys(combined).sort() };
}

export async function verdict(type, file) {
  const sample = (await load()).samples.find((s) => s.name === file.name);
  if (!sample?.verdict) throw new Error('No AI explanation saved for this file in the demo.');
  if (sample.verdict.error) throw new Error(sample.verdict.error);
  return { ...sample.verdict, model: 'generated ahead of time' };
}
