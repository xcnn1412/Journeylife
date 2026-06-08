/**
 * Country atlas for the "ค้นหาด้วยเจอร์นี่ AI" destination finder.
 *
 * Extends the 73 real destinations (from tour-destinations.ts) with the metadata
 * the quiz needs: map coordinates, region, flight/price band, and scenery/activity
 * tags. The "AI" is a deterministic rule-based scorer (no API): every answer ADDS
 * points to matching countries instead of hard-filtering, so we always land on a
 * Top-3 and never hit a dead-end. The map dims low-score dots progressively to
 * give the "narrowing down" feel.
 *
 * English names are reused from COUNTRIES (single source) — don't duplicate them.
 */

import { COUNTRIES, flagFor, flagImg } from "./tour-destinations";

export type Region =
  | "eastAsia"
  | "seAsia"
  | "southAsia"
  | "centralAsia"
  | "mideast"
  | "europe"
  | "africa"
  | "oceania";

export type Scenery = "snow" | "beach" | "city" | "nature" | "heritage";
export type Activity = "shopping" | "landmark" | "adventure" | "relax" | "faith";
export type Band = 1 | 2 | 3;

export interface AtlasCountry {
  th: string;
  en: string;
  lat: number;
  lng: number;
  region: Region;
  flightBand: Band; // 1 = near (<6h) · 2 = mid (6–9h) · 3 = far (10h+) from BKK
  priceBand: Band; // 1 = budget (<30k) · 2 = mid (30–60k) · 3 = premium (60k+)
  scenery: Scenery[];
  activity: Activity[];
  popularity: number; // 0–100 — soft tie-break so popular/in-stock destinations surface
  flag: string; // emoji
  flagSrc: string; // flagcdn image URL
}

/* Compact source rows — expanded into AtlasCountry below.
   [th, lat, lng, region, flightBand, priceBand, scenery[], activity[], popularity] */
type Raw = [string, number, number, Region, Band, Band, Scenery[], Activity[], number];

