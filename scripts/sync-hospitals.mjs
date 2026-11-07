#!/usr/bin/env node
/**
 * Sync the SSF affiliated-hospital list from the Fund's public endpoint into
 * src/content/hospitals.ts.
 *
 *   npm run sync:hospitals
 *
 * Source: https://ssf.gov.np/affiliated-hospitals (data: /api/getMoUHospitals).
 * The output is deterministic (sorted by province order, district, id) so the
 * git diff shows exactly which hospitals were added / removed / changed.
 */
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const API = "https://ssf.gov.np/api/getMoUHospitals?province=";
const OUT = resolve(process.cwd(), "src/content/hospitals.ts");

// Province name as published → canonical key (the source has a few typos).
const PROVINCE_KEY = {
  "कोशी प्रदेश": "koshi",
  "मधेश प्रदेश": "madhesh",
  "बागमती प्रदेश": "bagmati",
  "गण्डकी प्रदेश": "gandaki",
  "लुम्बिनी प्रदेश": "lumbini",
  "कर्णाली प्रदेश": "karnali",
  "कणालि प्रदेश": "karnali",
  "सुदुर पश्चिम प्रदेश": "sudurpashchim",
  "सुदुर पश्चिम् प्रदेश": "sudurpashchim",
  "सुदूरपश्चिम प्रदेश": "sudurpashchim",
};
const PROVINCE_ORDER = ["koshi", "madhesh", "bagmati", "gandaki", "lumbini", "karnali", "sudurpashchim"];

// Data corrections where the source record is visibly wrong (kept here so a
// re-sync does not silently re-introduce them). Verified against the hospital's
// coordinates / public address on 2026-11-07.
const ADDRESS_OVERRIDES = {
  128: "इटहरी", // "वेदान्त हस्पिटल" is in Itahari (coords 26.66, 87.28) — source says Pokhara
};
const DROP_COORDS = new Set([
  99, // ओम साई पाथिभरा (झापा) — source coords point to Kathmandu
  39, // मकवानपुर सहकारी (हेटौडा) — source coords point to Biratnagar
]);

function specialtyOf(name) {
  const n = name;
  if (/आँखा|आखा|आइ हस्पिटल|आइ फाउन्डेसन|आई केयर|नेत्र|दृष्टि|Eye/i.test(n)) return "eye";
  if (/मुटु|कार्डियो/i.test(n)) return "heart";
  if (/क्यान्सर/i.test(n)) return "cancer";
  if (/बाल |बाल अस्पताल|चाइल्ड|शिशु|महिला तथा बाल/i.test(n)) return "children";
  if (/डेन्टल/i.test(n)) return "dental";
  if (/अर्थोपेडिक/i.test(n)) return "ortho";
  if (/ट्रमा/i.test(n)) return "trauma";
  if (/न्यूरो/i.test(n)) return "neuro";
  if (/मेडिकल कलेज|टिचिङ|टिचिङ्ग|शिक्षण|प्रतिष्ठान|मेडिकल साइन्स/i.test(n)) return "teaching";
  return "general";
}

function clean(s) {
  return (s ?? "")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// `--input path.json` uses a file fetched separately (e.g. with curl behind a
// proxy); otherwise the script fetches the endpoint directly.
const inputIdx = process.argv.indexOf("--input");
let raw;
if (inputIdx !== -1) {
  const { readFile } = await import("node:fs/promises");
  raw = JSON.parse(await readFile(resolve(process.argv[inputIdx + 1]), "utf8"));
} else {
  const res = await fetch(API, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`SSF API returned ${res.status}`);
  raw = await res.json();
}
if (!Array.isArray(raw) || raw.length === 0) throw new Error("SSF API returned no hospitals");

const rows = raw.map((h) => {
  const province = PROVINCE_KEY[clean(h.province)];
  if (!province) throw new Error(`Unknown province "${h.province}" for hospital ${h.id}`);
  const lat = Number.parseFloat(clean(h.latitude));
  const lng = Number.parseFloat(clean(h.longitude));
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng) && !DROP_COORDS.has(h.id);
  return {
    id: h.id,
    name: clean(h.name),
    province,
    district: clean(h.district),
    address: ADDRESS_OVERRIDES[h.id] ?? clean(h.address),
    lat: hasCoords ? Number(lat.toFixed(5)) : undefined,
    lng: hasCoords ? Number(lng.toFixed(5)) : undefined,
    specialty: specialtyOf(clean(h.name)),
  };
});

rows.sort(
  (a, b) =>
    PROVINCE_ORDER.indexOf(a.province) - PROVINCE_ORDER.indexOf(b.province) ||
    a.district.localeCompare(b.district, "ne") ||
    a.id - b.id,
);

