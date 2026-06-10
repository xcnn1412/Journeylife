/**
 * Single tour detail for /outboundtrip/tour/[id].
 *
 * Reads from the Payload `tours` cache when USE_TOUR_DB is on — and lazily
 * hydrates a tour's full programme from tour.php on first hit (then it's cached).
 * Falls back to live-scraping when the DB is off, the tour isn't cached yet, or
 * an error occurs. Parsing lives in tour-detail-scrape.ts.
 */

import { getTourDetailScrape } from "./tour-detail-scrape";
import { getTourDetailDb, toursDbEnabled } from "./tours-db";

export { formatItinerary } from "./tour-detail-scrape";

export interface TourPeriod {
  date: string;
  price: string; // final price, e.g. "21,919 บาท" (already discounted)
  priceNum: number; // numeric of the final price
  original: string; // struck-through full price, "" when there's no discount
  seats: string; // "34"
  bookHref: string; // booking.php on the booking site (encoded)
}

export interface ItinSegment {
  time: string; // "08.05น." when the line opens with a clock time, else ""
  text: string;
  kind: "event" | "meal" | "hotel";
}

export interface ItineraryDay {
  day: string; // "วันที่ 1"
  title: string; // places visited
  detail: string; // raw prose body (kept for SEO / fallback)
  segments: ItinSegment[]; // detail reflowed into scannable lines
}

export interface TourDetail {
  id: string;
  title: string;
  image: string;
  code: string;
  duration: string; // "6 วัน 4 คืน"
  airline: string; // "AirAsia X (XJ)"
  country: string;
  flag: string;
  priceFrom: number;
  highlights: string[];
  periods: TourPeriod[];
  itinerary: ItineraryDay[];
  pdf: string;
  sourceHref: string; // original tour.php page
}

export async function getTourDetail(id: string): Promise<TourDetail | null> {
  if (toursDbEnabled()) {
    try {
      const detail = await getTourDetailDb(id);
      if (detail) return detail;
    } catch {
      /* fall through to live scrape */
    }
  }
  return getTourDetailScrape(id);
}
