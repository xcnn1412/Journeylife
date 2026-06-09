"use client";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSite } from "@/lib/site-context";
import { localeHref } from "@/lib/locale";
import { TourSearch } from "@/components/TourSearch";
import { HotDealFilter } from "@/components/HotDealFilter";
import { RouteFinderButton } from "@/components/route-finder/RouteFinder";
import type { HotDeal } from "@/lib/hot-deals";
import { Container } from "./_layout";

/** Collapse repeated banners so the marquee never shows the same image twice. */
function dedupeByImg(deals: HotDeal[]): HotDeal[] {
  const seen = new Set<string>();
  return deals.filter((x) => (seen.has(x.img) ? false : (seen.add(x.img), true)));
}

/* Per-country visual mock — flag + themed gradient. Swap each `mock` div for a
   real <Image> later; the card markup stays the same. (Visuals are an FE concern,
   so they live here keyed by `key`, not in i18n.) */
const CARD_ART: Record<string, { flag: string; grad: string }> = {
  japan: { flag: "🇯🇵", grad: "from-[#f78fb3] to-[#c8102e]" },
  vietnam: { flag: "🇻🇳", grad: "from-[#2a9d8f] to-[#0d5c54]" },
  korea: { flag: "🇰🇷", grad: "from-[#4895ef] to-[#1d3557]" },
  china: { flag: "🇨🇳", grad: "from-[#d62828] to-[#7a1212]" },
  india: { flag: "🇮🇳", grad: "from-[#ff9f1c] to-[#c75000]" },
  turkey: { flag: "🇹🇷", grad: "from-[#7b2cbf] to-[#3a0ca3]" },
};

/* Trip photos in /public/outbound-gallery (resized from /public/source/ทัวร์ต่างประเทศ). */
const PHOTOS = Array.from({ length: 19 }, (_, i) => `${String(i + 1).padStart(2, "0")}.jpg`);
const HALF = Math.ceil(PHOTOS.length / 2);
const GALLERY = [PHOTOS.slice(0, HALF), PHOTOS.slice(HALF)];

/** One marquee row of photos. Content is rendered twice so a -50% scroll loops
    seamlessly; the second copy is aria-hidden and dropped under reduced-motion. */
function PhotoRow({ photos, reverse, dur }: { photos: string[]; reverse?: boolean; dur: string }) {
  return (
    <div className={`logo-row${reverse ? " rev" : ""}`} style={{ "--dur": dur } as CSSProperties}>
      {[0, 1].map((copy) =>
        photos.map((file) => (
          <div key={`${copy}-${file}`} className={copy === 1 ? "photo-cell logo-dup" : "photo-cell"}>
            <img
              src={`/outbound-gallery/${file}`}
              alt={copy === 0 ? "ภาพความประทับใจระหว่างการเดินทางกับ Journey Life" : ""}
              aria-hidden={copy === 1}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        )),
      )}
    </div>
  );
}

/** Hot-deal marquee row — each banner links to its booking page (new tab).
    The list is widened so a -50% scroll loops seamlessly even with few deals. */
