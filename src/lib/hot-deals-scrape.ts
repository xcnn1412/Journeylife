/**
 * Hot-deal scraper (fallback + sync source).
 *
 * Parses tour.journeylife.co.th/hotdeal.php into HotDeal[]. The pure
 * `parseHotDeals(html)` is reused by scripts/sync-tours.ts; `getHotDealsScrape`
 * is the live-fetch fallback used when the DB read path is off/empty.
 *
 * (Logic moved verbatim out of hot-deals.ts — see that file for the DB-backed
 * `getHotDeals` that delegates here.)
 */

import { flagFor } from "./tour-destinations";
import { TOUR_BASE, HOTDEAL_URL } from "./tour-source";
import type { HotDeal } from "./hot-deals";

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

/** Pull the destination out of a title that starts with "ทัวร์<country> …". */
function countryFromTitle(title: string): string {
  const m = title.match(/^\s*ทัวร์\s*([^\s,.\-/(]+)/);
  return m ? m[1] : "อื่น ๆ";
}

/**
 * Parse the hotdeal.php HTML into HotDeal[]. Distinct departures are kept
 * (deduped by tour + date), so the same tour can appear with different dates.
 */
export function parseHotDeals(html: string, limit = 40): HotDeal[] {
  const blocks = html.split(/class="[^"]*deal-row/i).slice(1);
  const seen = new Set<string>();
  const deals: HotDeal[] = [];

  for (const b of blocks) {
    const id = b.match(/tour_id=(\d+)/)?.[1];
    const img = b.match(/<img[^>]+src="(https:\/\/files\.okwebtour\.com\/storage\/banner\/[^"]+)"/i)?.[1];
    if (!id || !img) continue;

    const alt = decode(b.match(/storage\/banner\/[^"]+"\s+alt="([^"]*)"/i)?.[1] ?? "");
    const title = decode(b.match(/fs14"[^>]*target="_blank">([^<]+)<\/a>/i)?.[1] ?? alt);
    const code = decode(b.match(/fs11"[^>]*>\s*([\w-]+)\s*<\/span>/i)?.[1] ?? "");
    const originalPrice = num(b.match(/original-price-tag">\s*([\d,]+)/i)?.[1]);
    const firePrice = num(b.match(/blink-pricepro">\s*([\d,]+)/i)?.[1]);
    const discountPercent = num(b.match(/badge-discount-percent">\s*-?\s*(\d+)\s*%/i)?.[1]);
    const dateText = decode(b.match(/bi-calendar3[^>]*><\/i>\s*([^<]+?)\s*<\/div>/i)?.[1] ?? "");

    const dedupe = `${id}|${dateText}`;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);

    const country = countryFromTitle(title);
    deals.push({
      id,
      href: `${TOUR_BASE}/tour.php?tour_id=${id}`,
      img,
      alt,
      title,
      code,
      country,
      flag: flagFor(country),
      dateText,
      originalPrice,
      firePrice,
      discountPercent,
    });
    if (deals.length >= limit) break;
  }
  return deals;
}

/** Live-fetch fallback. Returns [] if the source is unreachable. */
export async function getHotDealsScrape(limit = 40): Promise<HotDeal[]> {
  try {
    const res = await fetch(HOTDEAL_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JourneyLifeBot/1.0)" },
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    return parseHotDeals(await res.text(), limit);
  } catch {
    return [];
  }
}
