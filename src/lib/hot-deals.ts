/**
 * Hot deals ("โปรไฟไหม้") for the homepage + /outboundtrip board.
 *
 * Reads from the Payload `tours` cache when USE_TOUR_DB is on (rows kept fresh by
 * scripts/sync-tours.ts), and falls back to live-scraping hotdeal.php when the DB
 * is off / empty / errored. The HotDeal shape is unchanged so consumers don't care
 * which path served it. Parsing lives in hot-deals-scrape.ts.
 */

import { getHotDealsScrape } from "./hot-deals-scrape";
import { getHotDealsDb, toursDbEnabled } from "./tours-db";

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

/**
 * Latest promotions with full pricing. Returns [] only if both the DB and the
 * live source are unreachable.
 */
export async function getHotDeals(limit = 40): Promise<HotDeal[]> {
  if (toursDbEnabled()) {
    try {
      const deals = await getHotDealsDb(limit);
      if (deals.length) return deals;
    } catch {
      /* fall through to live scrape */
    }
  }
  return getHotDealsScrape(limit);
}
