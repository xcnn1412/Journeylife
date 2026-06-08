/**
 * Hot deals ("โปรไฟไหม้") pulled live from the booking site.
 *
 * hotdeal.php server-renders each promotion as:
 *   <a href="tour.php?tour_id=ID"><img src="…/storage/banner/CODE.jpg" alt="…"></a>
 *
 * We fetch + parse it on the server and cache with ISR (revalidate 600s) so the
 * homepage always shows current promos without storing anything ourselves.
 */

const HOTDEAL_URL = "https://tour.journeylife.co.th/hotdeal.php";
const TOUR_BASE = "https://tour.journeylife.co.th";

export interface HotDeal {
  id: string;
  href: string; // tour detail page
  img: string; // promo banner
  alt: string;
}

const DEAL_RE =
  /href="[^"]*tour\.php\?tour_id=(\d+)"[^>]*>\s*<img\s+src="(https:\/\/files\.okwebtour\.com\/storage\/banner\/[^"]+\.jpg)"[^>]*\salt="([^"]*)"/gi;

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

/** Latest promotions, deduped by banner. Returns [] if the source is unreachable. */
export async function getHotDeals(limit = 12): Promise<HotDeal[]> {
  try {
    const res = await fetch(HOTDEAL_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JourneyLifeBot/1.0)" },
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const html = await res.text();

    const seen = new Set<string>();
    const deals: HotDeal[] = [];
    for (const m of html.matchAll(DEAL_RE)) {
      const [, id, img, alt] = m;
      if (seen.has(img)) continue;
      seen.add(img);
      deals.push({ id, img, href: `${TOUR_BASE}/tour.php?tour_id=${id}`, alt: decode(alt) });
      if (deals.length >= limit) break;
    }
    return deals;
  } catch {
    return [];
  }
}
