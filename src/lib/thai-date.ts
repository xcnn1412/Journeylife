/**
 * Thai (Buddhist-era) date helpers shared by the search where-builder and the
 * tour sync (which derives `departures` from period date strings).
 *
 * Buddhist year = Gregorian + 543. The site's search form submits dates as
 * `DD-MM-BBBB` (see toBuddhist in TourSearch.tsx); booking pages print period
 * dates as Thai-abbreviated `"14 มิ.ย. 69"`.
 */

const pad = (n: number) => String(n).padStart(2, "0");

/** Normalise a 2- or 4-digit Buddhist year to a Gregorian year. */
function beToGregorian(year: number): number {
  // "69" → BE 2569; "2569" → BE 2569. Then subtract 543.
  const be = year < 100 ? 2500 + year : year;
  return be - 543;
}

/**
 * Convert a search-form date to ISO `YYYY-MM-DD`.
 * Accepts Buddhist `DD-MM-BBBB` (what TourSearch submits) AND plain ISO
 * `YYYY-MM-DD` (the no-JS GET fallback). Returns "" if unparseable.
 */
export function buddhistToISO(s: string): string {
  const v = (s ?? "").trim();
  if (!v) return "";
  // Already ISO?
  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return v;
  // DD-MM-BBBB
  const m = v.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
  if (!m) return "";
  const d = Number(m[1]);
  const mo = Number(m[2]);
  const y = beToGregorian(Number(m[3]));
  if (!d || !mo || !y) return "";
  return `${y}-${pad(mo)}-${pad(d)}`;
}

// Thai month abbreviations → month number.
const THAI_MONTHS: Record<string, number> = {
  "ม.ค.": 1, "ก.พ.": 2, "มี.ค.": 3, "เม.ย.": 4, "พ.ค.": 5, "มิ.ย.": 6,
  "ก.ค.": 7, "ส.ค.": 8, "ก.ย.": 9, "ต.ค.": 10, "พ.ย.": 11, "ธ.ค.": 12,
};

/**
 * Convert a Thai period date string (e.g. `"14 มิ.ย. 69"`, or a range
 * `"14 - 20 มิ.ย. 69"`) to the ISO `YYYY-MM-DD` of its START date.
 * Returns "" if no Thai month / day can be found.
 */
export function thaiPeriodToISO(s: string): string {
  const v = (s ?? "").trim();
  if (!v) return "";
  const day = v.match(/(\d{1,2})/)?.[1];
  const monKey = Object.keys(THAI_MONTHS).find((k) => v.includes(k));
  const year = v.match(/(\d{2,4})\s*$/)?.[1];
  if (!day || !monKey || !year) return "";
  const g = beToGregorian(Number(year));
  return `${g}-${pad(THAI_MONTHS[monKey])}-${pad(Number(day))}`;
}