const RAW: Raw[] = [
  // ── East Asia ──
  ["ญี่ปุ่น", 36.5, 138.0, "eastAsia", 2, 2, ["snow", "city", "nature", "heritage"], ["shopping", "landmark", "relax"], 100],
  ["เกาหลี", 37.5, 127.0, "eastAsia", 2, 2, ["snow", "city", "nature"], ["shopping", "landmark", "relax"], 92],
  ["จีน", 39.9, 116.4, "eastAsia", 1, 1, ["snow", "city", "nature", "heritage"], ["landmark", "shopping", "faith"], 80],
  ["ไต้หวัน", 23.7, 121.0, "eastAsia", 1, 1, ["city", "nature"], ["shopping", "landmark", "relax"], 78],
  ["ฮ่องกง", 22.3, 114.2, "eastAsia", 1, 1, ["city"], ["shopping", "landmark"], 72],
  ["มาเก๊า", 22.2, 113.5, "eastAsia", 1, 1, ["city", "heritage"], ["shopping", "landmark"], 48],
  ["มองโกเลีย", 47.9, 106.9, "eastAsia", 2, 2, ["nature", "snow"], ["adventure"], 30],
  // ── Southeast Asia ──
  ["เวียดนาม", 16.0, 107.5, "seAsia", 1, 1, ["beach", "nature", "city", "heritage"], ["relax", "landmark", "shopping"], 88],
  ["สิงคโปร์", 1.35, 103.8, "seAsia", 1, 1, ["city"], ["shopping", "landmark", "relax"], 68],
  ["มาเลเซีย", 3.1, 101.7, "seAsia", 1, 1, ["city", "beach", "nature"], ["shopping", "relax"], 60],
  ["บรูไน", 4.9, 114.9, "seAsia", 1, 2, ["city", "heritage"], ["faith", "landmark"], 22],
  ["ฟิลิปปินส์", 13.0, 122.0, "seAsia", 1, 1, ["beach", "nature"], ["relax", "adventure"], 40],
  ["อินโดนีเซีย", -8.4, 115.2, "seAsia", 1, 1, ["beach", "nature", "heritage"], ["relax", "adventure", "faith"], 50],
  ["ลาว", 19.9, 102.1, "seAsia", 1, 1, ["nature", "heritage"], ["faith", "relax"], 38],
  ["พม่า", 21.9, 96.1, "seAsia", 1, 1, ["heritage", "nature"], ["faith", "landmark"], 35],
  // ── South Asia ──
  ["อินเดีย", 27.5, 78.0, "southAsia", 1, 1, ["heritage", "city", "nature"], ["landmark", "faith", "adventure"], 66],
  ["เนปาล", 27.9, 85.0, "southAsia", 1, 1, ["snow", "nature", "heritage"], ["adventure", "faith"], 48],
  ["ภูฏาน", 27.5, 90.4, "southAsia", 1, 2, ["snow", "nature", "heritage"], ["faith", "adventure"], 44],
  ["ศรีลังกา", 7.3, 80.6, "southAsia", 1, 1, ["beach", "nature", "heritage"], ["relax", "faith"], 42],
  ["ปากีสถาน", 35.9, 74.3, "southAsia", 2, 2, ["snow", "nature"], ["adventure"], 26],
  ["มัลดีฟส์", 3.2, 73.2, "southAsia", 2, 3, ["beach"], ["relax"], 62],
  ["อัฟกานิสถาน", 34.5, 69.2, "southAsia", 2, 2, ["nature", "heritage"], ["adventure"], 12],
  // ── Central Asia ──
  ["คาซัคสถาน", 48.0, 67.0, "centralAsia", 2, 2, ["snow", "nature", "city"], ["adventure"], 24],
  ["อุซเบกิสถาน", 40.0, 64.5, "centralAsia", 2, 2, ["heritage", "city"], ["landmark", "faith"], 36],
  ["ทาจิกิสถาน", 38.6, 71.0, "centralAsia", 2, 2, ["snow", "nature"], ["adventure"], 14],
  ["เติร์กเมนิสถาน", 38.5, 59.0, "centralAsia", 2, 2, ["nature", "heritage"], ["landmark"], 12],
  // ── Middle East / Caucasus ──
  ["ดูไบ", 24.8, 54.5, "mideast", 2, 2, ["city", "beach"], ["shopping", "landmark", "relax"], 74],
  ["ซาอุดิอาระเบีย", 23.9, 45.1, "mideast", 2, 2, ["heritage", "city"], ["faith", "landmark"], 30],
  ["จอร์แดน", 31.0, 36.5, "mideast", 2, 2, ["heritage", "nature"], ["landmark", "adventure"], 40],
  ["บาห์เรน", 26.1, 50.5, "mideast", 2, 2, ["city"], ["shopping", "landmark"], 20],
  ["อิหร่าน", 33.0, 53.0, "mideast", 2, 2, ["heritage", "nature"], ["landmark", "faith"], 28],
  ["อาเซอร์ไบจาน", 40.4, 49.9, "mideast", 2, 2, ["city", "nature", "heritage"], ["landmark"], 46],
  ["อาร์เมเนีย", 40.2, 44.9, "mideast", 2, 2, ["nature", "heritage"], ["faith", "landmark"], 38],
  ["จอร์เจีย", 42.0, 43.5, "mideast", 2, 2, ["snow", "nature", "heritage"], ["adventure", "landmark"], 64],
  ["ตุรกี", 39.0, 35.0, "mideast", 2, 2, ["heritage", "city", "nature"], ["landmark", "adventure", "shopping"], 75],
  // ── Europe ──
  ["กรีซ", 38.5, 23.0, "europe", 3, 3, ["beach", "heritage"], ["relax", "landmark"], 56],
  ["กรีนแลนด์", 64.2, -51.7, "europe", 3, 3, ["snow", "nature"], ["adventure"], 16],
  ["เช็ก", 49.9, 15.0, "europe", 3, 2, ["city", "heritage"], ["landmark", "shopping"], 58],
  ["เดนมาร์ก", 55.7, 12.6, "europe", 3, 3, ["city", "heritage"], ["landmark"], 34],
  ["เนเธอร์แลนด์", 52.2, 5.3, "europe", 3, 3, ["city", "nature", "heritage"], ["landmark", "shopping"], 54],
  ["เบลเยี่ยม", 50.6, 4.6, "europe", 3, 3, ["city", "heritage"], ["landmark", "shopping"], 40],
  ["โปรตุเกส", 39.7, -8.4, "europe", 3, 3, ["beach", "heritage", "city"], ["relax", "landmark"], 44],
  ["โปแลนด์", 52.0, 19.5, "europe", 3, 2, ["city", "heritage"], ["landmark"], 36],
  ["ฝรั่งเศส", 47.0, 2.5, "europe", 3, 3, ["city", "heritage", "nature"], ["shopping", "landmark", "relax"], 68],
  ["ฟินแลนด์", 62.0, 26.0, "europe", 3, 3, ["snow", "nature"], ["adventure"], 50],
  ["เยอรมัน", 51.0, 10.4, "europe", 3, 3, ["city", "heritage", "nature"], ["landmark", "shopping"], 58],
  ["รัสเซีย", 56.0, 38.0, "europe", 2, 2, ["snow", "city", "heritage"], ["landmark", "faith"], 52],
  ["โรมาเนีย", 45.9, 25.0, "europe", 3, 2, ["nature", "heritage"], ["landmark", "adventure"], 30],
  ["ลัตเวีย", 56.9, 24.6, "europe", 3, 2, ["city", "heritage", "nature"], ["landmark"], 22],
  ["สก๊อตแลนด์", 56.5, -4.2, "europe", 3, 3, ["nature", "heritage"], ["adventure", "landmark"], 40],
  ["สเปน", 40.0, -3.7, "europe", 3, 3, ["beach", "heritage", "city"], ["relax", "landmark", "shopping"], 60],
  ["สโลวาเกีย", 48.7, 19.5, "europe", 3, 2, ["nature", "heritage"], ["adventure"], 20],
  ["สโลวีเนีย", 46.1, 14.8, "europe", 3, 2, ["nature", "snow", "heritage"], ["adventure", "landmark"], 26],
  ["สวิตเซอร์แลนด์", 46.8, 8.2, "europe", 3, 3, ["snow", "nature"], ["adventure", "relax", "landmark"], 70],
  ["สวีเดน", 60.0, 15.0, "europe", 3, 3, ["snow", "nature", "city"], ["landmark", "adventure"], 34],
  ["ออสเตรีย", 47.6, 14.2, "europe", 3, 3, ["snow", "nature", "city", "heritage"], ["landmark", "relax"], 50],
  ["อังกฤษ", 52.5, -1.5, "europe", 3, 3, ["city", "heritage"], ["landmark", "shopping"], 66],
  ["อิตาลี", 42.8, 12.5, "europe", 3, 3, ["heritage", "city", "beach"], ["landmark", "shopping", "relax"], 68],
  ["ไอซ์แลนด์", 64.9, -19.0, "europe", 3, 3, ["snow", "nature"], ["adventure"], 52],
  ["ฮังการี", 47.2, 19.5, "europe", 3, 2, ["city", "heritage"], ["landmark", "relax"], 44],
  ["บัลแกเรีย", 42.7, 25.3, "europe", 3, 2, ["nature", "heritage", "beach"], ["landmark"], 24],
  ["นอร์เวย์", 61.0, 9.0, "europe", 3, 3, ["snow", "nature"], ["adventure"], 50],
  ["ยูเครน", 49.0, 31.0, "europe", 3, 1, ["city", "heritage"], ["landmark"], 18],
  ["แอลเบเนีย", 41.2, 20.0, "europe", 3, 2, ["beach", "nature", "heritage"], ["relax", "adventure"], 22],
  ["มอลตา", 35.9, 14.4, "europe", 3, 3, ["beach", "heritage", "city"], ["relax", "landmark"], 30],
  ["โครเอเชีย", 45.1, 16.0, "europe", 3, 3, ["beach", "nature", "heritage"], ["relax", "landmark", "adventure"], 48],
  // ── Africa ──
  ["ตูนิเซีย", 34.5, 9.5, "africa", 3, 2, ["beach", "heritage", "nature"], ["landmark", "relax"], 24],
  ["โมร็อกโก", 31.8, -7.0, "africa", 3, 2, ["heritage", "nature", "city"], ["landmark", "adventure", "shopping"], 50],
  ["อียิปต์", 27.0, 30.8, "africa", 2, 2, ["heritage", "nature"], ["landmark", "faith", "adventure"], 60],
  ["แอฟริกาใต้", -30.0, 23.0, "africa", 3, 3, ["nature", "beach"], ["adventure", "relax"], 44],
  ["แอลจีเรีย", 28.0, 2.6, "africa", 3, 2, ["nature", "heritage"], ["adventure"], 12],
  ["มาดากัสการ์", -19.0, 46.7, "africa", 3, 3, ["nature", "beach"], ["adventure", "relax"], 18],
  // ── Oceania ──
  ["นิวซีแลนด์", -41.0, 173.0, "oceania", 3, 3, ["snow", "nature", "beach"], ["adventure", "relax"], 56],
];

