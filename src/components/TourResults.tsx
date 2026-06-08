"use client";
import { useSite } from "@/lib/site-context";
import { Container } from "@/components/sections/_layout";
import type { TourResult } from "@/lib/tour-search";

/* ──────────────────────────────────────────────────────────
   TOUR RESULTS — search.php results rendered inside our site.
   Light section (paper); cards are white. Detail/booking still
   open the booking site, but discovery happens here.
   ────────────────────────────────────────────────────────── */

const baht = (n: number) => n.toLocaleString("en-US");

export function TourResults({ results, seeAllUrl }: { results: TourResult[]; seeAllUrl: string }) {
  const { t } = useSite();
  const r = t.overseasPackages.searchResults;
  const d = t.contact.direct;
  const lineHref = `https://line.me/R/ti/p/${d.line}`;

  if (!results.length) {
    return (
      <Container className="py-16 md:py-24 text-center">
        <p className="text-[16px] text-brand-mute font-light">{r.empty}</p>
        <a href={seeAllUrl} target="_blank" rel="noopener noreferrer" className="btn btn-blue mt-7">
          {r.seeAll}
          <span className="arrow">→</span>
        </a>
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-16">
      {/* Count */}
      <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-[14px] text-brand-mute">
          {r.found} <span className="font-semibold text-brand-ink">{results.length}</span> {r.programs}
        </p>
        <a
          href={seeAllUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] tracking-wide-cap uppercase font-semibold text-brand-blue hover:text-brand-red transition-colors"
        >
          {r.seeAll} →
        </a>
      </div>

      {/* Result cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((x) => (
          <article
            key={x.id}
            className="card-lift group flex flex-col overflow-hidden rounded-2xl bg-white border border-brand-line shadow-[0_24px_60px_-32px_rgba(10,16,36,.5)]"
          >
            {/* Banner */}
            <a href={`/outboundtrip/tour/${x.id}`} target="_blank" rel="noopener noreferrer" className="relative block aspect-square overflow-hidden bg-brand-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={x.img}
                alt={x.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {x.code && (
                <span className="absolute top-3 left-3 rounded bg-brand-ink/80 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                  {x.code}
                </span>
              )}
            </a>

            {/* Body */}
            <div className="flex flex-1 flex-col p-4 md:p-5">
              <div className="flex items-center gap-2 text-[11px] text-brand-mute">
                <span aria-hidden>{x.flag}</span>
                <span className="font-semibold text-brand-blue">{x.country}</span>
                {x.days && <span className="ml-auto">{x.days}</span>}
              </div>

              <a
                href={x.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-[14px] md:text-[15px] font-semibold leading-snug text-brand-ink line-clamp-2 transition-colors hover:text-brand-red"
              >
                {x.title}
              </a>

              {x.airline && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] text-brand-mute">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l3.5 3.5-1.4 1.4-2.1-.4a.5.5 0 0 0-.5.8l1.8 1.8 1.8 1.8a.5.5 0 0 0 .8-.5l-.4-2.1 1.4-1.4 3.5 3.5a.5.5 0 0 0 .8-.5Z" /></svg>
                  {x.airline}
                </div>
              )}

              {/* Price */}
              <div className="mt-auto pt-4">
                <div className="text-[11px] text-brand-mute">{r.startFrom}</div>
                <div className="flex items-end gap-1.5">
                  <span className="h-display text-brand-red leading-none" style={{ fontSize: "clamp(22px, 3vw, 28px)" }}>
                    ฿{baht(x.price)}
                  </span>
                  <span className="text-[11px] text-brand-mute mb-1">{t.overseasPackages.dealsFilter.perPerson}</span>
                </div>

                {/* CTAs */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a href={`/outboundtrip/tour/${x.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-blue justify-center py-2.5! text-[12px]!">
                    {r.detail}
                  </a>
                  <a
                    href={lineHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn justify-center gap-1.5 py-2.5! text-[12px]! text-white"
                    style={{ backgroundColor: "#06C755" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 3C6.48 3 2 6.62 2 11.07c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.26-.2 1.02.9.56 1.1-.46 5.92-3.49 8.08-5.97 1.49-1.64 2.2-3.3 2.2-4.99C22 6.62 17.52 3 12 3Z" /></svg>
                    {r.book}
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}
