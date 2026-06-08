"use client";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSite } from "@/lib/site-context";
import { Container } from "@/components/sections/_layout";
import type { TourResult } from "@/lib/tour-search";

const RESULTS_ROUTE = "/outboundtrip/search";

/* ──────────────────────────────────────────────────────────
   TOUR RESULTS — search.php results rendered inside our site.
   Light section (paper); cards are white. Detail/booking still
   open the booking site, but discovery happens here.
   The deep result set (pulled across pages) is paginated here at
   15 cards per page — all client-side, no refetch.
   ────────────────────────────────────────────────────────── */

const baht = (n: number) => n.toLocaleString("en-US");
const PAGE_SIZE = 15;

/** Numbered page navigation (used above and below the result grid). */
function Pager({
  page,
  totalPages,
  onGo,
  prevLabel,
  nextLabel,
  className = "",
}: {
  page: number;
  totalPages: number;
  onGo: (p: number) => void;
  prevLabel: string;
  nextLabel: string;
  className?: string;
}) {
  if (totalPages <= 1) return null;
  const arrow = "grid h-9 w-9 place-items-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-blue/50 hover:text-brand-blue disabled:pointer-events-none disabled:opacity-35";
  return (
    <nav className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`} aria-label="Pagination">
      <button type="button" onClick={() => onGo(page - 1)} disabled={page === 1} aria-label={prevLabel} className={arrow}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onGo(p)}
          aria-current={p === page ? "page" : undefined}
          className={`grid h-9 min-w-9 place-items-center rounded-lg px-2 text-[13px] font-semibold transition-colors ${
            p === page ? "bg-brand-blue text-white" : "border border-brand-line text-brand-ink hover:border-brand-blue/50 hover:text-brand-blue"
          }`}
        >
          {p}
        </button>
      ))}
      <button type="button" onClick={() => onGo(page + 1)} disabled={page === totalPages} aria-label={nextLabel} className={arrow}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m9 18 6-6-6-6" /></svg>
      </button>
    </nav>
  );
}

export function TourResults({
  results,
  seeAllUrl,
  sort,
  query,
}: {
  results: TourResult[];
  seeAllUrl: string;
  sort: string; // current sort param: "new" | "asc" | "desc"
  query: Record<string, string>; // current search params, so we can re-sort in place
}) {
  const { t } = useSite();
  const r = t.overseasPackages.searchResults;
  const d = t.contact.direct;
  const lineHref = `https://line.me/R/ti/p/${d.line}`;

  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const topRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const shown = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const goTo = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Sorting is done by the booking site (sort=asc/desc orders by price across ALL
  // pages) — change the URL param and refetch. The page remounts (key=fullUrl) so
  // pagination resets to 1.
  const changeSort = (v: string) => {
    if (v === sort) return;
    const sp = new URLSearchParams(query);
    sp.set("sort", v);
    startTransition(() => router.push(`${RESULTS_ROUTE}?${sp.toString()}`));
  };

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
      <div ref={topRef} aria-hidden className="scroll-mt-28" />

      {/* Count + sort + top pager (replaces the old "see all on tour site" link) */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
          <p className="text-[14px] text-brand-mute">
            {r.found} <span className="font-semibold text-brand-ink">{results.length}</span> {r.programs}
          </p>
          <label className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-brand-mute">{r.sortLabel}</span>
            <select
              value={sort}
              onChange={(e) => changeSort(e.target.value)}
              disabled={pending}
              className="rounded-lg border border-brand-line bg-white px-3 py-2 text-[13px] font-medium text-brand-ink outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 disabled:opacity-60"
            >
              <option value="new">{r.sortNew}</option>
              <option value="asc">{r.sortPriceAsc}</option>
              <option value="desc">{r.sortPriceDesc}</option>
            </select>
            {pending && (
              <svg className="animate-spin text-brand-blue" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
          </label>
        </div>
        <Pager page={safePage} totalPages={totalPages} onGo={goTo} prevLabel={r.prev} nextLabel={r.next} />
      </div>

      {/* Result cards */}
      <div
        aria-busy={pending}
        className={`grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${pending ? "pointer-events-none opacity-50" : ""}`}
      >
        {shown.map((x) => (
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
                href={`/outboundtrip/tour/${x.id}`}
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

      {/* Pagination — 15 per page */}
      <Pager page={safePage} totalPages={totalPages} onGo={goTo} prevLabel={r.prev} nextLabel={r.next} className="mt-10" />
    </Container>
  );
}
