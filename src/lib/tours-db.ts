/**
 * DB-backed read path for the tour pages (server-only).
 *
 * Maps Payload `tours` docs → the same HotDeal / TourResult / TourDetail shapes
 * the scrapers return, so the read libs (hot-deals.ts / tour-search.ts /
 * tour-detail.ts) can swap transport without touching any consumer. Also holds
 * the search where-builder, lazy detail hydration, and the R2 image mirror used
 * by both the read path and scripts/sync-tours.ts.
 *
 * NB: imports `payload` — never import this from a client component. The read
 * libs that DO get imported by clients (tour-search.ts) reach this via dynamic
 * import() so it stays out of the client bundle.
 */

// NB: server-only — never import from a client component. Enforced structurally:
// the client-reachable surface (tour-search-shared.ts) has no path into this file.
import type { Where, Payload } from "payload";
import { getPayloadClient, mediaImage } from "./payload";
import { flagFor } from "./tour-destinations";
import { buddhistToISO, thaiPeriodToISO } from "./thai-date";
import { parseTourDetail } from "./tour-detail-scrape";
import { buildSearchUrl, type TourResult, type SearchResponse } from "./tour-search-shared";
import { TOUR_BASE } from "./tour-source";
import type { HotDeal } from "./hot-deals";
import type { TourDetail, TourPeriod, ItineraryDay } from "./tour-detail";
import type { Tour } from "@/payload-types";

const UA = "Mozilla/5.0 (compatible; JourneyLifeBot/1.0)";
const PER_PAGE = 12; // cards per "page" — mirrors the booking site, keeps load-more UX

/** Read path is DB-first only when explicitly enabled. */
export function toursDbEnabled(): boolean {
  const v = process.env.USE_TOUR_DB;
  return v === "1" || v === "true";
}

const nowISO = () => new Date().toISOString();
const href = (id: string) => `${TOUR_BASE}/tour.php?tour_id=${id}`;

/* ── Derivations (also used by sync) ─────────────────────────────── */

/** "6 วัน 4 คืน" → 6 */
export function daysNum(daysText?: string | null): number | undefined {
  const n = Number(daysText?.match(/(\d+)/)?.[1] ?? "");
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Period date strings → sorted ISO departure list + first/last. */
export function deriveDepartures(periods: TourPeriod[] | undefined): {
  departures: string[];
  departuresMin: string | null;
  departuresMax: string | null;
} {
  const isos = (periods ?? [])
    .map((p) => thaiPeriodToISO(p.date))
    .filter(Boolean)
    .sort();
  return { departures: isos, departuresMin: isos[0] ?? null, departuresMax: isos[isos.length - 1] ?? null };
}

/* ── Mappers: Tour doc → UI shapes ───────────────────────────────── */

const pickImg = (media: Tour["bannerMedia"], fallback?: string | null, size: "thumbnail" | "card" | "og" = "card") =>
  mediaImage(media as Parameters<typeof mediaImage>[0], size)?.src ?? fallback ?? "";

export function toHotDeal(doc: Tour): HotDeal {
  const country = doc.country ?? "อื่น ๆ";
  return {
    id: doc.tourId,
    href: href(doc.tourId),
    img: pickImg(doc.dealBannerMedia, doc.dealImg ?? doc.img) || pickImg(doc.bannerMedia, doc.img),
    alt: doc.dealAlt ?? doc.title,
    title: doc.title,
    code: doc.code ?? "",
    country,
    flag: flagFor(country),
    dateText: doc.dealDateText ?? "",
    originalPrice: doc.originalPrice ?? 0,
    firePrice: doc.firePrice ?? 0,
    discountPercent: doc.discountPercent ?? 0,
  };
}

export function toTourResult(doc: Tour): TourResult {
  const country = doc.country ?? "อื่น ๆ";
  return {
    id: doc.tourId,
    href: href(doc.tourId),
    img: pickImg(doc.bannerMedia, doc.img),
    title: doc.title,
    code: doc.code ?? "",
    days: doc.daysText ?? "",
    airline: doc.airline ?? "",
    price: doc.priceFrom ?? 0,
    country,
    flag: flagFor(country),
  };
}

export function toTourDetail(doc: Tour): TourDetail {
  const country = doc.country ?? "อื่น ๆ";
  return {
    id: doc.tourId,
    title: doc.title,
    image: pickImg(doc.heroMedia, doc.image),
    code: doc.code ?? "",
    duration: doc.daysText ?? "",
    airline: doc.airline ?? "",
    country,
    flag: flagFor(country),
    priceFrom: doc.priceFrom ?? 0,
    highlights: (doc.highlights as string[] | null) ?? [],
    periods: (doc.periods as TourPeriod[] | null) ?? [],
    itinerary: (doc.itinerary as ItineraryDay[] | null) ?? [],
    pdf: doc.pdf ?? "",
    sourceHref: href(doc.tourId),
  };
}

/* ── Search where / sort ─────────────────────────────────────────── */

/** SEARCH_KEYS → Payload Where (always constrained to active tours). */
export function buildWhere(params: Record<string, string>): Where {
  const and: Where[] = [{ active: { equals: true } }];

  if (params.keyword) and.push({ country: { equals: params.keyword } });
  if (params.keywords)
    and.push({ or: [{ city: { contains: params.keywords } }, { title: { contains: params.keywords } }] });

  if (params.priceRange) {
    const [min, max] = params.priceRange.split("-");
    const range: Record<string, number> = {};
    if (min) range.greater_than_equal = Number(min);
    if (max) range.less_than_equal = Number(max);
    if (Object.keys(range).length) and.push({ priceFrom: range });
  }

  if (params.day) and.push({ days: { equals: Number(params.day) } });

  const from = buddhistToISO(params.cstartdate ?? "");
  if (from) and.push({ departuresMax: { greater_than_equal: from } });
  const to = buddhistToISO(params.cenddate ?? "");
  if (to) and.push({ departuresMin: { less_than_equal: to } });

  if (params.tourid) and.push({ code: { like: params.tourid } });

  return { and };
}

export function sortMap(sort?: string): string {
  if (sort === "asc") return "priceFrom";
  if (sort === "desc") return "-priceFrom";
  return "-createdAt"; // "new" / default
}

/* ── Queries ─────────────────────────────────────────────────────── */

export async function getHotDealsDb(limit = 40): Promise<HotDeal[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "tours",
    where: { and: [{ isHotDeal: { equals: true } }, { active: { equals: true } }] },
    sort: "-firePrice",
    limit,
    depth: 1,
  });
  return docs.map(toHotDeal);
}

