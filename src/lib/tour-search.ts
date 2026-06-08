/**
 * On-site tour search.
 *
 * We forward the user's query to tour.journeylife.co.th/search.php from the
 * server (no CORS), then parse the server-rendered `.tour-card` results so they
 * can be shown inside our own site instead of redirecting the visitor away.
 *
 * Each result card carries: tour_id · banner · title · code · duration ·
 * airline · "เริ่ม" starting price.
 */

import { flagFor } from "./tour-destinations";

const SEARCH_URL = "https://tour.journeylife.co.th/search.php";
const TOUR_BASE = "https://tour.journeylife.co.th";

/** Query keys that search.php understands (mirrors the booking site's form). */
export const SEARCH_KEYS = [
  "keyword", "keywords", "priceRange", "day", "tourid", "cstartdate", "cenddate", "sort",
] as const;

export interface TourResult {
  id: string;
  href: string; // tour detail page (on the booking site)
  img: string;
  title: string;
  code: string;
  days: string; // "6 วัน 4 คืน"
  airline: string; // "AirAsia X (XJ)"
  price: number; // starting price
  country: string; // from the title
  flag: string;
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

const num = (s: string | undefined) => (s ? Number(s.replace(/[^\d]/g, "")) : 0);

function countryFromTitle(title: string): string {
  const m = title.match(/^\s*ทัวร์\s*([^\s,.\-/(]+)/);
  return m ? m[1] : "อื่น ๆ";
}

export interface SearchResponse {
  results: TourResult[];
  fullUrl: string; // the same query on the booking site (for "see all")
}

/** Build the booking-site URL from a clean param map. */
export function buildSearchUrl(params: Record<string, string>): string {
  const sp = new URLSearchParams();
  for (const k of SEARCH_KEYS) {
    const v = (params[k] ?? "").trim();
    if (v) sp.set(k, v);
  }
  if (!sp.has("sort")) sp.set("sort", "new");
  return `${SEARCH_URL}?${sp.toString()}`;
}

/** Run a search and parse the first page of results. Returns [] on any failure. */
export async function searchTours(params: Record<string, string>): Promise<SearchResponse> {
  const fullUrl = buildSearchUrl(params);
  try {
    const res = await fetch(fullUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JourneyLifeBot/1.0)" },
      cache: "no-store",
    });
    if (!res.ok) return { results: [], fullUrl };
    const html = await res.text();

    const cards = html.split(/class="[^"]*tour-card/i).slice(1);
    const seen = new Set<string>();
    const results: TourResult[] = [];

    for (const b of cards) {
      const id = b.match(/tour_id=(\d+)/)?.[1];
      // `data-src` points at /banner/<agencyId>/CODE-600.jpg which 404s; the real
      // file (and the data-srcset entries) live at /banner/CODE-600.jpg — so strip
      // the numeric agency subfolder.
      const rawImg =
        b.match(/data-srcset="\s*(https:\/\/files\.okwebtour\.com\/storage\/banner\/[^ "]+)/i)?.[1] ??
        b.match(/data-src="(https:\/\/files\.okwebtour\.com\/storage\/banner\/[^"]+)"/i)?.[1];
      const img = rawImg?.replace(/(\/storage\/banner\/)\d+\//, "$1");
      if (!id || !img || seen.has(id)) continue;
      seen.add(id);

      const title = decode(b.match(/hovertxt"[^>]*>([^<]+)<\/a>/i)?.[1] ?? "");
      const code = decode(b.match(/text-green">\s*([\w-]+)/i)?.[1] ?? "");
      const days = decode(b.match(/จำนวนวัน<\/div>\s*<div[^>]*>\s*([^<]+?)\s*<\/div>/i)?.[1] ?? "");
      const airline = decode(b.match(/เดินทางโดย([^"]+)"/i)?.[1] ?? "");
      const price = num(b.match(/txtgridprice[^>]*>\s*([\d,]+)/i)?.[1]);
      const country = countryFromTitle(title);

      results.push({
        id,
        href: `${TOUR_BASE}/tour.php?tour_id=${id}`,
        img,
        title,
        code,
        days,
        airline,
        price,
        country,
        flag: flagFor(country),
      });
    }
    return { results, fullUrl };
  } catch {
    return { results: [], fullUrl };
  }
}
