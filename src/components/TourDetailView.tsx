"use client";
import Link from "next/link";
import { useSite } from "@/lib/site-context";
import { Container } from "@/components/sections/_layout";
import type { TourDetail } from "@/lib/tour-detail";

/* ──────────────────────────────────────────────────────────
   TOUR DETAIL — a booking-site programme rebuilt inside our site.
   Hero · highlights · departures (date/price/seats/book) · itinerary · PDF.
   ────────────────────────────────────────────────────────── */

const baht = (n: number) => n.toLocaleString("en-US");

export function TourDetailView({ tour }: { tour: TourDetail }) {
  const { t } = useSite();
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
            href="/outboundtrip"
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
            <div className="overflow-hidden rounded-2xl border border-brand-line">
              {/* header (desktop) */}
              <div className="hidden md:grid grid-cols-[2fr_1.2fr_0.8fr_auto] gap-4 bg-brand-paper px-5 py-3 text-[11px] tracking-wide-cap uppercase font-semibold text-brand-mute">
                <span>{td.periodDate}</span>
                <span>{td.periodPrice}</span>
                <span>{td.periodSeats}</span>
                <span />
              </div>
              {tour.periods.map((p, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 md:grid-cols-[2fr_1.2fr_0.8fr_auto] gap-x-4 gap-y-1.5 items-center px-5 py-4 border-t border-brand-line first:border-t-0 md:first:border-t"
                >
                  <span className="col-span-2 md:col-span-1 text-[14px] font-semibold text-brand-ink">{p.date}</span>
                  <span className="text-[15px] font-bold text-brand-red">{p.price}</span>
                  <span className="text-[13px] text-brand-mute">{td.periodSeats} {p.seats}</span>
                  <a href={p.bookHref} target="_blank" rel="noopener noreferrer" className="btn btn-red justify-center !py-2 !px-6 text-[13px] col-span-2 md:col-span-1 mt-1 md:mt-0">
                    {td.book}
                  </a>
                </div>
              ))}
            </div>
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

            {/* Timeline list — day number + places visited */}
            <ol className="relative space-y-3">
              {tour.itinerary.map((day, i) => (
                <li key={i} className="rounded-xl border border-brand-line bg-white px-4 py-4 md:px-5">
                  <div className="flex items-start gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-blue text-white text-[12px] font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 pt-1">
                      <div className="text-[10px] tracking-wide-cap uppercase text-brand-mute mb-0.5">{day.day}</div>
                      <div className="text-[14px] md:text-[15px] font-semibold text-brand-ink leading-snug">{day.title}</div>
                      {day.detail && (
                        <p className="mt-2 text-[13px] text-brand-mute font-light leading-[1.8]">{day.detail}</p>
                      )}
                    </div>
                  </div>
                </li>
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
