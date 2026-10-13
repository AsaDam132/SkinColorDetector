import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen, Circle, CircleHelp, CloudOff, Database, HeartPulse, History, Home as HomeIcon, Info,
  LayoutDashboard, Lock, Menu, Palette as PaletteIcon, ScanFace, Search, ShieldCheck, TriangleAlert, Upload,
} from "lucide-react";

// Only the icons the app uses (importing the whole library would add ~800 KB).
const Icons = {
  BookOpen, Circle, CircleHelp, CloudOff, Database, HeartPulse, History, Home: HomeIcon, Info,
  LayoutDashboard, Lock, Menu, Palette: PaletteIcon, ScanFace, Search, ShieldCheck, TriangleAlert, Upload,
};
import {
  NAV, NAV_PREFS, TONES, SPECIAL, CARE_TIPS, PALETTE_BY_GROUP, FAQ, GALLERY,
  buildIndex, search,
} from "./data.js";
import { nearestTone, undertone, sampleAuto, samplePoint, toHex } from "./detect.js";
import { getDatasets, getDatasetsForScale, classifyColor } from "./api.js";

const STORE_KEY = "scd.recent.v1";

const loadRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch {
    return [];
  }
};
const saveRecent = (list) => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable: keep in memory only */
  }
};

const Icon = ({ name, size = 20 }) => {
  const C = Icons[name] || Icons.Circle;
  return <C size={size} aria-hidden="true" />;
};

/* ---------- Sidebar ---------- */
function Sidebar({ page, go, open, setOpen }) {
  const item = (n) => (
    <button
      key={n.id}
      className={`nav-item ${page === n.id ? "active" : ""}`}
      onClick={() => {
        go(n.id);
        setOpen(false);
      }}
      aria-current={page === n.id ? "page" : undefined}
    >
      <Icon name={n.icon} />
      <span>{n.label}</span>
      {page === n.id && <i className="dot" />}
    </button>
  );
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <img src="/logo.webp" alt="" className="brand-logo" />
        <div>
          <strong>Damilola</strong>
          <small>SkinColorDetector</small>
        </div>
      </div>
      <p className="nav-label">Main menu</p>
      <nav>{NAV.map(item)}</nav>
      <hr />
      <p className="nav-label">Preferences</p>
      <nav>{NAV_PREFS.map(item)}</nav>
    </aside>
  );
}

