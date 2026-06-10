/**
 * Tour-detail scraper (fallback + sync source).
 *
 * Parses tour.journeylife.co.th/tour.php?tour_id=ID into a TourDetail. The pure
 * `parseTourDetail(html, id)` is reused by scripts/sync-tours.ts + the lazy
 * hydrate path; `getTourDetailScrape` is the live fallback.
 *
 * (Logic moved verbatim out of tour-detail.ts — see that file for the DB-backed
 * `getTourDetail` that delegates here.)
 */

import { flagFor } from "./tour-destinations";
import { TOUR_BASE } from "./tour-source";
import type { TourDetail, TourPeriod, ItineraryDay, ItinSegment } from "./tour-detail";

function strip(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&ndash;|&mdash;/g, "-")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

const num = (s: string) => Number((s.match(/[\d,]+/)?.[0] ?? "").replace(/[^\d]/g, "")) || 0;

function countryFromTitle(title: string): string {
  const m = title.match(/^\s*ทัวร์\s*([^\s,.\-/(]+)/);
  return m ? m[1] : "อื่น ๆ";
}

// Boundaries that start a new activity line in a Thai itinerary (clock times +
// common connectors). Kept conservative so we don't slice inside ordinary words.
const SEG_BREAK =
  /(\d{1,2}[.:]\d{2}\s*น\.|จากนั้น|นำท่าน|นำคณะ|พาท่าน|ได้เวลา|สมควรแก่เวลา|อิสระ|บริการอาหาร|รับประทานอาหาร)/g;
const MEAL_RE = /(?:อาหาร(?:เช้า|กลางวัน|เที่ยง|เย็น|ค่ำ|ว่าง)|ภัตตาคาร|ห้องอาหาร|บุฟเฟ|เมนู|รับประทานอาหาร|บริการอาหาร)/;
const HOTEL_RE = /(?:เข้าสู่ที่พัก|ที่พัก|พักที่|โรงแรม|รีสอร์ท|HOTEL|RESORT)/i;

/**
 * Reflow a wall-of-text day description into scannable lines: break before clock
 * times / activity connectors, then tag each line as a meal, hotel, or plain
 * event so the UI can lay it out nicely. Content is untouched — only segmented.
 */
export function formatItinerary(detail: string): ItinSegment[] {
  const text = detail.replace(/\s+/g, " ").trim();
  if (!text) return [];

  const rawParts = text
    .replace(SEG_BREAK, "\n$1")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  // Glue stray short fragments (e.g. a lone "จากนั้น") onto the previous line.
  const parts: string[] = [];
  for (const p of rawParts) {
    if (parts.length && p.length < 14) parts[parts.length - 1] += " " + p;
    else parts.push(p);
  }

  return parts
    .map((p) => {
      let time = "";
      let body = p;
      const tm = body.match(/^(\d{1,2}[.:]\d{2}\s*น\.)\s*/);
      if (tm) {
        time = tm[1].replace(/\s+/g, "");
        body = body.slice(tm[0].length).trim();
      }
      const kind: ItinSegment["kind"] = HOTEL_RE.test(body) ? "hotel" : MEAL_RE.test(body) ? "meal" : "event";
      return { time, text: body, kind };
    })
    .filter((s) => s.text);
}

/** Parse a tour.php HTML page into a TourDetail (null if no title found). */
export function parseTourDetail(html: string, id: string): TourDetail | null {
  const sourceHref = `${TOUR_BASE}/tour.php?tour_id=${id}`;

  const title = strip(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  if (!title) return null;

  const image = html.match(/property="og:image"[^>]+content="([^"]+)"/i)?.[1] ?? "";
  const code = strip(html.match(/รหัสทัวร์<\/div>\s*<div[^>]*>([^<]+)<\/div>/i)?.[1] ?? "");
  const duration = strip(html.match(/ช่วงเวลา<\/div>\s*<div[^>]*>([^<]+)<\/div>/i)?.[1] ?? "");
  const airline = strip(html.match(/เดินทางโดย<\/div>\s*<div[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? "");
  const pdf = html.match(/https?:\/\/[^" ]+\.pdf/i)?.[0] ?? "";

  // Highlights — first <ul> after the "ไฮไลท์" heading.
  const hiIdx = html.indexOf("ไฮไลท์");
  const ul = hiIdx >= 0 ? html.slice(hiIdx).match(/<ul>([\s\S]*?)<\/ul>/i)?.[1] ?? "" : "";
  const highlights = [...ul.matchAll(/<li>([\s\S]*?)<\/li>/gi)]
    .map((m) => strip(m[1]))
    .filter(Boolean);

  // Periods — the table after "เลือกวันเดินทาง".
  const pIdx = html.indexOf("เลือกวันเดินทาง");
  const table = pIdx >= 0 ? html.slice(pIdx).match(/<table[\s\S]*?<\/table>/i)?.[0] ?? "" : "";
  const periods: TourPeriod[] = [...table.matchAll(/<tr class=['"]fs14['"]>([\s\S]*?)<\/tr>/gi)].map((m) => {
    const cells = [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((x) => x[1]); // raw cell html
    const tds = cells.map(strip);
    // Price cell is either "<s>full</s><br><span color:red>final</span>" (discount)
    // or just a plain "29,899 บาท" (no discount).
    const priceCell = cells[1] ?? "";
    const original = strip(priceCell.match(/<s\b[^>]*>([\s\S]*?)<\/s>/i)?.[1] ?? "");
    const redFinal = priceCell.match(/color:\s*red[^>]*>([\s\S]*?)<\/span>/i)?.[1];
    const price = redFinal ? strip(redFinal) : (tds[1] ?? "");
    const raw = m[1].match(/href="([^"]+)"/)?.[1] ?? "";
    return {
      date: tds[0] ?? "",
      price,
      priceNum: num(price),
      original,
      seats: tds[4] ?? "",
      bookHref: raw ? `${TOUR_BASE}/${encodeURI(raw)}` : sourceHref,
    };
  });

  // Itinerary — accordion items after "แผนการเดินทาง".
  const itIdx = html.indexOf("แผนการเดินทาง");
  const acc = itIdx >= 0 ? html.slice(itIdx) : "";
  const itinerary: ItineraryDay[] = [...acc.matchAll(/<div class="accordion-item">([\s\S]*?)(?=<div class="accordion-item">|<\/div>\s*<\/div>\s*<\/section|$)/gi)]
    .map((m) => {
      const block = m[1];
      const day = strip(block.match(/topicday">([\s\S]*?)<\/div>/i)?.[1] ?? "");
      const titleM = strip(block.match(/topicday">[\s\S]*?<\/div>\s*<div class="fw-semibold">([\s\S]*?)<\/div>/i)?.[1] ?? "");
      const detail = strip(block.match(/accordion-body[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? "");
      return { day, title: titleM, detail, segments: formatItinerary(detail) };
    })
    .filter((d) => d.day);

  const priceFrom = periods.length ? Math.min(...periods.map((p) => p.priceNum).filter(Boolean)) : 0;
  const country = countryFromTitle(title);

  return {
    id,
    title,
    image,
    code,
    duration,
    airline,
    country,
    flag: flagFor(country),
    priceFrom,
    highlights,
    periods,
    itinerary,
    pdf,
    sourceHref,
  };
}

/** Live-fetch fallback. Returns null if the source is unreachable / has no title. */
export async function getTourDetailScrape(id: string): Promise<TourDetail | null> {
  const sourceHref = `${TOUR_BASE}/tour.php?tour_id=${id}`;
  try {
    const res = await fetch(sourceHref, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JourneyLifeBot/1.0)" },
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return parseTourDetail(await res.text(), id);
  } catch {
    return null;
  }
}
