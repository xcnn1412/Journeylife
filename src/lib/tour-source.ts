/**
 * Single source of truth for the booking site we pull tour data from.
 *
 * Override the origin with the TOUR_SOURCE_BASE env var (e.g. when the booking
 * site moves to a new domain) — defaults to the current site. Used by the
 * scrapers (server-side) and by buildSearchUrl's external "see all" link (which
 * is computed server-side and passed down to the client as a prop).
 *
 * NB: this only swaps the DOMAIN. The parsers are tuned to the okwebtour HTML
 * structure + its files.okwebtour.com image CDN — a move to a different platform
 * would still need new parsing logic.
 */
const DEFAULT_BASE = "https://tour.journeylife.co.th";

/** Origin of the booking site, normalised without a trailing slash. */
export const TOUR_BASE = (process.env.TOUR_SOURCE_BASE || DEFAULT_BASE).trim().replace(/\/+$/, "");

/** Hot-deals ("โปรไฟไหม้") listing page. */
export const HOTDEAL_URL = `${TOUR_BASE}/hotdeal.php`;

/** Search endpoint. */
export const SEARCH_URL = `${TOUR_BASE}/search.php`;