/* ---------- Search (top of page) ---------- */
function SearchBar({ go }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const index = useMemo(buildIndex, []);
  const results = useMemo(() => search(index, q), [index, q]);
  const box = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const pick = (r) => {
    go(r.page);
    setOpen(false);
    setQ("");
  };

  return (
    <div className="search" ref={box} role="search">
      <Icons.Search size={18} aria-hidden="true" />
      <input
        type="search"
        value={q}
        placeholder="Search skin tones, sun care, FAQ..."
        aria-label="Search"
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results[0]) pick(results[0]);
          if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && q.trim() && (
        <ul className="results">
          {results.length === 0 && <li className="empty">No results for "{q}"</li>}
          {results.map((r, i) => (
            <li key={i}>
              <button onClick={() => pick(r)}>
                <span className="tag">{r.kind}</span>
                <strong>{r.title}</strong>
                <small>{r.text.slice(0, 90)}{r.text.length > 90 ? "..." : ""}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Moving photo gallery ---------- */
function Motion() {
  // Photos are optional: any image that fails to load is dropped, and the strip hides if none load.
  const [failed, setFailed] = useState(() => new Set());
  const photos = GALLERY.filter((src) => !failed.has(src));
  if (photos.length === 0) return null;
  const row = [...photos, ...photos];
  return (
    <div className="motion" aria-label="Gallery of different skin tones">
      <div className="track">
        {row.map((src, i) => (
          <figure key={i} aria-hidden={i >= photos.length}>
            <img
              src={src}
              alt={i < photos.length ? `Portrait ${i + 1}` : ""}
              onError={() => setFailed((prev) => new Set(prev).add(src))}
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ---------- Pages ---------- */
function Home({ go }) {
  return (
    <>
      <section className="hero">
        <img src="/logo.webp" alt="Damilola Skin Color Detector logo" className="hero-logo" />
        <div>
          <h1>Know your skin. Protect it.</h1>
          <p>
            Upload a photo to estimate your skin tone, then get sun-safety and skin-care guidance
            made for your tone. Built for skin health, not just colour.
          </p>
          <div className="row">
            <button className="btn primary" onClick={() => go("detector")}>
              <Icons.ScanFace size={18} /> Start detector
            </button>
            <button className="btn" onClick={() => go("guide")}>Skin tone guide</button>
          </div>
        </div>
      </section>
      <Motion />
      <section className="cards">
        {[
          ["ScanFace", "Estimate tone", "Photo analysed in your browser."],
          ["Sun", "Sun-safe advice", "SPF and shade guidance per tone."],
          ["HeartPulse", "Daily care", "Simple habits for healthy skin."],
        ].map(([ic, t, d]) => (
          <article className="card" key={t}>
            <span className="chip"><Icon name={ic} /></span>
            <h3>{t}</h3>
            <p>{d}</p>
          </article>
        ))}
      </section>
      <p className="note">
        <Icons.Info size={16} /> General information only, not medical advice or a diagnosis.
      </p>
    </>
  );
}

const SUN_LABEL = {
  very_high: "Very high: burns quickly, strict sun protection needed",
  high: "High: burns easily",
  moderate: "Moderate",
  lower_but_present: "Lower, but UV damage is still possible",
};

function ResultCard({ result }) {
  const key = result.rgb.join(",");
  // The backend does the dark / fair classification; the local estimate is the fallback.
  const remote = useApi((signal) => classifyColor(result.rgb, signal), [key]);
  const cls = remote.data;
  const tone = cls ? TONES.find((t) => t.id === cls.tone) : nearestTone(result.rgb);
  return (
    <article className="result">
      {cls && (
        <div className="category">
          <span className={`badge cat-${cls.category}`}>{cls.categoryLabel}</span>
          <span className={`badge conf-${cls.confidence}`}>Confidence: {cls.confidence}</span>
        </div>
      )}
      {cls?.confidence === "low" && (
        <p className="warn" role="alert">
          <Icons.TriangleAlert size={16} /> {cls.note}
        </p>
      )}
      {remote.error && <p className="warn"><Icons.CloudOff size={16} /> {remote.error} (showing local estimate)</p>}
      <div className="swatches">
        <div className="sw" style={{ background: toHex(result.rgb) }}><span>Your sample</span></div>
        <div className="sw" style={{ background: tone.hex }}><span>{tone.name}</span></div>
      </div>
      <dl>
        <dt>Sampled colour</dt><dd>{toHex(result.rgb).toUpperCase()}</dd>
        <dt>Closest tone</dt><dd>{tone.name}: {tone.label}</dd>
        <dt>Undertone (estimate)</dt><dd>{cls ? cls.undertone[0].toUpperCase() + cls.undertone.slice(1) : undertone(result.rgb)}</dd>
        <dt>Sun sensitivity</dt><dd>{cls ? SUN_LABEL[cls.sunSensitivity] : tone.uv}</dd>
        <dt>Suggested sunscreen</dt><dd>{tone.spf}</dd>
      </dl>
      <h4>Care for this tone</h4>
      <ul>{tone.tips.map((t) => <li key={t}>{t}</li>)}</ul>
      <MatchingDatasets />
    </article>
  );
}

function Detector({ onSave }) {
  const canvas = useRef(null);
  const [src, setSrc] = useState(null);
  const [result, setResult] = useState(null);
  const [marker, setMarker] = useState(null);
  const [error, setError] = useState("");

  const finish = (rgb, label) => {
    const r = { rgb, tone: nearestTone(rgb).id, time: Date.now() };
    setResult(r);
    onSave(r, label);
  };

  const load = (file) => {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = canvas.current;
      const scale = Math.min(1, 640 / img.width);
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d", { willReadFrequently: true }).drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      setSrc(true);
      setMarker(null);
      finish(sampleAuto(c), "auto");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("That image could not be read. Try another photo.");
    };
    img.src = url;
  };

  const click = (e) => {
    const c = canvas.current;
    const rect = c.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * c.width;
    const y = ((e.clientY - rect.top) / rect.height) * c.height;
    setMarker({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    finish(samplePoint(c, x, y), "click");
  };

  return (
    <>
      <section className="panel">
        <h2>Skin Detector</h2>
        <p>Use daylight, no filter, and face the light. Then click a clear patch of skin to re-sample.</p>
        <label
          className="drop"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            load(e.dataTransfer.files[0]);
          }}
        >
          <Icons.Upload size={22} />
          <span>Choose or drop a photo</span>
          <input type="file" accept="image/*" onChange={(e) => load(e.target.files[0])} />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="stage" hidden={!src}>
          <div className="canvas-wrap">
            <canvas ref={canvas} onClick={click} aria-label="Uploaded photo. Click to sample skin colour." />
            {marker && <i className="marker" style={{ left: `${marker.x}%`, top: `${marker.y}%` }} />}
          </div>
          {result && <ResultCard result={result} />}
        </div>
      </section>
      <p className="note">
        <Icons.Lock size={16} /> Photos are processed on your device and are never uploaded.
      </p>
    </>
  );
}

/* ---------- Backend-powered: datasets ---------- */
const TYPE_LABEL = {
  skin_tone: "Skin tone",
  skin_spectra: "Skin spectra",
  dermatology: "Dermatology",
  albinism: "Albinism",
  mixed: "Mixed",
};
const ACCESS_LABEL = {
  open: "Open",
  request: "On request",
  restricted: "Restricted",
  huggingface: "Hugging Face",
  kaggle: "Kaggle",
};

// Runs an API call, cancels it when inputs change, and exposes loading/error state.
function useApi(fn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: "" }));
    fn(ctrl.signal)
      .then((data) => setState({ data, loading: false, error: "" }))
      .catch((err) => {
        if (err.name !== "AbortError") setState({ data: null, loading: false, error: err.message });
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

function DatasetCard({ d, compact = false }) {
  const size = typeof d.size === "number" ? `${d.size.toLocaleString()} items` : d.size;
  return (
    <article className="card dataset">
      <div className="badges">
        <span className="badge type">{TYPE_LABEL[d.type] || d.type}</span>
        <span className={`badge access-${d.access}`}>{ACCESS_LABEL[d.access] || d.access}</span>
        {!d.usableForToneModel && <span className="badge muted">Not for tone models</span>}
      </div>
      <h3>
        <a href={d.url} target="_blank" rel="noopener noreferrer">{d.name}</a>
      </h3>
      <p className="meta">{size} · {d.scale}</p>
      {!compact && d.notes && <p>{d.notes}</p>}
      {!compact && <p className="meta">License: {d.license}</p>}
    </article>
  );
}

function ApiState({ state, empty }) {
  if (state.loading) return <p className="status" role="status">Loading...</p>;
  if (state.error) {
    return (
      <p className="error" role="alert">
        <Icons.CloudOff size={16} /> {state.error}
      </p>
    );
  }
  if (empty) return <p className="status">No datasets match your filters.</p>;
  return null;
}

function Datasets() {
  const [filters, setFilters] = useState({ q: "", type: "", access: "", scale: "" });
  const [q, setQ] = useState("");

  // Wait briefly after typing so we do not call the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, q })), 250);
    return () => clearTimeout(t);
  }, [q]);

  const state = useApi((signal) => getDatasets(filters, signal), [filters]);
  const rows = state.data?.data ?? [];
  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  const select = (key, label, options) => (
    <label className="field">
      <span>{label}</span>
      <select value={filters[key]} onChange={set(key)}>
        <option value="">All</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );

  return (
    <section className="panel">
      <h2>Datasets</h2>
      <p>Open research datasets used to build and test skin-tone tools. Always check each licence before use.</p>
      <div className="filters">
        <label className="field grow">
          <span>Search</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, scale, notes..." />
        </label>
        {select("type", "Type", Object.entries(TYPE_LABEL))}
        {select("access", "Access", Object.entries(ACCESS_LABEL))}
        {select("scale", "Scale", [["monk", "Monk"], ["fitzpatrick", "Fitzpatrick"], ["pantone", "Pantone"], ["cie", "CIE"], ["other", "Other"]])}
      </div>
      <ApiState state={state} empty={!state.loading && !state.error && rows.length === 0} />
      {state.data && (
        <>
          <p className="count">{state.data.total} dataset{state.data.total === 1 ? "" : "s"}</p>
          <div className="cards">{rows.map((d) => <DatasetCard key={d.id} d={d} />)}</div>
        </>
      )}
    </section>
  );
}

// Datasets labelled with the tone system the detector uses (Monk-style 10 tones).
function MatchingDatasets() {
  const state = useApi((signal) => getDatasetsForScale("monk", signal), []);
  return (
    <section className="matching">
      <h4>Matching datasets</h4>
      <p className="meta">Research datasets labelled on the same 10-tone Monk scale.</p>
      <ApiState state={state} empty={false} />
      {state.data && (
        <div className="cards">
          {state.data.data.map((d) => <DatasetCard key={d.id} d={d} compact />)}
        </div>
      )}
    </section>
  );
}

function Care() {
  return (
    <section className="panel">
      <h2>Skin Care</h2>
      <p>Everyday habits that protect skin health for every tone.</p>
      <div className="cards">
        {CARE_TIPS.map((t) => (
          <article className="card" key={t.title}>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Palette() {
  return (
    <section className="panel">
      <h2>Color Palette</h2>
      <p>Colours that tend to flatter each range. These are style suggestions, not rules.</p>
      {PALETTE_BY_GROUP.map((g) => (
        <div key={g.group} className="pal">
          <h3>{g.group}</h3>
          <div className="pal-row">
            {g.colors.map((c) => (
              <div key={c} className="pal-sw" style={{ background: c }} title={c}><span>{c}</span></div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function Guide() {
  return (
    <section className="panel">
      <h2>Skin Tone Guide</h2>
      <p>Ten tones from lightest to deepest, with UV sensitivity and care for each.</p>
      <div className="tone-list">
        {TONES.map((t) => (
          <details key={t.id} className="tone">
            <summary>
              <i style={{ background: t.hex }} />
              <strong>{t.name}</strong>
              <span>{t.label}</span>
            </summary>
            <p>{t.uv}</p>
            <p><b>Sunscreen:</b> {t.spf}</p>
            <ul>{t.tips.map((x) => <li key={x}>{x}</li>)}</ul>
          </details>
        ))}
      </div>
      <aside className="callout">
        <h3>{SPECIAL.title}</h3>
        <p>{SPECIAL.text}</p>
      </aside>
    </section>
  );
}

function Recent({ recent, clear }) {
  return (
    <section className="panel">
      <h2>Recent Analyses</h2>
      {recent.length === 0 ? (
        <p>No analyses yet. Try the Skin Detector.</p>
      ) : (
        <>
          <ul className="recent">
            {recent.map((r) => (
              <li key={r.time}>
                <i style={{ background: toHex(r.rgb) }} />
                <strong>Tone {r.tone}</strong>
                <span>{toHex(r.rgb).toUpperCase()}</span>
                <time>{new Date(r.time).toLocaleString()}</time>
              </li>
            ))}
          </ul>
          <button className="btn" onClick={clear}>Clear history</button>
        </>
      )}
    </section>
  );
}

function Privacy({ clear }) {
  return (
    <section className="panel">
      <h2>Privacy &amp; Settings</h2>
      <p>Photos never leave your browser. We save only the sampled colour, tone and time in this browser's storage.</p>
      <button className="btn" onClick={clear}>Delete saved results</button>
    </section>
  );
}

function Dashboard({ recent, go }) {
  const last = recent[0];
  const tone = last && TONES.find((t) => t.id === last.tone);
  return (
    <section className="panel">
      <h2>Dashboard</h2>
      {last ? (
        <div className="result">
          <div className="swatches">
            <div className="sw" style={{ background: toHex(last.rgb) }}><span>Latest</span></div>
          </div>
          <dl>
            <dt>Tone</dt><dd>{tone.name}: {tone.label}</dd>
            <dt>Sunscreen</dt><dd>{tone.spf}</dd>
            <dt>Analyses saved</dt><dd>{recent.length}</dd>
          </dl>
        </div>
      ) : (
        <p>No data yet.</p>
      )}
      <button className="btn primary" onClick={() => go("detector")}>New analysis</button>
    </section>
  );
}

/* ---------- FAQ and footer (end of every page) ---------- */
function Faq() {
  return (
    <section className="faq" aria-labelledby="faq-h">
      <h2 id="faq-h">Frequently asked questions</h2>
      {FAQ.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
  );
}

function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="foot-brand">
        <img src="/logo.webp" alt="" />
        <p>
          <strong>Damilola Skin Color Detector</strong>
          <br />
          Skin health information, not medical advice. For concerns about moles, sores or rashes,
          see a doctor or dermatologist.
        </p>
      </div>
      <nav aria-label="Footer">
        {[...NAV.slice(2), NAV_PREFS[2]].map((n) => (
          <button key={n.id} onClick={() => go(n.id)}>{n.label}</button>
        ))}
      </nav>
      <small>&copy; {new Date().getFullYear()} Damilola SkinColorDetector. Photos stay on your device.</small>
    </footer>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [page, setPage] = useState("home");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState(loadRecent);
  const main = useRef(null);

  const go = (id) => {
    setPage(id);
    main.current?.scrollTo({ top: 0 });
  };
  const save = (r) =>
    setRecent((prev) => {
      const next = [r, ...prev].slice(0, 20);
      saveRecent(next);
      return next;
    });
  const clear = () => {
    setRecent([]);
    saveRecent([]);
  };

  const view = {
    home: <Home go={go} />,
    dashboard: <Dashboard recent={recent} go={go} />,
    detector: <Detector onSave={save} />,
    care: <Care />,
    palette: <Palette />,
    guide: <Guide />,
    datasets: <Datasets />,
    recent: <Recent recent={recent} clear={clear} />,
    privacy: <Privacy clear={clear} />,
    help: <section className="panel"><h2>Help &amp; Support</h2><p>Answers to common questions are below.</p></section>,
  }[page];

  return (
    <div className="app">
      <Sidebar page={page} go={go} open={open} setOpen={setOpen} />
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main" ref={main}>
        <header className="topbar">
          <button className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
            <Icons.Menu size={22} />
          </button>
          <SearchBar go={go} />
        </header>
        <main className="content">{view}</main>
        <Faq />
        <Footer go={go} />
      </div>
    </div>
  );
}
