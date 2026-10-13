// Brand colours taken from the logo.
export const BRAND = {
  blue: "#1E90FF",
  magenta: "#F01CC4",
  orange: "#FF8A1F",
  brown: "#8B5A3C",
  dark: "#3B2218",
};

export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", blurb: "Your skin health summary and latest analysis." },
  { id: "home", label: "Home", icon: "Home", blurb: "Welcome, what the app does and how to start." },
  { id: "detector", label: "Skin Detector", icon: "ScanFace", blurb: "Upload a photo to estimate skin tone and get sun-safety guidance." },
  { id: "care", label: "Skin Care", icon: "HeartPulse", blurb: "Daily skin health habits: sunscreen, moisture, checking your skin." },
  { id: "palette", label: "Color Palette", icon: "Palette", blurb: "Colours that suit your tone." },
  { id: "guide", label: "Skin Tone Guide", icon: "BookOpen", blurb: "The 10 tones, with UV sensitivity and care for each." },
  { id: "datasets", label: "Datasets", icon: "Database", blurb: "Open research datasets for skin tone, filtered by type, access and scale." },
];

export const NAV_PREFS = [
  { id: "recent", label: "Recent Analyses", icon: "History", blurb: "Past results saved on this device." },
  { id: "privacy", label: "Privacy & Settings", icon: "ShieldCheck", blurb: "Photos stay on your device; clear saved results." },
  { id: "help", label: "Help & Support", icon: "CircleHelp", blurb: "FAQ, tips for a good photo, and when to see a doctor." },
];

// Ten tones, light to deep (hex values follow the open Monk Skin Tone scale).
export const TONES = [
  { id: 1, name: "Tone 1", hex: "#F6EDE4", label: "Very fair",
    uv: "Burns very easily, rarely tans. Highest sun sensitivity.", spf: "SPF 50+, reapply every 2 hours",
    tips: ["Seek shade between 10am and 4pm.", "Wear a wide-brim hat and UV-rated sunglasses.", "Book a full-skin check with a dermatologist yearly."] },
  { id: 2, name: "Tone 2", hex: "#F3E7DB", label: "Fair",
    uv: "Burns easily, tans slowly. High sun sensitivity.", spf: "SPF 50+, reapply every 2 hours",
    tips: ["Apply sunscreen 15 minutes before going out.", "Cover ears, neck and the backs of hands.", "Look for new or changing moles monthly."] },
  { id: 3, name: "Tone 3", hex: "#F7EAD0", label: "Light",
    uv: "Burns fairly easily, tans gradually.", spf: "SPF 30 to 50",
    tips: ["Use sunscreen daily, even when cloudy.", "Moisturise after bathing to protect the skin barrier.", "Re-apply after swimming or sweating."] },
  { id: 4, name: "Tone 4", hex: "#EADABA", label: "Light-medium",
    uv: "Sometimes burns, tans easily.", spf: "SPF 30 to 50",
    tips: ["Do not skip sunscreen after a tan starts.", "Treat sunburn promptly with cool compresses and aloe.", "Stay hydrated through the day."] },
  { id: 5, name: "Tone 5", hex: "#D7BD96", label: "Medium",
    uv: "Burns occasionally, tans well. Still at risk from UV damage.", spf: "SPF 30",
    tips: ["Sunscreen still matters: UV causes dark spots and ageing.", "Use a gentle cleanser; avoid harsh scrubbing.", "Watch for uneven pigment that persists."] },
  { id: 6, name: "Tone 6", hex: "#A07E56", label: "Medium-tan",
    uv: "Rarely burns, tans deeply. Prone to dark marks after irritation.", spf: "SPF 30",
    tips: ["Treat acne and cuts early to limit dark marks.", "Choose mineral or 'no white cast' sunscreens.", "Moisturise daily to avoid dullness and ashiness."] },
  { id: 7, name: "Tone 7", hex: "#825C43", label: "Tan",
    uv: "Rarely burns. Can still get skin cancer, often found late.", spf: "SPF 30",
    tips: ["Check palms, soles, nails and mouth as well as sun-exposed skin.", "Hyperpigmentation is common: be patient and consistent.", "Use broad-spectrum sunscreen on the face every day."] },
  { id: 8, name: "Tone 8", hex: "#604134", label: "Brown",
    uv: "Very rarely burns, but UV still harms the skin and eyes.", spf: "SPF 30",
    tips: ["Moisturise with an oil-based or butter-based product after washing.", "Avoid skin-lightening products with unknown ingredients.", "Report any non-healing sore or dark streak under a nail."] },
  { id: 9, name: "Tone 9", hex: "#3A312A", label: "Deep brown",
    uv: "Natural protection is higher, not complete.", spf: "SPF 30",
    tips: ["Keep skin moisturised: dryness shows as grey or ashy patches.", "Use sunscreen on exposed skin during long outdoor hours.", "See a doctor for patches that itch, bleed or change shape."] },
  { id: 10, name: "Tone 10", hex: "#292420", label: "Very deep",
    uv: "Highest natural UV protection, but not immune to sun damage.", spf: "SPF 30",
    tips: ["Hydrate and moisturise daily.", "Do regular self-checks, including hidden areas.", "Avoid harsh bleaching or unregulated creams."] },
];

