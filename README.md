# Damilola Skin Color Detector

A skin-tone detector with sun-safety and skin-care guidance. Upload a photo, get an estimated tone
(10-step scale), a dark / fair category, an undertone estimate and care tips for that tone.

> **Not medical advice.** The app estimates colour from a photo. It does not diagnose any skin
> condition, and it does not detect albinism or any other medical condition. See a doctor for health concerns.

Photos are analysed in the browser. Only the sampled colour (three numbers) is sent to the backend.

## Structure

```
SkinColorDetector/
├── frontend/          React + Vite app
│   ├── src/           pages, search, detector, API client
│   └── public/        logo (and optional portraits for the gallery)
├── backend/           Node API, no dependencies
│   ├── index.js       HTTP server (API + serves the built frontend)
│   ├── lib/           registry (datasets) and classify (tone categories)
│   └── data/          dataset catalog
└── package.json       root scripts
```

## Run it

Requires Node 18 or newer.

```bash
npm run install:all        # install frontend dependencies
```

**Development** (two terminals, hot reload):

```bash
npm run dev:backend        # API on http://127.0.0.1:4000
npm run dev:frontend       # app on http://localhost:5173 (proxies /api to the backend)
```

**Single server** (production-style, one link):

```bash
npm run build              # builds frontend/dist
npm start                  # serves the app and the API on http://127.0.0.1:4000
```

On Windows PowerShell, if `npm` is blocked by the execution policy, use `npm.cmd` instead.

### Configuration (environment variables)

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Backend port |
| `HOST` | `127.0.0.1` | Bind address (use `0.0.0.0` when deploying) |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed browser origin for the API |
| `STATIC_DIR` | `frontend/dist` | Built frontend to serve |
| `VITE_API_TARGET` | `http://127.0.0.1:4000` | Backend the dev server proxies to |

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Status |
| GET | `/api/datasets` | Dataset catalog. Filters: `type`, `access`, `scale`, `q`, `limit`, `offset` |
| GET | `/api/datasets/:id` | One dataset |
| GET | `/api/datasets/groups` | Datasets grouped by type |
| GET | `/api/datasets/meta` | Allowed filter values |
| GET | `/api/datasets/for-scale/:scale` | Datasets labelled with `monk` or `fitzpatrick` |
| POST | `/api/classify` | Body `{ "rgb": [r, g, b] }`. Returns tone, category, undertone, sun sensitivity and confidence |

## Notes

- **Accuracy:** colour estimates depend on lighting, camera and the patch of skin sampled. Light skin
  in photos is often read as darker than it is. Click a clear patch of skin to re-sample, and treat
  "low confidence" results as unreliable.
- **Datasets:** links and licences in the catalog come from the project owner and should be checked
  before use. Several are non-commercial.
- **Gallery photos:** the portraits used in the moving gallery are third-party images and are not
  included in this repository. Put your own images in `frontend/public/people/` (and list them in
  `GALLERY` in `frontend/src/data.js`) to enable the gallery. It hides itself when no images load.
