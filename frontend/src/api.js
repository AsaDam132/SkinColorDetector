// Client for the Skin Detector backend (server/index.js). Calls go to /api and are
// proxied to the backend by Vite in dev (see vite.config.js).
const BASE = "/api";

async function get(path, signal) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("Cannot reach the backend. Start it with: npm run server");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    // The dev proxy answers with an empty 5xx when the backend is not running.
    if (res.status >= 500 && !body.error) {
      throw new Error("Cannot reach the backend. Start it with: npm run server");
    }
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return body;
}

const qs = (params) => {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null));
  const s = new URLSearchParams(clean).toString();
  return s ? `?${s}` : "";
};

// Sends only the sampled colour (three numbers), never the photo.
export async function classifyColor(rgb, signal) {
  let res;
  try {
    res = await fetch(`${BASE}/classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rgb }),
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("Cannot reach the backend. Start it with: npm run server");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status >= 500 && !body.error) throw new Error("Cannot reach the backend. Start it with: npm run server");
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return body;
}

export const getDatasets =(params = {}, signal) => get(`/datasets${qs(params)}`, signal);
export const getDatasetMeta = (signal) => get("/datasets/meta", signal);
export const getDatasetsForScale = (scale, signal) => get(`/datasets/for-scale/${scale}`, signal);