export const SPECIAL = {
  title: "Albinism and very low pigment skin",
  text:
    "People with albinism have little or no melanin, so their skin and eyes are very sensitive to sun. " +
    "This needs daily broad-spectrum SPF 50+, covering clothing, a hat and UV-blocking glasses, plus regular " +
    "check-ups with a dermatologist and an eye specialist. A photo-based tone estimate cannot diagnose any condition.",
};

export const CARE_TIPS = [
  { title: "Sunscreen every day", text: "Broad-spectrum SPF 30 or higher on face, neck, ears and hands, even on cloudy days. Reapply every 2 hours outdoors." },
  { title: "Moisturise", text: "Apply moisturiser within 3 minutes of bathing to lock in water and protect the skin barrier." },
  { title: "Gentle cleansing", text: "Use a mild, fragrance-free cleanser once or twice a day. Avoid very hot water and harsh scrubs." },
  { title: "Drink water and eat well", text: "Fruit, vegetables and enough water support healthy skin. Sleep also helps skin repair." },
  { title: "Check your skin monthly", text: "Look at your whole body, including scalp, nails, palms and soles. Note anything new, changing, bleeding or not healing." },
  { title: "Avoid unregulated creams", text: "Some skin-lightening creams contain mercury or strong steroids. Use only products approved for your region." },
  { title: "Protect your eyes", text: "UV-rated sunglasses reduce sun damage to eyes and the skin around them." },
  { title: "Know when to get help", text: "See a doctor for moles that change, sores that do not heal in 4 weeks, persistent rashes, or severe sunburn with blistering." },
];

export const PALETTE_BY_GROUP = [
  { group: "Tones 1 to 3 (light)", range: [1, 3], colors: ["#1E90FF", "#7A4FD1", "#C2185B", "#2E7D32", "#455A64", "#FF8A1F"] },
  { group: "Tones 4 to 6 (medium)", range: [4, 6], colors: ["#0D47A1", "#F01CC4", "#E65100", "#00796B", "#6A1B9A", "#F9A825"] },
  { group: "Tones 7 to 10 (deep)", range: [7, 10], colors: ["#FFD54F", "#FF7043", "#F01CC4", "#1E90FF", "#26C6DA", "#FAFAFA"] },
];

export const FAQ = [
  { q: "Is this a medical diagnosis?", a: "No. This app estimates skin tone from a photo and shares general skin-health information. It cannot diagnose skin conditions or skin cancer. See a doctor for medical concerns." },
  { q: "Why does skin tone matter for health?", a: "Skin tone affects how quickly skin burns, how UV damage shows up, and how skin conditions look. Sun protection matters for every tone, but fairer skin is more sensitive." },
  { q: "Do darker skin tones need sunscreen?", a: "Yes. Darker skin has more natural protection, but UV still causes dark spots, ageing and skin cancer. Skin cancers in deeper skin tones are often found later." },
  { q: "How do I get an accurate result?", a: "Use natural daylight, no filters, no heavy makeup, and face the light. Click on a clear patch of skin such as the cheek or forehead to re-sample." },
  { q: "Are my photos uploaded or stored?", a: "No. Photos are processed in your browser and never leave your device. Only the result colour, tone and time are saved locally, and you can clear them in Privacy & Settings." },
  { q: "What should I do about albinism or very pale skin?", a: "Use SPF 50+ daily, cover up outdoors and see a dermatologist and an eye specialist regularly. This app does not detect albinism." },
  { q: "When should I see a doctor?", a: "See one if a mole changes in size, shape or colour, a sore does not heal in 4 weeks, you have severe sunburn, or a rash keeps coming back." },
  { q: "Why is my result different in different photos?", a: "Lighting, camera, filters and shadows change the colours a camera records. Take several photos in daylight and compare." },
];

export const GALLERY = [
  "p5.webp", "p6.webp", "p7.png", "p8.webp", "p9.webp",
  "p10.webp", "p11.webp", "p12.png", "p13.webp", "p14.webp",
].map((f) => `/people/${f}`);

// Everything searchable, with the page it belongs to.
export function buildIndex() {
  const items = [];
  for (const n of [...NAV, ...NAV_PREFS]) {
    items.push({ kind: "Page", title: n.label, text: n.blurb, page: n.id });
  }
  for (const t of TONES) {
    items.push({ kind: "Tone", title: `${t.name}: ${t.label}`, text: `${t.uv} ${t.spf}`, page: "guide" });
  }
  for (const c of CARE_TIPS) {
    items.push({ kind: "Care", title: c.title, text: c.text, page: "care" });
  }
  items.push({ kind: "Care", title: SPECIAL.title, text: SPECIAL.text, page: "guide" });
  for (const f of FAQ) {
    items.push({ kind: "FAQ", title: f.q, text: f.a, page: "help" });
  }
  return items;
}

export function search(index, query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return index
    .map((it) => {
      const title = it.title.toLowerCase();
      const body = it.text.toLowerCase();
      let score = 0;
      for (const w of words) {
        if (title.includes(w)) score += 3;
        else if (body.includes(w)) score += 1;
        else return null;
      }
      return { ...it, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}
