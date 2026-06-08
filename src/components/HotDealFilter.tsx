"use client";
import { useMemo, useState } from "react";
import { useSite } from "@/lib/site-context";
import { Container } from "@/components/sections/_layout";
import type { HotDeal } from "@/lib/hot-deals";

/* ──────────────────────────────────────────────────────────
   HOT-DEAL FILTER — "โปรไฟไหม้" as a country-filtered price board.
   Each card shows the full price struck through → the fire price + % saved.
   Lives on a navy section (cards are white). Client-side country filter.
   ────────────────────────────────────────────────────────── */

const baht = (n: number) => n.toLocaleString("en-US");

export function HotDealFilter({ deals }: { deals: HotDeal[] }) {
  const { t } = useSite();
  const p = t.overseasPackages;
  const f = p.dealsFilter;
  const d = t.contact.direct;
  const lineHref = `https://line.me/R/ti/p/${d.line}`;

  // Country groups sorted by how many deals each has.
  const groups = useMemo(() => {
    const m = new Map<string, { country: string; flag: string; count: number }>();
    for (const x of deals) {
      const g = m.get(x.country) ?? { country: x.country, flag: x.flag, count: 0 };
      g.count += 1;
      m.set(x.country, g);
    }
    return [...m.values()].sort((a, b) => b.count - a.count);
  }, [deals]);

  const [active, setActive] = useState("");
  const shown = active ? deals.filter((x) => x.country === active) : deals;

  if (!deals.length) {
    return (
      <Container>
        <p className="text-center text-white/70 font-light">{f.empty}</p>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <div className="reveal text-center max-w-[60ch] mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-1.5 text-[11px] font-semibold tracking-wide-cap uppercase text-white shadow-[0_10px_26px_-10px_rgba(200,16,46,.8)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 23a6.6 6.6 0 0 0 6.6-6.6c0-2.1-1-4-2.6-5.5-.4 1.3-1.4 2.1-2.6 2.1 1.1-2.1 0-4.7-2.1-6.3-.3 2.1-1.8 3.2-3.1 4.8-1 1.3-2.1 2.8-2.1 5A6.6 6.6 0 0 0 12 23Z" />
          </svg>
          {p.dealsTitle}
        </span>
        <h3 className="h-display mt-5 text-white" style={{ fontSize: "clamp(26px, 3.4vw, 44px)" }}>
          {p.dealsEyebrow}
        </h3>
        <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-5" />
        <p className="mt-5 text-[14px] md:text-[15px] text-white/70 font-light leading-[1.7]">{f.lead}</p>
      </div>

      {/* Country filter chips */}
      <div className="reveal mt-9 flex flex-wrap justify-center gap-2.5">
        <button
          type="button"
          onClick={() => setActive("")}
          aria-pressed={active === ""}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${
            active === "" ? "bg-white text-brand-ink" : "bg-white/8 text-white/80 ring-1 ring-white/15 hover:bg-white/15"
          }`}
        >
          {f.all}
          <span className={`text-[11px] ${active === "" ? "text-brand-mute" : "text-white/55"}`}>{deals.length}</span>
        </button>
        {groups.map((g) => (
          <button
            key={g.country}
            type="button"
            onClick={() => setActive(g.country)}
            aria-pressed={active === g.country}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${
              active === g.country ? "bg-white text-brand-ink" : "bg-white/8 text-white/80 ring-1 ring-white/15 hover:bg-white/15"
            }`}
          >
            <span aria-hidden>{g.flag}</span>
            {g.country}
            <span className={`text-[11px] ${active === g.country ? "text-brand-mute" : "text-white/55"}`}>{g.count}</span>
          </button>
        ))}
      </div>

      {/* Deal cards */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((x, i) => (
          <article
            key={`${x.id}-${x.dateText}-${i}`}
            className="card-lift group flex flex-col overflow-hidden rounded-2xl bg-white text-brand-ink shadow-[0_24px_60px_-30px_rgba(0,0,0,.6)]"
          >
            {/* Banner + discount ribbon */}
            <a href={`/outboundtrip/tour/${x.id}`} target="_blank" rel="noopener noreferrer" className="relative block aspect-square overflow-hidden bg-brand-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={x.img}
                alt={x.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
              {x.discountPercent > 0 && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-brand-red px-2.5 py-1 text-[12px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,.6)]">
                  {f.save} {x.discountPercent}%
                </span>
              )}
            </a>

            {/* Body */}
            <div className="flex flex-1 flex-col p-4 md:p-5">
              <div className="flex items-center gap-2 text-[11px] text-brand-mute">
                <span aria-hidden>{x.flag}</span>
                <span className="font-semibold text-brand-blue">{x.country}</span>
                {x.code && <span className="ml-auto rounded bg-brand-paper px-2 py-0.5 font-medium tracking-wide">{x.code}</span>}
              </div>

              <a
                href={x.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-[14px] md:text-[15px] font-semibold leading-snug text-brand-ink line-clamp-2 transition-colors hover:text-brand-red"
              >
                {x.title}
              </a>

              {x.dateText && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] text-brand-mute">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  {x.dateText}
                </div>
              )}

              {/* Price block */}
              <div className="mt-auto pt-4">
                {x.originalPrice > x.firePrice && (
                  <div className="text-[12px] text-brand-mute">
                    {f.was} <span className="line-through">฿{baht(x.originalPrice)}</span>
                  </div>
                )}
                <div className="flex items-end gap-1.5">
                  <span className="text-[10px] font-semibold text-brand-red mb-1">🔥</span>
                  <span className="h-display text-brand-red leading-none" style={{ fontSize: "clamp(24px, 3.4vw, 30px)" }}>
                    ฿{baht(x.firePrice)}
                  </span>
                  <span className="text-[11px] text-brand-mute mb-1">{f.perPerson}</span>
                </div>

                {/* CTAs */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a href={`/outboundtrip/tour/${x.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-blue justify-center !py-2.5 !text-[12px]">
                    {f.detail}
                  </a>
                  <a
                    href={lineHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn justify-center gap-1.5 !py-2.5 !text-[12px] text-white"
                    style={{ backgroundColor: "#06C755" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 3C6.48 3 2 6.62 2 11.07c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.26-.2 1.02.9.56 1.1-.46 5.92-3.49 8.08-5.97 1.49-1.64 2.2-3.3 2.2-4.99C22 6.62 17.52 3 12 3Z" /></svg>
                    {f.book}
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* View all */}
      <div className="reveal mt-10 text-center">
        <a
          href="https://tour.journeylife.co.th/hotdeal.php"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 border-b border-white/25 pb-1 text-[12px] tracking-wide-cap uppercase font-semibold text-white/75 transition-colors hover:border-white hover:text-white"
        >
          {p.dealsViewAll}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </Container>
  );
}
