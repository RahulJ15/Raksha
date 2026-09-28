# Raksha UI

React/Vite port of the Claude Design prototype (`~/Downloads/infrasensor/source/Main.dc.html`),
wired to the FastAPI backend in `../api`.

- `src/infrasensor/template.jsx`: the screens' markup, generated from the prototype template
- `src/infrasensor/Main.jsx`: the prototype's component logic; `data()` now builds from `props.site`
- `src/App.jsx`: loads `/api/site` and polls it every 30 s

## Run

```bash
# 1. API (from the repo root). Uses the venv that already has torch/sklearn.
vibro-acoustic-bearing-fault-diagnosis/.venv/bin/python -m uvicorn api.main:app --port 8000

# 2a. Dev UI with hot reload, proxying /api to :8000
cd web && npm install && npm run dev        # http://localhost:5173

# 2b. Or build once and let the API serve it
cd web && npm run build                     # http://localhost:8000
```

Append `?theme=Harbor` or `?theme=Dusk` to switch themes.

## API

| Endpoint | Returns |
| --- | --- |
| `GET /api/site` | Site, sensor kinds, map levels, and all 26 sensors with live reading, 12 h trend, status, anomaly score and classifier result |
| `GET /api/sensors/{id}` | One sensor from the snapshot |
| `POST /api/classify/{sound,bearing}` | Classify an uploaded spectrogram (`file` form field) |
| `POST /api/reload` | Reload data and model checkpoints after retraining |

Each UI sensor is bound to a wallsense unit and channel in `api/site.py`. The reading is
`base + gain × (channel − channel's healthy baseline)`, smoothed over 6 h.
