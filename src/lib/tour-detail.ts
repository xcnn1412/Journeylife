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
  price: string; // "29,899 บาท"
  priceNum: number;
  seats: string; // "34"
  bookHref: string; // booking.php on the booking site (encoded)
}

export interface ItineraryDay {
  day: string; // "วันที่ 1"
  title: string; // places visited
  detail: string; // optional longer body
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
      const tds = [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((x) => strip(x[1]));
      const raw = m[1].match(/href="([^"]+)"/)?.[1] ?? "";
      return {
        date: tds[0] ?? "",
        price: tds[1] ?? "",
        priceNum: num(tds[1] ?? ""),
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
        return { day, title: titleM, detail };
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
