"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSite } from "@/lib/site-context";
import { localeHref } from "@/lib/locale";
import { Container } from "@/components/sections/_layout";
import type { ItineraryDay, TourDetail, TourPeriod } from "@/lib/tour-detail";
import { BookingModal, type BookingCopy } from "@/components/BookingModal";
import { BookingFormModal, type BookingFormCopy } from "@/components/BookingFormModal";

/* ──────────────────────────────────────────────────────────
   TOUR DETAIL — a booking-site programme rebuilt inside our site.
   Hero · highlights · departures (date/price/seats/book) · itinerary · PDF.
   ────────────────────────────────────────────────────────── */

const baht = (n: number) => n.toLocaleString("en-US");

/* One day on the itinerary timeline. Long descriptions are clamped to a few
   lines with a "read more" toggle so the page stays scannable instead of a wall
   of text — most users skim the day headers and expand only what they care about. */
function DayItem({
  index,
  day,
  readMore,
  readLess,
}: {
  index: number;
  day: ItineraryDay;
  readMore: string;
  readLess: string;
}) {
  const [open, setOpen] = useState(false);
  const segs = day.segments;
  const PREVIEW = 3;
  const collapsible = segs.length > PREVIEW + 1;
  const shown = open || !collapsible ? segs : segs.slice(0, PREVIEW);
  const hiddenCount = segs.length - PREVIEW;

  return (
    <li className="relative pl-[58px]">
      {/* Day marker on the line */}
      <span className="absolute left-0 top-0 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-blue to-brand-blue-deep text-[13px] font-bold text-white ring-4 ring-brand-paper shadow-[0_8px_20px_-8px_rgba(13,43,94,.6)]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_12px_34px_-24px_rgba(10,16,36,.5)] transition-shadow hover:shadow-[0_18px_44px_-22px_rgba(10,16,36,.55)]">
        {/* Header — day label + places */}
        <div className="border-b border-brand-line/70 bg-brand-paper/60 px-4 py-3 md:px-5">
          <div className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-red">{day.day}</div>
          <h3 className="mt-1 text-[14.5px] md:text-[15.5px] font-bold text-brand-ink leading-snug">{day.title}</h3>
        </div>

        {/* Body — prose reflowed into scannable lines */}
        {segs.length > 0 && (
          <div className="px-4 py-4 md:px-5">
            <ul className="space-y-2">
              {shown.map((s, i) => {
                if (s.kind === "meal" || s.kind === "hotel") {
                  return (
                    <li key={i} className="flex items-start gap-2.5 rounded-lg bg-brand-paper px-3 py-2">
                      <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-md bg-white text-[11px] ring-1 ring-brand-line">
                        {s.kind === "meal" ? "🍽️" : "🏨"}
                      </span>
                      <p className="text-[13px] font-medium leading-[1.7] text-brand-ink/85">
                        {s.time && <span className="mr-1 font-semibold text-brand-blue tabular-nums">{s.time}</span>}
                        {s.text}
                      </p>
                    </li>
                  );
                }
                return (
                  <li key={i} className="flex items-start gap-2.5">
                    {s.time ? (
                      <span className="mt-0.5 shrink-0 rounded-md bg-brand-blue/8 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-brand-blue">
                        {s.time}
                      </span>
                    ) : (
                      <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red/70" />
                    )}
                    <p className="text-[13.5px] font-light leading-[1.85] text-brand-ink/70 [text-wrap:pretty]">{s.text}</p>
                  </li>
                );
              })}
            </ul>

            {collapsible && (
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-blue transition-colors hover:text-brand-red"
              >
                {open ? readLess : `${readMore} (+${hiddenCount})`}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className={`transition-transform ${open ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

/* ── Departures table ──────────────────────────────────────
   Tours can list 20-30+ departure periods. We group them by month
   (users think in months), expose month filter chips defaulting to
   the nearest month, and flag the cheapest departures + low/zero
   availability so the table is scannable instead of a wall of rows. */

const TH_MONTHS: Record<string, { i: number; full: string }> = {
  "ม.ค.": { i: 1, full: "มกราคม" },
  "ก.พ.": { i: 2, full: "กุมภาพันธ์" },
  "มี.ค.": { i: 3, full: "มีนาคม" },
  "เม.ย.": { i: 4, full: "เมษายน" },
  "พ.ค.": { i: 5, full: "พฤษภาคม" },
  "มิ.ย.": { i: 6, full: "มิถุนายน" },
  "ก.ค.": { i: 7, full: "กรกฎาคม" },
  "ส.ค.": { i: 8, full: "สิงหาคม" },
  "ก.ย.": { i: 9, full: "กันยายน" },
  "ต.ค.": { i: 10, full: "ตุลาคม" },
  "พ.ย.": { i: 11, full: "พฤศจิกายน" },
  "ธ.ค.": { i: 12, full: "ธันวาคม" },
};

function parseMonth(date: string): { key: string; abbr: string; full: string } | null {
  const m = date.match(/(\d{1,2})\s+(\S+)\s+(\d{2})/);
  const mon = m ? TH_MONTHS[m[2]] : undefined;
  if (!m || !mon) return null;
  const year = 2500 + Number(m[3]); // "69" → 2569
  return { key: `${year}-${String(mon.i).padStart(2, "0")}`, abbr: m[2], full: `${mon.full} ${year}` };
}

interface MonthGroup {
  key: string;
  abbr: string;
  full: string;
  items: TourPeriod[];
}

interface DepCopy {
  periodDate: string;
  periodPrice: string;
  periodSeats: string;
  book: string;
  soldOut: string;
  allMonths: string;
  bestPrice: string;
  fewLeft: string;
  periodsUnit: string;
  chooseMonth: string;
  booking: BookingCopy;
  bookingForm: BookingFormCopy;
}

function Departures({
  periods,
  copy,
  tourCode,
  tourTitle,
  lineHref,
}: {
  periods: TourPeriod[];
  copy: DepCopy;
  tourCode: string;
  tourTitle: string;
  lineHref: string;
}) {
  const [booking, setBooking] = useState<TourPeriod | null>(null);
  const [formFor, setFormFor] = useState<TourPeriod | null>(null);

  // Group by month, preserving the source (chronological) order.
  const groups = useMemo<MonthGroup[]>(() => {
    const order: string[] = [];
    const map = new Map<string, MonthGroup>();
    for (const p of periods) {
      const pm = parseMonth(p.date);
      const key = pm?.key ?? "other";
      if (!map.has(key)) {
        map.set(key, { key, abbr: pm?.abbr ?? "อื่น ๆ", full: pm?.full ?? "อื่น ๆ", items: [] });
        order.push(key);
      }
      map.get(key)!.items.push(p);
    }
    return order.map((k) => map.get(k)!);
  }, [periods]);

  // Cheapest departure — only flag it when prices actually vary.
  const { minPrice, varies } = useMemo(() => {
    const xs = periods.map((p) => p.priceNum).filter((n) => n > 0);
    const mn = xs.length ? Math.min(...xs) : 0;
    const mx = xs.length ? Math.max(...xs) : 0;
    return { minPrice: mn, varies: mn > 0 && mn < mx };
  }, [periods]);

  const useChips = groups.length > 1;
  const [active, setActive] = useState<string>(useChips ? groups[0].key : "all");
  const view = active === "all" ? groups : groups.filter((g) => g.key === active);
  const grouped = useChips && active === "all";

  const chipCls = (on: boolean) =>
    `inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-bold transition-all ${
      on
        ? "bg-brand-blue text-white shadow-[0_10px_24px_-10px_rgba(13,43,94,.65)]"
        : "bg-brand-paper text-brand-ink ring-1 ring-brand-line hover:-translate-y-px hover:bg-white hover:ring-brand-blue/45"
    }`;
  const countCls = (on: boolean) =>
    `grid min-w-[20px] place-items-center rounded-full px-1.5 text-[11px] font-bold tabular-nums ${
      on ? "bg-white/25 text-white" : "bg-brand-blue/10 text-brand-blue"
    }`;

  return (
    <div>
      {/* Month filter chips */}
      {useChips && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide-cap text-brand-mute">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {copy.chooseMonth}
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={() => setActive("all")} className={chipCls(active === "all")}>
              {copy.allMonths}
              <span className={countCls(active === "all")}>{periods.length}</span>
            </button>
            {groups.map((g) => (
              <button key={g.key} type="button" onClick={() => setActive(g.key)} className={chipCls(active === g.key)}>
                {g.abbr}
                <span className={countCls(active === g.key)}>{g.items.length}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-brand-line">
        {/* header (desktop) */}
        <div className="hidden md:grid grid-cols-[2fr_1.2fr_0.8fr_auto] gap-4 bg-brand-paper px-5 py-3 text-[11px] tracking-wide-cap uppercase font-semibold text-brand-mute">
          <span>{copy.periodDate}</span>
          <span>{copy.periodPrice}</span>
          <span>{copy.periodSeats}</span>
          <span />
        </div>

        {view.map((g) => (
          <div key={g.key}>
            {grouped && (
              <div className="flex items-center gap-3 border-t border-brand-line bg-brand-blue/[0.05] px-5 py-3.5">
                <span aria-hidden className="h-5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                <span className="text-[15px] md:text-[16px] font-extrabold tracking-[-0.01em] text-brand-blue">{g.full}</span>
                <span className="rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-[11px] font-bold text-brand-blue">
                  {g.items.length} {copy.periodsUnit}
                </span>
              </div>
            )}
            {g.items.map((p, i) => {
              const soldOut = p.seats.trim() === "0";
              const seatsNum = Number(p.seats.replace(/[^\d]/g, "")) || 0;
              const few = !soldOut && seatsNum > 0 && seatsNum <= 5;
              const isBest = varies && p.priceNum > 0 && p.priceNum === minPrice;
              return (
                <div
                  key={i}
                  className="grid grid-cols-2 md:grid-cols-[2fr_1.2fr_0.8fr_auto] gap-x-4 gap-y-1.5 items-center px-5 py-4 border-t border-brand-line"
                >
                  <div className="col-span-2 md:col-span-1 flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-semibold text-brand-ink">{p.date}</span>
                    {isBest && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-red/10 px-2 py-0.5 text-[10px] font-bold text-brand-red">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2Z" /></svg>
                        {copy.bestPrice}
                      </span>
                    )}
                  </div>
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    {p.original && <span className="text-[12.5px] text-brand-mute line-through">{p.original}</span>}
                    <span className="text-[15px] font-bold text-brand-red">{p.price}</span>
                  </span>
                  <span className={`text-[13px] ${soldOut ? "text-brand-mute/50" : few ? "text-amber-600" : "text-brand-mute"}`}>
                    {copy.periodSeats} {p.seats}
                    {few && <span className="ml-1 font-semibold">· {copy.fewLeft}</span>}
                  </span>
                  {soldOut ? (
                    <span className="col-span-2 md:col-span-1 mt-1 md:mt-0 inline-flex cursor-not-allowed items-center justify-center rounded-md bg-brand-line/60 px-6 py-2 text-[13px] font-semibold text-brand-mute">
                      {copy.soldOut}
                    </span>
                  ) : (
                    <button type="button" onClick={() => setBooking(p)} className="btn btn-red justify-center !py-2 !px-6 text-[13px] col-span-2 md:col-span-1 mt-1 md:mt-0">
                      {copy.book}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {booking && (
        <BookingModal
          code={tourCode}
          title={tourTitle}
          date={booking.date}
          price={booking.price}
          lineHref={lineHref}
          copy={copy.booking}
          onClose={() => setBooking(null)}
          onOnlineBooking={() => {
            setFormFor(booking);
            setBooking(null);
          }}
        />
      )}

      {formFor && (
        <BookingFormModal
          code={tourCode}
          title={tourTitle}
          periods={periods}
          defaultIndex={Math.max(0, periods.indexOf(formFor))}
          lineHref={lineHref}
          copy={copy.bookingForm}
          onClose={() => setFormFor(null)}
        />
      )}
    </div>
  );
}

export function TourDetailView({ tour }: { tour: TourDetail }) {
  const { t, lang } = useSite();
  const td = t.overseasPackages.tourDetail;
  const d = t.contact.direct;
  const tel = `tel:${d.phone.replace(/[^\d+]/g, "")}`;
  const lineHref = `https://line.me/R/ti/p/${d.line}`;

  const metaChips = [
    { label: td.code, value: tour.code },
    { label: td.duration, value: tour.duration },
    { label: td.airline, value: tour.airline },
  ].filter((m) => m.value);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-brand-blue text-white">
        <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
        <Container className="relative pt-28 md:pt-36 pb-14 md:pb-20">
          <Link
            href={localeHref("/outboundtrip", lang)}
            className="inline-flex items-center gap-1.5 text-[12px] tracking-wide-cap uppercase font-semibold text-white/60 hover:text-white transition-colors"
          >
            <span aria-hidden>←</span> {td.back}
          </Link>

          <div className="mt-7 grid gap-8 lg:gap-12 lg:grid-cols-[1.1fr_1fr] items-start">
            {/* Programme image */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_70px_-30px_rgba(0,0,0,.6)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tour.image} alt={tour.title} className="w-full h-auto" loading="eager" />
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 text-[13px] text-white/70">
                <span aria-hidden className="text-[16px]">{tour.flag}</span>
                <span className="font-semibold">{tour.country}</span>
              </div>
              <h1 className="h-display mt-3 text-white" style={{ fontSize: "clamp(24px, 3vw, 40px)", lineHeight: 1.25 }}>
                {tour.title}
              </h1>

              {/* Meta chips */}
              <dl className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {metaChips.map((m) => (
                  <div key={m.label} className="rounded-xl bg-white/8 ring-1 ring-white/12 px-4 py-3">
                    <dt className="text-[10px] tracking-wide-cap uppercase text-white/50">{m.label}</dt>
                    <dd className="mt-1 text-[13px] font-semibold text-white">{m.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Price + CTAs */}
              {tour.priceFrom > 0 && (
                <div className="mt-7 flex items-end gap-2">
                  <span className="text-[12px] text-white/60 mb-1.5">{td.startFrom}</span>
                  <span className="h-display text-brand-cream leading-none" style={{ fontSize: "clamp(30px, 4vw, 46px)" }}>
                    ฿{baht(tour.priceFrom)}
                  </span>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                <a href={lineHref} target="_blank" rel="noopener noreferrer" className="btn justify-center gap-2 text-white" style={{ backgroundColor: "#06C755" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 3C6.48 3 2 6.62 2 11.07c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.26-.2 1.02.9.56 1.1-.46 5.92-3.49 8.08-5.97 1.49-1.64 2.2-3.3 2.2-4.99C22 6.62 17.52 3 12 3Z" /></svg>
                  {td.consult}
                </a>
                <a href={tel} className="btn bg-white text-brand-blue justify-center gap-2 hover:-translate-y-px">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
                  {td.call}
                </a>
                {tour.pdf && (
                  <a href={tour.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light justify-center gap-2 ring-1 ring-white/30 text-white hover:bg-white/10">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                    PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Highlights ── */}
      {tour.highlights.length > 0 && (
        <section className="bg-brand-paper py-14 md:py-20">
          <Container>
            <div className="flex items-center gap-3 mb-7">
              <span aria-hidden className="grid h-9 w-9 place-items-center rounded-xl bg-brand-red text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2Z" /></svg>
              </span>
              <h2 className="h-display text-brand-ink" style={{ fontSize: "clamp(22px, 2.6vw, 34px)" }}>{td.highlightsTitle}</h2>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5">
              {tour.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 text-[14px] md:text-[15px] text-brand-ink/85 leading-[1.6]">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                  {h}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ── Departures ── */}
      {tour.periods.length > 0 && (
        <section className="bg-white py-14 md:py-20">
          <Container>
            <h2 className="h-display text-brand-ink mb-7" style={{ fontSize: "clamp(22px, 2.6vw, 34px)" }}>{td.periodsTitle}</h2>
            <Departures periods={tour.periods} copy={td} tourCode={tour.code} tourTitle={tour.title} lineHref={lineHref} />
          </Container>
        </section>
      )}

      {/* ── Itinerary — places per day (full prose lives in the PDF) ── */}
      {tour.itinerary.length > 0 && (
        <section className="bg-brand-paper py-14 md:py-20">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="h-display text-brand-ink" style={{ fontSize: "clamp(22px, 2.6vw, 34px)" }}>{td.itineraryTitle}</h2>
              {tour.pdf && (
                <a href={tour.pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[12px] tracking-wide-cap uppercase font-semibold text-brand-blue hover:text-brand-red transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  {td.pdf}
                </a>
              )}
            </div>
            <p className="text-[13px] text-brand-mute font-light mb-7 -mt-2">{td.itineraryNote}</p>

            {/* Timeline — vertical line threads the day markers together */}
            <ol className="relative space-y-4 before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-px before:bg-brand-line">
              {tour.itinerary.map((day, i) => (
                <DayItem key={i} index={i} day={day} readMore={td.readMore} readLess={td.readLess} />
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* ── Closing CTA ── */}
      <section className="relative overflow-hidden bg-brand-blue text-white py-14 md:py-20">
        <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-ink" />
        <Container className="relative text-center">
          <h2 className="h-display text-white" style={{ fontSize: "clamp(22px, 3vw, 40px)" }}>{tour.title}</h2>
          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-2.5">
            <a href={lineHref} target="_blank" rel="noopener noreferrer" className="btn justify-center gap-2 text-white" style={{ backgroundColor: "#06C755" }}>
              {td.consult}
            </a>
            <a href={tel} className="btn bg-white text-brand-blue justify-center gap-2">{td.call}</a>
            {tour.pdf && (
              <a href={tour.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-red justify-center gap-2">{td.pdf}</a>
            )}
          </div>
          <div className="mt-6">
            <a href={tour.sourceHref} target="_blank" rel="noopener noreferrer" className="text-[12px] tracking-wide-cap uppercase font-semibold text-white/55 hover:text-white transition-colors">
              {td.seeSource} →
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
