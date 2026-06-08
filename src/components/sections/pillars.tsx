"use client";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSite } from "@/lib/site-context";
import { Container } from "./_layout";

/* Team photos in /public/team-gallery (resized from /public/source/ทีมงาน). */
const TEAM_PHOTOS = Array.from({ length: 22 }, (_, i) => `${String(i + 1).padStart(2, "0")}.jpg`);
const THALF = Math.ceil(TEAM_PHOTOS.length / 2);
const TEAM = [TEAM_PHOTOS.slice(0, THALF), TEAM_PHOTOS.slice(THALF)];

/** One marquee row of team photos. Rendered twice so a -50% scroll loops
    seamlessly; the second copy is aria-hidden and dropped under reduced-motion. */
function PhotoRow({ photos, reverse, dur }: { photos: string[]; reverse?: boolean; dur: string }) {
  return (
    <div className={`logo-row${reverse ? " rev" : ""}`} style={{ "--dur": dur } as CSSProperties}>
      {[0, 1].map((copy) =>
        photos.map((file) => (
          <div key={`${copy}-${file}`} className={copy === 1 ? "photo-cell logo-dup" : "photo-cell"}>
            <img
              src={`/team-gallery/${file}`}
              alt={copy === 0 ? "ทีมงานมืออาชีพของ Journey Life" : ""}
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

/* ──────────────────────────────────────────────────────────
   PILLARS — "บริการของเรา": 8 service lines as photo cards.
   Light band (paper) for contrast with the navy TrustBar above;
   navy gradient over each photo carries the 60% brand tone,
   red top-accent on hover = the 10%.
   ────────────────────────────────────────────────────────── */
export function Pillars() {
  const { t, lang } = useSite();
  const p = t.pillars;

  return (
    <section id="our-services" className="bg-brand-blue-soft relative overflow-hidden">
      {/* Red signature accent — top-left */}
      <div aria-hidden className="absolute top-0 left-0 w-1 h-24 bg-linear-to-b from-brand-red to-transparent" />

      <Container className="py-14 sm:py-20 md:py-28 relative">
        {/* Header — น้องเจอร์นี่ (heart) + intro */}
        <div className="reveal grid md:grid-cols-[auto_1fr] items-center gap-10 md:gap-16 mb-14 md:mb-20">
          {/* Mascot */}
          <div className="relative mx-auto md:mx-0 w-[160px] md:w-[210px] shrink-0">
            <div aria-hidden className="absolute inset-0 -z-10 scale-95 rounded-full bg-brand-blue/10 blur-2xl" />
            <Image
              src="/mascot/journey-love.png"
              alt={lang === "th" ? "น้องเจอร์นี่" : "Journey mascot"}
              width={210}
              height={210}
              className="float-soft h-auto w-full drop-shadow-[0_18px_28px_rgba(13,43,94,.35)]"
            />
            {/* Floating heart accent */}
            <span aria-hidden className="heart-beat absolute top-3 right-2 text-brand-red drop-shadow-[0_4px_8px_rgba(200,16,46,.4)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7-4.6-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.4 12 21 12 21Z" />
              </svg>
            </span>
          </div>

          {/* Intro text */}
          <div className="text-center md:text-left">
            <span className="eyebrow">{p.eyebrow}</span>
            <h2 className="h-display mt-6 text-brand-ink" style={{ fontSize: "clamp(30px, 5vw, 68px)" }}>
              {p.title}
            </h2>
            <span aria-hidden className="block w-12 h-px bg-brand-red mt-6 mx-auto md:mx-0" />
            <p className="text-[16px] md:text-[18px] text-brand-mute mt-6 leading-[1.7] font-light max-w-[52ch] mx-auto md:mx-0">
              {p.sub}
            </p>
          </div>
        </div>

        {/* Service photo cards — landscape image on top, caption below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {p.items.map((it, i) => (
            <Link
              key={i}
              href={`/services/${it.slug}`}
              aria-label={`${it.title} — ${p.cta}`}
              className="reveal card-lift group relative flex flex-col overflow-hidden rounded-xl bg-white border border-brand-line"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Landscape image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={it.img}
                  alt={it.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                {/* Soft navy lift at the base of the photo */}
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-brand-ink/35 to-transparent" />
                {/* Navy accent — slides across the seam on hover */}
                <div aria-hidden className="absolute bottom-0 left-0 h-1 w-0 bg-brand-blue transition-[width] duration-500 group-hover:w-full" />
              </div>

              {/* Caption */}
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <h3 className="text-brand-blue font-semibold text-[22px] md:text-[26px] leading-[1.15] tracking-[-0.01em]">
                  {it.title}
                </h3>
                <p className="mt-2.5 text-[12.5px] md:text-[13px] text-brand-mute font-light leading-[1.6] line-clamp-2 flex-1">
                  {it.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] tracking-wide-cap uppercase font-semibold text-brand-blue transition-colors group-hover:text-brand-blue-deep">
                  {p.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View-all CTA */}
        <div className="reveal mt-12 md:mt-16 flex justify-center">
          <Link href="/services" className="btn btn-blue">
            {p.viewAll}
            <span className="arrow">→</span>
          </Link>
        </div>
      </Container>

      {/* Team gallery band — full-bleed photo marquee */}
      <div className="pb-16 md:pb-24">
        <Container>
          <div className="reveal text-center">
            <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mb-6" />
            <h3 className="h-display text-[22px] sm:text-[26px] md:text-[32px] text-brand-ink">
              {p.galleryTitle}
            </h3>
          </div>
        </Container>
        <div className="reveal logo-marquee overflow-hidden select-none mt-10 md:mt-12">
          <PhotoRow photos={TEAM[0]} dur="74s" />
          <PhotoRow photos={TEAM[1]} dur="88s" reverse />
        </div>
      </div>
    </section>
  );
}