const EN = new Map(COUNTRIES.map((c) => [c.th, c.en] as const));

export const ATLAS: AtlasCountry[] = RAW.map(
  ([th, lat, lng, region, flightBand, priceBand, scenery, activity, popularity]) => ({
    th,
    en: EN.get(th) ?? th,
    lat,
    lng,
    region,
    flightBand,
    priceBand,
    scenery,
    activity,
    popularity,
    flag: flagFor(th),
    flagSrc: flagImg(th),
  }),
);

/* ──────────────────────────────────────────────────────────
   QUIZ RULES — scoring logic only. The localized copy (titles/
   option labels) lives in i18n under overseasPackages.routeFinder
   and is joined to these by `id` / `value`.
   Each option awards `weight` points when ANY of its declared
   dimensions matches the country. `skip` options ("doesn't
   matter") award nothing.
   ────────────────────────────────────────────────────────── */

export interface OptionRule {
  value: string;
  weight: number;
  skip?: boolean;
  flightBand?: Band[];
  priceBand?: Band[];
  regions?: Region[];
  scenery?: Scenery[];
  activity?: Activity[];
}

export interface QuestionRule {
  id: string;
  type: "single" | "multi";
  options: OptionRule[];
}

export const QUESTION_RULES: QuestionRule[] = [
  {
    id: "distance",
    type: "single",
    options: [
      { value: "near", weight: 5, flightBand: [1] },
      { value: "mid", weight: 5, flightBand: [2] },
      { value: "far", weight: 5, flightBand: [3] },
      { value: "any", weight: 0, skip: true },
    ],
  },
  {
    id: "scenery",
    type: "multi",
    options: [
      { value: "snow", weight: 3, scenery: ["snow"] },
      { value: "beach", weight: 3, scenery: ["beach"] },
      { value: "city", weight: 3, scenery: ["city"] },
      { value: "nature", weight: 3, scenery: ["nature"] },
      { value: "heritage", weight: 3, scenery: ["heritage"] },
    ],
  },
  {
    id: "activity",
    type: "multi",
    options: [
      { value: "shopping", weight: 2, activity: ["shopping"] },
      { value: "landmark", weight: 2, activity: ["landmark"] },
      { value: "adventure", weight: 2, activity: ["adventure"] },
      { value: "relax", weight: 2, activity: ["relax"] },
      { value: "faith", weight: 2, activity: ["faith"] },
    ],
  },
  {
    id: "budget",
    type: "single",
    options: [
      { value: "budget", weight: 2, priceBand: [1] },
      { value: "mid", weight: 2, priceBand: [2] },
      { value: "premium", weight: 2, priceBand: [3] },
      { value: "any", weight: 0, skip: true },
    ],
  },
  {
    id: "season",
    type: "single",
    options: [
      { value: "sakura", weight: 3, regions: ["eastAsia"] },
      { value: "snow", weight: 3, scenery: ["snow"] },
      { value: "summer", weight: 3, scenery: ["beach"] },
      { value: "any", weight: 0, skip: true },
    ],
  },
];

