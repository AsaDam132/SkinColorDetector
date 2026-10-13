import { TONES } from "./data.js";

const hex = (n) => n.toString(16).padStart(2, "0");
export const toHex = ([r, g, b]) => `#${hex(r)}${hex(g)}${hex(b)}`;

const fromHex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// sRGB -> CIE L*a*b* (D65)
export function rgbToLab([r, g, b]) {
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

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

export function nearestTone(rgb) {
  const lab = rgbToLab(rgb);
  let best = TONES[0];
  let bestD = Infinity;
  for (const t of TONES) {
    const d = dist(lab, rgbToLab(fromHex(t.hex)));
    if (d < bestD) {
      bestD = d;
      best = t;
    }
  }
  return best;
}

// Rough undertone from the yellow/red balance of the skin colour.
export function undertone(rgb) {
  const [, a, b] = rgbToLab(rgb);
  const ratio = b / Math.max(a, 1);
  if (ratio > 1.7) return "Warm";
  if (ratio < 1.2) return "Cool";
  return "Neutral";
}

const isSkin = (r, g, b) => {
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
};

function average(pixels) {
  let r = 0, g = 0, b = 0;
  for (const p of pixels) {
    r += p[0];
    g += p[1];
    b += p[2];
  }
  const n = pixels.length || 1;
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}

function readRegion(ctx, x, y, w, h) {
  const { data } = ctx.getImageData(x, y, w, h);
  const all = [];
  const skin = [];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    const px = [data[i], data[i + 1], data[i + 2]];
    all.push(px);
    if (isSkin(px[0], px[1], px[2])) skin.push(px);
  }
  return { all, skin };
}

// Previous method (kept for comparison): average skin-coloured pixels in a fixed central box.
export function sampleAutoCenter(canvas) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const w = Math.floor(canvas.width * 0.4);
  const h = Math.floor(canvas.height * 0.4);
  const x = Math.floor((canvas.width - w) / 2);
  const y = Math.floor(canvas.height * 0.2);
  const { all, skin } = readRegion(ctx, x, y, w, h);
  const useSkin = skin.length > all.length * 0.08;
  return average(useSkin ? skin : all);
}

// Manual: average a small patch around the clicked point.
export function samplePoint(canvas, cx, cy, radius = 10) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const x = Math.max(0, Math.floor(cx - radius));
  const y = Math.max(0, Math.floor(cy - radius));
  const w = Math.min(canvas.width - x, radius * 2);
  const h = Math.min(canvas.height - y, radius * 2);
  const { all } = readRegion(ctx, x, y, w, h);
  return average(all);
}

const median = (arr) => {
  const a = Float32Array.from(arr).sort();
  return a[Math.floor(a.length / 2)];
};

/**
 * Automatic: find the main skin-coloured region of the photo and take the median colour of it.
 * Works on an 8px grid: a cell counts as skin when most of its pixels pass the skin test, then
 * connected skin cells are grouped and the group nearest the centre (and largest) wins.
 * The median ignores shadows, highlights and stray hair or lip pixels.
 */
export function sampleAuto(canvas) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const W = canvas.width;
  const H = canvas.height;
  const CELL = 8;
  const cols = Math.floor(W / CELL);
  const rows = Math.floor(H / CELL);
  if (cols < 3 || rows < 3) return sampleAutoCenter(canvas);

  const { data } = ctx.getImageData(0, 0, cols * CELL, rows * CELL);
  const stride = cols * CELL * 4;
  const isSkinCell = new Uint8Array(cols * rows);
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      let hit = 0;
      for (let y = 0; y < CELL; y++) {
        for (let x = 0; x < CELL; x++) {
          const i = (cy * CELL + y) * stride + (cx * CELL + x) * 4;
          if (data[i + 3] > 200 && isSkin(data[i], data[i + 1], data[i + 2])) hit++;
        }
      }
      if (hit >= CELL * CELL * 0.7) isSkinCell[cy * cols + cx] = 1;
    }
  }

  // Group touching skin cells (flood fill) and score each group.
  const seen = new Uint8Array(cols * rows);
  const maxD = Math.hypot(cols / 2, rows / 2);
  let best = null;
  for (let start = 0; start < isSkinCell.length; start++) {
    if (!isSkinCell[start] || seen[start]) continue;
    const cells = [];
    const stack = [start];
    seen[start] = 1;
    while (stack.length) {
      const c = stack.pop();
      cells.push(c);
      const cx = c % cols;
      const cy = (c / cols) | 0;
      for (const [nx, ny] of [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]]) {
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const n = ny * cols + nx;
        if (isSkinCell[n] && !seen[n]) {
          seen[n] = 1;
          stack.push(n);
        }
      }
    }
    let mx = 0;
    let my = 0;
    for (const c of cells) {
      mx += c % cols;
      my += (c / cols) | 0;
    }
    mx /= cells.length;
    my /= cells.length;
    const centred = 1 - 0.5 * (Math.hypot(mx - cols / 2, my - rows / 2) / maxD);
    const score = cells.length * centred;
    if (!best || score > best.score) best = { score, cells };
  }

  if (!best || best.cells.length < 4) return sampleAutoCenter(canvas);

  const rs = [];
  const gs = [];
  const bs = [];
  for (const c of best.cells) {
    const cx = (c % cols) * CELL;
    const cy = ((c / cols) | 0) * CELL;
    for (let y = 0; y < CELL; y++) {
      for (let x = 0; x < CELL; x++) {
        const i = (cy + y) * stride + (cx + x) * 4;
        rs.push(data[i]);
        gs.push(data[i + 1]);
        bs.push(data[i + 2]);
      }
    }
  }
  return [Math.round(median(rs)), Math.round(median(gs)), Math.round(median(bs))];
}
