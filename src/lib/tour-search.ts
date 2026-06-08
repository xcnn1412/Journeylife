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
  totalPages: number; // pages search.php advertises for this query
  pagesFetched: number; // how many we actually pulled + merged
}

/** Default number of result pages to pull + merge (12 cards each). */
export const DEFAULT_MAX_PAGES = 6;

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

/** Highest `page=N` advertised by the pagination block (1 if none). */
function lastPageOf(html: string): number {
  let max = 1;
  for (const m of html.matchAll(/[?&](?:amp;)?page=(\d+)/gi)) {
    const n = Number(m[1]);
    if (n > max) max = n;
  }
  return max;
}

/** Parse every `.tour-card` on one results page. */
function parseCards(html: string): TourResult[] {
  const cards = html.split(/class="[^"]*tour-card/i).slice(1);
  const out: TourResult[] = [];
  for (const b of cards) {
    const id = b.match(/tour_id=(\d+)/)?.[1];
    // `data-src` points at /banner/<agencyId>/CODE-600.jpg which 404s; the real
    // file (and the data-srcset entries) live at /banner/CODE-600.jpg — so strip
    // the numeric agency subfolder.
    const rawImg =
      b.match(/data-srcset="\s*(https:\/\/files\.okwebtour\.com\/storage\/banner\/[^ "]+)/i)?.[1] ??
      b.match(/data-src="(https:\/\/files\.okwebtour\.com\/storage\/banner\/[^"]+)"/i)?.[1];
    const img = rawImg?.replace(/(\/storage\/banner\/)\d+\//, "$1");
    if (!id || !img) continue;

    const title = decode(b.match(/hovertxt"[^>]*>([^<]+)<\/a>/i)?.[1] ?? "");
    const code = decode(b.match(/text-green">\s*([\w-]+)/i)?.[1] ?? "");
    const days = decode(b.match(/จำนวนวัน<\/div>\s*<div[^>]*>\s*([^<]+?)\s*<\/div>/i)?.[1] ?? "");
    const airline = decode(b.match(/เดินทางโดย([^"]+)"/i)?.[1] ?? "");
    const price = num(b.match(/txtgridprice[^>]*>\s*([\d,]+)/i)?.[1]);
    const country = countryFromTitle(title);

    out.push({
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
  return out;
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JourneyLifeBot/1.0)" },
      cache: "no-store",
    });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

/**
 * Run a search and pull up to `maxPages` result pages (12 cards each) so the
 * visitor sees a deep result set inside our own site instead of being bounced to
 * the booking site. Page 1 is fetched first (to learn the real page count); the
 * rest are fetched in parallel, then everything is merged + deduped by tour_id.
 * Returns empty on total failure.
 */
export async function searchTours(
  params: Record<string, string>,
  maxPages = DEFAULT_MAX_PAGES,
): Promise<SearchResponse> {
  const fullUrl = buildSearchUrl(params);

  const first = await fetchPage(fullUrl);
  if (first == null) return { results: [], fullUrl, totalPages: 0, pagesFetched: 0 };

  const totalPages = lastPageOf(first);
  const wanted = Math.max(1, Math.min(maxPages, totalPages));

  // Pages 2..wanted in parallel (page 1 already in hand).
  const rest =
    wanted > 1
      ? await Promise.all(
          Array.from({ length: wanted - 1 }, (_, i) => fetchPage(`${fullUrl}&page=${i + 2}`)),
        )
      : [];

  const seen = new Set<string>();
  const results: TourResult[] = [];
  let pagesFetched = 0;
  for (const html of [first, ...rest]) {
    if (html == null) continue;
    pagesFetched += 1;
    for (const r of parseCards(html)) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      results.push(r);
    }
  }

  return { results, fullUrl, totalPages, pagesFetched };
}
