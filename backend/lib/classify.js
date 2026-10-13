import { HttpError } from "./registry.js";

// 10-tone reference scale (light to deep). Same hex values as the frontend guide.
const TONES = Object.freeze([
  { id: 1, hex: "#F6EDE4", label: "Very fair" },
  { id: 2, hex: "#F3E7DB", label: "Fair" },
  { id: 3, hex: "#F7EAD0", label: "Light" },
  { id: 4, hex: "#EADABA", label: "Light-medium" },
  { id: 5, hex: "#D7BD96", label: "Medium" },
  { id: 6, hex: "#A07E56", label: "Medium-tan" },
  { id: 7, hex: "#825C43", label: "Tan" },
  { id: 8, hex: "#604134", label: "Brown" },
  { id: 9, hex: "#3A312A", label: "Deep brown" },
  { id: 10, hex: "#292420", label: "Very deep" },
]);

// Broad bands for the dark / fair question.
const CATEGORIES = Object.freeze([
  { max: 2, name: "very_fair", label: "Very fair", sunSensitivity: "very_high" },
  { max: 4, name: "fair", label: "Fair", sunSensitivity: "high" },
  { max: 6, name: "medium", label: "Medium", sunSensitivity: "moderate" },
  { max: 8, name: "dark", label: "Dark", sunSensitivity: "lower_but_present" },
  { max: 10, name: "very_dark", label: "Very dark", sunSensitivity: "lower_but_present" },
]);

const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function rgbToLab([r, g, b]) {
  const lin = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const [fx, fy, fz] = [f(X), f(Y), f(Z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

// Reference colours converted once at startup.
const REFS = TONES.map((t) => ({ ...t, lab: rgbToLab(parse(t.hex)) }));
const deltaE = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

function undertoneOf(lab) {
  const ratio = lab[2] / Math.max(lab[1], 1);
  if (ratio > 1.7) return "warm";
  if (ratio < 1.2) return "cool";
  return "neutral";
}

export function validateRgb(rgb) {
  const ok =
    Array.isArray(rgb) &&
    rgb.length === 3 &&
    rgb.every((v) => Number.isInteger(v) && v >= 0 && v <= 255);
  if (!ok) throw new HttpError(400, "rgb must be an array of three integers between 0 and 255");
  return rgb;
}

/**
 * Classify one sampled skin colour. This is a colour estimate only:
 * it does not look at a photo and it never diagnoses a medical condition.
 */
export function classifyRgb(rgb) {
  validateRgb(rgb);
  const lab = rgbToLab(rgb);

  let best = REFS[0];
  let bestD = Infinity;
  for (const t of REFS) {
    const d = deltaE(lab, t.lab);
    if (d < bestD) {
      bestD = d;
      best = t;
    }
  }

  const category = CATEGORIES.find((c) => best.id <= c.max);
  // The sample should sit close to one of the reference tones; a large gap means it
  // is probably not skin (for example a wall or clothing), so say so.
  const confidence = bestD < 7 ? "high" : bestD < 12 ? "medium" : "low";

  return {
    tone: best.id,
    toneLabel: best.label,
    category: category.name,
    categoryLabel: category.label,
    sunSensitivity: category.sunSensitivity,
    undertone: undertoneOf(lab),
    confidence,
    distance: Math.round(bestD * 10) / 10,
    note:
      confidence === "low"
        ? "Low confidence: the sampled colour is far from any skin tone. Click on a clear patch of skin and try again."
        : "Colour estimate only. This is not a medical diagnosis.",
  };
}