function DealRow({ deals, reverse, dur }: { deals: HotDeal[]; reverse?: boolean; dur: string }) {
  const base = deals.length >= 10 ? deals : [...deals, ...deals];
  return (
    <div className={`logo-row${reverse ? " rev" : ""}`} style={{ "--dur": dur } as CSSProperties}>
      {[0, 1].map((copy) =>
        base.map((d, i) => (
          <a
            key={`${copy}-${i}-${d.id}`}
            href={d.href}
            target="_blank"
            rel="noopener noreferrer"
            className="deal-cell"
            aria-hidden={copy === 1}
            tabIndex={copy === 1 ? -1 : undefined}
          >
            <img
              src={d.img}
              alt={copy === 0 ? d.alt : ""}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </a>
        )),
      )}
    </div>
  );
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Live "final 3 days" countdown. Rolls on a global 3-day cycle so the urgency
    timer never dies. Computed client-side only (avoids hydration mismatch). */
function Countdown({ units }: { units: { d: string; h: string; m: string; s: string } }) {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    const CYCLE = 3 * 24 * 60 * 60 * 1000; // 3 days
    const tick = () => {
      const now = Date.now();
      setMs(Math.ceil((now + 1) / CYCLE) * CYCLE - now);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const t = ms ?? 0;
  const cells: [number, string][] = [
    [Math.floor(t / 86400000), units.d],
    [Math.floor(t / 3600000) % 24, units.h],
    [Math.floor(t / 60000) % 60, units.m],
    [Math.floor(t / 1000) % 60, units.s],
  ];

  return (
    <div className="flex items-start justify-center gap-2 sm:gap-3" suppressHydrationWarning>
      {cells.map(([val, label], i) => (
        <div key={label} className="flex items-start">
          <div className="flex flex-col items-center">
            {/* flip-clock tile — dark maroon to sit on the red console */}
            <span className="relative grid place-items-center w-[50px] h-[58px] sm:w-[56px] sm:h-[66px] overflow-hidden rounded-lg bg-linear-to-b from-[#54101c] to-[#240509] ring-1 ring-white/15 shadow-[0_14px_28px_-16px_rgba(0,0,0,.85),inset_0_1px_0_rgba(255,255,255,.14)]">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-white/[0.05]" />
              {/* split-flap seam */}
              <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-black/55" />
              <span aria-hidden className="absolute inset-x-0 top-1/2 mt-px h-px bg-white/[0.07]" />
              <span className="relative h-display text-[25px] sm:text-[30px] leading-none text-white tabular-nums">{pad2(val)}</span>
            </span>
            <span className="mt-2 text-[9px] sm:text-[9.5px] tracking-wide-cap uppercase text-white/70">
              {label}
            </span>
          </div>
          {i < cells.length - 1 && (
            <span aria-hidden className="h-display text-[26px] sm:text-[34px] leading-none text-white/40 px-0.5 sm:px-1 pt-4 sm:pt-5">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function OverseasPackages({
  hotDeals = [],
  dealsVariant = "marquee",
  galleryAtBottom = false,
}: {
  hotDeals?: HotDeal[];
  dealsVariant?: "marquee" | "filter";
  galleryAtBottom?: boolean;
}) {
  const { t, lang } = useSite();
  const p = t.overseasPackages;
  const d = t.contact.direct;
  const tel = `tel:${d.phone.replace(/[^\d+]/g, "")}`;
  const lineHref = `https://line.me/R/ti/p/${d.line}`;
  const marqueeDeals = dedupeByImg(hotDeals);

  return (
    <section
      id="overseas-packages"
      className="relative overflow-hidden py-20 sm:py-28 md:py-36 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep text-white"
    >
      {/* Decorative dashed flight path */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-16 -z-0 w-full opacity-[0.18]"
        viewBox="0 0 1400 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-40 240 C 320 60, 620 60, 760 150 S 1180 260, 1460 70"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="2 12"
          strokeLinecap="round"
        />
      </svg>

      <Container className="relative">
        {/* ── Header ── */}
        <div className="reveal grid lg:grid-cols-[1.5fr_auto] items-center gap-10 lg:gap-14 mb-14 md:mb-20">
          <div className="text-center lg:text-left max-w-[58ch] mx-auto lg:mx-0">
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.55)" }}>
              {p.eyebrow}
            </span>
            <h2 className="h-display mt-6 text-white" style={{ fontSize: "clamp(30px, 5vw, 68px)" }}>
              {p.title}
            </h2>
            <span aria-hidden className="block w-12 h-px bg-brand-red mt-6 mx-auto lg:mx-0" />
            <p className="text-[17px] md:text-[20px] text-white/85 mt-6 font-light">{p.sub}</p>
            <p className="text-[15px] md:text-[16px] text-white/60 mt-3 leading-[1.7] font-light max-w-[52ch] mx-auto lg:mx-0">
              {p.lede}
            </p>
            <RouteFinderButton className="mt-9" />
          </div>

          {/* Mascot — น้องเจอร์นี่ขับเครื่องบิน */}
          <div className="relative mx-auto w-[230px] sm:w-[280px] md:w-[340px] shrink-0">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 translate-y-4 scale-90 rounded-full bg-brand-red/25 blur-3xl"
            />
            <Image
              src="/mascot/journey-plane.png"
              alt={p.mascotAlt}
              width={340}
              height={255}
              priority={false}
              style={{ height: "auto" }}
              className="mascot-fly w-full drop-shadow-[0_24px_36px_rgba(0,0,0,.45)]"
            />
          </div>
        </div>

        {/* ── Search bar → forwards to tour.journeylife.co.th/search.php ── */}
        <div className="reveal mb-12 md:mb-16">
          <TourSearch />
        </div>

        {/* ── Fast track — tap a country to jump straight into on-site search ── */}
        <div className="reveal mb-6 flex items-center gap-3">
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-brand-red to-[#a90c24] text-white shadow-[0_10px_24px_-10px_rgba(200,16,46,.7)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></svg>
          </span>
          <div>
            <span className="eyebrow block" style={{ color: "rgba(255,255,255,.6)" }}>{p.fastTrackEyebrow}</span>
            <h3 className="text-white font-semibold leading-tight text-[17px] md:text-[19px]">{p.fastTrackTitle}</h3>
          </div>
        </div>

        {/* ── Country cards ── (sized to match the Pillars / "บริการของเรา" grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {p.items.map((it, i) => {
            const art = CARD_ART[it.key] ?? { flag: "🌍", grad: "from-brand-blue to-brand-blue-deep" };
            return (
              <Link
                key={it.key}
                href={localeHref(`/outboundtrip/search?keyword=${encodeURIComponent(it.country)}&sort=new`, lang)}
                aria-label={`${it.country} — ${p.cardCta}`}
                className="reveal card-lift group relative flex flex-col overflow-hidden rounded-xl bg-white text-brand-ink border border-brand-line"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {/* Mock image — replace this block with a real <Image> later */}
                <div className={`relative aspect-[16/10] overflow-hidden bg-linear-to-br ${art.grad}`}>
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center text-[36px] drop-shadow-[0_6px_12px_rgba(0,0,0,.3)] transition-transform duration-700 ease-out group-hover:scale-110"
                  >
                    {art.flag}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-brand-ink/0 group-hover:bg-brand-ink/10 transition-colors duration-500"
                  />
                </div>

                {/* Caption */}
                <div className="flex flex-1 flex-col p-3.5 md:p-4">
                  <h3 className="text-brand-blue font-semibold text-[15px] md:text-[16px] leading-[1.2] tracking-[-0.01em] group-hover:text-brand-red transition-colors duration-500">
                    {it.country}
                  </h3>
                  <p className="mt-1.5 text-[11.5px] md:text-[12px] text-brand-mute font-light leading-[1.5] line-clamp-2 flex-1">
                    {it.tagline}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[9.5px] tracking-wide-cap uppercase font-semibold text-brand-blue transition-colors group-hover:text-brand-red">
                    {p.cardCta}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>

      {/* Gallery + deals — order swaps when galleryAtBottom is set (e.g. /outboundtrip) */}
      <div className="flex flex-col">
      {/* Trip gallery — real moments */}
      <div className={`mt-20 md:mt-28 ${galleryAtBottom ? "order-2" : "order-1"}`}>
        <Container>
          <div className="reveal text-center">
            <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mb-6" />
            <h3 className="h-display text-[22px] sm:text-[26px] md:text-[32px] text-white">
              {p.galleryTitle}
            </h3>
          </div>
        </Container>
        <div className="reveal logo-marquee overflow-hidden select-none mt-10 md:mt-12">
          <PhotoRow photos={GALLERY[0]} dur="72s" />
          <PhotoRow photos={GALLERY[1]} dur="86s" reverse />
        </div>
      </div>

      {/* Hot deals — "โปรไฟไหม้": live promos from tour.journeylife.co.th.
          filter = country-grouped price board (/outboundtrip); marquee = homepage console. */}
      <div className={galleryAtBottom ? "order-1" : "order-2"}>
      {dealsVariant === "filter" ? (
        hotDeals.length > 0 ? (
          <div className="relative mt-16 md:mt-24">
            <HotDealFilter deals={hotDeals} />
          </div>
        ) : null
      ) : marqueeDeals.length > 0 ? (
        <div className="relative mt-16 md:mt-24">
          <Container className="relative">
            {/* Compact promo console — 30 (CTA) : 70 (slideshow) */}
            <div className="reveal relative grid lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] items-stretch overflow-hidden rounded-3xl border border-white/10 bg-brand-blue-deep/30 shadow-[0_40px_90px_-45px_rgba(0,0,0,.8)]">
              {/* ── Left 30% — console ── */}
              <div className="relative overflow-hidden bg-linear-to-br from-brand-red via-[#a90c24] to-brand-red-deep px-6 py-8 sm:px-8">
                {/* depth — top sheen + soft glows */}
                <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/25" />
                <span aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-[#7e0a1d]/60 blur-3xl" />
                <span aria-hidden className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                {/* Mascot greeter — น้องเจอร์นี่ สวัสดีฮะ (red suitcase ties into the red console) */}
                <Image
                  src="/mascot/journey-hello.png"
                  alt={lang === "th" ? "น้องเจอร์นี่สวัสดี" : lang === "zh" ? "Journey 吉祥物挥手问好" : "Journey mascot waving hello"}
                  width={240}
                  height={240}
                  style={{ height: "auto" }}
                  className="mascot-fly pointer-events-none absolute -top-1 right-1 z-[5] hidden w-[82px] drop-shadow-[0_12px_20px_rgba(0,0,0,.5)] sm:block lg:w-[104px]"
                />

                <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                  {/* Flame medallion — white on red */}
                  <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-white text-brand-red ring-1 ring-white/50 shadow-[0_12px_26px_-8px_rgba(0,0,0,.5)]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 23a6.6 6.6 0 0 0 6.6-6.6c0-2.1-1-4-2.6-5.5-.4 1.3-1.4 2.1-2.6 2.1 1.1-2.1 0-4.7-2.1-6.3-.3 2.1-1.8 3.2-3.1 4.8-1 1.3-2.1 2.8-2.1 5A6.6 6.6 0 0 0 12 23Z" />
                    </svg>
                  </span>

                  <span className="eyebrow block mt-4" style={{ color: "rgba(255,255,255,.75)" }}>{p.dealsEyebrow}</span>
                  <h2 className="h-display mt-2 text-white" style={{ fontSize: "clamp(26px, 2.8vw, 40px)" }}>
                    {p.dealsTitle}
                  </h2>
                  <p className="text-[13px] text-white/75 mt-2 font-light">{p.dealsSub}</p>

                  {/* Urgency */}
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 ring-1 ring-white/35 px-3.5 py-1.5">
                    <span className="relative flex h-2 w-2">
                      <span aria-hidden className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                    <span className="text-[11px] font-semibold tracking-wide-cap uppercase text-white">{p.dealsUrgent}</span>
                  </div>

                  {/* Flip-clock countdown */}
                  <div className="mt-4">
                    <Countdown units={p.dealsUnits} />
                  </div>

                  {/* Booking CTAs — stacked, full width */}
                  <div className="mt-6 flex w-full flex-col sm:flex-row lg:flex-col gap-2.5">
                    <a
                      href={lineHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn flex-1 justify-center gap-2 text-white hover:-translate-y-px"
                      style={{ backgroundColor: "#06C755" }}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12 3C6.48 3 2 6.62 2 11.07c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.26-.2 1.02.9.56 1.1-.46 5.92-3.49 8.08-5.97 1.49-1.64 2.2-3.3 2.2-4.99C22 6.62 17.52 3 12 3Z" />
                      </svg>
                      {p.dealsCtaLine}
                    </a>
                    <a href={tel} className="btn flex-1 justify-center gap-2 bg-white text-brand-red hover:-translate-y-px">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                      </svg>
                      {p.dealsCtaCall}
                    </a>
                  </div>
                </div>
              </div>

              {/* ── Right 70% — slideshow ── */}
              <div className="relative flex items-center border-t border-white/10 py-5 lg:border-t-0 lg:border-l">
                <div className="logo-marquee w-full overflow-hidden select-none">
                  <DealRow deals={marqueeDeals} dur="58s" />
                </div>
              </div>
            </div>
          </Container>

          {/* View all */}
          <div className="reveal mt-7 text-center">
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
        </div>
      ) : null}
      </div>
      </div>
    </section>
  );
}
