/**
 * Client-safe shared bits of the tour search: types, query keys, the external
 * "see all" URL builder, and the depth constants. NO server imports — this is
 * what the client component TourResults.tsx imports, so it must never pull in
 * the DB layer. The server-only `searchTours` lives in tour-search.ts.
 */

import { SEARCH_URL } from "./tour-source";

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

export interface SearchResponse {
  results: TourResult[];
  fullUrl: string; // the same query on the booking site (for "see all")
  totalPages: number; // pages available for this query
  pagesFetched: number; // how many we actually returned/merged
}

/** Result pages to pull on first load (12 cards each). */
export const DEFAULT_MAX_PAGES = 3;

/** Hard ceiling on how deep "load more" can fetch (12 cards × this). */
export const MAX_DEPTH_PAGES = 9;

/** Build the booking-site URL from a clean param map (the external "see all" link). */
export function buildSearchUrl(params: Record<string, string>): string {
  const sp = new URLSearchParams();
  for (const k of SEARCH_KEYS) {
    const v = (params[k] ?? "").trim();
    if (v) sp.set(k, v);
  }
  if (!sp.has("sort")) sp.set("sort", "new");
  return `${SEARCH_URL}?${sp.toString()}`;
}