export async function searchToursDb(params: Record<string, string>, maxPages: number): Promise<SearchResponse> {
  const payload = await getPayloadClient();
  const { docs, totalDocs } = await payload.find({
    collection: "tours",
    where: buildWhere(params),
    sort: sortMap(params.sort),
    limit: maxPages * PER_PAGE,
    depth: 1,
  });
  const totalPages = Math.max(1, Math.ceil(totalDocs / PER_PAGE));
  return {
    results: docs.map(toTourResult),
    fullUrl: buildSearchUrl(params),
    totalPages,
    pagesFetched: Math.min(maxPages, totalPages),
  };
}

/**
 * Detail for one tour from the DB, lazily hydrating from tour.php on first hit.
 * Returns null only when the tour isn't in the DB at all (caller then scrapes).
 */
export async function getTourDetailDb(id: string): Promise<TourDetail | null> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "tours", where: { tourId: { equals: id } }, limit: 1, depth: 1 });
  const doc = docs[0];
  if (!doc) return null; // not in DB → caller falls back to scrape (any id still renders)
  if (doc.detailSyncedAt && Array.isArray(doc.periods)) return toTourDetail(doc);

  const detail = await hydrateDetail(id, payload);
  if (detail) return detail;
  return doc.title ? toTourDetail(doc) : null; // partial (list-only) fallback
}

/* ── Lazy detail hydration + image mirror (shared with sync) ─────── */

async function fetchTourHtml(id: string): Promise<string | null> {
  try {
    const res = await fetch(href(id), { headers: { "User-Agent": UA }, next: { revalidate: 600 } });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

/**
 * Scrape tour.php for `id`, mirror its hero image, write the detail fields onto
 * the matching `tours` row (creating it if absent), and return the fresh
 * TourDetail (read back with the mirrored image applied). Null on fetch/parse
 * failure — the row's detailError is stamped so the next sync retries.
 */
export async function hydrateDetail(id: string, payloadArg?: Payload): Promise<TourDetail | null> {
  const payload = payloadArg ?? (await getPayloadClient());
  const html = await fetchTourHtml(id);
  const { docs } = await payload.find({ collection: "tours", where: { tourId: { equals: id } }, limit: 1, depth: 0 });
  const existing = docs[0];

  const detail = html ? parseTourDetail(html, id) : null;
  if (!detail) {
    if (existing) await payload.update({ collection: "tours", id: existing.id, data: { detailError: "fetch/parse failed", detailSyncedAt: existing.detailSyncedAt ?? null } });
    return null;
  }

  const heroMedia = await mirrorImage(payload, detail.image, detail.title);
  const dep = deriveDepartures(detail.periods);
  const data = {
    image: detail.image,
    heroMedia,
    pdf: detail.pdf,
    highlights: detail.highlights,
    periods: detail.periods,
    itinerary: detail.itinerary,
    ...dep,
    ...(detail.priceFrom ? { priceFrom: detail.priceFrom } : {}),
    detailSyncedAt: nowISO(),
    detailError: null,
  };

  if (existing) {
    await payload.update({ collection: "tours", id: existing.id, data });
  } else {
    await payload.create({
      collection: "tours",
      data: {
        tourId: id,
        code: detail.code,
        title: detail.title,
        country: detail.country,
        daysText: detail.duration,
        days: daysNum(detail.duration),
        airline: detail.airline,
        active: true,
        listSyncedAt: nowISO(),
        ...data,
      },
    });
  }

  // Read back with depth so the mirrored hero URL is applied to the returned shape.
  const { docs: fresh } = await payload.find({ collection: "tours", where: { tourId: { equals: id } }, limit: 1, depth: 1 });
  return fresh[0] ? toTourDetail(fresh[0]) : { ...detail };
}

/**
 * Mirror an external image into Payload Media (→ R2), deduped by sourceUrl.
 * Returns the media doc id, or null if url is blank / unreachable.
 */
export async function mirrorImage(payload: Payload, url: string | undefined | null, alt: string): Promise<number | null> {
  if (!url) return null;
  try {
    const existing = await payload.find({ collection: "media", where: { sourceUrl: { equals: url } }, limit: 1, depth: 0 });
    if (existing.docs[0]) return existing.docs[0].id;

    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const mimetype = res.headers.get("content-type")?.split(";")[0]?.trim() || guessMime(url);
    const name = (url.split("/").pop() || "banner.jpg").split("?")[0];

    const created = await payload.create({
      collection: "media",
      data: { alt: alt || "", sourceUrl: url },
      file: { data: buf, mimetype, name, size: buf.length },
    });
    return created.id;
  } catch {
    return null;
  }
}

function guessMime(url: string): string {
  const ext = url.toLowerCase().split("?")[0].split(".").pop();
  return ext === "png" ? "image/png"
    : ext === "webp" ? "image/webp"
    : ext === "avif" ? "image/avif"
    : ext === "gif" ? "image/gif"
    : "image/jpeg";
}
