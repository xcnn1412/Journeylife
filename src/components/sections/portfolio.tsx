"use client";
import Image from "next/image";
import Link from "next/link";
import { useSite } from "@/lib/site-context";
import { Container } from "./_layout";

/* ──────────────────────────────────────────────────────────
   PORTFOLIO — real work gallery ("ผลงานของเรา").
   ────────────────────────────────────────────────────────── */
export function Portfolio() {
  const { t } = useSite();
  const p = t.portfolio;

  return (
    <section id="portfolio" className="bg-white relative overflow-hidden">
      <Container className="py-20 md:py-28">
        {/* Header */}
        <div className="reveal text-center max-w-[64ch] mx-auto mb-12 md:mb-16">
          <span className="eyebrow">{p.eyebrow}</span>
          <h2 className="h-display mt-6 text-brand-ink" style={{ fontSize: "clamp(38px, 5.2vw, 72px)" }}>
            {p.title}
          </h2>
          <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-6" />
          <p className="mt-5 text-[16px] md:text-[18px] font-medium text-brand-blue">{p.sub}</p>
          <p className="mt-3 text-[14px] md:text-[15px] font-light leading-[1.7] text-brand-mute">{p.desc}</p>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {p.images.map((im, i) => (
            <div
              key={i}
              className="reveal card-lift group relative overflow-hidden rounded-xl aspect-[4/3] bg-brand-ink"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <Image src={im.src} alt={im.alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-brand-ink/75 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute left-4 bottom-3 text-[12px] tracking-[0.04em] font-medium text-white opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {im.alt}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="reveal mt-12 md:mt-16 flex justify-center">
          <Link href="/portfolio" className="btn btn-blue">
            {p.cta}
            <span className="arrow">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