const today = new Date().toISOString().slice(0, 10);
const lines = rows.map((r) => {
  const parts = [
    `id: ${r.id}`,
    `name: ${JSON.stringify(r.name)}`,
    `province: "${r.province}"`,
    `district: ${JSON.stringify(r.district)}`,
    `address: ${JSON.stringify(r.address)}`,
  ];
  if (r.lat !== undefined) parts.push(`lat: ${r.lat}`, `lng: ${r.lng}`);
  parts.push(`specialty: "${r.specialty}"`);
  return `  { ${parts.join(", ")} },`;
});

const file = `/**
 * SSF affiliated (MoU) hospitals — GENERATED FILE, do not edit by hand.
 * Regenerate with \`npm run sync:hospitals\`.
 *
 * Source: https://ssf.gov.np/affiliated-hospitals
 * Synced: ${today} · ${rows.length} hospitals
 */

export type ProvinceKey =
  | "koshi"
  | "madhesh"
  | "bagmati"
  | "gandaki"
  | "lumbini"
  | "karnali"
  | "sudurpashchim";

export type HospitalSpecialty =
  | "general"
  | "teaching"
  | "eye"
  | "heart"
  | "cancer"
  | "children"
  | "dental"
  | "ortho"
  | "trauma"
  | "neuro";

export interface Hospital {
  /** Fund's own record id */
  id: number;
  /** Official name as listed by the Fund (Nepali) */
  name: string;
  province: ProvinceKey;
  district: string;
  address: string;
  lat?: number;
  lng?: number;
  /** Inferred from the name — used only for filtering */
  specialty: HospitalSpecialty;
}

export const HOSPITALS_SYNCED_AT = "${today}";
export const HOSPITALS_SOURCE_URL = "https://ssf.gov.np/affiliated-hospitals";
export const HOSPITAL_RATE_LIST_URL =
  "https://ssf.gov.np/images/page_content/16505202087003_Service%20price%20rate%20new.pdf";

export const PROVINCE_ORDER: ProvinceKey[] = ${JSON.stringify(PROVINCE_ORDER)};

export const PROVINCES: Record<ProvinceKey, { ne: string; en: string; short: string }> = {
  koshi: { ne: "कोशी प्रदेश", en: "Koshi", short: "कोशी" },
  madhesh: { ne: "मधेश प्रदेश", en: "Madhesh", short: "मधेश" },
  bagmati: { ne: "बागमती प्रदेश", en: "Bagmati", short: "बागमती" },
  gandaki: { ne: "गण्डकी प्रदेश", en: "Gandaki", short: "गण्डकी" },
  lumbini: { ne: "लुम्बिनी प्रदेश", en: "Lumbini", short: "लुम्बिनी" },
  karnali: { ne: "कर्णाली प्रदेश", en: "Karnali", short: "कर्णाली" },
  sudurpashchim: { ne: "सुदूरपश्चिम प्रदेश", en: "Sudurpashchim", short: "सुदूरपश्चिम" },
};

export const SPECIALTIES: Record<HospitalSpecialty, { ne: string; en: string }> = {
  general: { ne: "सामान्य / बहुविशेषज्ञ", en: "General / multi-specialty" },
  teaching: { ne: "मेडिकल कलेज / शिक्षण", en: "Medical college / teaching" },
  eye: { ne: "आँखा", en: "Eye" },
  heart: { ne: "मुटु", en: "Heart" },
  cancer: { ne: "क्यान्सर", en: "Cancer" },
  children: { ne: "बाल / महिला", en: "Children / women" },
  dental: { ne: "दन्त", en: "Dental" },
  ortho: { ne: "हाडजोर्नी", en: "Orthopaedic" },
  trauma: { ne: "ट्रमा", en: "Trauma" },
  neuro: { ne: "न्यूरो", en: "Neuro" },
};

export const hospitals: Hospital[] = [
${lines.join("\n")}
];

export function hospitalsByProvince(p: ProvinceKey): Hospital[] {
  return hospitals.filter((h) => h.province === p);
}

export function provinceCounts(): Record<ProvinceKey, number> {
  const out = Object.fromEntries(PROVINCE_ORDER.map((p) => [p, 0])) as Record<ProvinceKey, number>;
  for (const h of hospitals) out[h.province]++;
  return out;
}

export function districtsOf(p?: ProvinceKey): string[] {
  const set = new Set<string>();
  for (const h of hospitals) if (!p || h.province === p) set.add(h.district);
  return [...set].sort((a, b) => a.localeCompare(b, "ne"));
}
`;

await writeFile(OUT, file, "utf8");
console.log(`✔ wrote ${rows.length} hospitals → ${OUT}`);