export const QUESTION_IDS = QUESTION_RULES.map((q) => q.id);
export const STEP_COUNT = QUESTION_RULES.length;

/** Answers map: questionId → selected option value(s). */
export type Answers = Record<string, string[]>;

export interface Scored {
  c: AtlasCountry;
  score: number;
  normalized: number; // 0..1 relative to the current top score
  matched: { qid: string; value: string }[]; // which answers this country satisfied
}

function optionMatches(opt: OptionRule, c: AtlasCountry): boolean {
  if (opt.flightBand?.includes(c.flightBand)) return true;
  if (opt.priceBand?.includes(c.priceBand)) return true;
  if (opt.regions?.includes(c.region)) return true;
  if (opt.scenery?.some((s) => c.scenery.includes(s))) return true;
  if (opt.activity?.some((a) => c.activity.includes(a))) return true;
  return false;
}

/** Score + rank every country for the given answers (highest first). */
export function rankCountries(answers: Answers): Scored[] {
  const scored: Scored[] = ATLAS.map((c) => {
    let score = c.popularity * 0.03; // small base so popular places win ties, not answers
    const matched: { qid: string; value: string }[] = [];
    for (const q of QUESTION_RULES) {
      const sel = answers[q.id];
      if (!sel?.length) continue;
      for (const value of sel) {
        const opt = q.options.find((o) => o.value === value);
        if (!opt || opt.skip) continue;
        if (optionMatches(opt, c)) {
          score += opt.weight;
          matched.push({ qid: q.id, value });
        }
      }
    }
    return { c, score, matched, normalized: 0 };
  });

  const max = Math.max(...scored.map((s) => s.score), 1);
  for (const s of scored) s.normalized = s.score / max;
  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Normalized-score threshold below which a dot is dimmed on the map. Rises as the
 * user answers more questions so the field visibly narrows. Step 0 keeps every
 * dot lit. Callers should still force the current Top 3 to stay active.
 */
export function cutoffFor(answeredSteps: number): number {
  if (answeredSteps <= 0) return 0;
  return Math.min(0.42 + answeredSteps * 0.09, 0.82);
}

/** How many destinations still count as a "strong match" — never below 3. */
export function activeCount(scored: Scored[], answeredSteps: number): number {
  if (answeredSteps <= 0) return scored.length;
  const cutoff = cutoffFor(answeredSteps);
  return Math.max(scored.filter((s) => s.normalized >= cutoff).length, 3);
}
