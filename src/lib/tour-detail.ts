/**
 * Single tour detail, pulled from tour.journeylife.co.th/tour.php?tour_id=ID and
 * parsed server-side so we can render the program inside our own site.
 *
 * Extracts: title · hero image · code/duration/airline · highlights ·
 * departure periods (date / price / seats / booking link) · day-by-day
 * itinerary · PDF programme.
 */

import { flagFor } from "./tour-destinations";

const TOUR_BASE = "https://tour.journeylife.co.th";

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

  // `text` has all whitespace collapsed to single spaces, so a newline is a safe
  // sentinel: insert one before each boundary marker, then split on it.
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

export async function getTourDetail(id: string): Promise<TourDetail | null> {
  const sourceHref = `${TOUR_BASE}/tour.php?tour_id=${id}`;
  try {
    const res = await fetch(sourceHref, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JourneyLifeBot/1.0)" },
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const title = strip(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
    if (!title) return null;

    const image =
      html.match(/property="og:image"[^>]+content="([^"]+)"/i)?.[1] ?? "";
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
  } catch {
    return null;
  }
}
