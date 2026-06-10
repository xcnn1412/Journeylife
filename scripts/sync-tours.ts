/**
 * Tour catalogue sync — populates the Payload `tours` read-cache from the
 * okwebtour booking site. Run by Railway cron (and manually for local testing).
 *
 *   node --env-file-if-exists=.env --import tsx scripts/sync-tours.ts <mode>
 *
 * modes:
 *   list     walk search.php, upsert catalogue + mirror banners, sweep removed → inactive
 *   hotdeal  parse hotdeal.php, (re)flag the "โปรไฟไหม้" promos + mirror promo banners
 *   detail   hydrate full programme (periods/itinerary) for stale/missing tours
 *   all      list → hotdeal → detail (default; for manual/local use)
 *
 * Reuses the same pure parsers + tours-db helpers the website uses, so there's a
 * single source of truth for parsing and image mirroring.
 */

import config from "@payload-config";
import { getPayload, type Payload, type RequiredDataFromCollectionSlug } from "payload";
import { buildSearchUrl, type TourResult } from "@/lib/tour-search";
import { fetchPage, lastPageOf, parseCards } from "@/lib/tour-search-scrape";
import { parseHotDeals } from "@/lib/hot-deals-scrape";
import { HOTDEAL_URL } from "@/lib/tour-source";
import { mirrorImage, daysNum, hydrateDetail } from "@/lib/tours-db";

const UA = "Mozilla/5.0 (compatible; JourneyLifeBot/1.0)";
const DETAIL_BATCH = 50;
const DETAIL_STALE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const CONCURRENCY = 3;

const nowISO = () => new Date().toISOString();

/** Run `fn` over `items` with at most `n` in flight. */
async function pool<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return out;
}

/** Upsert a tour row by tourId. */
async function upsert(payload: Payload, tourId: string, fields: Record<string, unknown>) {
  const { docs } = await payload.find({ collection: "tours", where: { tourId: { equals: tourId } }, limit: 1, depth: 0 });
  if (docs[0]) return payload.update({ collection: "tours", id: docs[0].id, data: fields });
  // Fields are assembled dynamically from the scraper; the create-time shape
  // (title is required) is guaranteed by the callers, so assert it here.
  return payload.create({ collection: "tours", data: { tourId, ...fields } as RequiredDataFromCollectionSlug<"tours"> });
}

/* ── list ────────────────────────────────────────────────────────── */
async function syncList(payload: Payload) {
  const base = buildSearchUrl({ sort: "new" });
  const first = await fetchPage(base);
  if (!first) {
    console.warn("[list] page 1 fetch failed — aborting (no inactive sweep, keeps catalogue intact)");
    return;
  }
  const totalPages = lastPageOf(first);
  const morePages = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => i + 2);
  const rest = await pool(morePages, CONCURRENCY, (p) => fetchPage(`${base}&page=${p}`));
  const htmls = [first, ...rest.filter((h): h is string => h != null)];

  const seen = new Map<string, TourResult>();
  for (const h of htmls) for (const c of parseCards(h)) if (!seen.has(c.id)) seen.set(c.id, c);
  const cards = [...seen.values()];

  await pool(cards, CONCURRENCY, async (c) => {
    const bannerMedia = await mirrorImage(payload, c.img, c.title);
    await upsert(payload, c.id, {
      code: c.code || undefined,
      title: c.title,
      img: c.img,
      bannerMedia,
      country: c.country,
      daysText: c.days,
      days: daysNum(c.days),
      airline: c.airline || undefined,
      priceFrom: c.price || undefined,
      active: true,
      listSyncedAt: nowISO(),
    });
  });

  // Removed tours → inactive (kept for SEO). Only safe because page 1 succeeded
  // and we actually have cards — a transient outage must not wipe the catalogue.
  if (cards.length) {
    const res = await payload.update({
      collection: "tours",
      where: { tourId: { not_in: cards.map((c) => c.id) } },
      data: { active: false },
    });
    const deactivated = Array.isArray(res?.docs) ? res.docs.length : 0;
    console.log(`[list] ${cards.length} tours upserted across ${htmls.length} pages · ${deactivated} marked inactive`);
  }
}

/* ── hotdeal ──────────────────────────────────────────────────────── */
async function syncHotdeal(payload: Payload) {
  let html: string;
  try {
    const res = await fetch(HOTDEAL_URL, { headers: { "User-Agent": UA } });
    if (!res.ok) { console.warn(`[hotdeal] fetch failed (${res.status})`); return; }
    html = await res.text();
  } catch (e) {
    console.warn("[hotdeal] fetch error", e);
    return;
  }

  const deals = parseHotDeals(html, 100);
  // Clear stale flags first — deals that dropped off the board lose the badge.
  await payload.update({ collection: "tours", where: { isHotDeal: { equals: true } }, data: { isHotDeal: false } });

  await pool(deals, CONCURRENCY, async (d) => {
    const dealBannerMedia = await mirrorImage(payload, d.img, d.alt || d.title);
    await upsert(payload, d.id, {
      isHotDeal: true,
      discountPercent: d.discountPercent || undefined,
      firePrice: d.firePrice || undefined,
      originalPrice: d.originalPrice || undefined,
      dealDateText: d.dateText,
      dealImg: d.img,
      dealBannerMedia,
      dealAlt: d.alt,
      code: d.code || undefined,
      title: d.title,
      country: d.country,
      active: true,
      listSyncedAt: nowISO(),
    });
  });
  console.log(`[hotdeal] ${deals.length} deals flagged`);
}

/* ── detail ───────────────────────────────────────────────────────── */
async function syncDetail(payload: Payload) {
  const cutoff = new Date(Date.now() - DETAIL_STALE_MS).toISOString();
  const { docs } = await payload.find({
    collection: "tours",
    where: {
      and: [
        { active: { equals: true } },
        { or: [{ detailSyncedAt: { exists: false } }, { detailSyncedAt: { less_than: cutoff } }] },
      ],
    },
    sort: "-isHotDeal",
    limit: DETAIL_BATCH,
    depth: 0,
  });

  let ok = 0;
  let fail = 0;
  await pool(docs, CONCURRENCY, async (d) => {
    const detail = await hydrateDetail(d.tourId, payload);
    if (detail && detail.periods.length) ok++;
    else fail++;
  });
  console.log(`[detail] ${ok} hydrated, ${fail} failed (batch ${docs.length})`);
}

/* ── main ─────────────────────────────────────────────────────────── */
async function main() {
  const mode = (process.argv[2] ?? "all").toLowerCase();
  const payload = await getPayload({ config });

  if (mode === "list" || mode === "all") await syncList(payload);
  if (mode === "hotdeal" || mode === "all") await syncHotdeal(payload);
  if (mode === "detail" || mode === "all") await syncDetail(payload);

  console.log(`[sync] done: ${mode}`);
  process.exit(0);
}

main().catch((e) => {
  console.error("[sync] fatal", e);
  process.exit(1);
});
