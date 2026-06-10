/**
 * On-site tour search scraper (fallback + sync source).
 *
 * Forwards a query to tour.journeylife.co.th/search.php and parses the
 * server-rendered `.tour-card` results. The pure `parseCards(html)` / `lastPageOf`
 * are reused by scripts/sync-tours.ts; `searchToursScrape` is the live fallback
 * used when the DB read path is off/empty.
 *
 * (Logic moved verbatim out of tour-search.ts — see that file for the DB-backed
 * `searchTours` that delegates here, plus the public buildSearchUrl/SEARCH_KEYS.)
 */

import { flagFor } from "./tour-destinations";
import { TOUR_BASE } from "./tour-source";
import { buildSearchUrl, DEFAULT_MAX_PAGES, type TourResult, type SearchResponse } from "./tour-search-shared";

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

/** Highest `page=N` advertised by the pagination block (1 if none). */
export function lastPageOf(html: string): number {
  let max = 1;
  for (const m of html.matchAll(/[?&](?:amp;)?page=(\d+)/gi)) {
    const n = Number(m[1]);
    if (n > max) max = n;
  }
  return max;
}

/** Parse every `.tour-card` on one results page. */
export function parseCards(html: string): TourResult[] {
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

export async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JourneyLifeBot/1.0)" },
      next: { revalidate: 300 },
    });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

/**
 * Live-fetch fallback: pull up to `maxPages` result pages (12 cards each), merge,
 * dedupe by tour_id. Returns empty on total failure.
 */
export async function searchToursScrape(
  params: Record<string, string>,
  maxPages = DEFAULT_MAX_PAGES,
): Promise<SearchResponse> {
  const fullUrl = buildSearchUrl(params);

  const first = await fetchPage(fullUrl);
  if (first == null) return { results: [], fullUrl, totalPages: 0, pagesFetched: 0 };

  const totalPages = lastPageOf(first);
  const wanted = Math.max(1, Math.min(maxPages, totalPages));

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
