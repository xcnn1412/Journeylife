/**
 * Hot deals ("โปรไฟไหม้") pulled live from the booking site.
 *
 * hotdeal.php server-renders each promotion inside a `.deal-row` block carrying:
 *   tour_id · banner image · tour code · title (starts "ทัวร์<country>…") ·
 *   travel date · original-price-tag → blink-pricepro (fire price) · discount %.
 *
 * We fetch + parse it on the server and cache with ISR (revalidate 600s) so the
 * site always shows current promos without storing anything ourselves.
 */

import { flagFor } from "./tour-destinations";

const HOTDEAL_URL = "https://tour.journeylife.co.th/hotdeal.php";
const TOUR_BASE = "https://tour.journeylife.co.th";

export interface HotDeal {
  id: string;
  href: string; // tour detail page
  img: string; // promo banner
  alt: string;
  title: string;
  code: string; // e.g. 089-27101
  country: string; // Thai destination from the title, e.g. "จีน"
  flag: string; // emoji for the country
  dateText: string; // e.g. "14 - 20 มิ.ย. 69"
  originalPrice: number; // 26919
  firePrice: number; // 21919 (discounted)
  discountPercent: number; // 19
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

/** Pull the destination out of a title that starts with "ทัวร์<country> …". */
function countryFromTitle(title: string): string {
  const m = title.match(/^\s*ทัวร์\s*([^\s,.\-/(]+)/);
  return m ? m[1] : "อื่น ๆ";
}

/**
 * Latest promotions with full pricing. Distinct departures are kept (deduped by
 * tour + date), so the same tour can appear with different dates/prices.
 * Returns [] if the source is unreachable.
 */
export async function getHotDeals(limit = 40): Promise<HotDeal[]> {
  try {
    const res = await fetch(HOTDEAL_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JourneyLifeBot/1.0)" },
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const html = await res.text();

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
  } catch {
    return [];
  }
}
