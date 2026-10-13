import { DATASETS } from "../data/datasets.js";

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const TYPES = Object.freeze(["skin_tone", "skin_spectra", "dermatology", "albinism", "mixed"]);
export const ACCESS = Object.freeze(["open", "request", "restricted", "huggingface", "kaggle"]);
export const SCALES = Object.freeze(["monk", "fitzpatrick", "pantone", "cie", "other"]);

const TYPE_SET = new Set(TYPES);
const ACCESS_SET = new Set(ACCESS);
const SCALE_SET = new Set(SCALES);

const stripCitations = (s) => (s ? s.replace(/\s*\[citation:\d+\]/g, "").trim() : s);

// Which standard scales a dataset's free-text `scale` field refers to.
function scalesOf(scale) {
  const s = scale.toLowerCase();
  const out = [];
  if (/\bmonk\b|\bmst\b|\bemst\b/.test(s)) out.push("monk");
  // "non-Fitzpatrick" (e.g. MILK10k) must not count as Fitzpatrick-labelled.
  if (/(?<!non-)fitzpatrick|efst/.test(s)) out.push("fitzpatrick");
  if (/pantone/.test(s)) out.push("pantone");
  if (/\bcie\b/.test(s)) out.push("cie");
  return out.length ? out : ["other"];
}

// Built once at startup: every request after that is a Map/array lookup.
const entries = Object.freeze(
  DATASETS.map((d) =>
    Object.freeze({
      ...d,
      notes: stripCitations(d.notes),
      scales: Object.freeze(scalesOf(d.scale)),
      // True when the dataset has labelled skin images a tone model could use.
      usableForToneModel: d.type === "skin_tone" || d.type === "mixed",
    })
  )
);

const byId = new Map(entries.map((d) => [d.id, d]));
const haystack = new Map(
  entries.map((d) => [d.id, `${d.name} ${d.scale} ${d.license} ${d.notes ?? ""}`.toLowerCase()])
);

const byType = new Map(TYPES.map((t) => [t, []]));
const byScale = new Map(SCALES.map((s) => [s, []]));
for (const d of entries) {
  byType.get(d.type).push(d);
  for (const s of d.scales) byScale.get(s).push(d);
}

function oneOf(value, allowed, label) {
  if (value == null || value === "") return undefined;
  if (!allowed.has(value)) {
    throw new HttpError(400, `Invalid ${label} "${value}". Allowed: ${[...allowed].join(", ")}`);
  }
  return value;
}

function intParam(value, fallback, min, max, label) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new HttpError(400, `${label} must be an integer between ${min} and ${max}`);
  }
  return n;
}

/**
 * Filter + paginate the catalog.
 * @param {{type?:string, access?:string, scale?:string, q?:string, limit?:string, offset?:string}} params
 */
export function listDatasets(params = {}) {
  const type = oneOf(params.type, TYPE_SET, "type");
  const access = oneOf(params.access, ACCESS_SET, "access");
  const scale = oneOf(params.scale, SCALE_SET, "scale");
  const limit = intParam(params.limit, 20, 1, 100, "limit");
  const offset = intParam(params.offset, 0, 0, 1_000_000, "offset");
  const words = (params.q ?? "").toLowerCase().split(/\s+/).filter(Boolean);

  // Start from the smallest pre-built index instead of scanning everything.
  let rows = scale ? byScale.get(scale) : type ? byType.get(type) : entries;
  if (type && scale) rows = rows.filter((d) => d.type === type);
  if (access) rows = rows.filter((d) => d.access === access);
  if (words.length) rows = rows.filter((d) => words.every((w) => haystack.get(d.id).includes(w)));

  return {
    total: rows.length,
    limit,
    offset,
    data: rows.slice(offset, offset + limit),
  };
}

export function getDatasetById(id) {
  const d = byId.get(id);
  if (!d) throw new HttpError(404, `Dataset "${id}" not found`);
  return d;
}

/** Datasets grouped by type, for the catalog UI. */
export function groupByType() {
  const out = {};
  for (const [type, rows] of byType) if (rows.length) out[type] = rows;
  return out;
}

/**
 * Hook for the Skin Detector: given a detected tone system, return the datasets
 * that are labelled with that system. Not called by the frontend yet.
 * @param {'monk'|'fitzpatrick'} scale
 */
export function datasetsForScale(scale) {
  if (!SCALE_SET.has(scale)) throw new HttpError(400, `Unknown scale "${scale}"`);
  return byScale.get(scale).filter((d) => d.usableForToneModel);
}

export const meta = Object.freeze({
  count: entries.length,
  types: TYPES,
  access: ACCESS,
  scales: SCALES,
});
