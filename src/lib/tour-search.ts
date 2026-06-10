/**
 * On-site tour search for /outboundtrip/search (server-only entry).
 *
 * Reads from the Payload `tours` cache when USE_TOUR_DB is on (SQL filtering via
 * buildWhere in tours-db.ts), and falls back to live-scraping search.php when the
 * DB is off / errored. The client-safe types/constants/buildSearchUrl live in
 * tour-search-shared.ts (re-exported below) so client components never reach the
 * DB layer through this module.
 */

import { toursDbEnabled, searchToursDb } from "./tours-db";
import { searchToursScrape } from "./tour-search-scrape";
import { DEFAULT_MAX_PAGES, type SearchResponse } from "./tour-search-shared";

export {
  SEARCH_KEYS,
  DEFAULT_MAX_PAGES,
  MAX_DEPTH_PAGES,
  buildSearchUrl,
  type TourResult,
  type SearchResponse,
} from "./tour-search-shared";

/**
 * Run a search. DB-first (cached, SQL-filtered) when enabled; otherwise a live
 * multi-page scrape. `maxPages` controls depth (12 cards/page) for the load-more UX.
 */
export async function searchTours(
  params: Record<string, string>,
  maxPages = DEFAULT_MAX_PAGES,
): Promise<SearchResponse> {
  if (toursDbEnabled()) {
    try {
      return await searchToursDb(params, maxPages);
    } catch {
      /* fall through to live scrape */
    }
  }
  return searchToursScrape(params, maxPages);
}
