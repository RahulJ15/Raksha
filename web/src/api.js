// Single place the UI talks to the backend. VITE_DEMO_MODE=true (the Vercel build) swaps the live FastAPI
// backend for replayed results of the real models (src/demo/engine.js).
import * as demo from './demo/engine';

export const DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

const json = async (r) => {
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(typeof data.detail === 'string' ? data.detail : `API returned ${r.status}`);
  return data;
};

const form = (fields) => {
  const body = new FormData();
  Object.entries(fields).forEach(([k, v]) => [].concat(v).forEach((x) => x != null && body.append(k, x)));
  return body;
};

export const getSite = () => (DEMO ? demo.getSite() : fetch('/api/site').then(json));
export const getModels = () => (DEMO ? demo.getModels() : fetch('/api/models').then(json));
export const getAssets = () => (DEMO ? demo.getAssets() : fetch('/api/assets').then(json));
export const getSamples = () => (DEMO ? demo.getSamples() : Promise.resolve([]));

export const scan = (files, overrides, asset) => (DEMO ? demo.scan(files, overrides, asset)
  : fetch('/api/scan', { method: 'POST', body: form({ files, types: JSON.stringify(overrides), asset }) }).then(json));

export const verdict = (type, file) => (DEMO ? demo.verdict(type, file)
  : fetch(`/api/verdict/${type}`, { method: 'POST', body: form({ file }) }).then(json));
