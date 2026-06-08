"use client";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useSite } from "@/lib/site-context";
import { TourSearch } from "@/components/TourSearch";
import { Container } from "./_layout";

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

export function OverseasPackages() {
  const { t } = useSite();
  const p = t.overseasPackages;

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
            <a
              href={p.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-red mt-9"
            >
              {p.cta}
              <span className="arrow">→</span>
            </a>
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
              className="mascot-fly h-auto w-full drop-shadow-[0_24px_36px_rgba(0,0,0,.45)]"
            />
          </div>
        </div>

        {/* ── Search bar → forwards to tour.journeylife.co.th/search.php ── */}
        <div className="reveal mb-12 md:mb-16">
          <TourSearch />
        </div>

        {/* ── Country cards ── (sized to match the Pillars / "บริการของเรา" grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {p.items.map((it, i) => {
            const art = CARD_ART[it.key] ?? { flag: "🌍", grad: "from-brand-blue to-brand-blue-deep" };
            return (
              <a
                key={it.key}
                href={it.href}
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
            );
          })}
        </div>

        {/* Gallery heading */}
        <div className="reveal mt-20 md:mt-28 text-center">
          <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mb-6" />
          <h3 className="h-display text-[22px] sm:text-[26px] md:text-[32px] text-white">
            {p.galleryTitle}
          </h3>
        </div>
      </Container>

      {/* Full-bleed photo marquee — real moments from trips */}
      <div className="reveal logo-marquee overflow-hidden select-none mt-10 md:mt-12">
        <PhotoRow photos={GALLERY[0]} dur="72s" />
        <PhotoRow photos={GALLERY[1]} dur="86s" reverse />
      </div>
    </section>
  );
}
